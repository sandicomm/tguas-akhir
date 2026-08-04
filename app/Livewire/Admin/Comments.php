<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use App\Models\Comments as CommentModel;

use Mews\Purifier\Facades\Purifier;

use Illuminate\Support\Facades\Auth;
use App\Models\EditFormVisited;
use App\Models\WebpageVisited;

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

    public function mount()
    {
        try{
            $userId = Auth::id();
            EditFormVisited::where('user_id', $userId)->delete();
            WebpageVisited::where('user_id', $userId)->delete();
        }catch(\Exception $e){
            //session()->flash('error','error muat halaman.');
            $this->dispatch('error-alert', message: 'error muat halaman.');
        }
    }

    public function setStatsAction($id, $action)
    {
        $this->commentId = $id;
        if($action == 'delete') {
            $this->isModalOpen = true;
        }
    }

    public function store()
    {
        try{
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
            //session()->flash('success', 'Balasan Admin berhasil dikirim!');
            $this->dispatch('success-alert', message: 'Balasan Admin berhasil dikirim!');
        }catch(\Exception $e){  
            //session()->flash('error', 'error tambah data');
            $this->dispatch('error-alert', message: 'error tambah data');
        }
    }

    public function update()
    {
        try{
            $this->validate();
    
            $commentDb = CommentModel::find($this->editingId);
    
            if (!$commentDb) {
                $this->reset(['comment', 'parent_id', 'editingId', 'state']);
                //session()->flash('error', 'Comment sepertinya sudah tidak ada atau telah dihapus oleh pengguna lain!');
                $this->dispatch('error-alert', message: 'Comment sepertinya sudah tidak ada atau telah dihapus oleh pengguna lain!');
                return;
            }
    
            $safeComment = Purifier::clean($this->comment);
            // Proteksi tambahan: hanya bisa edit jika itu milik admin
            if ($commentDb->is_admin) {
                $commentDb->update([
                    'comment' => $safeComment,
                ]);
                //session()->flash('success', 'Komentar berhasil diperbarui!');
                $this->dispatch('success-alert', message: 'Komentar berhasil diperbarui!');
            }
    
            $this->reset(['comment', 'editingId', 'state']);
        }catch(\Exception $e){  
            //session()->flash('error', 'error update data');
            $this->dispatch('error-alert', message: 'error update data');
        }
    }

    public function delete($id)
    {
        try{
            $commentDb = CommentModel::find($id);
    
            if (!$commentDb) {
                $this->reset(['comment', 'parent_id', 'editingId', 'state']);
                $this->isModalOpen = false;
                //session()->flash('error', 'Comment tidak ditemukan.');
                $this->dispatch('error-alert', message: 'Comment tidak ditemukan.');
                return;
            }
    
            $commentDb->delete();
            $this->isModalOpen = false;
            //session()->flash('success', 'Komentar berhasil dihapus!');
            $this->dispatch('success-alert', message: 'Komentar berhasil dihapus!');
        }catch(\Exception $e){
            //session()->flash('error', 'error delete data');
            $this->dispatch('error-alert', message: 'error delete data');
        }
    }

    // Fungsi untuk memicu form balasan (Reply)
    public function setReply($id)
    {
        $commentDb = CommentModel::find($id);

        if(!$commentDb){
            //session()->flash('error', 'Comment tidak ditemukan.');
            $this->dispatch('error-alert', message: 'Comment tidak ditemukan.');
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
        $commentDb = CommentModel::find($id);

        if(!$commentDb){
            //session()->flash('error', 'Comment tidak ditemukan.');
            $this->dispatch('error-alert', message: 'Comment tidak ditemukan.');
            return;
        }

        if($commentDb->is_admin) {
            $this->state = 'edit';
            $this->editingId = $id;
            $this->comment = $commentDb->comment;
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