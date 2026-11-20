<?php

namespace Database\Seeders;

use App\Models\Emodul;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmodulSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Emodul::create([
            'judul' => 'Test',
            'penyusun' => 'penyusun emodul',
            'file_path' => 'media/Test.pdf',
        ]);
    }
}
