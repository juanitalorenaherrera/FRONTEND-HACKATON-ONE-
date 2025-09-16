// features/sitters/components/SitterSearchBar.tsx

import { Clock, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { SearchSuggestion, useSitterSearch } from '../../../services/sitterSearchService';

import { cn } from '../../../lib/utils';
import { useDebounce } from '../../../hooks/useDebounce';
import { useSittersContext } from '../context/SittersContext';

interface SitterSearchBarProps {
  placeholder?: string;
  className?: string;
  showRecentSearches?: boolean;
  autoFocus?: boolean;
}

export function SitterSearchBar({ 
  placeholder = "Buscar cuidadores...", 
  className = "",
  showRecentSearches = true,
  autoFocus = false
}: SitterSearchBarProps) {
  // 1. Contexto y servicios
  const { state, actions } = useSittersContext();
  const { 
    getSuggestions, 
    saveRecentSearch, 
    getRecentSearchSuggestions,
    clearRecentSearches 
  } = useSitterSearch();

  // 2. Estado local
  const [inputValue, setInputValue] = useState(state.filters.searchTerm || '');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  // 3. Referencias y hooks
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedValue = useDebounce(inputValue, 300);

  // 4. Auto focus si está habilitado
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // 5. Actualizar filtro global cuando cambia el valor debounced
  useEffect(() => {
    actions.updateFilter({ searchTerm: debouncedValue });
  }, [debouncedValue, actions]);

  // 6. Obtener sugerencias del servicio
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedValue.length < 2) {
        setSuggestions([]);
        setShowRecent(showRecentSearches && inputValue.length === 0);
        return;
      }

      setIsLoadingSuggestions(true);
      setShowRecent(false);
      
      try {
        const result = await getSuggestions(debouncedValue);
        setSuggestions(result);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue, getSuggestions, showRecentSearches, inputValue.length]);

  // 7. Manejar clicks fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowRecent(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 8. Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length === 0 && showRecentSearches) {
      setShowRecent(true);
      setSuggestions([]);
    } else {
      setShowRecent(false);
    }
  };

  // 9. Manejar focus del input
  const handleInputFocus = () => {
    setIsOpen(true);
    if (inputValue.length === 0 && showRecentSearches) {
      setShowRecent(true);
    }
  };

  // 10. Manejar click en sugerencia
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setInputValue(suggestion.value);
    actions.updateFilter({ searchTerm: suggestion.value });
    saveRecentSearch(suggestion.value);
    setIsOpen(false);
    setShowRecent(false);
    
    // Hacer blur del input
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // 11. Limpiar búsqueda
  const handleClearInput = () => {
    setInputValue('');
    actions.updateFilter({ searchTerm: '' });
    setShowRecent(showRecentSearches);
    setSuggestions([]);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 12. Limpiar búsquedas recientes
  const handleClearRecent = () => {
    clearRecentSearches();
    setShowRecent(false);
  };

  // 13. Manejar teclas
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setShowRecent(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  // 14. Obtener sugerencias a mostrar
  const getSuggestionsToShow = (): SearchSuggestion[] => {
    if (showRecent && showRecentSearches) {
      return getRecentSearchSuggestions();
    }
    return suggestions;
  };

  const suggestionsToShow = getSuggestionsToShow();
  const hasContent = suggestionsToShow.length > 0 || isLoadingSuggestions || showRecent;

  return (
    <div className={cn('relative', className)} ref={searchRef}>
      {/* Input principal */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
        />
        
        {/* Botón para limpiar */}
        {inputValue.length > 0 && (
          <button
            onClick={handleClearInput}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown de sugerencias */}
      {isOpen && hasContent && (
        <div className="absolute top-full w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
          {/* Header para búsquedas recientes */}
          {showRecent && (
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Búsquedas recientes</span>
              </div>
              {getRecentSearchSuggestions().length > 0 && (
                <button
                  onClick={handleClearRecent}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                >
                  Limpiar
                </button>
              )}
            </div>
          )}

          {/* Loading state */}
          {isLoadingSuggestions && (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
                <span>Buscando...</span>
              </div>
            </div>
          )}

          {/* Lista de sugerencias */}
          {!isLoadingSuggestions && suggestionsToShow.length > 0 && (
            <div className="py-2">
              {suggestionsToShow.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={`${suggestion.type}-${suggestion.value}-${index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-orange-50 focus:bg-orange-50 flex items-center gap-3 transition-colors duration-150 group"
                  >
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {suggestion.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Estado vacío para búsquedas recientes */}
          {showRecent && getRecentSearchSuggestions().length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">
              No hay búsquedas recientes
            </div>
          )}

          {/* Estado vacío para sugerencias */}
          {!isLoadingSuggestions && !showRecent && suggestionsToShow.length === 0 && debouncedValue.length >= 2 && (
            <div className="p-4 text-center text-sm text-gray-500">
              No se encontraron sugerencias
            </div>
          )}
        </div>
      )}
    </div>
  );
}