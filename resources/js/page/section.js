import { globals } from './globals.js';
import { replaceTrailingNumber,deepClone } from './utils/utilsDuplikatFunction.js';
import { copyModal } from './modal.js';
import { copyAccordion } from './accordion.js';
import { dropdownInitialized } from './utils/dropdownInit.js';
import { renderSvg } from './utils/svgEdit.js';
import { initFlowbite } from 'flowbite';

// ======== updateContent ========
import { updateActionProperty } from './utils/updateContent.js';

import {arraySubsequenceMatch, generateUniqueId, handleElementCount, replaceIdSuffix} from './utils/elementNumberingId.js'
// ======== Validation get element ==========
import { getEl } from './utils/validationGetElement.js';

let webpageDb=  globals.webpageDb, param=globals.param
let webpageDbParentSection=globals.webpageDbParentSection

const createSection = (idPrefix,borderWave,order,count,style,edit)=>{
    let section=``
    let dropdownSection=''
    let dropdownElement=''

    if(edit){
      dropdownSection = `
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-0 border-b-1 border-gray-500 " aria-labelledby="dropdownDefaultButton">
                <li>
                    <a id="add-${idPrefix}" class="font-bold block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Section</a>
                </li>
                <li>
                    <a id="up-${idPrefix}" class="font-bold block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
                </li>
                <li>
                    <a id="down-${idPrefix}" class="font-bold block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
                </li>
                <li>
                    <a id="copy-${idPrefix}" class="text-blue-600 font-bold block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a>
                </li>
                <li>
                    <a id="delete-${idPrefix}" class="font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete Section</a>
                </li>
              </ul>
      `
      dropdownElement=`
               <li>
                    <a id="add-field-element-${idPrefix}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
                </li>
                <li>
                    <a id="add-modal-element-${idPrefix}" class=" block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modal</a>
                </li>
                <li>
                    <a id="add-accordion-element-${idPrefix}" class=" block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Accordion</a>
                </li>
                <li>
                <a id="add-carousel-element-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
                </li>
      `
    }

    if((idPrefix.includes('prolog') || idPrefix.includes('footer')) && edit){
      dropdownSection = ``
      dropdownElement=`
         <li>
            <a id="add-field-element-${idPrefix}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
        </li>`
    }
 
    let styleEditor = '';
    const justifyMatch = style.match(/justify-content\s*:\s*[^;]+;/i);
    const alignMatch = style.match(/align-items\s*:\s*[^;]+;/i);

    if (justifyMatch) styleEditor += justifyMatch[0] + ' ';
    if (alignMatch) styleEditor += alignMatch[0];

    // ✂️ Hapus justify-content dan align-items dari style asli
    let styleWebpage = style
      .replace(/justify-content\s*:\s*[^;]+;/gi, '')
      .replace(/align-items\s*:\s*[^;]+;/gi, '')
      .trim();

    // 🧹 Rapikan spasi ganda
    styleWebpage = styleWebpage.replace(/\s{2,}/g, ' ');

    let svg=''
    let dropdown=''
    if(edit){
      svg=`
        <div class="bg-green-400 rounded-full absolute right-1 top-1 z-20 cursor-pointer" data-dropdown-toggle="dropdown-${idPrefix}" data-dropdown-placement="right-end">
          ${renderSvg()}               
        </div>
      `
      dropdown=`
        <div id="dropdown-${idPrefix}" data-accordion="open" class="z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          ${dropdownSection}
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              ${dropdownElement}
          </ul>
        </div>
      `
    }
    let btnNextProlog=''
    if(idPrefix.includes('prolog')){
      let btnMedia = edit ? 
          `` 
          : 
          `<a href="/form-test/pre-test-interaktif" class="w-full text-center cursor-pointer md:p-3 p-2 md:px-5 px-3 bg-blue-700 border-2 border-white text-white font-bold rounded-md md:text-lg">
              Interaktif Page
          </a>
          <a href="/form-test/pre-test-emodul" class="w-full text-center cursor-pointer md:p-3 p-2 md:px-5 px-3 bg-blue-700 border-2 border-white text-white font-bold rounded-md md:text-lg">
              Emodul Page
          </a>`

      let btnAdmin = edit ? 
          ``
          :
          `<a href="/admin" class="absolute top-0 right-0 text-center opacity-50 hover:opacity-100 cursor-pointer bg-gray-300/50 text-black font-bold rounded-full m-3">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </a>`
      btnNextProlog=`
      <div class="flex justify-center items-center flex-col gap-2 md:w-1/2 w-full px-3 pb-20">
        <div class="flex gap-4 w-full">
        
          ${btnMedia}
        </div>
        ${btnAdmin}
      </div>
      `
    }
    section=`
      <div id="webpage-${idPrefix}" data-element-order="${order}" class="bg-gray-200 flex flex-col ${idPrefix.includes('prolog') ? 'min-h-[100dvh]' : ''} justify-center items-center border border-gray-700x z-10" style="${styleWebpage}">
        ${dropdown}
        ${svg}
        <div id="editor-container-${idPrefix}" data-element-count="${count}" class="md:px-3 md:py-5 md:pt-0 px-4 py-5 pt-10 w-full flex flex-col" style="${styleEditor}"></div>
        ${btnNextProlog}
      </div>   
   `
   return section
}

