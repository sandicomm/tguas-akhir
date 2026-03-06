<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Link Validasi</title>
</head>
<body>
    <h2>Halo 👋</h2>

    <p>Silakan klik tombol di bawah ini untuk validasi email.</p>

    <p>
        <a href="{{ route('form-test.verify', ['token' => $token, 'placement' => $placement]) }}"
           style="display:inline-block;padding:10px 16px;background:#16a34a;color:#fff;text-decoration:none;border-radius:6px;">
            Mulai {{ $placement }}
        </a>
    </p>

    <p><small>Link ini berlaku selama 30 menit.</small></p>
</body>
</html>
