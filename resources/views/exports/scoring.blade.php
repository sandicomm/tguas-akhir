@php
    $groupedAllResponsesScoring = collect($response)->groupBy('responden.email');
    $groupedAllResponsesScoring = $groupedAllResponsesScoring->map(function($data) {
        // Pertama, group berdasarkan placement: website atau emodul
        $groupedByPlacement = $data->groupBy(function($dataGroup) {
            return str_contains($dataGroup->answer->question->section->form->placement, 'website')
                ? 'website'
                : 'emodul';
        });

        // Kedua, dalam setiap group (website/emodul), group lagi berdasarkan form.id
        return $groupedByPlacement->map(function($placementGroup) {
            return $placementGroup->groupBy('answer.question.section.form.id')->map(function($group) {
                // Ambil nama form dari item pertama
                $formName = optional($group->first()->answer->question->section->form)->form_name;

                // Tambahkan ke collection
                $group->form_name = $formName;

                return $group;
            });
        });
    });  
    $index=0;
@endphp
<h1>Scoring</h1>
    @foreach ($groupedAllResponsesScoring as $emailScoring => $categoryScoring)
        @php
            $index++;
        @endphp
        <br>
        <h1>{{ $emailScoring }}</h1>  
            @foreach ($categoryScoring as $categoryNameScoring => $formIdScoring)
                @php
                    $dataRekap = collect();
                @endphp

                    <h2>{{ $categoryNameScoring }}</h2>

                        @foreach($formIdScoring as $dataFormScoring)
                            @php
                                $groupedResponsesFormScoring = $dataFormScoring->groupBy('answer.question.question');
                                $groupedResponsesForm2 = $groupedResponsesFormScoring->map(function($dataResponsesForm){
                                    return $dataResponsesForm->groupBy('attempt');
                                });

                                $groupedAnswerScoring = $groupedResponsesForm2->keys();
                                $groupedAttemptScoring = $dataFormScoring->pluck('attempt')->unique()->values();                                             
                            @endphp

                            <h4>{{ $dataFormScoring->form_name }}</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Pertanyaan</th>
                                            @foreach($groupedAttemptScoring as $attemptScoring)
                                                <th>{{ $attemptScoring }}</th>
                                            @endforeach
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {{-- @dd($groupedResponsesForm2) --}}
                                        @foreach ($groupedResponsesForm2 as $questionScoring => $responsesDataScoring)
                                            <tr>
                                                <td>{{ $questionScoring }}</td>
                                                @foreach($responsesDataScoring as $attemptScoring => $attemptDataScoring)
                                                    @foreach ($attemptDataScoring as $answerDataScoring) 
                                                        <td>
                                                            <b>{{ $answerDataScoring->answer->answer }}</b>-({{ $answerDataScoring->answer->value }})
                                                        </td>
                                                    @endforeach
                                                @endforeach
                                            </tr>
                                        @endforeach
                                        <tr>
                                            <td><b>Total</b></td>
                                            @foreach($groupedAttemptScoring as $attemptTxtScoring)
                                                @php
                                                    $formName = $dataFormScoring->form_name;

                                                    $current = $dataRekap->get($formName, []);
                                                    $current[$attemptTxtScoring] = $dataFormScoring->where('attempt', $attemptTxtScoring)->sum('answer.value');

                                                    $dataRekap->put($formName, $current);
                                                @endphp
                                                <td>
                                                    <b>{{ $dataFormScoring->where('attempt', $attemptTxtScoring)->sum('answer.value') }}</b>
                                                </td>
                                            @endforeach
                                        </tr>
                                    </tbody>
                                </table>
                        @endforeach
  
                    @php
                        $maxScore = collect($dataRekap)->flatten()->max();
                    @endphp
                    <h2>Akumulasi</h2>
                    <table>
                            @foreach($dataRekap as $formNameRekap => $dataFormRekap)
                            <thead>
                                <tr>
                                    <th>
                                        <b>{{ $formNameRekap }}</b>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($dataFormRekap as $attemptRekap => $dataAttemptRekap)
                                    @php
                                        $valueScoreRekap = round(($dataAttemptRekap / $maxScore )*100);
                                        if($valueScoreRekap == 0){
                                            $valueScoreRekap =6;
                                        }
                                    @endphp
                                    
                                        <tr>
                                            <td>
                                                <p>Percobaan {{ $attemptRekap }}</p>
                                            </td>
                                            <td>
                                                <p>{{ $dataAttemptRekap }}</p>
                                            </td>
                                        </tr>
                    
                                @endforeach
                            </tbody>
                            @endforeach
                    </table>
            @endforeach
    @endforeach