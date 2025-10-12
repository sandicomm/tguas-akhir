import { Dropdown, Carousel, Modal } from 'flowbite';
import { Accordion, initFlowbite } from 'flowbite';

let editorCount = 0;
let webpageDb, param
let webpageDbRaw
let webpageDbParentSection
let editorFieldSelect
let editCarouselItem
let carouselSelect
let accordionPartSelect
let accordionSelect
let savedSelection = null;

document.addEventListener('DOMContentLoaded', function(){
  webpageDbRaw = JSON.parse(JSON.stringify(webpageJs));
  param = JSON.parse(JSON.stringify(paramJs))

  webpageDb = webpageDbRaw.filter(page => page.type !== 'parent-section')
  webpageDbParentSection = webpageDbRaw.filter(page => page.type == 'parent-section')

  console.log(webpageDb)
  console.log(param, paramJs)
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
  loadWebpage()
})

function dropdownInitialized(element,id){
  if(element == 'multi'){
     document.querySelectorAll(`[data-dropdown-toggle*="${id}"]`).forEach(toggleEl=>{

       const targetId = toggleEl.getAttribute('data-dropdown-toggle');
       const targetEl = document.getElementById(targetId);
   
       if (targetEl && !targetEl.dataset.initialized) {
         // Inisialisasi ulang dropdown
         new Dropdown(targetEl, toggleEl, {
           placement: toggleEl.getAttribute('data-dropdown-placement') || 'bottom',
         });
   
         targetEl.dataset.initialized = 'true';
         console.log("dropdown initialized", targetEl, targetEl.dataset.initialized)
       }else{
         console.log("gagal inisialisasi dropdown", targetEl, targetEl.dataset.initialized)
       }
     })

  }else if(element == 'all'){
     document.querySelectorAll(`[data-dropdown-toggle]`).forEach(toggleEl=>{

       const targetId = toggleEl.getAttribute('data-dropdown-toggle');
       const targetEl = document.getElementById(targetId);
   
       if (targetEl && !targetEl.dataset.initialized) {
         // Inisialisasi ulang dropdown
         new Dropdown(targetEl, toggleEl, {
           placement: toggleEl.getAttribute('data-dropdown-placement') || 'bottom',
         });
   
         targetEl.dataset.initialized = 'true';
        //  console.log("dropdown initialized", targetEl, targetEl.dataset.initialized)
       }else{
         console.log("gagal inisialisasi dropdown", targetEl, targetEl.dataset.initialized)
       }
     })
  }else{
    const toggleEl = document.querySelector(`[data-dropdown-toggle="${id}"]`)
    const targetId = toggleEl.getAttribute('data-dropdown-toggle');
    const targetEl = document.getElementById(targetId);

    if (targetEl && !targetEl.dataset.initialized) {
      // Inisialisasi ulang dropdown
      new Dropdown(targetEl, toggleEl, {
        placement: toggleEl.getAttribute('data-dropdown-placement') || 'bottom',
      });

      targetEl.dataset.initialized = 'true';
      console.log("dropdown initialized", targetEl, targetEl.dataset.initialized)
    }else{
      console.log("gagal inisialisasi dropdown", targetEl, targetEl.dataset.initialized)
    }
  }
}

function setPaddingMarginBoxBorder(computedField){
    document.getElementById('padding-field').value = parseInt(computedField.padding);
    document.getElementById('padding-field-top').value = parseInt(computedField.paddingTop);
    document.getElementById('padding-field-bottom').value = parseInt(computedField.paddingBottom);
    document.getElementById('padding-field-left').value = parseInt(computedField.paddingLeft);
    document.getElementById('padding-field-right').value = parseInt(computedField.paddingRight);
    
    document.getElementById('margin-field').value = parseInt(computedField.margin);
    document.getElementById('margin-field-top').value = parseInt(computedField.marginTop);
    document.getElementById('margin-field-bottom').value = parseInt(computedField.marginBottom);
    document.getElementById('margin-field-left').value = parseInt(computedField.marginLeft);
    document.getElementById('margin-field-right').value = parseInt(computedField.marginRight);
    
    document.getElementById('width-field').value = parseInt(computedField.width);
    document.getElementById('height-field').value = parseInt(computedField.height);

    document.getElementById('border-field').value = parseInt(computedField.borderWidth);
    document.getElementById('border-field-bottom').value = parseInt(computedField.borderBottomWidth);
    document.getElementById('border-field-top').value = parseInt(computedField.borderTopWidth);
    document.getElementById('border-field-left').value = parseInt(computedField.borderLeftWidth);
    document.getElementById('border-field-right').value = parseInt(computedField.borderRightWidth);
    
    document.getElementById('border-field-rounded').value = parseInt(computedField.borderRadius);
    document.getElementById('border-field-rounded-top-left').value = parseInt(computedField.borderTopLeftRadius);
    document.getElementById('border-field-rounded-top-right').value = parseInt(computedField.borderTopRightRadius);
    document.getElementById('border-field-rounded-bottom-left').value = parseInt(computedField.borderBottomLeftRadius);
    document.getElementById('border-field-rounded-bottom-right').value = parseInt(computedField.borderBottomRightRadius);
}

function getRgbArray(str) {
  // cocokkan angka dalam rgba atau rgb
  const match = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  }
  return null;
}

function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Number(n).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

function updateStylingControls(data, field) {
    const computedField = window.getComputedStyle(data);
    setPaddingMarginBoxBorder(computedField)
    const idParts = data.id.split('-')
    
    if(idParts[0] == 'webpage'){
      document.getElementById('accordion-accordion-type').classList.add('hidden')
      document.getElementById('accordion-carousel-styling').classList.add('hidden')
      document.getElementById('accordion-font-styling').classList.add('hidden')
      document.getElementById('accordion-border-wave-section').classList.remove('hidden')
      document.getElementById('box-width-field').classList.add('hidden')
      document.getElementById('accordion-box-field').classList.remove('hidden')
      document.getElementById('accordion-head-indicator-wrapper').classList.add('hidden')
      document.getElementById('heading-text-wrapper').classList.add('hidden')
      document.getElementById('accordion-modal-type').classList.add('hidden')

      let fieldColor= data.style.backgroundImage || data.style.backgroundColor
      let borderColor= data.style.borderColor ?? ''

      fieldColor = getRgbArray(fieldColor)
      console.log(data,fieldColor, data.style.backgroundColor, data.style.backgroundImage)
      if(fieldColor){
        fieldColor = rgbToHex(fieldColor[0],fieldColor[1],fieldColor[2])
      }

      borderColor = getRgbArray(borderColor)

      if(borderColor){
        borderColor = rgbToHex(borderColor[0],borderColor[1],borderColor[2])
      }

      document.getElementById('color-field-input').value = fieldColor
      document.getElementById('border-color-field').value = borderColor;

      console.log('webpage', fieldColor)

    }else if(idParts[0] == 'field'){
      document.getElementById('accordion-accordion-type').classList.add('hidden')
      document.getElementById('accordion-carousel-styling').classList.add('hidden')
      document.getElementById('accordion-border-wave-section').classList.add('hidden')
      document.getElementById('accordion-modal-type').classList.add('hidden')
      document.getElementById('heading-text-wrapper').classList.add('hidden')
      document.getElementById('accordion-head-indicator-wrapper').classList.add('hidden')
      document.getElementById('accordion-font-styling').classList.remove('hidden')
      document.getElementById('font-order-list').classList.remove('hidden')
      document.getElementById('font-unorder-list').classList.remove('hidden')
      document.getElementById('accordion-border-field').classList.remove('hidden')
      document.getElementById('accordion-padding').classList.remove('hidden')
      document.getElementById('accordion-margin').classList.remove('hidden')
      document.getElementById('accordion-box-field').classList.remove('hidden')
      document.getElementById('box-height-field').classList.remove('hidden')
      document.getElementById('box-width-field').classList.remove('hidden')
      document.getElementById('accordion-box-field').classList.remove('hidden')
      
      let fontColor
      if (field) {
        fontColor = field.getAttribute('color') ?? field.closest('font')?.getAttribute('color') ?? '';
        console.log(fontColor);
      } else {
        console.error("Variabel 'field' bernilai null atau tidak ditemukan.");
      }

      let fieldColor= data.style.backgroundImage || data.style.backgroundColor
      let borderColor= data.style.borderColor

      fieldColor = getRgbArray(fieldColor)

      if(fieldColor){
        fieldColor = rgbToHex(fieldColor[0],fieldColor[1],fieldColor[2])
      }

      borderColor = getRgbArray(borderColor)

      if(borderColor){
        borderColor = rgbToHex(borderColor[0],borderColor[1],borderColor[2])
      }

      document.getElementById('font-color-input').value = fontColor
      document.getElementById('color-field-input').value = fieldColor
      document.getElementById('border-color-field').value = borderColor

      if(idParts[1] == 'head' && idParts[2] == 'modal'){
        document.getElementById('accordion-box-field').classList.add('hidden')
      }

      console.log('field')

    }else if(data.id == 'heading-text'){
      document.getElementById('accordion-carousel-styling').classList.add('hidden')
      document.getElementById('accordion-border-wave-section').classList.add('hidden')
      document.getElementById('accordion-modal-type').classList.add('hidden')
      document.getElementById('accordion-font-styling').classList.remove('hidden')
      document.getElementById('accordion-border-field').classList.remove('hidden')
      document.getElementById('accordion-padding').classList.remove('hidden')
      document.getElementById('accordion-margin').classList.remove('hidden')
      document.getElementById('accordion-box-field').classList.remove('hidden')
      document.getElementById('box-height-field').classList.remove('hidden')
      document.getElementById('box-width-field').classList.remove('hidden')
      document.getElementById('accordion-box-field').classList.remove('hidden')
      
      let fontColor
      if (field) {
        fontColor = field.getAttribute('color') ?? field.closest('font')?.getAttribute('color') ?? '';
        console.log(fontColor, field.closest('font'));
      } else {

        console.error("Variabel 'field' bernilai null atau tidak ditemukan.");
      }
      let fieldColor= data.style.backgroundImage || data.style.backgroundColor
      let borderColor= data.style.borderColor

      fieldColor = getRgbArray(fieldColor)

      if(fieldColor){
        fieldColor = rgbToHex(fieldColor[0],fieldColor[1],fieldColor[2])
      }

      borderColor = getRgbArray(borderColor)

      if(borderColor){
        borderColor = rgbToHex(borderColor[0],borderColor[1],borderColor[2])
      }

      document.getElementById('font-color-input').value = fontColor
      document.getElementById('color-field-input').value = fieldColor
      document.getElementById('border-color-field').value = borderColor

      if(idParts[1] == 'head' && idParts[2] == 'modal'){
        document.getElementById('accordion-box-field').classList.add('hidden')
      }

      console.log('field')

    }else if(data.id.startsWith('video')){
      document.getElementById('accordion-accordion-type').classList.add('hidden')
      document.getElementById('accordion-carousel-styling').classList.add('hidden')
      document.getElementById('accordion-border-wave-section').classList.add('hidden')
      document.getElementById('accordion-modal-type').classList.add('hidden')
      document.getElementById('accordion-font-styling').classList.add('hidden')
      document.getElementById('accordion-padding').classList.add('hidden')
      document.getElementById('accordion-border-field').classList.add('hidden')
      document.getElementById('accordion-background').classList.add('hidden')
      document.getElementById('heading-text-wrapper').classList.add('hidden')
      document.getElementById('accordion-box-field').classList.remove('hidden')
      document.getElementById('box-height-field').classList.add('hidden')
      document.getElementById('box-width-field').classList.remove('hidden')
      // document.getElementById('flex-position-accordion').classList.add('hidden')
      document.getElementById('accordion-head-indicator-wrapper').classList.add('hidden')
      console.log('video')

    }else if(data.id.startsWith('btn-modal') || data.id.startsWith('btn-heading-accordion')){
      document.getElementById('accordion-carousel-styling').classList.add('hidden')
      document.getElementById('heading-text-wrapper').classList.remove('hidden')
      document.getElementById("heading-text").innerHTML = ''
      document.getElementById("heading-text").innerHTML = data.querySelector('span').innerHTML
      document.getElementById('accordion-head-indicator-wrapper').classList.remove('hidden')
      document.getElementById('accordion-head-indicator-wrapper').classList.add('flex')
      document.getElementById('accordion-border-wave-section').classList.add('hidden')
      document.getElementById('accordion-modal-type').classList.add('hidden')
      document.getElementById('box-width-field').classList.remove('hidden')
      document.getElementById('box-height-field').classList.add('hidden')
      document.getElementById('accordion-font-styling').classList.remove('hidden')
      document.getElementById('accordion-accordion-type').classList.remove('hidden')
      document.getElementById('accordion-background').classList.remove('hidden')
      document.getElementById('accordion-box-field').classList.remove('hidden')
      document.getElementById('accordion-border-field').classList.remove('hidden')
      
      document.getElementById('font-order-list').classList.add('hidden')
      document.getElementById('font-unorder-list').classList.add('hidden')


      let fieldColor= data.style.backgroundImage || data.style.backgroundColor
      let borderColor= data.style.borderColor

      fieldColor = getRgbArray(fieldColor)
      if(fieldColor){
        fieldColor = rgbToHex(fieldColor[0],fieldColor[1],fieldColor[2])
      }

      borderColor = getRgbArray(borderColor)

      if(borderColor){
        borderColor = rgbToHex(borderColor[0],borderColor[1],borderColor[2])
      }

      document.getElementById('color-field-input').value = fieldColor
      document.getElementById('border-color-field').value = borderColor;

      console.log('btn modal')

    }else if(data.id.startsWith('parent-modal')){
      document.getElementById('accordion-accordion-type').classList.add('hidden')
      document.getElementById('accordion-carousel-styling').classList.add('hidden')
      document.getElementById('accordion-modal-type').classList.remove('hidden')
      document.getElementById('accordion-border-wave-section').classList.add('hidden')
      document.getElementById('accordion-font-styling').classList.add('hidden')
      document.getElementById('accordion-background').classList.remove('hidden')
      document.getElementById('accordion-padding').classList.add('hidden')
      document.getElementById('accordion-margin').classList.add('hidden')
      document.getElementById('accordion-border-field').classList.add('hidden')
      document.getElementById('heading-text-wrapper').classList.add('hidden')
      document.getElementById('accordion-box-field').classList.add('hidden')
      document.getElementById('accordion-head-indicator-wrapper').classList.add('hidden')
      document.getElementById('accordion-head-indicator-wrapper').classList.remove('flex')

      let fieldColor= data.style.backgroundImage || data.style.backgroundColor
      let borderColor= data.style.borderColor

      fieldColor = getRgbArray(fieldColor)

      if(fieldColor){
        fieldColor = rgbToHex(fieldColor[0],fieldColor[1],fieldColor[2])
      }

      borderColor = getRgbArray(borderColor)

      if(borderColor){
        borderColor = rgbToHex(borderColor[0],borderColor[1],borderColor[2])
      }

      document.getElementById('color-field-input').value = fieldColor
      document.getElementById('border-color-field').value = borderColor

    }else if(data.id.startsWith('section-accordion')){
      document.getElementById('accordion-carousel-styling').classList.add('hidden')
      document.getElementById('accordion-modal-type').classList.add('hidden')
      document.getElementById('heading-text-wrapper').classList.add('hidden')
      document.getElementById('accordion-head-indicator-wrapper').classList.add('hidden')
      document.getElementById('accordion-border-wave-section').classList.add('hidden')
      document.getElementById('accordion-font-styling').classList.add('hidden')
      document.getElementById('accordion-border-field').classList.remove('hidden')
      document.getElementById('accordion-accordion-type').classList.remove('hidden')

      document.getElementById('accordion-box-field').classList.remove('hidden')

      let fieldColor= data.style.backgroundImage || data.style.backgroundColor
      let borderColor= data.style.borderColor

      fieldColor = getRgbArray(fieldColor)

      if(fieldColor){
        fieldColor = rgbToHex(fieldColor[0],fieldColor[1],fieldColor[2])
      }

      borderColor = getRgbArray(borderColor)

      if(borderColor){
        borderColor = rgbToHex(borderColor[0],borderColor[1],borderColor[2])
      }

      document.getElementById('color-field-input').value = fieldColor
      document.getElementById('border-color-field').value = borderColor

      console.log('section accordion set styling contorls')
    }else if(data.id.startsWith('carousel')){
      document.getElementById('add-text-carousel').textContent = carouselSelect.dataset.text === "true" ? "Remove Text" : "Add Text"
      document.getElementById('btn-text-position').textContent = carouselSelect.dataset.textPosition === "on-image" ? "On Image" : "Below Image"
      document.getElementById('btn-hide-next').textContent = carouselSelect.dataset.nextBtnHide === "true" ? "Unhide" : "Hide"
      
      document.getElementById('accordion-accordion-type').classList.add('hidden')
      document.getElementById('accordion-head-indicator-wrapper').classList.add('hidden')
      document.getElementById('heading-text-wrapper').classList.add('hidden')
      document.getElementById('accordion-carousel-styling').classList.remove('hidden')
      document.getElementById('accordion-border-field').classList.add('hidden')
      document.getElementById('accordion-border-wave-section').classList.add('hidden')
      document.getElementById('bg-image-styling').classList.add('hidden')
      document.getElementById('accordion-font-styling').classList.remove('hidden')
      document.getElementById('accordion-box-field').classList.remove('hidden')
      document.getElementById('box-height-field').classList.remove('hidden')
      document.getElementById('box-width-field').classList.remove('hidden')
      document.getElementById('accordion-padding').classList.add('hidden')
      
      let accordionCarouselStyling = document.getElementById('accordion-carousel-styling')
      accordionCarouselStyling.querySelector('[id="edit-carousel-item-wrapping"]').innerHTML=''
      let i =0
      data.querySelectorAll('[id^="item-carousel"]').forEach(item =>{
        i++
        let style=''
        if(carouselSelect.dataset.textPosition === 'on-image'){
          style = item.getAttribute('style')
          
        }else{
          style = `background-image:url(${item.querySelector('img').getAttribute('src')});background-size:cover;background-position:center;`
          
        }
        let itemWrapped =`
            <div id="edit-${item.id}" data-item-order="${item.dataset.itemOrder}" class="mb-2 relative h-auto aspect-[4/3]">
              <div type="button" class="absolute right-0 top-0 cursor-pointer" data-dropdown-toggle="dropdown-${item.id}" data-dropdown-placement="right-end">
                <svg id="edit-accordion" class="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                  <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
                </svg>                  
              </div>

              <div id="dropdown-${item.id}" data-accordion="open" class="absolute mt-2 left-0 w-30 z-30 hidden bg-white rounded-lg shadow-sm">
                <ul class="py-2 text-sm text-gray-700">
                  <li><a id="down-${item.id}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100">Move Down</a></li>
                  <li><a id="up-${item.id}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 ">Move Up</a></li>
                  <li><label for="bg-image-carousel" id="set-image-${item.id}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100">Set Image</label></li>
                  <li><a id="reset-image-${item.id}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100">Reset Image</a></li>
                </ul>
                <ul class="py-2 text-sm text-gray-700 border-t border-gray-500">
                  <li><a id="delete-${item.id}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100">Delete</a></li>
                </ul>
              </div>
            </div>
            `

        accordionCarouselStyling.querySelector('[id="edit-carousel-item-wrapping"]').insertAdjacentHTML('beforeend', itemWrapped)
        accordionCarouselStyling.querySelector('[id="edit-carousel-item-wrapping"]').querySelector(`#edit-${item.id}`).setAttribute('style', style)
      })
      
      let addItemCarousel = document.querySelector('[id^="add-item"]')
      addItemCarousel.id = `add-item-${data.id}`

      accordionCarouselStyling.classList.remove('hidden')
      accordionCarouselStyling.querySelector('[id="edit-carousel-item-wrapping"]').dataset.itemCount = data.querySelector('[id^="element-carousel-"]').dataset.itemCount
      
      // ============= SET BG COLOR =================
      const element = data.querySelector('[id^="item-carousel-"]');
      const fieldColorStyle = element.getAttribute('style');

      // Definisikan nilai default
      let hexColor = '#000000'; // Default warna hitam jika tidak ditemukan
      let opacityValue = 1;

      // Gunakan regular expression untuk mencari nilai rgba()
      const rgbaMatch = fieldColorStyle.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);

      // Jika nilai rgba() ditemukan, ekstrak dan ubah ke heksadesimal
      if (rgbaMatch) {
        // Ambil nilai R, G, dan B dari hasil regex
        const r = parseInt(rgbaMatch[1], 10);
        const g = parseInt(rgbaMatch[2], 10);
        const b = parseInt(rgbaMatch[3], 10);
        const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;

        // Ubah nilai RGB ke heksadesimal
        hexColor = rgbToHex(r, g, b);
        opacityValue = a;

      }
      
      // Masukkan nilai heksadesimal ke input
      document.getElementById('color-field-input').value = hexColor;
      document.getElementById('bg-color-opacity').value = opacityValue;

      console.log('Nilai warna heksadesimal:', hexColor, opacityValue, document.getElementById('bg-color-opacity').value);

      console.log(data)
    }

    if(accordionSelect){
      document.getElementById('accordion-modal-type').classList.add('hidden')
       document.getElementById('accordion-box-field').classList.remove('hidden')
       document.getElementById('box-height-field').classList.add('hidden')
    }
    
    let rgba = null
    if(computedField.backgroundColor){
      rgba = computedField.backgroundColor
    }
    if(computedField.backgroundImage.includes('linear-gradient')){
      rgba = data.style.backgroundImage.split('linear-gradient(')[1].split(')')[0];
    }

    if(!data.id.startsWith('carousel')){
      let rgbArray;
  
      if (rgba.includes('rgba')) {
        rgbArray = rgba.split('rgba(')[1].split(')')[0].split(',');
      } else if (rgba.includes('rgb')) {
        rgbArray = rgba.split('rgb(')[1].split(')')[0].split(',');
      }
  
      const a = parseFloat(rgbArray[3] ? rgbArray[3].trim() : 1);
  
      document.getElementById('bg-color-opacity').value = a;
    }

    const preview = document.getElementById('preview-image');
    const nameFile = document.getElementById('file-name-display');
    
    if(data){
      const bgImg = getComputedStyle(data).backgroundImage;
  
      if (bgImg.includes('url(')) {
        const url = bgImg.split('url("')[1]?.split('")')[0] || bgImg.split("url('")[1]?.split("')")[0];
        preview.src = url;
        preview.classList.remove('hidden');
  
        nameFile.textContent = data.dataset.nameBg || url.split('/').pop();
  
      } else {
        nameFile.textContent = 'No image slected';
        preview.src = '';
        preview.classList.add('hidden');
      }
    }

    // ============= FIELD FONT SIZE =================
      const fontSizeField = document.getElementById('font-size');
      let fontSizeValue
      
      if(data){
        fontSizeValue = data.dataset.fieldFontSize

        if (!fontSizeValue) {
          // cari elemen <font> yang punya atribut size di dalam scope `data`
          const fontElement = data.querySelector("font[size]");

          // fallback: kalau ternyata `data` sendiri adalah <font>
          const selfFont = data.closest("font[size]");

          if (fontElement) {
            fontSizeValue = fontElement.getAttribute("size");
          } else if (selfFont) {
            fontSizeValue = selfFont.getAttribute("size");
          }else{
            fontSizeValue='3'
          }
        }
      }
      
      if (fontSizeValue) {
        // Cari option dengan value yang cocok, lalu tandai sebagai selected
        Array.from(fontSizeField.options).forEach(option => {
          option.selected = option.value === fontSizeValue;
        });
      }else {
        // Jika tidak ada value yang cocok, set ke default
        fontSizeField.value = 'default';
      }

    // ============= FIELD FONT FAMILY =================
      const fontFamilyField = document.getElementById('font-family');
      let fontFamilyValue
      
      if(data){
        fontFamilyValue = data.dataset.fieldFontFamily;

        if (!fontFamilyValue) {
          // cari elemen <font> yang punya atribut size di dalam scope `data`
          const fontElement = data.querySelector("font[face]");

          // fallback: kalau ternyata `data` sendiri adalah <font>
          const selfFont = data.closest("font[face]");

          if (fontElement) {
            fontFamilyValue = fontElement.getAttribute("face");
          } else if (selfFont) {
            fontFamilyValue = selfFont.getAttribute("face");
          }else{
            fontFamilyValue='sans-serif'
          }
        }
      }

      if (fontFamilyValue) {
        // Cari option dengan value yang cocok, lalu tandai sebagai selected
        Array.from(fontFamilyField.options).forEach(option => {
          option.selected = option.value === fontFamilyValue;
        });
      }else {
        // Jika tidak ada value yang cocok, set ke default
        fontFamilyField.value = 'default';
      }

      if(!document.getElementById('preview-image').classList.contains('hidden')){
        document.getElementById('wrapper-btn-reset-bg-image').classList.remove('hidden')
        console.log('atas',document.getElementById('wrapper-btn-reset-bg-image'))
      }else{
        document.getElementById('wrapper-btn-reset-bg-image').classList.add('hidden')
        console.log('bawah',document.getElementById('wrapper-btn-reset-bg-image'))
      }

}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function setListener(){
  document.querySelectorAll("[id^='webpage-section-']").forEach(section =>{
    section.addEventListener('click', function(event){
      if(event.target.id.startsWith('editor-container-section')){
        editorFieldSelect = section
        accordionSelect =null
        carouselSelect = null
        console.log('section select:',event.target.id, editorFieldSelect)
        updateStylingControls(editorFieldSelect)
      }
    })
  })

  document.querySelectorAll("[id^='field-']").forEach(field =>{
    field.addEventListener('click', function(event){
      event.stopPropagation()
      editorFieldSelect = field
      accordionSelect =null
      carouselSelect = null
      console.log('field change: ', editorFieldSelect, event.target.closest('font') ?? event.target.innerHTML)
      webpageDb.forEach(item=>{
        if(item.id === field.id){
          item.content = field.innerHTML
          console.log(item.content)
          return
        }
      })
      console.log('editorFieldSelect: ',event.target, editorFieldSelect)
      updateStylingControls(editorFieldSelect ,event.target);
    })
    field.addEventListener('keyup', function (){
      webpageDb.forEach(item=>{
        if(item.id === field.id){
          item.content = field.innerHTML
          console.log(item.content)
          return
        }
      })
    })
  })

  document.querySelectorAll("[id^='video-']").forEach(fieldVideo => {
    fieldVideo.addEventListener('click', function(e){
      editorFieldSelect = fieldVideo
      accordionSelect = null
      carouselSelect = null
      updateStylingControls(fieldVideo, "video")
    })
  })

  document.querySelectorAll('[id^="btn-modal-"]').forEach(btnModal =>{
    btnModal.addEventListener('click', function(){
      editorFieldSelect = btnModal
      accordionSelect =null
      carouselSelect = null
      updateStylingControls(editorFieldSelect)
      console.log('btn modal event listener', btnModal)
    })
  })

  document.querySelectorAll('[id^="parent-modal-"]').forEach(bodyModal =>{
    bodyModal.addEventListener('click', function(e){
      if(!e.target.id.startsWith('btn-footer')){
        editorFieldSelect = bodyModal
        carouselSelect = null
        updateStylingControls(editorFieldSelect)
        console.log('parent modal', editorFieldSelect, accordionSelect)
      }
    })
  })

  document.querySelectorAll('[id^="carousel-"]').forEach(carouselElement =>{
    carouselElement.addEventListener('click', function(e){
      carouselSelect = carouselElement
      editorFieldSelect=null
      accordionSelect =null
      updateStylingControls(carouselSelect)
      console.log('carousel:', carouselSelect)
    })
  })

  document.querySelectorAll('input[type="file"][accept^="video"]').forEach(input => {
    input.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file && file.type.startsWith('video/')) {
        const labelId = `label-${e.target.id}`; // contoh: input-video-1-2 → label-input-video-1-2
        const label = document.getElementById(labelId);
        
        console.log(`${e.target.id}: `, labelId, label)
        // Buat elemen video
        const video = document.createElement('video');
        video.controls = true;
        // video.className = 'object-contain'; // sesuaikan styling jika perlu
        video.src = URL.createObjectURL(file);

        // Hapus isi label lama (misal SVG)
        label.innerHTML = '';
        label.appendChild(video);
        webpageDb.map(page=>{
          if(page.id === e.target.id.split('-').slice(1).join('-')){
            page.content = file.name
            page.file = file
          }
        })
        console.log(webpageDb)
      }
    });
  });

  document.querySelectorAll("[id^='btn-heading-accordion']").forEach(headAccordion => {
    headAccordion.addEventListener('click', function(event) {
      // cari elemen terdekat yang punya id prefix "btn-heading-accordion"
      const btn = event.target.closest("[id^='btn-heading-accordion']");
      if (!btn) return; // kalau klik di luar area

      const idParts = btn.id.split('-');
      editorFieldSelect = btn;
      carouselSelect = null;
      accordionSelect = document.getElementById(idParts.slice(2, -1).join('-'));

      console.log('accordion heading clicked: ', editorFieldSelect, accordionSelect);
      updateStylingControls(editorFieldSelect);
    });
  });


  document.querySelectorAll("[id^='section-accordion-']").forEach(bodyAccordion => {
    bodyAccordion.addEventListener('click', function(event){
      event.stopPropagation()
      const idParts = bodyAccordion.id.split('-')
      // console.log('body click', bodyAccordion, event.target.id)
      if(event.target.id.startsWith('body-accordion-') || event.target.parentElement.id.startsWith('body-accordion-')){
        editorFieldSelect = bodyAccordion
        carouselSelect = null
        accordionSelect = document.getElementById(idParts.slice(1,-2).join('-'))
        console.log('accordion body clicked: ',editorFieldSelect, accordionSelect, event.target);
        updateStylingControls(editorFieldSelect)
      }
    })
  })

  document.querySelectorAll('[id^="editor-container-section-"]').forEach(section =>{
    section.addEventListener('mouseup', ()=>{
      const sel = window.getSelection();
      if (sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        savedSelection = range.cloneRange();
      }
    })
  })

  document.getElementById('heading-text').addEventListener('click', (event) => {
    updateStylingControls(document.getElementById('heading-text') ,event.target)
    console.log('headig')
  })

  document.getElementById('heading-text').addEventListener('mouseup', () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      savedSelection = range.cloneRange();
    }
  })

  // videoStyling()
}

