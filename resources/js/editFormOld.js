let sections
let stats
let sectionsCopy
let formCopy
let SECTION_MAX_ID
let QUESTION_MAX_ID
let ANSWER_MAX_ID

document.addEventListener('DOMContentLoaded', function(){
    formCopy = JSON.parse(JSON.stringify(formJs));
    SECTION_MAX_ID = sectionMaxID
    QUESTION_MAX_ID = questionMaxID
    ANSWER_MAX_ID = answerMaxID
    sectionsCopy = formCopy.sections
    loadForm()
})

function loadBtnSubmit(){
    const formUpdate = document.getElementById('btn-update-form');
    formUpdate.classList.remove('hidden')
}

function getMax(data, param = '') { 
    let max = { 
        sectionId: SECTION_MAX_ID, sectionOrder: 0, 
        questionId: QUESTION_MAX_ID, questionOrder: 0, 
        answerId: ANSWER_MAX_ID, maxOrder: 0 
    };

    if (!data || data.length == 0) return max;

    if (param == 'question') {
        return { maxOrder: Math.max(0, ...data.map(q => q.order)) };
    }

    data.forEach(section => {
        max.sectionId = Math.max(max.sectionId, section.id);
        max.sectionOrder = Math.max(max.sectionOrder, section.order);

        section.questions.forEach(question => {
            max.questionId = Math.max(max.questionId, question.id);
            max.questionOrder = Math.max(max.questionOrder, question.order);

            question.answers.forEach(answer => {
                max.answerId = Math.max(max.answerId, answer.id);
            });
        });
    });

    return max;
}

function serializeForm(form) {
     document.getElementById('jsLoader').classList.remove('hidden');
    const formData = new FormData(form);
    let object = {};

    formData.forEach((value, key) => {
        // Convert "sections[0][questions][2][answer][1]" → nested object
        const keys = key.replace(/\]/g, "").split("[");
        keys.reduce((acc, k, i) => {
            if (i == keys.length - 1) {
                acc[k] = value;
            } else {
                acc[k] = acc[k] || {};
            }
            return acc[k];
        }, object);
    });

    return object;
}

function chunkArray(array, size) {
     document.getElementById('jsLoader').classList.remove('hidden');
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

function validateBeforeSubmit(fullData) {
     document.getElementById('jsLoader').classList.remove('hidden');
  const sections = fullData.sections;

  // ✅ Form wajib punya minimal 1 section aktif
  const activeSections = Object.values(sections || {}).filter(
    s => s.changeContent !== 'delete'
  );

  if (activeSections.length == 0) {

    alert('Form harus memiliki minimal 1 section');
    return false;
  }

  for (const section of Object.values(sections)) {
    const isSectionDeleted = section.changeContent == 'delete';
    const questions = Object.values(section.questions || {}).filter(
        q => q.changeContent !== 'delete'
    );

    // ✅ Section aktif wajib punya question
    if (!isSectionDeleted && questions.length == 0) {

      alert(`Section "${section.name}" wajib memiliki question`);
      return false;
    }

    for (const question of questions) {
      const isQuestionDeleted = question.changeContent == 'delete';

      // ✅ Jika aktif & pilgan, answer wajib ada
      if (!isQuestionDeleted && question.input_type == 'pilgan') {
        const answers = Object.values(question.answer || {}).filter(
            a => a.changeContent !== 'delete'
        );

        if (answers.length == 0) {
          alert(`Question "${question.question}" wajib memiliki jawaban`);
          return false;
        }

        for (const answer of answers) {
          const isAnswerDeleted = answer.changeContent == 'delete';

          if (!isAnswerDeleted && !answer.answer?.trim()) {
            alert(`Jawaban tidak boleh kosong pada "${question.question}"`);
            return false;
          }
        }
      }
    }
  }

  return true;
}

function filterChangedData(fullData) {
    document.getElementById('jsLoader').classList.remove('hidden');
  const result = { ...fullData, sections: {} };

  for (const [sid, section] of Object.entries(fullData.sections || {})) {
    if (!['add', 'update', 'delete'].includes(section.changeContent)) continue;

    const newSection = { ...section, questions: {} };

    for (const [qid, question] of Object.entries(section.questions || {})) {
      if (!['add', 'update', 'delete'].includes(question.changeContent)) continue;

      const newQuestion = { ...question, answer: {} };

      if (question.answer) {
        for (const [aid, answer] of Object.entries(question.answer)) {
          if (!['add', 'update', 'delete'].includes(answer.changeContent)) continue;
          newQuestion.answer[aid] = answer;
        }
      }

      newSection.questions[qid] = newQuestion;
    }

    result.sections[sid] = newSection;
  }

  return result;
}

function normalizeSectionsToKeyedObject(formCopy, sectionsCopy) {
  const result = {};

  sectionsCopy.forEach(sec => {
    const sid = String(sec.id);

    result[sid] = {
      formId: String(formCopy.id),
      id: sid,
      order: String(sec.order),
      name: sec.name,
      description: sec.description ?? '',
      status: '',
      changeContent: sec.changeContent,   // atau 'add' sesuai kebutuhan
      questions: {}              // nanti diisi
    };

    // ✅ JIKA QUESTIONS SUDAH ADA DI sec
    if (sec.questions && Array.isArray(sec.questions)) {
      sec.questions.forEach(q => {
        const qid = String(q.id);

        result[sid].questions[qid] = {
          id: qid,
          question: q.question,
          order: String(q.order),
          input_type: q.input_type,
          rule: q.rules,
          status: '',
          changeContent: q.changeContent,
          answer: {}
        };

        // ✅ JIKA ADA ANSWER
        if (q.answers && Array.isArray(q.answers)) {
          q.answers.forEach(a => {
            const aid = String(a.id);

            result[sid].questions[qid].answer[aid] = {
              id: aid,
              answer: a.answer,
              value: a.value,
              status: '',
              changeContent: a.changeContent
            };
          });
        }
      });
    }
  });

  return result;
}

let redirect = '';
let formId=''
let raw=''

async function submitInBatch(form) {
    document.getElementById('jsLoader').classList.remove('hidden');
  try {
  
    if (!validateBeforeSubmit(form)) {
        document.getElementById('jsLoader').classList.add('hidden');
        return;
    }

    let fullData = filterChangedData(form);

    // ✅ WAJIB: object → array
    fullData.sections = Object.values(fullData.sections || {});

    let baseData = {
      form_id: fullData.id,
      form_name: fullData.form_name,
      placement: fullData.placement,
      collect_email: fullData.collect_email,
      one_attempt: fullData.one_attempt,
      must_fill: fullData.must_fill,
      changeContent: fullData.changeContent ?? '',
      batch_number: 0,
      sections: fullData.sections
    };

    const sectionBatches = chunkArray(fullData.sections, 3);

    if(sectionBatches.length == 0){
        document.getElementById('jsLoader').classList.remove('hidden');
        let response = await fetch('/form/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            'Accept': 'application/json'
          },
          body: JSON.stringify(baseData)
        });
    
        let json = await response.json();
        redirect = json.redirect

        if (!json.success) {
          alert("Gagal: " + json.message);
          return;
        }
    }

    for (let i = 0; i < sectionBatches.length; i++) {
        const payload = {
            ...baseData,
            batch_number: i,
            sections: sectionBatches[i]
        };
        let response = await fetch('/form/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
    
        let json = await response.json();
        redirect = json.redirect

        if (!json.success) {
          alert("Gagal: " + json.message);
          return;
        }
    }

    document.getElementById('jsLoader').classList.add('hidden');
    alert("Semua section berhasil dikirim!");

  } catch (err) {

    alert("Terjadi kesalahan!");
  }
}

