<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Webpage as Page;

class PrologController extends Component
{
    public $webpage;
    public $param;
    
    public function mount()
    {
        $this->param = 'prolog-web';
        $this->webpage = Page::where('id', 'like', '%prolog-web%')->get();
    }

    public function render()
    {
        return view('livewire.prolog-controller')->layout('layouts.prolog');
    }
}