<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="description" content="Smart Health Diabetes untuk edukasi dan pembelajaran Diabetes Melitus secara online.">
    <meta name="keywords" content="smart diabetes, smart health diabetes, kesehatan">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Smart Health Diabetes">
    <meta property="og:description" content="Platform pembelajaran diabetes online.">
    <meta property="og:url" content="https://smartdiabetes.my.id/">
    <meta property="og:type" content="website">
    
    <title>{{ $title ?? 'Prolog' }}</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('shdicon.ico') }}">

    @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/js/interaktifPage.js'])
    @livewireStyles
</head>
<body class="relative">
    {{ $slot }}
    @livewireScripts
</body>
</html>