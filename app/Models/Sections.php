<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Sections extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'order',
        'form_id',
        ];

    public function questions() {
        return $this->hasMany(Questions::class, 'section_id');
    }

    public function scopeOfType($query, $type) {
        return $query->where('section_type', $type);
    }

    public function form()
    {
        return $this->belongsTo(Form::class);
    }
}