function applyListStyle() {
  editorFieldSelect.querySelectorAll('ol').forEach(ol => {
    ol.style.listStyleType = 'decimal';
    ol.style.listStylePosition = 'inside';
    ol.style.paddingLeft = '1.25rem'
    ol.style.listStylePosition = 'outside'
    ol.style.marginBottom='0.5rem'
    ol.querySelectorAll('li').forEach(li=>{
      li.style.marginBottom='1rem'
    })
  });

  editorFieldSelect.querySelectorAll('ul').forEach(ol => {
    ol.style.listStyleType = 'disc';
    ol.style.listStylePosition = 'inside';
    ol.style.paddingLeft = '1.25rem'
    ol.style.listStylePosition = 'outside'
    ol.style.marginBottom='0.5rem'
    ol.querySelectorAll('li').forEach(li=>{
      li.style.marginBottom='1rem'
    })
  });
}

function parseStyleObj(styleStr) {
  try {
   let clean = styleStr
    return JSON.parse(clean);
  } catch (e) {
    console.log("❌ Gagal parse styleObj:", styleStr, e);
    return {};
  }
}

// ubah object balik jadi string
function stringifyStyleObj(styleObj) {
  return JSON.stringify(styleObj, null, 2); 
}

function updateStyle(editorFieldSelect, indicator, file, indicatorCarousel){
  webpageDb.forEach(item=>{
    let id
    if(editorFieldSelect.id.startsWith('btn-modal-')){
      id=editorFieldSelect.id.split('-').slice(1).join('-')
    }else if(editorFieldSelect.id.startsWith('parent-modal-')){
      id=`body-${editorFieldSelect.id.split('-').slice(1).join('-')}`
    }else if(editorFieldSelect.parentElement.id.startsWith('item-carousel')){
      id=editorFieldSelect.parentElement.id

    }else{
      id=editorFieldSelect.id
    }
    console.log(indicatorCarousel)
    if(item.id === id){
      if(indicator === 'bg-image'){
        if(indicatorCarousel === 'on-image'){
          item.file = file
          let style = editorFieldSelect.getAttribute('style')
          style = style.replace(/background-color:\s*[^;]+;/, '');
          style = style.replace(/url\(['"]?.*?['"]?\)/, `url('{{ asset(storage/media/${file.name} }}')`);
          
          item.style = style
          console.log

        }else if(indicatorCarousel === 'below-image'){
          let imgTextOnImage = webpageDb.find(field => field.id===`img-text-on-image-${item.id}`)
          imgTextOnImage.file = file

          console.log(editorFieldSelect)
          let style = editorFieldSelect.getAttribute('style')
          let match = style.match(/rgba\([^)]*\)/g);
          let rgba = 'rgba(128,128,128,1)'
          
          if (match && match.length > 0) {
            rgba = match[0];
          }
          item.style = `background-color: ${rgba};`;
          
          delete item.file

        }else{
          item.file=file
          item.style = editorFieldSelect.getAttribute('style')
        }

      }else{
        if(item.type === "carousel") {
          // khusus carousel
          let styleObj = parseStyleObj(item.style);
          styleObj.css = editorFieldSelect.getAttribute('style'); // update css
          item.style = stringifyStyleObj(styleObj);
          
        }else{
          console.log('style update: ',item.id, item.style,editorFieldSelect, editorFieldSelect.getAttribute('style'))
          item.style = editorFieldSelect.getAttribute('style')

        }
      }
        return
    }
  })
  console.log(webpageDb)
}

function updateContent(editorFieldSelect, value){
  let id
  if(editorFieldSelect.id.startsWith('btn-modal-')){
    id=editorFieldSelect.id.split('-').slice(1).join('-')
  }else if(editorFieldSelect.id.startsWith('parent-modal-')){
    id=`body-${editorFieldSelect.id.split('-').slice(1).join('-')}`
  }else if(accordionSelect && value){
    id=accordionSelect.id
  }else{
    id=editorFieldSelect.id
  }

  if(id.startsWith('btn-heading-accordion')){
    webpageDb.forEach(item=>{
      if(item.type === 'head-accordion' && item.id.includes(id.split('-').slice(0,-1).join('-'))){
        item.content = document.getElementById(item.id).querySelector('span').outerHTML
      }
    })
    
  }else if(id.startsWith('accordion-')){
    webpageDb.forEach(item=>{
      if(item.type === 'accordion' && item.id === id){
        let contentObj = parseStyleObj(item.content)
        contentObj.headType = value
        item.content = stringifyStyleObj(contentObj)
      }
    })
    console.log('accordion berubah tipe indicator')

  }else{
    webpageDb.forEach(item=>{
      if(item.id === id){
        item.content = editorFieldSelect.innerHTML
        return
      }
    })
  }
  console.log(webpageDb, id)
}

// ===================== FIELD =========================
// ------- Font Styling --------
function fontStylingField(){
  document.getElementById('heading-text').addEventListener('keyup', function () {
    console.log(this.textContent)
    console.log(editorFieldSelect)
    editorFieldSelect.querySelector('span').innerHTML = this.innerHTML;
    updateContent(editorFieldSelect)
  });

  document.getElementById('font-color-input').addEventListener('change', function () {
    const sel = window.getSelection();
    // console.log(document.getElementById('heading-text-wrapper').classList.)
    let fontField = null
    if(document.getElementById('heading-text-wrapper').classList.contains('hidden')){
      fontField = editorFieldSelect
    }else{
      fontField = document.getElementById('heading-text')
    }
    console.log(savedSelection)
  
    if (savedSelection) {
      sel.removeAllRanges();
      sel.addRange(savedSelection);
  
      let range = sel.getRangeAt(0);
  
      const startInside = fontField.contains(range.startContainer.nodeType === 3 ? range.startContainer.parentNode : range.startContainer);
      const endInside = fontField.contains(range.endContainer.nodeType === 3 ? range.endContainer.parentNode : range.endContainer);
  
      if (startInside && endInside && !range.collapsed) {
        fontField.dataset.fieldFontColor = this.value;

        if(!(document.getElementById('heading-text-wrapper').classList.contains('hidden'))){
          editorFieldSelect.dataset.fieldFontColor = this.value;
        }

        document.execCommand('foreColor', false, this.value);
      } else {
        const range = document.createRange();
        range.selectNodeContents(fontField);
        
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Terapkan warna ke seluruh teks dalam fontField
        fontField.dataset.fieldFontColor = this.value;

        if(!(document.getElementById('heading-text-wrapper').classList.contains('hidden'))){
          editorFieldSelect.dataset.fieldFontColor = this.value;
        }

        document.execCommand('foreColor', false, this.value);

        const listItems = editorFieldSelect.querySelectorAll('li');
        if(listItems && fontField.id.startsWith('field-')){
          listItems.forEach(li => {
            li.style.setProperty('--marker-color', this.value);
          });
        }
  
        // Optional: hapus seleksi biar gak kelihatan disorot
        selection.removeAllRanges();
      }

      if(!fontField.id.startsWith('field-')){
        editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
      }
      updateContent(editorFieldSelect)
    } else {
      console.log('Tidak ada seleksi tersimpan');
    }
  });

  document.getElementById('font-family').addEventListener('change', function () {
    const sel = window.getSelection();

    let fontField = null
    if(!(document.getElementById('heading-text-wrapper').classList.contains('hidden'))){
      fontField = document.getElementById('heading-text')
    }else{
      fontField = editorFieldSelect
    }
  
    if (savedSelection) {
      sel.removeAllRanges();
      sel.addRange(savedSelection);
  
      let range = sel.getRangeAt(0);
  
      const startInside = fontField.contains(range.startContainer.nodeType === 3 ? range.startContainer.parentNode : range.startContainer);
      const endInside = fontField.contains(range.endContainer.nodeType === 3 ? range.endContainer.parentNode : range.endContainer);
  
      if (startInside && endInside && !range.collapsed) {
        console.log('test')
        fontField.dataset.fieldFontFamily = this.value;

        if(!(document.getElementById('heading-text-wrapper').classList.contains('hidden'))){
          editorFieldSelect.dataset.fieldFontFamily = this.value;
        }

        document.execCommand('fontName', false, this.value);
      } else {
        const range = document.createRange();
        range.selectNodeContents(fontField);
        
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Terapkan warna ke seluruh teks dalam editorFieldSelect
        fontField.dataset.fieldFontFamily = this.value;

        if(!(document.getElementById('heading-text-wrapper').classList.contains('hidden'))){
          editorFieldSelect.dataset.fieldFontFamily = this.value;
        }

        document.execCommand('fontName', false, this.value);

        const listItems = editorFieldSelect.querySelectorAll('li');
        if(listItems && fontField.id.startsWith('field-')){
          listItems.forEach(li => {
            li.style.setProperty('--marker-family', this.value);
          });
        }

        // Optional: hapus seleksi biar gak kelihatan disorot
        selection.removeAllRanges();
      }

      if(!fontField.id.startsWith('field-')){
        editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
      }
      updateContent(editorFieldSelect)
    } else {
      console.log('Tidak ada seleksi tersimpan');
    }
  })

  document.getElementById('font-size').addEventListener('change', function () {
    const sel = window.getSelection();
  
    let fontField = null
    if(!(document.getElementById('heading-text-wrapper').classList.contains('hidden'))){
      fontField = document.getElementById('heading-text')
    }else{
      fontField = editorFieldSelect
    }

    if (savedSelection) {
      sel.removeAllRanges();
      sel.addRange(savedSelection);
  
      let range = sel.getRangeAt(0);
  
      const startInside = fontField.contains(range.startContainer.nodeType === 3 ? range.startContainer.parentNode : range.startContainer);
      const endInside = fontField.contains(range.endContainer.nodeType === 3 ? range.endContainer.parentNode : range.endContainer);
  
      if (startInside && endInside && !range.collapsed) {
        console.log('test')
        fontField.dataset.fieldFontSize = this.value;

        if(!(document.getElementById('heading-text-wrapper').classList.contains('hidden'))){
          editorFieldSelect.dataset.fieldFontSize = this.value;
        }

        document.execCommand('fontSize', false, this.value);
      } else {
        const range = document.createRange();
        range.selectNodeContents(fontField);
        
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Terapkan warna ke seluruh teks dalam fontField
        fontField.dataset.fieldFontSize = this.value;

        if(!(document.getElementById('heading-text-wrapper').classList.contains('hidden'))){
          editorFieldSelect.dataset.fieldFontSize = this.value;
        }

        document.execCommand('fontSize', false, this.value);

        const sizeMap = {
          1: '10px', 2: '13px', 3: '16px', 4: '18px', 5: '24px', 6: '32px', 7: '48px'
        };

        const sizePx = sizeMap[this.value];
        
        const listItems = editorFieldSelect.querySelectorAll('li');
        if(listItems && fontField.id.startsWith('field-')){
          listItems.forEach(li => {
            li.style.setProperty('--marker-size', sizePx);
          });
        }
        
        // Optional: hapus seleksi biar gak kelihatan disorot
        selection.removeAllRanges();
      }

      if(!fontField.id.startsWith('field-')){
        editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
      }
      updateContent(editorFieldSelect)
    } else {
      console.log('Tidak ada seleksi tersimpan');
    }
  })

  document.getElementById('font-bold').addEventListener('click', function () {
    const sel = window.getSelection();
  
    let fontField = null
    if(!(document.getElementById('heading-text-wrapper').classList.contains('hidden'))){
      fontField = document.getElementById('heading-text')
    }else{
      fontField = editorFieldSelect
    }
    console.log(savedSelection)

    if (savedSelection) {
      sel.removeAllRanges();
      sel.addRange(savedSelection);
  
      let range = sel.getRangeAt(0);
  
      const startInside = fontField.contains(range.startContainer.nodeType === 3 ? range.startContainer.parentNode : range.startContainer);
      const endInside = fontField.contains(range.endContainer.nodeType === 3 ? range.endContainer.parentNode : range.endContainer);
  
      if (startInside && endInside && !range.collapsed) {
        console.log('test')
        document.execCommand('bold');

      } else {
        const range = document.createRange();
        range.selectNodeContents(fontField);
  
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
  
        // Terapkan warna ke seluruh teks dalam fontField
        document.execCommand('bold');

        const listItems = editorFieldSelect.querySelectorAll('li');
        if(listItems && fontField.id.startsWith('field-')){
          listItems.forEach(li => {
            li.style.setProperty('--marker-weight', this.value);
          });
        }

        // Optional: hapus seleksi biar gak kelihatan disorot
        selection.removeAllRanges();
      }

      if(!fontField.id.startsWith('field-')){
        editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
      }
      updateContent(editorFieldSelect)
    } else {
      console.log('Tidak ada seleksi tersimpan');
    }
  })
  
  document.getElementById('font-italic').addEventListener('click', function () {
    const sel = window.getSelection();

    let fontField = null
    if(!(document.getElementById('heading-text-wrapper').classList.contains('hidden'))){
      fontField = document.getElementById('heading-text')
    }else{
      fontField = editorFieldSelect
    }
  
    if (savedSelection) {
      sel.removeAllRanges();
      sel.addRange(savedSelection);
  
      let range = sel.getRangeAt(0);
  
      const startInside = fontField.contains(range.startContainer.nodeType === 3 ? range.startContainer.parentNode : range.startContainer);
      const endInside = fontField.contains(range.endContainer.nodeType === 3 ? range.endContainer.parentNode : range.endContainer);
  
      if (startInside && endInside && !range.collapsed) {
        document.execCommand('italic');
      } else {
        const range = document.createRange();
        range.selectNodeContents(fontField);
  
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
  
        // Terapkan warna ke seluruh teks dalam editorFieldSelect
        document.execCommand('italic');
        
        const listItems = editorFieldSelect.querySelectorAll('li');
        if(listItems && fontField.id.startsWith('field-')){
          listItems.forEach(li => {
            li.style.setProperty('--marker-style', this.value);
          });
        }

        // Optional: hapus seleksi biar gak kelihatan disorot
        selection.removeAllRanges();
      }

      if(!fontField.id.startsWith('field-')){
        editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
      }
      updateContent(editorFieldSelect)
    } else {
      console.log('Tidak ada seleksi tersimpan');
    }
  })
  
  document.getElementById('font-underline').addEventListener('click', function () {
    const sel = window.getSelection();
  
    let fontField = null
    if(!(document.getElementById('heading-text-wrapper').classList.contains('hidden'))){
      fontField = document.getElementById('heading-text')
    }else{
      fontField = editorFieldSelect
    }

    if (savedSelection) {
      sel.removeAllRanges();
      sel.addRange(savedSelection);
  
      let range = sel.getRangeAt(0);
  
      const startInside = fontField.contains(range.startContainer.nodeType === 3 ? range.startContainer.parentNode : range.startContainer);
      const endInside = fontField.contains(range.endContainer.nodeType === 3 ? range.endContainer.parentNode : range.endContainer);
  
      if (startInside && endInside && !range.collapsed) {
        document.execCommand('underline');
      } else {
        const range = document.createRange();
        range.selectNodeContents(fontField);
  
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
  
        // Terapkan warna ke seluruh teks dalam fontField
        document.execCommand('underline');
  
        // Optional: hapus seleksi biar gak kelihatan disorot
        selection.removeAllRanges();
      }

      if(!fontField.id.startsWith('field-')){
        editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
      }

      updateContent(editorFieldSelect)

    } else {
      console.log('Tidak ada seleksi tersimpan');
    }
  })
  
  document.getElementById('font-left').addEventListener('click', function () {
    const sel = window.getSelection();

     let fontField = null
    if(!(document.getElementById('heading-text-wrapper').classList.contains('hidden'))){
      fontField = document.getElementById('heading-text')
    }else{
      fontField = editorFieldSelect
    }

    if (sel.rangeCount){
      const range = sel.getRangeAt(0);
      const startInside = fontField.contains(range.startContainer.nodeType === 3 ? range.startContainer.parentNode : range.startContainer);
      const endInside = fontField.contains(range.endContainer.nodeType === 3 ? range.endContainer.parentNode : range.endContainer);
  
      if (startInside && endInside && !range.collapsed) {
        document.execCommand('justifyLeft');
        console.log('✅ aligned selected content');
      } else {
        const range = document.createRange();
        range.selectNodeContents(fontField);
  
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
  
        // Terapkan warna ke seluruh teks dalam fontField
        document.execCommand('justifyLeft');
  
        // Optional: hapus seleksi biar gak kelihatan disorot
        console.log('select all')
      }

      if(!fontField.id.startsWith('field-')){
        editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
      }

      updateContent(editorFieldSelect)

    }else{
      console.log('not range')
    }

    

  })
  
  document.getElementById('font-right').addEventListener('click', function () {
    const sel = window.getSelection();

    let fontField = null
    if(!(document.getElementById('heading-text-wrapper').classList.contains('hidden'))){
      fontField = document.getElementById('heading-text')
    }else{
      fontField = editorFieldSelect
    }

    if (sel.rangeCount){
      const range = sel.getRangeAt(0);
      const startInside = fontField.contains(range.startContainer.nodeType === 3 ? range.startContainer.parentNode : range.startContainer);
      const endInside = fontField.contains(range.endContainer.nodeType === 3 ? range.endContainer.parentNode : range.endContainer);
  
      if (startInside && endInside && !range.collapsed) {
        document.execCommand('justifyRight');
        console.log('✅ aligned selected content');
      } else {
        const range = document.createRange();
        range.selectNodeContents(fontField);
  
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
  
        // Terapkan warna ke seluruh teks dalam editorFieldSelect
        document.execCommand('justifyRight');
  
        console.log('select all')
      }
      
      if(!fontField.id.startsWith('field-')){
        editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
      }

      updateContent(editorFieldSelect)

    }else{
       console.log('not range')
    }

  })
  
  document.getElementById('font-center').addEventListener('click', function () {
    const sel = window.getSelection();

    let fontField = null
    if(!(document.getElementById('heading-text-wrapper').classList.contains('hidden'))){
      fontField = document.getElementById('heading-text')
    }else{
      fontField = editorFieldSelect
    }

    if (sel.rangeCount){
      const range = sel.getRangeAt(0);
      const startInside = fontField.contains(range.startContainer.nodeType === 3 ? range.startContainer.parentNode : range.startContainer);
      const endInside = fontField.contains(range.endContainer.nodeType === 3 ? range.endContainer.parentNode : range.endContainer);
  
      if (startInside && endInside && !range.collapsed) {
        document.execCommand('justifyCenter');
        console.log('✅ aligned selected content');
      } else {
        const range = document.createRange();
        range.selectNodeContents(fontField);
  
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
  
        // Terapkan warna ke seluruh teks dalam editorFieldSelect
        document.execCommand('justifyCenter');
  
        // Optional: hapus seleksi biar gak kelihatan disorot
        selection.removeAllRanges();
        console.log('select all')
      }

      if(!fontField.id.startsWith('field-')){
        editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
      }
      
      updateContent(editorFieldSelect)

    }else{
       console.log('not range')
    }
  })
  
  document.getElementById('font-justify').addEventListener('click', function () {
    const sel = window.getSelection();

    if(!fontField.id.startsWith('field-')){
      if(editorFieldSelect.id.startsWith('btn-heading-accordion')){
        editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
      }else{
        editorFieldSelect.innerHTML = fontField.innerHTML;
      }
    }

    if (sel.rangeCount){
      const range = sel.getRangeAt(0);
      const startInside = fontField.contains(range.startContainer.nodeType === 3 ? range.startContainer.parentNode : range.startContainer);
      const endInside = fontField.contains(range.endContainer.nodeType === 3 ? range.endContainer.parentNode : range.endContainer);
  
      if (startInside && endInside && !range.collapsed) {
        document.execCommand('justifyFull');
        console.log('✅ aligned selected content');
      } else {
        const range = document.createRange();
        range.selectNodeContents(fontField);
  
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
  
        // Terapkan warna ke seluruh teks dalam editorFieldSelect
        document.execCommand('justifyFull');
  
        // Optional: hapus seleksi biar gak kelihatan disorot
        selection.removeAllRanges();
        console.log('select all')
      }
      
      if(!fontField.id.startsWith('field-')){
        editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
      }

      updateContent(editorFieldSelect)

    }else{
       console.log('not range')
    }

  })

  document.getElementById('font-order-list').addEventListener('click', function () {
    const ol = document.createElement('ol'); // or 'ul' for unordered list
    const li = document.createElement('li');

    ol.appendChild(li);
    editorFieldSelect.appendChild(ol);
    applyListStyle();

 
    const lis = editorFieldSelect.querySelectorAll('li');
    lis.forEach(li => {
      if (li.innerText.trim() === '') {
        li.remove();
      }
    });
    const ols = editorFieldSelect.querySelectorAll('ol');
    ols.forEach(ol => {
      if (ol.innerText.trim() === '') {
        ol.remove();
      }
    });
    updateContent(editorFieldSelect)
  });

  document.getElementById('font-unorder-list').addEventListener('click', function () {
    const ul = document.createElement('ul'); // or 'ul' for unordered list
    const li = document.createElement('li');

    ul.appendChild(li);
    editorFieldSelect.appendChild(ul);
    applyListStyle();

 
    const lis = editorFieldSelect.querySelectorAll('li');
    lis.forEach(li => {
      if (li.innerText.trim() === '') {
        li.remove();
      }
    });
    const uls = editorFieldSelect.querySelectorAll('ul');
    uls.forEach(ul => {
      if (ul.innerText.trim() === '') {
        ul.remove();
      }
    });
    updateContent(editorFieldSelect)
  });
}
// -------- Box Field Styling -----------
function widthHeightField(){
  document.getElementById('width-field').addEventListener('keyup', function(){
    if(editorFieldSelect){
      if(editorFieldSelect.id.split('-')[0] === "video"){
        editorFieldSelect.style.maxWidth=`${this.value}px`
        console.log('video')
      }else if(accordionSelect){
        accordionSelect.style.width=`${this.value}px`
        console.log('accordion', accordionSelect)
        updateStyle(accordionSelect)
      }else{
        console.log('another', editorFieldSelect.id)
        editorFieldSelect.style.width=`${this.value}px`
      }

      updateStyle(editorFieldSelect)
      
    }else if(carouselSelect){
      carouselSelect.style.width=`${this.value}px`
      updateStyle(carouselSelect)
    }
  })

  document.getElementById('height-field').addEventListener('keyup', function(){
    if(editorFieldSelect){
      editorFieldSelect.style.minHeight=`${this.value}px`
      updateStyle(editorFieldSelect)
    }else if(carouselSelect){
      carouselSelect.style.height=`${this.value}px`
      
      updateStyle(carouselSelect)
    }
    
  })

}
// -------- Border -----------
function borderField(){
  document.getElementById('border-field').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderWidth=`${this.value}px`
       updateStyle(accordionPartSelect)
    }else{
      editorFieldSelect.style.borderWidth=`${this.value}px`
      updateStyle(editorFieldSelect)
    }

    document.getElementById('border-field-left').value=this.value
    document.getElementById('border-field-right').value=this.value
    document.getElementById('border-field-top').value=this.value
    document.getElementById('border-field-bottom').value=this.value

  })

  document.getElementById('border-color-field').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.setAttribute('data-border-color', this.value)
      accordionPartSelect.style.borderColor=`${this.value}`
      updateStyle(accordionPartSelect)
    }else{
      editorFieldSelect.setAttribute('data-border-color', this.value)
      editorFieldSelect.style.borderColor=`${this.value}`
      updateStyle(editorFieldSelect)
    }
  })

  document.getElementById('border-field-top').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderTopWidth=`${this.value}px`
      updateStyle(accordionPartSelect)
    }else{
      editorFieldSelect.style.borderTopWidth=`${this.value}px`
      updateStyle(editorFieldSelect)
    }
  })

  document.getElementById('border-field-right').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderRightWidth=`${this.value}px`
      updateStyle(accordionPartSelect)
    }else{
      editorFieldSelect.style.borderRightWidth=`${this.value}px`
      updateStyle(editorFieldSelect)
    }
  })

  document.getElementById('border-field-left').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderLeftWidth=`${this.value}px`
    }else{
      editorFieldSelect.style.borderLeftWidth=`${this.value}px`
    }
  })

  document.getElementById('border-field-bottom').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderBottomWidth=`${this.value}px`
      updateStyle(accordionPartSelect)
    }else{
      editorFieldSelect.style.borderBottomWidth=`${this.value}px`
      updateStyle(editorFieldSelect)
    }
  })

  document.getElementById('border-field-rounded').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderRadius=`${this.value}px`
      updateStyle(accordionPartSelect)
    }else{
      editorFieldSelect.style.borderRadius=`${this.value}px`
      updateStyle(editorFieldSelect)
    }

    document.getElementById('border-field-rounded-top-left').value=this.value
    document.getElementById('border-field-rounded-bottom-right').value=this.value
    document.getElementById('border-field-rounded-top-right').value=this.value
    document.getElementById('border-field-rounded-bottom-left').value=this.value
  })

  document.getElementById('border-field-rounded-top-right').addEventListener('change', function(){
   if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderTopRightRadius=`${this.value}px`
      updateStyle(accordionPartSelect)
    }else{
      editorFieldSelect.style.borderTopRightRadius=`${this.value}px`
      updateStyle(editorFieldSelect)
    }
  })

  document.getElementById('border-field-rounded-top-left').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderTopLeftRadius=`${this.value}px`
      updateStyle(accordionPartSelect)
    }else{
      editorFieldSelect.style.borderTopLeftRadius=`${this.value}px`
      updateStyle(editorFieldSelect)
    }
  })

  document.getElementById('border-field-rounded-bottom-right').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderBottomRightRadius=`${this.value}px`
      updateStyle(accordionPartSelect)
    }else{
      editorFieldSelect.style.borderBottomRightRadius=`${this.value}px`
      updateStyle(editorFieldSelect)
    }
  })

  document.getElementById('border-field-rounded-bottom-left').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderBottomLeftRadius=`${this.value}px`
      updateStyle(accordionPartSelect)
    }else{
      editorFieldSelect.style.borderBottomLeftRadius=`${this.value}px`
      updateStyle(editorFieldSelect)
    }
  })
}
// ------- PaddingMargin --------
function paddingMarginField(){
  // ------ Padding --------
  document.querySelectorAll('[id^="padding-field-"]').forEach(element => {
    element.addEventListener('change', function(){
      const topVal = document.getElementById('padding-field-top').value;
      const bottomVal = document.getElementById('padding-field-bottom').value;
      const leftVal = document.getElementById('padding-field-left').value;
      const rightVal = document.getElementById('padding-field-right').value;

      if(topVal === bottomVal && bottomVal === leftVal && leftVal === rightVal){
        document.getElementById('padding-field').value = document.getElementById('padding-top').value
        console.log('test if')
      }else{
        document.getElementById('padding-field').value = ''
        console.log('test else')
      }
      console.log(document.getElementById('padding-field-top').value, document.getElementById('padding-field-bottom').value, document.getElementById('padding-field-left').value, document.getElementById('padding-field-right').value)
      console.log(topVal === bottomVal && bottomVal === leftVal && leftVal === rightVal)
    })
  })

  document.getElementById('padding-field').addEventListener('keyup', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.paddingLeft=`${this.value}px`
      accordionPartSelect.style.paddingRight=`${this.value}px`
      accordionPartSelect.style.paddingTop=`${this.value}px`
      accordionPartSelect.style.paddingBottom=`${this.value}px`
      updateStyle(accordionPartSelect)

    }else{
      editorFieldSelect.style.paddingLeft=`${this.value}px`
      editorFieldSelect.style.paddingRight=`${this.value}px`
      editorFieldSelect.style.paddingTop=`${this.value}px`
      editorFieldSelect.style.paddingBottom=`${this.value}px`
      updateStyle(editorFieldSelect)

    }

    document.getElementById('padding-field-left').value=this.value
    document.getElementById('padding-field-right').value=this.value
    document.getElementById('padding-field-top').value=this.value
    document.getElementById('padding-field-bottom').value=this.value
  })

  document.getElementById('padding-field-left').addEventListener('keyup', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.paddingLeft=`${this.value}px`
      updateStyle(accordionPartSelect)
    }else{
      editorFieldSelect.style.paddingLeft=`${this.value}px`
      updateStyle(editorFieldSelect)
    }
  })

  document.getElementById('padding-field-right').addEventListener('keyup', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.paddingRight=`${this.value}px`
      updateStyle(accordionPartSelect)
    }else{
      editorFieldSelect.style.paddingRight=`${this.value}px`
      updateStyle(editorFieldSelect)
    }
  })

  document.getElementById('padding-field-top').addEventListener('keyup', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.paddingTop=`${this.value}px`
      updateStyle(accordionPartSelect)
    }else{
      editorFieldSelect.style.paddingTop=`${this.value}px`
      updateStyle(editorFieldSelect)
    }
  })

  document.getElementById('padding-field-bottom').addEventListener('keyup', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.paddingBottom=`${this.value}px`
      updateStyle(accordionPartSelect)
    }else{
      editorFieldSelect.style.paddingBottom=`${this.value}px`
      updateStyle(editorFieldSelect)
    }
  })

