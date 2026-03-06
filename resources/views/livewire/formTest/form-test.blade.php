<div class="relative w-[80%]">
    @php
        $page = session('page_visited') ?? '';
    @endphp
    @if ($form)
        <div class="rounded mb-2 bg-white p-3 rounded-3 w-full flex justify-center items-center">
            <h1 class="font-bold text-3xl">{{ $form->form_name }}</h1>
        </div>
        
        <div class="w-full">
            @php
                $formResponded = session('already_fill_form') ?? '';
                $alreadyFillTheForm = collect($formResponded)->contains($form->id);
            @endphp
          
            @if ($form->one_attempt == 1 && $alreadyFillTheForm)

                <div class="bg-white w-full rounded p-4 flex justify-center items-center flex-col">
                    <h5>Anda Sudah Mengerjakan Form Ini</h5>
                    
                    @if($page == 'interaktif')
                        <a href="{{ route('interaktif') }}" class="bg-green-600 p-3 px-5 rounded font-bold text-white mt-4">Lanjutkan</a>
                    @elseif($page == 'emodul')
                        <a href="{{ route('emodul') }}" class="bg-green-600 p-3 px-5 rounded font-bold text-white mt-4">Lanjutkan</a>
                    @endif
                </div>
    
            @else
                
                <form action="{{ route('form-test.store') }}" method="post" class="w-full flex justify-center items-center flex-col gap-2">
                    @csrf
                    <input type="hidden" name="form_name" value="{{ $form->form_name }}">
                    <input type="hidden" name="form_id" value="{{ $form->id }}">
            
                    @if ($form->collect_email == 1)
                        <input type="hidden" name="responden_email" value="{{ session('responden_email') }}">
                    @endif
    
                    <input type="hidden" name="collect_email" value="{{ $form->collect_email }}">
                    <input type="hidden" name="one_attempt" value="{{ $form->one_attempt }}">
                    <input type="hidden" name="placement" value="{{ $form->placement }}">
    
                    @if ($form->collect_email == 1 && $form->must_fill == 0 && $alreadyFillTheForm)
                        <div class="bg-white w-full rounded p-4 flex justify-center items-center flex-col text-center mb-4 gap-3">
                            <p><strong>Email anda sudah pernah digunakan untuk mengisi pre-test ini anda bisa langsung ke materi, atau mengisi pre-test lagi</strong></p>
                            @if($page == 'interaktif')
                                <a href="{{ route('interaktif') }}" class="bg-green-600 p-3 px-5 rounded font-bold text-white mt-4">Lanjutkan</a>
                            @elseif($page == 'emodul')
                                <a href="{{ route('emodul') }}" class="bg-green-600 p-3 px-5 rounded font-bold text-white mt-4">Lanjutkan</a>
                            @endif
                        </div>
                    @elseif($form->must_fill == 0)
                        <div class="bg-white w-full rounded p-4 flex justify-center items-center flex-col text-center mb-4">
                            @if($page == 'interaktif')
                                <a href="{{ route('interaktif') }}" class="bg-green-600 p-3 px-5 rounded font-bold text-white mt-4">Lanjutkan</a>
                            @elseif($page == 'emodul')
                                <a href="{{ route('emodul') }}" class="bg-green-600 p-3 px-5 rounded font-bold text-white mt-4">Lanjutkan</a>
                            @endif
                        </div>
                    @endif
    
                    @foreach ($sections as $section)
                        <div class="bg-white rounded w-full p-4">
                            <input type="hidden" name="sections[{{ $section->id }}][section]" value="{{ $section->name }}">
                            <h1 class="text-2xl">Section <b>{{ $section->name }}</b></h1>
                            <h3 class="text-lg">{!! nl2br(e($section->description)) !!}</h3>
                        </div>
                        @php
                            $index=0;
                        @endphp
                        @foreach ($section->questions as $question)
                            @php
                                $index++;
                            @endphp
                            <div class="bg-white p-4 rounded-3 w-full flex justify-center items-start rounded">
                                <input type="hidden" name="sections[{{ $section->id }}][questions][{{ $question->id }}][question]" value="{{ $question->id }}">
                                <input type="hidden" name="sections[{{ $section->id }}][questions][{{ $question->id }}][question_id]" value="{{ $question->id }}">
                                <input type="hidden" name="sections[{{ $section->id }}][questions][{{ $question->id }}][input_type]" value="{{ $question->input_type }}">
                                <h4 class="numbering">{{ $index }}.</h4>
                                <div class="flex justify-start items-center w-full flex-col ms-2">
                                    <div class="flex flex-col w-full p-2 rounded mb-2" style="background-color:rgba(0, 0, 0, 0.10);">
                                        @if($question->image)
                                            <div class="flex">
                                                <img src="{{ $question->image }}" alt="" class="rounded" style="width:50%;height:auto;" loading="lazy">
                                            </div>
                                        @endif
                                        <p class="p-1 rounded" style="background-color:rgba(0, 0, 0, 0);">{{ $question->question }}</p>    
                                    </div>
                                    
                                    <div class="flex flex-col w-full">
                                        @if ($question->input_type == 'pilgan')
                                            @php
                                                $pilgan='a';
                                            @endphp

                                            @foreach ($question->answers as $answer)
                                                <div class="mb-2">
                                                    {{-- Kita bungkus seluruh kotak dengan <label> agar klik di mana saja memicu radio --}}
                                                    <label class="answer-box flex justify-start items-start rounded p-2 w-full cursor-pointer" 
                                                        for="answer-{{ $question->id }}-{{ $loop->index }}">
                                                        
                                                        {{-- Input Radio disembunyikan --}}
                                                        <input class="hidden answer-radio" 
                                                            type="radio" 
                                                            id="answer-{{ $question->id }}-{{ $loop->index }}"
                                                            name="sections[{{ $section->id }}][questions][{{ $question->id }}][answer]"  
                                                            value="{{ $answer->id }}"
                                                            required>

                                                        {{-- Indikator Huruf (a, b, c) --}}
                                                        <h6 class="me-2 mb-0"><b>{{ $pilgan++ }}.</b></h6>

                                                        <div class="flex flex-col w-full">
                                                            @if($answer->image)
                                                                <img src="{{ $answer->image }}" alt="" class="rounded mb-2" style="width:150px; height:auto;" loading="lazy">
                                                            @endif
                                                            <span>{{ $answer->answer }}</span>
                                                        </div>
                                                    </label>
                                                </div>
                                                
                                            @endforeach
                                            @error("sections.{$section->id}.questions.{$question->id}.answer")
                                                <div class="text-red-800">{{ $message }}</div>
                                            @enderror
                                            
                                        @elseif($question->input_type == 'text') 
                                            {{-- Input Text --}}
                                            <input type="text" 
                                                class="form-control" 
                                                id="answer-{{ $question->id }}-text" 
                                                name="sections[{{ $section->id }}][questions][{{ $question->id }}][answer]" 
                                                placeholder="Tuliskan jawaban Anda" 
                                                aria-label="Text input for following question" required>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    @endforeach
                    <div class="bg-white p-4 rounded w-full text-center">
                        <button type="submit" class="bg-green-600 p-3 px-5 rounded font-bold text-white">Submit</button>
                    </div>
                </form>
            @endif
        </div>
    @else
        <div class="flex flex-col gap-3 bg-red-300 p-4 px-6 rounded justify-center items-center text-black font-bold">
            Tidak ada form untuk sesi ini

            @if($page == 'interaktif')
                <a href="{{ route('interaktif') }}" class="bg-green-600 p-3 px-5 rounded font-bold text-white mt-4">Lanjutkan</a>
            @elseif($page == 'emodul')
                <a href="{{ route('emodul') }}" class="bg-green-600 p-3 px-5 rounded font-bold text-white mt-4">Lanjutkan</a>
            @endif
        </div>
    @endif  
</div>
