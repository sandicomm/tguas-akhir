import { globals } from '../globals.js';
import { dropdownInitialized } from '../utils/dropdownInit.js';
import { renderSvg } from '../utils/svgEdit.js';
import { deepClone } from '../utils/utilsDuplikatFunction.js';
import { setListenerSetImage } from './baseStyling.js';
// ======== Validation get element ==========
import { getEl } from '../utils/validationGetElement.js';

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

function rgbToHexFull(rgb) {
    const match = rgb.match(/\d+/g);
    if (!match) return null;

    return "#" + match.slice(0, 3)
        .map(x => parseInt(x).toString(16).padStart(2, '0'))
        .join('');
}
// rumus deteksi warna teks
export function isLightColor(hex) {
    hex = hex.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Rumus luminance (W3C)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

    return luminance > 150; // threshold
}

function findTextColor(element) {
    // Cek jika element punya inline style color
    const styleColor = element.style.color;
    if (styleColor) return styleColor;

    // Cek attribute color (jarang dipakai, tapi tetap dukung)
    const attrColor = element.getAttribute('color');
    if (attrColor) return attrColor;

    // Loop ke child nodes yang paling dalam (depth-first)
    for (let child of element.children) {
        let color = findTextColor(child);
        if (color) return color;
    }

    return null;
}

