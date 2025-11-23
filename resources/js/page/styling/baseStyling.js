// ======== GLOBALS =========
import { globals } from '../globals.js';

// ======== UTILITIES =========
import { updateContent, updateActionProperty } from '../utils/updateContent.js';
import { parseStyleObj, stringifyStyleObj } from '../utils/baseStyleObj.js';
import { updateStylingControls } from './stylingControls.js';

// ======== GLOBAL VARIABLE ASSIGNMENT =========
let webpageDb = globals.webpageDb,
  editorFieldSelect = globals.editorFieldSelect,
  editCarouselItem = globals.editCarouselItem,
  carouselSelect = globals.carouselSelect,
  accordionPartSelect = globals.accordionPartSelect,
  accordionSelect = globals.accordionSelect,
  savedSelection = globals.savedSelection

// Styling Function Utils
async function compressToWebP(file, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Gagal compress ke WebP");

          resolve(
            new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
              type: "image/webp",
            })
          );
        },
        "image/webp",
        quality
      );
    };

    img.onerror = reject;
    img.src = url;
  });
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
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
  globals.editorFieldSelect=editorFieldSelect
}
function updateStyle(editorFieldSelect, indicator, file, indicatorCarousel){
  webpageDb = globals.webpageDb
  let mediaDelete=''
  let id
  webpageDb.forEach(item=>{
    if(editorFieldSelect.id.startsWith('btn-modal-')){
      id=editorFieldSelect.id.split('-').slice(1).join('-')
    }else if(editorFieldSelect.id.startsWith('parent-modal-')){
      id=`body-${editorFieldSelect.id.split('-').slice(1).join('-')}`
    }else{
      id=editorFieldSelect.id
    }
    console.log(id)
    // console.log(indicatorCarousel)
    if(item.id === id){
      if(indicator === 'bg-image'){
        if(indicatorCarousel === 'on-image'){
          let style = editorFieldSelect.style.cssText
          if(style.includes('background-color')){
            style = style.replace(/background-color:\s*[^;]+;/, '');
          }

          // Buat kode unik berdasarkan file
          const randomKey = Math.random().toString(36).substring(2, 8);
          const safeName = file.name.replace(/\s+/g, '_'); // hindari spasi
          const uniqueKey = `__temp_media_${randomKey}_${safeName}__`;

          const match = item.style.match(/url\((['"]?)(.*?)\1\)/);
          if (match) {
            mediaDelete =match[2]
          }

          style = style.replace(
            /url\((['"]?)([^'")]+)\1\)/gi,
            `url('${uniqueKey}')`
          );

          item.style=style
          webpageDb.push({
            id:uniqueKey,
            action:'add',
            file:file,
            type:'file'
          })

        }else if(indicatorCarousel === 'below-image'){
          let imgTextOnImage = webpageDb.findIndex(field => field.id===`img-text-on-image-${item.id}`)
          if(file){
            const randomKey = Math.random().toString(36).substring(2, 8);
            const safeName = file.name.replace(/\s+/g, '_'); // hindari spasi
            const uniqueKey = `__temp_media_${randomKey}_${safeName}__`;
           
            const match = item.style.match(/url\((['"]?)(.*?)\1\)/);
            if (match) {
              mediaDelete =match[2]
            }

            webpageDb.push({
              id:uniqueKey,
              file:file,
              action:'add',
              type:'file'
            })

            console.log(imgTextOnImage, `img-text-on-image-${item.id}`,webpageDb[imgTextOnImage])
            webpageDb[imgTextOnImage].content=uniqueKey
            webpageDb[imgTextOnImage].action=updateActionProperty(webpageDb[imgTextOnImage].action, 'update')
          }

          let style = editorFieldSelect.children[1]
          console.log(style, editorFieldSelect.children[1], editorFieldSelect)
          
          let bgColor = style.style.backgroundColor
          
          item.style = `background-color: ${bgColor};`;

        }else{
          // Ambil style awal
          let style = editorFieldSelect.style.cssText || '';

          // Buat kode unik berdasarkan file
          const randomKey = Math.random().toString(36).substring(2, 8);
          const safeName = file.name.replace(/\s+/g, '_'); // hindari spasi
          const uniqueKey = `__temp_media_${randomKey}_${safeName}__`;

          console.log('before',style)

          const match = item.style?.match(/url\((['"]?)(.*?)\1\)/);
          if (match) {
            mediaDelete =match[2]
          }

          style = style.replace(
            /url\((['"]?)([^'")]+)\1\)/gi,
            `url('${uniqueKey}')`
          );
          let editorStyle=''
          if(editorFieldSelect.id.startsWith('webpage')){
            editorStyle=editorFieldSelect.querySelector('[id^="editor-container"]').style.cssText
          }
          item.style=style+editorStyle

          webpageDb.push({
            id:uniqueKey,
            file:file,
            action:'add',
            type:'file'
          })
        }

      }else{
        console.log('field section')
        if(item.type === "carousel") {
          // khusus carousel
          let styleObj = parseStyleObj(item.style);
          let css = styleObj.css || '';

          // ambil URL lama dari styleObj.css (jika ada)
          let urlMatch = css.match(/url\(['"]?(.*?)['"]?\)/);
          let oldUrl = urlMatch ? urlMatch[1] : null;

          // ambil style terbaru dari elemen editor
          let newStyle = editorFieldSelect.style.cssText || '';

          // kalau ada URL lama, replace di newStyle
          if (oldUrl) {
            newStyle = newStyle.replace(
              /url\(['"]?.*?['"]?\)/,
              `url('${oldUrl}')`
            );
          }

          // update ke objek style
          styleObj.css = newStyle;
          item.style = stringifyStyleObj(styleObj);
          
        }else{
          console.log('bukan carousel')
          if(id.startsWith('item-carousel')){
            console.log(editorFieldSelect, editorFieldSelect.children[1])
            let baseStyle = editorFieldSelect.style.cssText
            let oldUrl = null;
  
            let urlMatch = (item.style || '').match(/url\(['"]?([^'")]+)['"]?\)/);
            if (urlMatch) oldUrl = urlMatch[1];
            console.log(oldUrl, baseStyle)
  
            if (oldUrl) {
              baseStyle = baseStyle.replace(
                /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
                `url(${oldUrl})`
              );
            }
            item.style = baseStyle;
          }else{
            let baseStyle = editorFieldSelect.style.cssText;
            let oldUrl = null;
  
            let urlMatch = (item.style || '').match(/url\(['"]?([^'")]+)['"]?\)/);
            if (urlMatch) oldUrl = urlMatch[1];
            console.log(oldUrl, baseStyle)
  
            if (oldUrl) {
              baseStyle = baseStyle.replace(
                /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
                `url(${oldUrl})`
              );
            }
  
            if (editorFieldSelect.id.startsWith('webpage')) {
              console.log('webpage:', baseStyle)
              let styleEditor = editorFieldSelect.querySelector('[id^="editor"]');
              let styleEditorAttr = styleEditor ? styleEditor.style.cssText : '';
              item.style = styleEditorAttr + baseStyle;
            } else {
              console.log('bukan webpage:', baseStyle)
              item.style = baseStyle;
            }
          }
        }
      }
      item.action=updateActionProperty(item.action, 'update')
      return
    }
  })

  const checkUsedMedia = webpageDb.some(el => {
    if (el.id === id) return false; // skip elemen yg sedang kita proses

    const style = el.style || "";
    const content = el.content || "";

    return style.includes(mediaDelete) || 
          content.includes(mediaDelete)
  });

  if (mediaDelete && !checkUsedMedia) {
    webpageDb = webpageDb.filter(el => el.id !== mediaDelete);
  }

  console.log(webpageDb)
  globals.webpageDb=webpageDb
}
// ------- Font Styling --------
function fontStylingField(){
  document.getElementById('heading-text').addEventListener('keyup', function () {
    editorFieldSelect = globals.editorFieldSelect
    // console.log(this.textContent)
    // console.log(editorFieldSelect)
    editorFieldSelect.querySelector('span').innerHTML = this.innerHTML;
    updateContent(editorFieldSelect)
    globals.editorFieldSelect=editorFieldSelect
  });

  document.getElementById('font-color-input').addEventListener('change', function () {
    editorFieldSelect = globals.editorFieldSelect
    savedSelection = globals.savedSelection
    const sel = window.getSelection();
    // console.log(document.getElementById('heading-text-wrapper').classList.)
    let fontField = null
    if(document.getElementById('heading-text-wrapper').classList.contains('hidden')){
      fontField = editorFieldSelect
    }else{
      fontField = document.getElementById('heading-text')
    }
    // console.log(savedSelection)
  
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
      globals.editorFieldSelect = editorFieldSelect
    } else {
      console.log('Tidak ada seleksi tersimpan');
    }
  });

  document.getElementById('font-family').addEventListener('change', function () {
    editorFieldSelect = globals.editorFieldSelect
    savedSelection = globals.savedSelection
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
        // console.log('test')
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
      globals.editorFieldSelect=editorFieldSelect
    } else {
      console.log('Tidak ada seleksi tersimpan');
    }
  })

  document.getElementById('font-size').addEventListener('change', function () {
    editorFieldSelect = globals.editorFieldSelect
    savedSelection = globals.savedSelection
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
        // console.log('test')
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
      globals.editorFieldSelect=editorFieldSelect
    } else {
      console.log('Tidak ada seleksi tersimpan');
    }
  })

  document.getElementById('font-bold').addEventListener('click', function () {
    editorFieldSelect = globals.editorFieldSelect
    savedSelection = globals.savedSelection
    const sel = window.getSelection();
  
    let fontField = null
    if(!(document.getElementById('heading-text-wrapper').classList.contains('hidden'))){
      fontField = document.getElementById('heading-text')
    }else{
      fontField = editorFieldSelect
    }
    // console.log(savedSelection)

    if (savedSelection) {
      sel.removeAllRanges();
      sel.addRange(savedSelection);
  
      let range = sel.getRangeAt(0);
  
      const startInside = fontField.contains(range.startContainer.nodeType === 3 ? range.startContainer.parentNode : range.startContainer);
      const endInside = fontField.contains(range.endContainer.nodeType === 3 ? range.endContainer.parentNode : range.endContainer);
  
      if (startInside && endInside && !range.collapsed) {
        // console.log('test')
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
      globals.editorFieldSelect=editorFieldSelect
    } else {
      console.log('Tidak ada seleksi tersimpan');
    }
  })
  
  document.getElementById('font-italic').addEventListener('click', function () {
    editorFieldSelect = globals.editorFieldSelect
    savedSelection = globals.savedSelection
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
      globals.editorFieldSelect=editorFieldSelect
    } else {
      console.log('Tidak ada seleksi tersimpan');
    }
  })
  
  document.getElementById('font-underline').addEventListener('click', function () {
    editorFieldSelect = globals.editorFieldSelect
    savedSelection = globals.savedSelection
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
      globals.editorFieldSelect=editorFieldSelect
    } else {
      console.log('Tidak ada seleksi tersimpan');
    }
  })
  
  document.getElementById('font-left').addEventListener('click', function () {
    editorFieldSelect = globals.editorFieldSelect
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
        // console.log('✅ aligned selected content');
      } else {
        const range = document.createRange();
        range.selectNodeContents(fontField);
  
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
  
        // Terapkan warna ke seluruh teks dalam fontField
        document.execCommand('justifyLeft');
  
        // Optional: hapus seleksi biar gak kelihatan disorot
        // console.log('select all')
      }

      if(!fontField.id.startsWith('field-')){
        editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
      }

      updateContent(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }else{
      console.log('not range')
    }
  })
  
  document.getElementById('font-right').addEventListener('click', function () {
    editorFieldSelect = globals.editorFieldSelect
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
        // console.log('✅ aligned selected content');
      } else {
        const range = document.createRange();
        range.selectNodeContents(fontField);
  
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
  
        // Terapkan warna ke seluruh teks dalam editorFieldSelect
        document.execCommand('justifyRight');
  
        // console.log('select all')
      }
      
      if(!fontField.id.startsWith('field-')){
        editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
      }

      updateContent(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }else{
       console.log('not range')
    }

  })
  
  document.getElementById('font-center').addEventListener('click', function () {
    const sel = window.getSelection();

    editorFieldSelect = globals.editorFieldSelect

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
        // console.log('✅ aligned selected content');
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
        // console.log('select all')
      }

      if(!fontField.id.startsWith('field-')){
        editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
      }
      
      updateContent(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }else{
       console.log('not range')
    }
  })
  
  document.getElementById('font-justify').addEventListener('click', function () {
    editorFieldSelect = globals.editorFieldSelect
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
        // console.log('✅ aligned selected content');
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
        // console.log('select all')
      }
      
      if(!fontField.id.startsWith('field-')){
        editorFieldSelect.querySelector('span').innerHTML = fontField.innerHTML;
      }

      updateContent(editorFieldSelect)
    }else{
       console.log('not range')
    }
    globals.editorFieldSelect=editorFieldSelect
  })

  document.getElementById('font-order-list').addEventListener('click', function () {
    editorFieldSelect = globals.editorFieldSelect
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
    globals.editorFieldSelect=editorFieldSelect
  });

  document.getElementById('font-unorder-list').addEventListener('click', function () {
    editorFieldSelect = globals.editorFieldSelect
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
    globals.editorFieldSelect=editorFieldSelect
  });
}
// -------- Box Field Styling -----------
function widthHeightField(){
  document.getElementById('width-field').addEventListener('keyup', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionSelect = globals.accordionSelect
    carouselSelect = globals.carouselSelect
    // console.log('width')
    if(editorFieldSelect){
      if(editorFieldSelect.id.split('-')[0] === "video"){
        editorFieldSelect.style.maxWidth=`${this.value}px`
        // console.log('video')
      }else if(accordionSelect){
        accordionSelect.style.width=`${this.value}px`
        // console.log('accordion', accordionSelect)
        updateStyle(accordionSelect)
        globals.accordionSelect=accordionSelect
      }else if(editorFieldSelect.id.startsWith('field')){
        editorFieldSelect.style.width=`${this.value}px`
      }else{
        // console.log('another', editorFieldSelect.id)
        editorFieldSelect.style.width=`${this.value}px`
      }

      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }else if(carouselSelect){
      carouselSelect.style.width=`${this.value}px`
      updateStyle(carouselSelect)
      globals.carouselSelect=carouselSelect
    }
  })

  document.getElementById('height-field').addEventListener('keyup', function(){
    editorFieldSelect = globals.editorFieldSelect
    carouselSelect = globals.carouselSelect

    if(editorFieldSelect){
      if(editorFieldSelect.id.startsWith('webpage')){
        editorFieldSelect.style.minHeight=`${this.value}px`
      }else{
        editorFieldSelect.style.height=`${this.value}px`
      }

      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect

    }else if(carouselSelect){
      carouselSelect.style.height=`${this.value}px`
      updateStyle(carouselSelect)
      globals.carouselSelect=carouselSelect
    }
    
  })

  document.getElementById('btn-reset-box').addEventListener('click', function(){
    editorFieldSelect = globals.editorFieldSelect
    editorFieldSelect.style.width=''
    editorFieldSelect.style.height=''
    updateStyle(editorFieldSelect)
    updateStylingControls(editorFieldSelect)
  })
}
// -------- Field Flex position -------
function flexPosition(){
  document.getElementById('flex-position-section').addEventListener('change', function(){
    editorFieldSelect=globals.editorFieldSelect
    // console.log('flex', this.value, globals.editorFieldSelect, editorFieldSelect.id)
    let section=''

    if(editorFieldSelect.id.startsWith('webpage')){
      section=editorFieldSelect.querySelector('[id^="editor"]')
    }
    
    if(this.value == 'top'){
      editorFieldSelect.style.justifyContent = 'start'
      editorFieldSelect.style.alignItems = 'center'
      section.style.justifyContent = 'start'
      section.style.alignItems = 'center'

      // console.log('ini top')
    }else if(this.value == 'center'){
      editorFieldSelect.style.justifyContent = 'center'
      editorFieldSelect.style.alignItems = 'center'
      section.style.justifyContent = 'center'
      section.style.alignItems = 'center'
      
      // console.log('ini center')
    }else if(this.value == 'bottom'){
      editorFieldSelect.style.justifyContent = 'end'
      editorFieldSelect.style.alignItems = 'center'
      section.style.justifyContent = 'end'
      section.style.alignItems = 'center'
      // console.log('ini bottom')
    }
    updateStyle(editorFieldSelect)
    globals.editorFieldSelect=editorFieldSelect
  })
}
// -------- Border -----------
function borderField(){
  document.getElementById('border-field').addEventListener('change', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderWidth=`${this.value}px`
      updateStyle(accordionPartSelect)
      globals.accordionPartSelect=accordionPartSelect
    }else{
      editorFieldSelect.style.borderWidth=`${this.value}px`
      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }

    document.getElementById('border-field-left').value=this.value
    document.getElementById('border-field-right').value=this.value
    document.getElementById('border-field-top').value=this.value
    document.getElementById('border-field-bottom').value=this.value

  })

  document.getElementById('border-color-field').addEventListener('change', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.setAttribute('data-border-color', this.value)
      accordionPartSelect.style.borderColor=`${this.value}`
      updateStyle(accordionPartSelect)
      globals.accordionPartSelect=accordionPartSelect
    }else{
      editorFieldSelect.setAttribute('data-border-color', this.value)
      editorFieldSelect.style.borderColor=`${this.value}`
      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }
  })

  document.getElementById('border-field-top').addEventListener('change', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderTopWidth=`${this.value}px`
      updateStyle(accordionPartSelect)
      globals.accordionPartSelect=accordionPartSelect
    }else{
      editorFieldSelect.style.borderTopWidth=`${this.value}px`
      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }
  })

  document.getElementById('border-field-right').addEventListener('change', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderRightWidth=`${this.value}px`
      updateStyle(accordionPartSelect)
      globals.accordionPartSelect=accordionPartSelect
    }else{
      editorFieldSelect.style.borderRightWidth=`${this.value}px`
      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }
  })

  document.getElementById('border-field-left').addEventListener('change', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderLeftWidth=`${this.value}px`
      globals.accordionPartSelect=accordionPartSelect
    }else{
      editorFieldSelect.style.borderLeftWidth=`${this.value}px`
      globals.editorFieldSelect=editorFieldSelect
    }
  })

  document.getElementById('border-field-bottom').addEventListener('change', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderBottomWidth=`${this.value}px`
      updateStyle(accordionPartSelect)
      globals.accordionPartSelect=accordionPartSelect
    }else{
      editorFieldSelect.style.borderBottomWidth=`${this.value}px`
      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }
  })

  document.getElementById('border-field-rounded').addEventListener('change', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    console.log(editorFieldSelect)
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderRadius=`${this.value}px`
      updateStyle(accordionPartSelect)
      globals.accordionPartSelect=accordionPartSelect
    }else{
      editorFieldSelect.style.borderRadius=`${this.value}px`
      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }

    document.getElementById('border-field-rounded-top-left').value=this.value
    document.getElementById('border-field-rounded-bottom-right').value=this.value
    document.getElementById('border-field-rounded-top-right').value=this.value
    document.getElementById('border-field-rounded-bottom-left').value=this.value
  })

  document.getElementById('border-field-rounded-top-right').addEventListener('change', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
   if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderTopRightRadius=`${this.value}px`
      updateStyle(accordionPartSelect)
      globals.accordionPartSelect=accordionPartSelect
    }else{
      editorFieldSelect.style.borderTopRightRadius=`${this.value}px`
      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }
  })

  document.getElementById('border-field-rounded-top-left').addEventListener('change', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderTopLeftRadius=`${this.value}px`
      updateStyle(accordionPartSelect)
      globals.accordionPartSelect=accordionPartSelect
    }else{
      editorFieldSelect.style.borderTopLeftRadius=`${this.value}px`
      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }
  })

  document.getElementById('border-field-rounded-bottom-right').addEventListener('change', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderBottomRightRadius=`${this.value}px`
      updateStyle(accordionPartSelect)
      globals.accordionPartSelect=accordionPartSelect
    }else{
      editorFieldSelect.style.borderBottomRightRadius=`${this.value}px`
      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }
  })

  document.getElementById('border-field-rounded-bottom-left').addEventListener('change', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.borderBottomLeftRadius=`${this.value}px`
      updateStyle(accordionPartSelect)
      globals.accordionPartSelect=accordionPartSelect
    }else{
      editorFieldSelect.style.borderBottomLeftRadius=`${this.value}px`
      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
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
        // console.log('test if')
      }else{
        document.getElementById('padding-field').value = ''
        // console.log('test else')
      }
      // console.log(document.getElementById('padding-field-top').value, document.getElementById('padding-field-bottom').value, document.getElementById('padding-field-left').value, document.getElementById('padding-field-right').value)
      // console.log(topVal === bottomVal && bottomVal === leftVal && leftVal === rightVal)
    })
  })

  document.getElementById('padding-field').addEventListener('keyup', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.paddingLeft=`${this.value}px`
      accordionPartSelect.style.paddingRight=`${this.value}px`
      accordionPartSelect.style.paddingTop=`${this.value}px`
      accordionPartSelect.style.paddingBottom=`${this.value}px`
      updateStyle(accordionPartSelect)
      globals.accordionPartSelect=accordionPartSelect

    }else{
      editorFieldSelect.style.paddingLeft=`${this.value}px`
      editorFieldSelect.style.paddingRight=`${this.value}px`
      editorFieldSelect.style.paddingTop=`${this.value}px`
      editorFieldSelect.style.paddingBottom=`${this.value}px`
      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect

    }

    document.getElementById('padding-field-left').value=this.value
    document.getElementById('padding-field-right').value=this.value
    document.getElementById('padding-field-top').value=this.value
    document.getElementById('padding-field-bottom').value=this.value
  })

  document.getElementById('padding-field-left').addEventListener('keyup', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.paddingLeft=`${this.value}px`
      updateStyle(accordionPartSelect)
      globals.accordionPartSelect=accordionPartSelect
    }else{
      editorFieldSelect.style.paddingLeft=`${this.value}px`
      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }
  })

  document.getElementById('padding-field-right').addEventListener('keyup', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.paddingRight=`${this.value}px`
      updateStyle(accordionPartSelect)
      globals.accordionPartSelect=accordionPartSelect
    }else{
      editorFieldSelect.style.paddingRight=`${this.value}px`
      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }
  })

  document.getElementById('padding-field-top').addEventListener('keyup', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.paddingTop=`${this.value}px`
      updateStyle(accordionPartSelect)
      globals.accordionPartSelect=accordionPartSelect
    }else{
      editorFieldSelect.style.paddingTop=`${this.value}px`
      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }
  })

  document.getElementById('padding-field-bottom').addEventListener('keyup', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    if(editorFieldSelect.id === 'heading-text'){
      accordionPartSelect.style.paddingBottom=`${this.value}px`
      updateStyle(accordionPartSelect)
      globals.accordionPartSelect=accordionPartSelect
    }else{
      editorFieldSelect.style.paddingBottom=`${this.value}px`
      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect
    }
  })

