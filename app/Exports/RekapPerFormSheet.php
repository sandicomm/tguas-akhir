<?php
namespace App\Exports;
use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;
use App\Models\Responses as Response;

class RekapPerFormSheet implements FromView
{
    public $form;

    public function __construct($form)
    {
        $this->form = $form;
    }

    public function view(): View
    {
        // Ambil semua responses sekali saja
        $responses = Response::where('form_id', $this->form->id)->get();

        // List jawaban unik
        $UniqueAnswer = $this->form->sections
            ->flatMap->questions
            ->flatMap->answers
            ->unique('answer')
            ->values();

        $rows = [];

        foreach ($this->form->sections as $section) {
            foreach ($section->questions as $question) {

                // unique answers HANYA milik pertanyaan ini
                $uniqueValues = $question->answers
                    ->map(fn($a) => ['id' => $a->id, 'answer' => $a->answer])
                    ->values();

                $counts = [];

                foreach ($uniqueValues as $uv) {
                    $counts[$uv['answer']] = $responses
                        ->where('answer_id', $uv['id'])
                        ->count();
                }

                $rows[] = [
                    'question' => $question->question,
                    'counts' => $counts
                ];
            }
        }
        //dd($rows, $UniqueAnswer->pluck('answer'));
        return view('exports.rekap-per-form', [
            'form' => $this->form,
            'UniqueAnswer' => $UniqueAnswer->pluck('answer'),
            'rows'   => $rows
        ]);
    }

}
?>