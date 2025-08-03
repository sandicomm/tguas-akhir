import { Dropdown, Carousel, Modal } from 'flowbite';
import { Accordion, initFlowbite } from 'flowbite';

let editorCount = 0;
let sectionCount = 0;
let webPage=null
let editorFieldSelect
let editCarouselItem
let carouselSelect
let accordionPartSelect
let accordionSelect
let sectionSelect
let savedSelection = null;

function dropdownInitialized(){
  document.querySelectorAll('[data-dropdown-toggle]').forEach(toggleEl => {
    const targetId = toggleEl.getAttribute('data-dropdown-toggle');
    const targetEl = document.getElementById(targetId);

    if (targetEl && !targetEl.dataset.initialized) {
      // Inisialisasi ulang dropdown
      new Dropdown(targetEl, toggleEl, {
        placement: toggleEl.getAttribute('data-dropdown-placement') || 'bottom',
      });

      targetEl.dataset.initialized = 'true';
      console.log("dropdown initialized")
    }else{
      console.log("gagal inisialisasi dropdown")
    }
  });
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

function updateStylingControls(data) {
    const computedField = window.getComputedStyle(data);
    setPaddingMarginBoxBorder(computedField)
    const idParts = data.id.split('-')

    if(idParts[0] == 'webpage'){
      document.getElementById('accordion-font-styling').classList.add('hidden')
      document.getElementById('accordion-border-wave-section').classList.remove('hidden')
      document.getElementById('box-width-field').classList.add('hidden')
      document.getElementById('accordion-box-field').classList.remove('hidden')
      // document.getElementById('flex-position-accordion').classList.remove('hidden')
      document.getElementById('accordion-head-indicator-wrapper').classList.add('hidden')
      document.getElementById('accordion-modal-type').classList.add('hidden')
      console.log('webpage')

    }else if(idParts[0] == 'field'){
      document.getElementById('accordion-border-wave-section').classList.add('hidden')
      document.getElementById('accordion-font-styling').classList.remove('hidden')
      document.getElementById('accordion-modal-type').classList.add('hidden')
      document.getElementById('heading-text-wrapper').classList.add('hidden')
      document.getElementById('accordion-box-field').classList.remove('hidden')
      document.getElementById('box-height-field').classList.remove('hidden')
      document.getElementById('box-width-field').classList.remove('hidden')
      document.getElementById('accordion-box-field').classList.remove('hidden')
      document.getElementById('accordion-head-indicator-wrapper').classList.add('hidden')

      document.getElementById('font-color-input').value = data.dataset.fieldFontColor ?? data.dataset.fieldFontColor;
      document.getElementById('color-field-input').value = data.dataset.fieldBgColor ?? data.dataset.fieldBgColor
      document.getElementById('border-color-field').value = data.dataset.borderColor;

      if(idParts[1] == 'head' && idParts[2] == 'modal'){
        document.getElementById('accordion-box-field').classList.add('hidden')
      }

      console.log('field')

    }else if(data.id.startsWith('video')){
      document.getElementById('accordion-border-wave-section').classList.add('hidden')
      document.getElementById('accordion-modal-type').classList.add('hidden')
      document.getElementById('accordion-font-styling').classList.add('hidden')
      document.getElementById('accordion-background').classList.add('hidden')
      document.getElementById('heading-text-wrapper').classList.add('hidden')
      document.getElementById('accordion-box-field').classList.remove('hidden')
      document.getElementById('box-height-field').classList.add('hidden')
      document.getElementById('box-width-field').classList.remove('hidden')
      // document.getElementById('flex-position-accordion').classList.add('hidden')
      document.getElementById('accordion-head-indicator-wrapper').classList.add('hidden')
      console.log('video')

    }else if(data.id.startsWith('btn-modal') || data.id.startsWith('btn-heading-accordion') || data.id.startsWith('btn-collapse')){
      document.getElementById("heading-text").innerHTML = data.querySelector('span').innerHTML
      document.getElementById('accordion-head-indicator-wrapper').classList.remove('hidden')
      document.getElementById('accordion-head-indicator-wrapper').classList.add('flex')
      document.getElementById('accordion-border-wave-section').classList.add('hidden')
      document.getElementById('accordion-modal-type').classList.add('hidden')
      document.getElementById('box-width-field').classList.remove('hidden')
      document.getElementById('box-height-field').classList.add('hidden')
      document.getElementById('accordion-font-styling').classList.remove('hidden')
      document.getElementById('accordion-background').classList.remove('hidden')
      document.getElementById('accordion-box-field').classList.remove('hidden')
      
      document.getElementById('font-order-list').classList.add('hidden')
      document.getElementById('font-unorder-list').classList.add('hidden')

      document.getElementById('heading-text-wrapper').classList.remove('hidden')

      document.getElementById('font-color-input').value = data.dataset.fieldFontColor ?? data.dataset.fieldFontColor;
      document.getElementById('color-field-input').value = data.dataset.fieldBgColor ?? data.dataset.fieldBgColor
      document.getElementById('border-color-field').value = data.dataset.borderColor;

      console.log('btn modal')

    }else if(data.id.startsWith('parent-modal')){
      document.getElementById('accordion-modal-type').classList.remove('hidden')
      document.getElementById('accordion-border-wave-section').classList.add('hidden')
      document.getElementById('accordion-font-styling').classList.add('hidden')
      document.getElementById('accordion-background').classList.remove('hidden')
      document.getElementById('heading-text-wrapper').classList.add('hidden')
      document.getElementById('accordion-box-field').classList.add('hidden')
      document.getElementById('accordion-head-indicator-wrapper').classList.add('hidden')
      document.getElementById('accordion-head-indicator-wrapper').classList.remove('flex')

      document.getElementById('color-field-input').value = data.dataset.fieldBgColor ?? data.dataset.fieldBgColor
      document.getElementById('border-color-field').value = data.dataset.borderColor;

    }else if(data.id.startsWith('body-accordion')){
      document.getElementById('accordion-modal-type').classList.add('hidden')
      document.getElementById('heading-text-wrapper').classList.add('hidden')
      document.getElementById('accordion-head-indicator-wrapper').classList.add('hidden')
      document.getElementById('accordion-border-wave-section').classList.add('hidden')
      document.getElementById('accordion-font-styling').classList.add('hidden')

    }else if(data.id.startsWith('carousel-element')){

      document.getElementById('accordion-border-field').classList.add('hidden')
      document.getElementById('accordion-border-wave-section').classList.add('hidden')
      document.getElementById('bg-image-styling').classList.add('hidden')
      document.getElementById('accordion-font-styling').classList.remove('hidden')
      document.getElementById('accordion-padding').classList.add('hidden')
      
      let itemCarousel=""
      let i =0
      data.querySelectorAll('[id^="item-carousel"]').forEach(item =>{
        i++
        let style
        if(carouselSelect.dataset.textPosition === 'on image'){
          style = item.getAttribute('style')
        }else{
          style = `background-image:url("${item.querySelector('img').getAttribute('src')}");background-size:cover;background-position:center;`
        }
        let itemWrapped =`
            <div id="edit-${item.id}" data-item-order="${item.dataset.itemOrder}" class="mb-2 relative h-auto aspect-[4/3]" style='${style}'>
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
                </ul>
                <ul class="py-2 text-sm text-gray-700 border-t border-gray-500">
                  <li><a id="delete-${item.id}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100">Delete</a></li>
                </ul>
              </div>
            </div>`

        itemCarousel += itemWrapped
        // console.log('item carousel:',itemWrapped)
      })
      
      let addItemCarousel = document.querySelector('[id^="add-item"]')
      addItemCarousel.id = `add-item-${data.id}`

      let accordionCarouselStyling = document.getElementById('accordion-carousel-styling')
      accordionCarouselStyling.classList.remove('hidden')
      
      accordionCarouselStyling.querySelector('[id="carousel-item-wrapping"]').dataset.itemCount = data.querySelector('[id^="element-carousel-"]').dataset.itemCount
      accordionCarouselStyling.querySelector('[id="carousel-item-wrapping"]').innerHTML = itemCarousel
      dropdownInitialized()
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

    let rgbArray;

    if (rgba.includes('rgba')) {
      rgbArray = rgba.split('rgba(')[1].split(')')[0].split(',');
    } else if (rgba.includes('rgb')) {
      rgbArray = rgba.split('rgb(')[1].split(')')[0].split(',');
    }

    const r = parseInt(rgbArray[0].trim());
    const g = parseInt(rgbArray[1].trim());
    const b = parseInt(rgbArray[2].trim());
    const a = parseFloat(rgbArray[3] ? rgbArray[3].trim() : 1);

    document.getElementById('bg-color-opacity').value = a;

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
        fontSizeValue = data.dataset.fieldFontSize;
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
      console.log('field change: ', editorFieldSelect)
      updateStylingControls(editorFieldSelect);
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

  document.querySelectorAll('[id^="btn-collapse-"]').forEach(btnCollapse =>{
    btnCollapse.addEventListener('click', function(){
      editorFieldSelect = btnCollapse
      accordionSelect =null
      carouselSelect = null
      updateStylingControls(editorFieldSelect)
      console.log('btn collapse', editorFieldSelect)
    })
  })

  document.querySelectorAll('[id^="element-collapse-"]').forEach(elementCollapse =>{
    elementCollapse.addEventListener('click', function(e){
      if(e.target.id.startsWith('element-collapse-')){
        editorFieldSelect = elementCollapse
        accordionSelect =null
        carouselSelect = null
        updateStylingControls(editorFieldSelect)
        console.log('element collapse:', editorFieldSelect)
      }
    })
  })

  document.querySelectorAll('[id^="carousel-element-"]').forEach(carouselElement =>{
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
      }
    });
  });

  document.querySelectorAll("[id^='btn-heading-accordion']").forEach(headAccordion => {
    headAccordion.addEventListener('click', function(event){
      const idParts = headAccordion.id.split('-')
      if(event.target.id.startsWith('btn-heading-accordion') || event.target.parentElement.id.startsWith('btn-heading-accordion')){
        editorFieldSelect = headAccordion
        carouselSelect = null
        accordionSelect = document.getElementById(idParts.slice(2,idParts.length-1).join('-'))
        console.log('accordion heading clicked: ',editorFieldSelect, accordionSelect);
        updateStylingControls(editorFieldSelect)
      }
    })
  })

  document.querySelectorAll("[id^='body-accordion-']").forEach(bodyAccordion => {
    bodyAccordion.addEventListener('click', function(event){
      event.stopPropagation()
      const idParts = bodyAccordion.id.split('-')
      // console.log('body click', bodyAccordion, event.target.id)
      if(event.target.id.startsWith('body-accordion-') || event.target.parentElement.id.startsWith('body-accordion-')){
        editorFieldSelect = bodyAccordion
        carouselSelect = null
        accordionSelect = document.getElementById(idParts.slice(1,idParts.length-1).join('-'))
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


// ===================== FIELD =========================
// ------- Font Styling --------
function fontStylingField(){
  document.getElementById('heading-text').addEventListener('keyup', function () {
    console.log(this.textContent)
    editorFieldSelect.querySelector('span').innerHTML = this.innerHTML;
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

    }else{
      console.log('not range')
    }

    if(!fontField.id.startsWith('field-')){
      editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
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

    }else{
       console.log('not range')
    }

    if(!fontField.id.startsWith('field-')){
      editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
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

    }else{
       console.log('not range')
    }

    if(!fontField.id.startsWith('field-')){
      editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
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

    }else{
       console.log('not range')
    }

    if(!fontField.id.startsWith('field-')){
      editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
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
        console.log('no accordion')
      }else if(editorFieldSelect.id.startsWith('btn-collapse-') || editorFieldSelect.id.startsWith('element-collapse-')){
        editorFieldSelect.parentElement.parentElement.style.width=`${this.value}px`
        console.log('collapse')
      }else{
        console.log('another', editorFieldSelect.id)
        editorFieldSelect.style.width=`${this.value}px`
      }
    }else if(carouselSelect){
      carouselSelect.style.width=`${this.value}px`
    }
  })

  document.getElementById('height-field').addEventListener('keyup', function(){
    if(editorFieldSelect){
      editorFieldSelect.style.minHeight=`${this.value}px`
    }else if(carouselSelect){
      carouselSelect.style.height=`${this.value}px`
    }
  })

  // document.getElementById('flex-field-position').addEventListener('change', function(e){
  //   editorFieldSelect.style.display="flex"
    
  //   let fieldInner = editorFieldSelect.innerHTML
  //   let fieldEditor

  //   if(editorFieldSelect.id.startsWith('field-') || editorFieldSelect.id.startsWith('webpage-section-')){
  //     console.log('hella')
  //     fieldEditor = editorFieldSelect
  //   }else{
  //     console.log('hello: ', editorFieldSelect)
  //     fieldEditor = accordionPartSelect.querySelector('span')
  //     fieldEditor.style.display="flex"
  //   }

  //   if(!editorFieldSelect.querySelector('[id="flex-wrapper"]')){
  //     console.log('span')

  //     if(editorFieldSelect.id.startsWith('webpage-section-')){
  //       const sectionNumber = editorFieldSelect.id.split('-')[2];
  //       const editorContainer = document.getElementById(`editor-container-section-${sectionNumber}`);

  //       // Buat wrapper span
  //       const wrapperSpan = document.createElement('span');
  //       wrapperSpan.classList.add('break-all');
  //       wrapperSpan.id="flex-wrapper"

  //       // Buat wrapper div
  //       const wrapperDiv = document.createElement('div');

  //       // Pindahkan isi editorContainer ke wrapperDiv (atau editorContainer itu sendiri)
  //       wrapperDiv.appendChild(editorContainer); // Ini akan memindahkan elemen, bukan clone

  //       // Masukkan ke wrapperSpan
  //       wrapperSpan.appendChild(wrapperDiv);

  //       // Kosongkan isi dulu jika ingin menggantikan
        

  //       // Tambahkan ke editorFieldSelect
  //       editorFieldSelect.appendChild(wrapperSpan);

  //       console.log('flex pos section');
  //     }else{
  //       editorFieldSelect.innerHTML= `<span id="flex-wrapper" class="break-all"><div>${fieldInner}</div></span>`
  //       console.log('flex pos field')
  //     }
  //   }

  //   console.log('field editor: ',fieldEditor)

  //   if(e.target.value == 'top'){
  //     fieldEditor.dataset.fieldFlexPosition = 'top'
  //     fieldEditor.style.justifyContent="start"
  //     fieldEditor.style.flexDirection="column"
  //     fieldEditor.style.alignItems="center"

  //   }else if(e.target.value == 'top-l'){
  //     fieldEditor.dataset.fieldFlexPosition = 'top-l'
  //     fieldEditor.style.justifyContent="start"
  //     fieldEditor.style.flexDirection="column"
  //     fieldEditor.style.alignItems="start"

  //   }else if(e.target.value == 'top-r'){
  //     fieldEditor.dataset.fieldFlexPosition = 'top-r'
  //     fieldEditor.style.justifyContent="start"
  //     fieldEditor.style.flexDirection="column"
  //     fieldEditor.style.alignItems="end"

  //   }else if(e.target.value == 'center'){
  //     fieldEditor.dataset.fieldFlexPosition = 'center'
  //     fieldEditor.style.justifyContent="center"
  //     fieldEditor.style.flexDirection="column"
  //     fieldEditor.style.alignItems="center"

  //   }else if(e.target.value == 'center-l'){
  //     fieldEditor.dataset.fieldFlexPosition = 'center-l'
  //     fieldEditor.style.justifyContent="center"
  //     fieldEditor.style.flexDirection="column"
  //     fieldEditor.style.alignItems="start"

  //   }else if(e.target.value == 'center-r'){
  //     fieldEditor.dataset.fieldFlexPosition = 'center-r'
  //     fieldEditor.style.justifyContent="center"
  //     fieldEditor.style.flexDirection="column"
  //     fieldEditor.style.alignItems="end"

  //   }else if(e.target.value == 'bottom'){
  //     fieldEditor.dataset.fieldFlexPosition = 'bottom'
  //     fieldEditor.style.justifyContent="end"
  //     fieldEditor.style.flexDirection="column"
  //     fieldEditor.style.alignItems="center"

  //   }else if(e.target.value == 'bottom-l'){
  //     fieldEditor.dataset.fieldFlexPosition = 'bottom-l'
  //     fieldEditor.style.justifyContent="end"
  //     fieldEditor.style.flexDirection="column"
  //     fieldEditor.style.alignItems="start"

  //   }else if(e.target.value == 'bottom-r'){
  //     fieldEditor.dataset.fieldFlexPosition = 'bottom-r'
  //     fieldEditor.style.justifyContent="end"
  //     fieldEditor.style.flexDirection="column"
  //     fieldEditor.style.alignItems="end"

  //   }else if(e.target.value == 'default'){
  //     fieldEditor.dataset.fieldFlexPosition = 'deafult'
  //     fieldEditor.style.justifyContent=""
  //     fieldEditor.style.flexDirection=""
  //     fieldEditor.style.alignItems=""
  //     fieldEditor.style.display="block"
      
  //     if(editorFieldSelect.querySelector('[id="flex-wrapper"]')){
  //       const span = editorFieldSelect.querySelector('[id="flex-wrapper"]');
  
  //       if (span) {
  //         // Ambil anak-anak span
  //         const children = Array.from(span.childNodes); // bisa node apapun (div, text, dsb)
  //         span.remove(); // hapus elemen wrapper

  //         children.forEach(child => {
  //           if (fieldEditor.id.startsWith('webpage-section-')) {
  //             fieldEditor.appendChild(child); // tambahkan di akhir
  //           } else {
  //             fieldEditor.innerHTML = ""; // kosongkan dulu
  //             fieldEditor.appendChild(child);
  //           }
  //         });
  //       }
  //     }
  //   }
    

  //   // accordionPartSelect.querySelector('span').innerHTML = document.getElementById('heading-text').innerHTML;
  // })
}
// -------- Border -----------
function borderField(){
  document.getElementById('border-field').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderWidth=`${this.value}px`
    }else{
      editorFieldSelect.style.borderWidth=`${this.value}px`
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
    }else{
      editorFieldSelect.setAttribute('data-border-color', this.value)
      editorFieldSelect.style.borderColor=`${this.value}`
    }
  })

  document.getElementById('border-field-top').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderTopWidth=`${this.value}px`
    }else{
      editorFieldSelect.style.borderTopWidth=`${this.value}px`
    }
  })

  document.getElementById('border-field-right').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderRightWidth=`${this.value}px`
    }else{
      editorFieldSelect.style.borderRightWidth=`${this.value}px`
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
    }else{
      editorFieldSelect.style.borderBottomWidth=`${this.value}px`
    }
  })

  document.getElementById('border-field-rounded').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderRadius=`${this.value}px`
    }else{
      editorFieldSelect.style.borderRadius=`${this.value}px`
    }

    document.getElementById('border-field-rounded-top-left').value=this.value
    document.getElementById('border-field-rounded-bottom-right').value=this.value
    document.getElementById('border-field-rounded-top-right').value=this.value
    document.getElementById('border-field-rounded-bottom-left').value=this.value
  })

  document.getElementById('border-field-rounded-top-right').addEventListener('change', function(){
   if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderTopRightRadius=`${this.value}px`
    }else{
      editorFieldSelect.style.borderTopRightRadius=`${this.value}px`
    }
  })

  document.getElementById('border-field-rounded-top-left').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderTopLeftRadius=`${this.value}px`
    }else{
      editorFieldSelect.style.borderTopLeftRadius=`${this.value}px`
    }
  })

  document.getElementById('border-field-rounded-bottom-right').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderBottomRightRadius=`${this.value}px`
    }else{
      editorFieldSelect.style.borderBottomRightRadius=`${this.value}px`
    }
  })

  document.getElementById('border-field-rounded-bottom-left').addEventListener('change', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderBottomLeftRadius=`${this.value}px`
    }else{
      editorFieldSelect.style.borderBottomLeftRadius=`${this.value}px`
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
    }else{
      editorFieldSelect.style.paddingLeft=`${this.value}px`
      editorFieldSelect.style.paddingRight=`${this.value}px`
      editorFieldSelect.style.paddingTop=`${this.value}px`
      editorFieldSelect.style.paddingBottom=`${this.value}px`
    }

    document.getElementById('padding-field-left').value=this.value
    document.getElementById('padding-field-right').value=this.value
    document.getElementById('padding-field-top').value=this.value
    document.getElementById('padding-field-bottom').value=this.value
  })

  document.getElementById('padding-field-left').addEventListener('keyup', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.paddingLeft=`${this.value}px`
    }else{
      editorFieldSelect.style.paddingLeft=`${this.value}px`
    }
  })

  document.getElementById('padding-field-right').addEventListener('keyup', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.paddingRight=`${this.value}px`
    }else{
      editorFieldSelect.style.paddingRight=`${this.value}px`
    }
  })

  document.getElementById('padding-field-top').addEventListener('keyup', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.paddingTop=`${this.value}px`
    }else{
      editorFieldSelect.style.paddingTop=`${this.value}px`
    }
  })

  document.getElementById('padding-field-bottom').addEventListener('keyup', function(){
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.paddingBottom=`${this.value}px`
    }else{
      editorFieldSelect.style.paddingBottom=`${this.value}px`
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
      }else{
        editorFieldSelect.style.marginLeft=`${this.value}px`
        editorFieldSelect.style.marginRight=`${this.value}px`
        editorFieldSelect.style.marginTop=`${this.value}px`
        editorFieldSelect.style.marginBottom=`${this.value}px`
      }
    }else if(carouselSelect){
      carouselSelect.style.marginLeft=`${this.value}px`
      carouselSelect.style.marginRight=`${this.value}px`
      carouselSelect.style.marginTop=`${this.value}px`
      carouselSelect.style.marginBottom=`${this.value}px`
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
      }else{
        editorFieldSelect.style.marginLeft=`${this.value}px`
      }
    }else if(carouselSelect){
      carouselSelect.style.marginLeft=`${this.value}px`      
    }
  })

  document.getElementById('margin-field-right').addEventListener('keyup', function(){
    if(editorFieldSelect){
      if(editorFieldSelect.id === 'heading-text'){
        accordionPartSelect.style.marginRight=`${this.value}px`
      }else{
        editorFieldSelect.style.marginRight=`${this.value}px`
      }
    }else if(carouselSelect){
      carouselSelect.style.marginRight=`${this.value}px`
    }
  })

  document.getElementById('margin-field-top').addEventListener('keyup', function(){
    if(editorFieldSelect){
      if(editorFieldSelect.id === 'heading-text'){
        accordionPartSelect.style.marginTop=`${this.value}px`
      }else{
        editorFieldSelect.style.marginTop=`${this.value}px`
      }
    }else if(carouselSelect){
      carouselSelect.style.marginTop=`${this.value}px`
    }
  })

  document.getElementById('margin-field-bottom').addEventListener('keyup', function(){
    if(editorFieldSelect){
      if(editorFieldSelect.id === 'heading-text'){
        accordionPartSelect.style.marginBottom=`${this.value}px`
      }else{
        editorFieldSelect.style.marginBottom=`${this.value}px`
      }
    }else if(carouselSelect){
      carouselSelect.style.marginBottom=`${this.value}px`
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

    if(fieldEditor.id.startsWith('carousel-element')){
      fieldEditor.dataset.fieldBgColor = this.value;
      fieldEditor.querySelectorAll('[id^="item-carousel-"]').forEach(item =>{
        if(fieldEditor.dataset.textPosition === 'on image'){
          item.style.backgroundImage = `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})), url(${item.style.backgroundImage.split('url(')[1].split(')')[0]})`;
        }else{
          item.children[1].style.backgroundColor=`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        }
      })

      if(fieldEditor.dataset.textPosition === 'on image'){
        document.querySelectorAll('[id^="edit-item-carousel-"]').forEach(item =>{
          item.style.backgroundImage = `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})), url(${item.style.backgroundImage.split('url(')[1].split(')')[0]})`;
        })
      }
    }else{
      if(fieldEditor.style.backgroundImage){
        fieldEditor.style.backgroundImage = `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})), url(${fieldEditor.style.backgroundImage.split('url(')[1].split(')')[0]})`;
      }else{
        fieldEditor.style.backgroundColor=`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      }
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
    
    if(fieldEditor.id.startsWith('carousel-element')){
      fieldEditor.querySelectorAll('[id^="item-carousel-"]').forEach(item =>{
        if(fieldEditor.dataset.textPosition ==="on image"){
          item.style.backgroundImage = `
              linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value}), 
              rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})), 
              url(${item.style.backgroundImage.split('url(')[1].split(')')[0]})`;

        }else{
          item.children[1].style.backgroundColor=`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})`;
        }
      })
      if(fieldEditor.dataset.textPosition === "on image"){
        document.querySelectorAll('[id^="edit-item-carousel-"]').forEach(item =>{
          item.style.backgroundImage = `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})), url(${item.style.backgroundImage.split('url(')[1].split(')')[0]})`;
        })
      }

    }else{
      if(fieldEditor.style.backgroundImage){
        fieldEditor.style.backgroundImage = `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})), url(${fieldEditor.style.backgroundImage.split('url(')[1].split(')')[0]})`;
      }else{
        fieldEditor.style.backgroundColor=`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})`;
      }
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

        if (fieldEditor.style.backgroundColor) {
          const rgb = fieldEditor.style.backgroundColor;
          fieldEditor.style.backgroundImage = `linear-gradient(${rgb}, ${rgb}), url('${e.target.result}')`;
        } else if (fieldEditor.style.backgroundImage.includes('linear-gradient')) {
          const rgba = fieldEditor.style.backgroundImage.split('linear-gradient(')[1].split(')')[0];
          fieldEditor.style.backgroundImage = `linear-gradient(${rgba}), url("${e.target.result}")`;
        } else {
          fieldEditor.style.backgroundImage = `url('${e.target.result}')`;
        }

        document.getElementById('btn-reset-bg-image').parentElement.classList.remove('hidden')

        fieldEditor.style.backgroundSize = 'cover';
        fieldEditor.style.backgroundPosition = 'center';
      };
      reader.readAsDataURL(file);
    } else {
      previewImageField.src = '';
      previewImageField.classList.add('hidden');
      alert('Please select a valid image file.');
    }
  });

  document.getElementById('bg-image-carousel').addEventListener('change', function (e) {
    const file = this.files[0];
    const maxFileSize = 500 * 1024; // 500 KB
    
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
        const imgUrl = `url(${e.target.result})`;

        // Default/fallback rgba
        let rgba = 'rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)';

        // Coba parsing kalau sebelumnya ada nilai
        const currentBg = editCarouselItem.getAttribute('style');
        if (currentBg.includes('linear-gradient(')) {
          try {
            rgba = currentBg
              .split('linear-gradient(')[1]
              .split(')')[0]
              .trim();
          } catch (err) {
            console.warn('Failed to parse gradient, using default.');
          }
        }

        const bgValue = `linear-gradient(${rgba})), ${imgUrl}`;

        // Terapkan ke keduanya
        [editCarouselItem, carouselItem].forEach(el => {
          el.setAttribute('style', `background-image:${bgValue};background-size:cover;background-position:center;`)
        });

        console.log('Updated backgroundImage:', bgValue);
      };

      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file.');
    }
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
    })
  })

  document.getElementById("btn-reset-bg-image").addEventListener('click', function(event){
    let fieldEditor;

    if (editorFieldSelect && editorFieldSelect.id === 'heading-text') {
      fieldEditor = accordionPartSelect;
    } else {
      fieldEditor = editorFieldSelect;
    }

    // Reset background image
    if (fieldEditor) {
      // Jika sebelumnya pakai linear-gradient + image, kita hanya reset image-nya
      if (fieldEditor.style.backgroundImage.includes('url')) {
        const linearPart = fieldEditor.style.backgroundImage.includes('linear-gradient')
          ? fieldEditor.style.backgroundImage.split(', url')[0] + ')'
          : '';
        fieldEditor.style.backgroundImage = linearPart;
      } else {
        fieldEditor.style.backgroundImage = '';
      }

      // Optional: reset background size & position jika tidak lagi diperlukan
      fieldEditor.style.backgroundSize = '';
      fieldEditor.style.backgroundPosition = '';

      // Hapus data atribut
      delete fieldEditor.dataset.nameBg;
    }

    // Reset preview image
    const previewImageField = document.getElementById('field-preview-image');
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

  const applyColorToSVG = (svg, color) => {
    if (!svg) return;
    svg.querySelectorAll('path').forEach(path => {
      path.setAttribute('fill', color);
    });
  };

  const getClonedSVG = (waveId, position) => {
    let svg;

    if (waveId) {
      svg = document.querySelector(`#type-${waveId}`);
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

    if (position === 'top') {
      flipPathVertically(svgClone);
    }

    applyColorToSVG(svgClone, currentWaveColor);
    return svgClone;
  };

  function flipPathVertically(svgElement) {
    const viewBox = svgElement.getAttribute('viewBox'); // contoh: "0 0 1440 320"
    if (!viewBox) return;

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

    // Tambahkan SVG baru dengan warna yang sesuai
    editorFieldSelect.appendChild(svgClone);
  };

  // Event saat tipe wave diklik
  document.querySelectorAll("[id^='border-wave-type-']").forEach(tipe => {
    tipe.addEventListener('click', function () {
      idWave = this.id.split('-')[3];

      const selectedWavePosition = document.querySelector('input[name="border-wave-position"]:checked');
      const position = selectedWavePosition ? selectedWavePosition.value : 'bottom';

      updateSectionWithWave(idWave, position);
    });
  });

  // Event saat posisi wave (radio) diganti
  document.querySelectorAll("[name='border-wave-position']").forEach(radio => {
    radio.addEventListener('change', function () {
        updateSectionWithWave(idWave, this.value);
    });
  });

  // Event saat warna wave diubah
  document.getElementById('border-wave-color').addEventListener('change', function () {
    currentWaveColor = this.value;
    editorFieldSelect.querySelectorAll('svg').forEach(svg => {
      if(!svg.id.startsWith('btn')){
        console.log(svg)
        applyColorToSVG(svg, currentWaveColor);
      }
    });
  });

  const sanitizeSVG = (svgText) => {
    // Buang semua tag <script> dan atribut event (onload, onclick, dll.)
    return svgText
      .replace(/<script.*?>.*?<\/script>/gi, '')
      .replace(/\son\w+=".*?"/gi, '');
  }

  document.getElementById('apply-border-wave-svg').addEventListener('click', function () {
    idWave = null; // Reset idWave saat menggunakan SVG kustom
    const svgText = sanitizeSVG(document.getElementById('border-wave-svg').value);
    editorFieldSelect.querySelectorAll('svg').forEach(svg => svg.remove());

    const wrapper = document.createElement('div');
    wrapper.innerHTML = svgText;
    const svgElement = wrapper.querySelector('svg');

    const position = document.querySelector('input[name="border-wave-position"]:checked')?.value || 'bottom';

    if (svgElement) {
      svgElement.style.position = 'absolute';
      svgElement.style.zIndex = 9;
      svgElement.style[position] = '0';

      if (position === 'top') {
        flipPathVertically(svgElement);
      }
      applyColorToSVG(svgElement, currentWaveColor);
      editorFieldSelect.appendChild(svgElement);
    } else {
      alert('SVG tidak valid!');
    }
  });
}

// ======================= ACCORDION ==========================
function accordionStyling(){
  document.getElementById('head-indicator-type').addEventListener('change', function(){
    if(accordionSelect){
      accordionSelect.querySelectorAll('[id^="btn-heading-"]').forEach(head =>{
        let spanHead = head.querySelector('span')
        if(spanHead.nextElementSibling){
          spanHead.nextElementSibling.remove()
        }
        let indicator 
        
        if(this.value === 'default'){
          indicator =`
            <svg data-accordion-icon class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
            </svg>
          `
        }else if(this.value === 'icon'){
          indicator =`<div data-accordion-icon >&#11163;</div>`
        }else if(this.value === 'question'){
          indicator = `<div class="btn-cta">
                        <p>?</p>
                      </div>`
        }
  
        if(this.value !== 'none'){
          spanHead.insertAdjacentHTML('afterend', indicator)
        }
  
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
      if (editorFieldSelect.childNodes.length > 1) {
        const node = editorFieldSelect.childNodes[editorFieldSelect.childNodes.length -1];
        if (node.nodeType === Node.ELEMENT_NODE) {
          editorFieldSelect.removeChild(node);
        }
      }
      
      let indicator 
      
      if(this.value === 'default'){
        indicator =`
          <svg class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
          </svg>
        `
      }else if(this.value === 'icon'){
        indicator =`<div>&#11163;</div>`
      }else if(this.value === 'question'){
        indicator = `<div class="btn-cta">
                      <p>?</p>
                    </div>`
      }

      if(this.value !== 'none'){
        editorFieldSelect.insertAdjacentHTML('beforeend', indicator)
      }
    }
  })
}

// ======================== BODY MODAL ========================
function modalTypeStyling(){
  document.getElementById('modal-type').addEventListener('change', function(){
    if(this.value === 'default'){
      editorFieldSelect.parentElement.removeAttribute('data-modal-backdrop')
    }else{
      editorFieldSelect.parentElement.setAttribute('data-modal-backdrop', 'static')
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

// ======================== INITIALIZED =======================

const collapseHandlers = new Map();

function collapseInitialized() {
  document.querySelectorAll('[data-target^="#element-collapse-"]').forEach(btn => {
    const existingHandler = collapseHandlers.get(btn);

    // Hapus handler lama jika ada
    if (existingHandler) {
      btn.removeEventListener('click', existingHandler);
    }

    // Buat handler baru
    const handler = function (e) {
      if (btn.id === e.target.id) {
        e.preventDefault();
        const targetSelector = this.dataset.target;
        const target = document.querySelector(targetSelector);
        if (target) {
          target.classList.toggle('hidden');
          console.log('toggle hidden:', target);
        }
      }
    };

    // Simpan dan pasang handler
    collapseHandlers.set(btn, handler);
    btn.addEventListener('click', handler);
  });
}

if(!webPage){
  sectionCount = 1
  let firstSection = `
      <div id="webpage-section-1" data-section-order="1" class="bg-gray-200 relative flex flex-col justify-center items-center border border-gray-700" style="min-height:100dvh;">     
        <div class="absolute right-1 top-1 z-30 cursor-pointer" data-dropdown-toggle="dropdown-section-1" data-dropdown-placement="right-end">
            <svg id="btn-add-section-elemen" class="w-7 h-7 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
            </svg>                  
        </div>

        <div id="dropdown-section-1" data-accordion="open" class="z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-0 border-b-1 border-gray-500 " aria-labelledby="dropdownDefaultButton">
                <li>
                    <a id="add-section-1" class="font-bold block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Section</a>
                </li>
                <li>
                    <a id="delete-section-1" class="font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete Section</a>
                </li>
            </ul>
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li>
                    <a id="add-field-element-section-1" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
                </li>
                <li>
                    <a id="add-video-element-section-1" class=" block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Video</a>
                </li>
                <li>
                    <a id="add-modal-element-section-1" class=" block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modal</a>
                </li>
                <li>
                    <a id="add-accordion-element-section-1" class=" block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Accordion</a>
                </li>
                <li>
                    <a id="add-collapse-element-section-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Collapse Button</a>
                </li>
                <li>
                    <a id="add-carousel-element-section-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
                </li>
            </ul>
        </div>
        
        <div id="editor-container-section-1" class="p-8 w-full flex flex-col flex-1" style="justify-content:start;align-items:center;"></div>
    </div>
  `;
  document.getElementById('webpage').insertAdjacentHTML('beforeend', firstSection)
  editorFieldSelect = document.querySelector(`[id^='webpage-section-1-']`);
}else{
  sectionCount = webPage.length
}

document.getElementById('default-sidebar').addEventListener('click', function (event) {
  // console.log(event.target)
  const idParts = event.target.id.split('-')
  let actualBodyItem
  let actualField
  let bodyItem

  if(event.target.id.startsWith('set-image-item')){
    editCarouselItem = document.getElementById(`edit-${idParts.slice(2,idParts.length).join('-')}`)
    bodyItem = editCarouselItem.parentElement.parentElement
    console.log('edit item carousel:',editCarouselItem)
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
    if(carouselSelect.dataset.textPosition === 'on image'){
      rgba = itemCarousel.style.backgroundImage.split('rgba(')[1].split(')')[0]
    }else{
      rgba = 0,0,0,0.0
    }

    const newItemId = `item-${idSuffix}-${newItemCount}`;
    
    let itemContent =''
    let classList = itemCarousel.classList
    if(carouselSelect.dataset.text === "true"){
      if(carouselSelect.dataset.textPosition === "on image"){
        itemContent = `
        <div id="field-${newItemId}" class="border border-b-1 border-gray-500 p-1 max-w-[100%] break-all scroll-hidden overflow-scroll" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" contenteditable="true"></div>
        `
        console.log('on image')
      }else{
        let copyItem = itemCarousel.cloneNode(true)
        copyItem.querySelector('img').setAttribute('src', '/assets/img/almond1.jpg')
        copyItem.children[1].innerHTML = `
        <div id="field-${newItemId}" class="border border-b-1 border-gray-500 p-1 max-w-[100%] break-all scroll-hidden overflow-scroll" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" contenteditable="true"></div>
        `
        itemContent= copyItem.innerHTML
        classList = copyItem.classList
      }
    }

    let style
    if(carouselSelect.dataset.textPosition === "on image"){
      style = `style="background-image: linear-gradient(rgba(${rgba})), url(/assets/img/almond1.jpg); background-size: cover; background-position: center;"`
    }else{
      style=''
    }
    
    let newItem = `
    <div id="${newItemId}"
      data-item-order="${newItemCount}"
      class="${classList}"
      ${style}
      data-carousel-item>
      ${itemContent}
    </div>
    `
    itemCarouselWrapper.children[0].insertAdjacentHTML('beforeend', newItem);

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

    if(carouselSelect.dataset.text === 'false' ){
      carouselSelect.querySelectorAll('[id^="item-carousel-"]').forEach(item=>{
        if(carouselSelect.dataset.textPosition === 'on image'){
          item.innerHTML=`
          <div id="field-${item.id}" class="border border-b-1 border-gray-500 p-1 max-w-[100%] break-all scroll-hidden overflow-scroll" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" contenteditable="true"></div>
          `
        }else{
          let img = item.querySelector('img').getAttribute('src') 
          item.setAttribute('style', `background-image:linear-gradient(rgba(0,0,0,0.0)), url("${img}");background-size:cover;background-position:center;`)
          console.log('resset caraousel')
          item.innerHTML =item.querySelector('[id^="field-"]').outerHTML
        }
      })
        carouselSelect.dataset.text = "true"
    }else{
      carouselSelect.querySelectorAll('[id^="item-carousel-"]').forEach(item=>{
        if(carouselSelect.dataset.textPosition !== 'on image'){
          let img = item.querySelector('img').getAttribute('src') 
          item.setAttribute('style', `background-image:linear-gradient(rgba(0,0,0,0.0)), url("${img}");background-size:cover;background-position:center;`)
        }
        item.innerHTML =''
      })
      carouselSelect.dataset.textPosition = 'on image'
      carouselSelect.dataset.text = "false"
    }

    btnAddText.dataset.text = btnAddText.dataset.text == "add" ? "remove" : "add"
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
    btnHide.textContent = btnHide.textContent == "Hide" ? "Unhide" : "Hide"
    btnHide.dataset.hide = btnHide.dataset.hide == "unhide" ? "hide" : "unhide"
  }

  if(event.target.id.startsWith("btn-text-position") && carouselSelect.dataset.text === 'true'){
    carouselSelect.querySelectorAll('[id^="item-carousel-"]').forEach(item=>{
      let img
      const imgWrapper = document.createElement('div')
      const newImg = document.createElement('img')

      if(carouselSelect.dataset.textPosition === "on image"){
        img = item.getAttribute('style')  
        
        item.setAttribute('style', '')
        let rawUrl = img.split('url(')[1].split(')')[0]
        let imgUrl = rawUrl.replace(/^['"]|['"]$/g, '');

        imgWrapper.setAttribute('style', 'height:30%;width:100%;')
        newImg.setAttribute('src', imgUrl)
        newImg.setAttribute('style', 'width;100%;')
        
        imgWrapper.appendChild(newImg)
        let newText = `
          ${imgWrapper.outerHTML}
          <div class="flex justify-center items-start h-full bg-gray-400 w-full px-9 py-5">
            ${item.querySelector('[id^="field-"]').outerHTML}
          </div>
        `
        item.innerHTML =''
        item.insertAdjacentHTML('beforeend', newText)
        item.classList.add('flex-col')

      }else{
        img = item.querySelector('img').getAttribute('src') 
        item.setAttribute('style', `background-image:linear-gradient(rgba(0,0,0,0.0)), url("${img}");background-size:cover;background-position:center;`)
        item.innerHTML =item.querySelector('[id^="field-"]').outerHTML
      }
    })

    carouselSelect.dataset.textPosition = carouselSelect.dataset.textPosition == 'on image' ? 'below image' : 'on image' 
    const btnPosition = event.target
    btnPosition.textContent = btnPosition.textContent == "On Image" ? "Below Image" : "On Image"
  }


  if(idParts[1] === 'item' && idParts[0] != 'add'){
    editCarouselItem = document.getElementById(`edit-${idParts.slice(1, idParts.length).join('-')}`);
    bodyItem = editCarouselItem.parentElement.parentElement

    actualField = document.getElementById(`${idParts.slice(1, idParts.length).join('-')}`)
    actualBodyItem = actualField.parentElement.parentElement
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
    const targetOrder = parseInt(actualField.dataset.itemOrder);

    // Hapus indikator yang sesuai dan update urutan slide-to lainnya
    Array.from(indicatorWrapper.children).forEach((indicator) => {
      const slideTo = parseInt(indicator.dataset.carouselSlideTo);
      if (slideTo === targetOrder-1) {
        indicator.remove();
        console.log('indicator remove', slideTo, targetOrder)
      } else if (slideTo > targetOrder-1) {
        indicator.dataset.carouselSlideTo = slideTo - 1;
        console.log('indicator no remove', slideTo, targetOrder)
      }
    });

    // Update itemCount jika item yang dihapus adalah yang terakhir
    if (parseInt(actualBodyItem.dataset.itemCount) === targetOrder) {
      actualBodyItem.dataset.itemCount = targetOrder - 1;
      console.log('carousel item delete');
    }

    editCarouselItem.remove();
    actualField.remove();

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
  console.log(event.target,id)
  // =================== ADD ELEMENT ==========================

  if (id.startsWith('add-section-')) {
    const idParts = event.target.id.split('-');
    console.log(`add-section webpage-${idParts.slice(1,3).join('-')}`, sectionCount)
    sectionCount++;

    const section = document.getElementById(`webpage-${idParts.slice(1,3).join('-')}`)
    let sectionOrder = parseInt(section.dataset.sectionOrder)

     let newSection =`
        <div id="webpage-section-${sectionCount}" data-section-order="${sectionOrder+1}" class="bg-gray-200 relative flex flex-col justify-center items-center border border-gray-700" style="min-height:100dvh;">
          <div class="absolute right-1 top-1 z-50 cursor-pointer" data-dropdown-toggle="dropdown-section-${sectionCount}" data-dropdown-placement="right-end">
              <svg class="w-7 h-7 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                  <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
              </svg>                  
          </div>

          <div id="dropdown-section-${sectionCount}" data-accordion="open" class="z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-0 border-b-1 border-gray-500 " aria-labelledby="dropdownDefaultButton">
                <li>
                    <a id="add-section-${sectionCount}" class="font-bold block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Section</a>
                </li>
                <li>
                    <a id="delete-section-${sectionCount}" class="font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete Section</a>
                </li>
            </ul>
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li>
                    <a id="add-field-element-section-${sectionCount}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
                </li>
                <li>
                    <a id="add-video-element-section-${sectionCount}" class=" block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Video</a>
                </li>
                <li>
                    <a id="add-modal-element-section-${sectionCount}" class=" block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modal</a>
                </li>
                <li>
                    <a id="add-accordion-element-section-${sectionCount}" class=" block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Accordion</a>
                </li>
                <li>
                    <a id="add-collapse-element-section-${sectionCount}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Collapse Button</a>
                </li>
                <li>
                    <a id="add-carousel-element-section-${sectionCount}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
                </li>
            </ul>
        </div>
          
          <div id="editor-container-section-${sectionCount}" class="p-8 w-full flex flex-col flex-1" style="justify-content:start;align-items:center;"></div>
        </div>
    `
    document.querySelectorAll("[id^='webpage-section-']").forEach(section=>{
      if(section.dataset.sectionOrder > sectionOrder){
        section.dataset.sectionOrder = parseInt(section.dataset.sectionOrder) + 1
        console.log('update order', section)
      }else{
        console.log('no update order: ',section)

      }
    })

    document.getElementById(`webpage-${idParts.slice(1,3).join('-')}`).insertAdjacentHTML('afterend', newSection)
    
    dropdownInitialized()
    setListener()
  }

  if(id.startsWith('delete-section-')) {
    const sectionId = event.target.id.split('-')[2];
    const sectionElement = document.querySelector(`[id="webpage-section-${sectionId}"]`);
    
    if (sectionElement && sectionId !== '1') {
      if(sectionElement.dataset.sectionOrder >= sectionCount){
        sectionCount--;
      }
      sectionElement.remove();
    }
  }

  if (id.startsWith('add-field-')) {
    const idParts = event.target.id.split('-');

    let sectionNumber, idAppendField, idPrefix, fieldNumber
    let bodyAppend, idSection, bodyDropdown
    let orderField, wrapperInnerHtml

    const wrapper = document.createElement('div')
    const editorField = document.createElement('div');

    if(idParts[2] === 'accordion'){
      console.log('field accordion')

      idAppendField = `body-${idParts.slice(2,idParts.length).join('-')}`

      bodyAppend = document.getElementById(idAppendField)
      fieldNumber = parseInt(bodyAppend.getAttribute('data-field-count'))
      fieldNumber++

      orderField = fieldNumber
      bodyAppend.dataset.fieldCount = fieldNumber
    
      idPrefix = `field-${idParts.slice(2, idParts.length).join('-')}-${fieldNumber}`
      
    }else if(idParts[2]==='collapse'){
      console.log('field collapse')

      idAppendField = `element-${idParts.slice(2,idParts.length).join('-')}`

      bodyAppend = document.getElementById(idAppendField)
      fieldNumber = parseInt(bodyAppend.getAttribute('data-field-count'))
      fieldNumber++

      orderField = fieldNumber
      bodyAppend.dataset.fieldCount = fieldNumber
    
      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`
      
    }else if(idParts[2] === 'modal'){
      console.log('field modal')

      idAppendField = `body-${idParts.slice(2,idParts.length).join('-')}`

      bodyAppend = document.getElementById(idAppendField)
      fieldNumber = parseInt(bodyAppend.getAttribute('data-field-count'))
      fieldNumber++

      orderField = fieldNumber
      bodyAppend.dataset.fieldCount = fieldNumber
    
      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`

    }else{
      console.log('field biasa')

      sectionNumber = idParts[4];
      editorCount++

      orderField = editorCount

      idPrefix = `field-${idParts.slice(2, idParts.length).join('-')}-${editorCount}`

      idAppendField = `editor-container-section-${sectionNumber}`
      
    }

    wrapperInnerHtml = `
      <div type="button" class="absolute right-[-1.3rem] top-0 z-30 cursor-pointer" data-dropdown-toggle="dropdown-body-${idPrefix}" data-dropdown-placement="right-end">
        <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
        </svg>    
      </div>
    `
    bodyDropdown=`
      <div id="dropdown-body-${idPrefix}" data-accordion="open" class="w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
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
        </ul>
      </div>
    `

    editorField.id = idPrefix
    
    if(idParts.includes('accordion')){
      idSection = `editor-container-section-${idParts.find(part => !isNaN(part))}`
      document.getElementById(idSection).insertAdjacentHTML('beforeend', bodyDropdown)
    
    }else{
      wrapper.innerHTML += bodyDropdown;     
    }
    wrapper.innerHTML += wrapperInnerHtml;

    wrapper.style.position = "relative"
    wrapper.dataset.fieldOrder = orderField;
    
    editorField.setAttribute('contenteditable', 'true');
    editorField.setAttribute('style', 'ol{list-style-type:decimal;}ul{list-style-type:disc;}');
    editorField.classList.add(
      'border', 'border-b-1', 'border-gray-500','p-1',
      'max-w-[100%]', 'break-all', 'scroll-hidden', 'overflow-scroll'
    );
    wrapper.appendChild(editorField)

    document.getElementById(idAppendField)
            .appendChild(wrapper);

    dropdownInitialized()
    collapseInitialized()
    setListener(); // kamu tetap bisa panggil fungsi tambahan kalau perlu
  }

  if (id.startsWith('add-video-')) {
    const idParts = event.target.id.split('-');
    const videoField = document.createElement('div');
    let idAppendVideo, idPrefix, orderField, fieldNumber=0;
    let sectionNumber, editorFieldNumber, bodyAppend
    let accordionParent, bodyDropdown

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
        </ul>
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
          <li><a id="delete-${idPrefix}" class="block px-4 py-2 font-extrabold text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a></li>
        </ul>
      </div>
    `

    if(idParts[2] === 'accordion'){
      idAppendVideo = `body-${idParts.slice(2, idParts.length).join('-')}`;
      bodyAppend = document.getElementById(idAppendVideo);

      fieldNumber = parseInt(bodyAppend.getAttribute('data-field-count')) + 1;
      bodyAppend.dataset.fieldCount = fieldNumber;
      
      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`;
      videoField.id = idPrefix;
      
      orderField = editorCount;
      accordionParent = `parent-${idParts.slice(2, idParts.length-1).join('-')}`;

      bodyDropdown = createBodyDropdown(idPrefix);
      
    }else if(idParts[2]==='collapse'){
      idAppendVideo = `element-${idParts.slice(2, idParts.length).join('-')}`;
      bodyAppend = document.getElementById(idAppendVideo);

      fieldNumber = parseInt(bodyAppend.getAttribute('data-field-count')) + 1;
      bodyAppend.dataset.fieldCount = fieldNumber;
      
      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`;
      videoField.id = idPrefix;
      
      orderField = editorCount;
      
    }else if(idParts[2] === 'modal'){
      idAppendVideo = `body-${idParts.slice(2, idParts.length).join('-')}`;
      bodyAppend = document.getElementById(idAppendVideo);

      fieldNumber = parseInt(bodyAppend.getAttribute('data-field-count')) + 1;
      bodyAppend.dataset.fieldCount = fieldNumber;
      
      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`;
      videoField.id = idPrefix;
      
      orderField = editorCount;

    }else{
      editorCount++
      orderField = editorCount;
      
      sectionNumber = idParts[4];
      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${editorCount}`;
      idAppendVideo = `editor-container-section-${sectionNumber}`;
      videoField.id = idPrefix;

    }

    bodyDropdown = createBodyDropdown(idPrefix);

    if(idParts.includes('accordion')){
      if(idParts.includes('modal')){
        videoField.innerHTML += bodyDropdown;
      }else{
        let idSection = `editor-container-section-${idParts.find(part => !isNaN(part))}`
        document.getElementById(idSection).insertAdjacentHTML('beforeend', bodyDropdown)
      }
    }else{
      videoField.innerHTML += bodyDropdown;
    }

    // Inject the template and styles
    videoField.dataset.fieldOrder = orderField;
    videoField.classList.add('border', 'border-b-1', 'border-gray-500', 'max-w-[100%]', 'cursor-pointer', 'relative');
    videoField.style.maxWidth = "200px";

    videoField.innerHTML += createVideoFieldHTML(idPrefix);

    // Append to DOM
    document.getElementById(idAppendVideo)?.appendChild(videoField);

    // Initialize dropdown & listeners
    dropdownInitialized();
    setListener();
  }
  
  // ======================== ACCORDION ======================
  if(id.startsWith('add-accordion-')) {
    const idParts = event.target.id.split('-');
    let bodyAppend, sectionNumber, editorFieldNumber, accordionWidth
    let idPrefix, accordionHTML='', accordionId, accordionBodyDropdown='', idAppendAccordion, fieldNumber, orderField

    let idAppendDropdown, accordionParentBody, itemCount, dropdownBody
    const accordionField = document.createElement('div');

    if(idParts[2] === 'head'){
      sectionNumber = idParts[6];
      editorFieldNumber = idParts[7];
  
      console.log("add item accordion")

      let parentAccordionId=`parent-${idParts.slice(3, idParts.length).join('-')}`
      accordionParentBody = document.getElementById(parentAccordionId)
      itemCount = parseInt(accordionParentBody.getAttribute('data-item-accordion')) + 1;
      
      accordionId = `${idParts.slice(3, idParts.length).join('-')}`

      idPrefix = `${idParts.slice(3, idParts.length).join('-')}-${itemCount}`

      let newItem = `
        <div id="${idPrefix}" class="relative z-10">
          <div type="button" class="absolute right-0 top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-${idPrefix}" data-dropdown-placement="right-end">
            <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
            </svg>    
          </div>

        <h2 id="heading-${idPrefix}">
            <button type="button" id="btn-heading-${idPrefix}"
              class="flex items-center justify-between w-full p-5 break-all font-medium text-left text-gray-500 border border-gray-400"
              data-accordion-target="#body-${idPrefix}"
              aria-expanded="false"
              aria-controls="body-${idPrefix}">
                <span class="w-full">Section ${itemCount}</span>
                <svg data-accordion-icon class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                </svg>
              </button>
          </h2>

          <div id="body-${idPrefix}" data-field-count="1" class="z-30 hidden relative flex flex-col justify-center items-center border border-gray-400">
            <div type="button" class="absolute right-[-1.3rem] top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-body-${idPrefix}" data-dropdown-placement="right-end">
              <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                  <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
              </svg>    
            </div>

              <!-- Body Accordion -->
              <div data-field-order="1" style="position: relative;" class="my-1">
                <div type="button" class="absolute right-[-1.3rem] top-[0.8rem] z-10 cursor-pointer" data-dropdown-toggle="dropdown-field-${idPrefix}-${1}" data-dropdown-placement="right-end">
                  <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                      <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
                  </svg>    
                </div>
                
                <div id="field-${idPrefix}-${1}" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" class="border border-b-1 border-gray-500 px-1 max-w-[100%] break-all scroll-hidden overflow-scroll" contenteditable="true">
                  isi section ${1} di field ${1}
                </div>
              </div>  
            </div>
        </div>
      `

      dropdownBody=`
          <div id="dropdown-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-20 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li><a id="down-head-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
              <li><a id="up-head-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
            </ul>
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
              <li><a id="delete-head-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
            </ul>
          </div>

          <div id="dropdown-field-${idPrefix}-${1}" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li>
                    <a id="up-field-${idPrefix}-${1}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
                </li>
                <li>
                    <a id="down-field-${idPrefix}-${1}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
                </li>
                <li>
                    <a id="delete-field-${idPrefix}-${1}" class="cursor-pointer text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a>
                </li>
            </ul>
          </div>
        `
      if(idParts[5] === 'in' || idParts[4] === 'collapse' || idParts[5] === 'accordion'){
        dropdownBody +=`
          <div id="dropdown-body-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li>
                    <a id="add-field-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
                </li>
                <li>
                    <a id="add-video-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Video</a>
                </li>
                <li>
                    <a id="add-collapse-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Collapse Button</a>
                </li>
                <li>
                    <a id="add-carousel-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
                </li>
              </ul>
          </div> 
          `
      }else{
        dropdownBody +=`
        <div id="dropdown-body-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              <li>
                  <a id="add-field-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
              </li>
              <li>
                  <a id="add-video-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Video</a>
              </li>
              <li>
                  <a id="add-accordion-in-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Accordion</a>
              </li>
              <li>
                  <a id="add-collapse-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Collapse Button</a>
              </li>
              <li>
                  <a id="add-carousel-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
              </li>
            </ul>
        </div> 
        `
      }
      
      event.target.parentElement.parentElement.parentElement.classList.add('hidden')
    
      let accordionMotherNumber
      if(idParts.includes('collapse')){
        accordionMotherNumber = accordionId
      }else{
        accordionMotherNumber = `accordion-element-section-${idParts.filter(part => !isNaN(part)).slice(0, 2).join('-')}`
      }
      
      accordionParentBody.innerHTML += newItem;
      accordionParentBody.setAttribute('data-item-accordion', itemCount.toString());
      document.getElementById(accordionMotherNumber).innerHTML += dropdownBody
      
    }else if(idParts[2] != 'head'){
      if(idParts.join('-').includes('accordion-in-accordion')){

        idAppendAccordion = `body-${idParts.slice(3, idParts.length).join('-')}`
        bodyAppend = document.getElementById(idAppendAccordion)

        fieldNumber = parseInt(bodyAppend.getAttribute('data-field-count'))+1
        bodyAppend.dataset.fieldCount = fieldNumber;
        orderField = fieldNumber;

        idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`;
        accordionId = idPrefix
    
        console.log('accordion in accordion')

        event.target.parentElement.parentElement.parentElement.classList.add('hidden')
        accordionWidth= '300px'
        
      }else if(idParts.includes('collapse')){
        idAppendAccordion = `element-${idParts.slice(2, idParts.length).join('-')}`
        bodyAppend = document.getElementById(idAppendAccordion)

        fieldNumber = parseInt(bodyAppend.getAttribute('data-field-count'))+1
        bodyAppend.dataset.fieldCount = fieldNumber;
        orderField = fieldNumber;

        idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`;
        accordionId = idPrefix
    
        console.log('accordion in collapse')

        event.target.parentElement.parentElement.parentElement.classList.add('hidden')
        accordionWidth= '300px'

      }else{
        editorCount++
        editorFieldNumber = editorCount
        orderField = editorCount
        sectionNumber = idParts[4]
        
        idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${editorFieldNumber}`;
        
        accordionId = idPrefix
        
        idAppendAccordion = `editor-container-section-${sectionNumber}`
        
        console.log('accordion biasa')
        accordionWidth= '400px'
        
      }
      accordionField.style.width = accordionWidth;

      accordionField.id= accordionId
      accordionField.classList.add('relative', 'cursor-pointer');
      accordionField.style.overflowAnchor = 'none'
      accordionField.style.height = 'auto';
      accordionField.dataset.fieldOrder = orderField;
      
      let totalItem = 3; // jumlah section accordion
      console.log('idPrefix:', idPrefix)
      
      for (let i = 1; i <= totalItem; i++) {
        accordionHTML +=`
        <div id="${idPrefix}-${i}" class="relative z-10" data-field-order="${i}">
          <div type="button" class="absolute right-0 top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-head-${idPrefix}-${i}" data-dropdown-placement="right-end">
            <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
            </svg>    
          </div>
  
         <h2 id="heading-${idPrefix}-${i}">
             <button type="button" id="btn-heading-${idPrefix}-${i}"
              class="flex items-center justify-between w-full p-5 break-all font-medium text-left text-gray-500 border border-gray-400"
              data-accordion-target="#body-${idPrefix}-${i}"
              aria-expanded="false"
              aria-controls="body-${idPrefix}-${i}">
                <span class="w-full">Section ${i}</span>
                <svg data-accordion-icon class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                </svg>
              </button>
          </h2>
  
          <div id="body-${idPrefix}-${i}" data-field-count="1" class="z-30 hidden relative flex flex-col justify-center items-center border border-gray-400">
            <div type="button" class="absolute right-[-1.3rem] top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-body-${idPrefix}-${i}" data-dropdown-placement="right-end">
              <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                  <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
              </svg>    
            </div>
  
              <!-- Body Accordion -->
              <div data-field-order="1" style="position: relative;" class="my-1">
                <div type="button" class="absolute right-[-1.3rem] top-[0.8rem] z-10 cursor-pointer" data-dropdown-toggle="dropdown-field-${idPrefix}-${i}-${1}" data-dropdown-placement="right-end">
                  <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                      <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
                  </svg>    
                </div>
                
                <div id="field-${idPrefix}-${i}-${1}" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" class="border border-b-1 border-gray-500 px-1 max-w-[100%] break-all scroll-hidden overflow-scroll" contenteditable="true">
                  isi section ${1} di field ${1}
                </div>
              </div>  
            </div>
        </div>
        `;
  
        accordionBodyDropdown += `
          <div id="dropdown-head-${idPrefix}-${i}" data-accordion="open" class="absolute mt-2 left-0 w-20 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li><a id="down-head-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
              <li><a id="up-head-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
            </ul>
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
              <li><a id="delete-head-${idPrefix}-${i}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
            </ul>
          </div>
          
          <div id="dropdown-field-${idPrefix}-${i}-${1}" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li>
                    <a id="up-field-${idPrefix}-${i}-${1}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
                </li>
                <li>
                    <a id="down-field-${idPrefix}-${i}-${1}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
                </li>
                <li>
                    <a id="delete-field-${idPrefix}-${i}-${1}" class="cursor-pointer text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a>
                </li>
            </ul>
          </div>
          `
        if(idParts[2] === 'in' || idParts[2] === 'collapse'){
          accordionBodyDropdown +=`
          <div id="dropdown-body-${idPrefix}-${i}" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li>
                    <a id="add-field-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
                </li>
                <li>
                    <a id="add-video-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Video</a>
                </li>
                <!-- <li>
                     <a id="add-modal-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modal</a>
                 </li>
                 <li>
                     <a id="add-collapse-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Collapse Button</a>
                 </li> --!>
                <li>
                    <a id="add-carousel-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
                </li>
              </ul>
          </div> 
            `
        }else{
          accordionBodyDropdown +=`
          <div id="dropdown-body-${idPrefix}-${i}" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                  <li>
                      <a id="add-field-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
                  </li>
                  <li>
                      <a id="add-video-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Video</a>
                  </li>
                  <li>
                      <a id="add-modal-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modal</a>
                  </li>
                  <li>
                      <a id="add-accordion-in-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Accordion</a>
                  </li>
                  <li>
                      <a id="add-collapse-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Collapse Button</a>
                  </li>
                  <li>
                      <a id="add-carousel-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
                  </li>
                </ul>
            </div> 
            `
        }
      }

      accordionBodyDropdown += `
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
      accordionField.innerHTML += `
       <div type="button" class="absolute right-[-1.7rem] top-[-0.3rem] z-30 cursor-pointer" data-dropdown-toggle="dropdown-${idPrefix}" data-dropdown-placement="right-end">
          <svg id="edit-accordion" class="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
              <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
          </svg>                  
        </div>
        <div id="parent-${idPrefix}" data-item-accordion="3" data-accordion="collapse">
          ${accordionHTML}
        </div>
      `;
  
      if(idParts[2] === 'in'){
        document.getElementById(idParts.slice(3, idParts.length-1).join('-')).innerHTML += accordionBodyDropdown
      }else{
        accordionField.innerHTML += accordionBodyDropdown
      }
  
      document.getElementById(idAppendAccordion).appendChild(accordionField);
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
    collapseInitialized()
    dropdownInitialized()
  }

  // ======================== COLLAPSE ======================
  if(id.startsWith('add-collapse-')) {
    const idParts = event.target.id.split('-')
    let sectionNumber, bodyAppend, fieldNumber
    let dropdownIdAppend, idPrefix, idAppend, dropdownBody='', collapseWidth

    const collapseField = document.createElement('div');

    if(idParts[2] === 'accordion'){
  
      idAppend = `body-${idParts.slice(2, idParts.length).join('-')}`;
      bodyAppend = document.getElementById(idAppend);

      fieldNumber = parseInt(bodyAppend.getAttribute('data-field-count')) + 1;
      bodyAppend.dataset.fieldCount = fieldNumber;
  
      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`
      collapseWidth = '300px'
      
      dropdownIdAppend =idParts.slice(2, idParts.length).join('-')
      console.log('collapse in accordion')
      
    }else if(idParts.join('-').includes('collapse-in-collapse')){
      idAppend = `element-${idParts.slice(3, idParts.length).join('-')}`;
      bodyAppend = document.getElementById(idAppend);

      fieldNumber = parseInt(bodyAppend.getAttribute('data-field-count')) + 1;
      bodyAppend.dataset.fieldCount = fieldNumber;
  
      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`
      collapseWidth = '300px'
      
      dropdownIdAppend = idAppend
      console.log('collapse in collapse')

    }else{
      editorCount++
      fieldNumber = editorCount;
      
      sectionNumber = idParts[4];
  
      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`
      idAppend = `editor-container-section-${sectionNumber}`
  
      collapseWidth = '400px'
      console.log('collapse biasa')
      
    }

    collapseField.style.width = collapseWidth
    collapseField.id = idPrefix

    if(idParts[2]==='in' || idParts[2]==='accordion' || idParts[4]==='accordion'){
      dropdownBody += `
          <div id="dropdown-btn-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-20 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li><a id="down-btn-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
              <li><a id="up-btn-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
            </ul>
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
              <li><a id="delete-btn-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
            </ul>
          </div>
  
          <div id="dropdown-body-${idPrefix}" data-accordion="open" class="w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              <li>
                  <a id="add-field-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
              </li>
              <li>
                  <a id="add-video-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Video</a>
              </li>
              <!-- <li>
                  <a id="add-modal-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modal</a>
              </li> --!>
              <li>
                  <a id="add-carousel-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
              </li>
            </ul>
          </div>
  
          <div id="dropdown-field-${idPrefix}-1" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li>
                    <a id="up-field-${idPrefix}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
                </li>
                <li>
                    <a id="down-field-${idPrefix}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
                </li>
                <li>
                    <a id="delete-field-${idPrefix}-1" class="cursor-pointer text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a>
                </li>
            </ul>
          </div>
        `
      document.getElementById(dropdownIdAppend).insertAdjacentHTML('afterend', dropdownBody)
      console.log('collapse in')
    }else{
      collapseField.innerHTML += `
        <div id="dropdown-btn-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-20 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li><a id="down-btn-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
            <li><a id="up-btn-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
          </ul>
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
            <li><a id="delete-btn-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
          </ul>
        </div>

        <div id="dropdown-body-${idPrefix}" data-accordion="open" class="w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            <li>
                <a id="add-field-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
            </li>
            <li>
                <a id="add-video-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Video</a>
            </li>
            <li>
                <a id="add-modal-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modal</a>
            </li>
            <li>
                <a id="add-accordion-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Accordion</a>
            </li>
            <li>
                <a id="add-collapse-in-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Collapse Button</a>
            </li>
            <li>
                <a id="add-carousel-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
            </li>
          </ul>
        </div>

        <div id="dropdown-field-${idPrefix}-1" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              <li>
                  <a id="up-field-${idPrefix}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
              </li>
              <li>
                  <a id="down-field-${idPrefix}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
              </li>
              <li>
                  <a id="delete-field-${idPrefix}-1" class="cursor-pointer text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a>
              </li>
          </ul>
        </div>
      `
    }

    collapseField.dataset.fieldOrder = fieldNumber
    collapseField.style.position='relative'
    collapseField.classList.add('flex', 'justify-center', 'items-center', 'flex-col');

    collapseField.innerHTML +=`
        <div id="${idPrefix}" class="relative z-10 w-full" data-field-order="${fieldNumber}" data-accordion="collapse">
        
        <div type="button" class="absolute right-[-1.3rem] top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-btn-${idPrefix}" data-dropdown-placement="right-end">
          <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
              <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
          </svg>    
        </div>

         <h2 id="heading-${idPrefix}">
             <button type="button" id="btn-${idPrefix}"
              class="flex items-center justify-between w-full p-2 break-all font-medium text-left text-black border border-gray-400"
              data-accordion-target="#element-${idPrefix}"
              aria-expanded="false"
              aria-controls="element-${idPrefix}">
                <span class="w-full">Button Collapse</span>
              </button>
          </h2>
  
          <div id="element-${idPrefix}" data-field-count="1" class="z-30 hidden relative flex flex-col justify-center items-center border border-gray-400">
            <div type="button" class="absolute right-[-1.3rem] top-0 z-10 cursor-pointer" data-dropdown-toggle="dropdown-body-${idPrefix}" data-dropdown-placement="right-end">
              <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                  <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
              </svg>    
            </div>
  
              <!-- Body Collapse -->
              <div data-field-order="1" style="position: relative;" class="my-1">
                <div type="button" class="absolute right-[-1.3rem] top-[0.8rem] z-10 cursor-pointer" data-dropdown-toggle="dropdown-field-${idPrefix}-1" data-dropdown-placement="right-end">
                  <svg id="edit-accordion" class="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                      <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
                  </svg>    
                </div>
                
                <div id="field-${idPrefix}-1" style="ol{list-style-type:decimal;}ul{list-style-type:disc;}" class="border border-b-1 border-gray-500 px-1 max-w-[100%] break-all scroll-hidden overflow-scroll" contenteditable="true">
                  text
                </div>
              </div>  
            </div>
        </div>
        `;

    document.getElementById(idAppend).appendChild(collapseField);

    setTimeout(() => {
        try {
            const accordionElement = document.getElementById(idPrefix);
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
    setListener()
    dropdownInitialized()
  }
  
  // ======================== CAROUSEL ======================
  if(id.startsWith('add-carousel-')) {
    const idParts = event.target.id.split('-')
    let sectionNumber, dropdownBody, dropdownIdAppend,idAppend,idPrefix,bodyAppend, fieldNumber
    let svgControlerSlideSize, slideControlWrapperSize, indicatorSize, bottomIndicatorPosition, paddingSlideController

    const carouselElement = document.createElement('div');

    if(idParts[2] === 'accordion'){
  
      idAppend = `body-${idParts.slice(2, idParts.length).join('-')}`;

      bodyAppend = document.getElementById(idAppend);
      fieldNumber = parseInt(bodyAppend.getAttribute('data-field-count')) + 1;
      bodyAppend.dataset.fieldCount = fieldNumber;

      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`
  
      carouselElement.style.width = '300px'
      carouselElement.style.height = '200px'

      svgControlerSlideSize = 'w-[12px] h-[12px]'
      slideControlWrapperSize = 'w-[24px] h-[24px]'
      indicatorSize = 'w-[8px] h-[8px]'
      bottomIndicatorPosition = 'bottom-2'
      paddingSlideController = 'px-2'

    }else if(idParts[2] === 'collapse'){
      idAppend = `element-${idParts.slice(2, idParts.length).join('-')}`;

      bodyAppend = document.getElementById(idAppend);
      fieldNumber = parseInt(bodyAppend.getAttribute('data-field-count')) + 1;
      bodyAppend.dataset.fieldCount = fieldNumber;

      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`

      dropdownIdAppend = `parent-${idParts.slice(3, idParts.length-2).join('-')}`
  
      carouselElement.style.width = '300px'
      carouselElement.style.height = '200px'

      svgControlerSlideSize = 'w-[12px] h-[12px]'
      slideControlWrapperSize = 'w-[24px] h-[24px]'
      indicatorSize = 'w-[8px] h-[8px]'
      bottomIndicatorPosition = 'bottom-2'
      paddingSlideController = 'px-2'

    }else{
      editorCount++;
  
      sectionNumber = idParts[4];
      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${editorCount}`
  
      carouselElement.style.width = '400px'
      carouselElement.style.height = '300px'
      
      idAppend = `editor-container-section-${sectionNumber}`

      svgControlerSlideSize = 'w-[16px] h-[16px]'
      slideControlWrapperSize = 'w-[32px] h-[32px]'
      indicatorSize = 'w-[10px] h-[10px]'
      bottomIndicatorPosition = 'bottom-5'
      paddingSlideController = 'px-4'
    }

    if(idParts.includes('accordion')){

      carouselElement.style.width = '250px'
      carouselElement.style.height = '150px'

      dropdownBody = `
        <div id="dropdown-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-30 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li><a id="down-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
            <li><a id="up-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
            <li><a id="add-image-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Add Image</a></li>
            <li><a id="add-text-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Add Text</a></li>
          </ul>
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
            <li><a id="delete-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
          </ul>
        </div>
      `
      let idSection = `editor-container-section-${idParts.find(part => !isNaN(part))}`
      document.getElementById(idSection).insertAdjacentHTML('beforeend', dropdownBody)

      console.log('mini carousel')

    }else{
      carouselElement.innerHTML += `
        <div id="dropdown-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-30 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li><a id="down-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
            <li><a id="up-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
          </ul>
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
            <li><a id="delete-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
          </ul>
        </div>
      `
    }
    
    carouselElement.id = idPrefix;

    carouselElement.dataset.fieldOrder = editorCount;
    carouselElement.dataset.textPosition = 'on image';
    carouselElement.dataset.text = 'false';
    carouselElement.dataset.nextBtnHide = 'false';
    carouselElement.dataset.carousel = 'static';

    carouselElement.style.position='relative'
    carouselElement.classList.add('flex', 'justify-center', 'items-center', 'flex-col');

    carouselElement.innerHTML += `
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
              <div id="item-${idPrefix}-1" data-item-order="1" class="duration-700 ease-in-out flex justify-center items-center" style='background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url("/assets/img/Flyer Qurban TPA.png");background-size:cover;background-position:center;' data-carousel-item>
              </div>

              <!-- Item 2 -->
              <div id="item-${idPrefix}-2" data-item-order="2" class="duration-700 ease-in-out flex justify-center items-center" style='background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url("/assets/img/alpukat1.jpg");background-size:cover;background-position:center;' data-carousel-item>
              </div>

              <!-- Item 3 -->
              <div id="item-${idPrefix}-3" data-item-order="3" class="duration-700 ease-in-out flex justify-center items-center" style='background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url("/assets/img/apple.jpg");background-size:cover;background-position:center;' data-carousel-item>
              </div>
          </div>
          <!-- Slider indicators -->
          <div id="slide-indicator-${idPrefix}" class="absolute z-30 flex -translate-x-1/2 ${bottomIndicatorPosition} left-1/2 space-x-3 rtl:space-x-reverse">
              <button type="button" class="${indicatorSize} rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
              <button type="button" class="${indicatorSize} rounded-full" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
              <button type="button" class="${indicatorSize} rounded-full" aria-current="false" aria-label="Slide 3" data-carousel-slide-to="2"></button>
          </div>
          <!-- Slider controls -->
          <button id="slider-prev-btn" type="button" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full ${paddingSlideController} cursor-pointer group focus:outline-none" data-carousel-prev>
              <span class="inline-flex items-center justify-center ${slideControlWrapperSize} rounded-full bg-gray-400/30 group-hover:bg-gray-400/50 group-focus:ring-4 group-focus:ring-gray-300 group-focus:outline-none">
                  <svg class="${svgControlerSlideSize} text-gray-500 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                  </svg>
                  <span class="sr-only">Previous</span>
              </span>
          </button>
          <button id="slider-next-btn" type="button" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full ${paddingSlideController} cursor-pointer group focus:outline-none" data-carousel-next>
              <span class="inline-flex items-center justify-center ${slideControlWrapperSize} rounded-full bg-gray-400/30 group-hover:bg-gray-400/50 group-focus:ring-4 group-focus:ring-gray-300 group-focus:outline-none">
                  <svg class="${svgControlerSlideSize} text-gray-500 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span class="sr-only">Next</span>
              </span>
          </button>
        </div>
    `

    document.getElementById(idAppend).appendChild(carouselElement);

    setListener()
    dropdownInitialized()

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

  // ======================== MODAL =========================
  if(id.startsWith('add-modal-')) {
    const idParts = event.target.id.split('-')
    let sectionNumber, bodyAppend, fieldNumber, bodyModal, idSection, bodyDropdown
    let idPrefix, idAppend

    const modalElement = document.createElement('div');

    if(idParts[2] === 'accordion'){
      idAppend = `body-${idParts.slice(2, idParts.length).join('-')}`;
      bodyAppend = document.getElementById(idAppend);

      fieldNumber = parseInt(bodyAppend.getAttribute('data-field-count')) + 1;
      bodyAppend.dataset.fieldCount = fieldNumber;

      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`
      
      console.log('modal in accordion')

    }else if(idParts[2] ==='collapse'){
      idAppend = `element-${idParts.slice(2, idParts.length).join('-')}`;

      bodyAppend = document.getElementById(idAppend);
      fieldNumber = parseInt(bodyAppend.getAttribute('data-field-count')) + 1;
      bodyAppend.dataset.fieldCount = fieldNumber;
  
      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`

      console.log('modal in collapse')

    }else{
      editorCount++
      fieldNumber = editorCount;
  
      sectionNumber = idParts[4];

      idPrefix = `${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`
      idAppend = `editor-container-section-${sectionNumber}`

      console.log('modal biasa')
      
    }

    idSection=`webpage-section-${idParts.find(part => !isNaN(part))}`

    modalElement.id = idPrefix
    modalElement.dataset.fieldOrder = fieldNumber;
    modalElement.style.position='relative'
    modalElement.classList.add('flex', 'justify-center', 'items-center', 'flex-col');

    modalElement.innerHTML += `
      <div id="wrapper-${idPrefix}" class="relative flex justify-center items-center inline-flex gap-2">
        <div type="button" class="absolute right-[-1.7rem] top-[-0.3rem] z-10 cursor-pointer" data-dropdown-toggle="dropdown-btn-${idPrefix}" data-dropdown-placement="right-end">
          <svg id="edit-accordion" class="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
              <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
          </svg>                  
        </div>

        <button id="btn-${idPrefix}" data-modal-target="element-${idPrefix}" data-modal-toggle="element-${idPrefix}" class="flex justify-between items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 break-all" data-target="#element-${idPrefix}">
          <span class="w-full">Button Modal</span>
        </button>
      </div>
    `;

    bodyDropdown = `
        <div id="dropdown-btn-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-20 z-50 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li><a id="down-btn-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
            <li><a id="up-btn-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
          </ul>
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
            <li><a id="delete-btn-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
          </ul>
        </div>
    `
    if(idParts.includes('accordion')){
      idSection = `editor-container-section-${idParts.find(part => !isNaN(part))}`
      document.getElementById(idSection).insertAdjacentHTML('beforeend', bodyDropdown)
    
    }else{
      modalElement.innerHTML += bodyDropdown;     
    }

    bodyModal =`
      <div id="element-${idPrefix}" tabindex="-1" aria-hidden="true" class="absolute top-0 left-0 w-full h-full z-50 hidden flex justify-center items-center">
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

          <div id="parent-${idPrefix}" class="bg-white rounded-md w-full max-w-2xl max-h-full">
            <!-- Modal content -->
            <div class="shadow-sm">
              <!-- Modal header -->
              <div class="flex items-center justify-between p-4 md:p-5 border-b-2 rounded-t border-gray-200">
                  <h3 id="field-head-${idPrefix}" class="border border-gray-400 break-all scroll-hidden overflow-scroll p-1" contenteditable="true">
                      Head Modal
                  </h3>
              </div>

              <!-- Modal body -->
              <div id="body-${idPrefix}" class="flex flex-col justify-center items-center relative p-3" data-field-count="1">
                 <div type="button" class="absolute right-[-1.7rem] top-[-0.3rem] z-10 cursor-pointer" data-dropdown-toggle="dropdown-body-${idPrefix}" data-dropdown-placement="right-end">
                  <svg id="edit-accordion" class="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                      <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
                  </svg>                  
                </div>

                <div data-field-order="1" style="position: relative;">
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
    document.querySelector(`[id^="${idSection}"]`).insertAdjacentHTML('beforeend', bodyModal)

    document.getElementById(idAppend).appendChild(modalElement);

    setListener()
    dropdownInitialized()

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

// ================================= DOWN UP DELETE ELEMENT =================================
  let bodyFieldELement, fieldElement

  if(idParts[0] =='up' || idParts[0] == 'down' || idParts[0] == 'delete'){
    if(idParts[1] === 'btn' && idParts[2] === 'modal'){
      
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

    }else if(idParts[1] === 'btn' && idParts[2] === 'collapse'){

      fieldElement = document.getElementById(idParts.slice(2, idParts.length).join('-'))
      bodyFieldELement = fieldElement.parentElement
      console.log('collapse Select', fieldElement, bodyFieldELement)

    }else if(idParts[1] === 'carousel'){

      fieldElement = document.getElementById(idParts.slice(1, idParts.length).join('-'))
      bodyFieldELement = fieldElement.parentElement
      console.log('carousel Select', fieldElement, bodyFieldELement)

    }else if(idParts[1] === 'field'){

      fieldElement = document.getElementById(idParts.slice(1, idParts.length).join('-')).parentElement;
      bodyFieldELement = fieldElement.parentElement
      console.log(`field select: `, fieldElement,' body: ', bodyFieldELement)

    }
  }else{
    console.log('no up, down, or delete element')
  }

  if(idParts[0] === 'down') {
    const nextField = fieldElement?.nextElementSibling;
    console.log(nextField, fieldElement)

    if (fieldElement && nextField) {
      let orderTemp = nextField.dataset.fieldOrder;
      nextField.dataset.fieldOrder = fieldElement.dataset.fieldOrder;
      fieldElement.dataset.fieldOrder = orderTemp;
      // Sisipkan elemen field setelah elemen next-nya (artinya swap)
      nextField.insertAdjacentElement('afterend', fieldElement);
    }

  }else if(idParts[0] === 'up') {
    const prevField = fieldElement?.previousElementSibling;
    console.log(prevField, fieldElement)

    if (fieldElement && prevField) {
      let orderTemp = prevField.dataset.fieldOrder;
      prevField.dataset.fieldOrder = fieldElement.dataset.fieldOrder;
      fieldElement.dataset.fieldOrder = orderTemp;
      // Sisipkan elemen field setelah elemen next-nya (artinya swap)
      prevField.insertAdjacentElement('beforebegin', fieldElement);
    }

  }else if(idParts[0] === 'delete') {

    console.log('delete:', idParts.slice(1, idParts.length).join('-'), fieldElement, bodyFieldELement)
    if(bodyFieldELement.id.startsWith('editor-container-section-') && fieldElement.parentElement.dataset.fieldOrder >= editorCount){
      editorCount--
      console.log('field in section delete')

    }else if(fieldElement.parentElement.dataset.fieldOrder >= bodyFieldELement.dataset.fieldCount && idParts[1] !== 'head') {
      bodyFieldELement.dataset.fieldCount--;
      console.log('field delete')

    }else if(fieldElement.dataset.fieldOrder >= bodyFieldELement.dataset.itemAccordion && idParts[1] === 'head') {
      bodyFieldELement.dataset.itemAccordion--;
      console.log('head delete')

    }else{
      console.log('no delete',fieldElement.dataset.fieldOrder >= editorCount, fieldElement.parentElement.dataset.fieldOrder, bodyFieldELement.dataset.fieldCount, )
    }
    
    event.target.parentElement.parentElement.parentElement.remove()

    if(idParts[1] === 'btn' && idParts[2] === 'modal'){
      document.querySelector(`[id='element-${fieldElement.id}']`).remove()
    }
    
    fieldElement.remove();

  }
});

document.getElementById('btn-save').addEventListener('click', function(){
  console.log(sectionSelect)
  // console.log(carouselSelect.style.backgroundImage.split('url(')[1].split(')')[0])
  // const selection = window.getSelection();
  // if (selection.rangeCount > 0) {
  //   const range = selection.getRangeAt(0);
  //   const contents = range.cloneContents();

  //   const spans = contents.querySelectorAll("*");
  //   spans.forEach(span => {
  //     const styles = window.getComputedStyle(span);
  //     //console.log("Element:", span.nodeName, "Color:", styles.color, "Font:", styles.fontFamily);
  //   });
  // }
  // //console.log(editorFieldSelect.style.backgroundImage ? 'ada' : 'gkada', editorFieldSelect.style.backgroundColor ? 'null' : 'ada')

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