// ------ Margin --------
  document.getElementById('margin-field').addEventListener('keyup', function(){
    if(editorFieldSelect){
      if(editorFieldSelect.id === 'heading-text'){
        accordionPartSelect.parentElement.style.marginLeft=`${this.value}px`
        accordionPartSelect.parentElement.style.marginRight=`${this.value}px`
        accordionPartSelect.parentElement.style.marginTop=`${this.value}px`
        accordionPartSelect.parentElement.style.marginBottom=`${this.value}px`
        updateStyle(accordionPartSelect)
      }else{
        editorFieldSelect.style.marginLeft=`${this.value}px`
        editorFieldSelect.style.marginRight=`${this.value}px`
        editorFieldSelect.style.marginTop=`${this.value}px`
        editorFieldSelect.style.marginBottom=`${this.value}px`
        updateStyle(editorFieldSelect)
      }
    }else if(carouselSelect){
      carouselSelect.style.marginLeft=`${this.value}px`
      carouselSelect.style.marginRight=`${this.value}px`
      carouselSelect.style.marginTop=`${this.value}px`
      carouselSelect.style.marginBottom=`${this.value}px`
      updateStyle(carouselSelect)
    }

    document.getElementById('margin-field-left').value=this.value
    document.getElementById('margin-field-right').value=this.value
    document.getElementById('margin-field-top').value=this.value
    document.getElementById('margin-field-bottom').value=this.value
  })

  document.getElementById('margin-field-left').addEventListener('keyup', function(){
    if(editorFieldSelect){
      if(editorFieldSelect.id === 'heading-text'){
        accordionPartSelect.style.marginLeft=`${this.value}px`
        updateStyle(accordionPartSelect)
      }else{
        editorFieldSelect.style.marginLeft=`${this.value}px`
        updateStyle(editorFieldSelect)
      }
    }else if(carouselSelect){
      carouselSelect.style.marginLeft=`${this.value}px`  
      updateStyle(carouselSelect)    
    }
  })

  document.getElementById('margin-field-right').addEventListener('keyup', function(){
    if(editorFieldSelect){
      if(editorFieldSelect.id === 'heading-text'){
        accordionPartSelect.style.marginRight=`${this.value}px`
        updateStyle(accordionPartSelect)
      }else{
        editorFieldSelect.style.marginRight=`${this.value}px`
        updateStyle(editorFieldSelect)
      }
    }else if(carouselSelect){
      carouselSelect.style.marginRight=`${this.value}px`
      updateStyle(carouselSelect)
    }
  })

  document.getElementById('margin-field-top').addEventListener('keyup', function(){
    if(editorFieldSelect){
      if(editorFieldSelect.id === 'heading-text'){
        accordionPartSelect.style.marginTop=`${this.value}px`
        updateStyle(accordionPartSelect)
      }else{
        editorFieldSelect.style.marginTop=`${this.value}px`
        updateStyle(editorFieldSelect)
      }
    }else if(carouselSelect){
      carouselSelect.style.marginTop=`${this.value}px`
      updateStyle(carouselSelect)
    }
  })

  document.getElementById('margin-field-bottom').addEventListener('keyup', function(){
    if(editorFieldSelect){
      if(editorFieldSelect.id === 'heading-text'){
        accordionPartSelect.style.marginBottom=`${this.value}px`
        updateStyle(accordionPartSelect)
      }else{
        editorFieldSelect.style.marginBottom=`${this.value}px`
        updateStyle(editorFieldSelect)
      }
    }else if(carouselSelect){
      carouselSelect.style.marginBottom=`${this.value}px`
      updateStyle(carouselSelect)
    }
  })
}
// --------------- Color ---------------
function colorBackgroundField(){
  document.getElementById('color-field-input').addEventListener('change', function(){
    const rgb = hexToRgb(this.value);
    const alpha = parseFloat(document.getElementById('bg-color-opacity').value);
    
    let fieldEditor

    if(editorFieldSelect){
      if(editorFieldSelect.id === 'heading-text'){
        fieldEditor = accordionPartSelect
      }else{
        fieldEditor = editorFieldSelect
      }
    }else if(carouselSelect){
      fieldEditor = carouselSelect
    }

    if(fieldEditor.id.startsWith('carousel')){
      fieldEditor.dataset.fieldBgColor = this.value;
      fieldEditor.querySelectorAll('[id^="item-carousel-"]').forEach(item =>{
        if(fieldEditor.dataset.textPosition === 'on-image'){
          if(item.style.backgroundImage){
            item.style.backgroundImage = `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})), url(${item.style.backgroundImage.split('url(')[1].split(')')[0]})`;
          }else{
            item.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
          }
          updateStyle(item)
        }else{
          item.children[1].style.backgroundColor=`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
          updateStyle(item.children[1])
        }
      })

      if(fieldEditor.dataset.textPosition === 'on-image'){
        document.querySelectorAll('[id^="edit-item-carousel-"]').forEach(item =>{
           if(item.style.backgroundImage){
            item.style.backgroundImage = `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})), url(${item.style.backgroundImage.split('url(')[1].split(')')[0]})`;
          }else{
            item.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
          }
        })
      }
      console.log('tipe 2')
    }else{
      if(fieldEditor.style.backgroundImage){
        fieldEditor.style.backgroundImage = `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})), url(${fieldEditor.style.backgroundImage.split('url(')[1].split(')')[0]})`;
      }else{
        fieldEditor.style.backgroundColor=`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      }
      updateStyle(fieldEditor)
    }
  })

  document.getElementById('bg-color-opacity').addEventListener('change', function(){
    const colorPicker = document.getElementById('color-field-input').value;
    const rgb = hexToRgb(colorPicker);

    let fieldEditor

    if(editorFieldSelect){
      if(editorFieldSelect.id === 'heading-text'){
        fieldEditor = accordionPartSelect
      }else{
        fieldEditor = editorFieldSelect
      }
    }else if(carouselSelect){
      fieldEditor = carouselSelect
    }
    
    if(fieldEditor.id.startsWith('carousel')){
      fieldEditor.querySelectorAll('[id^="item-carousel-"]').forEach(item =>{
        if(fieldEditor.dataset.textPosition ==="on-image"){
          if(item.style.backgroundImage){
            item.style.backgroundImage = `
                linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value}), 
                rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})), 
                url(${item.style.backgroundImage.split('url(')[1].split(')')[0]})`;
            
          }else{
            item.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})`;
              
          }
          updateStyle(item)
        }else{
          item.children[1].style.backgroundColor=`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})`;
          updateStyle(item.children[1])
        }
      })
      if(fieldEditor.dataset.textPosition === "on-image"){
        document.querySelectorAll('[id^="edit-item-carousel-"]').forEach(item =>{
          if(item.style.backgroundImage){
            item.style.backgroundImage = `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})), url(${item.style.backgroundImage.split('url(')[1].split(')')[0]})`;
          }else{
            item.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})`;
          }
        })
      }

    }else{
      if(fieldEditor.style.backgroundImage){
        let urlPart = fieldEditor.style.backgroundImage.split('url(')[1].split(')')[0].trim();

        // hilangkan ' atau " di awal/akhir
        urlPart = urlPart.replace(/^["]|["]$/g, "'");
        console.log(urlPart)
        fieldEditor.style.backgroundImage = `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})), url(${urlPart})`;
      }else{
        fieldEditor.style.backgroundColor=`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})`;
      }
      updateStyle(fieldEditor)
    }

  })

  document.getElementById('bg-image-input').addEventListener('change', function () {
    const file = this.files[0];
    const previewImageField = document.getElementById('preview-image');
    const nameFile = document.getElementById('file-name-display');

    let fieldEditor

    if(editorFieldSelect && editorFieldSelect.id === 'heading-text'){
      fieldEditor = accordionPartSelect
    }else{
      fieldEditor = editorFieldSelect
    }

    if (file && file.type.startsWith('image/')) {
      // Tampilkan nama file pendek
      let fileName = file.name;
      const maxLength = 20;
      if (fileName.length > maxLength) {
        const ext = fileName.split('.').pop();
        fileName = fileName.substring(0, maxLength - ext.length - 3) + '...' + ext;
      }
      nameFile.textContent = fileName;

      fieldEditor.dataset.nameBg = fileName

      const reader = new FileReader();
      reader.onload = function (e) {
        previewImageField.src = e.target.result;
        previewImageField.classList.remove('hidden');

        fieldEditor.style.backgroundSize = 'cover';
        fieldEditor.style.backgroundPosition = 'center';
        console.log(fieldEditor.style.backgroundPosition)

        if (fieldEditor.style.backgroundColor) {
          const rgb = fieldEditor.style.backgroundColor;
          fieldEditor.style.backgroundImage = `linear-gradient(${rgb}, ${rgb}), url(${e.target.result})`;
        } else if (fieldEditor.style.backgroundImage.includes('linear-gradient')) {
          const rgba = fieldEditor.style.backgroundImage.split('linear-gradient(')[1].split(')')[0];
          fieldEditor.style.backgroundImage = `linear-gradient(${rgba}), url(${e.target.result})`;

          let style = fieldEditor.getAttribute('style')
          style = style.replace(
            /background-image\s*:[^;]+;/,
            `background-image: linear-gradient(${rgba})), url(${e.target.result});`
          );

          fieldEditor.setAttribute('style', style);
          // console.log(fieldEditor.getAttribute('style'), 'bg-image')
        } else {
          fieldEditor.style.backgroundImage = `url('${e.target.result}')`;
        }

        document.getElementById('btn-reset-bg-image').parentElement.classList.remove('hidden')
        updateStyle(fieldEditor,'bg-image', file)
      };
      
      reader.readAsDataURL(file);
    } else {
      previewImageField.src = '';
      previewImageField.classList.add('hidden');
      alert('Please select a valid image file.');
    }
    this.value=''
  });

  document.getElementById('bg-image-carousel').addEventListener('change', function (e) {
    const file = this.files[0];
    const maxFileSize = 500 * 1024; // 500 KB
    let carousel=''

    if (file && file.type.startsWith('image/')) {
      // Tampilkan nama file pendek
      let fileName = file.name;
      const maxLength = 20;

      if (file.size > maxFileSize) {
        alert('Ukuran file terlalu besar. Maksimal 500KB.');
        return;
      }

      if (fileName.length > maxLength) {
        const ext = fileName.split('.').pop();
        fileName = fileName.substring(0, maxLength - ext.length - 3) + '...' + ext;
      }

      // Elemen yang di-edit
      const editId = editCarouselItem.id.split('-').slice(1).join('-');
      let carouselItem = document.getElementById(editId);

      // Update dataset
      editCarouselItem.dataset.nameBg = fileName;
      carouselItem.dataset.nameBg = fileName;

      const reader = new FileReader();
      reader.onload = function (e) {
        const imgUrl = `url("${e.target.result}")`;
        const currentStyle = editCarouselItem.getAttribute('style');

        // Default/fallback rgba
        let rgbaValue = 'rgba(0,0,0,0.0), rgba(0,0,0,0.0)';

        if (currentStyle.includes('linear-gradient(')) {
          try {
            const startIndex = currentStyle.indexOf('linear-gradient(') + 'linear-gradient('.length;
            const endIndex = currentStyle.indexOf(')', startIndex);
            
            rgbaValue = currentStyle.slice(startIndex, endIndex + 1); 
            
            const secondGradientIndex = currentStyle.indexOf(')', endIndex + 1);
            if (secondGradientIndex !== -1) {
              rgbaValue += currentStyle.slice(endIndex + 1, secondGradientIndex + 1);
            }
          } catch (err) {
            console.warn('Failed to parse gradient, using default.');
          }
        } 

        else if (currentStyle.includes('background-color:')) {
          try {
            const startIndex = currentStyle.indexOf('background-color:') + 'background-color:'.length;
       
            const endIndex = currentStyle.indexOf(';', startIndex);
            rgbaValue = currentStyle.slice(startIndex, endIndex).trim();
          } catch (err) {
            console.warn('Failed to parse background-color, using default.');
          }
        }

        const [firstColor, secondColor] = rgbaValue.split(/,\s*/).length === 2 ?
          rgbaValue.split(/,\s*/) :
          [rgbaValue, rgbaValue];

        const bgValue = `linear-gradient(${firstColor}, ${secondColor}), ${imgUrl}`;

        console.log('Final background value:', bgValue);

        // Terapkan ke keduanya
        // console.log('car', rgba)
        carousel = document.getElementById(carouselItem.id.split('-').slice(1,-1).join('-'))
        if(carousel.dataset.textPosition === 'on-image'){
          [editCarouselItem, carouselItem].forEach(el => {
            el.setAttribute('style', `background-image:${bgValue};background-size:cover;background-position:center;`)
          });

        }else{
          carouselItem.querySelector('img').src = e.target.result
          // document.getElementById(editCarouselItem.id).setAttribute('style', `background-image:${bgValue};background-size:cover;background-position:center;`)
          document.getElementById(editCarouselItem.id).setAttribute('style', `background-image:${bgValue};background-size:cover;background-position:center;`)
        }
        console.log(carousel)
        updateStyle(carouselItem,'bg-image', file, carousel.dataset.textPosition)
        carousel.click(); 
      };

      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file.');
    }
     this.value = "";
  });

  document.querySelectorAll('[name="bg-image-size"]').forEach(bgImageSize =>{
    bgImageSize.addEventListener('click', function(){
      console.log('image sizer')
      
      let fieldEditor

      if(editorFieldSelect.id === 'heading-text'){
        fieldEditor = accordionPartSelect
      }else{
        fieldEditor = editorFieldSelect
      }

      if(this.value === "contain"){
        fieldEditor.style.backgroundSize = 'contain'
        fieldEditor.style.backgroundRepeat = 'no-repeat'
      }else if(this.value === "cover"){
        fieldEditor.style.backgroundSize = 'cover'
        fieldEditor.style.backgroundRepeat = 'no-repeat'
      }
      updateStyle(fieldEditor)
    })
  })

  document.getElementById("btn-reset-bg-image").addEventListener('click', function(event){
    let styleField = editorFieldSelect.getAttribute("style"); // ambil sebagai string

    if (styleField && styleField.includes("background-image")) {
      // Ambil nilai rgba(...)
      let match = styleField.match(/rgba?\([^)]+\)/);
      let rgba = match ? match[0] : "transparent";

      // Replace background-image:... dengan background-color:rgba(...)
      styleField = styleField.replace(/background-image:[^;]+;/, `background-color:${rgba};`);

      // Set kembali ke elemen
      editorFieldSelect.setAttribute("style", styleField);

      // Update ke database
      webpageDb = webpageDb.map(field => {
        if (field.id === editorFieldSelect.id) {
          field.style = styleField;
          delete field.file;
        }
        return field;
      });
    } else {
      editorFieldSelect.style.backgroundColor = "";
    }

    // Reset preview image
    const previewImageField = document.getElementById('preview-image');
    if (previewImageField) {
      previewImageField.src = '';
      previewImageField.classList.add('hidden');
    }

    // Reset nama file
    const nameFile = document.getElementById('file-name-display');
    if (nameFile) {
      nameFile.textContent = '';
    }
    
    // Reset input file juga (opsional)
    document.getElementById('field-bg-image-input').value = '';
  })
}

