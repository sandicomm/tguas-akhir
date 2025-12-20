<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithFileUploads;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use App\Models\Webpage as Page;
use App\Models\File as FileMedia;
use Illuminate\Support\ItemNotFoundException;
use Illuminate\Support\Str;

class WebPage extends Component
{
    use WithFileUploads;

    public $webpage;
    public $file;
    public $param;

    public function mount($params)
    {
        $this->param = $params;
        
        if ($params === 'prolog-web') {
            $this->webpage = Page::where('id', 'like', '%prolog-web%')->get();
            $this->file = FileMedia::get();
        } else if ($params === 'prolog-emodul') {
            $this->webpage = Page::where('id', 'like', '%prolog-emodul%')->get();
            $this->file = FileMedia::get();
        } else {
            $this->webpage = Page::where('id', 'not like', '%prolog%')->get();
            $this->file = FileMedia::get();
        }
    }

    public function store(Request $request)
    {
        try {
            $ids = [];
            $urlMap = session('urlMap', []);
            $paramStatus = $request->input('paramStatus');

            $requestFile = $request->items;
            foreach ($requestFile as $index => $item) {
                // Validasi masing-masing item
                \Validator::make($item, [
                    'id' => 'required|string',
                    'type'=>'required|string',
                    'filetype'=>'nullable|string'
                ])->validate();

                if($request->hasFile("items.$index.file") && $item['type'] === 'file' && $item['action'] === 'add'){
                    $original = pathinfo($request->file("items.$index.file")->getClientOriginalName(), PATHINFO_FILENAME);
                    $ext = $request->file("items.$index.file")->getClientOriginalExtension();

                    // singkatkan nama jika terlalu panjang
                    $original = Str::limit($original, 50, '');
                    $original = preg_replace('/[^A-Za-z0-9_\-]/', '_', $original);

                    $filename = Str::uuid() . '_' . $original . '.' . $ext;
                    $request->file("items.$index.file")->move(public_path('media'), $filename);

                    $newUrl = asset('media/' . $filename);
                    $urlMap[$item['id']] = $newUrl;

                    \App\Models\File::updateOrCreate(
                        ['id' => $filename],
                        ['type'=>$item['filetype']]
                    );

                    // HAPUS dari array
                    unset($requestFile[$index]);
                }
            }
            $video='uhuy';
            $namaFile='';
            foreach ($requestFile as $index => $item) {
                // Validasi masing-masing item
                \Validator::make($item, [
                    'id' => 'required|string',
                    'type' => 'required|string',
                    'content' => 'nullable|string',
                    'action' => 'nullable|string',
                    'style' => 'nullable|string',
                    'element_order' => 'nullable|string',
                    'element_count' => 'nullable|string',
                ])->validate();
                
                if((str_contains($item['action'] , 'update') || str_contains($item['action'], 'add')) && $item['type'] !== 'file'){
                    if ($item['type'] === 'video') {
                        $content = $item['content'] ?? '';
                        // Jika ada URL lama yg sudah diubah di map, ganti dgn URL baru
                        foreach ($urlMap as $idMedia => $urlMedia) {
                            if (str_contains($content, $idMedia)) {
                                $content = str_replace($idMedia, $urlMedia, $content);
                                break;
                            }
                        }
                        $item['content'] = $content;

                        // 🔥 Cek data lama dari DB
                        $oldItem = \App\Models\Webpage::find($item['id']);
                        if ($oldItem && !empty($oldItem->content)) {
                            $oldContent = $oldItem->content;
                            $filename = basename($oldContent);
                            // Pastikan file lama ada dan bukan file default

                            // Cek di database (1 query saja)
                            $isUsedDB = \App\Models\Webpage::where('id', '!=', $item['id'])
                                ->where(function ($q) use ($filename) {
                                    $q->where('content', 'like', "%$filename%")
                                    ->orWhere('style', 'like', "%$filename%");
                                })
                                ->exists();

                            // Cek di request items (1 kali loop saja)
                            $isUsedRequest = collect($request->items)->contains(function ($item) use ($filename) {

                                // abaikan item yang mau dihapus
                                if ($item['action'] === 'delete') return false;

                                return 
                                    (!empty($item['content']) && str_contains($item['content'], $filename)) ||
                                    (!empty($item['style']) && str_contains($item['style'], $filename));
                            });

                            // Kalau tidak ada yang pakai, baru hapus
                            if (!$isUsedDB && !$isUsedRequest) {
                                File::delete(public_path('media/' . $filename));
                                \App\Models\File::where('id', $filename)->delete();
                            }
                            
                        }
                    }else if($item['type'] === 'img-carousel'){
                        $content = $item['content'] ?? '';
                        $namaFile='first'.$content; 
                        $video="first" . $content;
                        if(str_contains($content, 'almond1DefaultImageCarousel.jpg')){
                            $content =  asset('media/' . 'almond1DefaultImageCarousel.jpg');
                        }else{
                            $field = \DB::table('webpage')
                                ->where('id', $item['id'])
                                ->first();

                            if ($field && isset($field->content)) {
                                if (preg_match("/media\/([^\"'\)]+)/", $field->content, $matches)) {
                                    $filename = $matches[1];

                                    // Cek di database (1 query saja)
                                    $isUsedDB = \App\Models\Webpage::where('id', '!=', $item['id'])
                                        ->where(function ($q) use ($filename) {
                                            $q->where('content', 'like', "%$filename%")
                                            ->orWhere('style', 'like', "%$filename%");
                                        })
                                        ->exists();

                                    // Cek di request items (1 kali loop saja)
                                    $isUsedRequest = collect($request->items)->contains(function ($item) use ($filename) {

                                        // abaikan item yang mau dihapus
                                        if ($item['action'] === 'delete') return false;

                                        return 
                                            (!empty($item['content']) && str_contains($item['content'], $filename)) ||
                                            (!empty($item['style']) && str_contains($item['style'], $filename));
                                    });

                                    // Hapus file jika tidak digunakan di mana pun
                                    if (!$isUsedDB && !$isUsedRequest) {
                                        File::delete(public_path('media/' . $filename));
                                        \App\Models\File::where('id', $filename)->delete();
                                    }
                                }
                            }
                            $namaFile='luck'.$content; 
                            foreach ($urlMap as $idMedia => $urlMedia) {
                                if (str_contains($content, $idMedia)) {
                                    $namaFile='uhuy'.$content; 
                                    $content = str_replace($idMedia, $urlMedia, $content);
                                    break;
                                }
                            }
                        }
                        $item['content'] = $content;
                    }else{
                        $style = $item['style'] ?? '';
                        if(!str_contains($style, 'storage/media')){
                            if(str_contains($style, 'almond1DefaultImageCarousel.jpg')){
                                $style = preg_replace(
                                    "/url\((.*?)\)/",
                                    "url('" . asset('media/' . 'almond1DefaultImageCarousel.jpg') . "')",
                                    $style
                                );
                            }else{
                                $field = \DB::table('webpage')
                                    ->where('id', $item['id'])
                                    ->first();
    
                                if ($field && isset($field->style)) {
                                    if (preg_match("/media\/([^\"'\)]+)/", $field->style, $matches)) {
                                        $filename = $matches[1];
    
                                       // Cek di database (1 query saja)
                                        $isUsedDB = \App\Models\Webpage::where('id', '!=', $item['id'])
                                            ->where(function ($q) use ($filename) {
                                                $q->where('content', 'like', "%$filename%")
                                                ->orWhere('style', 'like', "%$filename%");
                                            })
                                            ->exists();

                                        // Cek di request items (1 kali loop saja)
                                        $isUsedRequest = collect($request->items)->contains(function ($item) use ($filename) {

                                            // abaikan item yang mau dihapus
                                            if ($item['action'] === 'delete') return false;

                                            return 
                                                (!empty($item['content']) && str_contains($item['content'], $filename)) ||
                                                (!empty($item['style']) && str_contains($item['style'], $filename));
                                        });

                                        if(!$isUsedDB && !$isUsedRequest){
                                            File::delete(public_path('media/' . $filename));
                                            \App\Models\File::where('id', $filename)->delete();
                                        }
                                    }
                                }

                                foreach ($urlMap as $idMedia => $urlMedia) {
                                    if (str_contains($style, $idMedia)) {
                                        $style = str_replace($idMedia, $urlMedia, $style);
                                        break;
                                    }
                                }
                            }
                            $item['style']=$style;
                        }
                    }

                    // Simpan ke database

                    \App\Models\Webpage::updateOrCreate(
                        ['id' => $item['id']], // kondisi pencarian (biasanya 'id' atau unique key lain)
                        [
                            'type' => $item['type'],
                            'content' => $item['content'] ?? null,
                            'style' => $item['style'] ?? null,
                            'element_order' => (string) ($item['element_order'] ?? null),
                            'element_count' => (string) ($item['element_count'] ?? null)
                        ]
                    );
                }else if((str_contains($item['action'] , 'delete')) && $item['type'] !== 'file'){
                    $ids[] = $item['id'];  
                    
                    $page='';
                    if($paramStatus ==='prolog-web'){
                        $page =  \App\Models\Webpage::where('id', $item['id'])->where('id', 'like', '%prolog-web%')->first();
                    }else if($paramStatus === 'prolog-emodul'){
                        $page =  \App\Models\Webpage::where('id',$item['id'])->where('id', 'like', '%prolog-emodul%')->first();
                    }else{
                        $page =  \App\Models\Webpage::where('id', $item['id'])->where('id', 'not like', '%prolog-web%')->where('id', 'not like', '%prolog-emodul%')->first();
                    }

                    if ($page && $page->type === 'video' && $page->content) {
                        preg_match("/media\/([^')]+)/", $page->content, $matches);
                        if (isset($matches[1])) {
                            $filename = $matches[1];

                            if (!str_contains($filename, 'almond1DefaultImageCarousel')) {

                                // Cek di database (1 query saja)
                                    $isUsedDB = \App\Models\Webpage::where('id', '!=', $item['id'])
                                        ->where(function ($q) use ($filename) {
                                            $q->where('content', 'like', "%$filename%")
                                            ->orWhere('style', 'like', "%$filename%");
                                        })
                                        ->exists();

                                    // Cek di request items (1 kali loop saja)
                                    $isUsedRequest = collect($request->items)->contains(function ($item) use ($filename) {

                                        // abaikan item yang mau dihapus
                                        if ($item['action'] === 'delete') return false;

                                        return 
                                            (!empty($item['content']) && str_contains($item['content'], $filename)) ||
                                            (!empty($item['style']) && str_contains($item['style'], $filename));
                                    });

                                $filePath = public_path('media/' . $filename);
                                if (!$isUsedDB && !$isUsedRequest && file_exists($filePath)) {                                    
                                    File::delete(public_path('media/' . $filename));
                                    \App\Models\File::where('id', $filename)->delete();
                                }
                            }
                        }
                    } else if($page){
                        // logic lama untuk style (image/background)
                        if($page->type === "img-carousel"){
                            preg_match("/media\/([^')]+)/", $page->content, $matches);
    
                            if (isset($matches[1])) {
                                $filename = $matches[1];
    
                                // Pastikan bukan default image
                                if (!str_contains($filename, 'almond1DefaultImageCarousel')) {
    
                                    // Cek di database (1 query saja)
                                    $isUsedDB = \App\Models\Webpage::where('id', '!=', $item['id'])
                                        ->where(function ($q) use ($filename) {
                                            $q->where('content', 'like', "%$filename%")
                                            ->orWhere('style', 'like', "%$filename%");
                                        })
                                        ->exists();

                                    // Cek di request items (1 kali loop saja)
                                    $isUsedRequest = collect($request->items)->contains(function ($item) use ($filename) {

                                        // abaikan item yang mau dihapus
                                        if ($item['action'] === 'delete') return false;

                                        return 
                                            (!empty($item['content']) && str_contains($item['content'], $filename)) ||
                                            (!empty($item['style']) && str_contains($item['style'], $filename));
                                    });
    
                                    $filePath = public_path('media/' . $filename);
                                    if (!$isUsedDB && !$isUsedRequest && file_exists($filePath)) {                                        
                                        File::delete(public_path('media/' . $filename));
                                        \App\Models\File::where('id', $filename)->delete();
                                    }
                                }
                            }

                        }else{
                            preg_match("/media\/([^')]+)/", $page->style, $matches);
    
                            if (isset($matches[1])) {
                                $filename = $matches[1];
    
                                // Pastikan bukan default image
                                if (!str_contains($filename, 'almond1DefaultImageCarousel')) {
    
                                    // Cek apakah ada elemen lain yang masih pakai file ini
                                    $isUsedDB = \DB::table('webpage')
                                        ->where('id', '!=', $page->id) // selain elemen yang lagi dihapus
                                        ->where('style', 'like', '%' . $filename . '%')
                                        ->exists();
    
                                    $isUsedRequest = collect($request->items)->contains(function ($item) use ($filename) {
                                        return !empty($item['style']) && str_contains($item['style'], $filename) && $item['action'] !=='delete';
                                    });
    
                                   $filePath = public_path('media/' . $filename);
                                    if (!$isUsedDB && !$isUsedRequest && file_exists($filePath)) {
                                        File::delete(public_path('media/' . $filename));
                                        \App\Models\File::where('id', $filename)->delete();
                                    }
                                }
                            }
                        }
                    }
                    
                    if($paramStatus ==='prolog-web'){
                        \App\Models\Webpage::where('id', $item['id'])
                            ->where('id', 'like', '%prolog-web%')
                            ->where('id', '<>', 'webpage-section-prolog-web-1')
                            ->where('id', '<>', 'webpage')->delete();
                        
                    }else if($paramStatus === 'prolog-emodul'){
                        \App\Models\Webpage::where('id', $item['id'])
                            ->where('id', 'like', '%prolog-emodul%')
                            ->where('id', '<>', 'webpage-section-prolog-emodul-1')
                            ->where('id', '<>', 'webpage')->delete();

                    }else{
                        \App\Models\Webpage::where('id', $item['id'])
                            ->where('id', 'not like', '%prolog-web%')
                            ->where('id', 'not like', '%prolog-emodul%')
                            ->where('id', '<>', 'webpage-section-footer')
                            ->where('id', '<>', 'webpage-section-prolog-web-1')
                            ->where('id', '<>', 'webpage-section-prolog-emodul-1')
                            ->where('id', '<>', 'webpage')->delete();

                    } 
                }
            }
            session(['urlMap' => $urlMap]);

            return response()->json([
                'success' => true,
                'message' => 'Data berhasil diperbarui ',
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function render()
    {
        return view('livewire.web-page')->layout('layouts.pageEdit');
    }
}
