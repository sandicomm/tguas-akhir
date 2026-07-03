// ======== FLOWBITE COMPONENTS =========
import { initFlowbite } from 'flowbite';

// ======== GLOBALS =========
import { globals } from './page/globals.js';

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

export function initWebpage(edit) {
  document.getElementById('loading-overlay')?.classList.remove('hidden');
  //console.log('hello load')
  webpageDbRaw = JSON.parse(JSON.stringify(webpageJs));
  globals.webpageDbRaw = webpageDbRaw
  
  webpageDb = webpageDbRaw.filter(page => page.type !== 'parent-section')
  globals.webpageDb = webpageDb

  webpageDbParentSection = webpageDbRaw.filter(page => page.type == 'parent-section')
  globals.webpageDbParentSection = webpageDbParentSection

  const typePage = window.typePage; // Ambil dari variabel global
  if(typePage == 'image'){

    loadWebpage(edit, true)
    ////console.log(typePage)
    
  }else{

    param = JSON.parse(JSON.stringify(paramJs))
    globals.param = param
    let indicatorPage
    if(param === 'prolog'){
      indicatorPage = 'Prolog Webpage'
    } 
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        loadWebpage(edit)
        document.getElementById('loading-overlay')?.classList.add('hidden');
      });
    });
  }
}

const indexBySection = {};
const indexById = {};

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
  "xx-large": 6,   // fallback browser
  "xxx-large": 7,
};

