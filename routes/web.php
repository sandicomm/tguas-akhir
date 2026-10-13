<?php
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;
use Spatie\Sitemap\Tags\Url;
use Spatie\Sitemap\Sitemap;

use App\Livewire\Admin\User;
use App\Livewire\Admin\Forms;
use App\Livewire\Admin\Emodul;
use App\Livewire\Admin\WebPage;
use App\Livewire\Admin\Comments;
use App\Livewire\Admin\Dashboard;
use App\Livewire\Admin\Responden;
use App\Livewire\Admin\Responses;
use App\Livewire\Admin\FormDetail;
use App\Livewire\Admin\MediaManager;

use App\Livewire\Form\FormTest;
use App\Livewire\Form\FormTestEmail;
use App\Livewire\PrologController;

use App\Livewire\Interaktif\MediaController;
use App\Livewire\Emodul\PreviewEmodul;

use App\Http\Controllers\Form\ResponsesController;
use App\Http\Controllers\Form\CekEmailController;
use App\Http\Controllers\Form\FormTestController;

use App\Http\Middleware\ValidationCekEmail;
use App\Http\Middleware\ValidationTokenForm;
use App\Http\Middleware\CheckPreTestCompleted;
use App\Http\Middleware\CheckPostTestCompleted;
use App\Livewire\Emodul\PageEmodul;
use App\Livewire\Interaktif\CommentSection;
use App\Livewire\PageInteraktif;

Route::get('/generate-sitemap', function () {
    Sitemap::create()
        ->add(Url::create('/'))
        ->add(Url::create('/dashboard'))
        ->writeToFile(public_path('sitemap.xml'));

    return 'Sitemap generated';
});

//Route::get('/dashboard', Dashboard::class)->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin', Dashboard::class)->middleware(['auth', 'verified'])->name('admin.dashboard');
Route::get('/admin/forms', Forms::class)->middleware(['auth', 'verified'])->name('admin.forms');
Route::get('/admin/forms/{id}', FormDetail::class)->middleware(['auth', 'verified'])->name('admin.form.detail');
Route::delete('/admin/forms/{id}', [FormDetail::class, 'delete'])->middleware(['auth', 'verified'])->name('admin.form.delete');
Route::post('/admin/forms/{id}/copy', [FormDetail::class, 'copy'])->middleware(['auth', 'verified'])->name('admin.form.copy');
Route::post('/admin/forms/cek/{id}', [FormDetail::class, 'cekStatus'])->middleware(['auth', 'verified'])->name('admin.form.cek');
Route::post('/admin/forms/update-visit/{id}', [FormDetail::class, 'updateVisit'])->middleware(['auth', 'verified'])->name('admin.form.updateVisit');

Route::post('/admin/form/update', [FormDetail::class, 'updateForm'])->middleware(['auth', 'verified'])->name('admin.form.update');

Route::get('/admin/user', User::class)->middleware(['auth', 'verified'])->name('admin.users');
Route::get('/admin/responden', Responden::class)->middleware(['auth', 'verified'])->name('admin.responden');
Route::get('/admin/responses', Responses::class)->middleware(['auth', 'verified'])->name('admin.responses');
Route::get('/admin/comments', Comments::class)->middleware(['auth', 'verified'])->name('admin.comments');

Route::get('/admin/media-manager', MediaManager::class)->middleware(['auth', 'verified'])->name('admin.media');
Route::get('/admin/emodul', Emodul::class)->middleware(['auth', 'verified'])->name('admin.emodul');
Route::get('/admin/webpage/{params}', WebPage::class)->middleware(['auth', 'verified'])->name('admin.webpage');

Route::post('/admin/webpage/store', [WebPage::class, 'store'])->middleware(['auth', 'verified'])->name('admin.webpage.store');
Route::post('/admin/webpage/clear', [WebPage::class, 'clearImagePage'])->middleware(['auth', 'verified'])->name('admin.webpage.clearImage');
Route::post('/admin/webpage/cek', [WebPage::class, 'cekStatus'])->middleware(['auth', 'verified'])->name('admin.webpage.cek');
Route::post('/admin/webpage/update-visit', [WebPage::class, 'updateVisit'])->middleware(['auth', 'verified'])->name('admin.webpage.updateVisit');

//------------------ MEDIA EDUKASI --------------
Route::post('/form-test/store', [ResponsesController::class, 'store'])->name('form-test.store');
Route::post('/cek-email', [CekEmailController::class, 'cek_email'])
    ->name('cek-email.cek');

Route::middleware([CheckPostTestCompleted::class])->group(function () {
    Route::get('/form-test/{placement}', FormTest::class)->middleware([ValidationTokenForm::class])->name('form-test');
    
    Route::get('/form-test/verify/{token}/{placement}', [FormTestController::class, 'verify'])
        ->name('form-test.verify');
    
    Route::get('/cek-email/{placement}', FormTestEmail::class)->middleware(ValidationCekEmail::class)
        ->name('cek-email.email');
    
    Route::get('/', PrologController::class)->name('home');
    
    Route::middleware([CheckPreTestCompleted::class])->group(function () {
        Route::get('/interaktif', PageInteraktif::class)->name('interaktif');
        Route::get('/interaktif/{type}', MediaController::class)->name('interaktif.media');
        Route::post('/interaktif/comment/store', [CommentSection::class, 'store'])->name('interaktif.comment.store');

        Route::get('/emodul', PageEmodul::class)->name('emodul');
        Route::get('/emodul/priview/{url}', PreviewEmodul::class)->name('emodul.preview');
    });
});

Route::get('/admin/export', function (){
    return view('exports.scoring');
})->name('export');

Route::get('/livewire', Forms::class)->name('livewire');
require __DIR__.'/auth.php';
