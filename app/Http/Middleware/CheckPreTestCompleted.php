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
        $formVisit=session('form_visit');
        $testDone='';
        $form = '';
        $msg = '';
        
        if(str_contains($formVisit, 'pre')){
            $form = Form::where('placement', 'like',"pre-test-{$page}%")->orderBy('id')->first();
            $testDone = !session($form->placement . '_done');
            $msg = "Anda harus mengisi pre-test terlebih dahulu.";
            
        }else if(str_contains($formVisit, 'post')){
            $form = Form::where('placement', 'like',"post-test-{$page}%")->orderBy('id')->first();
            $testDone = !session($form->placement . '_done');
            $msg = "Anda harus mengisi post-test terlebih dahulu.";
        }
        
        // Kalau must_fill == 1 dan belum isi, wajib isi dulu
        //dd($page,$form,$testDone,$formVisit, $form && $form->must_fill == 1 && $testDone, session()->all(), request()->session()->all());
        if ($form && $form->must_fill == 1 && $testDone) {
            if($form->collect_email == 1){
                return redirect()->route('cek-email.email', ['placement' => $form->placement])->with('error', $msg);
            }else{
                return redirect()->route('form-test', ['placement' => $form->placement])->with('error', $msg);
            }
        }
        
        return $next($request);
    }
}
