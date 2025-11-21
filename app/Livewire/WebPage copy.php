<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithFileUploads;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\Webpage as Page;
use Illuminate\Support\ItemNotFoundException;

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
        } elseif ($params === 'prolog-emodul') {
            $this->webpage = Page::where('id', 'like', '%prolog-emodul%')->get();
        } else {
            $this->webpage = Page::where('id', 'not like', '%prolog%')->get();
        }
    }

    public function store(Request $request)
    {
        try {
            $ids = [];
            $urlMap = session('urlMap', []);
            $paramStatus = $request->input('paramStatus');
            foreach ($request->items as $index => $item) {
                // Validasi masing-masing item
                \Validator::make($item, [
                    'id' => 'required|string',
                    'type' => 'required|string',
                    'content' => 'nullable|string',
                    'action' => 'required|string',
                    'style' => 'nullable|string',
                    'element_order' => 'nullable|string',
                    'element_count' => 'nullable|string',
                ])->validate();
                
                if(str_contains($item['action'] , 'update') || str_contains($item['action'], 'add')){
                    if ($item['type'] === 'video' && $request->hasFile("items.$index.file")) {
                        // Simpan file baru
                        $path = $request->file("items.$index.file")->store('media', 'public');
                        $filename = basename($path);
                        $newUrl = asset('storage/media/' . $filename);

                        // Tangkap URL lama dari content (bisa relatif atau absolute)
                        $oldUrl = trim($item['content'] ?? '');

                        // Simpan peta lama → baru, agar elemen duplikat bisa pakai URL baru ini
                        if ($oldUrl) {
                            $urlMap[$oldUrl] = $newUrl;
                        }

                        // Replace content langsung ke URL baru
                        $item['content'] = $newUrl;

                        // 🔥 Cek data lama dari DB
                        $oldItem = \App\Models\Webpage::find($item['id']);

                        if ($oldItem && !empty($oldItem->style)) {
                            if (preg_match("/url\(['\"]?(.*?)['\"]?\)/", $oldItem->style, $matches)) {
                                $oldUrl = $matches[1];
                                $oldFile = str_replace(asset('storage') . '/', '', $oldUrl);

                                // Pastikan file lama ada dan bukan file default
                                if (\Storage::disk('public')->exists($oldFile) && !str_contains($oldFile, 'almond1DefaultImageCarousel')) {

                                    // Cek apakah ada elemen webpage lain yang masih memakai file ini di style-nya
                                    $stillUsed = \App\Models\Webpage::where('id', '!=', $item['id'])
                                        ->where('style', 'like', '%' . $oldFile . '%')
                                        ->exists();
                                    
                                    $isUsedRequest = collect($request->items)->contains(function ($item) use ($oldFile) {
                                        return !empty($item['style']) && str_contains($item['style'], $oldFile);
                                    });

                                    // Kalau tidak ada yang pakai, baru hapus
                                    if (!$stillUsed) {
                                        \Storage::disk('public')->delete($oldFile);
                                    }
                                }
                            }
                        }
                        
                    }else if ($item['type'] === 'video' && empty($item['file'] ?? null)) {
                        $content = $item['content'] ?? '';

                        // Jika ada URL lama yg sudah diubah di map, ganti dgn URL baru
                        foreach ($urlMap as $oldUrl => $newUrl) {
                            if (str_contains($content, $oldUrl)) {
                                $content = str_replace($oldUrl, $newUrl, $content);
                                break;
                            }
                        }

                        $item['content'] = $content;
                    }else if ($request->hasFile("items.$index.file")) {
                        // 🔄 logic lama untuk style (image, background, dll.)
                        $path = $request->file("items.$index.file")->store('media', 'public');
                        $filename = basename($path);
                        $newUrl = asset('storage/media/' . $filename);

                        $style = $item['style'] ?? '';

                        // Tangkap URL lama (bisa {{ asset(...) }} atau url('...'))
                        if (preg_match("/url\(['\"]?(.*?)['\"]?\)/", $style, $matches)) {
                            $oldUrl = trim($matches[1], "'\" ");
                            // Simpan peta lama -> baru
                            $urlMap[$oldUrl] = $newUrl;
                        }

                        // Replace URL di style
                        $style = preg_replace(
                            '/url\((["\']?)(data:image\/[a-zA-Z]+;base64,[^"\')]+)\1\)/i',
                            "url('{$newUrl}')",
                            $style
                        );

                        $item['style'] = $style;

                        $oldItem = \App\Models\Webpage::find($item['id']);

                        if ($oldItem && !empty($oldItem->style)) {
                            if (preg_match("/url\(['\"]?(.*?)['\"]?\)/", $oldItem->style, $matches)) {
                                $oldUrl = $matches[1];
                                $oldFile = str_replace(asset('storage') . '/', '', $oldUrl);

                                // Pastikan file lama ada dan bukan file default
                                if (\Storage::disk('public')->exists($oldFile) && !str_contains($oldFile, 'almond1DefaultImageCarousel')) {

                                    // Cek apakah ada elemen webpage lain yang masih memakai file ini di style-nya
                                    $stillUsed = \App\Models\Webpage::where('id', '!=', $item['id'])
                                        ->where('style', 'like', '%' . $oldFile . '%')
                                        ->exists();
                                    
                                    $isUsedRequest = collect($request->items)->contains(function ($item) use ($oldFile) {
                                        return !empty($item['style']) && str_contains($item['style'], $oldFile);
                                    });

                                    // Kalau tidak ada yang pakai, baru hapus
                                    if (!$stillUsed && !$isUsedRequest) {
                                        \Storage::disk('public')->delete($oldFile);
                                    }
                                }
                            }
                        }

                        //ubah atribute item[style] agar sesuai dengan nama file yg baru diupload ke public
                        if($item['type'] === 'item-carousel' && str_contains($item['style'], 'almond1DefaultImageCarousel.jpg')){
                            $style = $item['style'] ?? '';
                            $style = preg_replace(
                                "/url\((.*?)\)/",
                                "url('" . asset('storage/media/' . 'almond1DefaultImageCarousel.jpg') . "')",
                                $style
                            );

                            $item['style'] = $style;

                        }else if($item['type'] === 'img-carousel'){
                            $item['content'] = asset('storage/media/' . $filename);
                            
                            $parts = explode('-', $item['id']);
                            $target_id_parts = array_slice($parts, 4);
                            $target_id = implode('-', $target_id_parts);

                            $itemCarousel = \App\Models\Webpage::find($target_id);
                            
                            if ($itemCarousel) {
                                $style = $itemCarousel->style;

                                $style = preg_replace(
                                    "/url\((.*?)\)/",
                                    "url('" . asset('storage/media/' . $filename) . "')",
                                    $style
                                );

                                $itemCarousel->style = $style;
                                $itemCarousel->save();
                            }

                        }else{
                            
                            $style = $item['style'] ?? '';
                            
                            if (preg_match("/url\(([^)]+)\)/", $style)) {
                                // cocok dengan semua isi dalam url(...)
                                $style = preg_replace(
                                    "/url\(([^)]+)\)/",
                                    "url('" . asset('storage/media/' . $filename) . "')",
                                    $style
                                ); 
                            }
        
                            $item['style'] = $style;
                        }

                    }else{
                        $style = $item['style'] ?? '';
                        if(!str_contains($style, 'media')){
                            $field = \DB::table('webpage')
                                ->where('id', $item['id'])
                                ->first();

                            if ($field && isset($field->style)) {
                                if (preg_match("/media\/([^\"'\)]+)/", $field->style, $matches)) {
                                    $filename = $matches[1];
                                    $isUsedRequest = collect($request->items)->contains(function ($item) use ($filename) {
                                        return !empty($item['style']) && str_contains($item['style'], $filename);
                                    });
                                    if(!$isUsedRequest){
                                        Storage::disk('public')->delete("media/" . $filename);
                                    }
                                }
                            }
                        }

                        foreach ($urlMap as $oldUrl => $newUrl) {
                            if (str_contains($style, $oldUrl)) {
                                $style = str_replace($oldUrl, $newUrl, $style);
                            }
                        }

                        $item['style'] = $style;
                    }
                    if($item['type'] === 'img-carousel' && str_contains($item['content'], 'almond1DefaultImageCarousel.jpg')){
                        $item['content'] = asset('storage/media/' . 'almond1DefaultImageCarousel.jpg');
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
                }else if(str_contains($item['action'] , 'delete')){
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

                                // Cek apakah ada elemen lain yang masih pakai file ini
                                $isUsedDB = \DB::table('webpage')
                                    ->where('id', '!=', $page->id) // selain elemen yang lagi dihapus
                                    ->where('content', 'like', '%' . $filename . '%')
                                    ->exists();

                                $isUsedRequest = collect($request->items)->contains(function ($item) use ($filename) {
                                    return !empty($item['content']) && str_contains($item['content'], $filename);
                                });

                                if (!$isUsedDB && !$isUsedRequest && Storage::disk('public')->exists("media/" . $filename)) {
                                    Storage::disk('public')->delete("media/" . $filename);
                                }
                            }
                        }
                    } else if($page){
                        // logic lama untuk style (image/background)
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
                                    return !empty($item['style']) && str_contains($item['style'], $filename);
                                });

                                if (!$isUsedDB && !$isUsedRequest && Storage::disk('public')->exists("media/" . $filename)) {
                                    Storage::disk('public')->delete("media/" . $filename);
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
                            ->where('id', '<>', 'webpage-section-prolog-web-1')
                            ->where('id', '<>', 'webpage-section-prolog-emodul-1')
                            ->where('id', '<>', 'webpage')->delete();
                    } 
                }
            }
            session(['urlMap' => $urlMap]);

            return response()->json([
                'success' => true,
                'message' => 'Data berhasil diperbarui',
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }

    public function render()
    {
        return view('livewire.web-page')->layout('layouts.pageEdit');
    }
}
