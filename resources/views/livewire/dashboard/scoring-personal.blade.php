<div>
    <div class="flex lg:flex-nowrap flex-wrap md:gap-3 gap-10 m-4 mb-12">
        <div class="flex w-full h-fit items-center justify-start flex-col rounded-md bg-gray-50 dark:bg-gray-800 shadow-md">
            <div class="text-center rounded bg-teal-400 w-full p-4 flex">
                <div class="flex-1">
                    <p class="lg:text-3xl font-bold text-white">
                        SCORING
                    </p>
                </div>
            </div>

            <div class="flex flex-col xl:flex-nowrap flex-wrap items-start justify-center w-full h-full">
                @php
                    $index = 0;
                    $indexNoEmail = 0;
                @endphp

                <div class="w-full p-3 flex">
                    <div class="w-full">
                        <div class="flex gap-2 mb-2">
                            <div class="w-full bg-slate-300 p-3 rounded">
                                <label class="text-slate-800 font-bold">Pilih Placement</label>
                                <select id="response-placement" wire:model="selectedFormPlacement" class="w-full bg-white text-black rounded px-3 py-2">
                                    <option value="">All</option>
                                    <option value="interaktif">interaktif</option>
                                    <option value="emodul">emodul</option>
                                    <option value="disable">disable</option>
                                </select>
                            </div>
                            <div class="w-full bg-slate-300 p-3 rounded">
                                
                                <label class="text-slate-800 font-bold">Pilih Form</label>
                                <div wire:ignore>
                                    <select id="form-name" wire:model="selectedForm" class="w-full bg-white text-black rounded px-3 py-2">
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="p-3 bg-slate-300 mb-2 rounded">
                            <input type="text" wire:model="searchByEmail" placeholder="cari email disini..." class="w-full bg-white text-black rounded px-3 py-2">
                        </div>
                        <div class="mt-2 flex flex-wrap gap-3">
                            <button type="button" id="btn-search-scoring" wire:click="search" class="text-white flex-1 bg-green-500 box-border border border-transparent hover:bg-green-600 focus:ring-4 focus:ring-green-300 shadow-xs font-medium leading-5 rounded text-sm px-4 py-2.5 focus:outline-none">Search</button>

                            <div class="flex flex-2 justify-center items-center">
                                <a data-popover-target="popover-download-excel-scoring-all" wire:click="exportAll" class="p-1 bg-green-500 text-white rounded hover:bg-green-600">
                                    <svg class="text-white dark:text-white" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                                    </svg>           
                                </a>
                                <div data-popover id="popover-download-excel-scoring-all" role="tooltip" class="absolute z-10 invisible inline-block text-sm dark:text-white transition-opacity duration-300 dark:bg-gray-600 border dark:border-gray-200 rounded-lg shadow-xs opacity-0 text-gray-400 border-gray-600 bg-gray-800">
                                    <div class="py-2 px-3">
                                        <p>Download Scoring All</p>
                                    </div>
                                    <div data-popper-arrow></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                
                <div class="flex flex-wrap gap-2 w-full px-3 pb-3 overflow-y-auto">
                    @if(!$this->groupedAllResponsesScoring->isEmpty())

                        <div class="flex flex-wrap gap-2 w-full max-h-[90vh]">
                                @foreach($this->groupedAllResponsesScoring as $userKey => $forms)
                                    <div class="flex-[1_1_calc(50%-0.5rem)] dark:bg-slate-600 bg-white rounded mb-4">
                                        <div class="flex justify-between items-center p-2 bg-blue-200 dark:bg-indigo-700 rounded">
                                            <h3 class="font-bold dark:text-white">{{ filter_var($userKey, FILTER_VALIDATE_EMAIL) ? $userKey : 'No_Email' }}</h3>
                                            <div class="w-full h-fit flex justify-end items-end px-3 pt-2">
                                                <a data-popover-target="popover-download-excel-scoring-{{ $userKey }}"  wire:click="export( '{{$userKey}}' )" class="p-1 bg-blue-700 text-white rounded hover:bg-blue-600">
                                                    <svg class="w-5 h-5 text-white dark:text-white" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                                                    </svg>           
                                                </a>
                                                <div data-popover id="popover-download-excel-scoring-{{ $userKey }}" role="tooltip" class="absolute z-10 invisible inline-block text-sm dark:text-white transition-opacity duration-300 dark:bg-gray-600 border dark:border-gray-200 rounded-lg shadow-xs opacity-0 text-gray-400 border-gray-600 bg-gray-800">
                                                    <div class="py-2 px-3">
                                                        <p>Download Scoring Personal</p>
                                                    </div>
                                                    <div data-popper-arrow></div>
                                                </div>
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
                    @else
                        <div class="flex flex-col items-center justify-center h-64 w-full bg-slate-800 rounded border border-dashed border-slate-600 text-slate-400">
                            <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            <p>Form tidak ada response</p>
                            
                        </div>
                    @endif

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
                                                    
                                                    <td class="border border-gray-400 p-2 font-medium dark:text-white text-black">
                                                        <p>{{ Str::limit(head($q)['question'],120) }}</p>
                                                    </td>
                                                    @foreach($availableAttempts as $at)
                                                        <td class="border border-gray-400 p-2 text-center">
                                                            
                                                            @if(isset($q[$at]))
                                                                <div class="flex flex-col items-center">
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
    let formName = @js($formName);
    let formsData = JSON.parse(JSON.stringify(formName))

    const dropdownPlacement = document.getElementById("response-placement")

    let dropdownNamaForm = document.getElementById('form-name')
    let formId = dropdownNamaForm.value

    function generateDropdownFormName(){
        dropdownNamaForm = document.getElementById('form-name')
        let option = `<option class='text-gray-300' value='' default>-- Pilih Nama Form --</option>`

        if(formsData.length == 0){
            option += `<option value='0' disabled>-- no form available --</option>`
        }else{
            formsData.forEach(element => {
                if(element.placement.includes(dropdownPlacement.value)){
                    option += `<option value="${element.id}">${element.form_name}</option>`

                }else if(dropdownPlacement.value == null || dropdownPlacement.value == 'all'){
                    option +=`<option value="${element.id}">${element.form_name}</option>`
                }
            });

        }
        dropdownNamaForm.innerHTML=option
        dropdownNamaForm.value = ''; 

        for (let opt of dropdownNamaForm.options) {
            if (opt.value == formId) {
                dropdownNamaForm.value = formId;
                break; 
            }
        }  
    }
    generateDropdownFormName()
    dropdownPlacement.addEventListener('change', generateDropdownFormName)

    document.getElementById('form-name').addEventListener('click', ()=>{
        formId = dropdownNamaForm.value
    })

    document.getElementById('btn-search-scoring').addEventListener('click', ()=>{
        formId = dropdownNamaForm.value
    })

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