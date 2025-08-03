<?php

namespace App\Livewire;

use App\Models\Form;
use App\Models\Answers;
use Livewire\Component;
use Illuminate\Support\Facades\DB;
use App\Models\Responses as Response;
use App\Models\Responden as Responden;
use App\Exports\ResponsesExport;
use Maatwebsite\Excel\Facades\Excel;

class Dashboard extends Component
{
    public $forms;
    public $responseData;
    public $responden;
    public $selectedPlacement = 'pre-test-website';
    public $defaultSelectedForm;
    public $selectedForm = null;
    public $selectedFormName = null;
    public $confirmDelete;
    
    public $showAllScoring = false;
    
    public $allResponses='';
    protected $listeners = ['refreshComponent' => 'loadData'];

    public $uniqueFormId;
    public $uniqueAnswers;

    public $groupedResponses = [];

    public function mount()
    {
        try{
            $this->responden = Responden::count();
            $this->forms = Form::pluck('id','form_name');
            $this->calculateTotalResponses();
            $this->allResponses = Response::with(['responden', 'answer.question.section.form'])->get();
            $this->uniqueFormId = Response::whereHas('answer.question.section.form')
            ->distinct()
            ->pluck('form_id');
            //dd($this->uniqueFormId);

            $this->uniqueAnswers = Answers::whereHas('question.section.form', function ($query) {
                $query->whereIn('id', $this->uniqueFormId);
            })->with('question.section.form')
                ->get()
                ->groupBy(fn($answer) => $answer->question->section->form->id)
                ->map(fn($answers) => $answers->pluck('answer')->unique()->values());
            $this->loadData();
        }catch(\Exception $e){
            session()->flash('error', $e->getMessage());
        }
    }

    public function toggleShowAllScoring(){
        $this->showAllScoring = !$this->showAllScoring;
    }

    public  function calculateTotalResponses()
    {
        try{
            $form_ids = Form::whereIn('placement', [
                    'pre-test-website', 'post-test-website',
                    'pre-test-emodul', 'post-test-emodul'
                ])
                ->get()
                ->groupBy('placement')
                ->map(fn($group) => $group->pluck('id')->toArray()) // Ambil semua ID dalam bentuk array
                ->toArray();
            
            $form_id_values = array_merge(...array_values($form_ids));
            // Pisahkan ID berdasarkan placement
            $website_form_id = array_intersect_key($form_ids,array_flip(['pre-test-website', 'post-test-website']));
            $emodul_form_id = array_intersect_key($form_ids,array_flip(['pre-test-emodul', 'post-test-emodul']));
            
            $responses = Response::whereIn('form_id', $form_id_values)
                ->groupBy(DB::raw("COALESCE(responden_id, uuid)"), 'form_id', 'attempt')
                ->selectRaw('COALESCE(responden_id, uuid) as identifier, form_id, attempt, COUNT(*) as total')
                ->get()
                ->groupBy(fn($r) => $r->form_id ?? 'unknown');

            //dd($responses);
      
            $this->groupedResponses = collect([
                "website" => [
                    "responden" => collect([
                        "count" => $responses->filter(fn($r) => $r->contains(fn($item) => collect($website_form_id)->flatten()->contains($item->form_id)))->flatten()->unique('identifier')->count(),
                        "email" =>  $responses->map(fn($group) => $group->filter(fn($r) => collect($website_form_id)->flatten()->contains($r->form_id) && $r->attempt != 0))->flatten()->unique('identifier')->count(),
                        "no-email" => $responses->map(fn($group) => $group->filter(fn($r) => collect($website_form_id)->flatten()->contains($r->form_id) && $r->attempt == 0))->flatten()->unique('identifier')->count(),
                    ]),
                    "responses" => collect([
                        "count" => $responses->filter(fn($r) => $r->contains(fn($item) => collect($website_form_id)->flatten()->contains($item->form_id)))->flatten()->count(),
                        "pre-test" => collect([
                            "count" => collect($form_ids['pre-test-website'] ?? [])->map(fn($id) => $responses->get($id, collect()))->flatten()->count(),
                            "email" => collect($form_ids['pre-test-website'] ?? [])->map(fn($id) => $responses->get($id, collect()))->flatten()->where('attempt','!=', 0)->count(),
                            "no-email" => collect($form_ids['pre-test-website'] ?? [])->map(fn($id) => $responses->get($id, collect()))->flatten()->where('attempt', 0)->count(),
                        ]),
                        "post-test" => collect([
                            "count" => collect($form_ids['post-test-website'] ?? [])->map(fn($id) => $responses->get($id, collect()))->flatten()->count(),
                            "email" => collect($form_ids['post-test-website'] ?? [])->map(fn($id) => $responses->get($id, collect()))->flatten()->where('attempt','!=', 0)->count(),
                            "no-email" => collect($form_ids['post-test-website'] ?? [])->map(fn($id) => $responses->get($id, collect()))->flatten()->where('attempt', 0)->count(),
                        ]),
                    ])
                ],
                "emodul" => [
                    "responden" => collect([
                        "count" => $responses->filter(fn($r) => $r->contains(fn($item) => collect($emodul_form_id)->flatten()->contains($item->form_id)))->flatten()->unique('identifier')->count(),
                        "email" =>  $responses->map(fn($group) => $group->filter(fn($r) => collect($emodul_form_id)->flatten()->contains($r->form_id) && $r->attempt != 0))->flatten()->unique('identifier')->count(),
                        "no-email" => $responses->map(fn($group) => $group->filter(fn($r) => collect($emodul_form_id)->flatten()->contains($r->form_id) && $r->attempt == 0))->flatten()->unique('identifier')->count(),
                    ]),
                    "responses" => collect([
                        "count" => $responses->filter(fn($r) => $r->contains(fn($item) => collect($emodul_form_id)->flatten()->contains($item->form_id)))->flatten()->count(),
                        "pre-test" => collect([
                            "count" => collect($form_ids['pre-test-emodul'] ?? [])->map(fn($id) => $responses->get($id, collect()))->flatten()->count(),
                            "email" => collect($form_ids['pre-test-emodul'] ?? [])->map(fn($id) => $responses->get($id, collect()))->flatten()->where('attempt', '!=', 0)->count(),
                            "no-email" => collect($form_ids['pre-test-emodul'] ?? [])->map(fn($id) => $responses->get($id, collect()))->flatten()->where('attempt', 0)->count(),
                        ]),
                        "post-test" => collect([
                            "count" => collect($form_ids['post-test-emodul'] ?? [])->map(fn($id) => $responses->get($id, collect()))->flatten()->count(),
                            "email" => collect($form_ids['post-test-emodul'] ?? [])->map(fn($id) => $responses->get($id, collect()))->flatten()->where('attempt','!=', 0)->count(),
                            "no-email" => collect($form_ids['post-test-emodul'] ?? [])->map(fn($id) => $responses->get($id, collect()))->flatten()->where('attempt', 0)->count(),
                        ]),
                    ])
                ],
            ]);
        }catch(\Exception $e){
            session()->flash('error', $e->getMessage());
        }
    }

