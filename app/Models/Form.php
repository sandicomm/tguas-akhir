<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Form extends Model
{
    use HasFactory;
    protected $fillable = [
        'form_name',
        'placement',
        'collect_email',
        'one_attempt',
        'must_fill',
        ];
    public function sections()
    {
        return $this->hasMany(Sections::class);
    }
}
