<?php

namespace App\Livewire\Admin\Navigation;

use Livewire\Component;
use App\Models\WebpageVisited as WebpageVisited;

class Navigation extends Component
{
    public $webpageVisitedUser;

    public function mount()
    {
        try{
            $webpageVisit = WebpageVisited::with('user')->first();
            $this->webpageVisitedUser = $webpageVisit?->user?->name ?? null;
        }catch(\Exception $e){
            session()->flash('error muat navigation');
        }
    }

    public function render()
    {
        return view('livewire.admin.navigation.navigation');
    }
}
