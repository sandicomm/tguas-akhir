<?php

namespace App\Livewire\Dashboard;

use App\Models\Form;
use App\Models\Responses;
use App\Models\Responden;
use Livewire\Component;
use Livewire\Attributes\Lazy;
use Livewire\Attributes\On;

class TotalResponded extends Component
{
    public $groupedResponses;
    public $respondenTerdaftar;
    public $globalStats;
    public $totalSemuaResponden;
    public $respondenAnonim;

    public function mount()
    {
        $this->calculateTotalResponses();
    }

    public function calculateTotalResponses()
    {
        try {
            // Ambil ID form berdasarkan penempatan
            $formGroup = Form::select('id', 'placement')->get()->groupBy('placement');
            
            $ids = [
                // Gunakan collect() untuk membungkus hasil filter agar selalu menjadi koleksi
                'interaktif' => collect($formGroup->filter(fn($v, $k) => str_contains((string)$k, 'interaktif')))->flatten(1)->pluck('id'),
                
                'emodul'     => collect($formGroup->filter(fn($v, $k) => str_contains((string)$k, 'emodul')))->flatten(1)->pluck('id'),

                // Pastikan key ada sebelum melakukan pluck, atau gunakan get()
                'interaktif_pre'  => $formGroup->get('pre-test-interaktif', collect())->pluck('id'),
                'interaktif_post' => $formGroup->get('post-test-interaktif', collect())->pluck('id'),
                'emodul_pre'      => $formGroup->get('pre-test-emodul', collect())->pluck('id'),
                'emodul_post'     => $formGroup->get('post-test-emodul', collect())->pluck('id'),
            ];            
            
            $this->globalStats = Responses::query()
                ->selectRaw("
                    COUNT(DISTINCT COALESCE(responden_id, uuid)) as total_semua,
                    COUNT(DISTINCT CASE WHEN attempt != 0 THEN COALESCE(responden_id, uuid) END) as terdaftar,
                    COUNT(DISTINCT CASE WHEN attempt = 0 THEN COALESCE(responden_id, uuid) END) as anonim
                ")
                ->first();
           
            $this->totalSemuaResponden = $this->globalStats->total_semua;
            $this->respondenTerdaftar   = $this->globalStats->terdaftar;
            $this->respondenAnonim      = $this->globalStats->anonim;

            // 2. HITUNG STATS PER KATEGORI (INTERAKTIF & EMODUL)
            // Kita gunakan fungsi helper untuk melakukan query spesifik
            $this->groupedResponses = collect([
                'interaktif' => $this->getCategoryStats($ids['interaktif'], $ids['interaktif_pre'], $ids['interaktif_post']),
                'emodul'     => $this->getCategoryStats($ids['emodul'], $ids['emodul_pre'], $ids['emodul_post']),
            ]);

        } catch (\Exception $e) {
           // dd($e->getMessage(), $e->getLine(), $e->getFile()); 
            session()->flash('error', "Gagal: " . $e->getMessage());
        }
    }

    /**
    * Fungsi ini melakukan perhitungan di level Database, bukan PHP Memory.
    */
    private function getCategoryStats($allIds, $preIds, $postIds)
    {
        // Hitung Responden Unik & Total Response
        $stats = Responses::whereIn('form_id', $allIds)
            ->selectRaw("
                COUNT(DISTINCT COALESCE(responden_id, uuid)) as total_orang,
                COUNT(DISTINCT CASE WHEN attempt != 0 THEN COALESCE(responden_id, uuid) END) as email,
                COUNT(DISTINCT CASE WHEN attempt = 0 THEN COALESCE(responden_id, uuid) END) as no_email,
                COUNT(*) as total_records
            ")
            ->first();
    
        // Hitung spesifik Pre-Test & Post-Test
        $preStats = Responses::whereIn('form_id', $preIds)
            ->selectRaw("
                COUNT(DISTINCT COALESCE(responden_id, uuid), form_id) as total,
                COUNT(DISTINCT CASE WHEN attempt != 0 THEN COALESCE(responden_id, uuid) END) as email,
                COUNT(DISTINCT CASE WHEN attempt = 0 THEN COALESCE(responden_id, uuid) END) as no_email
            ")->first();

        $postStats = Responses::whereIn('form_id', $postIds)
            ->selectRaw("
                COUNT(DISTINCT COALESCE(responden_id, uuid), form_id) as total,
                COUNT(DISTINCT CASE WHEN attempt != 0 THEN COALESCE(responden_id, uuid) END) as email,
                COUNT(DISTINCT CASE WHEN attempt = 0 THEN COALESCE(responden_id, uuid) END) as no_email
            ")->first();

        return [
            'responden' => [
                'count'    => $stats->total_orang,
                'email'    => $stats->email,
                'no-email' => $stats->no_email,
            ],
            'responses' => [
                'pre-test'  => ['count' => $preStats->total, 'email' => $preStats->email, 'no-email' => $preStats->no_email],
                'post-test' => ['count' => $postStats->total, 'email' => $postStats->email, 'no-email' => $postStats->no_email],
            ],
        ];
    }

    public function render()
    {
        return view('livewire.dashboard.total-responded');
    }
}
