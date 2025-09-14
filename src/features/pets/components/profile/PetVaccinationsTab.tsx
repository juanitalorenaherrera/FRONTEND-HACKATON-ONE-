// features/pets/components/profile/PetVaccinationsTab.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

import { ErrorState } from '../../../../components/ui/ErrorState';
import type { Pet } from '../../types';
import { Skeleton } from '../../../../components/ui/Skeleton';

// 1. DEFINICIÓN DE TIPOS
// Este tipo representaría un registro de vacunación que viene de la API.
interface VaccinationRecord {
    id: string;
    vaccine: string;
    lastDate: string;
    nextDate: string;
    status: 'Al día' | 'Próxima' | 'Vencida';
}

// SIMULACIÓN DEL SERVICIO
// En una aplicación real, esto estaría en `services/vaccinationService.ts`
const vaccinationService = {
    getByPetId: (petId: number): Promise<VaccinationRecord[]> => {
        console.log(`Fetching vaccinations for pet ID: ${petId}`);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 'v1', vaccine: 'Rabia', lastDate: '15 Nov 2024', nextDate: '15 Nov 2025', status: 'Al día' },
                    { id: 'v2', vaccine: 'Parvovirus', lastDate: '15 Nov 2024', nextDate: '15 Nov 2025', status: 'Al día' },
                    { id: 'v3', vaccine: 'Desparasitación Interna', lastDate: '01 Dic 2024', nextDate: '01 Mar 2025', status: 'Próxima' },
                    { id: 'v4', vaccine: 'Leucemia Felina', lastDate: '10 Ago 2023', nextDate: '10 Ago 2024', status: 'Vencida' },
                ]);
            }, 1200);
        });
    }
};

// ====================================================================
// SUB-COMPONENTE: Tarjeta individual para una vacuna
// ====================================================================
const VaccinationCard: React.FC<{ record: VaccinationRecord }> = ({ record }) => {
    const statusStyles = {
        'Al día': {
            icon: ShieldCheck,
            bgColor: 'bg-green-100',
            textColor: 'text-green-700',
            borderColor: 'border-green-200',
        },
        'Próxima': {
            icon: ShieldAlert,
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-700',
            borderColor: 'border-orange-200',
        },
        'Vencida': {
            icon: ShieldAlert,
            bgColor: 'bg-red-100',
            textColor: 'text-red-700',
            borderColor: 'border-red-200',
        }
    }[record.status];

    const Icon = statusStyles.icon;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900">{record.vaccine}</h4>
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${statusStyles.bgColor} ${statusStyles.textColor} ${statusStyles.borderColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {record.status}
                </span>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Última aplicación:</span>
                    <span className="font-medium text-gray-900">{record.lastDate}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Próxima fecha:</span>
                    <span className="font-medium text-gray-900">{record.nextDate}</span>
                </div>
            </div>
        </div>
    );
};


// ====================================================================
// COMPONENTE PRINCIPAL DE LA PESTAÑA
// ====================================================================
export function PetVaccinationsTab({ pet }: { pet: Pet }) {
    const [records, setRecords] = useState<VaccinationRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecords = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await vaccinationService.getByPetId(pet.id);
            setRecords(data);
        } catch (err) {
			setError('No se pudo cargar el historial de vacunación.')
			console.log(err);
        } finally {
            setIsLoading(false);
        }
    }, [pet.id]);

    useEffect(() => {
        fetchRecords();
    }, [pet.id, fetchRecords]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
        );
    }

    if (error) {
        return <ErrorState title="Error de Carga" message={error} onRetry={fetchRecords} />;
    }

    if (records.length === 0) {
        return <p className="text-center text-gray-500 py-8">No hay registros de vacunación para {pet.name}.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            {records.map((record) => (
                <VaccinationCard key={record.id} record={record} />
            ))}
        </div>
    );
}