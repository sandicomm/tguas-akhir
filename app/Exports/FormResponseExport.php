<?php
namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class FormResponseExport implements WithMultipleSheets
{
    public $dataGrouped;
    public $form;

    public function __construct($data)
    {
        // Group per attempt
        $this->dataGrouped = $data->groupBy('attempt');

        // Ambil form sekali saja
        $this->form = $data->first()->answer->question->section->form ?? null;
    }

    public function sheets(): array
    {
        $sheets = [];

        foreach ($this->dataGrouped as $attempt => $responses) {
            $sheets[] = new FormResponsePerAttemptSheet(
                $this->form,
                $attempt,
                $responses
            );
        }

        return $sheets;
    }
}
?>
