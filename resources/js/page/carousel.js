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

let webpageDb=  globals.webpageDb
let editCarouselItem=globals.editCarouselItem
let carouselSelect=globals.carouselSelect
let bodyItem=globals.bodyItem

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

const createCarousel = (carousel, childElements,editorContainer) => {
    let dataSet = parseStyleObj(carousel.content)
    return`
      <div id="${carousel.id}" data-element-order="${carousel.element_order}" data-text-position="${dataSet.dataTextPosition}" data-text="${dataSet.dataText}" data-next-btn-hide="${dataSet.dataNextBtnHide}" data-carousel="static" class="flex justify-center items-center flex-col" style="${parseStyleObj(carousel.style).css}">
        <div type="button" class="bg-white rounded-full absolute right-[-1.7rem] top-[-0.1rem] z-0 cursor-pointer" data-dropdown-toggle="dropdown-${carousel.id}" data-dropdown-placement="right-end">
          ${renderSvg()}                 
        </div>

        <div id="element-${carousel.id}" data-item-count="${carousel.element_count}" class="relative w-full h-full" data-carousel="static">
          <!-- Carousel wrapper -->
          <div id="wrapper-item-${carousel.id}" class="relative w-full h-full overflow-hidden rounded-lg text-black">
              <!-- createCarouselItem --!>
              ${createCarouselItem(carousel, childElements, editorContainer, dataSet.dataTextPosition, dataSet.dataText, dataSet.dataNextBtnHide)}
          </div>
          <!-- slideIndicator --!>
          ${slideIndicator(carousel, childElements)}
          <!-- Slider controls -->
          <button id="slider-prev-btn" type="button" style="${parseStyleObj(carousel.style).paddingSlideController}" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none" data-carousel-prev>
              <span style="${parseStyleObj(carousel.style).slideControlWrapperSize}" class="${dataSet.dataNextBtnHide === 'false' ? '':'hidden'} inline-flex items-center justify-center rounded-full bg-gray-400/30 group-hover:bg-gray-400/50 group-focus:ring-4 group-focus:ring-gray-300 group-focus:outline-none">
                  <svg style="${parseStyleObj(carousel.style).svgControlerSlideSize}" class="text-gray-500 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                  </svg>
                  <span class="sr-only">Previous</span>
              </span>
          </button>
          <button id="slider-next-btn" type="button" style="${parseStyleObj(carousel.style).paddingSlideController}" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none" data-carousel-next>
              <span style="${parseStyleObj(carousel.style).slideControlWrapperSize}" class="${dataSet.dataNextBtnHide === 'false' ? '':'hidden'} inline-flex items-center justify-center rounded-full bg-gray-400/30 group-hover:bg-gray-400/50 group-focus:ring-4 group-focus:ring-gray-300 group-focus:outline-none">
                  <svg class=" text-gray-500 rtl:rotate-180" aria-hidden="true" style="${parseStyleObj(carousel.style).svgControlerSlideSize}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span class="sr-only">Next</span>
              </span>
          </button>
        </div>
      </div>
    `
}
const createCarouselItem = (carousel, childElements,editorContainer, textPosition, textStatus, btnHide) => {
  let item=``
  // console.log(childElements)
  childElements = childElements.sort((a,b) => a.element_order - b.element_order)
  childElements.forEach(el=>{
      if(el.id.startsWith('item') && arraySubsequenceMatch(el.id.split('-'), carousel.id.split('-'))){
        let field= childElements.filter(field=>field.id === `field-${el.id}`)
        let textImage=''
          // console.log(`field-${el.id}`, field, el)
        if(textStatus === 'true' ){
            editorContainer.insertAdjacentHTML('afterend', createDropdownField(field[0].id))
            if(textPosition === 'on-image'){
              textImage = createField(field[0])

            }else if(textPosition === 'below-image'){

              let imgTxt = childElements.filter(img=>img.id === `img-text-on-image-${el.id}`)
              textImage = `
                  <div style="width:100%;height:30%;">
                    <img id="${imgTxt[0].id}" src="${imgTxt[0].content}" style="width:100%;">"
                  </div>
                  <div class="flex justify-center items-start h-full w-full ${btnHide ? 'px-3' : 'px-6'} ${btnHide} py-5 overflow-y-auto" style="${el.style}">
                    ${createField(field[0])}
                  </div>
                  `
              // console.log(imgTxt, `img-text-on-image-${el.id}`)
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
  // console.log('length item carousel', itemCarouselLength)
  let slide=``
  for(let i=0;i <= itemCarouselLength-1;i++){
      let indicator = i
      slide += `
      <button type="button" style="${parseStyleObj(carousel.style).indicatorSize}" class="rounded-full" aria-current="true" aria-label="Slide ${indicator+1}" data-carousel-slide-to="${i}"></button>
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
                  <svg style="${svgControlerSlideSize}" class="text-gray-500 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                  </svg>
                  <span class="sr-only">Previous</span>
              </span>
          </button>
          <button id="slider-next-btn" type="button" style="${paddingSlideController}" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none" data-carousel-next>
              <span style="${slideControlWrapperSize}" class="inline-flex items-center justify-center rounded-full bg-gray-400/30 group-hover:bg-gray-400/50 group-focus:ring-4 group-focus:ring-gray-300 group-focus:outline-none">
                  <svg class=" text-gray-500 rtl:rotate-180" aria-hidden="true" style="${svgControlerSlideSize}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
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
        </ul>
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
          <li><a id="delete-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
        </ul>
      </div>
    `

    if(idParts[2] === 'accordion'){
      idAppend = `wrapper-section-${idParts.slice(2, idParts.length).join('-')}`;

      bodyAppend = document.getElementById(idAppend);
      fieldNumber = parseInt(bodyAppend.getAttribute('data-element-count')) + 1;
      bodyAppend.dataset.elementCount = fieldNumber;

      // console.log('add: ',fieldNumber, parseInt(bodyAppend.getAttribute('data-element-count')) + 1)

      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`
  
      widthCarousel='300px'
      heightCarousel='200px'

      svgControlerSlideSize = 'width:12px; height:12px;'
      slideControlWrapperSize = 'width:24px;height:24px;'
      indicatorSize = 'width:8px; height:8px;'
      bottomIndicatorPosition = 'bottom:2px'
      paddingSlideController = 'padding-left:2px;padding-right:2px;'

    }else{
      idAppend = `editor-container-section-${idParts[4]}`;
      const section = document.getElementById(idAppend)

      fieldNumber = section.dataset.elementCount;
      fieldNumber++
      section.dataset.elementCount = fieldNumber

      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`
  
      widthCarousel='400px'
      heightCarousel='300px'
      
      idAppend = `editor-container-section-${idParts[4]}`

      svgControlerSlideSize = 'width:16px; height:16px;'
      slideControlWrapperSize = 'width:32px;height:32px;'
      indicatorSize = 'width:10px; height:10px;'
      bottomIndicatorPosition = 'bottom:5px'
      paddingSlideController = 'padding-left:4px;padding-right:4px;'
    }

    document.getElementById(`webpage-section-${idParts.find(part => !isNaN(part))}`).insertAdjacentHTML('beforeend', createDropdown(idPrefix))

    document.getElementById(idAppend).insertAdjacentHTML('beforeend', createCarousel(idPrefix,fieldNumber,widthCarousel,heightCarousel,svgControlerSlideSize,slideControlWrapperSize,indicatorSize,bottomIndicatorPosition,paddingSlideController));

    webpageDb.push({
      id: `${idPrefix}`,
      type:'carousel',
      element_order: fieldNumber,
      style: `{"css":"position:relative;width:${widthCarousel};height:${heightCarousel};","svgControlerSlideSize": "${svgControlerSlideSize}","slideControlWrapperSize": "${slideControlWrapperSize}","indicatorSize": "${indicatorSize}","bottomIndicatorPosition": "${bottomIndicatorPosition}","paddingSlideController": "${paddingSlideController}"}`,
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

    dropdownInitialized('',`dropdown-${idPrefix}`)

    setTimeout(() => {
      try {
          const carouselElement = document.getElementById(idPrefix);
          if (carouselElement) {
              new Carousel(carouselElement);
              // console.log('✅ Carousel berhasil diinisialisasi:', carouselElement.id);
          } else {
              console.warn('⚠️ Elemen Crousel tidak ditemukan setelah appendChild');
          }

          // Panggil initFlowbite setelah inisialisasi accordion spesifik ini
          // dan setelah ada sedikit penundaan
          initFlowbite();

      } catch (error) {
          console.error('❌ Gagal menginisialisasi Carousel:', error);
      }
    }, 100);  

    globals.webpageDb=webpageDb
    console.log('add carousel',webpageDb)
}
const copyCarousel=(idCarousel, mode="all")=>{
  try {
    webpageDb=globals.webpageDb
      let carouselId = idCarousel
      const carouselEl = document.getElementById(carouselId);
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
      const countNumber = (parseInt(container.dataset.elementCount || '0', 10) || 0) + 1;

      // clone elemen (btn + modal body)
      const carouselCopy = carouselEl.cloneNode(true);

      // buat id baru dengan mengganti angka terakhir
      const oldCarId = carouselEl.id;
      const newCarId = replaceTrailingNumber(oldCarId, countNumber);
      // console.log('test',countNumber, {oldBtnId, oldModalId, newBtnId,newModalId})

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

          clonedObj.id = clonedObj.id.replaceAll(oldCarId, newCarId);
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

      // Duplikat body Dropdowns
      const bodyDropdown = carouselEl.querySelectorAll(`[data-dropdown-toggle]`);
      bodyDropdown.forEach(dropdown=>{
        let bodyDropdown = document.getElementById(dropdown.dataset.dropdownToggle)
        let copyBodyDropdown = bodyDropdown.cloneNode(true);
        copyBodyDropdown.id = copyBodyDropdown.id.replaceAll(oldCarId, newCarId);

        // if(copyBodyDropdown.id.includes('head')){
        //   console.log('id Dropdown:',copyBodyDropdown)
        // }
        
        copyBodyDropdown.querySelectorAll('[id]').forEach(el => {
          el.id = el.id.replaceAll(oldCarId,newCarId)
        });
        copyBodyDropdown.dataset.initialized = ''; 
        copyBodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';

        bodyDropdown.insertAdjacentElement('afterend', copyBodyDropdown);
      }) 

      const copyDropdown = carouselCopy.querySelectorAll(`[data-dropdown-toggle]`)
      copyDropdown.forEach(dropdown=>{
        let bodyDropdown = document.getElementById(dropdown.dataset.dropdownToggle)
        bodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';
      })

      const dropdown = carouselEl.querySelectorAll(`[data-dropdown-toggle]`)
      dropdown.forEach(dropdown=>{
        let bodyDropdown = document.getElementById(dropdown.dataset.dropdownToggle)
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

      globals.webpageDb=webpageDb
      console.log('duplicated carousel success', { oldCarId, newCarId}, globals.webpageDb);

      // init accordion
      setTimeout(() => {
        try {
          initFlowbite();
        } catch (error) {
          console.error('❌ Gagal inisialisasi carousel', error);
        }
      }, 100);

      return true;
  } catch (e) {
    console.error('duplicateCarousel error', e);
    return false;
  }
}
// ======= SYLING =======
const copyItemCarousel=(idItemCarousel, mode="all")=>{
  try {
      webpageDb=globals.webpageDb
      let itemCarouselId = idItemCarousel
      const itemCarouselEl = document.getElementById(itemCarouselId);
      const editItemCarouselEl = document.getElementById(`edit-${itemCarouselId}`);
      if (!itemCarouselEl) {
        console.error('carousel tidak ditemukan:', itemCarouselId);
        return false;
      }

      const containerItem = itemCarouselEl.parentElement.parentElement;
      const editContainerItem = editItemCarouselEl.parentElement;

      const container = containerItem.parentElement.parentElement;
      if (!container) {
        console.error('container carousel tidak ditemukan');
        return false;
      }

      // hitung count baru & simpan
      const countNumber = (parseInt(containerItem.dataset.itemCount || '0', 10) || 0) + 1;

      // clone elemen (btn + modal body)
      const itemCarouselCopy = itemCarouselEl.cloneNode(true);
      const editItemCarouselCopy = editItemCarouselEl.cloneNode(true);

      // buat id baru dengan mengganti angka terakhir
      const oldItemCarId = itemCarouselEl.id;
      const newItemCarId = replaceTrailingNumber(oldItemCarId, countNumber);
      // console.log('test',countNumber, {oldBtnId, oldModalId, newBtnId,newModalId})

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
              webpageDb.push(cloned);
            }
          }
        });
      }
      
      const originalOrder = parseInt(itemCarouselCopy.dataset.itemOrder || '0', 10);
      const newOrderBase = originalOrder + 1;

      // update element order btnCopy: +1 dari original (jika ada)
      itemCarouselCopy.dataset.itemOrder = String(newOrderBase);
      editItemCarouselCopy.dataset.itemOrder = String(newOrderBase);
      containerItem.dataset.itemCount = String(countNumber);
      editContainerItem.dataset.itemCount = String(countNumber);

      // 1) Perbarui element_order pada sibling (hanya direct children container)
      Array.from(itemCarouselEl.parentElement.children).forEach(el => {
        const currentOrder = parseInt(el.dataset?.itemOrder || '0', 10);
        if (isNaN(currentOrder)) return;

        if (currentOrder >= newOrderBase) {
          const updated = currentOrder + 1;
          el.dataset.itemOrder = String(updated);
          document.getElementById(`edit-${el.id}`).dataset.itemOrder = String(updated)

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

      // tambahin indicator
      const slideIndicator = containerItem.querySelector(`[id^="slide-indicator"]`)
      const newIndicator = slideIndicator.querySelector('[type=button]').cloneNode(true)

      Array.from(slideIndicator.children).forEach(ind=>{
        const count = parseInt(ind.getAttribute('data-carousel-slide-to'));
        ind.setAttribute('data-carousel-slide-to', count+1)
      })

      // console.log('indicarto', newIndicator)
      slideIndicator.insertAdjacentElement('afterbegin', newIndicator)

      // ✅ Duplikasi semua elemen di webpageDb yang terkait dengan oldItemCarId
      const relatedObjects = webpageDb.filter(obj => arraySubsequenceMatch(obj.id.split('-'), oldItemCarId.split('-')));

      relatedObjects.forEach(originalObj => {
        const clonedObj = deepClone(originalObj);

        if (clonedObj.id.startsWith('item-carousel')) {
          clonedObj.element_order = String(newOrderBase);
        }

        clonedObj.id = clonedObj.id.replaceAll(oldItemCarId, newItemCarId);
        clonedObj.action = 'new-add';
        webpageDb.push(clonedObj);
      });   

      //update element count container
      // console.log('container: ',containerItem.id)
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
        let bodyDropdown = document.getElementById(btnDropdown.dataset.dropdownToggle)
        let copyBodyDropdown = bodyDropdown.cloneNode(true);
        copyBodyDropdown.id = copyBodyDropdown.id.replaceAll(oldItemCarId, newItemCarId);
        // if(copyBodyDropdown.id.includes('head')){
        //   console.log('id Dropdown:',copyBodyDropdown)
        // }
        
        copyBodyDropdown.querySelectorAll('[id]').forEach(el => {
          el.id = el.id.replaceAll(oldItemCarId,newItemCarId)
        });
        copyBodyDropdown.dataset.initialized = ''; 
        copyBodyDropdown.setAttribute('class', 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700');
        copyBodyDropdown.setAttribute('style', 'position: absolute; inset: auto auto 0px 0px; margin: 0px; transform: translate3d(216.8px, -229.6px, 0px);');

        console.log(copyBodyDropdown)
        bodyDropdown.insertAdjacentElement('afterend', copyBodyDropdown);
      }) 

      const dropdownBtn = editItemCarouselEl.querySelector('[data-dropdown-toggle]')
      console.log(dropdownBtn)
      const bodyEditItemDropdown = document.getElementById(dropdownBtn.dataset.dropdownToggle)

      const copyEditItemDropdwon = bodyEditItemDropdown.cloneNode(true)
      copyEditItemDropdwon.id = copyEditItemDropdwon.id.replaceAll(oldItemCarId, newItemCarId);

      copyEditItemDropdwon.querySelectorAll('[id]').forEach(el => {
        el.id = el.id.replaceAll(oldItemCarId,newItemCarId)
      });
      copyEditItemDropdwon.dataset.initialized = ''; 
      copyEditItemDropdwon.setAttribute('class', 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700');
      copyEditItemDropdwon.setAttribute('style', 'position: absolute; inset: auto auto 0px 0px; margin: 0px; transform: translate3d(216.8px, -229.6px, 0px);');

      bodyEditItemDropdown.insertAdjacentElement('afterend', copyEditItemDropdwon);

      const editBodyDropdown = editItemCarouselCopy.parentElement.querySelectorAll(`[data-dropdown-toggle]`);
      editBodyDropdown.forEach(btnDropdown=>{
        // console.log(btnDropdown)
        let bodyDropdown = document.getElementById(btnDropdown.dataset.dropdownToggle)
        // bodyDropdown.querySelectorAll('[id]').forEach(el => {
        //   el.id = el.id.replaceAll(oldItemCarId,newItemCarId)
        // });
        
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
      
      console.log('duplicated carousel success', {oldItemCarId, newItemCarId}, webpageDb);
      globals.webpageDb=webpageDb

      // init accordion
      setTimeout(() => {
        try {
          initFlowbite();
        } catch (error) {
          console.error('❌ Gagal inisialisasi carousel', error);
        }
      }, 100);

      return true;
  } catch (e) {
    console.error('duplicateCarousel error', e);
    return false;
  }
}

function setImageItem(idParts){
  editCarouselItem=globals.editCarouselItem
  editCarouselItem = document.getElementById(`edit-${idParts.slice(2).join('-')}`)

  // console.log('edit carousel:', editCarouselItem, idParts, `edit-${idParts.slice(2).join('-')}`)
  bodyItem = editCarouselItem.parentElement.parentElement
  globals.bodyItem = editCarouselItem.parentElement.parentElement
  globals.editCarouselItem=editCarouselItem

  // console.log('edit item carousel:',editCarouselItem)
}

function resetImage(idParts){
  let carouselItem = document.getElementById(`${idParts.slice(2).join('-')}`)
  editCarouselItem = document.getElementById(`edit-${idParts.slice(2).join('-')}`) 

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
  globals.editCarouselItem = editCarouselItem
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
  const newItemCount = Number(itemCarouselWrapper.dataset.itemCount) + 1;
  itemCarouselWrapper.dataset.itemCount = newItemCount;

  const itemCarousel = itemCarouselWrapper.querySelector(`[id^="item-${idSuffix}"]`)
  let rgba
  if(carouselSelect.dataset.textPosition === 'on-image'){
    rgba = itemCarousel.style.backgroundImage.split('rgba(')[1].split(')')[0]
  }else{
    rgba = 0,0,0,0.0
  }

  const newItemId = `item-${idSuffix}-${newItemCount}`;
  
  let itemContent =''
  let classList = itemCarousel.classList
  let styleItem
  let style
  if(carouselSelect.dataset.text === "true"){
    if(carouselSelect.dataset.textPosition === "on-image"){
      itemContent = `
      <div id="field-${newItemId}" class="border border-b-1 border-gray-500 p-1 max-w-[100%] scroll-hidden overflow-scroll" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" contenteditable="true"></div>
      `
      style = `padding:25px;background-image: linear-gradient(rgba(${rgba})), url(/assets/img/almond1DefaultImageCarousel.jpg); background-size: cover; background-position: center;`
      styleItem=style
      console.log('on-iamge')
    }else{
      let copyItem = itemCarousel.cloneNode(true)
      copyItem.querySelector('img').setAttribute('src', '/assets/img/almond1DefaultImageCarousel.jpg')

      copyItem.children[1].innerHTML = `
      <div id="field-${newItemId}" class="border border-b-1 border-gray-500 p-1 max-w-[100%] scroll-hidden overflow-scroll" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" contenteditable="true"></div>
      `
      itemContent= copyItem.innerHTML
      classList = copyItem.classList
      
      style=copyItem.children[1].getAttribute('style')
      styleItem='flex-direction:column;'

      // console.log(copyItem.children[1])
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
  console.log(style)
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
  console.log(styleItem)

  itemCarouselWrapper.children[0].insertAdjacentHTML('beforeend', newItem);

  globals.webpageDb=webpageDb
  console.log('add item carousel',globals.webpageDb)
  updateStylingControls(carouselSelect);

  setTimeout(() => {
    try {
      initFlowbite();
    } catch (error) {
      console.error('❌ Gagal menginisialisasi Carousel:', error);
    }
  }, 100);
}

function addTextCarousel(event){
  webpageDb=globals.webpageDb
  carouselSelect=globals.carouselSelect
  const btnAddText = event.target

    if(carouselSelect.dataset.text === 'false' ){
      carouselSelect.querySelectorAll('[id^="item-carousel-"]').forEach(item=>{
        if(carouselSelect.dataset.textPosition === 'on-image'){
          item.innerHTML=`
          <div id="field-${item.id}" class="border border-b-1 border-gray-500 p-1 max-w-[100%] scroll-hidden overflow-scroll" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" contenteditable="true">Text Field</div>
          `
        }else{
          let img = item.querySelector('img').getAttribute('src') 
          item.setAttribute('style', `background-image:linear-gradient(rgba(0,0,0,0.0)), url("${img}");background-size:cover;background-position:center;`)
          item.innerHTML =item.querySelector('[id^="field-"]').outerHTML
        }
        webpageDb.push({
          id:`field-${item.id}`,
          type:'field',
          action:'new-add',
          content:'Text Field',
          style: `ol{list-style-type:decimal;}ul{list-style-type:disc;}`
        })
      })

      carouselSelect.dataset.text = "true"
      
      // console.log(webpageDb)
      
    }else{
      carouselSelect.querySelectorAll('[id^="item-carousel-"]').forEach(item=>{
        let img
        if(carouselSelect.dataset.textPosition !== 'on-image'){
          img = item.querySelector('img').getAttribute('src') 
          item.setAttribute('style', `background-image:linear-gradient(rgba(0,0,0,0.0)), url("${img}");background-size:cover;background-position:center;`)
        }
        item.innerHTML =''
        if(carouselSelect.dataset.textPosition === 'below-image'){
          webpageDb.forEach(field =>{
            if(field.id === item.id){
              field.file = webpageDb.find(img => img.id === `img-text-on-image-${field.id}`).file,
              field.action = updateActionProperty(field.action, 'update')
              field.style= `background-image:linear-gradient(rgba(0,0,0,0.0)), url("${img}");background-size:cover;background-position:center;`
            }
          })
        }
        webpageDb.forEach((field,index) => {
         if(field.id !== `field-${item.id}` && field.id !== `img-text-on-image-${item.id}`){
          field.action='delete'
          let update = updateActionProperty(field.action, 'delete')
          
          if (update.includes('new')) {
            webpageDb.splice(index, 1); // field.remove() tidak berlaku di array biasa
          } else {
            field.action = update;
          }
         }
        })
      })
      
      carouselSelect.dataset.textPosition = 'on-image'
      document.getElementById('btn-text-position').textContent = 'On Image'
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

    // console.log(webpageDb)
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
  // console.log(webpageDb)
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
      // imgWrapper.setAttribute('style', 'height:30%;width:100%;')
      imgWrapper.style.height='30%'
      imgWrapper.style.width='100%'
      newImg.setAttribute('src', imgUrl)
      // newImg.setAttribute('style', 'width;100%;')
      newImg.style.width='100%'

      // console.log(item.classList)
      item.classList.remove('p-6')
      
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
      console.log('item: ', carouselItem)

    }else{
      let imgField = item.querySelector('img')
      img = imgField.getAttribute('src') 
      item.setAttribute('style', `background-image:linear-gradient(rgba(0,0,0,0.0)), url("${img}");background-size:cover;background-position:center;`)
      item.innerHTML =item.querySelector('[id^="field-"]').outerHTML

      item.classList.add('p-6')

      webpageDb.forEach(field =>{
        if(field.id === item.id){
          field.action=updateActionProperty(field.action, 'update')
        }
      })

      webpageDb.forEach((field,index)=>{
        if(field.id !== imgField.parentElement.id){
          let update = updateActionProperty(field.action, 'delete')
          
          if (update.includes('new')) {
            webpageDb.splice(index, 1); // item.remove() tidak berlaku di array biasa
          } else {
            field.action = update;
          }
        }
      })

      webpageDb.forEach(field => {
        if(field.id === item.id){
          field.style = `background-image:linear-gradient(rgba(0,0,0,0.0)), url("${img}");background-size:cover;background-position:center;`
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
  console.log(webpageDb)
  const btnPosition = event.target
  btnPosition.textContent = btnPosition.textContent == "On Image" ? "Below Image" : "On Image"
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