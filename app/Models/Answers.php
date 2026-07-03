<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Answers extends Model
{
    use HasFactory;
    protected $fillable = [
        'question_id',
        'answer',
        'value',
        ];
    public function question(){
        return $this->belongsTo(Questions::class, 'question_id');
    }
}
