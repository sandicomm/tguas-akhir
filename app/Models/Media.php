<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'file_path', 'type', 'sumber','link'];

    public function getFileUrlAttribute()
    {
        return Storage::url($this->file_path);
    }
}
