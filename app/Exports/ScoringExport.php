<?php
namespace App\Exports;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ScoringExport implements WithMultipleSheets
{
    public $groupedByEmail;

    public function __construct($groupedByEmail)
    {
        $this->groupedByEmail = $groupedByEmail;
    }

    public function sheets(): array
    {
        $sheets = [];

        foreach ($this->groupedByEmail as $email => $forms) {
            $sheets[] = new ScoringEmailSheetExport($email, $forms);
        }

        return $sheets;
    }
}
?>