const createSectionFooter = (idPrefix,order,count,style,edit)=>{

let section=`
    <div id="webpage-${idPrefix}" data-element-order="${order}" class="relative bg-gray-200 flex flex-col justify-center items-center border border-gray-700" style="${style}">
    ${
      edit ?
      `<div class="bg-green-400 rounded-full absolute right-0 top-0 z-20 cursor-pointer" data-dropdown-toggle="dropdown-${idPrefix}" data-dropdown-placement="right-end">
        ${renderSvg()}                 
      </div>
      <div id="dropdown-${idPrefix}" data-accordion="open" class="z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              <li>
              <a id="add-field-element-${idPrefix}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">Field</a>
              </li>
          </ul>
      </div>
      `
      :''
    }

    <div id="editor-container-${idPrefix}" data-element-count="${count}" class="p-5 w-full flex flex-col flex-1" style="justify-content:start;align-items:start;"></div>
    <div class="bg-white text-center p-2 w-full text-sm">Copyright © 2024 Smart Health Diabetes. All Right Reserved</div>
    </div>   
`
return section
}

const createSectionAccordion = (section,edit) => `
<div id="${section.id}" data-element-order="${section.element_order}" style="${section.style}" class="relative w-full flex flex-col justify-center items-center border border-gray-400">
    ${
      edit ?
        `<div type="button" class="bg-blue-400 rounded-full absolute right-0 top-0 z-20 cursor-pointer" data-dropdown-toggle="dropdown-body-${section.id.split('-').slice(1).join('-')}" data-dropdown-placement="right-end">
          ${renderSvg()}   
        </div>`
        :''
    }

    <div id="wrapper-${section.id}" data-element-count="${section.element_count}" class="p-2 w-full flex justify-start items-center flex-col">
    <!-- Body Accordion -->
    
    </div>
</div>  
`

