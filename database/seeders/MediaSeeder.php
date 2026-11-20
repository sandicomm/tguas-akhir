<?php

namespace Database\Seeders;

use App\Models\Media;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Media::insert([
        [
            'title' => 'media poster',
            'file_path' => 'media/test_poster.png',
            'type' => 'image',
            'sumber' => 'test sumber',
            'link' => null,
        ],
        [
            'title' => 'media video',
            'file_path' => 'media/test_video.mp4',
            'type' => 'video',
            'sumber' => 'test sumber',
            'link' => null,
        ]
        ]);
    }
}
