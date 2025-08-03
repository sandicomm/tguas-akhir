<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Comments as CommentsModel;

class Comments extends Component
{
    public $parent_id = null;
    public $name, $comment, $editingId;
    public $state;
    public $comments;

    public function store($state)
    {
        if($state == 'new'){
            $this->parent_id = null;
            //dd($state);
        }
        $this->validate([
            'comment' => 'required|string|max:255',
        ]);
        //dd($this->parent_id);
        CommentsModel::create([
            'name' => "Admin",
            'comment' => $this->comment,
            'parent_id' => $this->parent_id,
            'is_admin' => true, // karena ini dari halaman admin
        ]);

        // Reset form
        $this->reset(['name', 'comment', 'parent_id', 'state', 'editingId']);

        session()->flash('success', 'Comment successfully added!');
    }

    public function delete($id)
    {
        $comment = CommentsModel::findOrFail($id);
        $comment->delete();

        session()->flash('success', 'Comment successfully deleted!');
    }

    public function edit($id, $state)
    {
        $comment = CommentsModel::findOrFail($id);
        $this->editingId = $id;
        $this->state = $state;
        $this->name = $comment->name;
        $this->comment = $comment->comment;

        if($state == 'reply') {
            $this->reset(['name', 'comment']);
            $this->parent_id = $comment->id;
        }
    }

    public function setParent($id)
    {
        $this->parent_id = $id;
    }

    public function update()
    {
        $this->validate([
            'name' => 'required|string|max:50',
            'comment' => 'required|string|max:255',
        ]);

        $comment = CommentsModel::findOrFail($this->editingId);
        $comment->update([
            'name' => $this->name,
            'comment' => $this->comment,
        ]);

        $this->reset(['name', 'comment', 'editingId']);

        session()->flash('success', 'Comment successfully updated!');
    }

    public function render()
    {
        $this->comments = CommentsModel::all();
        return view('livewire.comments');
    }
}
