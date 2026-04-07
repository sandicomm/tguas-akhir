// ======== FLOWBITE COMPONENTS =========
import { initModals } from 'flowbite';
import { globals } from './page/globals';
let sections
let stats
let sectionsCopy
let formCopy
let formPlacementDb
let fileDb
let itemSelected
let SECTION_MAX_ID
let QUESTION_MAX_ID
let ANSWER_MAX_ID
let isFormDirty=false;

document.addEventListener('DOMContentLoaded', function(){
    formCopy = JSON.parse(JSON.stringify(formJs));
    formPlacementDb = JSON.parse(JSON.stringify(formPlacementJs));
    fileDb = JSON.parse(JSON.stringify(fileJs));
    SECTION_MAX_ID = sectionMaxID
    QUESTION_MAX_ID = questionMaxID
    ANSWER_MAX_ID = answerMaxID
    sectionsCopy = formCopy.sections
    
    loadForm()
    setListenerSetImage()
})

function getEl(id ,name = "Elemen") {
   const el = document.getElementById(id);
    
    if (!el) {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
            detail: { pesan: `${name} tidak ditemukan dalam DOM`, status: false } 
        }));
        console.error(`${name} tidak ditemukan dalam DOM`, id)
        return null;
    }
    return el;
}

setInterval(async () => {
    if (isFormDirty) {
        // Ambil data terbaru dari form/state
        let formData = formCopy
        formData.sections = normalizeSectionsToKeyedObject(formData, sectionsCopy);
        // Jalankan save secara silent
        await submitInBatch(formData, true); 
        
        // Reset status dirty setelah berhasil save
        isFormDirty = false; 
    }
},5 * 60 * 1000); // Cek setiap 5 menit


