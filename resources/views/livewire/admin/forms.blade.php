<div class="p-4 sm:ml-64 flex justify-center items-center flex-col" x-data="{ open: @entangle('isModalOpen') }">
<x-loading wire:loading.flex />
        <div class="hidden" id='jsLoader'>
            <x-loading />
        </div>
        <script>
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                document.getElementById('jsLoader').classList.add('hidden');
            },3750)
        </script>
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

        <h1 class="text-4xl font-bold dark:text-white text-black">Daftar Form</h1>
        <div class="flex flex-wrap m-6 p-5 bg-slate-200 dark:bg-slate-700 w-full rounded gap-3">
            <div class="w-full flex justify-end">
                <a href="{{ route('admin.form.detail', 'add') }}" class="bg-green-600 px-5 py-2 rounded shadow-sm text-white inline-block lg:text-xl">Tambah</a>
            </div>
            @foreach($forms as $index => $form)
            <a href="{{ route('admin.form.detail', $form->id) }}" id="btn-form-{{ $form->id }}" class="w-full">
                <div class="bg-gradient-to-r to-green-400 from-blue-600 dark:from-violet-600 dark:to-gray-800 p-4 rounded shadow-sm text-white w-full flex">
                    <div class="w-full">
                        <div class="title">
                            <h1 class="lg:text-4xl text-xl font-bold">{{ $form->form_name }}</h1>
                        </div>
                        <div class="flex flex-wrap items-start justify-center gap-2 lg:w-[70%] mt-5 text-sm lg:text-lg text-black">
                            <div class="lg:flex-[1_1_calc(25%-0.5rem)] flex-[1_1_calc(100%-0.5rem)] bg-white p-2 rounded">
                                <p class="text-sm  text-center">Form Ini Ditaruh Dimana?</p>
                                <p class="text-sm bg-blue-200 p-1 rounded text-center {{ $form->placement == 'disable' ? 'text-red-600'  : '' }}">{{ $form->placement == 'disable' ? 'form tidak aktif' : $form->placement }}</p>
                            </div>
                            <div class="lg:flex-[1_1_calc(25%-0.5rem)] flex-[1_1_calc(100%-0.5rem)] bg-white p-2 rounded">
                                <p class="text-sm text-center">Responden Harus Sertakan Email?</p>
                                <p class="text-sm bg-blue-200 p-1 rounded text-center">{{ $form->collect_email ? 'Iya' : 'Tidak' }}</p>
                            </div>
                            <div class="lg:flex-[1_1_calc(25%-0.5rem)] flex-[1_1_calc(100%-0.5rem)] bg-white p-2 rounded">
                                <p class="text-sm text-center">Responden Cuman Boleh Mengisi Form Satu Kali?</p>
                                <p class="text-sm bg-blue-200 p-1 rounded text-center">{{ $form->one_attempt ? 'Iya' : 'Tidak' }}</p>
                            </div>
                            <div class="lg:flex-[1_1_calc(25%-0.5rem)] flex-[1_1_calc(100%-0.5rem)] bg-white p-2 rounded">
                                <p class="text-sm text-center">Apakah Form Harus Diisi?</p>
                                <p class="text-sm bg-blue-200 p-1 rounded text-center">{{ $form->must_fill ? 'Iya' : 'Tidak' }}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <a data-popover-target="popover-hapus-form-{{ $index }}" wire:click="setStatsAction({{$form->id}})" data-popover-placement="left">
                            <svg class="lg:w-8 lg:h-8 text-white hover:text-gray-700 cursor-pointer" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                            </svg>
                        </a> 
                        <div data-popover id="popover-hapus-form-{{ $index }}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm dark:text-white transition-opacity duration-300 dark:bg-gray-600 border dark:border-gray-200 rounded-lg shadow-xs opacity-0 text-gray-400 border-gray-600 bg-gray-800">
                            <div class="py-2 px-3">
                                <p>Hapus Form</p>
                            </div>
                            <div data-popper-arrow></div>
                        </div>

                        <a data-popover-target="popover-copy-form-{{ $index }}"  wire:click="copy({{$form->id}})" data-popover-placement="left">
                            <svg class="lg:w-8 lg:h-8 text-white hover:text-gray-700 cursor-pointer" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M9 8v3a1 1 0 0 1-1 1H5m11 4h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1m4 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L7.7 8.35A1 1 0 0 1 8.46 8H13a1 1 0 0 1 1 1Z"/>
                            </svg>
                        </a>
                        <div data-popover id="popover-copy-form-{{ $index }}" role="tooltip" class="absolute z-10 invisible inline-block text-sm dark:text-white transition-opacity duration-300 dark:bg-gray-600 border dark:border-gray-200 rounded-lg shadow-xs opacity-0 text-gray-400 border-gray-600 bg-gray-800">
                            <div class="py-2 px-3">
                                <p>Copy Form</p>
                            </div>
                            <div data-popper-arrow></div>
                        </div>
                        
                    </div>
                    
                </div>
            </a>
            @endforeach
        </div>
        <div x-show="open" x-transition x-cloak class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999] dark:text-white text-black">
            <div class="bg-white dark:bg-slate-700 rounded-lg p-2 lg:w-1/3 w-[90%]">
                <div class="flex items-center justify-between p-3 rounded-t border-b border-gray-200 dark:border-gray-600">
                    <h3 class="text-xl font-bold">
                        Hapus Form
                    </h3>
                    <button type="button" @click="open = false" class="text-gray-400 hover:bg-gray-200 rounded-lg w-8 h-8 flex justify-center items-center" >
                        <svg class="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <form wire:submit.prevent="delete">
                    @csrf
                    <div class="p-4 md:p-5 space-y-4">
                        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong class="font-bold">Perhatian!</strong>
                            <span class="block sm:inline">Tindakan ini juga akan menghapus response pada form ini.</span>
                        </div>

                        <p>Jika anda yakin ingin <span class="font-bold">MENGHAPUS</span> Form ini, Ketik <span class="font-bold">"Hapus Form"</span></p>
                        <input type="text" wire:model="confirmDelete" 
                            placeholder="Ketik 'hapus form' disini..."
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
                            Hapus Data
                        </button>
                    </div>
                </form>
            </div>
        </div>
</div>
