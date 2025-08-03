let sections
let stats
let sectionsCopy
let formCopy
let SECTION_MAX_ID
let QUESTION_MAX_ID

document.addEventListener('DOMContentLoaded', function(){
    formCopy = JSON.parse(JSON.stringify(formJs));
    SECTION_MAX_ID = sectionMaxID
    QUESTION_MAX_ID = questionMaxID
    sectionsCopy = formCopy.sections
    loadForm()
})

function loadBtnSubmit(){
    console.log(window.isSubmitting);
    console.log("Hello");
    const formUpdate = document.getElementById('btn-update-form');
    formUpdate.innerHTML = ''
    const div = document.createElement('div');
    div.innerHTML = `
            <div class="bg-white p-4 text-center sm:ml-64 flex justify-center items-center gap-4 shadow-lg border-t">
                <p>Ada perubahan dalam form, klik update untuk simpan perubahan</p>
                <input type="hidden" name="form_status" class="lg:text-lg text-sm" value="${formCopy.status ?? 'l'}">
                <button type="submit" id="btn-form-update" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                    Update
                </button>
            </div>
    `;
    formUpdate.appendChild(div);
}

function getMax(data, param = '') { 
    let max = { 
        sectionId: SECTION_MAX_ID, sectionOrder: 0, 
        questionId: QUESTION_MAX_ID, questionOrder: 0, 
        answerId: 0, maxOrder: 0 
    };

    if (!data || data.length === 0) return max;

    if (param === 'question') {
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

function formSubmit(event){
    event.preventDefault();
    window.isSubmitting = true;
    //console.log(window.isSubmitting);
    loadForm()

    let formData = new FormData(this);

    fetch('/form/update', {
        method: 'POST',
        body: new FormData(document.getElementById('form')),
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json'
        }
    })
    .then(response => response.json().catch(() => { throw new Error('Invalid JSON response'); }))
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect;
            loadForm()
        } else {
            displayErrors(data.message)
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        displayErrors(error)
    });
    
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

function changeRuleCheckbox(event) {
    sectionsCopy.forEach(section => {
        section.questions.forEach(question => {
            if(question.id === parseInt(this.id.split('-')[2])){
                question.rules = parseInt(this.value)
                this.classList.add('bg-yellow-200')
                question.changeRule = true
                question.changeContent = 'update'
                loadBtnSubmit()
            }
        })
    })
}

function updateFormName(event) {
    formCopy.form_name = this.value;
    this.classList.add('bg-yellow-200');
    formCopy.change = true;
    loadBtnSubmit();
}

function updateFormSetting () {
    if('placement' === this.id.split('-')[2]){
        formCopy.placement = this.value
        this.classList.add('bg-yellow-200')

        formCopy.changeSettingPlacement = true
        loadBtnSubmit()

    }if('email' === this.id.split('-')[2]){
        formCopy.collect_email = this.value
        this.classList.add('bg-yellow-200')
        formCopy.changeSettingEmail = true

        loadBtnSubmit()
        
    }if('attempt' === this.id.split('-')[2]){
        formCopy.one_attempt = this.value
        this.classList.add('bg-yellow-200')
        formCopy.changeSettingAttempt= true

        loadBtnSubmit()

    }if('fill' === this.id.split('-')[2]){
        formCopy.must_fill = this.value
        this.classList.add('bg-yellow-200')
        formCopy.changeSettingAttempt= true

        loadBtnSubmit()

    }
}

function formOrderDownSection(event){
    const sectionId = parseInt(this.id.split('-')[4]);
    
    const section = sectionsCopy.find(sec => sec.id === sectionId);
    if (!section) return;
    
    const nextSection = sectionsCopy.find(nextSec => nextSec.order === section.order + 1);
    if (!nextSection) return;
    
    if (nextSection) {
        // Tukar nilai order
        [section.order, nextSection.order] = [nextSection.order, section.order];

        section.changeContent = 'update';
        nextSection.changeContent = 'update';

        this.classList.add('bg-yellow-200');
        section.change = true;
        nextSection.changeOrder = true;

        loadBtnSubmit();
        loadForm();
    }
}

function formOrderUpSection(event){
    const sectionId = parseInt(this.id.split('-')[4]);
    
    const section = sectionsCopy.find(sec => sec.id === sectionId);
    if (!section) return;

    const nextSection = sectionsCopy.find(nextSec => nextSec.order === section.order - 1);
    
    if (nextSection && section.order > 1) {
        // Tukar nilai order
        [section.order, nextSection.order] = [nextSection.order, section.order];

        section.changeContent = 'update';
        nextSection.changeContent = 'update';

        this.classList.add('bg-yellow-200');
        section.change = true;
        nextSection.changeOrder = true;

        loadBtnSubmit();
        loadForm();
    }
}

function formBtnAddSection(event){
    const order = parseInt(this.id.split('-')[4])
    sectionsCopy.forEach(section => {
        if (section.order > order) {
            section.order += 1;
            section.changeContent = 'update'
        }
    })

    sectionsCopy.push({
        id: getMax(sectionsCopy).sectionId + 1,
        name: 'type here',
        description: 'type here',
        status:'new',
        changeContent: 'add',
        changeOrder: true,
        changeSection: true,
        changeSectionDesc: true,
        order: order + 1,
        questions: []
    });

    loadBtnSubmit()
    loadForm();
}

