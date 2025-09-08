import { defineConfig } from 'vite';
import path from 'path'
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
    alias: {
		'@': path.resolve(__dirname, './src'), 
		'@components': path.resolve(__dirname, './src/components'), 
		'@assets': path.resolve(__dirname, './src/assets'),
    },
    },
});