function normalizeFontSizeToNumber(value) {
  if (!value) return null;

  // font size="7"
  if (!isNaN(value)) {
    return Math.min(7, Math.max(1, parseInt(value)));
  }

  value = value.toLowerCase();

  // keyword: x-large, xxx-large
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

const originalSizes = {};
let originalCaptured = false;

function storeOriginalSize(el) {
  if (!el.id) return;

  if (!originalSizes[el.id]) {
    originalSizes[el.id] = {};
  }

  const ori = originalSizes[el.id];

  if (!ori.width) ori.width = el.style.width || "";
  if (!ori.height) ori.height = el.style.height || "";

  // ===== FONT via <font size="">
  const fontEl = el.querySelector("font");
  if (fontEl && !ori.fontSize) {
    const size = normalizeFontSizeToNumber(fontEl.getAttribute("size"));
    if (size) {
      ori.fontSize = { value: size };
      return;
    }
  }

  // ===== FONT via style="font-size"
  const styledEl = el.querySelector("[style*='font-size']");
  if (styledEl && !ori.fontSize) {
    const size = normalizeFontSizeToNumber(styledEl.style.fontSize);
    if (size) {
      ori.fontSize = { value: size };
    }
  }
}

function restoreOriginalSize(el) {
  if (!el.id) return;
  const ori = originalSizes[el.id];
  if (!ori) return;

  el.style.width = ori.width;
  el.style.height = ori.height;

  if (!ori.fontSize) return;

  const sizeNum = ori.fontSize.value;
  const cssSize = FONT_SIZE_MAP[sizeNum];

  // 1️⃣ Kalau masih ada <font>
  const fontEl = el.querySelector("font");
  if (fontEl) {
    fontEl.setAttribute("size", sizeNum);
    return;
  }

  // 2️⃣ Kalau pakai style
  const styledEl = el.querySelector("[style*='font-size']");
  if (styledEl) {
    styledEl.style.fontSize = cssSize;
    return;
  }

  // 3️⃣ Fallback: apply ke el langsung
  el.style.fontSize = cssSize;
}

function findParentWidth(el) {
    let current
    if(el.id.startsWith('field')){
      current = el.parentElement.parentElement;
    }else{
      current = el.parentElement;
    }
    while (current) {
        const styleAttr = current.getAttribute("style");

        // Kalau inline width ditemukan, tapi lebih besar dari layar → skip aja (overflow case)
        if (styleAttr && styleAttr.includes("width:")) {
            const match = styleAttr.match(/width\s*:\s*(\d+)px/i);
            if (match) {
                const w = parseInt(match[1]);
                if (w <= window.innerWidth) {
                    return { current: w, status: "style" };
                }
            }
        }

        // Cek visual rect
        const rect = current.getBoundingClientRect();
        if (rect.width && rect.width > 0 && rect.width <= window.innerWidth) {
            return { current: rect.width, status: "rect" };
        }

        // lanjut ke parent
        current = current.parentElement;
    }
    return null;
}

function applyFontSize(el, newSize) {
  const fontEl = el.querySelector("font");
  const styledEl = el.querySelector("[style*='font-size']");

  // PRIORITAS <font>
  if (fontEl) {
    fontEl.setAttribute("size", newSize);
    return;
  }

  // STYLE fallback
  if (styledEl) {
    styledEl.style.fontSize = FONT_SIZE_MAP[newSize] || "medium";
    return;
  }

  // fallback terakhir
  el.style.fontSize = FONT_SIZE_MAP[newSize] || "medium";
}

function resizeFont(el) {
  let currentValue = null;

  const fontEl = el.querySelector("font");
  const styledEl = el.querySelector("[style*='font-size']");

  if (fontEl) {
    currentValue = fontEl.getAttribute("size"); // bisa "7"
  } else if (styledEl) {
    currentValue = styledEl.style.fontSize; // bisa "xxx-large"
  }

  // 🔑 NORMALISASI YANG BENAR
  const numericSize = normalizeFontSizeToNumber(currentValue);

  if (!numericSize) return;

  // MOBILE LOGIC
  if (window.innerWidth <= 550) {
    let newSize = numericSize;

    if (numericSize >= 6) {
      newSize = 5;                // 6 / 7 → 5
    } else if (numericSize > 3 && numericSize < 5) {
      newSize = numericSize - 1;  // 4 → 3
    }

    applyFontSize(el, newSize);
  }
}

export function resizeElements(edit = false) {
  setTimeout(() => {
    // 🔒 CAPTURE ORIGINAL SIZE SEKALI SAJA
    if (!originalCaptured) {
      document.querySelectorAll("[style]").forEach(el => {
        if(!el.id.startsWith('dropdown')){
          storeOriginalSize(el);
        }
      });

      originalCaptured = true;
    }
    ////console.log('resize')
    const webpage = document.getElementById('webpage')
    
    const isMobile = edit ? parseInt(webpage.style.width) <= 850 : window.innerWidth <= 850;
    ////console.log(isMobile, edit, webpage.style.width, parseInt(webpage.style.width))
    document.querySelectorAll("[style]").forEach(el => {
      if(!el.id.startsWith('dropdown')){

        if (!isMobile) {
          restoreOriginalSize(el);
          return;
        }
  
        // ===== MOBILE ====
        resizeFont(el);
        
        if (el.style.width === "100%") return;
  
        const styleAttr = el.getAttribute("style");
        if (!styleAttr || !styleAttr.includes("width:")) return;
  
        const styleWidth  = parseInt(el.style.width) || null;
        const styleHeight = parseInt(el.style.height) || null;
  
        const check = findParentWidth(el);
        if (!check) return;
  
        let parentWidth = check.current;
        if (!parentWidth) return;
  
        if (styleWidth && styleWidth >= parentWidth) {
          const scale = parentWidth / styleWidth;
          el.style.width = (parentWidth - 15) + "px";
  
          if (styleHeight) {
            el.style.height = Math.floor(styleHeight * scale) + "px";
          }
        }
  
        if (el.offsetWidth > parentWidth) {
          el.style.width = (parentWidth - 15) + "px";
        }
      }
    });

  }, 200);
}

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

const webpage = document.getElementById('webpage')

export function loadWebpage(edit=false, justFooter=false){
  if(!edit) initFlowbite()
 // //console.log({edit,justFooter})
  const webpageNotFooter = webpageDb.filter(file => !file.id.includes('footer'))
  if(webpageNotFooter.length == 0 && edit){
    let idPrefix = `section-1`

    if(param.includes('prolog')){
      idPrefix = `section-prolog-web-1`
    }

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
      // 1. Ambil semua section dan sort berdasarkan element_order
      let sections = webpageDb
        .filter(page => page.type === "section" && !page.id.includes('footer'))
        .sort((a, b) => a.element_order - b.element_order);
      
      // 2. Loop per section
      sections.forEach(section => {
        let idPrefix = section.id.split('-').slice(1).join('-');
        const borderWave = webpageDb.filter(page => page.type === 'border-wave' && arraySubsequenceMatch(page.id.split('-'), idPrefix.split('-')))
  
        // Cetak section
        if(!webpageHasPrinted.has(section.id)){
          webpage.insertAdjacentHTML(
            'beforeend',
            createSection(idPrefix, borderWave, section.element_order, section.element_count, section.style, edit)
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
                  
                  webpageSection.insertAdjacentHTML('beforeend', createBodyModal(field, fieldHead,edit))
  
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
  
              appendTo(`#body-${page.id.split('-').slice(1, -1).join('-')}`, element, sectionAppend);
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
              sectionAppend.insertAdjacentHTML('beforeend', createBodyModal(page, fieldHead,edit))
  
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
        //console.log(childElements)
        childElements.forEach(page => {
          if(!page.id.includes('footer')){
            let sectionAppend=''
  
            if(param.includes('prolog')){
              sectionAppend = document.querySelector(`#webpage-section-prolog-web-${sectionNum}`);
              
            }else{
              sectionAppend = document.querySelector(`#webpage-section-${sectionNum}`);
    
            }
            const editorContainer = sectionAppend.querySelector('[id^="editor-container-"]');
            //console.log(page.type)
            const renderer = renderers[page.type];
            if (!renderer) return; // skip kalau gak ada handler
            
            
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

  setTimeout(() => {
      try {
        initFlowbite();
      } catch (error) {
          console.error('❌ Gagal menginisialisasi Modal:', error);
      }
    }, 100); 
}