<div class="p-4 sm:ml-64 flex justify-center items-center flex-col" x-data="{ open: @entangle('isModalOpen') }">
        <div class="hidden" id='jsLoader'>
            <x-loading />
        </div>
        <script>
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                document.getElementById('jsLoader').classList.add('hidden');
            },2750)
        </script>
    <h2 class="text-4xl font-bold dark:text-white text-black">Poster & Video</h2>  
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

     <div class="w-full flex justify-center flex-col bg-white dark:bg-slate-800 shadow-sm rounded p-3 items-start mt-6">
        <h1 class="px-4 text-xl font-bold dark:text-white text-black">Upload</h1>
         <form wire:submit.prevent="store" class="w-full flex p-4 justify-start items-start flex-col gap-2 rounded ">
            <div class="flex flex-col w-1/2">
                <p class="text-red-500">*</p>
                <input type="text" wire:model="title" placeholder="Judul File" 
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 
                            dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <p class="text-red-500">*</p>            
                <input type="text" wire:model="sumber" placeholder="Sumber File" 
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 
                            dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <input type="url" wire:model="link" placeholder="Link Sumber File" 
                    class="bg-gray-50 border mt-5 border-gray-300 text-gray-900 text-sm rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 
                            dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <p class="text-blue-500 mt-3">Max File 20Mb</p>
                <input type="file" wire:model="file" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                            focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 
                                                            dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <div wire:loading.delay wire:target="file,store">
                    <x-loading />
                </div>
                @error('file') <span class="text-red-500">{{ $message }}</span> @enderror
            </div>
            <button type="submit" 
                wire:loading.attr="disabled" 
                wire:loading.class="bg-blue-200" 
                wire:target="file"
                class="w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Upload
            </button>
         </form>
     </div>

     <div class=" bg-white dark:bg-slate-800 mt-6 px-4 rounded w-full">
         <h2 class="text-xl font-bold mt-5 dark:text-white text-black">Daftar Media</h2>
         <div class="flex my-3 bg-gray-300 rounded overflow-hidden w-fit">
             <button wire:click="$set('filter', 'all')" class="p-2 {{ $filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-300' }}">Semua</button>
             <button wire:click="$set('filter', 'image')" class="p-2 {{ $filter === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-300' }}">Gambar</button>
             <button wire:click="$set('filter', 'video')" class="p-2 {{ $filter === 'video' ? 'bg-blue-500 text-white' : 'bg-gray-300' }}">Video</button>
         </div>
     
     
         <ul class="flex justify-center gap-2 items-center flex-wrap">
             @foreach ($mediaList as $media)
                 <li wire:key="media-{{ $media->id }}" class="flex justify-between items-center border rounded-md dark:border-slate-500 border-slate-800 p-2 mt-2 w-1/4 flex-col">
                     @if ($media->type === 'image')
                         <img src="{{asset($media->file_path)}}" alt="{{ $media->title }}" class="w-full object-cover">
                     @else
                         <video src="{{asset($media->file_path)}}" class="w-full object-cover" controls></video>
                     @endif
                     <span class="dark:text-white text-black">{{ $media->title }} ({{ $media->type }})</span>
                     <span class="dark:text-white text-black">Sumber: {{ $media->sumber }}</span>
                     <a href="{{ $media->link }}" target="_blank" class="m-2 rounded py-1 px-2 hover:bg-blue-200 text-blue-500 {{ $media->link ? '':'hidden' }}">Menuju Ke Sumber</a>
                     <button wire:click="setStatsAction({{ $media['id'] }}, 'delete')" class="block text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Delete</button>
                 </li>
             @endforeach
         </ul>
     </div>

     <!-- MODAL -->
    <div x-show="open" x-transition x-cloak class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
        <div class="bg-white dark:bg-slate-800 rounded-lg p-3 lg:w-1/3 w-[70%] text-black dark:text-white">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-600 dark:border-gray-200">
                <h3 class="text-xl font-bold mb-4">Hapus Media</h3>
                <button type="button" @click="open = false" class="text-gray-400 bg-transparent dark:hover:bg-gray-200 dark:hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white">
                    <svg class="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <div>
                <div class="p-4 md:p-5 space-y-2">
                    <p>anda yakin ingin <span class="font-bold">MENGHAPUS</span> data ini?</p>
                </div>
                <!-- Modal footer -->
                <div class="flex items-center p-4 md:p-5 border-t dark:border-gray-200 rounded-b border-gray-600">
                     <button wire:click="delete({{ $mediaId }})" class="block text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Hapus</button>
                </div>
        </div>
        </div>
    </div>
     
     <script>
        window.addEventListener('resetForm', () => {
            document.querySelector('input[type="file"]').value = "";
            document.querySelector('input[type="text"]').value = "";
        });
    </script>
</div>
