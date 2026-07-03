<?php

namespace App\Livewire\Admin;

use App\Models\Form;
use App\Models\Answers;
use Livewire\Component;
use App\Models\Sections;
use App\Models\Questions;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Str;

class FormDetail extends Component
{
    public $formDetailStatus;
    public $formDetailStatusRaw;
    public $msg;
    public $redirect;
    public $status;

    public $form;
    public $formPlacement;
    public $formEmail;
    public $sectionMaxID;
    public $questionMaxID;
    public $answerMaxID;
    public $test;
    public $answerDeleteOut = [];
    
    public function mount($id)
    {
        try{
            $this->formPlacement = Form::pluck('placement')->unique();

            $this->sectionMaxID = Sections::max('id');
            $this->questionMaxID = Questions::max('id');
            $this->answerMaxID = Answers::max('id');

            $this->formDetailStatus = ctype_digit($id);
            $this->formDetailStatusRaw = $id;

            if ($this->formDetailStatus) {
                $this->form = Form::with([
                    'sections.questions' => function ($q) {
                        $q->with(['answers']);
                    }
                ])->findOrFail($id);

                //dd($this->form);
            }else{
                $formId = Form::max('id');
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
                            'id' => $this->sectionMaxID +1,
                            'order' => 1,
                            'name' => 'Section 1',
                            'changeContent' => 'add',
                            'status' => 'new',
                            'description' => 'Deskripsi section',
                            'questions' => collect([
                                    (object)[
                                            'changeContent'=>"add",
                                            'order'=>1,
                                            'question'=>"type here",
                                            'id'=>$this->questionMaxID+1,
                                            'status'=>'new',
                                            'answers'=>collect([
                                                (object)[
                                                        'id'=> $this->answerMaxID+1,
                                                        'answer'=> 'type here',
                                                        'value'=> 0,
                                                        'status'=> 'new',
                                                        'changeContent'=> 'add'
                                                    ],
                                                ])                           
                                        ],
                                ])
                        ],
                    ])
                ];
            }
        }catch(\Throwable $e){
            return redirect()->route('admin.forms');
            /*
            return response()->json([
                'success' => false,
                'message' => 'Form tidak ditemukan',
                'redirect' => route('admin.forms'),
                //'file' => $e->getFile(),
                //'line' => $e->getLine(),
                //'trace' => $e->getTraceAsString(),
            ], 500);*/
        }
    }

    public function updateForm(Request $request)
    {
        try { 
            DB::transaction(function () use ($request) {
                //------------- PROSES FILE ----------------
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
                    'sections.*.questions.*.rule' => 'required|integer',
                    'sections.*.questions.*.changeContent' => 'required|in:add,update,delete',

                    'sections.*.questions.*.answer' => 'nullable|array',
                ]);
                //---------------- PROSES FORM ------------------
                if ($request->batch_number == 0 && in_array($request->changeContent, ['add','update'])) {

                    $oneAttempt = $request->collect_email == 0 ? 0 : $request->one_attempt;

                    if ($request->placement !== 'disable') {
                        Form::where('placement', $request->placement)
                            ->where('id', '!=', $request->form_id) // Pastikan id lain
                            ->update(['placement' => 'disable']);
                    }
                    
                    if($request->stat){
                       // === MODE EDIT ===
                       
                        $form = Form::find($request->form_id);
                        $this->formDetailStatusRaw = 'form edit update';
            
                        if (!$form) {
                            $this->formDetailStatusRaw = 'form tidak ditemukan update';

                            $this->msg = 'Form Tidak Ditemukan, Mungkin Sudah Dihapus.';
                            $this->status = false;
                            $this->redirect = route('admin.forms');

                            return response()->json([
                                'success' => $this->status,
                                'message' => $this->msg,
                                //'file'=>$this->formDetailStatusRaw,
                                'redirect' => $this->redirect,
                            ]); 
                        }

                        // Jika data ada, lakukan update biasa
                        $form->update([
                            'form_name'     => $request->form_name,
                            'placement'     => $request->placement,
                            'collect_email' => (int)$request->collect_email,
                            'one_attempt'   => (int)$oneAttempt,
                            'must_fill'     => (int)$request->must_fill,
                        ]);
                        $this->form = $form;

                    }else{
                        // === MODE ADD ===
                        // Pada fungsi create(), cukup masukkan satu array data. 
                        // ID tidak perlu dimasukkan karena biasanya auto-increment.
                        $this->formDetailStatusRaw = 'form add';
                        $this->form = Form::create([
                            'form_name'     => $request->form_name,
                            'placement'     => $request->placement,
                            'collect_email' => (int)$request->collect_email,
                            'one_attempt'   => (int)$oneAttempt,
                            'must_fill'     => (int)$request->must_fill,
                        ]);
                    }
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

                            $questionUpdate[] = [
                                'id' => $q['id'],
                                'section_id' => $sid,
                                'question' => $q['question'],
                                'order' => $q['order'],
                                'updated_at' => now(),
                                'created_at' => now(),
                            ];
                        
                            /* ================================
                            * 5. ANSWERS
                            * ================================ */
                            if (!empty($q['answer'])) {
                                foreach ($q['answer'] as $ans) {
                                    if ($ans['changeContent'] == 'delete') {
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
                                $this->answerDeleteOut=$answerUpdate;
                        
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
                    Questions::upsert($questionUpdate, ['id'], ['question','order','section_id','updated_at']);

                if ($questionDelete)
                    Questions::whereIn('id', $questionDelete)->delete();

                if ($answerUpdate)
                    Answers::upsert($answerUpdate, ['id'], ['answer','value','updated_at','question_id']);
                    
                if ($answerDelete)
                    Answers::whereIn('id', $answerDelete)->delete();

                $this->msg='Form berhasil diperbarui';
                $this->status = true;
                $this->redirect = route('admin.form.detail', $this->form ? $this->form->id : 2);
            });
            return response()->json([
                'success' => $this->status,
                'message' => $this->msg,
                //'file'=>$this->formDetailStatusRaw,
                'redirect' => $this->redirect,
            ]);
        } catch (\Throwable $e) {
            
            return response()->json([
                'success' => false,
                'message' => 'gagal update form ',
                //'test'=> $this->formDetailStatusRaw,
                //'line'=> $e->getLine(),
            ]);
        }
    }

    public function delete($id)
    {
        try{
            $form = Form::find($id);

            if (!$form) {
                session()->flash('error', 'Form tidak ditemukan.');
                return redirect()->route('admin.forms');
            }

            $form->delete();

            session()->flash('success', 'Form berhasil dihapus.');
            return redirect()->route('admin.forms');
        }catch(\Throwable $e){
            session()->flash('error', $e->getMessage());
             return response()->json([
                'success' => false,
                'message' => 'gagal delete data',
            ], 500);
        }
    }

    public function render()
    {
        return view('livewire.admin.form-detail');
    }
}