// ------ Margin --------
  document.getElementById('margin-field').addEventListener('keyup', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    carouselSelect = globals.carouselSelect
    if(editorFieldSelect){
      if(editorFieldSelect.id === 'heading-text'){
        accordionPartSelect.parentElement.style.marginLeft=`${this.value}px`
        accordionPartSelect.parentElement.style.marginRight=`${this.value}px`
        accordionPartSelect.parentElement.style.marginTop=`${this.value}px`
        accordionPartSelect.parentElement.style.marginBottom=`${this.value}px`
        updateStyle(accordionPartSelect)
        globals.accordionPartSelect=accordionPartSelect

      }else{
        editorFieldSelect.style.marginLeft=`${this.value}px`
        editorFieldSelect.style.marginRight=`${this.value}px`
        editorFieldSelect.style.marginTop=`${this.value}px`
        editorFieldSelect.style.marginBottom=`${this.value}px`
        updateStyle(editorFieldSelect)
        globals.editorFieldSelect=editorFieldSelect
      }
    }else if(carouselSelect){
      carouselSelect.style.marginLeft=`${this.value}px`
      carouselSelect.style.marginRight=`${this.value}px`
      carouselSelect.style.marginTop=`${this.value}px`
      carouselSelect.style.marginBottom=`${this.value}px`
      updateStyle(carouselSelect)
      globals.carouselSelect=carouselSelect
    }

    document.getElementById('margin-field-left').value=this.value
    document.getElementById('margin-field-right').value=this.value
    document.getElementById('margin-field-top').value=this.value
    document.getElementById('margin-field-bottom').value=this.value
  })

  document.getElementById('margin-field-left').addEventListener('keyup', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    carouselSelect = globals.carouselSelect
    if(editorFieldSelect){
      if(editorFieldSelect.id === 'heading-text'){
        accordionPartSelect.style.marginLeft=`${this.value}px`
        updateStyle(accordionPartSelect)
        globals.accordionPartSelect=accordionPartSelect
      }else{
        editorFieldSelect.style.marginLeft=`${this.value}px`
        updateStyle(editorFieldSelect)
        globals.editorFieldSelect=editorFieldSelect
      }
    }else if(carouselSelect){
      carouselSelect.style.marginLeft=`${this.value}px`  
      updateStyle(carouselSelect)
      globals.carouselSelect=carouselSelect
    }
  })

  document.getElementById('margin-field-right').addEventListener('keyup', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    carouselSelect = globals.carouselSelect
    if(editorFieldSelect){
      if(editorFieldSelect.id === 'heading-text'){
        accordionPartSelect.style.marginRight=`${this.value}px`
        updateStyle(accordionPartSelect)
        globals.accordionPartSelect=accordionPartSelect
      }else{
        editorFieldSelect.style.marginRight=`${this.value}px`
        updateStyle(editorFieldSelect)
        globals.editorFieldSelect=editorFieldSelect
      }
    }else if(carouselSelect){
      carouselSelect.style.marginRight=`${this.value}px`
      updateStyle(carouselSelect)
      globals.carouselSelect=carouselSelect
    }
  })

  document.getElementById('margin-field-top').addEventListener('keyup', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    carouselSelect = globals.carouselSelect
    if(editorFieldSelect){
      if(editorFieldSelect.id === 'heading-text'){
        accordionPartSelect.style.marginTop=`${this.value}px`
        updateStyle(accordionPartSelect)
        globals.accordionPartSelect=accordionPartSelect
      }else{
        editorFieldSelect.style.marginTop=`${this.value}px`
        updateStyle(editorFieldSelect)
        globals.editorFieldSelect=editorFieldSelect
      }
    }else if(carouselSelect){
      carouselSelect.style.marginTop=`${this.value}px`
      updateStyle(carouselSelect)
      globals.carouselSelect=carouselSelect
    }
  })

  document.getElementById('margin-field-bottom').addEventListener('keyup', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    carouselSelect = globals.carouselSelect
    if(editorFieldSelect){
      if(editorFieldSelect.id === 'heading-text'){
        accordionPartSelect.style.marginBottom=`${this.value}px`
        updateStyle(accordionPartSelect)
        globals.accordionPartSelect=accordionPartSelect
      }else{
        editorFieldSelect.style.marginBottom=`${this.value}px`
        updateStyle(editorFieldSelect)
        globals.editorFieldSelect=editorFieldSelect
      }
    }else if(carouselSelect){
      carouselSelect.style.marginBottom=`${this.value}px`
      updateStyle(carouselSelect)
      globals.carouselSelect=carouselSelect
    }
  })
}
// --------------- Color ---------------
function colorBackgroundField(){
  document.getElementById('color-field-input').addEventListener('change', function(){
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    carouselSelect = globals.carouselSelect
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
          let Style = item.style.cssText
          if(Style.includes('background-image')){
            let urlPart = '';
            const match = Style.match(/url\((['"]?)(.*?)\1\)/i);
            if (match) {
              urlPart = match[2]; // isi di dalam url(...)
            }

            item.style.backgroundImage = `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}), 
                        rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})), 
                        url(${urlPart})`

          }else{

            item.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`

          }
          updateStyle(item)

        }else{
          let styleItem = item.children[1]
          styleItem.style.backgroundColor=`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
          updateStyle(item)
        }
      })

      if(fieldEditor.dataset.textPosition === 'on-image'){
        document.querySelectorAll('[id^="edit-item-carousel-"]').forEach(item =>{
          let Style = item.style.cssText

          if(Style.includes('background-image')){
            let urlPart = '';

            const match = Style.match(/url\((['"]?)(.*?)\1\)/i);
            if (match) {
              urlPart = match[2]; // isi di dalam url(...)
            }

            // let newStyle = setInlineStyle(Style, 'background-image', 
            //             `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}), 
            //             rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})), 
            //             url(${urlPart})`);
            // item.setAttribute('style', newStyle)

            item.style.backgroundImage=`linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}), 
                        rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})), 
                        url(${urlPart})`

          }else{
            // let newStyle = setInlineStyle(Style, 'background-color', 
            //             `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`);
            // item.setAttribute('style', newStyle)

            item.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
          }
        })
      }
      // console.log('tipe 2')
      globals.carouselSelect=carouselSelect
    }else{
      let Style = fieldEditor.style.cssText
      if(Style.includes('background-image')){
        let urlPart = '';

        const match = Style.match(/url\((['"]?)(.*?)\1\)/i);
        if (match) {
          urlPart = match[2]; // isi di dalam url(...)
        }

        // let newStyle = setInlineStyle(Style, 'background-image', 
        //             `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}), 
        //             rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})), 
        //             url(${urlPart})`);
        // fieldEditor.setAttribute('style', newStyle)

        fieldEditor.style.backgroundImage=`linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}), 
                    rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})), 
                    url(${urlPart})`

      }else{
        // let newStyle = setInlineStyle(Style, 'background-color', 
        //                               `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`);
        // fieldEditor.setAttribute('style', newStyle)

        fieldEditor.style.backgroundColor=`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`

      }
      if(editorFieldSelect.id === 'heading-text'){
        globals.accordionPartSelect=accordionPartSelect
      }else{
        globals.editorFieldSelect=editorFieldSelect
      }
      updateStyle(fieldEditor)
    }
  })

  document.getElementById('bg-color-opacity').addEventListener('change', function(){
    const colorPicker = document.getElementById('color-field-input').value;
    const rgb = hexToRgb(colorPicker);

    let fieldEditor
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect
    carouselSelect = globals.carouselSelect

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
          let Style = item.style.cssText
          if(Style.includes('background-image')){
            let urlPart = '';

            const match = Style.match(/url\((['"]?)(.*?)\1\)/i);
            if (match) {
              urlPart = match[2]; // isi di dalam url(...)
            }
            item.style.backgroundImage = `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value}), 
                        rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})), 
                        url(${urlPart})`

          }else{
            item.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})`
          }
          updateStyle(item)
        }else{
          let styleItem = item.children[1]
          styleItem.style.backgroundColor=`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})`
          updateStyle(item)
        }
      })

      if(fieldEditor.dataset.textPosition === "on-image"){
        document.querySelectorAll('[id^="edit-item-carousel-"]').forEach(item =>{
          let Style = item.style.cssText
          if(Style.includes('background-image')){
            let urlPart = '';

            const match = Style.match(/url\((['"]?)(.*?)\1\)/i);
            if (match) {
              urlPart = match[2]; // isi di dalam url(...)
            }

            item.style.backgroundImage=`linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value}), 
                        rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})), 
                        url(${urlPart})`

          }else{
            item.style.backgroundColor=`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})`
          }
        })
      }
      globals.carouselSelect=carouselSelect

    }else{
      let Style = fieldEditor.style.cssText
      if(Style.includes('background-image')){
        console.log('ada bgImage')
        let urlPart = '';

        const match = Style.match(/url\(([^)]+)\)/i);
        if (match) {
          urlPart = match[1].trim().replace(/^['"]|['"]$/g, '');
        }

        fieldEditor.style.backgroundImage=`linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value}), 
                        rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})), 
                        url(${urlPart})`

      }else{
        fieldEditor.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.value})`

      }
      updateStyle(fieldEditor)
      if(editorFieldSelect.id === 'heading-text'){
        globals.accordionPartSelect=accordionPartSelect
      }else{
        globals.editorFieldSelect=editorFieldSelect
      }
    }

  })

  document.getElementById('bg-image-input').addEventListener('change', function () {
    document.getElementById('loading-overlay').style.display = 'flex';
    const previewImageField = document.getElementById('preview-image');
    const nameFile = document.getElementById('file-name-display');

    const file = this.files[0];
    const maxFileSize = 5 * 1024 * 1024; // 5 MB
    console.log(file.size)
    if (!file || !file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        document.getElementById('loading-overlay').style.display = 'none';
        return;
    }

    if (file.size > maxFileSize) {
        alert('Ukuran file terlalu besar. Maksimal 5MB.');
        document.getElementById('loading-overlay').style.display = 'none';
        return;
    }

    let fieldEditor
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect

    if(editorFieldSelect && editorFieldSelect.id === 'heading-text'){
      fieldEditor = accordionPartSelect
    }else{
      fieldEditor = editorFieldSelect
    }
    console.log(fieldEditor)

    if (file && file.type.startsWith('image/')) {
      new Compressor(file, {
        quality: 0.7,
        maxWidth: 1920,
        convertSize: 0,

        async success(result) {
          // STEP 1 — hasil compress (JPEG/PNG compressed)
          try{
            const compressedFile = new File([result], file.name, {
                type: result.type
            });

            // STEP 2 — convert ke WebP
            const compressedWebP = await compressToWebP(compressedFile, 0.7);

            console.log("Original:", (file.size/1024).toFixed(1),"KB");
            console.log("Compressed:", (compressedWebP.size/1024).toFixed(1),"KB");
            // =============== PREVIEW ===============
            const blob = URL.createObjectURL(compressedWebP);
            const imgUrl = `url(${blob})`;

            // Tampilkan nama file pendek
            let fileName = file.name;
            const maxLength = 20;
            if (fileName.length > maxLength) {
              const ext = fileName.split('.').pop();
              fileName = fileName.substring(0, maxLength - ext.length - 3) + '...' + ext;
            }
            nameFile.textContent = fileName;

            fieldEditor.dataset.nameBg = fileName
            fieldEditor.style.backgroundSize='cover'
            fieldEditor.style.backgroundPosition='center'

            previewImageField.src = blob;
            previewImageField.classList.remove('hidden');

            let styleEditor = fieldEditor.style.cssText

            if (!styleEditor.includes('linear-gradient')) {
              const styleAttr = fieldEditor.style.cssText || '';
              let rgb = 'rgba(0,0,0,0)'
              const match = styleAttr.match(/background-color\s*:\s*([^;]+);?/i);
              if (match) {
                rgb = match[1].trim();
              }
              
              fieldEditor.style.backgroundColor=''
              fieldEditor.style.backgroundImage=`linear-gradient(${rgb}, ${rgb}), url(${blob})`

            } else if (styleEditor.includes('linear-gradient')) {
              let rgba = '';
              let styleAttr = fieldEditor.style.cssText
              // console.log('styleAttr:',styleAttr, fieldEditor.getAttribute('style'))
              const match = styleAttr.match(/linear-gradient\(([^)]+)\)/i);
              if (match) {
                rgba = match[1].trim();
              }

              fieldEditor.style.backgroundColor=''
              fieldEditor.style.backgroundImage = `linear-gradient(${rgba})), url(${blob})`
              console.log('after set attr:',fieldEditor.getAttribute('style'), fieldEditor.style.cssText)
              
              console.log('ada includes')

            } else {
              fieldEditor.style.backgroundColor=''
              fieldEditor.style.backgroundImage = `url(${blob})`
              console.log('gk tau')
            }

            document.getElementById('btn-reset-bg-image').parentElement.classList.remove('hidden')
            updateStyle(fieldEditor,'bg-image', compressedWebP)

            if(editorFieldSelect && editorFieldSelect.id === 'heading-text'){
              globals.accordionPartSelect=accordionPartSelect
            }else{
              globals.editorFieldSelect=editorFieldSelect
            }
            document.getElementById('loading-overlay').style.display = 'none';

          }catch(err){
            console.error(err);
            alert("Gagal memroses gambar");
            document.getElementById('loading-overlay').style.display = 'none';

          }
        }
      })
    } else {
      previewImageField.src = '';
      previewImageField.classList.add('hidden');
      alert('Please select a valid image file.');
    }
    this.value=''
  });

  document.getElementById('bg-image-carousel').addEventListener('change', function (e) {
    document.getElementById('loading-overlay').style.display = 'flex';
    const file = this.files[0];
    const maxFileSize = 5 * 1024 * 1024; // 5 MB
    console.log(file.size)
    if (!file || !file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        document.getElementById('loading-overlay').style.display = 'none';
        return;
    }

    if (file.size > maxFileSize) {
        alert('Ukuran file terlalu besar. Maksimal 5MB.');
        document.getElementById('loading-overlay').style.display = 'none';
        return;
    }

    new Compressor(file, {
      quality: 0.7,
      maxWidth: 1920,
      convertSize: 0,

      async success(result) {
        try{
          const compressedFile = new File([result], file.name, {
              type: result.type
          });
  
          // STEP 2 — convert ke WebP
          const compressedWebP = await compressToWebP(compressedFile, 0.7);
  
          console.log("Original:", (file.size/1024).toFixed(1),"KB");
          console.log("Compressed:", (compressedWebP.size/1024).toFixed(1),"KB");
  
          // =============== PREVIEW ===============
          const blob = URL.createObjectURL(compressedWebP);
          const imgUrl = `url(${blob})`;
  
          // --------------------------------------------------
          // =================== kode asli kamu
          // --------------------------------------------------
          const editCarouselItem = globals.editCarouselItem;
          const editId = editCarouselItem.id.split('-').slice(1).join('-');
          const carouselItem = document.getElementById(editId);
  
          // ambil RGBA lama
          const currentStyle = editCarouselItem.style.cssText || '';
          let rgbaPart = 'rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)';
  
          const gradientMatch = currentStyle.match(/linear-gradient\(([^)]+)\)/);
          if (gradientMatch && gradientMatch[1]) {
            rgbaPart = gradientMatch[1].trim();
          } else {
            const bgColorMatch = currentStyle.match(/background-color:\s*([^;]+)/);
            if (bgColorMatch && bgColorMatch[1]) {
              rgbaPart = `${bgColorMatch[1].trim()}, ${bgColorMatch[1].trim()}`;
            }
          }
          console.log(currentStyle, compressedWebP.name, rgbaPart)
  
          // tampilkan nama file
          let fileName = compressedWebP.name;
          if (fileName.length > 20) {
              const ext = fileName.split('.').pop();
              fileName = fileName.substring(0, 20 - ext.length - 3) + '...' + ext;
          }
  
          editCarouselItem.dataset.nameBg = fileName;
          carouselItem.dataset.nameBg = fileName;
  
          const carousel = document.getElementById(
              carouselItem.id.split('-').slice(1, -1).join('-')
          );
  
          const bgValue = `linear-gradient(${rgbaPart})), ${imgUrl}`;
  
          if (carousel.dataset.textPosition === 'on-image') {
            console.log('on-image bg-image:',editCarouselItem, carouselItem, `linear-gradient(${rgbaPart}), ${imgUrl}`)
            if(carouselItem.style.cssText.includes('background-color')){
              editCarouselItem.style.backgroundImage=`linear-gradient(${rgbaPart}), ${imgUrl}`
              carouselItem.style.backgroundImage=`linear-gradient(${rgbaPart}), ${imgUrl}`
            }else{
              editCarouselItem.style.backgroundImage=bgValue
              carouselItem.style.backgroundImage=bgValue
            }
            console.log('after on-image bg-image:','-',editCarouselItem,':',editCarouselItem.style.backgroundImage,'-',carouselItem,':',carouselItem.style.backgroundImage,`-linear-gradient(${rgbaPart}), ${imgUrl}`)
            
          } else {
            carouselItem.querySelector('img').src = blob;
            editCarouselItem.style.backgroundImage=`linear-gradient(${rgbaPart}), ${imgUrl}`
            console.log(editCarouselItem, bgValue)
          }
          editCarouselItem.style.backgroundColor=''
          carouselItem.style.backgroundColor=''
  
          // === kirim file hasil compress, bukan original ===
          updateStyle(carouselItem, 'bg-image', compressedWebP, carousel.dataset.textPosition);
          
          globals.editCarouselItem = editCarouselItem;
          carousel.click();
          document.getElementById('loading-overlay').style.display = 'none';
        }catch(err){
          console.error(err);
          alert("Gagal memroses gambar");
          document.getElementById('loading-overlay').style.display = 'none';
        }
          // STEP 1 — hasil compress (JPEG/PNG compressed)
      },

      error(err) {
          console.error('Compress failed:', err);
          alert('Gagal compress gambar');
      }
  });

  this.value = "";

  });

  document.querySelectorAll('[name="bg-image-size"]').forEach(bgImageSize =>{
    bgImageSize.addEventListener('click', function(){
      // console.log('image sizer')
      
      let fieldEditor
      editorFieldSelect = globals.editorFieldSelect
      accordionPartSelect = globals.accordionPartSelect

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
      if(editorFieldSelect.id === 'heading-text'){
        globals.accordionPartSelect=accordionPartSelect
      }else{
        globals.editorFieldSelect=editorFieldSelect
      }
    })
  })

  document.getElementById("btn-reset-bg-image").addEventListener('click', function(event){
    editorFieldSelect = globals.editorFieldSelect
    webpageDb=globals.webpageDb
    let styleField = editorFieldSelect.style.cssText; // ambil sebagai string

    if (styleField && styleField.includes("background-image")) {
      // Ambil nilai rgba(...)
      let match = styleField.match(/rgba?\([^)]+\)/);
      let rgba = match ? match[0] : "transparent";

      // Replace background-image:... dengan background-color:rgba(...)
      editorFieldSelect.style.backgroundImage=""
      editorFieldSelect.style.backgroundColor=rgba
      let editorStyle=''
      if(editorFieldSelect.id.startsWith('webpage')){
        editorStyle=editorFieldSelect.querySelector('[id^="editor-container"]').style.cssText
      }
      let mediaDelete=''
      // Update ke database
      webpageDb = webpageDb.map(field => {
        if (field.id === editorFieldSelect.id) {
          const match = field.style.match(/url\((['"]?)(.*?)\1\)/);
          if (match) {
            mediaDelete =match[2]
          }
          field.style = editorFieldSelect.style.cssText + editorStyle;
          field.action =updateActionProperty(field.action, 'update');
          
        }
        return field;
      });

      const checkUsedMedia = webpageDb.some(el => {
        if (el.id === editorFieldSelect.id) return false; // skip elemen yg sedang kita proses

        const style = el.style || "";
        const content = el.content || "";

        return style.includes(mediaDelete) || 
              content.includes(mediaDelete)
      });

      if (mediaDelete && !checkUsedMedia) {
        webpageDb = webpageDb.filter(el => el.id !== mediaDelete);
      }

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
    document.getElementById('bg-image-input').value = '';
    globals.webpageDb=webpageDb
  })
}
// -------------- BORDER WAVE ----------
function borderWave() {
  webpageDb=globals.webpageDb
  editorFieldSelect=globals.editorFieldSelect
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

    if(svg.id.startsWith('border-wave')){
      svg.querySelectorAll('path').forEach(path => {
        path.setAttribute('fill', color);
      });

      webpageDb.forEach(field=>{
        if(field.id === svg.id){
          field.action='update'
          field.style = svg.outerHTML
        }
      })
      globals.webpageDb=webpageDb
    }
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
    svgClone.setAttribute('style', `z-index: 50; ${position}: 0; position: absolute;`);
    svgClone.setAttribute('class', '');

    if (position === 'top') {
      flipPathVertically(svgClone,position);
    }

    applyColorToSVG(svgClone, currentWaveColor);
    return svgClone;
  };

  function flipPathVertically(svgElement, position) {
    const viewBox = svgElement.getAttribute('viewBox'); // contoh: "0 0 1440 320"
    if (!viewBox) return;

    webpageDb=globals.webpageDb
    editorFieldSelect = globals.editorFieldSelect
    accordionPartSelect = globals.accordionPartSelect

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

    webpageDb.forEach(field=>{
      if(field.id === svgElement.id){
        field.action='update'
        field.style = svgElement.outerHTML
      }
    })
    globals.webpageDb=webpageDb
  }

  const updateSectionWithWave = (waveId, position) => {
    editorFieldSelect=globals.editorFieldSelect
    webpageDb=globals.webpageDb

    const svgClone = getClonedSVG(waveId, position);
    if (!svgClone){
      console.log('SVG tidak ditemukan untuk id:', waveId);
    }

    // Hapus SVG lama
    editorFieldSelect.querySelectorAll('svg').forEach(svg => {
      if(svg.id.startsWith('border-wave')){
        svg.remove()
      }
    });
    console.log(position)
    svgClone.id = `border-wave-${position}-section-${editorFieldSelect.id.split('-')[2]}`;

    let color = document.getElementById('border-wave-color').value
    svgClone.querySelector('path').setAttribute('fill', color)

    editorFieldSelect.appendChild(svgClone);

    const existingIndex = webpageDb.findIndex(page => 
      page.id.startsWith('border-wave-') 
      && (page.id.split('-').find(part => !isNaN(part)) 
      === svgClone.id.split('-').find(part => !isNaN(part)))
    );

    if (existingIndex !== -1) {
      // kalau sudah ada → update style
      webpageDb[existingIndex].action =  updateActionProperty(webpageDb[existingIndex].action, 'delete');
    }
      // kalau belum ada → push baru
    webpageDb.push({
      id: svgClone.id,
      type: 'border-wave',
      action: 'new-add',
      style: svgClone.outerHTML,
    });
    
    console.log(webpageDb)
    globals.webpageDb=webpageDb
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
      editorFieldSelect=globals.editorFieldSelect
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
    editorFieldSelect=globals.editorFieldSelect
    webpageDb=globals.webpageDb
    console.log(editorFieldSelect)
    editorFieldSelect.querySelectorAll('svg').forEach(svg => {
      if(!svg.id.startsWith('btn')){
        // console.log(svg)
        applyColorToSVG(svg, currentWaveColor);

        webpageDb.map(page=>{
          if(page.id === svg.id){
            page.style= svg.outerHTML
            page.action= updateActionProperty(page.action, 'update')
          }
        })
        // console.log(webpageDb)
      }
    });
    globals.webpageDb=webpageDb
  });

  document.getElementById('apply-border-wave-svg').addEventListener('click', function () {
    const svgText = sanitizeSVG(document.getElementById('border-wave-svg').value);
    editorFieldSelect = globals.editorFieldSelect
    webpageDb = globals.webpageDb
    editorFieldSelect.querySelectorAll('svg').forEach(svg => {
      if(svg.id.startsWith('border-wave')){
        svg.remove()
      }
    });

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
          page.action= updateActionProperty(page.action, 'update')
        }
      })
      // console.log(webpageDb)
      globals.webpageDb=webpageDb
      globals.editorFieldSelect=editorFieldSelect

    } else {
      alert('SVG tidak valid!');
    }
  });

  document.getElementById('btn-reset-border-wave').addEventListener('click', function(){
    editorFieldSelect=globals.editorFieldSelect
    webpageDb=globals.webpageDb

    let borderWave = editorFieldSelect.querySelector('[id^="border-wave"]')
    borderWave.remove()

    webpageDb.forEach((field,index)=>{
      console.log(field)
      if(field.id == borderWave.id){
        if(field && field.action?.includes('new')){
          field.splice(index,1)
        }else{
          field.action='delete'
        }
      }
    })
  })
}

