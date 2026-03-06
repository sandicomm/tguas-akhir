<?php

namespace App\Livewire\Interaktif;

use Livewire\Component;
use App\Models\Media;
use App\Models\Webpage as Page;

class MediaController extends Component
{
    // Property public ini akan otomatis terbaca di Blade
    public $media;
    public $webpage;
    public $type; 

    // mount() menerima parameter dari URL {type}
    public function mount($type)
    {
        // Kita simpan parameter URL ke property public
        $this->type = ($type === 'poster') ? 'image' : 'video';
        $this->webpage = Page::where('id', 'like', '%footer%')->get();
        // Kita isi data media
        $this->media = Media::where('type', $this->type)->get();
    }

    public function render()
    {
        // Livewire akan otomatis mengirim $this->media dan $this->type ke view
        // Sesuaikan dengan letak file Anda
        $viewName = ($this->type === 'image') 
                    ? 'livewire.pageInteraktif.poster_page' 
                    : 'livewire.pageInteraktif.video_page';

        return view($viewName)->layout('layouts.page.mediaInteraktif');
    }
}
    