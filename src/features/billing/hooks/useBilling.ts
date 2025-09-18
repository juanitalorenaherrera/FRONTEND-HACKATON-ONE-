import * as billingService from '@/services/billingService';

import { useCallback, useEffect } from 'react';

import { toast } from 'sonner'; // Usaremos sonner para notificaciones elegantes
import { useAuthStore } from '@/store/AuthStore';
import { useBillingStore } from '@/store/billingStore';

/**
 * Hook para gestionar la lógica de negocio de la sección de facturación.
 * Se encarga de cargar datos iniciales y exponer acciones como pagar facturas.
 */
export const useBilling = () => {
    // 1. Obtiene el perfil del usuario para saber a quién pertenecen los datos
    const user = useAuthStore((state) => state.profile);

    // 2. Obtiene las acciones del store de facturación de forma eficiente
    const { 
        setData, 
        setLoading, 
        setError, 
        updateInvoice 
    } = useBillingStore.getState();

    /**
     * Carga todas las facturas y métodos de pago asociados a la cuenta del usuario.
     * Utiliza Promise.all para realizar las peticiones en paralelo y mejorar el rendimiento.
     */
    const loadBillingData = useCallback(async () => {
        // Si no tenemos el ID de la cuenta, no podemos continuar.
        if (!user?.accountId) return;
        
        setLoading(true);
        try {
            // Peticiones simultáneas para facturas y métodos de pago
            const [invoices, paymentMethods] = await Promise.all([
                billingService.getInvoicesByAccount(user.accountId),
                billingService.getPaymentMethodsByAccount(user.accountId),
            ]);
            
            // Guarda los datos en el store si todo fue exitoso
            setData({ invoices, paymentMethods });
            toast.success('Datos de facturación cargados correctamente.');

        } catch (err) {
            const message = 'Error al cargar los datos de facturación.';
            setError(message);
            toast.error(message);
        }
    }, [user?.accountId, setData, setLoading, setError]); // Dependencias estables

    /**
     * Maneja la acción de pagar una factura.
     * Muestra notificaciones de carga, éxito o error durante el proceso.
     */
    const handlePayInvoice = useCallback(async (invoiceId: number) => {
        // Creamos una promesa para que `toast.promise` la pueda seguir
        const paymentPromise = async () => {
            const updatedInvoice = await billingService.payInvoice(invoiceId);
            // Actualizamos el estado local para que el cambio sea instantáneo en la UI
            updateInvoice(updatedInvoice);
            return updatedInvoice; // Retornamos la factura para el mensaje de éxito
        };

        // `toast.promise` gestiona automáticamente los estados de la UI
        toast.promise(paymentPromise(), {
            loading: 'Procesando pago, un momento por favor...',
            success: (invoice) => `¡Factura #${invoice.id} pagada con éxito!`,
            error: 'No se pudo procesar el pago. Inténtalo de nuevo.',
        });
    }, [updateInvoice]); // Dependencia estable

    // 3. Efecto para cargar los datos cuando el componente se monta o el usuario cambia
    useEffect(() => {
        loadBillingData();
    }, [loadBillingData]);

    // 4. Retornamos las acciones que los componentes de la UI necesitarán
    return {
        handlePayInvoice,
        // En el futuro, podrías añadir y retornar más acciones como:
        // handleDeletePaymentMethod,
        // handleAddPaymentMethod,
    };
};