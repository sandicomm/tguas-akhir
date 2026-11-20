<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Sections;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Sections::create([
            'name' => 'Section 1',
            'description' => 'Deskripsi section',
            'order' => 1,
            'form_id'=>1
        ]);
    }
}
