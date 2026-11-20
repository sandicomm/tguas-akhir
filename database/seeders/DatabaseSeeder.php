<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Database\Seeders\FormSeeder;
use Database\Seeders\SectionSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(1)->create();

        $this->call([
           FormSeeder::class, 
           SectionSeeder::class,
           QuestionSeeder::class,
           AnswerSeeder::class,
           EmodulSeeder::class,
           RespondenSeeder::class,
           ResponseSeeder::class,
           CommentSeeder::class,
           WebpageSeeder::class,
           MediaSeeder::class
        ]);
    }
}
