<div class="w-full h-full">
    <div class="media">
        <h1 class="text-4xl font-bold text-white">VIDEO</h1>
    </div>

    <div class="flex justify-center items-center mt-10 mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white pb-2 text-center">
            Edukasi Diabetes
        </h1>
    </div>

    <script>
        window.typePage = @json($type);
        webpageJs = @js($webpage);
    </script>

    <div class="flex flex-wrap justify-center gap-8 py-6 px-4 lg:px-10">
        @if($media && count($media) > 0)
            @foreach ($media as $index => $video)
                <div class="w-full max-w-[18rem] bg-white border border-gray-200 rounded-2xl shadow-lg dark:bg-gray-800 dark:border-gray-700 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                    <div class="relative bg-black h-48 flex items-center justify-center">
                        <video id="video{{ $index }}" 
                               class="w-full h-full object-contain" 
                               src="{{ asset($video->file_path) }}">
                        </video>
                    </div>

                    <div class="p-5 text-center">
                        <div class="mb-3">
                            <h4 class="text-lg font-bold text-gray-900 dark:text-white truncate">
                                {{ $video->title ?? 'Edukasi Video' }}
                            </h4>
                            <p class="text-sm">Sumber: {{ $video->sumber }}</p>
                            <a href="{{ $video->link }}" target="_blank" class="text-xs mt-2 rounded py-1 px-2 hover:bg-blue-100 text-blue-500 {{ $video->link ? '':'hidden' }}">Menuju Ke Sumber</a>
                        </div>

                        <div class="flex flex-col gap-3">
                            <button onclick="togglePlay(event, {{ $index }})" 
                                    class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors">
                                <span id="btnText{{ $index }}" class="flex items-center">
                                    <svg id="playIcon{{ $index }}" class="w-5 h-5 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
                                    Play Video
                                </span>
                            </button>

                            <button onclick="enterFullscreen(event, {{ $index }})" 
                                    class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                Fullscreen
                            </button>
                        </div>
                    </div>
                </div>
            @endforeach
        @else
            <div class="flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800" role="alert">
                <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <div>
                    <span class="font-medium">belum ada video yang diupload
                </div>
            </div>
        @endif
    </div>
    <div id="webpage"></div>
</div>
<script>
    let playingVideos = {};

    function togglePlay(event, index) {
        event.preventDefault();
        let video = document.getElementById(`video${index}`);
        let btnText = document.getElementById(`btnText${index}`);
        
        // SVG Icon Templates
        const playSvg = `<svg class="w-5 h-5 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg> Play Video`;
        const pauseSvg = `<svg class="w-5 h-5 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg> Pause Video`;

        if (video.paused) {
            pauseAllVideos();
            video.play();
            btnText.innerHTML = pauseSvg;
            playingVideos[index] = video;
        } else {
            video.pause();
            btnText.innerHTML = playSvg;
            delete playingVideos[index];
        }
    }

    function pauseAllVideos() {
        const playSvg = `<svg class="w-5 h-5 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg> Play Video`;
        
        Object.keys(playingVideos).forEach(index => {
            let video = playingVideos[index];
            let btnText = document.getElementById(`btnText${index}`);
            if (video) video.pause();
            if (btnText) btnText.innerHTML = playSvg;
            delete playingVideos[index];
        });
    }

    function enterFullscreen(event, index) {
        event.preventDefault();
        let video = document.getElementById(`video${index}`);
        if (video.requestFullscreen) video.requestFullscreen();
        else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
        else if (video.msRequestFullscreen) video.msRequestFullscreen();
    }

    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
            // Opsional: Tetap putar video saat keluar fullscreen atau pause
            // pauseAllVideos(); 
        }
    });
</script>