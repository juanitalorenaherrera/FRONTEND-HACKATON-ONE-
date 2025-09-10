// ===========================================
// hooks/useBookings.ts - Hook personalizado para reservas
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import { 
    BookingSummaryResponse, 
    BookingDetailResponse,
    getBookingStats,
    getUpcomingBookings,
    getTodayBookings,
    updateBookingStatus,
    BookingStatus 
} from '../services/bookingService';

interface UseBookingsOptions {
    autoRefresh?: boolean;
    refreshInterval?: number;
    maxUpcoming?: number;
}

interface BookingStatsData {
    totalThisMonth: number;
    todayCount: number;
    confirmedCount: number;
    upcomingBookings: BookingSummaryResponse[];
}

interface UseBookingsReturn {
    // Datos
    upcomingBookings: BookingSummaryResponse[];
    todayBookings: BookingSummaryResponse[];
    bookingStats: BookingStatsData | null;
    
    // Estados
    isLoading: boolean;
    error: string | null;
    
    // Acciones
    refetch: () => Promise<void>;
    updateStatus: (id: number, status: BookingStatus, reason?: string) => Promise<void>;
    
    // Estadísticas derivadas
    urgentBookings: BookingSummaryResponse[];
    todayUrgentCount: number;
    hasUpcomingBookings: boolean;
}

export function useBookings({
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000, // 5 minutos
    maxUpcoming = 10
}: UseBookingsOptions = {}): UseBookingsReturn {
    
    const [upcomingBookings, setUpcomingBookings] = useState<BookingSummaryResponse[]>([]);
    const [todayBookings, setTodayBookings] = useState<BookingSummaryResponse[]>([]);
    const [bookingStats, setBookingStats] = useState<BookingStatsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función principal para cargar datos
    const fetchBookings = useCallback(async () => {
        setError(null);
        
        try {
            const [stats, upcoming, today] = await Promise.all([
                getBookingStats(),
                getUpcomingBookings(maxUpcoming),
                getTodayBookings()
            ]);
            
            setBookingStats(stats);
            setUpcomingBookings(upcoming);
            setTodayBookings(today);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError(err instanceof Error ? err.message : 'Error al cargar las reservas');
        } finally {
            setIsLoading(false);
        }
    }, [maxUpcoming]);

    // Función de refetch pública
    const refetch = useCallback(async () => {
        await fetchBookings();
    }, [fetchBookings]);

    // Función para actualizar estado de reserva
    const updateStatus = useCallback(async (id: number, status: BookingStatus, reason?: string) => {
        try {
            await updateBookingStatus(id, status, reason);
            // Refrescar datos después de actualizar
            await refetch();
        } catch (err) {
            console.error('Error updating booking status:', err);
            throw new Error('No se pudo actualizar el estado de la reserva');
        }
    }, [refetch]);

    // Cargar datos iniciales
    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Auto-refresh opcional
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            if (!document.hidden) { // Solo refrescar si la página está visible
                fetchBookings();
            }
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [autoRefresh, refreshInterval, fetchBookings]);

    // Pausar auto-refresh cuando la página no está visible
    useEffect(() => {
        if (!autoRefresh) return;

        const handleVisibilityChange = () => {
            if (!document.hidden && bookingStats) {
                // Refrescar cuando la página vuelve a estar visible
                fetchBookings();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [autoRefresh, bookingStats, fetchBookings]);

    // Calcular estadísticas derivadas
    const urgentBookings = upcomingBookings.filter(booking => {
        const bookingDate = new Date(booking.startTime);
        const now = new Date();
        const hoursDiff = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        return hoursDiff <= 24 && booking.status === BookingStatus.CONFIRMED;
    });

    const todayUrgentCount = todayBookings.filter(booking => 
        booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.PENDING
    ).length;

    const hasUpcomingBookings = upcomingBookings.length > 0;

    return {
        // Datos
        upcomingBookings,
        todayBookings,
        bookingStats,
        
        // Estados
        isLoading,
        error,
        
        // Acciones
        refetch,
        updateStatus,
        
        // Estadísticas derivadas
        urgentBookings,
        todayUrgentCount,
        hasUpcomingBookings
    };
}