import autoprefixer from 'autoprefixer' // 
import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	css: {
		postcss: {
			plugins: [autoprefixer()]
		}
	},
	resolve: {
    alias: {
		'@': path.resolve(__dirname, './src'), 
		'@components': path.resolve(__dirname, './src/components'), 
		'@assets': path.resolve(__dirname, './src/assets'),
    },
    },
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					'vendor': ['react', 'react-dom'],
					'router': ['react-router'],
					'dashboard': [
						'./src/features/dashboard/MainDashboardView',
						'./src/layouts/DashboardLayout'
					],
					'pets': [
						'./src/features/pets/components/PetProfile',
						'./src/features/pets/components/PetsOverview',
						'./src/features/pets/view/PetsView'
					],
					'booking': [
						'./src/features/booking/views/BookingView',
						'./src/pages/OwnerBooking'
					],
					'sitters': ['./src/features/sitters/components/FindSittersView']
				}
			}
		}
	}
});
