<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ $title ?? config('app.name') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        @livewireStyles
    </head>
    <body class="font-sans antialiased">
        <div class="min-h-screen bg-gray-100">
            @include('layouts.editPageMenu')
            <!-- Page Content -->
            <div id="loading-overlay" style="display: none; justify-content:center; align-items:center;position: fixed; top:0; left:0; width:100%; height:100%; background-color: rgba(255,255,255,0.7); z-index:9999; text-align: center;">
                <h2>⏳ Menyimpan data...</h2>
            </div>
            <main>
                {{ $slot }}
            </main>
        </div>
        @livewireScripts
    </body>
</html>
