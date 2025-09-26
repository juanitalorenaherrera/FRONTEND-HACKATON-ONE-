import type { BookingFormData, ServiceOffering } from '../types/bookingTypes';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/Popover';

import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { Textarea } from '@/components/ui/Textarea';
import type { UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

// Subcomponente para la tarjeta de selección de servicio
const ServiceSelectionCard = ({
	service,
	isSelected,
	onClick,
}: {
	service: ServiceOffering;
	isSelected: boolean;
	onClick: () => void;
}) => (
	<motion.div
		onClick={onClick}
		className={cn(
			'relative group cursor-pointer rounded-2xl p-4 transition-all duration-300 border-2',
			'bg-white/40 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1',
			isSelected ? 'border-pet-orange shadow-xl' : 'border-transparent'
		)}
		whileHover={{ scale: 1.03 }}
		whileTap={{ scale: 0.98 }}
	>
		<div className="flex justify-between items-center">
			<div>
				<h4 className="font-bold text-pet-orange">
					{service.serviceType}
				</h4>
				<p className="text-sm text-neutral-600">
					{service.description}
				</p>
			</div>
			<div className="text-right">
				<p className="text-xl font-bold text-neutral-800">
					${service.price}
				</p>
				<p className="text-xs text-neutral-500">por servicio</p>
			</div>
		</div>
	</motion.div>
);

// Subcomponente para el selector de Fecha y Hora
const DateTimePicker = ({
	field,
	disabledDateCheck,
}: {
	field: any;
	disabledDateCheck: (date: Date) => boolean;
}) => {
	const selectedDate = field.value || new Date();

	const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const [hours, minutes] = e.target.value.split(':').map(Number);
		const newDate = new Date(selectedDate);
		newDate.setHours(hours, minutes);
		field.onChange(newDate);
	};

	return (
		<div className="space-y-2">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={'outline'}
						className={cn(
							'w-full justify-start text-left font-normal',
							!field.value && 'text-muted-foreground'
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{field.value ? (
							format(field.value, 'PPP', { locale: es })
						) : (
							<span>Elige una fecha</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar
						mode="single"
						selected={field.value}
						onSelect={field.onChange}
						initialFocus
						disabled={disabledDateCheck}
					/>
				</PopoverContent>
			</Popover>
			<select
				onChange={handleTimeChange}
				className="w-full p-2 border rounded-md bg-white/50"
			>
				{Array.from(
					{ length: 24 },
					(_, i) => `${String(i).padStart(2, '0')}:00`
				).map((time) => (
					<option key={time} value={time}>
						{time}
					</option>
				))}
			</select>
		</div>
	);
};

// ✨ CORRECCIÓN: Usar el tipo correcto en la props del componente
interface CreateBookingStep2Props {
	form: UseFormReturn<BookingFormData>;
	services: ServiceOffering[];
	isLoading: boolean;
}

// Componente principal del Paso 2
export const CreateBookingStep2 = ({
	form,
	services,
	isLoading,
}: CreateBookingStep2Props) => {
	const {
		control,
		formState: { errors },
	} = form;

	return (
		<motion.div
			key="step2"
			className="space-y-8"
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 50 }}
			transition={{ duration: 0.5, ease: 'easeInOut' }}
		>
			{/* --- Sección de Selección de Servicio --- */}
			<div>
				<h2 className="text-xl font-bold text-neutral-800 mb-4">
					Elige el servicio
				</h2>

				{/* ✅ LÓGICA DE RENDERIZADO FINAL Y ROBUSTA */}
				{isLoading ? (
					<div className="text-center p-4">Cargando servicios...</div>
				) : Array.isArray(services) && services.length > 0 ? (
					<Controller
						name="serviceId"
						control={control}
						render={({ field }) => (
							<div className="space-y-3">
								{services.map((service) => (
									<ServiceSelectionCard
										key={service.id}
										service={service}
										isSelected={field.value === service.id}
										onClick={() =>
											field.onChange(service.id)
										}
									/>
								))}
							</div>
						)}
					/>
				) : (
					<div className="text-center p-4 border border-dashed rounded-lg text-neutral-500">
						<p>Este cuidador no tiene servicios disponibles.</p>
					</div>
				)}
				{errors.serviceId && (
					<p className="text-red-500 mt-2">
						{errors.serviceId.message}
					</p>
				)}
			</div>

			{/* --- Selección de Fechas y Horas --- */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<h3 className="text-lg font-semibold text-neutral-800 mb-2">
						Inicio del servicio
					</h3>
					<Controller
						name="startDate"
						control={control}
						render={({ field }) => (
							<DateTimePicker
								field={field}
								disabledDateCheck={(date) => date < new Date()}
							/>
						)}
					/>
					{errors.startDate && (
						<p className="text-red-500 mt-2">
							{errors.startDate.message}
						</p>
					)}
				</div>
				<div>
					<h3 className="text-lg font-semibold text-neutral-800 mb-2">
						Fin del servicio
					</h3>
					<Controller
						name="endDate"
						control={control}
						render={({ field }) => (
							<DateTimePicker
								field={field}
								disabledDateCheck={(date) =>
									date <
									(form.watch('startDate') || new Date())
								}
							/>
						)}
					/>
					{errors.endDate && (
						<p className="text-red-500 mt-2">
							{errors.endDate.message}
						</p>
					)}
				</div>
			</div>
			{errors.root?.message && (
				<p className="text-red-500 text-center">
					{errors.root.message}
				</p>
			)}

			{/* --- Notas Adicionales --- */}
			<div>
				<h3 className="text-lg font-semibold text-neutral-800 mb-2">
					Notas para el cuidador (Opcional)
				</h3>
				<Controller
					name="additionalNotes"
					control={control}
					render={({ field }) => (
						<Textarea
							{...field}
							placeholder="Alergias, comportamiento, etc."
						/>
					)}
				/>
			</div>
		</motion.div>
	);
};
