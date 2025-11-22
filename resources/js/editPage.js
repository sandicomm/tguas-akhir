// ======== FLOWBITE COMPONENTS =========
import { Accordion, Carousel, Modal, initFlowbite } from 'flowbite';

// ======== GLOBALS =========
import { globals } from './page/globals.js';

// ======== UTILITIES =========
import { dropdownInitialized } from './page/utils/dropdownInit.js';
// import { CheckData } from './page/utils/checkLimitData.js';

// ======== STYLING =========
import * as bs from './page/styling/baseStyling.js';
import { updateStylingControls } from './page/styling/stylingControls.js';

// ======== COMPONENTS =========
import { 
  accordionStyling, 
  createItemAccordion, 
  createAccordion, 
  createDropdownHeadAccordion, 
  createDropdownSectionAccordion, 
  createBodyDropdownAccordion, 
  addAccordion,
  copyAccordion,
  copyHeadAccordion
} from './page/accordion.js';

import { 
  createCarousel, 
  createDropdownCarousel, 
  addCarousel, 
  copyItemCarousel, 
  setImageItem, 
  addItemCarousel, 
  addTextCarousel, 
  btnHideNext, 
  btnTextPosition,
  copyCarousel 
} from './page/carousel.js';

import { modalTypeStyling, createBtnModal, createBodyModal, createDropdownModal, addModal, copyModal } from './page/modal.js';

import { createField, createDropdownField, addField,copyField } from './page/field.js';
import { createVideo, createDropdownVideo, addVideo,copyVideo } from './page/video.js';
import { createSection, createSectionFooter, createSectionAccordion, addSection,copySection } from './page/section.js';
import { createBtnProlog } from './page/prolog.js';

// ======== COPY HANDLERS =========
import { getTargetElement,handleElementAction } from './page/downUpDelete/action.js'

// ======== updateContent ========
import { updateActionProperty } from './page/utils/updateContent.js'

// ======== GLOBAL VARIABLE ASSIGNMENT =========
let webpageDb = globals.webpageDb,
  param = globals.param,
  webpageDbRaw = globals.webpageDbRaw,
  webpageDbParentSection = globals.webpageDbParentSection,
  editorFieldSelect = globals.editorFieldSelect,
  carouselSelect = globals.carouselSelect,
  accordionSelect = globals.accordionSelect,
  savedSelection= globals.savedSelection

document.addEventListener('DOMContentLoaded', function(){
  webpageDbRaw = JSON.parse(JSON.stringify(webpageJs));
  globals.webpageDbRaw = webpageDbRaw
  param = JSON.parse(JSON.stringify(paramJs))
  globals.param = param

  webpageDb = webpageDbRaw.filter(page => page.type !== 'parent-section')
  globals.webpageDb = webpageDb

  webpageDbParentSection = webpageDbRaw.filter(page => page.type == 'parent-section')
  globals.webpageDbParentSection = webpageDbParentSection

  console.log(webpageDb, globals)
  // console.log(param, paramJs)
  let btnSwap = document.getElementById('btn-page-swap')
  let btnSwapPage
  let btn1=`flex: 1;padding: 0.25rem;border-right: 1px solid #4b5563;font-size: 0.875rem;font-weight: 700;color: #1f2937;`
  let btn2=`flex: 1;padding: 0.25rem;font-size: 0.875rem;font-weight: 700;color: #1f2937;`
  
  btnSwapPage = `
    <a href="${ param === 'prolog-web' ? btnSwap.dataset.webpage : btnSwap.dataset.prologWeb }" id="btn-to-prolog-webpage" style="${btn1}">
      ${ param === 'prolog-web' ? 'To Webpage' : 'To Prolog Webpage' }
    </a>
    <a href="${ param==='prolog-emodul' ? btnSwap.dataset.webpage : btnSwap.dataset.prologEmodul }" id="btn-to-prolog-emodul" style="${btn2}">
      ${ param === 'prolog-emodul' ? 'To Webpage' : 'To Prolog Emodul' }
    </a>
  `
  let indicatorPage
  if(param === 'prolog-web'){
    indicatorPage = 'Prolog Webpage'
  }else if(param === 'prolog-emodul'){
    indicatorPage = 'Prolog Emodul'
  }else{
    indicatorPage = 'Webpage'
  }


  btnSwap.innerHTML=btnSwapPage        
  document.getElementById('indicator-page').innerHTML=indicatorPage        
  loadWebpage()
})

