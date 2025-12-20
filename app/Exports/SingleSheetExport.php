<?php
namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class SingleSheetExport implements FromView
{
    public $data;
    public $viewName;

    public function __construct($data, $viewName)
    {
        $this->data = $data;
        $this->viewName = $viewName;
    }

    public function view(): View
    {
        return view($this->viewName, [
            'data' => $this->data
        ]);
    }
}
?>
