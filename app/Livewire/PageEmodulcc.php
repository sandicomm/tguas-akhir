<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Emodul as EmodulModel;

class PageEmodulcc extends Component
{
    public $emodulAll;

    public function mount()
    {
        $this->emodulAll = EmodulModel::all();
    }

    public function render()
    {
        return view('livewire.pageInteraktif.emodul-page')->layout('layouts.page.mediaEmodul');
    }
}
