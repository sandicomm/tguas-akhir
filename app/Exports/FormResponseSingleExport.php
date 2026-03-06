<?php
namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;

class FormResponseSingleExport implements FromView, ShouldAutoSize, WithTitle
{
    public $formName;
    public $questions;
    public $paginatedUsers;
    public $columns;
    public $cellMatrix;

    public function __construct($formName, $questions, $paginatedUsers, $columns, $cellMatrix)
    {
        $this->formName = $formName;
        $this->questions = $questions;
        $this->paginatedUsers = $paginatedUsers;
        $this->columns = $columns;
        $this->cellMatrix = $cellMatrix;
    }

    public function view(): View
    {

        return view('exports.responses-single', [
            'formName' => $this->formName,
            'questions' => $this->questions,
            'paginatedUsers' => $this->paginatedUsers,
            'columns' => $this->columns,
            'cellMatrix' => $this->cellMatrix,
        ]);
    }

    public function title(): string
    {
        return 'All Responses';
    }
}