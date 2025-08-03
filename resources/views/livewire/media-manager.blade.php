<div class="p-4 sm:ml-64 flex justify-center items-center flex-col">
    <h2 class="text-4xl font-bold">Poster & Video</h2>

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

        @if ($errors->any())
            <div x-data="{ show: true }" x-show="show" x-init="setTimeout(() => show = false, 30000)" class="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg z-50">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

    <!-- Modal body -->
     <div class="w-full flex justify-center flex-col bg-white shadow-sm rounded p-3 items-start mt-6">
        <h1 class="px-4 text-xl font-bold">Upload</h1>
         <form wire:submit.prevent="store" class="w-full flex p-4 justify-start items-start flex-col gap-2 rounded ">
            <div class="flex flex-col w-1/2">
                <input type="text" wire:model="title" placeholder="Judul File" class="border w-full mb-2">
                <input type="file" wire:model="file" class="border w-full">
                @error('file') <span class="text-red-500">{{ $message }}</span> @enderror
            </div>
            <button type="submit" 
                wire:loading.attr="disabled" 
                wire:target="file"
                class="w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Upload
            </button>
            <x-loading wire:loading.flex />
         </form>
     </div>

     <div class=" bg-white mt-6 px-4 rounded w-full">
         <h2 class="text-xl font-bold mt-5">Daftar Media</h2>
         <div class="flex my-3 bg-gray-300 rounded overflow-hidden w-fit">
             <button wire:click="$set('filter', 'all')" class="p-2 {{ $filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-300' }}">Semua</button>
             <button wire:click="$set('filter', 'image')" class="p-2 {{ $filter === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-300' }}">Gambar</button>
             <button wire:click="$set('filter', 'video')" class="p-2 {{ $filter === 'video' ? 'bg-blue-500 text-white' : 'bg-gray-300' }}">Video</button>
         </div>
     
     
         <ul class="flex justify-center gap-2 items-center flex-wrap">
             @foreach ($mediaList as $media)
                 <li wire:key="media-{{ $media->id }}" class="flex justify-between items-center border p-2 mt-2 w-1/4 flex-col">
                     @if ($media->type === 'image')
                         <img src="{{ asset('storage/' . $media->file_path) }}" alt="{{ $media->title }}" class="w-full object-cover">
                     @else
                         <video src="{{ asset('storage/' . $media->file_path) }}" class="w-full object-cover" controls></video>
                     @endif
                     <span>{{ $media->title }} ({{ $media->type }})</span>
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
