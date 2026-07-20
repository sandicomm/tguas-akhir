import { globals } from './globals.js';
import { Accordion, initFlowbite } from 'flowbite';
import { replaceTrailingNumber,deepClone } from './utils/utilsDuplikatFunction.js';
import { updateContent, updateActionProperty } from './utils/updateContent.js';
import { parseStyleObj, stringifyStyleObj } from './utils/baseStyleObj.js';
import { copyModal } from './modal.js';
import { dropdownInitialized } from './utils/dropdownInit.js';
import { renderSvg } from './utils/svgEdit.js';

import {arraySubsequenceMatch, generateUniqueId, handleElementCount, replaceIdSuffix} from './utils/elementNumberingId.js'
// ======== Validation get element ==========
import { getEl } from './utils/validationGetElement.js';

let webpageDb=  globals.webpageDb
let editorFieldSelect=globals.editorFieldSelect
let accordionSelect=globals.accordionSelect

function accordionStyling(){
  document.getElementById('head-indicator-type').addEventListener('change', function(){
    accordionSelect=globals.accordionSelect
    editorFieldSelect=globals.editorFieldSelect
    let indicatorType='none'
    if(this.value !== ''){
      if(accordionSelect){
        accordionSelect.querySelectorAll('[id^="btn-heading-"]').forEach(head =>{
          let spanHead = head.children[0]
          let indicator=''
          if(spanHead.nextElementSibling){
            spanHead.nextElementSibling.remove()
          }
          
          if(this.value === 'default'){
            indicator =`
              <svg data-accordion-icon class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
              </svg>
            `
            indicatorType = 'default'
  
          }else if(this.value === 'icon'){
            indicator =`<div data-accordion-icon >&#11163;</div>`
            indicatorType = 'icon'
  
          }else if(this.value === 'question'){
            indicator = `<div class="btn-cta">
                          <p>?</p>
                        </div>`
            indicatorType = 'question'
  
          }
    
          if(this.value !== 'none'){
            spanHead.insertAdjacentHTML('afterend', indicator)
          }
          accordionSelect.dataset.typeIndicator = indicatorType
    
          if(this.value !== 'question'){
            setTimeout(() => {
                try {
                    initFlowbite();
                } catch (error) {
                    console.error('Gagal menginisialisasi Accordion:');
                }
            }, 50);  
          }
          globals.accordionSelect=accordionSelect
        })
      }else{
        let indicator=''
        
        if(editorFieldSelect.id.startsWith('parent-modal')){
          editorFieldSelect = getEl(`btn-${editorFieldSelect.id.split('-').slice(1).join('-')}`)
        }

        if (editorFieldSelect.children.length > 1) {
          editorFieldSelect.children[1].remove()
        }
        
        if(this.value === 'default'){
          indicator =`
            <svg class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
            </svg>
          `
          indicatorType = 'default'
          
        }else if(this.value === 'icon'){
          indicator =`<div>&#11163;</div>`
          indicatorType = 'icon'
          
        }else if(this.value === 'question'){
          indicator = `<div class="btn-cta">
                        <p>?</p>
                      </div>`
          indicatorType = 'question'
  
        }
  
        if(this.value !== 'none'){
          editorFieldSelect.insertAdjacentHTML('beforeend', indicator)
        }
        editorFieldSelect.dataset.typeIndicator=indicatorType
      }
      updateContent(editorFieldSelect, this.value)
      globals.editorFieldSelect=editorFieldSelect
    }
  })

  document.getElementById('accordion-type').addEventListener('change', function(){
    accordionSelect=globals.accordionSelect
    webpageDb=globals.webpageDb
    let id = accordionSelect.id
    if(this.value === 'collapse'){
      accordionSelect.querySelector('[id^="parent-"]').setAttribute('data-accordion', 'collapse')
      webpageDb.forEach(page=>{
        if(page.id === id){
          let contentObj = parseStyleObj(page.content);
          contentObj.accordionType="collapse"
          page.content = stringifyStyleObj(contentObj)
          page.action=updateActionProperty(page.action, 'update')
        }
      })
    }else if(this.value === 'open'){
      accordionSelect.querySelector('[id^="parent-"]').setAttribute('data-accordion', 'open')
      webpageDb.forEach(page=>{
        if(page.id === id){
          let contentObj = parseStyleObj(page.content);
          contentObj.accordionType="open"
          page.content = stringifyStyleObj(contentObj)
          page.action=updateActionProperty(page.action, 'update')
        }
      })
    }

    globals.isFormDirty = true

    globals.webpageDb=webpageDb
    setTimeout(() => {
      try {
          // Panggil initFlowbite setelah inisialisasi accordion spesifik ini
          // dan setelah ada sedikit penundaan
          initFlowbite();
      } catch (error) {
          console.error(' Gagal menginisialisasi Modal:');
      }
    }, 100);  
  })
}

