<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Questions extends Model
{
    use HasFactory;
    protected $fillable = [
        'question',
        'rules',
        'section_id',
        'order'
        ];
    public function answers(){
       return $this->hasMany(Answers::class, 'question_id');
    }

    public function section() {
        return $this->belongsTo(Sections::class, 'section_id');
    }

}