function loadBtnSubmit(){
    const formUpdate = getEl('btn-update-form');
    if (!formUpdate) return;
    isFormDirty=true
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
    document.getElementById('jsLoader')?.classList.remove('hidden');
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
     document.getElementById('jsLoader')?.classList.remove('hidden');
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

const chunk = (arr, size) => {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
};

function validateBeforeSubmit(fullData) {
     document.getElementById('jsLoader')?.classList.remove('hidden');
  const sections = fullData.sections;

  // ✅ Form wajib punya minimal 1 section aktif
  const activeSections = Object.values(sections || {}).filter(
    s => s.changeContent != 'delete'
  );

  if (activeSections.length == 0) {

    window.dispatchEvent(new CustomEvent('notif-pesan', { 
        detail: { pesan: 'Form harus memiliki minimal 1 section', status:false} 
    }));
    return false;
  }

  for (const section of Object.values(sections)) {
    const isSectionDeleted = section.changeContent == 'delete';
    const questions = Object.values(section.questions || {}).filter(
        q => q.changeContent != 'delete'
    );

    // ✅ Section aktif wajib punya question
    if (!isSectionDeleted && questions.length == 0) {

        window.dispatchEvent(new CustomEvent('notif-pesan', { 
            detail: { pesan: `Section "${section.name}" wajib memiliki question`, status:false} 
        }));
        return false;
    }

    for (const question of questions) {
      const isQuestionDeleted = question.changeContent == 'delete';

      // ✅ Jika aktif & pilgan, answer wajib ada
      if (!isQuestionDeleted && question.input_type == 'pilgan') {
        const answers = Object.values(question.answer || {}).filter(
            a => a.changeContent != 'delete'
        );

        if (answers.length == 0) {
            window.dispatchEvent(new CustomEvent('notif-pesan', { 
                detail: { pesan: `Question "${question.question}" wajib memiliki jawaban`, status:false} 
            }));
            return false;
        }
      }
    }
  }

  return true;
}

function filterChangedData(fullData) {
    document.getElementById('jsLoader')?.classList.remove('hidden');
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
          image: q.image,
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
              image: a.image,
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
let raw2=''

function showToast(message) {
    const toast = document.getElementById('toast-autosave');
    const text = document.getElementById('toast-message');

    text.innerText = message;
    
    // Munculkan toast
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
}

async function submitInBatch(form, isAutosave = false) {
    document.getElementById('jsLoader')?.classList.remove('hidden');
  try {
    //console.log(form)
    if (!validateBeforeSubmit(form)) {
        document.getElementById('jsLoader')?.classList.add('hidden');
        return;
    }
    let fileDbSubmit = fileDb.filter(file => file.action)
    const fileDbChunk = chunk(fileDbSubmit,15)
    
    for (let i = 0; i < fileDbChunk.length; i++) {
        const formFileDb = new FormData();  
        fileDbChunk[i].forEach((fileD,idx)=>{
            //console.log(fileD)
            formFileDb.append(`form_id`, form.id);
            formFileDb.append(`items[${idx}][id]`, fileD.id);
            formFileDb.append(`items[${idx}][type]`, fileD.type);
            formFileDb.append(`items[${idx}][filetype]`, fileD.filetype ?? '');
            formFileDb.append(`items[${idx}][action]`, fileD.action ?? '');
            formFileDb.append(`items[${idx}][file]`, fileD.file);
            formFileDb.append(`items[${idx}][url]`, fileD.blob);
        })

        let response = await fetch('/form/update', {
            method: 'POST',
            headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            'Accept': 'application/json'
            },
            body: formFileDb
        });

        if (response.status === 419 || response.status === 401) {
            allowUnload = true;

            window.dispatchEvent(new CustomEvent('redirect-modal', { 
                detail: { pesan: 'Session Berakhir silahkan login ulang', url: redirect, status:false } 
            }));
            return;
        }

        let json = await response.json();
        
        redirect = json.redirect
       console.log('send file Db:', Object.fromEntries(formFileDb.entries()), json)
        if (!json.success) {
            console.log('gagal:', json.message ,json)
            window.dispatchEvent(new CustomEvent('notif-pesan', { 
                detail: { pesan: json.message, status:false } 
            }));
            return;
        }
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
        document.getElementById('jsLoader')?.classList.remove('hidden');
        let response = await fetch('/form/update', {
          method: 'POST',
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(baseData)
        });

        if (response.status === 419 || response.status === 401) {
            allowUnload = true;

            window.dispatchEvent(new CustomEvent('redirect-modal', { 
                detail: { pesan: 'Session Berakhir silahkan login ulang', url: redirect, status:false } 
            }));
            return;
        }
    
        let json = await response.json();
        
        redirect = json.redirect
       console.log('send 0 length:', baseData)
        if (!json.success) {
           console.log('gagal:', json.message)
            window.dispatchEvent(new CustomEvent('notif-pesan', { 
                detail: { pesan: json.message, status:false } 
            }));
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
          method: 'POST',
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
    
        let json = await response.json();
        raw2=json
        redirect = json.redirect
        
        console.log('send uhuy:', payload, json)
        if (!json.success) {
            //console.log('gagal:', json)
            window.dispatchEvent(new CustomEvent('notif-pesan', { 
                detail: { pesan: json.message, status:false } 
            }));
            return;
        }
    }

    document.getElementById('jsLoader')?.classList.add('hidden');
    
    if (isAutosave) {
        //console.log('Autosave sukses');
        showToast('Form disimpan otomatis'); // Contoh notifikasi kecil
        isFormDirty=false
        allowUnload=true
        window.location.href = redirect
    } else {
        // Jika manual, jalankan event redirect kamu yang lama
        window.dispatchEvent(new CustomEvent('redirect-modal', { 
            detail: { pesan: 'Data form telah berhasil diperbarui.', url: redirect, status:true } 
        }));
        isFormDirty=false
    }

    //console.log({raw, raw2})

  } catch (err) {
    //console.log(err,{raw, raw2})
    window.dispatchEvent(new CustomEvent('notif-pesan', { 
        detail: { pesan: 'Terjadi Kesalahan', status:false } 
    }));
    
  }
}

async function formSubmit(event) {
    document.getElementById('jsLoader')?.classList.remove('hidden'); // tampil

    event.preventDefault();
    let formData = formCopy
    formData.sections = normalizeSectionsToKeyedObject(formData, sectionsCopy);

    //console.log(formData)
    await submitInBatch(formData); // ✔ wajib tunggu dulu!

    document.getElementById('jsLoader')?.classList.add('hidden'); 
    allowUnload = true;
}

function displayErrors(errors) {
    let errorContainer = getEl('error-container');
    if (!errorContainer) return;

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
    event.style.backgroundColor='rgba(216, 211, 54, 0.35)'
    formCopy.change = true;
    formCopy.changeContent='update'
    loadBtnSubmit();
}

function updateFormSetting (event) {
    if('placement' == event.target.id.split('-')[2]){
        console.log(formPlacementDb)
        if(Object.values(formPlacementDb).includes(event.target.value) && event.target.value != 'disable'){
            console.log('udah ada')
            window.dispatchEvent(new CustomEvent('redirect-modal', { 
                detail: { 
                    pesan: 'Placement Sudah Diterapkan Di Form Lain, Jika Perubahan Ini Disimpan Maka Status Placement Akan Dipindahkan Ke Form Ini', 
                    url: 'gk redirect', status:false } 
            }));
        }
        formCopy.placement = event.target.value
        event.target.classList.add('bg-yellow-400')
        formCopy.changeSettingPlacement = true

        formCopy.changeContent='update'
        loadBtnSubmit()

    }else if('email' == event.target.id.split('-')[2]){
        formCopy.collect_email = event.target.value
        event.target.classList.add('bg-yellow-400')
        formCopy.changeSettingEmail = true

        formCopy.changeContent='update'
        loadBtnSubmit()
        
    }else if('attempt' == event.target.id.split('-')[2]){
        formCopy.one_attempt = event.target.value
        event.target.classList.add('bg-yellow-400')
        formCopy.changeSettingAttempt= true
        
        formCopy.changeContent='update'
        loadBtnSubmit()

    }else if('fill' == event.target.id.split('-')[2]){
        formCopy.must_fill = event.target.value
        event.target.classList.add('bg-yellow-400')
        formCopy.changeSettingAttempt= true

        formCopy.changeContent='update'
        loadBtnSubmit()

    }else{
        return
    }
}
// ------------------------------- SECTION -------------------------------
function formOrderDownSection(event){
    const sectionId = parseInt(event.id.split('-')[4]);
    //console.log(sectionId)
    
    const section = sectionsCopy.find(sec =>  parseInt(sec.id) == sectionId);
    let sectionEl = getEl(`container-section-${sectionId}`)
    if (!section || !sectionEl) return;
    
    const nextSection = sectionsCopy.find(nextSec =>  nextSec.order ==  parseInt(section.order) + 1);
    
    if (!nextSection) return;

    if (nextSection) {
        //console.log(event)
        sectionEl.querySelector('[id^="wrapper-section"]').style.backgroundColor='rgba(216, 211, 54, 0.35)'
        sectionEl.querySelectorAll('[id^="wrapper-question-"]').forEach(q=>{
            //console.log(q)
            q.style.backgroundColor='rgba(216, 211, 54, 0.35)'
        })
        const target = sectionEl.nextElementSibling;
        if (!target) return;

        // Tukar dataset dan posisi DOM
        target.insertAdjacentElement('afterend', sectionEl);

        // Tukar nilai order
        let temp=nextSection.order
        nextSection.order=section.order
        section.order=temp
        // [section.order, nextSection.order] = [nextSection.order, section.order];

        section.changeContent = 'update';
        nextSection.changeContent = 'update';

        section.change = true;
        nextSection.changeOrder = true;
        
        loadBtnSubmit();
        //console.log(sectionsCopy)
    }
}

function formOrderUpSection(event){
    const sectionId = parseInt(event.id.split('-')[4]);
    
    const section = sectionsCopy.find(sec =>  parseInt(sec.id) == sectionId);
    let sectionEl = getEl(`container-section-${sectionId}`)
    if(!sectionEl) return

    //console.log(section, sectionEl)
    if (!section) return;
    
    const nextSection = sectionsCopy.find(nextSec =>  nextSec.order ==  parseInt(section.order) - 1);
    //console.log(nextSection)
    
    if (nextSection &&  parseInt(section.order) > 1) {
        // Tukar nilai order
        sectionEl.children[0].style.backgroundColor='rgba(216, 211, 54, 0.35)'
        const target = sectionEl.previousElementSibling;
        //console.log(target)
        if (!target) return;
        
        // Tukar dataset dan posisi DOM
        target.insertAdjacentElement('afterend', sectionEl);

        let temp=nextSection.order
        nextSection.order=section.order
        section.order=temp

        // [section.order, nextSection.order] = [nextSection.order, section.order];

        section.changeContent = 'update';
        nextSection.changeContent = 'update';

        section.change = true;
        nextSection.changeOrder = true;

        loadBtnSubmit();
    }
}

function formBtnAddSection(event){
    const sectionId = parseInt(event.id.split('-')[4])
    const sectionTarget = sectionsCopy.find(sec => sec.id == sectionId)
    //console.log(sectionId,sectionTarget, event.id)
    //console.log(sectionId, event.id,sectionTarget)

    sectionsCopy.forEach(section => {
        //console.log(section, )
        if (parseInt(section.order) > sectionTarget.order) {
            section.order = parseInt(section.order) + 1;
            section.changeContent = 'update'
        }
    })

    const dataNewSection = {
        id: parseInt(getMax(sectionsCopy).sectionId) + 1,
        name: 'type here',
        description: 'type here',
        status:'new',
        changeContent: 'add',
        changeOrder: true,
        changeSection: true,
        changeSectionDesc: true,
        order: parseInt(sectionTarget.order) + 1,
        questions: []
    }

    sectionsCopy.push(dataNewSection);

    const sectionElTarget = getEl(`container-section-${sectionTarget.id}`)
    if(!sectionElTarget) return
    sectionElTarget.insertAdjacentHTML('afterend', generateSingleSection(dataNewSection,'', true))

    loadBtnSubmit()
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

    const containerSection = getEl(`container-section-${sectionId}`)
    if(!containerSection) return

    containerSection.insertAdjacentHTML('afterend',generatorSection(copySection, true))
    //console.log(sectionsCopy)
    loadBtnSubmit()
}

function formBtnDeleteSection(event) {
    const sectionAktif = sectionsCopy.filter(sec => sec.changeContent !== 'delete');

    //console.log(sectionAktif);
    if (sectionAktif.length === 1) {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
            detail: { pesan: 'Section Tidak Boleh Kosong (Minimal sisa 1)', status: false } 
        }));
        //console.log('Operasi dibatalkan: Semua section dihapus.');
        return;
    }
        
    const sectionId = parseInt(event.id.split('-')[4]);

    const sectionIndex = sectionsCopy.findIndex(s => s.id == sectionId);
    if (sectionIndex == -1) return; // Jika question tidak ditemukan, keluar

    const section = sectionsCopy[sectionIndex];
    
    // Perbarui urutan hanya untuk pertanyaan setelahnya
    for (let i = sectionIndex; i < sectionsCopy.length; i++) {
        if(sectionsCopy[i].id != sectionId && sectionsCopy[i].changeContent != 'delete' && parseInt(sectionsCopy[i].order) > section.order){
            sectionsCopy[i].order = Math.max(1, parseInt(sectionsCopy[i].order) - 1);
            sectionsCopy[i].changeContent = 'update';
        }
    }

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
    
    const containerSection = getEl(`container-section-${sectionId}`)
    if(!containerSection) return
    containerSection.remove()
    //console.log(sectionsCopy)
    loadBtnSubmit()
}

function sectionFieldChange(event) {
   
    const sectionId = parseInt(event.target.id.split('-')[3])
    const sectionPart = event.target.id.split('-')[2]

    const section = sectionsCopy.find(sec => sec.id == sectionId)
    if(!section) return;

    if(sectionPart == 'name'){
        section.name = event.target.value
        section.changeContent = 'update'

        event.target.style.backgroundColor='rgba(216, 211, 54, 0.35)'
        section.changeSection = true
        loadBtnSubmit()

    }else if(sectionPart == 'description'){
        section.description = event.target.value
        section.changeContent = 'update'

        event.target.style.backgroundColor='rgba(216, 211, 54, 0.35)'
        section.changeSectionDesc = true 
        loadBtnSubmit()
    }

}

