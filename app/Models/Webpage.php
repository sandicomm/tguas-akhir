<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Webpage extends Model
{
        protected $table = 'webpage';
        protected $primaryKey = 'id';
        public $incrementing = false;
        protected $keyType = 'string';

        protected $fillable = [
        'id',
        'type',
        'style',
        'content',
        'element_count',
        'element_order',
        ];
}
