<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebpageVisited extends Model
{
    //
    protected $fillable = ['user_id','expires_at'];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
