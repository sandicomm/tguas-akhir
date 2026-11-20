<?php

namespace Database\Seeders;

use App\Models\Responses;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResponseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Responses::create([
            'attempt' => 0,
            'form_id' => 1,
            'responden_id' => 1,
            'answer_id'=>1
        ]);
    }
}
