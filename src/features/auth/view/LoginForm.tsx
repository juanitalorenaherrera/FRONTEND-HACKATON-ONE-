import React from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { loginSchema, type LoginFormData } from '../lib/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useLogin';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import RegisterLink from './RegisterLink';

export default function LoginForm(): React.ReactElement {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});
	const { handleLogin, error, isLoading } = useLogin();
	const [showPassword, setShowPassword] = useState(false);

	return (
		<form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
			{/* Email Field */}
			<div className="space-y-2">
				<label className="text-sm font-semibold text-gray-700 block">
					Correo electrónico
				</label>
				<div className="relative group">
					<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
					<input
						type="email"
						placeholder="tu@correo.com"
						className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 text-gray-900 placeholder-gray-400 ${
							errors.email
								? 'border-red-500 focus:border-red-500'
								: 'border-gray-200 focus:border-orange-500'
						}`}
						{...register('email')}
					/>
					{errors.email && (
						<p className="text-red-500 text-sm mt-1">
							{errors.email.message}
						</p>
					)}
				</div>
			</div>

			{/* Password Field */}
			<div className="space-y-2">
				<label className="text-sm font-semibold text-gray-700 block">
					Contraseña
				</label>
				<div className="relative group">
					<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
					<input
						type={showPassword ? 'text' : 'password'}
						placeholder="••••••••"
						className={`w-full pl-12 pr-12 py-4 bg-white border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 text-gray-900 placeholder-gray-400 ${
							errors.password
								? 'border-red-500 focus:border-red-500'
								: 'border-gray-200 focus:border-orange-500'
						}`}
						{...register('password')}
						{...(errors.password && (
							<p className="text-red-500 text-sm mt-1">
								{errors.password.message}
							</p>
						))}
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
					>
						{showPassword ? (
							<EyeOff className="w-5 h-5" />
						) : (
							<Eye className="w-5 h-5" />
						)}
					</button>
				</div>
				{errors.password && (
					<p className="text-red-500 text-sm mt-1">
						{errors.password.message}
					</p>
				)}
			</div>

			{/* Error Message */}
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
					<div className="w-2 h-2 bg-red-500 rounded-full"></div>
					<span className="text-sm font-medium">{error}</span>
				</div>
			)}

			{/* Forgot Password Link */}
			<div className="flex justify-end">
				<button
					type="button"
					className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-colors"
				>
					¿Olvidaste tu contraseña?
				</button>
			</div>

			{/* Login Button */}
			<button
				type="submit"
				disabled={isLoading}
				className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-300 disabled:to-orange-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group"
			>
				{isLoading ? (
					<>
						<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
						Iniciando sesión...
					</>
				) : (
					<>
						Iniciar Sesión
						<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
					</>
				)}
			</button>

			{/* Register Link */}
			<RegisterLink />
		</form>
	);
}
