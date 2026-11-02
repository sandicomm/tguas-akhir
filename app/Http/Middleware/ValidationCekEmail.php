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
        // 1. Ambil placement dan data form
        $placement = $request->route('placement');

        $form = Form::where('placement', $placement)
            ->select('collect_email')
            ->first();

        // 2. Jika sedang membuka halaman email post-test,
        // periksa apakah pre-test yang sesuai sudah selesai
        //dd('uhuy',$placement);
        if (Str::startsWith($placement, 'post-test-')) {
            $prePlacement = 'pre-test-' . Str::after($placement,'post-test-' );

            $formPre = Form::where('placement', $prePlacement)
                ->select('must_fill')
                ->first();

            if ($formPre?->must_fill == 1 && !session($prePlacement . '_done')) {
                return redirect()->route('form-test', ['placement' => $prePlacement])->with('error','Anda harus menyelesaikan pre-test terlebih dahulu.');
            }
        }

        // 3. Jika tidak membutuhkan email, arahkan langsung ke form
        if ($form?->collect_email == 0) {
            return redirect()->route('form-test', ['placement' => $placement]);
        }

        return $next($request);
    }

}
