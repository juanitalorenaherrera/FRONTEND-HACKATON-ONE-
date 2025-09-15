// src/services/sitterSearchService.ts

import {
  Calendar,
  Clock,
  DollarSign,
  Heart,
  MapPin,
  Search,
  Star,
  User
} from 'lucide-react';

// Tipos e interfaces
export interface SearchSuggestion {
  type: 'location' | 'name' | 'service' | 'rating' | 'price' | 'availability' | 'recent';
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  metadata?: {
    rating?: number;
    priceRange?: string;
    availability?: boolean;
    distance?: number;
  };
}

export interface SitterSearchFilters {
  searchTerm: string;
  location?: string;
  serviceType?: string;
  minRating?: number;
  maxPrice?: number;
  availability?: string[];
  petTypes?: string[];
}

export interface SitterSearchResult {
  id: number;
  name: string;
  location: string;
  rating: number;
  pricePerHour: number;
  services: string[];
  availability: string[];
  profileImage?: string;
  verified: boolean;
  responseTime: string;
  petTypes: string[];
}

export interface SearchResponse {
  results: SitterSearchResult[];
  totalCount: number;
  filters: {
    locations: string[];
    services: string[];
    priceRanges: { min: number; max: number; label: string }[];
  };
}

class SitterSearchService {
  private readonly API_BASE_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000/api/sitters' 
    : '/api/sitters';
  
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  private cache = new Map<string, { data: any; timestamp: number }>();

