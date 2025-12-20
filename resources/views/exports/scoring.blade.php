<h2>{{ $email }}</h2>
<br>

@foreach($forms as $formId => $rows)

    @php
        $formName = optional($rows->first()->answer->question->section->form)->form_name;
        $groupedByAttempt = $rows->groupBy('attempt');
    @endphp

    <h3>{{ $formName }}</h3>

    @foreach($groupedByAttempt as $attempt => $attemptRows)

        <h4>Attempt {{ $attempt }}</h4>

        <table border="1" style="margin-bottom:25px">
            <tr>
                <th>Pertanyaan</th>
                <th>Jawaban (Value)</th>
            </tr>

            @php $total = 0; @endphp

            @foreach($attemptRows as $resp)
                <tr>
                    <td>{{ $resp->answer->question->question }}</td>
                    <td>
                        {{ $resp->answer->answer }} ({{ $resp->answer->value }})
                    </td>
                </tr>
                @php $total += $resp->answer->value; @endphp
            @endforeach

            <tr>
                <td><strong>Total</strong></td>
                <td><strong>{{ $total }}</strong></td>
            </tr>
        </table>

    @endforeach

@endforeach
