import { Activity, Calendar, CheckCircle, Heart } from "lucide-react";

import type { Stats } from '../types/dashboard';

export const getDisplayStats = (stats: Stats) => [
	{
		id: 1,
		title: 'Mascotas Activas',
		value: stats.activePets,
		change: stats.activePetsChange,
		icon: Heart,
		color: 'orange',
		description: 'Total de mascotas registradas',
	},
	{
		id: 2,
		title: 'Citas Programadas',
		value: stats.scheduledAppointments,
		change: stats.scheduledAppointmentsChange,
		icon: Calendar,
		color: 'teal',
		description: 'Próximas citas veterinarias',
	},
	{
		id: 3,
		title: 'Vacunas al Día',
		value: stats.vaccinesUpToDate,
		change: stats.vaccinesChange,
		icon: Activity,
		color: 'blue',
		description: 'Mascotas con vacunación completa',
	},
	{
		id: 4,
		title: 'Recordatorios',
		value: stats.pendingReminders,
		change: stats.pendingRemindersChange,
		icon: CheckCircle,
		color: 'green',
		description: 'Tareas pendientes por completar',
	},
];
