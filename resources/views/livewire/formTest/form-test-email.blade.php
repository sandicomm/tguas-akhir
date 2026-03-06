<div>
    <div class="bg-white py-3 px-4 rounded w-100 flex justify-center align-center mb-2 text-xl">
        <h1>{{ $placement }}</h1>
    </div>
    @php
        $page = session('page_visited') ?? '';
    @endphp
 
    <div class="box-soal w-100">  
        @if($formMustFill == 0)
            <div class="bg-white w-100 rounded p-4 flex justify-center align-center flex-col text-center mb-4">
                
                @if($page == 'interaktif')
                    <a href="{{ route('interaktif') }}" class="bg-green-600 p-3 px-5 rounded font-bold text-white mt-4">Lanjutkan</a>
                @elseif($page == 'emodul')
                    <a href="{{ route('emodul') }}" class="bg-green-600 p-3 px-5 rounded font-bold text-white mt-4">Lanjutkan</a>
                @endif
            </div>
        @endif       
        <form action="{{ route('cek-email.cek') }}" method="post" class="w-100 flex justify-center align-center flex-col gap-2">
            @csrf
            <div class="bg-white w-100 rounded p-4 flex justify-center align-center flex-col">
                <label for="responden-email" class="text-center"><b>Email Anda <span class="text-red-600">*</span></b></label>
                <input type="hidden" name="placement" value="{{ $placement }}">
                <input type="email" id="responden-email" class="text-center mt-3 @error('responden_email') is-invalid @enderror" placeholder="Email Anda" name="responden_email" required>
                @error('responden_email')
                    {{ $message }}
                @enderror
                <button type="submit" class="bg-green-600 p-4 px-5 rounded mt-4 font-bold text-white">Cek Email</button>
            </div>
        </form>
    </div>
</div>