import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';
import { WSZYSTKIE_TRASY } from './src/seo/meta.js';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    // Generuje osobny plik HTML dla kazdej trasy. Bez tego Facebook,
    // LinkedIn i roboty AI widza tylko pusty <div id="root">.
    // Lista tras pochodzi z src/seo/meta.js, czyli z tego samego miejsca
    // co tytuly i opisy — nie da sie dodac podstrony i zapomniec o meta.
    vitePrerenderPlugin({
      renderTarget: '#root',
      additionalPrerenderRoutes: WSZYSTKIE_TRASY,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: [
          'import',
          'color-functions',
          'slash-div',
          'global-builtin',
        ],
      },
    },
  },
});
