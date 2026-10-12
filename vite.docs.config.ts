import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
// Relative assets + hash routes work at either / or /lanshang-ui/ without server rewrites.
export default defineConfig({plugins:[react()],base:'./',build:{outDir:'site-dist',emptyOutDir:true}});
