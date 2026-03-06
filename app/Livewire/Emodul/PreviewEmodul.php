<?php

namespace App\Livewire\Emodul;

use Livewire\Component;
use App\Models\Emodul as EmodulModel;
use Barryvdh\DomPDF\Facade\Pdf;

class PreviewEmodul extends Component
{
    public $path;

    public function mount($url)
    {
        $this->path = base64_decode($url);
    }

    public function render()
    {
        return view('livewire.pageEmodul.pdf.emodul')->layout('layouts.page.mediaEmodul');
    }
}