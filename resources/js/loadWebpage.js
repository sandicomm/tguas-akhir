// ======== FLOWBITE COMPONENTS =========
import { initFlowbite } from 'flowbite';

// ======== GLOBALS =========
import { globals } from './page/globals.js';

import { dropdownInitialized } from './page/utils/dropdownInit.js';

// ======== COMPONENTS =========
import { 
  createItemAccordion, 
  createAccordion, 
  createDropdownHeadAccordion, 
  createDropdownSectionAccordion, 
  createBodyDropdownAccordion, 
} from './page/accordion.js';

import { 
  createCarousel, 
  createDropdownCarousel, 
} from './page/carousel.js';

import { createBtnModal, createBodyModal, createDropdownModal } from './page/modal.js';

import { createField, createDropdownField } from './page/field.js';
import { createSection, createSectionFooter, createSectionAccordion} from './page/section.js';
import { createBtnProlog } from './page/prolog.js';

import {arraySubsequenceMatch} from './page/utils/elementNumberingId.js'

// ======== Validation get element ==========
import { getEl } from './page/utils/validationGetElement.js';

// ======== GLOBAL VARIABLE ASSIGNMENT =========
let webpageDb = globals.webpageDb,
  param = globals.param,
  webpageDbRaw = globals.webpageDbRaw,
  webpageDbParentSection = globals.webpageDbParentSection

const originalSizes = globals.originalSizes;

export function initWebpage(edit) {
  document.getElementById('loading-overlay')?.classList.remove('hidden');

  webpageDbRaw = JSON.parse(JSON.stringify(webpageJs));
  globals.webpageDbRaw = webpageDbRaw
  
  webpageDb = webpageDbRaw.filter(page => page.type !== 'parent-section')
  globals.webpageDb = webpageDb

  webpageDbParentSection = webpageDbRaw.filter(page => page.type == 'parent-section')
  globals.webpageDbParentSection = webpageDbParentSection

  const typePage = window.typePage; //variabel global dari blade

  // cetak elemen interaktif
  if(typePage == 'image' || typePage == 'video'){
    // jika ke halaman poster/video
    loadWebpage(edit, true)

  }else{
    param = JSON.parse(JSON.stringify(paramJs))
    globals.param = param

    let indicatorPage

    if(param === 'prolog'){
      indicatorPage = 'Prolog Webpage'
    } 

    // tunggu browser selesai load yang lain dlu baru cetak elemen
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        loadWebpage(edit)
        document.getElementById('loading-overlay')?.classList.add('hidden');
      });
    });
  }
}

//=========== RESIZE FONT ==================
const FONT_SIZE_MAP = {
  1: "x-small",
  2: "small",
  3: "medium",
  4: "large",
  5: "x-large",
  6: "xx-large",
  7: "xxx-large",
};

const FONT_SIZE_REVERSE_MAP = {
  "x-small": 1,
  "small": 2,
  "medium": 3,
  "large": 4,
  "x-large": 5,
  "xx-large": 6,
  "xxx-large": 7,
};

function normalizeFontSizeToNumber(value) {
  if (!value) return null;

  // pembatasan nilai jika angka
  if (!isNaN(value)) {
    return Math.min(7, Math.max(1, parseInt(value)));
  }

  value = value.toLowerCase();

  if (FONT_SIZE_REVERSE_MAP[value]) {
    return FONT_SIZE_REVERSE_MAP[value];
  }

  // px / rem / em → kira-kira
  if (value.endsWith("px")) {
    const px = parseFloat(value);
    if (px >= 32) return 7;
    if (px >= 28) return 6;
    if (px >= 24) return 5;
    if (px >= 18) return 4;
    if (px >= 14) return 3;
    if (px >= 12) return 2;
    return 1;
  }

  return null;
}

let originalCaptured = false;