function setListener(){
  document.querySelectorAll("[id^='webpage-section-']").forEach(section =>{
    section.addEventListener('click', function(event){
      if(event.target.id.startsWith('editor-container-section')){
        editorFieldSelect = section
        globals.editorFieldSelect = section

        accordionSelect =null
        globals.accordionSelect = null

        carouselSelect = null
        globals.carouselSelect = null
        console.log(globals.editorFieldSelect)
        updateStylingControls(editorFieldSelect)
      }
    })
  })

  document.querySelectorAll("[id^='field-']").forEach(field =>{
    field.addEventListener('click', function(event){
      event.stopPropagation()
      webpageDb=globals.webpageDb
      editorFieldSelect = field
      globals.editorFieldSelect = editorFieldSelect

      accordionSelect =null
      globals.accordionSelect =null
      
      carouselSelect = null
      globals.carouselSelect = null
      
      // console.log('field change: ', editorFieldSelect, event.target.closest('font') ?? event.target.innerHTML)
      webpageDb.forEach(item=>{
        if(item.id === field.id){
          item.action= updateActionProperty(item.action, 'update')
          item.content = field.innerHTML
          // console.log(item.content)
          return
        }
      })
      globals.webpageDb = webpageDb
      // console.log('editorFieldSelect: ',event.target, editorFieldSelect)
      updateStylingControls(editorFieldSelect ,event.target);
    })
    field.addEventListener('keyup', function (){
      webpageDb.forEach(item=>{
        if(item.id === field.id){
          item.action= updateActionProperty(item.action, 'update')
          item.content = field.innerHTML
          // console.log(item.content)
          return
        }
      })
      globals.webpageDb = webpageDb
    })
  })

  document.querySelectorAll("[id^='video-']").forEach(fieldVideo => {
    fieldVideo.addEventListener('click', function(e){
      editorFieldSelect = fieldVideo
      globals.editorFieldSelect = editorFieldSelect

      accordionSelect = null
      globals.accordionSelect = null

      carouselSelect = null
      globals.carouselSelect = null
      updateStylingControls(fieldVideo, "video")
    })
  })

  document.querySelectorAll('[id^="btn-modal-"]').forEach(btnModal =>{
    btnModal.addEventListener('click', function(){
      editorFieldSelect = btnModal
      globals.editorFieldSelect = editorFieldSelect

      accordionSelect =null
      globals.accordionSelect =null

      carouselSelect = null
      globals.carouselSelect = null
      updateStylingControls(editorFieldSelect)
      // console.log('btn modal event listener', btnModal)
    })
  })

  document.querySelectorAll('[id^="parent-modal-"]').forEach(bodyModal =>{
    bodyModal.addEventListener('click', function(e){
      if(!e.target.id.startsWith('btn-footer')){
        editorFieldSelect = bodyModal
        globals.editorFieldSelect = bodyModal

        carouselSelect = null
        globals.carouselSelect = null

        updateStylingControls(editorFieldSelect)
        // console.log('parent modal', editorFieldSelect, accordionSelect)
      }
    })
  })

  document.querySelectorAll('[id^="carousel-"]').forEach(carouselElement =>{
    carouselElement.addEventListener('click', function(e){
      carouselSelect = carouselElement
      globals.carouselSelect = carouselElement

      editorFieldSelect=null
      globals.editorFieldSelect=null

      accordionSelect =null
      globals.accordionSelect =null
      console.log('carousel:', globals.carouselSelect)
      updateStylingControls(carouselElement)
    })
  })

  document.querySelectorAll('input[type="file"][accept^="video"]').forEach(input => {
    input.addEventListener('change', function (e) {
      const file = e.target.files[0];
      webpageDb=globals.webpageDb
      if (file && file.type.startsWith('video/')) {
        const labelId = `label-${e.target.id}`; // contoh: input-video-1-2 → label-input-video-1-2
        const label = document.getElementById(labelId);
        
        // console.log(`${e.target.id}: `, labelId, label)
        // Buat elemen video
        const video = document.createElement('video');
        video.controls = true;
        // video.className = 'object-contain'; // sesuaikan styling jika perlu
        video.src = URL.createObjectURL(file);

        // Hapus isi label lama (misal SVG)
        label.innerHTML = '';
        label.appendChild(video);

        const randomKey = Math.random().toString(36).substring(2, 8);
        const safeName = file.name.replace(/\s+/g, '_'); // hindari spasi
        const uniqueKey = `__temp_media_${randomKey}_${safeName}__`;

        webpageDb.map(page=>{
          if(page.id === e.target.id.split('-').slice(1).join('-')){
            page.content = uniqueKey,
            page.action = updateActionProperty(page.action,'update')
          }
        })

        webpageDb.push({
          id:uniqueKey,
          type:'file',
          file:file,
          action:'new-add'
        })

        globals.webpageDb=webpageDb
        console.log(webpageDb)
      }
    });
  });

  document.querySelectorAll("[id^='btn-heading-accordion']").forEach(headAccordion => {
    headAccordion.addEventListener('click', function(event) {
      // cari elemen terdekat yang punya id prefix "btn-heading-accordion"
      const btn = event.target.closest("[id^='btn-heading-accordion']");
      if (!btn) return; // kalau klik di luar area

      const idParts = btn.id.split('-');
      editorFieldSelect = btn;
      globals.editorFieldSelect = btn;

      carouselSelect = null;
      globals.carouselSelect = null;

      accordionSelect = document.getElementById(idParts.slice(2, -1).join('-'));
      globals.accordionSelect = accordionSelect
      // console.log('accordion heading clicked: ', editorFieldSelect, accordionSelect);
      updateStylingControls(editorFieldSelect);
    });
  });

  document.querySelectorAll("[id^='section-accordion-']").forEach(bodyAccordion => {
    bodyAccordion.addEventListener('click', function(event){
      event.stopPropagation()
      const idParts = bodyAccordion.id.split('-')
      console.log('body click', event.target.id)
      if(event.target.id.startsWith('section-accordion-') || event.target.id.startsWith('wrapper-section-')){
        editorFieldSelect = bodyAccordion
        globals.editorFieldSelect = bodyAccordion

        carouselSelect = null
        globals.carouselSelect = null

        accordionSelect = document.getElementById(idParts.slice(1,-2).join('-'))
        globals.accordionSelect = document.getElementById(idParts.slice(1,-2).join('-'))
        console.log('accordion body clicked: ',editorFieldSelect, accordionSelect, event.target);
        updateStylingControls(editorFieldSelect)
      }
    })
  })

  document.querySelectorAll('[id^="field-"]').forEach(field =>{
    field.addEventListener('mouseup', ()=>{
      const sel = window.getSelection();
      if (sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        savedSelection = range.cloneRange();
        globals.savedSelection = range.cloneRange();
      }
    })
  })

  document.getElementById('heading-text').addEventListener('click', (event) => {
    updateStylingControls(document.getElementById('heading-text') ,event.target)
  })

  document.getElementById('heading-text').addEventListener('mouseup', () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      savedSelection = range.cloneRange();
      globals.savedSelection = range.cloneRange();
    }
  })

  // videoStyling()
}

