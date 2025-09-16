import { Bell, ChevronDown } from 'lucide-react';

import { useAuthStore } from '../../../store/AuthStore';

export const DashboardHeader = () => {
    const { user } = useAuthStore();
    
    return (
        <header className="bg-white/80 backdrop-blur-lg p-4 flex justify-between items-center border-b border-neutral-200">
            <div>
                {/* Podría ir un breadcrumb o título de la página actual */}
            </div>
            <div className="flex items-center gap-4">
                <button className="relative text-neutral-500 hover:text-pet-orange transition-colors">
                    <Bell size={24} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <div className="flex items-center gap-3 cursor-pointer">
                    <img 
                        src={user?.imageUrl || 'https://via.placeholder.com/40'} 
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-semibold text-neutral-800">{user?.name}</p>
                        <p className="text-sm text-neutral-500">{user?.role}</p>
                    </div>
                    <ChevronDown size={20} className="text-neutral-400" />
                </div>
            </div>
        </header>
    );
};