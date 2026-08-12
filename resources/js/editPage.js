// ======== GLOBALS =========
import { globals } from './page/globals.js';

// ======== STYLING =========
import * as bs from './page/styling/baseStyling.js';
import { updateStylingControls } from './page/styling/stylingControls.js';

// ======== COMPONENTS =========
import { 
  accordionStyling, 
  addAccordion,
  copyAccordion,
  copyHeadAccordion
} from './page/accordion.js';

import { 
  addCarousel, 
  copyItemCarousel, 
  setImageItem, 
  addItemCarousel, 
  addTextCarousel, 
  btnHideNext, 
  btnTextPosition,
  copyCarousel 
} from './page/carousel.js';

import { modalTypeStyling, addModal, copyModal } from './page/modal.js';

import { addField,copyField } from './page/field.js';
import { addSection,copySection } from './page/section.js';

// ======== COPY HANDLERS =========
import { getTargetElement,handleElementAction } from './page/downUpDelete/action.js'

// ======== updateContent ========
import { updateActionProperty } from './page/utils/updateContent.js'

// ======== Validation get element ==========
import { getEl } from './page/utils/validationGetElement.js';
import { initWebpage, resizeElements } from './loadWebpage.js';

// ======== GLOBAL VARIABLE ASSIGNMENT =========
let webpageDb = globals.webpageDb,
  fileDb = globals.file,
  param = globals.param,
  webpageDbRaw = globals.webpageDbRaw,
  file = globals.file,
  webpageDbParentSection = globals.webpageDbParentSection,
  editorFieldSelect = globals.editorFieldSelect,
  carouselSelect = globals.carouselSelect,
  accordionSelect = globals.accordionSelect

document.addEventListener('DOMContentLoaded', function(){
  // inisialisasi ke variabel globals
  webpageDbRaw = JSON.parse(JSON.stringify(webpageJs));
  globals.webpageDbRaw = webpageDbRaw

  file = JSON.parse(JSON.stringify(fileJs));
  globals.file = file

  param = JSON.parse(JSON.stringify(paramJs))
  globals.param = param

  webpageDb = webpageDbRaw.filter(page => page.type !== 'parent-section')
  globals.webpageDb = webpageDb

  webpageDbParentSection = webpageDbRaw.filter(page => page.type == 'parent-section')
  globals.webpageDbParentSection = webpageDbParentSection

  let btnSwap = getEl('btn-page-swap')
  
  let btnSwapPage
  let btn1=`flex: 1;padding: 0.25rem;border-right: 1px solid #4b5563;font-size: 0.875rem;font-weight: 700;color: #1f2937;`
  let btn2=`flex: 1;padding: 0.25rem;font-size: 0.875rem;font-weight: 700;color: #1f2937;`
  
  btnSwapPage = `
    <a href="${ param === 'prolog' ? btnSwap.dataset.webpage : btnSwap.dataset.prolog}" id="btn-to-prolog" style="${btn1}">
      ${ param === 'prolog' ? 'To Webpage' : 'To Prolog' }
    </a>
  `
  let indicatorPage
  if(param === 'prolog'){
    indicatorPage = 'Prolog'
  }else{
    indicatorPage = 'Webpage'
  }


  btnSwap.innerHTML=btnSwapPage  
  const indicatorPageEl = getEl('indicator-page')
  if(!indicatorPageEl) return
  
  indicatorPageEl.innerHTML=indicatorPage        

  document.getElementById('loading-overlay')?.classList.remove('hidden');
  setTimeout(()=>{
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        initWebpage(true)
        document.getElementById('loading-overlay')?.classList.add('hidden');
      });
    });
  },1000)
})

let allowUnload = false;
window.addEventListener('beforeunload', function (e) {
    if (!allowUnload) {
        e.preventDefault();
        e.returnValue = '';
    }
});

window.addEventListener("resize", resizeElements);
window.addEventListener("load", resizeElements);

function showToast(message) {
    const toast = getEl('toast-autosave');
    const text = getEl('toast-message');

    if(!text || !toast) return

    text.innerText = message;
    
    // Munculkan toast
    toast.style.opacity = '1';
    toast.classList.remove('translate-y-20');
    toast.classList.add('translate-y-0');

    setTimeout(() => {
        toast.style.opacity = '0.4';
    }, 5000);
}