function formBtnCopySection(event){
    const sectionId = parseInt(this.id.split('-')[4])
    const idx = sectionsCopy.findIndex(s => s.id === sectionId);

    if (idx === -1) return;

    const copySection = JSON.parse(JSON.stringify(sectionsCopy[idx]))

    sectionsCopy.forEach(section => {
        if (section.order > copySection.order) {
            section.order += 1;
            section.changeContent = 'update'
        }
    })

    const maxId = getMax(sectionsCopy)
    
    copySection.id = maxId.sectionId + 1
    copySection.name = copySection.name + ' (copy)'
    copySection.changeContent = 'add'
    copySection.status = 'new'
    copySection.changeOrder = true
    copySection.changeSection = true
    copySection.changeSection = true
    copySection.order = copySection.order + 1
    
    let maxQID = maxId.questionId
    let maxAID = maxId.answerId

    copySection.questions = copySection.questions.map(q => {
        maxQID ++

        const newQuestion = {
            ...q,

            id: maxQID,
            status:'new',
            changeContent: q.changeContent == 'delete' ? q.changeContent : 'add',
            changeOrder: true,
            changeSection: true,
            changeSectionDesc: true,
        }

        newQuestion.answers = newQuestion.answers.map(a => {
            maxAID ++
            return {
                ...a,
                id: maxAID,
                status:'new',
                changeContent: a.changeContent == 'delete' ? a.changeContent : 'add',
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
    const sectionId = parseInt(this.id.split('-')[4]);

    const sectionIndex = sectionsCopy.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return; // Jika question tidak ditemukan, keluar

    const section = sectionsCopy[sectionIndex];
    
    if (section.status === 'new') {
        // Jika masih baru, langsung hapus dari array
        sectionsCopy.splice(sectionIndex, 1);
    } else {
        // Jika sudah ada di database, tandai sebagai "delete"
        section.changeContent = "delete";
        section.order = 0;
    }

    section.questions.forEach(q => {
        q.changeContent = 'l'
        
        q.answers.forEach(a =>{
            a.changeContent ='l'
        })
    })

    // Perbarui urutan hanya untuk pertanyaan setelahnya
    for (let i = sectionIndex; i < sectionsCopy.length; i++) {
        if(sectionsCopy[i].id !== sectionId){
            sectionsCopy[i].order -= 1;
            sectionsCopy[i].changeContent = 'update';
        }
    }
    loadForm(); // Perbarui tampilan form setelah perubahan
    loadBtnSubmit()
}

function questionFieldChange() {
    const sectionId = parseInt(this.id.split('-')[1])
    const questionId = parseInt(this.id.split('-')[2])

    const sections = sectionsCopy.find(sec => sec.id === sectionId)
    if(!sections) return

    const question = sections.questions.find(q => q.id === questionId)

    if(question){
        question.question = this.value
        question.changeContent = 'update' 
        
        this.classList.add('bg-yellow-200')
        question.changeQuestion = true
        loadBtnSubmit()

    }
}

function answerFieldChange() {
    const sectionId = parseInt(this.id.split('-')[1])
    const questionId = parseInt(this.id.split('-')[2])
    const answerId = parseInt(this.id.split('-')[3])

    const sections = sectionsCopy.find(sec => sec.id === sectionId)
    if(!sections) return
    
    const question = sections.questions.find(q => q.id === questionId)
    if(!question) return
    
    const answer = question.answers.find(a => a.id === answerId)

    if(answer){
        answer.answer = this.value
        answer.changeContent = 'update'

        this.classList.add('bg-yellow-200')
        answer.changeAnswer = true
        loadBtnSubmit()
    }

}

function answerValueChange() {
    const sectionId = parseInt(this.id.split('-')[2])
    const questionId = parseInt(this.id.split('-')[3])
    const answerId = parseInt(this.id.split('-')[4])
    
    const sections = sectionsCopy.find(sec => sec.id === sectionId)
    if(!sections) return
    
    const question = sections.questions.find(q => q.id === questionId)
    if(!question) return
    
    const answer = question.answers.find(a => a.id === answerId)

    if(answer){
        answer.value = this.value
        answer.changeContent = 'update'

        this.classList.add('bg-yellow-200')
        answer.changeAnswer = true
        loadBtnSubmit()
    }

}

function sectionFieldChange() {
    const sectionId = parseInt(this.id.split('-')[3])
    const sectionPart = this.id.split('-')[2]

    const section = sectionsCopy.find(sec => sec.id === sectionId)
    if(!section) return;

    if(sectionPart == 'name'){
        section.name = this.value
        section.changeContent = 'update'

        this.classList.add('bg-yellow-200')
        section.changeSection = true
        loadBtnSubmit()
    }else if(sectionPart == 'description'){
        section.description = this.value
        section.changeContent = 'update'

        this.classList.add('bg-yellow-200')
        section.changeSectionDesc = true 
        loadBtnSubmit()
    }

}

function formAnswerTypeChange() {
    const questionId = parseInt(this.id.split('-')[3])

    for(const section of sectionsCopy){
        let question=section.questions.find(q => q.id === questionId)

        if(question){
            question.input_type = this.value
            question.changeContent = 'update'

            this.classList.add('bg-yellow-200')
            question.changeTypeAnswer = true
            loadBtnSubmit()
            loadForm()
            break;
        }
    }
}

function formBtnAddQuestion() {
    const thisQuestionOrder = parseInt(this.id.split('-')[6])
    const sectionId = parseInt(this.id.split('-')[8])

    const section = sectionsCopy.find(sec => sec.id === sectionId)

    if(section){
        section.questions.forEach(question => {
            if (question.order >= thisQuestionOrder + 1) {
                question.order += 1;
                question.changeContent = 'update'
            }
        }); 

        section.questions.push({
            id: getMax(sectionsCopy).questionId + 1,
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

        this.classList.add('bg-yellow-200')
        loadBtnSubmit()
        loadForm();
    }   
}

function formBtnCopyQuestion(event){
    const thisQuestionOrder = parseInt(this.id.split('-')[6])
    const questionId = parseInt(this.id.split('-')[4])
    const sectionId = parseInt(this.id.split('-')[8])

    const idxSection = sectionsCopy.findIndex(s => s.id === sectionId);

    if (idxSection === -1) return;

    let copySection = sectionsCopy[idxSection]
    const targetCopy = copySection.questions.find(q => q.id === questionId)
    
    if (targetCopy === undefined) return;

    let copyQuestion = JSON.parse(JSON.stringify(targetCopy))

    copySection.questions.forEach(question => {
        if (question.order > thisQuestionOrder) {
            question.order += 1;
            question.changeContent = 'update'
        }
    })

    const maxId = getMax(sectionsCopy)
    
    copyQuestion.id = maxId.questionId + 1
    copyQuestion.question = copyQuestion.question + ' (copy)'
    copyQuestion.changeContent = 'add'
    copyQuestion.status = 'new'
    copyQuestion.changeOrder = true
    copyQuestion.changeSection = true
    copyQuestion.changeSection = true
    copyQuestion.order = copyQuestion.order + 1
    
    let maxAID = maxId.answerId

    copyQuestion.answers = copyQuestion.answers.map(a => {
        maxAID ++

        const newAnswer = {
            ...a,
            id: maxAID,
            status:'new',
            changeContent: 'add',
            changeOrder: true,
            changeSection: true,
            changeSectionDesc: true,
        }
        return newAnswer
    })

    copySection.questions.push(copyQuestion)
    loadBtnSubmit()
    loadForm();
}

function formBtnDeleteQuestion () {
    const sectionId = parseInt(this.id.split('-')[8]);
    const questionId = parseInt(this.id.split('-')[4]);

    for (const section of sectionsCopy) {
        if (section.id === sectionId) {
            const questionIndex = section.questions.findIndex(q => q.id === questionId);
            if (questionIndex === -1) return; // Jika question tidak ditemukan, keluar

            const question = section.questions[questionIndex];
            
            if (question.status === 'new') {
                // Jika masih baru, langsung hapus dari array
                section.questions.splice(questionIndex, 1);
            } else {
                // Jika sudah ada di database, tandai sebagai "delete"
                question.changeContent = "delete";
                question.order = 0;
            }

            question.answers.forEach(a=>{
                a.changeContent='l'
            })

            // Perbarui urutan hanya untuk pertanyaan setelahnya
            for (let i = questionIndex; i < section.questions.length; i++) {
                if(section.questions[i].id !== questionId){
                    section.questions[i].order -= 1;
                    section.questions[i].changeContent ='update' ;
                }
            }

            break; // **Stop loop setelah menemukan section yang sesuai**
        }
    }
    loadForm(); // Perbarui tampilan form setelah perubahan
    loadBtnSubmit()
}

function formOrderUpQuestion () {
    const questionOrder = parseInt(this.id.split('-')[6]);
    const questionId = parseInt(this.id.split('-')[4]);
    const sectionId = parseInt(this.id.split('-')[8]);

    // Cari section yang sesuai
    const section = sectionsCopy.find(sec => sec.id === sectionId);
    if (!section) return;

    // Cari pertanyaan yang sesuai
    const question = section.questions.find(q => q.id === questionId);
    if (!question) return;

    const previousQuestion = section.questions.find(q => q.order === questionOrder - 1);

    if (previousQuestion && questionOrder > 1) {
        // **CASE 1: Swap dengan question sebelumnya dalam section yang sama**
        [question.order, previousQuestion.order] = [previousQuestion.order, question.order];
        question.changeContent = 'update';
        question.changeOrder = true;
        previousQuestion.changeOrder = true;
        previousQuestion.changeContent = 'update';
    } else {
        // **CASE 2: Pindahkan ke section sebelumnya jika di posisi pertama**
        const previousSection = sectionsCopy.find(sec => sec.order === section.order - 1);
        if (previousSection) {
            question.section_id = previousSection.id;
            question.order = getMax(previousSection.questions, 'question') + 1;
            question.changeContent = 'update';
            
            previousSection.questions.push(question);
            section.questions = section.questions.filter(q => q.id !== question.id);
            
            // Perbarui order di section baru
            previousSection.questions.forEach((q, index) => {
                q.order = index + 1;
                q.changeContent = 'update';
            });

            section.changeOrder = true;
            previousSection.changeOrder = true;
        }
    }

    // Update tampilan & tombol submit
    this.classList.add('bg-yellow-200');
    loadBtnSubmit();
    loadForm();
}

function formOrderDownQuestion () {
    const questionOrder = parseInt(this.id.split('-')[6]);
    const questionId = parseInt(this.id.split('-')[4]);
    const sectionId = parseInt(this.id.split('-')[8]);

    // Cari section yang sesuai
    const section = sectionsCopy.find(sec => sec.id === sectionId);
    if (!section) return;

    // Cari pertanyaan yang sesuai
    const question = section.questions.find(q => q.id === questionId);
    if (!question) return;

    const nextQuestion = section.questions.find(q => q.order === questionOrder + 1);

    if (nextQuestion) {
        [question.order, nextQuestion.order] = [nextQuestion.order, question.order];
        question.changeContent = 'update';
        question.changeOrder = true;
        nextQuestion.changeOrder = true;
        nextQuestion.changeContent = 'update';
    } else {
        // **CASE 2: Pindahkan ke section berikutnya jika di posisi terakhir**
        const nextSection = sectionsCopy.find(sec => sec.order === section.order + 1);

        if (nextSection) {
            question.section_id = nextSection.id;
            question.order = 1;
            question.changeContent = 'update';
            question.changeOrder = true;

            // Tambahkan ke section baru di awal
            nextSection.questions.unshift(question);
            nextSection.changeOrder = true;

            // Hapus dari section lama
            section.questions = section.questions.filter(q => q.id !== question.id);

            // Perbarui order di section baru
            nextSection.questions.forEach((q, index) => {
                q.order = index + 1;
                q.changeContent = 'update';
            });
        }
    }

    // Update tampilan & tombol submit
    this.classList.add('bg-yellow-200');
    loadBtnSubmit();
    loadForm();
}

function formBtnAddAnswer() {
    if (this.id === 'form-btn-add-answer') {
        let maxAnswerId = getMax(sectionsCopy).answerId + 1;
        let questionId = parseInt(this.getAttribute('data-question-id'));

        for (let section of sectionsCopy) {
            let question = section.questions.find(q => q.id === questionId);
            if (question) {
                question.answers.push({
                    id: maxAnswerId,
                    answer: 'type here',
                    value: 0,
                    status: 'new',
                    changeContent: 'add',
                    changeAnswer: true
                });

                this.classList.add('bg-yellow-200');
                loadBtnSubmit();
                loadForm();
                break; // Menghentikan perulangan setelah menemukan pertanyaan yang sesuai
            }
        }
    }
}

function formBtnDeleteAnswer(event) {
    const sectionId = parseInt(this.id.split('-')[6]);
    const questionId = parseInt(this.id.split('-')[5]);
    const answerId = parseInt(this.id.split('-')[4]);

    for (const section of sectionsCopy) {
        if (section.id === sectionId) {
            const questionIndex = section.questions.findIndex(q => q.id === questionId);
            if (questionIndex === -1) return; // Jika question tidak ditemukan, keluar

            const question = section.questions[questionIndex];
            if(!question) return

            const answerIndex = question.answers.findIndex(a => a.id === answerId)
            const answer = question.answers[answerIndex]
            if (answer.status === 'new') {
                // Jika masih baru, langsung hapus dari array
                question.answers.splice(answerIndex, 1);
            } else {
                // Jika sudah ada di database, tandai sebagai "delete"
                answer.changeContent = "delete";
                answer.order = 0;
            }

            break; // **Stop loop setelah menemukan section yang sesuai**
        }
    }
    loadForm(); // Perbarui tampilan form setelah perubahan
    loadBtnSubmit()
}

function loadForm(){
    if(formJs){
        document.getElementById('first-section-add').innerHTML =`
            <a class="pointer-events-auto cursor-pointer hover:bg-slate-100 rounded lg:p-1" id="form-btn-add-section-0">
                <svg class="lg:w-6 lg:h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44771 1 1v3M3 9v9c0 .5523.44772 1 1 1h16c.5523 0 1-.4477 1-1V9M3 9h18M8 9V5m4 4V5m4 4V5m-6 9h2m0 0h2m-2 0v-2m0 2v2"/>
                </svg>
            </a>
        `

        const formUtils = document.getElementById('form-utils')
        formUtils.innerHTML=`
            <div class="flex-[1_1_calc(50%-0.5rem)] flex-col justify-center items-center p-4 bg-gradient-to-t from-blue-400 to-teal-300 rounded">
                <p>Form Ingin Ditaruh Dimana?</p>
                <select name="placement" id="form-setting-placement" class="border-0 rounded mt-2 ${formCopy.changeSettingPlacement ? 'bg-yellow-200':''}">
                    <option value="pre-test-website" ${formCopy.placement === 'pre-test-website' ? 'selected':''}>pre-test-website</option>
                    <option value="post-test-website" ${formCopy.placement === 'post-test-website' ? 'selected':''}>post-test-website</option>
                    <option value="pre-test-emodul" ${formCopy.placement === 'pre-test-emodul' ? 'selected':''}>pre-test-emodul</option>
                    <option value="post-test-emodul" ${formCopy.placement === 'post-test-emodul' ? 'selected':''}>post-test-emodul</option>
                    <option value="disable" ${formCopy.placement === 'disable' ? 'selected':''}>disable</option>
                </select>
            </div>
            <div class="flex-[1_1_calc(50%-0.5rem)] flex-col justify-center items-center p-4 bg-gradient-to-t from-blue-400 to-teal-300 rounded">
                <p>Responden Harus Sertakan Email?</p>
                <select name="collect-email" id="form-setting-email" class="border-0 rounded mt-2 ${formCopy.changeSettingEmail ? 'bg-yellow-200':''}">
                    <option value="1" ${formCopy.collect_email == '1' ? 'selected':''}>Iya</option>
                    <option value="0" ${formCopy.collect_email == '0' ? 'selected':''}>Tidak</option>
                </select>
            </div>
            <div class="flex-[1_1_calc(50%-0.5rem)] flex-col justify-center items-center p-4 bg-gradient-to-t from-blue-400 to-teal-300 rounded">
                <p>Responden Cuman Boleh Mengisi Form Satu Kali?</p>
                <select name="one-attempt" id="form-setting-attempt" class="border-0 rounded mt-2 ${formCopy.changeSettingAttempt ? 'bg-yellow-200':''}">
                    <option value="1" ${formCopy.one_attempt == '1' ? 'selected':''}>Iya</option>
                    <option value="0" ${formCopy.one_attempt == '0' ? 'selected':''}>Tidak</option>
                </select>
            </div>
            <div class="flex-[1_1_calc(50%-0.5rem)] flex-col justify-center items-center p-4 bg-gradient-to-t from-blue-400 to-teal-300 rounded">
                <p>Apakah Form Harus Diisi?</p>
                <select name="must-fill" id="form-setting-fill" class="border-0 rounded mt-2 ${formCopy.changeSettingAttempt ? 'bg-yellow-200':''}">
                    <option value="1" ${formCopy.must_fill == '1' ? 'selected':''}>Iya</option>
                    <option value="0" ${formCopy.must_fill == '0' ? 'selected':''}>Tidak</option>
                </select>
            </div>
        `
        const formField = document.getElementById('form-name-field')
        formField.value = formCopy.form_name
        // Urutkan berdasarkan properti 'order'
        
        const formNameField = document.querySelector('[id="form-name-field"]');
        if (formNameField) {
            formNameField.removeEventListener('input', updateFormName);
            formNameField.addEventListener('input', updateFormName);
        }

        document.querySelectorAll('[id^="form-setting-"]').forEach(select => {
            select.removeEventListener('input', updateFormSetting);
            select.addEventListener('input', updateFormSetting);
        });

        sectionsCopy.sort((a, b) => a.order - b.order);

        let sectionSession = ``
        sectionsCopy.forEach(section => {
            sectionSession += `
                <div class="rounded w-full flex justify-center items-start gap-2 ${section.changeContent === 'delete' ? 'hidden' : ''}">
                    <div class="bg-white rounded w-full p-4">
                        <div class="flex justify-between">
                            <div class="flex items-center bg-gray-100 rounded p-2 w-full mb-3">
                                <p class="text-gray-500 font-bold">Section ${section.order}</p>
                            </div>
                            <div>
                                <a data-popover-target="popover-up-section-${section.id}" id="form-order-up-section-${section.id}" class="pointer-events-auto cursor-pointer hover:bg-slate-700">
                                    <svg class="lg:w-6 lg:h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 14-4-4-4 4"/>
                                    </svg>
                                </a>
                                 <div data-popover id="popover-up-section-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                    <div class="py-2 px-3">
                                        <p>Naikkan section</p>
                                    </div>
                                    <div data-popper-arrow></div>
                                </div>
                                <a data-popover-target="popover-down-section-${section.id}" id="form-order-down-section-${section.id}" class="pointer-events-auto cursor-pointer hover:bg-slate-700">
                                    <svg class="lg:w-6 lg:h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
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
                        <input type="hidden" name="sections[${section.id}][sectionId]" value="${section.id}">
                        <input type="hidden" name="sections[${section.id}][order]" value="${section.order}">
                        <input type="hidden" name="sections[${section.id}][status]" value="${section.status??''}">
                        <input type="hidden" name="sections[${section.id}][changeContent]" value="${section.changeContent ?? 'l'}">

                        <textarea class="text-2xl rounded border-1 border-slate-300 w-full ${section.changeSection ? 'bg-yellow-200':'bg-gray-100'}" id="form-section-name-${section.id}" name="sections[${section.id}][section]">${section.name}</textarea>
                        <textarea class="text-md rounded border-1 border-slate-300 w-full min-h-[50px] max-h-[500px] overflow-y-auto resize-none  ${section.changeSectionDesc ? 'bg-yellow-200':'bg-gray-100'}" id="form-section-description-${section.id} ${section.change ? 'bg-yellow-200':'bg-white'}" name="sections[${section.id}][description]">${section.description}</textarea>
                    </div> 
                    <div class="bg-white rounded lg:p-1 h-full flex justify-center items-center flex-col gap-1">
                        <a data-popover-target="popover-add-section-${section.id}" class="pointer-events-auto cursor-pointer hover:bg-slate-100 rounded lg:p-1" id="form-btn-add-section-${section.order}">
                            <svg class="lg:w-6 lg:h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44771 1 1v3M3 9v9c0 .5523.44772 1 1 1h16c.5523 0 1-.4477 1-1V9M3 9h18M8 9V5m4 4V5m4 4V5m-6 9h2m0 0h2m-2 0v-2m0 2v2"/>
                            </svg>
                        </a>
                        <div data-popover id="popover-add-section-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                            <div class="py-2 px-3">
                                <p>Tambahkan section</p>
                            </div>
                            <div data-popper-arrow></div>
                        </div>

                        <a data-popover-target="popover-delete-section-${section.id}" class="pointer-events-auto cursor-pointer hover:bg-slate-100 rounded p-1" id="form-btn-delete-section-${section.id}">
                            <svg class="lg:w-6 lg:h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clip-rule="evenodd"/>
                            </svg>                                                                                       
                        </a>
                        <div data-popover id="popover-delete-section-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                            <div class="py-2 px-3">
                                <p>Hapus Section</p>
                            </div>
                            <div data-popper-arrow></div>
                        </div>

                        <a data-popover-target="popover-add-question-section-${section.id}" class="pointer-events-auto cursor-pointer hover:bg-slate-100 rounded p-1" id="form-btn-add-question-id-order-0-section-${section.id}">
                            <svg class="lg:w-6 lg:h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clip-rule="evenodd"/>
                            </svg>
                        </a>
                        <div data-popover id="popover-add-question-section-${section.id}" role="tooltip" data-popover-placement="left" class="absolute z-10 invisible inline-block text-sm text-white transition-opacity duration-300 bg-gray-600 border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                            <div class="py-2 px-3">
                                <p>Tambahkan Question</p>
                            </div>
                            <div data-popper-arrow></div>
                        </div>

                        <a data-popover-target="popover-copy-section-${section.id}" class="pointer-events-auto cursor-pointer hover:bg-slate-100 rounded p-1" id="form-btn-copy-section-${section.id}">
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
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
                    if(question.input_type === 'radio'){
                        answerSection += `
                        <div class="flex justify-between items-center gap-2 my-3">
                            <div id="form-type" class="flex justify-center items-center flex-col">
                                <label for="form-answer-type">Answer Type:</label>
                                <input type="hidden" name="sections[${section.id}][questions][${question.id}][question_id]" value="${question.id}">
                                <select class="${question.changeTypeAnswer ? 'bg-yellow-200':'bg-gray-100'} border-0 rounded mt-2" id="form-answer-type-${question.id}" name="sections[${section.id}][questions][${question.id}][input_type]">
                                    <option value="text">Text</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="radio" selected>Radio</option>
                                    <option value="textarea">Text Area</option>
                                </select>
                            </div>
                        </div>
                        `
                        
                        if(question.answers.length === 0){
                            answerSection += ``
                        }else{
                            question.answers.forEach((answer,index) =>{
                                
                                if(answer.changeContent === 'delete' && answer.answer){
                                    answerSection += `
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][answer][${index+1}][answer_id]" value="${answer.id}">
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][answer][${index+1}][changeContent]" value="${answer.changeContent ?? 'l'}">
                                        <input class="form-check-input border-0 border-b w-full" 
                                           id="answer-${section.id}-${question.id}-${answer.id}-${index+1}"
                                            name="sections[${section.id}][questions][${question.id}][answer][${index+1}][answer]" 
                                            type="hidden" 
                                            value="${answer.answer}" required>`;
                                }else if(answer.changeContent === 'delete' && !answer.answer){
                                    answerSection += ``;
                                }else{
                                    answerSection += `
                                        <div class="flex justify-center items-center my-1 gap-1">
                                            <div class="flex justify-center items-center h-full" id="form-btn-delete-answer-${answer.id}-${question.id}-${section.id}-${index+1}">
                                                <svg class="pointer-events-auto cursor-pointer lg:w-6 lg:h-6 text-red-600 aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path fill-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clip-rule="evenodd"/>
                                                </svg>
                                            </div>
                                            
                                            <input type="hidden" name="sections[${section.id}][questions][${question.id}][answer][${index+1}][answer_id]" value="${answer.id}">
                                            <input type="hidden" name="sections[${section.id}][questions][${question.id}][answer][${index+1}][changeContent]" value="${answer.changeContent ?? 'l'}">
                                            <input type="hidden" name="sections[${section.id}][questions][${question.id}][answer][${index+1}][status]" value="${answer.status??''}">
                                            
                                            <div class="flex justify-center items-end gap-2 w-full">
                                                <input class="form-check-input rounded border-1 border-slate-300 w-full ${answer.changeAnswer ? 'bg-yellow-200':'bg-gray-100'}" 
                                                    id="answer-${section.id}-${question.id}-${answer.id}-${index+1}"  
                                                    name="sections[${section.id}][questions][${question.id}][answer][${index+1}][answer]" 
                                                    type="text" 
                                                    value="${answer.answer}" required>

                                                <div class="flex flex-col w-1/4 text-center">
                                                    <label for="answer-value-${section.id}-${question.id}-${answer.id}-${index+1}">Value</label>
                                                    <input class="form-check-input rounded border-1 border-slate-300 ${answer.changeAnswer ? 'bg-yellow-200':'bg-gray-100'}"
                                                        type="number" 
                                                        id="answer-value-${section.id}-${question.id}-${answer.id}-${index+1}" 
                                                        name="sections[${section.id}][questions][${question.id}][answer][${index+1}][value]" 
                                                        value="${answer.value}">
                                                </div>
                                            </div>
                                        </div>
                                    `
                                }
                            })
                        }
                        answerSection +=`
                            <div id="form-btn-add-answer" data-question-id="${question.id}" class="flex justify-center items-center">
                                <div class="bg-green-400 rounded py-2 m-3 w-full pointer-events-auto cursor-pointer hover:bg-green-600 flex justify-center items-center">
                                    <p class="text-white">Add</p>
                                </div>
                            </div>
                        `
                    }else if(question.input_type === 'checkbox'){
                        answerSection += `
                            <div class="flex justify-between items-center gap-2 my-3">
                                <div id="question-rules" class="flex flex-col ml-3">
                                    <label>Max Select</label>
                                    <input type="number" class="w-1/2 border-0 rounded mt-2 ${question.changeRule ? 'bg-yellow-200':'bg-gray-100'}" id="rule-${section.id}-${question.id}" name="sections[${section.id}][questions][${question.id}][rule]" value="${question.rules}">
                                </div>
                                <div id="form-type" class="flex justify-center items-center flex-col">
                                    <label for="form-answer-type">Answer Type:</label>
                                    <input type="hidden" name="sections[${section.id}][questions][${question.id}][question_id]" value="${question.id}">
                                    <select class="border-0 rounded mt-2 ${question.changeTypeAnswer ? 'bg-yellow-200':'bg-gray-100'}" id="form-answer-type-${question.id}" name="sections[${section.id}][questions][${question.id}][input_type]">
                                        <option value="text">Text</option>
                                        <option value="checkbox" selected>Checkbox</option>
                                        <option value="radio">Radio</option>
                                        <option value="textarea">Text Area</option>
                                    </select>
                                </div>
                            </div>
                        `
                        if(question.answers.length === 0){
                            answerSection += ``
                        }else{
                            question.answers.forEach((answer, index) =>{
                                answerSection += `
                                    <div class="flex justify-center items-center my-1 gap-1">
                                        <div class="flex justify-center items-center h-full" id="form-btn-delete-answer-${answer.id}-${question.id}-${section.id}-${index+1}">
                                            <svg class="pointer-events-auto cursor-pointer lg:w-6 lg:h-6 text-red-600 aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fill-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clip-rule="evenodd"/>
                                            </svg>
                                        </div>
                                        
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][answer][${index+1}][answer_id]" value="${answer.id}">
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][answer][${index+1}][changeContent]" value="${answer.changeContent ?? 'l'}">
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][answer][${index+1}][status]" value="${answer.status??''}">
                                        
                                        <div class="flex justify-center items-end gap-2 w-full">
                                            <input class="form-check-input rounded border-1 border-slate-300 w-full ${answer.changeAnswer ? 'bg-yellow-200':'bg-gray-100'}" 
                                                id="answer-${section.id}-${question.id}-${answer.id}-${index+1}"  
                                                name="sections[${section.id}][questions][${question.id}][answer][${index+1}][answer]" 
                                                type="text" 
                                                value="${answer.answer}" required>

                                            <div class="flex flex-col w-1/4 text-center">
                                                <label for="answer-value-${section.id}-${question.id}-${answer.id}-${index+1}">Value</label>
                                                <input class="form-check-input rounded border-1 border-slate-300 ${answer.changeAnswer ? 'bg-yellow-200':'bg-gray-100'}"
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
                            <div id="form-btn-add-answer" data-question-id=${question.id} class="flex justify-center items-center">
                                <div class="bg-green-400 rounded py-2 m-3 w-full pointer-events-auto cursor-pointer hover:bg-green-600 flex justify-center items-center">
                                    <p class="text-white">Add</p>
                                </div>
                            </div>
                        `
                    }else if(question.input_type === 'text'){
                        answerSection += `
                            <div id="form-type" class="flex justify-between my-3">
                                <label for="form-answer-type">Answer Type:</label>
                                <input type="hidden" name="sections[${section.id}][questions][${question.id}][question_id]" value="${question.id}">
                                <select class="${question.changeTypeAnswer ? 'bg-yellow-200':'bg-gray-100'} border-0 rounded mt-2" id="form-answer-type-${question.id}" name="sections[${section.id}][questions][${question.id}][input_type]">
                                    <option value="text" selected>Text</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="radio">Radio</option>
                                    <option value="textarea">Text Area</option>
                                </select>
                            </div>
                            
                            <div
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                id="answer-${question.id}-text" 
                                aria-label="Text input for following question">Text Input
                            </div>
                        `
                    }else if(question.input_type === 'textarea'){
                        answerSection += `
                            <div id="form-type" class="flex justify-between my-3">
                                <label for="form-answer-type">Answer Type:</label>
                                <input type="hidden" name="sections[${section.id}][questions][${question.id}][question_id]" value="${question.id}">
                                <select id="form-answer-type-${question.id}" name="sections[${section.id}][questions][${question.id}][input_type]" class="${question.changeTypeAnswer ? 'bg-yellow-200':'bg-gray-100'} border-0 rounded mt-2">
                                    <option value="text">Text</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="radio">Radio</option>
                                    <option value="textarea" selected>Text Area</option>
                                </select>
                            </div>
                            
                            <div class="h-16 form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                id="answer-${question.id}-textarea" 
                                name="sections[${section.id}][questions][${question.id}][answer]">Textarea Input</div>
                        `
                    }
                    sectionSession += `
                            <div class="soal-1 w-full flex justify-center items-start gap-2 ${question.changeContent === 'delete' || section.changeContent === 'delete' ? 'hidden' : ''}">
                                <div class="${question.changeOrder ? 'bg-yellow-100':'bg-white'} rounded p-4 w-full ms-7">
                                    <div class="flex items-center gap-2">
                                        <div>
                                            <a data-popover-target="popover-up-question-${question.id}-${section.id}" id="form-order-up-question-${question.id}-order-${question.order}-section-${section.id}" data-question-id=${question.id} data-section-id=${section.id} class="pointer-events-auto cursor-pointer hover:bg-slate-700">
                                                <svg class="lg:w-6 lg:h-6 text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
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
                                                <svg class="lg:w-6 lg:h-6 text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
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
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][changeContent]" value="${question.changeContent ?? 'l'}">
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][status]" value="${question.status??''}">
                                        <input type="hidden" name="sections[${section.id}][questions][${question.id}][order]" value="${question.order}">
                                        
                                        <textarea class="rounded border-1 border-slate-300 w-full ${question.changeQuestion ? 'bg-yellow-200':'bg-gray-100'}" id="question-${section.id}-${question.id}" name="sections[${section.id}][questions][${question.id}][question]">${question.question}</textarea>
                                    </div>
                                    <div class="answer-list flex flex-col w-full">
                                       ${answerSection}
                                    </div>
                                </div>
                                <div class="bg-white rounded p-1 flex justify-center items-center flex-col gap-1">
                                    <a data-popover-target="popover-add-section-question-${question.id}-${section.id}" class="pointer-events-auto cursor-pointer" id="form-btn-add-section-${section.order}">
                                        <svg class="lg:w-6 lg:h-6 text-gray-800 dark:text-white hover:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
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
                                        <svg class="lg:w-6 lg:h-6 text-gray-800 dark:text-white hover:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
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
                                        <svg class="lg:w-6 lg:h-6 text-gray-800 dark:text-white hover:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
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
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
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

        document.getElementById('form').removeEventListener('submit', formSubmit)
        document.getElementById('form').addEventListener('submit', formSubmit)

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

        document.querySelectorAll('[id^="form-section-"]').forEach(select => {
            select.removeEventListener('input', sectionFieldChange);
            select.addEventListener('input', sectionFieldChange);
        });

        document.querySelectorAll('[id^="question-"]').forEach(select => {
            select.removeEventListener('input', questionFieldChange);
            select.addEventListener('input', questionFieldChange);
        });

        document.querySelectorAll('[id^="rule-"]').forEach(select => {
            select.removeEventListener('input', changeRuleCheckbox);
            select.addEventListener('input', changeRuleCheckbox);
        });


        document.querySelectorAll('[id^="answer-"]').forEach(select => {
            select.removeEventListener('input', answerFieldChange);
            select.addEventListener('input', answerFieldChange);
        });

        document.querySelectorAll('[id^="answer-value-"]').forEach(select => {
            select.removeEventListener('input', answerValueChange);
            select.addEventListener('input', answerValueChange);
        });
        
        document.querySelectorAll('[id^="form-answer-type-"]').forEach(select => {
            select.removeEventListener('change', formAnswerTypeChange);
            select.addEventListener('change', formAnswerTypeChange);
        });

        document.querySelectorAll('[id^="form-order-up-section-"]').forEach(select => {
            select.removeEventListener('click', formOrderUpSection); // Hapus event listener lama
            select.addEventListener('click', formOrderUpSection); // Tambahkan event listener baru
        });

        document.querySelectorAll('[id^="form-order-down-section-"]').forEach(select => {
            select.removeEventListener('click', formOrderDownSection); // Hapus event listener lama
            select.addEventListener('click', formOrderDownSection); // Tambahkan event listener baru
        });

        document.querySelectorAll('[id^="form-btn-add-section-"]').forEach(button => {
            button.removeEventListener('click', formBtnAddSection)
            button.addEventListener('click', formBtnAddSection)
        })

        document.querySelectorAll('[id^="form-btn-copy-section-"]').forEach(button => {
            button.removeEventListener('click', formBtnCopySection)
            button.addEventListener('click', formBtnCopySection)
        })

        document.querySelectorAll('[id^="form-btn-delete-section-"]').forEach(select => {
            select.removeEventListener('click', formBtnDeleteSection);
            select.addEventListener('click', formBtnDeleteSection);
        });
        

        document.querySelectorAll('[id^="form-btn-add-question-"]').forEach(select => {
            select.removeEventListener('click', formBtnAddQuestion);
            select.addEventListener('click', formBtnAddQuestion);
        });

        document.querySelectorAll('[id^="form-btn-copy-question-"]').forEach(select => {
            select.removeEventListener('click', formBtnCopyQuestion);
            select.addEventListener('click', formBtnCopyQuestion);
        });

        document.querySelectorAll('[id^="form-btn-delete-question-"]').forEach(select => {
            select.removeEventListener('click', formBtnDeleteQuestion);
            select.addEventListener('click', formBtnDeleteQuestion);
        });
        

        document.querySelectorAll('[id^="form-order-up-question-"]').forEach(select => {
            select.removeEventListener('click', formOrderUpQuestion);
            select.addEventListener('click', formOrderUpQuestion);
        });
        
        document.querySelectorAll('[id^="form-order-down-question-"]').forEach(select => {
            select.removeEventListener('click', formOrderDownQuestion);
            select.addEventListener('click', formOrderDownQuestion);
        });
        
        document.querySelectorAll('[id^="form-btn-add-answer"]').forEach(button => {
            button.removeEventListener('click', formBtnAddAnswer);
            button.addEventListener('click', formBtnAddAnswer);
        });
        
        document.querySelectorAll('[id^="form-btn-delete-answer-"]').forEach(button => {
            button.removeEventListener('click', formBtnDeleteAnswer);
            button.addEventListener('click', formBtnDeleteAnswer);
        });        
    }
}