<nav class="bg-white fixed w-full z-20 top-0 start-0 border-default">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse text-xl font-semibold sm:text-2xl whitespace-nowrap">
        Smart Health <span class="text-red-600 font-bold ms-1">Diabetes</span>
    </a>
    <button data-collapse-toggle="navbar-dropdown" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-dropdown" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/></svg>
    </button>
    <div class="hidden w-full md:block md:w-auto" id="navbar-dropdown">
      <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-neutral-primary">
        <li>
            <a href="{{ route('interaktif') }}" class="inline-flex items-center w-full p-2 hover:bg-blue-100 hover:text-heading rounded">Home</a>
        </li>
        <li>
            <a href="{{ route('form-test', 'post-test-interaktif') }}" class="inline-flex items-center w-full p-2 hover:bg-blue-100 hover:text-heading rounded">Post Test</a>
        </li>
        <li>
            <button id="dropdownNvbarButton" data-dropdown-toggle="dropdownNavbar" class="flex items-center justify-between w-full  py-2 px-3 rounded font-medium text-heading hover:bg-blue-100 md:hover:text-fg-brand">
                Media 
              <svg class="w-4 h-4 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/></svg>
          </button>
          <!-- Dropdown menu -->
          <div id="dropdownNavbar" class="bg-white z-10 hidden border border-gray-300 rounded shadow-lg w-44">
                <ul class="py-2 text-sm text-gray-700 dark:text-gray-400" aria-labelledby="dropdownLargeButton">
                    <li><a href="{{ route('interaktif.media', ['type' => 'poster']) }}" class="inline-flex items-center w-full p-2 hover:bg-blue-100 hover:text-heading rounded">Poster</a></li>
                    <li><a href="{{ route('interaktif.media', ['type' => 'video']) }}" class="inline-flex items-center w-full p-2 hover:bg-blue-100 hover:text-heading rounded">Video</a></li>
                </ul>
          </div>
        </li>
        
      </ul>
    </div>
  </div>
</nav>


