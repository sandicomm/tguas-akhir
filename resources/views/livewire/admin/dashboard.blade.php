<div class="sm:ml-64 pt-4">
    <div wire:loading class="hidden" id='jsLoader'>
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
        <!-- ----------------------------- TOTAL RESPONDEN -------------------------------------- -->
        <div class="px-4 h-fit">
            
            <livewire:dashboard.total-responded wire:key="total-responded-unique-key"/>
        </div>

        <!-- ----------------------------- SCORING PERSONAL ------------------------------------- -->
        <div class="px-4 h-fit">
            <livewire:dashboard.scoring-personal wire:key="scoring-personal-unique-key"/>
        </div>
        
        <!-- ----------------------------- REKAP JAWABAN FORM ---------------------------------- -->
        <div class="flex items-center justify-center flex-col gap-3 rounded dark:bg-slate-700 bg-slate-300 py-10 p-4">
            <livewire:dashboard.rekap-scoring wire:key="rekap-scoring-unique-key"/>
        </div>
    </div>
</div>