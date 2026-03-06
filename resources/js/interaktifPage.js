// ======== GLOBALS =========
import { globals } from './page/globals.js';

// ======== Validation get element ==========
import { resizeElements, initWebpage } from './loadWebpage.js';

// Jalankan hanya jika dibutuhkan
document.addEventListener('DOMContentLoaded', () => {
    initWebpage(false);
});

window.addEventListener("resize", resizeElements);
window.addEventListener("load", resizeElements);