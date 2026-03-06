<?php

namespace App\Livewire\Dashboard;

use Livewire\Component;
use App\Models\Responses;
use Livewire\Attributes\Computed;
use Livewire\Attributes\Lazy;
use App\Models\Answers;
use Livewire\Attributes\On;

class ScoringPersonal extends Component
{
    public $showAllScoring = false;
    public $scoreAnswer;

    public function mount(){
         $this->scoreAnswer = Answers::with('question.section.form')
                ->get()
                ->groupBy(fn ($answer) => $answer->question->section->form->id)
                ->map(function ($answers, $formId) {

                    $maxScore = $answers
                        ->groupBy('question_id') // 1️⃣ group per question
                        ->map(fn ($questionAnswers) => $questionAnswers->max('value')) // 2️⃣ ambil value tertinggi
                        ->sum(); // 3️⃣ jumlahkan

                    return [
                        'form_id'   => $formId,
                        'max_score' => $maxScore,
                    ];
                });
    }

    // Gunakan computed property agar data tidak disimpan di state (mencegah payload berat)
    #[Computed]
    public function groupedAllResponsesScoring()
    {
        // 1. Jalankan Query di sini
        $responses = Responses::query()
            ->select([
                'responses.id', 'responses.form_id', 'responses.attempt', 'responses.uuid',
                'answers.id as answerId', 'answers.answer', 'answers.value',
                'questions.question', 'questions.id as questionId',
                'forms.form_name', 'forms.placement',
                'respondens.email',
            ])
            ->selectRaw("COALESCE(respondens.email, CONCAT('uuid:', responses.uuid)) as user_key")
            ->leftJoin('answers', 'answers.id', '=', 'responses.answer_id')
            ->leftJoin('questions', 'questions.id', '=', 'answers.question_id')
            ->leftJoin('sections', 'sections.id', '=', 'questions.section_id')
            ->leftJoin('forms', 'forms.id', '=', 'sections.form_id')
            ->leftJoin('respondens', 'respondens.id', '=', 'responses.responden_id')
            ->get();

        // 2. Jalankan Logika Grouping Anda (Pindahkan dari Dashboard.php ke sini)
        return collect($responses)
                    ->groupBy(fn ($r) => $r->user_key)
                    ->sortKeysUsing(function ($a, $b) {
                        $aIsUuid = str_starts_with($a, 'uuid:');
                        $bIsUuid = str_starts_with($b, 'uuid:');

                        if ($aIsUuid && !$bIsUuid) return 1;
                        if (!$aIsUuid && $bIsUuid) return -1;
                        return strcmp($a, $b);
                    })
                    ->map(function ($responsesByUser) {
                    
                        return $responsesByUser
                            ->groupBy(fn ($r) => $r->placement)
                            ->map(function ($placementGroup) {

                                return $placementGroup
                                    ->groupBy(fn ($r) => $r->form_id)
                                    ->map(function ($responses, $formId) {

                                        $groupedByQuestion = $responses
                                            // 1. Grouping berdasarkan ID agar pertanyaan yang teksnya sama tapi ID beda tetap terpisah
                                            ->groupBy(fn ($r) => $r->questionId) 
                                            ->map(function ($q) {
                                                return [
                                                    // 2. Masukkan teks pertanyaan ke dalam array data
                                                    'id'  => $q->first()->id, 
                                                    'question'  => $q->first()->question, 
                                                    'questionImage' => $q->first()->questionImage ?? null,
                                                    'attempts'      => $q->groupBy(fn ($r) => $r->attempt)
                                                ];
                                            });

                                        $totalScoreByAttempt = $responses
                                            ->groupBy(fn ($r) => $r->attempt)
                                            ->map(fn ($group) =>
                                                $group->sum(fn ($r) => $r->value ?? 0)
                                            );

                                        return [
                                            'form_id'     => $formId,
                                            'form_name'   => $responses->first()->form_name,
                                            'items'       => $groupedByQuestion,
                                            'total_score' => $totalScoreByAttempt,
                                            'max_score'   => $this->scoreAnswer[$formId]['max_score'] ?? 0,
                                        ];
                                    });
                            });
                    });
    }

    public function toggleShowAllScoring(){
        $this->showAllScoring = !$this->showAllScoring;
    }

    public function render()
    {
        return view('livewire.dashboard.scoring-personal');
    }
}
