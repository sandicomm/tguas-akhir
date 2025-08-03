<?php

namespace App\Livewire;

use App\Exports\ResponsesExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Responses;
use Livewire\Component;

class ResponseDownload extends Component
{
    public function exportExcel($type, $formId)
    {
        if ($type === 'response') {
            //dd($type);
            $data = Responses::with(['responden', 'answer.question'])
                ->whereHas('form', fn($q) => $q->where('id',(int) $formId))
                ->get();
            $viewName = 'exports.responses';
        }else if ($type === 'rekap') {
            $data = Responses::with(['responden', 'answer.question.section.form'])->get();
            $viewName = 'exports.responses-rekap';
        } else if($type === 'scoring') {
            $data = Responses::with(['responden', 'answer.question.section.form'])->get();
            $viewName = 'exports.scoring';
        } else {
            return abort(404, 'Form type not found');
        }

        return Excel::download(new ResponsesExport($data, $viewName), "{$type}-{$formId}_responses.xlsx");
    }
}