<h3>{{ $form->form_name }}</h3>
<h3>Responses - Attempt {{ $attempt }}</h3>

@php
    $emails = $data->pluck('responden.email')->unique()->values();

    $questions = $data
        ->pluck('answer.question')
        ->unique('id')
        ->sortBy('order')
        ->values();
@endphp

<table border="1">
    <tr>
        <th>Pertanyaan</th>
        @foreach ($emails as $email)
            <th>{{ $email }}</th>
        @endforeach
    </tr>

    @foreach ($questions as $question)
        @php
            $responsesByQuestion = $data->filter(
                fn($r) => $r->answer->question->id == $question->id
            );
        @endphp

        <tr>
            <td>{{ $question->question }}</td>

            @foreach ($emails as $email)
                @php
                    $r = $responsesByQuestion->first(
                        fn($x) => $x->responden->email == $email
                    );
                @endphp

                <td>
                    @if ($r)
                        {{ $r->answer->answer }}
                    @endif
                </td>
            @endforeach
        </tr>
    @endforeach
</table>
