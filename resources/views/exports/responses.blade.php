@php
    $groupedResponses = collect($response)->groupBy('answer.question.question');
    $responsesCollection = collect($response)->flatten();
    // Ambil email yang tidak null
    $uniqueEmails = $responsesCollection->pluck('responden.email')->filter()->unique();
    
    // Ambil semua yang emailnya null dan kelompokkan berdasarkan created_at
    $nullEmailGroups = $responsesCollection
        ->whereNull('responden.email')
        ->groupBy('uuid'); // Gunakan UUID sebagai pengelompokan
    
    // Gabungkan hasilnya (email unik + email null dikelompokkan)
    $emailGroups = $uniqueEmails->merge($nullEmailGroups->keys());
@endphp

<h2>{{ $response[0]->answer->question->section->form->form_name }}</h2>
<table>
    <thead>
        <tr>
            <th>Pertanyaan</th>
            
            @foreach ($emailGroups as $emailOrUuid)
                @php
                    //echo $emailOrUuid;
                    if (!is_string($emailOrUuid) || !filter_var($emailOrUuid, FILTER_VALIDATE_EMAIL)) {
                        // Jika ini adalah UUID, cari `created_at` yang sesuai
                        $timestamp = optional($nullEmailGroups[$emailOrUuid]->first())->created_at;
                        $formattedTime = $timestamp ? $timestamp->format('Y-m-d H:i:s') : 'Unknown';
                        $displayText = "No Email ({$formattedTime})";
                    } else {
                        // Jika ini adalah email, tampilkan langsung
                        $displayText = $emailOrUuid;
                    }
                @endphp
                <th>{{ $displayText }}</th>
            @endforeach
        </tr>
    </thead>
    <tbody>
        @if ($groupedResponses->isEmpty())
            <tr>
                <td>-- Belum ada response --</td>
            </tr>
        @else
            @foreach ($groupedResponses as $question => $responses)
                <tr>
                    <td>{{ $question }}</td>

                    @foreach ($emailGroups as $emailOrCreatedAt)
                        @php
                            if (filter_var($emailOrCreatedAt, FILTER_VALIDATE_EMAIL)) {
                                // Jika ini email, cari responden berdasarkan email
                                $respondenResponse = $responses
                                    ->first(fn($response) => $response->responden && $response->responden->email === $emailOrCreatedAt);
                            } else {
                                // Jika ini created_at dari email null, ambil dari grup created_at
                                $respondenResponse = $nullEmailGroups[$emailOrCreatedAt]
                                    ->firstWhere('answer.question.question', $question);
                            }
                        @endphp

                        <td>{{ $respondenResponse?->answer?->answer ?? '-' }}</td>
                    @endforeach
                </tr>
            @endforeach
        @endif
    </tbody>
</table>