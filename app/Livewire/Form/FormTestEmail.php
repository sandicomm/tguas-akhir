<?php

namespace App\Livewire\Form;

use Livewire\Component;
use App\Models\Form;

class FormTestEmail extends Component
{
    public $formMustFill;
    public $placement;
    public function mount($placement)
    {

        $form = Form::where('placement', $placement)->value('must_fill');
        $this->placement = $placement;// Mengambil satu data saja
        $this->formMustFill = $form;// Mengambil satu data saja
    }

    public function render()
    {
        return view('livewire.formTest.form-test-email')->layout('layouts.form');
    }
}
