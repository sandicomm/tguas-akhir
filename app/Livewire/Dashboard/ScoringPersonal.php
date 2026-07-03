<?php

namespace App\Livewire\Dashboard;

use Livewire\Component;
use App\Models\Responses;
use App\Models\Form;
use Livewire\Attributes\Computed;
use App\Exports\ScoringPersonalExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ScoringAllInOneExport;

use Livewire\WithPagination;

class ScoringPersonal extends Component
{
    use WithPagination;
    public $formName;
    public $showAllScoring = false;
    public $scoreAnswer;

    public $selectedFormPlacement = null; 
    public $selectedForm = null; 

    public $searchByEmail = '';
    public $responsesStatus=true;
    
    public function mount()
    {

        $this->formName = Form::select('id', 'form_name', 'placement')->get();
        // Menghitung Max Score per Form langsung lewat SQL
        $this->scoreAnswer = \DB::table(function ($query) {
                // Subquery: Mencari nilai tertinggi per pertanyaan
                $query->from('answers')
                    ->select('question_id', \DB::raw('MAX(value) as max_value'))
                    ->groupBy('question_id');
            }, 'max_answers')
            // Join ke tabel questions (alias q) untuk mendapatkan section_id
            ->join('questions as q', 'max_answers.question_id', '=', 'q.id')
            // Join ke tabel sections (alias s) untuk mendapatkan form_id
            ->join('sections as s', 'q.section_id', '=', 's.id')
            ->select('s.form_id')
            ->selectRaw('SUM(max_answers.max_value) as max_score')
            ->groupBy('s.form_id')
            ->get()
            ->keyBy('form_id')
            ->toArray();
        
    }

    // Gunakan computed property agar data tidak disimpan di state (mencegah payload berat)
    #[Computed]
    public function groupedAllResponsesScoring()
    {

        $match = $this->formName->filter(function ($data) {

                    return $data->id == $this->selectedForm 
                        && str_contains($data->placement, $this->selectedFormPlacement);
                })->first();

        if (!$match) {
            $this->selectedForm = null;
        }

        // 1. Ambil data ringkasan skor dari Database (Sangat Ringan)
        $paginatedData = Responses::query()
            ->select([
                'responses.form_id',
                'responses.attempt',
                'forms.form_name',
                'forms.placement',
            ])
            ->selectRaw("COALESCE(respondens.email, CONCAT('uuid:', responses.uuid)) as user_key")
            ->selectRaw("SUM(CAST(answers.value AS UNSIGNED)) as total_score") // Pastikan casting benar jika value itu string
            ->leftJoin('answers', 'answers.id', '=', 'responses.answer_id')
            ->leftJoin('respondens', 'respondens.id', '=', 'responses.responden_id')
            ->leftJoin('forms', 'forms.id', '=', 'responses.form_id')
            //->whereIn('forms.id', $this->selectedForm)
            
            ->when($this->searchByEmail, function ($query) {
                $query->where('respondens.email', 'like', '%' . $this->searchByEmail . '%');
            })

            // Gunakan when() agar query hanya aktif jika variabel ada isinya
            ->when($this->selectedFormPlacement, function ($query) {
                $query->where('forms.placement', 'like', '%'.$this->selectedFormPlacement);
            })
            ->when($this->selectedForm, function ($query) {
                $query->where('forms.id', $this->selectedForm);
            })
            
            ->groupBy('user_key', 'responses.form_id', 'responses.attempt', 'forms.form_name', 'forms.placement')
            ->orderBy('user_key')
            ->paginate(10);

        if ($paginatedData->isEmpty()) {
            $this->selectedForm = null;
            $this->responsesStatus = false;
        }else{
            $this->responsesStatus = true;
        }

        // 2. Transformasi struktur data hanya untuk data yang di-paginate
        // Ini mengubah attempt yang terpisah menjadi satu grup di dalam form
        $transformedItems = collect($paginatedData->items())
            ->groupBy('user_key')
            ->map(function ($userForms) {
                return $userForms->groupBy('form_id')->map(function ($attempts) {
                    $first = $attempts->first();
                    return [
                        'form_id'   => $first->form_id,
                        'form_name' => $first->form_name,
                        'placement' => $first->placement,
                        'user_key'  => $first->user_key,
                        // Mengumpulkan semua attempt ke dalam array [attempt => score]
                        'attempts'  => $attempts->pluck('total_score', 'attempt')->toArray(),
                    ];
                });
            });

        // Kembalikan objek paginator agar link pagination muncul di blade
        return $paginatedData->setCollection($transformedItems);
    }

    public function search()
    {
        // Cukup panggil ini untuk mereset paginasi ke halaman 1 saat search diklik
        $this->resetPage();
    }

    public $showModal = false;
    public $selectedFormData = [];
    public $availableAttempts = [];

