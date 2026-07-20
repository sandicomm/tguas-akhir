<div class="p-4 sm:ml-64 relative bg-gray-400 dark:bg-gray-300" style="min-height:100dvh;">
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
     <!-- ------------- MODAL NOTIF UMUM ----------------- -->
    <div x-data="{ open: false, message: '', status: true }" 
        @notif-pesan.window="
            open = true; 
            message = $event.detail.pesan; 
            status = $event.detail.status; 
            setTimeout(() => open = false, 5000)
        "
        x-show="open" 
        x-transition

        :class="status ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'"
        class="fixed top-5 left-1/2 transform -translate-x-1/2 border px-4 py-3 rounded shadow-lg z-[9999]" 
        style="display: none;">
        
        <div class="flex items-center justify-between gap-4">
            <span x-text="message"></span>
            <button type="button" @click="open = false" class="font-bold">&times;</button>
        </div>
    </div>

    <!-- ------------- MODAL NOTIF REDIRECT ----------------- -->
    <div x-data="{ openModal: false, pesan: '' }" 
        @alert-success.window="openModal = true; pesan = $event.detail.pesan; redirectUrl = $event.detail.url"
        x-show="openModal" 
        x-cloak
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
        
        <div class="bg-white rounded-lg p-6 lg:w-1/3 w-[80%] shadow-xl">
            <div class="text-center">
                <div class="text-green-500 mb-4">
                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 class="text-xl font-bold text-gray-800">Berhasil!</h3>
                <p class="text-gray-600 mt-2" x-text="pesan"></p>
                
                <div class="mt-6">
                    <button @click="window.location.reload()" 
                            class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition">
                        Oke, Lanjutkan
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div x-data="{ openModal: false, pesan: '' }" 
        @alert-error.window="openModal = true; pesan = $event.detail.pesan; redirectUrl = $event.detail.url"
        x-show="openModal" 
        x-cloak
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
        
        <div class="bg-white rounded-lg p-6 lg:w-1/3 w-[80%] shadow-xl">
            <div class="text-center">
                <div class="text-red-500 mb-4">
                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-800">Gagal!</h3>
                <p class="text-gray-600 mt-2" x-text="pesan"></p>
                
                <div class="mt-6">
                    <button @click="window.location.reload()" 
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
                        Oke
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- ------------ TOAST ---------------------- -->
    <div id="toast-autosave" style="opacity: 0;" class="fixed bottom-5 right-5 z-50 transform translate-y-20 transition-all duration-500 ease-in-out">
        <div class="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span id="toast-message" class="text-sm font-medium">Draft disimpan otomatis</span>
        </div>
    </div>

    <!-- ----------------------------------------------- -->
     <div x-data="{ 
            open: false, 
            tipe: 'warning', 
            judul: '', 
            pesan: '', 
            tombolTeks: 'Oke',
            callback: null 
        }" 
        @confirm-modal.window="
            open = true; 
            tipe = $event.detail.tipe || 'warning';
            judul = $event.detail.judul || 'Konfirmasi';
            pesan = $event.detail.pesan;
            tombolTeks = $event.detail.tombolTeks || 'Oke';
            callback = $event.detail.callback || null;
        "
        x-show="open" 
        x-cloak
        class="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">
        
        <div class="bg-white rounded-lg p-6 lg:w-1/3 w-[80%] shadow-xl transform transition-all">
            <div class="text-center">
                <div :class="{ 'text-red-500': tipe === 'danger', 'text-yellow-500': tipe === 'warning', 'text-blue-500': tipe === 'info' }" class="mb-4">
                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                </div>

                <h3 class="text-xl font-bold text-gray-800" x-text="judul"></h3>
                <p class="text-gray-600 mt-2" x-text="pesan"></p>
                
                <div class="mt-6 flex gap-3">
                    <button @click="open = false; window.dispatchEvent(new CustomEvent('modal-konfirmasi-batal'))" 
                            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition">
                        Batal
                    </button>
                    
                    <button @click="if(callback) { window[callback](); } open = false;; window.dispatchEvent(new CustomEvent('modal-konfirmasi-ya'))" 
                            :class="{ 'bg-red-600 hover:bg-red-700': tipe === 'danger', 'bg-blue-600 hover:bg-blue-700': tipe !== 'danger' }"
                            class="flex-1 text-white font-bold py-2 px-4 rounded transition"
                            x-text="tombolTeks">
                    </button>
                </div>
            </div>
        </div>
    </div>

    @if($webpage)
        <script>
            webpageJs = @js($webpage);
            paramJs = @js($param);
            fileJs=@js($file)
        </script>
    @endif
    <div class="flex justify-center items-center w-full">
        <div id="webpage" data-element-count="0" class="relative" style="width:100%;">
                <!-- Main modal -->
            <div id="recent-image-modal" data-modal-backdrop="" tabindex="-1" aria-hidden="true" class="fixed z-[80] top-0 right-0 w-full sm:pl-[18rem] h-full hidden justify-center items-center">
                <div class="relative dark:bg-white bg-slate-800 rounded-md w-full max-w-2xl max-h-[90vh] overflow-hidden text-white dark:text-black">
                <!-- Modal content -->
                <div class="shadow-sm">
                    <!-- Modal header -->
                    <div class="flex items-center justify-between p-4 md:p-5 border-b-2 rounded-t border-gray-200">
                        <h3 class="text-lg font-medium text-heading">
                            Recent Image
                        </h3>
                        <button type="button" class="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="recent-image-modal">
                            <svg class="w-5 h-5" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
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
            <div id="modal-body-wrapper"></div>
        </div>
    </div>
</div>