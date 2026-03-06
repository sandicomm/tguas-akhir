<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Livewire\WithFileUploads;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App\Models\Media;

class MediaManager extends Component
{
    use WithFileUploads;

    public $title, $file;
    public $filter = 'all'; // 'all', 'image', atau 'video'
    public $statsAction;
    public $mediaId;
    public bool $isModalOpen = false;

    protected $listeners = ['refreshList' => '$refresh'];

    public function setStatsAction($id, $action)
    {
        $this->reset(['mediaId']); // Reset semua state sebelum diisi

        $this->mediaId = $id;
        $this->statsAction = $action;
        $this->isModalOpen = true;
    }

    public function getMediaListProperty()
    {
        return Media::when($this->filter !== 'all', function ($query) {
            return $query->where('type', $this->filter);
        })->get();
    }

    protected $rules = [
        'title' => 'required|string|max:255',
        'file' => 'required|mimes:jpg,jpeg,png,mp4,mov,avi|max:20048',
    ];

    public function store()
    {
        $this->validate();

        // pastikan folder ada
        if (!file_exists(public_path('media'))) {
            mkdir(public_path('media'), 0755, true);
        }

        // ambil nama asli
        $originalName = $this->file->getClientOriginalName();
        $ext = $this->file->getClientOriginalExtension();

        // pastikan judul aman dijadikan filename
        $safeTitle = preg_replace('/[^A-Za-z0-9_\-]/', '_', $this->title);

        // final filename
        $filename = $safeTitle . '_' . time() . '.' . $ext;

        // pindahkan dari tmp livewire ke PUBLIC/media
        $this->file->storeAs('/', $filename, [
            'disk' => 'public_uploads'
        ]);

        // deteksi tipe file (image/video)
        $isImage = @exif_imagetype(public_path('media/' . $filename));
        $type = $isImage ? 'image' : 'video';

        Media::create([
            'title'     => $this->title,
            'file_path' => 'media/' . $filename,
            'type'      => $type,
        ]);

        // reset
        $this->dispatch('resetForm');
        $this->reset(['title', 'file']);
        session()->flash('success', 'File berhasil diunggah!');
    }

    public function delete($id)
    {
        $media = Media::find($id);
        if ($media) {
            File::delete(public_path($media->file_path));
            $media->delete();
            $this->isModalOpen = false;
        }

        session()->flash('success', 'File berhasil dihapus!');
    }

    public function render()
    {
        return view('livewire.admin.media-manager', [
            'mediaList' => $this->mediaList
        ]);
    }
}

