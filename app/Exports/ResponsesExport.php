<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class ResponsesExport implements FromView
{
    protected $response;
    protected $viewName;

    public function __construct($response, $viewName)
    {
        $this->response = $response;
        $this->viewName = $viewName;
    }

    public function view(): View
    {
        return view($this->viewName, [
            'response' => $this->response
        ]);
    }
}
