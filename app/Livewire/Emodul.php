<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithFileUploads;
use App\Models\Emodul as EmodulModel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Facades\Image;

class Emodul extends Component
{
    use WithFileUploads;

    public $emodulId, $judul, $penulis, $pengarang, $penerbit, $tahun_terbit, $halaman, $deskripsi, $file;

    public $confirmDelete;
    public $statsAction;

    public bool $isModalOpen = false;

    public function store(){
        try{
            $this->validate([
                'judul' => 'required|string|max:255',
                'penulis' => 'required|string|max:255',
                'pengarang' => 'required|string|max:255',
                'penerbit' => 'required|string|max:255',
                'tahun_terbit' => 'required|integer',
                'halaman' => 'required|integer',
                'deskripsi' => 'required|string|max:255',
                'file' => 'required|max:2048',
            ]);

            $filePath = $this->file->store('media', 'public');

            $emodul = new EmodulModel();
            $emodul->judul = $this->judul;
            $emodul->penulis = $this->penulis;
            $emodul->pengarang = $this->pengarang;
            $emodul->penerbit = $this->penerbit;
            $emodul->tahun_terbit = $this->tahun_terbit;
            $emodul->halaman = $this->halaman;
            $emodul->deskripsi = $this->deskripsi;
            $emodul->file_path = $filePath;

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
            $this->addError('penulis', $e->validator->errors()->first('penulis'));
            $this->addError('pengarang', $e->validator->errors()->first('pengarang'));
            $this->addError('tahun_terbit', $e->validator->errors()->first('tahun_terbit'));
            $this->addError('deskripsi', $e->validator->errors()->first('deskripsi'));
            $this->addError('file', $e->validator->errors()->first('file'));
        }catch(\Exception $e){
            session()->flash('error', $e->getMessage());
        }  
    }

    public function update(){
        try{
            $this->validate([
                'judul' => 'required|string|max:255',
                'penulis' => 'required|string|max:255',
                'pengarang' => 'required|string|max:255',
                'penerbit' => 'required|string|max:255',
                'tahun_terbit' => 'required|integer',
                'halaman' => 'required|integer',
                'deskripsi' => 'required|string|max:255',
                'file' => 'max:50048',
            ]);

            $emodul = EmodulModel::findOrFail($this->emodulId);

            $updateData = [
                'judul' => $this->judul,
                'penulis' => $this->penulis,
                'pengarang' => $this->pengarang,
                'penerbit' => $this->penerbit,
                'tahun_terbit' => $this->tahun_terbit,
                'halaman' => $this->halaman,
                'deskripsi' => $this->deskripsi,
            ];

            if($this->file){
                if ($emodul) {
                    $filePath = $this->file->store('media', 'public');
                    Storage::disk('public')->delete($emodul->file_path);
                    $updateData['file_path'] = $filePath;
                    $updateData['thumbnail'] = $filePath;
                }
            }
            
            $emodul->update($updateData);

             //Menghapus file di tmp
            try {
                $this->file->delete();
            } catch (\Exception $e) {
                // kalau gagal hapus, abaikan
            }
            
            $this->reset();
            $this->resetValidation(); // Reset validasi setelah penyimpanan
            $this->isModalOpen = false;
            
            session()->flash('success', 'Emodul updated successfully.');
        
        } catch (ValidationException $e) {
            // Tangani error validasi secara eksplisit
            $this->addError('judul', $e->validator->errors()->first('judul'));
            $this->addError('penulis', $e->validator->errors()->first('penulis'));
            $this->addError('pengarang', $e->validator->errors()->first('pengarang'));
            $this->addError('tahun_terbit', $e->validator->errors()->first('tahun_terbit'));
            $this->addError('deskripsi', $e->validator->errors()->first('deskripsi'));
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
                    $emodul->delete();
                    Storage::disk('public')->delete($emodul->file_path);
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
        $this->reset(['judul', 'penulis', 'pengarang', 'penerbit', 'tahun_terbit', 'halaman', 'deskripsi', 'confirmDelete']); // Reset semua state sebelum diisi
        if ($action === 'add') {
            $this->statsAction= $action;
        } else if($action === 'edit') {
            try{
                $this->statsAction= $action;
                $this->emodulId= $id;
                $emodul = EmodulModel::findOrFail($id);
                //dd($id,$action,$this->statsAction, $emodul);
                $this->judul = $emodul->judul;
                $this->penulis = $emodul->penulis;
                $this->pengarang = $emodul->pengarang;
                $this->penerbit = $emodul->penerbit;
                $this->tahun_terbit = $emodul->tahun_terbit;
                $this->halaman = $emodul->halaman;
                $this->deskripsi = $emodul->deskripsi;

            } catch (ValidationException $e) {
                // Tangani error validasi secara eksplisit
                $this->addError('judul', $e->validator->errors()->first('judul'));
                $this->addError('penulis', $e->validator->errors()->first('penulis'));
                $this->addError('pengarang', $e->validator->errors()->first('pengarang'));
                $this->addError('tahun_terbit', $e->validator->errors()->first('tahun_terbit'));
                $this->addError('deskripsi', $e->validator->errors()->first('deskripsi'));
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
        return view('livewire.emodul', compact('emodul'));
    }
}
