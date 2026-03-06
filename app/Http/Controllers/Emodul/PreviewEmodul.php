<?php
namespace App\Http\Controllers\Emodul;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\File;

class PreviewEmodul extends \App\Http\Controllers\Controller
{
    public function preview($url)
    {
        $decoded = base64_decode($url);
        
        // URL file di server 8000
        $fileUrl = "http://127.0.0.1:8000/" . $decoded;
        
        // Ambil file dari server 8000
        $response = Http::get($fileUrl);
        
        //dd($response->successful());
        if (!$response->successful()) {
            abort(404, "File tidak ditemukan di server 8000");
        }
        
        // Pastikan folder public/pdfs ada
        $pdfFolder = public_path('pdfs');
        if (!File::exists($pdfFolder)) {
            File::makeDirectory($pdfFolder, 0777, true);
        }

        // ✅ KOSONGKAN ISI FOLDER public/pdfs
        File::cleanDirectory($pdfFolder);

        // ✅ SIMPAN DENGAN NAMA TETAP
        $fileName = "emodul.pdf";
        $localPath = $pdfFolder . "/" . $fileName;

        file_put_contents($localPath, $response->body());
        // Kirim ke view (pakai file lokal)
        return view('livewire.pageEmodul.pdf.emodul', [
            'url' => "/pdfs/" . $fileName
        ]);
    }
}
