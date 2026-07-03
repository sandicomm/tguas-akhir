<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Livewire\WithFileUploads;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App\Models\Media;

use Illuminate\Validation\ValidationException;

use Mews\Purifier\Facades\Purifier;

class MediaManager extends Component
{
    use WithFileUploads;

    public $title, $file, $sumber, $link;
    public $filter = 'all'; // 'all', 'image', atau 'video'
    public $statsAction;
    public $mediaId;
    public $confirmDelete;

    public bool $isModalOpen = false;

    protected $listeners = ['refreshList' => '$refresh'];

    public function setStatsAction($id, $action)
    {
        $this->reset(['mediaId', 'title', 'sumber', 'link', 'file', 'confirmDelete' ]); // Reset semua state sebelum diisi

        if ($action === 'add') {
            $this->statsAction= $action;
        } else if($action === 'edit') {
            try{
                $media = Media::findOrFail($id);
                //dd($id,$action,$this->statsAction, $user);
                $this->mediaId = $id;
                $this->title = $media->title;
                $this->sumber = $media->sumber;
                $this->link = $media->link;
                $this->statsAction= $action;

            } catch (ValidationException $e) {
                // Tangani error validasi secara eksplisit
                $this->addError('title', $e->validator->errors()->first('title'));
                $this->addError('sumber', $e->validator->errors()->first('sumber'));
                $this->addError('link', $e->validator->errors()->first('link'));
            }catch(\Exception $e){
                session()->flash('error', $e->getMessage());
            }

        } else if($action === 'delete') {
            $this->mediaId = $id;
            $this->statsAction = $action;
        }

        $this->isModalOpen = true;
    }

    public function closeModal()
    {
        $this->isModalOpen = false;
    }

    public function getMediaListProperty()
    {
        return Media::when($this->filter !== 'all', function ($query) {
            return $query->where('type', $this->filter);
        })->get();
    }

    protected $rules = [
        'title' => 'required|string|max:255',
        'sumber' => 'required|string|max:255',
        'link' => 'nullable|url',
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
        $ext = $this->file->getClientOriginalExtension();

        // pastikan judul aman dijadikan filename
       // $safeTitle = preg_replace('/[^A-Za-z0-9_\-]/', '_', $this->title);
        //$safeSumber = preg_replace('/[^A-Za-z0-9_\-]/', '_', $this->sumber);

        $safeTitle = Purifier::clean($this->title);
        $safeSumber = Purifier::clean($this->sumber);
        $safeLink = $this->link;
     
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
            'title'     => $safeTitle,
            'sumber'     => $safeSumber,
            'link'     => $safeLink,
            'file_path' => 'media/' . $filename,
            'type'      => $type,
        ]);

        // reset
        $this->reset();
        $this->resetValidation();
        $this->dispatch('resetForm');

        session()->flash('success', 'Media berhasil ditambahkan!');
    }

    public function update(){
        try{
            $this->validate();

            $media = Media::findOrFail($this->mediaId);

            $safeTitle = Purifier::clean($this->title);
            $safeSumber = Purifier::clean($this->sumber);
            $safeLink = $this->link;

            $updateData = [
                'title' => $safeTitle,
                'sumber' => $safeSumber,
                'link' => $safeLink,
            ];

            if($this->file){
                if ($media) {

                    // ambil nama asli
                    $ext = $this->file->getClientOriginalExtension();

                    // final filename
                    $filename = $safeTitle . '_' . time() . '.' . $ext;

                    // pindahkan dari tmp livewire ke PUBLIC/media
                    $this->file->storeAs('/', $filename, [
                        'disk' => 'public_uploads'
                    ]);

                    $filePath = 'media/'.$filename;

                    // deteksi tipe file (image/video)
                    $isImage = @exif_imagetype(public_path('media/' . $filename));
                    $type = $isImage ? 'image' : 'video';

                    $updateData['file_path'] = $filePath;
                    $updateData['type'] = $type;
                }
                 //Menghapus file di tmp
                try {
                    $this->file->delete();
                } catch (\Exception $e) {
                    // kalau gagal hapus, abaikan
                }
            }
            
            $media->update($updateData);
            
            $this->reset();
            $this->resetValidation(); // Reset validasi setelah penyimpanan
            $this->isModalOpen = false;
            
            session()->flash('success', 'Media Berhasil Diupdate.');
        
        } catch (ValidationException $e) {
            // Tangani error validasi secara eksplisit
            $this->addError('title', $e->validator->errors()->first('title'));
            $this->addError('sumber', $e->validator->errors()->first('sumber'));
            $this->addError('link', $e->validator->errors()->first('link'));
            $this->addError('file', $e->validator->errors()->first('file'));
        
        }catch(\Exception $e){
            session()->flash('error', $e->getMessage());
        }
    }

    public function delete()
    {
        if (strtolower($this->confirmDelete)=== 'hapus media') {
            try{
                $media = Media::find($this->mediaId);
                if ($media) {
                    File::delete(public_path($media->file_path));
                    $media->delete();

                    $this->reset();
                    $this->resetValidation(); // Reset validasi setelah penyimpanan
                    $this->isModalOpen = false;

                    session()->flash('success', 'Media berhasil dihapus.');
                } else {
                    session()->flash('error', 'Media tidak ditemukan.');
                }
            }catch(\Exception $e){
                session()->flash('error', 'gagal hapus media');
            }
        }else{
            session()->flash('error', 'ketikan anda salah');
        }
    }

    public function render()
    {
        return view('livewire.admin.media-manager', [
            'mediaList' => $this->mediaList
        ]);
    }
}

