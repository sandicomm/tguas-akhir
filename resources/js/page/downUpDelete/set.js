// ======== GLOBALS =========
import { globals } from '../globals.js';

// ======== GLOBAL VARIABLE ASSIGNMENT =========
let editCarouselItem = globals.editCarouselItem, 
    actualField = globals.actualField
    bodyItem = globals.bodyItem
    bodyFieldELement = globals.bodyFieldELement

function setBtnModal(idParts){
   
    fieldElement = document.getElementById(idParts.slice(2, idParts.length).join('-'))
    bodyFieldELement = fieldElement.parentElement
    globals.bodyFieldELement = fieldElement.parentElement
    
}
function setVideo(idParts){
    fieldElement = document.getElementById(idParts.slice(1, idParts.length).join('-'))
    bodyFieldELement = fieldElement.parentElement
    globals.bodyFieldELement = fieldElement.parentElement

}
function setAccordion(idParts){
    fieldElement = document.getElementById(idParts.slice(1, idParts.length).join('-'))
    bodyFieldELement = fieldElement.parentElement
    globals.bodyFieldELement = fieldElement.parentElement
   
}
function setHeadAccordion(idParts){
    fieldElement = document.getElementById(idParts.slice(2, idParts.length).join('-'))
    bodyFieldELement = fieldElement.parentElement
  
}
function setCarousel(idParts){
    fieldElement = document.getElementById(idParts.slice(1, idParts.length).join('-'))
    bodyFieldELement = fieldElement.parentElement
   
}
function setField(idParts){
    fieldElement = document.getElementById(idParts.slice(1, idParts.length).join('-')).parentElement;
    bodyFieldELement = fieldElement.parentElement
   
}
function setSectionAccordion(idParts){
    fieldElement = document.getElementById(`${idParts.slice(1, idParts.length).join('-')}`);
    bodyFieldELement = fieldElement.parentElement

}
function setSection(idParts){
    fieldElement = document.getElementById(`webpage-${idParts.slice(1, idParts.length).join('-')}`);
    bodyFieldELement = fieldElement.parentElement
    globals.bodyFieldELement = fieldElement.parentElement

}
function setItemCarousel(idParts){
    editCarouselItem = document.getElementById(`edit-${idParts.slice(1, idParts.length).join('-')}`);
    bodyItem = editCarouselItem.parentElement.parentElement

    actualField = document.getElementById(`${idParts.slice(1, idParts.length).join('-')}`)
    actualBodyItem = actualField.parentElement.parentElement

    globals.editCarouselItem=editCarouselItem
    globals.actualField=actualField
}

export { setBtnModal,setVideo,setAccordion,setHeadAccordion,setCarousel,setField,setSectionAccordion,setSection,setItemCarousel }