// ======================== INITIALIZED =======================
const defaultSidebar = getEl('default-sidebar')
const webpage = getEl('webpage')

defaultSidebar.addEventListener('mouseup', function (event){
  if(event.target.closest('heading-text')){

    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      globals.savedSelection = range.cloneRange();
    }
  }
})

defaultSidebar.addEventListener('click', function (event) {
  // ================= EVENT CLICK ====================
  if(event.target.closest("[id='heading-text']")){
    let element = event.target.closest("[id='heading-text']")

    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      globals.savedSelection = range.cloneRange();
    }
    
    updateStylingControls(element ,event.target)
  }

  const idParts = event.target.id.split('-')
  if(event.target.id.startsWith('set-image-item')){
    setImageItem(idParts)
  }

  if(event.target.id.startsWith('reset-image-')){
    bs.resetImage(idParts)
  }

  if (event.target.id.startsWith('add-item-carousel-')) {
    addItemCarousel(event)
    if(carouselSelect.dataset.text === "true"){
  
    }
  }

  if (event.target.id.startsWith("add-text-carousel")) {
    addTextCarousel(event)

  }

  if(event.target.id.startsWith("btn-hide-next")){
    btnHideNext(event)
  }

  if(event.target.id.startsWith("btn-text-position") && carouselSelect.dataset.text === 'true'){
    btnTextPosition(event)
  }

  if(event.target.id.startsWith("copy")){
    if(idParts[1] == "item"){
      copyItemCarousel(idParts.slice(1).join('-'))
    }
  }

  // ============= UP DOWN DELETE ELEMEN ====================
  if(idParts[0] =='up' || idParts[0] == 'down' || idParts[0] == 'delete'){
    const { fieldElement: actualField, bodyElement: actualBodyItem } = getTargetElement(idParts);

    if(idParts[0] =='up'){
      handleElementAction('up', actualField, actualBodyItem, {
        datasetKey: 'itemOrder',
        reinitFlowbite: true,
        afterMove: () => updateStylingControls(carouselSelect)
      }, idParts);
    }else if(idParts[0] =='down'){
      handleElementAction('down', actualField, actualBodyItem, {
        datasetKey: 'itemOrder',
        reinitFlowbite: true,
        afterMove: () => updateStylingControls(carouselSelect)
      }, idParts);
    }else if(idParts[0] == 'delete'){

      let sectionDelete=true
      const editCarousel = getEl(`edit-${idParts.slice(1).join('-')}`)
      if(!editCarousel) return

      const editCarouselWrapper = editCarousel.parentElement
      if(editCarouselWrapper.children.length <=1){
        sectionDelete=false
      }
      
      if(sectionDelete){
        handleDelete(
            "Hapus Item?", 
            "Apakah kamu yakin ingin menghapus elemen ini?",
            idParts,actualField, actualBodyItem,'itemCarousel',carouselSelect
        )
     
      }else{
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: 'elemen tidak boleh terhapus semua', status:false} 
        }));
      }
    }
  }

  // ============ MEDIA LAYOUT ============================
  const mediaLayout =event.target.closest('[id^=media-layout]')
  if(mediaLayout){
    const webpageContainer = document.getElementById('webpage')
    const btnMediaLayoutParent = document.getElementById('media-layout')
    
    const type = mediaLayout.id.split('-').pop()

    const size={
      'phone':'375px',
      'tablet':'650px',
      'desktop':'100%',
    };

    if(size[type]){
      webpageContainer.style.width=size[type]
      
      btnMediaLayoutParent.querySelectorAll('[id^=media-layout]').forEach(btn=>{
        btn.className='cursor-pointer bg-white p-2 rounded-md text-black hover:bg-gray-200'
      })

      mediaLayout.className='cursor-pointer bg-blue-400 p-2 rounded-md text-black'

    }
   
    resizeElements(true)
  }
})

webpage.addEventListener('mouseup', function(event){
  if(event.target.closest("[id^='field-']")){
    const sel = window.getSelection();
      if (sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        globals.savedSelection = range.cloneRange();
      }
  }
})

