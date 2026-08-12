// ======== GLOBALS =========
import { globals } from '../globals.js';

export function dropdownInitialized(element,id){
  if(element == 'multi'){
     document.querySelectorAll(`[data-dropdown-toggle*="${id}"]`).forEach(toggleEl=>{

       const targetId = toggleEl.getAttribute('data-dropdown-toggle');
       const targetEl = document.getElementById(targetId);

      if(!targetId.includes('footer')){
        toggleEl.addEventListener('click', function(event) {

        let section = document.getElementById(`webpage-section-${targetId.split('-').find(part => !isNaN(part))}`)
        section.classList.remove('z-10')
        section.classList.add('z-20')
        
        let prevSection = globals.prevSection
        globals.prevSection = section

        if(prevSection && prevSection.id != section.id){
          prevSection.classList.remove('z-20')
          prevSection.classList.add('z-10')
        }
        })
      }
       
       if (targetEl) {
         // Inisialisasi ulang dropdown
         new Dropdown(targetEl, toggleEl, {
           placement: toggleEl.getAttribute('data-dropdown-placement') || 'bottom',
         });
   
         targetEl.dataset.initialized = 'true';
       // console.log("dropdown initialized", targetEl, targetEl.dataset.initialized)
       }else{
       // console.log("gagal inisialisasi dropdown", targetEl)
       }
     })
  }else if(element == 'all'){
    document.querySelectorAll(`[data-dropdown-toggle]`).forEach(toggleEl=>{
      
      const targetId = toggleEl.getAttribute('data-dropdown-toggle');
      const targetEl = document.getElementById(targetId);

      if(!targetId.includes('footer')){
        toggleEl.addEventListener('click', function(event) {
          console.log('hallo')
          let section = document.getElementById(`webpage-section-${targetId.split('-').find(part => !isNaN(part))}`)
          section.classList?.remove('z-10')
          section.classList?.add('z-20')
          
          let prevSection = globals.prevSection
          globals.prevSection = section
  
          if(prevSection && prevSection.id != section.id){
            prevSection.classList.remove('z-20')
            prevSection.classList.add('z-10')
          }
         })
      }
     })
  }else{
    const toggleEl = document.querySelector(`[data-dropdown-toggle="${id}"]`)
    const targetId = toggleEl.getAttribute('data-dropdown-toggle');
    const targetEl = document.getElementById(targetId);

    // console.log('before inisialisasi',targetEl, targetEl.dataset.initialized,toggleEl,targetEl)
    if (targetEl && !targetEl.dataset.initialized) {
      // Inisialisasi ulang dropdown
      new Dropdown(targetEl, toggleEl, {
        placement: toggleEl.getAttribute('data-dropdown-placement') || 'bottom',
      });

      if(!targetId.includes('footer')){
        toggleEl.addEventListener('click', function(event) {
          let section = document.getElementById(`webpage-section-${targetId.split('-').find(part => !isNaN(part))}`)
          section.classList.remove('z-10')
          section.classList.add('z-20')
          
          let prevSection = globals.prevSection
          globals.prevSection = section

          if(prevSection && prevSection.id != section.id){
            prevSection.classList.remove('z-20')
            prevSection.classList.add('z-10')
          }
        })
      }

      targetEl.dataset.initialized = 'true';
      //console.log("dropdown initialized", targetEl, targetEl.dataset.initialized)
    }else{
       //console.log("gagal inisialisasi dropdown")
    }
    
  }
}