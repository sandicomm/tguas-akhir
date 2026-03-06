<?php

namespace App\Http\Controllers\Admin;

use App\Models\Questions;
use Illuminate\Http\Request;

class QuestionsController extends  \App\Http\Controllers\Controller
{
    public function index(Request $request){
        $questions = Questions::with('answers') // Eager load answers
            ->filter($request->only(['answer']))
            ->latest()
            ->get();

        return view('main', compact('questions'));
    }
}
