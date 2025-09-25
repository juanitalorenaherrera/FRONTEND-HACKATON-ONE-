import React from 'react';
import { useNavigate } from 'react-router';

export default function RegisterLink(): React.ReactElement {
	const navigate = useNavigate();

	return (
		<div className="text-center pt-4 border-t border-gray-200">
			<p className="text-gray-600">
				¿No tienes una cuenta?{' '}
				<button
					type="button"
					onClick={() => navigate('/register')}
					className="font-bold text-orange-600 hover:text-orange-700 hover:underline transition-colors"
				>
					Regístrate gratis
				</button>
			</p>
		</div>
	);
}
