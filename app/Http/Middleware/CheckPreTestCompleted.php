<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Form;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPreTestCompleted
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $page=session('page_visited');
        $form = Form::where('placement', 'like',"pre-test-{$page}%")->orderBy('id')->first();
        
        // Kalau must_fill == 1 dan belum isi, wajib isi dulu
        if ($form && $form->must_fill == 1 && !session('pre_test_done')) {
            if($form->collect_email == 1){
                return redirect()->route('cek-email.email', ['placement' => $form->placement])->with('messages', 'Anda harus mengisi pre-test terlebih dahulu.');
            }else{
                return redirect()->route('form-test', ['placement' => $form->placement])->with('messages', 'Anda harus mengisi pre-test terlebih dahulu.');
            }
        }
        
        return $next($request);
    }
}