const createItemAccordion = (itemId, item, accordionEl,edit)=>{
    let indicator=''
    if(parseStyleObj(accordionEl.content).headType === 'question'){
      indicator = `<div class="btn-cta">
                    <p>?</p>
                  </div>`
    }else if(parseStyleObj(accordionEl.content).headType === 'icon'){
      indicator = `<div data-accordion-icon>⮛</div>`
    }else if(parseStyleObj(accordionEl.content).headType === 'none'){
      indicator = ``
    }else{
      indicator = `<svg data-accordion-icon class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                  </svg>`
    }

    return`
        <div id="${itemId}" class="relative z-10" data-element-order="${item.element_order}">
          ${
            edit ? 
              `<div type="button" class="bg-red-400 rounded-full absolute right-0 top-0 z-20 cursor-pointer" data-dropdown-toggle="dropdown-head-${itemId}" data-dropdown-placement="right-end">
                ${renderSvg()}   
              </div>`
              :''
          }
          
          <h2 id="heading-${itemId}">
            <button type="button" id="btn-heading-${itemId}" style="${item.style}"
            class="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-gray-400 dark:!text-inherit"
            data-accordion-target="#body-${itemId}"
            aria-expanded="false"
            aria-controls="body-${itemId}">
              <div style="width:100%;">
                ${item.content}
              </div>
              ${indicator}
            </button>
          </h2>
    
          <div id="body-${itemId}" data-element-count="${item.element_count}" class="z-30 hidden relative flex flex-col justify-center items-center">   
          </div>
        </div>
    `
}

