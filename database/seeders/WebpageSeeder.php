<?php

namespace Database\Seeders;

use App\Models\Webpage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WebpageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
            $items = [
        [
            'id' => 'webpage',
            'type' => 'parent-section',
            'element_order' => 0,
            'element_count' => 1,
        ],
        [
            'id' => 'webpage-section-prolog-web-1',
            'type' => 'section',
            'style' => 'justify-content: center; align-items: center;',
            'element_order' => 1,
            'element_count' => 1,
        ],
        [
            'id' => 'field-element-section-prolog-web-1-1',
            'type' => 'field',
            'style' => 'margin: 0px 0px 40px;',
            'content' => '<div style="text-align: center;"><b style="color: rgb(0, 0, 0); font-family: Arial; font-size: xx-large;">Selamat datang di prolog</div>',
            'element_order' => 1,
        ],
        [
            'id' => 'field-btn-next-prolog-web-1',
            'type' => 'btn-prolog',
            'style' => 'font-weight: 400;text-align: center;vertical-align: middle;cursor: pointer;    user-select: none;background-color:rgba(0,75,135,0.6);  padding: 1rem 1.5rem;font-size: 1rem; border-radius: 0.375rem;margin-top: 20px;width: 200px;',
            'content' => '<font color="#000000"><b>Dashboard</b></font>',
            'element_order' => 99,
        ],
        [
            'id' => 'field-btn-next-prolog-emodul-1',
            'type' => 'btn-prolog',
            'style' => 'font-weight: 400;text-align: center;vertical-align: middle;cursor: pointer;user-select: none;background-color:rgba(0,75,135,0.6);  padding: 1rem 1.5rem;font-size: 1rem; border-radius: 0.375rem;margin-top: 20px;width: 200px;',
            'content' => '<font color="#000000">E-Modul</font>',
            'element_order' => 99,
        ],
        [
            'id' => 'webpage-section-footer',
            'type' => 'section',
            'style' => 'background-size: cover; background-position: center center; justify-content: start; align-items: start; background-color: rgba(0, 0, 0, 0.52);justify-content: start; align-items: start;',
            'element_order' => 0,
            'element_count' => 1,
        ],
        [
            'id' => 'webpage-section-1',
            'type' => 'section',
            'style' => 'justify-content: center; align-items: center;position: relative; min-height: 100dvh;',
            'element_order' => 0,
            'element_count' => 1,
        ],
        [
            'id' => 'field-element-section-footer-1',
            'type' => 'field',
            'content' => '<font color="#ffffff" face="Times New Roman" size="6"><b>Smart Health Diabetes</b></font>',
            'element_order' => 0,
            'element_count' => 1,
        ],
        [
            'id' => 'field-element-section-1-1',
            'type' => 'field',
            'content' => '<div style="text-align:center;"><b style="color:rgb(0,0,0);font-family:"Times New Roman";"><font size="7">Smart Health Diabetes</font></b></div>',
            'element_order' => 1,
            'element_count' => 0,
        ],
    ];

    foreach ($items as $item) {
        Webpage::create($item);
    }

    }
}
