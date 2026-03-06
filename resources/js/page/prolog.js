export const createBtnProlog = (element, edit)=> {
    let btn=''
    if(edit){
        btn = `<a id="${element.id}" class="cursor-pointer" style="transition: opacity 0.1s, box-shadow 0.2s;${element.style}" 
                onmouseover="this.style.opacity='0.85'; this.style.boxShadow='0 0 0 4px rgba(255, 255, 255, 0.8)';" 
                onmouseout="this.style.opacity='1'; this.style.boxShadow='none';"
                >
                ${element.content}
            </a>`
    }else{
        btn = `<a id="${element.id}" class="cursor-pointer" style="transition: opacity 0.1s, box-shadow 0.2s;${element.style}" 
                onmouseover="this.style.opacity='0.85'; this.style.boxShadow='0 0 0 4px rgba(255, 255, 255, 0.8)';" 
                onmouseout="this.style.opacity='1'; this.style.boxShadow='none';"
                >
                ${element.content}
            </a>`
    }
    return btn
}
