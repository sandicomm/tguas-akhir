<?php
namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;

class ScoringPersonalExport implements FromView, ShouldAutoSize, WithTitle
{
    public $responses;
    public $userKey;
    public $formName;

    public function __construct($responses, $userKey, $formName)
    {
        $this->responses = $responses;
        $this->userKey = $userKey;
        $this->formName = $formName;
    }

    public function view(): View
    {
        return view('exports.scoring-single', [
            'responses' => $this->responses,
            'userKey'   => $this->userKey,
            'formName'  => $this->formName
        ]);
    }

    public function title(): string
    {
        return 'Detail Scoring';
    }
}