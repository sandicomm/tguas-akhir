<div class="p-4 sm:ml-64 relative dark:bg-gray-400 bg-gray-300" style="min-height:100dvh;">
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
    @if($webpage)
        <script>
            webpageJs = @js($webpage);
            paramJs = @js($param);
            fileJs=@js($file)
        </script>
    @endif
    <div id="webpage" data-element-count="0" class="relative">
            <!-- Main modal -->
        <div id="recent-image-modal" data-modal-backdrop="" tabindex="-1" aria-hidden="true" class="fixed z-[80] top-0 right-0 w-full sm:pl-[18rem] h-full hidden justify-center items-center">
            <div class="relative bg-white dark:bg-slate-800 rounded-md w-full max-w-2xl max-h-[90vh] overflow-hidden dark:text-white text-black">
            <!-- Modal content -->
            <div class="shadow-sm">
                <!-- Modal header -->
                <div class="flex items-center justify-between p-4 md:p-5 border-b-2 rounded-t border-gray-200">
                    <h3 class="text-lg font-medium text-heading">
                        Recent Image
                    </h3>
                    <button type="button" class="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="recent-image-modal">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>

                <!-- Modal body -->
                <div id="body-media-recent" class="flex flex-row flex-wrap gap-2 justify-center items-start p-3 overflow-y-auto max-h-[70vh]">
                    -- Belum Ada Gambar Yang Diupload --
                </div>
            </div>
            </div>
        </div>
    </div>
</div>