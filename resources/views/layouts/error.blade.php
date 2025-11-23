<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Error - {{ config('app.name') }}</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('shdicon.ico') }}">
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- <link rel="stylesheet" href="{{ asset('build/assets/app.css') }}">
        <script type="module" src="{{ asset('build/assets/app.js') }}"></script> -->
</head>
<body class="bg-gray-100">
    {{ $slot }}
</body>
</html>