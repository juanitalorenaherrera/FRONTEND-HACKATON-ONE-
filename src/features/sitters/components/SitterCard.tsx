import React from 'react';
import { Star, MapPin, ShieldCheck } from 'lucide-react';
import type { ExtendedSitter } from '../../../services/sitterService';
import { SITTER_CONFIG } from '../../../features/sitters/config/sitters.config';

interface SitterCardProps {
    sitter: ExtendedSitter;
    onViewProfile: (sitter: ExtendedSitter) => void;
    onHire: (sitter: ExtendedSitter) => void;
}

export function SitterCard({ sitter, onViewProfile, onHire }: SitterCardProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg hover:border-orange-200 transition-all duration-300">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <img 
                    src={sitter.profileImageUrl || SITTER_CONFIG.IMAGES.DEFAULT_AVATAR} 
                    alt={sitter.sitterName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                />
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{sitter.sitterName}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {sitter.location}
                    </p>
                </div>
                {sitter.isVerified && <ShieldCheck className="w-6 h-6 text-blue-500 flex-shrink-0" title="Verificado" />}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600 border-y py-2 my-2">
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                    <span className="font-bold text-gray-800">{sitter.averageRating?.toFixed(1) || 'Nuevo'}</span>
                </div>
                <div><span className="font-bold text-gray-800">${sitter.hourlyRate}</span> / hora</div>
                <div><span className="font-bold text-gray-800">{sitter.completedBookings || 0}</span> servicios</div>
            </div>
            
            {/* Bio */}
            <p className="text-sm text-gray-600 flex-grow mb-4">
                {sitter.bio ? `"${sitter.bio.substring(0, 100)}..."` : SITTER_CONFIG.DEFAULT_TEXTS.NO_BIO}
            </p>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
                <button onClick={() => onHire(sitter)} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-semibold transition-colors">
                    Contratar
                </button>
                <button onClick={() => onViewProfile(sitter)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-colors">
                    Ver Perfil
                </button>
            </div>
        </div>
    );
}