import { globals } from './globals.js';
import { dropdownInitialized } from './utils/dropdownInit.js';
import { replaceTrailingNumber } from './utils/utilsDuplikatFunction.js';
import { updateStylingControls } from './styling/stylingControls.js'
import { parseStyleObj,stringifyStyleObj } from './utils/baseStyleObj.js';
import { deepClone } from './utils/utilsDuplikatFunction.js';
import { initFlowbite } from 'flowbite';
import { createField, createDropdownField } from './field.js';
// ======== updateContent ========
import { updateActionProperty } from './utils/updateContent.js';
import { renderSvg } from './utils/svgEdit.js';
import { setListenerSetImage } from './styling/baseStyling.js';

import {arraySubsequenceMatch, generateUniqueId, handleElementCount, replaceIdSuffix} from './utils/elementNumberingId.js'
// ======== Validation get element ==========
import { getEl } from './utils/validationGetElement.js';

let webpageDb=  globals.webpageDb
let editCarouselItem=globals.editCarouselItem
let carouselSelect=globals.carouselSelect
let bodyItem=globals.bodyItem

const createCarousel = (carousel, childElements,editorContainer,edit) => {
    let dataSet = parseStyleObj(carousel.content)
    return`
      <div id="${carousel.id}" data-element-order="${carousel.element_order}" data-text-position="${dataSet.dataTextPosition}" data-text="${dataSet.dataText}" data-next-btn-hide="${dataSet.dataNextBtnHide}" data-carousel="static" class="flex justify-center items-center flex-col" style="${parseStyleObj(carousel.style).css}">
        ${
          edit ? 
            `<div type="button" class="bg-white rounded-full absolute right-[-1.7rem] top-[-0.1rem] z-0 cursor-pointer" data-dropdown-toggle="dropdown-${carousel.id}" data-dropdown-placement="right-end">
              ${renderSvg()}                 
            </div>`
            : ''
        }

        <div id="element-${carousel.id}" data-item-count="${carousel.element_count}" class="relative w-full h-full" data-carousel="static">
          <!-- Carousel wrapper -->
          <div id="wrapper-item-${carousel.id}" class="relative w-full h-full overflow-hidden rounded-lg text-black">
              <!-- createCarouselItem --!>
              ${createCarouselItem(carousel, childElements, editorContainer, dataSet.dataTextPosition, dataSet.dataText, dataSet.dataNextBtnHide,edit)}
          </div>
          <!-- slideIndicator --!>
          ${slideIndicator(carousel, childElements)}
          <!-- Slider controls -->
          <button id="slider-prev-btn" type="button" style="${parseStyleObj(carousel.style).paddingSlideController}" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none" data-carousel-prev>
              <span style="${parseStyleObj(carousel.style).slideControlWrapperSize}" class="${dataSet.dataNextBtnHide === 'false' ? '':'hidden'} inline-flex items-center justify-center rounded-full bg-gray-400/30 group-hover:bg-gray-400/50 group-focus:ring-4 group-focus:ring-gray-300 group-focus:outline-none">
                  <svg style="${parseStyleObj(carousel.style).controlerSlideSize}" class="text-gray-500 rtl:rotate-180" aria-hidden="true" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                  </svg>
                  <span class="sr-only">Previous</span>
              </span>
          </button>
          <button id="slider-next-btn" type="button" style="${parseStyleObj(carousel.style).paddingSlideController}" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none" data-carousel-next>
              <span style="${parseStyleObj(carousel.style).slideControlWrapperSize}" class="${dataSet.dataNextBtnHide === 'false' ? '':'hidden'} inline-flex items-center justify-center rounded-full bg-gray-400/30 group-hover:bg-gray-400/50 group-focus:ring-4 group-focus:ring-gray-300 group-focus:outline-none">
                  <svg class=" text-gray-500 rtl:rotate-180" aria-hidden="true" style="${parseStyleObj(carousel.style).controlerSlideSize}" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span class="sr-only">Next</span>
              </span>
          </button>
        </div>
      </div>
    `
}

const createCarouselItem = (carousel, childElements,editorContainer, textPosition, textStatus, btnHide,edit) => {
  let item=``

  childElements = childElements.sort((a,b) => a.element_order - b.element_order)
  childElements.forEach(el=>{
      if(el.id.startsWith('item') && arraySubsequenceMatch(el.id.split('-'), carousel.id.split('-'))){
        let field= childElements.filter(field=>field.id === `field-${el.id}`)
        let textImage=''
     
        if(textStatus === 'true' ){
            if(edit) editorContainer.insertAdjacentHTML('afterend', createDropdownField(field[0].id))
            if(textPosition === 'on-image'){
              textImage = createField(field[0],edit)

            }else if(textPosition === 'below-image'){

              let imgTxt = childElements.filter(img=>img.id === `img-text-on-image-${el.id}`)
              textImage = `
                  <div id="${imgTxt[0].id}" style="width:100%;height:30%;">
                    <img src="${imgTxt[0].content}" style="width:100%;" loading="lazy">"
                  </div>
                  <div class="flex justify-center items-start h-full w-full ${btnHide ? 'px-3' : 'px-6'} ${btnHide} py-5 overflow-y-auto" style="${el.style}">
                    ${createField(field[0],edit)}
                  </div>
                  `
            }
        }

        if(arraySubsequenceMatch(el.id.split('-'), carousel.id.split('-')) && el.id.startsWith('item-carousel')){
            let style=''
            if(textPosition === 'on-image'){
              style = el.style
            }else{
              style = 'flex-direction:column;'
            }
            item += `
            <div id="${el.id}" data-item-order="${el.element_order}" class="duration-700 ease-in-out flex justify-center items-center ${textPosition === 'below-image' ? '':'p-6'}" style="${style}" data-carousel-item>
            ${textImage}
            </div>
            `
        }
      }
  })
  return item
}

