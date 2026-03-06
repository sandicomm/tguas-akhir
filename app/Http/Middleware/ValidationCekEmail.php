<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Form;
use Illuminate\Support\Str;

class ValidationCekEmail
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $placement = $request->route('placement');
        $form = Form::where('placement', $placement)->select('collect_email')->first();
        $formPre = Form::where('placement', 'pre-test-interaktif')->select('must_fill')->first();

        if ($formPre?->must_fill == 1 && Str::contains($placement, 'post') && !session('pre_test_done')) {
            // Gunakan nama route yang sudah Anda definisikan di web.php
            return redirect()->route('form-test', ['placement' => 'pre-test-interaktif']);
        }

        if($form?->collect_email == 0){
            return redirect()
                ->route('form-test', ['placement' => $placement]);
        }
        return $next($request);
    }
}
