<?php

namespace Database\Seeders;

use App\Models\Answers;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       Answers::insert([[
            'question_id' => 1,
            'answer' => 'type here 1',
            'value' => 0
        ],[
            'question_id' => 1,
            'answer' => 'type here 2',
            'value' => 10
        ],[
            'question_id' => 1,
            'answer' => 'type here 3',
            'value' => 20
        ],]
        );
    }
}
