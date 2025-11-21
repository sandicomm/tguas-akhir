import { globals } from '../globals.js';
import { dropdownInitialized } from '../utils/dropdownInit.js';
import { renderSvg } from '../utils/svgEdit.js';
import { deepClone } from '../utils/utilsDuplikatFunction.js';

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

export function updateStylingControls(data, field) {
    let carouselSelect=globals.carouselSelect
    let accordionSelect=globals.accordionSelect
    if(data){
      const computedField = window.getComputedStyle(data);
      const idParts = data.id.split('-')
      setPaddingMarginBoxBorder(computedField)
      let stylingWebpage=['heading-text-wrapper','accordion-head-indicator-wrapper','accordion-modal-type','accordion-accordion-type',
        'accordion-carousel-styling','accordion-font-styling','font-order-list','font-unorder-list','reset-box',
        'accordion-box-field','box-width-field','box-height-field','flex-position','accordion-border-field',
        'accordion-border-wave-section','accordion-background','bg-image-styling','accordion-padding','accordion-margin','wrapper-btn-save',
      ]
      
      stylingWebpage.forEach(id=>{
        document.getElementById(id).classList.add('hidden')
      })

      // document.getElementById('border-wave-position-top').cheked = false
      // document.getElementById('border-wave-position-bottom').cheked = false

      if(idParts[0] == 'webpage'){
        let stylingWebpage=[ 
          'accordion-box-field','box-height-field','flex-position','accordion-border-field',
          'accordion-border-wave-section','accordion-background','bg-image-styling','accordion-padding',
          'accordion-margin','wrapper-btn-save'
        ]

        stylingWebpage.forEach(id=>{
          document.getElementById(id).classList.remove('hidden')
        })
        
        let fieldColor= data.style.backgroundImage || data.style.backgroundColor
        let borderColor= data.style.borderColor ?? ''

        fieldColor = getRgbArray(fieldColor)
        // console.log(data,fieldColor, data.style.backgroundColor, data.style.backgroundImage)
        if(fieldColor){
          fieldColor = rgbToHex(fieldColor[0],fieldColor[1],fieldColor[2])
        }

        borderColor = getRgbArray(borderColor)

        if(borderColor){
          borderColor = rgbToHex(borderColor[0],borderColor[1],borderColor[2])
        }

        document.getElementById('color-field-input').value = fieldColor
        document.getElementById('border-color-field').value = borderColor;

        if(data.querySelector('[id^="border-wave"]')){
          let svg = data.querySelector('[id^="border-wave"]')
          let path=svg.querySelector('path')

          let position = svg.style.cssText
          document.getElementById('btn-reset-border-wave').classList.remove('hidden')

          if(position.includes('bottom')){
            document.getElementById('border-wave-position-bottom').checked  = true
          }else{
            document.getElementById('border-wave-position-top').checked  = true
          }
          document.getElementById('border-wave-color').value=path.getAttribute('fill')
        }else{
          document.getElementById('border-wave-position-bottom').checked  = false
          document.getElementById('border-wave-position-top').checked  = false
          document.getElementById('border-wave-color').value='#ffff'
          document.getElementById('btn-reset-border-wave').classList.add('hidden')
        }

        // console.log('webpage', fieldColor)

      }else if(idParts[0] == 'field'){
        console.log('field')
        let stylingWebpage=['accordion-font-styling','font-order-list','font-unorder-list',
          'accordion-box-field','box-width-field','box-height-field','accordion-border-field','reset-box',
          'accordion-background','bg-image-styling','accordion-padding','accordion-margin','wrapper-btn-save'
        ]

        stylingWebpage.forEach(id=>{
          document.getElementById(id).classList.remove('hidden')
        })

        let fontColor
        if (field) {
          fontColor = field.getAttribute('color') ?? field.closest('font')?.getAttribute('color') ?? '';
          // console.log(fontColor);
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

        // console.log('field')

      }else if(data.id == 'heading-text'){
        let stylingWebpage=['heading-text-wrapper','accordion-font-styling','font-order-list','font-unorder-list',
          'accordion-box-field','box-width-field','box-height-field','flex-position','accordion-border-field',
          'accordion-padding','accordion-margin','wrapper-btn-save'
        ]

        stylingWebpage.forEach(id=>{
          document.getElementById(id).classList.remove('hidden')
        })
        
        let fontColor
        if (field) {
          fontColor = field.getAttribute('color') ?? field.closest('font')?.getAttribute('color') ?? '';
          // console.log(fontColor, field.closest('font'));
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

        // console.log('field')

      }else if(data.id.startsWith('video')){
        console.log('video')
        let stylingWebpage=[
          'accordion-box-field','box-width-field','accordion-margin','wrapper-btn-save'
        ]

        stylingWebpage.forEach(id=>{
          document.getElementById(id).classList.remove('hidden')
        })
      }else if(data.id.startsWith('btn-modal') || data.id.startsWith('btn-heading-accordion')){
        document.getElementById("heading-text").innerHTML = ''
        document.getElementById("heading-text").innerHTML = data.querySelector('span').innerHTML
        console.log('btn head modal accordion')
        let stylingWebpage=['heading-text-wrapper','accordion-head-indicator-wrapper',
          'accordion-font-styling','accordion-box-field','box-width-field',
          'accordion-border-field','accordion-background','bg-image-styling','accordion-padding',
          'accordion-margin','wrapper-btn-save'
        ]
        
        stylingWebpage.forEach(id=>{
          document.getElementById(id).classList.remove('hidden')
        })

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

        // console.log('btn modal')

      }else if(data.id.startsWith('parent-modal')){
        let stylingWebpage=['accordion-head-indicator-wrapper','accordion-modal-type',
          'accordion-background','bg-image-styling','wrapper-btn-save'
        ]
        
        stylingWebpage.forEach(id=>{
          document.getElementById(id).classList.remove('hidden')
        })

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

        let stylingWebpage=['accordion-box-field','box-width-field','box-height-field','accordion-border-field',
          'accordion-background','bg-image-styling','accordion-padding','accordion-margin','wrapper-btn-save'
        ]
        
        stylingWebpage.forEach(id=>{
          document.getElementById(id).classList.remove('hidden')
        })

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

        // console.log('section accordion set styling contorls')
      }else if(data.id.startsWith('carousel')){
        // console.log(carouselSelect, data,globals.carouselSelect)
        document.getElementById('add-text-carousel').textContent = carouselSelect.dataset.text === "true" ? "Remove Text" : "Add Text"
        document.getElementById('btn-text-position').textContent = carouselSelect.dataset.textPosition === "on-image" ? "On Image" : "Below Image"
        document.getElementById('btn-hide-next').textContent = carouselSelect.dataset.nextBtnHide === "true" ? "Unhide" : "Hide"
        
        let stylingWebpage=[
          'accordion-box-field','box-width-field','box-height-field','accordion-background','accordion-margin','wrapper-btn-save','accordion-border-field'
        ]
        
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
            <div id="dropdown-${item.id}" data-accordion="open" class="absolute mt-2 left-0 w-30 z-50 hidden bg-white rounded-lg shadow-sm">
              <ul class="py-2 text-sm text-gray-700">
                <li><a id="down-${item.id}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100">Move Down</a></li>
                <li><a id="up-${item.id}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 ">Move Up</a></li>
                <li><label for="bg-image-carousel" id="set-image-${item.id}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100">Set Image</label></li>
                <li><a id="reset-image-${item.id}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100">Reset Image</a></li>
                <li><a id="copy-${item.id}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100">Duplikat</a></li>
              </ul>
              <ul class="py-2 text-sm text-gray-700 border-t border-gray-500">
                <li><a id="delete-${item.id}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100">Delete</a></li>
              </ul>
            </div>
          `

          accordionCarouselStyling.querySelector('[id="edit-carousel-item-wrapping"]').parentElement.insertAdjacentHTML('afterbegin', dropdownItem)
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
        // console.log(data)
        dropdownInitialized('multi', data.id)
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
        // console.log('atas',document.getElementById('wrapper-btn-reset-bg-image'))
      }else{
        document.getElementById('wrapper-btn-reset-bg-image').classList.add('hidden')
        // console.log('bawah',document.getElementById('wrapper-btn-reset-bg-image'))
      }
    }else{
      let stylingWebpage=['heading-text-wrapper','accordion-head-indicator-wrapper','accordion-modal-type','accordion-accordion-type',
        'accordion-carousel-styling','accordion-font-styling','font-order-list','font-unorder-list',
        'accordion-box-field','box-width-field','box-height-field','flex-position','accordion-border-field',
        'accordion-border-wave-section','accordion-background','bg-image-styling','accordion-padding','accordion-margin','wrapper-btn-save'
      ]
      
      stylingWebpage.forEach(id=>{
        document.getElementById(id).classList.add('hidden')
      })
    }
}