webpage.addEventListener('keyup', function(event){
  if(event.target.closest("[id^='field-']")){
    let element = event.target.closest("[id^='field-']")
   
    webpageDb.forEach(item=>{
      if(item.id === element.id){
        item.action= updateActionProperty(item.action, 'update')
        item.content = element.innerHTML
        globals.isFormDirty = true
        return
      }
    })
    globals.webpageDb = webpageDb
  }
})

webpage.addEventListener('click', function (event) {
  const idParts = event.target.id.split('-')
  const id = event.target.id

  // ================== Click Elemen Event ===================
  if(event.target.closest('[id^="btn-heading-accordion"]')){

    let element = event.target.closest('[id^="btn-heading-accordion"]')

    element.dataset.listenerAdded = "true";
    // cari elemen terdekat yang punya id prefix "btn-heading-accordion"
    const btn = element
    if (!btn) return; // kalau klik di luar area

    const idParts = btn.id.split('-');
    editorFieldSelect = btn;
    globals.editorFieldSelect = btn;

    const range = document.createRange();
    range.selectNodeContents(element);

    globals.savedSelection = range;

    carouselSelect = null;
    globals.carouselSelect = null;

    accordionSelect = getEl(idParts.slice(2, -1).join('-'))
    if(!accordionSelect) return

    globals.accordionSelect = accordionSelect

    updateStylingControls(editorFieldSelect);

  }

  else if(event.target.closest("[id^='field-']")){

    let element = event.target.closest("[id^='field-']")

    event.stopPropagation()
    webpageDb=globals.webpageDb
    editorFieldSelect = element
    globals.editorFieldSelect = editorFieldSelect

    accordionSelect =null
    globals.accordionSelect =null
    
    carouselSelect = null
    globals.carouselSelect = null
    
    webpageDb.forEach(item=>{
      if(item.id === element.id){
        item.action= updateActionProperty(item.action, 'update')
        item.content = element.innerHTML
      
        return
      }
    })
    globals.webpageDb = webpageDb

    updateStylingControls(editorFieldSelect ,element);
  }

  else if(event.target.closest('[id^="btn-modal-"]')){

    let element = event.target.closest('[id^="btn-modal-"]')

    editorFieldSelect = element
    globals.editorFieldSelect = editorFieldSelect

    accordionSelect =null
    globals.accordionSelect =null

    carouselSelect = null
    globals.carouselSelect = null
    updateStylingControls(editorFieldSelect)

  }

  else if(event.target.closest('[id^="parent-modal-"]')){
    if(!event.target.id.startsWith('btn-footer') && event.target.closest('[id^="parent-modal-"]')){
      let element = event.target.closest('[id^="parent-modal-"]')
      editorFieldSelect = element
      globals.editorFieldSelect = element

      carouselSelect = null
      globals.carouselSelect = null

      updateStylingControls(editorFieldSelect)

    }
  }

  else if(event.target.closest('[id^="carousel-"]')){

    let element = event.target.closest('[id^="carousel-"]')

    carouselSelect = element
    globals.carouselSelect = element
    
    editorFieldSelect=null
    globals.editorFieldSelect=null
    
    accordionSelect =null
    globals.accordionSelect =null

    if(event.target.id.startsWith('item') || event.target.parentElement.id.startsWith('img-text')|| event.target.parentElement.id.startsWith('item')){
      updateStylingControls(element)
    }
  }

  else if(event.target.closest('[id^="section-accordion"]')){
    let element = event.target.closest('[id^="section-accordion"]')

    event.stopPropagation()
    const idParts = element.id.split('-')

    if(event.target.id.startsWith('section-accordion-') || event.target.id.startsWith('wrapper-section-')){
      editorFieldSelect = element
      globals.editorFieldSelect = element

      carouselSelect = null
      globals.carouselSelect = null

      accordionSelect = getEl(idParts.slice(1,-2).join('-'))
      if(!accordionSelect) return

      globals.accordionSelect = accordionSelect

      updateStylingControls(editorFieldSelect)
    }
  }

  else if(event.target.closest('[id^="webpage-section-"]')){

    let element = event.target.closest('[id^="webpage-section-"]')

    editorFieldSelect = element
    globals.editorFieldSelect = element

    accordionSelect =null
    globals.accordionSelect = null

    carouselSelect = null
    globals.carouselSelect = null

    updateStylingControls(editorFieldSelect)
  }

  // =================== ADD ELEMENT ==========================

  if (id.startsWith('add-section-')) {
    addSection(event)
  }

  if (id.startsWith('add-field-')) {
    addField(event)

  }
  
    // ======================== MODAL =========================
  if(id.startsWith('add-modal-')) {
    addModal(event)

  }

  // ======================== ACCORDION ======================
  if(id.startsWith('add-accordion-')) {
    addAccordion(event)
  
  }
  
  // ======================== CAROUSEL ======================
  if(id.startsWith('add-carousel-')) {
    addCarousel(event)
  }

  if(id.startsWith('copy-')){

    const idParts = event.target.id.split('-')
    
    if(idParts[1] == "field"){
      copyField(idParts)
      
    }else if(idParts[1] == "modal"){
      copyModal(idParts.slice(1).join('-'))

    }else if(idParts[1] == "accordion"){
      copyAccordion(idParts.slice(1).join('-'))

    }else if(idParts[1] == "head"){
      copyHeadAccordion(idParts.slice(2).join('-'))
    }else if(idParts[1] == "section"){
      copySection(idParts.slice(1).join('-'), 'all', event)
      
    }else if(idParts[1] == "carousel"){
      copyCarousel(idParts.slice(1).join('-'))
    }
  }

// ================================= DOWN UP DELETE ELEMENT =================================
if(idParts[0] =='up' || idParts[0] == 'down' || idParts[0] == 'delete'){
  const { fieldElement, bodyElement } = getTargetElement(idParts);

  if (!fieldElement) return;

  if(idParts[0] =='up'){
    handleElementAction('up', fieldElement, bodyElement, {
      datasetKey: 'elementOrder'
    }, idParts);
  }else if(idParts[0] =='down'){
    handleElementAction('down', fieldElement, bodyElement, {
      datasetKey: 'elementOrder'
    }, idParts);
  }else if(idParts[0] == 'delete'){ 
    let sectionDelete=true

    if(idParts[1] ==='section'){
      let section = bodyElement.querySelectorAll("[id^='webpage-section']");
      if(idParts[2] ==='accordion'){
        section = bodyElement.querySelectorAll("[id^='section-accordion']");
      }
      let sectionNotFooter = Array.from(section).filter(sec => !sec.id.includes('footer'));
      
      if(idParts.includes('webpage')){
        section = bodyElement.querySelectorAll("[id^='webpage-section']");
        sectionNotFooter = Array.from(section).filter(sec => !sec.id.includes('footer'));
      }
      if (sectionNotFooter.length > 1) {
        sectionDelete=true
      }else{
        sectionDelete=false
      }

    }else if(idParts[1] ==='head'){
      const accordion = getEl(idParts.slice(2).join('-'))
      if(!accordion) return
      const parentAccordion = accordion.parentElement
      
      if(parentAccordion.children.length <= 1){
        sectionDelete=false
      }
    }

    if(sectionDelete){
      
      handleDelete(
          "Hapus Item?", 
          "Apakah kamu yakin ingin menghapus elemen ini?",
          idParts,fieldElement, bodyElement,'re'
      )

    }else{
       window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: 'elemen tidak boleh terhapus semua', status:false} 
        }));
    }
  }
}
})

