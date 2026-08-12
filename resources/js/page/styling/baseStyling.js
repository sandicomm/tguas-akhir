// ======== GLOBALS =========
import { globals } from '../globals.js';

// ======== LOADWEBPAGE ========
import {findParentWidth,storeOriginalSize} from '../../loadWebpage.js';

// ======== UTILITIES =========
import { updateContent, updateActionProperty } from '../utils/updateContent.js';
import { parseStyleObj, stringifyStyleObj } from '../utils/baseStyleObj.js';
import { updateStylingControls, isLightColor } from './stylingControls.js';
// ======== Validation get element ==========
import { getEl } from '../utils/validationGetElement.js';

// ======== GLOBAL VARIABLE ASSIGNMENT =========
let webpageDb = globals.webpageDb,
  fileDb = globals.file,
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

function updateStyle(editorFieldSelect, indicator, file, indicatorCarousel, url, uniqueKey){
  webpageDb = globals.webpageDb
  fileDb = globals.file

  let mediaDelete=null
  let id

  if(editorFieldSelect.id.startsWith('btn-modal-')){
    id=editorFieldSelect.id.split('-').slice(1).join('-')
  }else if(editorFieldSelect.id.startsWith('parent-modal-')){
    id=`body-${editorFieldSelect.id.split('-').slice(1).join('-')}`
  }else{
    id=editorFieldSelect.id
  }
  
  webpageDb.some(item=>{
    if(item.id === id){
      if(indicator === 'bg-image'){
        if(indicatorCarousel === 'on-image'){
          let style = editorFieldSelect.style.cssText

          if(style.includes('background-color')){
            style = style.replace(/background-color:\s*[^;]+;/, '');
          }

          const match = item.style.match(/url\((['"]?)(.*?)\1\)/);
          if (match) {
            mediaDelete = match[2]
          }

          style = style.replace(
            /url\((['"]?)([^'")]+)\1\)/gi,
            `url('${uniqueKey}')`
          );

          item.style=style
          if(url){
            fileDb.push({
              id:uniqueKey,
              type:'file',
              filetype:'img',
              action:'add',
              file:file,
              url:url
            })
          }

        }else if(indicatorCarousel === 'below-image'){
          let imgTextOnImage = webpageDb.find(field => field.id===`img-text-on-image-${item.id}`)
          if(file){
            mediaDelete = imgTextOnImage.content
    
            if(url){
              fileDb.push({
                id:uniqueKey,
                type:'file',
                filetype:'img',
                action:'add',
                file:file,
                url:url
              })
            }

            imgTextOnImage.content=uniqueKey
            imgTextOnImage.action=updateActionProperty(imgTextOnImage.action, 'update')
          }

          let style = editorFieldSelect.children[1]
          let bgColor = style.style.backgroundColor
          item.style = `background-color: ${bgColor};`;
          id=`img-text-on-image-${item.id}`
        }else{
          // Ambil style awal
          let style = editorFieldSelect.style.cssText || '';
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

          if(url){
            fileDb.push({
              id:uniqueKey,
              type:'file',
              filetype:'img',
              file:file,
              action:'add',
              url:url
            })
          }else{
            fileDb.push({
              id:uniqueKey,
              type:'file',
              action:'add',
              filetype:'img',
              file:file,
            })
          }
        }

      }else{

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
          if(id.startsWith('item-carousel')){
       
            let baseStyle = editorFieldSelect.style.cssText
            if(editorFieldSelect.querySelector('[id^="img-text"]')){
          
              baseStyle = editorFieldSelect.children[1].style.cssText
            }
            let oldUrl = null;
  
            let urlMatch = (item.style || '').match(/url\(['"]?([^'")]+)['"]?\)/);
            if (urlMatch) oldUrl = urlMatch[1];
       
  
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
         
  
            if (oldUrl) {
              baseStyle = baseStyle.replace(
                /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
                `url(${oldUrl})`
              );
            }
  
            if (editorFieldSelect.id.startsWith('webpage')) {
              let styleEditor = editorFieldSelect.querySelector('[id^="editor"]');
              let styleEditorAttr = styleEditor ? styleEditor.style.cssText : '';
              item.style = styleEditorAttr + baseStyle;

            } else {
              item.style = baseStyle;
            }
          }
        }
      }
      item.action=updateActionProperty(item.action, 'update')
      return true
    }
  })

  const checkUsedMedia = webpageDb.some(el => {
    if (el.id === id) return false; // skip elemen yg sedang kita proses

    const style = el.style || "";
    const content = el.content || "";

    return style.includes(mediaDelete) || 
          content.includes(mediaDelete)
  });

  const target = fileDb.find(el => el.id === mediaDelete);
  if (target && !checkUsedMedia) {
    delete target.action;
  }

  globals.isFormDirty = true
  globals.webpageDb=webpageDb
  globals.file=fileDb
}
// ------- Font Styling --------
function fontStylingField(){
  document.getElementById('heading-text').addEventListener('keyup', function () {
    editorFieldSelect = globals.editorFieldSelect

    if(editorFieldSelect.id.startsWith('section-accordion')){
      const heading = document.getElementById(`btn-heading-${editorFieldSelect.id.split('-').slice(1,-1).join('-')}`)
      if(!heading){
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: 'heading styling tidak ditemukan', status:false} 
        }));

        return
      }

      heading.children[0].innerHTML = this.innerHTML
      updateContent(heading)
    }else{
      editorFieldSelect.children[0].innerHTML = this.innerHTML;
      updateContent(editorFieldSelect)
    }

    globals.editorFieldSelect=editorFieldSelect
  });

  document.getElementById('font-color-input').addEventListener('change', function () {
    editorFieldSelect = globals.editorFieldSelect
    savedSelection = globals.savedSelection

    if(!editorFieldSelect.id?.startsWith('section-accordion')){
      let headingTextWrapper = document.getElementById('heading-text-wrapper')
      let headingText = document.getElementById('heading-text')
  
      const sel = window.getSelection();
   
      let fontField = null
      if(headingTextWrapper.classList.contains('hidden')){
        fontField = editorFieldSelect
      }else{
        fontField = document.getElementById('heading-text')
      }
    
      if (savedSelection) {
        sel.removeAllRanges();
        sel.addRange(savedSelection);
    
        let range = sel.getRangeAt(0);
    
        const startInside = fontField.contains(range.startContainer.nodeType === 3 ? range.startContainer.parentNode : range.startContainer);
        const endInside = fontField.contains(range.endContainer.nodeType === 3 ? range.endContainer.parentNode : range.endContainer);
    
        if (startInside && endInside && !range.collapsed) {
          fontField.dataset.fieldFontColor = this.value;
  
          if(!(headingTextWrapper.classList.contains('hidden'))){
            editorFieldSelect.dataset.fieldFontColor = this.value;
            let bgColor = isLightColor(this.value) ? '#000000' : '#ffffff';
            headingText.style.backgroundColor = bgColor;
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
  
          if(!(headingTextWrapper.classList.contains('hidden'))){
            editorFieldSelect.dataset.fieldFontColor = this.value;
            let bgColor = isLightColor(this.value) ? '#000000' : '#ffffff';
            headingText.style.backgroundColor = bgColor;
          }
  
          document.execCommand('foreColor', false, this.value);
  
          const listItems = editorFieldSelect.querySelectorAll('li');
          if(listItems && fontField.id.startsWith('field-')){
            listItems.forEach(li => {
              li.style.color=this.value;
            });
          }
    
          // Optional: hapus seleksi biar gak kelihatan disorot
          selection.removeAllRanges();
        }
  
        if(!fontField.id.startsWith('field-')){
          editorFieldSelect.children[0].innerHTML = fontField.innerHTML;
        }
        updateContent(editorFieldSelect)
        globals.editorFieldSelect = editorFieldSelect
      } else {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: 'Tidak ada seleksi tersimpan', status:false} 
        }));
      }
    }
  });

  document.getElementById('font-family').addEventListener('change', function () {
    editorFieldSelect = globals.editorFieldSelect
    savedSelection = globals.savedSelection
    const sel = window.getSelection();

    if(!editorFieldSelect.id.startsWith('section-accordion')){
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
              li.style.fontFamily=this.value;
            });
          }

          // Optional: hapus seleksi biar gak kelihatan disorot
          selection.removeAllRanges();
        }

        if(!fontField.id.startsWith('field-')){
          editorFieldSelect.children[0].innerHTML = fontField.innerHTML;
        }

        updateContent(editorFieldSelect)
        globals.editorFieldSelect=editorFieldSelect
      } else {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: `tidak ada seleksi tersimpan`, status:false} 
        }));
      }
    }
  })

  document.getElementById('font-size').addEventListener('change', function () {
    editorFieldSelect = globals.editorFieldSelect
    savedSelection = globals.savedSelection
    const sel = window.getSelection();
  
    if(!editorFieldSelect.id.startsWith('section-accordion')){
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
          fontField.dataset.fieldFontSize = this.value;
          globals.originalSizes[editorFieldSelect.id].fontSize.value = this.value

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
          globals.originalSizes[editorFieldSelect.id].fontSize.value = this.value

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
              li.style.fontSize=sizePx;
            });
          }
          
          // Optional: hapus seleksi biar gak kelihatan disorot
          selection.removeAllRanges();
        }

        if(!fontField.id.startsWith('field-')){
          editorFieldSelect.children[0].innerHTML = fontField.innerHTML;
        }
        updateContent(editorFieldSelect)
        globals.editorFieldSelect=editorFieldSelect
      } else {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: `tidak ada seleksi tersimpan`, status:false} 
        }));
      }
    }
  })

  document.getElementById('font-bold').addEventListener('click', function () {
    editorFieldSelect = globals.editorFieldSelect
    savedSelection = globals.savedSelection
    const sel = window.getSelection();
  
    if(!editorFieldSelect.id.startsWith('section-accordion')){
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
              li.style.fontWeight=this.value;
            });
          }

          // Optional: hapus seleksi biar gak kelihatan disorot
          selection.removeAllRanges();
        }

        if(!fontField.id.startsWith('field-')){
          editorFieldSelect.children[0].innerHTML = fontField.innerHTML;
        }

        updateContent(editorFieldSelect)
        globals.editorFieldSelect=editorFieldSelect
      } else {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: `tidak ada seleksi tersimpan`, status:false} 
        }));
      }
    }
  })
  
  document.getElementById('font-italic').addEventListener('click', function () {
    editorFieldSelect = globals.editorFieldSelect
    savedSelection = globals.savedSelection
    const sel = window.getSelection();

    if(!editorFieldSelect.id.startsWith('section-accordion')){
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
              li.style.fontStyle= this.value;
            });
          }

          // Optional: hapus seleksi biar gak kelihatan disorot
          selection.removeAllRanges();
        }

        if(!fontField.id.startsWith('field-')){
          editorFieldSelect.children[0].innerHTML = fontField.innerHTML;
        }

        updateContent(editorFieldSelect)
        globals.editorFieldSelect=editorFieldSelect
      } else {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: `tidak ada seleksi tersimpan`, status:false} 
        }));
      }
    }
  })
  
  document.getElementById('font-underline').addEventListener('click', function () {
    editorFieldSelect = globals.editorFieldSelect
    savedSelection = globals.savedSelection
    const sel = window.getSelection();
  
    if(!editorFieldSelect.id.startsWith('section-accordion')){
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
          editorFieldSelect.children[0].innerHTML = fontField.innerHTML;
        }

        updateContent(editorFieldSelect)
        globals.editorFieldSelect=editorFieldSelect
      } else {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: `tidak ada seleksi tersimpan`, status:false} 
        }));
      }
    }
  })
  
  document.getElementById('font-left').addEventListener('click', function () {
    editorFieldSelect = globals.editorFieldSelect
    const sel = window.getSelection();

    if(!editorFieldSelect.id.startsWith('section-accordion')){
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
        } else {
          const range = document.createRange();
          range.selectNodeContents(fontField);
    
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
    
          // Terapkan warna ke seluruh teks dalam fontField
          document.execCommand('justifyLeft');
        }

        if(!fontField.id.startsWith('field-')){
    
          editorFieldSelect.children[0].innerHTML = fontField.innerHTML;
        }

        updateContent(editorFieldSelect)
        globals.editorFieldSelect=editorFieldSelect
      }else{
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: `tidak ada seleksi tersimpan`, status:false} 
        }));
      }
    }
  })
  
  document.getElementById('font-right').addEventListener('click', function () {
    editorFieldSelect = globals.editorFieldSelect
    const sel = window.getSelection();

    if(!editorFieldSelect.id.startsWith('section-accordion')){
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
        } else {
          const range = document.createRange();
          range.selectNodeContents(fontField);
    
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
    
          // Terapkan warna ke seluruh teks dalam editorFieldSelect
          document.execCommand('justifyRight');
    
        }
        
        if(!fontField.id.startsWith('field-')){
      
          editorFieldSelect.children[0].innerHTML = fontField.innerHTML;
        }

        updateContent(editorFieldSelect)
        globals.editorFieldSelect=editorFieldSelect
      }else{       
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: `tidak ada seleksi tersimpan`, status:false} 
        }));
      }
    }
  })
  
  document.getElementById('font-center').addEventListener('click', function () {
    const sel = window.getSelection();

    editorFieldSelect = globals.editorFieldSelect

    if(!editorFieldSelect.id.startsWith('section-accordion')){

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
        }

        if(!fontField.id.startsWith('field-')){
          editorFieldSelect.children[0].innerHTML = fontField.innerHTML;
        }
        
        updateContent(editorFieldSelect)
        globals.editorFieldSelect=editorFieldSelect
      }else{
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: `tidak ada seleksi tersimpan`, status:false} 
        }));
      }
    }
  })
  
  document.getElementById('font-justify').addEventListener('click', function () {
    editorFieldSelect = globals.editorFieldSelect
    const sel = window.getSelection();

    if(!editorFieldSelect.id.startsWith('section-accordion')){
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
          document.execCommand('justifyFull');

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
        }
        
        if(!fontField.id.startsWith('field-')){
          editorFieldSelect.children[0].innerHTML = fontField.innerHTML;
        }

        updateContent(editorFieldSelect)
      }else{

        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: `tidak ada seleksi tersimpan`, status:false} 
        }));
      }
      globals.editorFieldSelect=editorFieldSelect
    }
  })

  document.getElementById('font-order-list').addEventListener('click', function () {
    editorFieldSelect = globals.editorFieldSelect
    const ol = document.createElement('ol'); // or 'ul' for unordered list
    const li = document.createElement('li');

    if(!editorFieldSelect.id.startsWith('section-accordion')){
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
    }
  });

  document.getElementById('font-unorder-list').addEventListener('click', function () {
    editorFieldSelect = globals.editorFieldSelect
    const ul = document.createElement('ul'); // or 'ul' for unordered list
    const li = document.createElement('li');

    if(!editorFieldSelect.id.startsWith('section-accordion')){
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
    }
  });
}
// -------- Box Field Styling -----------
let originalSizes = globals.originalSizes

