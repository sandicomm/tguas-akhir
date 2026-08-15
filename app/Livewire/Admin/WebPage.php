<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Livewire\WithFileUploads;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use App\Models\Webpage as Page;
use App\Models\File as FileMedia;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Mews\Purifier\Facades\Purifier;

use App\Models\EditFormVisited;
use Illuminate\Support\Facades\Auth;
use App\Models\WebpageVisited;

class WebPage extends Component
{
    use WithFileUploads;

    public $webpage;
    public $file;
    public $param;
    public $dataStyle;
    public $dataStylePuri;
    public $dataContent;

    public function mount($params)
    {
        try{
            $userId = Auth::id();
    
            EditFormVisited::where('user_id', $userId)->delete();
    
            WebpageVisited::where('expires_at', '<', Carbon::now())->delete();
            $visited = WebpageVisited::with('user')->first();
            
            if($visited && $visited->user_id != $userId){
                $namaUser = $visited->user ? $visited->user->name : 'User Lain';
                return redirect()->route('admin.dashboard')->with('error', "Menu ini sedang diakses oleh {$namaUser}.");
            }
    
            WebpageVisited::updateOrCreate(
                ['user_id' => $userId],
                ['expires_at' => Carbon::now()->addMinutes(7)]
            );
    
            $this->param = $params;
            
            $this->file = FileMedia::whereNot('id', 'like', 'form-%')->get();
            if ($params === 'prolog') {
                $this->webpage = Page::where('id', 'like', '%prolog-web%')->get();
            } else if ($params === 'prolog-emodul') {
                $this->webpage = Page::where('id', 'like', '%prolog-emodul%')->get();
            } else {
                $this->webpage = Page::where('id', 'not like', '%prolog%')->get();
            }
        }catch(\Exception $e){
            session()->flash('error','error muat halaman');
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
                    if($item['type'] == 'item-carousel'){
                        $this->dataStyle = $originalStyle;
                        $this->dataStylePuri = $style;
                        $this->dataContent = $content;
                    }

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

            WebpageVisited::updateOrCreate(
                ['user_id' => Auth::id()],
                ['expires_at' => Carbon::now()->addMinutes(7)]
            );

            return response()->json(['success' => true, 'message' => 'Data berhasil diperbarui', 'datano'=>$this->dataStyle, 'datapuri'=>$this->dataStylePuri,'datacontent'=>$this->dataContent]);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'error tambah data'], 500);
        }
    }

    public function clearImagePage() {
        try{
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
        }catch(\Exception $e){
            session()->flash('error', 'error clear image');
        }
    }

    public function cekStatus(){
        try{
            $cekExpires = WebpageVisited::where('user_id', Auth::user()->id)->where('expires_at', '<', Carbon::now())->first();
            if($cekExpires){
                $cekExpires->delete();
        
                session()->flash('error', 'Sesi akses menu telah berakhir atau di-reset dari sesi lain.');
                return response()->json([
                    'success' => true,
                    'redirect' => route('admin.dashboard'),
                    'message' => "Anda Afk dan dikeluarkan dari menu."
                ]);
            }
    
            return response()->json([
                'success' => false,
                'message' => "cek"
            ]);
        }catch(\Exception $e){
            session()->flash('error', 'error cek status visited');
            return response()->json([
                'success' => false,
                'message' => 'Error cek status aktif',
            ]);
        }
    }

    public function updateVisit()
    {
        try{
            $update = WebpageVisited::where('user_id', Auth::id())
                ->update(['expires_at' => Carbon::now()->addMinutes(7)]);
    
            if($update === 0){
                session()->flash('error', 'Sesi akses menu telah berakhir atau di-reset dari sesi lain.');
                return response()->json([
                        'success' => true,
                        'message' => "Anda terdeteksi tidak aktif maka anda dikeluarkan dari menu.",
                        'redirect' => route('admin.dashboard')
                    ]);
            }
    
            return response()->json(['success' => true]);
        }catch(\Exception $e){
            session()->flash('error', 'error update visit status');
            return response()->json(['success' => false, 'message'=> 'error update sesi']);
        }
    }

    public function render()
    {
        return view('livewire.admin.web-page')->layout('layouts.pageEdit');
    }
}