const slideIndicator = (carousel, childElements)=>{
  let itemCarouselLength = childElements.filter(el => arraySubsequenceMatch(el.id.split('-'), carousel.id.split('-')) && el.type === 'item-carousel').length

  let slide=``
  for(let i=0;i <= itemCarouselLength-1;i++){
      let indicator = i
      slide += `
      <button type="button" style="${parseStyleObj(carousel.style).indicatorSize}" 
      class="rounded-full !bg-gray-300/40 hover:!bg-gray-400/80 dark:!bg-gray-300/40 dark:hover:!bg-gray-400/80" aria-current="true" aria-label="Slide ${indicator+1}" data-carousel-slide-to="${i}"></button>
      `
  }

  return `
  <div style="${parseStyleObj(carousel.style).bottomIndicatorPosition}" id="slide-indicator-${carousel.id}" class="absolute z-30 flex -translate-x-1/2 left-1/2 space-x-3 rtl:space-x-reverse">
      ${slide}
  </div>`
}

const createDropdownCarousel = (idPrefix)=> `
  <div id="dropdown-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-30 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
        <li><a id="down-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
        <li><a id="up-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
        <li><a id="copy-${idPrefix}" class="text-blue-600 cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a></li>
      </ul>
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
        <li><a id="delete-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
      </ul>
  </div>
`

const addCarousel = (event)=>{
  webpageDb=globals.webpageDb
    const idParts = event.target.id.split('-')
    let idAppend,idPrefix,bodyAppend, fieldNumber
    let svgControlerSlideSize, slideControlWrapperSize, indicatorSize, bottomIndicatorPosition, paddingSlideController,widthCarousel,heightCarousel

    const createCarousel = (idPrefix,fieldNumber,widthCarousel,heightCarousel,svgControlerSlideSize,slideControlWrapperSize,indicatorSize,bottomIndicatorPosition,paddingSlideController) => `
      <div id="${idPrefix}" data-element-order="${fieldNumber}" data-text-position="on-image" data-text="false" data-next-btn-hide="false" data-carousel="static" class="flex justify-center items-center flex-col" style="width:${widthCarousel};height:${heightCarousel};position:relative;">
        <div type="button" class="bg-white rounded-full absolute right-[-1.7rem] top-[0.2rem] z-0 cursor-pointer" data-dropdown-toggle="dropdown-${idPrefix}" data-dropdown-placement="right-end">   
          ${renderSvg()}      
        </div>

        <div id="element-${idPrefix}" data-item-count="3" class="relative w-full h-full" data-carousel="static">
          <!-- Carousel wrapper -->
          <div class="relative w-full h-full overflow-hidden rounded-lg text-black">
              <!-- Item 1 -->
              <div id="item-${idPrefix}-1" data-item-order="1" class="duration-700 ease-in-out flex justify-center items-center p-6" style='background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url("/assets/img/almond1DefaultImageCarousel.jpg");background-size:cover;background-position:center;' data-carousel-item>
              </div>

              <!-- Item 2 -->
              <div id="item-${idPrefix}-2" data-item-order="2" class="duration-700 ease-in-out flex justify-center items-center p-6" style='background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url("/assets/img/almond1DefaultImageCarousel.jpg");background-size:cover;background-position:center;' data-carousel-item>
              </div>

              <!-- Item 3 -->
              <div id="item-${idPrefix}-3" data-item-order="3" class="duration-700 ease-in-out flex justify-center items-center p-6" style='background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url("/assets/img/almond1DefaultImageCarousel.jpg");background-size:cover;background-position:center;' data-carousel-item>
              </div>
          </div>
          <!-- Slider indicators -->
          <div style="${bottomIndicatorPosition}" id="slide-indicator-${idPrefix}" class="absolute z-30 flex -translate-x-1/2 left-1/2 space-x-3 rtl:space-x-reverse">
              <button type="button" style="${indicatorSize}" class="rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
              <button type="button" style="${indicatorSize}" class="rounded-full" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
              <button type="button" style="${indicatorSize}" class="rounded-full" aria-current="false" aria-label="Slide 3" data-carousel-slide-to="2"></button>
          </div>
          <!-- Slider controls -->
          <button id="slider-prev-btn" type="button" style="${paddingSlideController}" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none" data-carousel-prev>
              <span style="${slideControlWrapperSize}" class="inline-flex items-center justify-center rounded-full bg-gray-400/30 group-hover:bg-gray-400/50 group-focus:ring-4 group-focus:ring-gray-300 group-focus:outline-none">
                  <svg style="${svgControlerSlideSize}" class="text-gray-500 rtl:rotate-180" aria-hidden="true" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                  </svg>
                  <span class="sr-only">Previous</span>
              </span>
          </button>
          <button id="slider-next-btn" type="button" style="${paddingSlideController}" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none" data-carousel-next>
              <span style="${slideControlWrapperSize}" class="inline-flex items-center justify-center rounded-full bg-gray-400/30 group-hover:bg-gray-400/50 group-focus:ring-4 group-focus:ring-gray-300 group-focus:outline-none">
                  <svg class=" text-gray-500 rtl:rotate-180" aria-hidden="true" style="${svgControlerSlideSize}" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span class="sr-only">Next</span>
              </span>
          </button>
        </div>
      </div>
    `
    const  createDropdown = (idPrefix)=> `
      <div id="dropdown-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-30 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
          <li><a id="down-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
          <li><a id="up-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
          <li><a id="copy-${idPrefix}" class="text-blue-600 cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a></li>
        </ul>
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
          <li><a id="delete-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
        </ul>
      </div>
    `

    if(idParts[2] === 'accordion'){
      idAppend = `wrapper-section-${idParts.slice(2, idParts.length).join('-')}`;

      bodyAppend = getEl(idAppend);
      if(!bodyAppend) return

      fieldNumber = handleElementCount(bodyAppend, bodyAppend.dataset.elementCount)
      bodyAppend.dataset.elementCount = fieldNumber;

      idPrefix = generateUniqueId(`${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`,bodyAppend)
  
      widthCarousel='300px'
      heightCarousel='200px'

      svgControlerSlideSize = 'width:12px; height:12px;'
      slideControlWrapperSize = 'width:24px;height:24px;'
      indicatorSize = 'width:8px; height:8px;'
      bottomIndicatorPosition = 'bottom:2px'
      paddingSlideController = 'padding-left:2px;padding-right:2px;'

    }else{
      idAppend = `editor-container-section-${idParts[4]}`;

      const section = getEl(idAppend)
      if(!section)return

      fieldNumber = handleElementCount(section, section.dataset.elementCount)
      section.dataset.elementCount = fieldNumber

      idPrefix = generateUniqueId(`${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`,section)
  
      widthCarousel='400px'
      heightCarousel='300px'
      
      idAppend = `editor-container-section-${idParts[4]}`

      svgControlerSlideSize = 'width:16px; height:16px;'
      slideControlWrapperSize = 'width:32px;height:32px;'
      indicatorSize = 'width:10px; height:10px;'
      bottomIndicatorPosition = 'bottom:5px'
      paddingSlideController = 'padding-left:4px;padding-right:4px;'
    }

    const webpageSection = getEl(`webpage-section-${idParts.find(part => !isNaN(part))}`)
    const appendCarousel = getEl(idAppend)
    if(!webpageSection || !appendCarousel) return

    webpageSection.insertAdjacentHTML('beforeend', createDropdown(idPrefix))

    appendCarousel.insertAdjacentHTML('beforeend', createCarousel(idPrefix,fieldNumber,widthCarousel,heightCarousel,svgControlerSlideSize,slideControlWrapperSize,indicatorSize,bottomIndicatorPosition,paddingSlideController));

    webpageDb.push({
      id: `${idPrefix}`,
      type:'carousel',
      element_order: fieldNumber,
      style: `{"css":"position:relative;width:${widthCarousel};height:${heightCarousel};","controlerSlideSize": "${svgControlerSlideSize}","slideControlWrapperSize": "${slideControlWrapperSize}","indicatorSize": "${indicatorSize}","bottomIndicatorPosition": "${bottomIndicatorPosition}","paddingSlideController": "${paddingSlideController}"}`,
      element_count: 3,
      content:`{"dataTextPosition":"on-image","dataText":"false","dataNextBtnHide":"false"}`,
      action:'new-add'
    },
    {
      id: `item-${idPrefix}-1`,
      type: 'item-carousel',
      element_order:1,
      action:'new-add',
      style: `background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url('/assets/img/almond1DefaultImageCarousel.jpg');background-size:cover;background-position:center;`
    },
    {
      id: `item-${idPrefix}-2`,
      type: 'item-carousel',
      element_order:2,
      action:'new-add',
      style: `background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url('/assets/img/almond1DefaultImageCarousel.jpg');background-size:cover;background-position:center;`
    },
    {
      id: `item-${idPrefix}-3`,
      type: 'item-carousel',
      element_order:3,
      action:'new-add',
      style: `background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url('/assets/img/almond1DefaultImageCarousel.jpg');background-size:cover;background-position:center;`
    },
    )

    webpageDb.forEach(item=>{
      if(item.id === `webpage-section-${idParts.find(part => !isNaN(part))}` && idParts.filter(part => !isNaN(part)).length == 1){
        item.element_count++
        item.action =  updateActionProperty(item.action, 'update')
      }else if(item.id === `section-${idParts.slice(2).join('-')}`){
        item.element_count++
        item.action =  updateActionProperty(item.action, 'update')
      }
    })

    globals.isFormDirty = true
    dropdownInitialized('',`dropdown-${idPrefix}`)

    setTimeout(() => {
      try {
          const carouselElement = getEl(idPrefix);
          if (carouselElement) {
            new Carousel(carouselElement);

          } else {
            console.warn('⚠️ Elemen Crousel tidak ditemukan setelah appendChild');
          }
          initFlowbite();

      } catch (error) {
          console.error('❌ Gagal menginisialisasi Carousel:', error);
      }
    }, 100);  

    globals.webpageDb=webpageDb

}