function handleDelete(judul, pesan,idParts,fieldElement, bodyElement, type, carouselSelect) {
    return new Promise((resolve) => {
        // Kirim event untuk buka modal
        window.dispatchEvent(new CustomEvent('confirm-modal', { 
            detail: { 
                tipe: 'danger', 
                judul: judul, 
                pesan: pesan,
                tombolTeks: 'Ya, Hapus'
                // Kita tidak kirim callback string lagi
            } 
        }));

        // Dengarkan klik tombol "Ya" dari modal
        window.addEventListener('modal-konfirmasi-ya', () => {

          const targetElement = fieldElement.id ? fieldElement : fieldElement.querySelector('[id^="field"]');
          const freshFieldElement = document.getElementById(targetElement.id);

          console.log(type,freshFieldElement,targetElement,fieldElement,bodyElement)

          if (!freshFieldElement) {
              resolve(false);
              return;
          }

          if(type === "itemCarousel"){
            handleElementAction('delete', fieldElement, bodyElement, {
                datasetKey: 'itemOrder',
                reinitFlowbite: true,
                afterMove: () => updateStylingControls(carouselSelect)
            }, idParts);
          }else{
            
            handleElementAction('delete', fieldElement, bodyElement, {
                datasetKey: 'elementOrder'
            }, idParts);
          }
            resolve(true);
        }, { once: true }); // {once: true} agar listener langsung terhapus

        // Dengarkan klik tombol "Batal"
        window.addEventListener('modal-konfirmasi-batal', () => {
            resolve(false);
        }, { once: true });
    });
}

