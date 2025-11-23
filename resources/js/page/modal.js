import { globals } from './globals.js';
import { replaceTrailingNumber } from './utils/utilsDuplikatFunction.js';
import { deepClone } from './utils/utilsDuplikatFunction.js';
import { dropdownInitialized } from './utils/dropdownInit.js';
import { renderSvg } from './utils/svgEdit.js';
// ======== updateContent ========
import { updateActionProperty } from './utils/updateContent.js';

import { Modal } from 'flowbite';
import { initFlowbite } from 'flowbite';

let webpageDb=  globals.webpageDb
let editorFieldSelect=globals.editorFieldSelect

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

function modalTypeStyling(){
  document.getElementById('modal-type').addEventListener('change', function(){
    editorFieldSelect=globals.editorFieldSelect
    webpageDb=globals.webpageDb
    let id = `body-${editorFieldSelect.parentElement.id.split('-').slice(1).join('-')}`
    if(this.value === 'default'){
      editorFieldSelect.parentElement.dataset.modalBackdrop=''
      webpageDb.forEach(page=>{
        if(page.id === id){
          page.action =  updateActionProperty(page.action, 'update')
          page.content = 'modal-default'
        }
      })
    }else if(this.value === 'static'){
      editorFieldSelect.parentElement.dataset.modalBackdrop='static'
      webpageDb.forEach(page=>{
        if(page.id === id){
          page.action =  updateActionProperty(page.action, 'update')
          page.content = 'modal-static'
        }
      })
    }
    globals.webpageDb=webpageDb
    setTimeout(() => {
      try {
          initFlowbite();
      } catch (error) {
          console.error('❌ Gagal menginisialisasi Modal:', error);
      }
    }, 100);  
  })
}

