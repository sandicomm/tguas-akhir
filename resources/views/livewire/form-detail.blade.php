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
            },3750)
        </script>
    <section class="lg:w-1/2">
        <!-- Menampilkan detail form -->
        <a href="{{ route('forms') }}" class="bg-gray-700 p-2 rounded shadow text-white mb-4 lg:text-lg text-sm inline-block">
            Kembali ke Daftar Form
        </a>
        <script>
            let formJs =''
        </script>
        @if ($form)
            <script>
                formJs = @js($form);
                let sectionMaxID = @js($sectionMaxID);
                let questionMaxID = @js($questionMaxID);
                let answerMaxID = @js($answerMaxID);
            </script>

            <div id="form" class="lg:mt-10">
                <div class="w-full fixed top-0 right-0 z-30 hidden" id="btn-update-form">
                    <div class="dark:bg-white bg-slate-700 p-4 text-center sm:ml-64 flex justify-center items-center gap-4 shadow-lg border-t">
                        <p class="text-white dark:text-black">Ada perubahan dalam form, klik update untuk simpan perubahan</p>
                        <input type="hidden" name="form_status" class="lg:text-lg text-sm" value="${formCopy.status ?? 'l'}">
                        <button wire:loading.attr='disabled' type="submit" id="btn-form-update" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                            Update
                        </button>
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
                            <span>{{ session('error') }}</span>
                            <button type="button" class="text-red-700 hover:text-red-900" onclick="this.parentElement.parentElement.remove()">
                                &times;
                            </button>
                        </div>
                    </div>
                @endif

                @csrf
                @method('PUT')
                <div class="w-full flex justify-center items-start gap-2">
                    <div class="dark:bg-white bg-slate-700 rounded p-4 w-full mb-3 flex flex-col justify-center items-center">
                        <input type="hidden" name="form_id" value="{{ $form->id }}">
                        <div class="w-full">
                            <input class="text-2xl rounded border-1 border-slate-300 w-full bg-slate-800 dark:bg-white text-white dark:text-black" name="form_name" id="form-name-field">
                        </div>
                        <div class="flex mt-3 flex-wrap justify-center items-start gap-3 w-full" id="form-utils">
                            <input type="hidden" name="changeContent" value="${formCopy.changeContent}">
                            <div class="flex-[1_1_calc(50%-0.5rem)] flex-col justify-center items-center font-bold p-4 bg-gradient-to-t dark:from-blue-400 dark:to-teal-300 from-violet-800 to-slate-900 rounded">
                                <p class="text-white dark:text-black">Form Ingin Ditaruh Dimana?</p>
                                <select name="placement" id="form-setting-placement" class="border-0 rounded mt-2 ${formCopy.changeSettingPlacement ? 'bg-amber-400 dark:bg-yellow-200/70':'bg-slate-100'}">
                                    <option value="pre-test-website" {{ $form->placement == 'pre-test-website' ? 'selected':'' }}>pre-test-website</option>
                                    <option value="post-test-website" {{ $form->placement == 'post-test-website' ? 'selected':'' }}>post-test-website</option>
                                    <option value="pre-test-emodul" {{$form->placement == 'pre-test-emodul' ? 'selected':''}}>pre-test-emodul</option>
                                    <option value="post-test-emodul" {{$form->placement == 'post-test-emodul' ? 'selected':''}}>post-test-emodul</option>
                                    <option value="disable" {{$form->placement == 'disable' ? 'selected':''}}>disable</option>
                                </select>
                            </div>
                            <div class="flex-[1_1_calc(50%-0.5rem)] flex-col justify-center items-center font-bold p-4 bg-gradient-to-t dark:from-blue-400 dark:to-teal-300 from-violet-800 to-slate-900  rounded">
                                <p class="text-white dark:text-black">Responden Harus Sertakan Email?</p>
                                <select name="collect_email" id="form-setting-email" class="border-0 rounded mt-2 ${formCopy.changeSettingEmail ? 'bg-amber-400 dark:bg-yellow-200/70':'bg-slate-100'}">
                                    <option value="1" {{$form->collect_email == '1' ? 'selected':''}}>Iya</option>
                                    <option value="0" {{$form->collect_email == '0' ? 'selected':''}}>Tidak</option>
                                </select>
                            </div>
                            <div class="flex-[1_1_calc(50%-0.5rem)] flex-col justify-center items-center font-bold p-4 bg-gradient-to-t dark:from-blue-400 dark:to-teal-300 from-violet-800 to-slate-900  rounded">
                                <p class="text-white dark:text-black">Responden Cuman Boleh Mengisi Form Satu Kali?</p>
                                <select name="one_attempt" id="form-setting-attempt" class="border-0 rounded mt-2 ${formCopy.changeSettingAttempt ? 'bg-amber-400 dark:bg-yellow-200/70':'bg-slate-100'}">
                                    <option value="1" {{$form->one_attempt == '1' ? 'selected':''}}>Iya</option>
                                    <option value="0" {{$form->one_attempt == '0' ? 'selected':''}}>Tidak</option>
                                </select>
                            </div>
                            <div class="flex-[1_1_calc(50%-0.5rem)] flex-col justify-center items-center font-bold p-4 bg-gradient-to-t dark:from-blue-400 dark:to-teal-300 from-violet-800 to-slate-900  rounded">
                                <p class="text-white dark:text-black">Apakah Form Harus Diisi?</p>
                                <select name="must_fill" id="form-setting-fill" class="border-0 rounded mt-2 ${formCopy.changeSettingAttempt ? 'bg-amber-400 dark:bg-yellow-200/70':'bg-slate-100'}">
                                    <option value="1" {{$form->must_fill == '1' ? 'selected':''}}>Iya</option>
                                    <option value="0" {{$form->must_fill == '0' ? 'selected':''}}>Tidak</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <!-- btn add section in form -->
                    <div class="bg-slate-800 dark:bg-white rounded p-1 h-full flex justify-center items-center flex-col gap-1" id="first-section-add">
                        <a class="pointer-events-auto cursor-pointer hover:bg-slate-100 rounded lg:p-1" id="form-btn-add-section-0">
                            <svg class="lg:w-6 lg:h-6 dark:text-gray-800 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44771 1 1v3M3 9v9c0 .5523.44772 1 1 1h16c.5523 0 1-.4477 1-1V9M3 9h18M8 9V5m4 4V5m4 4V5m-6 9h2m0 0h2m-2 0v-2m0 2v2"/>
                            </svg>
                        </a>
                    </div>
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