export function storeOriginalSize() {
  document.querySelectorAll('[id]:not([id=""])[style]').forEach(el => {
    if ((!el.id || !el.style.width || el.id === 'webpage') && !el.id.startsWith('field') && !el.id.startsWith('btn-heading')) return;
    //console.log(el.id)
    if(originalSizes[el.id]) return

    if (!originalSizes[el.id]) {
      originalSizes[el.id] = {};
    }

    const ori = originalSizes[el.id];

    // ------------ simpan ukuran elemen ------------
    if (!ori.width) ori.width = el.style.width || "";
    if (!ori.height) ori.height = el.style.height || "";

    // ------------ simpan ukuran font ----------
    const fontEl = el.querySelector("font");
    if (fontEl && !ori.fontSize) {
      const size = normalizeFontSizeToNumber(fontEl.getAttribute("size"));
      if (size) {
        ori.fontSize = { value: size };
        return;
      }
    }

    const styledEl = el.querySelector("[style*='font-size']");
    if (styledEl && !ori.fontSize) {
      const size = normalizeFontSizeToNumber(styledEl.style.fontSize);
      if (size) {
        ori.fontSize = { value: size };
      }
    }
  })

  originalCaptured =true
}

function restoreOriginalSize(el) {
  if (!el.id) return;
  const ori = originalSizes[el.id];
  if (!ori) return;

  // ------ set ukuran elemen ----------
  el.style.width = ori.width;
  el.style.height = ori.height;

  //----- set ukuran font ---------
  if (!ori.fontSize) return;

  const sizeNum = ori.fontSize.value;
  const cssSize = FONT_SIZE_MAP[sizeNum];

  const fontEl = el.querySelector("font");
  if (fontEl) {
    fontEl.setAttribute("size", sizeNum);
    return;
  }

  const styledEl = el.querySelector("[style*='font-size']");
  if (styledEl) {
    styledEl.style.fontSize = cssSize;
    return;
  }

  el.style.fontSize = cssSize;
}

export function findParentWidth(el) {
  let element
  if(!el.id.startsWith('accordion-element') && el.id.includes('accordion')){
    if(el.id.startsWith('btn-modal') || el.id.startsWith('accordion-in-accordion')){
      element=getEl(`section-${el.id.split('-').slice(2,-1).join('-')}`)
      //console.log('id parent: ', `section-${el.id.split('-').slice(2,-1).join('-')}`)
    }else{
      element=getEl(`section-${el.id.split('-').slice(1,-1).join('-')}`)
      //console.log('id parent: ', `section-${el.id.split('-').slice(1,-1).join('-')}`)
    }
  }else{
    if(el.id.startsWith('btn-modal')){
      element=getEl(`editor-container-${el.id.split('-').slice(3,-1).join('-')}`)
      //console.log('id parent: ', `editor-container-${el.id.split('-').slice(3,-1).join('-')}`)
    }else{
      element=getEl(`editor-container-${el.id.split('-').slice(2,-1).join('-')}`)
      //console.log('id parent: ', `editor-container-${el.id.split('-').slice(2,-1).join('-')}`)
    }
  }

  //const check = findParentWidth(el);
  //console.log('parent:',el, element)
  if (!element) return;
  let styling = window.getComputedStyle(element)
  let width = parseInt(element.offsetWidth)

  return {element, width, styling}
}

function applyFontSize(el, newSize) {
  const fontEl = el.querySelector("font");
  const styledEl = el.querySelector("[style*='font-size']");

  // set font size 
 
   // console.log('opop', newSize)
  
  if (fontEl) {
    fontEl.setAttribute("size", newSize);
    if(el.id === 'field-element-section-8-1'){
      //console.log('owo', newSize)
    }
    return;
  }
  
  if (styledEl) {
    styledEl.style.fontSize = FONT_SIZE_MAP[newSize] || "medium";
    if(el.id === 'field-element-section-8-1'){
      //console.log('owi', newSize)
    }
    return;
  }

  if(el.id === 'field-element-section-8-1'){
    //console.log('iwi', newSize, FONT_SIZE_MAP[newSize])
  }
  el.style.fontSize = FONT_SIZE_MAP[newSize] || "medium";
}