    public function openDetail($userKey, $formId)
    {
        // 1. Ambil data dengan filter yang diperbaiki
        $responses = \App\Models\Responses::query()
            ->where('form_id', $formId)
            ->where(function($q) use ($userKey) {
                if(str_starts_with($userKey, 'uuid:')) {
                    $q->where('uuid', str_replace('uuid:', '', $userKey));
                } else {
                    // Menggunakan whereHas agar Laravel menangani join secara otomatis
                    $q->whereHas('responden', function($query) use ($userKey) {
                        $query->where('email', $userKey);
                    });
                }
            })
            ->with(['answer.question', 'form']) // Eager loading
            ->get();

        $groupedDetail = [];
        $attemptsFound = [];
   
        // 2. Proses grouping data
        foreach ($responses as $resp) {
            $attemptsFound[] = $resp->attempt;
            
            // Berdasarkan gambar dd, 'answer' bukan collection tapi single object
            $ans = $resp->answer; 
       
            if ($ans && $ans->question) {
                $questionId = $ans->question->id; 
                
                // Simpan data jawaban berdasarkan teks pertanyaan dan nomor attempt
                $groupedDetail[$questionId][$resp->attempt] = [
                    'question' => $ans->question->question,
                    'answer' => $ans->answer,
                    'score' => $ans->value
                ];
            }
        }

        // 3. Simpan hasil ke property untuk View
        $this->availableAttempts = array_unique($attemptsFound);
        sort($this->availableAttempts);
        
        $this->selectedFormData = [
            'user' => $userKey,
            'form_name' => $responses->first()->form->form_name ?? 'Detail Form',
            'questions' => $groupedDetail
        ];

        $this->showModal = true;
    }

    public function exportAll()
    {
        if($this->responsesStatus === true){
            $data = Responses::query()
                ->with(['responden', 'answer.question.section.form'])
                // 1. Filter Responden (Hanya jalan jika searchByEmail TIDAK kosong)
                ->when(!empty($this->searchByEmail), function ($q) {
                    $q->whereHas('responden', fn ($subQ) => 
                        $subQ->where('email', 'like', '%' . $this->searchByEmail . '%')
                    );
                })
                ->whereHas('answer.question.section.form', function($q) {
                    // Menggunakan grouped where () untuk membungkus logika OR agar tidak merusak query utama
                    $q->where(function($query) {
                        
                        // Jalankan pencarian placement jika selectedFormPlacement tidak kosong
                        $query->when(!empty($this->selectedFormPlacement), function($subQuery) {
                            $subQuery->where('placement', 'like', '%'.$this->selectedFormPlacement.'%'); // Jangan lupa tambahkan '%' di akhir jika ingin pencarian 'like' yang fleksibel
                        });
    
                        // Jalankan pencarian ID jika selectedForm tidak kosong
                        $query->when(!empty($this->selectedForm), function($subQuery) {
                            // Gunakan orWhere jika pencarian pertama juga jalan, 
                            // atau otomatis disesuaikan oleh Laravel jika ini satu-satunya yang jalan
                            $subQuery->where('id', $this->selectedForm);
                        });
    
                    });
                }) 
                ->get();
            
            if ($data->isEmpty()) return;
    
            // Grouping tetap dilakukan agar urutan per user rapi
    
            $groupedData = $data->groupBy(function ($item) {
                return $item->responden->email ?? 'No_Email:'.$item->uuid;
            })->map(function ($responsesPerEmail) {
                return $responsesPerEmail->groupBy(function ($item) {
                    return $item->answer->question->section->form->id;
                });
            });
            
            
            $name = $this->selectedFormPlacement ?: 'All';
            $fileName = 'Rekap-Full-' . $name . '-Form.xlsx';
            
            // Panggil class baru: ScoringAllInOneExport
            return Excel::download(
                new ScoringAllInOneExport($groupedData, $this->selectedFormPlacement),
                $fileName
            );
        }else{
            session()->flash('error', 'Response pada form tidak ada');
            return;
        }
    }

    public function export($userKey)
    {
        $isEmail = filter_var($userKey, FILTER_VALIDATE_EMAIL);
        
        $data = Responses::query()
            ->with(['responden', 'answer.question.section.form'])

            // Jika $isEmail TRUE, jalankan query relasi responden
            ->when($isEmail, function ($q) use ($userKey) {
                $q->whereHas('responden', fn ($subQ) => $subQ->where('email', $userKey));
            })

            // Jika $isEmail FALSE (berarti UUID), langsung cari di tabel utama responses
            ->when(!$isEmail, function ($q) use ($userKey) {
                $cleanUserKey = str_replace('uuid:', '', $userKey);
                $q->where('uuid', $cleanUserKey);
            })

            ->whereHas('answer.question.section.form', function($q) {
                // Menggunakan grouped where () untuk membungkus logika OR agar tidak merusak query utama
                $q->where(function($query) {
                    
                    // Jalankan pencarian placement jika selectedFormPlacement tidak kosong
                    $query->when(!empty($this->selectedFormPlacement), function($subQuery) {
                        $subQuery->where('placement', 'like', '%'.$this->selectedFormPlacement.'%'); // Jangan lupa tambahkan '%' di akhir jika ingin pencarian 'like' yang fleksibel
                    });

                    // Jalankan pencarian ID jika selectedForm tidak kosong
                    $query->when(!empty($this->selectedForm), function($subQuery) {
                        // Gunakan orWhere jika pencarian pertama juga jalan, 
                        // atau otomatis disesuaikan oleh Laravel jika ini satu-satunya yang jalan
                        $subQuery->where('id', $this->selectedForm);
                    });

                });
            }) 
            ->get();
          
        if ($data->isEmpty()) {
            session()->flash('error', 'Data tidak ditemukan');
            return;
        }

        // Ambil nama form untuk judul file

        if(!$isEmail){
            $userName = "No_email";
        }else{
            $userName = $userKey;
        }
        
        $formName = $data->first()->answer->question->section->form->form_name ?? 'Form';
        $namaFile = "Detail_Scoring_{$userName}_" . \Str::slug($formName) . ".xlsx";

        return Excel::download(
            new ScoringPersonalExport($data, $userName, $formName), 
            $namaFile
        );
    }

    public function closeModal()
    {
        $this->showModal = false;
        $this->selectedFormData = [];
    }

    public function render()
    {
        return view('livewire.dashboard.scoring-personal');
    }
}
