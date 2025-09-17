import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useSittersContext } from '@/features/sitters/hooks/useSittersContext';
import { useDebounce } from '@/hooks/useDebounce';
import { getSitterSuggestions } from '@/services/suggestionService';
import { cn } from '@/lib/utils'; 

// El tipo ahora vive aquí, junto al componente que lo usa.
export interface SearchSuggestion {
    type: string;
    value: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

export function SitterSearchBar({ placeholder = "Buscar cuidadores...", className = "" }) {
    // 1. Conexión al contexto para obtener el estado global y las acciones.
    const { state, actions } = useSittersContext();

    // 2. Estado local para el valor del input. Esto permite una escritura fluida sin actualizar el estado global en cada tecleo.
    const [inputValue, setInputValue] = useState(state.filters.searchTerm || '');
    
    // 3. Estado local para las sugerencias y su carga.
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    const searchRef = useRef<HTMLDivElement>(null);
    const debouncedValue = useDebounce(inputValue, 300);

    // 4. Efecto para actualizar el filtro GLOBAL cuando el valor "debounced" cambia.
    useEffect(() => {
        actions.updateFilter({ searchTerm: debouncedValue });
    }, [debouncedValue, actions]);

    // 5. Efecto para obtener sugerencias desde el servicio.
    useEffect(() => {
        if (debouncedValue.length < 2) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setIsLoadingSuggestions(true);
            const result = await getSitterSuggestions(debouncedValue);
            setSuggestions(result);
            setIsLoadingSuggestions(false);
        };

        fetchSuggestions();
    }, [debouncedValue]);

    // Click outside handler (sin cambios)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
        setInputValue(suggestion.value); // Actualiza el input local
        actions.updateFilter({ searchTerm: suggestion.value }); // Actualiza el filtro global inmediatamente
        setIsOpen(false);
    };

    return (
        <div className={cn('relative', className)} ref={searchRef}>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                />
            </div>

            {isOpen && (suggestions.length > 0 || isLoadingSuggestions) && (
                <div className="absolute top-full w-full mt-1 bg-white border rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                    {isLoadingSuggestions ? (
                        <div className="p-4 text-center text-sm text-gray-500">Buscando...</div>
                    ) : (
                        suggestions.map((suggestion, index) => {
                            const Icon = suggestion.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                                >
                                    <Icon className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-700">{suggestion.label}</span>
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}