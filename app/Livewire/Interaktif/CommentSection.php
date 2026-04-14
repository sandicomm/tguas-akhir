<?php

namespace App\Livewire\Interaktif;

use Livewire\Component;
use App\Models\Comments;
use Mews\Purifier\Facades\Purifier;

class CommentSection extends Component
{
    public $comments;
    public $name;
    public $comment;
    public $parent_id = null;
    public $showAllComments = false;

    // Rules validasi dipisah agar lebih rapi
    protected $rules = [
        'name' => 'required|string|max:30',
        'comment' => 'required|string|max:255',
        'parent_id' => 'nullable|exists:comments,id',
    ];

    public function store()
    {
        try {
            $this->validate();

            $safeName = Purifier::clean($this->name);
            $safeComment = Purifier::clean($this->comment);
            
            Comments::create([
                'name' => $safeName,
                'comment' => $safeComment,
                'parent_id' => $this->parent_id,
            ]);

            $this->showAllComments = true;
            
            // Reset input dan kembalikan parent_id ke null (form utama muncul lagi)
            $this->reset(['name', 'comment', 'parent_id']);
            
            session()->flash('success', 'Komentar berhasil ditambahkan!');
        } catch (\Exception $e) {
            session()->flash('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function setReply($id)
    {
        $this->parent_id = $id;
        // Opsional: Reset input field saat pindah reply agar bersih
        $this->reset(['name', 'comment']);
    }

    public function cancelReply()
    {
        $this->parent_id = null;
        $this->reset(['name', 'comment']);
    }

    public function toogleShowAllComment()
    {
        $this->showAllComments = !$this->showAllComments;
    }

    public function render()
    {
        // Pastikan eager loading 'parent' ada di relasi allReplies di Model
        $this->comments = Comments::with('allReplies.parent')->where('parent_id', null)->get();
        return view('livewire.comment-section');
    }
}