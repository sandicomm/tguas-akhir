<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Responden extends Model
{
    protected $fillable = [
        'email'
    ];

    public function responses()
    {
        return $this->hasMany(Responses::class);
    }
}
