import { replaceTrailingNumber } from './utilsDuplikatFunction.js';
import { globals } from '../globals.js';

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

function generateUniqueId(oldId, container,param) {
  let webpageDb = globals.webpageDb
  let newId = ''
  if(param){  
    // bikin id baru dari angka terakhir oldId
    newId = replaceTrailingNumber(oldId, container);
   
    // lakukan pengecekan sampai id benar-benar tidak ada di webpageDb
    while (webpageDb.some(item => item.id === newId)) {
      container++;                         // tambah angka
      newId = replaceTrailingNumber(oldId, container); // buat id baru lagi
    }
  
  }else{
    let countNumber = 0
  
    if(oldId.includes('item-carousel') && container.id.includes('element-carousel-')){
      countNumber = parseInt(container.dataset.itemCount || "0", 10);

    }else{
      countNumber = parseInt(container.dataset.elementCount || "0", 10);

    }
  
    // bikin id baru dari angka terakhir oldId
    newId = replaceTrailingNumber(oldId, countNumber);
  
    // lakukan pengecekan sampai id benar-benar tidak ada di webpageDb
    while (webpageDb.some(item => item.id === newId)) {
      countNumber++;                         // tambah angka
      newId = replaceTrailingNumber(oldId, countNumber); // buat id baru lagi
    }
  }
  // simpan count terakhir ke dataset biar konsisten

  return newId;
}

function handleElementCount(parent, elementCount){
  let newCount=parseInt(elementCount)
  if(parent.children.length > 0 && elementCount == 0){
    Array.from(parent.children).forEach(el => {
      let currentOrder = 0
      if(parent.id.startsWith('element-carousel')){
        currentOrder= parseInt(el.dataset?.itemOrder || '0', 10);
      }else{
        currentOrder= parseInt(el.dataset?.elementOrder || '0', 10);
      }
      if (isNaN(currentOrder)) return;
  
      if (currentOrder >= newCount) {

        newCount = currentOrder + 1;
      }
    });
  }else{
    newCount=parseInt(newCount)+1
  }
  return newCount
}

function replaceIdSuffix(baseId, oldId, newId) {
  const base = baseId.split("-");
  const oldSeg = oldId.split("-");
  const newSeg = newId.split("-");

  for (let i = 0; i <= base.length - oldSeg.length; i++) {

    let match = true;

    // cek kecocokan berurutan
    for (let j = 0; j < oldSeg.length; j++) {
      if (base[i + j] !== oldSeg[j]) {
        match = false;
        break;
      }
    }

    if (match) {
      // replace
      const updated = [
        ...base.slice(0, i),
        ...newSeg,
        ...base.slice(i + oldSeg.length)
      ];

      return updated.join("-");
    }
  }

  // tidak ketemu → kembalikan original
  return baseId;
}

export { arraySubsequenceMatch, generateUniqueId, handleElementCount, replaceIdSuffix}