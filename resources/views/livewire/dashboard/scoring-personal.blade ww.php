<div>
    <div class="flex lg:flex-nowrap flex-wrap md:gap-3 gap-10 m-4 mb-12">
        <div class="flex w-full h-fit items-center justify-start flex-col rounded-md bg-gray-50 dark:bg-gray-800 shadow-md">
            <div class="text-center rounded bg-teal-400 w-full p-4">
                <p class="lg:text-3xl font-bold text-white">
                    SCORING
                </p>
            </div>

            <div class="w-full h-fit flex justify-end items-end px-3 pt-2">
                <a data-popover-target="popover-download-excel-scoring" wire:click="$dispatch('triggerExport', { type: 'scoring', formId: '0' })" class="p-1 bg-green-500 text-white rounded hover:bg-green-600">
                    <svg class="w-5 h-5 text-white dark:text-white" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                    </svg>           
                </a>
            </div>
            <div data-popover id="popover-download-excel-scoring" role="tooltip" 
                class="absolute z-10 invisible inline-block text-sm transition-opacity duration-300  border rounded-lg 
                shadow-xs opacity-0 text-gray-400 dark:text-white border-gray-600 dark:border-gray-200 bg-gray-800 dark:bg-gray-600">
                <div class="py-2 px-3">
                    <p>Download</p>
                </div>
                <div data-popper-arrow></div>
            </div>

            <div class="flex flex-col xl:flex-nowrap flex-wrap items-start justify-center w-full h-full">
                @php
                    $index = 0;
                    $indexNoEmail = 0;
                @endphp
                
                <div class="flex flex-wrap gap-2 w-full px-3 pb-3">
                    
                    @foreach ($this->groupedAllResponsesScoring as $emailScoring => $categoryScoring)
                        @php
                            $index++;
                            if(Str::startsWith($emailScoring, 'uuid:')){
                                $indexNoEmail++;
                            }
                            
                            $safeEmail = Str::slug($emailScoring); 

                        @endphp
                    
                        <div x-data="{ show: false }" class="flex-[1_1_calc(50%-0.5rem)] items-center justify-center flex-col rounded bg-gray-200 dark:bg-gray-700 w-full px-2 py-1 mt-3 {{ $index > 2 && !$showAllScoring ? 'hidden' : '' }}">
                            <h1 class="flex justify-between items-center mt-2 font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded shadow-md break-all lg:text-lg">{{ Str::startsWith($emailScoring, 'uuid:') ? 'No Email '.$indexNoEmail : $emailScoring }}
                                <div class="h-fit flex justify-center items-center">
                                    <a data-popover-target="popover-download-excel-scoring-{{ $safeEmail}}" wire:click="$dispatch('triggerExport', { type: 'scoringPersonal', formId: @js($emailScoring) })" class="p-1 bg-green-500 text-white rounded hover:bg-green-600">
                                        <svg class="w-5 h-5 text-white" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                                        </svg>           
                                    </a>
                                </div>
                                <div data-popover id="popover-download-excel-scoring-{{ $safeEmail }}" role="tooltip" class="absolute z-10 invisible inline-block text-sm dark:text-white text-gray-400 transition-opacity duration-300 dark:bg-gray-600 border dark:border-gray-200 rounded-lg shadow-xs opacity-0  border-gray-600 bg-gray-800">
                                    <div class="py-2 px-3">
                                        <p>Download</p>
                                    </div>
                                    <div data-popper-arrow></div>
                                </div>
                            </h1>
                            @foreach ($categoryScoring as $categoryNameScoring => $formIdScoring)
                                
                                @php
                                    $categoryPrefix = \Illuminate\Support\Str::before($categoryNameScoring, '-');
                                    $dataRekap = collect();
                                @endphp
                                <div x-data="{ show: false }">
                                    <div class="pt-3 px-2">
                                        <button type="button" 
                                            @click="show = !show"
                                            class="text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700">
                                            <span x-text="show ? 'Hide Detail' : 'Show Detail'"></span>
                                        </button>
                                    </div>
                                    <div x-show="show" x-cloak class="flex-[1_1_calc(50%-0.5rem)] rounded w-full px-3 pb-2 mt-3" id="detail-{{ $safeEmail }}-{{ $formIdScoring->first()['form_id'] }}">
                                        <h1 class="text-xl mt-2 text-center font-bold text-white bg-gradient-to-r dark:from-blue-600 dark:to-slate-700 p-2 from-gray-500 to-gray-700 rounded shadow-md">{{ $categoryNameScoring }}</h1>
                                        <div class="dark:bg-slate-600 bg-slate-300 flex-[1_1_calc(50%-0.5rem)] items-center justify-center flex-col rounded ">
                                            
                                            @foreach($formIdScoring as $dataFormScoring)                                             
                                                
                                                <div class="flex-[1_1_calc(50%-0.5rem)] items-center justify-center flex-col rounded dark:bg-gray-800 w-full px-3 py-1">
                                                    <div class="bg-cyan-500 rounded mt-4 text-center overflow-hidden flex flex-col justify-center items-center w-full">
                                                        <p class="text-sm text-gray-400 p-0 bg-gray-200 w-1/4 rounded-b-2xl">Nama Form</p>
                                                        <h1 class="text-xl pt-0 pb-1 font-bold text-white">{{ $dataFormScoring['form_name'] }}</h1>
                                                    </div>
                                                    <div class="w-full rounded-md overflow-auto h-[500px]">
                                                        <table class="w-full table-auto text-sm text-left rtl:text-right bg-white dark:text-gray-200 text-black dark:bg-slate-800 shadow-md rounded border-2">
                                                            <thead class="uppercase text-black bg-slate-300">
                                                                <tr class="text-center">
                                                                    <th class="sticky left-0 bg-slate-100 z-10 p-2 w-[150px] md:w-[220px]" >Pertanyaan</th>
                                                                    @foreach($dataFormScoring['items']->first()['attempts'] as $attempt => $items)
                                                                        <th class="p-3 text-center sticky bg-slate-200 left-0 w-[150px] md:w-[220px]">Attempt-{{ $attempt }}</th>
                                                                    @endforeach
                                                                </tr>
                                                            </thead>
    
                                                            <tbody>                                                                        
                                                                @foreach ($dataFormScoring['items'] as $questionScoring => $responsesDataScoring)
                                                                
                                                                    <tr class="border-b-2 border-gray-400 text-start">
                                                                        <td class="p-3 sticky left-0 z-10 dark:bg-slate-700 bg-slate-300">
                                                                            <div>   
                                                                                <span>{{ Str::limit($responsesDataScoring['question'], 20) }}</span>
                                                                                @if($responsesDataScoring['questionImage'])
                                                                                    
                                                                                    @php 
                                                                                        // Buat ID unik agar popover tidak tertukar antar baris
                                                                                        $imageId = 'sp-'. Str::slug($responsesDataScoring['questionImage']) . $responsesDataScoring['id'] . $loop->index;
                                                                                    @endphp
    
                                                                                    <img data-popover-target="popover-q-{{ $imageId }}" 
                                                                                        src="{{ $responsesDataScoring['questionImage'] }}" 
                                                                                        class="w-8 h-8 rounded-md object-cover cursor-pointer border border-gray-200 hover:scale-110 transition-transform"
                                                                                        alt="Preview">                                                                                            
                                                                                @endif
                                                                            </div>
                                                                        </td>
                                                                        @if($responsesDataScoring['questionImage'])
                                                                            <div data-popover id="popover-q-{{ $imageId }}" role="tooltip" 
                                                                                class="absolute z-50 invisible inline-block w-64 text-sm dark:text-gray-500 transition-opacity duration-300 dark:bg-white border dark:border-gray-200 rounded-lg shadow-sm opacity-0 text-gray-400 border-gray-600 bg-gray-800">
                                                                                <div class="p-2">
                                                                                    <img src="{{ $responsesDataScoring['questionImage'] }}" 
                                                                                        class="w-full h-auto rounded-lg" alt="Full Preview">
                                                                                </div>
                                                                                <div data-popper-arrow></div>
                                                                            </div>
                                                                        @endif
                                                                        @foreach($responsesDataScoring['attempts'] as $attemptScoring => $attemptDataScoring)
                                                                            @foreach ($attemptDataScoring as $answerDataScoring)                                                                                     
                                                                                <td>
                                                                                        <div class="flex items-center justify-center gap-2 flex-col">
                                                                                            
                                                                                        <span><b>{{ $answerDataScoring->answer }}</b></span>
                                                                                        <div class="flex">
                                                                                            @if($answerDataScoring->answerImage)
                                                                                                @php 
                                                                                                    // Buat ID unik agar popover tidak tertukar antar baris
                                                                                                    $imageId = 'sp-' . Str::slug($answerDataScoring->answerImage) . $answerDataScoring->id . $loop->index;
                                                                                                @endphp
    
                                                                                                <img data-popover-target="popover-a-{{ $imageId }}" 
                                                                                                    src="{{ $answerDataScoring->answerImage }}" 
                                                                                                    class="w-8 h-8 rounded-md object-cover cursor-pointer border border-gray-200 hover:scale-110 transition-transform"
                                                                                                    alt="Preview">
    
                                                                                                <div data-popover id="popover-a-{{ $imageId }}" role="tooltip" 
                                                                                                    class="absolute z-50 invisible inline-block w-64 text-sm dark:text-gray-500 transition-opacity duration-300 dark:bg-white border dark:border-gray-200 rounded-lg shadow-sm opacity-0 text-gray-400 border-gray-600 bg-gray-800">
                                                                                                    <div class="p-2">
                                                                                                        <img src="{{ $answerDataScoring->answerImage }}" 
                                                                                                            class="w-full h-auto rounded-lg" alt="Full Preview">
                                                                                                    </div>
                                                                                                    <div data-popper-arrow></div>
                                                                                                </div>
                                                                                            @endif
                                                                                            <span>({{ $answerDataScoring->value }})</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>                                                                                        
                                                                            @endforeach
                                                                        @endforeach
                                                                    </tr>
                                                                @endforeach
                                                                
                                                                <tr class="bg-gray-400 text-white font-bold">
                                                                    <td class="p-3 text-start sticky left-0 z-10 bg-slate-500">Total</td>
                                                                    @foreach($dataFormScoring['total_score'] as $scoring)
                                                                    
                                                                        <td class="text-center">
                                                                            <span>{{ $scoring }}</span>
                                                                        </td>
                                                                        
                                                                    @endforeach
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            @endforeach
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="flex gap-2 flex-row xl:flex-nowrap flex-wrap items-start justify-center w-full bg-white p-3 rounded shadow-sm mt-2">
                                    @foreach($formIdScoring as $formScoring)
                                        <div class="flex-[1_1_calc(50%-0.5rem)] items-center justify-center border-e-2">
                                            
                                            <h3 class="font-bold">{{ $formScoring['form_name'] }}</h3>
                                            
                                                @foreach($formScoring['total_score'] as $attempt => $score)
                                                    <div class="pt-2">
                                                        
                                                        @php
                                                            $valueScoreRekap = 0;
                                                            if($formScoring['max_score'] == 0){
                                                                $valueScoreRekap = $score;
                                                            }else{
                                                                $valueScoreRekap = round(($score / $formScoring['max_score'] )*100);
                                                            }

                                                            if($valueScoreRekap == 0){
                                                                $valueScoreRekap =2;
                                                            }

                                                            if($valueScoreRekap > 70){
                                                                $bgBar="bg-green-300";
                                                            }elseif($valueScoreRekap > 40){
                                                                $bgBar="bg-yellow-300";
                                                            }elseif($valueScoreRekap > 0){
                                                                $bgBar="bg-red-300";
                                                            }
                                                        @endphp
                                                        <p>Percobaan {{ $attempt }}</p>
                                                        <div class="w-full border border-gray-500">
                                                            <p class="{{ $bgBar }} px-2" style="width: {{ $valueScoreRekap }}%;">{{ $score . '/' . $formScoring['max_score'] }}</p>
                                                        </div>
                                                    </div>
                                                @endforeach
                                        </div>
                                    @endforeach
                                </div>  
                            @endforeach
                        </div>
                    @endforeach
                </div>

                <div wire:loading class="hidden" id='jsLoader'>
                    <x-loading />
                </div>

                <div class="text-center mt-4 w-full">
                    <hr class="mb-4">
                    
                    <button wire:click="toggleShowAllScoring" 
                        wire:loading.attr="disabled" 
                        id="toggle-scoring-btn" 
                        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 rounded-pill shadow-sm font-semibold relative">

                        <svg wire:target="toggleShowAllScoring" class="inline w-6 h-6 text-gray-800" aria-hidden="true" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z"/>
                        </svg> 

                        <span id="see-all-txt">{{ $showAllScoring ? 'Sembunyikan Sebagian' : 'Tampilkan Semua' }}</span>
                    </button>
                </div>
                    
            </div>
        </div>
    </div>
</div>
<script>
    document.addEventListener('livewire:navigated', () => { 
        initToggleButtons();
    });

    // Jalankan setiap kali Livewire selesai melakukan update DOM
    document.addEventListener('livewire:init', () => {
        Livewire.on('morph.updated', () => {
            initToggleButtons();
        });
    });

    function initToggleButtons() {
        console.log('Inisialisasi script detail...');
        document.querySelectorAll('.toggle-detail-btn').forEach(btn => {
            // Gunakan onclick langsung atau bersihkan listener lama
            btn.onclick = function(e) {
                const email = this.dataset.email;
                const category = this.dataset.category;
                const detailId = 'detail-' + email + '-' + category;
                const detail = document.getElementById(detailId);

                if (detail) {
                    detail.classList.toggle('hidden');
                    this.textContent = detail.classList.contains('hidden') ? 'Show Detail' : 'Hide Detail';
                }
            };
        });
    }

    // Panggil pertama kali
    initToggleButtons();
</script>