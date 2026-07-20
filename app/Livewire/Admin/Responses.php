<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use App\Models\Form;
use App\Models\Answers;
use Illuminate\Support\Facades\DB;
use App\Models\Responses as Response;
use App\Models\Responden as Responden;

use App\Exports\FormResponseSingleExport;
use Maatwebsite\Excel\Facades\Excel;

use Livewire\WithPagination;

class Responses extends Component
{
    use WithPagination;

    public $forms;
    public $responseData;
    public $selectedPlacement = 'interaktif';
    public $selectedForm = null;
    public $searchByEmail='';

    // State untuk Modal Hapus Satuan
    public $isDeleteModalOpen = false;
    public $deleteConfirmText = ''; // Input text user untuk konfirmasi
    public $targetRespondenId;
    public $targetAttempt;
    public $targetFormId;

    public $currentFormId;

    public function mount()
    {
        $this->forms = Form::select('id', 'form_name', 'placement')->get();
    }

    public function export($formId)
    {   
        // 1. Ambil Pertanyaan (Sama dengan loadData)
        $questions = DB::table('questions')
            ->join('sections', 'sections.id', '=', 'questions.section_id')
            ->where('sections.form_id', $formId)
            ->select('questions.id', 'questions.question')
            ->orderBy('sections.order')
            ->orderBy('questions.order')
            ->get();

        if ($questions->isEmpty()) return;

        // 2. Ambil Header Users (Gunakan get() tapi dengan Logic Sorting yang sama)
        $allUsers = Response::query()
            ->with('responden') 
            ->select('form_id', 'responden_id', 'uuid', 'attempt')
            ->selectRaw('MAX(created_at) as created_at')
            ->where('form_id', $formId)
            
            ->addSelect(['first_sub' => Response::selectRaw('MIN(created_at)')
                ->from('responses as r2')
                ->whereColumn('r2.form_id', 'responses.form_id')
                ->where(function ($query) {
                    $query->whereRaw('
                        (r2.responden_id IS NOT NULL AND r2.responden_id = responses.responden_id) 
                        OR 
                        (r2.responden_id IS NULL AND r2.uuid = responses.uuid)
                    ');
                })
            ])
            
            ->groupBy('form_id', 'responden_id', 'uuid', 'attempt')
            ->orderBy('first_sub', 'asc') 
            ->orderBy('responden_id', 'asc')
            ->orderBy('uuid', 'asc')
            ->orderBy('attempt', 'asc')
            ->get(); // Pakai get() untuk ambil semua data tanpa potongan halaman

        // 2.1 UserKeys (Langsung gunakan $allUsers karena ini sudah collection)
        $userKeys = $allUsers; 

        // 3. Ambil Jawaban (Matrix Content)
        $responses = collect();
        if ($userKeys->isNotEmpty()) {
            $responses = Response::query()
                ->where('responses.form_id', $formId)
                ->where(function($q) use ($userKeys) {
                    foreach ($userKeys as $key) {
                        $q->orWhere(function($sq) use ($key) {
                            if ($key->responden_id) {
                                $sq->where('responden_id', $key->responden_id);
                            } else {
                                $sq->where('uuid', $key->uuid);
                            }
                            $sq->where('attempt', $key->attempt);
                        });
                    }
                })
                ->leftJoin('answers', 'answers.id', '=', 'responses.answer_id')
                ->select(['responses.*', 'answers.answer', 'answers.question_id'])
                ->get();
        }

        // Helper Key (Harus sama dengan loadData)
        $generateKey = function($item) {
            $prefix = $item->responden_id ? 'uid:'.$item->responden_id : 'uuid:'.$item->uuid;
            return $prefix . '-att:' . $item->attempt;
        };

        // 4. Olah Columns
        $columns = $userKeys->map(function ($r) use ($generateKey) {
            return [
                'responden_id' => $r->responden_id,
                'uuid'         => $r->uuid,
                'attempt'      => $r->attempt,
                'email'        => $r->responden->email ?? null, 
                'created_at'   => $r->created_at,
                'key'          => $generateKey($r),
            ];
        });

        // 5. Olah Matrix
        $cellMatrix = $responses->groupBy('question_id')->map(function ($items) use ($generateKey) {
            return $items->groupBy(function ($item) use ($generateKey) {
                return $generateKey($item);
            });
        });

        // Ambil nama form untuk nama file
        $formName = Form::find($formId)->form_name ?? 'Form';
        $fileName = "Rekap_Response_" . \Str::slug($formName) . ".xlsx";

        return Excel::download(
            new FormResponseSingleExport($formName, $questions, $allUsers, $columns, $cellMatrix),
            $fileName
        );
    }

    // 1. Fungsi yang dipanggil saat tombol 'X' diklik
    public function confirmDeleteSingle($formId, $respondenId, $attempt)
    {
        $this->reset(['deleteConfirmText']); // Reset input text
        
        $this->targetFormId = $formId;
        $this->targetRespondenId = $respondenId;
        $this->targetAttempt = $attempt;
        
        $this->isDeleteModalOpen = true; // Buka Modal
    }

    /* 2. Fungsi Eksekusi Hapus (Dipanggil dari form di dalam Modal)
    public function destroySingleResponse()
    {
        // Validasi input konfirmasi
        if (strtolower($this->deleteConfirmText) === 'hapus response') {
            try {
                DB::transaction(function () {
                    // 1. Cek apakah yang dikirim adalah UUID (mengandung huruf/bukan murni angka)
                    // Kita bisa gunakan is_numeric() untuk membedakan ID integer dan UUID string
                    $isUuid = !is_numeric($this->targetRespondenId) && !is_null($this->targetRespondenId);

                    if ($isUuid) {
                        // --- ALUR A: HAPUS BERDASARKAN UUID ---
                        Response::where('form_id', $this->targetFormId)
                            ->where('uuid', $this->targetRespondenId) // Gunakan kolom uuid
                            ->where('attempt', $this->targetAttempt)->delete();

                        // Tidak perlu cek Orphan Responden karena dia tidak punya baris di tabel respondens
                    } else {
                        // --- ALUR B: HAPUS BERDASARKAN RESPONDEN_ID (INTEGERS) ---
                        // A. Hapus Response sesuai kriteria (Form + Responden + Attempt)
                        Response::where('form_id', $this->targetFormId)
                            ->where('responden_id', $this->targetRespondenId)
                            ->where('attempt', $this->targetAttempt)->delete()

                        // B. Cek Orphan Responden (Hapus responden jika sudah tidak punya response sama sekali)
                        // Kita gunakan logika yang sudah kita bahas sebelumnya
                        $respondenHasOtherData = Response::where('responden_id', $this->targetRespondenId)->exists();
                        
                        if (!$respondenHasOtherData) {
                            Responden::find($this->targetRespondenId)->delete();
                        }
                    }
                });

                session()->flash('success', 'Response berhasil dihapus.');
                $this->isDeleteModalOpen = false;
                return $this->redirect(route('admin.responses'));

            } catch (\Exception $e) {
                session()->flash('error', 'Gagal menghapus: ' . $e->getMessage());
            }
        } else {
            $this->addError('deleteConfirmText', 'Konfirmasi salah. Ketik "hapus response".');
        }
    }*/

    public function destroySingleResponse()
    {
        // Validasi input konfirmasi
        if (strtolower($this->deleteConfirmText) === 'hapus response') {
            try {
                // 1. Cek tipe ID (UUID atau Integer)
                $isUuid = !is_numeric($this->targetRespondenId) && !is_null($this->targetRespondenId);

                // 2. Siapkan query pencarian data response
                $query = Response::where('form_id', $this->targetFormId)
                    ->where('attempt', $this->targetAttempt);

                if ($isUuid) {
                    $query->where('uuid', $this->targetRespondenId);
                } else {
                    $query->where('responden_id', $this->targetRespondenId);
                }

                // 3. Eksekusi pencarian data dengan ->first() agar menghasilkan model atau null
                $response = $query->get();

                // 4. Jika data response sudah tidak ada (telah dihapus orang lain)
               
                if ($response->isEmpty()) {
                    $this->isDeleteModalOpen = false;
                    session()->flash('error', 'Response tidak ditemukan.');
                    return $this->redirect(route('admin.responses')); // Langsung hentikan proses di sini
                }

                // 5. Jalankan transaksi jika data dipastikan masih ada
                DB::transaction(function () use ($response, $isUuid) {
                    // Langkah A: Hapus data response
    
                    foreach ($response as $singleResponse) {
                        $singleResponse->delete();
                    }

                    // Langkah B: Cek Orphan Responden (Hanya jika bukan UUID)
                    if (!$isUuid) {
                        $respondenHasOtherData = Response::where('responden_id', $this->targetRespondenId)->exists();
                        
                        if (!$respondenHasOtherData) {
                            // Gunakan query builder delete agar aman meskipun responden sudah tidak ada
                            Responden::where('id', $this->targetRespondenId)->delete();
                        }
                    }
                });

                // 6. Update UI Sukses
                session()->flash('success', 'Response berhasil dihapus.');
                $this->isDeleteModalOpen = false;
                return $this->redirect(route('admin.responses'));

            } catch (\Exception $e) {
                session()->flash('error', 'Gagal menghapus: ' . $e->getMessage());
            }
        } else {
            $this->addError('deleteConfirmText', 'Konfirmasi salah. Ketik "hapus response".');
        }
    }

    public function loadData()
    {
        $match = $this->forms->filter(function ($data) {
                    return $data->id == $this->selectedForm
                        && str_contains($data->placement, $this->selectedPlacement);
                })->first();

        if (!$match) {
            $this->selectedForm = null;
        }
        
        // Cek form selection
        if (!$this->selectedForm) {
            $this->selectedForm = Form::where('placement', 'like', "%".$this->selectedPlacement)->value('id');
        }

        if (!$this->selectedForm) return [
            'userAttempts' => null,
            'columns' => [],
            'cellMatrix' => [],
            'questions' => []
        ];

        // Info Form
        $formDetail = Form::find($this->selectedForm);
        $this->responseData = (object) [
            'form_id' => $formDetail->id,
            'form_name' => $formDetail->form_name,
            'placement' => $formDetail->placement
        ];

        // 1. Ambil Pertanyaan
        $questions = DB::table('questions')
            ->join('sections', 'sections.id', '=', 'questions.section_id')
            ->where('sections.form_id', $this->selectedForm)
            ->select('questions.id', 'questions.question')
            ->orderBy('sections.order')
            ->orderBy('questions.order')
            ->get();

        $paginatedUsers = Response::query()
            ->with('responden') 
            // TAMBAHKAN form_id di select
            ->select('form_id', 'responden_id', 'uuid', 'attempt')
            ->selectRaw('MAX(created_at) as created_at')
            ->where('form_id', $this->selectedForm)

            ->when($this->searchByEmail, function ($query) {
                $query->whereHas('responden', function ($q) {
                    $q->where('email', 'like', '%' . $this->searchByEmail . '%');
                });
            })

            ->addSelect(['first_sub' => Response::selectRaw('MIN(created_at)')
                ->from('responses as r2')
                ->whereColumn('r2.form_id', 'responses.form_id')
                ->where(function ($query) {
                    $query->whereRaw('
                        (r2.responden_id IS NOT NULL AND r2.responden_id = responses.responden_id) 
                        OR 
                        (r2.responden_id IS NULL AND r2.uuid = responses.uuid)
                    ');
                })
            ])
            
            // TAMBAHKAN form_id di groupBy
            ->groupBy('form_id', 'responden_id', 'uuid', 'attempt')

            // Urutan tetap sama agar Red (18 Jan) naik ke kiri
            ->orderBy('first_sub', 'asc') 
            ->orderBy('responden_id', 'asc')
            ->orderBy('uuid', 'asc')
            ->orderBy('attempt', 'asc')

            ->paginate(6);

        // 2.1 Ambil Items dari Paginator
        $userKeys = collect($paginatedUsers->items());

        // 3. Ambil Jawaban (Matrix Content)
        $responses = collect();
        if ($userKeys->isNotEmpty()) {
            $responses = Response::query()
                ->where('responses.form_id', $this->selectedForm)
                // Filter hanya ambil jawaban milik user yang ada di page ini
                ->where(function($q) use ($userKeys) {
                    foreach ($userKeys as $key) {
                        $q->orWhere(function($sq) use ($key) {
                            if ($key->responden_id) {
                                $sq->where('responden_id', $key->responden_id);
                            } else {
                                $sq->where('uuid', $key->uuid);
                            }
                            $sq->where('attempt', $key->attempt);
                        });
                    }
                })
                ->leftJoin('answers', 'answers.id', '=', 'responses.answer_id')
                ->select(['responses.*', 'answers.answer', 'answers.question_id'])
                ->get();
        }

        // --- BAGIAN PENTING: PENYERAGAMAN KEY ---
        // Gunakan fungsi helper closure agar key di Columns dan Matrix PASTI SAMA
        $generateKey = function($item) {
            $prefix = $item->responden_id ? 'uid:'.$item->responden_id : 'uuid:'.$item->uuid;
            return $prefix . '-att:' . $item->attempt;
        };

        // 4. Olah Columns (Header Table)
        $columns = $userKeys->map(function ($r) use ($generateKey) {
            return [
                'responden_id' => $r->responden_id,
                'uuid'         => $r->uuid,
                'attempt'      => $r->attempt,
                // Ambil email dari eager load (lebih efisien) atau null
                'email'        => $r->responden->email ?? null, 
                'created_at'   => $r->created_at,
                'key'          => $generateKey($r), // Panggil helper key
            ];
        });

        // 5. Olah Matrix (Isi Table)
        $cellMatrix = $responses->groupBy('question_id')->map(function ($items) use ($generateKey) {
            return $items->groupBy(function ($item) use ($generateKey) {
                return $generateKey($item); // Panggil helper key yang SAMA
            });
        });
        
        return [
            'userAttempts' => $paginatedUsers, // Object paginator (untuk link halaman)
            'columns'      => $columns,        // Array data header (untuk loop th)
            'cellMatrix'   => $cellMatrix,     // Array data jawaban (untuk loop td)
            'questions'    => $questions
        ];
    }

    public function render()
    {
        // Ambil semua data dari loadData()
        $data = $this->loadData();

        // Kirim semuanya ke view
        return view('livewire.admin.responses', $data);
    }
}

