<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Emodul extends Model
{
    protected $fillable = [
        'judul',
        'penyusun',
        'file_path',
    ];
}