function resizeFont(el, windowWidth, value) {
  let currentValue = null;

  const fontEl = el.querySelector("font");
  const styledEl = el.querySelector("[style*='font-size']");

  if (fontEl) {
    currentValue = fontEl.getAttribute("size");
  } else if (styledEl) {
    currentValue = styledEl.style.fontSize;
  }

  // normalisasi ukuran font ke angka
  const numericSize = normalizeFontSizeToNumber(currentValue, el);
  if (!numericSize) return;

  // mobile
  let newSize = numericSize;
  if(el.id === 'field-element-section-8-1'){
    console.log('halo', numericSize, currentValue, el.style)
  }

  if(windowWidth <= 550){
    if (value.fontSize.value == 7) {    
      if(el.id.startsWith('btn-heading')){
        newSize = 5;
      }else{
        newSize = 6;
      }
    }else if(value.fontSize.value == 6){
      newSize = 5;
    }else if(value.fontSize.value == 5){
      newSize = 4;
    }else if(value.fontSize.value == 4){
      newSize = 3;
    }
  }else{
    newSize = value.fontSize.value
  }

  applyFontSize(el, newSize);
  
}

export function resizeElements(edit = false) {
  setTimeout(()=>{
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        //ambil ukuran elemen
        if(!originalCaptured){
          storeOriginalSize()
        }

        if(Object.keys(originalSizes).length === 0){
          setTimeout(()=>{
            storeOriginalSize()
            console.log('tangkap lagi', originalSizes, originalCaptured)
          },500)
        }
  
        console.log('original size:',originalSizes, originalCaptured)
  
        const webpage = document.getElementById('webpage')
        const windowWidth = parseInt(window.innerWidth)
        
        const widthActive = edit ? parseInt(webpage.offsetWidth) : windowWidth
        const isMobile = edit ? parseInt(webpage.offsetWidth) <= 700 : windowWidth <= 700;
        console.log('isMobile:', isMobile, parseInt(webpage.offsetWidth), windowWidth)

        Object.entries(originalSizes).forEach(([key, value]) => {
          if(key.startsWith('dropdown')) return;
          
          const element = document.getElementById(key)
  
          if(!isMobile){
            //console.log('restore')
            restoreOriginalSize(element);
          }
          
          resizeFont(element,widthActive, value);

          // ===== RESIZE FONT =====
          if (element.style.width === "100%") return;
  
          const styleAttr = element.getAttribute("style");
          if (!styleAttr || !styleAttr.includes("width:")) return;
  
          const styleWidth  = parseInt(element.style.width) || null;
          const styleHeight = parseInt(element.style.height) || null;
  
          const parent = findParentWidth(element)
  
          //console.log('parent:', parent.element, parent)
          if (Object.keys(parent).length === 0) return;
          let parentWidth = parseInt(parent.width)
          
          if(key === 'accordion-element-section-10-4'){
            console.log('sesuaikan' ,parseInt(value.width) > parentWidth, value.width, parentWidth, styleWidth)
          }

          if (styleWidth && parseInt(value.width) > parentWidth) {
            element.style.width = (parentWidth - 15) + "px";
            // set height elemen
            const scale = parentWidth / styleWidth;

            if (styleHeight) {
              element.style.height = Math.floor(styleHeight * scale) + "px";
            }
          }else if(parseInt(value.width) < parentWidth){
            restoreOriginalSize(element)
          }
  
          if (element.offsetWidth > parentWidth) {
            element.style.width = (parentWidth - 15) + "px";
          }
        });
      });
    });
  },1000)
} 
 
// Responsive resize elemen
window.addEventListener("resize", ()=>{
  const webpage = document.getElementById('webpage')
  webpage.style.width='100%' 
  resizeElements
});
window.addEventListener("load", ()=>{
  const webpage = document.getElementById('webpage')
  webpage.style.width='100%' 
  resizeElements
});

const indexBySection = {};
const indexById = {};
const webpage = document.getElementById('webpage')

