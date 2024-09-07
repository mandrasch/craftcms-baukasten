import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import legacy from '@vitejs/plugin-legacy';
import ViteRestart from 'vite-plugin-restart';
import viteCompression from 'vite-plugin-compression';
import manifestSRI from 'vite-plugin-manifest-sri';
import { visualizer } from 'rollup-plugin-visualizer';
import eslintPlugin from 'vite-plugin-eslint';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import critical from 'rollup-plugin-critical';
import { ViteFaviconsPlugin } from 'vite-plugin-favicon2';
import * as path from 'path';
import copy from 'rollup-plugin-copy';

// https://vitejs.dev/config/

// Laravel Valet
let origin = 'http://localhost:3100';
const port = 3100;

// DDEV (local)
if (Object.prototype.hasOwnProperty.call(process.env, 'IS_DDEV')) {
  origin = `${process.env.DDEV_PRIMARY_URL}:${port}`;
}

// Gitpod
if (Object.prototype.hasOwnProperty.call(process.env, 'GITPOD_WORKSPACE_URL')) {
  origin = `${process.env.GITPOD_WORKSPACE_URL}`;
  origin = origin.replace('https://', 'https://3100-');
  console.log(`Gitpod detected, set origin to ${origin}`);
}

// Github Codespaces
if (Object.prototype.hasOwnProperty.call(process.env, 'CODESPACES')) {
  origin = `https://${process.env.CODESPACE_NAME}-${port}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`;
  console.log('Codespaces environment detected, setting config to ', { port, origin });
  console.log("Please check that this can be opened via browser after you run 'ddev npm run dev':");
  console.log(origin + '/src/js/app.ts');
  console.log("If it can't be opened, please switch the Vite port to public in the ports tab.");
}

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '' : '/dist/',
  esbuild: {
    drop: command === 'build' ? ['console', 'debugger'] : [],
  },
  build: {
    emptyOutDir: true,
    manifest: true,
    outDir: path.resolve('./web/dist'),
    rollupOptions: {
      input: {
        app: './src/js/app.ts',
      },
    },
    sourcemap: true,
  },
  plugins: [
    critical({
      // TODO: hardcoded?
      criticalUrl: 'https://stage.baukasten.io/',
      criticalBase: './web/dist/criticalcss/',
      criticalPages: [
        { uri: '', template: 'index' },
        { uri: 'content-builder', template: 'entry/pages/contentBuilder' },
      ],
      criticalConfig: {
        width: 1680,
        height: 1200,
      },
    }),
    // legacy({
    //   targets: ['defaults', 'not IE 11'],
    // }),
    nodeResolve({
      moduleDirectories: ['node_modules'],
    }),
    ViteFaviconsPlugin({
      logo: './src/public/images/favicon-src.svg',
      inject: false,
      outputPath: 'favicons-default',
      favicons: {
        appName: 'craftcms-baukasten',
        lang: 'de',
        background: '#244F43',
        theme_color: '#244F43',
      },
    }),
    ViteRestart({
      reload: ['./translations/**/*.php', './templates/**/*.{twig,html,php}'],
    }),
    vue(),
    viteCompression({
      filter: /\.(js|mjs|json|css|map)$/i,
    }),
    manifestSRI(),
    visualizer({
      filename: './web/dist/assets/stats.html',
      template: 'treemap',
      sourcemap: true,
    }),
    eslintPlugin({
      cache: false,
    }),
    copy({
      targets: [{ src: 'src/public/*', dest: 'web/dist' }],
      hook: command === 'build' ? 'writeBundle' : 'buildStart',
      copyOnce: true,
    }),
  ],
  publicDir: './src/public',
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      '@': path.resolve('./src'),
      '@templates': path.resolve('./templates'),
      '@components': path.resolve('./templates/_components'),
    },
  },
  server: {
    host: '0.0.0.0',
    origin,
    port,
    strictPort: true,
  },
}));
