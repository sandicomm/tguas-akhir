// ======== GLOBALS =========
import { globals } from '../globals.js';

// ======== UTILITIES =========
import { parseStyleObj, stringifyStyleObj } from '../utils/baseStyleObj.js';

export function updateContent(editorFieldSelect, value){
  let webpageDb = globals.webpageDb,
  accordionSelect = globals.accordionSelect
  let id
  if(editorFieldSelect.id.startsWith('btn-modal-')){
    id=editorFieldSelect.id.split('-').slice(1).join('-')
  }else if(editorFieldSelect.id.startsWith('parent-modal-')){
    id=`body-${editorFieldSelect.id.split('-').slice(1).join('-')}`
  }else if(accordionSelect && value){
    id=accordionSelect.id
  }else{
    id=editorFieldSelect.id
  }

  if(id.startsWith('btn-heading-accordion')){
    webpageDb.forEach(item=>{
      if(item.type === 'head-accordion' && item.id === id){
        console.log(item, id)
        item.content = document.getElementById(item.id).querySelector('span').outerHTML
        item.action='update'
      }
    })
    
  }else if(id.startsWith('accordion-')){
    webpageDb.forEach(item=>{
      if(item.type === 'accordion' && item.id === id){
        let contentObj = parseStyleObj(item.content)
        contentObj.headType = value
        item.content = stringifyStyleObj(contentObj)
        item.action='update'
      }
    })
    // console.log('accordion berubah tipe indicator')

  }else{
    webpageDb.forEach(item=>{
      if(item.id === id){
        item.content = editorFieldSelect.innerHTML
        item.action='update'
        return
      }
    })
  }
  console.log('update content',webpageDb, id)
  globals.webpageDb=webpageDb
}

export function updateActionProperty(action='test', value){
  if(action.includes('new')){
    return `new-${value}`
  }else{
    return value
  }
}
