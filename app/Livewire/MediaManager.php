<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithFileUploads;
use Illuminate\Support\Facades\Storage;
use App\Models\Media;

class MediaManager extends Component
{
    use WithFileUploads;

    public $title, $file;
    public $filter = 'all'; // 'all', 'image', atau 'video'

    protected $listeners = ['refreshList' => '$refresh'];

    public function getMediaListProperty()
    {
        return Media::when($this->filter !== 'all', function ($query) {
            return $query->where('type', $this->filter);
        })->get();
    }

    protected $rules = [
        'title' => 'required|string|max:255',
        'file' => 'required|mimes:jpg,jpeg,png,mp4,mov,avi|max:12288',
    ];

    public function store()
    {
        $this->validate();

        $filePath = $this->file->store('media', 'public');
        //dev_ver
        //$filePath = $this->file->store('', 'media_public');
        $isImage = @exif_imagetype($this->file->getRealPath());
        $type = $isImage ? 'image' : 'video';

        Media::create([
            'title' => $this->title,
            'file_path' => $filePath,
            'type' => $type,
        ]);

        try {
          $this->file->delete(); // cara resmi dari Livewire 3
        } catch (\Exception $e) {
            // kalau gagal hapus, abaikan
        }

        // Reset form setelah upload
        $this->dispatch('resetForm');
        $this->reset(['title', 'file']);

        session()->flash('success', 'File berhasil diunggah!');
    }

    public function delete($id)
    {
        $media = Media::find($id);
        if ($media) {
            Storage::disk('public')->delete($media->file_path);
            //dev_version
            //Storage::disk('media_public')->delete($media->file_path);
            $media->delete();
        }
        session()->flash('success', 'File berhasil dihapus!');
    }

    public function render()
    {
        return view('livewire.media-manager', [
            'mediaList' => $this->mediaList
        ]);
    }
}

