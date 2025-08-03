<div {{ $attributes->merge([
    'class' => 'loadingScreenScoring overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 z-50 justify-center items-center w-full md:inset-0 h-full',
    'data-modal-backdrop' => 'static',
    'tabindex' => '-1',
    'aria-hidden' => 'true'
]) }}>
    <div class="relative p-4 max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative">
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4">
                <img src="{{ asset('loading.gif') }}" alt="Loading..." class="mx-auto" />
            </div>
        </div>
    </div>
</div>