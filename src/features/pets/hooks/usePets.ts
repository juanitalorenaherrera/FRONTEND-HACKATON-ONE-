// hooks/usePets.ts
import { useState, useEffect, useCallback } from 'react'
import { 
    getPetsByAccountId, 
    getActivePetsByAccountId, 
    type PetResponse 
} from '../../../services/petService'

interface UsePetsOptions {
    accountId?: number
    activeOnly?: boolean
    autoRefresh?: boolean
    refreshInterval?: number
}

interface UsePetsReturn {
    pets: PetResponse[]
    isLoading: boolean
    error: string | null
    refetch: () => Promise<void>
    isEmpty: boolean
    totalCount: number
}

export function usePets({
    accountId,
    activeOnly = true,
    autoRefresh = false,
    refreshInterval = 30000 // 30 segundos
}: UsePetsOptions = {}): UsePetsReturn {
    const [pets, setPets] = useState<PetResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPets = useCallback(async () => {
        if (!accountId) {
            setIsLoading(false)
            return
        }

        try {
            setError(null)
            const petsData = activeOnly 
                ? await getActivePetsByAccountId(accountId)
                : await getPetsByAccountId(accountId)
            
            setPets(petsData)
        } catch (err) {
            console.error('Error fetching pets:', err)
            setError(err instanceof Error ? err.message : 'Error al cargar las mascotas')
        } finally {
            setIsLoading(false)
        }
    }, [accountId, activeOnly])

    // Cargar mascotas inicialmente
    useEffect(() => {
        setIsLoading(true)
        fetchPets()
    }, [fetchPets])

    // Auto-refresh opcional
    useEffect(() => {
        if (!autoRefresh || !accountId) return

        const interval = setInterval(fetchPets, refreshInterval)
        return () => clearInterval(interval)
    }, [autoRefresh, accountId, fetchPets, refreshInterval])

    return {
        pets,
        isLoading,
        error,
        refetch: fetchPets,
        isEmpty: pets.length === 0,
        totalCount: pets.length
    }
}