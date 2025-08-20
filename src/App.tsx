import { BrowserRouter, Routes, Route } from 'react-router';
import LoginPage from './componentes/LoginPage';
import OwnerDashboard from './componentes/OwnerDashboard';
import AdminDashboard from './componentes/AdminDashboard';
import SitterDashboard from './componentes/SitterDashboard';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/owner" element={<OwnerDashboard />} />
				<Route path="/sitter" element={<SitterDashboard />} />
				<Route path="/admin" element={<AdminDashboard />} />
			</Routes>
		</BrowserRouter>
	);
}