// ======================== INITIALIZED =======================
function loadWebpage(){
  const webpageNotFooter = webpageDb.filter(file => !file.id.includes('footer'))
  if(webpageNotFooter.length == 0){
    let idPrefix = `section-1`
    if(param.includes('prolog-web')){
      idPrefix = `section-prolog-web-1`
    }else if(param.includes('prolog-emodul')){
      idPrefix = `section-prolog-emodul-1`
    }

    const webpage = document.getElementById('webpage')
    webpage.insertAdjacentHTML('beforeend', createSection(idPrefix, '', 0,0, 'min-height:100dvh;position:relative;justify-content:start;align-items:center;'))
    webpage.dataset.elementCount = 1

    //====================== FOOTER =========================
    let sectionsFooter = webpageDb
      .filter(page => page.type === "section" && page.id.includes('footer'))

    // 2. Loop per section
    sectionsFooter.forEach(section => {
      let idPrefix = section.id.split('-').slice(1).join('-');

      // Cetak section
      webpage.insertAdjacentHTML(
        'beforeend',
        createSectionFooter(idPrefix, section.element_order, section.element_count, section.style)
      );

      let childElements = webpageDb.filter(page => {
        return page.type !== "section" && page.id.includes('footer');
      });

      childElements.sort((a, b) => a.element_order - b.element_order);
      childElements.forEach(page => {
        let sectionAppend = document.querySelector(`#webpage-section-footer`);

        const editorContainer = sectionAppend.querySelector('[id^="editor-container-"]');
        editorContainer.insertAdjacentHTML('beforeend', createField(page));
        sectionAppend.insertAdjacentHTML('afterend', createDropdownField(page.id));
          
      })
    });

    if(param.includes('prolog-web')){
      webpageDb.push({
          id: 'webpage-section-prolog-web-1',
          type: 'section',
          style: 'min-height:100dvh;position:relative;',
          element_order: '1',
          element_count: '0'
      })
      globals.webpageDb=webpageDb
    }else if(param.includes('prolog-emodul')){
      webpageDb.push({
          id: 'webpage-section-prolog-emodul-1',
          type: 'section',
          style: 'min-height:100dvh;position:relative;',
          element_order: '1',
          element_count: '0'
      })
      globals.webpageDb=webpageDb
    }else{
      webpageDb.push({
          id: 'webpage-section-1',
          type: 'section',
          style: 'min-height:100dvh;position:relative;',
          element_order: '1',
          element_count: '0'
      })
      globals.webpageDb=webpageDb
    }

  }else{
    const webpage = document.getElementById('webpage')

    function getSectionNumber(id) {
      return parseInt(id.split('-').find(part => !isNaN(part)), 10) || Infinity;
    }

    function countNumbers(id) {
      return id.split('-').filter(part => !isNaN(part) && part.trim() !== '').length;
    }

    function arraySubsequenceMatch(parts, targetParts) {
      for (let i = 0; i <= parts.length - targetParts.length; i++) {
        let match = true;

        for (let j = 0; j < targetParts.length; j++) {
          if (parts[i + j] !== targetParts[j]) {
            match = false;
            break;
          }
        }

        if (match) return true;
      }

      return false;
    }

    // 1. Ambil semua section dan sort berdasarkan element_order
    let sections = webpageDb
      .filter(page => page.type === "section" && !page.id.includes('footer'))
      .sort((a, b) => a.element_order - b.element_order);

    let webpageHasPrinted=[]
    // 2. Loop per section
    sections.forEach(section => {
      let idPrefix = section.id.split('-').slice(1).join('-');
      const borderWave = webpageDb.filter(page => page.type === 'border-wave' && arraySubsequenceMatch(page.id.split('-'), idPrefix.split('-')))

      // Cetak section
      if(!webpageHasPrinted.includes(section.id)){
        webpage.insertAdjacentHTML(
          'beforeend',
          createSection(idPrefix, borderWave, section.element_order, section.element_count, section.style)
        );
        webpageHasPrinted.push(section.id)
      }
      
      // Update element count
      webpage.dataset.elementCount = webpageDbParentSection
        .filter(p => p.type === 'parent-section')[0]?.element_count ?? 0;

      // 3. Cari elemen lain yang belong ke section ini
      let sectionNum = getSectionNumber(section.id);
      let childElements = webpageDb.filter(page => {
        return page.type !== "section" && getSectionNumber(page.id) === sectionNum && countNumbers(page.id) == 2;
      });

      function appendTo(selector, html, container=document) {
        const el = container.querySelector(selector);
        if(el) el.insertAdjacentHTML('beforeend', html);    
      }

      function renderAccordion(accordionEl, editorContainer, indicator) {
        const id = accordionEl.id;
        // console.log('accordion:', editorContainer)
        // buat accordion + dropdown body
        if(accordionEl.id.startsWith('accordion-in-accordion') && !webpageHasPrinted.includes(accordionEl.id)){
          // console.log(id ,webpageHasPrinted)
          console.log(`#wrapper-section-${id.split('-').slice(2,-1).join('-')}`)
          editorContainer.querySelector(`#wrapper-section-${id.split('-').slice(2,-1).join('-')}`).insertAdjacentHTML('beforeend', createAccordion(accordionEl));
          webpageHasPrinted.push(accordionEl.id)
        }else if(!webpageHasPrinted.includes(accordionEl.id)){
          // console.log(accordionEl.id)
          editorContainer.insertAdjacentHTML('beforeend', createAccordion(accordionEl));
          webpageHasPrinted.push(accordionEl.id)
        }
        editorContainer.insertAdjacentHTML('afterend', createBodyDropdownAccordion(id, id.split('-')));

        // group children sekali saja
        const grouped = {
          head: [],
          section: [],
          field: [],
          nestedAccordion: [],
          other: []
        };
        let accordionLengthId = countNumbers(id)
        const targetParts = id.split("-");
        webpageDb.forEach(el => {
          const elParts = el.id.split("-");
          // skip jika tidak cocok
          if (!arraySubsequenceMatch(elParts, targetParts)) return;

          const isNested = id.startsWith("accordion-in-accordion");
          const isNestedEl = el.id.includes("accordion-in-accordion");
          // console.log('uhuy:', {levelHead,levelSection,levelField})

          if (el.id.startsWith("btn-heading") && countNumbers(el.id) == accordionLengthId+1) {
            if (isNested === isNestedEl) grouped.head.push(el);
          } else if (el.id.startsWith("section-accordion") && countNumbers(el.id) == accordionLengthId+2) {
            if (isNested === isNestedEl) grouped.section.push(el);
          } else if (!el.id.startsWith("btn-heading") && !el.id.startsWith("section-accordion") && (accordionEl.id !== el.id) && countNumbers(el.id) == accordionLengthId+3) {
            grouped.field.push(el);
          }
        });

        // render head
        console.log(id,grouped,webpageHasPrinted)
        grouped.head.sort((a, b) => a.element_order - b.element_order)
          .forEach(head => {
            if(!webpageHasPrinted.includes(head.id)){
              appendTo(`#parent-${id}`, createItemAccordion(head.id.split('-').slice(2).join('-'), head, accordionEl));
              editorContainer.insertAdjacentHTML('afterend', createDropdownHeadAccordion(head.id.split('-').slice(2).join('-')));
              webpageHasPrinted.push(head.id)
              console.log('print:', head.id, 'di:', `#parent-${id}`)
            }
          });

        // render section
        grouped.section.sort((a, b) => a.element_order - b.element_order)
          .forEach(section => {
            if(!webpageHasPrinted.includes(section.id)){
              appendTo(`#body-${section.id.split('-').slice(1,-1).join('-')}`, createSectionAccordion(section));
              editorContainer.insertAdjacentHTML('afterend', createDropdownSectionAccordion(section.id, section.id.split('-')));
              webpageHasPrinted.push(section.id)
            }
          });

        // render field
        grouped.field.sort((a,b)=>a.element_order-b.element_order).forEach(field=>{
          let html, dropdown;
          switch (field.type) {
            case 'button-modal':
              if(!webpageHasPrinted.includes(field.id)){
                html = createBtnModal(field);
                dropdown = createDropdownModal(field.id);
                appendTo(`#wrapper-section-${field.id.split('-').slice(1,-1).join('-')}`, html);
                webpageHasPrinted.push(field.id)
              }
              break;
            case 'body-modal':
              if(!webpageHasPrinted.includes(field.id)){
                const fieldHead = webpageDb.find(page => page.id == `field-head-${field.id.split('-').slice(1).join('-')}`)
                console.log(fieldHead, `field-head-${field.id.split('-').slice(1).join('-')}`, webpageDb)
                document.getElementById(`webpage-section-${sectionNum}`).insertAdjacentHTML('beforeend', createBodyModal(field, fieldHead))
                document.getElementById(`webpage-section-${sectionNum}`).insertAdjacentHTML('beforeend', createDropdownModal(field.id))
                document.getElementById(`webpage-section-${sectionNum}`).insertAdjacentHTML('beforeend', createDropdownModal(field.id))

                let sectionAppend = document.querySelector(`#webpage-section-${sectionNum}`);
  
                const editorContainer = sectionAppend.querySelector('[id^="editor-container-"]');

                let fieldModal
                fieldModal = webpageDb.filter(data => {
                  const id = field.id.split('-').slice(1).join('-')
                  if(arraySubsequenceMatch(data.id.split('-'), id.split('-')) && countNumbers(data.id) == countNumbers(field.id)+1){
                    // console.log('cetak:', data, field)
                    return data
                  }
                })

                fieldModal.sort((a, b) => a.element_order - b.element_order);

                fieldModal.forEach(modalField=>{
                  const renderer = renderers[modalField.type];
                  renderer(modalField, sectionAppend, editorContainer)
                })
                webpageHasPrinted.push(field.id)
              }
              break;
            case 'video':
              if(!field.id.includes('modal') && !webpageHasPrinted.includes(field.id)){
                html = createVideo(field);
                dropdown = createDropdownVideo(field.id);
                appendTo(`#wrapper-section-${field.id.split('-').slice(1,-1).join('-')}`, html);
                webpageHasPrinted.push(field.id)
              }
              break;
            case 'field':
              if(!field.id.includes('modal') && !webpageHasPrinted.includes(field.id)){
                html = createField(field);
                dropdown = createDropdownField(field.id);
                appendTo(`#wrapper-section-${field.id.split('-').slice(1,-1).join('-')}`, html);
                webpageHasPrinted.push(field.id)
                // console.log('di print:', field.id, id, editorContainer)
              }
              break;
            case 'carousel':
              if(!webpageHasPrinted.includes(field.id)){
                html = createCarousel(field, webpageDb, editorContainer)
                dropdown = createDropdownCarousel(field.id, field.id.split('-'))
                appendTo(`#wrapper-section-${field.id.split('-').slice(1,-1).join('-')}`, html)
                webpageHasPrinted.push(field.id)
              }
              break;
            case 'accordion':
              renderAccordion(field,editorContainer, 'two');
              break;
          }

          if (dropdown) editorContainer.insertAdjacentHTML('afterend', dropdown);
        });

        // init accordion
        setTimeout(() => {
          try {
            const accordionElement = document.getElementById(id);
            if (accordionElement) {
              new Accordion(accordionElement, {
                alwaysOpen: false,
                activeClasses: 'bg-gray-100 text-gray-900',
                inactiveClasses: 'text-gray-500'
              });
              // console.log('✅ Accordion berhasil diinisialisasi:', id);
            }
            initFlowbite();
          } catch (error) {
            console.error('❌ Gagal inisialisasi accordion', error);
          }
        }, 100);
      }

      const renderers = {
        field(page, sectionAppend) {
          let element, dropdown;
          if (page.id.startsWith('field-modal-') && !webpageHasPrinted.includes(page.id)) {
            console.log(page.id)
            element = createField(page);
            dropdown = createDropdownField(page.id);
            appendTo(`#body-${page.id.split('-').slice(1, -1).join('-')}`, element, sectionAppend);
            document.querySelector(`#parent-${page.id.split('-').slice(1,-1).join('-')}`).insertAdjacentHTML('afterbegin', dropdown)
            if(page.id.startsWith('field-accordion')){
              console.log('di print ya:', page.id)
            }

            webpageHasPrinted.push(page.id)
            return true; // stop, biar gak render ulang di bawah
            
          } else if (page.id.startsWith('field-element-') && !webpageHasPrinted.includes(page.id)) {
            element = createField(page);
            dropdown = createDropdownField(page.id);
            webpageHasPrinted.push(page.id)
            if(page.id.startsWith('field-accordion')){
              console.log('di print ya:', page.id)
            }
          }
          return { element, dropdown };
        },

        video(page, sectionAppend) {
          let element, dropdown;
          if (page.id.startsWith('video-modal') && !webpageHasPrinted.includes(page.id)) {
            element = createVideo(page);
            dropdown = createDropdownVideo(page.id);
            appendTo(`#body-${page.id.split('-').slice(1, -1).join('-')}`, element);
            document.querySelector(`#parent-${page.id.split('-').slice(1,-1).join('-')}`).insertAdjacentHTML('afterbegin', dropdown);
            webpageHasPrinted.push(page.id)

            return true
          } else if(page.id.startsWith('video-element') && !webpageHasPrinted.includes(page.id)) {
            element = createVideo(page);
            dropdown = createDropdownVideo(page.id);
            webpageHasPrinted.push(page.id)
          }
          return { element, dropdown };
        },

        'button-modal'(page) {
          if (!page.id.startsWith('modal-accordion') && !webpageHasPrinted.includes(page.id) ) {
            console.log(page.id)
            webpageHasPrinted.push(page.id)
            return {
              element: createBtnModal(page),
              dropdown: createDropdownModal(page.id)
            }
          }
          return null;
        },

        'btn-prolog'(page) {
          if (!page.id.startsWith('modal-accordion') && !webpageHasPrinted.includes(page.id)) {
            webpageHasPrinted.push(page.id)
            return {
              element: createBtnProlog(page),
            }
          }
          return null; // kasus "modal-accordion" di-handle dalam renderAccordion
        },

        'body-modal'(page, sectionAppend, editorContainer) {
          if(!webpageHasPrinted.includes(page.id)){
            const fieldHead = webpageDb.find(field => field.id === `field-head-${page.id.split('-').slice(1).join('-')}`)
            sectionAppend.insertAdjacentHTML('beforeend', createBodyModal(page, fieldHead))
            sectionAppend.insertAdjacentHTML('beforeend', createDropdownModal(page.id))

            let fieldModal
            fieldModal = webpageDb.filter(data => {
              const id=page.id.split('-').slice(1).join('-')
              if(arraySubsequenceMatch(data.id.split('-'), id.split('-')) && countNumbers(data.id) == countNumbers(page.id)+1){
                // console.log('cetak:', data, field)
                return data
              }
            })

            fieldModal.sort((a, b) => a.element_order - b.element_order);

            fieldModal.forEach(modalField=>{
              const renderer = renderers[modalField.type];
              renderer(modalField, sectionAppend, editorContainer)
            })

            webpageHasPrinted.push(page.id)
            // console.log('modal:', fieldHead)
            return true;
          }
        },

        accordion(page, sectionAppend, editorContainer) {
          // langsung delegasikan ke renderer accordion khusus (yang refactor panjang kemarin)
          if(!page.id.startsWith('accordion-in-accordion') && !webpageHasPrinted.includes(page.id)){
            renderAccordion(page, editorContainer, 'first');
          }
          return true;
        },

        carousel(page, sectionAppend, editorContainer, childElements){
          const id = page.id;

          // buat accordion + dropdown body
          if(!id.startsWith('carousel-accordion') && !webpageHasPrinted.includes(page.id)){
            let fieldCarousel = childElements.filter(elemen => arraySubsequenceMatch(elemen.id.split('-'), page.id.split('-')))
            editorContainer.insertAdjacentHTML('beforeend', createCarousel(page,fieldCarousel,editorContainer));
            editorContainer.insertAdjacentHTML('afterend', createDropdownCarousel(id, id.split('-')));
            webpageHasPrinted.push(page.id)
          }
          return true
        }
      };

      childElements.sort((a, b) => {
        // kalau a.btn-prolog dan b bukan → a taruh di bawah
        if (a.type === "btn-prolog" && b.type !== "btn-prolog") return 1;
        // kalau b.btn-prolog dan a bukan → b taruh di bawah
        if (b.type === "btn-prolog" && a.type !== "btn-prolog") return -1;

        // kalau dua-duanya sama (sama-sama btn-prolog atau sama-sama bukan)
        // urutkan berdasarkan element_order biasa
        return a.element_order - b.element_order;
      });
      console.log(childElements)
      childElements.forEach(page => {
        if(!page.id.includes('footer')){
          let sectionAppend=''
          if(param.includes('prolog-web')){
            sectionAppend = document.querySelector(`#webpage-section-prolog-web-${sectionNum}`);
            
          }else if(param.includes('prolog-emodul')){
            sectionAppend = document.querySelector(`#webpage-section-prolog-emodul-${sectionNum}`);
            
          }else{
            sectionAppend = document.querySelector(`#webpage-section-${sectionNum}`);
  
          }
          const editorContainer = sectionAppend.querySelector('[id^="editor-container-"]');
          
          const renderer = renderers[page.type];
          if (!renderer) return; // skip kalau gak ada handler
  
          const result = renderer(page, sectionAppend, editorContainer, webpageDb);
      
          if (result === true) return; // sudah di-handle sepenuhnya di dalam renderer
          
          if (result && result.element) {
            editorContainer.insertAdjacentHTML('beforeend', result.element);
            if (result.dropdown) sectionAppend.insertAdjacentHTML('beforeend', result.dropdown);
          }
        }
      });
    });

    //====================== FOOTER =========================
      let sectionsFooter = webpageDb
        .filter(page => page.type === "section" && page.id.includes('footer'))

      // 2. Loop per section
      sectionsFooter.forEach(section => {
        let idPrefix = section.id.split('-').slice(1).join('-');

        // Cetak section
        webpage.insertAdjacentHTML(
          'beforeend',
          createSectionFooter(idPrefix, section.element_order, section.element_count, section.style)
        );

        let childElements = webpageDb.filter(page => {
          return page.type !== "section" && page.id.includes('footer');
        });

        childElements.sort((a, b) => a.element_order - b.element_order);
        childElements.forEach(page => {
          let sectionAppend = document.querySelector(`#webpage-section-footer`);

          const editorContainer = sectionAppend.querySelector('[id^="editor-container-"]');
          editorContainer.insertAdjacentHTML('beforeend', createField(page));
          sectionAppend.insertAdjacentHTML('afterend', createDropdownField(page.id));
            
        })
      });
    //=========================================================
      // console.log(webpageHasPrinted.length, webpageNotFooter.length)
      const notPrinted = webpageNotFooter.filter(obj => 
        !webpageHasPrinted.includes(obj.id)
      );

      // console.log(notPrinted);
  }
  setListener()
  const allVideos = document.querySelectorAll('video');
  allVideos.forEach(v => {
    v.addEventListener('error', e => {
      console.warn('⚠️ Gagal load video', v.src, e);
      // fallback
      v.poster = '/images/video-error.png';
    });

    // tunda load kedua jika sudah ada yang sama
    const duplicates = Array.from(allVideos).filter(o => o !== v && o.src === v.src);
    if (duplicates.length) {
      v.preload = 'metadata';
    }
  });
  dropdownInitialized('all')
  setTimeout(() => {
      try {
        initFlowbite();
      } catch (error) {
          console.error('❌ Gagal menginisialisasi Modal:', error);
      }
    }, 100); 
    // console.log('globals after load: ',globals)

}

