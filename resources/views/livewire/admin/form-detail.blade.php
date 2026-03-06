<script>
    let allowUnload = false;
    window.addEventListener('beforeunload', function (e) {
        if (!allowUnload) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
</script>
 
<div class="p-4 sm:ml-64 flex justify-center items-center">
    @vite(['resources/js/editForm.js'])
        <div class="hidden" id='jsLoader'>
            <x-loading />
        </div>
        <script>
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                document.getElementById('jsLoader').classList.add('hidden');
            },1000)
        </script>
    <section class="lg:w-1/2">
        <!-- Menampilkan detail form -->
        <a href="{{ route('admin.forms') }}" class="bg-gray-700 p-2 rounded shadow text-white mb-4 lg:text-lg text-sm inline-block">
            Kembali ke Daftar Form
        </a>
        <script>
            let formJs =''
        </script>
        @if ($form)
            <script>
                formJs = @js($form);
                let fileJs=@js($file);
                let formPlacementJs=@js($formPlacement);
                let sectionMaxID = @js($sectionMaxID);
                let questionMaxID = @js($questionMaxID);
                let answerMaxID = @js($answerMaxID);
            </script>

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
            <div x-data="{ openModal: false, pesan: '', redirectUrl: '',status: true }" 
                @redirect-modal.window="openModal = true; pesan = $event.detail.pesan; redirectUrl = $event.detail.url, status = $event.detail.status"
                x-show="openModal" 
                x-cloak
                class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
                
                <div class="bg-white rounded-lg p-6 lg:w-1/3 w-[80%] shadow-xl">
                    <div class="text-center">
                        <div class="mb-4" :class="status ? 'text-green-500' : 'text-red-500'">
                            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" :stroke-width="status ? '2' : ''" 
                                    :d="status ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z'">
                                </path>
                            </svg>
                            
                        </div>
                        <h3 class="text-xl font-bold text-gray-800" x-text="status ? 'Berhasil!' : 'Peringatan!'"></h3>
                        <p class="text-gray-600 mt-2" x-text="pesan"></p>
                        
                        <div class="mt-6">
                            <button @click="redirectUrl !== 'gk redirect' ? window.location.href = redirectUrl : openModal = false"
                                    :class ="status ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
                                    class="w-full text-white font-bold py-2 px-4 rounded transition">
                                    Oke, Lanjutkan
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ------------ TOAST ---------------------- -->
            <div id="toast-autosave" class="fixed bottom-5 right-5 z-50 transform translate-y-20 opacity-0 transition-all duration-500 ease-in-out">
                <div class="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
                    <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span id="toast-message" class="text-sm font-medium">Draft disimpan otomatis</span>
                </div>
            </div>

            <!-- Recent Image Modal -->
            <div id="recent-image-modal" aria-modal="true" data-modal-backdrop="" tabindex="-1" role="dialog" class="fixed z-[80] top-0 right-0 w-full sm:pl-[18rem] h-full hidden justify-center items-center">
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
            
            <div id="form" class="lg:mt-10">
                <div class="w-full fixed top-0 right-0 z-30 hidden" id="btn-update-form">
                    <div class="bg-white dark:bg-slate-700 p-4 text-center sm:ml-64 flex justify-center items-center gap-4 shadow-lg border-t">
                        <p class="dark:text-white text-black">Ada perubahan dalam form, klik update untuk simpan perubahan</p>
                        <input type="hidden" name="form_status" class="lg:text-lg text-sm" value="${formCopy.status ?? 'l'}">
                        <button wire:loading.attr='disabled' type="submit" id="btn-form-update" class="focus:outline-none text-white dark:bg-green-700 dark:hover:bg-green-800 focus:ring-4 dark:focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-green-600 hover:bg-green-700 focus:ring-green-800">
                            Update
                        </button>
                        <!-- <button wire:loading.attr='disabled' type="submit" id="btn-form-cek" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                            Cek
                        </button> -->
                    </div>
                    </div>
                <div id="error-container" class="fixed top-12 right-4 bg-red-500 text-white p-4 rounded shadow-lg z-50 hidden">
                    
                </div>
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
                            <span>error pesan</span>
                            <button type="button" class="text-red-700 hover:text-red-900" onclick="this.parentElement.parentElement.remove()">
                                &times;
                            </button>
                        </div>
                    </div>
                @endif

                <div class="w-full flex justify-center items-start gap-2">
                    <div class="bg-white dark:bg-slate-700 rounded p-4 w-full mb-3 flex flex-col justify-center items-center">
                        <input type="hidden" name="form_id" value="{{ $form->id }}">
                        <div class="w-full">
                            <input class="text-2xl rounded border-1 border-slate-300 w-full dark:bg-slate-800 bg-white dark:text-white text-black" name="form_name" id="form-name-field">
                        </div>
                        <div class="flex mt-3 flex-wrap justify-center items-start gap-3 w-full" id="form-utils">
                            <input type="hidden" name="changeContent" value="${formCopy.changeContent}">
                            <div class="flex-[1_1_calc(50%-0.5rem)] flex-col justify-center items-center font-bold p-4 bg-gradient-to-t from-blue-400 to-teal-300 dark:from-violet-800 dark:to-slate-900  rounded">
                                <p class="dark:text-white text-black">Form Ingin Ditaruh Dimana?</p>
                                <select name="placement" id="form-setting-placement" class="border-0 rounded mt-2 bg-slate-100">
                                    <option value="pre-test-interaktif" {{ $form->placement == 'pre-test-interaktif' ? 'selected':'' }}>pre-test Interaktif Page</option>
                                    <option value="post-test-interaktif" {{ $form->placement == 'post-test-interaktif' ? 'selected':'' }}>post-test Interaktif Page</option>
                                    <option value="pre-test-emodul" {{$form->placement == 'pre-test-emodul' ? 'selected':''}}>pre-test Emodul Page</option>
                                    <option value="post-test-emodul" {{$form->placement == 'post-test-emodul' ? 'selected':''}}>post-test Emodul Page</option>
                                    <option value="disable" {{$form->placement == 'disable' ? 'selected':''}}>disable</option>
                                </select>
                            </div>
                            <div class="flex-[1_1_calc(50%-0.5rem)] flex-col justify-center items-center font-bold p-4 bg-gradient-to-t from-blue-400 to-teal-300 dark:from-violet-800 dark:to-slate-900  rounded">
                                <p class="dark:text-white text-black">Responden Harus Sertakan Email?</p>
                                <select name="collect_email" id="form-setting-email" class="border-0 rounded mt-2 bg-slate-100">
                                    <option value="1" {{$form->collect_email == '1' ? 'selected':''}}>Iya</option>
                                    <option value="0" {{$form->collect_email == '0' ? 'selected':''}}>Tidak</option>
                                </select>
                            </div>
                            <div class="flex-[1_1_calc(50%-0.5rem)] flex-col justify-center items-center font-bold p-4 bg-gradient-to-t from-blue-400 to-teal-300 dark:from-violet-800 dark:to-slate-900  rounded">
                                <p class="dark:text-white text-black">Responden Cuman Boleh Mengisi Form Satu Kali?</p>
                                <select name="one_attempt" id="form-setting-attempt" class="border-0 rounded mt-2 bg-slate-100">
                                    <option value="1" {{$form->one_attempt == '1' ? 'selected':''}}>Iya</option>
                                    <option value="0" {{$form->one_attempt == '0' ? 'selected':''}}>Tidak</option>
                                </select>
                            </div>
                            <div class="flex-[1_1_calc(50%-0.5rem)] flex-col justify-center items-center font-bold p-4 bg-gradient-to-t from-blue-400 to-teal-300 dark:from-violet-800 dark:to-slate-900  rounded">
                                <p class="dark:text-white text-black">Apakah Form Harus Diisi?</p>
                                <select name="must_fill" id="form-setting-fill" class="border-0 rounded mt-2 bg-slate-100">
                                    <option value="1" {{$form->must_fill == '1' ? 'selected':''}}>Iya</option>
                                    <option value="0" {{$form->must_fill == '0' ? 'selected':''}}>Tidak</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    @csrf
                    <!-- btn add section in form -->
                    
                </div>
                <div class="box-soal w-full" id="form-body">
                    <div id="form-content" class="flex gap-2 flex-col w-full"></div>
                </div>
        </div>
        @else
            <h1>Tidak Ada Form Untuk Sesi Ini</h1>
        @endif
    </section>
</div>

