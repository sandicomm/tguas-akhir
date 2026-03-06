<table>
    <thead>
        <tr>
            <th colspan="2" style="font-weight: bold; font-size: 16px;">LAPORAN DATA RESPONSE</th>
        </tr>
        <tr>
            <th colspan="2" style="font-weight: bold;">Form: {{ $formName }}</th>
        </tr>
    </thead>
</table>

<table border="1">
    <thead>
        <tr>
            <th style="background-color: #cccbca; font-weight: bold; width: 300px; text-align: center; vertical-align: middle;">
                PERTANYAAN
            </th>
            
            @foreach ($columns as $col)
                <th style="background-color:#cccbca; font-weight: bold; width: 200px; text-align: center;">
                    {{ $col['email'] != '' ?  strtoupper($col['email']) : 'No Email' }}<br>
                    (ATTEMPT {{ $col['attempt'] }})
                </th>
            @endforeach
        </tr>
    </thead>
    <tbody>
        @foreach ($questions as $question)
            <tr>
                <td style="font-weight: 500;">
                    {{ $question->question }}
                </td>

                @foreach ($columns as $col)
                    @php
                        $rowResponses = $cellMatrix[$question->id] ?? []; 
                        $cellResponses = $rowResponses[$col['key']] ?? collect();
                    @endphp

                    <td style="text-align: center; vertical-align: middle;">
                        @forelse ($cellResponses as $r)  
                            {{ $r->answer, 20 }}
                        @empty
                            <span style="color: #d1d5db;">-</span>
                        @endforelse
                    </td>
                @endforeach
            </tr>
        @endforeach
    </tbody>
</table>