    public function loadData()
    {
        try {
            $query = Response::with(['responden', 'answer.question.section.form']);

            if ($this->selectedPlacement && $this->selectedPlacement !== '') {
                $query->whereHas('answer.question.section.form', function ($q) {
                    $q->where('placement', $this->selectedPlacement);
                });
            }

            if ($this->selectedForm && $this->selectedForm !== '') {
                $query->whereHas('answer.question.section.form', function ($q) {
                    $q->where('id', $this->selectedForm);
                });

                $this->selectedFormName = collect($this->forms)->flip()->get((int) $this->selectedForm);
            } else {
                $this->selectedFormName = null;
            }
            
            $this->responseData = $query->get();
            //dd($this->response); // Reset index array agar tetap rapih
                
        } catch (\Exception $e) {
            session()->flash('error', $e->getMessage());
            $this->responseData = collect();
        }
    }

    public function exportExcel($type, $formId)
    {
        if ($type === 'response') {
            $data = Response::with(['responden', 'answer.question'])
            ->whereHas('form', fn($q) => $q->where('id',(int) $formId))
            ->get();
            $viewName = 'exports.responses';
        }else if ($type === 'rekap') {
            $data = Response::with(['responden', 'answer.question.section.form'])->get();
            $viewName = 'exports.responses-rekap';
        } else if($type === 'scoring') {
            $data = Response::with(['responden', 'answer.question.section.form'])->get();
            $viewName = 'exports.scoring';
        } else {
            return abort(404, 'Form type not found');
        }
        return Excel::download(new ResponsesExport($data, $viewName), "{$type}-{$formId}_responses.xlsx");
    }

    public function deleteResponse($formId)
    {
        try {
            if($this->confirmDelete && strtoLower($this->confirmDelete) === 'hapus data response') {
                Response::where('form_id', $formId)->delete();
                session()->flash('success', 'Response berhasil dihapus.');
                return redirect()->route('dashboard');
            }else{
                session()->flash('error', 'Anda harus mengetikkan "hapus data response" untuk menghapus semua responden.');
                return;
            }
        } catch (\Exception $e) {
            session()->flash('error', $e->getMessage());
        }
    }

    public function render()
    {
        return view('livewire.dashboard');
    }
}