const addSection = (event)=>{
  webpageDb=globals.webpageDb
  webpageDbParentSection=globals.webpageDbParentSection

  const idParts = event.target.id.split('-');
  const idPrefix = `${idParts.slice(2, idParts.length-1).join('-')}`

  let newSection
  
  if(idParts[2] === 'accordion'){
    let elementCollapse = getEl(`body-${idPrefix}`)
    if(!elementCollapse)return

    let elementCount = parseInt(elementCollapse.dataset.elementCount)
    let newCount= handleElementCount(elementCollapse,elementCount)
    // set element count to parent section
    elementCollapse.dataset.elementCount = newCount
    
    let newId = generateUniqueId(`${idPrefix}-${newCount}`,elementCollapse)

    // html section
    let svg = renderSvg()
    let newSection=`
      <div id="section-${newId}" data-element-order="${newCount}" class="relative w-full flex flex-col justify-center items-center border border-gray-400 py-4" style="padding:5px;">
        <div type="button" class="bg-blue-400 rounded-full absolute right-0 top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-body-${newId}" data-dropdown-placement="right-end">
          ${svg}
        </div>

        <!-- Body Collapse -->
        <div id="wrapper-section-${newId}" data-element-count="1" class="flex justify-start items-center flex-col">
          <div data-element-order="1" style="position:relative;display:flex;justify-content:center;align-items:center;flex-direction:column;">
            <div type="button" class="bg-white right-[-1.3rem] top-0 rounded-full absolute z-10 cursor-pointer" data-dropdown-toggle="dropdown-field-${newId}-1" data-dropdown-placement="right-end">
              ${svg}    
            </div>
            <div id="field-${newId}-1" style="" class="border border-b-1 border-gray-500 px-1 max-w-[100%] scroll-hidden overflow-scroll" contenteditable="true">
              text
            </div>
          </div>  
        </div>
      </div>
    `
    //hidden dropdwon
    event.target.parentElement.parentElement.parentElement.classList.add('hidden')

    //inisialisasi dropdown
    let newDropdown=event.target.parentElement.parentElement.parentElement.cloneNode(true)
    newDropdown.id=`dropdown-body-${newId}`
    newDropdown.querySelectorAll('[id]').forEach(element => {
      
      let old = element.id.split('-')
      if(old[2] === 'in'){
        element.id = `${old.slice(0,2).join('-')}-in-${newId}`
      }else{
        element.id = `${old.slice(0,2).join('-')}-${newId}`
      }
    })
    //html dropdown
    let fieldDropdown = `
      <div id="dropdown-field-${newId}-1" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            <li>
                <a id="up-field-${newId}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
            </li>
            <li>
                <a id="down-field-${newId}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
            </li>
            <li>
                <a id="copy-field-${newId}-1" class="cursor-pointer text-blue-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Duplikat</a>
            </li>
            <li>
                <a id="delete-field-${newId}-1" class="cursor-pointer text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a>
            </li>
        </ul>
      </div>
    `
    //inisialisasi html
    const webpageSectionAccordion= getEl(`webpage-section-${idParts.find(part => !isNaN(part))}`)
    if(!webpageSectionAccordion)return

    webpageSectionAccordion.insertAdjacentHTML('beforeend',fieldDropdown)
    webpageSectionAccordion.appendChild(newDropdown) 

    const bodyAccordion = getEl(`body-${idPrefix}`)
    if(!bodyAccordion) return

    bodyAccordion.insertAdjacentHTML('beforeend', newSection)

    //push new array
    webpageDb.push ({
      id: `section-${newId}`,
      type: 'section-accordion',
      action:'new-add',
      element_order: `${newCount}`,
      element_count: '1'
    },
    {
      id: `field-${newId}-1`,
      type: 'field',
      action:'new-add',
      style: '',
      element_order: 1,
      content: 'test'
    })
    
    //update element count to parent section
    const btnHeading = webpageDb.find(item=>item.id=== `btn-heading-${idPrefix}`)

    if(!btnHeading) {
      window.dispatchEvent(new CustomEvent('notif-pesan', { 
        detail: { pesan: 'heading accordion tidak ditemukan', status:false} 
      }));
      return;
    }

    btnHeading.element_count=newCount
    btnHeading.action=updateActionProperty(btnHeading.action,'update')

  }else{
    const webpage = getEl('webpage')
    if(!webpage)return

    let elementCount = parseInt(webpage.dataset.elementCount)
    let newCount=handleElementCount(webpage,elementCount)
    webpage.dataset.elementCount = newCount
    
    webpageDb.push ({
        id: `webpage-section-${newCount}`,
        type: 'section',
        style: 'min-height:100dvh;position:relative;background-color:rgba(231,231,231,1);justify-content:start;align-items:center;',
        element_order: `${newCount}`,
        element_count: '0',
        action:'new-add'
    })

    newSection =`
        <div id="webpage-section-${newCount}" data-element-order="${newCount}" class="bg-gray-200 flex flex-col justify-center items-center border border-gray-700 z-10" style="position:relative;min-height:100dvh;">
          <div class="bg-white rounded-full absolute right-1 top-1 z-20 cursor-pointer" data-dropdown-toggle="dropdown-section-${newCount}" data-dropdown-placement="right-end">
              ${renderSvg()}                
          </div>
          <div id="dropdown-section-${newCount}" data-accordion="open" class="z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-0 border-b-1 border-gray-500 " aria-labelledby="dropdownDefaultButton">
                <li>
                    <a id="add-section-${newCount}" class="font-bold block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Section</a>
                </li>
                <li>
                    <a id="up-section-${newCount}" class="font-bold block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
                </li>
                <li>
                    <a id="down-section-${newCount}" class="font-bold block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
                </li>
                <li>
                    <a id="copy-section-${newCount}" class="text-blue-600 font-bold block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a>
                </li>
                <li>
                    <a id="delete-section-${newCount}" class="font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete Section</a>
                </li>
            </ul>
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li>
                    <a id="add-field-element-section-${newCount}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
                </li>
                <li>
                    <a id="add-modal-element-section-${newCount}" class=" block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modal</a>
                </li>
                <li>
                    <a id="add-accordion-element-section-${newCount}" class=" block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Accordion</a>
                </li>
                <li>
                    <a id="add-carousel-element-section-${newCount}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
                </li>
            </ul>
          </div>
          
          <div id="editor-container-section-${newCount}" data-element-count="0" class="p-2 py-4 w-full flex flex-col flex-1" style="justify-content:start;align-items:center;"></div>
        </div>
    `

    const footerSection = webpage.querySelector('[id="webpage-section-footer"]')
    if(!footerSection) {
      window.dispatchEvent(new CustomEvent('notif-pesan', { 
        detail: { pesan: 'footer section tidak ditemukan', status:false} 
      }));
      return;
    }

    footerSection.insertAdjacentHTML('beforebegin', newSection)

    webpageDbParentSection[0].element_count = newCount
    webpageDbParentSection[0].action =  updateActionProperty(webpageDbParentSection[0].action, 'update')
    
    globals.webpageDb=webpageDb
    globals.webpageDbParentSection=webpageDbParentSection
  }

  globals.isFormDirty = true

  setTimeout(() => {
      try {
        initFlowbite();
      } catch (error) {
          console.error('❌ Gagal menginisialisasi Dropdown:');
      }
  }, 100); 
} 

