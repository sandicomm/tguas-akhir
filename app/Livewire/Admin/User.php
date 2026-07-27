<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use App\Models\User as UserModel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

use Mews\Purifier\Facades\Purifier;

use App\Models\EditFormVisited;
use Illuminate\Support\Facades\Auth;
use App\Models\WebpageVisited;

class User extends Component
{
    public $name, $email, $password;
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
    
    public function store(){
        try{
            $this->validate([
            'name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            ]);

            $safeName = Purifier::clean($this->name);
            $safeEmail = Purifier::clean($this->email);
            $safePassword = Purifier::clean($this->password);

            UserModel::create([
                'name' => $safeName,
                'email' => $safeEmail,
                'password' => Hash::make($safePassword)
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
            session()->flash('error', 'error tambah user');
        }
    }

    public function setStatsAction($id, $action)
    {
        $this->reset(['userId', 'name', 'email', 'password', 'confirmDelete']); // Reset semua state sebelum diisi
        if ($action === 'add') {
            $this->statsAction= $action;
        } else if($action === 'edit') {
            try{
                $user = UserModel::find($id);

                if(!$user){
                    session()->flash('error', 'User tidak ditemukan.');
                    return;
                }

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

            $user = UserModel::find($this->userId);

            if(!$user){
                $this->reset();
                $this->resetValidation(); 
                $this->isModalOpen = false;

                session()->flash('error', 'User tidak ditemukan.');
                return;
            }

            $safeName = Purifier::clean($this->name);
            $safeEmail = Purifier::clean($this->email);
            $safePassword = Purifier::clean($this->password);

            $data = [
                'name' => $safeName,
                'email' => $safeEmail,
            ];

            if (!empty($safePassword)) {
                $this->validate([
                    'password' => 'required|string|min:8'
                ]);
                $data['password'] = Hash::make($safePassword);
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
            session()->flash('error','error update user');
        }
    }

    public function delete()
    {
        if (strtolower($this->confirmDelete)=== 'hapus user') {
            try{
                $user=UserModel::find($this->userId);
                if(!$user){
                    $this->reset();
                    session()->flash('error', 'User tidak ditemukan.');
                    return;
                }
                $user->delete();
                $this->reset();
                session()->flash('success', 'User berhasil dihapus!');
            } catch (\Exception $e) {
                session()->flash('error', 'error delete user');
            }
        } else {
            session()->flash('error', 'Isi dengan benar');
        }
    }

    public function render()
    {
        $users = UserModel::all()->select('id','name','email');
        return view('livewire.admin.user', compact('users'));
    }
}
