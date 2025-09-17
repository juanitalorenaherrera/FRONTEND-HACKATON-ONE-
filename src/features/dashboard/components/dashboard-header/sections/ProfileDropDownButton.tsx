import { ChevronDown } from 'lucide-react';
import { getRoleColor } from '@/utils/dashboardHeader';
import { useAuthStore } from '@/store/AuthStore';

interface ProfileDropDownButtonProps {
	onClick: () => void;
	showProfileMenu: boolean;
}

export function ProfileDropDownButton({ onClick, showProfileMenu }: ProfileDropDownButtonProps) {

	const user = useAuthStore((state) => state.profile);
	const isLoading = useAuthStore(
			(state) => state.isAuth === false && state.profile === null
		);

	return (
		<button
			onClick={onClick}
			className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
		>
			<div
				className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(
					user?.role
				)} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}
			>
				<span className="text-white font-semibold text-sm">
					{isLoading ? '...' : user?.initials || '??'}
				</span>
			</div>
			<div className="hidden sm:block text-left">
				<p className="text-sm font-semibold text-gray-900">
					{isLoading
						? '...'
						: user
						? `${user.firstName} ${user.lastName}`
						: 'Usuario'}
				</p>
				<p className="text-xs text-gray-500 capitalize">
					{user?.role?.toLowerCase() || 'cliente'}
				</p>
			</div>
			<ChevronDown
				className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
					showProfileMenu ? 'rotate-180' : ''
				}`}
			/>
		</button>
	);
}