function resetImage(idParts){
  let editCarouselItem = globals.editCarouselItem
  webpageDb = globals.webpageDb
  let bodyItem=globals.bodyItem
  let carouselItem = document.getElementById(`${idParts.slice(2).join('-')}`)
  editCarouselItem = document.getElementById(`edit-${idParts.slice(2).join('-')}`) 

  bodyItem = editCarouselItem.parentElement.parentElement
  let styleField = carouselItem.getAttribute("style"); // ambil sebagai string

  if (styleField && styleField.includes("background-image")) {
    // Ambil nilai rgba(...)
    let match = styleField.match(/rgba?\([^)]+\)/);
    let rgba = match ? match[0] : "transparent";

    // Set kembali ke elemen
    carouselItem.style.backgroundImage=''
    editCarouselItem.style.backgroundImage=''
    carouselItem.style.backgroundColor=rgba
    editCarouselItem.style.backgroundColor=rgba

    let mediaDelete=''
    webpageDb = webpageDb.flatMap(field => {
      if (field.id === carouselItem.id) {
        const match = field.style.match(/url\((['"]?)(.*?)\1\)/);
        if (match) {
          mediaDelete =match[2]
        }
        return [{ ...field, style: carouselItem.style.cssText }];
      }
      return [field];
    });

    const checkUsedMedia = webpageDb.some(el => {
      if (el.id === carouselItem.id) return false; // skip elemen yg sedang kita proses

      const style = el.style || "";
      const content = el.content || "";

      return style.includes(mediaDelete) || 
            content.includes(mediaDelete)
    });

    if (mediaDelete && !checkUsedMedia) {
      webpageDb = webpageDb.filter(el => el.id !== mediaDelete);
    }

    console.log(webpageDb)
    globals.webpageDb=webpageDb
  } else {
    carouselItem.style.backgroundColor = "";
  }
}
export { fontStylingField, widthHeightField, borderField, paddingMarginField, colorBackgroundField, borderWave, flexPosition, resetImage }