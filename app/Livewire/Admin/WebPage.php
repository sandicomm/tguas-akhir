<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Livewire\WithFileUploads;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use App\Models\Webpage as Page;
use App\Models\File as FileMedia;
use Illuminate\Support\ItemNotFoundException;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Mews\Purifier\Facades\Purifier;

class WebPage extends Component
{
    use WithFileUploads;

    public $webpage;
    public $file;
    public $param;

    public function mount($params)
    {
        $this->param = $params;
        
        $this->file = FileMedia::whereNot('id', 'like', 'form-%')->get();
        if ($params === 'prolog') {
            $this->webpage = Page::where('id', 'like', '%prolog-web%')->get();
        } else if ($params === 'prolog-emodul') {
            $this->webpage = Page::where('id', 'like', '%prolog-emodul%')->get();
        } else {
            $this->webpage = Page::where('id', 'not like', '%prolog%')->get();
        }
    }

    public function store2(Request $request)
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

                    }else if($item['type'] === 'img-carousel'){
                        $content = $item['content'] ?? '';
                        
                        if(str_contains($content, 'almond1DefaultImageCarousel.jpg')){
                            $content =  asset('media/' . 'almond1DefaultImageCarousel.jpg');
                        }else{
                            

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
                'message' => 'Data berhasil diperbarui',
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data Gagal Diperbarui'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        // 1. Validasi Struktur Array Utama
        $validator = Validator::make($request->all(), [
            'items' => 'required|array',
            'paramStatus' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Data tidak valid'], 422);
        }

        DB::beginTransaction(); // Gunakan transaksi agar data konsisten
        try {
            $urlMap = session('urlMap', []);
            $items = $request->items;
            

            // --- TAHAP 1: PROSES UPLOAD FILE ---
            foreach ($items as $index => $item) {
                if ($request->hasFile("items.$index.file") && $item['type'] === 'file' && ($item['action'] ?? '') === 'add') {
                    $file = $request->file("items.$index.file");
                    $original = Str::limit(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME), 50, '');
                    $original = preg_replace('/[^A-Za-z0-9_\-]/', '_', $original);
                    
                    $filename = Str::uuid() . '_' . $original . '.' . $file->getClientOriginalExtension();
                    $file->move(public_path('media'), $filename);

                    $urlMap[$item['id']] = asset('media/' . $filename);

                    \App\Models\File::updateOrCreate(
                        ['id' => $filename],
                        ['type' => $item['filetype'] ?? 'image']
                    );
                    
                    unset($items[$index]); // Hapus dari antrian agar tidak diproses di tahap 2
                }
            }

            // --- TAHAP 2: PROSES UPDATE / DELETE DATA ---
            foreach ($items as $item) {
                $action = $item['action'] ?? '';
                $id = $item['id'];

                if (str_contains($action, 'update') || str_contains($action, 'add')) {
                    // Proses sanitasi dilakukan di sini
                    $originalContent = $item['content'] ?? '';
                    $originalStyle = $item['style'] ?? '';

                    $originalContent = $item['content'] ?? '';

                    // Cek purifier
                    $content = Purifier::clean($originalContent);
                    $style = Purifier::clean($originalStyle);

                    // B. Mapping URL Baru (Replace ID Media dengan URL Asli)
                    foreach ($urlMap as $idMedia => $urlMedia) {
                        if ($content) $content = str_replace($idMedia, $urlMedia, $content);
                        if ($style) $style = str_replace($idMedia, $urlMedia, $style);
                    }

                    // C. Logika Khusus Default Image Carousel
                    if (str_contains($content, 'almond1DefaultImageCarousel.jpg') || str_contains($style, 'almond1DefaultImageCarousel.jpg')) {
                        $content = str_replace('/assets/img/almond1DefaultImageCarousel.jpg', asset('media/' . 'almond1DefaultImageCarousel.jpg'), $content);
                        $style = str_replace('/assets/img/almond1DefaultImageCarousel.jpg', asset('media/' . 'almond1DefaultImageCarousel.jpg'), $style);
                    }

                    // D. Simpan Data
                    \App\Models\Webpage::updateOrCreate(
                        ['id' => $id],
                        [
                            'type' => $item['type'],
                            'content' => $content,
                            'style' => $style,
                            'element_order' => (string)($item['element_order'] ?? '0'),
                            'element_count' => (string)($item['element_count'] ?? '0')
                        ]
                    );

                } else if (str_contains($action, 'delete')) {
                    // E. Proses Hapus & Cleanup File Fisik
                    $page = \App\Models\Webpage::find($id);
                    if ($page) {
                        // Batasi penghapusan berdasarkan paramStatus (Logika Keamanan Anda)
                        $query = \App\Models\Webpage::where('id', $id);
                        if ($request->paramStatus === 'prolog-web') {
                            $query->where('id', 'like', '%prolog-web%')->whereNotIn('id', ['webpage-section-prolog-web-1', 'webpage']);
                        } elseif ($request->paramStatus === 'prolog-emodul') {
                            $query->where('id', 'like', '%prolog-emodul%')->whereNotIn('id', ['webpage-section-prolog-emodul-1', 'webpage']);
                        } else {
                            $query->where('id', 'not like', '%prolog-web%')
                                ->where('id', 'not like', '%prolog-emodul%')
                                ->whereNotIn('id', ['webpage-section-footer', 'webpage']);
                        }
                        $query->delete();
                    }
                }
            }

            DB::commit();
            session(['urlMap' => $urlMap]);

            return response()->json(['success' => true, 'message' => 'Data berhasil diperbarui']);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function clearImagePage() {
        // Gunakan cursor atau chunk agar tidak makan RAM besar jika ribuan baris
        $allPages = Page::select('style', 'content')->get();
        
        // Satukan semua teks untuk pengecekan cepat
        $megaContent = $allPages->pluck('style')->implode(' ') . ' ' . $allPages->pluck('content')->implode(' ');

        // Ambil semua file dari DB
        $fileDbRecords = FileMedia::where('id', 'not like', "form-%")->get();
        $deletedCount = 0;

        foreach ($fileDbRecords as $fileRecord) {
            $filename = $fileRecord->id;
            
            // Pastikan filename tidak kosong dan cek keberadaannya
            if ($filename && !str_contains($megaContent, $filename)) {
                $filePath = public_path('media/' . $filename);
                
                // Hapus fisik
                if (File::exists($filePath)) {
                    File::delete($filePath);
                }
                
                // Hapus record DB
                $fileRecord->delete();
                $deletedCount++;
            }
        }

        return response()->json([
            'success' => true,
            'message' => "$deletedCount file tidak terpakai telah dibersihkan."
        ]);
    }

    public function render()
    {
        return view('livewire.admin.web-page')->layout('layouts.pageEdit');
    }
}
