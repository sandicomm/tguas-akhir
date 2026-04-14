<div>
    <div class="flex lg:flex-nowrap flex-wrap md:gap-3 gap-10 m-4 mb-12">
        <div class="flex w-full h-fit items-center justify-start flex-col rounded-md bg-gray-50 dark:bg-gray-800 shadow-md">
            <div class="text-center rounded bg-teal-400 w-full p-4 flex">
                <div class="flex-1">
                    <p class="lg:text-3xl font-bold text-white">
                        SCORING
                    </p>
                </div>
                <div class="flex justify-start items-start">
                    <a wire:click="exportAll" class="p-1 bg-green-500 text-white rounded hover:bg-green-600">
                        <svg class="w-5 h-5 text-white dark:text-white" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                        </svg>           
                    </a>
                </div>
            </div>

            <div class="flex flex-col xl:flex-nowrap flex-wrap items-start justify-center w-full h-full">
                @php
                    $index = 0;
                    $indexNoEmail = 0;
                @endphp

                <div class="w-full p-3 flex">
                    <div class="w-full">
                        <div class="flex gap-2">
                            <div class="w-full bg-slate-300 p-3 rounded">
                                <label class="text-slate-800 font-bold">Pilih Category</label>
                                <select wire:model="selectedFormPlacement" class="w-full bg-white text-black rounded px-3 py-2">
                                    <option value="">all</option>
                                    <option value="interaktif">interaktif</option>
                                    <option value="emodul">emodul</option>
                                    <option value="disable">disable</option>
                                </select>
                            </div>
                            <div class="w-full bg-slate-300 p-3 rounded">
                                
                                <label class="text-slate-800 font-bold">Pilih Form</label>
                                <select wire:model="selectedFormName" class="w-full bg-white text-black rounded px-3 py-2">
                                    <option value="">pilih</option>
                                    @foreach($this->forms as $form)
                                        <option value="{{ $form->form_name }}">{{ $form->form_name }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="mt-2">
                            <button type="button" wire:click="search" class="text-white w-full bg-green-500 box-border border border-transparent hover:bg-green-600 focus:ring-4 focus:ring-green-300 shadow-xs font-medium leading-5 rounded text-sm px-4 py-2.5 focus:outline-none">Search</button>
                        </div>
                    </div>
                </div>
                
                <div class="flex flex-wrap gap-2 w-full px-3 pb-3 overflow-y-auto">
                    <div class="flex flex-wrap gap-2 w-full max-h-[90vh]">
                        @foreach($this->groupedAllResponsesScoring as $userKey => $forms)
                            <div class="flex-[1_1_calc(50%-0.5rem)] dark:bg-slate-600 bg-white rounded mb-4">
                                <div class="flex justify-between items-center p-2 bg-blue-200 dark:bg-indigo-700 rounded">
                                    <h3 class="font-bold dark:text-white">{{ $userKey }}</h3>
                                    <div class="w-full h-fit flex justify-end items-end px-3 pt-2">
                                        <a wire:click="export( '{{$userKey}}' )" class="p-1 bg-green-500 text-white rounded hover:bg-green-600">
                                            <svg class="w-5 h-5 text-white dark:text-white" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                                            </svg>           
                                        </a>
                                    </div>
                                </div>
                               
                                @foreach($forms as $formId => $formData)
                                    <div class="border-t mt-2 pt-2 dark:text-white px-4 pb-4">
                                        <p>{{ $formData['form_name'] }} ({{ $formData['placement'] }})</p>
                                        <button 
                                            wire:click="openDetail('{{ $userKey }}', '{{ $formId }}')" 
                                            class="bg-blue-600 text-white px-1.5 py-1 rounded hover:bg-blue-400 mb-2 transition"
                                        >
                                            <small>Detail</small>
                                        </button>
                                        @foreach($formData['attempts'] as $attemptNo => $score)
                                            <div class="mb-2">
                                                <small>Percobaan {{ $attemptNo }}</small>
                                                <div class="w-full border border-gray-500">
                                                    
                                                    @php 
                                                        $max = $this->scoreAnswer[$formId]->max_score ?? 100;
                                                        $percent = ($score / $max) * 100;

                                                        $valueScoreRekap = 0;
                                                        if($max == 0){
                                                            $valueScoreRekap = $score;
                                                        }else{
                                                            $valueScoreRekap = round(($score / $max )*100);
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
                                                   
                                                    <div class="{{ $bgBar }} text-black" style="width: {{ $valueScoreRekap }}%">{{ $score . '/' . $max }}</div>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                @endforeach
                            </div>
                        @endforeach
                    </div>

                    @if($showModal)
                        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
                            <div class="dark:bg-slate-800 bg-slate-200 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                                
                                <div class="p-4 border-b border-slate-700 flex justify-between items-center bg-blue-600 text-white">
                                    <h2 class="text-lg font-bold">{{ $selectedFormData['form_name'] }} - {{ $selectedFormData['user'] }}</h2>
                                    <button wire:click="closeModal" class="text-white hover:text-gray-200 text-2xl">&times;</button>
                                </div>

                                <div class="p-6 overflow-auto dark:bg-slate-700 bg-white">
                                    <table class="w-full border-collapse border border-gray-400 text-white">
                                        <thead class="bg-gray-200 text-black uppercase text-sm">
                                            <tr>
                                                <th class="border border-gray-400 p-2 text-left">PERTANYAAN</th>
                                         
                                                @foreach($availableAttempts as $at)
                                                    
                                                    <th class="border border-gray-400 p-2 text-center">ATTEMPT-{{ $at }}</th>
                                                @endforeach
                                            </tr>
                                        </thead>
                                        <tbody class="text-sm">
                                            @foreach($selectedFormData['questions'] as $q)
                                                <tr class="border-b border-gray-400 dark:hover:bg-gray-800 hover:bg-gray-300 transition">
                                                    
                                                    <td class="border border-gray-400 p-2 font-medium dark:text-white text-black">{{ Str::limit($q[1]['question'],120) }}</td>
                                                    @foreach($availableAttempts as $at)
                                                        <td class="border border-gray-400 p-2 text-center">
                                                            
                                                            @if(isset($q[$at]))
                                                                <div class="flex flex-col">
                                                                    <span class="dark:text-white text-black">{{ Str::limit($q[$at]['answer'],120) }}</span>
                                                                    <span class="dark:text-blue-300 text-blue-500 font-bold">({{ $q[$at]['score'] }})</span>
                                                                </div>
                                                            @else
                                                                <span class="dark:text-gray-500 text-gray-800">-</span>
                                                            @endif
                                                        </td>
                                                    @endforeach
                                                </tr>
                                            @endforeach
                                        </tbody>
                                        <tfoot class="bg-gray-600 font-bold">
                                            <tr>
                                                <td class="border border-gray-400 p-2">Total</td>
                                                @foreach($availableAttempts as $at)
                                                    @php
                                                        // Pastikan $at yang digunakan adalah nilai ID/Angkanya saja, bukan object model
                                                        $attemptKey = is_object($at) ? $at->attempt : $at;

                                                        $totalScore = collect($selectedFormData['questions'])->sum(function($q) use ($attemptKey) {
                                                            // Kita akses ke dalam nested array 'attempts'
                                                           
                                                            return $q[$attemptKey]['score'] ?? 0;
                                                        });
                                                    @endphp
                                                    
                                                    <td class="border border-gray-400 p-2 text-center text-yellow-300 font-bold">
                                                        {{ $totalScore }}
                                                    </td>
                                                @endforeach
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                <div class="p-4 border-t dark:border-slate-700 border-slate-300 flex justify-end dark:bg-slate-800 bg-slate-200">
                                    <button wire:click="closeModal" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </div>
                    @endif
                </div>

                <div wire:loading class="hidden" id='jsLoader'>
                    <x-loading />
                </div>

                <div class="text-center mt-4 flex justify-center  p-3 w-full">
                    <hr class="mb-4">
                    <div class=" pagination-sm">
                        {{ $this->groupedAllResponsesScoring->links() }}
                    </div>
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