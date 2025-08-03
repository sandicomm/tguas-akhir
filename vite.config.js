import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        })
    ],
    build: {
        // output langsung ke folder build di public_html (karena public_path() sudah di-override)
        outDir: 'build',
        emptyOutDir: true,
        manifest: true,
        assetsDir: 'assets',
        rollupOptions: {

        },
      },
});
