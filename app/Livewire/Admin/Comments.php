<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use App\Models\Comments as CommentModel;
use Dom\Comment;

class Comments extends Component
{
    public $parent_id = null;
    public $comment, $editingId;
    public $state; // 'reply' atau 'edit'
    public $showAllComments = true; // Admin biasanya ingin lihat semua

    public $commentId; // Untuk modal hapus
    public bool $isModalOpen = false;

    protected $rules = [
        'comment' => 'required|string|max:255',
    ];

    public function setStatsAction($id, $action)
    {
        $this->commentId = $id;
        if($action == 'delete') {
            $this->isModalOpen = true;
        }
    }

    public function store()
    {
        $this->validate();

        // Admin selalu memakai nama Admin dan is_admin true
        CommentModel::create([
            'name' => "Admin",
            'comment' => $this->comment,
            'parent_id' => $this->parent_id,
            'is_admin' => true,
        ]);

        $this->reset(['comment', 'parent_id', 'editingId', 'state']);
        session()->flash('success', 'Balasan Admin berhasil dikirim!');
    }

    public function update()
    {
        $this->validate();

        $comment = CommentModel::findOrFail($this->editingId);
        
        // Proteksi tambahan: hanya bisa edit jika itu milik admin
        if ($comment->is_admin) {
            $comment->update([
                'comment' => $this->comment,
            ]);
            session()->flash('success', 'Komentar berhasil diperbarui!');
        }

        $this->reset(['comment', 'editingId', 'state']);
    }

    public function delete($id)
    {
        CommentModel::findOrFail($id)->delete();
        $this->isModalOpen = false;
        session()->flash('success', 'Komentar berhasil dihapus!');
    }

    // Fungsi untuk memicu form balasan (Reply)
    public function setReply($id)
    {
        $this->reset(['comment']);
        $this->state = 'reply';
        $this->editingId = $id;
        $this->parent_id = $id;
    }

    // Fungsi untuk memicu form edit (Edit tulisan admin)
    public function setEdit($id)
    {
        $comment = CommentModel::findOrFail($id);
        if($comment->is_admin) {
            $this->state = 'edit';
            $this->editingId = $id;
            $this->comment = $comment->comment;
            $this->parent_id = null; // Reset parent_id karena ini edit, bukan reply
        }
    }

    public function cancelAction()
    {
        $this->reset(['comment', 'parent_id', 'editingId', 'state']);
    }

    public function render()
    {
        // Gunakan get() atau paginate() sesuai kebutuhan
        $commentsData = CommentModel::with('allReplies.parent')->where('parent_id', null)->get();
        return view('livewire.admin.comments', ['comments' => $commentsData]);
    }
}