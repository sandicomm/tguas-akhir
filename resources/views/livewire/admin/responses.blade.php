<div>
    <div class="p-4 sm:ml-64" x-data="{ open: @entangle('isModalOpen') }">
        <x-loading wire:loading.flex />
        <div class="hidden" id='jsLoader'>
            <x-loading />
        </div>
        <script>
            let forms = @js($forms);
            let formsData = JSON.parse(JSON.stringify(forms))

            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                document.getElementById('jsLoader').classList.add('hidden');
            },2750)
        </script>
        <div class="flex items-center justify-center flex-col gap-3 rounded bg-slate-200 dark:bg-gray-600 py-10 px-4">
            <div class="relative overflow-hidden sm:rounded-lg w-full shadow-md dark:bg-slate-800 bg-white">
                <h1 class="text-3xl font-bold bg-cyan-600 rounded p-3 mb-1 text-center text-white">Response Terekam</h1>
                <div class="m-4">
                    <div class="flex flex-wrap justify-center gap-2 mb-2">
                        <div class="flex-[1_1_calc(50%-0.5rem)] bg-slate-200 rounded p-3 border-2 border-gray-400 border-dashed">
                            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900">Pilih Placement</label>
                            <select id="response-placement" wire:model="selectedPlacement" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                <option disabled class="text-gray-400">Pilih Placement</option>
                                <option value="">All</option>
                                <option value="interaktif">Interaktif</option>
                                <option value="emodul">Emodul</option>
                                <option value="disable">Disable</option>
                            </select>
                        </div>
                        <div class="flex-[1_1_calc(50%-0.5rem)] bg-slate-200 rounded p-3 border-2 border-gray-400 border-dashed">
                            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900">Pilih Judul Form</label>
                            <div wire:ignore>
                                <select id="form-name" wire:model="selectedForm" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                    
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="p-3 bg-slate-200 mb-2 rounded">
                        <input type="text" wire:model="searchByEmail" placeholder="cari email disini..." class="w-full bg-white text-black rounded px-3 py-2">
                    </div>
                    <button type="button" id="btn-search-response" wire:click="loadData" class="text-white w-full bg-green-500 box-border border border-transparent hover:bg-green-600 focus:ring-4 focus:ring-green-300 shadow-xs font-medium leading-5 rounded text-sm px-4 py-2.5 focus:outline-none">Search</button>
                </div>
                
                @if($responseData == null)
                    <div class="bg-blue-200 rounded  m-2 text-center shadow-md overflow-hidden flex flex-col justify-center items-center">
                        <p class="text-sm text-gray-400 p-1 bg-gray-200 w-1/4 rounded-b-2xl">Nama Form</p>
                        <h1 class="p-3 ">-- Belum ada response --</h1>
                    </div>
                @else
                    <div class=" rounded my-2 mx-3 p-1 text-center overflow-hidden flex flex-col justify-center items-center">
                        <div class="w-full rounded bg-cyan-500 flex flex-col justify-center items-center relative">
                            <p class="text-sm text-blue-500 px-4 py-1 bg-slate-200 w-fit rounded-b-2xl">{{ $responseData->placement }}</p>
                            <h1 class="text-2xl pt-1 pb-2 font-bold text-white">{{ $responseData->form_name }}</h1>
                            
                            <div class="absolute top-0 right-0 p-2 flex justify-end items-end">
                                <a data-popover-target="popover-download-response" wire:click="export('{{$this->selectedForm}}')" class="p-1 bg-green-500 text-white rounded hover:bg-green-600">
                                    <svg class="w-6 h-6 text-white" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                                    </svg>           
                                </a>
                                <div data-popover id="popover-download-response" role="tooltip" class="absolute z-10 invisible inline-block text-sm dark:text-white transition-opacity duration-300 dark:bg-gray-600 border dark:border-gray-200 rounded-lg shadow-xs opacity-0 text-gray-400 border-gray-600 bg-gray-800">
                                    <div class="py-2 px-3">
                                        <p>Download Response</p>
                                    </div>
                                    <div data-popper-arrow></div>
                                </div>
                            </div>
                        </div>
                        <div class="w-full h-fit p-2 flex justify-end items-end gap-3">
                        </div>
                        <div class="w-full overflow-auto rounded-md h-[500px]">
                            <table class="w-full table-auto text-sm rtl:text-right bg-white dark:bg-slate-600 dark:text-white text-black shadow-md rounded-md mb-2">
                                <thead class="text-black uppercase bg-slate-300 rounded-md">
                                    <tr>
                                        <th class="sticky left-0 bg-slate-100 z-10 p-2 w-[150px] md:w-[220px]">Pertanyaan</th>
                                        @foreach ($columns as $col)
                                        
                                            <th class="relative bg-slate-200 p-2 border border-e-gray-500" style="min-width:100px">
                                                @if($col['email'])
                                                    <div class="flex justify-center items-center flex-col group"> 
                                                        <button type="button"
                                                            wire:click="confirmDeleteSingle({{ $responseData->form_id ?? $formId }}, {{ $col['responden_id'] }}, {{ $col['attempt'] }})"
                                                            class="absolute right-1 bottom-1 text-xsm"
                                                            title="Hapus Response Ini">
                                                                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-white bg-red-800 rounded-full">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                                </svg>
                                                        </button>
                                                        <div class="text-xs text-center break-all md:w-[100px] w-[50px]">
                                                            {{ Str::limit($col['email'], 25) }}
                                                        </div>
                                                        
                                                        <div class="text-gray-600" style="font-size:10px;">
                                                            (Attempt {{ $col['attempt'] }})
                                                        </div>
                                                        <div class="text-gray-600" style="font-size:10px;">
                                                            ({{ $col['created_at'] }})
                                                        </div>
                                                    </div>
            
                                                    
                                                @else
                                                    <div class="text-sm">NoEmail</div>
                                                    <div style="font-size:10px;">({{ date('y-m-d H:i', strtotime($col['created_at'])); }})</div>
                                                @endif
                                                
                                            </th>
                                        @endforeach
                                        
                                    </tr>
                                </thead>
                                <tbody class="rounded-md">
                                    @forelse ($questions as $question)
                                        <tr x-data="{ open: false, pos: { x: 0, y: 0 } }">
                                            
                                            {{-- KOLOM PERTANYAAN --}}
                                            <td class="sticky left-0 p-2 dark:bg-slate-700 bg-slate-200 z-10 border-b dark:border-gray-300 border-white text-start">
                                                <p>{{ Str::limit($question->question, 20) }}</p>
            
                                                @if($question->questionImage)
                                                    {{-- (Kode gambar pertanyaan tetap sama, dipersingkat untuk fokus ke solusi) --}}
                                                    <img src="{{ $question->questionImage }}" ... >
                                                @endif
                                            </td>
            
                                            {{-- LOOP KOLOM USER (ATTEMPTS) --}}
                                            @foreach ($columns as $col)
                                                @php
                                                    $rowResponses = $cellMatrix[$question->id] ?? []; 
                                                    $cellResponses = $rowResponses[$col['key']] ?? collect();
                                                @endphp
                                                
                                                <td class="p-3 border-b border-gray-300">
                                                    @foreach ($cellResponses as $r)  
                                                        <div x-data="{ open: false, pos: { x: 0, y: 0 } }" class="flex justify-center items-center flex-col relative mb-2 last:mb-0">
                                                            <span class="text-sm">{{ Str::limit($r->answer, 20) }}</span>
                                                            @if($r->answerImage)                    
                                                                <img src="{{ $r->answerImage }}" 
                                                                    @mouseenter="
                                                                        open = true; 
                                                                        let rect = $el.getBoundingClientRect(); 
                                                                        pos.x = rect.left + (rect.width / 2); 
                                                                        pos.y = rect.top;
                                                                    " 
                                                                    @mouseleave="open = false"
                                                                    src="{{ $r->answerImage }}" 
                                                                    class="w-8 h-8 rounded-md object-cover cursor-pointer border border-gray-500 hover:scale-110 transition-transform mt-1"
                                                                    alt="Preview">
                                                                    
                                                                <template x-teleport="body">
                                                                    <div x-show="open" 
                                                                        x-cloak
                                                                        x-transition
                                                                        class="fixed z-[9999] w-64 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl pointer-events-none"
                                                                        :style="`left: ${pos.x}px; top: ${pos.y}px; transform: translate(-50%, -110%);`"
                                                                    >
                                                                        <div class="relative">
                                                                            <img src="{{ $r->answerImage }}" class="w-full h-auto rounded-lg shadow-sm" alt="Full Preview">
                                                                            {{-- Arrow Indicator --}}
                                                                            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-gray-300 dark:border-gray-600 rotate-45"></div>
                                                                        </div>
                                                                    </div>
                                                                </template>
                                                            @endif
            
                                                        </div>                                     
                                                    @endforeach
                                                </td>
                                            @endforeach
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="{{ count($columns) + 1 }}" class="p-4 text-center text-gray-500">
                                                -- Belum ada response --
                                            </td>
                                        </tr>
                                    @endforelse
                                    
                                </tbody>
                            </table>
                        </div>
                        <div class="mt-4">
                            @if($userAttempts)
                                {{ $userAttempts->links() }}
                            @endif
                        </div>
                    </div>
                @endif
            
                @if($isDeleteModalOpen)
                    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
                        <div class="bg-white dark:bg-slate-800 rounded-lg p-3 lg:w-1/3 w-[90%] text-black dark:text-white shadow-xl">
                            
                            <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                                <h3 class="text-xl font-bold">Hapus Response Ini?</h3>
                                <button type="button" wire:click="$set('isDeleteModalOpen', false)" class="text-gray-400 hover:bg-gray-200 rounded-lg w-8 h-8 flex justify-center items-center">
                                    <span class="text-2xl">&times;</span>
                                </button>
                            </div>
            
                            <form wire:submit.prevent="destroySingleResponse">
                                <div class="p-4 space-y-4">
                                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                        <strong class="font-bold">Perhatian!</strong>
                                        <span class="block sm:inline">Tindakan ini akan menghapus jawaban responden ini pada attempt {{ $targetAttempt }}.</span>
                                    </div>
            
                                    <p>Ketik <span class="font-bold">"hapus"</span> untuk konfirmasi:</p>
                                    
                                    <input type="text" 
                                        wire:model="deleteConfirmText" 
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Ketik 'hapus' disini..."
                                        required>
                                    
                                    @error('deleteConfirmText') 
                                        <span class="text-red-500 text-xs">{{ $message }}</span> 
                                    @enderror
                                </div>
            
                                <div class="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-600 gap-2">
                                    <button type="button" wire:click="$set('isDeleteModalOpen', false)" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">
                                        Batal
                                    </button>
                                    <button type="submit" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700">
                                        Hapus Data
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                @endif
            </div>
        </div>
        <script>
            const dropdownPlacement = document.getElementById("response-placement")

            let dropdownNamaForm = document.getElementById('form-name')
            let formId = dropdownNamaForm.value

            function generateDropdownFormName(){
                dropdownNamaForm = document.getElementById('form-name')

                console.log('generator dd: ',dropdownPlacement.value)
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
                    console.log('opt val:', opt.value);
                    console.log('form val:', formId);

                    if (opt.value == formId) {
                        dropdownNamaForm.value = formId;
                        console.log('match');
                        break; 
                    }
                }  
            }

            setTimeout(()=>{
                generateDropdownFormName()
            },2750)

            dropdownPlacement.addEventListener('change', generateDropdownFormName)

            document.getElementById('form-name').addEventListener('click', ()=>{
                formId = dropdownNamaForm.value
            })

            document.getElementById('btn-search-response').addEventListener('click', ()=>{
                formId = dropdownNamaForm.value
            })
        </script>
    </div>
</div>

