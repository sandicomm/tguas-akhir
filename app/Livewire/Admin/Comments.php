<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use App\Models\Comments as CommentModel;

use Mews\Purifier\Facades\Purifier;

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

        $safeComment = Purifier::clean($this->comment);
        // Admin selalu memakai nama Admin dan is_admin true
        CommentModel::create([
            'name' => "Admin",
            'comment' => $safeComment,
            'parent_id' => $this->parent_id,
            'is_admin' => true,
        ]);

        $this->reset(['comment', 'parent_id', 'editingId', 'state']);
        session()->flash('success', 'Balasan Admin berhasil dikirim!');
    }

    public function update()
    {
        $this->validate();

        $commentFind = CommentModel::find($this->editingId);

        if (!$commentFind) {
            $this->reset(['comment', 'parent_id', 'editingId', 'state']);
            session()->flash('error', 'Comment sepertinya sudah tidak ada atau telah dihapus oleh pengguna lain!');
            return;
        }

        $comment = CommentModel::findOrFail($this->editingId);
        $safeComment = Purifier::clean($this->comment);
        // Proteksi tambahan: hanya bisa edit jika itu milik admin
        if ($comment->is_admin) {
            $comment->update([
                'comment' => $safeComment,
            ]);
            session()->flash('success', 'Komentar berhasil diperbarui!');
        }

        $this->reset(['comment', 'editingId', 'state']);
    }

    public function delete($id)
    {
        $commentFind = CommentModel::find($id);

        if (!$commentFind) {
            $this->reset(['comment', 'parent_id', 'editingId', 'state']);
            $this->isModalOpen = false;
            session()->flash('error', 'Comment tidak ditemukan.');
            return;
        }

        $commentFind->delete();
        $this->isModalOpen = false;
        session()->flash('success', 'Komentar berhasil dihapus!');
    }

    // Fungsi untuk memicu form balasan (Reply)
    public function setReply($id)
    {
        $comment = CommentModel::find($id);

        if(!$comment){
            session()->flash('error', 'Comment tidak ditemukan.');
            return;
        }
        
        $this->reset(['comment']);
        $this->state = 'reply';
        $this->editingId = $id;
        $this->parent_id = $id;
    }

    // Fungsi untuk memicu form edit (Edit tulisan admin)
    public function setEdit($id)
    {
        $comment = CommentModel::find($id);

        if(!$comment){
            session()->flash('error', 'Comment tidak ditemukan.');
            return;
        }

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