export function dropdownInitialized(element,id){
  if(element == 'multi'){
     document.querySelectorAll(`[data-dropdown-toggle*="${id}"]`).forEach(toggleEl=>{

       const targetId = toggleEl.getAttribute('data-dropdown-toggle');
       const targetEl = document.getElementById(targetId);
   
       if (targetEl) {
         // Inisialisasi ulang dropdown
         new Dropdown(targetEl, toggleEl, {
           placement: toggleEl.getAttribute('data-dropdown-placement') || 'bottom',
         });
   
         targetEl.dataset.initialized = 'true';
        //  console.log("dropdown initialized", targetEl, targetEl.dataset.initialized)
       }else{
        //  console.log("gagal inisialisasi dropdown", targetEl)
       }
     })
  }else if(element == 'all'){
     document.querySelectorAll(`[data-dropdown-toggle]`).forEach(toggleEl=>{

       const targetId = toggleEl.getAttribute('data-dropdown-toggle');
       const targetEl = document.getElementById(targetId);
   
       if (targetEl && !targetEl.dataset.initialized) {
         // Inisialisasi ulang dropdown
         new Dropdown(targetEl, toggleEl, {
           placement: toggleEl.getAttribute('data-dropdown-placement') || 'bottom',
         });
   
         targetEl.dataset.initialized = 'true';
        //  console.log("dropdown initialized", targetEl, targetEl.dataset.initialized)
       }else{
        //  console.log("gagal inisialisasi dropdown", targetEl, targetEl.dataset.initialized)
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

      targetEl.dataset.initialized = 'true';
      // console.log("dropdown initialized", targetEl, targetEl.dataset.initialized)
    }else{
      // console.log("gagal inisialisasi dropdown")
    }
    
  }
}