async function formSubmit(event) {
    document.getElementById('jsLoader').classList.remove('hidden'); // tampil

    event.preventDefault();
    let formData = formCopy
    formData.sections = normalizeSectionsToKeyedObject(formData, sectionsCopy);

    await submitInBatch(formData); // ✔ wajib tunggu dulu!

    document.getElementById('jsLoader').classList.add('hidden'); 
    allowUnload = true;
    if (redirect) {
        window.location.href = redirect;
    }
}

function displayErrors(errors) {
    let errorContainer = document.getElementById('error-container');

    if (errorContainer) {
        // Update Alpine.js state
        errorContainer.innerText = errors
        errorContainer.classList.remove('hidden')
        // Sembunyikan setelah 30 detik
        setTimeout(() => {
            errorContainer.classList.add('hidden')
        }, 50000);
    }
}

function updateFormName(event) {
   
    formCopy.form_name = event.value;
    event.classList.add('bg-yellow-200/70');
    formCopy.change = true;
    formCopy.changeContent='update'
    loadBtnSubmit();
}

function updateFormSetting (event) {
    if('placement' == event.target.id.split('-')[2]){
        formCopy.placement = event.target.value
        event.target.classList.add('bg-yellow-200/70')

        formCopy.changeSettingPlacement = true
        loadBtnSubmit()

    }if('email' == event.target.id.split('-')[2]){
        formCopy.collect_email = event.target.value
        event.target.classList.add('bg-yellow-200/70')
        formCopy.changeSettingEmail = true

        loadBtnSubmit()
        
    }if('attempt' == event.target.id.split('-')[2]){
        formCopy.one_attempt = event.target.value
        event.target.classList.add('bg-yellow-200/70')
        formCopy.changeSettingAttempt= true

        loadBtnSubmit()

    }if('fill' == event.target.id.split('-')[2]){
        formCopy.must_fill = event.target.value
        event.target.classList.add('bg-yellow-200/70')
        formCopy.changeSettingAttempt= true

        loadBtnSubmit()

    }
    formCopy.changeContent='update'
}

function formOrderDownSection(event){
    const sectionId = parseInt(event.id.split('-')[4]);
    
    const section = sectionsCopy.find(sec =>  parseInt(sec.id) == sectionId);
  
    if (!section) return;
    
    const nextSection = sectionsCopy.find(nextSec =>  nextSec.order ==  parseInt(section.order) + 1);

    if (!nextSection) return;


    if (nextSection) {
        // Tukar nilai order
        [section.order, nextSection.order] = [nextSection.order, section.order];

        section.changeContent = 'update';
        nextSection.changeContent = 'update';

        event.classList.add('bg-yellow-200/70');
        section.change = true;
        nextSection.changeOrder = true;
   
        loadBtnSubmit();
        loadForm();
    }
}

function formOrderUpSection(event){
    const sectionId = parseInt(event.id.split('-')[4]);
    
    const section = sectionsCopy.find(sec =>  parseInt(sec.id) == sectionId);

    if (!section) return;

    const nextSection = sectionsCopy.find(nextSec =>  nextSec.order ==  parseInt(section.order) - 1);
    
    if (nextSection &&  parseInt(section.order) > 1) {
        // Tukar nilai order
        [section.order, nextSection.order] = [nextSection.order, section.order];

        section.changeContent = 'update';
        nextSection.changeContent = 'update';

        event.classList.add('bg-yellow-200/70');
        section.change = true;
        nextSection.changeOrder = true;
  
        loadBtnSubmit();
        loadForm();
    }
}

function formBtnAddSection(event){
    const order = parseInt(event.id.split('-')[4])
    sectionsCopy.forEach(section => {
        if (parseInt(section.order) > order) {
            section.order = parseInt(section.order) + 1;
            section.changeContent = 'update'
        }
    })

    sectionsCopy.push({
        id: parseInt(getMax(sectionsCopy).sectionId) + 1,
        name: 'type here',
        description: 'type here',
        status:'new',
        changeContent: 'add',
        changeOrder: true,
        changeSection: true,
        changeSectionDesc: true,
        order: parseInt(order) + 1,
        questions: []
    });

    loadBtnSubmit()
    loadForm();
}

function formBtnCopySection(event){
    const sectionId = parseInt(event.id.split('-')[4])
    const idx = sectionsCopy.findIndex(s => s.id == sectionId);

    if (idx == -1) return;

    const copySection = JSON.parse(JSON.stringify(sectionsCopy[idx]))

    sectionsCopy.forEach(section => {
        if (parseInt(section.order) > parseInt(copySection.order)) {
            section.order = parseInt(section.order)+1;
            section.changeContent = 'update'
        }
    })

    const maxId = getMax(sectionsCopy)

    copySection.id = parseInt(maxId.sectionId) + 1
    copySection.name = copySection.name + ' (copy)'
    copySection.changeContent = 'add'
    copySection.status = 'new'
    copySection.changeOrder = true
    copySection.changeSection = true
    copySection.changeSection = true
    copySection.order = parseInt(copySection.order) + 1
    
    let maxQID = maxId.questionId
    let maxAID = maxId.answerId

    copySection.questions = copySection.questions
    .filter(q => q.changeContent != 'delete')
    .map(q=> {
        maxQID ++

        const newQuestion = {
            ...q,

            id: maxQID,
            status:'new',
            changeContent: 'add',
            changeOrder: true,
            changeSection: true,
            changeSectionDesc: true,
        }

        newQuestion.answers = newQuestion.answers
        .filter(a => a.changeContent != 'delete')
        .map(a=> {
            maxAID ++
            return {
                ...a,
                id: maxAID,
                status:'new',
                changeContent: 'add',
                changeAnswer: true
            }
        })
        return newQuestion
    })

    sectionsCopy.push(copySection)
    loadBtnSubmit()
    loadForm();
}

