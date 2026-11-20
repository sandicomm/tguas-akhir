<?php

namespace Database\Seeders;

use App\Models\Form;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FormSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Form::create([
            'form_name' => 'Form Test',
            'placement' => 'pre-test-interaktif',
            'collect_email' => 0,
            'one_attempt' => 0,
            'must_fill' => 0,
        ]);
    }
}
