<div>
    <div class="p-4 sm:ml-64" x-data="{ open: @entangle('isModalOpen') }">
        <div class="" id='jsLoader'>
            <x-loading />
        </div>

        <div class="border-1 border-gray-200 border-dashed rounded-lg">
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

            <div class="flex items-center justify-center flex-col gap-3 rounded bg-slate-100 dark:bg-gray-500 p-4">
                <div class="relative w-full">
                    <button wire:click="setStatsAction('none', 'add')" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" type="button">
                        Tambah Emodul
                    </button>
                </div>
                <div class="relative overflow-x-auto sm:rounded-lg w-full bg-white dark:bg-slate-700 shadow-md">
                    <h1 class="text-3xl font-bold bg-cyan-600 rounded p-3 mb-1 text-center text-white">Data Emodul</h1>
                    
                    @if ($emodul)
                        <div class="rounded my-2 mx-3 p-1 text-center overflow-x-scroll flex flex-col justify-start items-start">
                            <table class="w-full text-sm text-left rtl:text-right bg-white dark:bg-slate-800 shadow-md rounded overflow-hidden border-2 mb-2">
                                <thead class="text-black uppercase bg-slate-300">
                                    <tr class="text-center">
                                        <th class="border border-e-2 border-slate-100 p-1">No</th>
                                        <th class="border border-e-2 border-slate-100 p-1">Judul</th>
                                        <th class="border border-e-2 border-slate-100 p-1">Penyusun</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @if ($emodul->isEmpty())
                                        <div>
                                            <td class="p-3 text-center text-gray-500" colspan="8">-- Belum ada Emodul --</td>
                                        </div>
                                    @else
                                        @foreach ($emodul as $index => $data)
                                            <tr class="text-center border-b-2 text-black dark:text-gray-200">
                                                <td class="p-3">{{ $index+1 }}</td>
                                                <td class="p-3">{{ $data['judul'] }}</td>
                                                <td class="p-3">{{ $data['penyusun'] }}</td>
                                                <td class="p-3 flex justify-center items-center gap-3 w-auto">
                                                    <a href="http://127.0.0.1:8000/{{ $data['file_path'] }}" target="_blank" class="block text-white bg-sky-400 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center">Lihat</a>
                                                    <button wire:click="setStatsAction({{ $data['id'] }}, 'edit')" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Edit</button>
                                                    <button wire:click="setStatsAction({{ $data['id'] }}, 'delete')" class="block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-blue-800">Delete</button>
                                                </td>
                                            </tr>
                                        @endforeach
                                    @endif
                                </tbody>
                            </table>
                        </div>

                        <!-- MODAL -->
                        <div
                            x-show="open"
                            x-transition
                            class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[90] overflow-hidden"
                        >
                            <div class="bg-white dark:bg-slate-800 text-black dark:text-white rounded-lg xl:w-1/3 w-[70%] max-h-[90vh] flex flex-col">
                                <!-- HEADER -->
                                <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                                    <h3 class="text-xl font-bold">
                                        @if ($statsAction === 'add')
                                            Tambah Emodul
                                        @elseif ($statsAction === 'edit')
                                            Edit Emodul
                                        @elseif ($statsAction === 'delete')
                                            Hapus Emodul
                                        @endif
                                    </h3>
                                    <button @click="open = false" class="text-gray-400 hover:bg-gray-200 rounded-lg w-8 h-8 flex justify-center items-center">
                                        <span class="text-2xl">&times;</span>
                                    </button>
                                </div>
                                <div class="flex-1 overflow-y-auto">
                                    @if($statsAction === 'add')
                                        <form wire:submit.prevent="store">
                                            <div class="md:p-5 space-y-4">
                                                <div class="mb-4">
                                                    <label>Judul</label>
                                                    <input type="text" wire:model="judul" 
                                                            placeholder="Ketik Judul disini..."
                                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                                    @error('judul') 
                                                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                                    @enderror
                                                </div>
                                                <div class="mb-4">
                                                    <label>Penyusun</label>
                                                    <input type="text" wire:model="penyusun" 
                                                        placeholder="Ketik Penyusun disini..."
                                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                                    @error('penyusun') 
                                                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                                    @enderror
                                                </div>
                                                <div class="mb-4">
                                                    <label>File</label>
                                                    <p class="text-blue-500">Kirim File Pdf dengan Maksimal Size 2Mb</p>
                                                    <input type="file" wire:model="file" accept=".pdf" 
                                                        class="bg-gray-50 border dark:border-gray-300 text-gray-900 text-sm rounded-lg 
                                                            dark:focus:ring-blue-500 dark:focus:border-blue-500 block w-full dark:bg-gray-700 border-gray-600 
                                                            dark:placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500" required>
                                                    <div wire:loading.delay wire:target="file,store">
                                                        <x-loading />
                                                    </div>
                                                    @error('file') 
                                                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                                    @enderror
                                                </div>
                                            </div>
                                            
                                            <div class="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-600 gap-2">
                                                <button type="button" @click="open = false" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">
                                                    Batal
                                                </button>
                                                <button type="submit" class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700">
                                                    Simpan
                                                </button>
                                            </div>
                                        </form>
                                    @elseif ($statsAction === 'edit')
                                        <form wire:submit.prevent="update">
                                            <div class="p-4 md:p-5 space-y-4">
                                                <div class="mb-4">
                                                    <label>Judul</label>
                                                    <input type="text" wire:model="judul" 
                                                        placeholder="Ketik Judul disini"
                                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                                    @error('judul') 
                                                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                                    @enderror
                                                </div>
                                                <div class="mb-4">
                                                    <label>Penyusun</label>
                                                    <input type="text" wire:model="penyusun" 
                                                        placeholder="Ketik Penyusun disini..."
                                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                                    @error('penyusun') 
                                                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                                    @enderror
                                                </div>
                                                <div class="mb-4">
                                                    <label>File</label>
                                                    <p class="text-blue-500">Kirim File Pdf dengan Maksimal Size 2Mb</p>
                                                    <input type="file" wire:model="file" accept=".pdf" wire:click="resetFile"
                                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                            dark:focus:ring-blue-500 dark:focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 
                                                            dark:placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500">
                                                    <div wire:loading.delay wire:target="file,store">
                                                        <x-loading />
                                                    </div>
                                                    @error('file') 
                                                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                                    @enderror
                                                </div>
                                            </div>
    
                                            <div class="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-600 gap-2">
                                                <button type="button" @click="open = false" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">
                                                    Batal
                                                </button>
                                                <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700">
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
                                                    <span class="block sm:inline">Tindakan ini akan menghapus emodul.</span>
                                                </div>

                                                <p>Jika anda yakin ingin <span class="font-bold">MENGHAPUS</span> emodul ini, Ketik <span class="font-bold">"Hapus Emodul"</span></p>
                                                <input type="text" wire:model="confirmDelete" 
                                                    placeholder="Ketik 'hapus emodul' disini..."
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                @if(session()->has('error'))
                                                    <p class="text-red-500 text-sm m-0">{{ session('error') }}</p>
                                                @endif
                                            </div>
                              
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
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            requestAnimationFrame(() => {
                document.getElementById('jsLoader')?.classList.add('hidden');
            });
        }, 1000);
    });
</script>
