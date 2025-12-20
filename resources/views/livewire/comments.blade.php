<div class="sm:ml-64">
    <div class="comments-section dark:bg-slate-100 bg-slate-600 rounded p-4 shadow-md">
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
        <h2 class="text-center mb-4 text-2xl font-bold dark:text-black text-white">Comments Section</h2>
        
        <div class="w-100 flex justify-center">
            <div class="bg-slate-700 dark:bg-blue-300 p-4 rounded-md w-1/2 shadow-sm mb-3">
                <div class="mb-5">
                    <textarea wire:model="comment" 
                            class="dark:bg-gray-50 border border-gray-300 dark:text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                focus:border-blue-500 block w-full p-2.5 bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 
                                text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 

                            placeholder="Tulis komentar..." required></textarea>
                </div>
                <button type="submit" wire:click="store('new')" class="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Kirim Komentar</button>
            </div>
        </div>

        <hr>
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
        @foreach ($comments->where('parent_id', null) as $comment)
            <div class="p-6 border rounded-lg shadow-md dark:bg-transparent border-gray-400 mt-2">
                <div class="p-4 border border-slate-300 rounded-lg dark:border-gray-700 {{ $comment->is_admin ? 'bg-indigo-900 dark:bg-blue-200' : 'dark:bg-white bg-slate-600' }}">
                    <strong class="text-white dark:text-black">{{ $comment->name }}
                        @if ($comment->is_admin)
                            <span class="dark:text-blue-600 text-blue-400">(admin)</span>
                        @endif
                    </strong>
                    <p class="text-white dark:text-black">{{ $comment->comment }}</p>

                    <button class="reply-btn text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-3.5 py-1.5 text-center me-2 mb-2 mt-4" wire:click="edit({{ $comment->id }}, 'reply')">             
                        Reply
                    </button>

                    {{-- @dd($parent_id) --}}
                    @if ($comment->is_admin)
                        <button wire:click="edit({{ $comment->id }}, 'edit')"
                            class="dark:text-violet-600 text-blue-300 hover:underline mr-2 font-bold p-2">Edit</button>
                    @endif
                    <button wire:click="delete({{ $comment->id }})" class="dark:text-red-500 text-red-500 font-bold p-2 hover:underline">Delete</button>
                </div>

                @if ($editingId === $comment->id)
                    <div class="my-4 bg-slate-600 dark:bg-white rounded-md p-4">
                        @if($state == 'edit')
                            <h3 class="text-lg font-semibold text-white dark:text-black">Edit Komentar</h3>
                        @else
                            <h3 class="text-lg font-semibold text-white dark:text-black">Balas Komentar</h3>
                        @endif
                            
                        <textarea wire:model="comment" class="form-textarea w-full mb-2 rounded-md bg-slate-500 dark:bg-white text-white dark:text-black" placeholder="Komentar"></textarea>

                        @if($state == 'reply')
                            <button wire:click="store('none')"
                                class="bg-green-500 text-white px-4 py-2 rounded">Simpan</button>
                        @elseif($state == 'edit')
                            <button wire:click="update"
                                class="bg-green-500 text-white px-4 py-2 rounded">Simpan</button>
                        @endif
                        <button wire:click="$set('editingId', null)"
                            class="bg-gray-300 text-black px-4 py-2 rounded ml-2">Batal</button>
                    </div>
                @endif
                    
                @foreach ($comment->replies as $reply)
                    <div class="p-6 border rounded-lg dark:bg-gray-200 bg-slate-700 dark:border-gray-700">
                        <div class="p-4 border border-slate-300 rounded-lg dark:border-gray-700 {{ $reply->is_admin ? 'bg-indigo-900 dark:bg-blue-200' : 'dark:bg-white bg-slate-600' }}">
                            <strong class="text-white dark:text-black">{{ $reply->name }}
                                @if ($reply->is_admin)
                                    <span class="dark:text-blue-600 text-blue-400">(admin)</span>
                                @endif
                            </strong>
                            <p class="text-white dark:text-black">{{ $reply->comment }}</p>
                            
                            <button class="reply-btn text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-3.5 py-1.5 text-center me-2 mb-2 mt-4" wire:click="edit({{ $reply->id }}, 'reply')">            
                                Reply
                            </button>
        
                            @if ($reply->is_admin)
                                <button wire:click="edit({{ $reply->id }}, 'edit')"
                                    class="dark:text-violet-600 text-blue-300 hover:underline mr-2 font-bold p-2">Edit</button>
                            @endif
        
                            <button wire:click="delete({{ $reply->id }})"
                                class="dark:text-red-500 text-red-500 font-bold p-2 hover:underline">Delete</button>

                            @if ($editingId === $reply->id)
                                <div class="my-4 bg-slate-600 dark:bg-white rounded-md p-4">
                                    @if($state == 'edit')
                                        <h3 class="text-lg font-semibold text-white dark:text-black">Edit Komentar</h3>
                                    @else
                                        <h3 class="text-lg font-semibold text-white dark:text-black">Balas Komentar</h3>
                                    @endif
                                        
                                    <textarea wire:model="comment" class="form-textarea w-full mb-2 rounded-md bg-slate-600 dark:bg-white text-white dark:text-black" placeholder="Komentar"></textarea>
    
                                    @if($state == 'reply')
                                        <button wire:click="store('none')"
                                            class="bg-green-500 text-white px-4 py-2 rounded">Simpan</button>
                                    @elseif($state == 'edit')
                                        <button wire:click="update"
                                            class="bg-green-500 text-white px-4 py-2 rounded">Simpan</button>
                                    @endif
                                    <button wire:click="$set('editingId', null)"
                                        class="bg-gray-300 text-black px-4 py-2 rounded ml-2">Batal</button>
                                </div>
                            @endif
                        </div>

                        @foreach ($reply->replies as $reply_replys)
                            <div class="p-6 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 mt-2 ms-4 {{ $reply_replys->is_admin ? 'bg-indigo-900 dark:bg-blue-200' : 'dark:bg-white bg-slate-600' }}">
                                <div class="card-body">
                                    <strong class="text-white dark:text-black">{{ $reply_replys->name }}
                                        @if ($reply_replys->is_admin)
                                            <span  class="dark:text-blue-600 text-blue-400">(admin)</span>
                                        @endif
                                    </strong>
                                    <p class="text-white dark:text-black">{{ $reply_replys->comment }}</p>
                
                                    @if ($reply_replys->is_admin)
                                        <button wire:click="edit({{ $reply_replys->id }}, 'edit')"
                                            class="dark:text-violet-600 text-blue-300 hover:underline mr-2 font-bold p-2">Edit</button>
                                    @endif
                
                                    <button wire:click="delete({{ $reply_replys->id }})"
                                        class="dark:text-red-500 text-red-500 font-bold p-2 hover:underline">Delete</button>

                                    @if ($editingId === $reply_replys->id)
                                        <div class="mt-4">
                                            <h3 class="text-lg font-semibold">Edit Komentar</h3>
                                            <textarea wire:model="comment" class="form-textarea w-full mb-2" placeholder="Komentar"></textarea>
                                            
                                            <button wire:click="update" class="bg-green-500 text-white px-4 py-2 rounded">Simpan</button>
                                            <button wire:click="$set('editingId', null)" class="bg-gray-300 text-black px-4 py-2 rounded ml-2">Batal</button>
                                        </div>
                                    @endif
                                </div>
                            </div>
                        @endforeach
                    </div>
                @endforeach
            </div>
        @endforeach
    </div>
</div>
