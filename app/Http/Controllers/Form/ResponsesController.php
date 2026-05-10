<?php

namespace App\Http\Controllers\Form;

use App\Models\Answers;
use Log;
use App\Models\Form;
use App\Models\Responden;
use App\Models\Responses;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Mail;

class ResponsesController extends \App\Http\Controllers\Controller
{
    public function store(Request $request){
        $form = Form::findOrFail($request->form_id);
        $responden_email = session('responden_email');

        $collect_email = false;
        if ($form->collect_email == 1) {
            $collect_email=true;
        }
        
        $formIds = Responses::whereHas('responden', function ($query) use ($request) {
            $query->where('email', session('responden_email'));
        })
        ->distinct()
        ->pluck('form_id'); // Ambil hanya kolom form_id
        
        //dd($responden_email);
        $one_attempt = false;
        //dd($formNames);
        if ($form->one_attempt == 1 && collect($formIds)->contains($request['form_id'])) {
            $one_attempt=true;
            //dd($one_attempt);
            return redirect(route('dashboard'))->with('error', 'Anda Hanya Bisa Sekali mengisi form');
        }
        //dd($one_attempt);
       
        $rules = [
            'form_name' => 'required',
            'placement' => 'required',
            'sections.*.section' => 'required',
            'sections.*.questions.*.question' => 'required',
            'sections.*.questions.*.question_id' => 'required',
            'sections.*.questions.*.answer' => 'required',
        ];

        //revisi
        if ($collect_email) {
            $rules['responden_email'] = 'required|email'; // Tambahkan aturan validasi lain
        }
    
        $response = $request->validate($rules, [
            'responden_email.email' => 'Email tidak valid',
            'responden_email.required' => 'Email harus diisi',
            'form_name.required' => 'Nama Form Harus Diisi',
            'sections.*.section.required' => 'Nama Section Harus Diisi',
            'sections.*.questions.*.question.required' => 'Pertanyaan wajib diisi.',
            'sections.*.questions.*.answer.required' => 'Jawaban untuk setiap pertanyaan wajib diisi.',
        ]);

        if ($collect_email) {
            $responden = Responden::firstOrCreate(
                ['email' => $responden_email], // Kondisi pencarian
                [
                    'email' => $responden_email, 
                ]
            );
      
            $formId = $request['form_id'];

            $max_attempt = Responses::where('responden_id', $responden->id)
                ->whereHas('answer.question.section.form', function ($query) use ($formId) {
                    $query->where('id', $formId);
                })
                ->max('attempt');

            $hasResponded = Responses::where('responden_id', $responden->id)
                ->whereHas('answer.question.section.form', function ($query) use ($formId) {
                    $query->where('id', $formId);
                })
                ->exists();

            foreach ($response['sections'] as $section) {
                //dd($section);
                if(isset($section['questions']) && !empty($section['questions'])){
                    foreach ($section['questions'] as $question) {
                        // Hitung nilai `attempt`
                        $attempt = 1;
    
                        if (!$one_attempt && $hasResponded) {
                            $attempt = $max_attempt ? $max_attempt + 1 : 1; // Tambahkan 1 atau gunakan 1 jika belum ada data
                        }
          
                        $answerId = $question['answer'];
    
                        // Simpan jawaban ke database
                        Responses::create([
                            'attempt' => $attempt,
                            'form_id' => $formId,
                            'answer_id' => $answerId,
                            'responden_id' => $responden->id,
                        ]);
                    }
                }
            }

            $formIds = Responses::whereHas('responden', function ($query) use ($request) {
                $query->where('email', session('responden_email'));
            })
            ->distinct()
            ->pluck('form_id'); // Ambil hanya kolom form_id

            if ((!session()->has('pre_test_email') || session('pre_test_email') !== $request['collect_email']) && $request['placement'] === 'pre-test-interaktif') {
                session(['pre_test_email' =>  $request['collect_email']]);
                //dd($request['collect_email']);
            }


            session()->put([
                'pre_test_done'=>true,
                'responden_email'=>$responden->email,
                'form_name'=>$response['form_name'], 
                'already_fill_form'=>$formIds
            ]);

            return redirect(route(session('page_visited')))->with('success', 'Response Berhasil Direkam');
        }else{
            //dd(session('pre_test_done'), session('form_name') == $response['form_name'], session('no_email_user') != null, Str::contains($response['placement'] ?? '', 'post-test') );
            if(session('pre_test_done') && session('no_email_user') != null && Str::contains($response['placement'] ?? '', 'post-test') ){
                $uuid=session('no_email_user');
            }else{
                $uuid = Str::uuid(); // Buat UUID unik
                session(['no_email_user' => $uuid]);
            }

            foreach ($response['sections'] as $section) {
                foreach ($section['questions'] as $question) {
                    
                    $answerId = $question['answer'];
                    Responses::create([
                        'uuid' => $uuid, // Simpan UUID unik ini
                        'attempt' => 0,
                        'form_id' => $request['form_id'],
                        'answer_id' => $answerId,

                    ]);
                }
            }
            if ((!session()->has('pre_test_email') || session('pre_test_email') !== $request['collect_email']) && $request['placement'] === 'pre-test-interaktif') {
                session(['pre_test_email' =>  $request['collect_email']]);
            }

            session()->put([
                'pre_test_done'=>true,
                'responden_email'=>null,
                'form_name'=>$response['form_name'],
                'already_fill_form'=>$formIds
            ]);
            
            return redirect(route(session('page_visited')))->with('success', 'Response Berhasil Direkam');
        }
    }
}
