<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Responden as RespondenModel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class Responden extends Component
{
    public $email;
    public $userId;
    public $confirmDelete;
    public $statsAction;

    public bool $isModalOpen = false;

    public function setStatsAction($id, $action)
    {
        $this->reset(['userId', 'email', 'confirmDelete']); // Reset semua state sebelum diisi

        if($action === 'edit') {
            try{
                $responden = RespondenModel::findOrFail($id);
                $this->userId = $id;
                $this->email = $responden->email;
                $this->statsAction= $action;
            } catch (ValidationException $e) {
                // Tangani error validasi secara eksplisit
                $this->addError('email', $e->validator->errors()->first('email'));
            }catch(\Exception $e){
                session()->flash('error', $e->getMessage());
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
                RespondenModel::findOrFail($this->userId)->delete();
                $this->reset();
                session()->flash('success', 'Responden berhasil dihapus!');
            } catch (\Exception $e) {
                session()->flash('error', $e->getMessage());
            }
        } else {
            session()->flash('error', 'Isi dengan benar');
        }
    }

    public function render()
    {
        $responden = RespondenModel::all()->select('id', 'email');
        return view('livewire.responden', compact('responden'));
    }
}
