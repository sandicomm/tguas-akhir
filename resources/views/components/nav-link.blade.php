
@php
$classes = 'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-500 group';
@endphp

<a {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</a>
