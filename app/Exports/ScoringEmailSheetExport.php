<?php
namespace App\Exports;
use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class ScoringEmailSheetExport implements FromView
{
    public $email;
    public $forms;

    public function __construct($email, $forms)
    {
        $this->email = $email;
        $this->forms = $forms;
    }

    public function view(): View
    {
        return view('exports.scoring', [
            'email' => $this->email,
            'forms' => $this->forms
        ]);
    }
}
?>
