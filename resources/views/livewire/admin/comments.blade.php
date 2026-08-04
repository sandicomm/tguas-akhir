<div class="sm:ml-64 p-4" x-data="{ openModal: @entangle('isModalOpen') }">
    <div class="w-full flex items-center justify-center flex-col gap-3 rounded  dark:bg-gray-600 py-10 px-4">
        <div class="relative overflow-hidden sm:rounded-lg w-full shadow-md dark:bg-slate-800 bg-white">
            <div wire:loading class="hidden" id='jsLoader'>
                <x-loading />
            </div>
            <h1 class="text-3xl font-bold bg-cyan-600 rounded p-3 text-center text-white mb-4">Comments</h1>

            {{-- FORM UTAMA (Hanya muncul jika tidak sedang Reply/Edit) --}}
            @if(!$editingId)
                <div class="w-full flex justify-center mb-8 mx-3">
                    <div class="bg-blue-50 dark:bg-slate-700 p-6 rounded-lg w-full lg:w-3/4 shadow-sm border border-blue-100 dark:border-slate-600">
                        <label class="block mb-2 text-sm font-medium dark:text-gray-300">Tulis Komentar Baru sebagai Admin:</label>
                        <textarea wire:model="comment" rows="3"
                            class="bg-white border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-600 dark:text-white" 
                            placeholder="Komentar utama..."></textarea>
                        <button wire:click="store" class="mt-3 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 w-full">
                            Kirim Komentar
                        </button>
                    </div>
                </div>
            @else
                <div class="mb-6 mx-3 text-center p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                    Mode <strong>{{ strtoupper($state) }}</strong> Aktif. 
                    <button wire:click="cancelAction" class="ml-2 font-bold underline">Batalkan</button>
                </div>
            @endif

            <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-slate-700">

            {{-- LIST KOMENTAR --}}
            <div class="space-y-4 mx-3 mb-3">
                @foreach ($comments as $comment)
                    <div class="group">
                        {{-- TAMPILAN PARENT --}}
                        <div class="p-4 rounded-lg border {{ $comment->is_admin ? 'bg-blue-100 border-blue-200 dark:bg-indigo-900/40 dark:border-indigo-800' : 'bg-white border-gray-200 dark:bg-slate-700 dark:border-slate-600' }}">
                            <div class="flex justify-between items-start">
                                <div>
                                    <span class="font-bold dark:text-white">{{ $comment->name }}</span>
                                    @if ($comment->is_admin)
                                        <span class="ml-2 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded uppercase">Admin</span>
                                    @endif
                                    <p class="text-gray-700 dark:text-gray-300 mt-1">{{ $comment->comment }}</p>
                                </div>
                            </div>

                            {{-- ACTION BUTTONS --}}
                            <div class="mt-3 flex gap-4 text-sm font-medium">
                                <button wire:click="setReply({{ $comment->id }})" class="text-blue-600 hover:underline bg-white p-1 rounded">Reply</button>
                                
                                @if($comment->is_admin)
                                    <button wire:click="setEdit({{ $comment->id }})" class="text-violet-600 hover:underline bg-white p-1 rounded">Edit</button>
                                @endif

                                <button wire:click="setStatsAction({{ $comment->id }}, 'delete')" class="text-red-500 hover:underline bg-white p-1 rounded">Delete</button>
                            </div>

                            {{-- FORM INLINE ( REPLY / EDIT ) --}}
                            @if($editingId == $comment->id)
                                <div class="mt-4 p-4 bg-slate-50 dark:bg-slate-800 border rounded-lg animate-pulse-short">
                                    <h4 class="text-xs font-bold mb-2 uppercase text-gray-500">{{ $state == 'edit' ? 'Edit Komentar Anda' : 'Balas Komentar' }}</h4>
                                    <textarea wire:model="comment" class="w-full text-sm border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white"></textarea>
                                    <div class="mt-2 flex gap-2">
                                        <button wire:click="{{ $state == 'edit' ? 'update' : 'store' }}" class="bg-green-600 text-white px-3 py-1.5 rounded text-xs">Simpan</button>
                                        <button wire:click="cancelAction" class="bg-gray-400 text-white px-3 py-1.5 rounded text-xs">Batal</button>
                                    </div>
                                </div>
                            @endif
                        </div>

                        {{-- REPLY --}}
                        <div class="ml-8 mt-2 space-y-2 border-l-2 border-gray-100 dark:border-slate-700 pl-4">
                            @foreach ($comment->flat_replies as $reply)
                                <div class="p-3 rounded-lg border {{ $reply->is_admin ? 'bg-blue-50 border-blue-100 dark:bg-indigo-900/20' : 'bg-white border-gray-100 dark:bg-slate-700/50' }}">
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <span class="font-bold text-sm dark:text-white">{{ $reply->name }}</span>
                                        @if($reply->is_admin) <span class="text-[9px] bg-blue-500 text-white px-1 rounded">Admin</span> @endif
                                        
                                        @if($reply->parent_id != $comment->id)
                                            <span class="text-gray-400 text-xs">▸ balas <b>{{ $reply->parent->name ?? 'User' }}</b></span>
                                        @endif
                                    </div>
                                    <p class="text-sm text-gray-600 dark:text-gray-300">{{ $reply->comment }}</p>
                                    
                                    {{-- ACTION REPLIES --}}
                                    <div class="mt-2 flex gap-3 text-[12px]">
                                        <button wire:click="setReply({{ $reply->id }})" class="text-blue-500 bg-slate-200 p-1 rounded">Reply</button>
                                        @if($reply->is_admin)
                                            <button wire:click="setEdit({{ $reply->id }})" class="text-violet-500 bg-slate-200 p-1 rounded">Edit</button>
                                        @endif
                                        <button wire:click="setStatsAction({{ $reply->id }}, 'delete')" class="text-red-400 bg-slate-200 p-1 rounded">Delete</button>
                                    </div>

                                    {{-- FORM INLINE UNTUK REPLIES --}}
                                    @if($editingId == $reply->id)
                                        <div class="mt-3 p-3 bg-white dark:bg-slate-800 border rounded shadow-inner">
                                            <textarea wire:model="comment" class="w-full text-sm rounded dark:bg-slate-700 dark:text-white"></textarea>
                                            <div class="mt-2 flex gap-2">
                                                <button wire:click="{{ $state == 'edit' ? 'update' : 'store' }}" class="bg-green-600 text-white px-2 py-1 rounded text-[11px]">Simpan</button>
                                                <button wire:click="cancelAction" class="bg-gray-400 text-white px-2 py-1 rounded text-[11px]">Batal</button>
                                            </div>
                                        </div>
                                    @endif
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>

    <div x-show="openModal" x-cloak class="fixed inset-0 bg-black/50 flex justify-center items-center z-[999]">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl border dark:border-slate-700">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Hapus Komentar?</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Tindakan ini tidak dapat dibatalkan. Komentar akan dihapus secara permanen.</p>
            <div class="flex justify-end gap-3">
                <button @click="openModal = false" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300">Batal</button>
                <button wire:click="delete({{ $commentId ?? 0 }})" class="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">Ya, Hapus</button>
            </div>
        </div>
    </div>
</div>

<script>
    document.getElementById('jsLoader')?.classList.remove('hidden');
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            requestAnimationFrame(() => {
                document.getElementById('jsLoader')?.classList.add('hidden');
            });
        }, 1000);
    });
</script>
