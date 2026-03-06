<?php
namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Illuminate\Contracts\View\View;
use App\Models\Responses;

class RekapExport implements FromView, ShouldAutoSize
{
    public $form;

    public function __construct($form)
    {
        $this->form = $form;
    }

    public function view(): View
    {
        // 1. Ambil distribusi jawaban (Counting)
        $responses = Responses::where('form_id', $this->form->id)
            ->pluck('answer_id')
            ->countBy();

        // 2. Ambil label unik jawaban (STS, TS, S, SS, dll) beserta nilainya untuk header
        // Kita ambil dari semua pertanyaan di form ini
        $uniqueAnswers = $this->form->sections
            ->flatMap->questions
            ->flatMap->answers
            ->unique('answer')
            ->sortBy('value') // Urutkan berdasarkan bobot nilai (0, 5, 10, dll)
            ->values();

        // 3. Susun baris data
        $rows = [];
        foreach ($this->form->sections as $section) {
            foreach ($section->questions as $question) {
                $counts = [];
                foreach ($uniqueAnswers as $ua) {
                    // Cari ID jawaban yang cocok dengan label $ua->answer pada pertanyaan ini
                    $targetAnswer = $question->answers->where('answer', $ua->answer)->first();
                    $counts[$ua->answer] = $targetAnswer ? ($responses[$targetAnswer->id] ?? 0) : '-';
                }

                $rows[] = [
                    'question' => $question->question,
                    'counts'   => $counts
                ];
            }
        }

        return view('exports.rekap-jawaban-all', [
            'form'          => $this->form,
            'uniqueAnswers' => $uniqueAnswers,
            'rows'          => $rows
        ]);
    }
}
?>