<?php
namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;

class ScoringAllInOneExport implements FromView, ShouldAutoSize, WithTitle
{
    public $groupedData;
    public $placement;

    public function __construct($groupedData,$placement)
    {
        $this->groupedData = $groupedData;
        $this->placement = $placement;
    }

    public function view(): View
    {
        return view('exports.scoring-all-single', [
            'groupedData' => $this->groupedData,
            'placement' => $this->placement
        ]);
    }

    public function title(): string
    {
        return 'Rekap Scoring';
    }
}