// ======== FLOWBITE COMPONENTS =========
import { initFlowbite } from 'flowbite';

// ======== GLOBALS =========
import { globals } from '../globals.js';

// ======== updateContent ========
import { updateActionProperty } from '../utils/updateContent.js';
import { updateStylingControls } from '../styling/stylingControls.js';

// ======== GLOBAL VARIABLE ASSIGNMENT =========
let webpageDb = globals.webpageDb,
  webpageDbParentSection = globals.webpageDbParentSection,
  editCarouselItem = globals.editCarouselItem,
  carouselSelect = globals.carouselSelect,
  actualBodyItem = globals.actualBodyItem,
  actualField = globals.actualField

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
    fieldElement = document.getElementById(idParts.slice(1).join('-'));
    bodyElement = fieldElement?.parentElement?.parentElement;
    globals.actualField = document.getElementById(fieldElement.id)
    globals.actualBodyItem = document.getElementById(fieldElement.id).parentElement.parentElement
    type = 'item carousel';
    // console.log('item', idParts, fieldElement)

  } else if(idParts[1] === 'carousel'){
    fieldElement = document.getElementById(idParts.slice(1).join('-'));
    bodyElement = fieldElement.parentElement;
    type = 'carousel';

  } else if (idParts[1] === 'field') {
    fieldElement = document.getElementById(idParts.slice(1).join('-')).parentElement;
    bodyElement = fieldElement.parentElement;

  }else if (idParts[1] === 'video') {
    fieldElement = document.getElementById(idParts.slice(1).join('-'));
    bodyElement = fieldElement.parentElement;

  }  else if (idParts[1] === 'section' && idParts[2] !== 'accordion') {
    fieldElement = document.getElementById(`webpage-${idParts.slice(1).join('-')}`);
    bodyElement = fieldElement.parentElement;

  } else if(idParts[1] === 'section' && idParts[2] === 'accordion'){
    fieldElement = document.getElementById(idParts.slice(1).join('-'));
    bodyElement = fieldElement.parentElement;

  } else if (idParts[1] === 'accordion') {
    fieldElement = document.getElementById(idParts.slice(1).join('-'));
    bodyElement = fieldElement.parentElement;

  } else if (idParts[1] === 'head') {
    fieldElement = document.getElementById(idParts.slice(2).join('-'));
    bodyElement = fieldElement.parentElement;

  } else if (idParts[1] === 'btn' && idParts[2] === 'modal') {
    fieldElement = document.getElementById(idParts.slice(2).join('-'));
    bodyElement = fieldElement.parentElement;
    type = 'modal';
  }

  //  console.log(type, idParts, fieldElement)

  return { fieldElement, bodyElement, type };
}

