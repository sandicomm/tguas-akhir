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
            $paramStatus = $request->input('paramStatus');
            foreach ($request->items as $index => $item) {
                // Validasi masing-masing item
                \Validator::make($item, [
                    'id' => 'required|string',
                    'type' => 'required|string',
                    'content' => 'nullable|string',
                    'style' => 'nullable|string',
                    'element_order' => 'nullable|string',
                    'element_count' => 'nullable|string',
                ])->validate();
                
                if ($item['type'] === 'video' && $request->hasFile("items.$index.file")) {
                    // Simpan file baru ke storage
                    
                    $path = $request->file("items.$index.file")->store('media', 'public');
                    $filename = basename($path); 

                    // 🔥 Cek data lama dari DB
                    $oldItem = \App\Models\Webpage::find($item['id']);
                    if ($oldItem && !empty($oldItem->content)) {
                        if (preg_match("/storage\/([^'\")]+)/", $oldItem->content, $matches)) {
                            $oldFile = $matches[1]; // contoh: "media/test.jpg"
                            if (\Storage::disk('public')->exists($oldFile)  && !str_contains($oldFile, 'almond1DefaultImageCarousel')) {
                                \Storage::disk('public')->delete($oldFile);
                            }
                        }
                    }

                    // Update content dengan nama file baru
                    $item['content'] = asset('storage/media/'.$filename);
                }
                else if ($request->hasFile("items.$index.file")) {
                    // 🔄 logic lama untuk style (image, background, dll.)
                    $path = $request->file("items.$index.file")->store('media', 'public');
                    $filename = basename($path); 

                    $oldItem = \App\Models\Webpage::find($item['id']);
                    if ($oldItem && !empty($oldItem->style)) {
                        if (preg_match("/url\(['\"]?(.*?)['\"]?\)/", $oldItem->style, $matches)) {
                            $oldUrl = $matches[1];
                            $oldFile = str_replace(asset('storage') . '/', '', $oldUrl);
                            
                            if (\Storage::disk('public')->exists($oldFile) && !str_contains($oldFile, 'almond1DefaultImageCarousel')) {
                                \Storage::disk('public')->delete($oldFile);
                            }
                        }
                    }

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
                                
                $ids[] = $item['id'];    
            }
             
            // Ambil semua record yang akan dihapus
            if($paramStatus ==='prolog-web'){
                $pages =  \App\Models\Webpage::whereNotIn('id', $ids)->where('id', 'like', '%prolog-web%')->get();
            }else if($paramStatus === 'prolog-emodul'){
                $pages =  \App\Models\Webpage::whereNotIn('id', $ids)->where('id', 'like', '%prolog-emodul%')->get();
            }else{
                $pages =  \App\Models\Webpage::whereNotIn('id', $ids)->where('id', 'not like', '%prolog-web%')->where('id', 'not like', '%prolog-emodul%')->get();
            }

            if($paramStatus ==='prolog-web'){
                \App\Models\Webpage::whereNotIn('id', $ids)
                    ->where('id', 'like', '%prolog-web%')
                    ->where('id', '<>', 'webpage-section-prolog-web-1')
                    ->where('id', '<>', 'webpage')->delete();
            }else if($paramStatus === 'prolog-emodul'){
                \App\Models\Webpage::whereNotIn('id', $ids)
                    ->where('id', 'like', '%prolog-emodul%')
                    ->where('id', '<>', 'webpage-section-prolog-emodul-1')
                    ->where('id', '<>', 'webpage')->delete();
            }else{
                \App\Models\Webpage::whereNotIn('id', $ids)
                    ->where('id', 'not like', '%prolog-web%')
                    ->where('id', 'not like', '%prolog-emodul%')
                    ->where('id', '<>', 'webpage-section-prolog-web-1')
                    ->where('id', '<>', 'webpage-section-prolog-emodul-1')
                    ->where('id', '<>', 'webpage')->delete();
            }

            foreach ($pages as $page) {
                if ($page->type === 'video' && $page->content) {
                    preg_match("/media\/([^')]+)/", $page->content, $matches);
                    if (isset($matches[1])) {
                        $filename = $matches[1];

                        if (!str_contains($filename, 'almond1DefaultImageCarousel')) {

                            // Cek apakah ada elemen lain yang masih pakai file ini
                            $isUsed = \DB::table('webpage')
                                ->where('id', '!=', $page->id) // selain elemen yang lagi dihapus
                                ->where('content', 'like', '%' . $filename . '%')
                                ->exists();

                            if (!$isUsed && Storage::disk('public')->exists("media/" . $filename)) {
                                Storage::disk('public')->delete("media/" . $filename);
                            }
                        }
                    }
                } elseif ($page->style && $page->type !== 'img-carousel') {
                    // logic lama untuk style (image/background)
                    preg_match("/media\/([^')]+)/", $page->style, $matches);

                    if (isset($matches[1])) {
                        $filename = $matches[1];

                        // Pastikan bukan default image
                        if (!str_contains($filename, 'almond1DefaultImageCarousel')) {

                            // Cek apakah ada elemen lain yang masih pakai file ini
                            $isUsed = \DB::table('webpage')
                                ->where('id', '!=', $page->id) // selain elemen yang lagi dihapus
                                ->where('style', 'like', '%' . $filename . '%')
                                ->exists();

                            if (!$isUsed && Storage::disk('public')->exists("media/" . $filename)) {
                                Storage::disk('public')->delete("media/" . $filename);
                            }
                        }
                    }
                } elseif ($page->content && $page->type === 'img-carousel') {
                    // logic lama untuk style (image/background)
                    preg_match("/media\/([^')]+)/", $page->content, $matches);
                    if (isset($matches[1])) {
                        $filename = $matches[1];
                        if (Storage::disk('public')->exists("media/" . $filename) && !str_contains($filename, 'almond1DefaultImageCarousel')) {
                            Storage::disk('public')->delete("media/" . $filename);
                        }
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Data berhasil diperbarui',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function render()
    {
        return view('livewire.web-page')->layout('layouts.pageEdit');
    }
}
