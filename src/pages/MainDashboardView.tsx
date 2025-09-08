import { Activity, ArrowRight, Bell, Calendar, Clock, Heart, Home, MapPin, PawPrint, Phone, Plus, Scissors, Shield, Star, ThumbsUp, TrendingUp, Users, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

// Componente de imagen con fallback
const ImageWithFallback = ({ src, alt, className, fallbackSrc = 'https://via.placeholder.com/150' }) => {
  const [imgSrc, setImgSrc] = useState(src)
  
  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  )
}

// Interfaces para TypeScript (opcional pero recomendado)
interface UserProfile {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  initials: string
}

interface Appointment {
  id: number
  petName: string
  sitterName: string
  startTime: string
  status: string
  totalPrice: number
  finalized: boolean
  statusLabel: string
}

interface Pet {
  id: number
  accountId: number
  accountName: string
  name: string
  species: string
  breed: string
  age: number
  createdAt: string
  active: boolean
}

interface Sitter {
  id: number
  sitterName: string
  profileImageUrl: string | null
  hourlyRate: number
  averageRating: number
  isVerified: boolean
  location: string
}

interface Stats {
  activePets: number
  activePetsChange: string
  scheduledAppointments: number
  scheduledAppointmentsChange: string
  vaccinesUpToDate: string
  vaccinesChange: string
  pendingReminders: number
  pendingRemindersChange: string
}

interface DashboardData {
  userProfile: UserProfile
  nextAppointment: Appointment | null
  userPets: Pet[]
  recentSitters: Sitter[]
  stats: Stats
}

// Utilidades
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return { date: '', time: '' }
  
  const date = new Date(dateTimeString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  let dateText = ''
  if (date.toDateString() === today.toDateString()) {
    dateText = 'Hoy'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    dateText = 'Mañana'
  } else {
    dateText = date.toLocaleDateString('es-CL', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    })
  }
  
  const timeText = date.toLocaleTimeString('es-CL', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  
  return { date: dateText, time: timeText }
}

const getTimeUntilAppointment = (dateTimeString) => {
  if (!dateTimeString) return ''
  
  const appointmentTime = new Date(dateTimeString)
  const now = new Date()
  const diffMs = appointmentTime - now
  
  if (diffMs < 0) return 'Cita pasada'
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `En ${days} día${days > 1 ? 's' : ''}`
  }
  
  if (hours > 0) {
    return `En ${hours} hora${hours > 1 ? 's' : ''} y ${minutes} minuto${minutes > 1 ? 's' : ''}`
  }
  
  return `En ${minutes} minuto${minutes > 1 ? 's' : ''}`
}

const getPetImage = (species) => {
  const images = {
    'Perro': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200',
    'Gato': 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200',
    'Conejo': 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200',
    'Ave': 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=200'
  }
  return images[species] || 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=200'
}

const getStatusColor = (status) => {
  const colors = {
    'CONFIRMED': 'green',
    'PENDING': 'yellow',
    'CANCELLED': 'red',
    'COMPLETED': 'blue'
  }
  return colors[status] || 'gray'
}

