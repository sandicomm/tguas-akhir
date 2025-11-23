<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

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
    <body class="font-sans text-gray-900 antialiased">
        <div class="login-page min-h-screen flex flex-col sm:justify-center items-center lg:pt-6 pt-28 sm:pt-0">
            <div>
                <a href="/">
                    <x-application-logo/>
                </a>
            </div>

            <div class="w-full sm:max-w-md mt-6 px-6 py-4 bg-white bg-opacity-90 shadow-md overflow-hidden sm:rounded-lg">
                {{ $slot }}
            </div>
        </div>
    </body>
</html>
