<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comments extends Model
{
    protected $fillable = ['name', 'comment', 'parent_id', 'is_admin'];

    public function parent()
    {
        return $this->belongsTo(Comments::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(Comments::class, 'parent_id');
    }

    // 3. Relasi rekursif untuk mengambil anak beserta cucu-cucunya
    public function allReplies()
    {
        return $this->replies()->with('allReplies');
    }

    // 4. [PENTING] Fungsi helper untuk meratakan (flatten) array
    // Ini akan mengubah struktur pohon menjadi satu list panjang
    public function getFlatRepliesAttribute()
    {
        $replies = collect([]);

        foreach ($this->allReplies as $reply) {
            $replies->push($reply);
            // Gabungkan dengan anak-anaknya si reply ini
            $replies = $replies->merge($reply->flat_replies);
        }

        return $replies->sortBy('created_at'); // Urutkan berdasarkan waktu
    }
}
