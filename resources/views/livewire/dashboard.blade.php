<!-- Main modal -->

<div>
    <div class="sm:ml-64">
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
            <div class="px-4 h-fit">
                <x-loading wire:loading.flex />  
                <div class="flex lg:text-2xl md:text-xl items-center justify-center flex-col gap-3 mb-4 rounded bg-gray-50 dark:bg-gray-800 m-4 p-4 shadow-md">
                    <p class="dark:text-gray-500">
                        Responden Yang Terdata
                    </p>
                    <p class="dark:text-gray-500">{{ $responden }}</p>
                </div>
               
                <div class="flex lg:flex-nowrap flex-wrap md:gap-3 gap-10 m-4 mb-12">
                    <div class="flex w-full h-fit items-center justify-start flex-col bg-gray-50 dark:bg-gray-800 shadow-md">
                        <div class="text-center rounded bg-teal-400 w-full p-1">
                            <p class="lg:text-xl text-white">
                                Website
                            </p>
                        </div>
                        <div class="flex flex-row xl:flex-nowrap flex-wrap items-start justify-center w-full h-full">
                            <div class="py-4 text-center flex items-center justify-center flex-col rounded bg-gray-50 dark:bg-gray-800 w-full h-full">
                                <p class="lg:text-xl dark:text-gray-500">
                                    Responden
                                </p>
                               
                                <p class="lg:text-2xl dark:text-gray-500">{{ $groupedResponses['website']['responden']['count'] ?? $RespondenWebsite }}</p>

                                <div class="text-white mt-2 text-center flex flex-row items-center justify-center rounded bg-gradient-to-r from-blue-500 to-cyan-500 w-[85%] h-fit">
                                    <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                        <p class="xl:text-xl dark:text-gray-500">
                                            Email
                                        </p>
                                        <p class="xl:text-2xl dark:text-gray-500">{{ $groupedResponses['website']['responden']['email'] ?? $emailResponseWebsite }}</p>
                                    </div>
                                    <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                        <p class="xl:text-xl dark:text-gray-500">
                                            No-email
                                        </p>
                                        <p class="xl:text-2xl dark:text-gray-500">{{ $groupedResponses['website']['responden']['no-email'] ?? $noEmailResponseWebsite }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="py-4 text-center flex items-center justify-center flex-col rounded bg-gray-50 dark:bg-gray-800 w-full h-full">
                                <p class="lg:text-xl dark:text-gray-500">
                                    Responses
                                </p>
                                <p class="lg:text-2xl dark:text-gray-500">{{ $groupedResponses['website']['responses']['count'] ?? $ResponseWebsite }}</p>

                                <div class="text-white mt-2 text-center flex flex-row items-center justify-center rounded bg-gradient-to-r from-blue-500 to-cyan-500 w-[90%] h-fit">
                                    <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                        <p class="xl:text-xl dark:text-gray-500">
                                            Pre-Test
                                        </p>
                                        <p class="xl:text-2xl dark:text-gray-500">{{ $groupedResponses['website']['responses']['pre-test']['count'] ?? $preTestResponseWebsite }}</p>

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
                                        <p class="xl:text-xl dark:text-gray-500">
                                            Post-Test
                                        </p>
                                        <p class="xl:text-2xl dark:text-gray-500">{{ $groupedResponses['website']['responses']['post-test']['count'] ?? $postTestResponseWebsite }}</p>
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

                    <div class="flex w-full h-fit items-center justify-start flex-col bg-gray-50 dark:bg-gray-800 shadow-md">
                        <div class="text-center rounded bg-teal-400 w-full p-1">
                            <p class="lg:text-xl text-white">
                                Emodul
                            </p>
                        </div>
                        <div class="flex flex-row xl:flex-nowrap flex-wrap items-start justify-center w-full h-full">
                            <div class="py-4 text-center flex items-center justify-center flex-col rounded bg-gray-50 dark:bg-gray-800 w-full h-full">
                                <p class="lg:text-xl dark:text-gray-500">
                                    Responden
                                </p>

                                <p class="lg:text-2xl dark:text-gray-500">{{ $groupedResponses['emodul']['responden']['count'] ?? $RespondenEmodul }}</p>

                                <div class="text-white mt-2 text-center flex flex-row items-center justify-center rounded bg-gradient-to-r from-blue-500 to-cyan-500 w-[85%] h-fit">
                                    <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                        <p class="xl:text-xl dark:text-gray-500">
                                            Email
                                        </p>
                                        <p class="xl:text-2xl dark:text-gray-500">{{ $groupedResponses['emodul']['responden']['email'] ?? $emailResponseEmodul }}</p>
                                    </div>
                                    <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                        <p class="xl:text-xl dark:text-gray-500">
                                            No-email
                                        </p>
                                        <p class="xl:text-2xl dark:text-gray-500">{{ $groupedResponses['emodul']['responden']['no-email'] ?? $noEmailResponseEmodul }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="py-4 text-center flex items-center justify-center flex-col rounded bg-gray-50 dark:bg-gray-800 w-full h-full">
                                <p class="lg:text-xl dark:text-gray-500">
                                    Responses
                                </p>
                                <p class="lg:text-2xl dark:text-gray-500">{{ $groupedResponses['emodul']['responses']['count'] ?? $totalResponseEmodul }}</p>

                                <div class="text-white mt-2 text-center flex flex-row items-center justify-center rounded bg-gradient-to-r from-blue-500 to-cyan-500 w-[90%] h-fit">
                                    <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                                        <p class="xl:text-xl dark:text-gray-500">
                                            Pre-Test
                                        </p>
                                        <p class="xl:text-2xl dark:text-gray-500">{{ $groupedResponses['emodul']['responses']['pre-test']['count'] ?? $preTestResponseEmodul }}</p>

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
                                        <p class="xl:text-xl dark:text-gray-500">
                                            Post-Test
                                        </p>
                                        <p class="xl:text-2xl dark:text-gray-500">{{ $groupedResponses['emodul']['responses']['post-test']['count'] ?? $postTestResponseEmodul }}</p>
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

            <div class="px-4 h-fit">  
                @php
                    $groupedAllResponses = collect($allResponses)->groupBy('answer.question.section.form.form_name');
                    $groupedAllResponsesScoring = collect($allResponses)->groupBy('responden.email');
                @endphp

                <div class="flex lg:flex-nowrap flex-wrap md:gap-3 gap-10 m-4 mb-12">
                    <div class="flex w-full h-fit items-center justify-start flex-col bg-gray-50 dark:bg-gray-800 shadow-md">
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
                                $groupedAllResponsesScoring = $groupedAllResponsesScoring->map(function($data) {
                                    $groupedByPlacement = $data->groupBy(function($dataGroup) {
                                        return str_contains($dataGroup->answer->question->section->form->placement, 'website')
                                            ? 'website'
                                            : 'emodul';
                                    });

                                    return $groupedByPlacement->map(function($placementGroup) {
                                        return $placementGroup->groupBy('answer.question.section.form.id')->map(function($group) {
                                            $formName = optional($group->first()->answer->question->section->form)->form_name;
                                            $group->form_name = $formName;
                                            return $group;
                                        });
                                    });
                                });    
                                $index=0;
                            @endphp
  
                            <div class="flex flex-wrap gap-2 w-full px-3 pb-3">
                                @foreach ($groupedAllResponsesScoring as $emailScoring => $categoryScoring)
                                    @php
                                        $index++;
                                    @endphp
                                    <div class="flex-[1_1_calc(50%-0.5rem)] items-center justify-center flex-col rounded bg-gray-200 dark:bg-gray-800 w-full px-2 py-1 mt-3 {{ $index > 2 && !$showAllScoring ? 'hidden' : '' }}">
                                        <h1 class="text-xl mt-2 font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded shadow-md">{{ $emailScoring }} {{ $index }}</h1>
                                        
                                        @foreach ($categoryScoring as $categoryNameScoring => $formIdScoring)
                                            @php
                                                $dataRekap = collect();
                                            @endphp
                                            <div class="pt-3 px-2">
                                                <button type="button" id="toggleDetailScoring-{{ $emailScoring }}-{{ $categoryNameScoring }}" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Show Detail</button>
                                            </div>
                                            <div class="flex-[1_1_calc(50%-0.5rem)] rounded w-full px-3 pb-2 mt-3 hidden" id="detailScoring-{{ $emailScoring }}-{{ $categoryNameScoring }}">
                                                <h1 class="text-xl mt-2 text-center font-bold text-white bg-gradient-to-r from-gray-500 to-gray-700 p-2 rounded shadow-md">{{ $categoryNameScoring }}</h1>
                                                <div class="bg-gray-300 flex-[1_1_calc(50%-0.5rem)] items-center justify-center flex-col rounded dark:bg-gray-800 pb-2">
                                                    @foreach($formIdScoring as $dataFormScoring)
                                                        @php
                                                            $groupedResponsesFormScoring = $dataFormScoring->groupBy('answer.question.question');
                                                            $groupedResponsesForm2 = $groupedResponsesFormScoring->map(function($dataResponsesForm){
                                                                return $dataResponsesForm->groupBy('attempt');
                                                            });

                                                            $groupedAnswerScoring = $groupedResponsesForm2->keys();
                                                            $groupedAttemptScoring = $dataFormScoring->pluck('attempt')->unique()->values();                                             
                                                        @endphp
                                                    
                                                        <div class="flex-[1_1_calc(50%-0.5rem)] items-center justify-center flex-col rounded dark:bg-gray-800 w-full px-3 py-1">
                                                            <div class="bg-cyan-500 rounded mt-4 text-center overflow-hidden flex flex-col justify-center items-center w-full">
                                                                <p class="text-sm text-gray-400 p-0 bg-gray-200 w-1/4 rounded-b-2xl">Nama Form</p>
                                                                <h1 class="text-xl pt-0 pb-1 font-bold text-white">{{ $dataFormScoring->form_name }}</h1>
                                                            </div>
                                                        
                                                            <table class="w-full text-sm text-left rtl:text-right bg-white dark:text-gray-400 shadow-md rounded overflow-hidden border-2">
                                                                <thead class=" text-black uppercase dark:text-gray-400 bg-slate-300 dark:bg-gray-800">
                                                                    <tr class="text-center">
                                                                        <th class="p-3 text-start">Pertanyaan</th>
                                                                        @foreach($groupedAttemptScoring as $attemptScoring)
                                                                            <th>{{ $attemptScoring }}</th>
                                                                        @endforeach
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    @foreach ($groupedResponsesForm2 as $questionScoring => $responsesDataScoring)
                                                                        <tr class="border-b-2 text-center">
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
                                                                    $valueScoreRekap = round(($dataAttemptRekap / $maxScore )*100);
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
                                                                <p class="{{ $bgBar }} px-2" style="width: {{ $valueScoreRekap-5 }}%">{{ $dataAttemptRekap }}</p>
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
                                <button wire:click="toggleShowAllScoring()" wire:loading.attr="disabled" id="toggle-scoring-btn" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 rounded-pill shadow-sm font-semibold">
                                    <svg class="inline w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z"/>
                                    </svg>                                      
                                    <span id="see-all-txt">{{ $showAllScoring ? 'Sembunyikan Sebagian' : 'Tampilkan Semua' }}</span>
                                </button>
                            </div>
                             
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-center flex-col gap-3 rounded bg-slate-200 py-10 px-4">
                <div class="relative overflow-x-hidden sm:rounded-lg w-full bg-white shadow-md">
                    <h1 class="text-3xl font-bold bg-cyan-600 rounded p-3 mb-1 text-center text-white">Response Terekam</h1>
                    <div class="m-4 flex flex-wrap justify-center gap-2">
                        <div class="flex-[1_1_calc(50%-0.5rem)] min-w-fit bg-slate-200 rounded p-3 border-2 border-gray-400 border-dashed">
                            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pilih Placement</label>
                            <select wire:model="selectedPlacement" wire:change="loadData" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value=''>Pilih Placement</option>
                                <option value="pre-test-website">Pre-Test Website</option>
                                <option value="post-test-website">Post-Test Website</option>
                                <option value="pre-test-emodul">Pre-Test Emodul</option>
                                <option value="post-test-emodul">Post-Test Emodul</option>
                            </select>
                        </div>
                        <div class="flex-[1_1_calc(50%-0.5rem)] bg-slate-200 rounded p-3 border-2 border-gray-400 border-dashed">
                            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pilih Judul Form</label>
                            <select wire:model="selectedForm" wire:change="loadData" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
                            <div class="w-full overflow-x-scroll">
                                <table class="w-full text-sm  rtl:text-right bg-white dark:text-gray-400 shadow-md rounded border-2 mb-2">
                                    <thead class="text-black uppercase dark:text-gray-400 bg-slate-300 dark:bg-gray-800">
                                        @php
                                            $groupedResponses = collect($responseData)->groupBy('answer.question.question');
                                            $responsesCollection = collect($responseData)->flatten();
                                            // Ambil email yang tidak null
                                            $uniqueEmails = $responsesCollection->pluck('responden.email')->filter()->unique();
                                            
                                            // Ambil semua yang emailnya null dan kelompokkan berdasarkan created_at
                                            $nullEmailGroups = $responsesCollection
                                                ->whereNull('responden.email')
                                                ->groupBy('uuid'); // Gunakan UUID sebagai pengelompokan
                                            
                                            // Gabungkan hasilnya (email unik + email null dikelompokkan)
                                            $emailGroups = $uniqueEmails->merge($nullEmailGroups->keys());
                                        @endphp
                                        <tr class="text-center text-sm">
                                            <th class="p-3 text-start ">Pertanyaan</th>
                                            
                                            @foreach ($emailGroups as $emailOrUuid)
                                                @php
                                                   if (!is_string($emailOrUuid) || !filter_var($emailOrUuid, FILTER_VALIDATE_EMAIL)) {
                                                        // Jika ini adalah UUID, cari `created_at` yang sesuai
                                                        $timestamp = optional($nullEmailGroups[$emailOrUuid]->first())->created_at;
                                                        $formattedTime = $timestamp ? $timestamp->format('Y-m-d H:i:s') : 'Unknown';
                                                        $displayText = "No Email ({$formattedTime})";
                                                    } else {
                                                        // Jika ini adalah email, tampilkan langsung
                                                        $displayText = $emailOrUuid;
                                                    }
                                                @endphp
                                                <th class="p-3 normal-case">{{ Str::limit($displayText,15) }}</th>
                                            @endforeach
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @if ($groupedResponses->isEmpty())
                                            <tr>
                                                <td class="p-3 text-center text-gray-500" colspan="{{ count($emailGroups) + 1 }}">-- Belum ada response --</td>
                                            </tr>
                                        @else
                                            @foreach ($groupedResponses as $question => $responses)
                                                <tr class="border-b-2">
                                                    <td class="p-3 text-left">{{ Str::limit($question, 15) }}</td>
                                
                                                    @foreach ($emailGroups as $emailOrCreatedAt)
                                                        @php
                                                            if (filter_var($emailOrCreatedAt, FILTER_VALIDATE_EMAIL)) {
                                                                // Jika ini email, cari responden berdasarkan email
                                                                $respondenResponse = $responses
                                                                    ->where(fn($response) => $response->responden && $response->responden->email === $emailOrCreatedAt);
                                                            } else {
                                                                // Jika ini created_at dari email null, ambil dari grup created_at
                                                                $respondenResponse = $nullEmailGroups[$emailOrCreatedAt]
                                                                    ->where('answer.question.question', $question);
                                                            }
                                                        @endphp

                                                        <td class="p-3">
                                                            <div class="flex justify-evenly">
                                                                @foreach ($respondenResponse as $response)
                                                                <span class="">{{ $response?->answer?->answer ?? '-' }}</span>
                                                                @endforeach
                                                            </div>
                                                        </td>
                                                    @endforeach
                                                </tr>
                                            @endforeach
                                        @endif
                                    </tbody>
                                </table>
                                
                            </div>
                        </div>
                    @endif
                </div>
            </div>
            
            {{-- REKAP JAWABAN --}}
            <div class="flex items-center justify-center flex-col gap-3 rounded bg-slate-300 py-10 p-4">
                <div class="rounded mt-4 overflow-hidden w-full text-center shadow-md bg-white">
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
                                    <div class="flex-[1_1_calc(50%-0.5rem)] items-center justify-center flex-col rounded dark:bg-gray-800">
                                        <div class="bg-cyan-500 rounded mt-4 text-center overflow-hidden flex flex-col justify-center items-center w-full">
                                            <p class="text-sm text-gray-400 p-0 bg-gray-200 w-1/4 rounded-b-2xl">Nama Form</p>
                                            <h1 class="text-xl pt-0 pb-1 font-bold text-white">{{ $formName }}</h1>
                                        </div>
                                    
                                        <table class="w-full text-sm text-left rtl:text-right bg-white dark:text-gray-400 shadow-md rounded overflow-hidden border-2">
                                            <thead class=" text-black uppercase dark:text-gray-400 bg-slate-300 dark:bg-gray-800">
                                                <tr class="text-center">
                                                    <th class="p-3 text-start">Pertanyaan</th>
                                                    @foreach($groupedAnswer as $answer)
                                                        <th>{{ $answer }}</th>
                                                    @endforeach
                                                </tr>
                                            </thead>
                                            <tbody>
                                                @foreach ($groupedResponses as $question => $responses)
                                                    <tr class="border-b-2 text-center">
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