function borderWave() {
  let idWave = null;
  let currentWaveColor = document.getElementById('border-wave-color').value; // Default warna awal

  const sanitizeSVG = (svgText) => {
    // Buang semua tag <script> dan atribut event (onload, onclick, dll.)
    return svgText
      .replace(/<script.*?>.*?<\/script>/gi, '')
      .replace(/\son\w+=".*?"/gi, '');
  }

  const applyColorToSVG = (svg, color) => {
    if (!svg) return;
    svg.querySelectorAll('path').forEach(path => {
      path.setAttribute('fill', color);
    });
  };

  const getClonedSVG = (waveId, position) => {
    let svg;

    if (waveId) {
      svg = document.getElementById(waveId);
    } else {
      const svgText = sanitizeSVG(document.getElementById('border-wave-svg').value);
      const wrapper = document.createElement('div');
      wrapper.innerHTML = svgText;
      svg = wrapper.querySelector('svg'); // fresh from textarea input
    }

    if (!svg) return null;

    const svgClone = svg.cloneNode(true);
    svgClone.setAttribute('style', `z-index: 9; ${position}: 0; position: absolute;`);
    svgClone.setAttribute('class', '');
///masalahnya disini
    if (position === 'top') {
      flipPathVertically(svgClone,position);
    }

    applyColorToSVG(svgClone, currentWaveColor);
    return svgClone;
  };

  function flipPathVertically(svgElement, position) {
    const viewBox = svgElement.getAttribute('viewBox'); // contoh: "0 0 1440 320"
    if (!viewBox) return;

    if(position){
      svgElement.setAttribute('style', `z-index: 9; ${position}: 0; position: absolute;`);
    }
    const height = parseFloat(viewBox.split(' ')[3]); // ambil tinggi viewBox
    const paths = svgElement.querySelectorAll('path');

    paths.forEach(path => {
      const originalD = path.getAttribute('d');

      // Transform angka Y (koordinat ganjil dalam d)
      const flippedD = originalD.replace(/(-?\d*\.?\d+)/g, (match, num, offset, string) => {
        // Cari indeks angka
        const prev = string.slice(0, offset);
        const commasBefore = (prev.match(/[\d.]+/g) || []).length;

        // Hanya ubah nilai Y (ganjil indeks)
        if (commasBefore % 2 === 1) {
          const y = parseFloat(num);
          return (height - y).toString();
        }
        return num;
      });

      path.setAttribute('d', flippedD);
    });
  }

  const updateSectionWithWave = (waveId, position) => {
    const svgClone = getClonedSVG(waveId, position);
    if (!svgClone){
      console.log('SVG tidak ditemukan untuk id:', waveId);
    }

    // Hapus SVG lama
    editorFieldSelect.querySelectorAll('svg').forEach(svg => {
      if(svg.id !== "btn-add-section-elemen"){
        svg.remove()
      }
    });
    svgClone.id = `border-wave-${position}-section-${editorFieldSelect.id.split('-')[2]}`;
    // Tambahkan SVG baru dengan warna yang sesuai
    editorFieldSelect.appendChild(svgClone);

    const existingIndex = webpageDb.findIndex(page => 
      page.id.startsWith('border-wave-') 
      && page.id.split('-').find(part => !isNaN(part)) 
      === svgClone.id.split('-').find(part => !isNaN(part))
    );

    if (existingIndex !== -1) {
      // kalau sudah ada → update style
      webpageDb[existingIndex].style = svgClone.outerHTML;
      webpageDb[existingIndex].id = svgClone.id;
    } else {
      // kalau belum ada → push baru
      webpageDb.push({
        id: svgClone.id,
        type: 'border-wave',
        style: svgClone.outerHTML,
      });
    }
    console.log(webpageDb)
  };

  // Event saat tipe wave diklik
  document.querySelectorAll("[id^='border-wave-type-']").forEach(tipe => {
    tipe.addEventListener('click', function () {
      idWave = tipe.querySelector('[id^="type-"]').id;

      const selectedWavePosition = document.querySelector('input[name="border-wave-position"]:checked');
      const position = selectedWavePosition ? selectedWavePosition.value : 'bottom';

      updateSectionWithWave(idWave, position);

    });
  });

  // Event saat posisi wave (radio) diganti
  document.querySelectorAll("[name='border-wave-position']").forEach(radio => {
    radio.addEventListener('change', function () {
        const borderWave = editorFieldSelect.querySelector('[id^="border-wave-"]')
        // console.log(borderWave.getAttribute('style').includes(this.value))
        if(!borderWave.getAttribute('style').includes(this.value)){
          flipPathVertically(borderWave, this.value);
        }
    });
  });

  // Event saat warna wave diubah
  document.getElementById('border-wave-color').addEventListener('change', function () {
    currentWaveColor = this.value;
    editorFieldSelect.querySelectorAll('svg').forEach(svg => {
      if(!svg.id.startsWith('btn')){
        console.log(svg)
        applyColorToSVG(svg, currentWaveColor);

        webpageDb.map(page=>{
          if(page.id === svg.id){
            page.style= svg.outerHTML
          }
        })
        console.log(webpageDb)
      }
    });
  });

  document.getElementById('apply-border-wave-svg').addEventListener('click', function () {
    const svgText = sanitizeSVG(document.getElementById('border-wave-svg').value);
    editorFieldSelect.querySelectorAll('svg').forEach(svg => svg.remove());

    const wrapper = document.createElement('div');
    wrapper.innerHTML = svgText;

    const svgElement = wrapper.querySelector('svg');
    svgElement.id = `border-wave-bottom-section-${editorFieldSelect.id.split('-')[2]}`

    const position = document.querySelector('input[name="border-wave-position"]:checked')?.value || 'bottom';

    if (svgElement) {
      svgElement.style.position = 'absolute';
      svgElement.style.zIndex = 9;
      svgElement.style[position] = '0';

      if (position === 'top') {
        svgElement.id = `border-wave-top-section-${editorFieldSelect.id.split('-')[2]}`
        flipPathVertically(svgElement)
      }

      applyColorToSVG(svgElement, currentWaveColor);
      editorFieldSelect.appendChild(svgElement);

      webpageDb.map(page=>{
        if(page.id == svgElement.id){
          page.style=svgElement.outerHTML
        }
      })
      console.log(webpageDb)

    } else {
      alert('SVG tidak valid!');
    }
  });
}

// ======================= ACCORDION ==========================
function accordionStyling(){
  document.getElementById('head-indicator-type').addEventListener('change', function(){
    let indicatorType='none'
    if(this.value !== ''){
      if(accordionSelect){
        accordionSelect.querySelectorAll('[id^="btn-heading-"]').forEach(head =>{
          let spanHead = head.querySelector('span')
          let indicator=''
          if(spanHead.nextElementSibling){
            spanHead.nextElementSibling.remove()
          }
          
          if(this.value === 'default'){
            indicator =`
              <svg data-accordion-icon class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
              </svg>
            `
            indicatorType = 'default'
  
          }else if(this.value === 'icon'){
            indicator =`<div data-accordion-icon >&#11163;</div>`
            indicatorType = 'icon'
  
          }else if(this.value === 'question'){
            indicator = `<div class="btn-cta">
                          <p>?</p>
                        </div>`
            indicatorType = 'question'
  
          }
    
          if(this.value !== 'none'){
            spanHead.insertAdjacentHTML('afterend', indicator)
          }
          accordionSelect.dataset.typeIndicator = indicatorType
    
          if(this.value !== 'question'){
            setTimeout(() => {
                try {
                    initFlowbite();
                } catch (error) {
                    console.error('❌ Gagal menginisialisasi Accordion:', error);
                }
            }, 50);  
          }
        })
      }else{
        let indicator=''
  
        if (editorFieldSelect.children.length > 1) {
          editorFieldSelect.children[1].remove()
        }
        
        
        if(this.value === 'default'){
          indicator =`
            <svg class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
            </svg>
          `
          indicatorType = 'default'
          
        }else if(this.value === 'icon'){
          indicator =`<div>&#11163;</div>`
          indicatorType = 'icon'
          
        }else if(this.value === 'question'){
          indicator = `<div class="btn-cta">
                        <p>?</p>
                      </div>`
          indicatorType = 'question'
  
        }
  
        if(this.value !== 'none'){
          console.log(editorFieldSelect)
          editorFieldSelect.insertAdjacentHTML('beforeend', indicator)
        }
        editorFieldSelect.dataset.typeIndicator=indicatorType
      }
      updateContent(editorFieldSelect, this.value)
    }
  })
}

// ======================== BODY MODAL ========================
function modalTypeStyling(){
  document.getElementById('modal-type').addEventListener('change', function(){
    let id = `body-${editorFieldSelect.parentElement.id.split('-').slice(1).join('-')}`
    if(this.value === 'default'){
      editorFieldSelect.parentElement.removeAttribute('data-modal-backdrop')
      webpageDb.map(page=>{
        if(page.id === id){
          page.content = 'modal-default'
        }
      })
    }else if(this.value === 'static'){
      editorFieldSelect.parentElement.setAttribute('data-modal-backdrop', 'static')
      webpageDb.map(page=>{
        if(page.id === id){
          page.content = 'modal-static'
        }
      })
    }
    setTimeout(() => {
      try {
          // Panggil initFlowbite setelah inisialisasi accordion spesifik ini
          // dan setelah ada sedikit penundaan
          initFlowbite();
      } catch (error) {
          console.error('❌ Gagal menginisialisasi Modal:', error);
      }
    }, 100);  
  })
}

// ======================== ACCORDION TYPE ====================
function accordionTypeStyling(){
  document.getElementById('accordion-type').addEventListener('change', function(){
    let id = accordionSelect.id
    if(this.value === 'collapse'){
      accordionSelect.querySelector('[id^="parent-"]').setAttribute('data-accordion', 'collapse')
      webpageDb.map(page=>{
        if(page.id === id){
          let contentObj = parseStyleObj(page.content);
          contentObj.accordionType="collapse"
          page.content = stringifyStyleObj(contentObj)
        }
      })
    }else if(this.value === 'open'){
      accordionSelect.querySelector('[id^="parent-"]').setAttribute('data-accordion', 'open')
      webpageDb.map(page=>{
        if(page.id === id){
          let contentObj = parseStyleObj(page.content);
          contentObj.accordionType="open"
          page.content = stringifyStyleObj(contentObj)
        }
      })
    }
    console.log(webpageDb)
    setTimeout(() => {
      try {
          // Panggil initFlowbite setelah inisialisasi accordion spesifik ini
          // dan setelah ada sedikit penundaan
          initFlowbite();
      } catch (error) {
          console.error('❌ Gagal menginisialisasi Modal:', error);
      }
    }, 100);  
  })
}

// ======================== INITIALIZED =======================

