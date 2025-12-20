<?php
namespace App\Exports;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class RekapExport implements WithMultipleSheets
{
    public $forms;

    public function __construct($forms)
    {
        $this->forms = $forms;
    }

    public function sheets(): array
    {
        $sheets = [];

        foreach ($this->forms as $form) {
            $sheets[] = new RekapPerFormSheet($form);
        }

        return $sheets;
    }
}

?>