function formBtnDeleteSection(event) {
    const sectionId = parseInt(event.id.split('-')[4]);

    const sectionIndex = sectionsCopy.findIndex(s => s.id == sectionId);
    if (sectionIndex == -1) return; // Jika question tidak ditemukan, keluar

    const section = sectionsCopy[sectionIndex];
    
    if (section.status == 'new') {
        // Jika masih baru, langsung hapus dari array
        sectionsCopy.splice(sectionIndex, 1);
    } else {
        // Jika sudah ada di database, tandai sebagai "delete"
        section.changeContent = "delete";
        section.order = 0;

        section.questions.forEach(q => {
            q.changeContent = 'delete'
            
            q.answers.forEach(a =>{
                a.changeContent ='delete'
            })
        })

    }


    // Perbarui urutan hanya untuk pertanyaan setelahnya
    for (let i = sectionIndex; i < sectionsCopy.length; i++) {
        if(sectionsCopy[i].id != sectionId){
            sectionsCopy[i].order = parseInt(sectionsCopy[i].order) - 1;
            sectionsCopy[i].changeContent = 'update';
        }
    }
    loadForm(); // Perbarui tampilan form setelah perubahan
    loadBtnSubmit()
}

function questionFieldChange(event) {
    const sectionId = parseInt(event.target.id.split('-')[1])
    const questionId = parseInt(event.target.id.split('-')[2])

    const sections = sectionsCopy.find(sec => sec.id == sectionId)
    if(!sections) return

    const question = sections.questions.find(q => q.id == questionId)

    if(question){
        sections.changeContent='update'
        question.question = event.target.value
        question.changeContent = 'update' 
        
        event.target.classList.add('bg-yellow-200/70')
        question.changeQuestion = true
        loadBtnSubmit()

    }
}

function answerFieldChange(event) {
    const sectionId = parseInt(event.target.id.split('-')[1])
    const questionId = parseInt(event.target.id.split('-')[2])
    const answerId = parseInt(event.target.id.split('-')[3])

    const sections = sectionsCopy.find(sec => sec.id == sectionId)
    if(!sections) return
    
    const question = sections.questions.find(q => q.id == questionId)
    if(!question) return
    
    const answer = question.answers.find(a => a.id == answerId)

    if(answer){
        sections.changeContent='update'
        question.changeContent='update'
        answer.answer = event.target.value
        answer.changeContent = 'update'

        event.target.classList.add('bg-yellow-200/70')
        answer.changeAnswer = true
        loadBtnSubmit()
    }

}

function answerValueChange(event) {
    const sectionId = parseInt(event.target.id.split('-')[2])
    const questionId = parseInt(event.target.id.split('-')[3])
    const answerId = parseInt(event.target.id.split('-')[4])
    
    const sections = sectionsCopy.find(sec => sec.id == sectionId)
    if(!sections) return
    
    const question = sections.questions.find(q => q.id == questionId)
    if(!question) return
    
    const answer = question.answers.find(a => a.id == answerId)

    if(answer){
        sections.changeContent='update'
        question.changeContent='update'
        answer.value = event.target.value
        answer.changeContent = 'update'

        event.target.classList.add('bg-yellow-200/70')
        answer.changeAnswer = true
        loadBtnSubmit()
    }

}

function sectionFieldChange(event) {
   
    const sectionId = parseInt(event.target.id.split('-')[3])
    const sectionPart = event.target.id.split('-')[2]

    const section = sectionsCopy.find(sec => sec.id == sectionId)
    if(!section) return;

    if(sectionPart == 'name'){
        section.name = event.target.value
        section.changeContent = 'update'

        event.target.classList.add('bg-yellow-200/70')
        section.changeSection = true
        loadBtnSubmit()
    }else if(sectionPart == 'description'){
        section.description = event.target.value
        section.changeContent = 'update'

        event.target.classList.add('bg-yellow-200/70')
        section.changeSectionDesc = true 
        loadBtnSubmit()
    }

}

function formAnswerTypeChange(event) {
    const questionId = parseInt(event.target.id.split('-')[3])

    for(const section of sectionsCopy){
        let question=section.questions.find(q => q.id == questionId)

        if(question){
            section.changeContent='update'
            question.input_type = event.target.value
            question.changeContent = 'update'

            event.target.classList.add('bg-yellow-200/70')
            question.changeTypeAnswer = true
         
            loadBtnSubmit()
            loadForm()
            break;
        }
    }
}

function formBtnAddQuestion(event) {
    const thisQuestionOrder = parseInt(event.id.split('-')[6])
    const sectionId = parseInt(event.id.split('-')[8])

    const section = sectionsCopy.find(sec => sec.id == sectionId)

    if(section){
        section.questions.forEach(question => {
            if (parseInt(question.order) >= thisQuestionOrder + 1) {
                question.order = parseInt(question.order) + 1;
                question.changeContent = 'update'
            }
        }); 

        section.changeContent='update'

        section.questions.push({
            id: parseInt(getMax(sectionsCopy).questionId) + 1,
            question: 'type here',
            input_type: 'text',
            rules: 1,
            status:'new',
            changeContent: 'add',
            changeQuestion: true,
            changeOrder: true,
            changeTypeAnswer: true,
            changeRule: true,
            section_id: section.id,
            order: thisQuestionOrder + 1,
            answers: []
        });

        event.classList.add('bg-yellow-200/70')
        loadBtnSubmit()
        loadForm();
    }   
}