const copyCarousel=(idCarousel, mode="all")=>{
  try {
    webpageDb=globals.webpageDb
      let carouselId = idCarousel

      const carouselEl = getEl(carouselId);
      if(!carouselEl)return

      if (!carouselEl) {
        console.error('carousel tidak ditemukan:', carouselId);
        return false;
      }

      const container = carouselEl.parentElement;
      if (!container) {
        console.error('container carousel tidak ditemukan');
        return false;
      }

      // hitung count baru & simpan
      const countNumber = handleElementCount(container, parseInt(container.dataset.elementCount))
      container.dataset.elementCount = countNumber
      // clone elemen (btn + modal body)
      const carouselCopy = carouselEl.cloneNode(true);

      // buat id baru dengan mengganti angka terakhir
      const oldCarId = carouselEl.id;
      const tempId = replaceTrailingNumber(oldCarId,countNumber)
      const newCarId = generateUniqueId(tempId, container);

      carouselCopy.id = newCarId;

      function updateCarouselAttributes(carouselCopyElement, oldCarId, newCarId) {
        const oldSuffix = oldCarId.split('-').slice(1).join('-');
        const newSuffix = newCarId.split('-').slice(1).join('-');
 
        // Ambil semua elemen di dalam modal yang disalin
        carouselCopyElement.querySelectorAll('*').forEach(el => {
          // 1️⃣ Cek setiap atribut
          for (const attr of el.getAttributeNames()) {
            const val = el.getAttribute(attr);
            if (!val || typeof val !== 'string') continue;

            // 2️⃣ Kalau value mengandung ID lama, ganti jadi ID baru
            if (arraySubsequenceMatch(val.split('-'), oldSuffix.split('-'))) {
              const newVal = replaceIdSuffix(val,oldSuffix, newSuffix);
              el.setAttribute(attr, newVal);
            }
          }

          // 3️⃣ Kalau ID-nya sendiri mengandung substring lama, ganti juga
          if (el.id && arraySubsequenceMatch(el.id.split('-'), oldSuffix.split('-'))) {
            const newId = replaceIdSuffix(el.id,oldSuffix, newSuffix);

            // Update id di DOM
            el.id = newId;

            // 4️⃣ Update juga di database (webpageDb)
            const originalField = webpageDb.find(f => f.id === el.id);
            if (originalField) {
              const cloned = structuredClone(originalField);
              cloned.id = newId;
              cloned.action = 'new-add'
              webpageDb.push(cloned);
            }
          }
        });
      }
      
      const originalOrder = parseInt(carouselCopy.dataset.elementOrder || '0', 10);
      const newOrderBase = originalOrder + 1;

      if(mode=='all'){
        // update element order btnCopy: +1 dari original (jika ada)
        carouselCopy.dataset.elementOrder = String(newOrderBase);

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

        carouselEl.insertAdjacentElement('afterend', carouselCopy);

        updateCarouselAttributes(carouselCopy, oldCarId, newCarId)

        // ✅ Duplikasi semua elemen di webpageDb yang terkait dengan oldCarId
        const relatedObjects = webpageDb.filter(obj => arraySubsequenceMatch(obj.id.split('-'), oldCarId.split('-')));

        relatedObjects.forEach(originalObj => {
          const clonedObj = deepClone(originalObj);
          if(clonedObj.file){
            delete clonedObj.file
          }

          if (clonedObj.id.startsWith('carousel')) {
            clonedObj.element_order = String(newOrderBase);
          }

          clonedObj.id = replaceIdSuffix(clonedObj.id,oldCarId, newCarId);
          clonedObj.action = 'new-add';
          webpageDb.push(clonedObj);
        });   

        //update element count container
        if (container.id.startsWith('wrapper-section-accordion')) {
          const containerField = webpageDb.find(f => f.id === container.id.split('-').slice(1).join('-'));
          if (containerField){
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
      }

      carouselCopy?.removeAttribute('data-listener-added')
      carouselCopy
        .querySelectorAll('[data-listener-added]')
        .forEach(el => el.removeAttribute('data-listener-added'));

      // Duplikat body Dropdowns
      const bodyDropdown = carouselEl.querySelectorAll(`[data-dropdown-toggle]`);
      bodyDropdown.forEach(dropdown=>{
        let bodyDropdown = getEl(dropdown.dataset.dropdownToggle)
        if(!bodyDropdown) return
        
        let copyBodyDropdown = bodyDropdown.cloneNode(true);
        copyBodyDropdown.id = replaceIdSuffix(copyBodyDropdown.id,oldCarId, newCarId);
        
        copyBodyDropdown.querySelectorAll('[id]').forEach(el => {
          el.id = replaceIdSuffix(el.id,oldCarId,newCarId)
        });
        copyBodyDropdown.dataset.initialized = ''; 
        copyBodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';

        bodyDropdown.insertAdjacentElement('afterend', copyBodyDropdown);
      }) 

      const copyDropdown = carouselCopy.querySelectorAll(`[data-dropdown-toggle]`)
      copyDropdown.forEach(dropdown=>{
        let bodyDropdown = getEl(dropdown.dataset.dropdownToggle)
        if(!bodyDropdown) return
        
        bodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';
      })

      const dropdown = carouselEl.querySelectorAll(`[data-dropdown-toggle]`)
      dropdown.forEach(dropdown=>{
        let bodyDropdown = getEl(dropdown.dataset.dropdownToggle)
        if(!bodyDropdown) return

        bodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';
      })

      // inisialisasi dropdown baru: coba id dropdown baru dari btnCopy's toggles
      if(mode=='all'){
        const anyToggle = carouselCopy.querySelectorAll('[data-dropdown-toggle]');
        if (anyToggle) {
          anyToggle.forEach(target=>{
            const newDropdownTarget = target.getAttribute('data-dropdown-toggle');
            dropdownInitialized('', newDropdownTarget);
          })
        }
      }

      globals.isFormDirty = true
      globals.webpageDb=webpageDb

      // init accordion
      setTimeout(() => {
        try {
          initFlowbite();
        } catch (error) {
          // console.error('❌ Gagal inisialisasi carousel', error);
        }
      }, 100);

      return true;
  } catch (e) {
    console.error('duplicateCarousel error', e);
    return false;
  }
}

function addItemCarousel(event){
  webpageDb=globals.webpageDb
  carouselSelect=globals.carouselSelect

  const btnAdd = event.target;
  const idSuffix = btnAdd.id.replace('add-item-', '');

  const slideIndicator = carouselSelect.querySelector(`#slide-indicator-${idSuffix}`);
  const indicators = slideIndicator.children;
  const lastIndicator = indicators[indicators.length - 1];
  const newIndex = Number(lastIndicator.dataset.carouselSlideTo) + 1;

  slideIndicator.insertAdjacentHTML('beforeend', `
    <button type="button"
      class="${lastIndicator.classList} rounded-full"
      style="${lastIndicator.getAttribute('style')}"
      aria-current="false"
      aria-label="Slide ${newIndex + 1}"
      data-carousel-slide-to="${newIndex}">
    </button>
  `);

  const itemCarouselWrapper = carouselSelect.querySelector(`#element-${idSuffix}`);
  const newItemCount = handleElementCount(itemCarouselWrapper.children[0], itemCarouselWrapper.dataset.itemCount);
  itemCarouselWrapper.dataset.itemCount = newItemCount;

  const itemCarousel = itemCarouselWrapper.querySelector(`[id^="item-${idSuffix}"]`)
  let rgba
  if(carouselSelect.dataset.textPosition === 'on-image'){
    if(itemCarousel.style.backgroundImage){
      rgba = itemCarousel.style.backgroundImage.split('rgba(')[1].split(')')[0]
    }else{
      rgba = itemCarousel.style.backgroundColor
    }
  }else{
    rgba = 0,0,0,0.0
  }

  const newItemId = generateUniqueId(`item-${idSuffix}-${newItemCount}`, itemCarouselWrapper);
  
  let itemContent =''
  let classList = itemCarousel.classList
  let styleItem
  let style
  if(carouselSelect.dataset.text === "true"){
    if(carouselSelect.dataset.textPosition === "on-image"){
      itemContent = `
      <div id="field-${newItemId}" class="border border-b-1 border-gray-500 p-1 max-w-[100%] scroll-hidden overflow-scroll" style="" contenteditable="true"></div>
      `
      style = `padding:25px;background-image: linear-gradient(rgba(${rgba})), url(/assets/img/almond1DefaultImageCarousel.jpg); background-size: cover; background-position: center;`
      styleItem=style
   
    }else{
      let copyItem = itemCarousel.cloneNode(true)
      copyItem.querySelector('img').setAttribute('src', '/assets/img/almond1DefaultImageCarousel.jpg')

      copyItem.children[1].innerHTML = `
      <div id="field-${newItemId}" class="border border-b-1 border-gray-500 p-1 max-w-[100%] scroll-hidden overflow-scroll" style="" contenteditable="true"></div>
      `
      itemContent= copyItem.innerHTML
      classList = copyItem.classList
      
      style=copyItem.children[1].getAttribute('style')
      styleItem='flex-direction:column;'

      webpageDb.push(
      {
        id: `img-text-on-image-${newItemId}`,
        type:'img-carousel',
        action:'new-add',
        content:'/assets/img/almond1DefaultImageCarousel.jpg',
      })
    }

    webpageDb.push({
      id:`field-${newItemId}`,
      type:'field',
      action:'new-add'
    })
  }else{
    style = `padding:25px;background-image: linear-gradient(rgba(${rgba})), url(/assets/img/almond1DefaultImageCarousel.jpg); background-size: cover; background-position: center;`
    styleItem = `padding:25px;background-image: linear-gradient(rgba(${rgba})), url(/assets/img/almond1DefaultImageCarousel.jpg); background-size: cover; background-position: center;`
  }

  webpageDb.push({
    id: newItemId,
    type:'item-carousel',
    element_order:newItemCount,
    style:style,
    action:'new-add'
  })

  webpageDb.forEach(field =>{
    if(field.id === idSuffix){
      field.action= updateActionProperty(field.action, 'update')
      field.element_count = newItemCount
    }
  })
  
  let newItem = `
    <div id="${newItemId}"
      data-item-order="${newItemCount}"
      class="${classList}"
      style="${styleItem}"
      data-carousel-item>
      ${itemContent}
    </div>
  `

  itemCarouselWrapper.children[0].insertAdjacentHTML('beforeend', newItem);

  globals.webpageDb=webpageDb
  updateStylingControls(carouselSelect);
  globals.isFormDirty = true

  setTimeout(() => {
    try {
      initFlowbite();
    } catch (error) {
      console.error('❌ Gagal menginisialisasi Carousel:', error);
    }
  }, 100);
}

const copyItemCarousel=(idItemCarousel, mode="all")=>{
  try {
      webpageDb=globals.webpageDb
      let itemCarouselId = idItemCarousel
      const itemCarouselEl = getEl(itemCarouselId);
      const editItemCarouselEl = getEl(`edit-${itemCarouselId}`);

      if(!itemCarouselEl || !editItemCarouselEl) return
      
      const containerItem = itemCarouselEl.parentElement.parentElement;
      const editContainerItem = editItemCarouselEl.parentElement;

      const container = containerItem.parentElement.parentElement;
      if (!container) {
        console.error('container carousel tidak ditemukan');
        return false;
      }

      // hitung count baru & simpan
      const countNumber = handleElementCount(itemCarouselEl.parentElement, containerItem.dataset.itemCount);

      // clone elemen (btn + modal body)
      const itemCarouselCopy = itemCarouselEl.cloneNode(true);
      const editItemCarouselCopy = editItemCarouselEl.cloneNode(true);

      const originalOrder = parseInt(itemCarouselCopy.dataset.itemOrder || '0', 10);
      const newOrderBase = originalOrder + 1;

      // update element order btnCopy: +1 dari original (jika ada)
      itemCarouselCopy.dataset.itemOrder = String(newOrderBase);
      editItemCarouselCopy.dataset.itemOrder = String(newOrderBase);
      containerItem.dataset.itemCount = String(countNumber);
      editContainerItem.dataset.itemCount = String(countNumber);

      // buat id baru dengan mengganti angka terakhir
      const oldItemCarId = itemCarouselEl.id;
      const newItemCarId = generateUniqueId(oldItemCarId, containerItem);

      itemCarouselCopy.id = newItemCarId;
      editItemCarouselCopy.id = `edit-${newItemCarId}`;

      function updateItemCarouselAttributes(itemCarouselCopyElement, oldItemCarId, newItemCarId) {
        const oldSuffix = oldItemCarId.split('-').slice(1).join('-');
        const newSuffix = newItemCarId.split('-').slice(1).join('-');

        // Ambil semua elemen di dalam modal yang disalin
        itemCarouselCopyElement.querySelectorAll('*').forEach(el => {
          // 1️⃣ Cek setiap atribut
          for (const attr of el.getAttributeNames()) {
            const val = el.getAttribute(attr);
            if (!val || typeof val !== 'string') continue;

            // 2️⃣ Kalau value mengandung ID lama, ganti jadi ID baru
            if (arraySubsequenceMatch(val.split('-'), oldSuffix.split('-'))) {
              const newVal = replaceIdSuffix(val, oldSuffix, newSuffix);
              el.setAttribute(attr, newVal);
            }
          }

          // 3️⃣ Kalau ID-nya sendiri mengandung substring lama, ganti juga
          if (el.id && arraySubsequenceMatch(el.id.split('-'), oldSuffix.split('-'))) {
            const newId = replaceIdSuffix(el.id, oldSuffix, newSuffix);

            // Update id di DOM
            el.id = newId;

            // 4️⃣ Update juga di database (webpageDb)
            const originalField = webpageDb.find(f => f.id === el.id);
            if (originalField) {
              const cloned = structuredClone(originalField);
              cloned.id = newId;
              cloned.action = 'new-add';
              webpageDb.push(cloned);
            }
          }
        });
      }

      // 1) Perbarui element_order pada sibling (hanya direct children container)
      Array.from(itemCarouselEl.parentElement.children).forEach(el => {
        const currentOrder = parseInt(el.dataset?.itemOrder || '0', 10);
        if (isNaN(currentOrder)) return;

        if (currentOrder >= newOrderBase) {
          const updated = currentOrder + 1;
          el.dataset.itemOrder = String(updated);

          const editItemCarousel = getEl(`edit-${el.id}`)
          if(!editItemCarousel) return
        
          editItemCarousel.dataset.itemOrder = String(updated)

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

      updateItemCarouselAttributes(itemCarouselCopy, oldItemCarId, newItemCarId)
      updateItemCarouselAttributes(editItemCarouselCopy, oldItemCarId, newItemCarId)

      itemCarouselEl.insertAdjacentElement('afterend', itemCarouselCopy);
      editItemCarouselEl.insertAdjacentElement('afterend', editItemCarouselCopy);

      itemCarouselCopy?.removeAttribute('data-listener-added')
      itemCarouselCopy
        .querySelectorAll('[data-listener-added]')
        .forEach(el => el.removeAttribute('data-listener-added'));
        
      editItemCarouselCopy?.removeAttribute('data-listener-added')
      editItemCarouselCopy
        .querySelectorAll('[data-listener-added]')
        .forEach(el => el.removeAttribute('data-listener-added'));

      // tambahin indicator
      const slideIndicator = containerItem.querySelector(`[id^="slide-indicator"]`)
      const newIndicator = slideIndicator.querySelector('[type=button]').cloneNode(true)

      Array.from(slideIndicator.children).forEach(ind=>{
        const count = parseInt(ind.getAttribute('data-carousel-slide-to'));
        ind.setAttribute('data-carousel-slide-to', count+1)
      })

      slideIndicator.insertAdjacentElement('afterbegin', newIndicator)

      // ✅ Duplikasi semua elemen di webpageDb yang terkait dengan oldItemCarId
      const relatedObjects = webpageDb.filter(obj => arraySubsequenceMatch(obj.id.split('-'), oldItemCarId.split('-')));

      relatedObjects.forEach(originalObj => {
        const clonedObj = deepClone(originalObj);

        if (clonedObj.id.startsWith('item-carousel')) {
          clonedObj.element_order = String(newOrderBase);
        }

        clonedObj.id = replaceIdSuffix(clonedObj.id, oldItemCarId, newItemCarId);
        clonedObj.action = 'new-add';
        webpageDb.push(clonedObj);
      });   

      //update element count container
      if (containerItem.id.startsWith('element-carousel')) {
        const containerField = webpageDb.find(f => f.id === containerItem.id.split('-').slice(1).join('-'));
        if (containerField) {
          containerField.element_count = countNumber;
          containerField.action =  updateActionProperty(containerField.action, 'update')
        }
      }
      
      // Duplikat body Dropdowns
      const bodyDropdown = itemCarouselEl.querySelectorAll(`[data-dropdown-toggle]`);
      bodyDropdown.forEach(btnDropdown=>{
        let bodyDropdown = getEl(btnDropdown.dataset.dropdownToggle)
        if(!bodyDropdown) return
        
        let copyBodyDropdown = bodyDropdown.cloneNode(true);
        copyBodyDropdown.id = replaceIdSuffix(copyBodyDropdown.id, oldItemCarId, newItemCarId);
        
        copyBodyDropdown.querySelectorAll('[id]').forEach(el => {
          el.id = replaceIdSuffix(el.id, oldItemCarId,newItemCarId)
        });
        copyBodyDropdown.dataset.initialized = ''; 
        copyBodyDropdown.setAttribute('class', 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700');
        copyBodyDropdown.setAttribute('style', 'position: absolute; inset: auto auto 0px 0px; margin: 0px; transform: translate3d(216.8px, -229.6px, 0px);');

        bodyDropdown.insertAdjacentElement('afterend', copyBodyDropdown);
      }) 

      const dropdownBtn = editItemCarouselEl.querySelector('[data-dropdown-toggle]')
     
      const bodyEditItemDropdown = getEl(dropdownBtn.dataset.dropdownToggle)
      if(!bodyEditItemDropdown)return

      const copyEditItemDropdwon = bodyEditItemDropdown.cloneNode(true)
      copyEditItemDropdwon.id = replaceIdSuffix(copyEditItemDropdwon.id, oldItemCarId, newItemCarId);

      copyEditItemDropdwon.querySelectorAll('[id]').forEach(el => {
        el.id = replaceIdSuffix(el.id, oldItemCarId, newItemCarId)
      });
      copyEditItemDropdwon.dataset.initialized = ''; 
      copyEditItemDropdwon.setAttribute('class', 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700');
      copyEditItemDropdwon.setAttribute('style', 'position: absolute; inset: auto auto 0px 0px; margin: 0px; transform: translate3d(216.8px, -229.6px, 0px);');

      bodyEditItemDropdown.insertAdjacentElement('afterend', copyEditItemDropdwon);
      copyEditItemDropdwon.removeAttribute('data-listener-added')
      copyEditItemDropdwon
        .querySelectorAll('[data-listener-added]')
        .forEach(el => el.removeAttribute('data-listener-added'));

      const editBodyDropdown = editItemCarouselCopy.parentElement.querySelectorAll(`[data-dropdown-toggle]`);
      editBodyDropdown.forEach(btnDropdown=>{
        let bodyDropdown = getEl(btnDropdown.dataset.dropdownToggle)
        if(!bodyDropdown) return
        
        bodyDropdown.setAttribute('class', 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700');
        bodyDropdown.setAttribute('style', 'position: absolute; inset: auto auto 0px 0px; margin: 0px; transform: translate3d(216.8px, -229.6px, 0px);');

      }) 


      // inisialisasi dropdown baru: coba id dropdown baru dari btnCopy's toggles
      if(mode=='all'){
        const anyToggle = itemCarouselCopy.querySelectorAll('[data-dropdown-toggle]');
        if (anyToggle) {
          anyToggle.forEach(target=>{
            const newDropdownTarget = target.getAttribute('data-dropdown-toggle');
            dropdownInitialized('', newDropdownTarget);
          })
        }
      }
      globals.isFormDirty = true
      globals.webpageDb=webpageDb

      setListenerSetImage()

      // init accordion
      setTimeout(() => {
        try {
          initFlowbite();
        } catch (error) {
          // console.error('❌ Gagal inisialisasi carousel', error);
        }
      }, 100);

      return true;
  } catch (e) {
    console.error('duplicateCarousel error', e);
    return false;
  }
}

// ======= SYLING =======
function setImageItem(idParts){
  editCarouselItem=globals.editCarouselItem

  editCarouselItem = getEl(`edit-${idParts.slice(2).join('-')}`)
  if(!editCarouselItem) return

  globals.isFormDirty = true

  bodyItem = editCarouselItem.parentElement.parentElement
  globals.bodyItem = editCarouselItem.parentElement.parentElement
  globals.editCarouselItem=editCarouselItem

}

function resetImage(idParts){
  let carouselItem = getEl(`${idParts.slice(2).join('-')}`)
  editCarouselItem = getEl(`edit-${idParts.slice(2).join('-')}`) 

  if(!carouselItem || !editCarouselItem) return

  bodyItem = editCarouselItem.parentElement.parentElement
  globals.bodyItem = editCarouselItem.parentElement.parentElement
  let styleField = carouselItem.getAttribute("style"); // ambil sebagai string

  if (styleField && styleField.includes("background-image")) {
    // Ambil nilai rgba(...)
    let match = styleField.match(/rgba?\([^)]+\)/);
    let rgba = match ? match[0] : "transparent";

    // Replace background-image:... dengan background-color:rgba(...)
    styleField = styleField.replace(/background-image:[^;]+;/, `background-color:${rgba};`);

    // Set kembali ke elemen
    carouselItem.setAttribute("style", styleField);
    editCarouselItem.setAttribute("style", styleField);

    // Update ke database
    webpageDb = webpageDb.forEach(field => {
      if (field.id === carouselItem.id) {
        field.style = styleField;
        field.action =  updateActionProperty(field.action, 'update')
        delete field.file;
      }
      return field;
    });
    globals.webpageDb=webpageDb
  } else {
    carouselItem.style.backgroundColor = "";
  }

  globals.isFormDirty = true
  globals.editCarouselItem = editCarouselItem
}

function addTextCarousel(event){
  webpageDb=globals.webpageDb
  carouselSelect=globals.carouselSelect
  const btnAddText = event.target

  if(carouselSelect.dataset.text === 'false' ){
    carouselSelect.querySelectorAll('[id^="item-carousel-"]').forEach(item=>{
      if(carouselSelect.dataset.textPosition === 'on-image'){
        item.innerHTML=`
        <div id="field-${item.id}" class="border border-b-1 border-gray-500 p-1 max-w-[100%] max-h-[100%] scroll-hidden overflow-scroll" style="" contenteditable="true">Text Field</div>
        `
      }else{
        let img = item.querySelector('img').getAttribute('src') 
        item.setAttribute('style', `background-image:linear-gradient(rgba(0,0,0,0.0)), url('${img}');background-size:cover;background-position:center;`)
        item.innerHTML =item.querySelector('[id^="field-"]').outerHTML
      }
      webpageDb.push({
        id:`field-${item.id}`,
        type:'field',
        action:'new-add',
        content:'Text Field',
        style: ``
      })
    })

    carouselSelect.dataset.text = "true"
    
  }else{
    carouselSelect.querySelectorAll('[id^="item-carousel-"]').forEach(item=>{
      let img
      if(carouselSelect.dataset.textPosition !== 'on-image'){
        img = item.querySelector('img').getAttribute('src') 
        item.setAttribute('style', `background-image:linear-gradient(rgba(0,0,0,0.0)), url('${img}');background-size:cover;background-position:center;`)
      }

      item.innerHTML =''
      if(carouselSelect.dataset.textPosition === 'below-image'){
        webpageDb.forEach(field =>{
          if(field.id === item.id){
            // field.file = webpageDb.find(img => img.id === `img-text-on-image-${field.id}`).file,
            field.action = updateActionProperty(field.action, 'update')

            if(field.temp){
              img = field.temp
            }
            field.style= `background-image:linear-gradient(rgba(0,0,0,0.0)), url('${img}');background-size:cover;background-position:center;`
          }
        })
      }

      const findField = webpageDb.findIndex(field=>field.id===`field-${item.id}`)
      if(findField > 0){
        const updateAction = updateActionProperty(webpageDb[findField].action, 'delete')

        if(updateAction.includes('new')){
          webpageDb.splice(findField,1)
        }else{
          webpageDb[findField].action=updateAction
        }
      }

      const findImg = webpageDb.findIndex(field=>field.id===`img-text-on-image-${item.id}`)
      if(findImg > 0){
        
        const updateActionImg = updateActionProperty(webpageDb[findImg].action, 'delete')

        if(updateActionImg.includes('new')){
          webpageDb.splice(findImg,1)
        }else{
          webpageDb[findImg].action=updateActionImg
        }
      }
    })
    
    carouselSelect.dataset.textPosition = 'on-image'

    const btnTextPost = getEl('btn-text-position')
    if(!btnTextPost)return

    btnTextPost.textContent = 'On Image'
    carouselSelect.dataset.text = "false"
  }

  btnAddText.dataset.text = btnAddText.dataset.text == "add" ? "remove" : "add"
  webpageDb.forEach(field=>{
    if(field.id === carouselSelect.id){
      let content=parseStyleObj(field.content)
      content.dataTextPosition = carouselSelect.dataset.textPosition
      content.dataText=carouselSelect.dataset.text

      field.content = stringifyStyleObj(content)
      field.action=updateActionProperty(field.action, 'update')
    }
  })

  globals.webpageDb=webpageDb
  globals.carouselSelect=carouselSelect

  globals.isFormDirty = true

  btnAddText.textContent = btnAddText.textContent == "Add Text" ? "Remove Text" : "Add Text"
}

function btnHideNext(event){
  carouselSelect=globals.carouselSelect
  webpageDb=globals.webpageDb
  
  carouselSelect.querySelectorAll('[id^="slider-"]').forEach(btn=>{
    if(btn.children[0].classList.contains('hidden')){
      btn.children[0].classList.remove('hidden')
    }else{
      btn.children[0].classList.add('hidden')
    }
  })

  if(carouselSelect.dataset.textPosition == 'below-image'){
    if(carouselSelect.dataset.nextBtnHide == "true"){
      carouselSelect.querySelectorAll('[id^="item-carousel-"]').forEach(item=>{
        item.children[1].classList.remove('px-3')
        item.children[1].classList.add('px-6')
      })
    }else{
      carouselSelect.querySelectorAll('[id^="item-carousel-"]').forEach(item=>{
        item.children[1].classList.remove('px-6')
        item.children[1].classList.add('px-3')
      })
    }
  }

  const btnHide = event.target
  carouselSelect.dataset.nextBtnHide = carouselSelect.dataset.nextBtnHide == "true" ? "false" : "true"
  webpageDb.forEach(field=>{
    if(field.id === carouselSelect.id){
      let content=parseStyleObj(field.content)
      content.dataNextBtnHide = carouselSelect.dataset.nextBtnHide
      field.content = stringifyStyleObj(content)
      field.action=updateActionProperty(field.action, 'update')
    }
  })

  globals.isFormDirty = true

  globals.webpageDb=webpageDb
  globals.carouselSelect=carouselSelect
  btnHide.textContent = carouselSelect.dataset.nextBtnHide == "true" ? "Unhide" : "Hide"
}

function btnTextPosition(event){
  carouselSelect=globals.carouselSelect
  webpageDb=globals.webpageDb
  let carouselId
  carouselSelect.querySelectorAll('[id^="item-carousel-"]').forEach(item=>{
    carouselId = item.id.split('-').slice(1,-1).join('-')
    let img
    const imgWrapper = document.createElement('div')
    const newImg = document.createElement('img')

    if(carouselSelect.dataset.textPosition === "on-image"){
      img = item.style.cssText
      
      let style = item.style.cssText
      let match = style.match(/rgba\([^)]*\)/g);
      let rgba

      if (match && match.length > 0) {
        // ambil warna pertama
        rgba = match[0];

        // kalau warnanya transparan penuh (rgba(0,0,0,0) atau rgba(0,0,0,0.0))
        if (/rgba\(0,\s*0,\s*0,\s*0(\.0+)?\)/.test(rgba)) {
          rgba = "rgba(128,128,128,1)"; // ganti jadi abu-abu
        }
      }

      item.style = `background-color: ${rgba};`;

      item.setAttribute('style', ``)
      let rawUrl = img.split('url(')[1].split(')')[0]
      let imgUrl = rawUrl.replace(/^['"]|['"]$/g, '');

      imgWrapper.id = `img-text-on-image-${item.id}`
  
      imgWrapper.style.height='30%'
      imgWrapper.style.width='100%'
      newImg.setAttribute('src', imgUrl)

      newImg.style.width='100%'

      item.classList.remove('p-6')

      item.querySelector('[id^="field-"]').removeAttribute('data-listener-added')
      item.querySelector('[id^="field-"]').removeAttribute('data-listener-mouse-added')

      imgWrapper.appendChild(newImg)
      let newText = `
        ${imgWrapper.outerHTML}
        <div class="flex justify-center items-start h-full w-full px-6 py-5 overflow-y-auto" style="background-color: ${rgba};">
          ${item.querySelector('[id^="field-"]').outerHTML}
        </div>
      `

      item.innerHTML =''
      item.insertAdjacentHTML('beforeend', newText)
      item.classList.add('flex-col')
      let carouselItem = webpageDb.find(field => field.id === item.id)

      webpageDb.forEach(field=>{
        if(field.id === item.id){
          if(field.style.includes('temp')){
            const regex = /url\(['"]?([^'"]+)['"]?\)/;
            const match = field.style.match(regex);
            
            if (match) {
              field.temp = match[1]; // match[1] mengambil data di dalam kurung (capture group)
            }
          }

          field.style = `background-color: ${rgba};`
          field.action=updateActionProperty(field.action, 'update')
        }
      })
      
      webpageDb.push({
        id:`img-text-on-image-${item.id}`,
        type:'img-carousel',
        content: imgUrl,
        action:'new-add'
      })

    }else{
      let imgField = item.querySelector('img')
      img = imgField.getAttribute('src') 
      item.setAttribute('style', `background-image:linear-gradient(rgba(0,0,0,0.0)), url('${img}');background-size:cover;background-position:center;`)
      item.innerHTML =item.querySelector('[id^="field-"]').outerHTML

      item.classList.add('p-6')

      webpageDb.forEach(field =>{
        if(field.id === item.id){
          field.action=updateActionProperty(field.action, 'update')
        }
      })

      const findItem = webpageDb.findIndex(field=>field.id === imgField.parentElement.id)
      if(findItem > 0){
        const updateAction = updateActionProperty(webpageDb[findItem].action, 'delete')

        if(updateAction.includes('new')){
          webpageDb.splice(findItem,1)
        }else{
          webpageDb[findItem].action=updateAction
        }
      }

      webpageDb.forEach(field => {
        if(field.id === item.id){
          if(field.temp){
            img = field.temp
          }

          field.style = `background-image:linear-gradient(rgba(0,0,0,0.0)), url('${img}');background-size:cover;background-position:center;`
          field.action=updateActionProperty(field.action, 'update')
        }
      })

    }
  })

  carouselSelect.dataset.textPosition = carouselSelect.dataset.textPosition == 'on-image' ? 'below-image' : 'on-image' 
  globals.carouselSelect = carouselSelect
  webpageDb.map(field=>{
    if(field.id === carouselSelect.id){
      let content=parseStyleObj(field.content)
      content.dataTextPosition = carouselSelect.dataset.textPosition
      field.content = stringifyStyleObj(content)
      field.action=updateActionProperty(field.action, 'update')
    }
  })
  globals.webpageDb=webpageDb

  globals.isFormDirty = true

  const btnPosition = event.target
  btnPosition.textContent = btnPosition.textContent == "On Item" ? "Below The Item" : "On Item"
}

export {
  createCarousel, 
  createDropdownCarousel, 
  addCarousel,
  copyCarousel,
  copyItemCarousel,
  setImageItem,
  resetImage,
  addItemCarousel,
  addTextCarousel,
  btnHideNext,
  btnTextPosition
}