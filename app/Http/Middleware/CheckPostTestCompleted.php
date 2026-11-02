<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Form;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPostTestCompleted
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    
    public function handle(Request $request, Closure $next): Response
    {
        $page = session('page_visited');
        $activePage = session('page_visit_fix');
        // Pastikan session valid & halaman yang diakses sinkron
        
        //session(['form_visit'=> '']);
        //dd($page, $activePage, session()->all());
        if ($page && $activePage && $page === $activePage) {
            
            $form = Form::where('placement', 'like', "post-test-{$page}%")->orderBy('id')->first();
            //session(['form_visit'=> $form->placement]);
            $mustFill = $form && $form->must_fill == 1;
            
            $alreadyFilledForms = collect(session('already_fill_form', []));
            $notDoneYet = $form && !$alreadyFilledForms->contains($form->id);
            //dd($page, $activePage, $form, $alreadyFilledForms->contains($form->id), $notDoneYet, session()->all());
            if ($mustFill && $notDoneYet) {
                
                // 1. Izinkan akses Form Post-Test spesifik atau Verifikasi Email
                $placementParam = $request->route('placement') ?? '';
                if (str_contains($placementParam, 'post-test') || $request->is('form-test/verify/*')) {
                    return $next($request);
                }

                // 2. Akses internal area modul
                if ($page === 'emodul') {
                    if ($request->is('emodul/*')) {
                        return $next($request);
                    }
                } else {
                    if ($request->is($page) || $request->is($page.'/*')) {
                        return $next($request);
                    }
                }
                
                // 3. Paksa redirect kembali ke modul asal jika mencoba kabur
                if ($page === 'emodul') {
                    $lastUrl = session('last_emodul_url');
                    
                    if ($lastUrl) {
                        return redirect()->route('emodul.preview', ['url' => $lastUrl])
                        ->with('error', 'Anda wajib menyelesaikan Post Test pada halaman terakhir emodul.');
                    }
                    
                    return redirect()->route('emodul')
                    ->with('error', 'Anda wajib menyelesaikan Post Test pada halaman terakhir emodul.');
                } 
                
                if ($page === 'interaktif') {
                    
                    //dd($request->route('placement'),session()->all(), request()->session()->all());
                    return redirect()->route('interaktif')
                                    ->with('error', 'Anda wajib menyelesaikan Post Test terlebih dahulu.');
                }
            }
        }

        return $next($request);
    }
}