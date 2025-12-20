import { globals } from './globals.js';
import { replaceTrailingNumber } from './utils/utilsDuplikatFunction.js';
import { dropdownInitialized } from './utils/dropdownInit.js';
import { renderSvg } from './utils/svgEdit.js';
// ======== updateContent ========
import { updateActionProperty } from './utils/updateContent.js';

import {arraySubsequenceMatch, generateUniqueId, handleElementCount, replaceIdSuffix} from './utils/elementNumberingId.js'

let webpageDb=  globals.webpageDb

const createVideo = (page) => `
<div id="${page.id}" data-element-order="${page.element_order}" style="${page.style}" class="border border-b-1 border-gray-500 max-w-[100%] cursor-pointer relative">
    <input type="file" id="input-${page.id}" accept="video/*" class="hidden">
    <div type="button" class="bg-white rounded-full absolute right-[-1.7rem] top-0 z-30 cursor-pointer" data-dropdown-toggle="dropdown-${page.id}" data-dropdown-placement="right-end">
      ${renderSvg()}
    </div>

    <label id="label-input-${page.id}" for="input-${page.id}" class="w-full h-auto hover:bg-gray-300 flex justify-center items-center">
    ${
        page.content
        ? `<video controls 
            preload="auto"
            loading="lazy" src="${page.content}"></video>`
        :`<svg class="w-12 h-12 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Zm0 0-4 4m5 0H4m1 0 4-4m1 4 4-4m-4 7v6l4-3-4-3Z"/>
            </svg>`
    }
    </label>
</div>
`
const createDropdownVideo = (idPrefix) => `
<div id="dropdown-${idPrefix}" data-accordion="open" class="w-20 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
    <li><label for="input-${idPrefix}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Set Video</label></li>
    <li><a id="down-${idPrefix}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
    <li><a id="up-${idPrefix}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
    <li><a id="copy-${idPrefix}" class="text-blue-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a></li>
    </ul>
    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
    <li><a id="delete-${idPrefix}" class="block px-4 py-2 font-extrabold text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a></li>
    </ul>
</div>
`

