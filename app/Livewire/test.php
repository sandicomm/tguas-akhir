<?php

namespace App\Livewire;

use App\Models\Form;
use App\Models\Responses as Response;
use App\Models\Responden as Responden;
use Livewire\Component;

class Dashboard extends Component
{
    public $forms;
    public $response;
    public $responden;
    public $selectedPlacement = 'pre-test-website';
    public $selectedForm = '';

    public $allResponses='';
    protected $listeners = ['refreshComponent' => 'loadData'];

    public $totalResponses=0;
    public $totalRespondenWebsite=0;
    public $totalRespondenEmodul=0;
    public $totalResponseWebsite=0;
    public $totalResponseEmodul=0;

    public function mount()
    {
        $this->responden = Responden::count();
        $this->forms = Form::pluck('form_name');
        $this->loadData();

        $this->allResponses = Response::with(['responden', 'answer.question.section.form'])->get();
        //dd($this->allResponses->pluck('answer.question.section.form.form_name'));
        // Ambil ID Form hanya sekali
        $form_ids = Form::whereIn('placement', [
            'pre-test-website', 'post-test-website',
            'pre-test-emodul', 'post-test-emodul'
        ])->pluck('id', 'placement');

        // Pisahkan ID berdasarkan placement
        $website_form_id = $form_ids->only(['pre-test-website', 'post-test-website'])->values();
        $emodul_form_id = $form_ids->only(['pre-test-emodul', 'post-test-emodul'])->values();
            
        // Hitung total response dengan pendekatan lebih efisien
        $this->totalResponseWebsite = Response::whereIn('form_id', $website_form_id)
            ->groupBy('responden_id', 'form_id','attempt')
            ->select('attempt')
            ->get()
            ->count();
            //dd($this->totalResponseWebsite);
        $this->totalResponseEmodul = Response::whereIn('form_id', $emodul_form_id)
            ->groupBy('responden_id', 'form_id','attempt')
            ->select('attempt')
            ->get()
            ->count();
    }

    public function updatePlacement()
    {
        $this->loadData();
    }

    public function updateForm()
    {
        $this->loadData();
    }

    public function loadData()
    {
        //dd($this->selectedPlacement, $this->selectedForm);
        $query = Response::with(['responden', 'answer.question.section.form']);

        if ($this->selectedPlacement) {
            $query->whereHas('answer.question.section.form', function ($q) {
                $q->where('placement', $this->selectedPlacement);
            });
        }

        if ($this->selectedForm) {
            $query->whereHas('answer.question.section.form', function ($q) {
                $q->where('form_name', $this->selectedForm);
            });
        }

        $this->response = $query->get();
        //dd($this->response);
        logger()->info('Data Response:', $this->response->toArray());
    }
    
    public function render()
    {
        return view('livewire.dashboard');
    }
}
