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
                // Salin Form
                $newForm = $originalForm->replicate();
                $newForm->placement = 'disable';
                $newForm->form_name = $originalForm->form_name . ' (Copy)';
                $newForm->save();

                // Salin Sections
                foreach ($originalForm->sections as $section) {
                    $newSection = $section->replicate();
                    $newSection->form_id = $newForm->id;
                    $newSection->save();

                    // Salin Questions
                    foreach ($section->questions as $question) {
                        $newQuestion = $question->replicate();
                        $newQuestion->section_id = $newSection->id;
                        $newQuestion->save();

                        // Salin Answers
                        foreach ($question->answers as $answer) {
                            $newAnswer = $answer->replicate();
                            $newAnswer->question_id = $newQuestion->id;
                            $newAnswer->save();
                        }
                    }
                }
            });

            session()->flash('message', 'Form berhasil disalin.');
            $this->forms = FormModel::all();
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
                $findForm = FormModel::find($this->formId);

                if (!$findForm) {
                    $this->forms = FormModel::all();
                    $this->reset(['formId', 'confirmDelete', 'isModalOpen']);
                    session()->flash('error', 'Form tidak ditemukan.');
                    return;
                }

                DB::transaction(function () use ($findForm) {
                    
                    $responderIds = Responden::whereHas('responses', function ($query) {
                        $query->where('form_id', $this->formId);
                    })->pluck('id');

                    $findForm->delete();

                    if ($responderIds->isNotEmpty()) {
                        Responden::whereIn('id', $responderIds)
                            ->whereDoesntHave('responses')
                            ->delete();
                    }
                });

                $this->forms = FormModel::all();
                $this->reset(['formId', 'confirmDelete', 'isModalOpen']);
                session()->flash('success', 'Form berhasil dihapus!');

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

