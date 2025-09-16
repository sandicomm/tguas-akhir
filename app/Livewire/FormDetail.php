<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Answers;
use App\Models\Form;
use App\Models\Questions;
use App\Models\Sections;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class FormDetail extends Component
{
    public $form;
    public $sectionMaxID;
    public $questionMaxID;

    public function mount($id)
    {
        try{
            if (ctype_digit($id)) {
                $this->form = Form::with([
                    'sections.questions' => function ($q) {
                        $q->with(['answers', 'inputType']);
                    }
                ])->findOrFail($id);

                foreach ($this->form->sections as $section) {
                    foreach ($section->questions as $question) {
                        $question->input_type = $question->inputType->input_type ?? null;
                        unset($question->inputType); // opsional: biar nggak ikut ke JSON
                    }
                }
                //dd($this->form);
            }else{
                $formId = Form::max('id');
                $sectionId = Sections::max('id');
                $this->form = (object) [
                    'id' => $formId + 1,
                    'form_name' => 'New Form',
                    'status' => 'update',
                    'sections' => collect([
                        (object) [
                            'id' => $sectionId +1,
                            'order' => 1,
                            'section' => 'Section 1',
                            'changeContent' => 'add',
                            'status' => 'new',
                            'description' => 'Deskripsi section',
                            'questions' => collect([])
                        ],
                    ])
                ];
            }
            $this->sectionMaxID = Sections::max('id');
            $this->questionMaxID = Questions::max('id');
        }catch(\Exception $e){
            session()->flash('error', $e->getMessage());
        }
    }

    public function updateForm(Request $request){
        //dd($request->all());
        try{
            $request->validate([
                //'form_id' => 'nullable|exists:forms,id', 
                'form_name' => 'required|string|max:100',
                'placement' => 'in:pre-test-website,post-test-website,pre-test-emodul,post-test-emodul,disable',
                'collect-email' => 'required|in:0,1', // Pastikan hanya 0 atau 1 yang bisa dipilih
                'one-attempt' =>'required|in:0,1',
                'must-fill' => 'required',
                'sections' => 'required|array',
                'sections.*.sectionId' => 'required|integer',
                'sections.*.order' => 'required|integer',
                'sections.*.section' => 'required|string|max:255',
                'sections.*.description' => 'nullable|string|max:255',
                'sections.*.questions' => 'nullable|array',
                'sections.*.questions.*.question_id' => 'required',
                'sections.*.questions.*.question' => 'required',
                'sections.*.questions.*.input_type' => 'required|string',
                'sections.*.questions.*.rule' => 'required|integer',
                'sections.*.questions.*.answer' => 'required_if:sections.*.questions.*.input_type,radio,checkbox|array',
                'sections.*.questions.*.answer.*.answer' => 'required_if:sections.*.questions.*.input_type,radio,checkbox|string',
                'sections.*.questions.*.answer.*.value' => 'required_if:sections.*.questions.*.input_type,radio,checkbox|string',
            ], [
                'form_name.required' => 'Nama form tidak boleh kosong!',
                'form_name.max' => 'Nama form maksimal 100 karakter!',
                'placement.in' => 'Pilihan placement tidak valid!',
                'collect-email.required' => 'Pengumpulan email harus diisi!',
                'one-attempt.required' => 'Opsi satu kali percobaan harus diisi!',
                'one-attempt.prohibited' => 'One Attempt tidak bisa diisi 1 jika Collect Email bernilai 0.',
                'sections.required' => 'Minimal harus ada satu section!',
                'sections.*.sectionId.required' => 'ID section wajib diisi!',
                'sections.*.order.required' => 'Urutan section wajib diisi!',
                'sections.*.section.required' => 'Nama section wajib diisi!',
                'sections.*.section.max' => 'Nama section maksimal 255 karakter!',
                'sections.*.questions.*.question_id.required' => 'ID pertanyaan wajib diisi!',
                'sections.*.questions.*.question.required' => 'Isi pertanyaan wajib diisi!',
                'sections.*.questions.*.input_type.required' => 'Tipe input wajib diisi!',
                'sections.*.questions.*.rule.required' => 'Aturan wajib diisi!',
                'sections.*.questions.*.answer.required_if' => 'Jawaban harus diisi jika tipe input radio atau checkbox!',
                'sections.*.questions.*.answer.*.answer.required_if' => 'Jawaban harus diisi jika tipe input radio atau checkbox!',
                'sections.*.questions.*.answer.*.value.required_if' => 'Jawaban harus diisi jika tipe input radio atau checkbox!',
            ]);

            //dd($request->all());

            DB::transaction(function () use ($request) {
                $sectionsToUpdate = [];
                $questionsToUpdate = [];
                $answersToUpdate = [];
            
                $sectionsToDelete = [];
                $questionsToDelete = [];
                $answersToDelete = [];

                $maxSectionId = Sections::max('id') ?? 0;
                $maxQuestionId = Questions::max('id') ?? 0;

                $one_attempt = $request['collect-email'] == 0 ? 0 : $request['one-attempt'];

                $updatedForm = Form::updateOrCreate(
                    ['id' => $request['form_id']],
                    [
                        'form_name' => $request['form_name'],
                        'placement' => $request['placement'],
                        'collect_email' => (int) $request['collect-email'],
                        'one_attempt' => (int)$one_attempt,
                        'must_fill' => (int) $request['must-fill'],
                        'updated_at' => now(),
                        'created_at' => $request['form_id'] ? null : now(),
                    ]
                );

                // Ambil ID Form
                $this->form = $updatedForm;
                //dd($this->form);

                foreach ($request->sections as $sectionData) {
                    //dd($sectionData);
                    if ($sectionData['changeContent'] == 'update' && $sectionData['status'] !== 'new') {
                        $sectionsToUpdate[] = [
                            'id' => $sectionData['sectionId'],
                            'order' => $sectionData['order'],
                            'name' => $sectionData['section'],
                            'description' => $sectionData['description'],
                            'form_id' => $updatedForm->id,
                            'updated_at' => now(), 
                        ];
                        //dd('uhuy');
                    } else if ($sectionData['changeContent'] == 'add' || ($sectionData['changeContent'] == 'update' && isset($sectionData['status']) && $sectionData['status'] === 'new')) {
                        // 🔥 Gunakan ID yang sudah dihitung dari awal
                        $maxSectionId++;
                        $sectionsToInsert[] = [
                            'id' => $sectionData['sectionId'], // ✅ ID baru dari max ID yang dihitung
                            'order' => $sectionData['order'],
                            'name' => $sectionData['section'],
                            'description' => $sectionData['description'],
                            'form_id' => $updatedForm->id,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                        //dd($updatedForm);
                    } else if ($sectionData['changeContent'] == 'delete') {
                        $sectionsToDelete[] = $sectionData['sectionId'];
                    }
                }

                // ✅ Insert Sections dulu
                if (!empty($sectionsToInsert)) {
                // dd($sectionsToInsert);
                    Sections::insert($sectionsToInsert); // Menggunakan `insert`, karena `upsert` tidak mendukung ID custom
                }

                if (!empty($sectionsToUpdate)) {
                    Sections::upsert($sectionsToUpdate, ['id'], ['name', 'description', 'order', 'updated_at']);
                }

                if (!empty($sectionsToDelete)) {
                    Sections::whereIn('id', $sectionsToDelete)->delete();
                }
                
                foreach($request->sections as $sectionData){
                    $sectionId = $sectionData['sectionId'];
                    //dd($request->section);
                    if(!empty($sectionData['questions'])){
                        foreach ($sectionData['questions'] as $questionData) {
                            //dd($request->all());
                            if($questionData['input_type'] == 'text'){
                                $inputType = 1;
                            }else if($questionData['input_type'] == 'textarea'){
                                $inputType = 2;
                            }else if($questionData['input_type'] == 'radio'){
                                $inputType = 3;
                            }else if($questionData['input_type'] == 'checkbox'){
                                $inputType = 4;
                            }

                            if ($questionData['changeContent'] == 'update' && $questionData['status'] !== 'new') {
                                $questionsToUpdate[] = [
                                    'id' => $questionData['question_id'],
                                    'input_type' => $inputType,
                                    'rules' => $questionData['rule'],
                                    'order' => $questionData['order'],
                                    'question' => $questionData['question'],
                                    'section_id' =>$sectionId,
                                    'updated_at' => now(),
                                    ];
                            } else if ($questionData['changeContent'] == 'add' || ($questionData['changeContent'] == 'update' && isset($questionData['status']) && $questionData['status'] === 'new')) {
                                $questionsToInsert[] = [
                                    'id' => $questionData['question_id'], // ✅ ID baru dari max ID yang dihitung
                                    'input_type' => $inputType,
                                    'rules' => $questionData['rule'],
                                    'order' => $questionData['order'],
                                    'question' => $questionData['question'],
                                    'section_id' => $sectionId, // ✅ ID Section yang sudah dihitung
                                    'created_at' => now(),
                                    'updated_at' => now(),
                                ];
                            } else if ($questionData['changeContent'] == 'delete') {
                                $questionsToDelete[] = $questionData['question_id'];
                            }
                        }
                    }
                }

                // ✅ Insert Questions setelah Section selesai
                if (!empty($questionsToInsert)) {
                    Questions::insert($questionsToInsert);
                }

                if (!empty($questionsToUpdate)) {
                    //dd($request->sections);
                    Questions::upsert($questionsToUpdate, ['id'], ['question', 'input_type', 'rules', 'section_id', 'order', 'updated_at']);
                }

                if (!empty($questionsToDelete)) {
                    Questions::whereIn('id', $questionsToDelete)->delete();
                }
                
                foreach($request->sections as $sectionData){
                    //dd($request->sections);
                    if(!empty($sectionData['questions'])){
                        //dd($request->sections);
                        foreach ($sectionData['questions'] as $questionData) {
                            if (in_array($questionData['input_type'], ['radio', 'checkbox'])) {
                                if(!empty($questionData['answer'])){
                                    foreach ($questionData['answer'] as $answerData) {
                                        //dd($request->sections);
                                        $questionId = $questionData['question_id'];
                                        
                                        if ($answerData['changeContent'] == 'update' && $answerData['status'] !== 'new') {
                                            $answersToUpdate[] = [
                                                'id' => $answerData['answer_id'],
                                                'question_id' => $questionId,
                                                'answer' => $answerData['answer'],
                                                'value' => $answerData['value'],
                                                'updated_at' => now(),
                                            ];
                                        } else if ($answerData['changeContent'] == 'add' || ($answerData['changeContent'] == 'update' && isset($answerData['status']) && $answerData['status'] === 'new')) {
                                            $answersToInsert[] = [
                                                'question_id' => $questionId,
                                                'answer' => $answerData['answer'],
                                                'value' => $answerData['value'],
                                                'created_at' => now(),
                                                'updated_at' => now(),
                                            ];
                                        } else if ($answerData['changeContent'] == 'delete') {
                                            $answersToDelete[] = $answerData['answer_id'];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (!empty($answersToInsert)) {
                    //dd($answersToInsert);
                    //dd($answersToUpdate);
                    Answers::insert($answersToInsert);
                }
                
                if (!empty($answersToUpdate)) {
                    //dd($answersToInsert);
                    //dd($answersToUpdate);
                    Answers::upsert($answersToUpdate, ['id'], ['answer']);
                }

                if (!empty($answersToDelete)) {
                    Answers::whereIn('id', $answersToDelete)->delete();
                }
            });   

            session()->flash('success', 'Perubahan berhasil dilakukan!');
            // **Pastikan request AJAX mendapatkan response JSON**
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Perubahan berhasil!',
                    'redirect' => route('form.detail', $this->form->id),
                ]);
            }

            return redirect()->route('form.detail', $this->form->id)->with('success', 'Perubahan berhasil dilakukan!');
        }catch(\Exception $e){
            session()->flash('error', $e->getMessage());
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error' . $e->getMessage(),
                    'redirect' => route('form.detail', $this->form->id),
                ]);
            }
            //dd($e->getMessage());
        }
    }

    public function delete($id)
    {
        try{
            $form = Form::find($id);

            if (!$form) {
                session()->flash('error', 'Form tidak ditemukan.');
                return redirect()->route('forms');
            }

            $form->delete();

            session()->flash('success', 'Form berhasil dihapus.');
            return redirect()->route('forms');
        }catch(\Exception $e){
            session()->flash('error', $e->getMessage());
        }
    }

    public function render()
    {
        return view('livewire.form-detail');
    }
}

