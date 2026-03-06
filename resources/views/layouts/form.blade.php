<!DOCTYPE html>
<html lang="en">
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

        <title>{{ config('app.name', 'Laravel') }}</title>
        <link rel="icon" type="image/x-icon" href="{{ asset('shdicon.ico') }}">
        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        <!-- <link rel="stylesheet" href="{{ asset('build/assets/app.css') }}"> -->
        <!-- <script type="module" src="{{ asset('build/assets/app.js') }}"></script> -->
    </head>
 @livewireStyles
<body class="bg-gradient-to-t from-indigo-300 to-indigo-500 min-h-[100dvh] w-full">
  
    @if(session('success'))
        <div class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50">
            <div class="flex items-center justify-between gap-4">
                <span>{{ session('success') }}</span>
                <button type="button" class="text-green-700 hover:text-green-900" onclick="this.parentElement.parentElement.remove()">
                    &times;
                </button>
            </div>
        </div>
    @endif

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
    <div class="w-full h-full flex justify-center items-start py-5">
        <section class="p-4 rounded flex justify-center items-center flex-col gap-2 w-full md:w-1/2">
            {{ $slot }}
        </section>
    </div>
  
    @livewireScripts
</body>
</html>