<?php

namespace App\Http\Controllers\Form;

use Log;
use App\Models\Form;
use App\Models\Answers;
use App\Models\Responden;
use App\Models\Responses;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\PreTestToken;

use App\Mail\FormTestLinkMail;
use Illuminate\Support\Facades\Mail;

class CekEmailController extends  \App\Http\Controllers\Controller
{
    public function cek_email(Request $request){
        $formIds = Responses::whereHas('responden', function ($query) use ($request) {
                $query->where('email', $request->input('responden_email'));
            })
            ->distinct()
            ->pluck('form_id'); // Ambil hanya kolom form_id

        try {
            // Validasi berhasil
            $request->validate([
                'responden_email' => 'required|email'
            ], [
                'responden_email.email' => 'Email tidak valid',
                'responden_email.required' => 'Email harus diisi',
            ]);

            $form = Form::where('placement', $request['placement'])->select('id','form_name','collect_email','one_attempt','must_fill')->first();

            session([
                'already_fill_form' => $formIds,
            ]);
            // hapus token lama
            PreTestToken::where('email', $request->responden_email)
                ->where('expired_at', '<', now())
                ->delete();
                
            // =========================
            // ✅ GENERATE TOKEN
            // =========================
            $token = Str::uuid();

            PreTestToken::create([
                'email'      => $request->responden_email,
                'form_id'    => $form->id,
                'token'      => $token,
                'expired_at'=> now()->addMinutes(30),
            ]);

            // =========================
            // 📧 KIRIM EMAIL
            // =========================
            Mail::to($request->responden_email)
                ->send(new FormTestLinkMail($token,  $request['placement']));

            return redirect()->route('cek-email.email', $request['placement'])
                ->with('success', 'Link verifikasi telah dikirim ke email Anda.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
