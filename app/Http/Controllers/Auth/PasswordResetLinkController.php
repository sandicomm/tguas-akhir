<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\View\View;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): View
    {
        return view('auth.forgot-password');
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        // 1. Jika EMAIL BERHASIL TERKIRIM
        if ($status == Password::RESET_LINK_SENT) {
            return back()->with('status', 'Link reset password telah dikirim ke email Anda. Silakan cek inbox atau folder spam.');
        }

        // 2. Jika GAGAL (Email tidak ditemukan, AFK/Throttled, dll)
        $errorMessage = match ($status) {
            Password::INVALID_USER => 'Email tidak ditemukan.',
            Password::RESET_THROTTLED => 'Mohon tunggu beberapa saat sebelum meminta link baru.',
            default => 'Gagal mengirimkan link reset password. Silakan coba lagi nanti.',
        };

        return back()
            ->withInput($request->only('email'))
            ->withErrors(['email' => $errorMessage]);
    }
}
