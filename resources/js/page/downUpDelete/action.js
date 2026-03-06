// ======== FLOWBITE COMPONENTS =========
import { initFlowbite } from 'flowbite';

// ======== GLOBALS =========
import { globals } from '../globals.js';

// ======== updateContent ========
import { updateActionProperty } from '../utils/updateContent.js';
import { updateStylingControls } from '../styling/stylingControls.js';
// ======== Validation get element ==========
import { getEl } from '../utils/validationGetElement.js';


  // ======== gpt ver  =============
function resolveFieldId(el) {
  if (!el) return null;

  if (el.id && !el.parentElement.id.startsWith('parent-accordion')) {
    return el.id;
  } else if (el.parentElement.id.startsWith('parent-accordion')) {
    return el.querySelector('[id^="btn-heading-"]')?.id;
  } else if (el.id.startsWith('accordion')) {
    return el.id;
  } else {
    return el.querySelector('[id^="field-"]')?.id;
  }
}

function getTargetElement(idParts) {
  // Kembalikan objek { fieldElement, bodyElement, type }
  // supaya blok 1 dan blok 2 cukup pakai fungsi ini.
  let fieldElement = null, bodyElement = null, type = 'generic';

  if (idParts[1] === 'item') {
    fieldElement = getEl(idParts.slice(1).join('-'));
    if(!fieldElement)return

    bodyElement = fieldElement?.parentElement?.parentElement;
    const actualField = getEl(fieldElement.id)

    if(!actualField)return

    globals.actualField = actualField
    globals.actualBodyItem = actualField.parentElement.parentElement
    
    type = 'item carousel';


  } else if(idParts[1] === 'carousel'){
    fieldElement = getEl(idParts.slice(1).join('-'));
    if(!fieldElement) return
    
    bodyElement = fieldElement.parentElement;
    type = 'carousel';

  } else if (idParts[1] === 'field') {
    fieldElement = getEl(idParts.slice(1).join('-')).parentElement;
    if(!fieldElement) return

    bodyElement = fieldElement.parentElement;

  }else if (idParts[1] === 'video') {
    fieldElement = getEl(idParts.slice(1).join('-'));
    if(!fieldElement) return

    bodyElement = fieldElement.parentElement;

  }  else if (idParts[1] === 'section' && idParts[2] !== 'accordion') {
    fieldElement = getEl(`webpage-${idParts.slice(1).join('-')}`);
    if(!fieldElement) return

    bodyElement = fieldElement.parentElement;

  } else if(idParts[1] === 'section' && idParts[2] === 'accordion'){
    fieldElement = getEl(idParts.slice(1).join('-'));
    if(!fieldElement) return
    
    bodyElement = fieldElement.parentElement;

  } else if (idParts[1] === 'accordion') {
    fieldElement = getEl(idParts.slice(1).join('-'));
    if(!fieldElement)return

    bodyElement = fieldElement.parentElement;

  } else if (idParts[1] === 'head') {
    fieldElement = getEl(idParts.slice(2).join('-'));
    if(!fieldElement) return
    
    bodyElement = fieldElement.parentElement;

  } else if (idParts[1] === 'btn' && idParts[2] === 'modal') {
    fieldElement = getEl(idParts.slice(2).join('-'));
    if(!fieldElement)return
    
    bodyElement = fieldElement.parentElement;
    type = 'modal';
  }


  return { fieldElement, bodyElement, type };
}

