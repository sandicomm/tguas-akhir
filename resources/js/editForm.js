// ======== FLOWBITE COMPONENTS =========
import { initModals } from 'flowbite';
import { globals } from './page/globals';
let sections
let stats
let sectionsCopy
let formCopy
let formPlacementDb
let itemSelected
let SECTION_MAX_ID
let QUESTION_MAX_ID
let ANSWER_MAX_ID
let isFormDirty=false;

document.addEventListener('DOMContentLoaded', function(){
    formCopy = JSON.parse(JSON.stringify(formJs));
    formPlacementDb = JSON.parse(JSON.stringify(formPlacementJs));
    SECTION_MAX_ID = sectionMaxID
    QUESTION_MAX_ID = questionMaxID
    ANSWER_MAX_ID = answerMaxID
    sectionsCopy = formCopy.sections
    
    loadForm()
})
function getEl(id ,name = "Elemen") {
   const el = document.getElementById(id);
    
    if (!el) {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
            detail: { pesan: `${name} tidak ditemukan dalam DOM`, status: false } 
        }));
        ////console.error(`${name} tidak ditemukan dalam DOM`, id)
        return null;
    }
    return el;
}
let cekCount=0;
async function cekStatus(){
  try{
    document.getElementById('loading-overlay')?.classList.remove('hidden');

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const clearResponse = await fetch(`/admin/forms/cek/${formCopy.id}`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "X-CSRF-TOKEN": csrfToken
        }
    });
    cekCount+1
    const clearData = await clearResponse.json();

    if(clearData.success && clearData.redirect){
        allowUnload = true;
        window.location.href = clearData.redirect
        // window.dispatchEvent(new CustomEvent('redirect-modal', { 
        //     detail: { pesan: `${clearData.message}`, url: clearData.redirect, status:true } 
        // }));
    }

    setTimeout(()=>{
      document.getElementById('loading-overlay')?.classList.add('hidden');
    },2000)
  }catch(err) {

    document.getElementById('loading-overlay')?.classList.add('hidden');
    showToast(`Gagal cek status ${err}`);
    // window.dispatchEvent(new CustomEvent('notif-pesan', { 
    //     detail: { pesan: `Gagal cek status.${err}`, status: false } 
    // }));

  }
}

async function perbaruiMasaAktifDiServer() {
  try {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const clearResponse=await fetch(`/admin/forms/update-visit/${formCopy.id}`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "X-CSRF-TOKEN": csrfToken
        }
    });

    const clearData = await clearResponse.json();

    if(clearData.success && clearData.redirect){
        allowUnload = true;
        window.location.href = clearData.redirect
    //   window.dispatchEvent(new CustomEvent('redirect-modal', { 
    //       detail: { pesan: `${clearData.message}`, url: clearData.redirect, status:true } 
    //   }));
    }

  } catch (err) {
    console.error("Gagal memperbarui sesi aktif ke server", err);
  }
}

let userAktif = false;

// 1. Kumpulkan semua event interaksi user
['mousemove', 'mousedown', 'click', 'scroll', 'keypress', 'touchstart'].forEach(eventName => {
    document.addEventListener(eventName, () => {
        console.log('gak afk')
        userAktif = true; 
    }, { passive: true }); // passive: true bagus untuk performa scroll di shared hosting
});

// ================== AUTOSAVE ==================
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
},0.8 * 60 * 1000); // Cek setiap 5 menit

