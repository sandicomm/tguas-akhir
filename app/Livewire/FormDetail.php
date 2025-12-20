<?php

namespace App\Livewire;

use App\Models\Form;
use App\Models\Answers;
use Livewire\Component;
use App\Models\Sections;
use App\Models\Questions;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FormDetail extends Component
{
    public $form;
    public $sectionMaxID;
    public $questionMaxID;
    public $answerMaxID;
    public $test;
    public function mount($id)
    {
        try{
            $this->sectionMaxID = Sections::max('id');
            $this->questionMaxID = Questions::max('id');
            $this->answerMaxID = Answers::max('id');
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
                $sectionId = $this->sectionMaxID;
                $questionId = $this->questionMaxID;
               
                $this->form = (object) [
                    'id' => $formId + 1,
                    'form_name' => 'New Form',
                    'placement'=>'disable',
                    'collect_email'=>0,
                    'one_attempt'=>0,
                    'must_fill'=>0,
                    'changeContent' => 'add',
                    'status' => 'update',
                    'sections' => collect([
                        (object) [
                            'id' => $sectionId +1,
                            'order' => 1,
                            'name' => 'Section 1',
                            'changeContent' => 'add',
                            'status' => 'new',
                            'description' => 'Deskripsi section',
                            'questions' => collect([
                                    (object)[
                                            'answers'=>collect([]),
                                            'changeContent'=>"add",
                                            'input_type'=>"text",
                                            'order'=>"1",
                                            'question'=>"type here",
                                            'id'=>$questionId+1,
                                            'status'=>''                            
                                        ],
                                ])
                        ],
                    ])
                ];
            }
        }catch(\Throwable $e){
            session()->flash('error', 'Mount Gagal');
            return response()->json([
                'success' => false,
                'message' => 'mount gagal',
                //'file' => $e->getFile(),
                //'line' => $e->getLine(),
                //'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }

    public function updateForm(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'form_name' => 'required|string|max:100',
                'placement' => 'required|string',
                'collect_email' => 'required|in:0,1',
                'one_attempt' => 'required|in:0,1',
                'must_fill' => 'required',

                'sections' => 'required|array',

                'sections.*.section_id' => 'required',
                'sections.*.order' => 'required|integer',
                'sections.*.section' => 'required|string|max:255',
                'sections.*.description' => 'nullable|string|max:255',
                'sections.*.changeContent' => 'required|in:add,update,delete',

                'sections.*.questions' => 'nullable|array',

                'sections.*.questions.*.question_id' => 'required',
                'sections.*.questions.*.question' => 'required|string',
                'sections.*.questions.*.input_type' => 'required|string',
                'sections.*.questions.*.rule' => 'required|integer',
                'sections.*.questions.*.changeContent' => 'required|in:add,update,delete',

                'sections.*.questions.*.answer' => 'nullable|array',
            ]);

            DB::transaction(function () use ($request) {

                /* ================================
                * 1. FORM
                * ================================ */
                if ($request->batch_number == 0 &&
                    in_array($request->changeContent, ['add','update'])) {

                    $oneAttempt = $request->collect_email == 0 ? 0 : $request->one_attempt;

                    $this->form = Form::updateOrCreate(
                        ['id' => $request->form_id],
                        [
                            'form_name' => $request->form_name,
                            'placement' => $request->placement,
                            'collect_email' => (int)$request->collect_email,
                            'one_attempt' => (int)$oneAttempt,
                            'must_fill' => (int)$request->must_fill,
                        ]
                    );
                } else {
                    $this->form = Form::findOrFail($request->form_id);
                }

                /* ================================
                * 2. BATCH CONTAINER
                * ================================ */
                $sectionUpdate = [];
                $sectionDelete = [];

                $questionUpdate = [];
                $questionDelete = [];

                $answerUpdate = [];
                $answerDelete = [];

                /* ================================
                * 3. LOOP MULTI SECTION
                * ================================ */
                foreach ($request->sections as $sec) {

                    $sid = $sec['id'];

                    if ($sec['changeContent'] === 'delete') {
                        $sectionDelete[] = $sid;
                        continue;
                    }

                    $sectionUpdate[] = [
                        'id' => $sid,
                        'form_id' => $this->form->id,
                        'order' => $sec['order'],
                        'name' => $sec['name'],
                        'description' => $sec['description'],
                        'updated_at' => now(),
                        'created_at' => now(),
                    ];

                    /* ================================
                    * 4. QUESTIONS
                    * ================================ */
                    if (!empty($sec['questions'])) {
                        foreach ($sec['questions'] as $q) {

                            if ($q['changeContent'] === 'delete') {
                                $questionDelete[] = $q['id'];
                                continue;
                            }

                            $inputType = match ($q['input_type']) {
                                'text' => 1,
                                'pilgan' => 3,
                            };

                            $questionUpdate[] = [
                                'id' => $q['id'],
                                'section_id' => $sid,
                                'question' => $q['question'],
                                'order' => $q['order'],
                                'input_type' => $inputType,
                                'updated_at' => now(),
                                'created_at' => now(),
                            ];

                            /* ================================
                            * 5. ANSWERS
                            * ================================ */
                            if (!empty($q['answer']) && $q['input_type'] === 'pilgan') {
                                foreach ($q['answer'] as $ans) {

                                    if ($ans['changeContent'] === 'delete') {
                                        $answerDelete[] = $ans['id'];
                                        continue;
                                    }

                                    $answerUpdate[] = [
                                        'id' => $ans['id'],
                                        'question_id' => $q['id'],
                                        'answer' => $ans['answer'],
                                        'value' => $ans['value'],
                                        'updated_at' => now(),
                                        'created_at' => now(),
                                    ];
                                }
                            }
                        }
                    }
                }

                /* ================================
                * 6. EXECUTE BATCH
                * ================================ */
                if ($sectionUpdate)
                    Sections::upsert($sectionUpdate, ['id'], ['name','description','order','updated_at']);

                if ($sectionDelete)
                    Sections::whereIn('id', $sectionDelete)->delete();

                if ($questionUpdate)
                    Questions::upsert($questionUpdate, ['id'], ['question','order','input_type','section_id','updated_at']);

                if ($questionDelete)
                    Questions::whereIn('id', $questionDelete)->delete();

                if ($answerUpdate)
                    Answers::upsert($answerUpdate, ['id'], ['answer','value','updated_at','question_id']);

                if ($answerDelete)
                    Answers::whereIn('id', $answerDelete)->delete();
            });

            return response()->json([
                'success' => true,
                'message' => 'Batch berhasil diproses',
                //'form' => $this->form->id,
                'redirect' => route('form.detail', $this->form->id),
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                //'line' => $e->getLine(),
                //'file' => $e->getFile(),
                'message' => 'Update Form Gagal',
            ]);
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
        }catch(\Throwable $e){
            session()->flash('error', $e->getMessage());
             return response()->json([
                'success' => false,
                'message' => 'delete' . $e->getMessage(),
                //'file' => $e->getFile(),
                //'line' => $e->getLine(),
                //'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }

    public function render()
    {
        return view('livewire.form-detail');
    }
}