const createBtnModal = (page) =>`
    <div id="${page.id}" data-element-order="${page.element_order}" class="z-10 flex justify-center items-center flex-col">
      <div id="wrapper-${page.id}" class="relative flex justify-center items-center inline-flex gap-2">
        <div type="button" class="bg-white rounded-full absolute right-[-1.7rem] top-[0.2rem] z-10 cursor-pointer" data-dropdown-toggle="dropdown-btn-${page.id}" data-dropdown-placement="right-end">
          ${renderSvg()}                
        </div>

        <button id="btn-${page.id}" style="${page.style}" data-modal-target="element-${page.id}" data-modal-toggle="element-${page.id}" class="flex justify-between items-center hover:bg-blue-700">
          ${page.content ?? `<span class="w-full">Button Modal</span>`}
        </button>
      </div>
    </div>
`
const createBodyModal=(page, fieldHead)=>`
  <div id="element-${page.id.split('-').slice(1).join('-')}" data-modal-backdrop="${page.content === 'modal-default' ? '' : 'static'}" tabindex="-1" aria-hidden="true" class="fixed z-[80] top-0 right-0 w-full sm:w-[calc(100%-18rem)] h-full hidden justify-center items-center">
      <div id="dropdown-body-${page.id.split('-').slice(1).join('-')}" data-accordion="open" class="w-25 z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
          <li>
              <a id="add-field-${page.id.split('-').slice(1).join('-')}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
          </li>
          <li>
              <a id="add-video-${page.id.split('-').slice(1).join('-')}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Video</a>
          </li>
        </ul>
      </div>

        <div id="parent-${page.id.split('-').slice(1).join('-')}" style="${page.style}" class="relative bg-white rounded-md w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <!-- Modal content -->
          <div class="shadow-sm">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b-2 rounded-t border-gray-200">
                <div id="${fieldHead.id}" style="${fieldHead.style}" class="border border-gray-400 scroll-hidden overflow-scroll p-1" contenteditable="true">
                    ${fieldHead.content}
                </div>
            </div>

            <!-- Modal body -->
            <div type="button" class="bg-white rounded-full absolute right-0 top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-body-${page.id.split('-').slice(1).join('-')}" data-dropdown-placement="right-end">
              ${renderSvg()}                  
            </div>

            <div id="body-${page.id.split('-').slice(1).join('-')}" class="flex flex-col justify-start items-center relative p-3 overflow-y-auto max-h-[70vh]" data-element-count="${page.element_count}">

            </div>

            <div class="flex items-center p-2 border-t-2 border-gray-200 rounded-b">
              <button id="btn-footer-${page.id.split('-').slice(1).join('-')}" data-modal-hide="element-${page.id.split('-').slice(1).join('-')}" type="button" class="w-full py-2.5 px-5 text-gray-200 bg-gray-700 rounded-lg" contenteditable="true">Close</button>
            </div>
          </div>
        </div>
      </div>
`
const createDropdownModal = (idPrefix)=>`
      <div id="dropdown-btn-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-20 z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
          <li><a id="down-btn-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
          <li><a id="up-btn-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
          <li><a id="copy-${idPrefix}" class="text-blue-600 cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a></li>
        </ul>
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
          <li><a id="delete-btn-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
        </ul>
      </div>
`
const addModal = (event)=>{
  webpageDb=globals.webpageDb
  const idParts = event.target.id.split('-')
  let bodyAppend, fieldNumber, bodyDropdown, idPrefix, idAppend

  const createBtnModalHTML = (idPrefix,fieldNumber)=>`
    <div id="${idPrefix}" data-element-order="${fieldNumber}" class="z-10 flex justify-center items-center flex-col">
      <div id="wrapper-${idPrefix}" class="relative justify-center items-center inline-flex gap-2">
        <div type="button" class="bg-white rounded-full absolute right-[-1.7rem] top-[0.2rem] z-10 cursor-pointer" data-dropdown-toggle="dropdown-btn-${idPrefix}" data-dropdown-placement="right-end">
          ${renderSvg()}                
        </div>

        <button id="btn-${idPrefix}" data-modal-target="element-${idPrefix}" style="position:relative;padding: 10px;border-radius:5px;background-color:rgba(255,255,255,1);" data-modal-toggle="element-${idPrefix}" class="flex justify-between items-center" data-target="#element-${idPrefix}">
          <span class="w-full">Button Modal</span>
        </button>
      </div>
    </div>
  `
  const createBodyModalHTML =(idPrefix)=>`
    <div id="element-${idPrefix}" tabindex="-1" aria-hidden="true" class="fixed z-[80] top-0 right-0 w-full sm:w-[calc(100%-18rem)] h-full hidden flex justify-center items-center">
      <div id="dropdown-body-${idPrefix}" data-accordion="open" class="w-25 z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
          <li>
              <a id="add-field-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
          </li>
          <li>
              <a id="add-video-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Video</a>
          </li>
        </ul>
      </div>

        <div id="parent-${idPrefix}" class="relative bg-white rounded-md w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div id="dropdown-field-${idPrefix}-1" data-accordion="open" class="absolute mt-2 left-0 w-25 z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li>
                    <a id="up-field-${idPrefix}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
                </li>
                <li>
                    <a id="down-field-${idPrefix}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
                </li>
                <li>
                    <a id="copy-${idPrefix}-1" class="text-blue-600 cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a>
                </li>
                <li>
                    <a id="delete-field-${idPrefix}-1" class="cursor-pointer text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a>
                </li>
            </ul>
          </div>
          <!-- Modal content -->
          <div class="shadow-sm">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b-2 rounded-t border-gray-200">
                <div id="field-head-${idPrefix}" class="border border-gray-400 scroll-hidden overflow-scroll p-1" contenteditable="true">
                    Head Modal
                </div>
            </div>

            <!-- Modal body -->
            <div type="button" class="bg-white rounded-full absolute right-0 top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-body-${idPrefix}" data-dropdown-placement="right-end">
              ${renderSvg()}                 
            </div>
            <div id="body-${idPrefix}" class="flex flex-col justify-start items-center relative p-3 overflow-y-auto max-h-[70vh]" data-element-count="1">

              <div data-element-order="1" style="position: relative;">
                <div type="button" class="bg-white rounded-full absolute right-[-0.7rem] top-[-0.5rem] z-10 cursor-pointer" data-dropdown-toggle="dropdown-field-${idPrefix}-1" data-dropdown-placement="right-end">
                  ${renderSvg()}   
                </div>

                <div id="field-${idPrefix}-1" class="border border-b-1 border-gray-500 scroll-hidden overflow-scroll p-1" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" contenteditable="true">
                  Test
                </div>
              </div>
            </div>

            <div class="flex items-center p-2 border-t-2 border-gray-200 rounded-b">
              <button id="btn-footer-${idPrefix}" data-modal-hide="element-${idPrefix}" type="button" class="w-full py-2.5 px-5 text-gray-200 bg-gray-700 rounded-lg" contenteditable="true">Close</button>
            </div>
          </div>
        </div>
      </div>
  `

  if(idParts[2] === 'accordion'){
    idAppend = `wrapper-section-${idParts.slice(2, idParts.length).join('-')}`;
    bodyAppend = document.getElementById(idAppend);

    fieldNumber = parseInt(bodyAppend.getAttribute('data-element-count')) + 1;
    bodyAppend.dataset.elementCount = fieldNumber;

    idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`

  }else{
    idAppend = `editor-container-section-${idParts[4]}`;
    const section = document.getElementById(idAppend)

    fieldNumber = section.dataset.elementCount;
    fieldNumber++
    section.dataset.elementCount = fieldNumber

    idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`
    idAppend = `editor-container-section-${idParts[4]}`
    
  }

  bodyDropdown = `
      <div id="dropdown-btn-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-20 z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
          <li><a id="down-btn-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
          <li><a id="up-btn-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
          <li><a id="copy-${idPrefix}" class="text-blue-600 cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a></li>
        </ul>
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
          <li><a id="delete-btn-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
        </ul>
      </div>
  `

  document.getElementById(`webpage-section-${idParts.find(part => !isNaN(part))}`).insertAdjacentHTML('beforeend', bodyDropdown)
  document.getElementById(`webpage-section-${idParts.find(part => !isNaN(part))}`).insertAdjacentHTML('beforeend', createBodyModalHTML(idPrefix))
  document.getElementById(idAppend).insertAdjacentHTML('beforeend',createBtnModalHTML(idPrefix, fieldNumber));
  dropdownInitialized('multi',`${idPrefix}`)

  webpageDb.push({
    id: `${idPrefix}`,
    type:'button-modal',
    style: 'position:relative;padding: 10px;border-radius:5px;background-color:rgba(255,255,255,1);',
    element_order: fieldNumber,
    action:'new-add',
    content: '<span class="w-full">Button Modal</span>'
  },
  {
    id: `body-${idPrefix}`,
    type: 'body-modal',
    content:'modal-default',
    action:'new-add',
    element_count:1
  },
  {
    id: `field-${idPrefix}-1`,
    type: 'field',
    style: 'ol{list-style-type:decimal;}ul{list-style-type:disc;}',
    element_order: '1',
    action:'new-add',
    content: 'test'
  },
  {
    id: `field-head-${idPrefix}`,
    type: 'field',
    style: 'ol{list-style-type:decimal;}ul{list-style-type:disc;}',
    element_order: '1',
    action:'new-add',
    content: 'Head Modal'
  })

  webpageDb.map(item=>{
    if(item.id === `webpage-section-${idParts.find(part => !isNaN(part))}` && idParts.filter(part => !isNaN(part)).length == 1){
      item.element_count++
      item.action= updateActionProperty(item.action, 'update')
    }else if(item.id === `section-${idParts.slice(2).join('-')}` && idParts.join('-').includes('accordion')){
      item.element_count++
      item.action= updateActionProperty(item.action, 'update')
    }
  })
  globals.webpageDb=webpageDb
  console.log(webpageDb)

  setTimeout(() => {
    try {
        const modalElement = document.getElementById(idPrefix);
        if (modalElement) {
            new Modal(modalElement);
            // console.log('✅ Modal berhasil diinisialisasi:', modalElement.id);
        } else {
            console.warn('⚠️ Elemen Modal tidak ditemukan setelah appendChild');
        }

        // Panggil initFlowbite setelah inisialisasi accordion spesifik ini
        // dan setelah ada sedikit penundaan
        initFlowbite();

    } catch (error) {
        console.error('❌ Gagal menginisialisasi Modal:', error);
    }
  }, 100);  
}

