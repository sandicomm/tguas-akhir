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