// ------------------------------- QUESTION -------------------------------
function questionFieldChange(event) {
    const el = event.target
    const sectionId = parseInt(el.id.split('-')[1])
    const questionId = parseInt(el.id.split('-')[2])

    // --- LOGIKA AUTO RESIZE ---
    el.style.height = 'auto'; // Reset tinggi dulu
    el.style.height = el.scrollHeight + 'px'; // Set sesuai tinggi konten asli
    // ---------------------------

    const sections = sectionsCopy.find(sec => sec.id == sectionId)
    if(!sections) return

    const question = sections.questions.find(q => q.id == questionId)

    if(question){
        sections.changeContent='update'
        question.question = el.value
        question.changeContent = 'update' 
        
        el.style.backgroundColor='rgba(216, 211, 54, 0.35)'
        question.changeQuestion = true

        loadBtnSubmit()
        
    }
}

function formAnswerTypeChange(event) {
    let maxAnswerId = parseInt(getMax(sectionsCopy).answerId) + 1;
    const questionId = parseInt(event.target.id.split('-')[3])
    const sectionId = parseInt(event.target.id.split('-')[4])
    event.target.style.backgroundColor = 'rgba(247, 169, 0, 1)'

    const section = sectionsCopy.find(s=>s.id == sectionId)
    if(!section) return;

    //console.log(sectionsCopy)
    let question=section.questions.find(q => q.id == questionId)

    if(question){
        question.changeContent='update'
        if(question.input_type == 'pilgan'){
            //console.log('uhuy')
            question.answers = question.answers.filter(answer => {
                if (answer.status === 'new') {
                    return false; 
                } else {
                    answer.changeContent = 'delete';
                    return true;
                }
            });
        }else{
            //console.log('uhuy 1')
            if(question.answers.length == 0){
                const answerData={
                    id: maxAnswerId,
                    answer: 'type here',
                    value: 0,
                    status: 'new',
                    changeContent: 'add',
                    changeAnswer: true
                }

                question.answers.push(answerData);
            }else{
                question.answers.forEach(answer=>{
                    if(answer.status == 'new'){
                        answer.changeContent = 'update'
                    }else if(!answer.hasDeleted){
                        answer.changeContent = ''
                    } 
                })
            }
        }

        section.changeContent='update'
        question.input_type = event.target.value
        question.changeContent = 'update'

        event.target.classList.add('bg-yellow-400')
        event.target.classList.remove('text-white')
        event.target.classList.add('text-black')
        
        question.changeTypeAnswer = true

        loadBtnSubmit()
        if(event.target.value == 'pilgan'){
            const formBtnAddAnswer = getEl(`form-btn-add-answer-${questionId}`)
            if(!formBtnAddAnswer) return
            formBtnAddAnswer.classList.remove('hidden')
        }else{
            const formBtnAddAnswer = getEl(`form-btn-add-answer-${questionId}`)
            if(!formBtnAddAnswer) return
            formBtnAddAnswer.classList.add('hidden')
        }
        const answerListQuestionEl = getEl(`answer-wrapper-${questionId}`)
        if(!answerListQuestionEl) return
        answerListQuestionEl.innerHTML=generatorAnswer(section,question) 
    }
}

function formBtnAddQuestion(event) {

    let maxAnswerId = parseInt(getMax(sectionsCopy).answerId) + 1;

    const thisQuestionId = parseInt(event.id.split('-')[4])
    const sectionId = parseInt(event.id.split('-')[6])

    const section = sectionsCopy.find(sec => sec.id == sectionId)
    const question = section.questions.find(question => question.id == thisQuestionId)
    const thisQuestionOrder =question?.order ?? 0
    
    if(section){
        
        section.questions.forEach(question => {
            if (parseInt(question.order) > thisQuestionOrder) {
                question.order = parseInt(question.order) + 1;
                question.changeContent = 'update'
            }
        }); 

        //console.log('add for order:', thisQuestionOrder, section)

        section.changeContent='update'

        const questionData = {
            id: parseInt(getMax(sectionsCopy).questionId) + 1,
            question: 'type here',
            input_type: 'pilgan',
            rules: 1,
            status:'new',
            changeContent: 'add',
            changeQuestion: true,
            changeOrder: true,
            changeTypeAnswer: true,
            changeRule: true,
            section_id: section.id,
            order: thisQuestionOrder + 1,
            answers: [{
                id: maxAnswerId,
                answer: 'type here',
                value: 0,
                status: 'new',
                changeContent: 'add',
                changeAnswer: true
            }]
        }

        section.questions.push(questionData);
        loadBtnSubmit()

        if(thisQuestionId == 0){
            const containerSection=getEl(`container-section-${sectionId}`)
            if(!containerSection) return
            containerSection.children[0].insertAdjacentHTML('afterend', generatorQuestion(section, questionData,true))
        }else{
            const containerQuestion=getEl(`container-question-${thisQuestionId}`)
            if(!containerQuestion) return
            containerQuestion.insertAdjacentHTML('afterend', generatorQuestion(section, questionData,true))
        }

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
    console.log(sectionsCopy)

    const containerQuestion = getEl(`container-question-${questionId}`)
    if(!containerQuestion) return
    containerQuestion.insertAdjacentHTML('afterend', generatorQuestion(copySection,copyQuestion,true))
    loadBtnSubmit()
    
}

let deleteCount=0
function formBtnDeleteQuestion (event) {
    
    const sectionId = parseInt(event.id.split('-')[8]);
    const questionId = parseInt(event.id.split('-')[4]);

    const section = sectionsCopy.find(sec=>sec.id=sectionId)
    if(!section) return

    const questionActive = section.questions.filter(q => q.changeContent !== 'delete');

    //console.log(questionActive);
    if (questionActive.length === 1) {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
            detail: { pesan: 'Question Tidak Boleh Kosong (Minimal sisa 1)', status: false } 
        }));
        //console.log('Operasi dibatalkan: Semua question dihapus.');
        return;
    }

    const questionIndex = section.questions.findIndex(q => q.id == questionId);
    if (questionIndex == -1) return; // Jika question tidak ditemukan, keluar

    const question = section.questions[questionIndex];
    
    for (let i = 0; i < section.questions.length; i++) {
        // //console.log('update order delete:',section.questions[i].id != questionId, section.questions[i].changeContent != 'delete',parseInt(section.questions[i].order) > question.order)
        if(section.questions[i].id != questionId && section.questions[i].changeContent != 'delete' && parseInt(section.questions[i].order) > question.order){
            //console.log('update order af delete:',section.questions[i],)
            section.questions[i].order = Math.max(1, parseInt(section.questions[i].order)-1);
            section.questions[i].changeContent ='update' ;
        }
    }

    if (question.status == 'new') {
        // Jika masih baru, langsung hapus dari array
        section.questions.splice(questionIndex, 1);
    } else {
        // Jika sudah ada di database, tandai sebagai "delete"
        section.changeContent = "update";
        question.changeContent = "delete";
        question.order = 0;
        question.answers=question.answers.map(a=>{
            return{
                ...a,
                changeContent:'delete'
            }
        })
    }

    const containerQuestion = getEl(`container-question-${questionId}`)
    if(!containerQuestion) return
    containerQuestion.remove()
    //console.log(sectionsCopy)
        
    loadBtnSubmit()
}

