<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
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
        <link rel="icon" type="image/x-icon" href="{{ asset('shdicon.ico') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        <!-- <link rel="stylesheet" href="{{ asset('build/assets/app.css') }}">
        <script type="module" src="{{ asset('build/assets/app.js') }}"></script> -->
        @livewireStyles
    </head>
    <body class="font-sans antialiased">
        <div class="min-h-screen bg-gray-100">
            @include('layouts.navigation')
            
            <header class="dark:bg-white bg-slate-700 shadow-md p-3 sm:ml-64">
                <div class="flex justify-between">
                    <div class="max-w-7xl sm:px-6 lg:px-8">
                        <h1 class="font-extrabold text-xl dark:text-black text-white">Admin Smart Health Diabetes</h1>
                    </div>
                </div>
            </header>

            <!-- Page Content -->
            <main class="bg-gray-500 dark:bg-slate-100" style="min-height: 100dvh;">
                {{ $slot }}
            </main>
        </div>
        <script>
            (function initTheme() {
                const txtMode = document.getElementById('txt-mode')
                const savedTheme = localStorage.getItem('theme');

                if (savedTheme === 'dark') {
                    document.documentElement.classList.remove('dark');
                    txtMode.textContent = 'Dark'
                    txtMode.classList.add('text-white')
                } else {
                    document.documentElement.classList.add('dark');
                    txtMode.textContent = 'Light'
                    txtMode.classList.add('text-white')
                }
            })();

            function toggleTheme() {
                const root = document.documentElement;
                const txtMode = document.getElementById('txt-mode')

                if (root.classList.contains('dark')) {
                    root.classList.remove('dark');
                    localStorage.setItem('theme', 'dark');

                    txtMode.textContent = 'Dark'
                    txtMode.classList.add('text-white')
                } else {
                    root.classList.add('dark');
                    localStorage.setItem('theme', 'light');

                    txtMode.textContent = 'Light'
                }
            }

        </script>
        @livewireScripts
        <script src="https://cdnjs.cloudflare.com/ajax/libs/compressorjs/1.2.1/compressor.min.js"></script>
    </body>
</html>
