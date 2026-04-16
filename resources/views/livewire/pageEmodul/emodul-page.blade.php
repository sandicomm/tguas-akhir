<div class="w-full h-full flex flex-col justify-center items-center flex-wrap gap-3 p-2 rounded" style="background-color:#24495c;">
    <h1 class="text-white text-3xl font-bold">List Emodul</h1>
    <div class="flex justify-center align-items-center flex-wrap gap-3 p-2 rounded">
        @if($emodulAll)
    
            @foreach ($emodulAll as $emodul)
                @php
                    $data = json_decode($emodul, true);
                    $randomNumber = rand(1, 5);
                @endphp
    
               <a href="{{ route('emodul.preview', ['url' => base64_encode($data['file_path'])]) }}" style="background-color:#12252e;" class="p-2 border-2 border-secondary rounded text-black text-break mb-1 text-center text-decoration-none">
                    <h3 class="mb-3 text-white">{{ $data['judul'] }}</h3>
                    <img src="{{ asset('../assets/img/'. $randomNumber .'.png') }}" alt="" width="200">
                    <div style="max-width: 250px;" class="text-center text-white bg-secondary-subtle rounded p-3 border-2 border-white text-break">
                        <h3>Penyusun</h3>
                        <h5>{{$data['penyusun'] ?? '-' }}</h5>
                    </div>
                </a>
            @endforeach
        @else
            <p>--No Emodul--</p>
        @endif
    </div>
</div>