function formOrderUpQuestion (event) {
    const questionId = parseInt(event.id.split('-')[4]);
    const sectionId = parseInt(event.id.split('-')[6]);

    // Cari section yang sesuai
    const section = sectionsCopy.find(sec =>  sec.id == sectionId);
    //console.log('s', section)
    if (!section) return;
    
    // Cari pertanyaan yang sesuai
    const question = section.questions.find(q =>  q.id == questionId);
    //console.log('q', question)
    if (!question) return;

    const questionOrder = question.order

    const previousQuestion = section.questions.find(q =>  q.order == questionOrder - 1);
    //console.log('up q', previousQuestion)
    if (previousQuestion && questionOrder > 1) {
        //console.log('up quu', question, previousQuestion)
        // **CASE 1: Swap dengan question sebelumnya dalam section yang sama**
        // let prevOrder=previousQuestion.order
    
        // [question.order, previousQuestion.order] = [prevOrder, questionOrder];
        let temp=previousQuestion.order
        previousQuestion.order=question.order
        question.order=temp

        section.changeContent = 'update';
        question.changeContent = 'update';
        question.changeOrder = true;

        if(previousQuestion.changeContent != 'delete'){
            previousQuestion.changeOrder = true;
            previousQuestion.changeContent = 'update';
        }

        // Tukar nilai order
        const questionEl=getEl(`container-question-${questionId}`)
        if(!questionEl) return
        const target = questionEl.previousElementSibling;
        if (!target) return;

        // Tukar dataset dan posisi DOM
        target.insertAdjacentElement('beforebegin', questionEl);
        questionEl.querySelector('[id^="wrapper-question-"]').style.backgroundColor='rgba(216, 211, 54, 0.35)'

    } else {
        // **CASE 2: Pindahkan ke section sebelumnya jika di posisi pertama**
        const previousSection = sectionsCopy.find(sec => sec.order == parseInt(section.order) - 1);
        
        //console.log('pindah section')
        if (previousSection) {
            question.section_id = previousSection.id;
            question.order = parseInt(getMax(previousSection.questions, 'question').maxOrder) + 1;
            //console.log(getMax(previousSection.questions, 'question'))
            question.changeContent = 'update';
            previousSection.changeContent = 'update';
            
            previousSection.questions.push(question);
            section.questions = section.questions.filter(q => q.id != question.id);
            
            // Perbarui order di section baru
            section.questions.forEach(q=> {
                q.order = Math.max(1,q.order - 1)
                q.changeContent = 'update';
            });

            section.changeOrder = true;
            section.changeContent='update'
            previousSection.changeOrder = true;

            // Tukar nilai order
            const containerQuestion = getEl(`container-question-${questionId}`)
            if(!containerQuestion) return
            containerQuestion.remove()

            const target = getEl(`container-section-${previousSection.id}`);
            if (!target) return;

            // Tukar dataset dan posisi DOM
            target.insertAdjacentHTML('beforeend', generatorQuestion(previousSection,question, true));
        }
    }

    // Update tampilan & tombol submit
    //console.log(sectionsCopy)
    loadBtnSubmit();
}

function formOrderDownQuestion (event) {
    const questionId = parseInt(event.id.split('-')[4]);
    const sectionId = parseInt(event.id.split('-')[6]);

    // Cari section yang sesuai
    const section = sectionsCopy.find(sec =>  sec.id == sectionId);
    //console.log(section)
    if (!section) return;
    
    // Cari pertanyaan yang sesuai
    const question = section.questions.find(q => q.id == questionId);
    //console.log(question)
    if (!question) return;
    
    const nextQuestion = section.questions.find(q => q.order == question.order + 1);
    //console.log(nextQuestion)

    if (nextQuestion) {
        // [question.order, nextQuestion.order] = [nextQuestion.order, question.order];

        let temp=nextQuestion.order
        nextQuestion.order=question.order
        question.order=temp

        section.changeContent='update'
        question.changeContent = 'update';
        question.changeOrder = true;
        nextQuestion.changeOrder = true;
        nextQuestion.changeContent = 'update';

        // Tukar nilai order
        const questionEl= getEl(`container-question-${questionId}`)
        if(!questionEl) return
        const target = questionEl.nextElementSibling;
        if (!target) return;

        // Tukar dataset dan posisi DOM
        target.insertAdjacentElement('afterend', questionEl);
        questionEl.querySelector('[id^="wrapper-question-"]').style.backgroundColor='rgba(216, 211, 54, 0.35)'

    } else {
        // **CASE 2: Pindahkan ke section berikutnya jika di posisi terakhir**
        const nextSection = sectionsCopy.find(sec =>  sec.order == parseInt(section.order) + 1);
        if (nextSection) {
            question.section_id = nextSection.id;
            question.order = 1;
            question.changeContent = 'update';
            section.changeContent='update'
            question.changeOrder = true;

            // Perbarui order di section baru
            nextSection.questions.forEach(q => {
                q.order = q.order+1;
                q.changeContent = 'update';
            });

            // Tambahkan ke section baru di awal
            nextSection.questions.unshift(question);
            nextSection.changeOrder = true;
            nextSection.changeContent='update'

            // Hapus dari section lama
            section.questions = section.questions.filter(q =>  q.id != question.id);

            // Tukar nilai order
            const containerQuestion = getEl(`container-question-${questionId}`)
            if(!containerQuestion) return
            containerQuestion.remove()

            const target = getEl(`container-section-${nextSection.id}`)
            if(!target) return
            // Tukar dataset dan posisi DOM
            target.children[0].insertAdjacentHTML('afterend', generatorQuestion(nextSection,question,true));
        }
    }

    // Update tampilan & tombol submit
    event.classList.add('bg-yellow-200/70');
    loadBtnSubmit();
}

// ------------------------------- ANSWER -------------------------------
function formBtnAddAnswer(event) {
    if (event.id.includes('form-btn-add-answer')) {
        let maxAnswerId = parseInt(getMax(sectionsCopy).answerId) + 1;
        let questionId = parseInt(event.getAttribute('data-question-id'));

        for (let section of sectionsCopy) {
            let question = section.questions.find(q => q.id == questionId);
            //console.log(question)
            if (question) {
       
                section.changeContent='update'
                question.changeContent='update'

                const answerData={
                    id: maxAnswerId,
                    answer: 'type here',
                    value: 0,
                    status: 'new',
                    changeContent: 'add',
                    changeAnswer: true
                }

                question.answers.push(answerData);

                loadBtnSubmit();

                const answerListQuestionEl = getEl(`answer-wrapper-${questionId}`)
                if(!answerListQuestionEl) return
                answerListQuestionEl.insertAdjacentHTML('beforeend',generatorSingleAnswerPilgan(answerData,question,section, true))

                break; // Menghentikan perulangan setelah menemukan pertanyaan yang sesuai
            }
        }
    }
}

function formBtnDeleteAnswer(event) {
    // ////console.log('delete answer',event)
    const sectionId = parseInt(event.id.split('-')[6]);
    const questionId = parseInt(event.id.split('-')[5]);
    const answerId = parseInt(event.id.split('-')[4]);

    const section = sectionsCopy.find(s=>s.id==sectionId)
    if(!section) return

    const questionIndex = section.questions.findIndex(q => q.id == questionId);
    if (questionIndex == -1) return; // Jika question tidak ditemukan, keluar

    const question = section.questions[questionIndex];
    if(!question) return

    const answerIndex = question.answers.findIndex(a => a.id == answerId)
    const answer = question.answers[answerIndex]

    const answerActive = question.answers.filter(a => a.changeContent !== 'delete');

   // //console.log(answerActive);
    if (answerActive.length === 1) {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
            detail: { pesan: 'Answer Tidak Boleh Kosong (Minimal sisa 1)', status: false } 
        }));
        ////console.log('Operasi dibatalkan: Semua answer dihapus.');
        return;
    }

    const containerAnswer = getEl(`container-answer-${section.id}-${question.id}-${answer.id}`)
    const wrapperQuestion = getEl(`wrapper-question-${question.id}`)

    if(!containerAnswer || !wrapperQuestion) return

    containerAnswer.remove()
    wrapperQuestion.style.backgroundColor="rgba(216, 211, 54, 0.35)"

    if (answer.status == 'new') {
        // Jika masih baru, langsung hapus dari array
        question.answers.splice(answerIndex, 1);
    } else {
        // Jika sudah ada di database, tandai sebagai "delete"
        question.changeContent='update'
        section.changeContent='update'
        answer.changeContent = "delete";
        answer.hasDeleted = true;
        answer.order = 0;
    }
    
    loadBtnSubmit()
}

function answerFieldChange(event) {
    const el = event.target
    const sectionId = parseInt(el.id.split('-')[1])
    const questionId = parseInt(el.id.split('-')[2])
    const answerId = parseInt(el.id.split('-')[3])

    // --- LOGIKA AUTO RESIZE ---
    el.style.height = 'auto'; // Reset tinggi dulu
    el.style.height = el.scrollHeight + 'px'; // Set sesuai tinggi konten asli
    // ---------------------------

    const sections = sectionsCopy.find(sec => sec.id == sectionId)
    if(!sections) return
    
    const question = sections.questions.find(q => q.id == questionId)
    if(!question) return
    
    const answer = question.answers.find(a => a.id == answerId)

    if(answer){
        sections.changeContent='update'
        question.changeContent='update'
        answer.answer = el.value
        answer.changeContent = 'update'

        el.style.backgroundColor='rgba(216, 211, 54, 0.35)'
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
        
        event.target.style.backgroundColor='rgba(216, 211, 54, 0.35)'
        answer.changeAnswer = true
        loadBtnSubmit()
    }

}

