<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\PreTestToken;
use App\Models\Form;

use Illuminate\Support\Str;

class ValidationTokenForm
{
    
public function handle($request, Closure $next)
{
    // 1. Ambil placement dari parameter route
    $placement = $request->route('placement');

    // Sinkronkan halaman yang sedang dikunjungi
    if (Str::contains($placement, 'emodul')) {
        session(['page_visited' => 'emodul']);
    } elseif (Str::contains($placement, 'interaktif')) {
        session(['page_visited' => 'interaktif']);
    }

    // 2. Ambil form yang sedang diakses
    $form = Form::where('placement', $placement)
        ->select('placement', 'collect_email', 'must_fill')
        ->first();

    // 3. Jika form tidak ditemukan, kembalikan ke halaman modul
    if (!$form) {
        if (Str::contains($placement, 'emodul')) {
            return redirect()->route('emodul');
        } else if (Str::contains($placement, 'interaktif')) {
            return redirect()->route('interaktif');
        }

        abort(404);
    }

    // 4. Jika membuka post-test, periksa pre-test yang sesuai
    if (Str::startsWith($placement, 'post-test-')) {
        // post-test-interaktif menjadi pre-test-interaktif
        $prePlacement = 'pre-test-' . Str::after($placement,'post-test-');

        $formPre = Form::where('placement', $prePlacement)
            ->select('placement', 'must_fill')
            ->first();

        // Tolak akses hanya jika pre-test wajib dan belum selesai
        if ($formPre && $formPre->must_fill == 1 && !session($prePlacement . '_done')) {
            return redirect()->route('form-test', ['placement' => $prePlacement])->with('error','Anda harus menyelesaikan pre-test terlebih dahulu.');
        }
    }

    // 5. Jika form tidak membutuhkan email, izinkan akses
    //dd($form);
    if ($form->collect_email == 0) {
        return $next($request);
    }

    // 6. Jika email sudah diverifikasi, izinkan akses
    if (session('responden_email') && session('pre_test_verified')) {
        return $next($request);
    }

    // 7. Jika membutuhkan email, periksa token
    $tokenValue = $request->query('token');

    if (!$tokenValue) {
        return redirect()->route('cek-email.email', ['placement' => $placement])->with('message','Harap masukkan email terlebih dahulu');
    }

    // 8. Pastikan status verifikasi terpenuhi
    if ($form->collect_email == 1 && !session('pre_test_verified')) {
        return redirect()->route('cek-email.email', ['placement' => $placement]);
    }

    return $next($request);
}

}