function formBtnCopyQuestion(event){
    const thisQuestionOrder = parseInt(event.id.split('-')[6])
    const questionId = parseInt(event.id.split('-')[4])
    const sectionId = parseInt(event.id.split('-')[8])

    const idxSection = sectionsCopy.findIndex(s => s.id == sectionId);

    if (idxSection == -1) return;

    let copySection = sectionsCopy[idxSection]
    const targetCopy = copySection.questions.find(q => q.id == questionId)

    if (targetCopy == undefined) return;

    let copyQuestion = JSON.parse(JSON.stringify(targetCopy))
    copySection.changeContent='update'
    copySection.questions.forEach(question => {
        if (parseInt(question.order) > thisQuestionOrder) {
            question.order = parseInt(question.order)+1;
            question.changeContent = 'update'
        }
    })

    const maxId = getMax(sectionsCopy)
    
    copyQuestion.id = parseInt(maxId.questionId) + 1
    copyQuestion.question = copyQuestion.question + ' (copy)'
    copyQuestion.changeContent = 'add'
    copyQuestion.status = 'new'
    copyQuestion.changeOrder = true
    copyQuestion.changeSection = true
    copyQuestion.changeSection = true
    copyQuestion.order = parseInt(copyQuestion.order) + 1
    
    let maxAID = maxId.answerId

    copyQuestion.answers = copyQuestion.answers
    .filter(a => a.changeContent != 'delete') // buang yg delete
    .map(a => {
        maxAID++;
        return {
            ...a,
            id: maxAID,
            status: 'new',
            changeContent: 'add',
            changeOrder: true,
            changeSection: true,
            changeSectionDesc: true,
        }
    });


    copySection.questions.push(copyQuestion)

    loadBtnSubmit()
    loadForm();
}
let deleteCount=0
function formBtnDeleteQuestion (event) {
    const sectionId = parseInt(event.id.split('-')[8]);
    const questionId = parseInt(event.id.split('-')[4]);

    deleteCount +=1
    for (const section of sectionsCopy) {
        if (section.id == sectionId) {
            const questionIndex = section.questions.findIndex(q => q.id == questionId);
            if (questionIndex == -1) return; // Jika question tidak ditemukan, keluar

            const question = section.questions[questionIndex];
            
            if (question.status == 'new') {
                // Jika masih baru, langsung hapus dari array
                section.questions.splice(questionIndex, 1);
            } else {
                // Jika sudah ada di database, tandai sebagai "delete"
                section.changeContent = "update";
                question.changeContent = "delete";
                question.order = 0;
                question.answers.forEach(a=>{
                    a.changeContent='delete'
                })
            }

            // Perbarui urutan hanya untuk pertanyaan setelahnya
            for (let i = questionIndex; i < section.questions.length; i++) {
                if(section.questions[i].id != questionId){
                    section.questions[i].order = parseInt(section.questions[i].order)-1;
                    section.questions[i].changeContent ='update' ;
                }
            }
            break; // **Stop loop setelah menemukan section yang sesuai**
        }
    }

    loadBtnSubmit()
    loadForm(); // Perbarui tampilan form setelah perubahan
}

function formOrderUpQuestion (event) {
    const questionOrder = parseInt(event.id.split('-')[6]);
    const questionId = parseInt(event.id.split('-')[4]);
    const sectionId = parseInt(event.id.split('-')[8]);

    // Cari section yang sesuai
    const section = sectionsCopy.find(sec =>  sec.id == sectionId);
    if (!section) return;
    
    // Cari pertanyaan yang sesuai
    const question = section.questions.find(q =>  q.id == questionId);
    if (!question) return;
    
    const previousQuestion = section.questions.find(q =>  q.order == questionOrder - 1);
    
    
    if (previousQuestion && questionOrder >= 1) {
        // **CASE 1: Swap dengan question sebelumnya dalam section yang sama**
        [question.order, previousQuestion.order] = [previousQuestion.order, question.order];
        section.changeContent = 'update';
        question.changeContent = 'update';
        question.changeOrder = true;
        previousQuestion.changeOrder = true;
        previousQuestion.changeContent = 'update';

    } else {
        // **CASE 2: Pindahkan ke section sebelumnya jika di posisi pertama**
        const previousSection = sectionsCopy.find(sec => sec.order == parseInt(section.order) - 1);

        if (previousSection) {
            question.section_id = previousSection.id;
            question.order = parseInt(getMax(previousSection.questions, 'question')) + 1;
            question.changeContent = 'update';
            previousSection.changeContent = 'update';
            
            previousSection.questions.push(question);
            section.questions = section.questions.filter(q => q.id != question.id);
            
            // Perbarui order di section baru
            previousSection.questions.forEach((q, index) => {
                q.order = index + 1;
                q.changeContent = 'update';
            });

            section.changeOrder = true;
            section.changeContent='update'
            previousSection.changeOrder = true;

        }
    }

    // Update tampilan & tombol submit
    event.classList.add('bg-yellow-200/70');
    loadBtnSubmit();
    loadForm();
}

function formOrderDownQuestion (event) {
    const questionOrder = parseInt(event.id.split('-')[6]);
    const questionId = parseInt(event.id.split('-')[4]);
    const sectionId = parseInt(event.id.split('-')[8]);

    // Cari section yang sesuai
    const section = sectionsCopy.find(sec =>  sec.id == sectionId);
    if (!section) return;

    // Cari pertanyaan yang sesuai
    const question = section.questions.find(q => q.id == questionId);
    if (!question) return;

    const nextQuestion = section.questions.find(q => q.order == questionOrder + 1);

    if (nextQuestion) {
        [question.order, nextQuestion.order] = [nextQuestion.order, question.order];
        section.changeContent='update'
        question.changeContent = 'update';
        question.changeOrder = true;
        nextQuestion.changeOrder = true;
        nextQuestion.changeContent = 'update';

    } else {
        // **CASE 2: Pindahkan ke section berikutnya jika di posisi terakhir**
        const nextSection = sectionsCopy.find(sec =>  sec.order == parseInt(section.order) + 1);
        if (nextSection) {
            question.section_id = nextSection.id;
            question.order = 1;
            question.changeContent = 'update';
            section.changeContent='update'
            question.changeOrder = true;

            // Tambahkan ke section baru di awal
            nextSection.questions.unshift(question);
            nextSection.changeOrder = true;
            nextSection.changeContent='update'

            // Hapus dari section lama
            section.questions = section.questions.filter(q =>  q.id != question.id);

            // Perbarui order di section baru
            nextSection.questions.forEach((q, index) => {
                q.order = index + 1;
                q.changeContent = 'update';

            });
        }
    }

    // Update tampilan & tombol submit
    event.classList.add('bg-yellow-200/70');
    loadBtnSubmit();
    loadForm();
}

function formBtnAddAnswer(event) {
    if (event.id == 'form-btn-add-answer') {
        let maxAnswerId = parseInt(getMax(sectionsCopy).answerId) + 1;
        let questionId = parseInt(event.getAttribute('data-question-id'));

        for (let section of sectionsCopy) {
            let question = section.questions.find(q => q.id == questionId);
            if (question) {
       
                section.changeContent='update'
                question.changeContent='update'
                question.answers.push({
                    id: maxAnswerId,
                    answer: 'type here',
                    value: 0,
                    status: 'new',
                    changeContent: 'add',
                    changeAnswer: true
                });

                event.classList.add('bg-yellow-200/70');
                loadBtnSubmit();
                loadForm();
                break; // Menghentikan perulangan setelah menemukan pertanyaan yang sesuai
            }
        }
    }
}