function widthHeightField(){
  document.getElementById('width-field').addEventListener('keyup', function(event){
    editorFieldSelect = globals.editorFieldSelect
    accordionSelect = globals.accordionSelect
    carouselSelect = globals.carouselSelect

    let parentElement
    let width,padding

    if(editorFieldSelect){
      if(accordionSelect){
        if(Object.keys(originalSizes).length === 0){
          storeOriginalSize()
        }

        let parent = findParentWidth(accordionSelect)
        if(!parent) return
        //console.log(accordionSelect)
        let styling =parent.styling

        width = parent.width
        padding = parseInt(styling.paddingLeft)+parseInt(styling.paddingRight)
        let actualWidth = width-padding

        // set width tidak lebih dari parent
        if(parseInt(this.value) >= actualWidth){
          this.value = actualWidth
        }

        // set width jika child melebihi parent
        let sectionAcc=accordionSelect.querySelectorAll('[id^="section-"]')
  
        accordionSelect.style.width=`${this.value}px`
        globals.originalSizes[accordionSelect.id].width =`${this.value}px`;
        
        if(sectionAcc){
          sectionAcc.forEach(sec=>{
      
            let parentAcc = getEl(sec.id.split('-').slice(1,-2).join('-'))
            let parentAccWidth = parseInt(parentAcc.offsetWidth)

            let stylingSec = window.getComputedStyle(sec)
            //console.log(parentAccWidth)

            sec.querySelectorAll('[style*=width]').forEach(el =>{
              if (!el.id) return;

              let paddingAcc = parseInt(stylingSec.paddingLeft)+parseInt(stylingSec.paddingRight)
              let actualWidthAcc = parentAccWidth-paddingAcc;
              
              // console.log(originalSizes)
                // console.log(el.id)

                // console.log('el?: ', el, parseInt(el.style.width), actualWidth)
                // console.log('kec:',parseInt(el.style.width) >= actualWidthAcc) 
                // console.log('im:',originalSizes[el.id]?.width, parseInt(el.style.width) <= actualWidthAcc, parseInt(el.style.width) <= parseInt(originalSizes[el.id]?.width))
                // console.log('set:', originalSizes[el.id]?.width, parseInt(el.style.width) <= actualWidthAcc, parseInt(el.style.width) >= parseInt(originalSizes[el.id]?.width));
               
              if(parseInt(el.style.width) >= actualWidthAcc){
                //console.log('kecilin el', el, parseInt(el.style.width), actualWidth, parseInt(el.style.width) >= actualWidthAcc);
                el.style.width = actualWidthAcc+'px';

                updateStyle(el)

              }else if(parseInt(el.style.width) <= actualWidthAcc && parseInt(el.style.width) <= parseInt(originalSizes[el.id]?.width)){
                //console.log('imbangi el', el, parseInt(el.style.width), actualWidthAcc, originalSizes[el.id].width);
                if(actualWidthAcc >= parseInt(originalSizes[el.id]?.width)){
                  el.style.width = parseInt(originalSizes[el.id]?.width)+'px';
                  
                }else{
                  el.style.width = actualWidthAcc+'px';

                }
                updateStyle(el)

              }else if(parseInt(el.style.width) <= actualWidthAcc && parseInt(el.style.width) >= parseInt(originalSizes[el.id]?.width)){
                //console.log('setarakan el',  el, parseInt(el.style.width), actualWidthAcc, originalSizes[el.id].width);
                el.style.width = originalSizes[el.id].width
                updateStyle(el)
              }

            })
          })
        }

        console.log('accordion: ',accordionSelect, accordionSelect.id.split('-').slice(2,-1).join('-'))

        updateStyle(accordionSelect)
        globals.accordionSelect=accordionSelect

      }else{
        console.log(editorFieldSelect)
        if(editorFieldSelect.id.includes('accordion')){
          if(editorFieldSelect.id.includes('btn-modal')){
            console.log(editorFieldSelect.id.split('-').slice(2,-1).join('-'))
            parentElement=getEl(`section-${editorFieldSelect.id.split('-').slice(2,-1).join('-')}`)

          }else if(editorFieldSelect.id.startsWith('field-item-carousel')){
            parentElement=editorFieldSelect.parentElement
          }else{
            parentElement=getEl(`section-${editorFieldSelect.id.split('-').slice(1,-1).join('-')}`)

          }

        }else if(editorFieldSelect.id.includes('btn-modal')){
          parentElement=getEl(`editor-container-${editorFieldSelect.id.split('-').slice(3,-1).join('-')}`)
          
        }else{
          parentElement=getEl(`editor-container-${editorFieldSelect.id.split('-').slice(2,-1).join('-')}`)

        }
        console.log(parentElement)
        let styling = window.getComputedStyle(parentElement)

        width = parseInt(parentElement.offsetWidth)
        padding = parseInt(styling.paddingLeft)+parseInt(styling.paddingRight)
        let actualWidth = width-padding

        if(parseInt(this.value) >= actualWidth){
          this.value = actualWidth
        }
        console.log(parentElement,width, actualWidth)
        
        editorFieldSelect.style.width=`${this.value}px`
        globals.originalSizes[editorFieldSelect.id].width =`${this.value}px`;

        console.log('field: ',editorFieldSelect.id.split('-').slice(1,-1).join('-'))
      }

      updateStyle(editorFieldSelect)

    }else if(carouselSelect){
      if(carouselSelect.id.includes('accordion')){
        parentElement=getEl(`section-${carouselSelect.id.split('-').slice(1,-1).join('-')}`)
        
      }else{
        parentElement=getEl(`editor-container-${carouselSelect.id.split('-').slice(2,-1).join('-')}`)

      }

      let styling = window.getComputedStyle(parentElement)

      width = parseInt(parentElement.offsetWidth)
      padding = parseInt(styling.paddingLeft)+parseInt(styling.paddingRight)
      let actualWidth = width-padding

      if(parseInt(this.value) >= actualWidth){
        this.value = actualWidth
      }
      console.log(parentElement,width, actualWidth)

      carouselSelect.style.width=`${this.value}px`
      globals.originalSizes[carouselSelect.id].width =`${this.value}px`;

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
        globals.originalSizes[editorFieldSelect.id].height =`${this.value}px`;
      }else{
        editorFieldSelect.style.height=`${this.value}px`
        globals.originalSizes[editorFieldSelect.id].height =`${this.value}px`;
      }

      updateStyle(editorFieldSelect)
      globals.editorFieldSelect=editorFieldSelect

    }else if(carouselSelect){
      carouselSelect.style.height=`${this.value}px`
      globals.originalSizes[carouselSelect.id].height =`${this.value}px`;
      updateStyle(carouselSelect)
      globals.carouselSelect=carouselSelect
    }
    
  })

  document.getElementById('btn-reset-box').addEventListener('click', function(){
    editorFieldSelect = globals.editorFieldSelect
 
    if(editorFieldSelect.id.startsWith('webpage')){
      editorFieldSelect.style.minHeight='100dvh'
    }else{
      editorFieldSelect.style.width=''
      editorFieldSelect.style.height=''
    }
    updateStyle(editorFieldSelect)
    updateStylingControls(editorFieldSelect)
  })
}
// -------- Field Flex position -------
function flexPosition(){
  document.getElementById('flex-position-section').addEventListener('change', function(){
    editorFieldSelect=globals.editorFieldSelect

    let section=''

    if(editorFieldSelect.id.startsWith('webpage')){
      section=editorFieldSelect.querySelector('[id^="editor"]')
    }
    
    if(this.value == 'top'){
      editorFieldSelect.style.justifyContent = 'start'
      editorFieldSelect.style.alignItems = 'center'
      section.style.justifyContent = 'start'
      section.style.alignItems = 'center'

    }else if(this.value == 'center'){
      editorFieldSelect.style.justifyContent = 'center'
      editorFieldSelect.style.alignItems = 'center'
      section.style.justifyContent = 'center'
      section.style.alignItems = 'center'

    }else if(this.value == 'end'){
      editorFieldSelect.style.justifyContent = 'end'
      editorFieldSelect.style.alignItems = 'center'
      section.style.justifyContent = 'end'
      section.style.alignItems = 'center'
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
      }else{
        document.getElementById('padding-field').value = ''
      }
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
function showLoader(v = true) {
  document.getElementById('loading-overlay').style.display = v ? 'flex' : 'none';
}

function isValidImage(file, maxMB = 5) {
  if (!file || !file.type.startsWith('image/')) {
    window.dispatchEvent(new CustomEvent('notif-pesan', { 
      detail: { pesan: 'Please select a valid image file.', status:false} 
    }));
    return false;
  }
  if (file.size > maxMB * 1024 * 1024) {
    window.dispatchEvent(new CustomEvent('notif-pesan', { 
        detail: { pesan: `Ukuran file terlalu besar. Maksimal ${maxMB}MB.`, status:false} 
      }));
    return false;
  }
  return true;
}

function shortenName(name, maxLength = 20) {
  if (name.length <= maxLength) return name;
  const ext = name.split('.').pop();
  return name.substring(0, maxLength - ext.length - 3) + '...' + ext;
}

async function compressToWebPFlow(file) {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.7,
      maxWidth: 1920,
      convertSize: 0,
      async success(result) {
        try {
          const compressed = new File([result], file.name, { type: result.type });
          const webp = await compressToWebP(compressed, 0.7);
          resolve(webp);
        } catch (err) {
          reject(err);
        }
      },
      error(err) { reject(err) }
    });
  });
}