// ------------------------------- GENERATE FORM UTILS -------------------------------
const generateSingleSection = (section, questionSection, yellowStats)=>{
    return`
    <div id="container-section-${section.id}" class="rounded w-full flex justify-center flex-col items-start gap-2 mt-4 ${section.changeContent == 'delete' ? 'hidden' : ''}">
            <div class="w-full flex justify-center items-start gap-2">
                <div id="wrapper-section-${section.id}" 
                    class="bg-white dark:bg-slate-700 rounded w-full p-4 dark:border-white border-8 border-black" 
                    style="${yellowStats ? 'background-color:rgba(194, 190, 92, 0.83)':''}">
                    <div class="flex justify-between">
                        <div class="flex items-center bg-gray-100 dark:bg-slate-600 rounded p-2 w-full mb-3">
                            <p class="text-gray-500 dark:text-white font-bold">Section ${section.order}</p>
                        </div>
                        <div>
                            <a data-popover-target="popover-up-section-${section.id}" id="form-order-up-section-${section.id}" 
                                class="pointer-events-auto cursor-pointer  hover:bg-slate-400">
                                <svg class="lg:w-6 lg:h-6 text-white" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 14-4-4-4 4"/>
                                </svg>
                            </a>
                                <div data-popover id="popover-up-section-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                                <div class="py-2 px-3">
                                    <p>Naikkan section</p>
                                </div>
                                <div data-popper-arrow></div>
                            </div>
                            <a data-popover-target="popover-down-section-${section.id}" id="form-order-down-section-${section.id}" 
                                class="pointer-events-auto cursor-pointer dark:hover:bg-slate-700">
                                <svg class="lg:w-6 lg:h-6 text-white" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 10 4 4 4-4"/>
                                </svg>
                            </a>
                            <div data-popover id="popover-down-section-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                                <div class="py-2 px-3">
                                    <p>Turunkan section</p>
                                </div>
                                <div data-popper-arrow></div>
                            </div>
                        </div>
                    </div>

                    <textarea 
                        class="text-2xl rounded border-1 border-slate-300 w-full bg-gray-100 dark:bg-slate-800 
                        dark:text-white text-black" id="form-section-name-${section.id}">${section.name}</textarea>

                    <textarea 
                        class="text-md rounded border-1 border-slate-300 w-full min-h-[50px] max-h-[500px] overflow-y-auto 
                        resize-none  bg-gray-100 dark:bg-slate-800 dark:text-white text-black" 
                        id="form-section-description-${section.id}">${section.description}</textarea>
                </div> 
                ${generatorTools('section',section.id,section.order)}
            </div>
            ${questionSection}
        </div>
    `
}

const generatorOption = (sectionId, question, yellowStats=false)=>{
    return `
        <div class="flex justify-between items-center gap-2 p-2">
            <div id="form-type" class="flex justify-start items-start flex-col w-full">
                <h3 class="text-white py-1 px-3 text-lg font-bold bg-blue-700 rounded-md w-full">Answer</h3>
                <select 
                  class="dark:bg-slate-800 bg-gray-100 dark:text-white text-black border-0 rounded mt-2" 
                  id="form-answer-type-${question.id}-${sectionId}"
                  style="${yellowStats ? 'background-color:rgba(247, 169, 0, 1)':''}">
                    <option value="text" ${question.input_type == 'text' ? 'selected':''}>Text</option>
                    <option value="pilgan" ${question.input_type == 'pilgan' ? 'selected':''}>Pilihan Ganda</option>
                </select>
            </div>
        </div>
    `
}

const generatorSingleAnswerPilgan= (answer,question,section, yellowStats)=>{
    let answerImage = answer.image
    if(!answer.image?.startsWith('https')){
        answerImage = answer.url
    }
    return`
        <div id="container-answer-${section.id}-${question.id}-${answer.id}" class="flex justify-center flex-col items-center my-1 gap-1 border-2 rounded border-gray-100">
            <div class="flex w-full gap-2 p-1">
                <div id="form-btn-delete-answer-${answer.id}-${question.id}-${section.id}" 
                    data-popover-target="popover-delete-answer-${section.id}-${question.id}-${answer.id}"
                    class="bg-white rounded-md p-1">

                    <svg viewBox="0 0 24 24" fill="currentColor" class="size-4 text-red-600">
                        <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div data-popover id="popover-delete-answer-${section.id}-${question.id}-${answer.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                    <div class="py-2 px-3">
                        <p>Delete Answer</p>
                    </div>
                    <div data-popper-arrow></div>
                </div>

                <label for="image-input-answer-${section.id}-${question.id}-${answer.id}" 
                    class="bg-blue-500 rounded-md p-1 text-white"
                    data-popover-target="popover-add-image-answer-${section.id}-${question.id}-${answer.id}">

                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                </label>
                <div data-popover id="popover-add-image-answer-${section.id}-${question.id}-${answer.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                    <div class="py-2 px-3">
                        <p>Tambah Gambar</p>
                    </div>
                    <div data-popper-arrow></div>
                </div>

                <div id="set-image-from-recent-answer-${section.id}-${question.id}-${answer.id}"
                    class="bg-blue-500 rounded-md p-1 cursor-pointer text-white"
                    data-popover-target="popover-recent-image-answer-${section.id}-${question.id}-${answer.id}"
                    data-modal-target="recent-image-modal" 
                    data-modal-toggle="recent-image-modal">
                        
                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                    </svg>
                </div>
                <div data-popover id="popover-recent-image-answer-${section.id}-${question.id}-${answer.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                    <div class="py-2 px-3">
                        <p>Pilih Gambar</p>
                    </div>
                    <div data-popper-arrow></div>
                </div>

                <button type="button" id="btn-reset-bg-image-answer-${section.id}-${question.id}-${answer.id}"
                    class="bg-blue-500 rounded-md p-1 text-white ${answerImage ? '' :'hidden'}" 
                    data-popover-target="popover-reset-image-answer-${section.id}-${question.id}-${answer.id}">

                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
                <div data-popover id="popover-reset-image-answer-${section.id}-${question.id}-${answer.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                    <div class="py-2 px-3">
                        <p>Hapus Gambar</p>
                    </div>
                    <div data-popper-arrow></div>
                </div>
            </div>

            <div class="w-full">
                <div id="preview-container" class="mt-2">
                    <img id="preview-image-answer-${section.id}-${question.id}-${answer.id}" src="${answerImage ?? ''}" alt="Preview" class="w-1/2 h-auto rounded-lg ${answerImage ? '' :'hidden'}" />
                </div>
                <input type="file" id="image-input-answer-${section.id}-${question.id}-${answer.id}" accept="image/*" class="hidden">
            </div>
            
            <div class="flex justify-center items-end gap-2 w-full">
                <textarea 
                    id="answer-${section.id}-${question.id}-${answer.id}"
                    style="${yellowStats ? 'background-color=rgba(194, 190, 92, 0.83)':''}"
                    class="border text-gray-900 text-sm rounded-lg w-full p-2.5 ${answer.changeAnswer ? 'bg-yellow-200/20 ':'dark:bg-gray-800 bg-white'}
                    dark:text-white text-black">${answer.answer ?? ''}</textarea>
                
                <div class="flex flex-col w-[20%] text-center">
                    <label for="answer-value-${section.id}-${question.id}-${answer.id}" class="dark:text-white text-black">Value</label>
                    <input class="form-check-input rounded border-1 p-1 w-auto border-slate-300 text-black dark:text-white dark:bg-gray-800 bg-white"
                        style="${yellowStats ? 'background-color:rgba(194, 190, 92, 0.83)':''}"
                        type="number" 
                        id="answer-value-${section.id}-${question.id}-${answer.id}" 
                        value="${answer.value}">
                </div>
            </div>
        </div>
    `
}

