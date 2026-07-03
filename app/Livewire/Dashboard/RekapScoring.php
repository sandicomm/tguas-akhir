<?php

namespace App\Livewire\Dashboard;

use App\Models\Form;
use App\Models\Responses;
use Livewire\Component;
use Illuminate\Support\Facades\DB;

use Maatwebsite\Excel\Facades\Excel;
use App\Exports\RekapExport;

class RekapScoring extends Component
{
    // Filter agar tidak load semua form sekaligus
    public $selectedFormId = null; 
    public $forms = [];

    public function mount()
    {
        // 1. Ambil daftar form untuk Dropdown Filter
        $this->forms = Form::pluck('form_name', 'id');
        
        // Default pilih form pertama jika ada
        if(count($this->forms) > 0) {
            $this->selectedFormId = array_key_first($this->forms->toArray());
        }
    }

    public function export()
    {
        $form = \App\Models\Form::with(['sections.questions.answers'])
                ->findOrFail($this->selectedFormId);

        // Cek apakah ada responden yang sudah menjawab form ini
        $hasResponses = \App\Models\Responses::where('form_id', $this->selectedFormId)->exists();

        if (!$hasResponses) {
            $this->dispatch('alert', ['type' => 'error', 'message' => 'Belum ada data jawaban untuk form ini']);
            return;
        }

        $namaFile = "Rekap_Jawaban_" . \Str::slug($form->form_name) . ".xlsx";

        return Excel::download(new RekapExport($form), $namaFile);
    }

    public function render()
    {
        $rekapData = [];
        $headers = [];

        if ($this->selectedFormId) {
            // A. Ambil Header Jawaban Unik untuk Form ini (Max 6 opsi misalnya)
            $headers = DB::table('answers')
                ->join('questions', 'questions.id', '=', 'answers.question_id')
                ->join('sections', 'sections.id', '=', 'questions.section_id')
                ->where('sections.form_id', $this->selectedFormId)
                ->select('answers.answer', 'answers.value')
                ->distinct()
                ->orderBy('answers.value', 'asc') // Urutkan biar rapi
                ->get();

            // Jika opsi jawaban terlalu variatif (misal isian bebas), mungkin tidak cocok untuk matriks ini
            if ($headers->count() <= 10) {
                
                // B. QUERY AGREGASI (Ini Kuncinya!)
                // Kita hitung jumlah jawaban per pertanyaan langsung di SQL
                $stats = DB::table('responses')
                    ->join('answers', 'answers.id', '=', 'responses.answer_id')
                    ->where('responses.form_id', $this->selectedFormId)
                    ->selectRaw('
                        answers.question_id,
                        answers.answer,
                        COUNT(*) as total_count
                    ')
                    ->groupBy('answers.question_id', 'answers.answer')
                    ->get();
                
                // C. Ambil Daftar Pertanyaan
                $questions = DB::table('questions')
                    ->join('sections', 'sections.id', '=', 'questions.section_id')
                    ->where('sections.form_id', $this->selectedFormId)
                    ->select('questions.id', 'questions.question')
                    ->get();

                // D. Mapping Data agar mudah dibaca di View
                // Ubah format stats jadi array [question_id][answer_text] = count
                $statsMap = [];
                foreach ($stats as $s) {
                    $statsMap[$s->question_id][$s->answer] = $s->total_count;
                }

                // Susun data final
                foreach ($questions as $q) {
                    $row = [
                        'question' => $q->question,
                        'counts' => []
                    ];

                    // Isi count untuk setiap header jawaban
                    foreach ($headers as $h) {
                        $row['counts'][$h->answer] = $statsMap[$q->id][$h->answer] ?? 0;
                    }

                    $rekapData[] = $row;
                }
            }
        }

        return view('livewire.dashboard.rekap-scoring', [
            'rekapData' => $rekapData,
            'headers' => $headers
        ]);
    }
}