document.getElementById('default-sidebar').addEventListener('click', function (event) {
  // console.log(event.target)
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
      setListener()
    }
  }

  if (event.target.id.startsWith("add-text-carousel")) {
    addTextCarousel(event)
    setListener()
  }

  if(event.target.id.startsWith("btn-hide-next")){
    btnHideNext(event)
  }

  if(event.target.id.startsWith("btn-text-position") && carouselSelect.dataset.text === 'true'){
    btnTextPosition(event)
    setListener()
  }

  if(event.target.id.startsWith("copy")){
    if(idParts[1] == "item"){
      copyItemCarousel(idParts.slice(1).join('-'))
      setListener()
      console.log(globals.webpageDb)
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
      const confirmDelete = confirm("Apakah kamu yakin ingin menghapus elemen ini?");

      if (confirmDelete) {
        event.target.parentElement.parentElement.parentElement.remove()
        handleElementAction('delete', actualField, actualBodyItem, {
          datasetKey: 'itemOrder',
          reinitFlowbite: true,
          afterMove: () => updateStylingControls(carouselSelect)
        }, idParts);    
      }
    }
  }
})

document.getElementById('webpage').addEventListener('click', function (event) {
  const idParts = event.target.id.split('-')
  const id = event.target.id
  // =================== ADD ELEMENT ==========================

  if (id.startsWith('add-section-')) {
  
    addSection(event)
    setListener()
  }

  if (id.startsWith('add-field-')) {
   
    addField(event)
    setListener();
  }

  if (id.startsWith('add-video-')) {

    addVideo(event)
    setListener();
  }
  
    // ======================== MODAL =========================
  if(id.startsWith('add-modal-')) {

    addModal(event)
    setListener()
  }

  // ======================== ACCORDION ======================
  if(id.startsWith('add-accordion-')) {
   
    addAccordion(event)
    setListener()
  }
  
  // ======================== CAROUSEL ======================
  if(id.startsWith('add-carousel-')) {

    addCarousel(event)
    setListener()
    // console.log(globals.webpageDb)
  }

  if(id.startsWith('copy-')){

    const idParts = event.target.id.split('-')
    
    if(idParts[1] == "field"){
      copyField(idParts)
      setListener();

    }else if(idParts[1] == "video"){
      copyVideo(idParts)
      setListener();

    }else if(idParts[1] == "modal"){
      copyModal(idParts.slice(1).join('-'))
      setListener()

    }else if(idParts[1] == "accordion"){
      copyAccordion(idParts.slice(1).join('-'))
      setListener()

    }else if(idParts[1] == "head"){
      copyHeadAccordion(idParts.slice(2).join('-'))
      setListener()

    }else if(idParts[1] == "section"){
      copySection(idParts.slice(1).join('-'), 'all', event)
      setListener()
      
    }else if(idParts[1] == "carousel"){
      copyCarousel(idParts.slice(1).join('-'))
      setListener()
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
      let section = bodyElement.querySelectorAll("[id^='webpage-section-']");
      let sectionNotFooter = Array.from(section).filter(sec => !sec.id.includes('footer'));
      
      if (sectionNotFooter.length > 1) {
        sectionDelete=true
      }else{
        sectionDelete=false
        alert("section tidak boleh terhapus semua")
      }
    }

    if(sectionDelete){
      const confirmDelete = confirm("Apakah kamu yakin ingin menghapus elemen ini?");
      if (confirmDelete) {
        handleElementAction('delete', fieldElement, bodyElement, {
          datasetKey: 'elementOrder'
        }, idParts);
        event.target.parentElement.parentElement.parentElement.remove()
      }
    }
  }
}

});