function loadWebpage(){
  console.log(webpageDb)

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

    section=`
      <div id="webpage-${idPrefix}" data-element-order="${order}" class="bg-gray-200 flex flex-col justify-center items-center border border-gray-700" style="${style}">
        <div class="absolute right-1 top-1 z-30 cursor-pointer" data-dropdown-toggle="dropdown-${idPrefix}" data-dropdown-placement="right-end">
          <svg id="btn-add-section-elemen" class="w-7 h-7 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
              <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
          </svg>                  
        </div>
  
        <div id="dropdown-${idPrefix}" data-accordion="open" class="z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          ${dropdownSection}
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              ${dropdownElement}
          </ul>
        </div>
    
        <div id="editor-container-${idPrefix}" data-element-count="${count}" class="p-8 w-full flex flex-col flex-1" style="justify-content:start;align-items:center;"></div>
        ${wave}
      </div>   
   `
   return section
  }
  const createSectionFooter = (idPrefix,order,count,style)=>{
    let section=`
      <div id="webpage-${idPrefix}" data-element-order="${order}" class="bg-gray-200 flex flex-col justify-center items-center border border-gray-700" style="${style}">
        <div class="absolute right-1 top-1 z-30 cursor-pointer" data-dropdown-toggle="dropdown-${idPrefix}" data-dropdown-placement="right-end">
          <svg id="btn-add-section-elemen" class="w-7 h-7 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
              <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
          </svg>                  
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
      <div type="button" class="absolute right-[-1.3rem] top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-body-${section.id.split('-').slice(1).join('-')}" data-dropdown-placement="right-end">
        <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
        </svg>    
      </div>

      <div id="wrapper-${section.id}" data-element-count="${section.element_count}" class="flex justify-start items-center flex-col">
        <!-- Body Accordion -->
        
      </div>
    </div>  
  `
  const createField = (page) =>{
    let field=''
    if(page){
      let dropdown=`<div type="button" class="absolute right-[-1.3rem] top-0 z-30 cursor-pointer" data-dropdown-toggle="dropdown-body-${page.id}" data-dropdown-placement="right-end">
            <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
            </svg>    
          </div>`
      if(page.id.includes('carousel')){
        dropdown=''
      }
      field = `
        <div data-element-order="${page.element_order}" style="z-index:10;position:relative;display:flex;justify-content:center;align-items:center;flex-direction:column;">
          ${dropdown}
          <div id="${page.id}" contenteditable="true" style="ol{list-style-type:decimal;}ul{list-style-type:disc;};${page.style}" class="border border-b-1 border-gray-500 p-1 max-w-[100%] break-all scroll-hidden overflow-scroll" >${page.content ?? ''}</div>
        </div>
      `
    }
    return field
  }
  const createDropdownField = (idPrefix)=>`
     <div id="dropdown-body-${idPrefix}" data-accordion="open" class="w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
          <li>
              <a id="up-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
          </li>
          <li>
              <a id="down-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
          </li>
          <li>
              <a id="delete-${idPrefix}" class="cursor-pointer text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a>
          </li>
          <li>
              <a id="copy-${idPrefix}" class="cursor-pointer text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Duplikat</a>
          </li>
        </ul>
      </div>
  `
  const createVideo = (page) => `
    <div id="${page.id}" data-element-order="${page.element_order}" style="${page.style}" class="border border-b-1 border-gray-500 max-w-[100%] cursor-pointer relative">
      <input type="file" id="input-${page.id}" accept="video/*" class="hidden">
      <div type="button" class="absolute right-[-1.3rem] top-0 z-30 cursor-pointer" data-dropdown-toggle="dropdown-${page.id}" data-dropdown-placement="right-end">
        <svg id="edit-video" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
          <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
        </svg>
      </div>

      <label id="label-input-${page.id}" for="input-${page.id}" class="w-full h-auto hover:bg-gray-300 flex justify-center items-center">
      ${
          page.content
            ? `<video src="${page.content}"></video>`
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
        <li><a id="copy-${idPrefix}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a></li>
      </ul>
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
        <li><a id="delete-${idPrefix}" class="block px-4 py-2 font-extrabold text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a></li>
      </ul>
    </div>
  `
  const createBtnModal = (page) =>`
    <div id="${page.id}" data-element-order="${page.element_order}" class="z-10 flex justify-center items-center flex-col">
      <div id="wrapper-${page.id}" class="relative flex justify-center items-center inline-flex gap-2">
        <div type="button" class="absolute right-[-1.7rem] top-[-0.3rem] z-10 cursor-pointer" data-dropdown-toggle="dropdown-btn-${page.id}" data-dropdown-placement="right-end">
          <svg id="edit-accordion" class="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
              <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
          </svg>                  
        </div>

        <button id="btn-${page.id}" style="${page.style}" data-modal-target="element-${page.id}" data-modal-toggle="element-${page.id}" class="flex justify-between items-center hover:bg-blue-700 break-all">
          ${page.content ?? `<span class="w-full">Button Modal</span>`}
        </button>
      </div>
    </div>
  `
  const createBodyModal=(page, fieldHead)=>`
    <div id="element-${page.id.split('-').slice(1).join('-')}" data-modal-backdrop="${page.content === 'modal-default' ? '' : 'static'}" tabindex="-1" aria-hidden="true" class="fixed z-[80] top-0 right-0 w-full sm:w-[calc(100%-18rem)] h-full hidden flex justify-center items-center">
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

          <div id="parent-${page.id.split('-').slice(1).join('-')}" style="${page.style}" class="relative bg-white rounded-md w-full max-w-2xl max-h-full">
            <!-- Modal content -->
            <div class="shadow-sm">
              <!-- Modal header -->
              <div class="flex items-center justify-between p-4 md:p-5 border-b-2 rounded-t border-gray-200">
                  <div id="${fieldHead.id}" style="${fieldHead.style}" class="border border-gray-400 break-all scroll-hidden overflow-scroll p-1" contenteditable="true">
                     ${fieldHead.content}
                  </div>
              </div>

              <!-- Modal body -->
              <div type="button" class="absolute right-[-1.7rem] top-[-0.3rem] z-10 cursor-pointer" data-dropdown-toggle="dropdown-body-${page.id.split('-').slice(1).join('-')}" data-dropdown-placement="right-end">
               <svg id="edit-accordion" class="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                   <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                   <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
               </svg>                  
              </div>

              <div id="body-${page.id.split('-').slice(1).join('-')}" class="flex flex-col justify-center items-center relative p-3" data-element-count="${page.element_count}">

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
            <li><a id="copy-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a></li>
          </ul>
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
            <li><a id="delete-btn-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
          </ul>
        </div>
  `
  //--- ACCORDION ---
  const createItemAccordion = (itemId, item, accordionEl)=>{
    let indicator=''
    if(parseStyleObj(accordionEl.content).headType === 'question'){
      indicator = `<div class="btn-cta">
                    <p>?</p>
                  </div>`
    }else if(parseStyleObj(accordionEl.content).headType === 'icon'){
      indicator = `<div data-accordion-icon>⮛</div>`
    }else if(parseStyleObj(accordionEl.content).headType === 'none'){
      indicator = ``
    }else{
      indicator = `<svg data-accordion-icon class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                  </svg>`
    }

    return`
        <div id="${itemId}" class="relative z-10" data-element-order="${item.element_order}">
          <div type="button" class="absolute right-0 top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-head-${itemId}" data-dropdown-placement="right-end">
            <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
            </svg>    
          </div>
    
          <h2 id="heading-${itemId}">
            <button type="button" id="btn-heading-${itemId}" style="${item.style}"
            class="flex items-center justify-between w-full p-5 break-all font-medium text-left text-gray-500 border border-gray-400"
            data-accordion-target="#body-${itemId}"
            aria-expanded="false"
            aria-controls="body-${itemId}">
            <span style="width:100%;">
            ${item.content}
            </span>
            ${indicator}
            </button>
          </h2>
    
          <div id="body-${itemId}" data-element-count="${item.element_count}" class="z-30 hidden relative flex flex-col justify-center items-center">
             
          </div>
        </div>
    `

  }
  const createAccordion = (accordion)=>`
    <div id="${accordion.id}" class="relative cursor-pointer" data-element-order="${accordion.element_order}" data-type-indicator="${parseStyleObj(accordion.content).headType}" style="${accordion.style}">
      <div type="button" class="absolute right-[-1.7rem] top-[-0.3rem] z-10 cursor-pointer" data-dropdown-toggle="dropdown-${accordion.id}" data-dropdown-placement="right-end">
        <svg id="edit-accordion" class="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
        </svg>                  
      </div>
      <div id="parent-${accordion.id}" data-item-accordion="${accordion.element_count}" data-accordion="${parseStyleObj(accordion.content).accordionType}">
    
      </div>
    </div>
  `

  const createDropdownHeadAccordion = (idPrefix)=>`
        <div id="dropdown-head-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-20 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li><a id="down-head-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
            <li><a id="up-head-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
          </ul>
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
            <li><a id="delete-head-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
          </ul>
        </div> 
  `
  const createDropdownSectionAccordion = (idPrefix,idParts)=>{
    let bodyDropdown =``
    if(idParts[2] === 'in' || idParts[4] === 'in'){
      bodyDropdown =`
      <div id="dropdown-body-${idPrefix.split('-').slice(1).join('-')}" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
          <li>
            <a id="add-section-${idPrefix.split('-').slice(1).join('-')}" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Add Section</a>
          </li>
          <li>
            <a id="up-section-${idPrefix.split('-').slice(1).join('-')}" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
          </li>
          <li>
            <a id="down-section-${idPrefix.split('-').slice(1).join('-')}" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
          </li>
          <li>
            <a id="delete-section-${idPrefix.split('-').slice(1).join('-')}" class="text-red-600 font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete Section</a>
          </li>
          <hr>
          <li>
            <a id="add-field-${idPrefix.split('-').slice(1).join('-')}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
          </li>
          <li>
            <a id="add-video-${idPrefix.split('-').slice(1).join('-')}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Video</a>
          </li>
          <li>
            <a id="add-carousel-${idPrefix.split('-').slice(1).join('-')}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
          </li>
        </ul>
      </div> 
        `
    }else{
      bodyDropdown =`
      <div id="dropdown-body-${idPrefix.split('-').slice(1).join('-')}" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
          <li>
              <a id="add-section-${idPrefix.split('-').slice(1).join('-')}" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Add Section</a>
          </li>
          <li>
              <a id="up-section-${idPrefix.split('-').slice(1).join('-')}" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
          </li>
          <li>
              <a id="down-section-${idPrefix.split('-').slice(1).join('-')}" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
          </li>
          <li>
              <a id="delete-section-${idPrefix.split('-').slice(1).join('-')}" class="text-red-600 font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete Section</a>
          </li>
          <hr>
          <li>
              <a id="add-field-${idPrefix.split('-').slice(1).join('-')}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
          </li>
          <li>
              <a id="add-video-${idPrefix.split('-').slice(1).join('-')}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Video</a>
          </li>
          <li>
              <a id="add-modal-${idPrefix.split('-').slice(1).join('-')}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modal</a>
          </li>
          <li>
              <a id="add-accordion-in-${idPrefix.split('-').slice(1).join('-')}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Accordion</a>
          </li>
          <li>
              <a id="add-carousel-${idPrefix.split('-').slice(1).join('-')}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
          </li>
        </ul>
      </div> 
      `
    }
    return bodyDropdown
  }
  const createBodyDropdownAccordion =(idPrefix, idParts)=>`
      <div id="dropdown-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-20 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            <li>
                <a id="down-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
            </li>
            <li>
                <a id="up-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
            </li>
            <li>
                <a id="add-accordion-head-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Add Item</a>
            </li>
        </ul>
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-0 border-t-1 border-gray-500 " aria-labelledby="dropdownDefaultButton">
          <li>
              <a id="delete-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">Delete</a>
          </li>
        </ul>
      </div>
  `
  //--- CAROUSEL ---
  const createCarousel = (carousel, childElements,editorContainer) => {
    let dataSet = parseStyleObj(carousel.content)
    return`
      <div id="${carousel.id}" data-element-order="${carousel.element_order}" data-text-position="${dataSet.dataTextPosition}" data-text="${dataSet.dataText}" data-next-btn-hide="${dataSet.dataNextBtnHide}" data-carousel="static" class="flex justify-center items-center flex-col" style="${parseStyleObj(carousel.style).css}">
        <div type="button" class="absolute right-[-1.7rem] top-[-0.3rem] z-0 cursor-pointer" data-dropdown-toggle="dropdown-${carousel.id}" data-dropdown-placement="right-end">
          <svg id="edit-accordion" class="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
          </svg>                  
        </div>

        <div id="element-${carousel.id}" data-item-count="${carousel.element_count}" class="relative w-full h-full" data-carousel="static">
          <!-- Carousel wrapper -->
          <div id="wrapper-item-${carousel.id}" class="relative w-full h-full overflow-hidden rounded-lg text-black">
              <!-- createCarouselItem --!>
              ${createCarouselItem(carousel, childElements, editorContainer, dataSet.dataTextPosition, dataSet.dataText)}
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
  const createCarouselItem = (carousel, childElements,editorContainer, textPosition, textStatus) => {
    let item=``

    childElements.forEach(el=>{
      if(el.id.startsWith('item') && el.id.includes(carousel.id)){
        let field= childElements.filter(field=>field.id === `field-${el.id}`)
        let textImage=''

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
              <div class="flex justify-center items-start h-full w-full px-9 py-5" style="${el.style}">
                ${createField(field[0])}
              </div>
              `
            console.log(imgTxt, `img-text-on-image-${el.id}`)
          }
        }
  
        if(el.id.includes(carousel.id) && el.id.startsWith('item-carousel')){
          let style=''
          if(textPosition === 'on-image'){
            style = el.style
          }else{
            style = 'flex-direction:column;'
          }
          item += `
            <div id="${el.id}" data-item-order="${el.element_order}" class="duration-700 ease-in-out flex justify-center items-center" style="${style}" data-carousel-item>
            ${textImage}
            </div>
          `
        }
      }
    })
    return item
  }
  const slideIndicator = (carousel, childElements)=>{
    let itemCarouselLength = childElements.filter(el => el.id.includes(carousel.id) && el.type === 'item-carousel').length
    console.log('length item carousel', itemCarouselLength)
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
  const  createDropdownCarousel = (idPrefix)=> `
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
  const  createBtnProlog = (element)=> {
    return `
    <a id="${element.id}" class="cursor-pointer" style="transition: opacity 0.1s, box-shadow 0.2s;${element.style}" 
      onmouseover="this.style.opacity='0.85'; this.style.boxShadow='0 0 0 4px rgba(255, 255, 255, 0.8)';" 
      onmouseout="this.style.opacity='1'; this.style.boxShadow='none';"
      contenteditable="true">
        ${element.content}
    </a>
  `
  }
  
  const webpageNotFooter = webpageDb.filter(file => !file.id.includes('footer'))
  if(webpageNotFooter.length == 0){
    let idPrefix = `section-1`
    if(param.includes('prolog-web')){
      idPrefix = `section-prolog-web-1`
    }else if(param.includes('prolog-emodul')){
      idPrefix = `section-prolog-emodul-1`
    }

    const webpage = document.getElementById('webpage')
    webpage.insertAdjacentHTML('beforeend', createSection(idPrefix, 1, 0, 'min-height:100dvh;position:relative;'))
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
    }else if(param.includes('prolog-emodul')){
      webpageDb.push({
          id: 'webpage-section-prolog-emodul-1',
          type: 'section',
          style: 'min-height:100dvh;position:relative;',
          element_order: '1',
          element_count: '0'
      })
    }else{
      webpageDb.push({
          id: 'webpage-section-1',
          type: 'section',
          style: 'min-height:100dvh;position:relative;',
          element_order: '1',
          element_count: '0'
      })
    }

  }else{
    const webpage = document.getElementById('webpage')

    function getSectionNumber(id) {
      return parseInt(id.split('-').find(part => !isNaN(part)), 10) || Infinity;
    }

    // 1. Ambil semua section dan sort berdasarkan element_order
    let sections = webpageDb
      .filter(page => page.type === "section" && !page.id.includes('footer'))
      .sort((a, b) => a.element_order - b.element_order);

    // 2. Loop per section
    sections.forEach(section => {
      let idPrefix = section.id.split('-').slice(1).join('-');
      const borderWave = webpageDb.filter(page => page.type === 'border-wave' && page.id.includes(idPrefix))

      // Cetak section
      webpage.insertAdjacentHTML(
        'beforeend',
        createSection(idPrefix, borderWave, section.element_order, section.element_count, section.style)
      );

      // Update element count
      webpage.dataset.elementCount = webpageDbParentSection
        .filter(p => p.type === 'parent-section')[0]?.element_count ?? 0;

      // 3. Cari elemen lain yang belong ke section ini
      let sectionNum = getSectionNumber(section.id);

      let childElements = webpageDb.filter(page => {
        return page.type !== "section" && getSectionNumber(page.id) === sectionNum;
      });

      function appendTo(selector, html, container=document) {
        const el = container.querySelector(selector);
        if(el) el.insertAdjacentHTML('beforeend', html);    
      }

      function renderAccordion(accordionEl, childElements, editorContainer) {
        const id = accordionEl.id;

        // buat accordion + dropdown body
        if(accordionEl.id.startsWith('accordion-in-accordion')){
          console.log(`in accordion #wrapper-section-${id.split('-').slice(2,-1).join('-')}`)
          editorContainer.querySelector(`#wrapper-section-${id.split('-').slice(2,-1).join('-')}`).insertAdjacentHTML('beforeend', createAccordion(accordionEl));
        }else{
          console.log(accordionEl.id)
          editorContainer.insertAdjacentHTML('beforeend', createAccordion(accordionEl));
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

        childElements.forEach(el => {
          if (!el.id.includes(id)) return;

          const isNested = id.startsWith("accordion-in-accordion");
          const isNestedEl = el.id.includes("accordion-in-accordion");

          if (el.id.startsWith("btn-heading")) {
            if (isNested === isNestedEl) grouped.head.push(el);
          } else if (el.id.startsWith("section-accordion")) {
            if (isNested === isNestedEl) grouped.section.push(el);
          } else if (!el.id.startsWith("btn-heading") && !el.id.startsWith("section-accordion") && (accordionEl.id !== el.id)) {
            grouped.field.push(el);
          } else {
            grouped.other.push(el);
          }
        });

        // render head
        // console.log(parseStyleObj(accordionEl.content))
        grouped.head.sort((a, b) => a.element_order - b.element_order)
          .forEach(head => {
            appendTo(`#parent-${id}`, createItemAccordion(head.id.split('-').slice(2).join('-'), head, accordionEl));
            editorContainer.insertAdjacentHTML('afterend', createDropdownHeadAccordion(head.id.split('-').slice(2).join('-')));
          });

        // render section
        grouped.section.sort((a, b) => a.element_order - b.element_order)
          .forEach(section => {
            appendTo(`#body-${section.id.split('-').slice(1,-1).join('-')}`, createSectionAccordion(section));
            editorContainer.insertAdjacentHTML('afterend', createDropdownSectionAccordion(section.id, section.id.split('-')));
          });

        // render field
        grouped.field.sort((a,b)=>a.element_order-b.element_order).forEach(field=>{
          let html, dropdown;
          switch (field.type) {
            case 'button-modal':
              html = createBtnModal(field);
              dropdown = createDropdownModal(field.id);
              appendTo(`#wrapper-section-${field.id.split('-').slice(1,-1).join('-')}`, html);
              break;
            case 'video':
              if(!field.id.includes('modal')){
                html = createVideo(field);
                dropdown = createDropdownVideo(field.id);
                appendTo(`#wrapper-section-${field.id.split('-').slice(1,-1).join('-')}`, html);
              }
              break;
            case 'field':
              if(!field.id.includes('modal')){
                html = createField(field);
                dropdown = createDropdownField(field.id);
                appendTo(`#wrapper-section-${field.id.split('-').slice(1,-1).join('-')}`, html);
              }
              break;
            case 'carousel':
              html = createCarousel(field, childElements, editorContainer)
              dropdown = createDropdownCarousel(field.id, field.id.split('-'))
              appendTo(`#wrapper-section-${field.id.split('-').slice(1,-1).join('-')}`, html)
              console.log(`#wrapper-section-${field.id.split('-').slice(1,-1).join('-')}`)
              break;
            case 'accordion':
              renderAccordion(field, childElements,editorContainer);
              break;
          }

          if (dropdown) editorContainer.insertAdjacentHTML('afterend', dropdown);
        });

        // init accordion
        setTimeout(() => {
          try {
            const accordionElement = document.getElementById(id);
            if (accordionElement) {
              new Accordion(accordionElement, {
                alwaysOpen: false,
                activeClasses: 'bg-gray-100 text-gray-900',
                inactiveClasses: 'text-gray-500'
              });
              console.log('✅ Accordion berhasil diinisialisasi:', id);
            }
            initFlowbite();
          } catch (error) {
            console.error('❌ Gagal inisialisasi accordion', error);
          }
        }, 100);
      }

      const renderers = {
        field(page, sectionAppend) {
          let element, dropdown;
          if (page.id.startsWith('field-modal-')) {
            element = createField(page);
            dropdown = createDropdownField(page.id);
            appendTo(`#body-${page.id.split('-').slice(1, -1).join('-')}`, element, sectionAppend);
            document.querySelector(`#${page.id}`).parentElement.insertAdjacentHTML('afterbegin', dropdown)
            return true; // stop, biar gak render ulang di bawah
            
          } else if (page.id.startsWith('field-element-')) {
            element = createField(page);
            dropdown = createDropdownField(page.id);

          }
          return { element, dropdown };
        },

        video(page, sectionAppend) {
          let element, dropdown;
          if (page.id.startsWith('video-modal')) {
            element = createVideo(page);
            dropdown = createDropdownVideo(page.id);
            appendTo(`#body-${page.id.split('-').slice(1, -1).join('-')}`, element);
            document.querySelector(`#${page.id}`).insertAdjacentHTML('afterbegin', dropdown);
            return true
          } else if(page.id.startsWith('video-element')) {
            element = createVideo(page);
            dropdown = createDropdownVideo(page.id);
          }
          return { element, dropdown };
        },

        'button-modal'(page) {
          if (!page.id.startsWith('modal-accordion') ) {
            return {
              element: createBtnModal(page),
              dropdown: createDropdownModal(page.id)
            }
          }
          return null; // kasus "modal-accordion" di-handle dalam renderAccordion
        },

        'btn-prolog'(page) {
          console.log('btn-prolog')
          if (!page.id.startsWith('modal-accordion') ) {
            return {
              element: createBtnProlog(page),
            }
          }
          return null; // kasus "modal-accordion" di-handle dalam renderAccordion
        },

        'body-modal'(page, sectionAppend) {
          const fieldHead = childElements.find(field => field.id === `field-head-${page.id.split('-').slice(1).join('-')}`)
          
          sectionAppend.insertAdjacentHTML('beforeend', createBodyModal(page, fieldHead))
          sectionAppend.insertAdjacentHTML('beforeend', createDropdownModal(page.id))
          
          return true;

        },

        accordion(page, sectionAppend, editorContainer, childElements) {
          // langsung delegasikan ke renderer accordion khusus (yang refactor panjang kemarin)
          if(!page.id.startsWith('accordion-in-accordion')){
            renderAccordion(page, childElements, editorContainer);
          }
          return true;
        },

        carousel(page, sectionAppend, editorContainer, childElements){
          const id = page.id;

          // buat accordion + dropdown body
          if(!id.startsWith('carousel-accordion')){
            editorContainer.insertAdjacentHTML('beforeend', createCarousel(page,childElements,editorContainer));
            editorContainer.insertAdjacentHTML('afterend', createDropdownCarousel(id, id.split('-')));

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
  
          const result = renderer(page, sectionAppend, editorContainer, childElements);
      
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

  }
  setListener()
  dropdownInitialized('all')
  setTimeout(() => {
      try {
        initFlowbite();
      } catch (error) {
          console.error('❌ Gagal menginisialisasi Modal:', error);
      }
    }, 100); 
}

document.getElementById('default-sidebar').addEventListener('click', function (event) {
  // console.log(event.target)
  const idParts = event.target.id.split('-')
  let actualBodyItem
  let actualField
  let bodyItem

  if(event.target.id.startsWith('set-image-item')){
    editCarouselItem = document.getElementById(`edit-${idParts.slice(2).join('-')}`)
    bodyItem = editCarouselItem.parentElement.parentElement
    console.log('edit item carousel:',editCarouselItem)
  }

  if(event.target.id.startsWith('reset-image-')){
    let carouselItem = document.getElementById(`${idParts.slice(2).join('-')}`)
    editCarouselItem = document.getElementById(`edit-${idParts.slice(2).join('-')}`) 

    bodyItem = editCarouselItem.parentElement.parentElement
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
      webpageDb = webpageDb.map(field => {
        if (field.id === carouselItem.id) {
          field.style = styleField;
          delete field.file;
        }
        return field;
      });
    } else {
      carouselItem.style.backgroundColor = "";
    }
  }

  if (event.target.id.startsWith('add-item-carousel-')) {
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
    if(carouselSelect.dataset.text === "true"){
      let style
      if(carouselSelect.dataset.textPosition === "on-image"){
        itemContent = `
        <div id="field-${newItemId}" class="border border-b-1 border-gray-500 p-1 max-w-[100%] break-all scroll-hidden overflow-scroll" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" contenteditable="true"></div>
        `
        style = `padding:25px;background-image: linear-gradient(rgba(${rgba})), url(/assets/img/almond1DefaultImageCarousel.jpg); background-size: cover; background-position: center;`
        styleItem=style
        webpageDb.push({
          id: newItemId,
          type:'item-carousel',
          element_order:newItemCount,
          style:style,
        })

        console.log('on image')

      }else{
        let copyItem = itemCarousel.cloneNode(true)
        copyItem.querySelector('img').setAttribute('src', '/assets/img/almond1DefaultImageCarousel.jpg')
        copyItem.children[1].innerHTML = `
        <div id="field-${newItemId}" class="border border-b-1 border-gray-500 p-1 max-w-[100%] break-all scroll-hidden overflow-scroll" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" contenteditable="true"></div>
        `
        itemContent= copyItem.innerHTML
        classList = copyItem.classList
        
        style=copyItem.children[1].getAttribute('style')
        styleItem=style

        console.log(copyItem.children[1])
        webpageDb.push({
          id: newItemId,
          type:'item-carousel',
          element_order:newItemCount,
          style:style,
        },
        {
          id: `img-text-on-image-${newItemId}`,
          type:'img-carousel',
          content:'/assets/img/almond1DefaultImageCarousel.jpg',
        })

      }
      webpageDb.push({
        id:`field-${newItemId}`,
        type:'field',
      })
      setListener()
    }else{
      styleItem = `padding:25px;background-image: linear-gradient(rgba(${rgba})), url(/assets/img/almond1DefaultImageCarousel.jpg); background-size: cover; background-position: center;`
    }

    webpageDb.map(field =>{
      if(field.id === idSuffix){
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

    console.log(webpageDb)
    updateStylingControls(carouselSelect);

    if(carouselSelect.dataset.text === "true"){
      setListener()
    }
    setTimeout(() => {
      try {
        initFlowbite();
      } catch (error) {
        console.error('❌ Gagal menginisialisasi Carousel:', error);
      }
    }, 100);
  }

  if (event.target.id.startsWith("add-text-carousel")) {
    const btnAddText = event.target
    console.log(webpageDb)

    if(carouselSelect.dataset.text === 'false' ){
      carouselSelect.querySelectorAll('[id^="item-carousel-"]').forEach(item=>{
        if(carouselSelect.dataset.textPosition === 'on-image'){
          item.innerHTML=`
          <div id="field-${item.id}" class="border border-b-1 border-gray-500 p-1 max-w-[100%] break-all scroll-hidden overflow-scroll" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" contenteditable="true"></div>
          `
        }else{
          let img = item.querySelector('img').getAttribute('src') 
          item.setAttribute('style', `background-image:linear-gradient(rgba(0,0,0,0.0)), url("${img}");background-size:cover;background-position:center;`)
          console.log('resset caraousel')
          item.innerHTML =item.querySelector('[id^="field-"]').outerHTML
        }
        webpageDb.push({
          id:`field-${item.id}`,
          type:'field',
          style: `ol{list-style-type:decimal;}ul{list-style-type:disc;}`
        })
      })

      carouselSelect.dataset.text = "true"
      console.log(webpageDb)
      setListener()

    }else{
      carouselSelect.querySelectorAll('[id^="item-carousel-"]').forEach(item=>{
        let img
        if(carouselSelect.dataset.textPosition !== 'on-image'){
          img = item.querySelector('img').getAttribute('src') 
          item.setAttribute('style', `background-image:linear-gradient(rgba(0,0,0,0.0)), url("${img}");background-size:cover;background-position:center;`)
        }
        item.innerHTML =''
        if(carouselSelect.dataset.textPosition === 'below-image'){
          webpageDb.map(field =>{
            if(field.id === item.id){
              field.file = webpageDb.find(img => img.id === `img-text-on-image-${field.id}`).file
              field.style= `background-image:linear-gradient(rgba(0,0,0,0.0)), url("${img}");background-size:cover;background-position:center;`
            }
          })
        }
        webpageDb=webpageDb.filter(field => field.id !== `field-${item.id}` && field.id !== `img-text-on-image-${item.id}`)
      })
      
      carouselSelect.dataset.textPosition = 'on-image'
      document.getElementById('btn-text-position').textContent = 'On Image'
      carouselSelect.dataset.text = "false"
    }

    btnAddText.dataset.text = btnAddText.dataset.text == "add" ? "remove" : "add"
    webpageDb.map(field=>{
      if(field.id === carouselSelect.id){
        let content=parseStyleObj(field.content)
        content.dataTextPosition = carouselSelect.dataset.textPosition
        content.dataText=carouselSelect.dataset.text
        field.content = stringifyStyleObj(content)
      }
    })
    console.log(webpageDb)
    btnAddText.textContent = btnAddText.textContent == "Add Text" ? "Remove Text" : "Add Text"
    setListener()
  }

  if(event.target.id.startsWith("btn-hide-next")){
    carouselSelect.querySelectorAll('[id^="slider-"]').forEach(btn=>{
      if(btn.children[0].classList.contains('hidden')){
        btn.children[0].classList.remove('hidden')
      }else{
        btn.children[0].classList.add('hidden')
      }
    })
    const btnHide = event.target
    carouselSelect.dataset.nextBtnHide = carouselSelect.dataset.nextBtnHide == "true" ? "false" : "true"
    webpageDb.map(field=>{
      if(field.id === carouselSelect.id){
        let content=parseStyleObj(field.content)
        content.dataNextBtnHide = carouselSelect.dataset.nextBtnHide
        field.content = stringifyStyleObj(content)
      }
    })
    console.log(webpageDb)
    btnHide.textContent = carouselSelect.dataset.nextBtnHide == "true" ? "Unhide" : "Hide"
  }

  if(event.target.id.startsWith("btn-text-position") && carouselSelect.dataset.text === 'true'){
    let carouselId
    carouselSelect.querySelectorAll('[id^="item-carousel-"]').forEach(item=>{
      carouselId = item.id.split('-').slice(1,-1).join('-')
      let img
      const imgWrapper = document.createElement('div')
      const newImg = document.createElement('img')

      if(carouselSelect.dataset.textPosition === "on-image"){
        img = item.getAttribute('style')  
        
        let style = item.getAttribute('style')
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
        imgWrapper.setAttribute('style', 'height:30%;width:100%;')
        newImg.setAttribute('src', imgUrl)
        newImg.setAttribute('style', 'width;100%;')
        
        imgWrapper.appendChild(newImg)
        let newText = `
          ${imgWrapper.outerHTML}
          <div class="flex justify-center items-start h-full w-full px-9 py-5" style="background-color: ${rgba};">
            ${item.querySelector('[id^="field-"]').outerHTML}
          </div>
        `
        item.innerHTML =''
        item.insertAdjacentHTML('beforeend', newText)
        item.classList.add('flex-col')
        let carouselItem = webpageDb.find(field => field.id === item.id)

        webpageDb.map(field=>{
          if(field.id === item.id){
            field.style = `background-color: ${rgba};`
          }
        })

        if(carouselItem.file){
          webpageDb.push({
            id:`img-text-on-image-${item.id}`,
            type:'img-carousel',
            file: carouselItem.file
          })
          console.log('item: ', carouselItem)
          delete carouselItem.file
        }else{
          webpageDb.push({
            id:`img-text-on-image-${item.id}`,
            type:'img-carousel',
            content: imgUrl
          })
          console.log('item: ', carouselItem)
        }

      }else{
        let imgField = item.querySelector('img')
        img = imgField.getAttribute('src') 
        item.setAttribute('style', `background-image:linear-gradient(rgba(0,0,0,0.0)), url("${img}");background-size:cover;background-position:center;`)
        item.innerHTML =item.querySelector('[id^="field-"]').outerHTML

        webpageDb.map(field =>{
          if(field.id === item.id){
            field.file = webpageDb.find(img => img.id === `img-text-on-image-${field.id}`).file
          }
        })

        webpageDb = webpageDb.filter(field=>field.id !== imgField.parentElement.id)
        webpageDb.map(field => {
          if(field.id === item.id){
            field.style = `background-image:linear-gradient(rgba(0,0,0,0.0)), url("...");background-size:cover;background-position:center;`
          }
        })

      }

      setListener()
    })

    carouselSelect.dataset.textPosition = carouselSelect.dataset.textPosition == 'on-image' ? 'below-image' : 'on-image' 
    webpageDb.map(field=>{
      if(field.id === carouselSelect.id){
        let content=parseStyleObj(field.content)
        content.dataTextPosition = carouselSelect.dataset.textPosition
        field.content = stringifyStyleObj(content)
      }
    })
    console.log(webpageDb)
    const btnPosition = event.target
    btnPosition.textContent = btnPosition.textContent == "On Image" ? "Below Image" : "On Image"
  }

  if(idParts[1] === 'item' && idParts[0] != 'add'){
    editCarouselItem = document.getElementById(`edit-${idParts.slice(1, idParts.length).join('-')}`);
    bodyItem = editCarouselItem.parentElement.parentElement

    actualField = document.getElementById(`${idParts.slice(1, idParts.length).join('-')}`)
    actualBodyItem = actualField.parentElement.parentElement
    console.log("actual carousel", actualField)
  }

  if (idParts[0] === 'down') {
    const nextField = actualField?.nextElementSibling;

    if (nextField) {
      // Tukar dataset
      [actualField.dataset.itemOrder, nextField.dataset.itemOrder] = 
      [nextField.dataset.itemOrder, actualField.dataset.itemOrder];

      // Pindahkan elemen
      nextField.insertAdjacentElement('afterend', actualField);

      // Hapus semua class yang diawali 'z-' dari anak-anak carousel
      const oldCarousel = actualField.parentElement;
      const cleanClone = oldCarousel.cloneNode(true);

      [...cleanClone.children].forEach(child =>
        child.className = [...child.classList].filter(cls => !cls.startsWith('z-')).join(' ')
      );

      oldCarousel.innerHTML = cleanClone.innerHTML;
      
      webpageDb.map(item=>{
        if(item.id == actualField.id){
          item.element_order = actualField.dataset.itemOrder
          console.log(item)
        }else if(item.id == nextField.id){
          item.element_order = nextField.dataset.itemOrder
          console.log(item)
        }
      })
      console.log(webpageDb)
      // Update style
      updateStylingControls(carouselSelect);
    }

    // Inisialisasi ulang komponen Flowbite
    setTimeout(() => {
      try {
        initFlowbite();
      } catch (e) {
        console.error('❌ Gagal menginisialisasi Carousel:', e);
      }
    }, 100);

  }else if(idParts[0] === 'up') {
    const prevField = actualField?.previousElementSibling;
    console.log(prevField)

    if (prevField) {
      [actualField.dataset.itemOrder, prevField.dataset.itemOrder] =
      [prevField.dataset.itemOrder, actualField.dataset.itemOrder]

      prevField.insertAdjacentElement('beforebegin', actualField);

      let oldCarousel = actualField.parentElement
      let cleanCarousel = actualField.parentElement.cloneNode(true);

      [...cleanCarousel.children].forEach(child=>
        child.className = [...child.classList].filter(cls => !cls.startsWith('z-')).join(' ')
      );

      oldCarousel.innerHTML = cleanCarousel.innerHTML
      updateStylingControls(carouselSelect)

      webpageDb.map(item=>{
        if(item.id == actualField.id){
          item.element_order = actualField.dataset.itemOrder
          console.log(item)
        }else if(item.id == prevField.id){
          item.element_order = prevField.dataset.itemOrder
          console.log(item)
        }
      })
      console.log(webpageDb)
    }
    setTimeout(() => {
      try {
        initFlowbite();
      } catch (error) {
          console.error('❌ Gagal menginisialisasi Carousel:', error);
      }
    }, 100);

  }else if (idParts[0] === 'delete') {
    const indicatorWrapper = document.getElementById(`slide-indicator-${idParts.slice(2, -1).join('-')}`);
    // Ambil semua item carousel
    const items = Array.from(actualField.parentElement.querySelectorAll("[data-item-order]"));

    // Urutkan berdasarkan itemOrder
    const sortedItems = items
      .map((el) => parseInt(el.dataset.itemOrder))
      .sort((a, b) => a - b);

    // Buat mapping itemOrder -> index
    const orderToIndex = {};
    sortedItems.forEach((order, idx) => {
      orderToIndex[order] = idx;
    });

    console.log("Mapping:", orderToIndex);

    // Sekarang update indikator
    const targetOrder = parseInt(actualField.dataset.itemOrder);
    const targetIndex = orderToIndex[targetOrder];

    Array.from(indicatorWrapper.children).forEach((indicator) => {
      const slideTo = parseInt(indicator.dataset.carouselSlideTo);

      if (slideTo === targetIndex) {
        indicator.remove();
        console.log("indicator remove", slideTo, targetOrder);
      } else if (slideTo > targetIndex) {
        indicator.dataset.carouselSlideTo = slideTo - 1;
        console.log("indicator no remove", slideTo, targetOrder);
      } else {
        console.log(
          "test indicator remove",
          slideTo,
          targetOrder,
          slideTo > targetIndex
        );
      }
    });

    // Update itemCount jika item yang dihapus adalah yang terakhir
    if (parseInt(actualBodyItem.dataset.itemCount) === targetOrder) {
      actualBodyItem.dataset.itemCount = targetOrder - 1;
      console.log('carousel item delete');
    }

    editCarouselItem.remove();
    webpageDb.map(field => {
      if(field.id === actualField.id.split('-').slice(1,-1).join('-')){
        field.element_count = actualBodyItem.dataset.itemCount
      }
    })
    webpageDb = webpageDb.filter(field => !field.id.includes(actualField.id))
    
    actualField.remove();
    console.log(webpageDb)

    setTimeout(() => {
      try {
        initFlowbite();
      } catch (error) {
        console.error('❌ Gagal menginisialisasi Carousel:', error);
      }
    }, 100);
  }

})

document.getElementById('webpage').addEventListener('click', function (event) {
  const idParts = event.target.id.split('-')
  const id = event.target.id
  // =================== ADD ELEMENT ==========================

  if (id.startsWith('add-section-')) {
    const idParts = event.target.id.split('-');
    const idPrefix = `${idParts.slice(2, idParts.length-1).join('-')}`

    let newSection
    
    if(idParts[2] === 'accordion'){
      let elementCollapse = document.getElementById(`body-${idPrefix}`)
      let elementCount = parseInt(elementCollapse.dataset.elementCount)+1
      elementCollapse.dataset.elementCount = elementCount
      
      let svg = `
        <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
        </svg>  
      `
      let newSection=`
        <div id="section-${idPrefix}-${elementCount}" data-element-order="${elementCount}" class="relative w-full flex flex-col justify-center items-center border border-gray-400">
          <div type="button" class="absolute right-[-1.3rem] top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-body-${idPrefix}-${elementCount}" data-dropdown-placement="right-end">
            ${svg}
          </div>

          <!-- Body Collapse -->
          <div id="wrapper-section-${idPrefix}-${elementCount}" data-element-count="1" class="flex justify-start items-center flex-col">
            <div data-element-order="1" style="position:relative;display:flex;justify-content:center;align-items:center;flex-direction:column;">
              <div type="button" class="absolute right-[-1.3rem] top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-field-${idPrefix}-${elementCount}-1" data-dropdown-placement="right-end">
                ${svg}    
              </div>
              <div id="field-${idPrefix}-${elementCount}-1" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" class="border border-b-1 border-gray-500 px-1 max-w-[100%] break-all scroll-hidden overflow-scroll" contenteditable="true">
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
        console.log('element select', element)
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
        element_order: `${elementCount}`,
        element_count: '1'
      },
      {
        id: `field-${idPrefix}-${elementCount}-1`,
        type: 'field',
        style: 'ol{list-style-type:decimal;}ul{list-style-type:disc;}',
        element_order: 1,
        content: 'test'
      })

      webpageDb.map(page =>{
        if(page.id === `btn-heading-${idPrefix}`){
          page.element_count = elementCount
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
          element_count: '0'
      })

      newSection =`
          <div id="webpage-section-${elementCount}" data-element-order="${elementCount}" class="bg-gray-200 flex flex-col justify-center items-center border border-gray-700" style="position:relative;min-height:100dvh;">
            <div class="absolute right-1 top-1 z-50 cursor-pointer" data-dropdown-toggle="dropdown-section-${elementCount}" data-dropdown-placement="right-end">
                <svg class="w-7 h-7 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                    <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
                </svg>                  
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
      
      console.log(webpageDbParentSection)
    }
    console.log(webpageDb)
    
    setTimeout(() => {
        try {
          initFlowbite();
        } catch (error) {
            console.error('❌ Gagal menginisialisasi Dropdown:', error);
        }
    }, 100);  
    setListener()
  }

  if (id.startsWith('add-field-')) {
    console.log('test ad field')
    const idParts = event.target.id.split('-');
    let idAppendField, idPrefix, fieldNumber, bodyAppend, bodyDropdown

    const createFieldHTML = (idPrefix,fieldNumber)=>
      `<div data-element-order="${fieldNumber}" style="position:relative;display:flex;justify-content:center;align-items:center;flex-direction:column;">
        <div type="button" class="absolute right-[-1.3rem] top-0 z-30 cursor-pointer" data-dropdown-toggle="dropdown-body-${idPrefix}" data-dropdown-placement="right-end">
          <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
              <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
          </svg>    
        </div>
        <div id="${idPrefix}" contenteditable="true" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" class="border border-b-1 border-gray-500 p-1 max-w-[100%] break-all scroll-hidden overflow-scroll"></div>
      </div>`

    if(idParts[2] === 'accordion'){
      console.log('field accordion')
      idAppendField = `wrapper-section-${idParts.slice(2,idParts.length).join('-')}`
      bodyAppend = document.getElementById(idAppendField)
      console.log(bodyAppend.getAttribute('data-element-count'))
      fieldNumber = parseInt(bodyAppend.getAttribute('data-element-count'))+1

      bodyAppend.dataset.elementCount = fieldNumber
    
      idPrefix = `field-${idParts.slice(2, idParts.length).join('-')}-${fieldNumber}`

      console.log('field add',bodyAppend.getAttribute('data-element-count') ,fieldNumber,  parseInt(bodyAppend.getAttribute('data-element-count'))+1)

    }else if(idParts[2] === 'modal'){
      console.log('field modal')

      idAppendField = `body-${idParts.slice(2,idParts.length).join('-')}`

      bodyAppend = document.getElementById(idAppendField)
      fieldNumber = parseInt(bodyAppend.getAttribute('data-element-count'))+1

      bodyAppend.dataset.elementCount = fieldNumber
    
      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`

    }else{
      console.log('field biasa')

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
  
        fieldNumber = parseInt(bodyAppend.dataset.elementCount)=1
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
              <a id="delete-${idPrefix}" class="cursor-pointer text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a>
          </li>
          <li>
              <a id="copy-${idPrefix}" class="cursor-pointer text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Duplikat</a>
          </li>
        </ul>
      </div>
    `
    if(idParts.includes('modal')){
      document.getElementById(idAppendField).parentElement.insertAdjacentHTML('beforeend', bodyDropdown)
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
      style: 'ol{list-style-type:decimal;}ul{list-style-type:disc;}',
      element_order: fieldNumber
    });

    webpageDb.map(item=>{
      if(item.id === `webpage-section-${idParts.find(part => !isNaN(part))}` && idParts.filter(part => !isNaN(part)).length == 1){
        item.element_count++
      }else if(item.id === bodyAppend.parentElement.id){
        item.element_count++
      }else if(item.id === `webpage-${idParts.slice(3).join('-')}` && idParts.filter(part => !isNaN(part)).length == 1){
        item.element_count++
      }else if(item.id === `section-${idParts.slice(2).join('-')}` && idParts.join('-').includes('accordion')){
        item.element_count++
      }else if(item.id === `body-${idParts.slice(2).join('-')}` && idParts.join('-').includes('modal')){
        item.element_count++
      }
    })

    console.log(webpageDb)
    
    const field = createFieldHTML(idPrefix,fieldNumber)
    document.getElementById(idAppendField).insertAdjacentHTML('beforeend',field);

    dropdownInitialized('',`dropdown-body-${idPrefix}`)
    setListener(); // kamu tetap bisa panggil fungsi tambahan kalau perlu
  }

  if (id.startsWith('add-video-')) {
    const idParts = event.target.id.split('-');
    const videoField = document.createElement('div');
    let idAppendVideo, idPrefix, fieldNumber=0,bodyAppend, bodyDropdown

    const createVideoFieldHTML = (idPrefix) => `
      <input type="file" id="input-${idPrefix}" accept="video/*" class="hidden">
      <div type="button" class="absolute right-[-1.3rem] top-0 z-30 cursor-pointer" data-dropdown-toggle="dropdown-${idPrefix}" data-dropdown-placement="right-end">
        <svg id="edit-video" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
        </svg>    
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
          <li><a id="copy-${idPrefix}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a></li>
        </ul>
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
          <li><a id="delete-${idPrefix}" class="block px-4 py-2 font-extrabold text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a></li>
        </ul>
      </div>
    `

    if(idParts[2] === 'accordion'){
      idAppendVideo = `wrapper-section-${idParts.slice(2, idParts.length).join('-')}`;
      bodyAppend = document.getElementById(idAppendVideo);

      fieldNumber = parseInt(bodyAppend.getAttribute('data-element-count')) + 1;
      bodyAppend.dataset.elementCount = fieldNumber;
      
      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`;
      videoField.id = idPrefix;

      bodyDropdown = createBodyDropdown(idPrefix);
      
    }else if(idParts[2] === 'modal'){
      idAppendVideo = `body-${idParts.slice(2, idParts.length).join('-')}`;
      bodyAppend = document.getElementById(idAppendVideo);

      fieldNumber = parseInt(bodyAppend.getAttribute('data-element-count')) + 1;
      bodyAppend.dataset.elementCount = fieldNumber;
      
      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`;
      videoField.id = idPrefix;

    }else{
      idAppendVideo = `editor-container-section-${idParts[4]}`;
      const section = document.getElementById(idAppendVideo)

      fieldNumber = section.dataset.elementCount
      fieldNumber++
      section.dataset.elementCount = fieldNumber
      
      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`;
      videoField.id = idPrefix;

    }

    bodyDropdown = createBodyDropdown(idPrefix);

    if(idParts.includes('modal')){
      videoField.innerHTML += bodyDropdown;
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

    webpageDb.push({
      id: idPrefix,
      type: 'video',
      style: videoField.getAttribute('style'),
      element_order: fieldNumber
    });

    webpageDb.map(item=>{
      if(item.id === `webpage-section-${idParts.find(part => !isNaN(part))}` && idParts.filter(part => !isNaN(part)).length == 1){
        item.element_count++
      }else if(item.id === `section-${idParts.slice(2).join('-')}` && idParts.join('-').includes('accordion')){
        item.element_count++
      }else if(item.id === `body-${idParts.slice(2).join('-')}` && idParts.join('-').includes('modal-element')){
        item.element_count++
      }
    })
    console.log(webpageDb)

    // Initialize dropdown & listeners
    dropdownInitialized('',`dropdown-${idPrefix}`);
    setListener();
  }
  
    // ======================== MODAL =========================
  if(id.startsWith('add-modal-')) {
    const idParts = event.target.id.split('-')
    let bodyAppend, fieldNumber, bodyDropdown, idPrefix, idAppend

    const createBtnModalHTML = (idPrefix,fieldNumber)=>`
      <div id="${idPrefix}" data-element-order="${fieldNumber}" class="z-10 flex justify-center items-center flex-col">
        <div id="wrapper-${idPrefix}" class="relative flex justify-center items-center inline-flex gap-2">
          <div type="button" class="absolute right-[-1.7rem] top-[-0.3rem] z-10 cursor-pointer" data-dropdown-toggle="dropdown-btn-${idPrefix}" data-dropdown-placement="right-end">
            <svg id="edit-accordion" class="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
            </svg>                  
          </div>

          <button id="btn-${idPrefix}" data-modal-target="element-${idPrefix}" style="position:relative;padding: 10px;border-radius:5px;background-color:rgba(255,255,255,1);" data-modal-toggle="element-${idPrefix}" class="flex justify-between items-center break-all" data-target="#element-${idPrefix}">
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

          <div id="parent-${idPrefix}" class="relative bg-white rounded-md w-full max-w-2xl max-h-full">
            <!-- Modal content -->
            <div class="shadow-sm">
              <!-- Modal header -->
              <div class="flex items-center justify-between p-4 md:p-5 border-b-2 rounded-t border-gray-200">
                  <div id="field-head-${idPrefix}" class="border border-gray-400 break-all scroll-hidden overflow-scroll p-1" contenteditable="true">
                      Head Modal
                  </div>
              </div>

              <!-- Modal body -->
              <div type="button" class="absolute right-[-1.7rem] top-[-0.3rem] z-10 cursor-pointer" data-dropdown-toggle="dropdown-body-${idPrefix}" data-dropdown-placement="right-end">
               <svg id="edit-accordion" class="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                   <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                   <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
               </svg>                  
             </div>
              <div id="body-${idPrefix}" class="flex flex-col justify-center items-center relative p-3" data-element-count="1">

                <div data-element-order="1" style="position: relative;">
                  <div type="button" class="absolute right-[-1.3rem] top-[0.8rem] z-10 cursor-pointer" data-dropdown-toggle="dropdown-field-${idPrefix}-1" data-dropdown-placement="right-end">
                    <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                        <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
                    </svg>    
                  </div>

                  <div id="dropdown-field-${idPrefix}-1" data-accordion="open" class="absolute mt-2 left-0 w-25 z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
                    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        <li>
                            <a id="up-field-${idPrefix}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
                        </li>
                        <li>
                            <a id="down-field-${idPrefix}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
                        </li>
                        <li>
                            <a id="copy-${idPrefix}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a>
                        </li>
                        <li>
                            <a id="delete-field-${idPrefix}-1" class="cursor-pointer text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a>
                        </li>
                    </ul>
                  </div>

                  <div id="field-${idPrefix}-1" class="border border-b-1 border-gray-500 break-all scroll-hidden overflow-scroll p-1" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" contenteditable="true">
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
      
      console.log('modal in accordion')

    }else{
      idAppend = `editor-container-section-${idParts[4]}`;
      const section = document.getElementById(idAppend)

      fieldNumber = section.dataset.elementCount;
      fieldNumber++
      section.dataset.elementCount = fieldNumber

      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`
      idAppend = `editor-container-section-${idParts[4]}`

      console.log('modal biasa')
      
    }

    bodyDropdown = `
        <div id="dropdown-btn-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-20 z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li><a id="down-btn-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
            <li><a id="up-btn-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
            <li><a id="copy-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a></li>
          </ul>
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
            <li><a id="delete-btn-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
          </ul>
        </div>
    `

    document.getElementById(`webpage-section-${idParts.find(part => !isNaN(part))}`).insertAdjacentHTML('beforeend', bodyDropdown)
    document.getElementById(`webpage-section-${idParts.find(part => !isNaN(part))}`).insertAdjacentHTML('beforeend', createBodyModalHTML(idPrefix))
    document.getElementById(idAppend).insertAdjacentHTML('beforeend',createBtnModalHTML(idPrefix, fieldNumber));

    webpageDb.push({
      id: `${idPrefix}`,
      type:'button-modal',
      style: 'position:relative;padding: 10px;border-radius:5px;background-color:rgba(255,255,255,1);',
      element_order: fieldNumber,
      content: '<span class="w-full">Button Modal</span>'
    },
    {
      id: `body-${idPrefix}`,
      type: 'body-modal',
      content:'modal-default',
      element_count:1
    },
    {
      id: `field-${idPrefix}-1`,
      type: 'field',
      style: 'ol{list-style-type:decimal;}ul{list-style-type:disc;}',
      element_order: '1',
      content: 'test'
    },
    {
      id: `field-head-${idPrefix}`,
      type: 'field',
      style: 'ol{list-style-type:decimal;}ul{list-style-type:disc;}',
      element_order: '1',
      content: 'Head Modal'
    })

    webpageDb.map(item=>{
      if(item.id === `webpage-section-${idParts.find(part => !isNaN(part))}` && idParts.filter(part => !isNaN(part)).length == 1){
        item.element_count++
      }else if(item.id === `section-${idParts.slice(2).join('-')}` && idParts.join('-').includes('accordion')){
        item.element_count++
      }
    })

    console.log(webpageDb)

    setListener()
    dropdownInitialized('multi',`${idPrefix}`)

    setTimeout(() => {
      try {
          const modalElement = document.getElementById(idPrefix);
          if (modalElement) {
              new Modal(modalElement);
              console.log('✅ Modal berhasil diinisialisasi:', modalElement.id);
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

  // ======================== ACCORDION ======================
  if(id.startsWith('add-accordion-')) {
    const idParts = event.target.id.split('-');
    let bodyAppend, accordionWidth,idPrefix, accordionId, idAppendAccordion, fieldNumber, accordionParentBody, itemCount, dropdownBody
    
    const createItemAccordionHTML = (idPrefix, i, content)=>{
      webpageDb.push({
        id:`btn-heading-${idPrefix}-${i}`,
        type: "head-accordion",
        style: 'background-color:rgba(255,255,255,1);padding:15px;border-bottom: 1px solid black;',
        content:`section-${i}`,
        element_order: i,
        element_count: 1
      },
      {
        id: `section-${idPrefix}-${i}-1`,
        type: 'section-accordion',
        style: 'background-color:rgba(237,237,237,1);padding:10px;',
        element_order: 1,
        element_count: 1
      },
      {
        id: `field-${idPrefix}-${i}-1-${1}`,
        type: 'field',
        content: `text ${i}`,
        element_order:1,
        style:`ol{list-style-type:decimal;}ul{list-style-type:disc;}`
      })

      let indicator=''
      if(content === 'question'){
        indicator = `<div class="btn-cta">
                      <p>?</p>
                    </div>`
      }else if(content === 'icon'){
        indicator = `<div data-accordion-icon>⮛</div>`
      }else if(content === 'none'){
        indicator = ``
      }else{
        indicator = `<svg data-accordion-icon class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                    </svg>`
      }

      return`
      <div id="${idPrefix}-${i}" class="relative z-10" data-element-order="${i}">
        <div type="button" class="absolute right-0 top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-head-${idPrefix}-${i}" data-dropdown-placement="right-end">
          <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
              <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
          </svg>    
        </div>
  
        <h2 id="heading-${idPrefix}-${i}">
          <button type="button" id="btn-heading-${idPrefix}-${i}"
          class="flex justify-between w-full break-all"
          style="background-color:rgba(255,255,255,1);padding:15px;border-bottom: 1px solid black;"
          data-accordion-target="#body-${idPrefix}-${i}"
          aria-expanded="false"
          aria-controls="body-${idPrefix}-${i}">
            <span style="width:100%;text-align:left;">Section ${i}</span>
            ${indicator}
          </button>
        </h2>
  
        <div id="body-${idPrefix}-${i}" data-element-count="1" class="z-30 hidden relative flex flex-col justify-center items-center">
          <div id="section-${idPrefix}-${i}-1" data-element-order="1" style="background-color:rgba(237,237,237,1);padding:10px;" class="relative w-full flex flex-col justify-center items-center border border-gray-400">
            <div type="button" class="absolute right-[-1.3rem] top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-body-${idPrefix}-${i}-1" data-dropdown-placement="right-end">
              <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                  <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
              </svg>    
            </div>

            <div id="wrapper-section-${idPrefix}-${i}-1" data-element-count="1" class="flex justify-start items-center flex-col">
              <!-- Body Accordion -->
              <div data-element-order="1" style="position: relative;" class="my-1">
                <div type="button" class="absolute right-[-1.3rem] top-[0.8rem] z-10 cursor-pointer" data-dropdown-toggle="dropdown-field-${idPrefix}-${i}-1-${1}" data-dropdown-placement="right-end">
                  <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                      <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
                  </svg>    
                </div>
                
                <div id="field-${idPrefix}-${i}-1-${1}" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" class="border border-b-1 border-gray-500 px-1 max-w-[100%] break-all scroll-hidden overflow-scroll" contenteditable="true">
                  isi section ${1} di field ${1}
                </div>
              </div>  
            </div>
          </div>  
        </div>
      </div>
      `
    }

    const createAccordionHTML = (idPrefix,fieldNumber, accordionWidth)=>{
      webpageDb.push({
        id:idPrefix,
        type:'accordion',
        element_order:fieldNumber,
        element_count:3,
        content: '{"accordionType":"collapse","headIndicator":"default"}',
        style:`overflow-anchor:none;height:auto;width:${accordionWidth}`
      })
      let accordionItem=``
      for (let i = 1; i <= 3; i++) {
        accordionItem += createItemAccordionHTML(idPrefix, i)
      }
      return `
      <div id="${idPrefix}" class="relative cursor-pointer" data-element-order="${fieldNumber}" data-type-indicator="default" style="overflow-anchor:none;height:auto;width:${accordionWidth}">
        <div type="button" class="absolute right-[-1.7rem] top-[-0.3rem] z-10 cursor-pointer" data-dropdown-toggle="dropdown-${idPrefix}" data-dropdown-placement="right-end">
          <svg id="edit-accordion" class="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
              <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
          </svg>                  
        </div>
        <div id="parent-${idPrefix}" data-item-accordion="3" data-accordion="collapse">
          ${accordionItem}
        </div>
      </div>
    `}
    const createItemBodyDropdownHTML = (idPrefix,idParts,i)=>{
      let bodyDropdown =``
      bodyDropdown += `
          <div id="dropdown-head-${idPrefix}-${i}" data-accordion="open" class="absolute mt-2 left-0 w-20 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li><a id="down-head-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
              <li><a id="up-head-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
            </ul>
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
              <li><a id="delete-head-${idPrefix}-${i}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
            </ul>
          </div>
          
          <div id="dropdown-field-${idPrefix}-${i}-1-${1}" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li>
                    <a id="up-field-${idPrefix}-${i}-1-${1}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
                </li>
                <li>
                    <a id="down-field-${idPrefix}-${i}-1-${1}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
                </li>
                <li>
                    <a id="delete-field-${idPrefix}-${i}-1-${1}" class="cursor-pointer text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a>
                </li>
            </ul>
          </div>
          `
      if(idParts[2] === 'in' || idParts[4] === 'in'){
        bodyDropdown +=`
        <div id="dropdown-body-${idPrefix}-${i}-1" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            <li>
              <a id="add-section-${idPrefix}-${i}-1" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Add Section</a>
            </li>
            <li>
              <a id="up-section-${idPrefix}-${i}-1" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
            </li>
            <li>
              <a id="down-section-${idPrefix}-${i}-1" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
            </li>
            <li>
              <a id="delete-section-${idPrefix}-${i}-1" class="text-red-600 font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete Section</a>
            </li>
            <hr>
            <li>
              <a id="add-field-${idPrefix}-${i}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
            </li>
            <li>
              <a id="add-video-${idPrefix}-${i}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Video</a>
            </li>
            <li>
              <a id="add-carousel-${idPrefix}-${i}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
            </li>
          </ul>
        </div> 
          `
      }else{
        bodyDropdown +=`
        <div id="dropdown-body-${idPrefix}-${i}-1" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            <li>
                <a id="add-section-${idPrefix}-${i}-1" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Add Section</a>
            </li>
            <li>
                <a id="up-section-${idPrefix}-${i}-1" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
            </li>
            <li>
                <a id="down-section-${idPrefix}-${i}-1" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
            </li>
            <li>
                <a id="delete-section-${idPrefix}-${i}-1" class="text-red-600 font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete Section</a>
            </li>
            <hr>
            <li>
                <a id="add-field-${idPrefix}-${i}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
            </li>
            <li>
                <a id="add-video-${idPrefix}-${i}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Video</a>
            </li>
            <li>
                <a id="add-modal-${idPrefix}-${i}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modal</a>
            </li>
            <li>
                <a id="add-accordion-in-${idPrefix}-${i}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Accordion</a>
            </li>
            <li>
                <a id="add-carousel-${idPrefix}-${i}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
            </li>
          </ul>
        </div> 
        `
      }

      return bodyDropdown
    }
    const createBodyDropdownHTML =(idPrefix, idParts)=>{
      let bodyDropdown=``
      for (let i = 1; i <= 3; i++) {
       bodyDropdown+=createItemBodyDropdownHTML(idPrefix,idParts,i)
      }
      
      bodyDropdown += `
        <div id="dropdown-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-20 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              <li>
                  <a id="down-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
              </li>
              <li>
                  <a id="up-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
              </li>
              <li>
                  <a id="add-accordion-head-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Add Item</a>
              </li>
          </ul>
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-0 border-t-1 border-gray-500 " aria-labelledby="dropdownDefaultButton">
            <li>
                <a id="delete-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">Delete</a>
            </li>
          </ul>
        </div>
      `
      return bodyDropdown
    }

    if(idParts[2] === 'head'){
      console.log("add item accordion")

      let parentAccordionId=`parent-${idParts.slice(3, idParts.length).join('-')}`
      accordionParentBody = document.getElementById(parentAccordionId)
      itemCount = parseInt(accordionParentBody.getAttribute('data-item-accordion')) + 1;
      
      accordionId = `${idParts.slice(3, idParts.length).join('-')}`
      idPrefix = `${idParts.slice(3, idParts.length).join('-')}`
      
      event.target.parentElement.parentElement.parentElement.classList.add('hidden')
      
      accordionParentBody.innerHTML += createItemAccordionHTML(idPrefix,itemCount, accordionParentBody.parentElement.dataset.typeIndicator);
      accordionParentBody.setAttribute('data-item-accordion', itemCount.toString());

      document.getElementById(`webpage-section-${idParts.find(part => !isNaN(part))}`).insertAdjacentHTML('beforeend',createItemBodyDropdownHTML(idPrefix,idParts,itemCount))
      webpageDb.map(page =>{
        if(page.id === idParts.slice(3, idParts.length).join('-')){
          page.element_count = itemCount
        }
      })

    }else if(idParts[2] != 'head'){
      if(idParts.join('-').includes('accordion-in-accordion')){

        idAppendAccordion = `wrapper-section-${idParts.slice(3, idParts.length).join('-')}`
        bodyAppend = document.getElementById(idAppendAccordion)

        fieldNumber = parseInt(bodyAppend.getAttribute('data-element-count'))+1
        bodyAppend.dataset.elementCount = fieldNumber;

        idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`;
        accordionId = idPrefix
    
        console.log('accordion in accordion')

        event.target.parentElement.parentElement.parentElement.classList.add('hidden')
        accordionWidth= '300px'
        
      }else{
        idAppendAccordion = `editor-container-section-${idParts[4]}`
        const section = document.getElementById(idAppendAccordion)

        fieldNumber = section.dataset.elementCount
        fieldNumber++
        section.dataset.elementCount = fieldNumber
        
        idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`;
        
        accordionId = idPrefix
        
        console.log('accordion biasa')
        accordionWidth= '400px'
        
      }
  
      document.getElementById(`webpage-section-${idParts.find(part => !isNaN(part))}`).insertAdjacentHTML('beforeend', createBodyDropdownHTML(idPrefix,idParts))
  
      document.getElementById(idAppendAccordion).insertAdjacentHTML('beforeend',createAccordionHTML(idPrefix,fieldNumber,accordionWidth));

      console.log('accoridon',idParts.filter(part => !isNaN(part)).length == 1, `section-${idParts.slice(1).join('-')}`)
      webpageDb.map(item=>{
        if(item.id === `webpage-section-${idParts.find(part => !isNaN(part))}` && idParts.filter(part => !isNaN(part)).length == 1){
          item.element_count++
        }else if(item.id === `section-${idParts.slice(3).join('-')}` && idParts.join('-').startsWith('add-accordion-in-accordion')){
          item.element_count++
        }
      })

      console.log(webpageDb, idParts)
    }

    setTimeout(() => {
        try {
            const accordionElement = document.getElementById(accordionId);
            if (accordionElement) {
                const accordion = new Accordion(accordionElement, {
                    alwaysOpen: false,
                    activeClasses: 'bg-gray-100 text-gray-900',
                    inactiveClasses: 'text-gray-500'
                });
                console.log('✅ Accordion berhasil diinisialisasi:', accordionElement.id);
            } else {
                console.warn('⚠️ Elemen Accordion tidak ditemukan setelah appendChild');
            }

            // Panggil initFlowbite setelah inisialisasi accordion spesifik ini
            // dan setelah ada sedikit penundaan
            initFlowbite();

        } catch (error) {
            console.error('❌ Gagal menginisialisasi Accordion:', error);
        }
    }, 100);  
    setListener();
    dropdownInitialized('multi', idPrefix)
  }
  
  // ======================== CAROUSEL ======================
  if(id.startsWith('add-carousel-')) {
    const idParts = event.target.id.split('-')
    let idAppend,idPrefix,bodyAppend, fieldNumber
    let svgControlerSlideSize, slideControlWrapperSize, indicatorSize, bottomIndicatorPosition, paddingSlideController,widthCarousel,heightCarousel

    const createCarousel = (idPrefix,fieldNumber,widthCarousel,heightCarousel,svgControlerSlideSize,slideControlWrapperSize,indicatorSize,bottomIndicatorPosition,paddingSlideController) => `
      <div id="${idPrefix}" data-element-order="${fieldNumber}" data-text-position="on-image" data-text="false" data-next-btn-hide="false" data-carousel="static" class="flex justify-center items-center flex-col" style="width:${widthCarousel};height:${heightCarousel};position:relative;">
        <div type="button" class="absolute right-[-1.7rem] top-[-0.3rem] z-0 cursor-pointer" data-dropdown-toggle="dropdown-${idPrefix}" data-dropdown-placement="right-end">
          <svg id="edit-accordion" class="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
          </svg>                  
        </div>

        <div id="element-${idPrefix}" data-item-count="3" class="relative w-full h-full" data-carousel="static">
          <!-- Carousel wrapper -->
          <div class="relative w-full h-full overflow-hidden rounded-lg text-black">
              <!-- Item 1 -->
              <div id="item-${idPrefix}-1" data-item-order="1" class="duration-700 ease-in-out flex justify-center items-center" style='padding:25px;background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url("/assets/img/almond1DefaultImageCarousel.jpg");background-size:cover;background-position:center;' data-carousel-item>
              </div>

              <!-- Item 2 -->
              <div id="item-${idPrefix}-2" data-item-order="2" class="duration-700 ease-in-out flex justify-center items-center" style='padding:25px;background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url("/assets/img/almond1DefaultImageCarousel.jpg");background-size:cover;background-position:center;' data-carousel-item>
              </div>

              <!-- Item 3 -->
              <div id="item-${idPrefix}-3" data-item-order="3" class="duration-700 ease-in-out flex justify-center items-center" style='padding:25px;background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url("/assets/img/almond1DefaultImageCarousel.jpg");background-size:cover;background-position:center;' data-carousel-item>
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

      console.log('add: ',fieldNumber, parseInt(bodyAppend.getAttribute('data-element-count')) + 1)

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
      content:`{"dataTextPosition":"on-image","dataText":"false","dataNextBtnHide":"false"}`
    },
    {
      id: `item-${idPrefix}-1`,
      type: 'item-carousel',
      element_order:1,
      style: `background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url('/assets/img/almond1DefaultImageCarousel.jpg');background-size:cover;background-position:center;`
    },
    {
      id: `item-${idPrefix}-2`,
      type: 'item-carousel',
      element_order:2,
      style: `background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url('/assets/img/almond1DefaultImageCarousel.jpg');background-size:cover;background-position:center;`
    },
    {
      id: `item-${idPrefix}-3`,
      type: 'item-carousel',
      element_order:3,
      style: `background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url('/assets/img/almond1DefaultImageCarousel.jpg');background-size:cover;background-position:center;`
    },
    )

    webpageDb.map(item=>{
      if(item.id === `webpage-section-${idParts.find(part => !isNaN(part))}` && idParts.filter(part => !isNaN(part)).length == 1){
        item.element_count++
      }else if(item.id === `section-${idParts.slice(2).join('-')}`){
        item.element_count++
      }
    })

    console.log(webpageDb)

    setListener()
    dropdownInitialized('',`dropdown-${idPrefix}`)

    setTimeout(() => {
      try {
          const carouselElement = document.getElementById(idPrefix);
          if (carouselElement) {
              new Carousel(carouselElement);
              console.log('✅ Carousel berhasil diinisialisasi:', carouselElement.id);
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
  }

  if(id.startsWith('copy-')){
    const idParts = event.target.id.split('-')

    function replaceTrailingNumber(str, newNum) {
      return str.replace(/\d+$/, String(newNum));
    }

    const copyField = () => {
      // --- 1️⃣ Ambil elemen sumber ---
      const element = document.getElementById(idParts.slice(1).join('-'));
      if (!element) {
        console.error('Element asal tidak ditemukan:', idParts.slice(1).join('-'));
        return;
      }
      
      const parent = element.parentElement;
      const container = parent?.parentElement;
      console.log('element: ',element)
      console.log('parent: ',parent)
      console.log('container: ',container)
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

      // Update ID field utama
      const fieldEl = copyElement.querySelector(`#${oldId}`);
      if (fieldEl) fieldEl.id = newId;

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
            if (idx !== -1) webpageDb[idx].element_order = String(newOrder);
          }
        }
      });

      // --- 4️⃣ Fungsi bantu untuk update semua atribut yang mengandung ID lama ---
      function updateFieldAttributes(rootEl, oldSuffix, newSuffix) {
        rootEl.querySelectorAll('*').forEach(el => {
          for (const attr of el.getAttributeNames()) {
            const val = el.getAttribute(attr);
            if (!val || typeof val !== 'string') continue;
            if (val.includes(oldSuffix)) {
              el.setAttribute(attr, val.replaceAll(oldSuffix, newSuffix));
            }
          }

          // Update ID dan duplikasi field di DB
          if (el.id && el.id.includes(oldSuffix)) {
            const origId = el.id;
            const newId = origId.replaceAll(oldSuffix, newSuffix);

            el.id = newId;

            const originalField = webpageDb.find(f => f.id === origId);
            if (originalField) {
              const cloned = structuredClone(originalField);
              cloned.id = newId;
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

      // --- 5️⃣ Duplikasi dropdown body-nya ---
      if(!copyElement.querySelector(`[id*=modal]`)){
        const bodyDropdown = document.getElementById(`dropdown-body-${idParts.slice(1).join('-')}`);
        if (bodyDropdown) {
          const copyBodyDropdown = bodyDropdown.cloneNode(true);
          copyBodyDropdown.id = replaceTrailingNumber(copyBodyDropdown.id, countNumber);
          copyBodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';
          copyBodyDropdown.setAttribute('data-initialized', '');
  
          updateFieldAttributes(copyBodyDropdown, oldSuffix, newSuffix);

          console.log('Dropdown body ditemukan untuk:', oldId, copyBodyDropdown);
          bodyDropdown.insertAdjacentElement('afterend', copyBodyDropdown)
        } else {
          console.warn('Dropdown body tidak ditemukan untuk:', oldId);
        }
        console.log('no modal dropdown: ',copyElement.id)
      }else{
        const bodyDropdown = copyElement.querySelector('[data-initialized]')
        bodyDropdown.setAttribute('data-initialized', '')
        bodyDropdown.setAttribute('class', 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700')
        console.log('modal dropdown: ',bodyDropdown)
      }

      setListener();
      dropdownInitialized('', `dropdown-body-${newId}`);
      

      // --- 8️⃣ Update element_count di DB container ---
      const containerParent = container.parentElement;
      if (containerParent) {
        const containerField = webpageDb.find(f => f.id === containerParent.id);
        if (containerField) containerField.element_count = countNumber;
      }

      // --- 9️⃣ Duplikat entri utama ke database ---
      const originalField = webpageDb.find(f => f.id === oldId);
      if (originalField) {
        const clonedField = structuredClone(originalField);
        clonedField.id = newId;
        clonedField.element_order = copyElement.dataset.elementOrder;
        webpageDb.push(clonedField);
      }

      console.log('Field duplicated:', newId, '→', webpageDb);
    };

    const copyVideo=()=>{
      // element original
      const element = document.getElementById(idParts.slice(1).join('-'))
      const oldId = element.id

      const container = element.parentElement

      // set element count
      const countNumber = parseInt(container.dataset.elementCount || 0)+1
      container.dataset.elementCount = countNumber

      // new id
      const newId = oldId.replace(/\d+$/, countNumber.toString()); 

      // duplikat element
      const copyElement = element.cloneNode(true)
      copyElement.dataset.elementOrder = parseInt(copyElement.dataset.elementOrder)+1
      copyElement.id = newId

      // set element order element
      Array.from(container.children).forEach(el => {
        if (el.dataset.elementOrder) {
          const currentOrder = parseInt(el.dataset.elementOrder);
          const newOrderBase = parseInt(copyElement.dataset.elementOrder);

          if (currentOrder >= newOrderBase) {
            const newOrder = currentOrder + 1;
            el.dataset.elementOrder = newOrder;

            const idx = webpageDb.findIndex(field => field.id === el.id);
            if (idx !== -1) {
              webpageDb[idx].element_order = newOrder;
            }
          }
        }
      });

      // set dropdown
      const btnDropdown = copyElement.querySelector(`[data-dropdown-toggle^="dropdown-"]`)
      btnDropdown.dataset.dropdownToggle = `dropdown-${newId}`
      
      const bodyDropdown = document.getElementById(`dropdown-${idParts.slice(1).join('-')}`)
      const copyBodyDropdown = bodyDropdown.cloneNode(true)
      
      copyBodyDropdown.id = copyBodyDropdown.id.replace(/\d+$/, countNumber.toString());
      copyBodyDropdown.setAttribute('class', 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700')
      copyBodyDropdown.setAttribute('data-initialized', '')

      copyBodyDropdown.querySelectorAll('a').forEach(a=>{
        a.id=a.id.replace(/\d+$/, countNumber.toString()); 
      })

      element.insertAdjacentElement('afterend', copyElement)
      bodyDropdown.insertAdjacentElement('afterend', copyBodyDropdown)
      setListener()
      dropdownInitialized('',`dropdown-${newId}`)

      // 1️⃣ Update element_count di container
      webpageDb.forEach(field => {
        if (field.id === container.parentElement.id) {
          field.element_count = countNumber;
        }
      });

      // 2️⃣ Temukan elemen lama yang mau diduplikat
      const originalField = webpageDb.find(field => field.id === oldId);

      if (originalField) {
        // 3️⃣ Duplikat object-nya
        const clonedField = {
          ...structuredClone(originalField), // salin semua properti
          id: newId, // ganti ID jadi ID baru
          element_order: copyElement.dataset.elementOrder // ganti order-nya
        };

        // 4️⃣ Tambahkan ke database
        webpageDb.push(clonedField);
      }
      console.log(webpageDb, container.id)
    }
    
    if(idParts[1] == "field"){
      copyField()
    }else if(idParts[1] == "video"){
      copyVideo()
    }else if(idParts[1] == "modal"){
      function dupmodal(){

        // element original
        const btnModal = document.getElementById(idParts.slice(1).join('-'))
        const bodyModal = document.getElementById(`element-${idParts.slice(1).join('-')}`)
        // console.log(idParts.slice(1).join('-'))
        const btnOldId = btnModal.id
        const modalOldId = bodyModal.id
  
        const container = btnModal.parentElement
  
        // set element count
        const countNumber = parseInt(container.dataset.elementCount || 0)+1
        container.dataset.elementCount = countNumber
  
        // new id
        const btnNewId = btnOldId.replace(/\d+$/, countNumber.toString()); 
        const modalNewId = modalOldId.replace(/\d+$/, countNumber.toString()); 
  
        // duplikat element
        const btnCopyElement = btnModal.cloneNode(true)
        const modalCopyElement = bodyModal.cloneNode(true)
        btnCopyElement.dataset.elementOrder = parseInt(btnCopyElement.dataset.elementOrder)+1
        btnCopyElement.id = btnNewId
        modalCopyElement.id = modalNewId
  
        // set element order element
        Array.from(container.children).forEach(el => {
          if (el.dataset.elementOrder) {
            const currentOrder = parseInt(el.dataset.elementOrder);
            const newOrderBase = parseInt(btnCopyElement.dataset.elementOrder);
  
            if (currentOrder >= newOrderBase) {
              const newOrder = currentOrder + 1;
              el.dataset.elementOrder = newOrder;
  
              const idx = webpageDb.findIndex(field => field.id === el.id);
              if (idx !== -1) {
                webpageDb[idx].element_order = newOrder;
              }
            }
          }
        });
  
        // set dropdown
        const btnDropdown = btnCopyElement.querySelector(`[data-dropdown-toggle^="dropdown-"]`)
        btnDropdown.dataset.dropdownToggle = `dropdown-${btnNewId}`
        
        const bodyDropdown = document.getElementById(`dropdown-btn-${idParts.slice(1).join('-')}`)
        const copyBodyDropdown = bodyDropdown.cloneNode(true)
        
        copyBodyDropdown.id = copyBodyDropdown.id.replace(/\d+$/, countNumber.toString());
        copyBodyDropdown.setAttribute('class', 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700')
        copyBodyDropdown.setAttribute('data-initialized', '')
  
        copyBodyDropdown.querySelectorAll('a').forEach(a=>{
          a.id=a.id.replace(/\d+$/, countNumber.toString()); 
        })
  
        btnModal.insertAdjacentElement('afterend', btnCopyElement)
        document.getElementById(`webpage-section-${idParts.find(part => !isNaN(part))}`).insertAdjacentElement('beforeend', modalCopyElement)
        bodyDropdown.insertAdjacentElement('afterend', copyBodyDropdown)
  
        // dapetin id elemen dalam body modal
        const prefixBodyModalId = modalCopyElement.id.split('-').slice(1).join('-')
        modalCopyElement.querySelectorAll(`[id*="${prefixBodyModalId}"]`).forEach(el=>{
          const newId = el.id.replace(`${modalOldId.split('-').slice(1).join('-')}`, prefixBodyModalId);
  
          const originalField = webpageDb.find(field => field.id === el.id);
          if (originalField) {
            // 3️⃣ Duplikat object-nya
            const clonedField = {
              ...structuredClone(originalField), // salin semua properti
              id: newId, // ganti ID jadi ID baru
            };
  
            // 4️⃣ Tambahkan ke database
            webpageDb.push(clonedField);
          }
          el.id = newId
        })
        modalCopyElement.querySelectorAll(`[data-dropdown-toggle*="${prefixBodyModalId}"]`).forEach(el=>{
          el.id=el.id.replace(`${modalOldId.split('-').slice(1).join('-')}`, prefixBodyModalId);
        })
  
        setListener()
        dropdownInitialized('',`dropdown-btn-${btnNewId}`)
  
        // 1️⃣ Update element_count di container
        webpageDb.forEach(field => {
          if (field.id === container.id) {
            field.element_count = countNumber;
          }
        });
  
        // 2️⃣ Temukan elemen lama yang mau diduplikat
        const originalField = webpageDb.find(field => field.id === btnOldId);
  
        if (originalField) {
          // 3️⃣ Duplikat object-nya
          const clonedField = {
            ...structuredClone(originalField), // salin semua properti
            id: newId, // ganti ID jadi ID baru
            element_order: btnCopyElement.dataset.elementOrder // ganti order-nya
          };
  
          // 4️⃣ Tambahkan ke database
          webpageDb.push(clonedField);
        }
        console.log(webpageDb, container.id)
      }

      // --- util kecil ---
      const deepClone = (o) => {
        if (typeof structuredClone === 'function') return structuredClone(o);
        return JSON.parse(JSON.stringify(o));
      };

      // --- fungsi utama: duplikat modal ---
      // panggil: duplicateModal({ btnId: 'btn-modal-...'})
      function duplicateModal(btnId) {
        try {
          const btnModal = document.getElementById(btnId);
          if (!btnModal) {
            console.error('button modal tidak ditemukan:', btnId);
            return false;
          }

          // asumsikan modal terkait ada dan id-nya adalah idModal (bisa diberikan kalau pola beda)
          // contoh pola: btn id = "btn-modal-accordion-element-section-2-4-2-1-5"
          // modal id = "element-modal-accordion-element-section-2-4-2-1-5"
          // kita coba derive modalId dari btnId dengan mengganti prefix "btn-" -> "element-"
          const modalId = btnModal.id.startsWith('btn-')
            ? 'element-' + btnModal.id.slice(4)
            : null;

          let modalEl = modalId ? document.getElementById(modalId) : null;
          if (!modalEl) {
            console.warn('modal body tidak ditemukan otomatis untuk btnId, sebutkan modalId manual. Mencoba mencari di DOM berdasarkan pattern...');
            // fallback: cari element yang mengandung sisa id btn tanpa prefix btn-
            const suffix = btnModal.id.slice(btnModal.id.indexOf('-') + 1);
            const found = document.querySelector(`[id*="${suffix}"][id^="element-"]`);
            if (found) {
              console.log('fallback modal ditemukan:', found.id);
              modalEl = found;
            } else {
              console.error('modal body tidak ditemukan untuk btn:', btnId);
              return false;
            }
          }

          const container = btnModal.parentElement;
          if (!container) {
            console.error('container parent btn tidak ditemukan');
            return false;
          }

          // hitung count baru & simpan
          const countNumber = (parseInt(container.dataset.elementCount || '0', 10) || 0) + 1;
          container.dataset.elementCount = String(countNumber);

          // clone elemen (btn + modal body)
          const btnCopy = btnModal.cloneNode(true);
          const modalCopy = modalEl.cloneNode(true);

          // buat id baru dengan mengganti angka terakhir
          const oldBtnId = btnModal.id;
          const oldModalId = modalEl.id;
          const newBtnId = replaceTrailingNumber(oldBtnId, countNumber);
          const newModalId = replaceTrailingNumber(oldModalId, countNumber);
          // console.log('test',countNumber, {oldBtnId, oldModalId, newBtnId,newModalId})

          btnCopy.id = newBtnId;
          modalCopy.id = newModalId;

          // update element order btnCopy: +1 dari original (jika ada)
          const originalOrder = parseInt(btnCopy.dataset.elementOrder || '0', 10);
          const newOrderBase = originalOrder + 1;
          btnCopy.dataset.elementOrder = String(newOrderBase);

          // 1) Perbarui element_order pada sibling (hanya direct children container)
          Array.from(container.children).forEach(el => {
            // Pastikan elemen punya data-element-order
            const currentOrder = parseInt(el.dataset?.elementOrder || '0', 10);
            if (isNaN(currentOrder)) return;

            if (currentOrder >= newOrderBase) {
              const updated = currentOrder + 1;
              el.dataset.elementOrder = String(updated);

              // --- Cari ID field yang relevan ---
              let id = el.id;

              // Kalau elemen tidak punya id, cari child yang id-nya diawali "field-"
              if (!id) {
                const childWithId = el.querySelector('[id^="field-"]');
                if (childWithId) id = childWithId.id;
              }

              // Kalau tetap tidak ketemu ID, skip
              if (!id) return;

              console.log('Updating order for', id, '=>', updated);

              // --- Update juga di database (webpageDb) ---
              const idx = webpageDb.findIndex(f => f.id === id);
              if (idx !== -1) {
                webpageDb[idx].element_order = String(updated);
              }
            }
          });
          function updateModalAttributes(modalCopyElement, oldModalId, newModalId) {
            // Ambil bagian "unik" dari ID lama dan baru, misal:
            // oldModalId = "modal-element-accordion-section-2"
            // newModalId = "modal-element-accordion-section-3"
            const oldSuffix = oldModalId.split('-').slice(1).join('-');
            const newSuffix = newModalId.split('-').slice(1).join('-');

            // Ambil semua elemen di dalam modal yang disalin
            modalCopyElement.querySelectorAll('*').forEach(el => {
              // 1️⃣ Cek setiap atribut
              for (const attr of el.getAttributeNames()) {
                const val = el.getAttribute(attr);
                if (!val || typeof val !== 'string') continue;

                // 2️⃣ Kalau value mengandung ID lama, ganti jadi ID baru
                if (val.includes(oldSuffix)) {
                  const newVal = val.replaceAll(oldSuffix, newSuffix);
                  el.setAttribute(attr, newVal);
                }
              }

              // 3️⃣ Kalau ID-nya sendiri mengandung substring lama, ganti juga
              if (el.id && el.id.includes(oldSuffix)) {
                const newId = el.id.replaceAll(oldSuffix, newSuffix);

                // Update id di DOM
                el.id = newId;

                // 4️⃣ Update juga di database (webpageDb)
                const originalField = webpageDb.find(f => f.id === el.id);
                if (originalField) {
                  const cloned = structuredClone(originalField);
                  cloned.id = newId;
                  webpageDb.push(cloned);
                }
              }
            });
          }
          updateModalAttributes(btnCopy, oldModalId, newModalId)
          updateModalAttributes(modalCopy, oldModalId, newModalId)

          // 3) clone popup dropdown body (jika ada)
          // asumsikan id dropdown terkait adalah `dropdown-${something-same-as-btnSuffix}`
          // kita coba cari dropdown yang mengandung bagian id tombol (tanpa 'btn-')
          const btnSuffix = oldBtnId.replace(/^btn-/, '');
          const btnBodyDropdown = document.getElementById(`dropdown-btn-${btnSuffix}`);
          let copyBtnBodyDropdown = null;
          if (btnBodyDropdown) {
            copyBtnBodyDropdown = btnBodyDropdown.cloneNode(true);
            copyBtnBodyDropdown.id = replaceTrailingNumber(copyBtnBodyDropdown.id, countNumber);
            // update all ids di dalam dropdown (mis anchor ids)
            copyBtnBodyDropdown.querySelectorAll('[id]').forEach(el => {
              el.id = replaceTrailingNumber(el.id, countNumber);
            });
            copyBtnBodyDropdown.dataset.initialized = ''; // reset inisialisasi
            // atur kelas sesuai kebutuhan
            copyBtnBodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';
            // update anchors/links dataset jika perlu (tergantung struktur)
          }

          // 4) sisipkan elemen ke DOM: btn setelah btnModal; modal di webpage-section-{n}
          btnModal.insertAdjacentElement('afterend', btnCopy);

          // tentukan section target untuk append modal (ambil nomor section dari id)
          const sectionNum = (btnModal.id.split('-').find(part => !isNaN(part)) || null);
          if (sectionNum) {
            const sectionContainer = document.getElementById(`webpage-section-${sectionNum}`);
            if (sectionContainer) {
              sectionContainer.insertAdjacentElement('beforeend', modalCopy);
            } else {
              // fallback append ke body
              document.body.appendChild(modalCopy);
            }
          } else {
            document.body.appendChild(modalCopy);
          }

          if (copyBtnBodyDropdown) {
            btnBodyDropdown.insertAdjacentElement('afterend', copyBtnBodyDropdown);
          }

          modalEl.insertAdjacentElement('afterend', modalCopy);

          // 7) update webpageDb untuk btn dan modal (clone data)
          // btn
          const originalBtnObj = webpageDb.find(f => f.id === oldBtnId);
          if (originalBtnObj) {
            const clonedBtnObj = deepClone(originalBtnObj);
            clonedBtnObj.id = newBtnId;
            clonedBtnObj.element_order = String(newOrderBase);
            webpageDb.push(clonedBtnObj);
          }

          // modal (element body)
          const originalModalObj = webpageDb.find(f => f.id === `body-${oldModalId.split('-').slice(1).join('-')}`);
          if (originalModalObj) {
            const clonedModalObj = deepClone(originalModalObj);
            clonedModalObj.id = `body-${newModalId.split('-').slice(1).join('-')}`;
            // update element_count jika perlu
            clonedModalObj.element_count = clonedModalObj.element_count || '0';
            webpageDb.push(clonedModalObj);
          }

          // 8) Perbarui element_count pada container record di webpageDb (container kemungkinan = wrapper yang menaungi btn)
          const containerRecord = webpageDb.find(f => f.id === container.id.split('-').slice(1).join('-'));
          console.log(container)
          if (containerRecord) {
            containerRecord.element_count = String(countNumber);
          }

          // 9) jalankan ulang listener + inisialisasi dropdown baru
          setListener?.();
          // inisialisasi dropdown baru: coba id dropdown baru dari btnCopy's toggles
          const anyToggle = btnCopy.querySelector('[data-dropdown-toggle]');
          if (anyToggle) {
            const newDropdownTarget = anyToggle.getAttribute('data-dropdown-toggle');
            dropdownInitialized('', newDropdownTarget);
          }

          console.log('duplicated modal success', { oldBtnId, newBtnId, oldModalId, newModalId }, webpageDb);
          return true;
        } catch (e) {
          console.error('duplicateModal error', e);
          return false;
        }
      }
      duplicateModal(idParts.slice(1).join('-'))
      setTimeout(() => {
        try {
          initFlowbite();
        } catch (error) {
            console.error('❌ Gagal menginisialisasi Modal:', error);
        }
      }, 100); 

    }
  }

// ================================= DOWN UP DELETE ELEMENT =================================
  let bodyFieldELement, fieldElement
  if(idParts[0] =='up' || idParts[0] == 'down' || idParts[0] == 'delete'){
    if(idParts[1] === 'btn' && idParts[2] === 'modal'){
      console.log(idParts.slice(1, idParts.length).join('-'))
      fieldElement = document.getElementById(idParts.slice(2, idParts.length).join('-'))
      bodyFieldELement = fieldElement.parentElement
      console.log('modal Select', fieldElement, bodyFieldELement)

    }else if(idParts[1] === 'video'){

      fieldElement = document.getElementById(idParts.slice(1, idParts.length).join('-'))
      bodyFieldELement = fieldElement.parentElement

      console.log('video Select')
    }else if(idParts[1] === 'accordion') {

      fieldElement = document.getElementById(idParts.slice(1, idParts.length).join('-'))
      bodyFieldELement = fieldElement.parentElement
      console.log('accordion Select')

    }else if(idParts[1] === 'head') {

      fieldElement = document.getElementById(idParts.slice(2, idParts.length).join('-'))
      bodyFieldELement = fieldElement.parentElement
      console.log('head accordion Select', fieldElement, bodyFieldELement)

    }else if(idParts[1] === 'carousel'){

      fieldElement = document.getElementById(idParts.slice(1, idParts.length).join('-'))
      bodyFieldELement = fieldElement.parentElement
      console.log('carousel Select', fieldElement, bodyFieldELement)

    }else if(idParts[1] === 'field'){

      fieldElement = document.getElementById(idParts.slice(1, idParts.length).join('-')).parentElement;
      bodyFieldELement = fieldElement.parentElement
      console.log(`field select: `, fieldElement,' body: ', bodyFieldELement)

    }else if(idParts[1] === 'section'){
      if(idParts[2] === 'accordion'){
        fieldElement = document.getElementById(`${idParts.slice(1, idParts.length).join('-')}`);
        bodyFieldELement = fieldElement.parentElement
        console.log(`section accordion select: `, fieldElement,' body: ', bodyFieldELement)

      }else{
        fieldElement = document.getElementById(`webpage-${idParts.slice(1, idParts.length).join('-')}`);
        bodyFieldELement = fieldElement.parentElement
        console.log(`section select: `, fieldElement,' body: ', bodyFieldELement)
      }

    }
  }else{
    console.log('no up, down, or delete element')
  }

  if(idParts[0] === 'down') {
    const nextField = fieldElement?.nextElementSibling;
    console.log(nextField, fieldElement)

    if (fieldElement && nextField) {
      let orderTemp = nextField.dataset.elementOrder;
      nextField.dataset.elementOrder = fieldElement.dataset.elementOrder;
      fieldElement.dataset.elementOrder = orderTemp;

      let fieldId
      let nextFieldId

      if(fieldElement.id && !fieldElement.parentElement.id.startsWith('parent-accordion')){
        fieldId = fieldElement.id
      }else if(fieldElement.parentElement.id.startsWith('parent-accordion')){
        fieldId = fieldElement.querySelector('[id^="btn-heading-"]').id
      }else if(fieldElement.id.startsWith('accordion')){
        fieldId=fieldElement.id
      }else{
        fieldId = fieldElement.querySelector('[id^="field-"]').id
      }
      
      if(nextField.id && !nextField.parentElement.id.startsWith('parent-accordion')){
        nextFieldId = nextField.id
      }else if(nextField.parentElement.id.startsWith('parent-accordion')){
        nextFieldId = nextField.querySelector('[id^="btn-heading-"]').id
      }else if(nextField.id.startsWith('accordion')){
        nextFieldId=nextField.id
      }else{
        nextFieldId = nextField.querySelector('[id^="field-"]').id
      }
      
      webpageDb.map(item=>{
        if(item.id == fieldId){
          item.element_order = fieldElement.dataset.elementOrder
          console.log(item)
        }else if(item.id == nextFieldId){
          item.element_order = nextField.dataset.elementOrder
          console.log(item)
        }
      })
      console.log(webpageDb, nextFieldId, fieldId)

      nextField.insertAdjacentElement('afterend', fieldElement);
    }

  }else if(idParts[0] === 'up') {
    const prevField = fieldElement?.previousElementSibling;
    console.log(prevField, fieldElement)

    if (fieldElement && prevField) {
      let orderTemp = prevField.dataset.elementOrder;
      prevField.dataset.elementOrder = fieldElement.dataset.elementOrder;
      fieldElement.dataset.elementOrder = orderTemp;
      // Sisipkan elemen field setelah elemen next-nya (artinya swap

      let fieldId
      let prevFieldId

      if(fieldElement.id && !fieldElement.parentElement.id.startsWith('parent-accordion')){
        fieldId = fieldElement.id
      }else if(fieldElement.parentElement.id.startsWith('parent-accordion')){
        fieldId = fieldElement.querySelector('[id^="btn-heading-"]').id
      }else if(fieldElement.id.startsWith('accordion')){
        fieldId=fieldElement.id
      }else{
        fieldId = fieldElement.querySelector('[id^="field-"]').id
      }
      if(prevField.id && !prevField.parentElement.id.startsWith('parent-accordion')){
        prevFieldId = prevField.id
      }else if(prevField.parentElement.id.startsWith('parent-accordion')){
        prevFieldId = prevField.querySelector('[id^="btn-heading-"]').id
      }else if(prevField.id.startsWith('accordion')){
        prevFieldId=prevField.id
      }else{
        prevFieldId = prevField.querySelector('[id^="field-"]').id
      }

      
      webpageDb.map(item=>{
        if(item.id == fieldId){
          item.element_order = fieldElement.dataset.elementOrder
          console.log(item)
        }else if(item.id == prevFieldId){
          item.element_order = prevField.dataset.elementOrder
          console.log(item)
        }
      })
      console.log('up element:',fieldId,fieldElement.dataset.elementOrder,fieldElement,prevFieldId,prevField.dataset.elementOrder, prevField)
      console.log(webpageDb)
      prevField.insertAdjacentElement('beforebegin', fieldElement);
    }

  }else if(idParts[0] === 'delete') {

    // console.log('delete:', idParts.slice(1, idParts.length).join('-'), fieldElement, bodyFieldELement)
    if(bodyFieldELement.id.startsWith('editor-container-section-') && fieldElement.dataset.elementOrder >= bodyFieldELement.dataset.elementCount){
      bodyFieldELement.dataset.elementCount = Math.max(
            0,
            parseInt(bodyFieldELement.dataset.elementCount) - 1
          );

      webpageDb.map(item=>{
        if(item.id == bodyFieldELement.parentElement.id){
          item.element_count = bodyFieldELement.dataset.elementCount
        }
      })

      console.log('field in section delete', webpageDb)

    }else if(fieldElement.dataset.elementOrder >= bodyFieldELement.dataset.elementCount && idParts[1] !== 'head' && idParts[1] !== 'section') {
      bodyFieldELement.dataset.elementCount = Math.max(
            0,
            parseInt(bodyFieldELement.dataset.elementCount) - 1
          );
      console.log('field delete')

      if(bodyFieldELement.id.includes('accordion-element')){
        webpageDb.map(page=>{
          if(page.id === bodyFieldELement.id.split('-').slice(1).join('-')){
            page.element_count=bodyFieldELement.dataset.elementCount
          }
        })
      }else{
        webpageDb.map(page=>{
          if(page.id === bodyFieldELement.id.split('-').slice(1).join('-')){
            page.element_count=bodyFieldELement.dataset.elementCount
          }
        })
      }

    }else if(fieldElement.dataset.elementOrder >= bodyFieldELement.dataset.itemAccordion && idParts[1] === 'head') {  
      bodyFieldELement.dataset.itemAccordion = Math.max(
            0,
            parseInt(bodyFieldELement.dataset.itemAccordion) - 1
          );
      console.log('head delete')
      webpageDb.map(page=>{
        if(page.id === bodyFieldELement.id.split('-').slice(1).join('-')){
          page.element_count=bodyFieldELement.dataset.itemAccordion
        }
      })

    }else{
      console.log('no delete', fieldElement.dataset, bodyFieldELement.dataset.elementCount, bodyFieldELement)
    }

    if(idParts[1] === 'btn' && idParts[2] === 'modal'){
      document.querySelector(`[id='element-${fieldElement.id}']`).remove()
    }
    
    if(idParts[1] === 'section'){
      if(bodyFieldELement.children.length > 1 ){
        if(fieldElement.dataset.elementOrder >= bodyFieldELement.dataset.elementCount){
          bodyFieldELement.dataset.elementCount = Math.max(
            0,
            parseInt(bodyFieldELement.dataset.elementCount) - 1
          );
        }

        if(idParts[2] != 'accordion' && idParts.length === 2){
          const sectionNumber = fieldElement.id.split('-').find(part => !isNaN(part));
          webpageDb = webpageDb.filter(item => {
            const itemNumber = item.id.split('-').find(part => !isNaN(part));
            return !(item.id === fieldElement.id || itemNumber === sectionNumber);
          });
          webpageDbParentSection[0].element_count = Math.max(
            0,
            parseInt(webpageDbParentSection[0].element_count) - 1
          );
          console.log('bukan accordion')
          
        }else if(idParts[2] != 'accordion' && idParts.length > 2){
          let id = fieldElement.id.split('-')

          webpageDb = webpageDb.filter(item => {
            return !(item.id === fieldElement.id || item.id.includes(id.slice(1).join('-')));
          });

          webpageDbParentSection[0].element_count = parseInt(webpageDbParentSection[0].element_count) -1
          console.log('bukan accordion 2', fieldElement.id)

        }else{
          webpageDb = webpageDb.filter(item => !item.id.includes(idParts.slice(2).join('-')));
          webpageDb.map(page=>{
            if(page.id === `btn-heading-${idParts.slice(2,-1).join('-')}`){
              page.element_count = Math.max(
                0,
                parseInt(page.element_count) - 1
              );
              console.log(page.element_count)
            }
          })
          console.log(`btn-heading-${idParts.slice(2,-1).join('-')}`,)
        }
        
        fieldElement.remove();
        event.target.parentElement.parentElement.parentElement.remove()
        console.log('section delete', webpageDb, webpageDbParentSection)
      }
    }else{
      fieldElement.querySelectorAll('[data-dropdown-toggle]').forEach(btnToggleDropdown=>{
        document.getElementById(btnToggleDropdown.getAttribute('data-dropdown-toggle')).remove()
      })

      if(fieldElement.querySelector('[id^="field"]') && !fieldElement.id.startsWith('accordion-') && !fieldElement.id.startsWith('carousel-')){
        webpageDb = webpageDb.filter(item => item.id !== fieldElement.querySelector('[id^="field"]').id);

      }else if(fieldElement.id.startsWith('modal-') || fieldElement.id.startsWith('accordion-')){
        webpageDb = webpageDb.filter(item => !item.id.includes(fieldElement.id));
        
      }else if(fieldElement.id.startsWith('btn-heading-')){
        webpageDb = webpageDb.filter(item => !item.id.includes(fieldElement.id.split('-').slice(2).join('-')));
        
      }else if(fieldElement.id.startsWith('carousel')){
        webpageDb = webpageDb.filter(item => !item.id.includes(fieldElement.id));

      }else{
        webpageDb = webpageDb.filter(item => item.id !== fieldElement.id);

      }

      console.log('delete id:', fieldElement.id, webpageDb)
      event.target.parentElement.parentElement.parentElement.remove()
      fieldElement.remove();
    }

  }
});

document.getElementById('btn-save').addEventListener('click', function(){
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  document.getElementById('loading-overlay').style.display = 'flex';
  let mergedDb = [...webpageDbParentSection, ...webpageDb]
  console.log(mergedDb)

  const form = new FormData();

  mergedDb.forEach((item, index) => {
      let normalizedStyle
      if(item.style && item.style.includes('background-image')){
        normalizedStyle = item.style.replace(/url\((["'])(.*?)\1\)/g, "url('$2')");
      }else{
        normalizedStyle = item.style
      }
      form.append(`items[${index}][id]`, item.id);
      form.append(`items[${index}][type]`, item.type);
      form.append(`items[${index}][style]`, normalizedStyle ?? '');
      form.append(`items[${index}][content]`, item.content ?? '');
      form.append(`items[${index}][element_order]`, item.element_order ?? '');
      form.append(`items[${index}][element_count]`, item.element_count ?? '');

      if (item.file) {
          form.append(`items[${index}][file]`, item.file); 
      }
  });

  form.append("paramStatus", param);

  fetch('http://127.0.0.1:8000/webpage/store', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'X-CSRF-TOKEN': csrfToken // kalau pakai Laravel CSRF
    },
    body: form
  })
    .then(response => response.json())
    .then(data => {
      console.log('Response:', data);
      if (data.success) {
         document.getElementById('loading-overlay').style.display = 'none';
        alert('Data berhasil disimpan');
        window.location.reload();
      } else {
         document.getElementById('loading-overlay').style.display = 'none';
        alert('Gagal menyimpan data');
      }
    })
    .catch(error => {
       document.getElementById('loading-overlay').style.display = 'none';
      console.error('Error:', error, webpageDb);
    });
})

fontStylingField()
widthHeightField()
borderField()
paddingMarginField()
colorBackgroundField()
borderWave()
setListener()
accordionStyling()
modalTypeStyling()
accordionTypeStyling()