const generatorAnswer=(section,question, yellowStats)=>{
    let answerElement=''
    let btnAddAnswer=''

    // ------------------------------- ANSWER PILGAN -------------------------------
    if(question.input_type == 'pilgan'){
        if(question.answers.length != 0){
            question.answers.forEach((answer,index) =>{
                if(answer.changeContent != 'delete'){
                    answerElement += generatorSingleAnswerPilgan(answer,question,section)
                }
            })
        }
    // ------------------------------- ANSWER TEXT -------------------------------
    }else if(question.input_type == 'text'){
        answerElement =`
            <div
                class="border dark:text-gray-900 text-sm rounded-lg w-full p-2.5 bg-gray-800 dark:bg-white text-white" 
                style="${yellowStats ? 'background-color:rgba(194, 190, 92, 0.83)':''}"
                id="answer-${question.id}-text" 
                aria-label="Text input for following question">Text Input
            </div>
        `
    }

    return answerElement
}

const generatorQuestion=(section,question, yellowStats)=>{
    let questionImage = question.image
    if(question.image?.startsWith('__temp')){
        questionImage=question.url
    }

    return `
        <div id="container-question-${question.id}" class="soal-1 w-full flex justify-center items-start gap-2 mb-1">
            <div id="wrapper-question-${question.id}" class="border dark:border-gray-400 border-gray-600 rounded p-1 w-full"
                style="${yellowStats ? 'background-color:rgba(194, 190, 92, 0.83)':''}">
                <div class="flex items-center gap-2 dark:bg-indigo-400/80 bg-blue-300/80 rounded-md flex-col p-2 mb-1">
                    <h3 class="text-white py-1 px-3 text-lg font-bold bg-blue-700 rounded-md w-full">Question</h3>
                    <div class="text-white flex gap-2 w-full">
                        <label for="image-input-question-${section.id}-${question.id}" 
                            class="bg-blue-500 rounded-md p-1"
                            data-popover-target="popover-add-image-question-${section.id}-${question.id}">

                            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </label>
                        <div data-popover id="popover-add-image-question-${section.id}-${question.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                            <div class="py-2 px-3">
                                <p>Tambahkan Gambar</p>
                            </div>
                            <div data-popper-arrow></div>
                        </div>                        

                        <div id="set-image-from-recent-question-${section.id}-${question.id}"
                            class="bg-blue-500 rounded-md p-1 cursor-pointer"
                            data-popover-target="popover-recent-image-question-${section.id}-${question.id}"
                            data-modal-target="recent-image-modal" 
                            data-modal-toggle="recent-image-modal">
                                
                            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                            </svg>
                        </div>
                        <div data-popover id="popover-recent-image-question-${section.id}-${question.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                            <div class="py-2 px-3">
                                <p>Pilih Gambar</p>
                            </div>
                            <div data-popper-arrow></div>
                        </div>

                        <button type="button" id="btn-reset-bg-image-question-${section.id}-${question.id}"
                            class="bg-blue-500 rounded-md p-1 ${questionImage ? '' :'hidden'}" 
                            data-popover-target="popover-reset-image-question-${section.id}-${question.id}">
                            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                        <div data-popover id="popover-reset-image-question-${section.id}-${question.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                            <div class="py-2 px-3">
                                <p>Hapus Gambar</p>
                            </div>
                            <div data-popper-arrow></div>
                        </div>
                    </div>

                    <div class="flex items-center w-full">
                        
                        <div class="flex items-center gap-2 flex-col rounded-md p-1">
                            <a data-popover-target="popover-up-question-${question.id}-${section.id}" id="form-order-up-question-${question.id}-section-${section.id}" data-question-id=${question.id} data-section-id=${section.id} class="pointer-events-auto cursor-pointer hover:bg-slate-700">
                                <svg class="lg:w-6 lg:h-6 text-white" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 14-4-4-4 4"/>
                                </svg>
                            </a>
                            <div data-popover id="popover-up-question-${question.id}-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                                <div class="py-2 px-3">
                                    <p>Naikkan Question</p>
                                </div>
                                <div data-popper-arrow></div>
                            </div>

                            <a data-popover-target="popover-down-question-${question.id}-${section.id}" id="form-order-down-question-${question.id}-section-${section.id}" data-question-id=${question.id} data-section-id=${section.id} class="pointer-events-auto cursor-pointer hover:bg-slate-700">
                                <svg class="lg:w-6 lg:h-6 text-white" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 10 4 4 4-4"/>
                                </svg>
                            </a>
                            <div data-popover id="popover-down-question-${question.id}-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                                <div class="py-2 px-3">
                                    <p>Turunkan Question</p>
                                </div>
                                <div data-popper-arrow></div>
                            </div>

                        </div>

                        <div class="w-full">
                            <div id="preview-container" class="mt-3 flex justify-center">
                                <img id="preview-image-question-${section.id}-${question.id}" src="${questionImage ?? ''}" alt="Preview" class="w-full h-auto rounded-lg ${questionImage ? '' :'hidden'}" />
                            </div>
                            <input type="file" id="image-input-question-${section.id}-${question.id}" accept="image/*" class="hidden">
                            <textarea 
                                class="rounded w-full text-black dark:text-white 
                                dark:bg-gray-800 bg-white"
                                style="${question.changeQuestion ? 'background-color:rgba(194, 190, 92, 0.83)':''}" 
                                
                                id="question-${section.id}-${question.id}">${question.question} (${question.order})</textarea>
                            
                        </div>
                    </div>
                </div>
                <div class="dark:bg-slate-400/50 bg-slate-200/60 rounded-md p-2 w-full">
                    ${generatorOption(section.id,question)}
                    <div id="answer-wrapper-${question.id}" class="answer-list flex flex-col w-full">
                        ${generatorAnswer(section,question)}
                    </div>
                </div>
                <div id="form-btn-add-answer-${question.id}" data-question-id="${question.id}" class="${question.input_type == 'pilgan' ? '':'hidden'} flex justify-center items-center">
                    <div class="bg-green-400 rounded py-2 mt-1 w-full pointer-events-auto cursor-pointer hover:bg-green-600 flex justify-center items-center">
                        <p class="text-white">Add</p>
                    </div>
                </div>
            </div>
            ${generatorTools('question', section.id,section.order,question.id,question.order)}
        </div>
    `  
}

