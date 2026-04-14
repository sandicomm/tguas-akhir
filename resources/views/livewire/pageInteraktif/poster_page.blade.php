<div class="w-full h-full">
    <div class="media">
        <h1 class="text-4xl font-bold text-white">POSTER</h1>
    </div>

    <div class="flex justify-center items-center mt-10 mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white pb-2">
            Edukasi Diabetes
        </h1>
    </div>
    <script>
        window.typePage = @json($type);
        webpageJs = @js($webpage);
    </script>

    <div class="flex flex-wrap justify-center gap-6 py-6 px-2">
        @if ($media && count($media) > 0)
            @foreach ($media as $poster)
                <div 
                    class="max-w-[16rem] bg-white border border-gray-200 rounded-xl shadow-md dark:bg-gray-800 dark:border-gray-700 cursor-pointer transform hover:scale-105 transition-transform duration-300"
                    data-modal-target="posterModal" 
                    data-modal-toggle="posterModal"
                    onclick="openModal('{{ asset($poster->file_path) }}')">
                    
                    <img class="rounded-t-xl h-64 w-full object-cover" 
                         src="{{ asset($poster->file_path) }}" 
                         alt="{{ $poster->title }}" 
                         loading="lazy">
                    
                    <div class="p-4 text-center">
                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                            {{ $poster->title }}
                        </h4>
                        <p class="text-sm">Sumber: {{ $poster->sumber }}</p>
                        <a href="{{ $poster->link }}" target="_blank" class="text-xs mt-2 rounded py-1 px-2 hover:bg-blue-100 text-blue-500 {{ $poster->link ? '':'hidden' }}">Menuju Ke Sumber</a>
                    </div>
                </div>
            @endforeach
        @else
            <div class="flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800" role="alert">
                <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <span class="sr-only">Info</span>
                <div>
                    <span class="font-medium">belum ada poster yang diupload.
                </div>
            </div>
        @endif
    </div>
    <div id="webpage"></div>
    <div id="posterModal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div class="relative w-full max-w-5xl max-h-full">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        Detail Poster
                    </h3>
                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="posterModal">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <div class="p-6 text-center">
                    <img id="modalPosterImage" class="max-w-full h-auto mx-auto rounded-lg shadow-md" src="" alt="Poster Detail">
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    function openModal(imageUrl) {
        document.getElementById('modalPosterImage').src = imageUrl;
    }
</script>