// Componente Hero Banner
const HeroBanner = ({ userProfile, userPets, recentSitters }) => (
  <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-8 text-white overflow-hidden">
    <div className="absolute top-4 right-4 opacity-20 animate-pulse">
      <PawPrint className="w-24 h-24" />
    </div>
    <div className="absolute -bottom-4 -left-4 opacity-10">
      <Heart className="w-32 h-32" />
    </div>
    <div className="absolute top-1/2 right-1/4 opacity-10 animate-bounce" style={{animationDelay: '1s'}}>
      <Star className="w-8 h-8" />
    </div>

    <div className="relative z-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <PawPrint className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Hola {userProfile.firstName}
            </h1>
            <p className="text-orange-100">
              {userPets.length > 0 
                ? `¿Cómo podemos cuidar de ${userPets[0].name} hoy?`
                : '¿Cómo podemos ayudarte hoy?'}
            </p>
          </div>
        </div>
      </div>

      {/* Servicios Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="group flex items-center gap-4 p-5 bg-white/10 backdrop-blur-lg rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 hover:scale-105">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-white text-lg">Buscar Cuidador</p>
            <p className="text-sm text-orange-100 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              {recentSitters.length} disponibles
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </button>

        <button className="group flex items-center gap-4 p-5 bg-white/10 backdrop-blur-lg rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 hover:scale-105">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Home className="w-7 h-7 text-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-white text-lg">Cuidado 24/7</p>
            <p className="text-sm text-orange-100 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Seguro incluido
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </button>

        <button className="group flex items-center gap-4 p-5 bg-white/10 backdrop-blur-lg rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 hover:scale-105">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Scissors className="w-7 h-7 text-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-white text-lg">Grooming</p>
            <p className="text-sm text-orange-100 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Reserva rápida
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </div>
  </div>
)

// Componente Próxima Cita
const NextAppointmentCard = ({ nextAppointment }) => {
  if (!nextAppointment) return null

  const appointmentDateTime = formatDateTime(nextAppointment.startTime)
  const statusColor = getStatusColor(nextAppointment.status)
  const estimatedDuration = 3 // Horas estimadas por defecto

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Próxima Cita</h3>
            <p className="text-gray-600">{getTimeUntilAppointment(nextAppointment.startTime)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 bg-${statusColor}-500 rounded-full animate-pulse`}></div>
          <span className={`text-sm font-semibold text-${statusColor}-700 bg-${statusColor}-100 px-3 py-1 rounded-full`}>
            {nextAppointment.statusLabel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
              <PawPrint className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">{nextAppointment.petName}</h4>
              <p className="text-orange-600 font-medium">Cita con cuidador</p>
              <p className="text-sm text-gray-600">{nextAppointment.sitterName}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{appointmentDateTime.date} - {appointmentDateTime.time}</p>
              <p className="text-sm text-gray-600">Duración estimada: {estimatedDuration} horas</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Precio: ${nextAppointment.totalPrice}</p>
              <p className="text-sm text-gray-600">Por hora: ${(nextAppointment.totalPrice / estimatedDuration).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl">
          <Phone className="w-4 h-4" />
          <span className="font-medium">Contactar</span>
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200">
          <MapPin className="w-4 h-4" />
          <span className="font-medium">Ver Detalles</span>
        </button>
        <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">Reagendar</span>
        </button>
      </div>
    </div>
  )
}

// Componente Cuidadores Recientes
const RecentSittersSection = ({ recentSitters }) => {
  if (recentSitters.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cuidadores Recientes</h2>
          <p className="text-gray-600">Profesionales de confianza</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {recentSitters.length} disponibles
          </span>
          <button className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
            Ver todos <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {recentSitters.slice(0, 3).map((sitter) => (
          <div 
            key={sitter.id}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <ImageWithFallback
                  src={sitter.profileImageUrl || `https://ui-avatars.com/api/?name=${sitter.sitterName}&background=FFA500&color=fff`}
                  alt={sitter.sitterName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-100"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                  {sitter.isVerified ? (
                    <Shield className="w-3 h-3 text-white" />
                  ) : (
                    <Clock className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg">{sitter.sitterName}</h4>
                <p className="text-orange-600 font-medium text-sm">{sitter.location}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                  <span className="text-sm font-bold text-gray-900">{sitter.averageRating.toFixed(1)}</span>
                  {sitter.isVerified && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">
                      Verificado
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tarifa por hora:</span>
                <span className="font-bold text-gray-900">${sitter.hourlyRate}/hr</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ubicación:</span>
                <span className="font-medium text-gray-900">{sitter.location}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl">
                Contratar
              </button>
              <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200">
                <Users className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente Mis Mascotas
const MyPetsSection = ({ userPets, onPetSelect }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-gray-900">Mis Mascotas</h3>
      <span className="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
        {userPets.length}
      </span>
    </div>
    
    <div className="space-y-4">
      {userPets.map((pet) => (
        <button
          key={pet.id}
          onClick={() => onPetSelect && onPetSelect(pet.id.toString())}
          className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 text-left group"
        >
          <div className="relative">
            <ImageWithFallback
              src={getPetImage(pet.species)}
              alt={pet.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-gray-100 group-hover:border-orange-200 transition-colors"
            />
            {pet.active && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900">{pet.name}</p>
            <p className="text-sm text-gray-600">{pet.breed}</p>
            <p className="text-xs text-gray-500">{pet.age} año{pet.age !== 1 ? 's' : ''} • {pet.species}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
        </button>
      ))}
      
      {userPets.length === 0 && (
        <div className="text-center py-8">
          <PawPrint className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No tienes mascotas registradas</p>
          <button className="mt-4 text-orange-600 font-semibold hover:text-orange-700">
            Agregar mascota
          </button>
        </div>
      )}
    </div>
  </div>
)

// Componente Stats Cards
const StatsSection = ({ stats }) => {
  const isVaccinesPending = stats.vaccinesChange.includes('pendiente')
  const isRemindersUrgent = stats.pendingReminders > 0
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900">Resumen</h3>
      
      {/* Vacunas */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-gray-900">{stats.vaccinesUpToDate}</p>
            <p className="text-sm text-gray-600">Vacunas al Día</p>
          </div>
          <div className="text-right">
            {isVaccinesPending ? (
              <Bell className="w-5 h-5 text-orange-500 mb-1" />
            ) : (
              <TrendingUp className="w-5 h-5 text-green-500 mb-1" />
            )}
            <p className="text-xs text-orange-600 font-medium">{stats.vaccinesChange}</p>
          </div>
        </div>
      </div>

      {/* Recordatorios */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-gray-900">{stats.pendingReminders}</p>
            <p className="text-sm text-gray-600">Recordatorios Pendientes</p>
          </div>
          <div className="text-right">
            {isRemindersUrgent && (
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse mb-1"></div>
            )}
            <p className="text-xs text-orange-600 font-medium">{stats.pendingRemindersChange}</p>
          </div>
        </div>
      </div>

      {/* Mascotas Activas */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-gray-900">{stats.activePets}</p>
            <p className="text-sm text-gray-600">Mascotas Activas</p>
          </div>
          <div className="text-right">
            <div className="flex -space-x-1">
              <div className="w-4 h-4 bg-orange-500 rounded-full border border-white"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full border border-white"></div>
              <div className="w-4 h-4 bg-green-500 rounded-full border border-white"></div>
            </div>
            <p className="text-xs text-blue-600 font-medium mt-1">{stats.activePetsChange}</p>
          </div>
        </div>
      </div>

      {/* Citas Programadas */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-gray-900">{stats.scheduledAppointments}</p>
            <p className="text-sm text-gray-600">Citas Programadas</p>
          </div>
          <div className="text-right">
            <TrendingUp className="w-5 h-5 text-purple-500 mb-1" />
            <p className="text-xs text-purple-600 font-medium">{stats.scheduledAppointmentsChange}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente principal refactorizado
export default function MainDashboardView({ onPetSelect }) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8088/api/dashboard/main')
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error al cargar los datos</p>
          <p className="mt-2">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!dashboardData) return null

  const { userProfile, nextAppointment, userPets, recentSitters, stats } = dashboardData

  return (
    <div className="grid grid-cols-1 xl:grid-cols-10 gap-8">
      {/* Columna Principal - 70% */}
      <div className="xl:col-span-7 space-y-8">
        {/* Hero Banner */}
        <HeroBanner 
          userProfile={userProfile}
          userPets={userPets}
          recentSitters={recentSitters}
        />

        {/* Próxima Cita */}
        <NextAppointmentCard nextAppointment={nextAppointment} />

        {/* Cuidadores Recientes */}
        <RecentSittersSection recentSitters={recentSitters} />

        {/* Acciones Rápidas */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PawPrint className="w-8 h-8 text-orange-600" />
                </div>
                <span className="font-semibold text-gray-900">Nueva Mascota</span>
              </div>
            </button>

            <button className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900">Agendar Cita</span>
              </div>
            </button>

            <button className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-red-200 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8 text-red-600" />
                </div>
                <span className="font-semibold text-gray-900">Emergencia</span>
              </div>
            </button>

            <button className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
                <span className="font-semibold text-gray-900">Recordatorios</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Derecha - 30% */}
      <div className="xl:col-span-3 space-y-6">
        {/* Mis Mascotas */}
        <MyPetsSection userPets={userPets} onPetSelect={onPetSelect} />

        {/* Stats Cards */}
        <StatsSection stats={stats} />

        {/* Recomendación del Día */}
        <RecommendationBanner userPets={userPets} />

        {/* Mini Calendar */}
        <UpcomingEventsCalendar stats={stats} nextAppointment={nextAppointment} />
      </div>
    </div>
  )
}

// Componente Recomendación del Día
const RecommendationBanner = ({ userPets }) => {
  const getRecommendation = () => {
    if (userPets.length === 0) {
      return {
        title: "¡Registra tu primera mascota!",
        description: "Comienza a cuidar mejor de tu compañero peludo registrando su perfil.",
        action: "Registrar Mascota"
      }
    }

    const pet = userPets[0]
    const recommendations = [
      {
        title: `${pet.name} necesita ejercicio`,
        description: `Basado en su actividad reciente, ${pet.name} podría beneficiarse de un paseo extra hoy.`,
        action: "Buscar Paseador"
      },
      {
        title: `Hora del grooming para ${pet.name}`,
        description: `${pet.name} podría necesitar un baño y corte de uñas pronto.`,
        action: "Agendar Grooming"
      },
      {
        title: `Checkeo veterinario para ${pet.name}`,
        description: `Es importante mantener las vacunas y chequeos al día para ${pet.name}.`,
        action: "Ver Recordatorios"
      }
    ]

    return recommendations[Math.floor(Math.random() * recommendations.length)]
  }

  const recommendation = getRecommendation()

  return (
    <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 rounded-2xl p-6 text-white overflow-hidden">
      <div className="absolute top-2 right-2 opacity-20">
        <Zap className="w-16 h-16" />
      </div>
      <div className="absolute -bottom-4 -left-4 opacity-10">
        <PawPrint className="w-20 h-20" />
      </div>
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <p className="font-bold text-white">Recomendación del Día</p>
        </div>
        
        <div>
          <h4 className="font-bold text-white text-lg mb-2">{recommendation.title}</h4>
          <p className="text-blue-100 text-sm">
            {recommendation.description}
          </p>
        </div>
        
        <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/20 font-semibold">
          <span className="flex items-center justify-center gap-2">
            {recommendation.action}
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </div>
    </div>
  )
}

// Componente Mini Calendar
const UpcomingEventsCalendar = ({ stats, nextAppointment }) => {
  const getUpcomingEvents = () => {
    const events = []
    
    // Agregar próxima cita si existe
    if (nextAppointment) {
      const appointmentDate = formatDateTime(nextAppointment.startTime)
      events.push({
        id: `appointment-${nextAppointment.id}`,
        title: `Cita - ${nextAppointment.petName}`,
        subtitle: `${appointmentDate.date}, ${appointmentDate.time}`,
        icon: Calendar,
        bgColor: 'orange',
        textColor: 'orange'
      })
    }

    // Eventos de ejemplo basados en las estadísticas
    if (stats.vaccinesChange.includes('pendiente')) {
      events.push({
        id: 'vaccine-reminder',
        title: 'Recordatorio de vacuna',
        subtitle: 'Mañana, 10:30 AM',
        icon: Shield,
        bgColor: 'blue',
        textColor: 'blue'
      })
    }

    // Agregar más eventos de ejemplo
    events.push(
      {
        id: 'grooming',
        title: 'Grooming - Simba',
        subtitle: 'Miércoles, 2:00 PM',
        icon: Scissors,
        bgColor: 'green',
        textColor: 'green'
      },
      {
        id: 'walk',
        title: 'Paseo programado',
        subtitle: 'Jueves, 9:00 AM',
        icon: Users,
        bgColor: 'purple',
        textColor: 'purple'
      }
    )

    return events.slice(0, 3) // Máximo 3 eventos
  }

  const events = getUpcomingEvents()

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Próximos Eventos</h3>
        <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
          Ver calendario
        </button>
      </div>
      
      <div className="space-y-3">
        {events.map((event, index) => (
          <div 
            key={event.id} 
            className={`flex items-center gap-3 p-3 rounded-xl ${
              index === 0 
                ? `bg-${event.textColor}-50 border border-${event.textColor}-100` 
                : 'hover:bg-gray-50 transition-colors'
            }`}
          >
            <div className={`w-10 h-10 bg-${event.bgColor}-500 rounded-lg flex items-center justify-center`}>
              <event.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{event.title}</p>
              <p className="text-sm text-gray-600">{event.subtitle}</p>
            </div>
          </div>
        ))}
        
        {events.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay eventos próximos</p>
          </div>
        )}
      </div>
    </div>
  )
}