const createAccordion = (accordion,edit)=>`
  <div id="${accordion.id}" class="relative cursor-pointer" data-element-order="${accordion.element_order}" data-type-indicator="${parseStyleObj(accordion.content).headType}" style="${accordion.style}">
    ${
      edit ?
        `<div type="button" class="bg-white rounded-full absolute right-[-1.7rem] top-[0.2rem] z-20 cursor-pointer" data-dropdown-toggle="dropdown-${accordion.id}" data-dropdown-placement="right-end">
          ${renderSvg()}                 
        </div>`
        :''
    }
    
    <div id="parent-${accordion.id}" data-item-accordion="${accordion.element_count}" data-accordion="${parseStyleObj(accordion.content).accordionType}">
    </div>
  </div>
`
const createDropdownHeadAccordion = (idPrefix)=>`
      <div id="dropdown-head-${idPrefix}" data-accordion="open" class="absolute mt-2 left-0 w-20 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
          <li><a id="down-head-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
          <li><a id="up-head-${idPrefix}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
          <li><a id="copy-head-${idPrefix}" class=" text-blue-600 cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a></li>
        </ul>
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
          <li><a id="delete-head-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
        </ul>
      </div> 
`
const createDropdownSectionAccordion = (idPrefix,idParts)=>{
  let bodyDropdown =``
  if(idParts[2] === 'in' || idParts[4] === 'in'){
    bodyDropdown =`
    <div id="dropdown-body-${idPrefix.split('-').slice(1).join('-')}" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        <li>
          <a id="add-section-${idPrefix.split('-').slice(1).join('-')}" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Add Section</a>
        </li>
        <li>
          <a id="up-section-${idPrefix.split('-').slice(1).join('-')}" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
        </li>
        <li>
          <a id="down-section-${idPrefix.split('-').slice(1).join('-')}" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
        </li>
        <li>
          <a id="copy-section-${idPrefix.split('-').slice(1).join('-')}" class="text-blue-600 font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a>
        </li>
        <li>
          <a id="delete-section-${idPrefix.split('-').slice(1).join('-')}" class="text-red-600 font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete Section</a>
        </li>
        <hr>
        <li>
          <a id="add-field-${idPrefix.split('-').slice(1).join('-')}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
        </li>
        <li>
          <a id="add-carousel-${idPrefix.split('-').slice(1).join('-')}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
        </li>
      </ul>
    </div> 
      `
  }else{
    bodyDropdown =`
    <div id="dropdown-body-${idPrefix.split('-').slice(1).join('-')}" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        <li>
            <a id="add-section-${idPrefix.split('-').slice(1).join('-')}" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Add Section</a>
        </li>
        <li>
            <a id="up-section-${idPrefix.split('-').slice(1).join('-')}" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
        </li>
        <li>
            <a id="down-section-${idPrefix.split('-').slice(1).join('-')}" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
        </li>
        <li>
          <a id="copy-section-${idPrefix.split('-').slice(1).join('-')}" class="font-bold cursor-pointer block px-4 py-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a>
        </li>
        <li>
            <a id="delete-section-${idPrefix.split('-').slice(1).join('-')}" class="text-red-600 font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete Section</a>
        </li>
        <hr>
        <li>
            <a id="add-field-${idPrefix.split('-').slice(1).join('-')}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
        </li>
        <li>
            <a id="add-modal-${idPrefix.split('-').slice(1).join('-')}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modal</a>
        </li>
        <li>
            <a id="add-accordion-in-${idPrefix.split('-').slice(1).join('-')}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Accordion</a>
        </li>
        <li>
            <a id="add-carousel-${idPrefix.split('-').slice(1).join('-')}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
        </li>
      </ul>
    </div> 
    `
  }
  return bodyDropdown
}
const createBodyDropdownAccordion =(idPrefix, idParts)=>`
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
          <li>
              <a id="copy-${idPrefix}" class="cursor-pointer block px-4 py-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a>
          </li>
      </ul>
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-0 border-t-1 border-gray-500 " aria-labelledby="dropdownDefaultButton">
        <li>
            <a id="delete-${idPrefix}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
        </li>
      </ul>
    </div>
`
const addAccordion=(event)=>{
  webpageDb=globals.webpageDb
  const idParts = event.target.id.split('-');
  let bodyAppend, accordionWidth,idPrefix, accordionId, idAppendAccordion, fieldNumber, accordionParentBody, itemCount, dropdownBody
  
  const createItemAccordionHTML = (idPrefix, i, content, lastNumberId)=>{
    let newHeadId = `btn-heading-${idPrefix}-${i}`
    let newPrefix = `${idPrefix}-${i}`
    if(lastNumberId){
      i = lastNumberId
      newHeadId =idPrefix
      newPrefix=newHeadId.split('-').slice(2).join('-')
    }
    webpageDb.push({
      id:newHeadId,
      type: "head-accordion",
      style: 'background-color:rgba(255,255,255,1);padding:15px;border-bottom: 1px solid black;',
      content:`<div style="width:100%;text-align:left;"><font size="3">Section ${i}</font></div>`,
      element_order: i,
      element_count: 1,
      action:'new-add'
    },
    {
      id: `section-${newPrefix}-1`,
      type: 'section-accordion',
      style: 'background-color:rgba(237,237,237,1);padding:10px;',
      element_order: 1,
      element_count: 1,
      action:'new-add'
    },
    {
      id: `field-${newPrefix}-1-${1}`,
      type: 'field',
      content: `<font size="3">isi section ${1} di field ${1}</font>`,
      element_order:1,
      style:``,
      action:'new-add'
    })

    let indicator=''
    if(content === 'question'){
      indicator = `<div class="btn-cta">
                    <p>?</p>
                  </div>`
    }else if(content === 'icon'){
      indicator = `<div data-accordion-icon>⮛</div>`
    }else if(content === 'none'){
      indicator = ``
    }else{
      indicator = `<svg data-accordion-icon class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                  </svg>`
    }

    return`
    <div id="${newPrefix}" class="relative z-10" data-element-order="${i}">
      <div type="button" class="bg-red-400 rounded-full absolute right-0 top-0 z-20 cursor-pointer" data-dropdown-toggle="dropdown-head-${newPrefix}" data-dropdown-placement="right-end">
        ${renderSvg()}  
      </div>

      <h2 id="heading-${newPrefix}">
        <button type="button" id="btn-heading-${newPrefix}"
        class="flex justify-between w-full dark:!text-inherit"
        style="background-color:rgba(255,255,255,1);padding:15px;border-bottom: 1px solid black;"
        data-accordion-target="#body-${newPrefix}"
        aria-expanded="false"
        aria-controls="body-${newPrefix}">
          <div class="w-full">
            <div style="width:100%;text-align:left;">
              <font size="3">Section ${i}</font>
            </div>
          </div>
          ${indicator}
        </button>
      </h2>

      <div id="body-${newPrefix}" data-element-count="1" class="z-30 hidden relative flex flex-col justify-center items-center">
        <div id="section-${newPrefix}-1" data-element-order="1" style="background-color:rgba(237,237,237,1);padding:10px;" class="relative w-full flex flex-col justify-center items-center border border-gray-400">
          <div type="button" class="bg-blue-400 rounded-full absolute right-0 top-0 z-20 cursor-pointer" data-dropdown-toggle="dropdown-body-${newPrefix}-1" data-dropdown-placement="right-end">
            ${renderSvg()}   
          </div>

          <div id="wrapper-section-${newPrefix}-1" data-element-count="1" class="p-4 flex justify-start items-center flex-col">
            <!-- Body Accordion -->
            <div data-element-order="1" style="position: relative;" class="my-1">
              <div type="button" class="bg-white rounded-full absolute  right-[-1.5rem] top-[1rem] z-20 cursor-pointer" data-dropdown-toggle="dropdown-field-${newPrefix}-1-${1}" data-dropdown-placement="right-end">
                ${renderSvg()}   
              </div>
              
              <div id="field-${newPrefix}-1-${1}" style="" class="border border-b-1 border-gray-500 px-1 max-w-[100%] scroll-hidden overflow-scroll" contenteditable="true">
                <font size="3">isi section ${1} di field ${1}</font>
              </div>
            </div>  
          </div>
        </div>  
      </div>
    </div>
    `
  }
  const createAccordionHTML = (idPrefix,fieldNumber, accordionWidth)=>{
    webpageDb.push({
      id:idPrefix,
      type:'accordion',
      element_order:fieldNumber,
      element_count:3,
      content: '{"accordionType":"collapse","headIndicator":"default"}',
      style:`overflow-anchor:none;height:auto;width:${accordionWidth}`,
      action:'new-add'
    })

    let accordionItem=``
    for (let i = 1; i <= 3; i++) {
      accordionItem += createItemAccordionHTML(idPrefix, i)
    }
    return `
    <div id="${idPrefix}" class="relative cursor-pointer" data-element-order="${fieldNumber}" data-type-indicator="default" style="overflow-anchor:none;height:auto;width:${accordionWidth}">
      <div type="button" class="bg-white rounded-full absolute right-[-1.7rem] top-[0.2rem] z-20 cursor-pointer" data-dropdown-toggle="dropdown-${idPrefix}" data-dropdown-placement="right-end">
        ${renderSvg()}                 
      </div>
      <div id="parent-${idPrefix}" data-item-accordion="3" data-accordion="collapse">
        ${accordionItem}
      </div>
    </div>
  `}
  const createItemBodyDropdownHTML = (idPrefix,idParts,i, lastNumberId)=>{
    if(lastNumberId){
      newHeadId =idPrefix
      newPrefix=newHeadId.split('-').slice(2).join('-')
    }

    let bodyDropdown =``
    bodyDropdown += `
        <div id="dropdown-head-${idPrefix}-${i}" data-accordion="open" class="absolute mt-2 left-0 w-20 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li><a id="down-head-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a></li>
            <li><a id="up-head-${idPrefix}-${i}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a></li>
            <li><a id="copy-head-${idPrefix}-${i}" class="text-blue-600 cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a></li>  
          </ul>
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-500">
            <li><a id="delete-head-${idPrefix}-${i}" class="cursor-pointer font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a></li>
          </ul>
        </div>
        
        <div id="dropdown-field-${idPrefix}-${i}-1-${1}" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              <li>
                  <a id="up-field-${idPrefix}-${i}-1-${1}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
              </li>
              <li>
                  <a id="down-field-${idPrefix}-${i}-1-${1}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
              </li>
              <li>
                  <a id="copy-field-${idPrefix}-${i}-1-${1}" class="cursor-pointer text-blue-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Duplikat</a>
              </li>
              <li>
                  <a id="delete-field-${idPrefix}-${i}-1-${1}" class="cursor-pointer text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete</a>
              </li>
          </ul>
        </div>
        `
    if(idParts[2] === 'in' || idParts[4] === 'in'){
      bodyDropdown +=`
      <div id="dropdown-body-${idPrefix}-${i}-1" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
          <li>
            <a id="add-section-${idPrefix}-${i}-1" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Add Section</a>
          </li>
          <li>
            <a id="up-section-${idPrefix}-${i}-1" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
          </li>
          <li>
            <a id="down-section-${idPrefix}-${i}-1" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
          </li>
          <li>
            <a id="copy-section-${idPrefix}-${i}-1" class="cursor-pointer text-blue-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Duplikat</a>
          </li>
          <li>
            <a id="delete-section-${idPrefix}-${i}-1" class="text-red-600 font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete Section</a>
          </li>
          <hr>
          <li>
            <a id="add-field-${idPrefix}-${i}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
          </li>
          <li>
            <a id="add-carousel-${idPrefix}-${i}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
          </li>
        </ul>
      </div> 
        `
    }else{
      bodyDropdown +=`
      <div id="dropdown-body-${idPrefix}-${i}-1" data-accordion="open" class="absolute mt-2 left-0 w-25 z-30 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
          <li>
              <a id="add-section-${idPrefix}-${i}-1" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Add Section</a>
          </li>
          <li>
              <a id="up-section-${idPrefix}-${i}-1" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Up</a>
          </li>
          <li>
              <a id="down-section-${idPrefix}-${i}-1" class="font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Move Down</a>
          </li>
          <li>
            <a id="copy-section-${idPrefix}-${i}-1" class="cursor-pointer text-blue-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Duplikat</a>
          </li>
          <li>
              <a id="delete-section-${idPrefix}-${i}-1" class="text-red-600 font-bold cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">Delete Section</a>
          </li>
          <hr>
          <li>
              <a id="add-field-${idPrefix}-${i}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Field</a>
          </li>
          <li>
              <a id="add-modal-${idPrefix}-${i}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modal</a>
          </li>
          <li>
              <a id="add-accordion-in-${idPrefix}-${i}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Accordion</a>
          </li>
          <li>
              <a id="add-carousel-${idPrefix}-${i}-1" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Carousel</a>
          </li>
        </ul>
      </div> 
      `
    }

    return bodyDropdown
  }
  const createBodyDropdownHTML =(idPrefix, idParts)=>{
    let bodyDropdown=``
    for (let i = 1; i <= 3; i++) {
      bodyDropdown+=createItemBodyDropdownHTML(idPrefix,idParts,i)
    }
    
    bodyDropdown += `
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
            <li>
                <a id="copy-${idPrefix}" class="cursor-pointer block px-4 py-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplikat</a>
            </li>
        </ul>
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 border-0 border-t-1 border-gray-500 " aria-labelledby="dropdownDefaultButton">
          <li>
              <a id="delete-${idPrefix}" class="font-bold block text-red-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">Delete</a>
          </li>
        </ul>
      </div>
    `
    return bodyDropdown
  }

  if(idParts[2] === 'head'){

    let parentAccordionId=`parent-${idParts.slice(3, idParts.length).join('-')}`

    accordionParentBody = getEl(parentAccordionId)
    if (!accordionParentBody) return false;
    
    itemCount = handleElementCount(accordionParentBody, accordionParentBody.dataset.itemAccordion)
    
    accordionId = `${idParts.slice(3, idParts.length).join('-')}`
    idPrefix = `${idParts.slice(3, idParts.length).join('-')}`

    let newBtnId = generateUniqueId(`btn-heading-${idPrefix}-${itemCount}`,itemCount ,true)
    let lastNumberId = newBtnId.split('-').slice(-1)
    event.target.parentElement.parentElement.parentElement.classList.add('hidden')
    
    accordionParentBody.innerHTML += createItemAccordionHTML(newBtnId,itemCount, accordionParentBody.parentElement.dataset.typeIndicator, lastNumberId);
    accordionParentBody.setAttribute('data-item-accordion', itemCount.toString());

    const webpageSection = getEl(`webpage-section-${idParts.find(part => !isNaN(part))}`)
    if (!webpageSection) return false;

    webpageSection.insertAdjacentHTML('beforeend',createItemBodyDropdownHTML(idPrefix,idParts,lastNumberId))
    dropdownInitialized('multi', idPrefix)
    console.log(idPrefix)

    webpageDb.forEach(page =>{
      if(page.id === idParts.slice(3, idParts.length).join('-')){
        page.element_count = itemCount
        page.action = updateActionProperty(page.action, 'update')
      }
    })

  }else if(idParts[2] != 'head'){
    if(idParts.join('-').includes('accordion-in-accordion')){

      idAppendAccordion = `wrapper-section-${idParts.slice(3, idParts.length).join('-')}`

      bodyAppend = getEl(idAppendAccordion)
      if (!bodyAppend) return false;
      
      fieldNumber = handleElementCount(bodyAppend, bodyAppend.dataset.elementCount)
      bodyAppend.dataset.elementCount = fieldNumber;

      idPrefix = generateUniqueId(`${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`, bodyAppend);
      accordionId = idPrefix

      event.target.parentElement.parentElement.parentElement.classList.add('hidden')
      accordionWidth= '300px'
      
    }else{
      idAppendAccordion = `editor-container-section-${idParts[4]}`

      const section = getEl(idAppendAccordion)
      if (!section) return false;
    
      fieldNumber = handleElementCount(section, section.dataset.elementCount)
      section.dataset.elementCount = fieldNumber
      idPrefix = generateUniqueId(`${idParts.slice(1, idParts.length).join('-')}-${fieldNumber}`, section)

      accordionId = idPrefix
      accordionWidth= '400px'
    }

    const webpageSection = getEl(`webpage-section-${idParts.find(part => !isNaN(part))}`)
    const appendAccordion = getEl(idAppendAccordion)

    if (!webpageSection || !appendAccordion) return false;

    webpageSection.insertAdjacentHTML('beforeend', createBodyDropdownHTML(idPrefix,idParts))
    appendAccordion.insertAdjacentHTML('beforeend',createAccordionHTML(idPrefix,fieldNumber,accordionWidth));

    dropdownInitialized('multi', idPrefix)
    console.log(idPrefix)
    webpageDb.forEach(item=>{
      if(item.id === `webpage-section-${idParts.find(part => !isNaN(part))}` && idParts.filter(part => !isNaN(part)).length == 1){
        item.element_count++
        item.action = updateActionProperty(item.action, 'update')
      }else if(item.id === `section-${idParts.slice(3).join('-')}` && idParts.join('-').startsWith('add-accordion-in-accordion')){
        item.element_count++
        item.action = updateActionProperty(item.action, 'update')
      }
    })
  }

  globals.isFormDirty = true

  const accordionEl = getEl(accordionId, 'acc652')
  if (!accordionEl) return false;
  
  accordionEl.querySelectorAll('[data-listener-added]').forEach(el =>{
    el.dataset.listenerAdded=''
  })

  setTimeout(() => {
      try {
          const accordionElement = getEl(accordionId, 'acc661');
          if (accordionElement) {
              const accordion = new Accordion(accordionElement, {
                  alwaysOpen: false,
                  activeClasses: 'bg-gray-100 text-gray-900',
                  inactiveClasses: 'text-gray-500'
              });
              //console.log(' Accordion berhasil diinisialisasi:', accordionElement.id);
          } else {
              // console.warn(' Elemen Accordion tidak ditemukan setelah appendChild');
          }

          // Panggil initFlowbite setelah inisialisasi accordion spesifik ini
          // dan setelah ada sedikit penundaan
          initFlowbite();

      } catch (error) {
          console.error('Gagal menginisialisasi Accordion:');
      }
  }, 100);  

  globals.webpageDb=webpageDb
}