const addVideo = (event)=>{
  webpageDb=globals.webpageDb
  
  const idParts = event.target.id.split('-');
  const videoField = document.createElement('div');
  let idAppendVideo, idPrefix, fieldNumber=0,bodyAppend, bodyDropdown

  const createVideoFieldHTML = (idPrefix) => `
    <input type="file" id="input-${idPrefix}" accept="video/*" class="hidden">
    <div type="button" class="bg-white rounded-full absolute right-[-1.7rem] top-0 z-30 cursor-pointer" data-dropdown-toggle="dropdown-${idPrefix}" data-dropdown-placement="right-end">
      ${renderSvg()}  
    </div>
    <label id="label-input-${idPrefix}" for="input-${idPrefix}" class="w-full h-auto hover:bg-gray-300 flex justify-center items-center">
      <svg class="w-12 h-12 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Zm0 0-4 4m5 0H4m1 0 4-4m1 4 4-4m-4 7v6l4-3-4-3Z"/>
      </svg>
    </label>`;

  const createBodyDropdown = (idPrefix) => `
    <div id="dropdown-${idPrefix}" data-accordion="open" class="w-20 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
        <li><label for="input-${idPrefix}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Set Video</label></li>
        <li><a id="down-${idPrefix}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
        <li><a id="up-${idPrefix}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
        <li><a id="copy-${idPrefix}" class="text-blue-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a></li>
      </ul>
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
        <li><a id="delete-${idPrefix}" class="block px-4 py-2 font-extrabold text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a></li>
      </ul>
    </div>
  `

  if(idParts[2] === 'accordion'){
    idAppendVideo = `wrapper-section-${idParts.slice(2, idParts.length).join('-')}`;
    bodyAppend = document.getElementById(idAppendVideo);

    fieldNumber = handleElementCount(bodyAppend,  parseInt(bodyAppend.dataset.elementCount))
    bodyAppend.dataset.elementCount = fieldNumber;
    
    idPrefix =  generateUniqueId(`${idParts.slice(1).join('-')}-${fieldNumber}`,bodyAppend)
    videoField.id = idPrefix;

    bodyDropdown = createBodyDropdown(idPrefix);
    
  }else if(idParts[2] === 'modal'){
    idAppendVideo = `body-${idParts.slice(2, idParts.length).join('-')}`;
    bodyAppend = document.getElementById(idAppendVideo);

    fieldNumber = handleElementCount(bodyAppend,  parseInt(bodyAppend.dataset.elementCount))
    bodyAppend.dataset.elementCount = fieldNumber;
    
    idPrefix = generateUniqueId(`${idParts.slice(1).join('-')}-${fieldNumber}`,bodyAppend)
    videoField.id = idPrefix;

  }else{
    idAppendVideo = `editor-container-section-${idParts[4]}`;
    const section = document.getElementById(idAppendVideo)

    fieldNumber = handleElementCount(section,  parseInt(section.dataset.elementCount))
 
    section.dataset.elementCount = fieldNumber
    
    idPrefix =  generateUniqueId(`${idParts.slice(1).join('-')}-${fieldNumber}`,section)
    videoField.id = idPrefix;

  }

  bodyDropdown = createBodyDropdown(idPrefix);

  if(idParts.includes('modal')){
    document.getElementById(`parent-${idParts.slice(2, idParts.length).join('-')}`).insertAdjacentHTML('afterbegin',bodyDropdown)
  }else{
    document.getElementById(`webpage-section-${idParts.find(part => !isNaN(part))}`).insertAdjacentHTML('beforeend', bodyDropdown)
  }

  // Inject the template and styles
  videoField.dataset.elementOrder = fieldNumber;
  videoField.classList.add('border', 'border-b-1', 'border-gray-500', 'max-w-[100%]', 'cursor-pointer', 'relative');
  videoField.style.maxWidth = "200px";

  videoField.innerHTML += createVideoFieldHTML(idPrefix);

  // Append to DOM
  document.getElementById(idAppendVideo)?.appendChild(videoField);
  dropdownInitialized('',`dropdown-${idPrefix}`);

  webpageDb.push({
    id: idPrefix,
    type: 'video',
    style: videoField.getAttribute('style'),
    element_order: fieldNumber,
    action:'new-add'
  });

  let wrapperId=''
  if(idParts.filter(part => !isNaN(part)).length == 1){
    wrapperId = `webpage-section-${idParts.find(part => !isNaN(part))}`
  }else if(idParts.join('-').includes('accordion') && !idParts.includes('modal')){
    wrapperId = `section-${idParts.slice(2).join('-')}`
  }else if(idParts.join('-').includes('modal')){
    wrapperId = `body-${idParts.slice(2).join('-')}`
  }
  const item = webpageDb.find(item=>item.id === wrapperId)

  if(item){
    item.element_count=parseInt(item.element_count)+1
    item.action = updateActionProperty(item.action, 'update')
  }

  globals.webpageDb=webpageDb

}
const copyVideo=(idParts)=>{
  webpageDb=globals.webpageDb
    // --- 1️⃣ Ambil elemen sumber ---
    const element = document.getElementById(idParts.slice(1).join('-'));
    if (!element) {
      console.error('Element asal tidak ditemukan:', idParts.slice(1).join('-'));
      return;
    }
    
    const container = element.parentElement;
    if (!container) {
      console.error('Container tidak ditemukan');
      return;
    }

    const oldId = element.id;
    const countNumber = handleElementCount(container, parseInt(container.dataset.elementCount || '0', 10));
    container.dataset.elementCount = countNumber;

    // --- 2️⃣ Buat ID baru dan clone node ---
    const newId = generateUniqueId(oldId,container);
    const copyElement = element.cloneNode(true);

    copyElement.dataset.elementOrder = String(parseInt(copyElement.dataset.elementOrder || '0', 10) + 1);

    // Update ID field utama
    copyElement.id= newId

    // --- 3️⃣ Update element order di level yang sama ---
    const newOrderBase = parseInt(copyElement.dataset.elementOrder, 10);
    Array.from(container.children).forEach(el => {
      const order = parseInt(el.dataset.elementOrder || '0', 10);
      if (order >= newOrderBase) {
          const newOrder = order + 1;
          el.dataset.elementOrder = String(newOrder);

          // cari id field dalam elemen kalau belum ada
          let id = el.id;
          if (!id) {
          const childField = el.querySelector('[id^="field-"]');
          if (childField) id = childField.id;
          }

          // update di webpageDb
          if (id) {
            const idx = webpageDb.findIndex(f => f.id === id);
            if (idx !== -1) {
              webpageDb[idx].element_order = String(newOrder);
              webpageDb[idx].action =  updateActionProperty(webpageDb[idx].action, 'update')
            }
          }
      }
    });
 
    // --- 4️⃣ Fungsi bantu untuk update semua atribut yang mengandung ID lama ---
    function updateFieldAttributes(rootEl, oldSuffix, newSuffix) {
      rootEl.querySelectorAll('*').forEach(el => {
          for (const attr of el.getAttributeNames()) {
          const val = el.getAttribute(attr);
          if (!val || typeof val !== 'string') continue;
          if (arraySubsequenceMatch(val.split('-'), oldSuffix.split('-'))) {
              el.setAttribute(attr, val.replaceAll(oldSuffix, newSuffix));
          }
          }

          // Update ID dan duplikasi field di DB
          if (el.id && arraySubsequenceMatch(el.id.split('-'), oldSuffix.split('-'))) {
          const origId = el.id;
          const newId = origId.replaceAll(oldSuffix, newSuffix);

          el.id = newId;

          const originalField = webpageDb.find(f => f.id === origId);
          if (originalField) {
              const cloned = structuredClone(originalField);
              cloned.id = newId;
              cloned.action = 'new-add';
              webpageDb.push(cloned);
          }
          }
      });
    }

    updateFieldAttributes(copyElement, oldId, newId);

    // --- 6️⃣ Sisipkan hasil duplikasi ke DOM ---
    element.insertAdjacentElement('afterend', copyElement);

    copyElement.removeAttribute('data-listener-added')
    copyElement
      .querySelectorAll('[data-listener-added]')
      .forEach(el => el.removeAttribute('data-listener-added'));

    // --- 5️⃣ Duplikasi dropdown body-nya ---
    if(!copyElement.querySelector(`[id*=modal]`)){
      const bodyDropdown = document.getElementById(`dropdown-${idParts.slice(1).join('-')}`);
      bodyDropdown.className= "w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700"
      if (bodyDropdown) {
          const copyBodyDropdown = bodyDropdown.cloneNode(true);
          copyBodyDropdown.id = replaceIdSuffix(copyBodyDropdown.id, oldId, newId)
          copyBodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';
          copyBodyDropdown.setAttribute('data-initialized', '');

          updateFieldAttributes(copyBodyDropdown, oldId, newId);

       
          bodyDropdown.insertAdjacentElement('afterend', copyBodyDropdown)
      } else {
          console.warn('Dropdown body tidak ditemukan untuk:', oldId);
      }

    }else{
      const bodyDropdown = document.querySelector(`[id="dropdown-${idParts.slice(1).join('-')}"]`).cloneNode(true)
      bodyDropdown.setAttribute('data-initialized', '')
      bodyDropdown.setAttribute('class', 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700')
   
    }
    
    // --- 8️⃣ Update element_count di DB container ---
    if (container.id.startsWith('wrapper-section-accordion')) {
      const containerField = webpageDb.find(f => f.id === container.id.split('-').slice(1).join('-'));
      if (containerField) {
        containerField.element_count = countNumber;
        containerField.action =  updateActionProperty(containerField.action, 'update')
      }
    }else if(container.id.startsWith('editor')){
      const containerField = webpageDb.find(f => f.id === `webpage-section-${container.id.split('-').find(part => !isNaN(part))}`);
      if (containerField) {
        containerField.element_count = countNumber;
        containerField.action =  updateActionProperty(containerField.action, 'update')
      }
    }else{
      const containerField = webpageDb.find(f => f.id === container.id);
      if (containerField) {
        containerField.element_count = countNumber;
        containerField.action =  updateActionProperty(containerField.action, 'update')
      }
    }

    // --- 9️⃣ Duplikat entri utama ke database ---
    const originalField = webpageDb.find(f => f.id === oldId);
    if (originalField) {
      const clonedField = structuredClone(originalField);

      if(clonedField.file){
        delete clonedField.file
      }

      clonedField.id = newId;
      clonedField.action = 'new-add';
      clonedField.element_order = copyElement.dataset.elementOrder;
      webpageDb.push(clonedField);
    }
    dropdownInitialized('', `dropdown-${newId}`);
    globals.webpageDb=webpageDb
 
}
export { createVideo, createDropdownVideo, addVideo, copyVideo }