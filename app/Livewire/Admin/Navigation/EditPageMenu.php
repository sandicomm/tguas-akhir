<?php

namespace App\Livewire\Admin\Navigation;

use Livewire\Component;
use App\Models\WebpageVisited as WebpageVisited;
use Illuminate\Support\Facades\Auth;

class EditPageMenu extends Component
{

    public function resetVisited(){
        try{
            WebpageVisited::where('user_id', Auth::user()->id)->delete();
            return redirect()->route('admin.dashboard');
        }catch(\Exception $e){
            session()->flash('error', 'error reset visited');
        }
    }

    public function render()
    {
        return view('livewire.admin.navigation.edit-page-menu');
    }
}