function handleElementAction(action, fieldElement, bodyElement, options = {}, idParts) {
  let webpageDb = globals.webpageDb; 
  let fileDb = globals.file; 
  let webpageDbParentSection = globals.webpageDbParentSection;
  const { datasetKey = 'elementOrder', reinitFlowbite = false, updateIndicators = null, afterMove = null } = options;

  if (!fieldElement) return;

  // =========================
  // 🔼🔽 MOVE ELEMENT
  // =========================
  if (['up', 'down'].includes(action)) {
    const target = action === 'up' ? fieldElement.previousElementSibling : fieldElement.nextElementSibling;
    if (!target) return;

    if(!target.id.includes('footer')){
      // Tukar dataset dan posisi DOM
      [fieldElement.dataset[datasetKey], target.dataset[datasetKey]] = [target.dataset[datasetKey], fieldElement.dataset[datasetKey]];
      target.insertAdjacentElement(action === 'up' ? 'beforebegin' : 'afterend', fieldElement);
  
      // Update di DB
   
      const fieldId = resolveFieldId(fieldElement);
      const targetId = resolveFieldId(target);
      webpageDb.forEach(item => {
        if (item.id === fieldId) {
          item.element_order = fieldElement.dataset[datasetKey];
          item.action = updateActionProperty(item.action, 'update')
    
        }

        if (item.id === targetId) {
          item.element_order = target.dataset[datasetKey];
          item.action = updateActionProperty(item.action, 'update')
      
        }
      });
      afterMove?.();
    }
  }

  // =========================
  // ❌ DELETE ELEMENT
  // =========================
  else if (action === 'delete') {
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

    const actual = fieldElement.id ? fieldElement : fieldElement.querySelector('[id^="field"]');
    if (!actual) return;

    const updateElementCount = (el, key = 'elementCount') => {
      el.dataset[key] = Math.max(0, parseInt(el.dataset[key]) - 1);
      return el.dataset[key];
    };

    // Hapus dari DB
    const setDeleteStatus = (id)=>{
    
      let matchItem=[]
      const targetParts=id.split('-')

      webpageDb = webpageDb.filter(item => {
        const parts = item.id.split('-')
        if (arraySubsequenceMatch(parts,targetParts)) {
          const update = updateActionProperty(item.action, 'delete');
          matchItem.push(item.id)

          const match = item.style?.match(/url\((['"]?)(.*?)\1\)/)

          let mediaId = match ? match[2] : null;

          if (item.type === 'img-carousel') {
            mediaId = item.content
          }

          if(mediaId){
          
            const checkUsedMedia = webpageDb.some(el => {
              if (el.id === item.id) return false; // skip elemen yg sedang kita proses

              const style = el.style || "";
              const content = el.content || "";

              return style.includes(mediaId) || 
                    content.includes(mediaId)
            });

            const target = fileDb.find(el => el.id === mediaId);
            if (target && !checkUsedMedia) {
              delete target.action;
            }
          }

          if (update.includes('new')) {
            // hapus dari array (jangan disertakan)
            return false;
          } else {
            // ubah action lalu simpan lagi
            item.action = update;
          }

        }
        return true; // tetap dipertahankan
      });
      fieldElement.remove()
  
    }

    // ========== Section Delete ==========
    if (idParts[1] === 'section') {
        const key =
          parseInt(fieldElement.dataset.elementOrder) >= parseInt(bodyElement.dataset.elementCount)
          ? 'elementCount'
          : null;
        
        
        
        if(key && bodyElement.id === 'webpage'){
          webpageDbParentSection[0].element_count = Math.max(
            0,
            parseInt(webpageDbParentSection[0].element_count) - 1
          );
          webpageDbParentSection[0].action = updateActionProperty( webpageDbParentSection[0].action, 'update')
          updateElementCount(bodyElement, 'elementCount')
        }else if(key){
          updateElementCount(bodyElement, 'elementCount')
          webpageDb.some(page => {
            if (page.id === `btn-heading-${bodyElement.id.split('-').slice(1).join('-')}`) {
              page.element_count = bodyElement.dataset[key];
              page.action = updateActionProperty( page.action, 'update')
              return true
            }
          });
        }

        const id = fieldElement.id.split('-');
        setDeleteStatus(id.slice(1).join('-'))
        updateStylingControls()
    }

    // ========== Accordion Header Delete ==========
    else if (idParts[1] === 'head') {
      const key =
          parseInt(fieldElement.dataset.elementOrder) >= parseInt(bodyElement.dataset.itemAccordion)
          ? 'itemAccordion'
          : null;
      
      if(key){
        updateElementCount(bodyElement, 'itemAccordion');
        webpageDb.some(page => {
          if (page.id === bodyElement.id.split('-').slice(1).join('-')) {
            page.element_count = bodyElement.dataset.itemAccordion;
            page.action = updateActionProperty(page.action, 'update')
            return true
          }
        });
        globals.bodyElement = bodyElement;
      }
      setDeleteStatus(fieldElement.id)
      updateStylingControls()
    }
    
    // ========== Carousel Item Delete ==========
    else if (idParts[1] === 'item') {
      const actualBodyItem = globals.actualBodyItem;
      const editCarousel = document.getElementById('edit-carousel-item-wrapping')

      if(editCarousel.children.length <= 1 ) return
      
      const indicatorWrapper = getEl(`slide-indicator-${idParts.slice(2, -1).join('-')}`);
      if(!indicatorWrapper)return
      
      const items = [...fieldElement.parentElement.querySelectorAll('[data-item-order]')];

      // Urutkan dan buat mapping
      const sortedOrders = items.map(el => +el.dataset.itemOrder).sort((a, b) => a - b);
      const orderToIndex = Object.fromEntries(sortedOrders.map((order, i) => [order, i]));
      const targetOrder = +fieldElement.dataset.itemOrder;
      const targetIndex = orderToIndex[targetOrder];

      // Update indikator
      [...indicatorWrapper.children].forEach(indicator => {
        const slideTo = +indicator.dataset.carouselSlideTo;
        if (slideTo === targetIndex) indicator.remove();
        else if (slideTo > targetIndex) indicator.dataset.carouselSlideTo = slideTo - 1;
      });

      // Update count

      if (+actualBodyItem.dataset.itemCount <= targetOrder)
        actualBodyItem.dataset.itemCount = +actualBodyItem.dataset.itemCount - 1;
        editCarousel.dataset.itemCount = actualBodyItem.dataset.itemCount

      webpageDb.some(f => {
        if (f.id === fieldElement.id.split('-').slice(1, -1).join('-')) {
          f.element_count = actualBodyItem.dataset.itemCount;
          f.action = updateActionProperty(f.action, 'update')
          return true
        }
      });

      const editCarouselDel = getEl(`edit-${fieldElement.id}`)
      if(!editCarouselDel)return
      
      editCarouselDel.remove();
      setDeleteStatus(fieldElement.id)
      setTimeout(() => {
        try {
          initFlowbite();
        } catch (error) {
          console.error('❌ Carousel re-init failed:', error);
        }
      }, 100);
    }

    // ========== Modal Delete =============
    else if(idParts[2] == 'modal' && !idParts.includes('field')){
     
      let elementOrder = actual.dataset.elementOrder

      const key =
        (bodyElement.id.startsWith('editor-container-section-') || bodyElement.id.startsWith('wrapper-section-'))  &&
        (!['head', 'section'].includes(idParts[1]) &&
          parseInt(elementOrder) >= parseInt(bodyElement.dataset.elementCount))
          ? 'elementCount'
          : null;


      if (key) {
        updateElementCount(bodyElement, key);
        let itemId
        if(bodyElement.id === 'webpage'){
          itemId = `webpage-${bodyElement.id.split('-').slice(2).join('-')}`
        }else if(bodyElement.id.startsWith('body-modal')){
          itemId = bodyElement.id
        }else if(bodyElement.id.startsWith('editor-container')){
          itemId = `webpage-${bodyElement.id.split('-').slice(2).join('-')}`
        }else{
          itemId = bodyElement.id.split('-').slice(1).join('-')
        }
   
        webpageDb.some(page => {
          if (page.id === itemId) {
            page.element_count = bodyElement.dataset[key];
            page.action =  updateActionProperty(page.action, 'update')
            return true
          }
        });
      }
      const elementRemove = getEl(`element-${fieldElement.id}`)
      if(!elementRemove) return

      elementRemove.remove()
      setDeleteStatus(actual.id)
      updateStylingControls()
    }

    // ========== Field in Section / Normal Field ==========
    else {
      
      let elementOrder = actual.dataset.elementOrder
      if(actual.id.startsWith('field')){
        elementOrder = actual.parentElement.dataset.elementOrder
      }
      const key =
        (bodyElement.id.startsWith('editor-container-section-') || bodyElement.id.startsWith('wrapper-section-') || bodyElement.id.startsWith('body-modal-')) &&
        (!['head', 'section'].includes(idParts[1]) &&
          parseInt(elementOrder) >= parseInt(bodyElement.dataset.elementCount))
          ? 'elementCount'
          : null;

      if (key) {
        updateElementCount(bodyElement, key);
        let itemId
        if(bodyElement.id === 'webpage'){
          itemId = `webpage-${bodyElement.id.split('-').slice(2).join('-')}`
        }else if(bodyElement.id.startsWith('body-modal')){
          itemId = bodyElement.id
        }else if(bodyElement.id.startsWith('editor-container')){
          itemId = `webpage-${bodyElement.id.split('-').slice(2).join('-')}`
        }else{
          itemId = bodyElement.id.split('-').slice(1).join('-')
        }
     
        webpageDb.some(page => {
          if (page.id === itemId) {
            page.element_count = bodyElement.dataset[key];
            page.action =  updateActionProperty(page.action, 'update')
            return true
          }
        });
      }
      setDeleteStatus(actual.id)
      updateStylingControls()
    }
    
    globals.webpageDb = webpageDb;
    globals.webpageDbParentSection = webpageDbParentSection;

    if(!idParts.join('-').startsWith('delete-section')){
      const section = getEl(idParts.join('-'))
      if(!section) return
      
      section.parentElement.parentElement.parentElement.remove()
    }
  }

  // =========================
  // REINIT FLOWBITE
  // =========================
  globals.isFormDirty = true
  if (reinitFlowbite) {
    setTimeout(() => {
      try {
        initFlowbite();
      } catch (e) {
        console.error('Flowbite re-init failed', e);
      }
    }, 100);
  }


}
export { getTargetElement,handleElementAction }