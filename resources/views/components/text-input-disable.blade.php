@props(['disabled' => false])

<input @disabled($disabled) {{ $attributes->merge(['class' => 'border-0 focus:border-0 focus:ring-0 rounded-md shadow-sm']) }}>
