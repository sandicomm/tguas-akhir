<table>
    <thead>
        <tr>
            <th colspan="3" style="font-weight: bold; font-size: 16px;">SCORING FORM {{$placement}}</th>
        </tr>
    </thead>
</table>

@foreach($groupedData as $email => $forms)
    @foreach($forms as $formId => $responses)
    
        @php
            // === LOGIKA PEMROSESAN DATA PER FORM ===
            
            // 1. Ambil Meta Data Form (Cukup dari data pertama)
            $firstResponse = $responses->first();
            $formObject = $firstResponse->answer->question->section->form;
            $formName = $formObject->form_name;
            $placement = $formObject->placement;

            // 2. Identifikasi Attempt (Kolom) - Khusus untuk form ini saja
            $attempts = $responses->pluck('attempt')->unique()->sort()->values();
            
            // 3. Identifikasi Pertanyaan (Baris) - Khusus untuk form ini saja
            $questions = $responses->pluck('answer.question')
                ->unique('id')
                ->sortBy('order') // Pastikan ada kolom order/id agar urut
                ->values();

            // 4. Build Matrix [question_id][attempt]
            // Kita pakai array asosiatif agar aksesnya cepat dan tepat
            $matrix = [];
            foreach ($responses as $resp) {
                // Pastikan handle jika answer null (optional)
                $ans = $resp->answer;
                if ($ans) {
                    $matrix[$ans->question_id][$resp->attempt] = [
                        'answer' => $ans->answer,
                        'value'  => (int) ($ans->value ?? 0)
                    ];
                }
            }
            
            // Hitung total kolom untuk colspan header
            $totalColumns = $attempts->count() + 1; // +1 untuk kolom Pertanyaan
        @endphp

        <table>
            <tr>
                <td colspan="{{ $totalColumns }}" style="background-color: #4b5563; color: #ffffff; font-weight: bold; border: 1px solid #000000;">
                    RESPONDEN: {{ $email }}
                </td>
            </tr>
            <tr>
                <td colspan="{{ $totalColumns }}" style="background-color: #4b5563; color: #ffffff; font-weight: bold; border: 1px solid #000000;">
                    FORM: {{ $formName }}
                </td>
            </tr>
            <tr>
                <td colspan="{{ $totalColumns }}" style="background-color: #4b5563; color: #ffffff; font-weight: bold; border: 1px solid #000000;">
                    PLACEMENT: {{ $placement }}
                </td>
            </tr>
        </table>

        <table border="1">
            <thead>
                <tr>
                    <th style="background-color: #f3f4f6; font-weight: bold; width: 350px; text-align: center; border: 1px solid #000000;">
                        PERTANYAAN
                    </th>
                    @foreach ($attempts as $attempt)
                        <th style="background-color: #e5e7eb; font-weight: bold; width: 100px; text-align: center; border: 1px solid #000000;">
                            ATTEMPT {{ $attempt }}
                        </th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @foreach ($questions as $question)
                    <tr>
                        <td style="background-color: #f9fafb; border: 1px solid #000000;">
                            {{ $question->question }}
                        </td>
                        
                        @foreach ($attempts as $attempt)
                            @php 
                                $cell = $matrix[$question->id][$attempt] ?? null; 
                            @endphp
                            <td style="text-align: center; border: 1px solid #000000;">
                                @if($cell)
                                    {{-- Gabungkan dalam satu cell agar rapi di Excel --}}
                                    {{ $cell['answer'] }} <br>
                                    <span style="font-size: 10px; color: #555;">(Skor: {{ $cell['value'] }})</span>
                                @else
                                    -
                                @endif
                            </td>
                        @endforeach
                    </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td style="background-color: #f3f4f6; font-weight: bold; text-align: right; border: 1px solid #000000;">
                        TOTAL SKOR
                    </td>
                    @foreach ($attempts as $attempt)
                        @php
                            $attemptTotal = 0;
                            foreach ($questions as $q) {
                                $attemptTotal += $matrix[$q->id][$attempt]['value'] ?? 0;
                            }
                        @endphp
                        <td style="background-color: #fef08a; font-weight: bold; text-align: center; border: 1px solid #000000;">
                            {{ $attemptTotal }}
                        </td>
                    @endforeach
                </tr>
            </tfoot>
        </table>
    @endforeach
    <table>
        <tr><td colspan="{{ $totalColumns }}" style="height: 25px; background-color: #e31a00;"></td></tr>
    </table>
@endforeach