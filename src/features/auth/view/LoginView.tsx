import { ArrowRight, Eye, EyeOff, Lock, Mail, PawPrint } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { LoginFormData, loginSchema } from '../../../schemas/auth.Schema';

import { cn } from '../../../lib/utils';
import { motion } from 'framer-motion';
import { useAuthActions } from '../hooks/useAuthActions';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

export const LoginView = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, isLoading, error } = useAuthActions();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    handleLogin(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pet-orange/5 to-pet-teal/10 p-4 font-primary">
      {/* Elementos decorativos animados del fondo */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pet-orange/20 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pet-teal/20 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>
      
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 space-y-6 border border-white/30">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-block p-4 bg-gradient-primary rounded-2xl shadow-lg">
              <PawPrint className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-800">¡Bienvenido de vuelta!</h1>
            <p className="text-neutral-500">Inicia sesión para continuar.</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo de Email */}
            <div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-pet-orange transition-colors" />
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  className={cn(
                    "w-full pl-12 pr-4 py-3 bg-neutral-100/50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-neutral-800 placeholder-neutral-400",
                    errors.email 
                      ? "border-red-400 focus:ring-red-500/50" 
                      : "border-transparent focus:border-pet-orange focus:ring-pet-orange/50"
                  )}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1 px-1">{errors.email.message}</p>}
            </div>

            {/* Campo de Contraseña */}
            <div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-pet-orange transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={cn(
                    "w-full pl-12 pr-12 py-3 bg-neutral-100/50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-neutral-800 placeholder-neutral-400",
                     errors.password 
                       ? "border-red-400 focus:ring-red-500/50" 
                       : "border-transparent focus:border-pet-orange focus:ring-pet-orange/50"
                  )}
                  {...register('password')}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1 px-1">{errors.password.message}</p>}
            </div>
            
            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}
            
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm font-semibold text-pet-orange hover:underline">¿Olvidaste tu contraseña?</Link>
            </div>

            {/* Botón de Submit */}
            <button type="submit" disabled={isLoading} className="w-full button-primary flex items-center justify-center gap-2 group">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          {/* Link a Registro */}
          <p className="text-center text-sm text-neutral-600 pt-4 border-t border-neutral-200">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="font-bold text-pet-orange hover:underline">Regístrate gratis</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};