// ------------------------------ SEND BATCH DATA --------------------------------------------
const chunk = (arr, size) => {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
};

function removeGlobalItem(id) {
    // 1. Cek di level
    globals.webpageDb = globals.webpageDb.filter(item => {
        if (item.id === id) return false; // Hapus
        return true;
    });
}

const sendBatch = async (batch, indexLabel, extraFields = false) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  const form = new FormData();
  //console.log(batch)
  batch.forEach((item, idx) => {
      form.append(`items[${idx}][id]`, item.id);
      form.append(`items[${idx}][type]`, item.type);
      form.append(`items[${idx}][action]`, item.action ?? '');
      form.append(`items[${idx}][filetype]`, item.filetype ?? '');

      if (extraFields) {
          form.append(`items[${idx}][style]`, item.style ?? "");
          form.append(`items[${idx}][content]`, item.content ?? "");
          form.append(`items[${idx}][element_order]`, item.element_order ?? "");
          form.append(`items[${idx}][element_count]`, item.element_count ?? "");
      }

      if (item.file) {
          form.append(`items[${idx}][file]`, item.file);
      }
  });

  form.append("paramStatus", param);
  //console.log(form, extraFields)
  let raw = "";
  try {
      const response = await fetch('/admin/webpage/store', {
          method: "POST",
          headers: {
              "Accept": "application/json",
              "X-CSRF-TOKEN": csrfToken
          },
          body: form
      });

      if (response.status === 419 || response.status === 401) {
        allowUnload = true;

        window.dispatchEvent(new CustomEvent('alert.error', { 
            detail: { pesan: 'Session Berakhir silahkan login ulang' } 
        }));
        return;
      }

      raw = await response.text()
      
      let data = JSON.parse(raw);
      if (data.success) {
        //console.log('data no puri:',data.datano)
        //console.log('data puri:', data.datapuri)
        //console.log('data content:',data.datacontent)
          batch.forEach(item => {
              if (item.action === 'delete') {
                  // JIKA DELETE: Hapus total objek ini dari array global
                  removeGlobalItem(item.id);
              } else {
                  // JIKA UPDATE/CREATE: Hanya hilangkan label action agar dianggap "clean"
                  delete item.action;
                  if (item.file) delete item.file; 
              }
          });
          
      } else {
        throw data;
      }
      
      if (!data.success) throw data;

  } catch (err) {
    window.dispatchEvent(new CustomEvent('notif-pesan', { 
        detail: { pesan: err.message || "Terjadi kesalahan", status: false } 
    }));

    throw err; // Teruskan agar loop batch berhenti
  }
};

