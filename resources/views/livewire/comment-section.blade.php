<div class="max-w-4xl mx-auto my-8 px-4">
    <div class="bg-blue-200/80 border border-gray-200 rounded-xl p-6 shadow-md">
        <h2 class="text-2xl font-bold text-center mb-6 text-gray-900">Comments Section</h2>
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
        {{-- 
            FORM UTAMA (LEVEL 0) 
            Hanya muncul jika TIDAK sedang mereply komentar manapun ($parent_id == null)
        --}}
        @if(!$parent_id)
            <div class="w-full flex justify-center mb-8 transition-all duration-300 ease-in-out">
                <form wire:submit.prevent="store" class="bg-blue-50 p-6 rounded-lg w-full lg:w-3/4 shadow-sm border border-blue-100">
                    <div class="mb-4">
                        <input type="text" wire:model="name" 
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                            placeholder="Nama atau Email" required>
                    </div>
                    <div class="mb-4">
                        <textarea wire:model="comment" rows="3"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                            placeholder="Tulis komentar baru..." required></textarea>
                    </div>
                    <button type="submit" wire:loading.attr="disabled"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full">
                        Kirim Komentar
                    </button>
                </form>
            </div>
        @else
            {{-- Info Bar ketika sedang mereply (Optional UX Improvement) --}}
            <div class="mb-6 text-center p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                Mode Balasan Aktif. Silakan isi form di bawah komentar yang Anda pilih.
                <button wire:click="cancelReply" class="ml-2 font-bold underline hover:text-yellow-600">Batalkan</button>
            </div>
        @endif

        <hr class="h-px my-8 bg-gray-200 border-0">

        <div id="comment-section" class="space-y-4">
            
            {{-- Loop Parent (Komentar Utama) --}}
            @foreach ($comments->where('parent_id', null) as $index => $comment)
                
                {{-- LOGIKA SEMBUNYIKAN KOMENTAR KE-3 DST --}}
                <div class="{{ $index >= 2 && !$showAllComments ? 'hidden' : '' }}">
                    
                    {{-- TAMPILAN PARENT COMMENT --}}
                    <div class="p-3 rounded-lg {{ $comment->is_admin ? 'bg-blue-100 border border-blue-50' : 'bg-white' }}">
                        <div class="flex items-center mb-2">
                            <span class="font-bold text-gray-900">{{ $comment->name }}</span>
                            @if ($comment->is_admin)
                                <span class="bg-blue-100 text-blue-800 text-xs font-medium ml-2 px-2.5 py-0.5 rounded">Admin</span>
                            @endif
                        </div>
                        <p class="text-gray-600 mb-2">{{ $comment->comment }}</p>
                    
                        {{-- Tombol Reply Parent --}}
                        <button class="text-sm text-blue-600 hover:underline font-medium" 
                            wire:click="setReply({{ $comment->id }})" 
                            wire:loading.attr="disabled">
                            Reply
                        </button>

                        {{-- 
                             FORM REPLY (PARENT)
                             Hanya muncul jika $parent_id sama dengan ID komentar ini 
                        --}}
                        @if($parent_id == $comment->id)
                            <div class="mt-4 p-4 rounded-lg border border-blue-200 bg-blue-50 animate-fade-in-down">
                                <div class="text-xs text-gray-500 mb-2">Membalas: <b>{{ $comment->name }}</b></div>
                                <form wire:submit.prevent="store">
                                    <input type="text" wire:model="name" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mb-2" placeholder="Nama..." required>
                                    <textarea wire:model="comment" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mb-2" placeholder="Tulis balasan..." required></textarea>
                                    <div class="flex gap-2">
                                        <button type="submit" wire:loading.attr="disabled" class="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-xs px-4 py-2">Kirim</button>
                                        <button type="button" wire:click="cancelReply" class="text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-xs px-4 py-2">Batal</button>
                                    </div>
                                </form>
                            </div>
                        @endif
                    </div>

                    {{-- Balasan (Flat Replies - Level 2) --}}
                    <div class="ml-6 mt-4 space-y-4 border-l-2 border-gray-100 pl-4">
                        
                        @foreach ($comment->flat_replies as $replyIndex => $reply)
                            <div class="p-3 bg-white rounded-lg">
                                <div class="flex items-center flex-wrap gap-1">
                                    <span class="font-bold {{ $reply->is_admin ? 'text-blue-700' : 'text-gray-900' }}">
                                        {{ $reply->name }}
                                    </span>
                                    @if ($reply->is_admin)
                                        <span class="text-[10px] uppercase px-1 bg-blue-100 rounded text-blue-800">Admin</span>
                                    @endif

                                    {{-- Logic "Balas ke siapa" --}}
                                    @if($reply->parent_id != $comment->id)
                                        <span class="text-gray-400 text-sm">▸</span> 
                                        <span class="text-gray-500 text-sm">
                                            balas <span class="font-semibold text-gray-700">{{ $reply->parent->name ?? 'User' }}</span>
                                        </span>
                                    @endif
                                </div>

                                <p class="text-sm text-gray-600 mt-1">{{ $reply->comment }}</p>

                                {{-- Tombol Reply Anak --}}
                                <button class="text-xs text-gray-500 hover:text-blue-600 mt-1 font-medium" 
                                    wire:click="setReply({{ $reply->id }})">
                                    Reply
                                </button>

                                {{-- 
                                     FORM REPLY (ANAK/CUCU)
                                     Hanya muncul jika $parent_id sama dengan ID reply ini 
                                --}}
                                @if($parent_id == $reply->id)
                                    <div class="mt-3 p-3 rounded-lg border border-blue-200 bg-blue-50">
                                        <div class="text-xs text-gray-500 mb-2">Membalas: <b>{{ $reply->name }}</b></div>
                                        <form wire:submit.prevent="store">
                                            <input type="text" wire:model="name" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 mb-2" placeholder="Nama..." required>
                                            <textarea wire:model="comment" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 mb-2" placeholder="Tulis balasan..." required></textarea>
                                            <div class="flex gap-2">
                                                <button type="submit" wire:loading.attr="disabled" class="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-xs px-3 py-1.5">Kirim</button>
                                                <button type="button" wire:click="cancelReply" class="text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-xs px-3 py-1.5">Batal</button>
                                            </div>
                                        </form>
                                    </div>
                                @endif
                            </div>
                        @endforeach
                    </div>

                </div> {{-- End Hidden Logic Wrapper --}}
            @endforeach
        </div>

        {{-- Tombol Show All --}}
        @if ($comments->where('parent_id', null)->count() > 2)
            <div class="text-center mt-8 border-t border-gray-200 pt-6">
                <button wire:click="toogleShowAllComment()" 
                    class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-full group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200">
                    <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-full group-hover:bg-opacity-0">
                        {{ $showAllComments ? 'Sembunyikan Komentar' : 'Tampilkan Semua Komentar' }}
                    </span>
                </button>
            </div>
        @endif
    </div>
</div>