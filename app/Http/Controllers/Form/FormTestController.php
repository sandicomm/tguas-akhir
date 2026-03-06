<?php

namespace App\Http\Controllers\Form;

use App\Models\Form;
use Illuminate\Http\Request;
use App\Models\PreTestToken;

class FormTestController extends \App\Http\Controllers\Controller
{
    public function verify(string $token, $placement)
    {
        $tokenData = PreTestToken::where('token', $token)
            ->where('expired_at', '>', now())
            ->first();

        if (!$tokenData) {
            abort(403, 'Link tidak valid atau sudah kadaluarsa.');
        }

        // simpan ke session (ini PENTING)
        session([
            'pre_test_verified' => true,
            'responden_email'   => $tokenData->email,
            'form_id'           => $tokenData->form_id,
        ]);

        $tokenData->delete();

        // redirect ke form pre-test
        return redirect()->route('form-test', $placement);
    }
}
