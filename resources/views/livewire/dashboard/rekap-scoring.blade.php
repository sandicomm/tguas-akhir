<div class="rounded mt-4 overflow-hidden w-full text-center shadow-md bg-white dark:bg-gray-900">
    <h1 class="text-3xl font-bold p-3 bg-cyan-600 text-white">Rekap Jawaban</h1>
        <div class="w-full p-4">
            <div class="w-full bg-slate-300 p-3 rounded mb-2">
                <p class="font-bold">Pilih Form</p>
                <select wire:model.live="selectedFormId" class="w-full bg-white text-black rounded">
                    @foreach($forms as $id => $name)
                        <option value="{{ $id }}">{{ $name }}</option>
                    @endforeach
                </select>
            </div>
            <div wire:loading class="hidden" id='jsLoader'>
                <x-loading />
            </div>
            @if(count($rekapData) > 0)
                <div class="bg-white dark:bg-slate-800 rounded shadow overflow-hidden">
                    <div class="overflow-x-auto">
                        <div class="w-full h-fit p-2 flex justify-end items-end">
                            <a data-popover-target="popover-download-excel-rekap" wire:click="export" class="p-1 bg-green-500 text-white rounded hover:bg-green-600">
                                <svg class="w-6 h-6 text-white" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                                </svg>           
                            </a>
                            <div data-popover id="popover-download-excel-rekap" role="tooltip" class="absolute z-10 invisible inline-block text-sm dark:text-white transition-opacity duration-300 dark:bg-gray-600 border dark:border-gray-200 rounded-lg shadow-xs opacity-0 text-gray-400 border-gray-600 bg-gray-800">
                                <div class="py-2 px-3">
                                    <p>Download Response Rekap</p>
                                </div>
                                <div data-popper-arrow></div>
                            </div>
                        </div>
                        <table class="w-full text-sm text-left">
                            
                            <thead class="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 uppercase font-bold">
                                <tr>
                                    <th class="p-4 min-w-[300px] sticky left-0 z-10 bg-slate-200 dark:bg-slate-700 border-r border-slate-300 dark:border-slate-600">
                                        Pertanyaan
                                    </th>

                                    @foreach ($headers as $header)
                                        <th class="p-3 text-center min-w-[100px] border-b border-slate-300 dark:border-slate-600">
                                            <div class="flex flex-col items-center justify-center">
                                                <span>{{ $header->answer }}</span>
                                                <span class="text-[10px] text-slate-500 bg-slate-300 dark:bg-slate-900 px-1 rounded mt-1">
                                                    Val: {{ $header->value }}
                                                </span>
                                            </div>
                                        </th>
                                    @endforeach
                                </tr>
                            </thead>

                            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                                @foreach ($rekapData as $row)
                                    <tr class="">
                                        
                                        <td class="p-3 align-top sticky left-0 z-10 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
                                            <div class="flex items-start gap-3">
                                                <span class="text-slate-800 dark:text-slate-200 font-medium">
                                                    {{ $row['question'] }}
                                                </span>
                                            </div>
                                        </td>

                                        @foreach ($headers as $header)
                                            @php
                                                // Ambil jumlah count dari array, default 0 jika tidak ada
                                                $count = $row['counts'][$header->answer] ?? 0;
                                            @endphp
                                            <td class="p-3 text-center align-middle">
                                                @if($count > 0)
                                                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 font-bold text-sm">
                                                        {{ $count }}
                                                    </span>
                                                @else
                                                    <span class="text-slate-300 dark:text-slate-600">-</span>
                                                @endif
                                            </td>
                                        @endforeach

                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            @else
                <div class="flex flex-col items-center justify-center h-64 dark:bg-slate-800 rounded border border-dashed border-slate-600 text-slate-400">
                    <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <p>Form tidak ada response atau tidak memenuhi kondisi untuk direkap</p>
                </div>
            @endif
        </div>
</div>