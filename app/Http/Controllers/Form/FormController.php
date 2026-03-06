<?php

namespace App\Http\Controllers\Form;

use App\Models\Answers;
use App\Models\Form;
use App\Models\Questions;
use App\Models\Sections;
use Illuminate\Http\Request;
use Carbon\Carbon;

class FormController extends \App\Http\Controllers\Controller
{
    public function getPreTestInteraktif()
    {
        $form = Form::with(['sections.questions.answers']) // Eager load sections, questions, and answers
            ->where('placement', 'pre-test-interaktif') // Filter berdasarkan form_type
            ->first(); // Ambil form berdasarkan tipe

        $sections = collect();
        $message = null;

        if (!$form) {
            $message = 'Tidak Ada Form Untuk Sesi Ini';
        } else {
            $sections = $form->sections->sortBy('order');
        }

        return view('livewire.form', compact('form', 'sections', 'message'));
    }

    public function updateForm(Request $request){
        //dd($request->all());

        // Validasi input
        $request->validate([
            'form_id' => 'nullable|exists:forms,id', 
            'form_name' => 'required|string|max:100',
            'collect-email' => 'required',
            'one-attempt' => 'required',
            'sections' => 'required|array',
            'sections.*.sectionId' => 'required|integer',
            'sections.*.order' => 'required|integer',
            'sections.*.section' => 'required|string|max:255',
            'sections.*.description' => 'nullable|string|max:255',
            'sections.*.questions' => 'required|array',
            'sections.*.questions.*.question_id' => 'required',
            'sections.*.questions.*.question' => 'required',
            'sections.*.questions.*.input_type' => 'required|string',
            'sections.*.questions.*.rule' => 'required|integer',
            'sections.*.questions.*.answer' => 'required_if:sections.*.questions.*.input_type,pilgan|array',
            'sections.*.questions.*.answer.*.answer' => 'required_if:sections.*.questions.*.input_type,pilgan|string',
        ]);

        // Upsert Form
        //dd($request->all());
        $updatedForm = Form::updateOrCreate(
            ['id' => $request['form_id']], // Jika form_id ada, update; jika tidak, insert baru
            [
                'form_name' => $request['form_name'],
                'collect_email' => $request['collect-email'],
                'one_attempt' => $request['one-attempt'],
                'updated_at' => now(),
                'created_at' => $request['form_id'] ? null : now() // Tambahkan created_at jika form baru
            ]
        );

        // Ambil ID Form
        $form = $updatedForm;

        // Perbarui nama form

        $sectionsToUpdate = [];
        $sectionsToDelete = [];
        $questionsToUpdate = [];
        $questionsToDelete = [];
        $answersToUpdate = [];
        $answersToDelete = [];

        foreach ($request->sections as $sectionData) {
            if ($sectionData['changeContent'] == 'update') {
                $sectionsToUpdate[] = [
                    'id' => $sectionData['sectionId'],
                    'form_id' => $form->id,
                    'order' => $sectionData['order'],
                    'name' => $sectionData['section'],
                    'description' => $sectionData['description']
                ];
            } else if ($sectionData['changeContent'] == 'add') {
                $sectionsToUpdate[] = [
                    'form_id' => $form->id, 
                    'order' => $sectionData['order'],
                    'name' => $sectionData['section'],
                    'description' => $sectionData['description']
                ];
            } else if ($sectionData['changeContent'] == 'delete') {
                $sectionsToDelete[] = $sectionData['sectionId'];
            }

            foreach ($sectionData['questions'] as $questionData) {
                if ($questionData['changeContent'] == 'update') {
                    $questionsToUpdate[] = [
                        'id' => $questionData['question_id'],
                        'input_type' => $questionData['input_type'],
                        'rules' => $questionData['rule'],
                        'order' => $questionData['order'],
                        'question' => $questionData['question'],
                        'section_id' => $sectionData['sectionId'],
                        'updated_at' => now()
                    ];
                } else if ($questionData['changeContent'] == 'add') {
                    $questionsToUpdate[] = [
                        'input_type' => $questionData['input_type'],
                        'rules' => $questionData['rule'],
                        'order' => $questionData['order'],
                        'question' => $questionData['question'],
                        'section_id' => $sectionData['sectionId'],
                        'created_at' => now(),
                        'updated_at' => now()
                    ];
                } else if ($questionData['changeContent'] == 'delete') {
                    $questionsToDelete[] = $questionData['question_id'];
                }

                if (in_array($questionData['input_type'], ['pilgan'])) {
                    foreach ($questionData['answer'] as $answerData) {
                        if ($answerData['changeContent'] == 'update') {
                            $answersToUpdate[] = [
                                'id' => $answerData['answer_id'],
                                'question_id' => $questionData['question_id'],
                                'answer' => $answerData['answer'],
                                'updated_at' => now()
                            ];
                        } else if ($answerData['changeContent'] == 'add') {
                            $answersToUpdate[] = [
                                'question_id' => $questionData['question_id'],
                                'answer' => $answerData['answer'],
                                'created_at' => now(),
                                'updated_at' => now()
                            ];
                        } else if ($answerData['changeContent'] == 'delete') {
                            $answersToDelete[] = $answerData['answer_id'];
                        }
                    }    
                }
            }
        }

        // Upsert Sections
        if (!empty($sectionsToUpdate)) {
            foreach ($sectionsToUpdate as &$section) {
                if (isset($section['status']) && $section['status'] === 'new') {
                    unset($section['id']); // Hapus ID agar auto-increment bekerja
                }
            }
            Sections::upsert($sectionsToUpdate, ['id'], ['form_id', 'order', 'name', 'description']);
        }

        // Delete Sections
        if (!empty($sectionsToDelete)) {
            Sections::whereIn('id', $sectionsToDelete)->delete();
        }

        // Upsert Questions
        if (!empty($questionsToUpdate)) {
            foreach ($questionsToUpdate as &$question) {
                if (isset($question['status']) && $question['status'] === 'new') {
                    unset($question['id']); // Hapus ID agar auto-increment bekerja
                }
            }
            Questions::upsert($questionsToUpdate, ['id'], ['section_id', 'order', 'question', 'rules', 'input_type']);
        }

        // Delete Questions
        if (!empty($questionsToDelete)) {
            Questions::whereIn('id', $questionsToDelete)->delete();
        }

        // Upsert Answers
        if (!empty($answersToUpdate)) {
            foreach ($answersToUpdate as &$answer) {
                if (isset($answer['status']) && $answer['status'] === 'new') {
                    unset($answer['id']); // Hapus ID agar auto-increment bekerja
                }
            }
            Answers::upsert($answersToUpdate, ['id'], ['answer', 'question_id']);
        }

        // Delete Answers
        if (!empty($answersToDelete)) {
            Answers::whereIn('id', $answersToDelete)->delete();
        }

        return redirect()->back()->with('success', 'Form updated successfully.');
    }
    
}
