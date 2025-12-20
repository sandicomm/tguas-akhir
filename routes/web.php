<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FormController;
use App\Http\Controllers\ProfileController;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

Route::get('/generate-sitemap', function () {
    Sitemap::create()
        ->add(Url::create('/'))
        ->add(Url::create('/dashboard'))
        ->writeToFile(public_path('sitemap.xml'));

    return 'Sitemap generated';
});

Route::get('/', App\Livewire\Dashboard::class)->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/forms', App\Livewire\Forms::class)->middleware(['auth', 'verified'])->name('forms');
Route::get('/forms/{id}', App\Livewire\FormDetail::class)->middleware(['auth', 'verified'])->name('form.detail');
Route::delete('/forms/{id}', [App\Livewire\FormDetail::class, 'delete'])->middleware(['auth', 'verified'])->name('form.delete');
Route::post('/forms/{id}/copy', [App\Livewire\FormDetail::class, 'copy'])->middleware(['auth', 'verified'])->name('form.copy');

Route::put('/form/update', [App\Livewire\FormDetail::class, 'updateForm'])->middleware(['auth', 'verified'])->name('form.update');

Route::get('/user', App\Livewire\User::class)->middleware(['auth', 'verified'])->name('users');
Route::get('/responden', App\Livewire\Responden::class)->middleware(['auth', 'verified'])->name('responden');
Route::get('/comments', App\Livewire\Comments::class)->middleware(['auth', 'verified'])->name('comments');

Route::get('/media-manager', App\Livewire\MediaManager::class)->middleware(['auth', 'verified'])->name('media');
Route::get('/emodul', App\Livewire\Emodul::class)->middleware(['auth', 'verified'])->name('emodul');
Route::get('/webpage/{params}', App\Livewire\WebPage::class)->middleware(['auth', 'verified'])->name('webpage');

Route::post('/webpage/store', [App\Livewire\WebPage::class, 'store'])->middleware(['auth', 'verified'])->name('webpage/store');

Route::get('/export', function (){
    return view('exports.scoring');
})->name('export');

Route::get('/livewire', App\Livewire\Forms::class)->name('livewire');
require __DIR__.'/auth.php';
