<?php

namespace App\Http\Controllers\Form;

use Log;
use App\Models\Form;
use App\Models\Responses;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\PreTestToken;

use App\Notifications\SendFormLinkNotification;
use Illuminate\Support\Facades\Notification;

class CekEmailController extends  \App\Http\Controllers\Controller
{
    public function cek_email(Request $request){
        //$formIds = Responses::whereHas('responden', function ($query) use ($request) {
            //    $query->where('email', $request->input('responden_email'));
           // })
            //->distinct()
            //->pluck('form_id'); // Ambil hanya kolom form_id

        $dbFormIds = Responses::whereHas('responden', function ($query) use ($request) {
                    $query->where('email', $request->input('responden_email'));
            })
            ->distinct()
            ->pluck('form_id'); // Contoh hasil: [1, 2]

        // 2. Ambil ID form yang sudah ada di session anonim sebelumnya
        $existingFormIds = collect(session('already_fill_form', []))->flatten(); // flatten() memastikan array awal 100% flat
        
        try {
            // Validasi berhasil
            $request->validate([
                'responden_email' => 'required|email'
            ], [
                'responden_email.email' => 'Email tidak valid',
                'responden_email.required' => 'Email harus diisi',
            ]);

            $form = Form::where('placement', $request['placement'])->select('id','form_name','placement','collect_email','one_attempt','must_fill')->first();

            $mergedFormIds = collect($existingFormIds)
                ->merge(collect($dbFormIds))
                ->push($form->id)
                ->unique()
                ->values();

            // Simpan ID form ke session.
            session([
                'already_fill_form' => $mergedFormIds->toArray(),
            ]);

            // Placement yang perlu memiliki session _done.
            $trackedPlacements = [
                'pre-test-interaktif',
                'post-test-interaktif',
                'pre-test-emodul',
                'post-test-emodul',
            ];

            // Cari form berdasarkan ID yang ada di mergedFormIds.
            $completedForms = Form::whereIn('id', $mergedFormIds->all())
                ->whereIn('placement', $trackedPlacements)
                ->get(['id', 'placement']);

            // Tandai setiap placement yang ditemukan sebagai selesai.
            $doneSessions = [];

            foreach ($completedForms as $completedForm) {
                $doneSessions[$completedForm->placement . '_done'] = true;
            }

            // Simpan seluruh session _done sekaligus.
            if (!empty($doneSessions)) {
                session()->put($doneSessions);
            }

            // Pertahankan logika one_attempt untuk form yang sedang disubmit.
            if ((int) $form->one_attempt === 1) {
                session()->put([
                    $form->placement . '_done' => true,
                    'responden_email' => $request->input('responden_email'),
                    'form_name' => $form->form_name,
                ]);
            }
            
            // hapus token lama
            PreTestToken::where('email', $request->responden_email)
                ->where('expired_at', '<', now())
                ->delete();
                
            // ========= GENERATE TOKEN ==============
            $token = Str::uuid();

            PreTestToken::create([
                'email'      => $request->responden_email,
                'form_id'    => $form->id,
                'token'      => $token,
                'expired_at'=> now()->addMinutes(30),
            ]);

            // =============== KIRIM NOTIFIKASI EMAIL==================
            Notification::route('mail', $request->responden_email)
                ->notify(new SendFormLinkNotification($token, $request['placement']));

            return redirect()->route('cek-email.email', $request['placement'])
                ->with('success', 'Link verifikasi telah dikirim ke email Anda, Cek folder spam jika tidak ada.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