const copyAccordion=(idAccordion, mode="all")=>{
  try {
    webpageDb=globals.webpageDb
      let accordionId = idAccordion
      const accordionEl = getEl(accordionId, 'acc690');
      if (!accordionEl) return false;
      
      const container = accordionEl.parentElement;
      if (!container) {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: 'accordionEl add carousel tidak ditemukan', status:false} 
        }));
        return false;
      }

      // hitung count baru & simpan
      const countNumber = handleElementCount(container, container.dataset.elementCount)

      // clone elemen (btn + modal body)
      const accordionCopy = accordionEl.cloneNode(true);

      // buat id baru dengan mengganti angka terakhir
      const oldAccId = accordionEl.id;
      let newAccId = ''
      if(mode != 'all'){
        newAccId = generateUniqueId(oldAccId, container)
        accordionCopy.id = newAccId;
      }

      function updateAccordionAttributes(accordionCopyElement, oldAccId, newAccId) {
        const oldSuffix = oldAccId.split('-').slice(1).join('-');
        const newSuffix = newAccId.split('-').slice(1).join('-');

        // Ambil semua elemen di dalam modal yang disalin
        accordionCopyElement.querySelectorAll('*').forEach(el => {
          // Cek setiap atribut
          for (const attr of el.getAttributeNames()) {
            const val = el.getAttribute(attr);
            if (!val || typeof val !== 'string') continue;

            // Kalau value mengandung ID lama, ganti jadi ID baru
            if (arraySubsequenceMatch(val.split('-'), oldSuffix.split('-'))) {
              const newVal = replaceIdSuffix(val, oldSuffix, newSuffix);
              el.setAttribute(attr, newVal);
            }
          }

          // Kalau ID-nya sendiri mengandung substring lama, ganti juga
          if (el.id && arraySubsequenceMatch(el.id.split('-'), oldSuffix.split('-'))) {
            const newId = replaceIdSuffix(el.id, oldSuffix, newSuffix);;

            // Update id di DOM
            el.id = newId;

            // Update juga di database (webpageDb)
            const originalField = webpageDb.find(f => f.id === el.id);
            if (originalField) {
              const cloned = structuredClone(originalField);
              cloned.id = newId;
              cloned.action='new-add'

              if(cloned.file){
                delete cloned.file
              }
              
              webpageDb.push(cloned);
            }
          }
        });
      }
      
      const originalOrder = parseInt(accordionCopy.dataset.elementOrder || '0', 10);
      const newOrderBase = originalOrder + 1;

      if(mode=='all'){
        // update element order btnCopy: +1 dari original (jika ada)
        accordionCopy.dataset.elementOrder = String(newOrderBase);
        container.dataset.elementCount = String(countNumber);
        newAccId = generateUniqueId(oldAccId, container)
        accordionCopy.id = newAccId;

        // 1) Perbarui element_order pada sibling (hanya direct children container)
        Array.from(container.children).forEach(el => {
          const currentOrder = parseInt(el.dataset?.elementOrder || '0', 10);
          if (isNaN(currentOrder)) return;

          if (currentOrder >= newOrderBase) {
            const updated = currentOrder + 1;
            el.dataset.elementOrder = String(updated);

            let id = el.id;

            if (!id) {
              const childWithId = el.querySelector('[id^="field-"]');
              if (childWithId) id = childWithId.id;
            }

            if (!id) return;

            const idx = webpageDb.findIndex(f => f.id === id);
            if (idx !== -1) {
              webpageDb[idx].element_order = String(updated);
              webpageDb[idx].action = updateActionProperty(webpageDb[idx].action, 'update');
            }
          }
        });

        accordionEl.insertAdjacentElement('afterend', accordionCopy);

        accordionEl.querySelectorAll(`[id^="wrapper-section-accordion"]`).forEach(wrapper=>{
          Array.from(wrapper.children).forEach(el=>{
            if(el.id.startsWith('modal')){
              copyModal(el.id, 'body', newAccId, oldAccId)
            }
          })
        })
          
        updateAccordionAttributes(accordionCopy, oldAccId, newAccId)

        // Duplikasi semua elemen di webpageDb yang terkait dengan oldBtnId
        const relatedObjects = webpageDb.filter(obj => arraySubsequenceMatch(obj.id.split('-'), oldAccId.split('-')));

        relatedObjects.forEach(originalObj => {
          const clonedObj = deepClone(originalObj);
          
          if(clonedObj.action=='delete'){
            return
          }

          if(clonedObj.file){
            delete clonedObj.file
          }
          clonedObj.id = replaceIdSuffix(clonedObj.id, oldAccId, newAccId);
          clonedObj.action = 'new-add'

          if (clonedObj.id.startsWith('accordion')) {
            clonedObj.element_order = String(newOrderBase);
          }
          webpageDb.push(clonedObj);
        });   

        //update element count container
        if (container.id.startsWith('wrapper-section-accordion')) {
          const containerField = webpageDb.find(f => f.id === container.id.split('-').slice(1).join('-'));
          if (containerField){
            containerField.element_count = countNumber;
            containerField.action = updateActionProperty(containerField.action, 'update')
          }
        }else if(container.id.startsWith('editor')){
          const containerField = webpageDb.find(f => f.id === `webpage-section-${container.id.split('-').find(part => !isNaN(part))}`);
          if (containerField) {
            containerField.element_count = countNumber;
            containerField.action = updateActionProperty(containerField.action, 'update')
          }
        }else{
          const containerField = webpageDb.find(f => f.id === container.id);
          if (containerField) {
            containerField.element_count = countNumber;
            containerField.action = updateActionProperty(containerField.action, 'update')
          }
        }
      }

      accordionCopy.removeAttribute('data-listener-added')
      accordionCopy
        .querySelectorAll('[data-listener-added]')
        .forEach(el => el.removeAttribute('data-listener-added'));

      accordionCopy
      .querySelectorAll('[data-listener-mouse-added]')
      .forEach(el => el.removeAttribute('data-listener-mouse-added'));

      // Duplikat body Dropdowns
      const bodyDropdown = accordionEl.querySelectorAll(`[data-dropdown-toggle]`);
      bodyDropdown.forEach(dropdown=>{
        let bodyDropdown = getEl(dropdown.dataset.dropdownToggle, 'acc860')
        if(!bodyDropdown)return
        
        let copyBodyDropdown = bodyDropdown.cloneNode(true);
        copyBodyDropdown.id = replaceIdSuffix(copyBodyDropdown.id, oldAccId, newAccId);
        
        copyBodyDropdown.querySelectorAll('[id]').forEach(el => {
          el.id = replaceIdSuffix(el.id, oldAccId, newAccId)
        });
        copyBodyDropdown.dataset.initialized = ''; 
        copyBodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';

        bodyDropdown.insertAdjacentElement('afterend', copyBodyDropdown);
      }) 
  
      // inisialisasi dropdown baru: coba id dropdown baru dari btnCopy's toggles
      if(mode=='all'){
        const anyToggle = accordionCopy.querySelectorAll('[data-dropdown-toggle]');
        if (anyToggle) {
          anyToggle.forEach(target=>{
            const newDropdownTarget = target.getAttribute('data-dropdown-toggle');
            dropdownInitialized('', newDropdownTarget);
          })
        }
      }

      // init accordion
      setTimeout(() => {
        try {
          const accordionElement = getEl(newAccId, 'acc889');
          if (accordionElement) {
            new Accordion(accordionElement, {
              alwaysOpen: false,
              activeClasses: 'bg-gray-100 text-gray-900',
              inactiveClasses: 'text-gray-500'
            });
            //console.log('Accordion berhasil diinisialisasi:', newAccId);
          }
          initFlowbite();
        } catch (error) {
          
          console.error('Gagal inisialisasi accordion');
        }
      }, 100);
      let webpageDbParentSection = globals.webpageDbParentSection

      globals.isFormDirty = true

      globals.webpageDb=webpageDb

      return true;
  } catch (e) {
    console.error('duplicateModal error');
    return false;
  }
}

