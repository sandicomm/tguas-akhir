
    <div>
        <div class="p-4 sm:ml-64 realtive">
            
            <x-loading wire:loading.flex />
            @if(session('success'))
                <div class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50">
                    <div class="flex items-center justify-between gap-4">
                        <span>{{ session('success') }}</span>
                        <button type="button" class="text-green-700 hover:text-green-900" onclick="this.parentElement.parentElement.remove()">
                            &times;
                        </button>
                    </div>
                </div>
            @endif

            @if (session('error'))
                <div class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50">
                    <div class="flex items-center justify-between gap-4">
                        <span>{{ session('error') }}</span>
                        <button type="button" class="text-red-700 hover:text-red-900" onclick="this.parentElement.parentElement.remove()">
                            &times;
                        </button>
                    </div>
                </div>
            @endif

            @if ($errors->any())
                <div class="fixed top-7 right-3 z-20 text-right shadow-md bg-red-100 border-l-4 border-red-500 text-red-700 p-4 dark:bg-gray-800 dark:border-red-600 dark:text-red-400" role="alert">
                    <p class="font-bold">Error</p>
                    @foreach ($errors->all() as $error)
                        <p>{{ $error }}</p>
                    @endforeach
                </div>
            @endif
            <div id="webpage" class="relative">
            </div>
            
            {{-- <div class="w-full h-[100dvh] relative" 
                style="
                    background-color: rgba(0, 0, 0, 0.448);
                    background-image: url('{{ asset('assets/img/diabet-paper.jpg') }}'); 
                    background-size:cover;
                    font-family: 'Roboto Slab', Serif;
                    font-weight: 400;
                    ">
                <div
                    style="
                        display:flex;
                        flex-direction: column;
                        justify-content:center;
                        align-items: center;
                        text-align: center;
                        color: white;
                        height:100%;
                        background-color: rgba(0, 0, 0, 0.448);
                    ">
                    <p class="text-5xl">Smart Health Diabetes</p>
                    <p class="text-xl">Disusun Oleh:</p>
                    <p>Adrianus, Amalia, Dina, dan Kaswo</p>
                    <p class="text-xl">Dosen Pembimbing:</p>
                    <p>Ns. Ni Bodro Ardi, S.Kep., M.Kep dan Ns. Rita Dwi Pratiwi, S.Kep., M.Sc., Ph.D. </p>

                </div>
                <div>
                    <svg style="
                        z-index: 9;
                        bottom: 0;
                        position: absolute;
                    " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#ffffff" fill-opacity="1" d="M0,32L48,53.3C96,75,192,117,288,122.7C384,128,480,96,576,106.7C672,117,768,171,864,197.3C960,224,1056,224,1152,197.3C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
                </div>
            </div>
            <div style="
                padding: 48px;
                font-family: 'Roboto Slab', Serif;
                font-weight: 400;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                background-color:white;
            ">
                <div style="
                    text-align:center;
                    width:40%;
                ">
                    <p class="text-4xl">Selamat Datang di SHD</p>
                    <p>Website ini hadir untuk membantu Anda mengelola diabetes tipe 2 dengan lebih baik melalui edukasi digital yang mudah dipahami. Temukan informasi dan panduan untuk meningkatkan pengetahuan dan perawatan Anda, kapan saja dan di mana saja. Bergabunglah bersama kami dalam menjalani hidup sehat dengan diabetes!</p>
                </div>
            </div>
            <div style="
                padding:1.25rem;
                font-family: 'poppins', Serif;
                font-weight: 400;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                border-radius: 15px 15px 0px 0px;
                background-color: #7AA2E3;
            ">
                <article class="d-flex justify-content-center align-items-center flex-column"
                style="
                    width:40%;
                    display:flex;
                    justify-conten:center;
                    align-items:center;
                    flex-direction:column;
                ">
                    <div id="accordion-collapse-visi" data-accordion="collapse" class="w-[90%]">
                        <button id="accordion-collapse-heading-2" type="button" class="w-full flex justify-between items-center text-white bg-black px-5 py-2.5 me-2 mb-2 focus:bg-black" data-accordion-target="#accordion-collapse-body-2" aria-expanded="false" aria-controls="accordion-collapse-body-2"
                        style="border-radius: 20px;">
                            <span style="
                                font-size:2.5rem;
                                flex:2;
                                ">Visi
                            </span>
                            <span style="font-weight: 500;
                                    border-radius: 20px;
                                    width: 35px;
                                    padding: 5px;
                                    background-color: white;
                                    color: black;
                                    margin: 0px;
                                    animation: btn-visi-animation 1s linear 1s infinite alternate;">?</span>

                        </button>
                        <div id="accordion-collapse-body-2" class="hidden" aria-labelledby="accordion-collapse-heading-2">
                            <div class="p-5 bg-gray-200 text-center">
                                Meningkatkan kualitas hidup penderita diabetes tipe 2 melalui edukasi berbasis teknologi, dengan fokus pada peningkatan pengetahuan, pencegahan, dan perencanaan perawatan yang terintegrasi.
                            </div>
                        </div>
                    </div>
                </article>
                <article
                style="
                    width:40%;
                    display:flex;
                    justify-conten:center;
                    align-items:center;
                    flex-direction:column;
                    margin-top:1rem;
                ">
                    <h2 style="font-family: 'Roboto Slab', Serif;
                    font-weight: 400;
                    font-size:2rem;
                    width: 90%;
                    background-color: white;
                    border-radius: 20px;
                    padding: 15px;
                    margin-bottom:8px;
                    font-weight: bold;
                    text-align:center;">Misi</h2>
                    <div id="accordion-collapse-misi" data-accordion="collapse" class="w-[90%] bg-gray-100 text-black rounded">
                        <h2 id="accordion-misi-heading-1" class="text-black border-bottom border-gray-800">
                            <button type="button" class="flex items-center justify-between w-full p-5 font-medium rtl:text-right rounded-t-xl gap-3" data-accordion-target="#accordion-misi-body-1" aria-expanded="true" aria-controls="accordion-misi-body-1">
                            <span>What is Flowbite?</span>
                            <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                            </svg>
                            </button>
                        </h2>
                        <div id="accordion-misi-body-1" class="hidden" aria-labelledby="accordion-misi-heading-1">
                            <div class="p-5 bg-gray-600 text-white">
                            <p class="mb-2">Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons, dropdowns, modals, navbars, and more.</p>
                            <p class="">Check out this guide to learn how to and start developing websites even faster with components on top of Tailwind CSS.</p>
                            </div>
                        </div>
                        <h2 id="accordion-misi-heading-2">
                            <button type="button" class="flex items-center justify-between w-full p-5 font-medium rtl:text-right  border-gray-200 rounded-t-xl gap-3" data-accordion-target="#accordion-misi-body-2" aria-expanded="false" aria-controls="accordion-misi-body-2">
                            <span>Is there a Figma file available?</span>
                            <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                            </svg>
                            </button>
                        </h2>
                        <div id="accordion-misi-body-2" class="hidden" aria-labelledby="accordion-misi-heading-2">
                            <div class="p-5 bg-gray-600 text-white">
                            <p class="mb-2">Flowbite is first conceptualized and designed using the Figma software so everything you see in the library has a design equivalent in our Figma file.</p>
                            <p class="">Check out the based on the utility classes from Tailwind CSS and components from Flowbite.</p>
                            </div>
                        </div>
                        <h2 id="accordion-misi-heading-3">
                            <button type="button" class="flex items-center justify-between w-full p-5 font-medium border-gray-200 rounded-t-xl gap-3" data-accordion-target="#accordion-misi-body-3" aria-expanded="false" aria-controls="accordion-misi-body-3">
                            <span>What are the differences betweend</span>
                            <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                            </svg>
                            </button>
                        </h2>
                        <div id="accordion-misi-body-3" class="hidden" aria-labelledby="accordion-misi-heading-3">
                            <div class="p-5 bg-gray-600 text-white">
                            <p class="mb-2 ">The main difference is that the core components from Flowbite are open source under the MIT license, whereas Tailwind UI is a paid product. Another difference is that Flowbite relies on smaller and standalone components, whereas Tailwind UI offers sections of pages.</p>
                            </div>
                        </div>
                        </div>
                </article>
            </div> --}}
        </div>
    </div>

