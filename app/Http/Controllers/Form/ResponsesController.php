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
            //dd(session('already_fill_form'));
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

            $dbFormIds = Responses::whereHas('responden', function ($query) use ($responden) {
                    $query->where('email', $responden->email);
                })
                ->distinct()
                ->pluck('form_id'); // Contoh hasil: [1, 2]

            // 2. Ambil ID form yang sudah ada di session anonim sebelumnya
            $existingFormIds = collect(session('already_fill_form', []))->flatten(); // flatten() memastikan array awal 100% flat

            // 3. Gabungkan ID form dari database dan session anonim, lalu hapus duplikatnya
            //dd($existingFormIds, $request->form_id);
            $mergedFormIds = $existingFormIds
                ->merge($dbFormIds)          // Menggabungkan kedua list ID
                ->push($request->form_id) // Pastikan ID form yang baru disubmit juga ikut masuk
                ->unique()                   // Hapus ID yang sama/duplikat
                ->values()                   // Reset index array (0, 1, 2, dst)
                ->toArray();

            if ((!session()->has('pre_test_email') || session('pre_test_email') !== $request['collect_email']) && $request['placement'] === 'pre-test-interaktif') {
                session(['pre_test_email' =>  $request['collect_email']]);
                //dd($request['collect_email']);
            }

            if(str_contains(strtolower($response['placement'] ?? ''), 'post-test')){
                session()->put([
                    $response['placement'] . '_done'=>true,
                    'responden_email'=>$responden->email,
                    'form_name'=>$response['form_name'],
                    'already_fill_form'=>$mergedFormIds
                ]);
            }else{
                session()->put([
                    $response['placement'] . '_done'=>true,
                    'responden_email'=>$responden->email,
                    'form_name'=>$response['form_name'],
                    'already_fill_form'=>$mergedFormIds
                ]);
            }

            if (session('page_visited') === 'emodul') {
                $lastUrl = session('last_emodul_url');

                if ($lastUrl) {
                    return redirect()->route('emodul.preview', ['url' => $lastUrl])
                                    ->with('success', 'Response Berhasil Direkam');
                }
            } 
            
            return redirect(route(session('page_visited')))->with('success', 'Response Berhasil Direkam');
        }else{
            //dd(session('pre_test_done'), session('form_name') == $response['form_name'], session('no_email_user') != null, Str::contains($response['placement'] ?? '', 'post-test') );
            if(Str::contains($response['placement'], 'interaktif')){
                $preTestDone = session('pre-test-interaktif_done');
            }else if(Str::contains($response['placement'], 'emodul')){
                $preTestDone = session('pre-test-emodul_done');
            }

            if($preTestDone && session('no_email_user') != null && Str::contains($response['placement'] ?? '', 'post-test') ){
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

            // 1. Ambil session, ratakan array (flatten), dan reset index
            $existingFormIds = collect(session('already_fill_form', []))
                ->flatten()
                ->map(fn($id) => (int) $id); // Pastikan semua ID bertipe integer

            $currentFormId = (int) $request->form_id;

            // 2. Tambahkan ID baru jika belum ada
            if (!$existingFormIds->contains($currentFormId)) {
                $existingFormIds->push($currentFormId);
            }

            $formIds = $existingFormIds->values()->toArray();

            if(str_contains(strtolower($response['placement'] ?? ''), 'post-test')){
                session()->put([
                    $response['placement'] . '_done'=>true,
                    'responden_email'=>null,
                    'form_name'=>$response['form_name'],
                    'already_fill_form'=>$formIds
                ]);
            }else{
                session()->put([
                    $response['placement'] . '_done'=>true,
                    'responden_email'=>null,
                    'form_name'=>$response['form_name'],
                    'already_fill_form'=>$formIds
                ]);
            }
         
            if (session('page_visited') === 'emodul') {
                $lastUrl = session('last_emodul_url');

                if ($lastUrl) {
                    return redirect()->route('emodul.preview', ['url' => $lastUrl])
                                    ->with('success', 'Response Berhasil Direkam');
                }
            } 

            return redirect(route(session('page_visited')))->with('success', 'Response Berhasil Direkam');
        }
    }
}
