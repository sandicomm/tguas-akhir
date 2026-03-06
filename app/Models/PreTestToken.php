<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreTestToken extends Model
{
    protected $fillable = [
        'email',
        'form_id',
        'token',
        'expired_at',
    ];

    protected $casts = [
        'expired_at' => 'datetime',
    ];
}
