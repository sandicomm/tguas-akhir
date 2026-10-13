<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Comments;
use App\Models\Webpage;
use App\Models\Form;

class PageInteraktif extends Component
{
    public $comments;
    public $name;
    public $comment;
    public $parent_id = null;
    public $showAllComments = false;

    public $webpage;
    public $param;
    public $mustFill;

    public function mount()
    {
        session(['page_visited'=> 'interaktif']);
        $this->param = session('page_visited');
        session(['page_visit_fix'=> 'interaktif']);
   
        if ($this->param == 'emodul') {
            return redirect()->route('emodul');
        } 
        
        if ($this->param != 'interaktif') {
            return redirect()->route('home');
        }

        $mustFill = Form::where('placement', 'post-test-interaktif')->pluck('must_fill');

        $this->comments = Comments::all();
        $this->webpage = Webpage::where('id', 'not like', '%prolog%')->get();
        
    }

    public function render()
    {
        return view('livewire.pageInteraktif.interaktif-page')->layout('layouts.page.mediaInteraktif');      
    }
}
