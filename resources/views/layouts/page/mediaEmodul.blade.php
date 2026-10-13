<!DOCTYPE html>
<html lang="id">
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
    
    <title>E-Modul Diabetes</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('shdicon.ico') }}">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.7.107/pdf.min.js"></script>
    @vite(['resources/css/app.css'])
</head>
@livewireStyles
<body style="max-height:100dvh;background-color:#2a3f4a;">
    <x-loading wire:loading/>

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
    
    <div class="">
        {{ $slot }}
    </div>
   @livewireStyles
</body>
</html>