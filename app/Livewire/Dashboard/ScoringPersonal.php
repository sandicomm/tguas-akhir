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
    public $showAllScoring = false;
    public $scoreAnswer;

    public $selectedFormId = null; 
    public $forms = [];

    public function mount()
    {
        // 1. Ambil daftar form untuk Dropdown Filter
        $this->forms = Form::pluck('form_name', 'placement');
        
        // Default pilih form pertama jika ada
        if(count($this->forms) > 0) {
            $this->selectedFormId = array_key_first($this->forms->toArray());
        }

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
        // 1. Ambil data ringkasan skor dari Database (Sangat Ringan)
        $paginatedData = Responses::query()
            ->select([
                'responses.form_id',
                'responses.attempt',
                'forms.form_name',
                'forms.placement',
            ])
            // COALESCE untuk handle user anonim vs login
            ->selectRaw("COALESCE(respondens.email, CONCAT('uuid:', responses.uuid)) as user_key")
            // Casting varchar ke integer untuk kalkulasi SUM
            ->selectRaw("SUM(answers.value) as total_score")
            ->leftJoin('answers', 'answers.id', '=', 'responses.answer_id')
            ->leftJoin('respondens', 'respondens.id', '=', 'responses.responden_id')
            ->leftJoin('forms', 'forms.id', '=', 'responses.form_id')
            ->where('forms.placement', 'like', '%'.$this->selectedFormId)
            ->groupBy('user_key', 'responses.form_id', 'responses.attempt', 'forms.form_name', 'forms.placement')
            ->orderBy('user_key')
            ->paginate(10);

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
        $data = Responses::query()
            ->with(['responden', 'answer.question.section.form'])
            ->whereHas('answer.question.section.form', function($q) {
                $q->where('placement', 'like', '%'.$this->selectedFormId);
            }) 
            ->get();

        if ($data->isEmpty()) return;

        // Grouping tetap dilakukan agar urutan per user rapi

        $groupedData = $data->groupBy(function ($item) {
            return $item->responden->email ?? 'Guest-' . $item->uuid;
        })->map(function ($responsesPerEmail) {
            return $responsesPerEmail->groupBy(function ($item) {
                return $item->answer->question->section->form->id;
            });
        });
        
        
        $name = $this->selectedFormId ?: 'All';
        $fileName = 'Rekap-Full-' . $name . '-Form.xlsx';
        
        // Panggil class baru: ScoringAllInOneExport
        return Excel::download(
            new ScoringAllInOneExport($groupedData, $this->selectedFormId),
            $fileName
        );
    }

    public function export($userKey)
    {
        $data = Responses::query()
            ->with(['responden', 'answer.question.section.form'])
            ->whereHas('responden', fn ($q) => $q->where('email', $userKey))
            ->whereHas('answer.question.section.form', function($q) {
                $q->where('placement', 'like', '%'.$this->selectedFormId);
            }) 
            ->get();
       ;
        if ($data->isEmpty()) {
            $this->dispatch('alert', ['type' => 'error', 'message' => 'Data tidak ditemukan']);
            return;
        }

        // Ambil nama form untuk judul file
        $formName = $data->first()->answer->question->section->form->form_name ?? 'Form';
        $namaFile = "Detail_Scoring_{$userKey}_" . \Str::slug($formName) . ".xlsx";

        return Excel::download(
            new ScoringPersonalExport($data, $userKey, $formName), 
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
