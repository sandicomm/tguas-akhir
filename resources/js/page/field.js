import { globals } from './globals.js';
import { replaceTrailingNumber } from './utils/utilsDuplikatFunction.js';
import { dropdownInitialized } from './utils/dropdownInit.js';
import { renderSvg } from './utils/svgEdit.js';
// ======== updateContent ========
import { updateActionProperty } from './utils/updateContent.js';

let webpageDb=  globals.webpageDb, param=globals.param

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

const createField = (page) =>{
    let field=''
    if(page){
      let dropdown=`
          <div type="button" class="bg-white rounded-full absolute right-[-0.5rem] top-[-0.5rem] z-0 cursor-pointer" data-dropdown-toggle="dropdown-body-${page.id}" data-dropdown-placement="right-end">   
            ${renderSvg()}      
          </div>`
      if(page.id.includes('carousel')){
        dropdown=''
        field = `
          <div id="${page.id}" contenteditable="true" style="ol{list-style-type:decimal;}ul{list-style-type:disc;};${page.style}" class="border border-b-1 border-gray-500 p-1 max-w-[100%] scroll-hidden overflow-scroll" >${page.content ?? ''}</div>
        `
      }else{
        if(page.id.includes('accordion') && !page.id.includes('modal')){
          dropdown=`
          <div type="button" class="bg-white rounded-full absolute right-[-1.5rem] top-[1rem] z-0 cursor-pointer" data-dropdown-toggle="dropdown-body-${page.id}" data-dropdown-placement="right-end">   
            ${renderSvg()}      
          </div>`
        }
        field = `
          <div data-element-order="${page.element_order}" style="z-index:10;position:relative;display:flex;justify-content:center;align-items:center;flex-direction:column;">
            ${dropdown}
            <div id="${page.id}" contenteditable="true" style="ol{list-style-type:decimal;}ul{list-style-type:disc;};${page.style}" class="border border-b-1 border-gray-500 p-1 max-w-[100%] scroll-hidden overflow-scroll" >${page.content ?? ''}</div>
          </div>
        `
      }
    }
    return field
}
const createDropdownField = (idPrefix)=>`
    <div id="dropdown-body-${idPrefix}" data-accordion="open" class="w-25 z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
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
        <div type="button" class="bg-white rounded-full absolute right-[-1.5rem] top-[1rem] z-0 cursor-pointer" data-dropdown-toggle="dropdown-body-${idPrefix}" data-dropdown-placement="right-end">   
          ${renderSvg()}      
        </div>`
    }else{
      dropdown=`
        <div type="button" class="bg-white rounded-full absolute right-[-0.5rem] top-[-0.5rem] z-0 cursor-pointer" data-dropdown-toggle="dropdown-body-${idPrefix}" data-dropdown-placement="right-end">   
          ${renderSvg()}      
        </div>`
    }
    return `<div data-element-order="${fieldNumber}" style="position:relative;display:flex;justify-content:center;align-items:center;flex-direction:column;">
      ${dropdown}
      <div id="${idPrefix}" contenteditable="true" style="ol{list-style-type:decimal;}ul{list-style-type:disc;};" class="border border-b-1 border-gray-500 p-1 max-w-[100%] scroll-hidden overflow-scroll"></div>
    </div>
    `
  }

  if(idParts[2] === 'accordion'){
    idAppendField = `wrapper-section-${idParts.slice(2,idParts.length).join('-')}`
    bodyAppend = document.getElementById(idAppendField)
    fieldNumber = parseInt(bodyAppend.getAttribute('data-element-count'))+1

    bodyAppend.dataset.elementCount = fieldNumber
  
    idPrefix = `field-${idParts.slice(2, idParts.length).join('-')}-${fieldNumber}`

  }else if(idParts[2] === 'modal'){
    idAppendField = `body-${idParts.slice(2,idParts.length).join('-')}`

    bodyAppend = document.getElementById(idAppendField)
    fieldNumber = parseInt(bodyAppend.getAttribute('data-element-count'))+1

    bodyAppend.dataset.elementCount = fieldNumber
  
    idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`

  }else{
    if(param.includes('prolog-web')){
      idAppendField = `editor-container-section-prolog-web-${idParts[6]}`
      bodyAppend = document.getElementById(idAppendField)

      fieldNumber = parseInt(bodyAppend.dataset.elementCount)+1
      bodyAppend.dataset.elementCount = fieldNumber
      idPrefix = `field-${idParts.slice(2, idParts.length).join('-')}-${fieldNumber}`
      
    }else if(param.includes('prolog-emodul')){
      idAppendField = `editor-container-section-prolog-emodul-${idParts[6]}`
      bodyAppend = document.getElementById(idAppendField)

      fieldNumber = parseInt(bodyAppend.dataset.elementCount)+1
      bodyAppend.dataset.elementCount = fieldNumber

      idPrefix = `field-${idParts.slice(2, idParts.length).join('-')}-${fieldNumber}`

    }else if(idParts.includes('footer')){
      idAppendField = `editor-container-section-footer`
      bodyAppend = document.getElementById(idAppendField)

      fieldNumber = parseInt(bodyAppend.dataset.elementCount)+1
      bodyAppend.dataset.elementCount = fieldNumber

      idPrefix = `field-${idParts.slice(2, idParts.length).join('-')}-${fieldNumber}`

    }else{
      idAppendField = `editor-container-section-${idParts[4]}`
      bodyAppend = document.getElementById(idAppendField)

      fieldNumber = parseInt(bodyAppend.dataset.elementCount)+1
      bodyAppend.dataset.elementCount = fieldNumber

      idPrefix = `field-${idParts.slice(2, idParts.length).join('-')}-${fieldNumber}`
    }
  }

  bodyDropdown=`
    <div id="dropdown-body-${idPrefix}" data-accordion="open" class="w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
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
    document.getElementById(idAppendField).parentElement.parentElement.insertAdjacentHTML('beforeend', bodyDropdown)
  }else{
    if(param.includes('prolog-web')){
      document.getElementById(`webpage-section-prolog-web-${idParts.find(part => !isNaN(part))}`).insertAdjacentHTML('beforeend', bodyDropdown)
    }else if(param.includes('prolog-emodul')){
      document.getElementById(`webpage-section-prolog-emodul-${idParts.find(part => !isNaN(part))}`).insertAdjacentHTML('beforeend', bodyDropdown)

    }else if(idPrefix.includes('footer')){
      document.getElementById(`webpage-section-footer`).insertAdjacentHTML('beforeend', bodyDropdown)

    }else{
      document.getElementById(`webpage-section-${idParts.find(part => !isNaN(part))}`).insertAdjacentHTML('beforeend', bodyDropdown)

    }
  }

  const section = document.getElementById(`webpage-section-${idParts[4]}`)

  webpageDb.push({
    id: idPrefix,
    type: 'field',
    style: 'ol{list-style-type:decimal;}ul{list-style-type:disc;};',
    action:'new-add',
    element_order: fieldNumber
  });

  webpageDb.forEach(item=>{
    if(item.id === `webpage-section-${idParts.find(part => !isNaN(part))}` && idParts.filter(part => !isNaN(part)).length == 1){
      item.element_count++
      item.action= updateActionProperty(item.action, 'update')
    }else if(item.id === bodyAppend.parentElement.id){
      item.element_count++
      item.action= updateActionProperty(item.action, 'update')
    }else if(item.id === `webpage-${idParts.slice(3).join('-')}` && idParts.filter(part => !isNaN(part)).length == 1){
      item.element_count++
      item.action= updateActionProperty(item.action, 'update')
    }else if(item.id === `section-${idParts.slice(2).join('-')}` && idParts.join('-').includes('accordion')){
      item.element_count++
      item.action= updateActionProperty(item.action, 'update')
    }else if(item.id === `body-${idParts.slice(2).join('-')}` && idParts.join('-').includes('modal')){
      item.element_count++
      item.action= updateActionProperty(item.action, 'update')
    }
  })

  globals.webpageDb=webpageDb
  console.log('add field',webpageDb, globals.webpageDb)
  
  const field = createFieldHTML(idPrefix,fieldNumber)
  document.getElementById(idAppendField).insertAdjacentHTML('beforeend',field);
  dropdownInitialized('',  `dropdown-body-${idPrefix}`)
}
const copyField = (idParts) => {
  webpageDb=  globals.webpageDb
  // --- 1️⃣ Ambil elemen sumber ---
  const element = document.getElementById(idParts.slice(1).join('-'));
  if (!element) {
    console.error('Element asal tidak ditemukan:', idParts.slice(1).join('-'));
    return;
  }
  
  const parent = element.parentElement;
  const container = parent?.parentElement;
  if (!container) {
    console.error('Container tidak ditemukan');
    return;
  }

  const oldId = element.id;
  const countNumber = (parseInt(container.dataset.elementCount || '0', 10)) + 1;
  container.dataset.elementCount = countNumber;

  // --- 2️⃣ Buat ID baru dan clone node ---
  const newId = replaceTrailingNumber(oldId, countNumber);
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
          // console.log('attribute:', {attr, el, val, oldSuffix, newSuffix}, val.replaceAll(oldSuffix, newSuffix))
          el.setAttribute(attr, val.replaceAll(oldSuffix, newSuffix));
        }
      }

      // Update ID dan duplikasi field di DB
      if (el.id && arraySubsequenceMatch(el.id.split('-'), oldSuffix.split('-'))) {
        const origId = el.id;
        const newId = origId.replaceAll(oldSuffix, newSuffix);

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
  // console.log('field copy:', oldId, newId,countNumber, oldSuffix, newSuffix)

  // --- 6️⃣ Sisipkan hasil duplikasi ke DOM ---
  parent.insertAdjacentElement('afterend', copyElement);

  // --- 5️⃣ Duplikasi dropdown body-nya ---
  
    const bodyDropdown = document.getElementById(`dropdown-body-${idParts.slice(1).join('-')}`);
    bodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';
    if (bodyDropdown) {
      const copyBodyDropdown = bodyDropdown.cloneNode(true);
      copyBodyDropdown.id = replaceTrailingNumber(copyBodyDropdown.id, countNumber);
      copyBodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';
      copyBodyDropdown.setAttribute('data-initialized', '');

      updateFieldAttributes(copyBodyDropdown, oldSuffix, newSuffix);
      bodyDropdown.insertAdjacentElement('afterend', copyBodyDropdown)
    } else {
      console.warn('Dropdown body tidak ditemukan untuk:', oldId);
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
  dropdownInitialized('', `dropdown-body-${newId}`);
  console.log('Field duplicated:', newId, '→', webpageDb);
  globals.webpageDb=webpageDb
};

export { createField, createDropdownField, addField, copyField }