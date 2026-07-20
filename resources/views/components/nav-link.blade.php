
@php
$classes = 'flex items-start p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-600 dark:hover:bg-blue-400 group';
@endphp

<a {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</a>
