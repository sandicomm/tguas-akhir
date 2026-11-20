<?php

namespace Database\Seeders;

use App\Models\Questions;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Questions::create([
            'question' => 'type here 1',
            'section_id' => 1,
            'order' => 1
        ]);
    }
}
