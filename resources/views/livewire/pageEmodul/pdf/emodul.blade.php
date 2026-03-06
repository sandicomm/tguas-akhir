<div>
    <div id="loading" class="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-500">
        <div class="flex flex-col items-center">
            <img src="{{ asset('loading.gif') }}" alt="Loading..." class="w-20 h-20 mb-4">
        </div>
    </div>

    <div class="h-[80dvh] md:h-screen flex flex-col items-center p-4">
        
        <div class="w-full max-w-5xl bg-gray-200 rounded-xl shadow-sm border p-3 mb-2 flex flex-wrap justify-between items-center gap-2">
            <div class="flex items-center gap-3">
                <a href="{{ asset($path) }}" target="_blank" download class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2.5 transition-colors inline-flex items-center">
                    <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download PDF
                </a>
            </div>

            <div class="flex items-center">
                <label for="emodul-page-select" class="text-sm font-medium text-gray-700">Halaman:</label>
                <select id="emodul-page-select" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
                    </select>
            </div>
        </div>

        <div class="relative group max-w-full flex justify-center bg-gray-200 rounded-2xl shadow-2xl border border-gray-300 overflow-hidden min-h-full">
            
            <button id="prev-btn" class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:ring-4 focus:ring-blue-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>

            <div id="emodul-pdf-container" class="overflow-auto w-full flex justify-center p-4 bg-gray-300">
                <canvas id="emodul-pdf-canvas" class="max-w-full h-auto shadow-md bg-white"></canvas>
            </div>

            <button id="next-btn" class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:ring-4 focus:ring-blue-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
        </div>

        <div class="absolute bottom-5 mb-10 w-full max-w-sm">
            <a id="emodul-btn-post-test" hidden href="{{ route('form-test', 'post-test-emodul') }}" 
               class="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-bold rounded-xl text-lg px-6 py-4 shadow-xl transform hover:-translate-y-1 transition-all">
                Kerjakan Post Test Sekarang
                <svg class="w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </a>
        </div>
    </div>

    <script type="module">
        import * as pdfjsLib from "{{ asset('js/pdfjs/pdf.mjs') }}";
        pdfjsLib.GlobalWorkerOptions.workerSrc = "{{ asset('js/pdfjs/pdf.worker.mjs') }}";

        const url = "{{ asset($path) }}";
        let pdfDoc = null;
        let currentPage = 1;
        let totalPages = 0;
        let canvas = document.getElementById("emodul-pdf-canvas");
        let ctx = canvas.getContext("2d");

        // Load PDF
        pdfjsLib.getDocument(url).promise.then(pdf => {
            pdfDoc = pdf;
            totalPages = pdf.numPages;

            let select = document.getElementById("emodul-page-select");
            for (let i = 1; i <= totalPages; i++) {
                let option = new Option(`${i}/${totalPages}`, i);
                select.add(option);
            }
            renderPage(currentPage);
        });

        function renderPage(num) {
            pdfDoc.getPage(num).then(page => {
                const pixelRatio = window.devicePixelRatio || 1;
                const viewport = page.getViewport({ scale: 1 }); // High resolution scale

                canvas.width = viewport.width;
                canvas.height = viewport.height;
             

                page.render({
                    canvasContext: ctx,
                    viewport: viewport
                });
            });

            // Update UI
            document.getElementById("emodul-page-select").value = num;
            toggleBtnPostTest();
            
            // Hide loading
            const loader = document.getElementById('loading');
            loader.classList.add('opacity-0');
            setTimeout(() => loader.style.display = 'none', 500);
        }

        function toggleBtnPostTest() {
            const btn = document.getElementById('emodul-btn-post-test');
            if (currentPage === totalPages) {
                btn.removeAttribute('hidden');
                btn.classList.add('flex'); // Show using flex
            } else {
                btn.setAttribute('hidden', true);
                btn.classList.remove('flex');
            }
        }

        // Event Listeners
        document.getElementById("next-btn").onclick = () => {
            currentPage = (currentPage < totalPages) ? currentPage + 1 : 1;
            renderPage(currentPage);
        };

        document.getElementById("prev-btn").onclick = () => {
            currentPage = (currentPage > 1) ? currentPage - 1 : totalPages;
            renderPage(currentPage);
        };

        document.getElementById("emodul-page-select").onchange = (e) => {
            currentPage = parseInt(e.target.value);
            renderPage(currentPage);
        };

        window.onresize = () => renderPage(currentPage);
    </script>
</div>