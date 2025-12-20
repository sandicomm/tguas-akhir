<?php
namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;

class SinglePersonalFormSheetExport implements FromView, WithTitle
{
    public $responses;
    public $title;

    public function __construct($responses, $title)
    {
        $this->responses = $responses;
        $this->title = $title;
    }

    public function view(): View
    {
        return view('exports.single-form-scoring', [
            'responses' => $this->responses
        ]);
    }

    public function title(): string
    {
        return $this->title;
    }
}
?>
