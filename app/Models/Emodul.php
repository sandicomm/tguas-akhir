<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Emodul extends Model
{
    protected $fillable = [
        'judul',
        'penulis',
        'pengarang',
        'penerbit',
        'tahun_terbit',
        'halaman',
        'deskripsi',
        'thumbnail',
        'file_path',
    ];
}
