<?php
namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class FormResponsePerAttemptSheet implements FromView
{
    public $form;
    public $attempt;
    public $responses;

    public function __construct($form, $attempt, $responses)
    {
        $this->form = $form;
        $this->attempt = $attempt;
        $this->responses = $responses;
    }

    public function view(): View
    {
        return view('exports.responses', [
            'form' => $this->form,
            'attempt' => $this->attempt,
            'data' => $this->responses
        ]);
    }
}
?>
