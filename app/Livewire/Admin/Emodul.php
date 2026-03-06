<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Livewire\WithFileUploads;
use App\Models\Emodul as EmodulModel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;

class Emodul extends Component
{
    use WithFileUploads;

    public $emodulId, $judul, $penyusun, $file;

    public $confirmDelete;
    public $statsAction;

    public bool $isModalOpen = false;

    public function store(){
        try{
            $this->validate([
                'judul' => 'required|string|max:255',
                'penyusun' => 'required|string|max:255',
                'file' => 'required|mimes:pdf|max:2048',
            ]);

            // ambil nama asli
            $ext = $this->file->getClientOriginalExtension();

            // pastikan judul aman dijadikan filename
            $safeTitle = preg_replace('/[^A-Za-z0-9_\-]/', '_', $this->judul);

            // final filename
            $filename = $safeTitle . '_' . time() . '.' . $ext;

            // pindahkan dari tmp livewire ke PUBLIC/media
            $this->file->storeAs('/', $filename, [
                'disk' => 'public_uploads'
            ]);

            

            $emodul = new EmodulModel();
            $emodul->judul = $this->judul;
            $emodul->penyusun = $this->penyusun;
            $emodul->file_path = 'media/' . $filename;

            $emodul->save();

            // Menghapus file di tmp
            try {
                $this->file->delete(); // cara resmi dari Livewire 3
            } catch (\Exception $e) {
                // kalau gagal hapus, abaikan
            }

            $this->reset();
            $this->resetValidation();
            session()->flash('success', 'Emodul berhasil ditambahkan!');
            
        } catch (ValidationException $e) {
            // Tangani error validasi secara eksplisit
            $this->addError('judul', $e->validator->errors()->first('judul'));
            $this->addError('penyusun', $e->validator->errors()->first('penyusun'));
            $this->addError('file', $e->validator->errors()->first('file'));
        }catch(\Exception $e){
            session()->flash('error', $e->getMessage());
        }  
    }

    public function update(){
        try{
            $this->validate([
                'judul' => 'required|string|max:255',
                'penyusun' => 'required|string|max:255',
                'file' => 'required|mimes:pdf|max:2048',
            ]);

            $emodul = EmodulModel::findOrFail($this->emodulId);

            $updateData = [
                'judul' => $this->judul,
                'penyusun' => $this->penyusun,
            ];

            if($this->file){
                if ($emodul) {

                    // ambil nama asli
                    $ext = $this->file->getClientOriginalExtension();

                    // pastikan judul aman dijadikan filename
                    $safeTitle = preg_replace('/[^A-Za-z0-9_\-]/', '_', $this->judul);

                    // final filename
                    $filename = $safeTitle . '_' . time() . '.' . $ext;

                    // pindahkan dari tmp livewire ke PUBLIC/media
                    $this->file->storeAs('/', $filename, [
                        'disk' => 'public_uploads'
                    ]);

                    $filePath = 'media/'.$filename;
                    $updateData['file_path'] = $filePath;
                }
                 //Menghapus file di tmp
                try {
                    $this->file->delete();
                } catch (\Exception $e) {
                    // kalau gagal hapus, abaikan
                }
            }
            
            $emodul->update($updateData);
            
            $this->reset();
            $this->resetValidation(); // Reset validasi setelah penyimpanan
            $this->isModalOpen = false;
            
            session()->flash('success', 'Emodul updated successfully.');
        
        } catch (ValidationException $e) {
            // Tangani error validasi secara eksplisit
            $this->addError('judul', $e->validator->errors()->first('judul'));
            $this->addError('penyusun', $e->validator->errors()->first('penyusun'));
            $this->addError('file', $e->validator->errors()->first('file'));
        
        }catch(\Exception $e){
            session()->flash('error', $e->getMessage());
        }
    }

    public function delete()
    {
        if (strtolower($this->confirmDelete)=== 'hapus emodul') {
            try{
                $emodul = EmodulModel::find($this->emodulId);
                if ($emodul) {
                    File::delete(public_path($emodul->file_path));
                    $emodul->delete();

                    $this->reset();
                    $this->resetValidation(); // Reset validasi setelah penyimpanan
                    $this->isModalOpen = false;

                    session()->flash('success', 'Emodul berhasil dihapus.');
                } else {
                    session()->flash('error', 'Emodul tidak ditemukan.');
                }
            }catch(\Exception $e){
                session()->flash('error', $e->getMessage());
            }
        }
    }

    public function setStatsAction($id, $action)
    {
        $this->reset(['judul', 'penyusun', 'confirmDelete']); // Reset semua state sebelum diisi
        if ($action === 'add') {
            $this->statsAction= $action;
        } else if($action === 'edit') {
            try{
                $this->statsAction= $action;
                $this->emodulId= $id;
                $emodul = EmodulModel::findOrFail($id);
                //dd($id,$action,$this->statsAction, $emodul);
                $this->judul = $emodul->judul;
                $this->penyusun = $emodul->penyusun;

            } catch (ValidationException $e) {
                // Tangani error validasi secara eksplisit
                $this->addError('judul', $e->validator->errors()->first('judul'));
                $this->addError('penyusun', $e->validator->errors()->first('penyusun'));
                $this->addError('file', $e->validator->errors()->first('file'));
            
            }catch(\Exception $e){
                session()->flash('error', $e->getMessage());
            }

        } else if($action === 'delete') {
            $this->emodulId = $id;
            $this->statsAction = $action;
        }
        $this->isModalOpen = true;
    }

    public function closeModal()
    {
        $this->isModalOpen = false;
    }

    public function render()
    {
        $emodul = EmodulModel::all();
        return view('livewire.admin.emodul', compact('emodul'));
    }
}