function handleElementAction(action, fieldElement, bodyElement, options = {}, idParts) {
  let webpageDb = globals.webpageDb;
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

    // console.log('Delete:', fieldElement, actual);

    const updateElementCount = (el, key = 'elementCount') => {
      el.dataset[key] = Math.max(0, parseInt(el.dataset[key]) - 1);
      return el.dataset[key];
    };

    // Hapus dari DB
    const setDeleteStatus = (id)=>{
      console.log(id)
      const targetParts=id.split('-')
      webpageDb = webpageDb.filter(item => {
        const parts = item.id.split('-')
        if (arraySubsequenceMatch(parts,targetParts)) {
          const update = updateActionProperty(item.action, 'delete');
          console.log('matched item:', item);

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
      console.log(bodyElement, bodyElement.children.length > 1, bodyElement.children.length)
      let section = bodyElement.querySelectorAll("[id^='webpage-section-']");
      let sectionNotFooter = Array.from(section).filter(sec => !sec.id.includes('footer'));

      if (sectionNotFooter.length > 1) {
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
          webpageDb.forEach(page => {
            if (page.id === `btn-heading-${bodyElement.id.split('-').slice(1).join('-')}`) {
              page.element_count = bodyElement.dataset[key];
              page.action = updateActionProperty( page.action, 'update')
            }
          });
        }

        const id = fieldElement.id.split('-');
        setDeleteStatus(id.slice(1).join('-'))
        updateStylingControls()
      
      }else{
        alert('Section Tidak Boleh Terhapus Semua')
        return false
      }
    }

    // ========== Accordion Header Delete ==========
    else if (idParts[1] === 'head') {
      const key =
          parseInt(fieldElement.dataset.elementOrder) >= parseInt(bodyElement.dataset.itemAccordion)
          ? 'itemAccordion'
          : null;
      console.log(key)
      if(key){
        updateElementCount(bodyElement, 'itemAccordion');
        webpageDb.forEach(page => {
          if (page.id === bodyElement.id.split('-').slice(1).join('-')) {
            page.element_count = bodyElement.dataset.itemAccordion;
            page.action = updateActionProperty(page.action, 'update')
          }
        });
        globals.bodyElement = bodyElement;
      }
      setDeleteStatus(fieldElement.id.split('-').slice(2).join('-'))
      updateStylingControls()
    }

    // ========== Carousel Item Delete ==========
    else if (idParts[1] === 'item') {
      const actualBodyItem = globals.actualBodyItem;
      const editCarousel = document.getElementById('edit-carousel-item-wrapping')
      const indicatorWrapper = document.getElementById(`slide-indicator-${idParts.slice(2, -1).join('-')}`);
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
      console.log(+actualBodyItem.dataset.itemCount >= targetOrder, +actualBodyItem.dataset.itemCount, targetOrder, actualBodyItem)
      if (+actualBodyItem.dataset.itemCount <= targetOrder)
        actualBodyItem.dataset.itemCount = +actualBodyItem.dataset.itemCount - 1;
        editCarousel.dataset.itemCount = actualBodyItem.dataset.itemCount

      webpageDb.forEach(f => {
        if (f.id === fieldElement.id.split('-').slice(1, -1).join('-')) {
          f.element_count = actualBodyItem.dataset.itemCount;
          f.action = updateActionProperty(f.action, 'update')
        }
      });

      document.getElementById(`edit-${fieldElement.id}`)?.remove();
      setDeleteStatus(fieldElement.id)
      setTimeout(() => {
        try {
          initFlowbite();
        } catch (error) {
          console.error('❌ Carousel re-init failed:', error);
        }
      }, 100);
    }

    // ========== Field in Section / Normal Field ==========
    else {
      console.log('field delete:', fieldElement,actual)
      const key =
        (bodyElement.id.startsWith('editor-container-section-') || bodyElement.id.startsWith('wrapper-section-')) &&
        (!['head', 'section'].includes(idParts[1]) &&
          parseInt(actual.dataset.elementOrder) >= parseInt(bodyElement.dataset.elementCount))
          ? 'elementCount'
          : null;

      console.log(key ,bodyElement)
      if (key) {
        updateElementCount(bodyElement, key);
        let itemId
        if(bodyElement.id === 'webpage'){
          itemId = `webpage-${bodyElement.id.split('-').slice(2).join('-')}`
        }else{
          itemId = bodyElement.id.split('-').slice(1).join('-')
        }
        webpageDb.forEach(page => {
          if (page.id === itemId) {
            page.element_count = bodyElement.dataset[key];
            page.action =  updateActionProperty(page.action, 'update')
          }
        });
      }
      setDeleteStatus(actual.id)
      updateStylingControls()
    }
    
    globals.webpageDb = webpageDb;
    globals.webpageDbParentSection = webpageDbParentSection;
  }

  // =========================
  // REINIT FLOWBITE
  // =========================
  if (reinitFlowbite) {
    setTimeout(() => {
      try {
        initFlowbite();
      } catch (e) {
        console.error('Flowbite re-init failed', e);
      }
    }, 100);
  }

  console.log('📘 DB sync:', webpageDb, globals.webpageDb, webpageDbParentSection, globals.webpageDbParentSection);
}
export { getTargetElement,handleElementAction }