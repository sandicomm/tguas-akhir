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

use Livewire\WithFileUploads;
use Illuminate\Support\Facades\File;

use App\Models\File as FileMedia;

use Illuminate\Support\Str;

class FormDetail extends Component
{
    use WithFileUploads;

    public $form;
    public $formPlacement;
    public $sectionMaxID;
    public $questionMaxID;
    public $answerMaxID;
    public $test;
    public $file;
    public $answerDeleteOut = [];
    
    public function mount($id)
    {
        try{
            $this->file = FileMedia::where('id', 'like', 'form-%')->get();
            $this->formPlacement = Form::pluck('placement')->unique();

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
                                            'input_type'=>"pilgan",
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
            
            DB::transaction(function () use ($request) {
                //------------- PROSES FILE ----------------
                $urlMap = session('urlMap', []);
                $isMultipart = str_contains(
                    $request->header('Content-Type'),
                    'multipart/form-data'
                );

                if($isMultipart){
                    if (!$request->filled('form_id')) {
                        throw new \Exception('form_id wajib untuk upload file');
                    }
                    $requestFile = $request->input('items', []);
                    
                    foreach ($requestFile as $index => $item) {
                        // Validasi masing-masing item
                        \Validator::make($item, [
                            'id' => 'required|string',
                            'type'=>'required|string',
                            'filetype'=>'nullable|string'
                        ])->validate();
    
                        if($request->hasFile("items.$index.file") && $item['type'] === 'file' && $item['action'] === 'add'){
                            $original = pathinfo($request->file("items.$index.file")->getClientOriginalName(), PATHINFO_FILENAME);
                            $ext = $request->file("items.$index.file")->getClientOriginalExtension();
    
                            // singkatkan nama jika terlalu panjang
                            $original = Str::limit($original, 50, '');
                            $original = preg_replace('/[^A-Za-z0-9_\-]/', '_', $original);
    
                            $filename = "form-".Str::uuid() . '_' . $original . '.' . $ext;
                            $request->file("items.$index.file")->move(public_path('media'), $filename);
    
                            $newUrl = asset('media/' . $filename);
                            $urlMap[$item['id']] = $newUrl;
    
                            \App\Models\File::updateOrCreate(
                                ['id' => $filename],
                                ['type'=>$item['filetype']]
                            );
                            $this->answerDeleteOut = 'urlMap' . $item['id'] . $newUrl;
    
                            // HAPUS dari array
                            unset($requestFile[$index]);
                        }
                    }
                }else{
          
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
                    //---------------- PROSES FORM ------------------
                    if ($request->batch_number == 0 && in_array($request->changeContent, ['add','update'])) {
    
                        $oneAttempt = $request->collect_email == 0 ? 0 : $request->one_attempt;

                        if ($request->placement !== 'disable') {
                            Form::where('placement', $request->placement)
                                ->where('id', '!=', $request->form_id) // Pastikan id lain
                                ->update(['placement' => 'disable']);
                        }

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
                                $image = $q['image'] ?? '';
                               
                                if ($q['changeContent'] === 'delete') {
                                    $questionDelete[] = $q['id'];
                                    continue;
                                }
    
                                $inputType = match ($q['input_type']) {
                                    'text' => 1,
                                    'pilgan' => 3,
                                };

                                // Jika ada URL lama yg sudah diubah di map, ganti dgn URL baru
                                foreach ($urlMap as $idMedia => $urlMedia) {
                                    if (str_contains($image, $idMedia)) {
                                        $image = str_replace($idMedia, $urlMedia, $image);
                                        break;
                                    }
                                }
                                $q['image'] = $image;
    
                                $questionUpdate[] = [
                                    'id' => $q['id'],
                                    'section_id' => $sid,
                                    'image' => $q['image'],
                                    'question' => $q['question'],
                                    'order' => $q['order'],
                                    'input_type' => $inputType,
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
                                        $image = $ans['image'] ?? '';
                                        // Jika ada URL lama yg sudah diubah di map, ganti dgn URL baru
                                        foreach ($urlMap as $idMedia => $urlMedia) {
                                            if (str_contains($image, $idMedia)) {
                                                $image = str_replace($idMedia, $urlMedia, $image);
                                                break;
                                            }
                                        }
                                        
                                        $ans['image'] = $image;
    
                                        $answerUpdate[] = [
                                            'id' => $ans['id'],
                                            'question_id' => $q['id'],
                                            'answer' => $ans['answer'],
                                            'image' => $ans['image'],
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
                        Questions::upsert($questionUpdate, ['id'], ['question','order','input_type','image','section_id','updated_at']);
    
                    if ($questionDelete)
                        Questions::whereIn('id', $questionDelete)->delete();
    
                    if ($answerUpdate)
                        Answers::upsert($answerUpdate, ['id'], ['answer','value','updated_at','image','question_id']);
                        
                    if ($answerDelete)
                        Answers::whereIn('id', $answerDelete)->delete();

                    //----- KODE PERIKSA APAKAH IMAGE MASIH DIGUNAKAN DI QUESTION/ANSWER KLO GK DIGUNAKAN MAKA HAPUS-----
                    $fileDb = FileMedia::where('id', 'like', "form-%")->pluck('id');
                    foreach ($fileDb as $filename) {
                        $usedInQuestion = Questions::where('image', 'like', "%$filename%")->exists();
                        $usedInAnswer   = Answers::where('image', 'like', "%$filename%")->exists();

                        $filePath = public_path('media/' . $filename);

                        if (!$usedInQuestion && !$usedInAnswer && file_exists($filePath)) {
                            File::delete($filePath);
                            FileMedia::where('id', $filename)->delete();
                        }
                    }
                }
                session(['urlMap' => $urlMap]);
            });
            return response()->json([
                'success' => true,
                'message' => 'Batch berhasil diproses',
                'redirect' => route('admin.form.detail', $this->form ? $this->form->id : 2),
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'gagal update form' . $e->getMessage(),
                'line'=> $e->getLine(),
                'file'=> $e->getFile(),
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

