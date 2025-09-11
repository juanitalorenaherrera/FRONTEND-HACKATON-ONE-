// src/components/dashboard/DashboardStats.tsx

import { Activity, AlertCircle, Calendar, CheckCircle, Heart, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { DashboardStatsData } from '../../../types/DashboardStatsData';
import { getDashboardStats } from '../../../services/dashboardService';

export function DashboardStats() {
    const [stats, setStats] = useState<DashboardStatsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
                setError("No se pudieron cargar las estadísticas.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const getTrendIcon = (change: string) => {
        if (change.includes('+')) return TrendingUp;
        if (change.includes('-')) return TrendingDown;
        return Minus;
    };

    const getTrendColor = (change: string) => {
        if (change.includes('+')) return 'text-green-600 bg-green-100';
        if (change.includes('-')) return 'text-red-600 bg-red-100';
        return 'text-gray-600 bg-gray-100';
    };

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'orange':
                return {
                    bg: 'bg-gradient-to-br from-orange-100 to-orange-200',
                    icon: 'text-orange-600',
                    border: 'border-orange-200',
                    hover: 'hover:border-orange-300 hover:shadow-orange-100'
                };
            case 'teal':
                return {
                    bg: 'bg-gradient-to-br from-teal-100 to-teal-200',
                    icon: 'text-teal-600',
                    border: 'border-teal-200',
                    hover: 'hover:border-teal-300 hover:shadow-teal-100'
                };
            case 'blue':
                return {
                    bg: 'bg-gradient-to-br from-blue-100 to-blue-200',
                    icon: 'text-blue-600',
                    border: 'border-blue-200',
                    hover: 'hover:border-blue-300 hover:shadow-blue-100'
                };
            case 'green':
                return {
                    bg: 'bg-gradient-to-br from-green-100 to-green-200',
                    icon: 'text-green-600',
                    border: 'border-green-200',
                    hover: 'hover:border-green-300 hover:shadow-green-100'
                };
            default:
                return {
                    bg: 'bg-gradient-to-br from-gray-100 to-gray-200',
                    icon: 'text-gray-600',
                    border: 'border-gray-200',
                    hover: 'hover:border-gray-300 hover:shadow-gray-100'
                };
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                            <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-red-900">Error al cargar estadísticas</p>
                    <p className="text-red-700 text-sm">{error || "Ocurrió un error inesperado."}</p>
                </div>
            </div>
        );
    }

    const displayStats = [
        { 
            id: 1, 
            title: 'Mascotas Activas', 
            value: stats.activePets, 
            change: stats.activePetsChange, 
            icon: Heart, 
            color: 'orange',
            description: 'Total de mascotas registradas'
        },
        { 
            id: 2, 
            title: 'Citas Programadas', 
            value: stats.scheduledAppointments, 
            change: stats.scheduledAppointmentsChange, 
            icon: Calendar, 
            color: 'teal',
            description: 'Próximas citas veterinarias'
        },
        { 
            id: 3, 
            title: 'Vacunas al Día', 
            value: stats.vaccinesUpToDate, 
            change: stats.vaccinesChange, 
            icon: Activity, 
            color: 'blue',
            description: 'Mascotas con vacunación completa'
        },
        { 
            id: 4, 
            title: 'Recordatorios', 
            value: stats.pendingReminders, 
            change: stats.pendingRemindersChange, 
            icon: CheckCircle, 
            color: 'green',
            description: 'Tareas pendientes por completar'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {displayStats.map((stat, index) => {
                const Icon = stat.icon;
                const TrendIcon = getTrendIcon(stat.change);
                const trendColor = getTrendColor(stat.change);
                const colorClasses = getColorClasses(stat.color);
                
                return (
                    <div 
                        key={stat.id} 
                        className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 ${colorClasses.border} ${colorClasses.hover} transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-2xl`}
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animation: 'slideInUp 0.6s ease-out forwards'
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-14 h-14 ${colorClasses.bg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200 border ${colorClasses.border}`}>
                                <Icon className={`w-7 h-7 ${colorClasses.icon}`} />
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${trendColor} text-xs font-semibold`}>
                                <TrendIcon className="w-3 h-3" />
                                <span>{stat.change.replace(/[+-]/, '')}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                                    {stat.value}
                                </h3>
                                {stat.change.includes('+') && (
                                    <span className="text-lg text-green-600 font-semibold">↗</span>
                                )}
                                {stat.change.includes('-') && (
                                    <span className="text-lg text-red-600 font-semibold">↘</span>
                                )}
                            </div>
                            <p className="font-semibold text-gray-700 text-lg group-hover:text-gray-800 transition-colors">
                                {stat.title}
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {stat.description}
                            </p>
                        </div>

                        {/* Progress indicator */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">Estado</span>
                                <span className={`font-medium ${
                                    stat.change.includes('+') ? 'text-green-600' : 
                                    stat.change.includes('-') ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                    className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${
                                        stat.color === 'orange' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                        stat.color === 'teal' ? 'bg-gradient-to-r from-teal-500 to-teal-600' :
                                        stat.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                        'bg-gradient-to-r from-green-500 to-green-600'
                                    }`}
                                    style={{
                                        width: `${Math.min(100, Math.max(10, (parseInt(stat.value.toString()) / 10) * 100))}%`
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    </div>
                );
            })}

            <style type="text/css">
                {`
                    @keyframes slideInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </div>
    );
}