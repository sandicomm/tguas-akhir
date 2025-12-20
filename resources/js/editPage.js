// ======== FLOWBITE COMPONENTS =========
import { initFlowbite } from 'flowbite';

// ======== GLOBALS =========
import { globals } from './page/globals.js';

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
import {arraySubsequenceMatch} from './page/utils/elementNumberingId.js'

// ======== GLOBAL VARIABLE ASSIGNMENT =========
let webpageDb = globals.webpageDb,
  fileDb = globals.file,
  param = globals.param,
  webpageDbRaw = globals.webpageDbRaw,
  file = globals.file,
  webpageDbParentSection = globals.webpageDbParentSection,
  editorFieldSelect = globals.editorFieldSelect,
  carouselSelect = globals.carouselSelect,
  accordionSelect = globals.accordionSelect,
  savedSelection= globals.savedSelection
  
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

function resizeElements() {
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

    const isMobile = window.innerWidth <= 850;

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

window.addEventListener("resize", resizeElements);
window.addEventListener("load", resizeElements);

document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('loading-overlay').classList.remove('hidden');
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

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      loadWebpage();
      document.getElementById('loading-overlay').classList.add('hidden');
    });
  });
})

function setListener(){
  document.querySelectorAll('input[type="file"][accept^="video"]').forEach(input => {
    if (input.dataset.listenerAdded === "true") return;
    input.dataset.listenerAdded = "true";
    input.addEventListener('change', function (e) {
      const file = e.target.files[0];
      webpageDb=globals.webpageDb
      fileDb=globals.file
      if (file && file.type.startsWith('video/')) {
        const labelId = `label-${e.target.id}`; // contoh: input-video-1-2 → label-input-video-1-2
        const label = document.getElementById(labelId);
        
        // Buat elemen video
        const video = document.createElement('video');
        video.controls = true;
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

        fileDb.push({
          id:uniqueKey,
          type:'file',
          filetype:'video',
          file:file
        })

        globals.webpageDb=webpageDb
      }
    });
  });
}

