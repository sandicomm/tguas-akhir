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

    <title>Shd</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('shdicon.ico') }}">
        <!-- Scripts -->
         @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/js/interaktifPage.js'])
    <script>

    </script>
    </head>
    @livewireStyles
    <body>
        @include('components.navbar')
        <div class="bg-gray-300" style="margin-top: 60px;">
            {{ $slot }}
        </div>
        <div id="hidden-comment-wrapper" style="display: none;">
            @livewire('interaktif.comment-section')
        </div>
        @livewireScripts
        
    </body>
</html>
