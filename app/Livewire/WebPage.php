<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithFileUploads;
use Illuminate\Support\Facades\Storage;
use App\Models\Media;

class WebPage extends Component
{

    public function render()
    {
        return view('livewire.web-page')
            ->layout('layouts.pageEdit');
    }
}
