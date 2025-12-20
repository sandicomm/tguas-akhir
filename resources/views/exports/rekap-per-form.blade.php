<h3>{{ $form->form_name }} - {{ $form->placement }}</h3>

<table border="1">
    <tr>
        <th>Pertanyaan</th>
        @foreach ($UniqueAnswer as $val)
            <th>{{ $val }}</th>
        @endforeach
    </tr>

    @foreach ($rows as $row)
        <tr>
            <td>{{ $row['question'] }}</td>

            @foreach ($UniqueAnswer as $val)
                <td>{{ $row['counts'][$val] ?? 0 }}</td>
            @endforeach
        </tr>
    @endforeach
</table>