export function updateStylingControls(data, field) {
    let carouselSelect=globals.carouselSelect
    let accordionSelect=globals.accordionSelect
    let fileDb=globals.file

    if(data){
      const computedField = window.getComputedStyle(data);
      const idParts = data.id.split('-')
      setPaddingMarginBoxBorder(computedField)
      let stylingWebpage=['heading-text-wrapper','accordion-head-indicator-wrapper','accordion-modal-type','accordion-accordion-type',
        'accordion-carousel-styling','accordion-font-styling-wrapper','font-order-list','font-unorder-list','reset-box',
        'accordion-box-field-wrapper','box-width-field','box-height-field','flex-position','accordion-border-field-wrapper',
        'accordion-background-wrapper','bg-image-styling',
        'accordion-padding-wrapper','accordion-margin-wrapper','wrapper-btn-save',
      ]
      
      stylingWebpage.forEach(id => {
        const el = document.getElementById(id);
        const bodyEl = document.getElementById(`${id}-body`)
        if (el && id !== 'wrapper-btn-save') {
            // 1. Tambahkan class hidden ke kontainer
            el.classList.add('hidden')
        }
    });

      if(idParts[0] == 'webpage'){
        let stylingWebpage
        if(idParts.includes('prolog')){
          stylingWebpage=[ 
            'accordion-box-field-wrapper','flex-position',
            'accordion-background-wrapper','bg-image-styling','accordion-padding-wrapper','wrapper-btn-save'
          ]
        }else{
          stylingWebpage=[ 
            'accordion-box-field-wrapper','box-height-field','flex-position','accordion-border-field-wrapper',
            'accordion-background-wrapper','bg-image-styling','accordion-padding-wrapper',
            'accordion-margin-wrapper','wrapper-btn-save','reset-box'
          ]
        }

        stylingWebpage.forEach(id=>{
          document.getElementById(id).classList.remove('hidden')
        })
        
        let fieldColor= data.style.backgroundImage || data.style.backgroundColor
        let borderColor= data.style.borderColor ?? ''

        fieldColor = getRgbArray(fieldColor)
       
        if(fieldColor){
          fieldColor = rgbToHex(fieldColor[0],fieldColor[1],fieldColor[2])
        }

        borderColor = getRgbArray(borderColor)

        if(borderColor){
          borderColor = rgbToHex(borderColor[0],borderColor[1],borderColor[2])
        }

        const justifySection = data.querySelector('[id^="editor-container-section-"]').style.justifyContent
        const flexBoxSection = document.getElementById('flex-position-section')
    
        if(justifySection === 'start'){
          flexBoxSection.querySelector('[value="top"]').selected=true
        }else if(justifySection === 'center'){
          flexBoxSection.querySelector('[value="center"]').selected=true
        }else if(justifySection === 'end'){
          flexBoxSection.querySelector('[value="end"]').selected=true
        }

        document.getElementById('color-field-input').value = fieldColor
        document.getElementById('border-color-field').value = borderColor;

      }else if(idParts[0] == 'field'){
        //console.log('field')
        let stylingWebpage=['accordion-font-styling-wrapper','font-order-list','font-unorder-list',
          'accordion-box-field-wrapper','box-width-field','box-height-field','accordion-border-field-wrapper','reset-box',
          'accordion-background-wrapper','bg-image-styling','accordion-padding-wrapper','accordion-margin-wrapper','wrapper-btn-save'
        ]

        stylingWebpage.forEach(id=>{
          document.getElementById(id).classList.remove('hidden')
        })

        let fontColor
        if (data) {
          fontColor = findTextColor(data) ?? '';
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
          document.getElementById('accordion-box-field-wrapper').classList.add('hidden')
        }

        // //console.log('field')

      }else if(data.id == 'heading-text'){
        //console.log('hedaing text')
        let stylingWebpage=['heading-text-wrapper','accordion-head-indicator-wrapper',
          'accordion-font-styling-wrapper','accordion-box-field-wrapper','box-width-field',
          'accordion-border-field-wrapper','accordion-background-wrapper','bg-image-styling','accordion-padding-wrapper',
          'accordion-margin-wrapper','wrapper-btn-save'
        ]

        if(globals.editorFieldSelect.id.startsWith('btn-modal')){
          stylingWebpage.push('accordion-modal-type')
        }else if(globals.editorFieldSelect.id.startsWith('btn-heading-accordion')){
          stylingWebpage.push('accordion-accordion-type')
        }

        stylingWebpage.forEach(id=>{
          document.getElementById(id).classList.remove('hidden')
        })
        
        let fontColor
        if (data) {
          fontColor = findTextColor(data) ?? '';

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
          document.getElementById('accordion-box-field-wrapper').classList.add('hidden')
        }

        // //console.log('field')
        
      }else if(data.id.startsWith('btn-modal') || data.id.startsWith('btn-heading-accordion')){
        let headingText = document.getElementById("heading-text")
        headingText.innerHTML = ''
        headingText.innerHTML = data.children[0].innerHTML

        let colorFontHeading = findTextColor(headingText) ?? '';

        if(colorFontHeading.includes('rgb')){

          colorFontHeading = rgbToHexFull(colorFontHeading)
        }
      
        let bgColor = isLightColor(colorFontHeading) ? '#000000' : '#ffffff';
        headingText.style.backgroundColor = bgColor;
        // //console.log('btn head modal accordion')
        let stylingWebpage=['heading-text-wrapper','accordion-head-indicator-wrapper',
          'accordion-font-styling-wrapper','accordion-box-field-wrapper','box-width-field',
          'accordion-border-field-wrapper','accordion-background-wrapper','bg-image-styling','accordion-padding-wrapper',
          'accordion-margin-wrapper','wrapper-btn-save'
        ]

        if(data.id.startsWith('btn-modal')){
          stylingWebpage.push('accordion-modal-type')
        }else if(data.id.startsWith('btn-heading-accordion')){
          stylingWebpage.push('accordion-accordion-type')
        }

        stylingWebpage.forEach(id=>{
          document.getElementById(id).classList.remove('hidden')
        })

        const headIndicator = document.getElementById('head-indicator-type')
        let indicatorType = data.dataset.typeIndicator
        if(data.id.startsWith('btn-heading')){
          indicatorType = data.parentElement.parentElement.parentElement.parentElement.dataset.typeIndicator

        }else{
          indicatorType = data.dataset.typeIndicator
        }
   
        if(indicatorType === "question"){
          headIndicator.querySelector('[value="question"]').selected=true
          
        }else if(indicatorType === "icon"){
          headIndicator.querySelector('[value="icon"]').selected=true
          
        }else if(indicatorType === "none"){
          headIndicator.querySelector('[value="none"]').selected=true
          
        }else{
          headIndicator.querySelector('[value="default"]').selected=true

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

        let fontColor = findTextColor(data) ?? ''

        document.getElementById('font-color-input').value = fontColor
        document.getElementById('color-field-input').value = fieldColor
        document.getElementById('border-color-field').value = borderColor;

      }else if(data.id.startsWith('parent-modal')){
        let stylingWebpage=['accordion-head-indicator-wrapper','accordion-modal-type',
          'accordion-background-wrapper','bg-image-styling','wrapper-btn-save'
        ]
        
        stylingWebpage.forEach(id=>{
          document.getElementById(id).classList.remove('hidden')
        })

        let fieldColor= data.style.backgroundImage || data.style.backgroundColor
        let borderColor= data.style.borderColor

        const modalSelect = document.getElementById('modal-type')
        if(data.parentElement.dataset.modalBackdrop){
          modalSelect.querySelector('[value="static"]').selected=true
        }else{
          modalSelect.querySelector('[value="default"]').selected=true
        }

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

        document.getElementById("heading-text").innerHTML = ''
        document.getElementById("heading-text").innerHTML = data.parentElement.parentElement.querySelector('[id^="btn-heading-accordion"]').children[0].innerHTML

        let stylingWebpage=['heading-text-wrapper','accordion-head-indicator-wrapper',
          'accordion-font-styling-wrapper','accordion-box-field-wrapper','box-width-field','accordion-accordion-type',
          'accordion-border-field-wrapper','accordion-background-wrapper','bg-image-styling','accordion-padding-wrapper',
          'accordion-margin-wrapper','wrapper-btn-save'
        ]
        
        stylingWebpage.forEach(id=>{
          document.getElementById(id).classList.remove('hidden')
        })

        let fieldColor= data.style.backgroundImage || data.style.backgroundColor
        let borderColor= data.style.borderColor

        const parentAccoridon = data.parentElement.parentElement.parentElement
        const accordionType = document.getElementById('accordion-type')

        if(parentAccoridon.dataset.accordion==='open'){
          accordionType.querySelector('[value="open"]').selected=true
        }else if(parentAccoridon.dataset.accordion==='collapse'){
          accordionType.querySelector('[value="collapse"]').selected=true
        }

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

      }else if(data.id.startsWith('carousel')){
      
        document.getElementById('add-text-carousel').textContent = carouselSelect.dataset.text === "true" ? "Remove Text" : "Add Text"
        document.getElementById('btn-text-position').textContent = carouselSelect.dataset.textPosition === "on-image" ? "On Image" : "Below Image"
        document.getElementById('btn-hide-next').textContent = carouselSelect.dataset.nextBtnHide === "true" ? "Unhide" : "Hide"
        
        let stylingWebpage=[
          'accordion-box-field-wrapper','box-width-field','box-height-field','accordion-background-wrapper','accordion-margin-wrapper','wrapper-btn-save','accordion-border-field-wrapper'
        ]

        // 2. Cari button di dalamnya dan paksa aria-expanded jadi false
        const fontStyling = document.getElementById('accordion-font-styling-wrapper')
        const btn = fontStyling.querySelector('button[data-accordion-target]');
        if (btn) {
            btn.setAttribute('aria-expanded', 'false');
        }
        
        stylingWebpage.forEach(id=>{
          document.getElementById(id).classList.remove('hidden')
        })

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
                <div type="button" class="bg-white rounded-full absolute right-0 top-0 cursor-pointer" data-dropdown-toggle="dropdown-${item.id}" data-dropdown-placement="right-end">
                  ${renderSvg()}                 
                </div>
              </div>
              `
          let dropdownItem=`
            <div id="dropdown-${item.id}" data-accordion="open" class="absolute mt-2 left-0 w-[125px] z-50 hidden bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <ul class="py-2 text-sm text-gray-700">
                <li><a id="down-${item.id}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white">Move Down</a></li>
                <li><a id="up-${item.id}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white">Move Up</a></li>
                <li><a id="reset-image-${item.id}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white">Reset Image</a></li>
                <li><a id="copy-${item.id}" class="cursor-pointer block text-blue-400 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white">Duplikat</a></li>
              </ul>
              <ul class=" bg-sky-500 ">
                <li><label for="bg-image-carousel" id="set-image-${item.id}" class="text-sm cursor-pointer block px-2 py-2 hover:bg-blue-600">Set Image From File</label></li>
                <li><label data-modal-target="recent-image-modal" data-modal-toggle="recent-image-modal" id="set-image-from-recent-${item.id}" class="text-sm cursor-pointer block px-2 py-2 hover:bg-blue-600">Set Image From Recent</label></li>
              </ul>
              <ul class="py-2 text-sm text-gray-700 border-t border-gray-500">
                <li><a id="delete-${item.id}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">Delete</a></li>
              </ul>
            </div>
          `
          
          // document.getElementById('webpage').insertAdjacentHTML('afterend', dropdownItem)
          if(!document.getElementById(`dropdown-${item.id}`)){
            accordionCarouselStyling.querySelector('[id="edit-carousel-item-wrapping"]').parentElement.insertAdjacentHTML('afterbegin', dropdownItem)
          }
          accordionCarouselStyling.querySelector('[id="edit-carousel-item-wrapping"]').insertAdjacentHTML('beforeend', itemWrapped)
          accordionCarouselStyling.querySelector('[id="edit-carousel-item-wrapping"]').querySelector(`#edit-${item.id}`).setAttribute('style', style)

          const setImgFromRecent = getEl(`set-image-from-recent-${item.id}`)
          if(!setImgFromRecent) return
          setImgFromRecent.addEventListener('click', function(e){
            e.target.parentElement.parentElement.parentElement.classList.add('hidden')
          })
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
        
        setTimeout(() => {
          try {
            initFlowbite();
          } catch (error) {
            // console.error('❌ Gagal inisialisasi carousel', error);
          }
        }, 100);
        
        setListenerSetImage()
        dropdownInitialized('multi', data.id)
        document.getElementById('accordion-font-styling-wrapper-body-1').classList.add('hidden')
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
        
      }else{
        document.getElementById('wrapper-btn-reset-bg-image').classList.add('hidden')
        
      }
    }else{
      let stylingWebpage=['heading-text-wrapper','accordion-head-indicator-wrapper','accordion-modal-type','accordion-accordion-type',
        'accordion-carousel-styling','accordion-font-styling-wrapper','font-order-list','font-unorder-list',
        'accordion-box-field-wrapper','box-width-field','box-height-field','flex-position','accordion-border-field-wrapper',
        'accordion-background-wrapper','bg-image-styling','accordion-padding-wrapper','accordion-margin-wrapper'
      ]
      
      stylingWebpage.forEach(id=>{
        document.getElementById(id).classList.add('hidden')
      })
      globals.isFormDirty = true
    }
}