<table>
    <thead>
        <tr>
            <th colspan="{{ count($uniqueAnswers) + 1 }}" style="font-weight: bold; font-size: 16px; text-align: center;">
                REKAP JAWABAN
            </th>
        </tr>
        <tr>
            <th colspan="{{ count($uniqueAnswers) + 1 }}" style="font-weight: bold; text-align: center;">
                Form: {{ $form->form_name }} ({{ $form->placement }})
            </th>
        </tr>
        <tr></tr> <tr>
            <th style="background-color: #f0efed; font-weight: bold; width: 450px; border: 1px solid #000000; text-align: center; vertical-align: middle;">
                PERTANYAAN
            </th>
            @foreach ($uniqueAnswers as $ua)
                <th style="background-color: #e8e7e6; font-weight: bold; width: 100px; border: 1px solid #000000; text-align: center;">
                    {{ $ua->answer }}<br>
                    <small style="font-size: 9px;">VAL: {{ $ua->value }}</small>
                </th>
            @endforeach
        </tr>
    </thead>
    <tbody>
        @foreach ($rows as $row)
            <tr>
                <td style="border: 1px solid #000000; word-wrap: break-word; vertical-align: middle;">
                    {{ $row['question'] }}
                </td>
                @foreach ($uniqueAnswers as $ua)
                    @php $val = $row['counts'][$ua->answer]; @endphp
                    <td style="border: 1px solid #000000; text-align: center; vertical-align: middle;">
                        {{ $val }}
                    </td>
                @endforeach
            </tr>
        @endforeach
    </tbody>
</table>