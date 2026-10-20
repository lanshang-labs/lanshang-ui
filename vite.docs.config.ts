import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
// Relative assets + hash routes work at either / or /lanshang-ui/ without server rewrites.
export default defineConfig({plugins:[react()],base:'./',publicDir:'.registry-build/public',build:{outDir:'site-dist',emptyOutDir:true,rollupOptions:{input:{main:fileURLToPath(new URL('./index.html',import.meta.url)),studio:fileURLToPath(new URL('./style-study.html',import.meta.url))}}}});
