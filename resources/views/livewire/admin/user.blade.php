<div>
    <div class="p-4 sm:ml-64" x-data="{ open: @entangle('isModalOpen') }">
    <x-loading wire:loading.flex />
        <div class="hidden" id='jsLoader'>
            <x-loading />
        </div>

        <div>
            @if(session('success'))
                <div class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50">
                    <div class="flex items-center justify-between gap-4">
                        <span>{{ session('success') }}</span>
                        <button type="button" class="text-green-700 hover:text-green-900" onclick="this.parentElement.parentElement.remove()">
                            &times;
                        </button>
                    </div>
                </div>
            @endif

            @if (session('error'))
                <div class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50">
                    <div class="flex items-center justify-between gap-4">
                        <span>{{ session('error') }}</span>
                        <button type="button" class="text-red-700 hover:text-red-900" onclick="this.parentElement.parentElement.remove()">
                            &times;
                        </button>
                    </div>
                </div>
            @endif

            <div class="flex items-center justify-center flex-col gap-3 rounded bg-transparent p-4">
                <div class="relative w-full">
                    <button wire:click="setStatsAction('none', 'add')" class="block text-white bg-green-500 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-blue-800" type="button">
                        Tambah User
                    </button>
                </div>
                <div class="relative overflow-x-auto sm:rounded-lg w-full bg-white dark:bg-slate-800 shadow-md">
                    <h1 class="text-3xl font-bold bg-cyan-600 rounded p-3 mb-1 text-center text-white">Data User</h1>
                    
                    @if ($users)
                        <div class="rounded my-2 mx-3 p-1 text-center overflow-x-scroll flex flex-col justify-start items-start">
                            <table class="w-full text-sm text-left rtl:text-right bg-white dark:bg-slate-700 dark:text-gray-400 shadow-md rounded overflow-hidden border-2 mb-2">
                                <thead class="text-black uppercase bg-slate-300">
                                    <tr class="text-center">
                                        <th class="p-2">No</th>
                                        <th class="p-2">Nama</th>
                                        <th class="p-2">Email</th>
                                        <th class="p-2">Password</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @if ($users->isEmpty())
                                        <tr>
                                            <td class="p-3 text-center text-gray-500" colspan="3">-- Belum ada users --</td>
                                        </tr>
                                    @else
                                        @foreach ($users as $index => $user)
                                            <tr class="text-center border-b-2 dark:text-slate-200 text-black dark:border-slate-400 border-slate-300">
                                                <td class="p-3">{{ $index+1 }}</td>
                                                <td class="p-3">{{ $user['name'] }}</td>
                                                <td class="p-3">{{ $user['email'] }}</td>
                                                <td class="p-3">*******</td>
                                                <td class="p-3 flex justify-center items-center gap-3 w-auto">
                                                    <button wire:click="setStatsAction({{ $user['id'] }}, 'edit')" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Edit</button>
                                                    <button wire:click="setStatsAction({{ $user['id'] }}, 'delete')" class="block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-blue-800">Delete</button>
                                                </td>
                                            </tr>
                                        @endforeach
                                    @endif
                                </tbody>
                            </table>
                        </div>

                        <!-- MODAL -->
                        <div x-show="open" x-transition x-cloak class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999] dark:text-white text-black">
                            <div class="bg-white dark:bg-slate-700 rounded-lg p-2 lg:w-1/3 w-[90%]">
                                <div class="flex items-center justify-between p-3 rounded-t border-b border-gray-200 dark:border-gray-600">
                                    <h3 class="text-xl font-bold">
                                        @if ($statsAction === 'add')
                                            Tambah User
                                        @elseif ($statsAction === 'edit')
                                            Edit User
                                        @elseif ($statsAction === 'delete')
                                            Hapus User
                                        @endif
                                    </h3>
                                   <button type="button" @click="open = false" class="text-gray-400 hover:bg-gray-200 rounded-lg w-8 h-8 flex justify-center items-center" >
                                        <svg class="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                        </svg>
                                        <span class="sr-only">Close modal</span>
                                    </button>
                                </div>
                        
                                <!-- FORM -->
                                @if($statsAction === 'add')
                                    <form wire:submit.prevent="store">
                                        <div class="md:p-5 space-y-4">
                                            <div class="mb-4">
                                                <label>Nama</label>
                                                <input type="text" wire:model="name" 
                                                    placeholder="Ketik Nama disini..."
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                                @error('name') 
                                                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                                @enderror
                                            </div>
                                            
                                            <div class="mb-4">
                                                <label>Email</label>
                                                <input type="email" wire:model="email" 
                                                    placeholder="Ketik Email disini..."
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                                @error('email') 
                                                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                                @enderror
                                            </div>
                                            
                                            <div class="mb-4">
                                                <label>Password</label>
                                                <input type="password" wire:model="password" 
                                                    placeholder="Ketik Password disini..."
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                                @error('password') 
                                                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                                @enderror
                                            </div>
                                        </div>
                                        
                                        <div class="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-600 gap-2">
                                            <button type="button" @click="open = false" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">
                                                Batal
                                            </button>
                                            <button type="submit" class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700">
                                                Simpan
                                            </button>
                                        </div>
                                    </form>
                                @elseif ($statsAction === 'edit')
                                    <form wire:submit.prevent="update">
                                        <div class="p-4 md:p-5 space-y-4">
                                            <div class="mb-4">
                                                <label>Nama</label>
                                                <input type="text" wire:model="name" 
                                                    placeholder="Ketik Nama disini..."
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                                @error('name') 
                                                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                                @enderror
                                            </div>
                                            
                                            <div class="mb-4">
                                                <label>Email</label>
                                                <input type="email" wire:model="email" 
                                                    placeholder="Ketik Email disini..."
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                                @error('email') 
                                                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                                @enderror
                                            </div>
                                            
                                            <div class="mb-4">
                                                <label>Password</label>
                                                <input type="password" wire:model="password" placeholder="Kosongkan saja jika tidak ingin mengganti password"
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            </div>
                                            @error('password') 
                                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                            @enderror
                                        </div>

                                        <div class="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-600 gap-2">
                                            <button type="button" @click="open = false" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">
                                                Batal
                                            </button>
                                            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700">
                                                Edit
                                            </button>
                                        </div>
                                    </form>
                                @elseif ($statsAction === 'delete')
                                    <form wire:submit.prevent="delete">
                                        @csrf
                                        <div class="p-4 md:p-5 space-y-4">

                                            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                                <strong class="font-bold">Perhatian!</strong>
                                                <span class="block sm:inline">Tindakan ini akan menghapus user.</span>
                                            </div>

                                            <p>Jika anda yakin ingin <span class="font-bold">MENGHAPUS</span> data ini, Ketik <span class="font-bold">"Hapus User"</span></p>
                                            <input type="text" wire:model="confirmDelete" 
                                                placeholder="Ketik 'hapus user' disini..."
                                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            @if(session()->has('error'))
                                                <p class="text-red-500 text-sm m-0">{{ session('error') }}</p>
                                            @endif
                                        </div>
                                        <!-- Modal footer -->
                                        <div class="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-600 gap-2">
                                            <button type="button" @click="open = false" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">
                                                Batal
                                            </button>
                                            <button type="submit" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700">
                                                Hapus
                                            </button>
                                        </div>
                                    </form>
                                @endif
                            </div>
                        </div>
                    @else
                        <div class="bg-white rounded my-2 text-center overflow-hidden w-full">
                            -- No data --
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    document.getElementById('jsLoader')?.classList.remove('hidden');
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            requestAnimationFrame(() => {
                document.getElementById('jsLoader')?.classList.add('hidden');
            });
        }, 1000);
    });
</script>