async function submitData(isAutosave=false){
  try{
    let noFileDb = [...globals.webpageDbParentSection, ...globals.webpageDb]
      .filter(item => item.action);

    let fileDb=globals.file.filter(item=>item.action)

    const fileChunks = chunk(fileDb, 15); // max 15 file

    for (let i = 0; i < fileChunks.length; i++) {
        await sendBatch(
            fileChunks[i],
            `batch file ${i + 1}/${fileChunks.length}`,
            false
        );
    }

    const nonFile = [
        ...noFileDb.filter(x => x.action?.includes("delete")),
        ...noFileDb.filter(x => !x.action?.includes("delete"))
    ];

    const nonFileChunks = chunk(nonFile, 100);

    for (let i = 0; i < nonFileChunks.length; i++) {
        await sendBatch(
            nonFileChunks[i],
            `batch data ${i + 1}/${nonFileChunks.length}`,
            true
        );
    }

    if (!isAutosave) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const clearResponse = await fetch('/admin/webpage/clear', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "X-CSRF-TOKEN": csrfToken
            }
        });
        const clearData = await clearResponse.json();
        
    }

    globals.isFormDirty = false;

    
    if (isAutosave) {
          //console.log('Autosave sukses');
          showToast('Perubahan disimpan otomatis');
    } else {
        // Jika manual, jalankan event redirect kamu yang lama
        
        document.getElementById('loading-overlay')?.classList.add('hidden')
        window.dispatchEvent(new CustomEvent('alert-success', { 
            detail: { pesan: 'Tampilan telah berhasil diperbarui.'} 
        }));
    }
  }catch(err) {

    document.getElementById('loading-overlay')?.classList.add('hidden');
    window.dispatchEvent(new CustomEvent('notif-pesan', { 
        detail: { pesan: 'Gagal simpan data.', status: false } 
    }));

  }
}

let cekCount=0;
async function cekStatus(){
  try{
    document.getElementById('loading-overlay')?.classList.remove('hidden');

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const clearResponse = await fetch(`/admin/webpage/cek`, {
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
    }

    setTimeout(()=>{
      document.getElementById('loading-overlay')?.classList.add('hidden');
    },2000)
  }catch(err) {

    document.getElementById('loading-overlay')?.classList.add('hidden');
    window.dispatchEvent(new CustomEvent('notif-pesan', { 
        detail: { pesan: `Gagal cek status.${err}`, status: false } 
    }));

  }
}

async function perbaruiMasaAktifDiServer() {
  try {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const clearResponse=await fetch(`/admin/webpage/update-visit`, {
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
    }

  } catch (err) {
    console.error("Gagal memperbarui sesi aktif ke server", err);
  }
}

let userAktif = false;

// 1. Kumpulkan semua event interaksi user
['mousemove', 'mousedown', 'click', 'scroll', 'keypress', 'touchstart'].forEach(eventName => {
    document.addEventListener(eventName, () => {
        //console.log('gak afk')
        userAktif = true; 
    }, { passive: true }); // passive: true bagus untuk performa scroll di shared hosting
});

// ============== Autosave =================
setInterval(async () => {
    if (globals.isFormDirty) {
        try {
            document.getElementById('loading-overlay')?.classList.remove('hidden');
            await submitData(true);
            setTimeout(()=>{
              document.getElementById('loading-overlay')?.classList.add('hidden');
            },2000)
        } catch (error) {
            console.error("Autosave gagal");
        }
    }
},0.8 * 60 *1000);

// ============== cek status visit ==================
// setInterval(async () => {
//     try {
//         if (userAktif) {
//             await perbaruiMasaAktifDiServer();
//             userAktif = false;
            
//             console.log("User aktif berinteraksi. Sesi diperpanjang otomatis.");
//         } else {
//             document.getElementById('loading-overlay')?.classList.remove('hidden');
  
//             await cekStatus();
//             setTimeout(()=>{
//               document.getElementById('loading-overlay')?.classList.add('hidden');
//             },2000)
//         }
//     } catch (error) {
//         console.error("Sistem pemantau eror:", error);

//         document.getElementById('loading-overlay')?.classList.add('hidden');
//         window.dispatchEvent(new CustomEvent('notif-pesan', { 
//             detail: { pesan: `Gagal cek status.${error}`, status: false } 
//         }));
//     }
// }, 0.2 * 60 * 1000);

const btnSave = getEl('btn-save')
btnSave.addEventListener('click', async function() {
  document.getElementById('loading-overlay')?.classList.remove('hidden');
  submitData();
});

const btnCek = getEl('btn-cek')

bs.fontStylingField()
bs.widthHeightField()
bs.borderField()
bs.paddingMarginField()
bs.colorBackgroundField()
bs.flexPosition()
bs.setListenerSetImage()
accordionStyling()
modalTypeStyling()