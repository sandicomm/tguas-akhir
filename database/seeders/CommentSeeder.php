<?php

namespace Database\Seeders;

use App\Models\Comments;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Comments::create([
            'name' => 'Admin',
            'comment' => 'Halo sobat',
            'is_admin' => 1,
        ]);
    }
}
