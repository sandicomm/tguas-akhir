<?php

namespace App\Livewire\Form;

use Livewire\Component;
use App\Models\Form;

class FormTest extends Component
{
    public $form;
    public $sections;
    public $placement;

    public function mount($placement)
    {
        $this->form = Form::with([ 'sections.questions' => function ($q) {
                        $q->with(['answers', 'inputType']);
                    }
                ]) // Eager load sections, questions, and answers
            ->where('placement', $placement) // Filter berdasarkan form_type
            ->first(); // Ambil form berdasarkan tipe

        $this->sections = collect();
        $page= session('page_visited');
        
        if (!$this->form) {
            if($page=='interaktif'){
                return redirect(route('interaktif'))->with('success', 'Tidak Ada Form');
            }else if($page == 'emodul'){
                return redirect(route('emodul'))->with('success', 'Tidak Ada Form');
            }

        } else if($this->form->sections->isNotEmpty()) {
            foreach ($this->form->sections as $section) {
                foreach ($section->questions as $question) {
                    $question->input_type = $question->inputType->input_type ?? null;
                    unset($question->inputType); // opsional: biar nggak ikut ke JSON
                }
            }
            $this->sections = $this->form->sections->sortBy('order');

        }
    }

    public function render()
    {
        return view('livewire.formTest.form-test')->layout('layouts.form');
    }
}
