<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use App\Models\Responden as RespondenModel;
use Illuminate\Validation\ValidationException;

use App\Models\EditFormVisited;
use Illuminate\Support\Facades\Auth;
use App\Models\WebpageVisited;

class Responden extends Component
{
    public $email;
    public $userId;
    public $confirmDelete;
    public $statsAction;

    public bool $isModalOpen = false;

    public function mount()
    {
        try{
            $userId = Auth::id();
            EditFormVisited::where('user_id', $userId)->delete();
            WebpageVisited::where('user_id', $userId)->delete();
        }catch(\Exception $e){
            session()->flash('error', 'error muat halaman');
        }
    }
    
    public function setStatsAction($id, $action)
    {
        $this->reset(['userId', 'email', 'confirmDelete']); // Reset semua state sebelum diisi

        if($action === 'edit') {
            try{
                $responden = RespondenModel::find($id);

                if(!$responden){
                    session()->flash('error', 'Responden tidak ditemukan.');
                    return;
                }

                $this->userId = $id;
                $this->email = $responden->email;
                $this->statsAction= $action;

            } catch (ValidationException $e) {
                // Tangani error validasi secara eksplisit
                $this->addError('email', $e->validator->errors()->first('email'));
            }catch(\Exception $e){
                session()->flash('error', 'error action');
            }

        } else if($action === 'delete') {
            $this->userId = $id;
            $this->statsAction = $action;
        }
        $this->isModalOpen = true;
    }

    public function closeModal()
    {
        $this->isModalOpen = false;
    }

    public function delete()
    {
        if (strtolower($this->confirmDelete)=== 'hapus responden') {
            try{
                $responden = RespondenModel::find($this->userId);

                if (!$responden) {
                    $this->reset();
                    $this->resetValidation(); // Reset validasi setelah penyimpanan
                    $this->isModalOpen = false;
                    session()->flash('error', 'Responden tidak ditemukan.');
                    return;
                }

                $responden->delete();
                $this->reset();
                session()->flash('success', 'Responden berhasil dihapus!');
            } catch (\Exception $e) {
                session()->flash('error', 'error delete responden');
            }
        } else {
            session()->flash('error', 'Isi dengan benar');
        }
    }

    public function render()
    {
        $responden = RespondenModel::all()->select('id', 'email');
        return view('livewire.admin.responden', compact('responden'));
    }
}
