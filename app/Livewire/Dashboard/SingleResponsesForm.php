<?php

namespace App\Livewire\Dashboard;

use Livewire\Component;
use App\Models\Form;
use App\Models\Answers;
use Illuminate\Support\Facades\DB;
use App\Models\Responses as Response;
use App\Models\Responden as Responden;

use App\Exports\FormResponseSingleExport;
use Maatwebsite\Excel\Facades\Excel;

use Livewire\WithPagination;

class SingleResponsesForm extends Component
{
    use WithPagination;

    public $forms;
    public $responseData;
    public $selectedPlacement = 'pre-test-interaktif';
    public $selectedForm = null;

    // State untuk Modal Hapus Satuan
    public $isDeleteModalOpen = false;
    public $deleteConfirmText = ''; // Input text user untuk konfirmasi
    public $targetRespondenId;
    public $targetAttempt;
    public $targetFormId;

    public $currentFormId;

    public function mount()
    {
        $this->forms = Form::select('id', 'form_name')->get();
    }

    public function export($formId)
    {   
        // Gunakan where('form_id') langsung lebih cepat daripada whereHas
        $data = Response::with([
            'responden',
            'answer.question.section.form'
        ])
        ->where('form_id', $formId)
        ->get();

        if ($data->isEmpty()) {
            return;
        }

        $formName = $data->first()->answer->question->section->form->form_name ?? 'Form';
        $fileName = "Rekap_Response_" . \Str::slug($formName) . ".xlsx";

        return Excel::download(
            new FormResponseSingleExport($data, $formName),
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

    // 2. Fungsi Eksekusi Hapus (Dipanggil dari form di dalam Modal)
    public function destroySingleResponse()
    {
        // Validasi input konfirmasi
        if (strtolower($this->deleteConfirmText) === 'hapus') {
            try {
                DB::transaction(function () {
                    // A. Hapus Response sesuai kriteria (Form + Responden + Attempt)
                    Response::where('form_id', $this->targetFormId)
                        ->where('responden_id', $this->targetRespondenId)
                        ->where('attempt', $this->targetAttempt)
                        ->delete();

                    // B. Cek Orphan Responden (Hapus responden jika sudah tidak punya response sama sekali)
                    // Kita gunakan logika yang sudah kita bahas sebelumnya
                    $respondenHasOtherData = Response::where('responden_id', $this->targetRespondenId)->exists();
                    
                    if (!$respondenHasOtherData) {
                        Responden::find($this->targetRespondenId)->delete();
                    }
                });

                session()->flash('success', 'Response berhasil dihapus.');
                $this->isDeleteModalOpen = false;
                return $this->redirect(route('admin.dashboard'), navigate: true);

            } catch (\Exception $e) {
                session()->flash('error', 'Gagal menghapus: ' . $e->getMessage());
            }
        } else {
            $this->addError('deleteConfirmText', 'Konfirmasi salah. Ketik "hapus".');
        }
    }

    public function loadData()
    {
        if (!$this->selectedForm) {
            $this->selectedForm = Form::where('placement', $this->selectedPlacement)->value('id');
        }

        if (!$this->selectedForm) return [
            'userAttempts' => null,
            'columns' => [],
            'cellMatrix' => [],
            'questions' => []
        ];

        // Ambil info form
        $formDetail = Form::find($this->selectedForm);
        $this->responseData = (object) [
            'form_id' => $formDetail->id,
            'form_name' => $formDetail->form_name
        ];

        // 1. Ambil pertanyaan
        $questions = DB::table('questions')
            ->join('sections', 'sections.id', '=', 'questions.section_id')
            ->where('sections.form_id', $this->selectedForm)
            ->select('questions.id', 'questions.question')
            ->get();

        // 2. Paginate User Attempts
        $userAttempts = Response::query()
            ->select('responses.responden_id', 'responses.uuid', 'responses.attempt', 'respondens.email', 'responses.created_at')
            ->leftJoin('respondens', 'respondens.id', '=', 'responses.responden_id')
            ->where('responses.form_id', $this->selectedForm)
            ->groupBy('responses.responden_id', 'responses.uuid', 'responses.attempt', 'respondens.email', 'responses.created_at')
            ->orderBy('responses.created_at', 'desc')
            ->paginate(5);

        // 3. Ambil jawaban (Ubah ke stdClass agar aman dari Eloquent Metadata)
        $userKeys = collect($userAttempts->items());
        $responses = collect();

        if ($userKeys->isNotEmpty()) {
            $responses = Response::query()
                ->where('responses.form_id', $this->selectedForm)
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
                ->select(['responses.*', 'answers.answer','answers.question_id'])
                ->get()
                // Trick: Ubah model menjadi object biasa agar getMorphClass tidak dipanggil
                ->map(fn($item) => (object) collect($item)->toArray());
        }

        // 4. Olah Matrix secara lokal
        $columns = $userKeys->map(function ($r) {
            $keyBase = $r->responden_id ? 'email:' . $r->responden_id : 'uuid:' . $r->uuid;
            return [
                'responden_id' => $r->responden_id,
                'uuid'         => $r->uuid,
                'attempt'      => $r->attempt,
                'email'        => $r->email,
                'created_at'   => $r->created_at,
                'key'          => $keyBase . '-attempt:' . $r->attempt,
            ];
        });

        $cellMatrix = $responses->groupBy('question_id')->map(function ($respPerQ) {
            return $respPerQ->groupBy(function ($r) {
                $keyBase = $r->responden_id ? 'email:' . $r->responden_id : 'uuid:' . $r->uuid;
                return $keyBase . '-attempt:' . $r->attempt;
            });
        });

        return [
            'userAttempts' => $userAttempts,
            'columns' => $columns,
            'cellMatrix' => $cellMatrix,
            'questions' => $questions
        ];
    }

    public function render()
    {
        // Ambil semua data dari loadData()
        $data = $this->loadData();

        $this->forms = Form::select('id', 'form_name')->get();

        // Kirim semuanya ke view
        return view('livewire.dashboard.single-responses-form', $data);
    }
}
