<div class="p-4 sm:ml-64 flex justify-center items-center flex-col gap-2" x-data="{ open: @entangle('isModalOpen') }">
    <div class="hidden" id='jsLoader'>
        <x-loading />
    </div>
    <script>
        document.getElementById('jsLoader').classList.remove('hidden');
        setTimeout(()=>{
            document.getElementById('jsLoader').classList.add('hidden');
        },2750)
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

    <div class="relative overflow-hidden sm:rounded-lg w-full shadow-md dark:bg-slate-800 bg-white">
        <h2 class="text-2xl font-bold bg-cyan-600 rounded p-3 mb-1 text-center text-white">Media</h2>
        <div class="m-3">
            <div class="flex flex-wrap justify-between gap-3 my-3">
                <div>
                    <button wire:click="setStatsAction('none', 'add')" class="block text-white bg-green-500 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-blue-800" type="button">
                        Tambah Media
                    </button>
                </div>
                
                <div class="rounded overflow-hidden bg-blue-500">
                    <div class="w-full text-center text-white py-1">Filter</div>
                    <div id="button-filter-wrapper" class="flex">
                        <button onclick="filterSet('semua')" id="semua" class="filter-button p-2 bg-blue-500 text-white">Semua</button>
                        <button onclick="filterSet('gambar')" id="gambar" class="filter-button p-2 bg-gray-300">Gambar</button>
                        <button onclick="filterSet('video')" id="video" class="filter-button p-2 bg-gray-300">Video</button>
                    </div>
                </div>
            </div>
         
            <div id="media-list" class="grid grid-cols-3">
                @foreach ($mediaList as $media)
                    <div wire:key="media-{{ $media->id }}" data-type="{{ $media->type }}" class="item-media-{{$media->type}} flex justify-between items-center border rounded-md dark:border-slate-500 border-slate-800 p-2 mt-2 h-64 flex-col">
                        @if ($media->type === 'image')
                            <div class="overflow-hidden relative"
                                data-modal-target="modalMedia" 
                                data-modal-toggle="modalMedia"
                                onclick="openModal('{{ asset($media->file_path) }}', '{{ $media->type }}')"
                            >
                                <div class="cursor-pointer absolute z-2 bg-blue-300/40 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition "><b>Preview</b></div>
                                <img src="{{asset($media->file_path)}}" alt="{{ $media->title }}" class="w-full object-cover">
                            </div>
                        @else
                            <div class="overflow-hidden relative"
                                data-modal-target="modalMedia" 
                                data-modal-toggle="modalMedia"
                                onclick="openModal('{{ asset($media->file_path) }}', '{{ $media->type }}')"
                            >
                                <div class="cursor-pointer absolute z-2 bg-blue-300/40 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition "><b>Preview</b></div>
                                <video src="{{asset($media->file_path)}}" class="w-full object-cover"></video>
                            </div>
                        @endif
                        <div class="text-center my-1 flex flex-col">
                            <span class="dark:text-white text-black">{{ $media->title }} ({{ $media->type }})</span>
                            <span class="dark:text-white text-black">Sumber: {{ $media->sumber }}</span>
                            <a href="{{ $media->link }}" target="_blank" class="rounded py-1 hover:bg-blue-200 text-blue-500 {{ $media->link ? '':'hidden' }}">Menuju Ke Sumber</a>
                        </div>

                        <div class="flex justify-center items-center gap-3 w-auto">
                            <button wire:click="setStatsAction({{ $media['id'] }}, 'edit')" class="block text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Edit</button>
                            <button wire:click="setStatsAction({{ $media['id'] }}, 'delete')" class="block text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Delete</button>
                        </div>
                    </div>
                @endforeach

                <!-- Modal -->
                <div id="modalMedia" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div class="relative w-full max-w-5xl max-h-full">
                        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                    Media Preview
                                </h3>
                                <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="modalMedia">
                                    <svg class="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span class="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div class="p-6 text-center">
                                <img id="modalImage" class="h-[100vh] mx-auto rounded-lg shadow-md hidden" src="" alt="Poster Detail">
                                <video id="modalVideo" class="hidden" src="" controls>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MODAL -->
            <div x-show="open" x-transition x-cloak class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999] dark:text-white text-black">
                <div class="bg-white dark:bg-slate-700 rounded-lg p-2 lg:w-1/3 w-[90%]">
                    <div class="flex items-center justify-between p-3 rounded-t border-b border-gray-200 dark:border-gray-600">
                        <h3 class="text-xl font-bold">
                            @if ($statsAction === 'add')
                                Tambah Media
                            @elseif ($statsAction === 'edit')
                                Edit Media
                            @elseif ($statsAction === 'delete')
                                Hapus Media
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
                                    <label>Nama Media</label>
                                    <input type="text" wire:model="title" 
                                        placeholder="Ketik Nama Media disini..."
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                    @error('title') 
                                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                    @enderror
                                </div>
                                
                                <div class="mb-4">
                                    <label>Sumber</label>
                                    <input type="text" wire:model="sumber" 
                                        placeholder="Ketik Sumber Media disini..."
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                    @error('sumber') 
                                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                    @enderror
                                </div>
                                
                                <div class="mb-4">
                                    <label>Link Sumber</label>
                                    <input type="text" wire:model="link" 
                                        placeholder="Ketik Link Sumber Media disini..."
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    @error('link') 
                                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                    @enderror
                                </div>

                                <div class="mb-4">
                                    <label>File</label>
                                    <input type="file" wire:model="file" 
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">

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
                                <button type="submit" class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700">
                                    Simpan
                                </button>
                            </div>
                        </form>

                    @elseif ($statsAction === 'edit')
                        <form wire:submit.prevent="update">
                            <div class="md:p-5 space-y-4">
                                <div class="mb-4">
                                    <label>Nama Media</label>
                                    <input type="text" wire:model="title" 
                                        placeholder="Ketik Nama Media disini..."
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                    @error('title') 
                                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                    @enderror
                                </div>
                                
                                <div class="mb-4">
                                    <label>Sumber</label>
                                    <input type="text" wire:model="sumber" 
                                        placeholder="Ketik Sumber Media disini..."
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                    @error('sumber') 
                                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                    @enderror
                                </div>
                                
                                <div class="mb-4">
                                    <label>Link Sumber</label>
                                    <input type="text" wire:model="link" 
                                        placeholder="Ketik Link Sumber Media disini..."
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    @error('link') 
                                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                                    @enderror
                                </div>

                                <div class="mb-4">
                                    <label>File</label>
                                    <input type="file" wire:model="file" 
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        
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
                                    <span class="block sm:inline">Tindakan ini akan menghapus Media.</span>
                                </div>

                                <p>Jika anda yakin ingin <span class="font-bold">MENGHAPUS</span> Media ini, Ketik <span class="font-bold">"Hapus Media"</span></p>
                                <input type="text" wire:model="confirmDelete" 
                                    placeholder="Ketik 'hapus media' disini..."
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
        </div>
     </div>
     
     <script>
        function openModal(mediaUrl, type) {
            let modalImage = document.getElementById('modalImage')
            let modalVideo = document.getElementById('modalVideo')

            modalImage.src = ''
            modalImage.classList.add('hidden')

            modalVideo.src = ''
            modalVideo.classList.add('hidden')

            if(type == 'image'){
                modalImage.src = mediaUrl
                modalImage.classList.remove('hidden')
            }else if(type == 'video'){
                modalVideo.src = mediaUrl
                modalVideo.classList.remove('hidden')
            }
        }

        function filterSet(param){
            let filterSemua = document.getElementById('semua')
            let filterGambar = document.getElementById('gambar')
            let filterVideo = document.getElementById('video')

            let mediaList = document.getElementById('media-list')

            document.getElementById('button-filter-wrapper').querySelectorAll('.filter-button').forEach(el => {
                el.classList.remove('bg-blue-500', 'text-white')
                el.classList.add('bg-gray-300')
            });

            if(param == 'semua'){
                filterSemua.classList.remove('bg-gray-300')
                filterSemua.classList.add('bg-blue-500', 'text-white')

                mediaList.querySelectorAll('[class^="item-media-"]').forEach(el => {
                    el.classList.remove('hidden')
                });

            }else if(param == 'gambar'){
                filterGambar.classList.remove('bg-gray-300')
                filterGambar.classList.add('bg-blue-500', 'text-white')

                mediaList.querySelectorAll('.item-media-video').forEach(el => {
                    el.classList.add('hidden')
                });
                
                mediaList.querySelectorAll('.item-media-image').forEach(el => {
                    el.classList.remove('hidden')
                });
                
            }else if(param =='video'){
                filterVideo.classList.remove('bg-gray-300')
                filterVideo.classList.add('bg-blue-500', 'text-white')

                mediaList.querySelectorAll('.item-media-image').forEach(el => {
                    el.classList.add('hidden')
                });

                mediaList.querySelectorAll('.item-media-video').forEach(el => {
                    el.classList.remove('hidden')
                });
            }
        }

        window.addEventListener('resetForm', () => {
            document.querySelector('input[type="file"]').value = "";
            document.querySelector('input[type="text"]').value = "";
        });
    </script>
</div>
