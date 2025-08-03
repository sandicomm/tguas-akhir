@php
    $groupedAllResponses = collect($response)->groupBy('answer.question.section.form.form_name');
@endphp
@foreach ($groupedAllResponses as $formName => $responses)
    @php
        $groupedResponses = $responses->groupBy('answer.question.question');
        $groupedAnswer = $responses->pluck('answer.answer')->unique();
    @endphp

    @if($groupedAnswer->count() < 5)
        <div>
            <div>
                <h1>{{ $formName }}</h1>
            </div>
        
            <table>
                <thead>
                    <tr>
                        <th>Pertanyaan</th>
                        @foreach($groupedAnswer as $answer)
                            <th>{{ $answer }}</th>
                        @endforeach
                    </tr>
                </thead>
                <tbody>
                    @foreach ($groupedResponses as $question => $responses)
                        <tr>
                            <td>{{ $question }}</td>
                            @php
                                // Inisialisasi semua skor ke 0
                                $scores = $groupedAnswer->mapWithKeys(fn($item) => [$item => 0]);

                                // Hitung jumlah jawaban yang cocok
                                foreach ($responses as $response) {
                                    $answer = $response->answer->answer;
                                    if (isset($scores[$answer])) {
                                        $scores[$answer] += 1;
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
        <br>
    @endif
@endforeach