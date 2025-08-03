<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Symfony\Component\Console\Question\Question;

class input_type extends Model
{
    protected $fillable = [
        'input_type',
        ];

    public function question(){
       return $this->hasMany(Question::class, 'input_type');
    }

    public function response() {
        return $this->hasMany(Responses::class, 'input_type');
    }
}