  /**
   * Obtiene sugerencias de búsqueda con cache
   */
  async getSuggestions(query: string, options?: { includeRecent?: boolean }): Promise<SearchSuggestion[]> {
    if (query.length < 2) {
      return options?.includeRecent ? this.getRecentSearchSuggestions() : [];
    }

    const cacheKey = `suggestions_${query}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.API_BASE_URL}/suggestions?q=${encodeURIComponent(query)}&limit=8`,
        { timeout: 5000 }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const suggestions = this.transformSuggestions(data.suggestions || []);
      
      // Guardar en cache
      this.setCache(cacheKey, suggestions);
      
      return suggestions;
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      return this.getMockSuggestions(query);
    }
  }

  /**
   * Búsqueda principal de sitters con paginación
   */
  async searchSitters(
    filters: SitterSearchFilters, 
    options?: { page?: number; limit?: number; sortBy?: string }
  ): Promise<SearchResponse> {
    try {
      const params = new URLSearchParams();
      
      // Agregar filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, String(value));
          }
        }
      });

      // Agregar opciones de paginación
      if (options?.page) params.append('page', String(options.page));
      if (options?.limit) params.append('limit', String(options.limit));
      if (options?.sortBy) params.append('sortBy', options.sortBy);

      const response = await this.fetchWithTimeout(
        `${this.API_BASE_URL}/search?${params.toString()}`,
        { timeout: 10000 }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Guardar término de búsqueda si es exitoso
      if (filters.searchTerm && data.results?.length > 0) {
        this.saveRecentSearch(filters.searchTerm);
      }

      return data;
    } catch (error) {
      console.error('Error searching sitters:', error);
      throw new Error('Error al buscar cuidadores. Inténtalo de nuevo.');
    }
  }

  /**
   * Obtiene un sitter específico por ID
   */
  async getSitterById(id: number): Promise<SitterSearchResult | null> {
    try {
      const response = await this.fetchWithTimeout(
        `${this.API_BASE_URL}/${id}`,
        { timeout: 5000 }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching sitter:', error);
      throw error;
    }
  }

  /**
   * Obtiene ubicaciones populares
   */
  async getPopularLocations(): Promise<SearchSuggestion[]> {
    const cacheKey = 'popular_locations';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.API_BASE_URL}/popular-locations`,
        { timeout: 5000 }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const locations = data.locations.map((location: string) => ({
        type: 'location' as const,
        value: location,
        label: location,
        icon: MapPin
      }));

      this.setCache(cacheKey, locations);
      return locations;
    } catch (error) {
      console.error('Error fetching popular locations:', error);
      return this.getMockLocations();
    }
  }

  /**
   * Obtiene filtros disponibles para refinar búsquedas
   */
  async getAvailableFilters(): Promise<{
    locations: string[];
    services: string[];
    petTypes: string[];
    priceRanges: { min: number; max: number; label: string }[];
  }> {
    const cacheKey = 'available_filters';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.API_BASE_URL}/filters`,
        { timeout: 5000 }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching filters:', error);
      return this.getMockFilters();
    }
  }

  // --- Métodos para búsquedas recientes ---

  /**
   * Guarda una búsqueda reciente
   */
  saveRecentSearch(searchTerm: string): void {
    if (!searchTerm || searchTerm.length < 2) return;

    try {
      const recent = this.getRecentSearches();
      const updated = [
        searchTerm.trim(),
        ...recent.filter(term => term.toLowerCase() !== searchTerm.toLowerCase())
      ].slice(0, 8); // Mantener solo los últimos 8

      localStorage.setItem('sitter_recent_searches', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  }

  /**
   * Obtiene búsquedas recientes
   */
  getRecentSearches(): string[] {
    try {
      const recent = localStorage.getItem('sitter_recent_searches');
      return recent ? JSON.parse(recent) : [];
    } catch (error) {
      console.error('Error getting recent searches:', error);
      return [];
    }
  }

  /**
   * Obtiene sugerencias de búsquedas recientes
   */
  getRecentSearchSuggestions(): SearchSuggestion[] {
    const recent = this.getRecentSearches();
    
    return recent.map(term => ({
      type: 'recent' as const,
      value: term,
      label: term,
      icon: Clock
    }));
  }

  /**
   * Limpia búsquedas recientes
   */
  clearRecentSearches(): void {
    try {
      localStorage.removeItem('sitter_recent_searches');
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }

  // --- Métodos privados ---

  /**
   * Fetch con timeout personalizado
   */
  private async fetchWithTimeout(url: string, options: { timeout: number }): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Sistema de cache simple
   */
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Transforma sugerencias del API
   */
  private transformSuggestions(apiSuggestions: any[]): SearchSuggestion[] {
    return apiSuggestions.map(suggestion => ({
      type: suggestion.type,
      value: suggestion.value,
      label: suggestion.label || suggestion.value,
      icon: this.getIconForType(suggestion.type),
      metadata: suggestion.metadata
    }));
  }

  /**
   * Obtiene ícono según tipo
   */
  private getIconForType(type: string): React.ComponentType<{ className?: string }> {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      location: MapPin,
      name: User,
      service: Heart,
      rating: Star,
      price: DollarSign,
      availability: Calendar,
      recent: Clock,
      default: Search
    };

    return iconMap[type] || iconMap.default;
  }

  /**
   * Datos mock para desarrollo
   */
  private getMockSuggestions(query: string): SearchSuggestion[] {
    const mockData = [
      {
        type: 'name' as const,
        value: `María ${query}`,
        label: `Cuidadora: María ${query}`,
        icon: User,
        metadata: { rating: 4.8, verified: true }
      },
      {
        type: 'location' as const,
        value: `${query} - Santiago Centro`,
        label: `Buscar en ${query}, Santiago Centro`,
        icon: MapPin
      },
      {
        type: 'service' as const,
        value: `Paseo de ${query}`,
        label: `Servicio: Paseo de ${query}`,
        icon: Heart
      },
      {
        type: 'location' as const,
        value: `${query} - Las Condes`,
        label: `Buscar en ${query}, Las Condes`,
        icon: MapPin
      }
    ];

    return mockData
      .filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6);
  }

  private getMockLocations(): SearchSuggestion[] {
    return [
      'Santiago Centro', 'Las Condes', 'Providencia', 'Ñuñoa', 
      'La Reina', 'Vitacura', 'San Miguel', 'Maipú'
    ].map(location => ({
      type: 'location' as const,
      value: location,
      label: location,
      icon: MapPin
    }));
  }

  private getMockFilters() {
    return {
      locations: ['Santiago Centro', 'Las Condes', 'Providencia', 'Ñuñoa'],
      services: ['Cuidado en casa', 'Paseos', 'Hospedaje', 'Visitas'],
      petTypes: ['Perros', 'Gatos', 'Aves', 'Otros'],
      priceRanges: [
        { min: 0, max: 5000, label: 'Hasta $5.000' },
        { min: 5000, max: 10000, label: '$5.000 - $10.000' },
        { min: 10000, max: 20000, label: '$10.000 - $20.000' },
        { min: 20000, max: 999999, label: 'Más de $20.000' }
      ]
    };
  }
}

// Instancia singleton
export const sitterSearchService = new SitterSearchService();

// Hook personalizado para usar el servicio
export const useSitterSearch = () => {
  return {
    // Búsqueda principal
    getSuggestions: (query: string, options?: { includeRecent?: boolean }) => 
      sitterSearchService.getSuggestions(query, options),
    searchSitters: (filters: SitterSearchFilters, options?: { page?: number; limit?: number; sortBy?: string }) => 
      sitterSearchService.searchSitters(filters, options),
    getSitterById: (id: number) => 
      sitterSearchService.getSitterById(id),
    
    // Filtros y metadatos
    getPopularLocations: () => 
      sitterSearchService.getPopularLocations(),
    getAvailableFilters: () => 
      sitterSearchService.getAvailableFilters(),
    
    // Búsquedas recientes
    saveRecentSearch: (term: string) => 
      sitterSearchService.saveRecentSearch(term),
    getRecentSearches: () => 
      sitterSearchService.getRecentSearches(),
    getRecentSearchSuggestions: () => 
      sitterSearchService.getRecentSearchSuggestions(),
    clearRecentSearches: () => 
      sitterSearchService.clearRecentSearches()
  };
};