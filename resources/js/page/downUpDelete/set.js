// ======== GLOBALS =========
import { globals } from '../globals.js';
// ======== Validation get element ==========
import { getEl } from '../utils/validationGetElement.js';

// ======== GLOBAL VARIABLE ASSIGNMENT =========
let editCarouselItem = globals.editCarouselItem, 
    actualField = globals.actualField
    bodyItem = globals.bodyItem
    bodyFieldELement = globals.bodyFieldELement

function setBtnModal(idParts){
   
    fieldElement = getEl(idParts.slice(2, idParts.length).join('-'))
    if(!fieldElement) return
    
    bodyFieldELement = fieldElement.parentElement
    globals.bodyFieldELement = fieldElement.parentElement
    
}
function setVideo(idParts){
    fieldElement = getEl(idParts.slice(1, idParts.length).join('-'))
    if(!fieldElement) return

    bodyFieldELement = fieldElement.parentElement
    globals.bodyFieldELement = fieldElement.parentElement

}
function setAccordion(idParts){
    fieldElement = getEl(idParts.slice(1, idParts.length).join('-'))
    if(!fieldElement) return

    bodyFieldELement = fieldElement.parentElement
    globals.bodyFieldELement = fieldElement.parentElement
   
}
function setHeadAccordion(idParts){
    fieldElement = getEl(idParts.slice(2, idParts.length).join('-'))
    if(!fieldElement) return

    bodyFieldELement = fieldElement.parentElement
  
}
function setCarousel(idParts){
    fieldElement = getEl(idParts.slice(1, idParts.length).join('-'))
    if(!fieldElement)return

    bodyFieldELement = fieldElement.parentElement
   
}
function setField(idParts){
    fieldElement = getEl(idParts.slice(1, idParts.length).join('-')).parentElement;
    if(!fieldElement) return

    bodyFieldELement = fieldElement.parentElement
   
}
function setSectionAccordion(idParts){
    fieldElement = getEl(`${idParts.slice(1, idParts.length).join('-')}`);
    if(!fieldElement)return
    
    bodyFieldELement = fieldElement.parentElement

}
function setSection(idParts){
    fieldElement = getEl(`webpage-${idParts.slice(1, idParts.length).join('-')}`);
    if(!fieldElement) return

    bodyFieldELement = fieldElement.parentElement
    globals.bodyFieldELement = fieldElement.parentElement

}
function setItemCarousel(idParts){
    editCarouselItem =getEl(`edit-${idParts.slice(1, idParts.length).join('-')}`);
    actualField = getEl(`${idParts.slice(1, idParts.length).join('-')}`)
    
    if(!editCarouselItem || !actualField) return

    bodyItem = editCarouselItem.parentElement.parentElement
    actualBodyItem = actualField.parentElement.parentElement

    globals.editCarouselItem=editCarouselItem
    globals.actualField=actualField
}

export { setBtnModal,setVideo,setAccordion,setHeadAccordion,setCarousel,setField,setSectionAccordion,setSection,setItemCarousel }