// ======================== INITIALIZED =======================
const indexBySection = {};
const indexById = {};

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
    webpageDb.forEach(item => {
      indexById[item.id] = item;

      const sectionNum = item.id.split('-').find(p => !isNaN(p));
      if (!sectionNum) return;

      if (!indexBySection[sectionNum]) {
        indexBySection[sectionNum] = [];
      }
      indexBySection[sectionNum].push(item);
    });
    const webpage = document.getElementById('webpage')

    function getSectionNumber(id) {
      return parseInt(id.split('-').find(part => !isNaN(part)), 10) || Infinity;
    }

    function countNumbers(id) {
      return id.split('-').filter(part => !isNaN(part) && part.trim() !== '').length;
    }

    // 1. Ambil semua section dan sort berdasarkan element_order
    let sections = webpageDb
      .filter(page => page.type === "section" && !page.id.includes('footer'))
      .sort((a, b) => a.element_order - b.element_order);

    let webpageHasPrinted= new Set()
    // 2. Loop per section
    sections.forEach(section => {
      let idPrefix = section.id.split('-').slice(1).join('-');
      const borderWave = webpageDb.filter(page => page.type === 'border-wave' && arraySubsequenceMatch(page.id.split('-'), idPrefix.split('-')))

      // Cetak section
      if(!webpageHasPrinted.has(section.id)){
        webpage.insertAdjacentHTML(
          'beforeend',
          createSection(idPrefix, borderWave, section.element_order, section.element_count, section.style)
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

          editorContainer.querySelector(`#wrapper-section-${id.split('-').slice(2,-1).join('-')}`).insertAdjacentHTML('beforeend', createAccordion(accordionEl));
          webpageHasPrinted.add(accordionEl.id)
        }else if(!webpageHasPrinted.has(accordionEl.id)){
      
          editorContainer.insertAdjacentHTML('beforeend', createAccordion(accordionEl));
          webpageHasPrinted.add(accordionEl.id)
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
              appendTo(`#parent-${id}`, createItemAccordion(head.id.split('-').slice(2).join('-'), head, accordionEl));
              editorContainer.insertAdjacentHTML('afterend', createDropdownHeadAccordion(head.id.split('-').slice(2).join('-')));
              webpageHasPrinted.add(head.id)

            }
          });

        // render section
        grouped.section.sort((a, b) => a.element_order - b.element_order)
          .forEach(section => {
            if(!webpageHasPrinted.has(section.id)){
              appendTo(`#body-${section.id.split('-').slice(1,-1).join('-')}`, createSectionAccordion(section));
              editorContainer.insertAdjacentHTML('afterend', createDropdownSectionAccordion(section.id, section.id.split('-')));
              webpageHasPrinted.add(section.id)
            }
          });

        // render field
        grouped.field.sort((a,b)=>a.element_order-b.element_order).forEach(field=>{
          let html, dropdown;
          switch (field.type) {
            case 'button-modal':
              if(!webpageHasPrinted.has(field.id)){
                html = createBtnModal(field);
                dropdown = createDropdownModal(field.id);
                appendTo(`#wrapper-section-${field.id.split('-').slice(1,-1).join('-')}`, html);
                webpageHasPrinted.add(field.id)
              }
              break;
            case 'body-modal':
              if(!webpageHasPrinted.has(field.id)){
                const fieldHead = webpageDb.find(page => page.id == `field-head-${field.id.split('-').slice(1).join('-')}`)
            
                document.getElementById(`webpage-section-${sectionNum}`).insertAdjacentHTML('beforeend', createBodyModal(field, fieldHead))
                document.getElementById(`webpage-section-${sectionNum}`).insertAdjacentHTML('beforeend', createDropdownModal(field.id))
                document.getElementById(`webpage-section-${sectionNum}`).insertAdjacentHTML('beforeend', createDropdownModal(field.id))

                let sectionAppend = document.querySelector(`#webpage-section-${sectionNum}`);
  
                const editorContainer = sectionAppend.querySelector('[id^="editor-container-"]');

                let fieldModal
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
            case 'video':
              if(!field.id.includes('modal') && !webpageHasPrinted.has(field.id)){
                html = createVideo(field);
                dropdown = createDropdownVideo(field.id);
                appendTo(`#wrapper-section-${field.id.split('-').slice(1,-1).join('-')}`, html);
                webpageHasPrinted.add(field.id)
              }
              break;
            case 'field':
              if(!field.id.includes('modal') && !webpageHasPrinted.has(field.id)){
                html = createField(field);
                dropdown = createDropdownField(field.id);
                appendTo(`#wrapper-section-${field.id.split('-').slice(1,-1).join('-')}`, html);
                webpageHasPrinted.add(field.id)

              }
              break;
            case 'carousel':
              if(!webpageHasPrinted.has(field.id)){
                html = createCarousel(field, webpageDb, editorContainer)
                dropdown = createDropdownCarousel(field.id, field.id.split('-'))
                appendTo(`#wrapper-section-${field.id.split('-').slice(1,-1).join('-')}`, html)
                webpageHasPrinted.add(field.id)
              }
              break;
            case 'accordion':
              renderAccordion(field,editorContainer, 'two');
              break;
          }

          if (dropdown) editorContainer.insertAdjacentHTML('afterend', dropdown);
        });

      }

      const renderers = {
        field(page, sectionAppend) {
          let element, dropdown;
          if (page.id.startsWith('field-modal-') && !webpageHasPrinted.has(page.id)) {
        
            element = createField(page);
            dropdown = createDropdownField(page.id);
            appendTo(`#body-${page.id.split('-').slice(1, -1).join('-')}`, element, sectionAppend);
            document.querySelector(`#parent-${page.id.split('-').slice(1,-1).join('-')}`).insertAdjacentHTML('afterbegin', dropdown)

            webpageHasPrinted.add(page.id)
            return true; // stop, biar gak render ulang di bawah
            
          } else if (page.id.startsWith('field-element-') && !webpageHasPrinted.has(page.id)) {
            element = createField(page);
            dropdown = createDropdownField(page.id);
            webpageHasPrinted.add(page.id)
          }
          return { element, dropdown };
        },

        video(page, sectionAppend) {
          let element, dropdown;
          if (page.id.startsWith('video-modal') && !webpageHasPrinted.has(page.id)) {
            element = createVideo(page);
            dropdown = createDropdownVideo(page.id);
            appendTo(`#body-${page.id.split('-').slice(1, -1).join('-')}`, element);
            document.querySelector(`#parent-${page.id.split('-').slice(1,-1).join('-')}`).insertAdjacentHTML('afterbegin', dropdown);
            webpageHasPrinted.add(page.id)

            return true
          } else if(page.id.startsWith('video-element') && !webpageHasPrinted.has(page.id)) {
            element = createVideo(page);
            dropdown = createDropdownVideo(page.id);
            webpageHasPrinted.add(page.id)
          }
          return { element, dropdown };
        },

        'button-modal'(page) {
          if (!page.id.startsWith('modal-accordion') && !webpageHasPrinted.has(page.id) ) {
            webpageHasPrinted.add(page.id)
            return {
              element: createBtnModal(page),
              dropdown: createDropdownModal(page.id)
            }
          }
          return null;
        },

        'btn-prolog'(page) {
          if (!page.id.startsWith('modal-accordion') && !webpageHasPrinted.has(page.id)) {
            webpageHasPrinted.add(page.id)
            return {
              element: createBtnProlog(page),
            }
          }
          return null; // kasus "modal-accordion" di-handle dalam renderAccordion
        },

        'body-modal'(page, sectionAppend, editorContainer) {
          if(!webpageHasPrinted.has(page.id)){
            const fieldHead = webpageDb.find(field => field.id === `field-head-${page.id.split('-').slice(1).join('-')}`)
            sectionAppend.insertAdjacentHTML('beforeend', createBodyModal(page, fieldHead))
            sectionAppend.insertAdjacentHTML('beforeend', createDropdownModal(page.id))

            let fieldModal
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
            editorContainer.insertAdjacentHTML('beforeend', createCarousel(page,fieldCarousel,editorContainer));
            editorContainer.insertAdjacentHTML('afterend', createDropdownCarousel(id, id.split('-')));
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
      const notPrinted = webpageNotFooter.filter(obj => 
        !webpageHasPrinted.has(obj.id)
      );
  }

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

  setTimeout(() => {
      try {
        initFlowbite();
      } catch (error) {
          console.error('❌ Gagal menginisialisasi Modal:', error);
      }
    }, 100); 


}

document.getElementById('default-sidebar').addEventListener('mouseup', function (event){
  if(event.target.closest('heading-text')){

    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      savedSelection = range.cloneRange();
      globals.savedSelection = range.cloneRange();
    }
  }
})

document.getElementById('default-sidebar').addEventListener('click', function (event) {
  // ================= EVENT CLICK ====================
  if(event.target.closest("[id='heading-text']")){
    let element = event.target.closest("[id='heading-text']")

    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      savedSelection = range.cloneRange();
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
      const editCarouselWrapper = document.getElementById(`edit-${idParts.slice(1).join('-')}`).parentElement
      if(editCarouselWrapper.children.length <=1){
        sectionDelete=false
      }
      
      if(sectionDelete){
        const confirmDelete = confirm("Apakah kamu yakin ingin menghapus elemen ini?");
        if (confirmDelete) {
          handleElementAction('delete', actualField, actualBodyItem, {
            datasetKey: 'itemOrder',
            reinitFlowbite: true,
            afterMove: () => updateStylingControls(carouselSelect)
          }, idParts);    
        }
      }else{
         alert("elemen tidak boleh terhapus semua")
      }
    }
  }
})

