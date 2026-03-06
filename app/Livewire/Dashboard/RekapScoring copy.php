<?php

namespace App\Livewire\Dashboard;

use App\Models\Form;
use App\Models\Answers;
use Livewire\Component;
use App\Models\Responses as Response;
use Livewire\Attributes\Lazy;

class RekapScoring extends Component
{
    public $uniqueAnswers;
    public $uniqueFormId;
    public $rekapScoring = [];

    public function mount(){
        $allResponses = Response::query()
                ->select([
                    'responses.id',
                    'responses.form_id',
                    'responses.attempt',
                    'responses.uuid',

                    'answers.id as answerId',
                    'answers.answer',
                    'answers.image as answerImage',
                    'answers.value',

                    'questions.question',
                    'questions.id as questionId',
                    'questions.image as questionImage',

                    'forms.form_name',
                    'forms.placement',

                    'respondens.email',
                ])
                ->selectRaw("
                    COALESCE(respondens.email, CONCAT('uuid:', responses.uuid)) as user_key
                ")
                ->leftJoin('answers', 'answers.id', '=', 'responses.answer_id')
                ->leftJoin('questions', 'questions.id', '=', 'answers.question_id')
                ->leftJoin('sections', 'sections.id', '=', 'questions.section_id')
                ->leftJoin('forms', 'forms.id', '=', 'sections.form_id')
                ->leftJoin('respondens', 'respondens.id', '=', 'responses.responden_id')
                ->toBase()
                ->get();

            $this->uniqueFormId = Response::whereHas('answer.question.section.form')
                ->distinct()
                ->pluck('form_id');

            $this->uniqueAnswers = Answers::whereHas('question.section.form', function ($query) {
                $query->whereIn('id', $this->uniqueFormId);
            })
            ->with('question.section.form')
            ->get()
            ->groupBy(fn($answer) => $answer->question->section->form->id)
            ->map(function($answers) {
                return $answers->map(function($a) {
                    // Kita kumpulkan semua field yang dibutuhkan
                    return [
                        'id'           => $a->id,
                        'answer'       => $a->answer,
                        'answerImage'  => $a->image,
                    ];
                })
                // Unik berdasarkan kombinasi string answer DAN string answerImage
                ->unique(function ($item) {
                    return $item['answer'] . $item['answerImage'];
                })
                ->values();
            });

            // 🔥 DATA GLOBAL
            $this->buildRekapScoring(
                collect($allResponses)->groupBy('form_name')
            );
    }

    public function buildRekapScoring($responses)
    {  
        $this->rekapScoring = collect($responses) 
            ->mapWithKeys(function ($items, $formName) {
                
                $formId = $items->first()->form_id ?? null;
                
                if (!$formId) return [];
                $answers = $this->uniqueAnswers[$formId] ?? collect();
                
                // skip kalau opsi jawaban terlalu banyak
                if ($answers->count() > 6) {
                    return [];
                }

                // 🔥 group per pertanyaan (string biasa)
                $rows = collect($items)
                    ->groupBy('questionId')
                    ->map(function ($questionResponses) use ($answers) {
                        $scores = $answers
                            ->mapWithKeys(fn ($a) => [$a['answer'] . $a['answerImage'] => 0])
                            ->toArray();

                        foreach ($questionResponses as $r) {
                            
                            $ans = $r->answer ?? null;
                            $img = $r->answerImage ?? null;
                            $val = $ans.$img;
                            if ($val !== null && isset($scores[$val])) {
                                $scores[$val]++;
                            }
                        }
                     
                        $questionImage = $questionResponses->first()->questionImage ?? null;
                        $questionId = $questionResponses->first()->id ?? null;
                        $questionText = $questionResponses->first()->question ?? null;

                        return [
                            'id' => $questionId,
                            'question' => $questionText,
                            'questionImage' => $questionImage,
                            'scores'   => $scores,
                        ];
                    })
                    ->values();

                return [
                    $formName => [
                        'answers' => $answers->values(),
                        'rows'    => $rows,
                    ]
                ];
            })
            ->toArray();
            
    }

    public function render()
    {
        return view('livewire.dashboard.rekap-scoring');
    }
}
