<!-- Main modal -->

<div>
    <div class="sm:ml-64 pt-4">
        <div class="hidden" id='jsLoader'>
            <x-loading />
        </div>
        <script>
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                document.getElementById('jsLoader').classList.add('hidden');
            },2750)
        </script>
        <div>
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
            <!-- ----------------------------- TOTAL RESPONDEN -------------------------------------- -->
            <div class="px-4 h-fit">
                <x-loading wire:loading.flex />  
                <div class="flex lg:text-2xl md:text-xl items-center justify-center flex-col gap-3 mb-4 rounded dark:bg-white bg-gray-800 p-4 shadow-md">
                    <p class="dark:text-black text-white">
                        Responden Yang Terdata
                    </p>
                    <p class="dark:text-black text-white">{{ $responden }}</p>
                </div>
               
                <div class="flex lg:flex-nowrap flex-wrap md:gap-3 gap-10 m-4 mb-12">
                    <div class="flex w-full h-fit items-center justify-start flex-col rounded-md dark:bg-white bg-gray-800 shadow-md">
                        <div class="text-center rounded bg-teal-400 w-full p-1">
                            <p class="lg:text-xl text-white">
                                Website
                            </p>
                        </div>
                        <div class="flex flex-row xl:flex-nowrap flex-wrap items-start justify-center w-full h-full">
                            <div class="py-4 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                <p class="lg:text-xl dark:text-black text-white">
                                    Responden
                                </p>
                               
                                <p class="lg:text-2xl dark:text-black text-white">{{ $groupedResponses['website']['responden']['count'] ?? $RespondenWebsite }}</p>

                                <div class="text-white mt-2 text-center flex flex-row items-center justify-center rounded bg-gradient-to-r from-blue-500 to-cyan-500 w-[85%] h-fit">
                                    <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                        <p class="xl:text-xl">
                                            Email
                                        </p>
                                        <p class="xl:text-2xl">{{ $groupedResponses['website']['responden']['email'] ?? $emailResponseWebsite }}</p>
                                    </div>
                                    <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                        <p class="xl:text-xl">
                                            No-email
                                        </p>
                                        <p class="xl:text-2xl">{{ $groupedResponses['website']['responden']['no-email'] ?? $noEmailResponseWebsite }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="py-4 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                <p class="lg:text-xl dark:text-black text-white">
                                    Responses
                                </p>
                                <p class="lg:text-2xl dark:text-black text-white">{{ $groupedResponses['website']['responses']['count'] ?? $ResponseWebsite }}</p>

                                <div class="text-white mt-2 text-center flex flex-row items-center justify-center rounded bg-gradient-to-r from-blue-500 to-cyan-500 w-[90%] h-fit">
                                    <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                        <p class="xl:text-xl">
                                            Pre-Test
                                        </p>
                                        <p class="xl:text-2xl">{{ $groupedResponses['website']['responses']['pre-test']['count'] ?? $preTestResponseWebsite }}</p>

                                        <div class="py-1 px-2 text-black mt-2 flex flex-col items-center justify-center rounded bg-white w-[90%] h-fit">
                                            <table class="text-sm text-start w-full">
                                                <tr>
                                                    <td>email</td>
                                                    <td>{{ $groupedResponses['website']['responses']['pre-test']['email'] ?? $preTestResponseWebsiteEmail }}</td>
                                                </tr>
                                                <tr>
                                                    <td>no-email</td>
                                                    <td>{{ $groupedResponses['website']['responses']['pre-test']['no-email'] ?? $preTestResponseWebsiteNoemail }}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                        <p class="xl:text-xl">
                                            Post-Test
                                        </p>
                                        <p class="xl:text-2xl">{{ $groupedResponses['website']['responses']['post-test']['count'] ?? $postTestResponseWebsite }}</p>
                                        <div class="py-1 px-2 text-black mt-2 flex flex-col items-center justify-center rounded bg-white w-[90%] h-fit">
                                            <table class="text-sm text-start w-full">
                                                <tr>
                                                    <td>email</td>
                                                    <td>{{ $groupedResponses['website']['responses']['post-test']['email'] }}</td>
                                                </tr>
                                                <tr>
                                                    <td>no-email</td>
                                                    <td>{{ $groupedResponses['website']['responses']['post-test']['no-email'] }}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex w-full h-fit items-center justify-start flex-col rounded-md dark:bg-gray-50 bg-gray-800 shadow-md">
                        <div class="text-center rounded bg-teal-400 w-full p-1">
                            <p class="lg:text-xl text-white">
                                Emodul
                            </p>
                        </div>
                        <div class="flex flex-row xl:flex-nowrap flex-wrap items-start justify-center rounded-md w-full h-full dark:bg-gray-50 bg-gray-800">
                            <div class="py-4 text-center flex items-center justify-center flex-col w-full h-full">
                                <p class="lg:text-xl dark:text-black text-white">
                                    Responden
                                </p>

                                <p class="lg:text-2xl dark:text-black text-white">{{ $groupedResponses['emodul']['responden']['count'] ?? $RespondenEmodul }}</p>

                                <div class="text-white mt-2 text-center flex flex-row items-center justify-center rounded bg-gradient-to-r from-blue-500 to-cyan-500 w-[85%] h-fit">
                                    <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                        <p class="xl:text-xl">
                                            Email
                                        </p>
                                        <p class="xl:text-2xl">{{ $groupedResponses['emodul']['responden']['email'] ?? $emailResponseEmodul }}</p>
                                    </div>
                                    <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                        <p class="xl:text-xl">
                                            No-email
                                        </p>
                                        <p class="xl:text-2xl">{{ $groupedResponses['emodul']['responden']['no-email'] ?? $noEmailResponseEmodul }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="py-4 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                <p class="lg:text-xl dark:text-black text-white">
                                    Responses
                                </p>
                                <p class="lg:text-2xl dark:text-black text-white">{{ $groupedResponses['emodul']['responses']['count'] ?? $totalResponseEmodul }}</p>

                                <div class="text-white mt-2 text-center flex flex-row items-center justify-center rounded bg-gradient-to-r from-blue-500 to-cyan-500 w-[90%] h-fit">
                                    <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                        <p class="xl:text-xl">
                                            Pre-Test
                                        </p>
                                        <p class="xl:text-2xl">{{ $groupedResponses['emodul']['responses']['pre-test']['count'] ?? $preTestResponseEmodul }}</p>

                                        <div class="py-1 px-2 text-black mt-2 flex flex-col items-center justify-center rounded bg-white w-[90%] h-fit">
                                            <table class="text-sm text-start w-full">
                                                <tr>
                                                    <td>email</td>
                                                    <td>{{ $groupedResponses['emodul']['responses']['pre-test']['email'] ?? $preTestResponseEmodulEmail }}</td>
                                                </tr>
                                                <tr>
                                                    <td>no-email</td>
                                                    <td>{{ $groupedResponses['emodul']['responses']['pre-test']['no-email'] ?? $preTestResponseEmodulNoemail }}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                        <p class="xl:text-xl">
                                            Post-Test
                                        </p>
                                        <p class="xl:text-2xl">{{ $groupedResponses['emodul']['responses']['post-test']['count'] ?? $postTestResponseEmodul }}</p>
                                        <div class="py-1 px-2 text-black mt-2 flex flex-col items-center justify-center rounded bg-white w-[90%] h-fit">
                                            <table class="text-sm text-start w-full">
                                                <tr>
                                                    <td>email</td>
                                                    <td>{{ $groupedResponses['emodul']['responses']['post-test']['email'] ?? $postTestResponseEmodulEmail }}</td>
                                                </tr>
                                                <tr>
                                                    <td>no-email</td>
                                                    <td>{{ $groupedResponses['emodul']['responses']['post-test']['no-email'] ?? $postTestResponseEmodulNoemail }}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ----------------------------- SCORING PERSONAL ------------------------------------- -->
            <div class="px-4 h-fit">  
                @php
                    $groupedAllResponses = collect($allResponses)->groupBy('answer.question.section.form.form_name');
                    $groupedAllResponsesScoring = collect($allResponses)->groupBy('responden.email');
                @endphp

                <div class="flex lg:flex-nowrap flex-wrap md:gap-3 gap-10 m-4 mb-12">
                    <div class="flex w-full h-fit items-center justify-start flex-col rounded-md dark:bg-gray-50 bg-gray-800 shadow-md">
                        <div class="text-center rounded bg-teal-400 w-full p-4">
                            <p class="lg:text-3xl font-bold text-white">
                                SCORING
                            </p>
                        </div>

                        <div class="w-full h-fit flex justify-end items-end px-3 pt-2">
                            <a data-popover-target="popover-download-excel-scoring-{{ $selectedForm ?? $defaultSelectedForm }}" wire:click="exportExcel('scoring',0)" class="p-1 bg-green-500 text-white rounded hover:bg-green-600">
                                <svg class="w-5 h-5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                                </svg>           
                            </a>
                        </div>
                        <div data-popover id="popover-download-excel-scoring-{{ $selectedForm ?? $defaultSelectedForm }}" role="tooltip" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                            <div class="py-2 px-3">
                                <p>Download</p>
                            </div>
                            <div data-popper-arrow></div>
                        </div>

                        <div class="flex flex-col xl:flex-nowrap flex-wrap items-start justify-center w-full h-full">
                            @php
                                $groupedAllResponsesScoring = $groupedAllResponsesScoring->map(function ($data) {
                                    $groupedByPlacement = $data->groupBy(function ($dataGroup) {

                                        $placement = optional($dataGroup->answer->question->section->form)->placement;

                                        if (str_contains($placement, 'website')) {
                                            return 'website';
                                        }

                                        if (str_contains($placement, 'emodul')) {
                                            return 'emodul';
                                        }

                                        return 'disable'; // selain website & emodul
                                    });

                                    return $groupedByPlacement->map(function ($placementGroup) {

                                        return $placementGroup
                                            ->groupBy('answer.question.section.form.id')
                                            ->map(function ($group) {

                                                $formName = optional(
                                                    $group->first()->answer->question->section->form
                                                )->form_name;

                                                $group->form_name = $formName;

                                                return $group;
                                            });
                                    });
                                });

                                $index = 0;
                                $indexNoEmail = 0;
                            @endphp
                            
                            <div class="flex flex-wrap gap-2 w-full px-3 pb-3">
                                
                                @foreach ($groupedAllResponsesScoring as $emailScoring => $categoryScoring)
                                    
                                    @php
                                        $index++;
                                        if($emailScoring == ''){
                                            $indexNoEmail++;
                                        }
                                    @endphp
                                
                                    <div class="flex-[1_1_calc(50%-0.5rem)] items-center justify-center flex-col rounded dark:bg-gray-200 bg-gray-700 w-full px-2 py-1 mt-3 {{ $index > 2 && !$showAllScoring ? 'hidden' : '' }}">
                                        <h1 class="flex justify-between items-center text-lg mt-2 font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded shadow-md">{{ $emailScoring == '' ? 'No Email '.$indexNoEmail : $emailScoring }}
                                            <div class="h-fit flex justify-center items-center">
                                                <a data-popover-target="popover-download-excel-scoring-{{ $emailScoring}}" wire:click="exportExcel('scoringPersonal', @js($emailScoring))" class="p-1 bg-green-500 text-white rounded hover:bg-green-600">
                                                    <svg class="w-5 h-5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                                                    </svg>           
                                                </a>
                                            </div>
                                            <div data-popover id="popover-download-excel-scoring-{{ $emailScoring }}" role="tooltip" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                                <div class="py-2 px-3">
                                                    <p>Download</p>
                                                </div>
                                                <div data-popper-arrow></div>
                                            </div>
                                        </h1>
                                        @foreach ($categoryScoring as $categoryNameScoring => $formIdScoring)
                                            
                                            @php
                                                $dataRekap = collect();
                                            @endphp
                                            <div class="pt-3 px-2">
                                                <button type="button" id="toggleDetailScoring-{{ $emailScoring }}-{{ $categoryNameScoring }}" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Show Detail</button>
                                            </div>
                                            <div class="flex-[1_1_calc(50%-0.5rem)] rounded w-full px-3 pb-2 mt-3 hidden" id="detailScoring-{{ $emailScoring }}-{{ $categoryNameScoring }}">
                                                <h1 class="text-xl mt-2 text-center font-bold text-white bg-gradient-to-r from-blue-600 to-slate-700 p-2 dark:form-gray-500 dark:to-gray-700 rounded shadow-md">{{ $categoryNameScoring }}</h1>
                                                <div class="bg-slate-600 flex-[1_1_calc(50%-0.5rem)] items-center justify-center flex-col rounded dark:bg-gray-300 pb-2">
                                                    @foreach($formIdScoring as $dataFormScoring)
                                                        
                                                        @php
                                                            $groupedResponsesFormScoring = $dataFormScoring->groupBy('answer.question.question');
                                                            $groupedResponsesForm2 = $groupedResponsesFormScoring->map(function($dataResponsesForm){
                                                                return $dataResponsesForm->groupBy('attempt');
                                                            });

                                                            $groupedAttemptScoring = $dataFormScoring->pluck('attempt')->unique()->values();                                             
                                                        @endphp
                                                        
                                                            
                                                        <div class="flex-[1_1_calc(50%-0.5rem)] items-center justify-center flex-col rounded dark:bg-gray-800 w-full px-3 py-1">
                                                            <div class="bg-cyan-500 rounded mt-4 text-center overflow-hidden flex flex-col justify-center items-center w-full">
                                                                <p class="text-sm text-gray-400 p-0 bg-gray-200 w-1/4 rounded-b-2xl">Nama Form</p>
                                                                <h1 class="text-xl pt-0 pb-1 font-bold text-white">{{ $dataFormScoring->form_name }}</h1>
                                                            </div>
                                                        
                                                            <table class="w-full text-sm text-left rtl:text-right dark:bg-white text-gray-200 dark:text-black bg-slate-800 shadow-md rounded overflow-hidden border-2">
                                                                <thead class="uppercase text-black bg-slate-300">
                                                                    <tr class="text-center">
                                                                        <th class="p-3 text-start">Pertanyaan</th>
                                                                        @foreach($groupedAttemptScoring as $attemptScoring)
                                                                            <th>{{ $attemptScoring }}</th>
                                                                        @endforeach
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    
                                                                    @foreach ($groupedResponsesForm2 as $questionScoring => $responsesDataScoring)
                                                                        <tr class="border-b-2 border-gray-400 text-center">
                                                                            <td class="p-3 text-start">{{ Str::limit($questionScoring,20) }}</td>
                                                                            @foreach($responsesDataScoring as $attemptScoring => $attemptDataScoring)
                                                                                @foreach ($attemptDataScoring as $answerDataScoring) 
                                                                                    <td>
                                                                                        <b>{{ $answerDataScoring->answer->answer }}</b>-({{ $answerDataScoring->answer->value }})
                                                                                    </td>
                                                                                @endforeach
                                                                            @endforeach
                                                                        </tr>
                                                                    @endforeach
                                                                    <tr class="bg-gray-500 text-white font-bold">
                                                                        <td class="p-3 text-start">Total</td>
                                                                        @foreach($groupedAttemptScoring as $attemptTxtScoring)
                                                                            @php
                                                                                $formName = $dataFormScoring->form_name;

                                                                                $current = $dataRekap->get($formName, []);
                                                                                $current[$attemptTxtScoring] = $dataFormScoring->where('attempt', $attemptTxtScoring)->sum('answer.value');

                                                                                $dataRekap->put($formName, $current);
                                                                            @endphp
                                                                            <td class="text-center">
                                                                                <span>{{ $dataFormScoring->where('attempt', $attemptTxtScoring)->sum('answer.value') }}</span>
                                                                            </td>
                                                                        @endforeach
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    @endforeach
                                                </div>
                                            </div>
                                            <div class="flex gap-2 flex-row xl:flex-nowrap flex-wrap items-start justify-center w-full bg-white p-3 rounded shadow-sm mt-2">
                                                @php
                                                    $maxScore = collect($dataRekap)->flatten()->max();
                                                    
                                                @endphp
                                                @foreach($dataRekap as $formNameRekap => $dataFormRekap)
                                                    <div class="flex-[1_1_calc(50%-0.5rem)] items-center justify-center border-e-2">
                                                        <h3 class="font-bold">{{ $formNameRekap }}</h3>
                                                        @foreach($dataFormRekap as $attemptRekap => $dataAttemptRekap)
                                                        
                                                            <div class="pt-2">
                                                                @php
                                                                    $valueScoreRekap = 0;
                                                                    if($maxScore == 0){
                                                                        $valueScoreRekap = $dataAttemptRekap;
                                                                    }else{
                                                                        $valueScoreRekap = round(($dataAttemptRekap / $maxScore )*100);
                                                                    }
                                                                    if($valueScoreRekap == 0){
                                                                        $valueScoreRekap =6;
                                                                    }
                                                                    if($valueScoreRekap > 70){
                                                                        $bgBar="bg-green-400";
                                                                    }elseif($valueScoreRekap > 40){
                                                                        $bgBar="bg-yellow-300";
                                                                    }elseif($valueScoreRekap > 0){
                                                                        $bgBar="bg-red-400";
                                                                    }
                                                                @endphp
                                                                <p>Percobaan {{ $attemptRekap }}</p>
                                                                <p class="{{ $bgBar }} px-2" >{{ $dataAttemptRekap }}</p>
                                                            </div>
                                                        @endforeach
                                                    </div>
                                                @endforeach
                                            </div>  
                                        @endforeach
                                    </div>
                                @endforeach
                            </div>

                            <div class="text-center mt-4 w-full">
                                <hr class="mb-4">
                                <button wire:click="toggleShowAllScoring()" wire:loading.attr="disabled" id="toggle-scoring-btn" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 rounded-pill shadow-sm font-semibold">
                                    <svg class="inline w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z"/>
                                    </svg>                                      
                                    <span id="see-all-txt">{{ $showAllScoring ? 'Sembunyikan Sebagian' : 'Tampilkan Semua' }}</span>
                                </button>
                            </div>
                             
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-center flex-col gap-3 rounded dark:bg-slate-200 bg-gray-600 py-10 px-4">
                <div class="relative overflow-x-hidden sm:rounded-lg w-full shadow-md bg-slate-800 dark:bg-white">
                    <h1 class="text-3xl font-bold bg-cyan-600 rounded p-3 mb-1 text-center text-white">Response Terekam</h1>
                    <div class="m-4">
                        <div class="m-4 flex flex-wrap justify-center gap-2">
                            <div class="flex-[1_1_calc(50%-0.5rem)] min-w-fit bg-slate-200 rounded p-3 border-2 border-gray-400 border-dashed">
                                <label for="countries" class="block mb-2 text-sm font-medium text-gray-900">Pilih Placement</label>
                                <select wire:model="selectedPlacement" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                    <option value=''>Pilih Placement</option>
                                    <option value="pre-test-website">Pre-Test Website</option>
                                    <option value="post-test-website">Post-Test Website</option>
                                    <option value="pre-test-emodul">Pre-Test Emodul</option>
                                    <option value="post-test-emodul">Post-Test Emodul</option>
                                </select>
                            </div>
                            <div class="flex-[1_1_calc(50%-0.5rem)] bg-slate-200 rounded p-3 border-2 border-gray-400 border-dashed">
                                <label for="countries" class="block mb-2 text-sm font-medium text-gray-900">Pilih Judul Form</label>
                                <select wire:model="selectedForm" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                    <option class="text-gray-300" value=''>-- Pilih Judul Form --</option>
                                    @if ($forms)
                                        @foreach ($forms as $form => $value)
                                            <option value="{{ $value }}">{{ $form }}</option>
                                        @endforeach
                                    @else
                                        <option value="0" disabled>-- no form available --</option>
                                    @endif
                                </select>
                            </div>
                        </div>
                        <button type="button" wire:click="loadData" class="text-white w-full bg-green-500 box-border border border-transparent hover:bg-green-600 focus:ring-4 focus:ring-green-300 shadow-xs font-medium leading-5 rounded text-sm px-4 py-2.5 focus:outline-none">Search</button>
                    </div>
                    @if ($responseData->isEmpty())
                        <div class="bg-blue-200 rounded  m-2 text-center shadow-md overflow-hidden flex flex-col justify-center items-center">
                            <p class="text-sm text-gray-400 p-1 bg-gray-200 w-1/4 rounded-b-2xl">Nama Form</p>
                            <h1 class="pt-1 ">-- Belum ada response --</h1>
                            <p class="pb-2">Dari Form dengan 
                                @if($selectedFormName)
                                    Nama
                                @else
                                    Placement
                                @endif
                                <b>{{ $selectedFormName }}</b>
                                @if($selectedPlacement && $selectedFormName)
                                    dan Placement yang berada di
                                @endif
                                <b>{{ $selectedPlacement }}</b></p>
                        </div>
                    @else
                        <div class="w-full h-fit p-2 flex justify-end items-end">
                            <a data-popover-target="popover-download-response" wire:click="exportExcel('response',{{ $responseData[0]->answer->question->section->form->id }})" class="p-1 bg-green-500 text-white rounded hover:bg-green-600">
                                <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                                </svg>           
                            </a>
                            <div data-popover id="popover-download-response" role="tooltip" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                <div class="py-2 px-3">
                                    <p>Download Response</p>
                                </div>
                                <div data-popper-arrow></div>
                            </div>
                        </div>
                        <div class=" rounded my-2 mx-3 p-1 text-center overflow-hidden flex flex-col justify-center items-center">
                            <div class="w-full rounded bg-cyan-500 flex flex-col justify-center items-center">
                                <p class="text-sm text-gray-400 px-4 py-1 bg-slate-200 w-fit rounded-b-2xl">Nama Form</p>
                                <h1 class="text-2xl pt-1 pb-2 font-bold text-white">{{ $responseData[0]->answer->question->section->form->form_name }}</h1>
                            </div>
                            <div class="w-full h-fit p-2 flex justify-end items-end gap-3">
                            </div>
                            <div class="w-full overflow-x-scroll rounded-md">
                                <table class="w-full text-sm rtl:text-right dark:bg-white bg-slate-600 text-white dark:text-black shadow-md rounded-md border-2 border-gray-400 mb-2">
                                    <thead class="text-black uppercase bg-slate-300 rounded-md">
                                        @php
                                            // 1. Group response per pertanyaan
                                           
                                            $groupedResponses = collect($responseData)
                                                ->groupBy(fn($r) => $r->answer->question->id);

                                            // 2. Ambil kolom unik (email dulu, uuid belakangan)
                                           $columns = collect($responseData)
                                                ->map(function ($r) {
                                                    return [
                                                        'email' => $r->responden?->email,
                                                        'uuid' => $r->uuid,
                                                        'attempt' => $r->attempt,
                                                        'created_at' => $r->created_at,
                                                    ];
                                                })
                                                ->groupBy(fn ($c) => $c['email'] ?? $c['uuid']) // ✅ group per user
                                                ->map(fn ($group) => $group->sortBy('attempt')) // ✅ attempt berurutan
                                                ->flatten(1)
                                                ->unique(fn ($c) => ($c['email'] ?? $c['uuid']) . '-attempt-' . $c['attempt'])
                                                ->sortBy(fn($c) => $c['email'] ? 0 : 1) // ✅ EMAIL DI DEPAN
                                                ->values();
                                        @endphp
                                        <tr>
                                            <th class="p-3">Pertanyaan</th>

                                           @foreach ($columns as $col)
                                                <th class="p-3 text-center" style="min-width: 150px;">
                                                    @if($col['email'])
                                                        <div>{{ $col['email'] }}</div>
                                                        <div class="text-xs text-gray-600">(Attempt {{ $col['attempt'] }})</div>
                                                    @else
                                                        <div>No-Email</div>
                                                        <div>({{ $col['created_at']->format('y-m-d H:i') }})</div>
                                                    @endif
                                                    
                                                </th>
                                            @endforeach
                                        </tr>
                                    </thead>
                                    <tbody class="rounded-md">
                                        @forelse ($groupedResponses as $questionId => $responses)
                                            <tr>
                                                <td class="p-3">
                                                    {{ $responses->first()->answer->question->question }}
                                                </td>

                                            @foreach ($columns as $col)
                                                @php
                                                    $cellResponses = $responses->filter(function ($r) use ($col) {
                                                        return $r->attempt == $col['attempt'] &&
                                                            (
                                                                ($col['email'] && $r->responden?->email === $col['email']) ||
                                                                (!$col['email'] && $r->uuid === $col['uuid'])
                                                            );
                                                    });
                                                @endphp

                                                <td class="p-3">
                                                    @foreach ($cellResponses as $r)
                                                        <span>{{ $r->answer->answer }}</span>
                                                    @endforeach
                                                </td>
                                            @endforeach
                                        </tr>
                                        @empty
                                        <tr>
                                            <td colspan="{{ $columns->count() + 1 }}" class="p-4 text-center text-gray-500">
                                                -- Belum ada response --
                                            </td>
                                        </tr>
                                        @endforelse
                                    </tbody>
                                </table>
                                
                            </div>
                        </div>
                    @endif
                </div>
            </div>
            
            {{-- REKAP JAWABAN --}}
            <div class="flex items-center justify-center flex-col gap-3 rounded bg-slate-700 dark:bg-slate-300 py-10 p-4">
                <div class="rounded mt-4 overflow-hidden w-full text-center shadow-md dark:bg-white bg-gray-900">
                    <h1 class="text-3xl font-bold p-3 bg-cyan-600 text-white">Rekap Jawaban</h1>
                    
                    @if ($allResponses->isEmpty())
                        <div class="bg-white rounded my-2 text-center overflow-hidden flex flex-col justify-center items-center">
                            <p class="text-sm text-gray-400 p-1 bg-gray-200 w-1/4 rounded-b-2xl">Nama Form</p>
                            <h1 class="pt-1 pb-2 text-gray-400">-- Belum ada response --</h1>
                        </div>
                    @else
                        <div class="w-full h-fit p-2 flex justify-end items-end">
                            <a data-popover-target="popover-download-excel-rekap" wire:click="exportExcel('rekap',0)" class="p-1 bg-green-500 text-white rounded hover:bg-green-600">
                                <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                                </svg>           
                            </a>
                            <div data-popover id="popover-download-excel-rekap" role="tooltip" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                <div class="py-2 px-3">
                                    <p>Download Response Rekap</p>
                                </div>
                                <div data-popper-arrow></div>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2 w-full px-3 pb-3">
                            @foreach ($groupedAllResponses as $formName => $responses)
                                @php
                                    $groupedResponses = $responses->groupBy('answer.question.question');
                                    $groupedAnswer = $uniqueAnswers[$responses[0]->form_id];
                                @endphp
                                
                                @if($groupedAnswer->count() <= 6)
                                    <div class="flex-[1_1_calc(50%-0.5rem)] items-center justify-center flex-col rounded">
                                        <div class="bg-cyan-500 rounded mt-4 text-center overflow-hidden flex flex-col justify-center items-center w-full">
                                            <p class="text-sm text-gray-400 p-0 bg-gray-200 w-1/4 rounded-b-2xl">Nama Form</p>
                                            <h1 class="text-xl pt-0 pb-1 font-bold text-white">{{ $formName }}</h1>
                                        </div>
                                    
                                        <table class="w-full text-sm text-left rtl:text-right dark:bg-slate-50 bg-slate-600 text-white dark:text-black shadow-md rounded overflow-hidden">
                                            <thead class=" text-black uppercase dark:text-black bg-slate-300 ">
                                                <tr class="text-center">
                                                    <th class="p-3 text-start">Pertanyaan</th>
                                                    @foreach($groupedAnswer as $answer)
                                                        <th>{{ $answer }}</th>
                                                    @endforeach
                                                </tr>
                                            </thead>
                                            <tbody>
                                                @foreach ($groupedResponses as $question => $responses)
                                                    <tr class="border-b-2 border-gray-500 dark:border-gray-200 text-center">
                                                        <td class="p-3 text-start">{{ Str::limit($question,20) }}</td>
                                                        @php
                                                            $scores = $groupedAnswer->mapWithKeys(fn($item) => [$item => 0]); // Buat array dengan key dari $valueAnswer dan value 0

                                                            foreach ($responses as $response) {
                                                                $answer = $response->answer->answer;
                                                                if (isset($scores[$answer])) {
                                                                    $scores[$answer] += 1; // Tambahkan nilai sesuai dengan skor yang sudah diatur
                                                                }
                                                            }
                                                        @endphp
                                                        
                                                        @foreach($scores as $answer => $value)
                                                            <td>{{ $value }}</td>
                                                        @endforeach
                                                    </tr>
                                                @endforeach
                                            </tbody>
                                        </table>
                                    </div>
                                @endif
                            @endforeach
                        </div>
                    @endif
                </div>
            </div>
    <!-- <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
            <p class="text-2xl text-gray-400 dark:text-gray-500">
            <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
            </svg>
            </p>
        </div>
        <div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
            <p class="text-2xl text-gray-400 dark:text-gray-500">
            <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
            </svg>
            </p>
        </div>
        <div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
            <p class="text-2xl text-gray-400 dark:text-gray-500">
            <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
            </svg>
            </p>
        </div>
        <div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
            <p class="text-2xl text-gray-400 dark:text-gray-500">
            <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
            </svg>
            </p>
        </div>
    </div> -->
        </div>
    </div>
</div>
<script>
     document.querySelectorAll('[id^="toggleDetailScoring-"]').forEach(select => {
        select.removeAttribute('checked')
     })
   
    function toogleShowDetail(){
        const email = this.id.split('-')[1]
        const category = this.id.split('-')[2]
        this.textContent = this.textContent == "Hidden Detail" ? 'Show Detail' : 'Hidden Detail'
        const detail = document.getElementById('detailScoring-'+email+'-'+category)
        detail.classList.toggle('hidden')
    }
    document.querySelectorAll('[id^="toggleDetailScoring-"]').forEach(select => {
        select.removeEventListener('click', toogleShowDetail)
        select.addEventListener('click', toogleShowDetail)
    })
</script>