document.getElementById('btn-save').addEventListener('click', async function() {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  document.getElementById('loading-overlay').style.display = 'flex';

  let mergedDb = [...globals.webpageDbParentSection, ...globals.webpageDb]
        .filter(item => item.action);

  let fileDb=mergedDb.filter(item => item.type === 'file')
  let noFileDb=mergedDb.filter(item => item.type !== 'file')
  console.log('pemisahan:', fileDb, noFileDb)

  // Helper: chunk data
  const chunk = (arr, size) => {
      const out = [];
      for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
      return out;
  };

   // Helper: kirim batch ke server
  const sendBatch = async (batch, indexLabel, url, extraFields = false) => {
      const form = new FormData();

      batch.forEach((item, idx) => {
          form.append(`items[${idx}][id]`, item.id);
          form.append(`items[${idx}][type]`, item.type);
          form.append(`items[${idx}][action]`, item.action ?? '');

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

      console.log(`🚀 Mengirim ${indexLabel}`);

      let raw = "";
      try {
          const response = await fetch(url, {
              method: "POST",
              headers: {
                  "Accept": "application/json",
                  "X-CSRF-TOKEN": csrfToken
              },
              body: form
          });

          raw = await response.text();
          let data = JSON.parse(raw);

          if (!data.success) throw data;

          console.log(`✅ ${indexLabel} sukses`, data.message);

      } catch (err) {
          console.error(`❌ Error pada ${indexLabel}`, err, "RAW:", raw);
          alert(`Gagal menyimpan ${indexLabel}. Cek console.`);

          throw new Error(
              `${err.message || "Unknown Error"}\n\n` +
              `File: ${err.file}\n` +
              `Line: ${err.line}\n\n` +
              `Trace:\n${err.trace}`
          );
      }
  };

  // =============================
  // 1️⃣  Kirim FILE dalam batch kecil
  // =============================
  const fileChunks = chunk(fileDb, 15); // max 15 file
  console.log(`📦 File batch count = ${fileChunks.length}`);

  for (let i = 0; i < fileChunks.length; i++) {
      await sendBatch(
          fileChunks[i],
          `batch file ${i + 1}/${fileChunks.length}`,
          "http://127.0.0.1:8000/webpage/store",
          false
      );
  }

  // =============================
  // 2️⃣  Kirim NON-FILE dalam batch besar
  // =============================
  const nonFile = [
      ...noFileDb.filter(x => x.action?.includes("delete")),
      ...noFileDb.filter(x => !x.action?.includes("delete"))
  ];

  console.log('final no file db:', nonFile)

  const nonFileChunks = chunk(nonFile, 100);
  console.log(`📦 Non-file batch count = ${nonFileChunks.length}`);

  for (let i = 0; i < nonFileChunks.length; i++) {
      await sendBatch(
          nonFileChunks[i],
          `batch data ${i + 1}/${nonFileChunks.length}`,
          "http://127.0.0.1:8000/webpage/store",
          true
      );
  }

  document.getElementById('loading-overlay').style.display = 'none';
  alert('✅ Semua data berhasil disimpan.');
});

document.getElementById('btn-cek').addEventListener('click', function(){
  let mergeDb = [...globals.webpageDb, ...globals.webpageDbParentSection]
  let cleanWebpage = mergeDb.filter(item => item.action)
  console.log('webpage:',globals.webpageDb, 'parent:',globals.webpageDbParentSection, 'clean:',cleanWebpage)
})

bs.fontStylingField()
bs.widthHeightField()
bs.borderField()
bs.paddingMarginField()
bs.colorBackgroundField()
bs.borderWave()
bs.flexPosition()
setListener()
accordionStyling()
modalTypeStyling()