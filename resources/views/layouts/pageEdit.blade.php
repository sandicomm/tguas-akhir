<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <meta name="description" content="Admin Smart Health Diabetes untuk kelola konten edukasi Smart Health Diabetes.">
        <meta name="keywords" content="smart diabetes, admin smart health diabetes, smart health diabetes">
        <meta name="robots" content="index, follow">
        
        <!-- Open Graph -->
        <meta property="og:title" content="Admin Smart Health Diabetes">
        <meta property="og:description" content="Website Admin Kelola Kontent Smart Health diabetes">
        <meta property="og:url" content="https://shd-admin.smartdiabetes.my.id/">
        <meta property="og:type" content="website">

        <title>{{ $title ?? config('app.name') }}</title>

        <!-- Fonts -->
         <link rel="icon" type="image/x-icon" href="{{ asset('shdicon.ico') }}">
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/js/editPage.js'])
        <!-- <link rel="stylesheet" href="{{ asset('build/assets/app.css') }}">
        <script type="module" src="{{ asset('build/assets/app.js') }}"></script> -->
        @livewireStyles
    </head>
    <body class="font-sans antialiased">
        <div class="min-h-screen bg-gray-100">
            @include('layouts.navigation.editPageMenu')
            <!-- Page Content -->
            <!-- <div id="loading-overlay" style="display: none; justify-content:center; align-items:center;position: fixed; top:0; left:0; width:100%; height:100%; background-color: rgba(255,255,255,0.7); z-index:9999; text-align: center;">
                <h2>⏳ Menyimpan data...</h2>
            </div> -->
            <div class="hidden" id='loading-overlay'>
                <x-loading />
            </div>
            <main>
                {{ $slot }}
            </main>
        </div>
        @livewireScripts
        <script src="https://cdnjs.cloudflare.com/ajax/libs/compressorjs/1.2.1/compressor.min.js"></script>
    </body>
</html>
