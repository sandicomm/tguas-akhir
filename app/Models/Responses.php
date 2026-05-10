<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Responses extends Model
{
    protected $fillable = [
        'uuid',
        'responden_id',
        'form_id',
        'answer_id',
        'attempt',
    ];

    public function form()
    {
        return $this->belongsTo(Form::class);
    }
    
    public function responden()
    {
        return $this->belongsTo(Responden::class);
    }

    public function answer()
    {
        return $this->belongsTo(Answers::class, 'answer_id');
    }
}