const copyModal = (idModal, mode = 'full', newId, oldId) => {
  try {
    webpageDb=globals.webpageDb
    const btnModal = document.getElementById(idModal);
    if (!btnModal) {
      console.error('❌ Button modal tidak ditemukan:', idModal);
      return false;
    }

    const modalId = btnModal.id.startsWith('btn-')
      ? 'element-' + btnModal.id.slice(4)
      : null;

    let modalEl = modalId ? document.getElementById(modalId) : null;
    if (!modalEl) {
      console.warn('⚠️ Modal body tidak ditemukan otomatis, mencoba fallback...');
      const suffix = btnModal.id.slice(btnModal.id.indexOf('-') + 1);
      const found = document.querySelector(`[id*="${suffix}"][id^="element-"]`);
      if (found) modalEl = found;
      else {
        console.error('❌ Modal body tidak ditemukan untuk btn:', idModal);
        return false;
      }
    }

    const container = btnModal.parentElement;
    if (!container) {
      console.error('❌ Container parent btn tidak ditemukan');
      return false;
    }

    // Hitung index baru
    const countNumber = (parseInt(container.dataset.elementCount || '0', 10) || 0) + 1;

    // Fungsi update ID dan atribut dalam modal
    function updateModalAttributes(modalCopyElement, oldModalId, newModalId) {
      const oldSuffix = oldModalId.split('-').slice(1).join('-');
      const newSuffix = newModalId.split('-').slice(1).join('-');

      modalCopyElement.querySelectorAll('*').forEach(el => {
        // Update atribut yang mengandung id lama
        for (const attr of el.getAttributeNames()) {
          const val = el.getAttribute(attr);
          if (arraySubsequenceMatch(val?.split('-'), oldSuffix.split('-'))) {
            el.setAttribute(attr, val.replaceAll(oldSuffix, newSuffix));
          }
        }

        // Update id elemen
        if (arraySubsequenceMatch(el.id?.split('-'), oldSuffix.split('-'))) {
          const newId = el.id.replaceAll(oldSuffix, newSuffix);
          const originalField = webpageDb.find(f => f.id === el.id);
          el.id = newId;
          if (originalField) {
            const cloned = structuredClone(originalField);
            if(cloned.file){
              delete cloned.file
            }
            cloned.id = newId;
            cloned.action = 'new-add';
            webpageDb.push(cloned);
          }
        }
      });
    }

    // =============================
    // 📌 MODE: body only
    // =============================
    if (mode === 'body') {
      const modalCopy = modalEl.cloneNode(true);
      const oldModalId = modalEl.id;
      const newModalId = oldModalId.replaceAll(oldId, newId);
      modalCopy.id = newModalId;

      updateModalAttributes(modalCopy, oldId, newId);

      // Append ke section terkait
      const sectionNum = (btnModal.id.split('-').find(part => !isNaN(part)) || null);
      const sectionContainer = sectionNum
        ? document.getElementById(`webpage-section-${sectionNum}`)
        : null;

      if (sectionContainer) sectionContainer.appendChild(modalCopy);
      else document.body.appendChild(modalCopy);

      // 🔁 Duplikat data terkait modal lama di database
      const relatedObjects = webpageDb.filter(obj => arraySubsequenceMatch(obj.id.split('-'), oldModalId.split('-')));
      relatedObjects.forEach(originalObj => {
        const clonedObj = deepClone(originalObj);
        clonedObj.id = clonedObj.id.replaceAll(oldModalId, newModalId);
        clonedObj.action = 'new-add'

        if(clonedObj.file){
          delete clonedObj.file
        }

        if (clonedObj.type === 'body-modal') {
          clonedObj.element_count = clonedObj.element_count || '0';
        }
        webpageDb.push(clonedObj);
      });

      // console.log(`✅ Modal body ${oldModalId} diduplikasi sebagai ${newModalId}`);

      setTimeout(() => {
        try {
            // Ganti 'newModalId' dengan ID elemen modal Anda
            const modalElement = document.getElementById(newModalId); 
            
            if (modalElement) {
                // Inisialisasi objek Modal
                new Modal(modalElement);
                // console.log('✅ Modal berhasil diinisialisasi:', 'newModalId');
            }
            
            // Asumsi initFlowbite() adalah fungsi global untuk inisialisasi elemen Flowbite lainnya
            // initFlowbite(); 
            
        } catch (error) {
            console.error('❌ Gagal inisialisasi modal', error);
        }
    }, 100);
    }

    // =============================
    // 📌 MODE: full (btn + body)
    // =============================
    else {
      container.dataset.elementCount = String(countNumber);
      const btnCopy = btnModal.cloneNode(true);
      const modalCopy = modalEl.cloneNode(true);

      const oldBtnId = btnModal.id;
      const newBtnId = replaceTrailingNumber(oldBtnId, countNumber);

      const oldModalId = modalEl.id;
      const newModalId = replaceTrailingNumber(oldModalId, countNumber);

      btnCopy.id = newBtnId;
      modalCopy.id = newModalId;

      // Update order tombol
      const originalOrder = parseInt(btnCopy.dataset.elementOrder || '0', 10);
      const newOrderBase = originalOrder + 1;
      btnCopy.dataset.elementOrder = String(newOrderBase);

      // Geser order sibling
      Array.from(container.children).forEach(el => {
        const currentOrder = parseInt(el.dataset?.elementOrder || '0', 10);
        if (isNaN(currentOrder)) return;
        if (currentOrder >= newOrderBase) {
          const updated = currentOrder + 1;
          el.dataset.elementOrder = String(updated);

          let id = el.id || el.querySelector('[id^="field-"]')?.id;
          if (!id) return;

          const idx = webpageDb.findIndex(f => f.id === id);
          if (idx !== -1) {
            webpageDb[idx].element_order = String(updated);
            webpageDb[idx].action =  updateActionProperty(webpageDb[idx].action, 'update')
          }
        }
      });

      updateModalAttributes(btnCopy, oldModalId, newModalId);
      updateModalAttributes(modalCopy, oldModalId, newModalId);

      // Duplikat dropdown (jika ada)
      const btnSuffix = oldBtnId.replace(/^btn-/, '');
      const btnBodyDropdown = document.getElementById(`dropdown-btn-${btnSuffix}`);
      if (btnBodyDropdown) {
        const copyBtnBodyDropdown = btnBodyDropdown.cloneNode(true);
        copyBtnBodyDropdown.id = replaceTrailingNumber(copyBtnBodyDropdown.id, countNumber);
        copyBtnBodyDropdown.querySelectorAll('[id]').forEach(el => {
          el.id = replaceTrailingNumber(el.id, countNumber);
        });
        btnBodyDropdown.insertAdjacentElement('afterend', copyBtnBodyDropdown);
      }

      // Sisipkan tombol & modal baru ke DOM
      btnModal.insertAdjacentElement('afterend', btnCopy);
      const sectionNum = (btnModal.id.split('-').find(part => !isNaN(part)) || null);
      const sectionContainer = sectionNum
        ? document.getElementById(`webpage-section-${sectionNum}`)
        : null;

      if (sectionContainer) sectionContainer.appendChild(modalCopy);
      else document.body.appendChild(modalCopy);

      const btnCopyDropdown = btnCopy.querySelectorAll(`[data-dropdown-toggle]`)
      btnCopyDropdown.forEach(dropdown=>{
        let bodyDropdown = document.getElementById(dropdown.dataset.dropdownToggle)
        bodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';
      })

      const btnDropdown = btnModal.querySelectorAll(`[data-dropdown-toggle]`)
      btnDropdown.forEach(dropdown=>{
        let bodyDropdown = document.getElementById(dropdown.dataset.dropdownToggle)
        bodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';
      })

      // 🔁 Duplikat semua elemen di webpageDb yang terkait dengan oldBtnId
      const relatedObjects = webpageDb.filter(obj => arraySubsequenceMatch(obj.id.split('-'), oldBtnId.split('-')));
      relatedObjects.forEach(originalObj => {
        const clonedObj = deepClone(originalObj);
        clonedObj.id = clonedObj.id.replaceAll(oldBtnId, newBtnId);
        clonedObj.action = 'new-add'

        if(clonedObj.file){
          delete clonedObj.file
        }

        if (clonedObj.type === 'button-modal') clonedObj.element_order = String(newOrderBase);
        else if (clonedObj.type === 'body-modal') clonedObj.element_count = clonedObj.element_count || '0';
        webpageDb.push(clonedObj);
      });

      // console.log(`✅ Modal dan tombol ${oldBtnId} diduplikasi sebagai ${newBtnId}`);

      initFlowbite?.();
    }

    const copyDropdown = modalEl.querySelectorAll(`[data-dropdown-toggle]`)
      copyDropdown.forEach(dropdown=>{
        let bodyDropdown = document.getElementById(dropdown.dataset.dropdownToggle)
        bodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';
      })

    // =============================
    // 🔄 Update data count container
    // =============================
    const updateContainerField = (targetId) => {
      const field = webpageDb.find(f => f.id === targetId);
      if (field) {
        field.element_count = countNumber;
        field.action =  updateActionProperty(field.action, 'update');
      }
    };

    if (container.id.startsWith('wrapper-section-accordion')) {
      updateContainerField(container.id.split('-').slice(1).join('-'));
    } else if (container.id.startsWith('editor')) {
      const sectionNum = container.id.split('-').find(part => !isNaN(part));
      updateContainerField(`webpage-section-${sectionNum}`);
    } else {
      updateContainerField(container.id);
    }
    globals.webpageDb=webpageDb
    console.log('copy modal',globals.webpageDb)

    // console.log('✅ copyModal success', { idModal, mode });
    return true;

  } catch (e) {
    console.error('❌ copyModal error:', e);
    return false;
  }
};

export { modalTypeStyling,createBtnModal,createBodyModal,createDropdownModal,addModal,copyModal }