// ================= CEK STATUS VISIT ================
setInterval(async () => {
    try {
        if (userAktif) {
            await perbaruiMasaAktifDiServer();
            userAktif = false;
            
            console.log("User aktif berinteraksi. Sesi diperpanjang otomatis.");
        } else {
            document.getElementById('loading-overlay')?.classList.remove('hidden');
  
            await cekStatus();
            setTimeout(()=>{
              document.getElementById('loading-overlay')?.classList.add('hidden');
            },2000)
        }
    } catch (error) {
        console.error("Sistem pemantau eror:", error);

        document.getElementById('loading-overlay')?.classList.add('hidden');
        showToast(`Gagal cek status.${error}`);
        // window.dispatchEvent(new CustomEvent('notif-pesan', { 
        //     detail: { pesan: `Gagal cek status.${error}`, status: false } 
        // }));
    }
}, 0.2 * 60 * 1000);


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
        // Convert "sections[0][questions][2][answer][1]" ke nested object
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

  // Form wajib punya minimal 1 section aktif
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

    // Section aktif wajib punya question
    if (!isSectionDeleted && questions.length == 0) {

        window.dispatchEvent(new CustomEvent('notif-pesan', { 
            detail: { pesan: `Section "${section.name}" wajib memiliki question`, status:false} 
        }));
        //console.log(section, sectionsCopy)
        return false;
    }

    for (const question of questions) {
      const isQuestionDeleted = question.changeContent == 'delete';

      // Jika aktif & pilgan, answer wajib ada
      if (!isQuestionDeleted) {
        const answers = Object.values(question.answer || {}).filter(
            a => a.changeContent != 'delete'
        );

        if (answers.length == 0) {
            window.dispatchEvent(new CustomEvent('notif-pesan', { 
                detail: { pesan: `Question "${question.question}" wajib memiliki jawaban`, status:false} 
            }));
            //console.log(section,question, sectionsCopy)
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
      changeContent: sec.changeContent, 
      questions: {}              
    };

    // JIKA QUESTIONS SUDAH ADA DI sec
    if (sec.questions && Array.isArray(sec.questions)) {
      sec.questions.forEach(q => {
        const qid = String(q.id);

        result[sid].questions[qid] = {
          id: qid,
          question: q.question,
          order: String(q.order),
          rule: q.rules,
          status: '',
          changeContent: q.changeContent,
          answer: {}
        };

        // JIKA ADA ANSWER
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

    if (!validateBeforeSubmit(form)) {
        document.getElementById('jsLoader')?.classList.add('hidden');
        return;
    }

    let fullData = filterChangedData(form);

    //  object ke array
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
      sections: fullData.sections,
      stat: statAction
    };
    const sectionBatches = chunkArray(fullData.sections, 3);
    //console.log(fullData, sectionBatches)
    let msg

    if(sectionBatches.length == 0){
        document.getElementById('jsLoader')?.classList.remove('hidden');
        let response = await fetch('/admin/form/update', {
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
        //console.log('base',json)
        //console.log('base',baseData)
        msg = json.message

        if (!json.success) {
            if(json.redirect){
                window.dispatchEvent(new CustomEvent('redirect-modal', { 
                    detail: { pesan: `${msg}`, url: redirect, status:false } 
                }));
            }else{
                window.dispatchEvent(new CustomEvent('notif-pesan', { 
                    detail: { pesan: json.message, status:false } 
                }));
            }
            return;
        }
    }

    for (let i = 0; i < sectionBatches.length; i++) {
        //console.log('section')
        const payload = {
            ...baseData,
            batch_number: i,
            sections: sectionBatches[i]
        };
        let response = await fetch('/admin/form/update', {
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
        msg=json.message
        //console.log('section base',json)
        //console.log('section base',sectionBatches)
        if (!json.success) {
            //console.log(json)
            if(json.redirect){
                window.dispatchEvent(new CustomEvent('redirect-modal', { 
                    detail: { pesan: `${msg}`, url: redirect, status:false } 
                }));
            }else{
                window.dispatchEvent(new CustomEvent('notif-pesan', { 
                    detail: { pesan: json.message, status:false } 
                }));
            }
            return;
        }
    }
    
    document.getElementById('jsLoader')?.classList.add('hidden');
    
    if (isAutosave) {
        ////console.log('Autosave sukses');
        showToast('Form disimpan otomatis'); // Contoh notifikasi kecil
        isFormDirty=false
        allowUnload=true
        window.location.href = redirect
    } else {
        // Jika manual, jalankan event redirect kamu yang lama
        //console.log('event')
        window.dispatchEvent(new CustomEvent('redirect-modal', { 
            detail: { pesan: `Data form telah berhasil diperbarui. ${msg}`, url: redirect, status:true } 
        }));
        isFormDirty=false
    }
  } catch (err) {

    window.dispatchEvent(new CustomEvent('notif-pesan', { 
        detail: { pesan: `Terjadi Kesalahan ${err.message}`, status:false } 
    }));
    
  }
}

async function formSubmit(event) {
    document.getElementById('jsLoader')?.classList.remove('hidden'); // tampil

    event.preventDefault();
    let formData = formCopy
    formData.sections = normalizeSectionsToKeyedObject(formData, sectionsCopy);

    await submitInBatch(formData); // ✔ wajib tunggu dulu!

    document.getElementById('jsLoader')?.classList.add('hidden'); 
    allowUnload = true;
}

function updateFormName(event) {
    formCopy.form_name = event.value;
    event.style.borderColor='rgba(255, 141, 62, 1)'
    event.style.borderWidth= '4px'
    formCopy.change = true;
    formCopy.changeContent='update'
    loadBtnSubmit();
}

function updateFormSetting (event) {
    const el = event.target
    if('placement' == el.id.split('-')[2]){
    
        if(Object.values(formPlacementDb).includes(el.value) && el.value != 'disable'){
            
            window.dispatchEvent(new CustomEvent('redirect-modal', { 
                detail: { 
                    pesan: 'Placement Sudah Diterapkan Di Form Lain, Jika Perubahan Ini Disimpan Maka Status Placement Akan Dipindahkan Ke Form Ini', 
                    url: 'gk redirect', status:false } 
            }));
        }
        formCopy.placement = el.value

        el.style.borderColor='rgba(255, 141, 62, 1)'
        el.style.borderWidth= '4px'

        formCopy.changeSettingPlacement = true

        formCopy.changeContent='update'
        loadBtnSubmit()

    }else if('email' == el.id.split('-')[2]){
        formCopy.collect_email = el.value

         if(parseInt(el.value) == 0 && parseInt(formCopy.one_attempt) == 1){
            
            window.dispatchEvent(new CustomEvent('redirect-modal', { 
                detail: { 
                    pesan: 'Jika <b class="text-blue-600">Responden Tidak Harus Sertakan Email</b>, Maka Pengaturan <b class="text-blue-600">Pengisian Cuman Boleh Satu Kali</b> Otomatis Menjadi <b class="text-red-600">"TIDAK"</b>.', 
                    url: 'gk redirect', status:false } 
            }));

            formCopy.changeSettingAttempt = true
            formCopy.one_attempt = 0
            const oneAttempt = document.getElementById('form-setting-attempt')
            oneAttempt.value = 0
            oneAttempt.style.borderColor='rgba(255, 141, 62, 1)'
            oneAttempt.style.borderWidth= '4px'
        }

        el.style.borderColor='rgba(255, 141, 62, 1)'
        el.style.borderWidth= '4px'

        formCopy.changeSettingEmail = true

        formCopy.changeContent='update'
        loadBtnSubmit()
        
    }else if('attempt' == el.id.split('-')[2]){
        formCopy.one_attempt = el.value

        if(parseInt(el.value) == 1 && parseInt(formCopy.collect_email) == 0){
            
            window.dispatchEvent(new CustomEvent('redirect-modal', { 
                detail: { 
                    pesan: 'Jika <b class="text-blue-600">Pengisian Cuman Boleh Satu Kali</b>, Maka Pengaturan <b class="text-blue-600">Responden Harus Sertakan Email</b> Otomatis Menjadi <b class="text-red-600">"IYA"</b>.', 
                    url: 'gk redirect', status:false } 
            }));

            formCopy.changeSettingEmail = true
            formCopy.collect_email = 1
            const collectEmail = document.getElementById('form-setting-email')
            collectEmail.value = 1
            collectEmail.style.borderColor='rgba(255, 141, 62, 1)'
            collectEmail.style.borderWidth= '4px'
        }

        el.style.borderColor='rgba(255, 141, 62, 1)'
        el.style.borderWidth= '4px'

        formCopy.changeSettingAttempt= true
        //console.log(formCopy)
        formCopy.changeContent='update'
        loadBtnSubmit()

    }else if('fill' == el.id.split('-')[2]){
        formCopy.must_fill = el.value

        el.style.borderColor='rgba(255, 141, 62, 1)'
        el.style.borderWidth= '4px'

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
    ////console.log(sectionId)
    
    const section = sectionsCopy.find(sec =>  parseInt(sec.id) == sectionId);
    let sectionEl = getEl(`container-section-${sectionId}`)
    if (!section || !sectionEl) return;
    
    const nextSection = sectionsCopy.find(nextSec =>  nextSec.order ==  parseInt(section.order) + 1);
    
    if (!nextSection) return;

    if (nextSection) {
        ////console.log(event)
        const wrapperSection = sectionEl.querySelector('[id^="wrapper-section"]')
        wrapperSection.style.borderColor='rgba(255, 141, 62, 1)'
        wrapperSection.style.borderWidth= '4px'
        sectionEl.querySelectorAll('[id^="wrapper-question-"]').forEach(q=>{
            ////console.log(q)
            q.style.borderColor='rgba(255, 141, 62, 1)'
            q.style.borderWidth= '4px'
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
        ////console.log(sectionsCopy)
    }
}

function formOrderUpSection(event){
    const sectionId = parseInt(event.id.split('-')[4]);
    
    const section = sectionsCopy.find(sec =>  parseInt(sec.id) == sectionId);
    let sectionEl = getEl(`container-section-${sectionId}`)
    if(!sectionEl) return

    //console.log(section, sectionEl)
    if (!section) return;
    
    const nextSection = sectionsCopy.find(nextSec =>  (nextSec.order ==  parseInt(section.order) - 1) && (nextSec.order !=0));
    //console.log(nextSection)
    
    if (nextSection &&  parseInt(section.order) > 1) {
        // Tukar nilai order
        const wrapperSection = sectionEl.querySelector('[id^="wrapper-section"]')
        wrapperSection.style.borderColor='rgba(255, 141, 62, 1)'
        wrapperSection.style.borderWidth= '4px'

        sectionEl.querySelectorAll('[id^="wrapper-question-"]').forEach(q=>{
            ////console.log(q)
            q.style.borderColor='rgba(255, 141, 62, 1)'
            q.style.borderWidth= '4px'
        })

        const target = sectionEl.previousElementSibling;
        //console.log(target)
        if (!target) return;
        
        // Tukar dataset dan posisi DOM
        target.insertAdjacentElement('beforebegin', sectionEl);

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

    sectionsCopy.forEach(section => {

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

    //console.log('add new section:', dataNewSection, sectionTarget.order, sectionsCopy)

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
    //console.log(maxId)
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
    //console.log('before push',copySection)
    sectionsCopy.push(copySection)
    //console.log('after push', copySection)

    const containerSection = getEl(`container-section-${sectionId}`)
    if(!containerSection) return

    containerSection.insertAdjacentHTML('afterend',generatorSection(copySection, true))

    loadBtnSubmit()
}

function formBtnDeleteSection(event) {
    const sectionAktif = sectionsCopy.filter(sec => sec.changeContent !== 'delete');

    if (sectionAktif.length === 1) {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
            detail: { pesan: 'Section Tidak Boleh Kosong (Minimal sisa 1)', status: false } 
        }));
        ////console.log('Operasi dibatalkan: Semua section dihapus.');
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

    loadBtnSubmit()
}

function sectionFieldChange(event) {
    const el = event.target
    const sectionId = parseInt(el.id.split('-')[3])
    const sectionPart = el.id.split('-')[2]

    // --- LOGIKA AUTO RESIZE ---
    el.style.height = 'auto'; // Reset tinggi dulu
    el.style.height = el.scrollHeight + 5 + 'px'; // Set sesuai tinggi konten asli
    // ---------------------------

    const section = sectionsCopy.find(sec => sec.id == sectionId)
    if(!section) return;

    if(sectionPart == 'name'){
        section.name = el.value
        section.changeContent = 'update'

        el.style.borderColor='rgba(255, 141, 62, 1)'
        el.style.borderWidth= '4px'

        section.changeSection = true
        loadBtnSubmit()

    }else if(sectionPart == 'description'){
        section.description = el.value
        section.changeContent = 'update'

        el.style.borderColor='rgba(255, 141, 62, 1)'
        el.style.borderWidth= '4px'
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
    el.style.height = el.scrollHeight + 5 + 'px'; // Set sesuai tinggi konten asli
    // ---------------------------

    const sections = sectionsCopy.find(sec => sec.id == sectionId)
    if(!sections) return

    const question = sections.questions.find(q => q.id == questionId)

    if(question){
        sections.changeContent='update'
        question.question = el.value
        question.changeContent = 'update' 
        
        el.style.borderColor='rgba(255, 141, 62, 1)'
        el.style.borderWidth='4px'
        question.changeQuestion = true

        loadBtnSubmit()
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

        section.changeContent='update'

        const questionData = {
            id: parseInt(getMax(sectionsCopy).questionId) + 1,
            question: 'type here',
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

        //console.log('add new question:', section.questions, questionData, question,thisQuestionOrder)

        section.questions.push(questionData);
        loadBtnSubmit()
        //console.log('add quesiton:',sectionsCopy)
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

    const containerQuestion = getEl(`container-question-${questionId}`)
    if(!containerQuestion) return
    containerQuestion.insertAdjacentHTML('afterend', generatorQuestion(copySection,copyQuestion,true))
    loadBtnSubmit()
    
}

let deleteCount=0
function formBtnDeleteQuestion (event) {
    
    const sectionId = parseInt(event.id.split('-')[8]);
    const questionId = parseInt(event.id.split('-')[4]);

    //sectionsCopy.forEach(s=>//console.log(s.id))

    const section = sectionsCopy.find(sec=>sec.id==sectionId)
    if(!section) return

    //sectionsCopy.forEach(s=>//console.log(s.id))
    
    const questionActive = section.questions.filter(q => q.changeContent !== 'delete');

    //console.log(sectionId,sectionsCopy,section,section.questions)
   
    if (questionActive.length === 1) {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
            detail: { pesan: 'Question Tidak Boleh Kosong (Minimal sisa 1)', status: false } 
        }));

        return;
    }

    const questionIndex = section.questions.findIndex(q => q.id == questionId);
    if (questionIndex == -1) return; // Jika question tidak ditemukan, keluar

    const question = section.questions[questionIndex];
    
    for (let i = 0; i < section.questions.length; i++) {
        
        if(section.questions[i].id != questionId && section.questions[i].changeContent != 'delete' && parseInt(section.questions[i].order) > question.order){
           
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
        
    loadBtnSubmit()
}

function formOrderUpQuestion (event) {
    const questionId = parseInt(event.id.split('-')[4]);
    const sectionId = parseInt(event.id.split('-')[6]);

    // Cari section yang sesuai
    const section = sectionsCopy.find(sec =>  sec.id == sectionId);
    ////console.log(section)
    if (!section) return;
    
    // Cari pertanyaan yang sesuai
    const question = section.questions.find(q =>  q.id == questionId);
    //console.log(question)

    if (!question) return;

    const questionOrder = question.order

    const previousQuestion = section.questions.find(q =>  (q.order == questionOrder - 1) && (q.order !=0));

    ////console.log('before up question:', question, previousQuestion)
    
    if (previousQuestion && questionOrder > 1) {
     
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

        ////console.log("up question in", previousQuestion, question)

        // Tukar dataset dan posisi DOM
        target.insertAdjacentElement('beforebegin', questionEl);
        const wrapperQuestion = questionEl.querySelector('[id^="wrapper-question-"]')
        wrapperQuestion.style.borderColor='rgba(255, 141, 62, 1)'
        wrapperQuestion.style.borderWidth= '4px'

    } else {
        // **CASE 2: Pindahkan ke section sebelumnya jika di posisi pertama**
        const previousSection = sectionsCopy.find(sec => sec.order == parseInt(section.order) - 1 && parseInt(sec.order) != 0);
      
        if (previousSection) {
            question.section_id = previousSection.id;
            question.order = parseInt(getMax(previousSection.questions, 'question').maxOrder) + 1;
            
            question.changeContent = 'update';
            previousSection.changeContent = 'update';
            
            previousSection.questions.push(question);
            section.questions = section.questions.filter(q => q.id != question.id);
            
            // Perbarui order di section baru
            section.questions.forEach(q=> {
                if(q.order != 0){  
                    q.order = Math.max(1,q.order - 1)
                    q.changeContent = 'update';
                }
            });

            ////console.log("up question out", section)

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
    
    loadBtnSubmit();
}

function formOrderDownQuestion (event) {
    const questionId = parseInt(event.id.split('-')[4]);
    const sectionId = parseInt(event.id.split('-')[6]);

    // Cari section yang sesuai
    const section = sectionsCopy.find(sec =>  sec.id == sectionId);
   
    if (!section) return;
    
    // Cari pertanyaan yang sesuai
    const question = section.questions.find(q => q.id == questionId);
   
    if (!question) return;
    
    const nextQuestion = section.questions.find(q => q.order == question.order + 1);

    ////console.log('before down question:', question, nextQuestion)
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

        //.log('down question in:', question, nextQuestion)

        // Tukar dataset dan posisi DOM
        target.insertAdjacentElement('afterend', questionEl);
        const wrapperQuestion =  questionEl.querySelector('[id^="wrapper-question-"]')
        wrapperQuestion.style.borderColor='rgba(255, 141, 62, 1)'
        wrapperQuestion.style.borderWidth= '4px'

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
                if(q.order != 0){
                    q.order = q.order+1;
                    q.changeContent = 'update';
                }
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

            ////console.log('down question out:', question, nextSection, section)

            const target = getEl(`container-section-${nextSection.id}`)
            if(!target) return
            // Tukar dataset dan posisi DOM
            target.children[0].insertAdjacentHTML('afterend', generatorQuestion(nextSection,question,true));
        }
    }
    loadBtnSubmit();
}

// ------------------------------- ANSWER -------------------------------
function formBtnAddAnswer(event) {
    if (event.id.includes('form-btn-add-answer')) {
        let maxAnswerId = parseInt(getMax(sectionsCopy).answerId) + 1;
        let questionId = parseInt(event.getAttribute('data-question-id'));

        for (let section of sectionsCopy) {
            let question = section.questions.find(q => q.id == questionId);
            
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

    if (answerActive.length === 1) {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
            detail: { pesan: 'Answer Tidak Boleh Kosong (Minimal sisa 1)', status: false } 
        }));
 
        return;
    }

    const containerAnswer = getEl(`container-answer-${section.id}-${question.id}-${answer.id}`)
    const wrapperQuestion = getEl(`wrapper-question-${question.id}`)

    if(!containerAnswer || !wrapperQuestion) return

    containerAnswer.remove()
    wrapperQuestion.style.borderColor='rgba(255, 141, 62, 1)'
    wrapperQuestion.style.borderWidth= '4px'

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

        el.style.borderColor='rgba(255, 141, 62, 1)'
        el.style.borderWidth= '4px'
        answer.changeAnswer = true
        loadBtnSubmit()
    }

}

function answerValueChange(event) {
    const el = event.target
    const sectionId = parseInt(el.id.split('-')[2])
    const questionId = parseInt(el.id.split('-')[3])
    const answerId = parseInt(el.id.split('-')[4])
    
    const sections = sectionsCopy.find(sec => sec.id == sectionId)
    if(!sections) return
    
    const question = sections.questions.find(q => q.id == questionId)
    if(!question) return
    
    const answer = question.answers.find(a => a.id == answerId)

    if(answer){
        sections.changeContent='update'
        question.changeContent='update'
        answer.value = el.value
        answer.changeContent = 'update'
        
        el.style.borderColor='rgba(255, 141, 62, 1)'
        el.style.borderWidth= '4px'
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
                    style="${yellowStats ? 'border-color:rgba(255, 141, 62, 1);border-width:4px;':''}">
                    
                    <div class="flex justify-between gap-1 mb-2">
                        <div class="flex items-center gap-2 flex-col rounded-md">
                            <a data-popover-target="popover-up-section-${section.id}" id="form-order-up-section-${section.id}" 
                                class="pointer-events-auto cursor-pointer">
                                <svg class="lg:w-6 lg:h-6 text-white bg-blue-500 rounded" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
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
                                class="pointer-events-auto cursor-pointer">
                                <svg class="lg:w-6 lg:h-6 text-white bg-blue-500 rounded" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
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
                        <div class="flex items-center bg-gray-100 dark:bg-slate-600 rounded p-2 w-full m-1">
                            <p class="text-gray-500 dark:text-white font-bold">Section</p>
                        </div>
                    </div>

                    <textarea 
                        class="text-2xl rounded border-1 border-slate-300 w-full overflow-y-auto bg-gray-100 dark:bg-slate-800 
                        dark:text-white text-black" id="form-section-name-${section.id}">${section.name}</textarea>

                    <textarea 
                        class="text-md rounded border-1 border-slate-300 w-full overflow-y-auto 
                        bg-gray-100 dark:bg-slate-800 dark:text-white text-black" 
                        id="form-section-description-${section.id}">${section.description}</textarea>
                </div> 
                ${generatorTools('section',section.id,section.order)}
            </div>
            ${questionSection}
        </div>
    `
}

const generatorSingleAnswerPilgan= (answer,question,section, yellowStats)=>{
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
            </div>
            
            <div class="flex justify-center items-end gap-2 w-full">
                <textarea 
                    id="answer-${section.id}-${question.id}-${answer.id}"
                    style="${yellowStats ? 'border-color:rgba(255, 141, 62, 1);border-width:4px;':''}"
                    class="border text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-800 bg-white
                    dark:text-white">${answer.answer ?? ''}</textarea>
                
                <div class="flex flex-col w-[20%] text-center">
                    <label for="answer-value-${section.id}-${question.id}-${answer.id}" class="dark:text-white text-black">Value</label>
                    <input class="form-check-input rounded border-1 p-1 w-auto border-slate-300 text-black dark:text-white dark:bg-gray-800 bg-white"
                        style="${yellowStats ? 'border-color:rgba(255, 141, 62, 1);border-width:4px;':''}"
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
    if(question.answers.length != 0){
        question.answers.forEach((answer,index) =>{
            if(answer.changeContent != 'delete'){
                answerElement += generatorSingleAnswerPilgan(answer,question,section)
            }
        })
    }
    return answerElement
}

const generatorQuestion=(section,question, yellowStats)=>{
    return `
        <div id="container-question-${question.id}" class="soal-1 w-full flex justify-center items-start gap-2 mb-1">
            <div id="wrapper-question-${question.id}" class="border dark:border-gray-400 border-gray-600 rounded p-1 w-full"
                style="${yellowStats ? 'border-color:rgba(255, 141, 62, 1);border-width:4px;':''}">
                <div class="flex items-center gap-2 dark:bg-indigo-400/80 bg-blue-300/80 rounded-md flex-col p-2 mb-1">
                    <h3 class="text-white py-1 px-3 text-lg font-bold bg-blue-700 rounded-md w-full">Question</h3>

                    <div class="flex items-center w-full">
                        
                        <div class="flex items-center gap-2 flex-col rounded-md p-1">
                            <a data-popover-target="popover-up-question-${question.id}-${section.id}" id="form-order-up-question-${question.id}-section-${section.id}" data-question-id=${question.id} data-section-id=${section.id} class="pointer-events-auto cursor-pointer">
                                <svg class="lg:w-6 lg:h-6 text-white bg-green-500 border-2 border-slate-200 rounded" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 14-4-4-4 4"/>
                                </svg>
                            </a>
                            <div data-popover id="popover-up-question-${question.id}-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 ">
                                <div class="py-2 px-3">
                                    <p>Naikkan Question</p>
                                </div>
                                <div data-popper-arrow></div>
                            </div>

                            <a data-popover-target="popover-down-question-${question.id}-${section.id}" id="form-order-down-question-${question.id}-section-${section.id}" data-question-id=${question.id} data-section-id=${section.id} class="pointer-events-auto cursor-pointer ">
                                <svg class="lg:w-6 lg:h-6 text-white bg-green-500 border-2 border-slate-200 rounded" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
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
                            <textarea 
                                class="rounded w-full text-black dark:text-white 
                                dark:bg-gray-800 bg-white overflow-y-auto"
                                style="${question.changeQuestion ? 'border-color:rgba(255, 141, 62, 1);border-width:4px;':''}" 
                                
                                id="question-${section.id}-${question.id}">${question.question}</textarea>
                            
                        </div>
                    </div>
                </div>
                <div class="dark:bg-slate-400/50 bg-slate-200/60 rounded-md p-2 w-full">
                    <div id="answer-wrapper-${question.id}" class="answer-list flex flex-col w-full">
                        ${generatorAnswer(section,question)}
                    </div>
                </div>
                <div id="form-btn-add-answer-${question.id}" data-question-id="${question.id}" class="flex justify-center items-center">
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

                <a data-popover-target="popover-copy-question-${questionId}-${sectionId}" class="pointer-events-auto cursor-pointer hover:bg-slate-100 rounded p-1" id="form-btn-copy-question-${questionId}-order-${questionOrder}-section-${sectionId}">
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
            // ------------------------------- GENERATE QUESTION -------------------------------
            questionSection += generatorQuestion(section,question,yellowStats)
        }
    })

    return generateSingleSection(section, questionSection,yellowStats)
}

function showLoader(v = true) {
    if(v){
        document.getElementById('jsLoader').classList.remove('hidden')
    }else{
        document.getElementById('jsLoader').classList.add('hidden')
    }
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

        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 5 + 'px';
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
                initModals();
            },10)
        }
        if (e.target.closest('[id^="form-btn-copy-section-"]')) {
            
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formBtnCopySection(e.target.closest('[id^="form-btn-copy-section-"]'))
                document.getElementById('jsLoader').classList.add('hidden');
                initModals();
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
            },10)
        };
        if (e.target.closest('[id^="form-btn-copy-question-"]')) {
            document.getElementById('jsLoader').classList.remove('hidden');
            setTimeout(()=>{
                formBtnCopyQuestion(e.target.closest('[id^="form-btn-copy-question-"]'))
                document.getElementById('jsLoader').classList.add('hidden');
                initModals();
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