document.getElementById('webpage').addEventListener('mouseup', function(event){
  if(event.target.closest("[id^='field-']")){
    const sel = window.getSelection();
      if (sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        savedSelection = range.cloneRange();
        globals.savedSelection = range.cloneRange();
      }
  }
})

document.getElementById('webpage').addEventListener('keyup', function(event){
  if(event.target.closest("[id^='field-']")){
    let element = event.target.closest("[id^='field-']")

    webpageDb.forEach(item=>{
      if(item.id === element.id){
        item.action= updateActionProperty(item.action, 'update')
        item.content = element.innerHTML

        return
      }
    })
    globals.webpageDb = webpageDb
  }
})

document.getElementById('webpage').addEventListener('click', function (event) {
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

    accordionSelect = document.getElementById(idParts.slice(2, -1).join('-'));
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

  else if(event.target.closest("[id^='video-']")){

    let element = event.target.closest("[id^='video-']")

    editorFieldSelect = element
    globals.editorFieldSelect = editorFieldSelect

    accordionSelect = null
    globals.accordionSelect = null

    carouselSelect = null
    globals.carouselSelect = null
    updateStylingControls(element, "video")
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

      accordionSelect = document.getElementById(idParts.slice(1,-2).join('-'))
      globals.accordionSelect = document.getElementById(idParts.slice(1,-2).join('-'))

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
    setListener();
  }

  if (id.startsWith('add-video-')) {
    addVideo(event)
   
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

    }else if(idParts[1] == "video"){
      copyVideo(idParts)
      
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
      const parentAccordion = document.getElementById(idParts.slice(2).join('-')).parentElement
      if(parentAccordion.children.length <= 1){
        sectionDelete=false
      }
    }

    if(sectionDelete){
      const confirmDelete = confirm("Apakah kamu yakin ingin menghapus elemen ini?");
      if (confirmDelete) {
        handleElementAction('delete', fieldElement, bodyElement, {
          datasetKey: 'elementOrder'
        }, idParts);
      }
    }else{
       alert("elemen tidak boleh terhapus semua")
    }
  }
}
})


document.getElementById('btn-save').addEventListener('click', async function() {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  document.getElementById('loading-overlay').classList.remove('hidden');

  let noFileDb = [...globals.webpageDbParentSection, ...globals.webpageDb]
        .filter(item => item.action);

  let fileDb=globals.file.filter(item=>item.action)

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

          raw = await response.text()
          console.log('data raw:',raw,)
          let data = JSON.parse(raw);
          if (!data.success) throw data;

      } catch (err) {
          alert(`Gagal menyimpan ${indexLabel}`);

          throw new Error(
              `${err.message || "Unknown Error"}\n\n`
          );
      }
  };

  // =============================
  // 1️⃣  Kirim FILE dalam batch kecil
  // =============================
  const fileChunks = chunk(fileDb, 15); // max 15 file

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

  const nonFileChunks = chunk(nonFile, 100);

  for (let i = 0; i < nonFileChunks.length; i++) {
      await sendBatch(
          nonFileChunks[i],
          `batch data ${i + 1}/${nonFileChunks.length}`,
          "http://127.0.0.1:8000/webpage/store",
          true
      );
  }

  document.getElementById('loading-overlay').classList.add('hidden')
  alert('✅ Semua data berhasil disimpan.');
  window.location.reload();
});

bs.fontStylingField()
bs.widthHeightField()
bs.borderField()
bs.paddingMarginField()
bs.colorBackgroundField()
bs.borderWave()
bs.flexPosition()
bs.setListenerSetImage()
setListener()
accordionStyling()
modalTypeStyling()