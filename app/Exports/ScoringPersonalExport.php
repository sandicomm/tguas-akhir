<?php
namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ScoringPersonalExport implements WithMultipleSheets
{
    public $groupedForms;

    public function __construct($groupedForms)
    {
        $this->groupedForms = $groupedForms;
    }

    public function sheets(): array
    {
        $sheets = [];

        foreach ($this->groupedForms as $formId => $responses) {

            // Group per attempt
            $attemptGroups = $responses->groupBy('attempt');

            foreach ($attemptGroups as $attempt => $attemptResponses) {
                $sheets[] = new SinglePersonalFormSheetExport(
                    $attemptResponses,
                    "Form {$formId} - Attempt {$attempt}"
                );
            }
        }

        return $sheets;
    }
}
?>
