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
        // 1. Ambil nama route, bukan query
        $placement = $request->route('placement');
        if(Str::contains($placement, 'emodul')){
            session(['page_visited'=> 'emodul']);
        }else if(Str::contains($placement, 'interaktif')){
            session(['page_visited' => 'interaktif']);
        }

        // 2. Ambil 1 form saja
        $form = Form::where('placement', $placement)->select('collect_email', 'must_fill')->first();
        $formPre = Form::where('placement', 'pre-test-interaktif')->select('must_fill')->first();

        // Kalau form tidak ditemukan
        if (!$form) {
             if(Str::contains($placement, 'emodul')){
                return redirect()->route('emodul');
            }else if(Str::contains($placement, 'interaktif')){
                return redirect()->route('interaktif');
            }
        }
      
        if ($formPre?->must_fill == 1 && Str::contains($placement, 'post') && !session('pre_test_done')) {
            // Gunakan nama route yang sudah Anda definisikan di web.php
            return redirect()->route('form-test', ['placement' => 'pre-test-interaktif']);
        }

        // 3. Kalau collect_email = 0 → bebas masuk
        if ($form?->collect_email == 0) {
            return $next($request);
        }

        if (session('responden_email') && session('pre_test_verified')) {
            return $next($request);
        }

        // 4. collect_email = 1 → WAJIB token
        $tokenValue = $request->query('token');

        if (!$tokenValue) {
            return redirect()
                ->route('cek-email.email', ['placement' => $placement])
                ->with('message', 'Harap masukkan email terlebih dahulu');
        }

        if ($form?->collect_email == 1 && !session('pre_test_verified')) {
            return redirect()->route('cek-email.email', ['placement' => $placement]);
        }

        return $next($request);
    }
}
