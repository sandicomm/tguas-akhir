<table>
    <thead>
        <tr>
            <th colspan="3" style="font-weight: bold; font-size: 14px;">LAPORAN SCORING PERSONAL</th>
        </tr>
        <tr>
            <th colspan="3" style="background-color: #4b5563; color: #ffffff; font-weight: bold; border: 1px solid #000000;">Email: {{ $userKey }}</th>
        </tr>
    </thead>
</table>

@php
    $groupedByForm = $responses->groupBy(function($item) {
        return $item->answer->question->section->form->id;
    });
@endphp

@foreach ($groupedByForm as $formName => $formResponses)
    @php
        // 2. Ambil data form dari item pertama dalam grup ini
        $firstResponse = $formResponses->first();
        $formObject = $firstResponse->answer->question->section->form;
        $formName = $formObject->form_name;
        $placement = $formObject->placement;
    @endphp
    <div style="margin-bottom: 50px; page-break-after: always;">
        
        {{-- HEADER FORM --}}
        <table>
            <tr>
                <td colspan="3" style="background-color: #4b5563; color: #ffffff; font-weight: bold; border: 1px solid #000000;">
                    FORM: {{ $formName }}
                </td>
            </tr>
            <tr>
                <td colspan="3" style="background-color: #4b5563; color: #ffffff; font-weight: bold; border: 1px solid #000000;">
                    PLACEMENT: {{ $placement }}
                </td>
            </tr>
        </table>

        @php
            // 2. Logika Matrix internal untuk Form ini saja
            $columns = $formResponses->map(function($item) {
                    return [
                        'attempt' => $item->attempt,
                        'col_key' => ($item->responden->email ?? 'Guest') . '-' . $item->attempt
                    ];
                })
                ->unique('col_key')
                ->sortBy(['attempt']);

            $questions = $formResponses->pluck('answer.question')
                ->unique('id')
                ->sortBy([
                    ['section.order', 'asc'],
                    ['order', 'asc']          
                ])
                ->values();

            $matrix = [];
            foreach ($formResponses as $resp) {
                $colKey = ($resp->responden->email ?? 'Guest') . '-' . $resp->attempt;
                $matrix[$resp->answer->question->id][$colKey] = [
                    'answer' => $resp->answer->answer,
                    'value' => (int) ($resp->answer->value ?? 0)
                ];
            }
        @endphp

        {{-- TABEL DATA UNTUK FORM INI --}}
        <table border="1" style="border-collapse: collapse; width: 100%;">
            <thead>
                <tr>
                    <th style="background-color: #f3f4f6; font-weight: bold; width: 300px; padding: 8px; border: 1px solid #000000;">
                        PERTANYAAN
                    </th>
                    @foreach ($columns as $col)
                        <th style="background-color: #e5e7eb; font-weight: bold; width: 100px; text-align: center; border: 1px solid #000000;">
                            ATTEMPT {{ $col['attempt'] }}
                        </th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @foreach ($questions as $question)
                    <tr>
                        <td style="text-align: left; background-color: #f9fafb; padding: 8px; font-size: 12px; border: 1px solid #000000;">
                            {{ $question->question }}
                        </td>

                        @foreach ($columns as $col)
                            @php 
                                $dataCell = $matrix[$question->id][$col['col_key']] ?? null; 
                            @endphp
                            <td style="text-align: center; vertical-align: middle; padding: 5px; border: 1px solid #000000;">
                                @if($dataCell)
                                    <span style="font-size: 11px;">{{ $dataCell['answer'] }}</span><br>
                                    <strong style="font-size: 10px;">({{ $dataCell['value'] }})</strong>
                                @else
                                    <span style="color: #d1d5db;">-</span>
                                @endif
                            </td>
                        @endforeach
                    </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td style="background-color: #f3f4f6; font-weight: bold; text-align: right; padding: 8px; border: 1px solid #000000;">TOTAL SCORING</td>
                    @foreach ($columns as $col)
                        @php
                            $currentColTotal = 0;
                            foreach ($questions as $q) {
                                $currentColTotal += $matrix[$q->id][$col['col_key']]['value'] ?? 0;
                            }
                        @endphp
                        <td style="background-color: #fef08a; font-weight: bold; text-align: center; border: 1px solid #000000;">
                            {{ $currentColTotal }}
                        </td>
                    @endforeach
                </tr>
            </tfoot>
        </table>
    </div>

    {{-- Garis pembatas visual (opsional) --}}
    <hr style="border: 1px dashed #ccc; margin: 40px 0;">
@endforeach