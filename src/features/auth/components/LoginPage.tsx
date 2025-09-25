import { PawPrint } from 'lucide-react';
import LoginForm from '../view/LoginForm';

export function LoginPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 px-4 py-8">
			{/* Background Pattern */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
				<div
					className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
					style={{ animationDelay: '2s' }}
				></div>
			</div>

			<div className="relative w-full max-w-md">
				{/* Main Card */}
				<div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 space-y-8 border border-white/20">
					{/* Header Section */}
					<div className="text-center space-y-4">
						<div className="relative inline-block">
							<div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
								<PawPrint className="w-8 h-8 text-white" />
							</div>
							<div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
								<div className="w-2 h-2 bg-white rounded-full"></div>
							</div>
						</div>

						<div className="space-y-2">
							<h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
								¡Bienvenido de vuelta!
							</h1>
							<p className="text-gray-600 text-lg">
								Inicia sesión para cuidar de tus peluditos
							</p>
						</div>
					</div>

					{/* Form Section */}
					<LoginForm />
				</div>

				{/* Footer */}
				<div className="text-center mt-8">
					<p className="text-sm text-gray-500">
						Al continuar, aceptas nuestros{' '}
						<a href="#" className="text-orange-600 hover:underline">
							Términos de Servicio
						</a>{' '}
						y{' '}
						<a href="#" className="text-orange-600 hover:underline">
							Política de Privacidad
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
