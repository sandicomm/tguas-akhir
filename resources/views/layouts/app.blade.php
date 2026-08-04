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
        <meta property="og:url" content="https://smartdiabetes.my.id/">
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
            <livewire:admin.navigation.navigation />
            
            @if(session('success'))
                <div class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50">
                    <div class="flex items-center justify-between gap-4">
                        <span>{{ session('success') }}</span>
                        <button type="button" class="text-green-700 hover:text-green-900" onclick="this.parentElement.parentElement.remove();">
                            &times;
                        </button>
                    </div>
                </div>
            @endif

            <div x-data="{ show: false, message: '' }" 
                x-on:success-alert.window="show = true; message = $event.detail.message; setTimeout(() => show = false, 4000)"
                x-show="show"
                x-cloak
                class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50">
                <span x-text="message"></span>
            </div>

            <div x-data="{ show: false, message: '' }" 
                x-on:error-alert.window="show = true; message = $event.detail.message; setTimeout(() => show = false, 4000)"
                x-show="show"
                x-cloak
                class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50">
                <span x-text="message"></span>
            </div>

            @if (session('error'))
                <div class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50">
                    <div class="flex items-center justify-between gap-4">
                        <span>{{ session('error') }}</span>
                        <button type="button" class="text-red-700 hover:text-red-900" onclick="this.parentElement.parentElement.remove()">
                            &times;
                        </button>
                    </div>
                </div>
            @endif

            <header class="bg-white dark:bg-slate-700 shadow-md p-3 sm:ml-64">
                <div class="flex justify-between">
                    <div class="max-w-7xl sm:px-6 lg:px-8">
                        <h1 class="font-extrabold text-xl text-black dark:text-white">Admin Smart Health Diabetes</h1>
                    </div>
                </div>
            </header>

            <!-- Page Content -->
            <main class="dark:bg-gray-600 bg-slate-100" style="min-height: 100dvh;">
                {{ $slot }}
            </main>
        </div>
        <script>
            (function initTheme() {
                const txtMode = document.getElementById('txt-mode')
                const savedTheme = localStorage.getItem('theme');

                if (savedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                    txtMode.textContent = 'Dark'
                    txtMode.classList.add('text-white')
                } else {
                    document.documentElement.classList.remove('dark');
                    txtMode.textContent = 'Light'
                    txtMode.classList.add('text-white')
                }
            })();

            function toggleTheme() {
                const root = document.documentElement;
                const txtMode = document.getElementById('txt-mode')

                if (root.classList.contains('dark')) {
                    root.classList.remove('dark');
                    localStorage.setItem('theme', 'light');

                    txtMode.textContent = 'Light'
                    txtMode.classList.add('text-white')
                } else {
                    root.classList.add('dark');
                    localStorage.setItem('theme', 'dark');

                    txtMode.textContent = 'Dark'
                }
            }

        </script>
        @livewireScripts
        <script src="https://cdnjs.cloudflare.com/ajax/libs/compressorjs/1.2.1/compressor.min.js"></script>
    </body>
</html>
