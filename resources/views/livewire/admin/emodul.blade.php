<div>
    <div class="p-4 sm:ml-64" x-data="{ open: @entangle('isModalOpen') }">
        <div class="hidden" id='jsLoader'>
            <x-loading />
        </div>

        <div class="border-1 border-gray-200 border-dashed rounded-lg">
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
                                    <button @click="open = false" wire:click="$set('file', null)" class="text-gray-400 hover:bg-gray-200 rounded-lg w-8 h-8 flex justify-center items-center">
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

                                                <div class="mb-4" x-data>
                                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        File Dokumen
                                                    </label>
                                                    <p class="text-xs text-blue-500 mb-2">Kirim File PDF dengan Maksimal Size 2MB</p>

                                                    <input type="file" 
                                                        id="pdfInput" 
                                                        wire:model="file" 
                                                        accept=".pdf" 
                                                        class="hidden" 
                                                        x-ref="fileInput">

                                                    @if (!$file)
                                                        <button type="button" 
                                                                @click="$refs.fileInput.click()" 
                                                                class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm cursor-pointer">  
                                                            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                                                            </svg>
                                                            Pilih File PDF
                                                        </button>
                                                    @endif

                                                    <div wire:loading.delay wire:target="file,store" class="mt-2">
                                                        <x-loading />
                                                    </div>

                                                    @if ($file)
                                                        <div class="p-3 bg-blue-50 dark:bg-gray-800 rounded-lg flex items-center justify-between border border-blue-200 dark:border-gray-700 shadow-sm transition-all">
                                                            <div class="flex items-center gap-2 min-w-0">
                                                                <svg class="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
                                                                </svg>
                                                                <span class="text-xs text-blue-900 dark:text-blue-300 font-medium truncate">
                                                                    {{ $file->getClientOriginalName() }}
                                                                </span>
                                                            </div>

                                                            <button type="button" 
                                                                    wire:click="$set('file', null)" 
                                                                    class="ml-2 text-xs text-red-500 hover:text-red-700 font-medium hover:underline flex items-center gap-1 cursor-pointer">
                                                                <span>Hapus</span>
                                                            </button>
                                                        </div>
                                                    @endif

                                                    @error('file') 
                                                        <p class="text-red-500 text-xs mt-1.5">{{ $message }}</p>
                                                    @enderror
                                                </div>
                                            
                                            <div class="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-600 gap-2">
                                                <button type="button" @click="open = false" wire:click="$set('file', null)"  class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">
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

                                                <div class="mb-4" x-data>
                                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        File Dokumen
                                                    </label>
                                                    <p class="text-xs text-blue-500 mb-2">Kirim File PDF dengan Maksimal Size 2MB</p>

                                                    <input type="file" 
                                                        id="pdfInput" 
                                                        wire:model="file" 
                                                        accept=".pdf" 
                                                        class="hidden" 
                                                        x-ref="fileInput">

                                                    @if (!$file)
                                                        <button type="button" 
                                                                @click="$refs.fileInput.click()" 
                                                                class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm cursor-pointer">
                                                            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                                                            </svg>
                                                            Pilih File PDF
                                                        </button>
                                                    @endif

                                                    <div wire:loading.delay wire:target="file,store" class="mt-2">
                                                        <x-loading />
                                                    </div>

                                                    @if ($file)
                                                        <div class="p-3 bg-blue-50 dark:bg-gray-800 rounded-lg flex items-center justify-between border border-blue-200 dark:border-gray-700 shadow-sm transition-all">
                                                            <div class="flex items-center gap-2 min-w-0">
                                                                <svg class="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
                                                                </svg>
                                                                <span class="text-xs text-blue-900 dark:text-blue-300 font-medium truncate">
                                                                    {{ $file->getClientOriginalName() }}
                                                                </span>
                                                            </div>

                                                            <button type="button" 
                                                                    wire:click="$set('file', null)" 
                                                                    class="ml-2 text-xs text-red-500 hover:text-red-700 font-medium hover:underline flex items-center gap-1 cursor-pointer">
                                                                <span>Hapus</span>
                                                            </button>
                                                        </div>
                                                    @endif

                                                    @error('file') 
                                                        <p class="text-red-500 text-xs mt-1.5">{{ $message }}</p>
                                                    @enderror
                                                </div>
                                            </div>
    
                                            <div class="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-600 gap-2">
                                                <button type="button" @click="open = false" wire:click="$set('file', null)"  class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">
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
    document.getElementById('jsLoader')?.classList.remove('hidden');
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            requestAnimationFrame(() => {
                document.getElementById('jsLoader')?.classList.add('hidden');
            });
        }, 1000);
    });
</script>
