<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Comments;
use App\Models\Webpage;

class PageInteraktif extends Component
{
    public $comments;
    public $name;
    public $comment;
    public $parent_id = null;
    public $showAllComments = false;

    public $webpage;
    public $param;

    public function mount()
    {
        $this->param = session('page_visited');
        if ($this->param == 'emodul') {
            return redirect()->route('emodul');
        } 
        
        if ($this->param != 'interaktif') {
            return redirect()->route('home');
        }

        $this->comments = Comments::all();
        $this->webpage = Webpage::where('id', 'not like', '%prolog%')->get();
        
    }

    public function render()
    {
        return view('livewire.pageInteraktif.interaktif-page')->layout('layouts.page.mediaInteraktif');      
    }
}
