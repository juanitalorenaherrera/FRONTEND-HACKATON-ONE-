import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/AuthStore';
import { registerRequest } from '../services/authService';
import { useNavigate } from 'react-router';
import { Role } from '../types/authStore';

interface RegisterSubmit {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	address: string;
	phoneNumber: string;
}

export default function Register () {
	const { register, handleSubmit } = useForm<RegisterSubmit>();
	const navigate = useNavigate();
	const setProfile = useAuthStore((state) => state.setProfile);
	const setToken = useAuthStore((state) => state.setToken);

	const onSubmit = async (data: RegisterSubmit) => {
		try {
			const response = await registerRequest(
				data.firstName,
				data.lastName,
				data.email,
				data.password,
				data.address,
				data.phoneNumber
			);
		
			if (!response.token) {
				throw new Error('Error en el registro');
			}

			setToken(response.token);
			setProfile(response.userProfile);

			if (response.userProfile.role === Role.ADMIN) {
				navigate('/AdminDashboard');
				return;
			}
			if (response.userProfile.role === Role.SITTER) {
				navigate('/SitterDashboard');
				return;
			}

			if (response.userProfile.role === Role.CLIENT) {
				navigate('/ClientDashboard');
				return;
			}
			navigate('/dashboard');

		} catch (error) {
			console.error('Error en el registro:', error);
		}
	}

	return (
		<div className="p-8 m-auto">
			<h2>Registro</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<input
					type="text"
					placeholder="Jhon"
					{...register('firstName', { required: true })}
				/>
				<br />
				<br />
				<input
					type="text"
					placeholder="Doe"
					{...register('lastName', { required: true })}
				/>
				<br />
				<br />
				<input
					type="email"
					placeholder="ejemplo@example.com"
					{...register('email', { required: true })}
				/>
				<br />
				<br />
				<input
					type="password"
					placeholder="***************"
					{...register('password', { required: true })}
				/>
				<br />
				<br />
				<input
					type="text"
					placeholder="Calle Falsa 123, Ciudad, País"
					{...register('address', { required: true })}
				/>
				<br />
				<br />
				<input
					type="text"
					placeholder="+1234567890"
					{...register('phoneNumber', { required: true })}
				/>
				<br />
				<br />
				<button type="submit">Registrarse</button>
			</form>
		</div>
	);
};