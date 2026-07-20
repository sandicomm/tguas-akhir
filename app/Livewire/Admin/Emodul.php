<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Livewire\WithFileUploads;
use App\Models\Emodul as EmodulModel;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\File;

use Mews\Purifier\Facades\Purifier;

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
            $safeJudul = Purifier::clean($this->judul);
            $safePenyusun = Purifier::clean($this->penyusun);

            // final filename
            $filename = $safeJudul . '_' . time() . '.' . $ext;

            // pindahkan dari tmp livewire ke PUBLIC/media
            $this->file->storeAs('/', $filename, [
                'disk' => 'public_uploads'
            ]);

            $emodul = new EmodulModel();
            $emodul->judul = $safeJudul;
            $emodul->penyusun = $safePenyusun;
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
                'file' => 'nullable|mimes:pdf|max:2048',
            ]);

            $emodul = EmodulModel::find($this->emodulId);

            if(!$emodul){
                $this->reset();
                $this->resetValidation(); // Reset validasi setelah penyimpanan
                $this->isModalOpen = false;
                session()->flash('error', 'Emodul sepertinya sudah tidak ada atau telah dihapus oleh pengguna lain!');
                return;
            }
            
            $safeJudul = Purifier::clean($this->judul);
            $safePenyusun = Purifier::clean($this->penyusun);

            $updateData = [
                'judul' => $safeJudul,
                'penyusun' => $safePenyusun,
            ];

            if($this->file){
                if ($emodul) {

                    // ambil nama asli
                    $ext = $this->file->getClientOriginalExtension();

                    // final filename
                    $filename = $safeJudul . '_' . time() . '.' . $ext;

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
                    session()->flash('success', 'Emodul berhasil dihapus.');

                } else {
                
                    session()->flash('error', 'Emodul tidak ditemukan.');
                }

                $this->reset();
                $this->resetValidation(); // Reset validasi setelah penyimpanan
                $this->isModalOpen = false;

            }catch(\Exception $e){
                session()->flash('error', 'gagal hapus emodul');
            }
        }else{
            session()->flash('error', 'ketikan anda salah');
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
                $emodul = EmodulModel::find($id);
                
                if ($emodul) {
                    $this->judul = $emodul->judul;
                    $this->penyusun = $emodul->penyusun;
                } else {
                    session()->flash('error', 'Emodul tidak ditemukan.');
                    return;
                }

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

    public function resetFile(){
       $this->reset(['file']); 
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
