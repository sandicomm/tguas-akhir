<div class="p-4 sm:ml-64 flex justify-center items-center flex-col">
        <div class="hidden" id='jsLoader'>
            <x-loading />
        </div>
        <script>
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                document.getElementById('jsLoader').classList.add('hidden');
            },2750)
        </script>
    <h2 class="text-4xl font-bold text-white dark:text-black">Poster & Video</h2>  
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

    <!-- Modal body -->
     <div class="w-full flex justify-center flex-col dark:bg-white bg-slate-800 shadow-sm rounded p-3 items-start mt-6">
        <h1 class="px-4 text-xl font-bold text-white dark:text-black">Upload</h1>
         <form wire:submit.prevent="store" class="w-full flex p-4 justify-start items-start flex-col gap-2 rounded ">
            <div class="flex flex-col w-1/2">
                <input type="text" wire:model="title" placeholder="Judul File" 
                    class="dark:bg-gray-50 border border-gray-300 dark:text-gray-900 text-sm rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 block w-full bg-gray-700 dark:border-gray-600 
                            dark:placeholder-gray-400 text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <p class="text-blue-500 mt-3">Max File 20Mb</p>
                <input type="file" wire:model="file" class="dark:bg-gray-50 border border-gray-300 dark:text-gray-900 text-sm rounded-lg 
                                                            focus:ring-blue-500 focus:border-blue-500 block w-full bg-gray-700 dark:border-gray-600 
                                                            dark:placeholder-gray-400 text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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

     <div class=" dark:bg-white bg-slate-800 mt-6 px-4 rounded w-full">
         <h2 class="text-xl font-bold mt-5 text-white dark:text-black">Daftar Media</h2>
         <div class="flex my-3 bg-gray-300 rounded overflow-hidden w-fit">
             <button wire:click="$set('filter', 'all')" class="p-2 {{ $filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-300' }}">Semua</button>
             <button wire:click="$set('filter', 'image')" class="p-2 {{ $filter === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-300' }}">Gambar</button>
             <button wire:click="$set('filter', 'video')" class="p-2 {{ $filter === 'video' ? 'bg-blue-500 text-white' : 'bg-gray-300' }}">Video</button>
         </div>
     
     
         <ul class="flex justify-center gap-2 items-center flex-wrap">
             @foreach ($mediaList as $media)
                 <li wire:key="media-{{ $media->id }}" class="flex justify-between items-center border rounded-md border-slate-500 dark:border-slate-800 p-2 mt-2 w-1/4 flex-col">
                     @if ($media->type === 'image')
                         <img src="{{$media->file_path}}" alt="{{ $media->title }}" class="w-full object-cover">
                     @else
                         <video src="{{$media->file_path}}" class="w-full object-cover" controls></video>
                     @endif
                     <span class="text-white dark:text-black">{{ $media->title }} ({{ $media->type }})</span>
                     <button wire:click="delete({{ $media->id }})" class="bg-red-500 text-white p-1 rounded">Hapus</button>
                 </li>
             @endforeach
         </ul>
     </div>
     
     <script>
        window.addEventListener('resetForm', () => {
            document.querySelector('input[type="file"]').value = "";
            document.querySelector('input[type="text"]').value = "";
        });
    </script>
</div>