function extractRGBA(style) {
  const gradient = style.match(/linear-gradient\(([^)]+)\)/);
  if (gradient) return `${gradient[1].trim()})`;

  const bg = style.match(/background-color:\s*([^;]+)/);
  if (bg) return `${bg[1].trim()}, ${bg[1].trim()}`;

  return 'rgba(0,0,0,0), rgba(0,0,0,0)';
}

async function handleFieldBgUpload(file) {
  const preview = document.getElementById('preview-image');
  const nameFile = document.getElementById('file-name-display');

  let field = globals.editorFieldSelect;
  if (field?.id === 'heading-text') field = globals.accordionPartSelect;

  const webp = await compressToWebPFlow(file);
  const blob = URL.createObjectURL(webp);

  // update UI
  nameFile.textContent = webp.name;
  preview.src = blob;
  preview.classList.remove('hidden');

  field.dataset.nameBg = webp.name;
  field.style.backgroundSize = 'cover';
  field.style.backgroundPosition = 'center';

  const css = field.style.cssText;
  const rgba = extractRGBA(css);

  field.style.backgroundColor = '';
  field.style.backgroundImage = `linear-gradient(${rgba}), url(${blob})`;

  const randomKey = Math.random().toString(36).substring(2, 8);
  const safeName = shortenName(webp.name.replace(/\s+/g, '_')); // hindari spasi
  const uniqueKey = `__temp_media_${randomKey}_${safeName}__`;

  document.getElementById('btn-reset-bg-image').parentElement.classList.remove('hidden');
  updateStyle(field, 'bg-image', webp, '', blob, uniqueKey);
}

