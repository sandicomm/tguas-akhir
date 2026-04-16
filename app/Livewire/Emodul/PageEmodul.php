<?php

namespace App\Livewire\Emodul;

use Livewire\Component;
use App\Models\Emodul as EmodulModel;
use Barryvdh\DomPDF\Facade\Pdf;

class PageEmodul extends Component
{
    public $emodulAll;

    public function mount()
    {
        $this->emodulAll = EmodulModel::all();
        $path = $this->emodulAll->first()['file_path'];
        if($this->emodulAll->count() < 1){
            return route('emodul.preveiw', ['url'=> $path]);
        }
    }

    public function render()
    {
        if($this->emodulAll->count() > 1){
            $url = null;
            return view('livewire.pageEmodul.emodul-page',compact('url'))->layout('layouts.page.listEmodul');

        }
        //===== blok ini diganti dengan yg di mount() 
        else {
            $path = $this->emodulAll->first()['file_path'];
            

            // ✅ REDIRECT YANG BENAR DI LIVEWIRE 3
            $this->redirectRoute('emodul.preview', [
                'url' => base64_encode($path)
            ], navigate: true);
        }
        //==========================================
        // ✅ render HARUS tetap return view
        return view('livewire.pageEmodul.emodul-page', [
            'url' => null
        ])->layout('layouts.page.listEmodul');
    }
}
