// src/components/dashboard/FindSittersView.tsx

import { Clock, Filter, Heart, MapPin, MessageCircle, Phone, Search, Star, ThumbsUp, Users } from 'lucide-react';

import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { useState } from 'react';

interface Caregiver {
    id: string;
    name: string;
    specialty: string;
    image: string;
    rating: number;
    totalServices: number;
    lastService: string;
    pets: string[];
    isAvailable: boolean;
    hourlyRate?: number;
    distance?: string;
    bio?: string;
    nextAvailable?: string;
    specialties?: string[];
}

export function FindSittersView() {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const caregivers: Caregiver[] = [
        {
            id: '1',
            name: 'Sofia Martínez',
            specialty: 'Paseadora Profesional',
            image: 'https://images.unsplash.com/photo-1672477669749-92b77e03f632?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBzaXR0ZXIlMjBkb2clMjB3YWxrZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTcyNzM5ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.9,
            totalServices: 12,
            lastService: 'Hace 3 días',
            pets: ['Max', 'Luna'],
            isAvailable: true,
            hourlyRate: 25,
            distance: '1.2 km',
            specialties: ['Paseo', 'Ejercicio', 'Socialización'],
            bio: 'Especialista en razas grandes con 3 años de experiencia. Me encanta ayudar a que los perros se mantengan activos y felices.',
            nextAvailable: 'Hoy a las 2:00 PM'
        },
        {
            id: '2',
            name: 'Carlos Rodríguez',
            specialty: 'Cuidador de Gatos',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
            rating: 4.7,
            totalServices: 8,
            lastService: 'Hace 1 semana',
            pets: ['Whiskers', 'Shadow'],
            isAvailable: true,
            hourlyRate: 22,
            distance: '2.5 km',
            specialties: ['Cuidado nocturno', 'Medicación', 'Compañía'],
            bio: 'Especializado en el cuidado de felinos con necesidades especiales. 2 años de experiencia.',
            nextAvailable: 'Mañana a las 9:00 AM'
        },
        {
            id: '3',
            name: 'Ana López',
            specialty: 'Veterinaria & Cuidadora',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
            rating: 5.0,
            totalServices: 25,
            lastService: 'Ayer',
            pets: ['Buddy', 'Coco', 'Rex'],
            isAvailable: false,
            hourlyRate: 35,
            distance: '0.8 km',
            specialties: ['Cuidados médicos', 'Emergencias', 'Rehabilitación'],
            bio: 'Veterinaria con 5 años de experiencia ofreciendo cuidados profesionales a domicilio.',
            nextAvailable: 'Viernes a las 10:00 AM'
        },
        {
            id: '4',
            name: 'Miguel Torres',
            specialty: 'Entrenador Canino',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
            rating: 4.8,
            totalServices: 18,
            lastService: 'Hace 2 días',
            pets: ['Zeus', 'Bella'],
            isAvailable: true,
            hourlyRate: 30,
            distance: '3.1 km',
            specialties: ['Entrenamiento', 'Comportamiento', 'Obediencia'],
            bio: 'Entrenador certificado especializado en modificación de comportamiento y obediencia básica.',
            nextAvailable: 'Hoy a las 4:00 PM'
        }
    ];

    const filteredCaregivers = caregivers.filter(caregiver => {
        const matchesSearch = caregiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             caregiver.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (selectedFilter === 'available') return caregiver.isAvailable && matchesSearch;
        if (selectedFilter === 'nearby') return parseFloat(caregiver.distance || '0') <= 2 && matchesSearch;
        if (selectedFilter === 'top-rated') return caregiver.rating >= 4.8 && matchesSearch;
        
        return matchesSearch;
    });

    const availableCount = caregivers.filter(c => c.isAvailable).length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Encuentra tu Cuidador Ideal</h1>
                        <p className="text-orange-100 text-lg">
                            Conecta con cuidadores de confianza cerca de ti
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-6 h-6" />
                            <span className="text-2xl font-bold">{caregivers.length}</span>
                        </div>
                        <p className="text-orange-100">Cuidadores registrados</p>
                        <p className="text-sm text-orange-200 mt-1">
                            <span className="font-semibold">{availableCount}</span> disponibles ahora
                        </p>
                    </div>
                </div>
            </div>

            {/* Filtros y Búsqueda */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Barra de búsqueda */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o especialidad..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>
                    
                    {/* Filtros */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedFilter('all')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                selectedFilter === 'all'
                                    ? 'bg-orange-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setSelectedFilter('available')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                selectedFilter === 'available'
                                    ? 'bg-green-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Disponibles
                        </button>
                        <button
                            onClick={() => setSelectedFilter('nearby')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                selectedFilter === 'nearby'
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Cercanos
                        </button>
                        <button
                            onClick={() => setSelectedFilter('top-rated')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                selectedFilter === 'top-rated'
                                    ? 'bg-yellow-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Mejor Valorados
                        </button>
                    </div>
                </div>
                
                {/* Resultados */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                    <span>
                        Mostrando {filteredCaregivers.length} de {caregivers.length} cuidadores
                    </span>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <span>Ordenar por relevancia</span>
                    </div>
                </div>
            </div>

            {/* Grid de Cuidadores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCaregivers.map((caregiver) => (
                    <div key={caregiver.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-start gap-4">
                            {/* Avatar con indicador */}
                            <div className="relative flex-shrink-0">
                                <ImageWithFallback
                                    src={caregiver.image}
                                    alt={caregiver.name}
                                    className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-100"
                                />
                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${
                                    caregiver.isAvailable ? 'bg-green-500' : 'bg-gray-400'
                                } rounded-full border-2 border-white flex items-center justify-center`}>
                                    {caregiver.isAvailable ? (
                                        <ThumbsUp className="w-3 h-3 text-white" />
                                    ) : (
                                        <Clock className="w-3 h-3 text-white" />
                                    )}
                                </div>
                            </div>

                            {/* Información principal */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{caregiver.name}</h3>
                                        <p className="text-orange-600 font-medium">{caregiver.specialty}</p>
                                    </div>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                                    </button>
                                </div>

                                {/* Métricas */}
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                                        <span className="font-medium text-gray-900">{caregiver.rating}</span>
                                        <span className="text-gray-500">({caregiver.totalServices})</span>
                                    </div>
                                    {caregiver.distance && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{caregiver.distance}</span>
                                        </div>
                                    )}
                                    {caregiver.hourlyRate && (
                                        <div className="font-semibold text-gray-900">
                                            ${caregiver.hourlyRate}/hora
                                        </div>
                                    )}
                                </div>

                                {/* Bio */}
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{caregiver.bio}</p>

                                {/* Especialidades */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {caregiver.specialties?.slice(0, 3).map((specialty, idx) => (
                                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                                            {specialty}
                                        </span>
                                    ))}
                                </div>

                                {/* Mascotas atendidas */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-sm text-gray-500">Últimas mascotas:</span>
                                    <div className="flex gap-1">
                                        {caregiver.pets.slice(0, 2).map((petName, idx) => (
                                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                {petName}
                                            </span>
                                        ))}
                                        {caregiver.pets.length > 2 && (
                                            <span className="text-xs text-gray-500">+{caregiver.pets.length - 2}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Disponibilidad */}
                                <div className="mb-4">
                                    {caregiver.isAvailable ? (
                                        <p className="text-sm text-green-600 font-medium">
                                            ✓ Disponible {caregiver.nextAvailable}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Próxima disponibilidad: {caregiver.nextAvailable}
                                        </p>
                                    )}
                                </div>

                                {/* Botones de acción */}
                                <div className="flex gap-3">
                                    <button 
                                        className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-all ${
                                            caregiver.isAvailable 
                                                ? 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg' 
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        disabled={!caregiver.isAvailable}
                                    >
                                        {caregiver.isAvailable ? 'Contratar Ahora' : 'No Disponible'}
                                    </button>
                                    <button className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                                        <MessageCircle className="w-4 h-4" />
                                    </button>
                                    <button className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Estado vacío */}
            {filteredCaregivers.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                    <div className="max-w-md mx-auto">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No se encontraron cuidadores
                        </h3>
                        <p className="text-gray-600 mb-6">
                            No hay cuidadores que coincidan con tu búsqueda. 
                            Prueba con diferentes filtros o términos de búsqueda.
                        </p>
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedFilter('all');
                            }}
                            className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}