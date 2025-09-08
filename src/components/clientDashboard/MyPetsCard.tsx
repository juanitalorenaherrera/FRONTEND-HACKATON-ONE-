import { Heart, MoreVertical, Plus } from 'lucide-react'

import { ImageWithFallback } from '../ui/ImageWithFallback'

const pets = [
    {
        id: 1,
        name: 'Max',
        breed: 'Golden Retriever',
        age: '3 años',
        image: 'https://images.unsplash.com/photo-1670434756714-536449208d9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBwZXR8ZW58MXx8fHwxNzU3MDU1MzY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        favorite: true
    },
    {
        id: 2,
        name: 'Luna',
        breed: 'Yorkshire Terrier',
        age: '2 años',
        image: 'https://images.unsplash.com/photo-1719153407864-aaa647402f01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGRvZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzA1NTM2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        favorite: false
    },
    {
        id: 3,
        name: 'Toby',
        breed: 'Bulldog Francés',
        age: '4 años',
        image: 'https://images.unsplash.com/photo-1718211874808-2add3132b725?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWxsZG9nJTIwcGV0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU3MDU1MzY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        favorite: true
    },
    {
        id: 4,
        name: 'Bella',
        breed: 'Pastor Alemán',
        age: '5 años',
        image: 'https://images.unsplash.com/photo-1747045170511-9f0f4f3859e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZG9nJTIwcG9ydHJhaXQlMjBwZXR8ZW58MXx8fHwxNzU3MDU1MzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        favorite: false
    }
]

interface MyPetsCardProps {
    onPetSelect?: (petId: string) => void
}

export function MyPetsCard({ onPetSelect }: MyPetsCardProps) {
    return (
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Mis Mascotas</h3>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200">
            <Plus className="w-4 h-4" />
            <span className="font-medium">Agregar</span>
            </button>
        </div>

        {/* Pets Grid - 2x2 Layout */}
        <div className="grid grid-cols-2 gap-6">
            {pets.map((pet) => (
            <div 
                key={pet.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
                style={{ borderRadius: '16px' }}
            >
                {/* Pet Avatar - Centered */}
                <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                    <ImageWithFallback
                    src={pet.image}
                    alt={pet.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    {pet.favorite && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <Heart className="w-3 h-3 text-white fill-current" />
                    </div>
                    )}
                </div>
                
                <div className="space-y-2">
                    <h4 className="text-lg font-bold text-gray-900">{pet.name}</h4>
                    <div className="space-y-1">
                    <p className="text-sm text-gray-600">{pet.breed}</p>
                    <p className="text-sm text-gray-500">{pet.age}</p>
                    </div>
                </div>
                </div>

                {/* Quick Actions - Bottom */}
                <div className="flex justify-center mt-4 pt-4 border-t border-gray-100">
                <button 
                    onClick={() => onPetSelect && onPetSelect(pet.id)}
                    className="flex items-center gap-1 px-3 py-1 text-xs text-orange-600 hover:bg-orange-50 rounded-md transition-colors duration-200"
                >
                    <MoreVertical className="w-3 h-3" />
                    Ver más
                </button>
                </div>
            </div>
            ))}
        </div>
        </div>
    )
}