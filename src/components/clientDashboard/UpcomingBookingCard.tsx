import { Calendar, Clock, MapPin, Phone, Plus } from 'lucide-react'

const bookings = [
    {
        id: 1,
        petName: 'Max',
        service: 'Consulta General',
        doctor: 'Dr. Ana Rodríguez',
        date: '15 Ene',
        time: '10:30 AM',
        location: 'Clínica VetCare',
        status: 'confirmed',
        urgent: false
    },
    {
        id: 2,
        petName: 'Luna',
        service: 'Vacunación',
        doctor: 'Dr. Carlos Méndez',
        date: '18 Ene',
        time: '2:00 PM',
        location: 'Hospital Animal',
        status: 'pending',
        urgent: false
    },
    {
        id: 3,
        petName: 'Toby',
        service: 'Emergencia',
        doctor: 'Dr. Sofia López',
        date: 'Hoy',
        time: '4:30 PM',
        location: 'Urgencias VetPlus',
        status: 'urgent',
        urgent: true
    },
    {
        id: 4,
        petName: 'Bella',
        service: 'Peluquería',
        doctor: 'María Estética',
        date: '22 Ene',
        time: '11:00 AM',
        location: 'Pet Spa',
        status: 'confirmed',
        urgent: false
    }
]

const getStatusColor = (status: string) => {
    switch (status) {
        case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200'
        case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
        case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200'
        default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
}

const getStatusText = (status: string) => {
    switch (status) {
        case 'confirmed':
        return 'Confirmada'
        case 'pending':
        return 'Pendiente'
        case 'urgent':
        return 'Urgente'
        default:
        return 'Estado'
    }
}

export function UpcomingBookingCard() {
    return (
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Próximas Reservas</h3>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200">
            <Plus className="w-4 h-4" />
            <span className="font-medium">Nueva Cita</span>
            </button>
        </div>

        {/* Booking Card Container */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200" style={{ borderRadius: '16px' }}>


        {/* Bookings List */}
        <div className="space-y-4">
            {bookings.map((booking) => (
            <div 
                key={booking.id}
                className={`relative p-4 rounded-xl border transition-all duration-200 hover:shadow-sm cursor-pointer ${
                booking.urgent 
                    ? 'bg-red-50 border-red-200 shadow-sm' 
                    : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                }`}
            >
                {/* Status Badge */}
                <div className="flex items-start justify-between mb-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                </span>
                {booking.urgent && (
                    <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-red-600">Urgente</span>
                    </div>
                )}
                </div>

                {/* Main Info */}
                <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900">{booking.petName}</h4>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-sm text-gray-700 font-medium">{booking.service}</span>
                    </div>
                    <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span className="text-sm">{booking.time}</span>
                    </div>
                    <span className="font-medium text-blue-600">{booking.date}</span>
                    </div>
                </div>
                
                <p className="text-caption text-gray-600">{booking.doctor}</p>
                
                <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span className="text-caption">{booking.location}</span>
                </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                <button className="flex items-center gap-1 px-2 py-1 text-xs text-teal-600 hover:bg-teal-50 rounded-md transition-colors duration-200">
                    <Phone className="w-3 h-3" />
                    Llamar
                </button>
                <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200">
                    <MapPin className="w-3 h-3" />
                    Ubicación
                </button>
                <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200">
                    <Calendar className="w-3 h-3" />
                    Reagendar
                </button>
                </div>
            </div>
            ))}
        </div>

        {/* Footer Summary */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between text-center">
            <div>
            <p className="font-bold text-gray-900">{bookings.length}</p>
            <p className="text-caption text-gray-500">Este Mes</p>
            </div>
            <div>
            <p className="font-bold text-orange-500">2</p>
            <p className="text-caption text-gray-500">Para Hoy</p>
            </div>
            <div>
            <p className="font-bold text-teal-500">{bookings.filter(apt => apt.status === 'confirmed').length}</p>
            <p className="text-caption text-gray-500">Confirmadas</p>
            </div>
            </div>
        </div>
        </div>
    )
}