const generatorTools=(type, sectionId,sectionOrder,questionId,questionOrder)=>{
    let tools=''
    if(type == 'section'){
        tools = `
            <div class=" bg-slate-700 rounded lg:p-1 h-full flex justify-center items-center flex-col gap-1">
                <a data-popover-target="popover-add-section-${sectionId}" class="pointer-events-auto cursor-pointer hover:bg-slate-300 rounded lg:p-1" id="form-btn-add-section-${sectionId}">
                    <svg class="lg:w-6 lg:h-6  text-white" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44771 1 1v3M3 9v9c0 .5523.44772 1 1 1h16c.5523 0 1-.4477 1-1V9M3 9h18M8 9V5m4 4V5m4 4V5m-6 9h2m0 0h2m-2 0v-2m0 2v2"/>
                    </svg>
                </a>
                <div data-popover id="popover-add-section-${sectionId}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                    <div class="py-2 px-3">
                        <p>Tambahkan section</p>
                    </div>
                    <div data-popper-arrow></div>
                </div>

                <a data-popover-target="popover-delete-section-${sectionId}" class="pointer-events-auto cursor-pointer hover:bg-slate-300 rounded p-1" id="form-btn-delete-section-${sectionId}">
                    <svg class="lg:w-6 lg:h-6  text-white" aria-hidden="true" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clip-rule="evenodd"/>
                    </svg>                                                                                       
                </a>
                <div data-popover id="popover-delete-section-${sectionId}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                    <div class="py-2 px-3">
                        <p>Hapus Section</p>
                    </div>
                    <div data-popper-arrow></div>
                </div>

                <a data-popover-target="popover-add-question-section-${sectionId}" class="pointer-events-auto cursor-pointer hover:bg-slate-300 rounded p-1" id="form-btn-add-question-0-section-${sectionId}">
                    <svg class="lg:w-6 lg:h-6  text-white" aria-hidden="true" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clip-rule="evenodd"/>
                    </svg>
                </a>
                <div data-popover id="popover-add-question-section-${sectionId}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                    <div class="py-2 px-3">
                        <p>Tambahkan Question</p>
                    </div>
                    <div data-popper-arrow></div>
                </div>

                <a data-popover-target="popover-copy-section-${sectionId}" class="pointer-events-auto cursor-pointer hover:bg-slate-300 rounded p-1" id="form-btn-copy-section-${sectionId}">
                    <svg class="w-6 h-6  text-white" aria-hidden="true" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M18 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1V9a4 4 0 0 0-4-4h-3a1.99 1.99 0 0 0-1 .267V5a2 2 0 0 1 2-2h7Z" clip-rule="evenodd"/>
                        <path fill-rule="evenodd" d="M8 7.054V11H4.2a2 2 0 0 1 .281-.432l2.46-2.87A2 2 0 0 1 8 7.054ZM10 7v4a2 2 0 0 1-2 2H4v6a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z" clip-rule="evenodd"/>
                    </svg>
                </a>
                <div data-popover id="popover-copy-section-${sectionId}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                    <div class="py-2 px-3">
                        <p>Salin Section</p>
                    </div>
                    <div data-popper-arrow></div>
                </div>
            </div>
        `
    }else{
        tools=`
            <div class="bg-slate-700 rounded p-1 flex justify-center items-center flex-col gap-1">
                <a data-popover-target="popover-add-section-question-${questionId}-${sectionId}" class="pointer-events-auto cursor-pointer" id="form-btn-add-section-${sectionId}">
                    <svg class="lg:w-6 lg:h-6 text-white hover:text-gray-500" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44771 1 1v3M3 9v9c0 .5523.44772 1 1 1h16c.5523 0 1-.4477 1-1V9M3 9h18M8 9V5m4 4V5m4 4V5m-6 9h2m0 0h2m-2 0v-2m0 2v2"/>
                    </svg>
                </a>
                <div data-popover id="popover-add-section-question-${questionId}-${sectionId}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                    <div class="py-2 px-3">
                        <p>Tambahkan Section</p>
                    </div>
                    <div data-popper-arrow></div>
                </div>

                <a data-popover-target="popover-add-question-${questionId}-${sectionId}" class="pointer-events-auto cursor-pointer" id="form-btn-add-question-${questionId}-section-${sectionId}">
                    <svg class="lg:w-6 lg:h-6 text-white hover:text-gray-500" aria-hidden="true" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clip-rule="evenodd"/>
                    </svg>
                </a>
                <div data-popover id="popover-add-question-${questionId}-${sectionId}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                    <div class="py-2 px-3">
                        <p>Tambahkan Question</p>
                    </div>
                    <div data-popper-arrow></div>
                </div>

                <a data-popover-target="popover-delete-question-${questionId}-${sectionId}" class="pointer-events-auto cursor-pointer" id="form-btn-delete-question-${questionId}-order-${questionOrder}-section-${sectionId}">
                    <svg class="lg:w-6 lg:h-6 text-white hover:text-gray-500" aria-hidden="true" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clip-rule="evenodd"/>
                    </svg>                                                                                       
                </a>
                <div data-popover id="popover-delete-question-${questionId}-${sectionId}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                    <div class="py-2 px-3">
                        <p>Hapus Question</p>
                    </div>
                    <div data-popper-arrow></div>
                </div>

                <a  data-popover-target="popover-copy-question-${questionId}-${sectionId}" class="pointer-events-auto cursor-pointer hover:bg-slate-100 rounded p-1" id="form-btn-copy-question-${questionId}-order-${questionOrder}-section-${sectionId}">
                    <svg class="w-6 h-6 text-white" aria-hidden="true" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M18 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1V9a4 4 0 0 0-4-4h-3a1.99 1.99 0 0 0-1 .267V5a2 2 0 0 1 2-2h7Z" clip-rule="evenodd"/>
                        <path fill-rule="evenodd" d="M8 7.054V11H4.2a2 2 0 0 1 .281-.432l2.46-2.87A2 2 0 0 1 8 7.054ZM10 7v4a2 2 0 0 1-2 2H4v6a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z" clip-rule="evenodd"/>
                    </svg>
                </a>
                <div data-popover id="popover-copy-question-${questionId}-${sectionId}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                    <div class="py-2 px-3">
                        <p>Salin Question</p>
                    </div>
                    <div data-popper-arrow></div>
                </div>

            </div>
        `
    }
    return tools
}

const generatorSection =(section, yellowStats)=>{
    let questionSection=''
    section.questions.sort((a, b) => a.order - b.order);
    section.questions.forEach((question,index) => {
        let answerSection = ``

        if(question.changeContent != 'delete'){
            // ------------------------------- ANSWER PILGAN -------------------------------
            if(question.input_type == 'pilgan'){
                answerSection += generatorOption(section.id,question)
                if(question.answers.length != 0){
                    //console.log(question.answers)
                    question.answers.forEach((answer,index) =>{
                        answerSection += generatorAnswer('pilgan',section.id,question.id,index,answer,yellowStats)
                    })
                }
            // ------------------------------- ANSWER TEXT -------------------------------
            }else if(question.input_type == 'text'){
                answerSection += generatorAnswer('text','',question.id,yellowStats)
            }
            // ------------------------------- GENERATE QUESTION -------------------------------
            questionSection += generatorQuestion(section,question,yellowStats)
        }
    })

    return generateSingleSection(section, questionSection,yellowStats)
}

// --------------------- SET IMAGE -------------------------------------
function shortenName(name, maxLength = 20) {
  if (name.length <= maxLength) return name;
  const ext = name.split('.').pop();
  return name.substring(0, maxLength - ext.length - 3) + '...' + ext;
}

async function compressToWebPFlow(file) {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.7,
      maxWidth: 1920,
      convertSize: 0,
      async success(result) {
        try {
          const compressed = new File([result], file.name, { type: result.type });
          const webp = await compressToWebP(compressed, 0.7);
          resolve(webp);
        } catch (err) {
          reject(err);
        }
      },
      error(err) { reject(err) }
    });
  });
}

async function compressToWebP(file, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Gagal compress ke WebP");

          resolve(
            new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
              type: "image/webp",
            })
          );
        },
        "image/webp",
        quality
      );
    };

    img.onerror = reject;
    img.src = url;
  });
}

function showLoader(v = true) {
    if(v){
        document.getElementById('jsLoader').classList.remove('hidden')
    }else{
        document.getElementById('jsLoader').classList.add('hidden')
    }
}

function isValidImage(file, maxMB = 5) {
  if (!file || !file.type.startsWith('image/')) {
    window.dispatchEvent(new CustomEvent('notif-pesan', { 
      detail: { pesan: 'Please select a valid image file.', status:false} 
    }));
    return false;
  }
  if (file.size > maxMB * 1024 * 1024) {
    window.dispatchEvent(new CustomEvent('notif-pesan', { 
        detail: { pesan: `Ukuran file terlalu besar. Maksimal ${maxMB}MB.`, status:false} 
      }));
    return false;
  }
  return true;
}

function setListenerSetImage(){
  document.querySelectorAll('[id^="set-image-from-recent"]').forEach(btn=>{
    if (btn.dataset.listenerAdded === "true") return;
    btn.dataset.listenerAdded = "true";

    btn.addEventListener('click', function(e){
        itemSelected=btn.id.split('-').slice(4).join('-')
        setImageGallery()
    })

  })
}

