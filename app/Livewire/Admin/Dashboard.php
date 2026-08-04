<?php

namespace App\Livewire\Admin;

use App\Models\Form;
use Livewire\Component;
use App\Models\Responses as Response;
use App\Models\Responden as Responden;

use App\Exports\FormResponseSingleExport;
use Maatwebsite\Excel\Facades\Excel;

use Illuminate\Support\Facades\Auth;
use App\Models\EditFormVisited;
use App\Models\WebpageVisited;

class Dashboard extends Component
{
    public $forms;
    public $responseData;
    public $responden;
    public $selectedPlacement = 'pre-test-interaktif';
    public $defaultSelectedForm;
    public $selectedForm = null;
    public $selectedFormName = null;
    public $confirmDelete;
    
    public $showAllScoring = false;

    protected $listeners = ['refreshComponent' => 'loadData'];

    public $groupedResponses = [];
    public $groupedAllResponses=[];

    public $groupedResponsesForRekap=[];
    public $groupedResponsesForSingleForm=[];
    public $columns;
    public $cellMatrix;

    public $rekapScoring = [];

    // State untuk Modal Hapus Satuan
    public $isDeleteModalOpen = false;
    public $deleteConfirmText = ''; // Input text user untuk konfirmasi
    public $targetRespondenId;
    public $targetAttempt;
    public $targetFormId;

    public function mount()
    {
        try{
            $userId = Auth::id();

            EditFormVisited::where('user_id', $userId)->delete();
            WebpageVisited::where('user_id', $userId)->delete();

            $this->responden = Responden::count();
            $this->forms = Form::pluck('id','form_name');

            $this->loadData();
        }catch(\Exception $e){
            //session()->flash('error', 'error muat halaman');
            $this->dispatch('error-alert', message: 'error muat halaman');
        }
    }

    //---------------------- SINGLE FORM ------------------------------
    public function ResponseForSingleForm($responses)
    {
        try{
            $this->groupedResponsesForSingleForm = collect($responses)
                ->groupBy(fn ($r) => $r->question_id);
            
            $this->columns = collect($responses)
                ->map(function ($r) {
                    $keyBase = $r->email
                        ? 'email:' . $r->email
                        : 'uuid:' . $r->uuid;
    
                    return [
                        'email'      => $r->email,
                        'responden_id' => $r->responden_id,
                        'uuid'       => $r->uuid,
                        'attempt'    => $r->attempt,
                        'created_at' => $r->created_at,
                        'key'        => $keyBase . '-attempt:' . $r->attempt,
                    ];
                })
                ->groupBy(fn ($c) => $c['email'] ?? $c['uuid'])
                ->map(fn ($group) => $group->sortBy('attempt'))
                ->flatten(1)
                ->unique('key')
                ->sortBy(fn ($c) => $c['email'] ? 0 : 1) // email dulu, uuid belakang
                ->values();
    
            $this->cellMatrix = collect($responses)
            ->groupBy(fn ($r) => $r->question_id)
            ->map(function ($responsesPerQuestion) {
    
                return $responsesPerQuestion
                    ->groupBy(function ($r) {
                        $keyBase = $r->email
                            ? 'email:' . $r->email
                            : 'uuid:' . $r->uuid;
    
                        return $keyBase . '-attempt:' . $r->attempt;
                    });
            });
        }catch(\Exception $e){
            //session()->flash('error', 'error response single');
            $this->dispatch('error-alert', message: 'error response single');
        }
    }
    // -------------------------------------------------------------------------------------------

    public function loadData()
    {
        try {
            $query = Response::query()
                ->select([
                    'responses.id',
                    'responses.form_id',
                    'responses.attempt',
                    'responses.uuid',
                    'responses.created_at',

                    'answers.answer',
                    'answers.value',

                    'questions.id as question_id',
                    'questions.question',

                    'forms.form_name',
                    'forms.placement',

                    'respondens.email',
                    'respondens.id as responden_id',
                ])
                ->leftJoin('answers', 'answers.id', '=', 'responses.answer_id')
                ->leftJoin('questions', 'questions.id', '=', 'answers.question_id')
                ->leftJoin('sections', 'sections.id', '=', 'questions.section_id')
                ->leftJoin('forms', 'forms.id', '=', 'sections.form_id')
                ->leftJoin('respondens', 'respondens.id', '=', 'responses.responden_id');

            // 🔥 FILTER SEARCH
            if ($this->selectedPlacement) {
                $formId = Form::where('placement', $this->selectedPlacement)
                    ->orderBy('created_at')
                    ->value('id');

                if ($formId) {
             
                    $this->selectedForm = $formId;
                    $query->where('responses.form_id', $formId);
                }
            }
            
            if ($this->selectedForm) {
               
                $query->where('forms.id', $this->selectedForm);
            }

            // 🔥 DATA SEARCH
            $responses = $query->toBase()->get();
            if(!$responses->isEmpty()){
                $this->responseData = (object) [
                    'form_id'   => $responses->first()->form_id, 
                    'form_name' => $responses->first()->form_name
                ];
            }else{
                
                $this->responseData = null;
            }

            // 🔥 HANYA UNTUK SEARCH
            $this->ResponseForSingleForm($responses);
        
        } catch (\Throwable $e) {
            //session()->flash('error', 'error load data dashboard');
            $this->dispatch('error-alert', message: 'error load data dashboard');
            $this->responseData = null;
        }
    }
    
    public function export($formId)
    {   
        try{
            // Gunakan where('form_id') langsung lebih cepat daripada whereHas
            $data = Response::with([
                'responden',
                'answer.question.section.form'
            ])
            ->where('form_id', $formId)
            ->get();
    
            if ($data->isEmpty()) {
                //session()->flash('error', 'Data tidak ada.');
                $this->dispatch('error-alert', message: 'Data tidak ada.');
                return;
            }
    
            $formName = $data->first()->answer->question->section->form->form_name ?? 'Form';
            $fileName = "Rekap_Response_" . \Str::slug($formName) . ".xlsx";
    
            return Excel::download(
                new FormResponseSingleExport($data, $formName),
                $fileName
            );
        }catch(\Exception $e){
            //session()->flash('error', 'error export.');
            $this->dispatch('error-alert', message: 'error export');
        }
    }

    public function render()
    {
        return view('livewire.admin.dashboard');
    }
}
