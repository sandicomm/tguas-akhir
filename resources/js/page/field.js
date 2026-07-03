import { globals } from './globals.js';
import { dropdownInitialized } from './utils/dropdownInit.js';
import { renderSvg } from './utils/svgEdit.js';
// ======== updateContent ========
import { updateActionProperty } from './utils/updateContent.js';

import {arraySubsequenceMatch, generateUniqueId, handleElementCount, replaceIdSuffix} from './utils/elementNumberingId.js'
// ======== Validation get element ==========
import { getEl } from './utils/validationGetElement.js';

let webpageDb=  globals.webpageDb, param=globals.param

const createField = (page,edit) =>{
    let field=''
    if(page){
      let svg

      if(edit){
        svg=renderSvg()
      }

      let dropdown= `
          <div type="button" class="bg-white rounded-full absolute right-[-0.5rem] top-[-0.5rem] z-0 cursor-pointer" data-dropdown-toggle="dropdown-${page.id}" data-dropdown-placement="right-end">   
            ${svg}      
          </div>`
      if(page.id.includes('carousel')){
        dropdown=''
        field = `
          <div id="${page.id}" ${edit ? 'contenteditable="true"' : ''} style="${page.style}" class="${edit ? 'border border-b-1 border-gray-500':''} p-1 max-w-[100%] max-h-[100%] scroll-hidden overflow-scroll" >${page.content ?? ''}</div>
        `
      }else{
        if(page.id.includes('accordion') && !page.id.includes('modal')){
          dropdown=`
          <div type="button" class="bg-white rounded-full absolute right-[-1.5rem] top-[1rem] z-0 cursor-pointer" data-dropdown-toggle="dropdown-${page.id}" data-dropdown-placement="right-end">   
            ${svg}      
          </div>`
        }
        field = `
          <div data-element-order="${page.element_order}" style="z-index:10;position:relative;display:flex;justify-content:center;align-items:center;flex-direction:column;">
            ${edit ? dropdown:''}
            <div id="${page.id}" ${edit ? 'contenteditable="true"' : ''} style="${page.style}" class="${edit ? 'border border-b-1 border-gray-500':''} p-1 max-w-[100%] max-h-[100%] scroll-hidden overflow-scroll" >${page.content ?? ''}</div>
          </div>
        `
      }
    }
    return field
}
const createDropdownField = (idPrefix)=>`
    <div id="dropdown-${idPrefix}" data-accordion="open" class="w-25 z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        <li>
            <a id="up-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
        </li>
        <li>
            <a id="down-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
        </li>
        <li>
            <a id="copy-${idPrefix}" class="cursor-pointer text-blue-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Duplikat</a>
        </li>
        <li>
            <a id="delete-${idPrefix}" class="cursor-pointer text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a>
        </li>
    </ul>
    </div>
`
const addField=(event)=>{
  webpageDb=  globals.webpageDb
  const idParts = event.target.id.split('-');
  let idAppendField, idPrefix, fieldNumber, bodyAppend, bodyDropdown

  const createFieldHTML = (idPrefix,fieldNumber)=>{
    let dropdown=``
    if(idPrefix.includes('accordion') && !idPrefix.includes('modal')){
      dropdown=`
        <div type="button" class="bg-white rounded-full absolute right-[-1.5rem] top-[1rem] z-0 cursor-pointer" data-dropdown-toggle="dropdown-${idPrefix}" data-dropdown-placement="right-end">   
          ${renderSvg()}      
        </div>`
    }else{
      dropdown=`
        <div type="button" class="bg-white rounded-full absolute right-[-0.5rem] top-[-0.5rem] z-0 cursor-pointer" data-dropdown-toggle="dropdown-${idPrefix}" data-dropdown-placement="right-end">   
          ${renderSvg()}      
        </div>`
    }
    return `<div data-element-order="${fieldNumber}" style="position:relative;display:flex;justify-content:center;align-items:center;flex-direction:column;">
      ${dropdown}
      <div id="${idPrefix}" contenteditable="true" style="" 
          class="border border-b-1 border-gray-500 p-1 max-w-[100%] scroll-hidden overflow-scroll">
          <font size="3">Type Here</font>
        </div>
    </div>
    `
  }
  let sectionId=''
  if(idParts[2] === 'accordion'){
    idAppendField = `wrapper-section-${idParts.slice(2,idParts.length).join('-')}`
    bodyAppend = getEl(idAppendField)

    if(!bodyAppend)return

    fieldNumber = handleElementCount(bodyAppend, bodyAppend.dataset.elementCount)

    sectionId = `section-${idParts.slice(2,idParts.length).join('-')}`

    bodyAppend.dataset.elementCount = fieldNumber
  
    idPrefix = generateUniqueId(`field-${idParts.slice(2, idParts.length).join('-')}-${fieldNumber}`, bodyAppend)

  }else if(idParts[2] === 'modal'){
    idAppendField = `body-${idParts.slice(2,idParts.length).join('-')}`

    sectionId = `body-${idParts.slice(2,idParts.length).join('-')}`

    bodyAppend = getEl(idAppendField)
    if(!bodyAppend)return
    
    fieldNumber = parseInt(bodyAppend.getAttribute('data-element-count'))+1

    bodyAppend.dataset.elementCount = fieldNumber
  
    idPrefix = generateUniqueId(`${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`, bodyAppend)

  }else{
    if(idParts.join('-').includes('prolog-web')){
      idAppendField = `editor-container-section-prolog-web-${idParts[6]}`

      bodyAppend = getEl(idAppendField)
      if(!bodyAppend) return

      sectionId = `webpage-section-prolog-web-${idParts[6]}`

      fieldNumber = parseInt(bodyAppend.dataset.elementCount)+1
      bodyAppend.dataset.elementCount = fieldNumber
      idPrefix = generateUniqueId(`field-${idParts.slice(2, idParts.length).join('-')}-${fieldNumber}`,bodyAppend)
      
    }else if(idParts.join('-').includes('prolog-emodul')){
      idAppendField = `editor-container-section-prolog-emodul-${idParts[6]}`

      bodyAppend = getEl(idAppendField)
      if(!bodyAppend)return

      sectionId = `webpage-section-prolog-emodul-${idParts[6]}`

      fieldNumber = parseInt(bodyAppend.dataset.elementCount)+1
      bodyAppend.dataset.elementCount = fieldNumber

      idPrefix = generateUniqueId(`field-${idParts.slice(2, idParts.length).join('-')}-${fieldNumber}`,bodyAppend)

    }else if(idParts.includes('footer')){
      idAppendField = `editor-container-section-footer`

      bodyAppend = getEl(idAppendField)
      if(!bodyAppend)return

      sectionId = `webpage-section-footer`

      fieldNumber = parseInt(bodyAppend.dataset.elementCount)+1
      bodyAppend.dataset.elementCount = fieldNumber

      idPrefix = generateUniqueId(`field-${idParts.slice(2, idParts.length).join('-')}-${fieldNumber}`,bodyAppend)

    }else{
      idAppendField = `editor-container-section-${idParts[4]}`

      bodyAppend = getEl(idAppendField)
      if(!bodyAppend)return

      sectionId = `webpage-section-${idParts[4]}`

      fieldNumber = parseInt(bodyAppend.dataset.elementCount)+1
      bodyAppend.dataset.elementCount = fieldNumber

      idPrefix = generateUniqueId(`field-${idParts.slice(2, idParts.length).join('-')}-${fieldNumber}`,bodyAppend)
    }
  }

  bodyDropdown=`
    <div id="dropdown-${idPrefix}" data-accordion="open" class="w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        <li>
            <a id="up-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
        </li>
        <li>
            <a id="down-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
        </li>
        <li>
            <a id="copy-${idPrefix}" class="cursor-pointer text-blue-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Duplikat</a>
        </li>
        <li>
            <a id="delete-${idPrefix}" class="cursor-pointer text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a>
        </li>
      </ul>
    </div>
  `
  
  if(idParts.includes('modal')){
    const modalAppendField = getEl(idAppendField)
    if(!modalAppendField)return
    
    modalAppendField.parentElement.parentElement.insertAdjacentHTML('beforeend', bodyDropdown)
  }else{
    if(idParts.join('-').includes('prolog-web')){
      const sectionPrologWeb =getEl(`webpage-section-prolog-web-${idParts.find(part => !isNaN(part))}`) 
      if(!sectionPrologWeb)return
      
      sectionPrologWeb.insertAdjacentHTML('beforeend', bodyDropdown)

    }else if(idParts.join('-').includes('prolog-emodul')){
      const sectionPrologEmodul =getEl(`webpage-section-prolog-emodul-${idParts.find(part => !isNaN(part))}`)
      if(!sectionPrologEmodul)return

      sectionPrologEmodul.insertAdjacentHTML('beforeend', bodyDropdown)

    }else if(idPrefix.includes('footer')){
      const sectionFooter =getEl(`webpage-section-footer`)
      if(!sectionFooter)return
      
      sectionFooter.insertAdjacentHTML('beforeend', bodyDropdown)

    }else{
      const sectionWebpage =getEl(`webpage-section-${idParts.find(part => !isNaN(part))}`)
      if(!sectionWebpage)return
      
      sectionWebpage.insertAdjacentHTML('beforeend', bodyDropdown)
    }
  }

  webpageDb.push({
    id: idPrefix,
    type: 'field',
    style: '',
    action:'new-add',
    content:'Field Text',
    element_order: fieldNumber
  });

  const section = webpageDb.find(item=>item.id===sectionId)
  if(section){
    section.element_count++
    section.action=updateActionProperty(section.action, 'update')
  }

  globals.webpageDb=webpageDb

  globals.isFormDirty = true

  const field = createFieldHTML(idPrefix,fieldNumber)

  const elAppendField = getEl(idAppendField)
  if(!elAppendField)return

  elAppendField.insertAdjacentHTML('beforeend',field);
  dropdownInitialized('',  `dropdown-${idPrefix}`)
}
const copyField = (idParts) => {
  webpageDb=  globals.webpageDb
  // --- 1️⃣ Ambil elemen sumber ---
  const element = getEl(idParts.slice(1).join('-'));
  if (!element)return;
  
  const parent = element.parentElement;
  const container = parent?.parentElement;
  if (!container) {
    return;
  }

  const oldId = element.id;
  const countNumber = (parseInt(container.dataset.elementCount || '0', 10)) + 1;
  container.dataset.elementCount = countNumber;

  // --- 2️⃣ Buat ID baru dan clone node ---
  const newId = generateUniqueId(oldId, container);
  const copyElement = parent.cloneNode(true);

  copyElement.dataset.elementOrder = String(parseInt(copyElement.dataset.elementOrder || '0', 10) + 1);

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
          webpageDb[idx].action =  updateActionProperty(webpageDb[idx].action, 'update');
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
        
          el.setAttribute(attr, replaceIdSuffix(val,oldSuffix, newSuffix));
        }
      }

      // Update ID dan duplikasi field di DB
      if (el.id && arraySubsequenceMatch(el.id.split('-'), oldSuffix.split('-'))) {
        const origId = el.id;
        const newId = replaceIdSuffix(origId, oldSuffix, newSuffix)

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

  const oldSuffix = oldId.split('-').slice(1).join('-');
  const newSuffix = newId.split('-').slice(1).join('-');
  updateFieldAttributes(copyElement, oldSuffix, newSuffix);

  // --- 6️⃣ Sisipkan hasil duplikasi ke DOM ---
  parent.insertAdjacentElement('afterend', copyElement);

  copyElement.removeAttribute('data-listener-added')
  copyElement
    .querySelectorAll('[data-listener-added]')
    .forEach(el => el.removeAttribute('data-listener-added'));

  copyElement
      .querySelectorAll('[data-listener-mouse-added]')
      .forEach(el => el.removeAttribute('data-listener-mouse-added'));

  // --- 5️⃣ Duplikasi dropdown body-nya ---
  
    const bodyDropdown = getEl(`dropdown-${idParts.slice(1).join('-')}`);
    if(!bodyDropdown)return
    
    bodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';
    if (bodyDropdown) {
      const copyBodyDropdown = bodyDropdown.cloneNode(true);
      copyBodyDropdown.id = replaceIdSuffix(copyBodyDropdown.id, oldSuffix, newSuffix)
      
      copyBodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';
      copyBodyDropdown.setAttribute('data-initialized', '');

      updateFieldAttributes(copyBodyDropdown, oldSuffix, newSuffix);
      bodyDropdown.insertAdjacentElement('afterend', copyBodyDropdown)

    }
  

  // --- 8️⃣ Update element_count di DB container ---
  if (container.id.startsWith('wrapper-section-accordion')) {
    const containerField = webpageDb.find(f => f.id === container.id.split('-').slice(1).join('-'));
    if (containerField){
      containerField.element_count = countNumber;
      containerField.action =  updateActionProperty(containerField.action, 'update');
    }
  }else if(container.id.startsWith('editor')){
    const containerField = webpageDb.find(f => f.id === `webpage-section-${container.id.split('-').find(part => !isNaN(part))}`);
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

  globals.isFormDirty = true
  
  globals.webpageDb=webpageDb
};

export { createField, createDropdownField, addField, copyField }