function formBtnDeleteAnswer(event) {
    // //console.log('delete answer',event)
    const sectionId = parseInt(event.id.split('-')[6]);
    const questionId = parseInt(event.id.split('-')[5]);
    const answerId = parseInt(event.id.split('-')[4]);

    for (const section of sectionsCopy) {
        if (section.id == sectionId) {
            const questionIndex = section.questions.findIndex(q => q.id == questionId);
            if (questionIndex == -1) return; // Jika question tidak ditemukan, keluar

            const question = section.questions[questionIndex];
            if(!question) return

            const answerIndex = question.answers.findIndex(a => a.id == answerId)
            const answer = question.answers[answerIndex]
            if (answer.status == 'new') {
                // Jika masih baru, langsung hapus dari array
                question.answers.splice(answerIndex, 1);
            } else {
                // Jika sudah ada di database, tandai sebagai "delete"
                question.changeContent='update'
                section.changeContent='update'
                answer.changeContent = "delete";
                answer.order = 0;
            }
            // //console.log('delete', formCopy)
            break; // **Stop loop setelah menemukan section yang sesuai**
        }
    }
    loadForm(); // Perbarui tampilan form setelah perubahan
    loadBtnSubmit()
}

function loadForm(parameter){
    // //console.log(formJs)
    if(formJs){
        document.getElementById('first-section-add').innerHTML =`
            <a class="pointer-events-auto cursor-pointer hover:bg-slate-100 rounded lg:p-1" id="form-btn-add-section-0">
                <svg class="lg:w-6 lg:h-6 dark:text-gray-800 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44771 1 1v3M3 9v9c0 .5523.44772 1 1 1h16c.5523 0 1-.4477 1-1V9M3 9h18M8 9V5m4 4V5m4 4V5m-6 9h2m0 0h2m-2 0v-2m0 2v2"/>
                </svg>
            </a>
        `
        const formUtils = document.getElementById('form-utils')
        formUtils.innerHTML=`
            <input type="hidden" name="changeContent" value="${formCopy.changeContent}">
            <div class="flex-[1_1_calc(50%-0.5rem)] flex-col justify-center items-center font-bold p-4 bg-gradient-to-t dark:from-blue-400 dark:to-teal-300 from-violet-800 to-slate-900 rounded">
                <p class="text-white dark:text-black">Form Ingin Ditaruh Dimana?</p>
                <select name="placement" id="form-setting-placement" class="border-0 rounded mt-2 ${formCopy.changeSettingPlacement ? 'bg-amber-400 dark:bg-yellow-200/70':'bg-slate-100'}">
                    <option value="pre-test-website" ${formCopy.placement == 'pre-test-website' ? 'selected':''}>pre-test-website</option>
                    <option value="post-test-website" ${formCopy.placement == 'post-test-website' ? 'selected':''}>post-test-website</option>
                    <option value="pre-test-emodul" ${formCopy.placement == 'pre-test-emodul' ? 'selected':''}>pre-test-emodul</option>
                    <option value="post-test-emodul" ${formCopy.placement == 'post-test-emodul' ? 'selected':''}>post-test-emodul</option>
                    <option value="disable" ${formCopy.placement == 'disable' ? 'selected':''}>disable</option>
                </select>
            </div>
            <div class="flex-[1_1_calc(50%-0.5rem)] flex-col justify-center items-center font-bold p-4 bg-gradient-to-t dark:from-blue-400 dark:to-teal-300 from-violet-800 to-slate-900  rounded">
                <p class="text-white dark:text-black">Responden Harus Sertakan Email?</p>
                <select name="collect_email" id="form-setting-email" class="border-0 rounded mt-2 ${formCopy.changeSettingEmail ? 'bg-amber-400 dark:bg-yellow-200/70':'bg-slate-100'}">
                    <option value="1" ${formCopy.collect_email == '1' ? 'selected':''}>Iya</option>
                    <option value="0" ${formCopy.collect_email == '0' ? 'selected':''}>Tidak</option>
                </select>
            </div>
            <div class="flex-[1_1_calc(50%-0.5rem)] flex-col justify-center items-center font-bold p-4 bg-gradient-to-t dark:from-blue-400 dark:to-teal-300 from-violet-800 to-slate-900  rounded">
                <p class="text-white dark:text-black">Responden Cuman Boleh Mengisi Form Satu Kali?</p>
                <select name="one_attempt" id="form-setting-attempt" class="border-0 rounded mt-2 ${formCopy.changeSettingAttempt ? 'bg-amber-400 dark:bg-yellow-200/70':'bg-slate-100'}">
                    <option value="1" ${formCopy.one_attempt == '1' ? 'selected':''}>Iya</option>
                    <option value="0" ${formCopy.one_attempt == '0' ? 'selected':''}>Tidak</option>
                </select>
            </div>
            <div class="flex-[1_1_calc(50%-0.5rem)] flex-col justify-center items-center font-bold p-4 bg-gradient-to-t dark:from-blue-400 dark:to-teal-300 from-violet-800 to-slate-900  rounded">
                <p class="text-white dark:text-black">Apakah Form Harus Diisi?</p>
                <select name="must_fill" id="form-setting-fill" class="border-0 rounded mt-2 ${formCopy.changeSettingAttempt ? 'bg-amber-400 dark:bg-yellow-200/70':'bg-slate-100'}">
                    <option value="1" ${formCopy.must_fill == '1' ? 'selected':''}>Iya</option>
                    <option value="0" ${formCopy.must_fill == '0' ? 'selected':''}>Tidak</option>
                </select>
            </div>
        `
        const formField = document.getElementById('form-name-field')
        formField.value = formCopy.form_name
        // Urutkan berdasarkan properti 'order'
        sectionsCopy.sort((a, b) => a.order - b.order);

        let sectionSession = ``
        sectionsCopy.forEach(section => {
            sectionSession += `
                <div class="rounded w-full flex justify-center items-start gap-2 ${section.changeContent == 'delete' ? 'hidden' : ''}">
                    <div class="dark:bg-white bg-slate-700 rounded w-full p-4">
                        <div class="flex justify-between">
                            <div class="flex items-center dark:bg-gray-100 bg-slate-600 rounded p-2 w-full mb-3">
                                <p class="dark:text-gray-500 text-white font-bold">Section ${section.order}</p>
                            </div>
                            <div>
                                <a data-popover-target="popover-up-section-${section.id}" id="form-order-up-section-${section.id}" 
                                    class="pointer-events-auto cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-400">
                                    <svg class="lg:w-6 lg:h-6 dark:text-gray-800 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 14-4-4-4 4"/>
                                    </svg>
                                </a>
                                    <div data-popover id="popover-up-section-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                    <div class="py-2 px-3">
                                        <p>Naikkan section</p>
                                    </div>
                                    <div data-popper-arrow></div>
                                </div>
                                <a data-popover-target="popover-down-section-${section.id}" id="form-order-down-section-${section.id}" 
                                    class="pointer-events-auto cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-400">
                                    <svg class="lg:w-6 lg:h-6 dark:text-gray-800 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 10 4 4 4-4"/>
                                    </svg>
                                </a>
                                <div data-popover id="popover-down-section-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                    <div class="py-2 px-3">
                                        <p>Turunkan section</p>
                                    </div>
                                    <div data-popper-arrow></div>
                                </div>
                            </div>
                        </div>
                        <input type="hidden" name="sections[${section.id}][formId]" value="${formCopy.id}">
                        <input type="hidden" name="sections[${section.id}][section_id]" value="${section.id}">
                        <input type="hidden" name="sections[${section.id}][order]" value="${section.order}">
                        <input type="hidden" name="sections[${section.id}][status]" value="${section.status??''}">
                        <input type="hidden" name="sections[${section.id}][changeContent]" value="${section.changeContent ?? 'l'}">

                        <textarea class="text-2xl rounded border-1 border-slate-300 w-full ${section.changeSection ? 'bg-yellow-200/70 ':'bg-gray-100'}" id="form-section-name-${section.id}" name="sections[${section.id}][name]">${section.name}</textarea>
                        <textarea class="text-md rounded border-1 border-slate-300 w-full min-h-[50px] max-h-[500px] overflow-y-auto resize-none  ${section.changeSectionDesc ? 'bg-yellow-200/70 ':'bg-gray-100'}" id="form-section-description-${section.id}" name="sections[${section.id}][description]">${section.description}</textarea>
                    </div> 
                    <div class="dark:bg-white bg-slate-700 rounded lg:p-1 h-full flex justify-center items-center flex-col gap-1">
                        <a data-popover-target="popover-add-section-${section.id}" class="pointer-events-auto cursor-pointer hover:bg-slate-300 rounded lg:p-1" id="form-btn-add-section-${section.order}">
                            <svg class="lg:w-6 lg:h-6 dark:text-gray-800 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44771 1 1v3M3 9v9c0 .5523.44772 1 1 1h16c.5523 0 1-.4477 1-1V9M3 9h18M8 9V5m4 4V5m4 4V5m-6 9h2m0 0h2m-2 0v-2m0 2v2"/>
                            </svg>
                        </a>
                        <div data-popover id="popover-add-section-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                            <div class="py-2 px-3">
                                <p>Tambahkan section</p>
                            </div>
                            <div data-popper-arrow></div>
                        </div>

                        <a data-popover-target="popover-delete-section-${section.id}" class="pointer-events-auto cursor-pointer hover:bg-slate-300 rounded p-1" id="form-btn-delete-section-${section.id}">
                            <svg class="lg:w-6 lg:h-6 dark:text-gray-800 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clip-rule="evenodd"/>
                            </svg>                                                                                       
                        </a>
                        <div data-popover id="popover-delete-section-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                            <div class="py-2 px-3">
                                <p>Hapus Section</p>
                            </div>
                            <div data-popper-arrow></div>
                        </div>

                        <a data-popover-target="popover-add-question-section-${section.id}" class="pointer-events-auto cursor-pointer hover:bg-slate-300 rounded p-1" id="form-btn-add-question-id-order-0-section-${section.id}">
                            <svg class="lg:w-6 lg:h-6 dark:text-gray-800 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clip-rule="evenodd"/>
                            </svg>
                        </a>
                        <div data-popover id="popover-add-question-section-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                            <div class="py-2 px-3">
                                <p>Tambahkan Question</p>
                            </div>
                            <div data-popper-arrow></div>
                        </div>

                        <a data-popover-target="popover-copy-section-${section.id}" class="pointer-events-auto cursor-pointer hover:bg-slate-300 rounded p-1" id="form-btn-copy-section-${section.id}">
                            <svg class="w-6 h-6 dark:text-gray-800 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M18 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1V9a4 4 0 0 0-4-4h-3a1.99 1.99 0 0 0-1 .267V5a2 2 0 0 1 2-2h7Z" clip-rule="evenodd"/>
                                <path fill-rule="evenodd" d="M8 7.054V11H4.2a2 2 0 0 1 .281-.432l2.46-2.87A2 2 0 0 1 8 7.054ZM10 7v4a2 2 0 0 1-2 2H4v6a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z" clip-rule="evenodd"/>
                            </svg>
                        </a>
                        <div data-popover id="popover-copy-section-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                            <div class="py-2 px-3">
                                <p>Salin Section</p>
                            </div>
                            <div data-popper-arrow></div>
                        </div>
                    </div>
                </div>
            `
                section.questions.sort((a, b) => a.order - b.order);

                section.questions.forEach((question,index) => {
                    let answerSection = ``
                    if(question.input_type == 'pilgan'){
                        answerSection += `
                        <div class="flex justify-between items-center gap-2 my-3">
                            <div id="form-type" class="flex justify-center items-center flex-col">
                                <label for="form-answer-type" class="text-white dark:text-black">Answer Type:</label>
                                <input type="hidden" name="sections[${section.id}][questions][${question.id}][question_id]" value="${question.id}">
                                <select class="${question.changeTypeAnswer ? 'bg-yellow-200/70 ':'bg-gray-100'} border-0 rounded mt-2" id="form-answer-type-${question.id}" name="sections[${section.id}][questions][${question.id}][input_type]">
                                    <option value="text">Text</option>
                                    <option value="pilgan" selected>Pilihan Ganda</option>
                                </select>
                            </div>
                        </div>
                        `
                        
                        if(question.answers.length == 0){
                            answerSection += ``
                        }else{
                            question.answers.forEach((answer,index) =>{
                                answerSection += `
                                    <div class="flex justify-center items-center my-1 gap-1 ${answer.changeContent == 'delete' ? 'hidden':''}">
                                        <div class="flex justify-center items-center h-full" id="form-btn-delete-answer-${answer.id}-${question.id}-${section.id}-${index+1}">
                                            <svg class="pointer-events-auto cursor-pointer lg:w-6 lg:h-6 text-red-600 aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fill-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clip-rule="evenodd"/>
                                            </svg>
                                        </div>
                                        
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][answer][${index+1}][section_id]" value="${section.id}">
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][answer][${index+1}][answer_id]" value="${answer.id}">
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][answer][${index+1}][changeContent]" value="${answer.changeContent ?? ''}">
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][answer][${index+1}][status]" value="${answer.status??''}">
                                        
                                        <div class="flex justify-center items-end gap-2 w-full">
                                            <input class="form-check-input rounded border-1 border-slate-300 w-full ${answer.changeAnswer ? 'bg-yellow-200/70 ':'bg-gray-100'}" 
                                                id="answer-${section.id}-${question.id}-${answer.id}-${index+1}"  
                                                name="sections[${section.id}][questions][${question.id}][answer][${index+1}][answer]" 
                                                type="text" 
                                                value="${answer.answer}" required>

                                            <div class="flex flex-col w-1/4 text-center">
                                                <label for="answer-value-${section.id}-${question.id}-${answer.id}-${index+1}" class="text-white dark:text-black">Value</label>
                                                <input class="form-check-input rounded border-1 border-slate-300 ${answer.changeAnswer ? 'bg-yellow-200/70 ':'bg-gray-100'}"
                                                    type="number" 
                                                    id="answer-value-${section.id}-${question.id}-${answer.id}-${index+1}" 
                                                    name="sections[${section.id}][questions][${question.id}][answer][${index+1}][value]" 
                                                    value="${answer.value}">
                                            </div>
                                        </div>
                                    </div>
                                `
                            })
                        }
                        answerSection +=`
                            <div id="form-btn-add-answer" data-question-id="${question.id}" class="flex justify-center items-center">
                                <div class="bg-green-400 rounded py-2 m-3 w-full pointer-events-auto cursor-pointer hover:bg-green-600 flex justify-center items-center">
                                    <p class="text-white">Add</p>
                                </div>
                            </div>
                        `
                    
                    }else if(question.input_type == 'text'){
                        answerSection += `
                            <div id="form-type" class="flex justify-between my-3 ${question.changeContent == 'delete' ? 'hidden':''}">
                                <label for="form-answer-type">Answer Type:</label>
                                <input type="hidden" name="sections[${section.id}][questions][${question.id}][question_id]" value="${question.id}">
                                <select class="${question.changeTypeAnswer ? 'bg-yellow-200/70':'bg-gray-100'} border-0 rounded mt-2" id="form-answer-type-${question.id}" name="sections[${section.id}][questions][${question.id}][input_type]">
                                    <option value="text" selected>Text</option>
                                    <option value="pilgan">Pilihan Ganda</optio>
                                </select>
                            </div>
                            
                            <div
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                id="answer-${question.id}-text" 
                                aria-label="Text input for following question">Text Input
                            </div>
                        `
                    }
                    sectionSession += `
                            <div class="soal-1 w-full flex justify-center items-start gap-2 ${question.changeContent == 'delete' || section.changeContent == 'delete' ? 'hidden' : ''}">
                                <div class="${question.changeOrder || question.changeContent=='update' || question.changeContent=='add' ? 'bg-yellow-200/70 ':'dark:bg-white bg-slate-700'} rounded p-4 w-full ms-7">
                                    <div class="flex items-center gap-2">
                                        <div>
                                            <a data-popover-target="popover-up-question-${question.id}-${section.id}" id="form-order-up-question-${question.id}-order-${question.order}-section-${section.id}" data-question-id=${question.id} data-section-id=${section.id} class="pointer-events-auto cursor-pointer hover:bg-slate-700">
                                                <svg class="lg:w-6 lg:h-6 dark:text-gray-400 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 14-4-4-4 4"/>
                                                </svg>
                                            </a>
                                            <div data-popover id="popover-up-question-${question.id}-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                                <div class="py-2 px-3">
                                                    <p>Naikkan Question</p>
                                                </div>
                                                <div data-popper-arrow></div>
                                            </div>

                                            <a data-popover-target="popover-down-question-${question.id}-${section.id}" id="form-order-down-question-${question.id}-order-${question.order}-section-${section.id}" data-question-id=${question.id} data-section-id=${section.id} class="pointer-events-auto cursor-pointer hover:bg-slate-700">
                                                <svg class="lg:w-6 lg:h-6 dark:text-gray-400 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 10 4 4 4-4"/>
                                                </svg>
                                            </a>
                                            <div data-popover id="popover-down-question-${question.id}-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                                <div class="py-2 px-3">
                                                    <p>Turunkan Question</p>
                                                </div>
                                                <div data-popper-arrow></div>
                                            </div>
                                        </div>
                    
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][rule]" value="${question.rules}">
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][question_id]" value="${question.id}">
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][changeContent]" value="${question.changeContent ?? ''}">
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][status]" value="${question.status??''}">
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][order]" value="${question.order}">
                                        
                                        <textarea class="rounded border-1 border-slate-300 w-full ${question.changeQuestion ? 'bg-yellow-200/70 ':'bg-gray-100'}" id="question-${section.id}-${question.id}" name="sections[${section.id}][questions][${question.id}][question]">${question.question}</textarea>
                                    </div>
                                    <div class="answer-list flex flex-col w-full">
                                        ${answerSection}
                                    </div>
                                </div>
                                <div class="bg-slate-700 dark:bg-white rounded p-1 flex justify-center items-center flex-col gap-1">
                                    <a data-popover-target="popover-add-section-question-${question.id}-${section.id}" class="pointer-events-auto cursor-pointer" id="form-btn-add-section-${section.order}">
                                        <svg class="lg:w-6 lg:h-6 dark:text-gray-800 text-white hover:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44771 1 1v3M3 9v9c0 .5523.44772 1 1 1h16c.5523 0 1-.4477 1-1V9M3 9h18M8 9V5m4 4V5m4 4V5m-6 9h2m0 0h2m-2 0v-2m0 2v2"/>
                                        </svg>
                                    </a>
                                    <div data-popover id="popover-add-section-question-${question.id}-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                        <div class="py-2 px-3">
                                            <p>Tambahkan Section</p>
                                        </div>
                                        <div data-popper-arrow></div>
                                    </div>

                                    <a data-popover-target="popover-add-question-${question.id}-${section.id}" class="pointer-events-auto cursor-pointer" id="form-btn-add-question-${question.id}-order-${question.order}-section-${section.id}">
                                        <svg class="lg:w-6 lg:h-6 dark:text-gray-800 text-white hover:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clip-rule="evenodd"/>
                                        </svg>
                                    </a>
                                    <div data-popover id="popover-add-question-${question.id}-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                        <div class="py-2 px-3">
                                            <p>Tambahkan Question</p>
                                        </div>
                                        <div data-popper-arrow></div>
                                    </div>

                                    <a data-popover-target="popover-delete-question-${question.id}-${section.id}" class="pointer-events-auto cursor-pointer" id="form-btn-delete-question-${question.id}-order-${question.order}-section-${section.id}">
                                        <svg class="lg:w-6 lg:h-6 dark:text-gray-800 text-white hover:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clip-rule="evenodd"/>
                                        </svg>                                                                                       
                                    </a>
                                    <div data-popover id="popover-delete-question-${question.id}-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                        <div class="py-2 px-3">
                                            <p>Hapus Question</p>
                                        </div>
                                        <div data-popper-arrow></div>
                                    </div>

                                    <a  data-popover-target="popover-copy-question-${question.id}-${section.id}" class="pointer-events-auto cursor-pointer hover:bg-slate-100 rounded p-1" id="form-btn-copy-question-${question.id}-order-${question.order}-section-${section.id}">
                                        <svg class="w-6 h-6 dark:text-gray-800 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fill-rule="evenodd" d="M18 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1V9a4 4 0 0 0-4-4h-3a1.99 1.99 0 0 0-1 .267V5a2 2 0 0 1 2-2h7Z" clip-rule="evenodd"/>
                                            <path fill-rule="evenodd" d="M8 7.054V11H4.2a2 2 0 0 1 .281-.432l2.46-2.87A2 2 0 0 1 8 7.054ZM10 7v4a2 2 0 0 1-2 2H4v6a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z" clip-rule="evenodd"/>
                                        </svg>
                                    </a>
                                    <div data-popover id="popover-copy-question-${question.id}-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                        <div class="py-2 px-3">
                                            <p>Salin Question</p>
                                        </div>
                                        <div data-popper-arrow></div>
                                    </div>

                                </div>
                            </div>
                            `
                })
        });

        document.getElementById('form-content').innerHTML=sectionSession

        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.style.height = 'auto'; // Reset tinggi biar gak terus bertambah
            textarea.style.overflow = 'hidden'; // Hindari scrollba
        
            function adjustHeight() {
                textarea.style.height = 'auto'; // Reset dulu agar dapat ukuran baru
                textarea.style.height = textarea.scrollHeight + 'px'; // Atur tinggi sesuai konten
            }
            
            textarea.removeEventListener('input', adjustHeight);
            textarea.addEventListener('input', adjustHeight);
            adjustHeight(); // Panggil sekali saat halaman dimuat
        });
    }
}

