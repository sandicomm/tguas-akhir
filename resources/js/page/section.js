import { globals } from './globals.js';
import { replaceTrailingNumber,deepClone } from './utils/utilsDuplikatFunction.js';
import { copyModal } from './modal.js';
import { copyAccordion } from './accordion.js';
import { dropdownInitialized } from './utils/dropdownInit.js';
import { renderSvg } from './utils/svgEdit.js';
import { initFlowbite } from 'flowbite';

// ======== updateContent ========
import { updateActionProperty } from './utils/updateContent.js';

let webpageDb=  globals.webpageDb, param=globals.param
let webpageDbParentSection=globals.webpageDbParentSection

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

const createSection = (idPrefix,borderWave,order,count,style)=>{
    let section=``
    let dropdownSection = `
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
            </ul>`
    let dropdownElement = `
             <li>
                  <a id="add-field-element-${idPrefix}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
              </li>
              <li>
                  <a id="add-video-element-${idPrefix}" class=" block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Video</a>
              </li>
              <li>
                  <a id="add-modal-element-${idPrefix}" class=" block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modal</a>
              </li>
              <li>
                  <a id="add-accordion-element-${idPrefix}" class=" block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Accordion</a>
              </li>
              <li>
              <a id="add-carousel-element-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
              </li>`

    if(param.includes('prolog') || idPrefix.includes('footer')){
      dropdownSection = ``
      dropdownElement=`
         <li>
            <a id="add-field-element-${idPrefix}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
        </li>`
    }
    let wave=''
    if(borderWave.length > 0){
      wave=borderWave[0].style
    }
    console.log('wave:', wave)
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

    section=`
      <div id="webpage-${idPrefix}" data-element-order="${order}" class="bg-gray-200 flex flex-col justify-center items-center border border-gray-700" style="${styleWebpage}">
        <div class="bg-white rounded-full absolute right-1 top-1 z-30 cursor-pointer" data-dropdown-toggle="dropdown-${idPrefix}" data-dropdown-placement="right-end">
          ${renderSvg()}               
        </div>
  
        <div id="dropdown-${idPrefix}" data-accordion="open" class="z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          ${dropdownSection}
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              ${dropdownElement}
          </ul>
        </div>
    
        <div id="editor-container-${idPrefix}" data-element-count="${count}" class="p-8 w-full flex flex-col flex-1" style="${styleEditor}"></div>
        ${wave}
      </div>   
   `
   return section
}
const createSectionFooter = (idPrefix,order,count,style)=>{
let section=`
    <div id="webpage-${idPrefix}" data-element-order="${order}" class="bg-gray-200 flex flex-col justify-center items-center border border-gray-700" style="${style}">
    <div class="bg-white rounded-full absolute right-1 top-1 z-30 cursor-pointer" data-dropdown-toggle="dropdown-${idPrefix}" data-dropdown-placement="right-end">
        ${renderSvg()}                 
    </div>

    <div id="dropdown-${idPrefix}" data-accordion="open" class="z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            <li>
            <a id="add-field-element-${idPrefix}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">Field</a>
            </li>
        </ul>
    </div>

    <div id="editor-container-${idPrefix}" data-element-count="${count}" class="p-5 w-full flex flex-col flex-1" style="justify-content:start;align-items:start;"></div>
    <div class="bg-white text-center p-2 w-full text-sm">Copyright © 2024 Smart Health Diabetes. All Right Reserved</div>
    </div>   
`
return section
}
const createSectionAccordion = (section) => `
<div id="${section.id}" data-element-order="${section.element_order}" style="${section.style}" class="relative w-full flex flex-col justify-center items-center border border-gray-400">
    <div type="button" class="bg-blue-400 rounded-full absolute right-0 top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-body-${section.id.split('-').slice(1).join('-')}" data-dropdown-placement="right-end">
      ${renderSvg()}   
    </div>

    <div id="wrapper-${section.id}" data-element-count="${section.element_count}" class="w-full p-4 flex justify-start items-center flex-col">
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
      let elementCollapse = document.getElementById(`body-${idPrefix}`)
      let elementCount = parseInt(elementCollapse.dataset.elementCount)+1
      elementCollapse.dataset.elementCount = elementCount
      
      let svg = renderSvg()
      let newSection=`
        <div id="section-${idPrefix}-${elementCount}" data-element-order="${elementCount}" class="relative w-full flex flex-col justify-center items-center border border-gray-400" style="padding:20px;">
          <div type="button" class="bg-blue-400 rounded-full absolute right-0 top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-body-${idPrefix}-${elementCount}" data-dropdown-placement="right-end">
            ${svg}
          </div>

          <!-- Body Collapse -->
          <div id="wrapper-section-${idPrefix}-${elementCount}" data-element-count="1" class="flex justify-start items-center flex-col">
            <div data-element-order="1" style="position:relative;display:flex;justify-content:center;align-items:center;flex-direction:column;">
              <div type="button" class="bg-white right-[-1.3rem] top-0 rounded-full absolute z-10 cursor-pointer" data-dropdown-toggle="dropdown-field-${idPrefix}-${elementCount}-1" data-dropdown-placement="right-end">
                ${svg}    
              </div>
              <div id="field-${idPrefix}-${elementCount}-1" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" class="border border-b-1 border-gray-500 px-1 max-w-[100%] scroll-hidden overflow-scroll" contenteditable="true">
                text
              </div>
            </div>  
          </div>
        </div>
      `

      event.target.parentElement.parentElement.parentElement.classList.add('hidden')

      let newDropdown=event.target.parentElement.parentElement.parentElement.cloneNode(true)
      newDropdown.id=`dropdown-body-${idPrefix}-${elementCount}`
      newDropdown.querySelectorAll('[id]').forEach(element => {
        // console.log('element select', element)
        let newId = element.id.split('-')
        if(newId[2] === 'in'){
          element.id = `${newId.slice(0,2).join('-')}-in-${idPrefix}-${elementCount}`
        }else{
          element.id = `${newId.slice(0,2).join('-')}-${idPrefix}-${elementCount}`
        }
      })

      let fieldDropdown = `
        <div id="dropdown-field-${idPrefix}-${elementCount}-1" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              <li>
                  <a id="up-field-${idPrefix}-${elementCount}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
              </li>
              <li>
                  <a id="down-field-${idPrefix}-${elementCount}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
              </li>
              <li>
                  <a id="delete-field-${idPrefix}-${elementCount}-1" class="cursor-pointer text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a>
              </li>
          </ul>
        </div>
      `

      document.getElementById(`webpage-section-${idParts.find(part => !isNaN(part))}`).insertAdjacentHTML('beforeend',fieldDropdown)
      document.getElementById(`webpage-section-${idParts.find(part => !isNaN(part))}`).appendChild(newDropdown)
      
      document.getElementById(`body-${idPrefix}`).insertAdjacentHTML('beforeend', newSection)

      webpageDb.push ({
        id: `section-${idPrefix}-${elementCount}`,
        type: 'section-accordion',
        action:'new-add',
        element_order: `${elementCount}`,
        element_count: '1'
      },
      {
        id: `field-${idPrefix}-${elementCount}-1`,
        type: 'field',
        action:'new-add',
        style: 'ol{list-style-type:decimal;}ul{list-style-type:disc;}',
        element_order: 1,
        content: 'test'
      })

      webpageDb.forEach(page =>{
        if(page.id === `btn-heading-${idPrefix}`){
          page.element_count = elementCount
          page.action='update'
        }
      })

    }else{
      const webpage = document.getElementById(`webpage`)
      let elementCount = parseInt(webpage.getAttribute('data-element-count'))
      elementCount += 1
      webpage.dataset.elementCount = elementCount
      
      webpageDb.push ({
          id: `webpage-section-${elementCount}`,
          type: 'section',
          style: 'min-height:100dvh;position:relative;background-color:rgba(231,231,231,1);',
          element_order: `${elementCount}`,
          element_count: '0',
          action:'new-add'
      })

      newSection =`
          <div id="webpage-section-${elementCount}" data-element-order="${elementCount}" class="bg-gray-200 flex flex-col justify-center items-center border border-gray-700" style="position:relative;min-height:100dvh;">
            <div class="bg-white rounded-full absolute right-1 top-1 z-50 cursor-pointer" data-dropdown-toggle="dropdown-section-${elementCount}" data-dropdown-placement="right-end">
                ${renderSvg()}                
            </div>
            <div id="dropdown-section-${elementCount}" data-accordion="open" class="z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-0 border-b-1 border-gray-500 " aria-labelledby="dropdownDefaultButton">
                  <li>
                      <a id="add-section-${elementCount}" class="font-bold block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Section</a>
                  </li>
                  <li>
                      <a id="up-section-${elementCount}" class="font-bold block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
                  </li>
                  <li>
                      <a id="down-section-${elementCount}" class="font-bold block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
                  </li>
                  <li>
                      <a id="delete-section-${elementCount}" class="font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete Section</a>
                  </li>
              </ul>
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                  <li>
                      <a id="add-field-element-section-${elementCount}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
                  </li>
                  <li>
                      <a id="add-video-element-section-${elementCount}" class=" block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Video</a>
                  </li>
                  <li>
                      <a id="add-modal-element-section-${elementCount}" class=" block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modal</a>
                  </li>
                  <li>
                      <a id="add-accordion-element-section-${elementCount}" class=" block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Accordion</a>
                  </li>
                  <li>
                      <a id="add-carousel-element-section-${elementCount}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
                  </li>
              </ul>
            </div>
            
            <div id="editor-container-section-${elementCount}" data-element-count="0" class="p-5 w-full flex flex-col flex-1" style="justify-content:start;align-items:center;"></div>
          </div>
      `

      webpage.insertAdjacentHTML('beforeend', newSection)

      webpageDbParentSection[0].element_count = elementCount
      webpageDbParentSection[0].action =  updateActionProperty(webpageDbParentSection[0].action, 'update')
      
      console.log(webpageDbParentSection, webpageDb)
      globals.webpageDb=webpageDb
      globals.webpageDbParentSection=webpageDbParentSection
    }

    setTimeout(() => {
        try {
          initFlowbite();
        } catch (error) {
            console.error('❌ Gagal menginisialisasi Dropdown:', error);
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
        sectionEl = document.getElementById(sectionId);
      }else{
        sectionEl = document.getElementById(`webpage-${sectionId}`);
      }

      if (!sectionEl) {
        console.error('button modal tidak ditemukan:', sectionId);
        return false;
      }

      const container = sectionEl.parentElement;
      if (!container) {
        console.error('container parent accordion tidak ditemukan');
        return false;
      }

      // hitung count baru & simpan
      const countNumber = (parseInt(container.dataset.elementCount || '0', 10) || 0) + 1;
      // console.log('awalan:', container, sectionEl, countNumber, parseInt(container.dataset.elementCount || '0', 10))

      // clone elemen (btn + modal body)
      const sectionCopy = sectionEl.cloneNode(true);

      // buat id baru dengan mengganti angka terakhir
      const oldSecId = sectionEl.id;
      const newSecId = replaceTrailingNumber(oldSecId, countNumber);
      // console.log('test',countNumber, {oldBtnId, oldModalId, newBtnId,newModalId})

      sectionCopy.id = newSecId;

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
              const newVal = val.replaceAll(oldSuffix, newSuffix);
              el.setAttribute(attr, newVal);
            }
          }

          // 3️⃣ Kalau ID-nya sendiri mengandung substring lama, ganti juga
          if (el.id && arraySubsequenceMatch(el.id.split('-'), oldSuffix.split('-'))) {
            const newId = el.id.replaceAll(oldSuffix, newSuffix);

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
      
      const originalOrder = parseInt(sectionCopy.dataset.elementOrder || '0', 10);
      const newOrderBase = originalOrder + 1;

      // update element order btnCopy: +1 dari original (jika ada)
      sectionCopy.dataset.elementOrder = String(newOrderBase);
      container.dataset.elementCount = String(countNumber);

      // 1) Perbarui element_order pada sibling (hanya direct children container)
      Array.from(container.children).forEach(el => {
        const currentOrder = parseInt(el.dataset?.elementOrder || '0', 10);
        if (isNaN(currentOrder)) return;

        if (currentOrder >= newOrderBase) {
          const updated = currentOrder + 1;
          el.dataset.elementOrder = String(updated);

          let id = el.id;

          if (!id) {
            const childWithId = el.querySelector('[id^="field-"]');
            if (childWithId) id = childWithId.id;
          }

          if (!id) return;

          const idx = webpageDb.findIndex(f => f.id === id);
          if (idx !== -1) {
            webpageDb[idx].element_order = String(updated);
            webpageDb[idx].action =  updateActionProperty(webpageDb[idx].action, 'update')
          }
        }
      });

      sectionEl.insertAdjacentElement('afterend', sectionCopy);

      let elementSection 
      if(idSection.includes('accordion')){
        elementSection = sectionEl.querySelectorAll(`[id^="wrapper-section"]`)
      }else{
        elementSection = sectionEl.querySelectorAll(`[id^="editor-container"]`)
      }

      // console.log(elementSection)

      elementSection.forEach(wrapper=>{
        Array.from(wrapper.children).forEach(el=>{
          if(el.id.startsWith('modal')){
            copyModal(el.id, 'body', newSecId.split('-').slice(1).join('-'), oldSecId.split('-').slice(1).join('-'))
          }else if(el.id.startsWith('accordion')){
            copyAccordion(el.id, 'dropdown')
          }
        })
      })

      updateSectionAttributes(sectionCopy, oldSecId, newSecId)

      // ✅ Duplikasi semua elemen di webpageDb yang terkait dengan oldBtnId
      const targetId=oldSecId.split('-').slice(1).join('-')
      const relatedObjects = webpageDb.filter(obj => arraySubsequenceMatch(obj.id.split('-'), targetId.split('-')));
      relatedObjects.forEach(originalObj => {
        const clonedObj = deepClone(originalObj);

        if(clonedObj.file){
          delete clonedObj.file
        }

        clonedObj.id = clonedObj.id.replaceAll(oldSecId.split('-').slice(1).join('-'), newSecId.split('-').slice(1).join('-'));
        clonedObj.action = 'new-add';

        if (clonedObj.id.startsWith('webpage') || clonedObj.id.startsWith('section')) {
          clonedObj.element_order = String(newOrderBase);
        }
        webpageDb.push(clonedObj);
      });   

      //update element count container
      // console.log('container', container, `btn-heading-${container.id.split('-').slice(1).join('-')}`,countNumber)
      if (container.id.startsWith('wrapper-section-accordion')) {
        const containerField = webpageDb.find(f => f.id === container.id.split('-').slice(1).join('-'));
        if (containerField) {
          containerField.element_count = countNumber;
          containerField.action =  updateActionProperty(containerField.action, 'update');
        }
      }else if(container.id.startsWith('editor')){
        const containerField = webpageDb.find(f => f.id === `webpage-section-${container.id.split('-').find(part => !isNaN(part))}`);
        if (containerField) {
          containerField.element_count = countNumber;
          containerField.action =  updateActionProperty(containerField.action, 'update');
        }
      }else if(container.id.startsWith('webpage')){
        const containerField = webpageDbParentSection.find(f => f.id === `webpage`);
        if (containerField) {
          containerField.element_count = countNumber;
          containerField.action =  updateActionProperty(containerField.action, 'update');
        }
      }else if(container.id.startsWith('body-accordion')){
        const containerField = webpageDb.find(f => f.id === `btn-heading-${container.id.split('-').slice(1).join('-')}`);
        if (containerField) {
          containerField.element_count = countNumber;
          containerField.action =  updateActionProperty(containerField.action, 'update');
        }
      }else{
        const containerField = webpageDb.find(f => f.id === container.id);
        if (containerField) {
          containerField.element_count = countNumber;
          containerField.action =  updateActionProperty(containerField.action, 'update');
        }
      }

      // Duplikat body Dropdowns
      let dropdownToggle
      if(idSection.includes('accordion')){
        dropdownToggle = sectionEl.querySelectorAll(`[data-dropdown-toggle]`)
      }else{
        dropdownToggle = sectionCopy.querySelectorAll(`[data-dropdown-toggle]`)
      }
      
      dropdownToggle.forEach(dropdown=>{
        let bodyDropdown = document.getElementById(dropdown.dataset.dropdownToggle)
        
        bodyDropdown.dataset.initialized = ''; 
        bodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';

        if(idSection.includes('accordion')){
          // console.log('accordion includes',oldSecId, newSecId)
          let copyBodyDropdown = bodyDropdown.cloneNode(true)
          copyBodyDropdown.id = copyBodyDropdown.id.replaceAll(oldSecId.split('-').slice(1).join('-'), newSecId.split('-').slice(1).join('-'));
          
          copyBodyDropdown.querySelectorAll('[id]').forEach(el => {
            el.id = el.id.replaceAll(oldSecId.split('-').slice(1).join('-'),newSecId.split('-').slice(1).join('-'))
          });

          bodyDropdown.insertAdjacentElement('afterend', copyBodyDropdown)
        }
      }) 

      event.target.parentElement.parentElement.parentElement.className="w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700"

      // inisialisasi dropdown baru: coba id dropdown baru dari btnCopy's toggles
      const anyToggle = sectionCopy.querySelectorAll('[data-dropdown-toggle]');
      if (anyToggle) {
        anyToggle.forEach(target=>{
          // console.log('bef inisiali',target)
          const newDropdownTarget = target.getAttribute('data-dropdown-toggle');
          dropdownInitialized('', newDropdownTarget);
        })
      }

      console.log('duplicated section', { oldSecId, newSecId}, webpageDb, webpageDbParentSection);
      globals.webpageDb=webpageDb
      globals.webpageDbParentSection=webpageDbParentSection
      // init accordion
      setTimeout(() => {
        try {
          initFlowbite();
        } catch (error) {
          console.error('❌ Gagal inisialisasi accordion', error);
        }
      }, 100);

      return true;
  } catch (e) {
    console.error('duplicateModal error', e);
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