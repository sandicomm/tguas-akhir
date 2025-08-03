<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\User as UserModel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class User extends Component
{
    public $name, $email, $password;
    public $userId;
    public $confirmDelete;
    public $statsAction;

    public bool $isModalOpen = false;

    public function store(){
        try{
            $this->validate([
            'name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            ]);

            UserModel::create([
                'name' => $this->name,
                'email' => $this->email,
                'password' => Hash::make($this->password)
            ]);

            
            $this->reset();
            $this->resetValidation();
            session()->flash('success', 'User berhasil ditambahkan!');

        } catch (ValidationException $e) {
            // Tangani error validasi secara eksplisit
            $this->addError('name', $e->validator->errors()->first('name'));
            $this->addError('email', $e->validator->errors()->first('email'));
            $this->addError('password', $e->validator->errors()->first('password'));
        } catch (\Exception $e) {
            // Tangani error umum
            session()->flash('error', $e->getMessage());
        }
    }

    public function setStatsAction($id, $action)
    {
        $this->reset(['userId', 'name', 'email', 'password', 'confirmDelete']); // Reset semua state sebelum diisi
        if ($action === 'add') {
            $this->statsAction= $action;
        } else if($action === 'edit') {
            try{
                $user = UserModel::findOrFail($id);
                //dd($id,$action,$this->statsAction, $user);
                $this->userId = $id;
                $this->name = $user->name;
                $this->email = $user->email;
                $this->statsAction= $action;
            } catch (ValidationException $e) {
                // Tangani error validasi secara eksplisit
                $this->addError('name', $e->validator->errors()->first('name'));
                $this->addError('email', $e->validator->errors()->first('email'));
                $this->addError('password', $e->validator->errors()->first('password'));
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

    public function update()
    {
        try{
            $this->validate([
            'name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email,' . $this->userId,
            ]);

            if (!empty($this->password)) {
                $this->validate([
                    'password' => 'required|string|min:8'
                ]);
            }

            $user = UserModel::findOrFail($this->userId);

            $data = [
                'name' => $this->name,
                'email' => $this->email,
            ];

            if (!empty($this->password)) {
                $this->validate([
                    'password' => 'required|string|min:8'
                ]);
                $data['password'] = Hash::make($this->password);
            }

            $user->update($data);

            $this->reset();
            $this->resetValidation(); 
            $this->isModalOpen = false;

            session()->flash('success', 'User berhasil diperbarui!');

        } catch (ValidationException $e) {
            // Tangani error validasi secara eksplisit
            $this->addError('name', $e->validator->errors()->first('name'));
            $this->addError('email', $e->validator->errors()->first('email'));
            $this->addError('password', $e->validator->errors()->first('password'));
        }catch(\Exception $e){
            session()->flash('error', $e->getMessage());
        }
    }

    public function delete()
    {
        if (strtolower($this->confirmDelete)=== 'hapus user') {
            try{
                UserModel::findOrFail($this->userId)->delete();
                $this->reset();
                session()->flash('success', 'User berhasil dihapus!');
            } catch (\Exception $e) {
                session()->flash('error', $e->getMessage());
            }
        } else {
            session()->flash('error', 'Isi dengan benar');
        }
    }

    public function render()
    {
        $users = UserModel::all()->select('id','name','email');
        return view('livewire.user', compact('users'));
    }
}