const container = document.getElementById('form');
if(container){
    document.getElementById('form').addEventListener('submit', formSubmit)
}


/* INPUT EVENTS */
setTimeout(() => {
    container.addEventListener('input', function(e) {
        // Form Name
        if (e.target.matches('[id^="form-name-field"]')) updateFormName(e.target)
        // Form
        if (e.target.matches('[id^="form-setting-"]')) updateFormSetting(e)
        // Section
        if (e.target.matches('[id^="form-section-"]')) sectionFieldChange(e)
        // Question
        if (e.target.matches('[id^="question-"]')) questionFieldChange(e)

        // Answer
        if (e.target.matches('[id^="answer-"]')) answerFieldChange(e)
    
        // Answer Value
        if (e.target.matches('[id^="answer-value-"]')) answerValueChange(e)        
    });

    /* CHANGE EVENTS */
    container.addEventListener('change', function(e) {
        if (e.target.matches('[id^="form-answer-type-"]')) {
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formAnswerTypeChange(e)
                document.getElementById('jsLoader').classList.add('hidden');
            },10)
        }
    });

/* CLICK EVENTS */
    container.addEventListener('click', function(e) {
        // ---------------------------- SECTION -------------------------
        if (e.target.closest('[id^="form-order-up-section-"]')) {
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formOrderUpSection(e.target.closest('[id^="form-order-up-section-"]'))
                document.getElementById('jsLoader').classList.add('hidden');
            },10)
        };
        if (e.target.closest('[id^="form-order-down-section-"]')) {
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formOrderDownSection(e.target.closest('[id^="form-order-down-section-"]'))
                document.getElementById('jsLoader').classList.add('hidden');
            },10)
        };
        if (e.target.closest('[id^="form-btn-add-section-"]')) {
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formBtnAddSection(e.target.closest('[id^="form-btn-add-section-"]'));
                document.getElementById('jsLoader').classList.add('hidden');
            },10)
        }
        if (e.target.closest('[id^="form-btn-copy-section-"]')) {
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formBtnCopySection(e.target.closest('[id^="form-btn-copy-section-"]'))
                document.getElementById('jsLoader').classList.add('hidden');
            },10)
        }
        if (e.target.closest('[id^="form-btn-delete-section-"]')) {
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formBtnDeleteSection(e.target.closest('[id^="form-btn-delete-section-"]'))
                document.getElementById('jsLoader').classList.add('hidden');
            },10)
        }

        // --------------------- QUESTION ------------------------
        if (e.target.closest('[id^="form-btn-add-question-"]')) {
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formBtnAddQuestion(e.target.closest('[id^="form-btn-add-question-"]'))
                document.getElementById('jsLoader').classList.add('hidden');
            },10)
        };
        if (e.target.closest('[id^="form-btn-copy-question-"]')) {
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formBtnCopyQuestion(e.target.closest('[id^="form-btn-copy-question-"]'))
                document.getElementById('jsLoader').classList.add('hidden');
            },10)
        };
        
        if (e.target.closest('[id^="form-btn-delete-question-"]')) {
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formBtnDeleteQuestion(e.target.closest('[id^="form-btn-delete-question-"]'))
                document.getElementById('jsLoader').classList.add('hidden');
            },10)
        }
    
        if (e.target.closest('[id^="form-order-up-question-"]')) {
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formOrderUpQuestion(e.target.closest('[id^="form-order-up-question-"]'))
                document.getElementById('jsLoader').classList.add('hidden');
            },10)
        };
        if (e.target.closest('[id^="form-order-down-question-"]')) {
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formOrderDownQuestion(e.target.closest('[id^="form-order-down-question-"]'))
                document.getElementById('jsLoader').classList.add('hidden');
            },10)
        }
    
        // ------------ ANSWER --------------------
        if (e.target.closest('[id^="form-btn-add-answer"]')) {
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formBtnAddAnswer(e.target.closest('[id^="form-btn-add-answer"]'))
                document.getElementById('jsLoader').classList.add('hidden');
            },10)
        }
        if (e.target.closest('[id^="form-btn-delete-answer-"]')) {
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formBtnDeleteAnswer(e.target.closest('[id^="form-btn-delete-answer-"]'))
                document.getElementById('jsLoader').classList.add('hidden');
            },10)
        };
    });
}, 0);
