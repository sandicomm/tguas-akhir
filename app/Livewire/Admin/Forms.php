<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use App\Models\Form as FormModel;
use App\Models\Sections;
use App\Models\Questions;
use App\Models\Responses;
use App\Models\Responden;
use Illuminate\Support\Facades\DB;

class Forms extends Component
{
    public $forms;
    public $formId;
    public $confirmDelete;

    public bool $isModalOpen = false;

    public function mount()
    {
        $this->forms = FormModel::all();
    }

    public function setStatsAction($id)
    {
        $this->reset(['formId', 'confirmDelete']);
        $this->formId = $id;
        $this->isModalOpen = true;
    }

    public function copy($id)
    {
        try{
            $originalForm = FormModel::with('sections.questions.answers')->find($id);

            if (!$originalForm) {
                session()->flash('error', 'Form tidak ditemukan.');
                return redirect()->route('admin.forms');
            }

            DB::transaction(function () use ($originalForm) {
                // 1️⃣ Salin Form
                $newForm = $originalForm->replicate();
                $newForm->placement = 'disable';
                $newForm->form_name = $originalForm->form_name . ' (Copy)';
                $newForm->save();

                // 2️⃣ Salin Sections
                foreach ($originalForm->sections as $section) {
                    $newSection = $section->replicate();
                    $newSection->form_id = $newForm->id;
                    $newSection->save();

                    // 3️⃣ Salin Questions
                    foreach ($section->questions as $question) {
                        $newQuestion = $question->replicate();
                        $newQuestion->section_id = $newSection->id;
                        $newQuestion->save();

                        // 4️⃣ Salin Answers
                        foreach ($question->answers as $answer) {
                            $newAnswer = $answer->replicate();
                            $newAnswer->question_id = $newQuestion->id;
                            $newAnswer->save();
                        }
                    }
                }
            });

            session()->flash('message', 'Form berhasil disalin.');
            return redirect()->route('admin.forms');
        }catch(\Exception $e){
            session()->flash('error', $e->getMessage());
        }
    }

    public function closeModal()
    {
        $this->isModalOpen = false;
    }

    public function delete()
{
    if (strtolower($this->confirmDelete) === 'hapus form') {
        try {
            DB::transaction(function () {
                // 1. Ambil ID responden yang mengisi form ini 
                // Kita ambil langsung dari relasi responses yang punya form_id tersebut
                $responderIds = Responden::whereHas('responses', function ($query) {
                    $query->where('form_id', $this->formId);
                })->pluck('id');

                // 2. Hapus Form 
                // (Pastikan di Database sudah ada onDelete('cascade') untuk responses.form_id)
                FormModel::findOrFail($this->formId)->delete();

                // 3. Bersihkan Responden "Yatim Piatu"
                // Hanya hapus responden yang setelah form ini dihapus, 
                // mereka tidak punya lagi data di tabel responses (dari form manapun)
                if ($responderIds->isNotEmpty()) {
                    Responden::whereIn('id', $responderIds)
                        ->whereDoesntHave('responses')
                        ->delete();
                }
            });

            // Update UI
            $this->forms = $this->forms->reject(fn($form) => $form['id'] == $this->formId);
            $this->reset(['formId', 'confirmDelete', 'isModalOpen']);
            session()->flash('success', 'Form dan Responden yang tidak aktif berhasil dihapus!');

        } catch (\Exception $e) {
            session()->flash('error', 'Gagal menghapus: ' . $e->getMessage());
        }
    } else {
        session()->flash('error', 'Konfirmasi hapus salah.');
    }
}

    public function render()
    {
        return view('livewire.admin.forms');
    }
}