const copySection=(idSection, mode="all", event)=>{
  try {
    webpageDb=globals.webpageDb
    webpageDbParentSection=globals.webpageDbParentSection

    let sectionId = idSection
    let sectionEl
      
    if(idSection.includes('accordion')){
      sectionEl = getEl(sectionId)
    }else{
      sectionEl = getEl(`webpage-${sectionId}`)
    }

    if (!sectionEl)return false;
    

    const container = sectionEl.parentElement;
    if (!container) {

      window.dispatchEvent(new CustomEvent('notif-pesan', { 
        detail: { pesan: 'container parent accordion tidak ditemukan', status:false} 
      }));

      return false;
    }

    // hitung count baru & simpan
    const countNumber = parseInt(container.dataset.elementCount)
    let newCount=handleElementCount(container, countNumber)
    container.dataset.elementCount = newCount
      
    //=========================================
    //duplikat elemen section
    //=========================================
    const sectionCopy = sectionEl.cloneNode(true);

    // buat id baru dengan mengganti angka terakhir
    const oldSecId = sectionEl.id;
    const newSecId = generateUniqueId(sectionEl.id, container);
    sectionCopy.id = newSecId;

    // update section attributes
    function updateSectionAttributes(sectionCopyElement, oldSecId, newSecId) {
      const oldSuffix = oldSecId.split('-').slice(1).join('-');
      const newSuffix = newSecId.split('-').slice(1).join('-');

      // Ambil semua elemen di dalam modal yang disalin
      sectionCopyElement.querySelectorAll('*').forEach(el => {
        // 1️⃣ Cek setiap atribut
        for (const attr of el.getAttributeNames()) {
          const val = el.getAttribute(attr);
          if (!val || typeof val !== 'string') continue;

          // 2️⃣ Kalau value mengandung ID lama, ganti jadi ID baru
          if (arraySubsequenceMatch(val.split('-'), oldSuffix.split('-'))) {
            const newVal = replaceIdSuffix(val,oldSuffix,newSuffix);
            el.setAttribute(attr, newVal);
          }
        }

        // 3️⃣ Kalau ID-nya sendiri mengandung substring lama, ganti juga
        if (el.id && arraySubsequenceMatch(el.id.split('-'), oldSuffix.split('-'))) {
          const newId = replaceIdSuffix(el.id,oldSuffix,newSuffix)

          // Update id di DOM
          el.id = newId;

          // 4️⃣ Update juga di database (webpageDb)
          const originalField = webpageDb.find(f => f.id === el.id);
          if (originalField) {
            const cloned = structuredClone(originalField);
            cloned.id = newId;
            cloned.action = 'new-add';
            
            if(cloned.file){
              delete cloned.file
            }
  
            webpageDb.push(cloned);
          }
        }
      });
    }
      
    // set element order to section copy
    const originalOrder = parseInt(sectionCopy.dataset.elementOrder || '0', 10);
    const newOrderBase = originalOrder + 1;
    sectionCopy.dataset.elementOrder = newOrderBase
    
    //=========================================
    // update element_order pada sibling
    //=========================================
    Array.from(container.children).forEach(el => {
      const currentOrder = parseInt(el.dataset?.elementOrder || '0', 10);
      if (isNaN(currentOrder)) return;

      if (currentOrder >= newOrderBase) {
        let updatedOrder = currentOrder + 1;

        el.dataset.elementOrder = String(updatedOrder);

        // update ke webpageDb
        let id = el.id;
        if (!id) {
          const childWithId = el.querySelector('[id^="field-"]');
          if (!childWithId) {
            window.dispatchEvent(new CustomEvent('notif-pesan', { 
              detail: { pesan: 'child with id field copy section tidak ditemukan', status:false} 
            }));
            return
          }

          id = childWithId.id;
        }

        if (!id) return;

        const idx = webpageDb.findIndex(f => f.id === id);
        if (idx !== -1) {
          webpageDb[idx].element_order = String(updatedOrder);
          webpageDb[idx].action = updateActionProperty(webpageDb[idx].action, 'update');
        }
      }
    });

    sectionEl.insertAdjacentElement('afterend', sectionCopy);

    // remove listener init status
    sectionCopy.removeAttribute('data-listener-added')
    sectionCopy
      .querySelectorAll('[data-listener-added]')
      .forEach(el => el.removeAttribute('data-listener-added'));

    //=========================================
    // copy Element di dalam section
    //=========================================
    let elementSection 
    if(idSection.includes('accordion')){
      elementSection = sectionEl.querySelectorAll(`[id^="wrapper-section"]`)
    }else{
      elementSection = sectionEl.querySelectorAll(`[id^="editor-container"]`)
    }

    if(!elementSection){
      window.dispatchEvent(new CustomEvent('notif-pesan', { 
        detail: { pesan: 'elementSection copySection tidak ditemukan', status:false} 
      }));
      return
    }

    elementSection.forEach(wrapper=>{
      Array.from(wrapper.children).forEach(el=>{
        if(el.id.startsWith('modal')){
          copyModal(el.id, 'body', newSecId.split('-').slice(1).join('-'), oldSecId.split('-').slice(1).join('-'))
        }
      })
    })

    updateSectionAttributes(sectionCopy, oldSecId, newSecId)

    //=========================================
    // Duplikasi elemen dan semua elemen di webpageDb yang terkait dengan section
    //=========================================
    const targetId=oldSecId.split('-').slice(1).join('-')
    const relatedObjects = webpageDb.filter(obj => arraySubsequenceMatch(obj.id.split('-'), targetId.split('-')));
    relatedObjects.forEach(originalObj => {
      const clonedObj = deepClone(originalObj);
      if(clonedObj.action == 'delete'){
        return
      }
      if(clonedObj.file){
        delete clonedObj.file
      }

      clonedObj.id = replaceIdSuffix(clonedObj.id, oldSecId.split('-').slice(1).join('-'), newSecId.split('-').slice(1).join('-'));
      clonedObj.action = 'new-add';

      if (clonedObj.id.startsWith('webpage') || clonedObj.id.startsWith('section')) {
        clonedObj.element_order = String(newOrderBase);
      }
      webpageDb.push(clonedObj);
    });   

    //=========================================
    //update element count di webpageDb
    //=========================================
    if (container.id.startsWith('wrapper-section-accordion')) {
      const containerField = webpageDb.find(f => f.id === container.id.split('-').slice(1).join('-'));
      if (!containerField) {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: 'containerField tidak ditemukan', status:false} 
        }));
        return
      }

      containerField.element_count = newCount;
      containerField.action =  updateActionProperty(containerField.action, 'update');

    }else if(container.id.startsWith('editor')){
      const containerField = webpageDb.find(f => f.id === `webpage-section-${container.id.split('-').find(part => !isNaN(part))}`);
      if (!containerField) {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: 'containerField tidak ditemukan', status:false} 
        }));
        return
      }

      containerField.element_count = newCount;
      containerField.action =  updateActionProperty(containerField.action, 'update');
    
    }else if(container.id.startsWith('webpage')){
      const containerField = webpageDbParentSection.find(f => f.id === `webpage`);
      if (!containerField) {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: 'containerField tidak ditemukan', status:false} 
        }));
        return
      }

      containerField.element_count = newCount;
      containerField.action =  updateActionProperty(containerField.action, 'update');

    }else if(container.id.startsWith('body-accordion')){
      const containerField = webpageDb.find(f => f.id === `btn-heading-${container.id.split('-').slice(1).join('-')}`);
      if (!containerField) {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: 'containerField tidak ditemukan', status:false} 
        }));
        return
      }

      containerField.element_count = newCount;
      containerField.action =  updateActionProperty(containerField.action, 'update');
    
    }else{
      const containerField = webpageDb.find(f => f.id === container.id);
      if (!containerField) {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: 'containerField tidak ditemukan', status:false} 
        }));
        return
      }
      
      containerField.element_count = newCount;
      containerField.action =  updateActionProperty(containerField.action, 'update');
    }

    // =======================================
    // Duplikat body Dropdowns
    // =======================================
    let dropdownToggle
    if(idSection.includes('accordion')){
      dropdownToggle = sectionEl.querySelectorAll(`[data-dropdown-toggle]`)
    }else{
      dropdownToggle = sectionCopy.querySelectorAll(`[data-dropdown-toggle]`)
    }

    if(!dropdownToggle){
      window.dispatchEvent(new CustomEvent('notif-pesan', { 
        detail: { pesan: 'dropdownToggle section copy tidak ditemukan', status:false} 
      }));
      return
    }
    
    dropdownToggle.forEach(dropdown=>{
      let bodyDropdown = getEl(dropdown.dataset.dropdownToggle)
      if(!bodyDropdown) return

      bodyDropdown.dataset.initialized = ''; 
      bodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';

      if(idSection.includes('accordion')){
        let copyBodyDropdown = bodyDropdown.cloneNode(true)
        copyBodyDropdown.id = replaceIdSuffix(copyBodyDropdown.id, oldSecId.split('-').slice(1).join('-'), newSecId.split('-').slice(1).join('-'))
        
        copyBodyDropdown.querySelectorAll('[id]').forEach(el => {
          el.id = replaceIdSuffix(el.id, oldSecId.split('-').slice(1).join('-'),newSecId.split('-').slice(1).join('-'))
        });

        bodyDropdown.insertAdjacentElement('afterend', copyBodyDropdown)
      }
    }) 

    event.target.parentElement.parentElement.parentElement.className="w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700"

    // inisialisasi dropdown baru: coba id dropdown baru dari btnCopy's toggles
    const anyToggle = sectionCopy.querySelectorAll('[data-dropdown-toggle]');
    if (!anyToggle) {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: 'anyToggle copysection tidak ditemukan delete head', status:false} 
        }));
        return
    }else if(anyToggle){
      anyToggle.forEach(target=>{
        const newDropdownTarget = target.getAttribute('data-dropdown-toggle');
        dropdownInitialized('', newDropdownTarget);
      })
    }
    globals.isFormDirty = true
    globals.webpageDb=webpageDb
    globals.webpageDbParentSection=webpageDbParentSection
    // init accordion
    setTimeout(() => {
      try {
        initFlowbite();
      } catch (error) {
        console.error('❌ Gagal inisialisasi accordion');
      }
    }, 100);

    return true;
  } catch (e) {
    console.error('duplicateModal error');
    return false;
  }
}

export { 
  createSection, 
  createSectionFooter, 
  createSectionAccordion, 
  addSection,
  copySection
}