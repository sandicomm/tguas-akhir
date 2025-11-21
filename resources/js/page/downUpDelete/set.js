// ======== GLOBALS =========
import { globals } from '../globals.js';

// ======== GLOBAL VARIABLE ASSIGNMENT =========
let editCarouselItem = globals.editCarouselItem, 
    actualField = globals.actualField
    bodyItem = globals.bodyItem
    bodyFieldELement = globals.bodyFieldELement

function setBtnModal(idParts){
    // console.log(idParts.slice(1, idParts.length).join('-'))
    fieldElement = document.getElementById(idParts.slice(2, idParts.length).join('-'))
    bodyFieldELement = fieldElement.parentElement
    globals.bodyFieldELement = fieldElement.parentElement
    // console.log('modal Select', fieldElement, bodyFieldELement)
}
function setVideo(idParts){
    fieldElement = document.getElementById(idParts.slice(1, idParts.length).join('-'))
    bodyFieldELement = fieldElement.parentElement
    globals.bodyFieldELement = fieldElement.parentElement
    // console.log('video Select')
}
function setAccordion(idParts){
    fieldElement = document.getElementById(idParts.slice(1, idParts.length).join('-'))
    bodyFieldELement = fieldElement.parentElement
    globals.bodyFieldELement = fieldElement.parentElement
    // console.log('accordion Select')
}
function setHeadAccordion(idParts){
    fieldElement = document.getElementById(idParts.slice(2, idParts.length).join('-'))
    bodyFieldELement = fieldElement.parentElement
    // console.log('head accordion Select', fieldElement, bodyFieldELement)
}
function setCarousel(idParts){
    fieldElement = document.getElementById(idParts.slice(1, idParts.length).join('-'))
    bodyFieldELement = fieldElement.parentElement
    // console.log('carousel Select', fieldElement, bodyFieldELement)
}
function setField(idParts){
    fieldElement = document.getElementById(idParts.slice(1, idParts.length).join('-')).parentElement;
    bodyFieldELement = fieldElement.parentElement
    // console.log(`field select: `, fieldElement,' body: ', bodyFieldELement)
}
function setSectionAccordion(idParts){
    fieldElement = document.getElementById(`${idParts.slice(1, idParts.length).join('-')}`);
    bodyFieldELement = fieldElement.parentElement
    // console.log(`section accordion select: `, fieldElement,' body: ', bodyFieldELement)
}
function setSection(idParts){
    fieldElement = document.getElementById(`webpage-${idParts.slice(1, idParts.length).join('-')}`);
    bodyFieldELement = fieldElement.parentElement
    globals.bodyFieldELement = fieldElement.parentElement
    // console.log(`section select: `, fieldElement,' body: ', bodyFieldELement)
}
function setItemCarousel(idParts){
    editCarouselItem = document.getElementById(`edit-${idParts.slice(1, idParts.length).join('-')}`);
    bodyItem = editCarouselItem.parentElement.parentElement

    actualField = document.getElementById(`${idParts.slice(1, idParts.length).join('-')}`)
    actualBodyItem = actualField.parentElement.parentElement
    // console.log("actual carousel", actualField)
    globals.editCarouselItem=editCarouselItem
    globals.actualField=actualField
}

export { setBtnModal,setVideo,setAccordion,setHeadAccordion,setCarousel,setField,setSectionAccordion,setSection,setItemCarousel }