export function loadWebpage(edit=false, justFooter=false){
  if(!edit) initFlowbite()

  const webpageNotFooter = webpageDb.filter(file => !file.id.includes('footer'))

  //================= JIKA TIDAK ADA DATA ======================
  if(webpageNotFooter.length == 0 && edit){
    let idPrefix = `section-1`

    if(param.includes('prolog')){
      idPrefix = `section-prolog-web-1`
    }

    //----------------- SECTION -------------------------
    webpage.insertAdjacentHTML('beforeend', createSection(idPrefix, '', 0,0, 'min-height:100dvh;position:relative;justify-content:start;align-items:center;'))
    webpage.dataset.elementCount = 1

    //----------------- FOOTER -------------------------
    let sectionsFooter = webpageDb
      .filter(page => page.type === "section" && page.id.includes('footer'))

    sectionsFooter.forEach(section => {
      let idPrefix = section.id.split('-').slice(1).join('-');

      // Cetak section footer
      webpage.insertAdjacentHTML(
        'beforeend',
        createSectionFooter(idPrefix, section.element_order, section.element_count, section.style)
      );

      let childElements = webpageDb.filter(page => {
        return page.type !== "section" && page.id.includes('footer');
      });

      // Cetak elemen field
      childElements.sort((a, b) => a.element_order - b.element_order);
      childElements.forEach(page => {
        let sectionAppend = document.querySelector(`#webpage-section-footer`);

        const editorContainer = sectionAppend.querySelector('[id^="editor-container-"]');
        editorContainer.insertAdjacentHTML('beforeend', createField(page));
        sectionAppend.insertAdjacentHTML('afterend', createDropdownField(page.id));
          
      })
    });

    // ------------ PROLOG ---------------
    if(param.includes('prolog')){
      webpageDb.push({
          id: 'webpage-section-prolog-web-1',
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

  // ================= JIKA ADA DATA ========================
  }else{
    webpageDb.forEach(item => {
      indexById[item.id] = item;

      const sectionNum = item.id.split('-').find(p => !isNaN(p));
      if (!sectionNum) return;

      if (!indexBySection[sectionNum]) {
        indexBySection[sectionNum] = [];
      }
      indexBySection[sectionNum].push(item);
    });

    function getSectionNumber(id) {
      return parseInt(id.split('-').find(part => !isNaN(part)), 10) || Infinity;
    }

    function countNumbers(id) {
      return id.split('-').filter(part => !isNaN(part) && part.trim() !== '').length;
    }

    let webpageHasPrinted= new Set()

    if(!justFooter){
      //Ambil semua section dan sort berdasarkan element_order
      let sections = webpageDb
        .filter(page => page.type === "section" && !page.id.includes('footer'))
        .sort((a, b) => a.element_order - b.element_order);
      
      // Loop per section
      let zIndex=999
      sections.forEach(section => {
        let idPrefix = section.id.split('-').slice(1).join('-');
        const borderWave = webpageDb.filter(page => page.type === 'border-wave' && arraySubsequenceMatch(page.id.split('-'), idPrefix.split('-')))
  
        // Cetak section
        if(!webpageHasPrinted.has(section.id)){
          webpage.insertAdjacentHTML(
            'beforeend',
            createSection(idPrefix, borderWave, section.element_order, section.element_count, section.style, edit, zIndex--)
          );
          webpageHasPrinted.add(section.id)
        }
        
        // Update element count
        webpage.dataset.elementCount = webpageDbParentSection
          .filter(p => p.type === 'parent-section')[0]?.element_count ?? 0;
  
        // 3. Cari elemen lain yang belong ke section ini
        let sectionNum = getSectionNumber(section.id);
        let childElements = (indexBySection[sectionNum] || [])
          .filter(p => p.type !== 'section' && countNumbers(p.id) === 2);
  
        function appendTo(selector, html, container=document) {
          const el = container.querySelector(selector);
          if(el) el.insertAdjacentHTML('beforeend', html);    
        }
  
        function renderAccordion(accordionEl, editorContainer, indicator) {
          const id = accordionEl.id;
          // buat accordion + dropdown body
          if(accordionEl.id.startsWith('accordion-in-accordion') && !webpageHasPrinted.has(accordionEl.id)){
            editorContainer.querySelector(`#wrapper-section-${id.split('-').slice(2,-1).join('-')}`).insertAdjacentHTML('beforeend', createAccordion(accordionEl,edit));
            webpageHasPrinted.add(accordionEl.id)
  
          }else if(!webpageHasPrinted.has(accordionEl.id)){
            editorContainer.insertAdjacentHTML('beforeend', createAccordion(accordionEl,edit));
            webpageHasPrinted.add(accordionEl.id)
          }
  
          if(edit) editorContainer.insertAdjacentHTML('afterend', createBodyDropdownAccordion(id, id.split('-')));
  
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
  
            if (el.id.startsWith("btn-heading") && countNumbers(el.id) == accordionLengthId+1) {
              if (isNested === isNestedEl) grouped.head.push(el);
            } else if (el.id.startsWith("section-accordion") && countNumbers(el.id) == accordionLengthId+2) {
              if (isNested === isNestedEl) grouped.section.push(el);
            } else if (!el.id.startsWith("btn-heading") && !el.id.startsWith("section-accordion") && (accordionEl.id !== el.id) && countNumbers(el.id) == accordionLengthId+3) {
              grouped.field.push(el);
            }
          });
  
          // render head
          grouped.head.sort((a, b) => a.element_order - b.element_order)
            .forEach(head => {
              if(!webpageHasPrinted.has(head.id)){
                appendTo(`#parent-${id}`, createItemAccordion(head.id.split('-').slice(2).join('-'), head, accordionEl,edit));
  
                if(edit) editorContainer.insertAdjacentHTML('afterend', createDropdownHeadAccordion(head.id.split('-').slice(2).join('-')));
  
                webpageHasPrinted.add(head.id)
              }
            });
  
          // render section
          grouped.section.sort((a, b) => a.element_order - b.element_order)
            .forEach(section => {
              if(!webpageHasPrinted.has(section.id)){
                appendTo(`#body-${section.id.split('-').slice(1,-1).join('-')}`, createSectionAccordion(section,edit));
                if(edit) editorContainer.insertAdjacentHTML('afterend', createDropdownSectionAccordion(section.id, section.id.split('-')));
                
                webpageHasPrinted.add(section.id)
              }
            });
  
          // render field
          grouped.field.sort((a,b)=>a.element_order-b.element_order).forEach(field=>{
            let html='', dropdown='';
            switch (field.type) {
              case 'button-modal':
                if(!webpageHasPrinted.has(field.id)){
                  html = createBtnModal(field,edit);
                  if(edit) dropdown = createDropdownModal(field.id);
                  
                  appendTo(`#wrapper-section-${field.id.split('-').slice(1,-1).join('-')}`, html);
                  webpageHasPrinted.add(field.id)
                }
                break;
              case 'body-modal':
                if(!webpageHasPrinted.has(field.id)){
                  const fieldHead = webpageDb.find(page => page.id == `field-head-${field.id.split('-').slice(1).join('-')}`)
                  const webpageSection = getEl(`webpage-section-${sectionNum}`)
                  if(!webpageSection) return
                  
                  document.getElementById('modal-body-wrapper').insertAdjacentHTML('beforeend', createBodyModal(field, fieldHead,edit))
  
                  if(edit)webpageSection.insertAdjacentHTML('beforeend', createDropdownModal(field.id))
  
                  let sectionAppend = document.querySelector(`#webpage-section-${sectionNum}`);
                  const editorContainer = sectionAppend.querySelector('[id^="editor-container-"]');
  
                  let fieldModal=''
                  fieldModal = webpageDb.filter(data => {
                    const id = field.id.split('-').slice(1).join('-')
                    if(arraySubsequenceMatch(data.id.split('-'), id.split('-')) && countNumbers(data.id) == countNumbers(field.id)+1){
                      return data
                    }
                  })
  
                  fieldModal.sort((a, b) => a.element_order - b.element_order);
  
                  fieldModal.forEach(modalField=>{
                    const renderer = renderers[modalField.type];
                    renderer(modalField, sectionAppend, editorContainer)
                  })
                  webpageHasPrinted.add(field.id)
                }
                break;
              case 'field':
                if(!field.id.includes('modal') && !webpageHasPrinted.has(field.id)){
                  html = createField(field,edit);
  
                  if(edit) dropdown = createDropdownField(field.id);
  
                  appendTo(`#wrapper-section-${field.id.split('-').slice(1,-1).join('-')}`, html);
                  webpageHasPrinted.add(field.id)
  
                }
                break;
              case 'carousel':
                if(!webpageHasPrinted.has(field.id)){
                  html = createCarousel(field, webpageDb, editorContainer, edit)
                  if(edit) dropdown = createDropdownCarousel(field.id, field.id.split('-'))
  
                  appendTo(`#wrapper-section-${field.id.split('-').slice(1,-1).join('-')}`, html)
                  webpageHasPrinted.add(field.id)
                }
                break;
              case 'accordion':
                renderAccordion(field,editorContainer, 'two');
                break;
            }
  
            if (dropdown && edit) editorContainer.insertAdjacentHTML('afterend', dropdown);
          });
  
        }
  
        const renderers = {
          field(page, sectionAppend) {
            let element, dropdown;
            if (page.id.startsWith('field-modal-') && !webpageHasPrinted.has(page.id)) {
          
              element = createField(page,edit);
              if(edit) dropdown = createDropdownField(page.id);
  
              appendTo(`#body-${page.id.split('-').slice(1, -1).join('-')}`, element, webpage.parentElement);
              if (edit) document.querySelector(`#parent-${page.id.split('-').slice(1,-1).join('-')}`).insertAdjacentHTML('afterbegin', dropdown)
  
              webpageHasPrinted.add(page.id)
              return true; // stop, biar gak render ulang di bawah
              
            } else if (page.id.startsWith('field-element-') && !webpageHasPrinted.has(page.id)) {
              element = createField(page,edit);
              if(edit) dropdown = createDropdownField(page.id);
              
              webpageHasPrinted.add(page.id)
            }
            return { element, dropdown };
          },
  
          'button-modal'(page) {
            if (!page.id.startsWith('modal-accordion') && !webpageHasPrinted.has(page.id) ) {
              let element='', dropdown=''
              webpageHasPrinted.add(page.id)
  
              element= createBtnModal(page,edit)
              if(edit) dropdown= createDropdownModal(page.id)
  
              return { element,dropdown }
            }
            return null;
          },
  
          'body-modal'(page, sectionAppend, editorContainer) {
            if(!webpageHasPrinted.has(page.id)){
              const fieldHead = webpageDb.find(field => field.id === `field-head-${page.id.split('-').slice(1).join('-')}`)
              document.getElementById('modal-body-wrapper').insertAdjacentHTML('beforeend', createBodyModal(page, fieldHead,edit))
  
              if(edit) sectionAppend.insertAdjacentHTML('beforeend', createDropdownModal(page.id))
  
              let fieldModal=''
              fieldModal = webpageDb.filter(data => {
                const id=page.id.split('-').slice(1).join('-')
                if(arraySubsequenceMatch(data.id.split('-'), id.split('-')) && countNumbers(data.id) == countNumbers(page.id)+1){
                  return data
                }
              })
  
              fieldModal.sort((a, b) => a.element_order - b.element_order);
  
              fieldModal.forEach(modalField=>{
                const renderer = renderers[modalField.type];
                renderer(modalField, sectionAppend, editorContainer)
              })
  
              webpageHasPrinted.add(page.id)
              return true;
            }
          },
  
          accordion(page, sectionAppend, editorContainer) {
            // langsung delegasikan ke renderer accordion khusus (yang refactor panjang kemarin)
            if(!page.id.startsWith('accordion-in-accordion') && !webpageHasPrinted.has(page.id)){
              renderAccordion(page, editorContainer, 'first');
            }
            return true;
          },
  
          carousel(page, sectionAppend, editorContainer, childElements){
            const id = page.id;
  
            // buat accordion + dropdown body
            if(!id.startsWith('carousel-accordion') && !webpageHasPrinted.has(page.id)){
              let fieldCarousel = childElements.filter(elemen => arraySubsequenceMatch(elemen.id.split('-'), page.id.split('-')))
              editorContainer.insertAdjacentHTML('beforeend', createCarousel(page,fieldCarousel,editorContainer, edit));
  
              if(edit) editorContainer.insertAdjacentHTML('afterend', createDropdownCarousel(id, id.split('-')));
              webpageHasPrinted.add(page.id)
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
      
        childElements.forEach(page => {
          if(!page.id.includes('footer')){
            let sectionAppend=''
  
            if(param.includes('prolog')){
              sectionAppend = document.querySelector(`#webpage-section-prolog-web-${sectionNum}`);              
            }else{
              sectionAppend = document.querySelector(`#webpage-section-${sectionNum}`);    
            }

            const editorContainer = sectionAppend.querySelector('[id^="editor-container-"]');
           
            const renderer = renderers[page.type];
          
            const cekObject = (v) => Object.prototype.toString.call(v) === '[object Object]';
            if(cekObject(renderer)){
              if (Object.keys(originalSizes).length === 0) return;
            }else{
              if (!renderer) return;
            }
          
            const result = renderer(page, sectionAppend, editorContainer, webpageDb);
            if (result === true) return; // sudah di-handle sepenuhnya di dalam renderer
            
            if (result && result.element) {
              editorContainer.insertAdjacentHTML('beforeend', result.element);
              if (result.dropdown && edit) sectionAppend.insertAdjacentHTML('beforeend', result.dropdown);
            }
          }
        });
      });
  
      // ================== COMMENTS =====================
      if(edit==false){
        const commentPlaceholder = document.createElement('div');
        commentPlaceholder.id = 'comment-injection-point';
        webpage.appendChild(commentPlaceholder);
  
        // PINDAHKAN KOMPONEN LIVEWIRE KE DALAM PLACEHOLDER
        const livewireContent = document.getElementById('hidden-comment-wrapper');
        if (livewireContent && commentPlaceholder) {
            commentPlaceholder.appendChild(livewireContent);
            livewireContent.style.display = 'block'; // Tampilkan kembali
        }
      }
    }

    //====================== FOOTER =========================
      let sectionsFooter = webpageDb
        .filter(page => page.type === "section" && page.id.includes('footer'))

      // 2. Loop per section
      sectionsFooter.forEach(section => {
        let idPrefix = section.id.split('-').slice(1).join('-');

        // Cetak section
        webpage.insertAdjacentHTML(
          'beforeend',
          createSectionFooter(idPrefix, section.element_order, section.element_count, section.style, edit)
        );

        let childElements = webpageDb.filter(page => {
          return page.type !== "section" && page.id.includes('footer');
        });

        childElements.sort((a, b) => a.element_order - b.element_order);
        childElements.forEach(page => {
          let sectionAppend = document.querySelector(`#webpage-section-footer`);

          const editorContainer = sectionAppend.querySelector('[id^="editor-container-"]');
          editorContainer.insertAdjacentHTML('beforeend', createField(page,edit));
          if(edit) sectionAppend.insertAdjacentHTML('afterend', createDropdownField(page.id));
            
        })
      });
    //=========================================================
      const notPrinted = webpageNotFooter.filter(obj => 
        !webpageHasPrinted.has(obj.id)
      );
  }
  if(edit){
    dropdownInitialized('all')
  }
  setTimeout(() => {
      try {
        initFlowbite();
      } catch (error) {
          console.error('Gagal menginisialisasi Modal:', error);
      }
    }, 100); 
}