const copyHeadAccordion=(idHeadAcc, mode="all")=>{
  try {
    webpageDb=globals.webpageDb
      let headAccordionId = idHeadAcc

      const headAccordionEl = getEl(headAccordionId, 'acc922');
      if (!headAccordionEl) return false;
      
      const container = headAccordionEl.parentElement;
      if (!container) {

        window.dispatchEvent(new CustomEvent('notif-pesan', { 
          detail: { pesan: 'container copyhead accordion tidak ditemukan', status:false} 
        }));
      
        return false;
      }

      // hitung count baru & simpan
      const countNumber = handleElementCount(container, container.dataset.itemAccordion)
      container.dataset.itemAccordion = String(countNumber);

      // buat id baru dengan mengganti angka terakhir
      const oldHeadAccId = headAccordionEl.id;
      let headAccId = generateUniqueId(`btn-heading-${oldHeadAccId}`, countNumber, true)
      const newHeadAccId = headAccId.split('-').slice(2).join('-')
     

      function updateAccordionAttributes(headAccordionCopyElement, oldHeadAccId, newHeadAccId) {
        const oldSuffix = oldHeadAccId.split('-').slice(1).join('-');
        const newSuffix = newHeadAccId.split('-').slice(1).join('-');

        // Ambil semua elemen di dalam modal yang disalin
        headAccordionCopyElement.querySelectorAll('*').forEach(el => {
          // Cek setiap atribut
          for (const attr of el.getAttributeNames()) {
            const val = el.getAttribute(attr);
            if (!val || typeof val !== 'string') continue;

            //  Kalau value mengandung ID lama, ganti jadi ID baru
            if (arraySubsequenceMatch(val.split('-'), oldSuffix.split('-'))) {
         
              const newVal = replaceIdSuffix(val, oldSuffix, newSuffix);
              el.setAttribute(attr, newVal);
          
            }
          }
        });
      }

      const headAccordionCopy = headAccordionEl.cloneNode(true);
      headAccordionCopy.id = newHeadAccId;

      // update element order btnCopy: +1 dari original (jika ada)
      const originalOrder = parseInt(headAccordionCopy.dataset.elementOrder || '0', 10);
      const newOrderBase = originalOrder + 1;
      headAccordionCopy.dataset.elementOrder = String(newOrderBase);

      // 1) Perbarui element_order pada sibling (hanya direct children container)
      Array.from(container.children).forEach(el => {
        const currentOrder = parseInt(el.dataset?.elementOrder);
        if (isNaN(currentOrder)) return;

        if (currentOrder >= newOrderBase) {
          const updated = currentOrder + 1;
          el.dataset.elementOrder = String(updated);

          let id = el.id;
          if (!id) return;

          const idx = webpageDb.findIndex(f => f.id === `btn-heading-${id}`);
          if (idx !== -1) {
            webpageDb[idx].element_order = String(updated);
            webpageDb[idx].action = updateActionProperty(webpageDb[idx].action, 'update');
          }
        }
      });

      updateAccordionAttributes(headAccordionCopy, oldHeadAccId, newHeadAccId)
      headAccordionEl.insertAdjacentElement('afterend', headAccordionCopy);

      // Duplikat body Dropdowns
      const bodyDropdown = headAccordionEl.querySelectorAll(`[data-dropdown-toggle]`);
      bodyDropdown.forEach(dropdown=>{
        let bodyDropdown = getEl(dropdown.dataset.dropdownToggle, 'acc1019')
        if (!bodyDropdown) return false;

        let copyBodyDropdown = bodyDropdown.cloneNode(true);
        copyBodyDropdown.id= replaceIdSuffix(copyBodyDropdown.id, oldHeadAccId, newHeadAccId);
        
        copyBodyDropdown.querySelectorAll('[id]').forEach(el => {
          el.id = replaceIdSuffix(el.id, oldHeadAccId, newHeadAccId)
        });
        copyBodyDropdown.dataset.initialized = ''; 
        copyBodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';

        bodyDropdown.insertAdjacentElement('afterend', copyBodyDropdown);
      })

      const copyDropdown = headAccordionEl.querySelectorAll(`[data-dropdown-toggle]`)
      copyDropdown.forEach(dropdown=>{
        let bodyDropdown =getEl(dropdown.dataset.dropdownToggle, 'acc1019')
        if (!bodyDropdown) return false;
        
        bodyDropdown.className = 'w-25 z-40 hidden bg-white divide-y divide-blue-100 rounded-lg shadow-sm dark:bg-gray-700';
      })

      headAccordionEl.querySelectorAll(`[id^="wrapper-section-accordion"]`).forEach(wrapper=>{
        Array.from(wrapper.children).forEach(el=>{
          if(el.id.startsWith('modal')){
            copyModal(el.id, 'body', newHeadAccId, oldHeadAccId)
          }
        })
      })

      headAccordionCopy.removeAttribute('data-listener-added')
      headAccordionCopy
        .querySelectorAll('[data-listener-added]')
        .forEach(el => el.removeAttribute('data-listener-added'));

      headAccordionCopy
        .querySelectorAll('[data-listener-mouse-added]')
        .forEach(el => el.removeAttribute('data-listener-mouse-added'));

      // Duplikasi semua elemen di webpageDb yang terkait dengan oldBtnId
      const relatedObjects = webpageDb.filter(obj => arraySubsequenceMatch(obj.id.split('-'), oldHeadAccId.split('-')));

      relatedObjects.forEach(originalObj => {
        const clonedObj = deepClone(originalObj);
        if(clonedObj.action=='delete'){
          return
        }
        if(clonedObj.file){
          delete clonedObj.file
        }
        if(clonedObj.id === `btn-heading-${oldHeadAccId}`){
          clonedObj.element_order = String(newOrderBase);
        }

        clonedObj.id = replaceIdSuffix(clonedObj.id, oldHeadAccId, newHeadAccId);
        clonedObj.action = 'new-add'


        webpageDb.push(clonedObj);

      });    

      //update element count container
      if (container.id.startsWith('wrapper-section-accordion')) {
        const containerField = webpageDb.find(f => f.id === container.id.split('-').slice(1).join('-'));
        if (containerField) {
          containerField.element_count = countNumber;
          containerField.action = updateActionProperty(containerField.action, 'update')
        }
      }else if(container.id.startsWith('editor')){
        const containerField = webpageDb.find(f => f.id === `webpage-section-${container.id.split('-').find(part => !isNaN(part))}`);
        if (containerField) {
          containerField.element_count = countNumber;
          containerField.action = updateActionProperty(containerField.action, 'update')
        }
      }else if(container.id.startsWith('parent-accordion-')){
        const containerField = webpageDb.find(f => f.id === container.id.split('-').slice(1).join('-'));
        if (containerField) {
          containerField.element_count = countNumber;
          containerField.action = updateActionProperty(containerField.action, 'update')
        }
      }else{
        const containerField = webpageDb.find(f => f.id === container.id);
        if (containerField) {
          containerField.element_count = countNumber;
          containerField.action = updateActionProperty(containerField.action, 'update')
        }
      }

      // inisialisasi dropdown baru: coba id dropdown baru dari btnCopy's toggles
      const anyToggle = headAccordionCopy.querySelectorAll('[data-dropdown-toggle]');
      if (anyToggle) {
        anyToggle.forEach(target=>{
          const newDropdownTarget = target.getAttribute('data-dropdown-toggle');
          dropdownInitialized('', newDropdownTarget);
        })
      }

      globals.webpageDb=webpageDb
      globals.isFormDirty = true

      // init accordion
      setTimeout(() => {
        try {
          
          const accordionElement = getEl(newHeadAccId.split('-').slice(0,-1).join('-'));
          if (accordionElement) {
            new Accordion(accordionElement, {
              alwaysOpen: false,
              activeClasses: 'bg-gray-100 text-gray-900',
              inactiveClasses: 'text-gray-500'
            });
            //console.log(' Accordion berhasil diinisialisasi:', newHeadAccId.split('-').slice(0,-1).join('-'));
          }
          initFlowbite();
        } catch (error) {
          // console.error(' Gagal inisialisasi accordion', error);
        }
      }, 100);

      return true;
  } catch (e) {
    console.error('duplicateModal error');
    return false;
  }
}

export { 
  accordionStyling,
  createItemAccordion,
  createAccordion,
  createDropdownHeadAccordion,
  createDropdownSectionAccordion,
  createBodyDropdownAccordion,
  addAccordion,
  copyAccordion,
  copyHeadAccordion
}