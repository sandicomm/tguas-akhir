{{--<nav x-data="{ open: false }" class="bg-white border-b border-gray-100">
    <!-- Primary Navigation Menu -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex">
                <!-- Logo -->
                <div class="shrink-0 flex items-center">
                    <a href="{{ route('dashboard') }}">
                        <x-application-logo class="block h-9 w-auto fill-current text-gray-800" />
                    </a>
                </div>

                <!-- Navigation Links -->
                <div class="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                    <x-nav-link :href="route('dashboard')" :active="request()->routeIs('dashboard')">
                        {{ __('Dashboard') }}
                    </x-nav-link>
                </div>
            </div>

            <!-- Settings Dropdown -->
            <div class="hidden sm:flex sm:items-center sm:ms-6">
                <x-dropdown align="right" width="48">
                    <x-slot name="trigger">
                        <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150">
                            <div>{{ Auth::user()->name }}</div>

                            <div class="ms-1">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </button>
                    </x-slot>

                    <x-slot name="content">
                        <!-- Authentication -->
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf

                            <x-dropdown-link :href="route('logout')"
                                    onclick="event.preventDefault();
                                                this.closest('form').submit();">
                                {{ __('Log Out') }}
                            </x-dropdown-link>
                        </form>
                    </x-slot>
                </x-dropdown>
            </div>

            <!-- Hamburger -->
            <div class="-me-2 flex items-center sm:hidden">
                <button @click="open = ! open" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                    <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path :class="{'hidden': open, 'inline-flex': ! open }" class="inline-flex" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        <path :class="{'hidden': ! open, 'inline-flex': open }" class="hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Responsive Navigation Menu -->
    <div :class="{'block': open, 'hidden': ! open}" class="hidden sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
            <x-responsive-nav-link :href="route('dashboard')" :active="request()->routeIs('dashboard')">
                {{ __('Dashboard') }}
            </x-responsive-nav-link>
        </div>

        <!-- Responsive Settings Options -->
        <div class="pt-4 pb-1 border-t border-gray-200">
            <div class="px-4">
                <div class="font-medium text-base text-gray-800">{{ Auth::user()->name }}</div>
                <div class="font-medium text-sm text-gray-500">{{ Auth::user()->email }}</div>
            </div>

            <div class="mt-3 space-y-1">
                <!-- Authentication -->
                <form method="POST" action="{{ route('logout') }}">
                    @csrf

                    <x-responsive-nav-link :href="route('logout')"
                            onclick="event.preventDefault();
                                        this.closest('form').submit();">
                        {{ __('Log Out') }}
                    </x-responsive-nav-link>
                </form>
            </div>
        </div>
    </div>
</nav>--}}
<div x-data="{ open: false }">
    <button @click="open = !open" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-200">
    <span class="sr-only">Open sidebar</span>
    <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
    </svg>
    </button>

    <aside id="default-sidebar" :class="open ? 'translate-x-0' : '-translate-x-full'" class="fixed top-0 left-0 z-[80] sm:w-64 sm:h-screen w-full transition-transform duration-300 sm:translate-x-0 bg-gradient-to-t from-gray-800 to-indigo-600 border-e-2 border-gray-500 dark:bg-gray-800"
        aria-label="Sidebar">
        <div class="relative scroll-hidden h-full px-3 py-4 overflow-y-auto bg-gradient-to-t from-gray-800 to-indigo-600 border-e-2 border-gray-500 dark:bg-gray-800">
            
            <h3 id="indicator-page" class="text-center text-white mb-2 font-bold text-lg"></h3>

            <div id="btn-page-swap" class="mb-3 bg-white rounded-md border border-gray-600 flex overflow-hidden text-center"
            data-prolog-web="{{ route('webpage','prolog-web') }}"
            data-prolog-emodul="{{ route('webpage','prolog-emodul') }}"
            data-webpage="{{ route('webpage','web') }}"
            >
                
            </div>
 
            <ul class="space-y-2 font-medium">
                <li class="flex justify-between">
                    <x-nav-link href="{{ route('dashboard') }}">
                    <svg class="w-5 h-5 text-white transition duration-75 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                    </svg>
                    <span class="ms-3 text-white">Dashboard</span>
                    </x-nav-link>
                    <button @click="open = !open" type="button" class="inline-flex items-center p-1 mt-2 text-sm rounded-lg sm:hidden hover:outline-none hover:ring-2 hover:ring-gray-200">
                        <span class="sr-only">Open sidebar</span>
                        <svg class="w-6 h-6 text-white hover:text-red-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                        </svg>
                    </button>
                </li>

                <div id="accordion-collapse-section" data-accordion="collapse" class="">

                    <!-- ================================ HEADING TEXT ================================ -->
                    <div id="heading-text-wrapper" class="px-2 flex-col gap-2 w-full hidden">
                        <h2 class="text-white">Heading Text</h2>
                        <div id="heading-text" class="bg-gray-300 border-2 border-gray-300 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-full px-1 py-2" contenteditable="true"></div>
                    </div>

                    <!-- ================================ HEAD INDICATOR ================================ -->
                    <div id="accordion-head-indicator-wrapper" class="p-3 mt-4 justify-center items-center flex-col gap-2 w-full border border-gray-300 rounded-md hidden">
                        <h2 class="text-white">Head Indicator</h2>
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
                    <div id="accordion-modal-type" class="p-3 mt-4 justify-center items-center flex-col gap-2 w-full border border-gray-300 rounded-md hidden">
                        <h2 class="text-white">Modal Type</h2>
                        <div class="flex justify-center items-center w-full">
                            <select id="modal-type" class="p-1 bg-white rounded m-1 w-full">
                                <option value="" class="text-black">-- Pilih Tipe --</option>
                                <option value="default" class="text-black">Default</option>
                                <option value="static" class="text-black">Static</option>
                            </select>
                        </div>
                    </div>

                    <!-- =============================== ACCORDION TYPE ============================ -->
                    <div id="accordion-accordion-type" class="p-3 mt-4 justify-center items-center flex-col gap-2 w-full border border-gray-300 rounded-md hidden">
                        <h2 class="text-white">Accordion Type</h2>
                        <div class="flex justify-center items-center w-full">
                            <select id="accordion-type" class="p-1 bg-white rounded m-1 w-full">
                                <option value="" class="text-black">-- Pilih Tipe --</option>
                                <option value="collapse" class="text-black">Collapse</option>
                                <option value="open" class="text-black">Open</option>
                            </select>
                        </div>
                    </div>

                    <!-- =============================== CAROUSEL ============================ -->
                    <div id="accordion-carousel-styling" class="hidden p-2 mt-4 justify-center items-center flex-col gap-2 w-full border border-gray-300 rounded-md">
                        <h1 class="text-white font-bold text-lg">Carousel</h1>
                        <div class="p-2 gap-2 mb-3 border border-gray-400 rounded-md">
                            <div class="flex flex-col justify-center items-center gap-2">
                                <div class="flex gap-3 w-full">
                                    <div class="flex flex-col justify-end w-full">
                                        <h3 class="text-white text-sm text-center">Text Position</h3>
                                        <button id="btn-text-position" data-position="image" type="button" class="text-sm w-full p-1 text-white bg-sky-500 rounded shadow-md shadow-orange-400">On Image</button>
                                    </div>
                                    <div class="w-full">
                                        <h3 class="text-white text-sm text-center">Next Button</h3>
                                        <button id="btn-hide-next" data-hide="unhide" type="button" class="text-sm w-full p-1 bg-white rounded shadow-md shadow-orange-400">Hide</button>
                                    </div>
                                    
                                </div>
                                <div class="w-full mt-2">
                                    <div class="w-full mb-3">      
                                        <h3 class="text-white text-sm text-center">Text Carousel</h3>     
                                        <button id="add-text-carousel" data-text="add" type="button" class="text-sm w-full p-1 text-white bg-sky-500 rounded shadow-md shadow-orange-400">Add Text</button>
                                    </div>
                                    <button id="add-item" type="button" class="w-full p-1 text-white bg-green-600 rounded shadow-md shadow-orange-400">Add Item</button>
                                </div>
                            </div>
                        </div>
                        <div class="w-full text-white">
                            <input type="file" id="bg-image-carousel" accept="image/*" class="hidden">
                            <div id="edit-carousel-item-wrapping" class="shadow-md shadow-white rounded-md p-2 flex flex-col max-h-[50dvh] overflow-y-auto">
                            </div>
                        </div>
                    </div>

                    <!-- ================================ FONT STYLING =============================== -->
                     <div id="accordion-font-styling" data-accordion="collapse" class="mt-2 w-full hidden"> 
                        <h2 id="accordion-font-styling-heading-1">
                            <button type="button" class="w-full flex items-center justify-between text-sm rtl:text-right text-white rounded-sm p-1 border-0 border-b-2 border-gray-200 hover:ring-2 hover:ring-gray-200 gap-3 bg-transparent" data-accordion-target="#accordion-font-styling-body-1" aria-expanded="false" aria-controls="accordion-font-styling-body-1">
                                <span >Font Styling</span>
                                <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                </svg>
                            </button>
                        </h2>
                        <div id="accordion-font-styling-body-1" class="hidden py-1.5 px-1 pb-2 border border-white rounded" aria-labelledby="accordion-font-styling-heading-1">
                            <div class="text-white w-full pb-2">
                                <div id="styling-select-group" class="flex flex-wrap justify-start gap-1">
                                    <select id="font-family" class="p-1 bg-transparent text-white rounded border-white m-1">
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

                                    <select id="font-size" class="p-1 bg-transparent text-white rounded border-white m-1">
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
                                        <label for="font-color-input" class="block mb-2 font-medium">Color</label>
                                        <input type="color" id="font-color-input">
                                    </div>

                                </div>

                                <div class="styling-button flex flex-wrap justify-start items-center gap-2 mb-3">
                                    <button id="font-bold" class="text-white"><b>B</b></button>
                                    <button id="font-italic" class="text-white"><i>I</i></button>
                                    <button id="font-underline" class="text-white"><u>U</u></button>

                                    <button id="font-left" value="left" class="text-white">
                                        <svg class="w-6 h-6  dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6h8m-8 4h12M6 14h8m-8 4h12"/>
                                        </svg>
                                    </button>
                                    <button id="font-right" value="right" class="text-white">
                                        <svg class="w-6 h-6  dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6h-8m8 4H6m12 4h-8m8 4H6"/>
                                        </svg>
                                    </button>
                                    <button id="font-center" value="center" class="text-white">
                                        <svg class="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h8M6 10h12M8 14h8M6 18h12"/>
                                        </svg>
                                    </button>
                                    <button id="font-justify" value="justify" class="text-white">
                                        <svg class="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6H6m12 4H6m12 4H6m12 4H6"/>
                                        </svg>
                                    </button>                

                                    <button onclick="document.execCommand('insertOrderedList')" id="font-order-list" class="text-white">
                                        <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6h8m-8 6h8m-8 6h8M4 16a2 2 0 1 1 3.321 1.5L4 20h5M4 5l2-1v6m-2 0h4"/>
                                        </svg>
                                    </button>

                                    <button onclick="document.execCommand('insertUnorderedList')" id="font-unorder-list" class="text-white">
                                        <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ================================== BOX ===================================== -->
                    <div id="accordion-box-field" data-accordion="collapse" class="mt-2 w-full hidden"> 
                        <h2 id="accordion-box-field-heading-1">
                            <button type="button" class="w-full flex items-center justify-between text-sm rtl:text-right text-white rounded-sm p-1 border-0 border-b-2 border-gray-200 hover:ring-2 hover:ring-gray-200 gap-3 bg-transparent" data-accordion-target="#accordion-box-field-body-1" aria-expanded="false" aria-controls="accordion-box-field-body-1">
                                <span >Box</span>
                                <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                </svg>
                            </button>
                        </h2>
                        <div id="accordion-box-field-body-1" class="hidden py-1.5 px-1 pb-2 border border-white rounded" aria-labelledby="accordion-box-field-heading-1">
                            <div class="w-full pb-2">
                                <table class="w-full">
                                    <tr id="box-width-field" class="text-white">
                                        <td>Width</td><td>:</td>
                                        <td>
                                            <input type="number" id="width-field" class="bg-transparent border-2 border-gray-300 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-[80%] p-1"/>
                                        </td>
                                    </tr>
                                    <tr id="box-height-field" class="text-white">
                                        <td>Height</td><td>:</td>
                                        <td>
                                            <input type="number" id="height-field" class="bg-transparent border-2 border-gray-300 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-[80%] p-1"/>
                                        </td>
                                    </tr>       
                                </table>
                                <div id="flex-position" class="w-full">
                                    <h2 class="text-white">Flex Position</h2>
                                    <div class="flex justify-center items-center w-full">
                                        <select id="flex-position-section" class="p-1 bg-white rounded m-1 w-full">
                                            <option value="" class="text-black">-- Pilih Position --</option>
                                            <option value="top" class="text-black">Top</option>
                                            <option value="center" class="text-black">Center</option>
                                            <option value="bottom" class="text-black">Bottom</option>
                                        </select>
                                    </div>
                                </div>
                                <div id="reset-box" class="w-full hidden mt-3">
                                    <button id="btn-reset-box" class="w-full bg-blue-500 p-1 rounded hover:bg-green-500 text-white">Reset Box</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ============================== BORDER ================================== -->
                    <div id="accordion-border-field" data-accordion="collapse" class="mt-2 w-full text-white hidden"> 
                        <h2 id="accordion-border-field-heading-1">
                            <button type="button" class="w-full flex items-center justify-between text-sm rtl:text-right text-white rounded-sm p-1 border-0 border-b-2 border-gray-200 hover:ring-2 hover:ring-gray-200 gap-3 bg-transparent" data-accordion-target="#accordion-border-field-body-1" aria-expanded="false" aria-controls="accordion-border-field-body-1">
                                <span>Border</span>
                                <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                </svg>
                            </button>
                        </h2>     
                        <div id="accordion-border-field-body-1" class="hidden py-1.5 px-1 pb-2 border border-white rounded" aria-labelledby="accordion-border-field-heading-1">
                            <!-- -------------- BORDER ---------------- -->
                            <div id="border-basic">
                                <table>
                                    <tr>
                                        <td>Color</td><td>:</td>
                                        <td><input type="color" id="border-color-field" ></td>
                                    </tr>
                                    <tr>
                                        <td>Border</td><td>:</td>
                                        <td>
                                            <input type="number" id="border-field" class="bg-transparent border-2 border-gray-300  text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-14 p-1"/>
                                        </td>
                                    </tr>
                                </table>
    
                                <div id="accordion-advance-border" data-accordion="collapse" class="mt-2 mb-4 px-1"> 
                                    <h2 id="accordion-advance-border-heading-1">
                                        <button type="button" class="flex items-center justify-between text-sm rtl:text-right text-white rounded-sm p-1 border-0 border-b-2 border-gray-200 hover:ring-2 hover:ring-gray-200 gap-3 bg-transparent" data-accordion-target="#accordion-advance-border-1" aria-expanded="true" aria-controls="accordion-advance-border-body-1">
                                            <span >Advance</span>
                                            <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                            </svg>
                                        </button>
                                    </h2>
                                    <div id="accordion-advance-border-1" class="hidden" aria-labelledby="accordion-advance-border-heading-1">
                                        <div class="flex justify-start items-start gap-2 flex-wrap py-1 px-2 bg-gray-300/25 inset-shadow-md rounded">
                                            <table class="w-full flex">
                                                <tbody class="w-full">
                                                    <tr class="w-full flex gap-3 items-center">
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="border-field-top">Top</label>
                                                            <input type="number" id="border-field-top" class="bg-transparent border-2 border-gray-300 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="border-field-right">Right</label>
                                                            <input type="number" id="border-field-right" class="bg-transparent border-2 border-gray-300 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                    </tr>
                                                    <tr class="w-full flex gap-3 items-center">
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="border-field-left">Left</label>
                                                            <input type="number" id="border-field-left" class="bg-transparent border-2 border-gray-300 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                    
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="border-field-bottom">Bottom</label>
                                                            <input type="number" id="border-field-bottom" class="bg-transparent border-2 border-gray-300 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <hr class="border border-b-1 border-white mt-2">
                                </div>
                            </div>

                            <!-- ------------- ROUNDED ------------ -->
                            <div id="border-rounded">
                                <table>
                                    <tr>
                                        <td>Rounded</td><td>:</td>
                                        <td>
                                            <input type="number" id="border-field-rounded" class="bg-transparent border-2 border-gray-300  text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-14 p-1"/>
                                        </td>
                                    </tr>
                                </table>
                                
                                <div id="accordion-advance-border-rounded" data-accordion="collapse" class="mt-2 px-1"> 
                                    <h2 id="accordion-advance-border-rounded-heading-1">
                                        <button type="button" class="flex items-center justify-between text-sm rtl:text-right text-white rounded-sm p-1 border-0 border-b-2 border-gray-200 hover:ring-2 hover:ring-gray-200 gap-3 bg-transparent" data-accordion-target="#accordion-advance-border-rounded-1" aria-expanded="true" aria-controls="accordion-advance-border-rounded-body-1">
                                            <span >Advance</span>
                                            <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                            </svg>
                                        </button>
                                    </h2>
                                    <div id="accordion-advance-border-rounded-1" class="hidden" aria-labelledby="accordion-advance-border-rounded-heading-1">
                                        <div class="flex justify-start items-start gap-2 flex-wrap py-1 px-2 bg-gray-300/25 inset-shadow-md rounded">
                                            <table class="w-full flex">
                                                <tbody class="w-full">
                                                    <tr class="w-full flex gap-3 items-center">
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="border-field-rounded-top-left">Top Left</label>
                                                            <input type="number" id="border-field-rounded-top-left" class="bg-transparent border-2 border-gray-300  text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="border-field-rounded-top-right">Top Right</label>
                                                            <input type="number" id="border-field-rounded-top-right" class="bg-transparent border-2 border-gray-300  text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                    </tr>
    
                                                    <tr class="w-full flex gap-3 items-center">
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="border-field-rounded-bottom-left">Bottom Left</label>
                                                            <input type="number" id="border-field-rounded-bottom-left" class="bg-transparent border-2 border-gray-300  text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="border-field-rounded-bottom-right" class="text-sm">Bottom Right</label>
                                                            <input type="number" id="border-field-rounded-bottom-right" class="bg-transparent border-2 border-gray-300  text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- -----------BORDER WAVE ------------- -->
                            <div id="accordion-border-wave-section" data-accordion="collapse" class="mt-2 w-full text-white"> 
                                <h2 id="accordion-border-wave-section-heading-1">
                                    <button type="button" class="w-full flex items-center justify-between text-sm rtl:text-right text-white rounded-sm p-1 border-0 border-b-2 border-gray-200 hover:ring-2 hover:ring-gray-200 gap-3 bg-transparent" data-accordion-target="#accordion-border-wave-section-body-1" aria-expanded="true" aria-controls="accordion-border-wave-section-body-1">
                                        <span>Border Wave</span>
                                        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                        </svg>
                                    </button>
                                </h2>     
                                <div id="accordion-border-wave-section-body-1" class="hidden py-1.5 px-1 pb-2" aria-labelledby="accordion-border-wave-section-heading-1">
                                    <div class="flex flex-col gap-2 mb-2">
                                        <span >Color:</span>
                                        <input type="color" id="border-wave-color" class="rounded"/>
                                    </div>  
                                    <div class="flex flex-col gap-2 mb-2">  
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
                                                <button type="button" class="flex items-center justify-between text-sm rtl:text-right text-white rounded-sm p-1 border-0 border-b-2 border-gray-200 hover:ring-2 hover:ring-gray-200 gap-3 bg-transparent" data-accordion-target="#accordion-tipe-wave-section-1" aria-expanded="true" aria-controls="accordion-tipe-wave-section-body-1">
                                                    <span >Tipe</span>
                                                    <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                                    </svg>
                                                </button>
                                            </h2>
                                            <div id="accordion-tipe-wave-section-1" class="hidden" aria-labelledby="accordion-tipe-wave-section-heading-1">
                                                <div class="flex justify-start items-start gap-1 flex-wrap py-1 px-2 bg-gray-300/25 inset-shadow-md rounded cursor-pointer">
                                                    <div class="border-2 border-gray-300 rounded px-1" id="border-wave-type-1">
                                                        <svg class="w-16 h-16" id="type-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,224L30,224C60,224,120,224,180,208C240,192,300,160,360,133.3C420,107,480,85,540,106.7C600,128,660,192,720,197.3C780,203,840,149,900,133.3C960,117,1020,139,1080,176C1140,213,1200,267,1260,282.7C1320,299,1380,277,1410,266.7L1440,256L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"></path></svg>
                                                    </div>
                                                    <div class="border-2 border-gray-300 rounded px-1" id="border-wave-type-2">
                                                        <svg class="w-16 h-16" id="type-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,96L60,101.3C120,107,240,117,360,122.7C480,128,600,128,720,138.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-2 mb-2">                                        
                                        <div id="accordion-wave-border-section" data-accordion="collapse" class="mt-2 px-1"> 
                                            <span id="accordion-wave-border-section-heading-1">
                                                <span >anda bisa buat wave anda sendiri <a href="https://getwaves.io/" class="underline text-sky-400" target="_blank">disini</a> dan masukkan kode svgnya
                                                    <button type="button" class="flex items-center justify-between text-sm rtl:text-right text-white gap-3 bg-transparent" data-accordion-target="#accordion-wave-border-section-1" aria-expanded="false" aria-controls="accordion-wave-border-section-body-1">
                                                        <span class="underline text-sky-400">disini</span>
                                                    </button>
                                                </span>
                                            </span>
                                            <div id="accordion-wave-border-section-1" class="hidden" aria-labelledby="accordion-wave-border-section-heading-1">
                                                <textarea name="border-wave-svg" id="border-wave-svg" class="p-1 bg-transparent text-white rounded border-white m-1"></textarea>
                                                <button id="apply-border-wave-svg" class="bg-blue-500 text-white px-2 py-1 rounded">Terapkan</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-2 mb-2">
                                        <button id="btn-reset-border-wave" class="hidden bg-blue-500 p-1  rounded hover:bg-green-500 hover:text-white">Reset</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ============================== BACKGROUND ================================== -->
                    <div id="accordion-background" data-accordion="collapse" class="mt-2 w-full hidden"> 
                        <h2 id="accordion-background-heading-1">
                            <button type="button" class="w-full flex items-center justify-between text-sm rtl:text-right text-white rounded-sm p-1 border-0 border-b-2 border-gray-200 hover:ring-2 hover:ring-gray-200 gap-3 bg-transparent" data-accordion-target="#accordion-background-body-1" aria-expanded="false" aria-controls="accordion-background-body-1">
                                <span >Background</span>
                                <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                </svg>
                            </button>
                        </h2>
                        <div id="accordion-background-body-1" class="hidden py-1.5 px-1 pb-2 border border-white rounded" aria-labelledby="accordion-background-heading-1">
                            <div class="text-white flex flex-col justify-center items-center w-full p-3">
                                <div class="mb-5 flex justify-center items-center flex-col text-white w-full">
                                    <label for="color-field-input" class="block mb-2 font-medium">Background Color</label>
                                    <input type="color" class="rounded w-[50%] h-[30px]" id="color-field-input">
                                </div>
                                <div class="mb-5 flex justify-center items-center flex-col text-white w-full">
                                    <label for="bg-color-opacity" class="block mb-1 font-medium">Color Opacity</label>
                                    <input type="range" id="bg-color-opacity" class="w-full" min="0" max="1" step="0.01" value="1">
                                </div>

                                <div id="bg-image-styling">
                                    <div class="flex justify-center items-center flex-col gap-2 text-white w-full">
                                        <input type="file" id="bg-image-input" accept="image/*" class="hidden">
                                        <label for="bg-image-input" class="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer w-full text-center">Choose File</label>
                                        <span id="file-name-display" class="ml-2 text-sm text-white break-all">No image selected</span>
                                        <div id="preview-container" class="mt-3 flex justify-center">
                                            <img id="preview-image" src="" alt="Preview" class="w-1/2 h-auto rounded-lg hidden" />
                                        </div>
                                    </div>
    
                                    <div class="mb-5 flex justify-center items-center flex-col text-white w-full">
                                        <label class="block mb-2 font-medium">Background Size</label>
                                        <div class="flex gap-3 ps-3">
                                            <div>
                                                <input type="radio" name="bg-image-size" id="bg-image-size-cover" value="cover" checked>
                                                <label for="bg-image-size-cover">Cover</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="bg-image-size" id="bg-image-size-contain" value="contain">
                                                <label for="bg-image-size-contain">Contain</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="wrapper-btn-reset-bg-image" class="mb-5 text-white w-full hidden">
                                    <button type="button" id="btn-reset-bg-image" class="bg-blue-500 rounded p-3 w-full text-sm ">Reset Background Image</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ============================== PADDING ================================== -->
                    <div id="accordion-padding" data-accordion="collapse" class="mt-2 w-full hidden"> 
                        <h2 id="accordion-padding-heading-1">
                            <button type="button" class="w-full flex items-center justify-between text-sm rtl:text-right text-white rounded-sm p-1 border-0 border-b-2 border-gray-200 hover:ring-2 hover:ring-gray-200 gap-3 bg-transparent" data-accordion-target="#accordion-padding-body-1" aria-expanded="false" aria-controls="accordion-padding-body-1">
                                <span >Padding</span>
                                <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                </svg>
                            </button>
                        </h2>
                        <div id="accordion-padding-body-1" class="hidden py-1.5 px-1 pb-2 border border-white rounded" aria-labelledby="accordion-padding-heading-1">
                            <div class="text-white w-full">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Padding</td><td>:</td>
                                            <td>
                                                <input type="number" id="padding-field" class="bg-transparent border-2 border-gray-300  text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-14 p-1"/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table> 
                                
                                <div id="accordion-advance-padding" data-accordion="collapse" class="mt-2 px-1"> 
                                    <h2 id="accordion-advance-padding-heading-1">
                                        <button type="button" class="flex items-center justify-between text-sm rtl:text-right text-white rounded-sm p-1 border-0 border-b-2 border-gray-200 hover:ring-2 hover:ring-gray-200 gap-3 bg-transparent" data-accordion-target="#accordion-advance-padding-1" aria-expanded="true" aria-controls="accordion-advance-padding-body-1">
                                            <span >Advance</span>
                                            <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                            </svg>
                                        </button>
                                    </h2>
                                    <div id="accordion-advance-padding-1" class="hidden" aria-labelledby="accordion-advance-padding-heading-1">
                                        <div class="flex justify-start items-center gap-2 flex-wrap py-1 px-2 bg-gray-300/25 inset-shadow-md rounded">
                                            <table class="w-full flex">
                                                <tbody class="w-full">
                                                    <tr class="w-full flex gap-3 items-center">
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="padding-field-left">Left</label>
                                                            <input type="number" id="padding-field-left" class="bg-transparent border-2 border-gray-300  text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="padding-field-right">Right</label>
                                                            <input type="number" id="padding-field-right" class="bg-transparent border-2 border-gray-300  text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                    </tr>

                                                    <tr class="w-full flex gap-3 items-center">
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="padding-field-top">Top</label>
                                                            <input type="number" id="padding-field-top" class="bg-transparent border-2 border-gray-300  text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="padding-field-bottom">Bottom</label>
                                                            <input type="number" id="padding-field-bottom" class="bg-transparent border-2 border-gray-300  text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
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

                    <!-- ============================== MARGIN ================================== -->
                    <div id="accordion-margin" data-accordion="collapse" class="mt-2 w-full hidden"> 
                        <h2 id="accordion-margin-heading-1">
                            <button type="button" class="w-full flex items-center justify-between text-sm rtl:text-right text-white rounded-sm p-1 border-0 border-b-2 border-gray-200 hover:ring-2 hover:ring-gray-200 gap-3 bg-transparent" data-accordion-target="#accordion-margin-body-1" aria-expanded="false" aria-controls="accordion-margin-body-1">
                                <span >Margin</span>
                                <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                </svg>
                            </button>
                        </h2>
                        <div id="accordion-margin-body-1" class="hidden py-1.5 px-1 border border-white rounded" aria-labelledby="accordion-margin-heading-1">
                            <div class="text-white w-full pb-2">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Margin</td><td>:</td>
                                            <td>
                                                <input type="number" id="margin-field" class="bg-transparent border-2 border-gray-300  text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-14 p-1"/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table> 
                                
                                <div id="accordion-advance-margin" data-accordion="collapse" class="mt-2 px-1"> 
                                    <h2 id="accordion-advance-margin-heading-1">
                                        <button type="button" class="flex items-center justify-between text-sm rtl:text-right text-white rounded-sm p-1 border-0 border-b-2 border-gray-200 hover:ring-2 hover:ring-gray-200 gap-3 bg-transparent" data-accordion-target="#accordion-advance-margin-1" aria-expanded="true" aria-controls="accordion-advance-margin-body-1">
                                            <span >Advance</span>
                                            <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                                            </svg>
                                        </button>
                                    </h2>
                                    <div id="accordion-advance-margin-1" class="hidden" aria-labelledby="accordion-advance-margin-heading-1">
                                        <div class="flex justify-start items-center gap-2 flex-wrap py-1 px-2 bg-gray-300/25 inset-shadow-md rounded">
                                            <table class="w-full flex">
                                                <tbody class="w-full">
                                                    <tr class="w-full flex gap-3 items-center">
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="margin-field-left">Left</label>
                                                            <input type="number" id="margin-field-left" class="bg-transparent border-2 border-gray-300  text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="margin-field-right">Right</label>
                                                            <input type="number" id="margin-field-right" class="bg-transparent border-2 border-gray-300  text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                    </tr>

                                                    <tr class="w-full flex gap-3 items-center">
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="margin-field-top">Top</label>
                                                            <input type="number" id="margin-field-top" class="bg-transparent border-2 border-gray-300  text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
                                                        </td>
                                                        <td class="flex justify-center items-center flex-col">
                                                            <label for="margin-field-bottom">Bottom</label>
                                                            <input type="number" id="margin-field-bottom" class="bg-transparent border-2 border-gray-300  text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1"/>
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
                    <!-- ============================== BTN SAVE ================================ -->
                    <div id="wrapper-btn-save" class="w-full bg-white p-4 hidden">
                        <button id="btn-save" class="border-2 border-black px-1 rounded hover:bg-green-500 hover:text-white">Save</button>
                        <button id="btn-cek" class="border-2 border-black px-1 rounded hover:bg-green-500 hover:text-white">cek</button>
                    </div>
                </div>
            </ul>
        </div>
    </aside>
</div>