function setImageRecent() {
    document.querySelectorAll('[id^="media-recent"]').forEach(media => {
        if (media.dataset.listenerAdded === "true") return;

        media.dataset.listenerAdded = "true";
        media.addEventListener('click', async function () {
            showLoader(true);
            const src = media.getAttribute("src");
            let name = media.dataset.media;
            if(!src.startsWith('blob')){
                name = `${globals.url}/media/${name}`
            }

            const questionId = itemSelected.split('-')[2]
            const sectionId = itemSelected.split('-')[1]

            //console.log(itemSelected)
            const targetElement = getEl(`preview-image-${itemSelected}`);
            if(!targetElement)return

            const section = sectionsCopy.find(s=>s.id==sectionId)
            if(!section)return
            
            const question = section.questions.find(q=>q.id==questionId)
            if(!question)return

            let answerId
            let answer
            let targetElementDb

            if(itemSelected.startsWith('answer')){
                answerId=itemSelected.split('-')[3]
                answer=question.answers.find(a=>a.id==answerId)
                targetElementDb=answer
                question.changeContent='update'
            }else{
                targetElementDb=question
            }

            let oldUrl = targetElementDb.image ?? null;

            // ============== FIELD ===============
            document.getElementById(`btn-reset-bg-image-${itemSelected}`).classList.remove('hidden')

            targetElement.src = src;
            targetElement.classList.remove("hidden");

            // ====== Update ke database local =====
            section.changeContent='update'

            targetElementDb.image = name
            targetElementDb.url = src
            targetElementDb.changeContent='update'

            const targetNew = fileDb.find(f => f.id === name && f.file);
            if (targetNew) targetNew.action = "add";

            if(oldUrl){
                const checkUsedMedia = section.questions.some(el => {
                    if (el.id === targetElementDb.id) return false; // skip elemen yg sedang kita proses
                    //console.log(el)
                    el.answers.some(ans=>{
                        if (ans.id === targetElementDb.id) return false; // skip elemen yg sedang kita proses
                        return ans.image?.includes(oldUrl)
                    })

                    return el.image?.includes(oldUrl)
                });

                const target = fileDb.find(el => el.id === oldUrl);
                //console.log(oldUrl, checkUsedMedia)
                if (target && !checkUsedMedia) {
                    target.action='delete';
                }
            }

            isFormDirty = true
            showLoader(false);
        });
    });
    loadBtnSubmit()
}

function setImageGallery(indicator){
  let mediaGallery='-- Belum Ada Gambar --'
  if(fileDb.length > 0){
    mediaGallery=''
  }
  fileDb.forEach(file =>{
    if(file.filetype === 'img' || file.type === 'img'){
      let url=`${globals.url}/media/${file.id}`
      if(file.url){
        url=file.url
      }
      mediaGallery +=`
        <div class="w-[100px] h-[100px] overflow-hidden rounded relative cursor-pointer group">
          <img id="media-recent-${file.id}" data-media="${file.id}" src="${url}" 
          class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105">
        </div>
      `
    }
  })
  isFormDirty = true
  document.getElementById('body-media-recent').innerHTML=mediaGallery

  setImageRecent()
}

async function handleFieldBgUpload(file, el) {
    const sectionId = parseInt(el.id.split('-')[3])
    const questionId = parseInt(el.id.split('-')[4])
    let answerId
    
    const id = el.id.split('-').slice(2).join('-')
    if(id.startsWith('answer')){
        answerId=parseInt(el.id.split('-')[5])
    }

    const preview = document.getElementById(`preview-image-${id}`);
    //console.log(document.getElementById(`preview-image-${id}`),id,el,sectionId,questionId)

    const webp = await compressToWebPFlow(file);
    const blob = URL.createObjectURL(webp);

    // update UI
    preview.src = blob;
    preview.classList.remove('hidden');

    const randomKey = Math.random().toString(36).substring(2, 8);
    const safeName = shortenName(webp.name.replace(/\s+/g, '_')); // hindari spasi
    const uniqueKey = `__temp_media_${randomKey}_${safeName}__`;

    const sections = sectionsCopy.find(sec => sec.id == sectionId)
    if(!sections) return
    
    const question = sections.questions.find(q => q.id == questionId)
    if(!question)return

    let answer
    let elementTarget
    if(id.startsWith('answer')){
        //console.log(question)
        answer = question.answers.find(a=>a.id == answerId)
        if(!answer)return

        elementTarget = answer
    }else{
        elementTarget = question
    }

    if(elementTarget){
        sections.changeContent='update'
        if(id.startsWith('answer')){
            question.changeContent='update'
        }
        //console.log(elementTarget, uniqueKey)
        elementTarget.changeContent = 'update' 
        elementTarget.image = uniqueKey
        elementTarget.url = blob

        fileDb.push({
            id:uniqueKey,
            type:'file',
            filetype:'img',
            action:'add',
            file:webp,
            url:blob
        })
        
        el.style.backgroundColor='rgba(216, 211, 54, 0.35)'
        elementTarget.changeQuestion = true

        loadBtnSubmit()
    }
    
    document.getElementById(`btn-reset-bg-image-${id}`).classList.remove('hidden');
}

function deleteImage (el){
    const id = el.id.split('-').slice(4).join('-')
    //console.log(id)
    let answerId

    const questionId = id.split('-')[2]
    if(!questionId)return

    const sectionId = id.split('-')[1]
    if(!sectionId)return
    
    const section = sectionsCopy.find(s=>s.id==sectionId)
    if(!section)return

    const question = section.questions.find(q=>q.id==questionId)
    if(!question)return

    let targetElement
    if(id.startsWith('answer')){
        question.changeContent='update'

        let answerId = id.split('-')[3]
        if(!answerId)return

        targetElement = question.answers.find(a=>a.id==answerId)
        if(!targetElement)return
    }else{
        targetElement=question
    }
    
    const previewImage = getEl(`preview-image-${id}`)
    previewImage.src=''
    previewImage.classList.add('hidden')

    targetElement.image = ''
    targetElement.changeContent = 'update'
    section.changeContent = 'update'

    // Reset input file juga (opsional)
    document.getElementById(`image-input-${id}`).value = '';
    document.getElementById(`btn-reset-bg-image-${id}`).classList.add('hidden');
    isFormDirty = true
    loadBtnSubmit()
}

// ---------------------------------- GENERATE FORM --------------------------------------
function loadForm(parameter){
    
    if(formJs){
        
        
        const formField = getEl('form-name-field','form-name-field')
        formField.value = formCopy.form_name
        // Urutkan berdasarkan properti 'order'
        sectionsCopy.sort((a, b) => a.order - b.order);

        let sectionSession = ``
        sectionsCopy.forEach(section => {
            if(section.changeContent !='delete'){
                sectionSession += generatorSection(section)
            }
        });

        const formContent = getEl('form-content', 'form content')
        formContent.innerHTML=sectionSession

        document.querySelectorAll('textarea[id^="question-"]').forEach(textarea => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });
    }
}

const container = getEl('form', 'Form')

if(container){
    document.getElementById('btn-form-update').addEventListener('click', formSubmit)
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
    container.addEventListener('change', async function(e) {
        if (e.target.matches('[id^="form-answer-type-"]')) {
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formAnswerTypeChange(e)
                document.getElementById('jsLoader').classList.add('hidden');
            },10)
        }

        if(e.target.matches('[id^="image-input-"]')){
            const file = e.target.files[0];
            e.target.value = "";
            if (!isValidImage(file)) return;

            showLoader(true);

            try {
                await handleFieldBgUpload(file, e.target);
            } catch (err) {
                console.error(err);
                window.dispatchEvent(new CustomEvent('notif-pesan', { 
                    detail: { pesan: `Gagal memproses gambar`, status:false} 
                }));
            }
            showLoader(false);
        }
    });

/* CLICK EVENTS */
    container.addEventListener('click', function(e) {
        // -------------------------- RESET IMAGE -----------------------
        if(e.target.closest('[id^="btn-reset-bg-image-"]')){
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                deleteImage(e.target.closest('[id^="btn-reset-bg-image-"]'))
                document.getElementById('jsLoader').classList.add('hidden');
            },10)
        }
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
                initModals();
                setListenerSetImage()
            },10)
        }
        if (e.target.closest('[id^="form-btn-copy-section-"]')) {
            
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formBtnCopySection(e.target.closest('[id^="form-btn-copy-section-"]'))
                document.getElementById('jsLoader').classList.add('hidden');
                initModals();
                setListenerSetImage()
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
                initModals();
                setListenerSetImage()
            },10)
        };
        if (e.target.closest('[id^="form-btn-copy-question-"]')) {
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formBtnCopyQuestion(e.target.closest('[id^="form-btn-copy-question-"]'))
                document.getElementById('jsLoader').classList.add('hidden');
                initModals();
                setListenerSetImage()
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
                initModals();
                setListenerSetImage()
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
