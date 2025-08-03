<x-error-layout>
    <div class="flex flex-col items-center justify-center h-[100vh] bg-sky-950 text-center">
        <h1 class="font-bold text-7xl text-red-500">500</h1>
        <p class="text-xl mt-4 text-white">Maaf sepertinya ada kesalahan di server.</p>
        <a href="{{ route('dashboard') }}" class="mt-4 border-2 focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700">Kembali ke Beranda</a>
    </div>
</x-error-layout>