async function handleCarouselBgUpload(file) {
  const webp = await compressToWebPFlow(file);
  const blob = URL.createObjectURL(webp);
  
  const editItem = globals.editCarouselItem;

  const itemId = editItem.id.split('-').slice(1).join('-');
  const item = getEl(itemId);
  if(!item) return
  
  const rgba = extractRGBA(editItem.style.cssText);
  const imgUrl = `url(${blob})`;
  
  const short = webp.name;
  editItem.dataset.nameBg = short;
  item.dataset.nameBg = short;
  
  const carousel = getEl(item.id.split('-').slice(1, -1).join('-'));
  if(!carousel) return
  
  if (carousel.dataset.textPosition === 'on-image') {
    editItem.style.backgroundImage = `linear-gradient(${rgba}), ${imgUrl}`;
    item.style.backgroundImage = `linear-gradient(${rgba}), ${imgUrl}`;

  } else {
    item.querySelector('img').src = blob;
    editItem.style.backgroundImage = `linear-gradient(${rgba}), ${imgUrl}`;

  }

  editItem.style.backgroundColor = '';
  item.style.backgroundColor = '';

  const randomKey = Math.random().toString(36).substring(2, 8);
  const safeName = shortenName(webp.name.replace(/\s+/g, '_')); // hindari spasi
  const uniqueKey = `__temp_media_${randomKey}_${safeName}__`;

  updateStyle(item, 'bg-image', webp, carousel.dataset.textPosition, blob, uniqueKey);
  carousel.click();
}

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

            item.style.backgroundImage=`linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}), 
                        rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})), 
                        url(${urlPart})`

          }else{

            item.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
          }
        })
      }
  
      globals.carouselSelect=carouselSelect
    }else{
      let Style = fieldEditor.style.cssText
      if(Style.includes('background-image')){
        let urlPart = '';

        const match = Style.match(/url\((['"]?)(.*?)\1\)/i);
        if (match) {
          urlPart = match[2]; // isi di dalam url(...)
        }

        fieldEditor.style.backgroundImage=`linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}), 
                    rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})), 
                    url(${urlPart})`

      }else{

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

  document.getElementById('bg-image-input').addEventListener('change', async function () {
    const file = this.files[0];
    this.value = "";
    if (!isValidImage(file)) return;

    showLoader(true);
    try {
      await handleFieldBgUpload(file);
    } catch (err) {
      window.dispatchEvent(new CustomEvent('notif-pesan', { 
        detail: { pesan: `Gagal memproses gambar`, status:false} 
      }));
    }
    showLoader(false);
  });

  document.getElementById('bg-image-carousel').addEventListener('change', async function () {
    const file = this.files[0];
    this.value = "";
    if (!isValidImage(file)) return;

    showLoader(true);
    try {
      await handleCarouselBgUpload(file);
    } catch (err) {
      window.dispatchEvent(new CustomEvent('notif-pesan', { 
        detail: { pesan: 'Gagal memproses gambar', status:false} 
      }));
    }
    showLoader(false);
  });

  document.querySelectorAll('[name="bg-image-size"]').forEach(bgImageSize =>{
    bgImageSize.addEventListener('click', function(){
      
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
    fileDb=globals.file
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

      const target = fileDb.find(el => el.id === mediaDelete);
      if (target && !checkUsedMedia) {
        delete target.action;
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
    globals.isFormDirty = true
    globals.webpageDb=webpageDb
    globals.file=fileDb
  })
}
// -------------- Set Image From Recent Carousel -------------
function setImageGallery(indicator){
  fileDb=globals.file

  let mediaGallery='-- Belum Ada Gambar --'
  if(fileDb.length > 0){
    mediaGallery=''
  }
  fileDb.forEach(file =>{
    if(file.filetype === 'img' || file.type === 'img'){
      let url=`http://127.0.0.1:8000/media/${file.id}` //ubah klo pengen ke hostingan
      if(file.url){
        url=file.url
      }
      mediaGallery +=`
        <div class="w-[100px] h-[100px] overflow-hidden rounded relative cursor-pointer group">
          <img id="media-recent-${file.id}" data-media="${file.id}" src="${url}" 
          class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105">
        </div>
      `
    }
  })
  globals.isFormDirty = true
  document.getElementById('body-media-recent').innerHTML=mediaGallery

  setImageRecent()
}

function resetImage(idParts){
  webpageDb = globals.webpageDb
  fileDb = globals.file
  
  let bodyItem=globals.bodyItem
  let editCarouselItem = globals.editCarouselItem

  let carouselItem = getEl(`${idParts.slice(2).join('-')}`)
  editCarouselItem = getEl(`edit-${idParts.slice(2).join('-')}`) 

   if(!carouselItem||!editCarouselItem)return

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

    const target = fileDb.find(el => el.id === mediaDelete);
    if (target && !checkUsedMedia) {
      delete target.action;
    }

    globals.webpageDb=webpageDb
    globals.file=fileDb
    globals.isFormDirty = true
  } else {
    carouselItem.style.backgroundColor = "";
    globals.isFormDirty = true
  }
}

function applyFieldBgFromUrl(field, imgUrl) {
  let css = field.style.cssText || "";
  let rgba = extractRGBA(css);

  field.style.backgroundSize = 'cover';
  field.style.backgroundPosition = 'center';
  field.style.backgroundColor = '';
  field.style.backgroundImage = `linear-gradient(${rgba}), url(${imgUrl})`;
  globals.isFormDirty = true
}

function applyCarouselBgFromUrl(editItem, targetItem, carousel, imgUrl) {
  let css = editItem.style.cssText || "";
  let rgba = extractRGBA(css);

  const bg = `linear-gradient(${rgba}), url(${imgUrl})`;

  if (carousel.dataset.textPosition === 'on-image') {
    editItem.style.backgroundImage = bg;
    targetItem.style.backgroundImage = bg;
  } else {
    targetItem.querySelector('img').src = imgUrl;
    editItem.style.backgroundImage = bg;
  }

  editItem.style.backgroundColor = "";
  targetItem.style.backgroundColor = "";
  globals.isFormDirty = true
}

function setImageRecent() {
  document.querySelectorAll('[id^="media-recent"]').forEach(media => {
    if (media.dataset.listenerAdded === "true") return;
    webpageDb=globals.webpageDb
    fileDb=globals.file
    media.dataset.listenerAdded = "true";
    media.addEventListener('click', async function () {
      showLoader(true);

      const src = media.getAttribute("src");
      const name = media.dataset.media;
 
      let id = globals.itemCarouselId ?? globals.editorFieldSelect.id;

      const targetElement = getEl(id);
      if(!targetElement)return

      let editorFieldSelect = globals.editorFieldSelect;
      let itemCarouselId = globals.itemCarouselId;
      if (editorFieldSelect?.id === "heading-text") editorFieldSelect = globals.accordionPartSelect;

      const webpitem = webpageDb.find(item => item.id === id)
      const match = webpitem.style?.match(/url\((['"]?)(.*?)\1\)/)

      let oldUrl = match ? match[2] : null;

      // ============= CAROUSEL =============
      if (id.includes("item-carousel")) {

        const editItem = getEl(`edit-${id}`);
        const carousel = getEl(id.split('-').slice(1, -1).join('-'));
        if(!editItem||!carousel) return

        if (carousel.dataset.textPosition === 'below-image') {
          const webpitem = webpageDb.find(item => item.id === `img-text-on-image-${id}`)
          id=`img-text-on-image-${id}`
          oldUrl = webpitem.content
        }

        applyCarouselBgFromUrl(
          editItem,
          targetElement,
          carousel,
          src
        );

        globals.editCarouselItem = editItem;
      }

      // ============== FIELD ===============
      else {
        document.getElementById('btn-reset-bg-image').parentElement.classList.remove('hidden');

        const preview = document.getElementById("preview-image");
        const fileNameDisplay = document.getElementById("file-name-display");

        preview.src = src;
        preview.classList.remove("hidden");
        fileNameDisplay.textContent = name;

        applyFieldBgFromUrl(editorFieldSelect, src);
        globals.editorFieldSelect = editorFieldSelect;
      }

      // ====== Update ke database local =====
      function getBaseUrl(styleText) {
        const urlMatch = styleText.match(/url\((['"]?)([^'")]+)\1\)/i);
        if (!urlMatch) return '';

        const fullUrl = urlMatch[2];
        const idx = fullUrl.indexOf('media/');
        if (idx === -1) return '';

        return fullUrl.substring(0, idx + 'media/'.length);
      }
      const targetNew = fileDb.find(f => f.id === name && f.file);
      if (targetNew) targetNew.action = "add";

      if(oldUrl){
        const checkUsedMedia = webpageDb.some(el => {
          if (el.id === id) return false; // skip elemen yg sedang kita proses
  
          const style = el.style || "";
          const content = el.content || "";
  
          return style.includes(oldUrl) || 
                content.includes(oldUrl)
        });
  
        const target = fileDb.find(el => el.id === oldUrl);
        if (target && !checkUsedMedia) {
          delete target.action;
        }
      }

      webpageDb.some(item => {
        if (item.id === id) {
          
          let belowImageCarousel=false
          if(targetElement.querySelector('[id^="img-text-on"]') && targetElement.children.length == 2){
            belowImageCarousel = true
          }

          let baseUrl = getBaseUrl(targetElement.style.cssText);
          let newUrl = baseUrl + name;

          let newStyle = targetElement.style.cssText.replace(
            /url\((['"]?)([^'")]+)\1\)/gi,
            `url('${newUrl}')`
          );

          // untuk field (bukan carousel)
          if (!id.includes("item-carousel")) {
            baseUrl = getBaseUrl(editorFieldSelect.style.cssText);
            newUrl = baseUrl + name;
            newStyle = editorFieldSelect.style.cssText.replace(
              /url\((['"]?)([^'")]+)\1\)/gi,
              `url('${newUrl}')`
            );
          }

          // tambahkan style dari editor-container (jika ada)
          let editorExt = "";
          if (editorFieldSelect?.id.startsWith("webpage")) {
            const cont = editorFieldSelect.querySelector('[id^="editor-container"]');
            if (cont) editorExt = cont.style.cssText;
          }

          if(belowImageCarousel){
            const indexTextOnImahe = webpageDb.findIndex(field=>field.id === item.id)
            const textOnImage = webpageDb[indexTextOnImahe]
            let newContent=name

            if(media.src.includes('https:/') && !media.src.includes('blob')){
              const match = media.src.match(/^(https?:\/\/[^"]*?media\/)/);
              const base = match ? match[1] : null;
              newContent = base+name
            }

            textOnImage.content = newContent
            textOnImage.action = updateActionProperty(textOnImage.action, "update");
          }else{
            item.style = newStyle + editorExt;
            item.action = updateActionProperty(item.action, "update");
          }
          return true
        }
      });

      globals.file = fileDb;
      globals.webpageDb=webpageDb
      globals.isFormDirty = true
      showLoader(false);
    });
  });
}

function setListenerSetImage(){
  document.querySelectorAll('[id^="set-image-from-recent"]').forEach(btn=>{
    if (btn.dataset.listenerAdded === "true") return;
    btn.dataset.listenerAdded = "true";
    btn.addEventListener('click', function(e){
      if(e.target.id.includes('item-carousel')){
        globals.itemCarouselId=btn.id.split('-').slice(4).join('-')
      }else{
        globals.itemCarouselId=null
      }

      setImageGallery()
    })
  })
}

export { fontStylingField, widthHeightField, 
  borderField, paddingMarginField, 
  colorBackgroundField, 
  flexPosition, resetImage,setListenerSetImage,
  setImageGallery,updateStyle, setImageRecent }