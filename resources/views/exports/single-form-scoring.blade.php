<h3>Scoring Personal - Form: {{ $responses->first()->answer->question->section->form->form_name ?? '' }}</h3>

<table border="1">
    <tr>
        <th>Pertanyaan</th>
        <th>Attempt</th>
        <th>Jawaban</th>
        <th>Value</th>
    </tr>   
    @php
        $total=0
    @endphp

    @foreach($responses as $row)
        <tr>
            <td>{{ $row->answer->question->question }}</td>
            <td>{{ $row->attempt }}</td>
            <td>{{ $row->answer->answer }}</td>
            <td>{{ $row->answer->value }}</td>
        </tr>
        @php
            $total += $row->answer->value
        @endphp
    @endforeach
    <tr>
        <td colspan="3">Total</td>
        <td>{{ $total }}</td>
    </tr>
</table>
