<div>
    <div class="p-4 sm:ml-64" x-data="{ open: @entangle('isModalOpen') }">
    <x-loading wire:loading.flex />
        <div class="hidden" id='jsLoader'>
            <x-loading />
        </div>
        <script>
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                document.getElementById('jsLoader').classList.add('hidden');
            },2750)
        </script>
        <div>
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

            <div class="flex items-center justify-center flex-col gap-3 rounded p-4">
                <div class="relative overflow-x-auto sm:rounded-lg w-full dark:bg-gray-800 bg-white shadow-md">
                    <h1 class="text-3xl font-bold bg-cyan-600 rounded p-3 mb-1 text-center text-white">Data Responden</h1>
                    
                    @if ($responden)
                        <div class="rounded my-2 mx-3 p-1 text-center overflow-y-auto h-[50vh] flex flex-col justify-start items-start">
                            <table class="w-full text-sm text-left rtl:text-right bg-white dark:bg-slate-600 dark:text-white text-black shadow-md rounded overflow-hidden border-2 mb-2">
                                <thead class="text-black uppercase bg-slate-300">
                                    <tr class="text-center">
                                        <th class="p-2">No</th>
                                        <th class="p-2">Email</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @if ($responden->isEmpty())
                                        <tr>
                                            <td class="p-3 text-center text-gray-500" colspan="3">-- Belum ada responden --</td>
                                        </tr>
                                    @else
                                        @foreach ($responden as $index => $data)
                                            <tr class="text-center border-b-2 dark:text-slate-200 text-black dark:border-slate-400 border-slate-300">
                                                <td class="p-3">{{ $loop->iteration }}</td>
                                                <td class="p-3">{{ $data['email'] }}</td>
                                                <td class="p-3 flex justify-center items-center gap-3 w-auto">
                                                    <button wire:click="setStatsAction({{ $data['id'] }}, 'delete')" class="block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-blue-800">Delete</button>
                                                </td>
                                            </tr>
                                        @endforeach
                                    @endif
                                    
                                </tbody>
                            </table>
                        </div>

                        <!-- MODAL -->
                        <div x-show="open" x-transition x-cloak class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
                            <div class="bg-white dark:bg-slate-800 rounded-lg p-3 lg:w-1/3 w-[70%] text-black dark:text-white">
                                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-600 dark:border-gray-200">
                                    <h3 class="text-xl font-bold mb-4">Hapus Responden</h3>
                                    <button type="button" @click="open = false" class="text-gray-400 bg-transparent dark:hover:bg-gray-200 dark:hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white">
                                        <svg class="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                        </svg>
                                        <span class="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <form wire:submit.prevent="delete">
                                    @csrf
                                    <div class="p-4 md:p-5 space-y-2">
                                        <p>Jika anda yakin ingin <span class="font-bold">MENGHAPUS</span> data ini, Ketik <span class="font-bold">"Hapus Responden"</span> Di field dibawah</p>
                                        <input type="text" wire:model="confirmDelete" 
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                    focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 
                                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        @if(session()->has('error'))
                                            <p class="text-red-500 text-sm m-0">{{ session('error') }}</p>
                                        @endif
                                    </div>
                                    <!-- Modal footer -->
                                    <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                        <button type="submit" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Hapus</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    @else
                        <div class="bg-white rounded my-2 text-center overflow-hidden w-full">
                            -- No data --
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
