<script>
    window.addEventListener('beforeunload', function (e) {
    e.preventDefault(); // Penting untuk beberapa browser
    e.returnValue = ''; // Ini juga perlu untuk memicu dialog konfirmasi
});
</script>
<div class="p-4 sm:ml-64 flex justify-center items-center">
    <section class="lg:w-1/2">
        <!-- Menampilkan detail form -->
        <a href="{{ route('forms') }}" class="bg-gray-400 p-2 rounded shadow-sm text-white mb-4 lg:text-lg text-sm inline-block">
            Kembali ke Daftar Form
        </a>
        @if ($form)
            <script>
                let formJs = @js($form);
                let sectionMaxID = @js($sectionMaxID);
                let questionMaxID = @js($questionMaxID);
            </script>

            <form action="{{ route('form.update') }}" method="post" id="form" class="lg:mt-10">
                <div class="w-full fixed top-0 right-0 z-30" id="btn-update-form"></div>
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

                @if ($errors->any())
                    <div class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50">
                        <div class="flex items-center justify-between gap-4">
                            @foreach ($errors->all() as $error)
                                <span>{{ session('success') }}</span>
                                <button type="button" class="text-green-700 hover:text-green-900" onclick="this.parentElement.parentElement.remove()">
                                    &times;
                                </button>
                            @endforeach
                        </div>
                    </div>
                @endif

                @csrf
                @method('PUT')
                <div class="w-full flex justify-center items-start gap-2">
                    <div class="bg-white rounded p-4 w-full mb-3 flex flex-col justify-center items-center">
                        <input type="hidden" name="form_id" value="{{ $form->id }}">
                        <div class="w-full">
                            <input class="text-2xl bg-gray-100 rounded border-1 border-slate-300 w-full" name="form_name" id="form-name-field">
                        </div>
                        <div class="flex mt-3 flex-wrap justify-center items-start gap-3 w-full" id="form-utils">
                            
                        </div>
                    </div>
                    <div class="bg-white rounded p-1 h-full flex justify-center items-center flex-col gap-1" id="first-section-add">
                    </div>
                </div>
                <div class="box-soal w-full" id="form-body">
                    <div id="form-content" class="flex gap-2 flex-col w-full"></div>
                </div>
            </form>
        @else
            <h1>Tidak Ada Form Untuk Sesi Ini</h1>
        @endif
    </section>
</div>

