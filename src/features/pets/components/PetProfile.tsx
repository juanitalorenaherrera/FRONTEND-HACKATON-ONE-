import { Activity, AlertTriangle, ArrowLeft, Calendar, Camera, Clock, Edit, Heart, MapPin, Phone, Trash2 } from 'lucide-react'

import ImageWithFallback from '../../../components/ui/ImageWithFallback'
import { useState } from 'react'

interface PetProfileProps {
    readonly petId: string
    readonly onBack: () => void
}

export function PetProfile({ onBack }: PetProfileProps) {
    const [activeTab, setActiveTab] = useState('info')

    // Mock pet data - in a real app this would come from an API
    const pet = {
        id: '1',
        name: 'Max',
        breed: 'Golden Retriever',
        age: '3 años',
        weight: '28 kg',
        color: 'Dorado',
        chipNumber: 'GTX-456789123',
        birthDate: '15 de Enero, 2021',
        gender: 'Macho',
        image: 'https://images.unsplash.com/photo-1734966213753-1b361564bab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJ5JTIwbWVkaWNhbCUyMGhpc3Rvcnl8ZW58MXx8fHwxNzU3MDU3Mzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        allergies: ['Polen de hierba', 'Ciertos alimentos con pollo'],
        behaviorNotes: 'Muy sociable con otros perros. Le encanta jugar con pelotas. Puede mostrar ansiedad durante tormentas.',
        owner: 'María González',
        veterinarian: 'Dr. Ana Rodríguez',
        emergencyContact: '+1 (555) 123-4567'
    }

    const appointments = [
        {
        id: 1,
        date: '20 Dic 2024',
        service: 'Consulta General',
        doctor: 'Dr. Ana Rodríguez',
        status: 'Completada',
        notes: 'Examen de rutina. Todo normal. Peso estable.',
        cost: '$85'
        },
        {
        id: 2,
        date: '15 Nov 2024',
        service: 'Vacunación',
        doctor: 'Dr. Carlos Méndez',
        status: 'Completada',
        notes: 'Vacuna anual aplicada. Sin reacciones adversas.',
        cost: '$45'
        },
        {
        id: 3,
        date: '10 Sep 2024',
        service: 'Limpieza Dental',
        doctor: 'Dr. Sofia López',
        status: 'Completada',
        notes: 'Limpieza profunda realizada. Salud dental excelente.',
        cost: '$120'
        }
    ]

    const vaccinations = [
        {
        vaccine: 'Rabia',
        lastDate: '15 Nov 2024',
        nextDate: '15 Nov 2025',
        status: 'Al día'
        },
        {
        vaccine: 'Parvovirus',
        lastDate: '15 Nov 2024',
        nextDate: '15 Nov 2025',
        status: 'Al día'
        },
        {
        vaccine: 'Hepatitis',
        lastDate: '15 Nov 2024',
        nextDate: '15 Nov 2025',
        status: 'Al día'
        },
        {
        vaccine: 'Desparasitación',
        lastDate: '01 Dic 2024',
        nextDate: '01 Mar 2025',
        status: 'Próxima'
        }
    ]

    return (
        <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
            </button>
            
            <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200">
                <Edit className="w-4 h-4" />
                <span>Editar Perfil</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
                <Trash2 className="w-4 h-4" />
                <span>Eliminar</span>
            </button>
            </div>
        </div>

        {/* Profile Header Card */}
        <div 
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
            style={{ borderRadius: '12px' }}
        >
            <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Photo */}
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                <ImageWithFallback
                    src={pet.image}
                    alt={pet.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-200">
                    <Camera className="w-4 h-4" />
                </button>
                </div>
                <div className="text-center">
                <h1 className="font-bold text-gray-900">{pet.name}</h1>
                <p className="text-sm text-gray-600">{pet.breed}</p>
                </div>
            </div>

            {/* Basic Info Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                <p className="text-caption text-gray-500">Edad</p>
                <p className="font-medium text-gray-900">{pet.age}</p>
                </div>
                <div className="space-y-1">
                <p className="text-caption text-gray-500">Peso</p>
                <p className="font-medium text-gray-900">{pet.weight}</p>
                </div>
                <div className="space-y-1">
                <p className="text-caption text-gray-500">Color</p>
                <p className="font-medium text-gray-900">{pet.color}</p>
                </div>
                <div className="space-y-1">
                <p className="text-caption text-gray-500">Género</p>
                <p className="font-medium text-gray-900">{pet.gender}</p>
                </div>
                <div className="space-y-1">
                <p className="text-caption text-gray-500">Fecha de Nacimiento</p>
                <p className="font-medium text-gray-900">{pet.birthDate}</p>
                </div>
                <div className="space-y-1">
                <p className="text-caption text-gray-500">Microchip</p>
                <p className="font-medium text-gray-900 font-mono text-sm">{pet.chipNumber}</p>
                </div>
            </div>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
            {[
                { id: 'info', label: 'Información Médica', icon: Activity },
                { id: 'history', label: 'Historial de Citas', icon: Calendar },
                { id: 'vaccines', label: 'Vacunas y Desparasitación', icon: Heart }
            ].map((tab) => {
                const Icon = tab.icon
                return (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                </button>
                )
            })}
            </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
            {/* Información Médica Tab */}
            {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alergias */}
                <div 
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                style={{ borderRadius: '12px' }}
                >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">Alergias</h3>
                </div>
                <div className="space-y-2">
                    {pet.allergies.map((allergy, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{allergy}</span>
                    </div>
                    ))}
                </div>
                </div>

                {/* Notas de Comportamiento */}
                <div 
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                style={{ borderRadius: '12px' }}
                >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">Notas de Comportamiento</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{pet.behaviorNotes}</p>
                </div>

                {/* Información de Contacto */}
                <div 
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 lg:col-span-2"
                style={{ borderRadius: '12px' }}
                >
                <h3 className="font-bold text-gray-900 mb-4">Información de Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                    <p className="text-caption text-gray-500">Propietario</p>
                    <p className="font-medium text-gray-900">{pet.owner}</p>
                    </div>
                    <div className="space-y-1">
                    <p className="text-caption text-gray-500">Veterinario Principal</p>
                    <p className="font-medium text-gray-900">{pet.veterinarian}</p>
                    </div>
                    <div className="space-y-1">
                    <p className="text-caption text-gray-500">Contacto de Emergencia</p>
                    <p className="font-medium text-gray-900">{pet.emergencyContact}</p>
                    </div>
                </div>
                </div>
            </div>
            )}

            {/* Historial de Citas Tab */}
            {activeTab === 'history' && (
            <div className="space-y-4">
                {appointments.map((appointment) => (
                <div 
                    key={appointment.id}
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                    style={{ borderRadius: '12px' }}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                        <h4 className="font-bold text-gray-900">{appointment.service}</h4>
                        <p className="text-sm text-gray-600">{appointment.doctor}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 md:mt-0">
                        <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{appointment.date}</span>
                        </div>
                        <span className="font-medium text-green-600">{appointment.cost}</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        {appointment.status}
                        </span>
                    </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-700">{appointment.notes}</p>
                    </div>
                </div>
                ))}
            </div>
            )}

            {/* Vacunas y Desparasitación Tab */}
            {activeTab === 'vaccines' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vaccinations.map((vaccination, index) => (
                <div 
                    key={index}
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                    style={{ borderRadius: '12px' }}
                >
                    <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900">{vaccination.vaccine}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        vaccination.status === 'Al día' 
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-orange-100 text-orange-700 border border-orange-200'
                    }`}>
                        {vaccination.status}
                    </span>
                    </div>
                    <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Última aplicación:</span>
                        <span className="font-medium text-gray-900">{vaccination.lastDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Próxima fecha:</span>
                        <span className="font-medium text-gray-900">{vaccination.nextDate}</span>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    )
}