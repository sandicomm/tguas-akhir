<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FormController;
use App\Http\Controllers\ProfileController;

Route::get('/', App\Livewire\Dashboard::class)->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/forms', App\Livewire\Forms::class)->middleware(['auth', 'verified'])->name('forms');
Route::get('/forms/{id}', App\Livewire\FormDetail::class)->middleware(['auth', 'verified'])->name('form.detail');
Route::delete('/forms/{id}', [App\Livewire\FormDetail::class, 'delete'])->middleware(['auth', 'verified'])->name('form.delete');
Route::post('/forms/{id}/copy', [App\Livewire\FormDetail::class, 'copy'])->middleware(['auth', 'verified'])->name('form.copy');

Route::put('/form/update', [App\Livewire\FormDetail::class, 'updateForm'])->middleware(['auth', 'verified'])->name('form.update');

Route::get('/user', App\Livewire\User::class)->middleware(['auth', 'verified'])->name('users');
Route::get('/responden', App\Livewire\Responden::class)->middleware(['auth', 'verified'])->name('responden');
Route::get('/comments', App\Livewire\Comments::class)->middleware(['auth', 'verified'])->name('comments');

Route::get('/media', App\Livewire\MediaManager::class)->middleware(['auth', 'verified'])->name('media');
Route::get('/emodul', App\Livewire\Emodul::class)->middleware(['auth', 'verified'])->name('emodul');
Route::get('/webpage/{params}', App\Livewire\WebPage::class)->middleware(['auth', 'verified'])->name('webpage');

Route::post('/webpage/store', [App\Livewire\WebPage::class, 'store'])->middleware(['auth', 'verified'])->name('webpage/store');

Route::get('/export', function (){
    return view('exports.scoring');
})->name('export');

Route::get('/livewire', App\Livewire\Forms::class)->name('livewire');

Route::get('/pdf/{filename}', function ($filename) {
    $path = storage_path("app/public/media/{$filename}");

    if (!file_exists($path)) {
        abort(404, 'PDF not found.');
    }

    return response()->file($path, [
        'Access-Control-Allow-Origin' => 'http://127.0.0.1:8001',
        'Content-Type' => 'application/pdf',
    ]);
});

Route::get('/download/{filename}', function ($filename) {
    $path = public_path('storage/media/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->download($path);
})->where('filename', '.*');
require __DIR__.'/auth.php';
