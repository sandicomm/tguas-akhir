<div x-data="{ open: false }">
    <button @click="open = !open" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-200">
    <span class="sr-only">Open sidebar</span>
    <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" >
    <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
    </svg>
    </button>
    <aside id="default-sidebar" :class="open ? 'translate-x-0' : '-translate-x-full'" 
        class="fixed top-0 left-0 z-[80] sm:w-64 sm:h-screen w-full transition-transform duration-300  overflow-y-auto
            sm:translate-x-0"
        aria-label="Sidebar">
        
        <div class="relative scroll-hidden h-[100dvh] px-3 py-4 overflow-y-auto bg-gradient-to-t dark:from-gray-800 dark:to-gray-600 from-gray-300 to-white">
            <div class="flex justify-between items-center">
                <label class="inline-flex items-center cursor-pointer absolute top-2 left-2">
                    <input type="checkbox" value="" class="sr-only peer" checked onclick="toggleTheme()">

                    <div class="relative w-9 h-5 bg-blue-800 peer-focus:outline-none peer-focus:ring-4 
                                peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full 
                                rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute 
                                after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all 
                                peer-checked:bg-brand"></div>

                    <span class="ms-2 text-sm select-none font-bold" id="txt-mode"></span>
                </label>
                <h3 id="indicator-page" class="flex-1 text-center dark:text-white text-black mb-2 font-bold text-lg mt-5"></h3>
                <button @click="open = !open" type="button" class="inline-flex items-center p-1 mb-2 text-sm rounded-lg sm:hidden hover:outline-none hover:ring-2 hover:ring-gray-200">
                    <span class="sr-only">Open sidebar</span>
                    <svg class="w-6 h-6 dark:text-white hover:text-red-600" aria-hidden="true"  width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                </button>
            </div>
            <div id="btn-page-swap" class="mb-3 bg-white rounded-md border border-gray-600 flex overflow-hidden text-center"
            data-prolog-web="{{ route('webpage','prolog-web') }}"
            data-prolog-emodul="{{ route('webpage','prolog-emodul') }}"
            data-webpage="{{ route('webpage','web') }}"
            >
            </div>
            
            <ul class="space-y-2 font-medium">
                <li class="flex justify-between">
                    <x-nav-link href="{{ route('dashboard') }}">
                    <svg class="w-5 h-5 text-black transition duration-75 dark:text-white dark:group-hover:text-white" aria-hidden="true"  fill="currentColor" viewBox="0 0 22 21">
                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                    </svg>
                    <span class="ms-3 dark:text-white text-black">Dashboard</span>
                    </x-nav-link>
                </li>

                <div id="accordion-collapse-section" data-accordion="collapse" class="">

                    <!-- ================================ HEADING TEXT ================================ -->
                    <div id="heading-text-wrapper" class="hidden p-2 flex-col gap-2 w-full rounded-md bg-white border border-black dark:border-white dark:bg-gray-500">
                        <h2 class="dark:text-white text-black">Heading Text</h2>
                        <div id="heading-text" class="bg-gray-300 border-2 border-gray-300 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-full px-1 py-2" contenteditable="true"></div>
                    </div>

                    <!-- ================================ HEAD INDICATOR ================================ -->
                    <div id="accordion-head-indicator-wrapper" class="hidden p-3 mt-4 justify-center items-center flex-col gap-2 w-full rounded-md bg-gray-100 border border-black dark:border-0">
                        <h2 class="text-black">Head Indicator</h2>
                        <div class="flex justify-center items-center w-full">
                            <select id="head-indicator-type" class="p-1 bg-white rounded m-1 w-full">
                                <option value="" class="text-black">-- Pilih Indicator --</option>
                                <option value="default" class="text-black">Default</option>
                                <option value="question" class="text-black">?</option>
                                <option value="icon" class="text-black">&#11163;</option>
                                <option value="none" class="text-black">None</option>
                            </select>
                        </div>
                    </div>

                    <!-- =============================== MODAL TYPE BODY ============================ -->
                    <div id="accordion-modal-type" class="hidden p-3 mt-4 justify-center items-center flex-col gap-2 w-full rounded-md bg-gray-100 border border-black dark:border-0">
                        <h2 class="text-black">Modal Type</h2>
                        <div class="flex justify-center items-center w-full">
                            <select id="modal-type" class="p-1 bg-white rounded m-1 w-full">
                                <option value="" class="text-black">-- Pilih Tipe --</option>
                                <option value="default" class="text-black">Default</option>
                                <option value="static" class="text-black">Static</option>
                            </select>
                        </div>
                    </div>

                    <!-- =============================== ACCORDION TYPE ============================ -->
                    <div id="accordion-accordion-type" class="hidden p-3 mt-4 justify-center items-center flex-col gap-2 w-full rounded-md bg-gray-100 border border-black dark:border-0">
                        <h2 class="text-black">Accordion Type</h2>
                        <div class="flex justify-center items-center w-full">
                            <select id="accordion-type" class="p-1 bg-white rounded m-1 w-full">
                                <option value="" class="text-black">-- Pilih Tipe --</option>
                                <option value="collapse" class="text-black">Collapse</option>
                                <option value="open" class="text-black">Open</option>
                            </select>
                        </div>
                    </div>

                    <!-- =============================== CAROUSEL ============================ -->
                    <div id="accordion-carousel-styling" class="hidden p-2 mt-4 justify-center items-center flex-col gap-2 w-full rounded-md bg-gray-100 border border-black dark:border-0">
                        <h1 class="text-black font-bold text-lg ">Carousel</h1>
                        <div class="p-2 gap-2 mb-3 rounded-md">
                            <div class="flex flex-col justify-center items-center gap-2">
                                <div class="flex gap-3 w-full">
                                    <div class="flex flex-col justify-end w-full">
                                        <h3 class="text-black text-sm text-center">Text Position</h3>
                                        <button id="btn-text-position" data-position="image" type="button" class="text-sm w-full p-1 text-white bg-sky-500 rounded shadow-md shadow-orange-400">On Image</button>
                                    </div>
                                    <div class="w-full">
                                        <h3 class="text-black text-sm text-center">Next Button</h3>
                                        <button id="btn-hide-next" data-hide="unhide" type="button" class="text-sm w-full p-1 bg-white rounded shadow-md shadow-orange-400">Hide</button>
                                    </div>
                                    
                                </div>
                                <div class="w-full mt-2">
                                    <div class="w-full mb-3">      
                                        <h3 class="text-black text-sm text-center">Text Carousel</h3>     
                                        <button id="add-text-carousel" data-text="add" type="button" class="text-sm w-full p-1 text-white bg-sky-500 rounded shadow-md shadow-orange-400">Add Text</button>
                                    </div>
                                    <button id="add-item" type="button" class="w-full p-1 text-white bg-green-600 rounded shadow-md shadow-orange-400">Add Item</button>
                                </div>
                            </div>
                        </div>
                        <div class="w-full text-white">
                            <input type="file" id="bg-image-carousel" accept="image/*" class="hidden">
                            <div id="edit-carousel-item-wrapping" class="shadow-md shadow-gray-500 bg-gray-500 rounded-md p-2 flex flex-col max-h-[50dvh] overflow-y-auto">
                            </div>
                        </div>
                    </div>

                    
                    <div id="accordion-tools" data-accordion="open" class="mt-3 w-full"> 
                        <!-- ================================ FONT STYLING =============================== -->
                        <h2 id="accordion-font-styling" class="hidden">
                            <button type="button" class="font-bold w-full flex items-center justify-between text-sm rtl:text-right rounded-md p-3 gap-3 
                                    !bg-gray-300 !text-black hover:!bg-gray-100 border border-black 
                                    dark:border-white" data-accordion-target="#accordion-font-styling-body-1" aria-expanded="false" aria-controls="accordion-font-styling-body-1">
                                <span>Font Styling</span>
                                <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"  fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                </svg>
                            </button>
                        </h2>
                        <div id="accordion-font-styling-body-1" 
                                class="p-2 border bg-gray-300 rounded-md border-black dark:border-white hidden" 
                                aria-labelledby="accordion-font-styling">
                            <div class="text-white w-full pb-2">
                                <div id="styling-select-group" class="flex flex-wrap justify-start gap-1">
                                    <select id="font-family" class="appearance-none p-1 rounded m-1 bg-white text-black">
                                        <option value="default" class="text-black" selected>Font Style</option>
                                        <option value="Arial" class="text-black">Arial</option>
                                        <option value="Courier New" class="text-black">Courier New</option>
                                        <option value="Times New Roman" class="text-black">Times New Roman</option>
                                        <option value="Georgia" class="text-black">Georgia</option>
                                        <option value="Verdana" class="text-black">Verdana</option>
                                        <option value="Tahoma" class="text-black">Tahoma</option>
                                        <option value="Trebuchet MS" class="text-black">Trebuchet MS</option>
                                        <option value="Comic Sans MS" class="text-black">Comic Sans MS</option>
                                        <option value="Impact" class="text-black">Impact</option>
                                        <option value="Lucida Console" class="text-black">Lucida Console</option>
                                        <option value="Palatino Linotype" class="text-black">Palatino Linotype</option>
                                    </select>

                                    <select id="font-size" class="p-1 rounded bg-white text-black m-1">
                                        <option value="default" class="text-black" selected>Font Size</option>
                                        <option value="1" class="text-black">Very Small</option>
                                        <option value="2" class="text-black">Small</option>
                                        <option value="3" class="text-black">Normal</option>
                                        <option value="4" class="text-black">Large</option>
                                        <option value="5" class="text-black">Very Large</option>
                                        <option value="6" class="text-black">Huge</option>
                                        <option value="7" class="text-black">Massive</option>
                                    </select>

                                    <div class="my-3 flex gap-2 text-white">
                                        <label for="font-color-input" class="block mb-2 font-medium text-black">Color</label>
                                        <input type="color" id="font-color-input">
                                    </div>

                                </div>

                                <div class="styling-button flex flex-wrap justify-start items-center gap-2 mb-3">
                                    <button id="font-bold" class="text-black dark:text-white p-1 px-2 rounded-md bg-gray-100 hover:bg-gray-300 dark:bg-gray-700"><b>B</b></button>
                                    <button id="font-italic" class="text-black dark:text-white p-1 px-2 rounded-md bg-gray-100 hover:bg-gray-300 dark:bg-gray-700"><i>I</i></button>
                                    <button id="font-underline" class="text-black dark:text-white p-1 px-2 rounded-md bg-gray-100 hover:bg-gray-300 dark:bg-gray-700"><u>U</u></button>

                                    <button id="font-left" value="left" class="text-black p-1 rounded-md bg-gray-100 hover:bg-gray-300 dark:bg-gray-700">
                                        <svg class="w-6 h-6  dark:text-white" aria-hidden="true"  width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6h8m-8 4h12M6 14h8m-8 4h12"/>
                                        </svg>
                                    </button>
                                    <button id="font-right" value="right" class="text-black p-1 rounded-md bg-gray-100 hover:bg-gray-300 dark:bg-gray-700">
                                        <svg class="w-6 h-6  dark:text-white" aria-hidden="true"  width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6h-8m8 4H6m12 4h-8m8 4H6"/>
                                        </svg>
                                    </button>
                                    <button id="font-center" value="center" class="text-black p-1 rounded-md bg-gray-100 hover:bg-gray-300 dark:bg-gray-700">
                                        <svg class="w-6 h-6 dark:text-white" aria-hidden="true"  width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h8M6 10h12M8 14h8M6 18h12"/>
                                        </svg>
                                    </button>
                                    <button id="font-justify" value="justify" class="text-black p-1 rounded-md bg-gray-100 hover:bg-gray-300 dark:bg-gray-700">
                                        <svg class="w-6 h-6 dark:text-white" aria-hidden="true"  width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6H6m12 4H6m12 4H6m12 4H6"/>
                                        </svg>
                                    </button>                

                                    <button onclick="document.execCommand('insertOrderedList')" id="font-order-list" class=" text-black p-1 rounded-md bg-gray-100 hover:bg-gray-300 dark:bg-gray-700">
                                        <svg class="w-6 h-6 dark:text-white" aria-hidden="true"  width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6h8m-8 6h8m-8 6h8M4 16a2 2 0 1 1 3.321 1.5L4 20h5M4 5l2-1v6m-2 0h4"/>
                                        </svg>
                                    </button>

                                    <button onclick="document.execCommand('insertUnorderedList')" id="font-unorder-list" class=" text-black p-1 rounded-md bg-gray-100 hover:bg-gray-300 dark:bg-gray-700">
                                        <svg class="w-6 h-6 dark:text-white" aria-hidden="true"  width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- ================================ BOX =============================== -->
                        <h2 id="accordion-box-field" class="mt-3 hidden">
                            <button type="button" class="w-full flex items-center justify-between text-sm rtl:text-right rounded-md p-3 gap-3 
                                    !bg-gray-400 !text-black hover:!bg-gray-300 font-bold border border-black dark:border-white" 
                                    data-accordion-target="#accordion-box-field-body-1" 
                                    aria-expanded="false" aria-controls="accordion-box-field-body-1">
                                <span>Box</span>
                                <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"  fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                </svg>
                            </button>
                        </h2>
                        <div id="accordion-box-field-body-1" 
                            class="p-2 rounded bg-gray-400 font-bold border border-black dark:border-white hidden" 
                            aria-labelledby="accordion-box-field"
                            aria-expanded="false">
                            
                            <div class="w-full pb-2">
                                <table class="w-full">
                                    <tr id="box-width-field" class="">
                                        <td>Width</td><td>:</td>
                                        <td>
                                            <input type="number" id="width-field" class="text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-[80%] p-1"/>
                                        </td>
                                    </tr>
                                    <tr id="box-height-field" class="">
                                        <td>Height</td><td>:</td>
                                        <td>
                                            <input type="number" id="height-field" class="text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-[80%] p-1"/>
                                        </td>
                                    </tr>       
                                </table>
                                <div id="flex-position" class="w-full mt-3 ">
                                    <h2 class="text-black">Flex Position</h2>
                                    <div class="flex justify-center items-center w-full">
                                        <select id="flex-position-section" class="p-1 bg-white rounded m-1 w-full">
                                            <option value="" class="text-black">-- Pilih Position --</option>
                                            <option value="top" class="text-black">Top</option>
                                            <option value="center" class="text-black">Center</option>
                                            <option value="end" class="text-black">Bottom</option>
                                        </select>
                                    </div>
                                </div>
                                <div id="reset-box" class="w-full mt-3">
                                    <button id="btn-reset-box" class=" w-full bg-blue-500 p-1 rounded hover:bg-green-500 text-white">Reset Box</button>
                                </div>
                            </div>
                        </div>

                        <!-- ================================ BORDER =============================== -->
                        <h2 id="accordion-border-field" class="mt-3 hidden">
                            <button type="button" 
                                class="w-full flex items-center justify-between text-sm rtl:text-right rounded-md p-3 gap-3 
                                    !bg-gray-500 hover:!bg-gray-300 !text-white font-bold border border-black 
                                    dark:border-white" 

                                data-accordion-target="#accordion-border-field-body-1" aria-expanded="false" aria-controls="accordion-border-field-body-1">
                                <span>Border</span>
                                <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"  fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                </svg>
                            </button>
                        </h2>     
                        <div id="accordion-border-field-body-1" 
                            class="p-2 pb-2 bg-gray-500 rounded text-white font-bold border 
                                border-black dark:border-white hidden" 

                            aria-labelledby="accordion-border-field">
                            <!-- -------------- BORDER ---------------- -->
                            <div id="border-basic">
                                <table>
                                    <tr class="text-white">
                                        <td>Color</td><td>:</td>
                                        <td><input type="color" id="border-color-field" ></td>
                                    </tr>
                                    <tr class="text-white">
                                        <td>Border</td><td>:</td>
                                        <td>
                                            <input type="number" id="border-field" class="text-sm text-black rounded focus:ring-blue-500 focus:border-blue-500 w-14 p-1"/>
                                        </td>
                                    </tr>
                                </table>
    
                                <div id="accordion-advance-border" data-accordion="collapse" class="mt-2 mb-4 px-1"> 
                                    <h2 id="accordion-advance-border-heading-1" class="mt-3">
                                        <button type="button" 
                                                class="flex items-center justify-between text-sm rtl:text-right 
                                                    !text-white rounded-md p-2 hover:ring-2 hover:!ring-gray-200
                                                      gap-3 dark:!bg-gray-400/50 !bg-gray-400/50" 
                                                data-accordion-target="#accordion-advance-border-1" aria-expanded="true" aria-controls="accordion-advance-border-body-1">
                                            <span >Advance</span>
                                            <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"  fill="none" viewBox="0 0 10 6">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                            </svg>
                                        </button>
                                    </h2>
                                    <div id="accordion-advance-border-1" class="" aria-labelledby="accordion-advance-border-heading-1">
                                        <div class="flex justify-start items-start gap-2 flex-wrap p-2 bg-gray-300/30 inset-shadow-md rounded text-white">
                                            <table class="w-full flex">
                                                <tbody class="w-full">
                                                    <tr class="w-full flex gap-3 items-center">
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="border-field-top">Top</label>
                                                            <input type="number" id="border-field-top" class="text-black text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="border-field-right">Right</label>
                                                            <input type="number" id="border-field-right" class="text-black text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                    </tr>
                                                    <tr class="w-full flex gap-3 items-center">
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="border-field-left">Left</label>
                                                            <input type="number" id="border-field-left" class="text-black text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                    
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="border-field-bottom">Bottom</label>
                                                            <input type="number" id="border-field-bottom" class="text-black text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- ------------- ROUNDED ------------ -->
                            <div id="border-rounded">
                                <table>
                                    <tr class="text-white">
                                        <td>Rounded</td><td>:</td>
                                        <td>
                                            <input type="number" id="border-field-rounded" class="text-black text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-14 p-1"/>
                                        </td>
                                    </tr>
                                </table>
                                
                                <div id="accordion-advance-border-rounded" data-accordion="collapse" class="mt-2 px-1"> 
                                    <h2 id="accordion-advance-border-rounded-heading-1" class="mt-3">
                                        <button type="button" 
                                                class="flex items-center justify-between text-sm rtl:text-right 
                                                        !text-white rounded-md p-2 hover:ring-2 hover:!ring-gray-200
                                                        gap-3 dark:!bg-gray-400/50 !bg-gray-400/50" 
                                                data-accordion-target="#accordion-advance-border-rounded-1" aria-expanded="true" aria-controls="accordion-advance-border-rounded-body-1">
                                            <span >Advance</span>
                                            <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"  fill="none" viewBox="0 0 10 6">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                            </svg>
                                        </button>
                                    </h2>
                                    <div id="accordion-advance-border-rounded-1" class="" aria-labelledby="accordion-advance-border-rounded-heading-1">
                                        <div class="flex justify-start items-start gap-2 flex-wrap p-2 bg-gray-300/30 rounded text-white">
                                            <table class="w-full flex">
                                                <tbody class="w-full">
                                                    <tr class="w-full flex gap-3 items-center">
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="border-field-rounded-top-left" class="text-sm">Top Left</label>
                                                            <input type="number" id="border-field-rounded-top-left" class="text-black text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="border-field-rounded-top-right" class="text-sm">Top Right</label>
                                                            <input type="number" id="border-field-rounded-top-right" class="text-black text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                    </tr>
    
                                                    <tr class="w-full flex gap-3 items-center">
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="border-field-rounded-bottom-left"  class="text-sm">Bottom Left</label>
                                                            <input type="number" id="border-field-rounded-bottom-left" class="text-black text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="border-field-rounded-bottom-right" class="text-sm">Bottom Right</label>
                                                            <input type="number" id="border-field-rounded-bottom-right" class="text-black text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- -----------BORDER WAVE ------------- -->
                            <div id="accordion-border-wave-section" data-accordion="collapse" class="mt-2 w-full text-white "> 
                                <h2 id="accordion-border-wave-section-heading-1">
                                    <button type="button" 
                                            class="w-full flex items-center justify-between text-sm rtl:text-right 
                                                !text-white rounded-md p-2 hover:bg-gray-400 gap-3 dark:!bg-gray-400/50 !bg-gray-400/50" 
                                            data-accordion-target="#accordion-border-wave-section-body-1" aria-expanded="true" aria-controls="accordion-border-wave-section-body-1">
                                        <span>Border Wave</span>
                                        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"  fill="none" viewBox="0 0 10 6">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                        </svg>
                                    </button>
                                </h2>     
                                <div id="accordion-border-wave-section-body-1" class="p-2 bg-gray-300/30 rounded-md" aria-labelledby="accordion-border-wave-section-heading-1">
                                    <div class="flex gap-2 mb-2">
                                        <span >Color:</span>
                                        <input type="color" id="border-wave-color" class="rounded"/>
                                    </div>  
                                    <div class="flex flex-col gap-2 mb-2 bg-gray-500 rounded-md p-1">  
                                        <span >Position:</span>
                                        <div class="flex items-center gap-4 ps-2">
                                            <div>
                                                <label for="border-wave-position-top">Top</label>
                                                <input type="radio" name="border-wave-position" id="border-wave-position-top" value="top">
                                            </div>
                                            <div>
                                                <label for="border-wave-position-bottom">Bottom</label>
                                                <input type="radio" name="border-wave-position" id="border-wave-position-bottom" value="bottom">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 mb-2">  
                                        <div id="accordion-tipe-wave-section" data-accordion="collapse" class="mt-2 px-1"> 
                                            <h2 id="accordion-tipe-wave-section-heading-1">
                                                <button type="button" class="flex items-center justify-between text-sm rtl:text-right text-white rounded-md p-2 bg-gray-400 dark:bg-gray-400 hover:ring-2 hover:ring-gray-200 gap-3" data-accordion-target="#accordion-tipe-wave-section-1" aria-expanded="true" aria-controls="accordion-tipe-wave-section-body-1">
                                                    <span >Tipe</span>
                                                    <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"  fill="none" viewBox="0 0 10 6">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                                    </svg>
                                                </button>
                                            </h2>
                                            <div id="accordion-tipe-wave-section-1" class="" aria-labelledby="accordion-tipe-wave-section-heading-1">
                                                <div class="flex justify-start items-start gap-1 flex-wrap py-1 px-2 bg-gray-300/30 rounded cursor-pointer">
                                                    <div class="border-2 border-gray-300 rounded px-1" id="border-wave-type-1">
                                                        <svg class="w-16 h-16" id="type-1"  viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,224L30,224C60,224,120,224,180,208C240,192,300,160,360,133.3C420,107,480,85,540,106.7C600,128,660,192,720,197.3C780,203,840,149,900,133.3C960,117,1020,139,1080,176C1140,213,1200,267,1260,282.7C1320,299,1380,277,1410,266.7L1440,256L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"></path></svg>
                                                    </div>
                                                    <div class="border-2 border-gray-300 rounded px-1" id="border-wave-type-2">
                                                        <svg class="w-16 h-16" id="type-2"  viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,96L60,101.3C120,107,240,117,360,122.7C480,128,600,128,720,138.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="flex flex-col gap-2 mb-2">
                                        <button id="btn-reset-border-wave" class=" bg-blue-500 p-1 rounded hover:bg-green-500 hover:text-white">Reset</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- ================================ BACKGROUND =============================== -->
                        <h2 id="accordion-background" class="mt-3 hidden">
                            <button type="button" 
                                    class="w-full flex items-center justify-between text-sm rtl:text-right rounded-md p-3 gap-3 
                                      !bg-gray-600 hover:!bg-gray-300 !text-white font-bold border border-black 
                                        dark:border-white"

                                data-accordion-target="#accordion-background-body-1" aria-expanded="false" aria-controls="accordion-background-body-1">
                                <span>Background</span>
                                <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"  fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                </svg>
                            </button>
                        </h2>
                        <div id="accordion-background-body-1" 
                                class="p-2 rounded-md bg-gray-600 text-white 
                                    font-bold border border-black dark:border-white hidden" 
                        
                                aria-labelledby="accordion-background">
                            <div class="text-white flex flex-col justify-center items-center w-full p-3">
                                <div class="mb-5 flex justify-center items-center flex-col text-white w-full bg-gray-500 p-1 rounded-md">
                                    <label for="color-field-input" class="block mb-2 font-medium">Background Color</label>
                                    <input type="color" class="rounded w-[50%] h-[30px]" id="color-field-input">
                                </div>
                                <div class="mb-5 flex justify-center items-center flex-col text-white w-full bg-gray-500 p-1 rounded-md">
                                    <label for="bg-color-opacity" class="block mb-1 font-medium">Color Opacity</label>
                                    <input type="range" id="bg-color-opacity" class="w-full" min="0" max="1" step="0.01" value="1">
                                </div>

                                <div id="bg-image-styling" class="">
                                    <div class="flex justify-center items-center flex-col gap-2 text-white w-full bg-gray-500 p-1 rounded-md">
                                        <input type="file" id="bg-image-input" accept="image/*" class="hidden">
                                        <label for="bg-image-input" class="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer w-full text-center">Choose From File</label>
                                        <label id="set-image-from-recent" data-modal-target="recent-image-modal" data-modal-toggle="recent-image-modal" class="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer w-full text-center">Choose From Recent</label>
                                        <span id="file-name-display" class="ml-2 text-sm text-white break-all">No image selected</span>
                                        <div id="preview-container" class="mt-3 flex justify-center">
                                            <img id="preview-image" src="" alt="Preview" class="w-1/2 h-auto rounded-lg hidden" />
                                        </div>
                                    </div>
    
                                </div>
                                <div id="wrapper-btn-reset-bg-image" class="mb-2 mt-3 text-white w-full">
                                    <button type="button" id="btn-reset-bg-image" class="bg-blue-500 rounded p-3 w-full text-sm ">Reset Background Image</button>
                                </div>
                            </div>
                        </div>

                        <!-- ============================== PADDING ================================== -->
                        <h2 id="accordion-padding" class="mt-3 hidden">
                            <button type="button" 
                                    class="w-full flex items-center justify-between font-bold text-sm rtl:text-right gap-3 !text-white
                                        rounded-md dark:border-white p-3 !bg-gray-800 hover:!bg-gray-600 border border-black" 

                                    data-accordion-target="#accordion-padding-body-1" aria-expanded="false" aria-controls="accordion-padding-body-1">
                                <span class="">Padding</span>
                                <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"  fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                </svg>
                            </button>
                        </h2>
                        <div id="accordion-padding-body-1" 
                            class="p-2 rounded-md dark:border-white hidden
                                    bg-gray-800 border border-black"

                            aria-labelledby="accordion-padding">
                            <div class="text-white w-full">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Padding</td><td>:</td>
                                            <td>
                                                <input type="number" id="padding-field" class="text-sm text-black rounded focus:ring-blue-500 focus:border-blue-500 w-14 p-1"/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table> 
                                
                                <div id="accordion-advance-padding" data-accordion="collapse" class="mt-2 px-1"> 
                                    <h2 id="accordion-advance-padding-heading-1">
                                        <button type="button" 
                                                class="flex items-center justify-between text-sm rtl:text-right 
                                                    !text-white rounded-md p-2 dark:!bg-gray-500/50 !bg-gray-500/50 hover:ring-2 hover:!ring-gray-200" 
                                                
                                                data-accordion-target="#accordion-advance-padding-1" aria-expanded="true" aria-controls="accordion-advance-padding-body-1">

                                            <span>Advance</span>
                                            <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"  fill="none" viewBox="0 0 10 6">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                            </svg>
                                        </button>
                                    </h2>
                                    <div id="accordion-advance-padding-1" class="bg-gray-600 rounded-md" aria-labelledby="accordion-advance-padding-heading-1">
                                        <div class="flex justify-start items-center gap-2 flex-wrap p-2">
                                            <table class="w-full flex">
                                                <tbody class="w-full">
                                                    <tr class="w-full flex gap-3 items-center">
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="padding-field-left">Left</label>
                                                            <input type="number" id="padding-field-left" class="text-black text-sm rounded-md p-1 focus:ring-blue-500 focus:border-blue-500 block w-full"/>
                                                        </td>
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="padding-field-right">Right</label>
                                                            <input type="number" id="padding-field-right" class="text-black text-sm rounded-md p-1 focus:ring-blue-500 focus:border-blue-500 block w-full"/>
                                                        </td>
                                                    </tr>

                                                    <tr class="w-full flex gap-3 items-center">
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="padding-field-top">Top</label>
                                                            <input type="number" id="padding-field-top" class="text-black text-sm rounded-md p-1 focus:ring-blue-500 focus:border-blue-500 block w-full"/>
                                                        </td>
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="padding-field-bottom">Bottom</label>
                                                            <input type="number" id="padding-field-bottom" class="text-black text-sm rounded-md p-1 focus:ring-blue-500 focus:border-blue-500 block w-full"/>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- ============================== MARGIN ================================== -->
                        <h2 id="accordion-margin" class="mt-3 hidden">
                            <button type="button" 
                                    class="w-full flex items-center justify-between font-bold 
                                        text-sm rtl:text-right !text-white gap-3 !bg-indigo-900 p-3 rounded-md 
                                        hover:!bg-indigo-700 dark:border-white border border-black" 
                                    
                                    data-accordion-target="#accordion-margin-body-1" aria-expanded="false" aria-controls="accordion-margin-body-1">
                                <span>Margin</span>
                                <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"  fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                </svg>
                            </button>
                        </h2>
                        <div id="accordion-margin-body-1" 
                            class="p-2 bg-indigo-900 rounded-md text-white gap-3
                                     dark:border-white border border-black hidden"

                            aria-labelledby="accordion-margin">
                            <div class="text-white w-full pb-2">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Margin</td><td>:</td>
                                            <td>
                                                <input type="number" id="margin-field" class="text-black text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-14 p-1"/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table> 
                                
                                <div id="accordion-advance-margin" data-accordion="collapse" class="mt-2 px-1"> 
                                    <h2 id="accordion-advance-margin-heading-1">
                                        <button type="button" 
                                            class="flex items-center justify-between text-sm rtl:text-right !text-white rounded-md 
                                            !bg-gray-300/25 dark:!bg-gray-300/25 p-2 hover:ring-2 hover:!ring-gray-200 gap-3" data-accordion-target="#accordion-advance-margin-1" aria-expanded="true" aria-controls="accordion-advance-margin-body-1">
                                            <span >Advance</span>
                                            <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"  fill="none" viewBox="0 0 10 6">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                            </svg>
                                        </button>
                                    </h2>
                                    <div id="accordion-advance-margin-1" class="hidden" aria-labelledby="accordion-advance-margin-heading-1">
                                        <div class="flex justify-start items-center gap-2 flex-wrap py-1 px-2 bg-gray-300/25 rounded">
                                            <table class="w-full flex">
                                                <tbody class="w-full">
                                                    <tr class="w-full flex gap-3 items-center">
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="margin-field-left">Left</label>
                                                            <input type="number" id="margin-field-left" class="text-black text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="margin-field-right">Right</label>
                                                            <input type="number" id="margin-field-right" class="text-black text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                    </tr>

                                                    <tr class="w-full flex gap-3 items-center">
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="margin-field-top">Top</label>
                                                            <input type="number" id="margin-field-top" class="text-black text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="margin-field-bottom">Bottom</label>
                                                            <input type="number" id="margin-field-bottom" class="text-black text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="wrapper-btn-save" class="hidden w-full bg-white p-4 mt-4 rounded-md">
                        <button id="btn-save" class="py-1 px-2 rounded bg-green-700 text-white hover:bg-green-500">Save</button>
                        <button id="btn-cek" class="py-1 px-2 rounded bg-green-700 text-white hover:bg-green-500">Cek</button>
                    </div>
                </div>
            </ul>
        </div>
    </aside>
    <script>
        (function initTheme() {
                const txtMode = document.getElementById('txt-mode')
                const savedTheme = localStorage.getItem('theme');

                if (savedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                    txtMode.textContent = 'Dark'
                    txtMode.classList.add('text-white')
                    txtMode.classList.remove('text-black')
                } else {
                    document.documentElement.classList.remove('dark');
                    txtMode.textContent = 'Light'
                    txtMode.classList.add('text-black')
                    txtMode.classList.remove('text-white')
                }
            })();

            function toggleTheme() {
                const root = document.documentElement;
                const txtMode = document.getElementById('txt-mode')

                if (root.classList.contains('dark')) {
                    root.classList.remove('dark');
                    localStorage.setItem('theme', 'light');

                    txtMode.textContent = 'Light'
                    txtMode.classList.add('text-black')
                    txtMode.classList.remove('text-white')
                } else {
                    root.classList.add('dark');
                    localStorage.setItem('theme', 'dark');

                    txtMode.textContent = 'Dark'
                    txtMode.classList.add('text-white')
                    txtMode.classList.remove('text-black')
                }
            }
    </script>
</div>
