export function getEl(id ,name = "Elemen") {
   const el = document.getElementById(id);
    
    if (!el) {
        window.dispatchEvent(new CustomEvent('notif-pesan', { 
            detail: { pesan: `${name} tidak ditemukan dalam DOM`, status: false } 
        }));
        return null;
    }
    return el;
}