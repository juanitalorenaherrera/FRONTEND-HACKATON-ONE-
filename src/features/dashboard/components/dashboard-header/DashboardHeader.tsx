import { useState } from 'react';
import LeftSection from './sections/LeftSection';
import SearchBar from './sections/SearchBar';
import QuickActions from './sections/QuickActions';
import Notifications from './sections/Notifications';
import ProfileDropDownButton from './sections/ProfileDropDownButton';
import UserInfoHeader from './sections/UserInfoHeader';
import MenuItems from './sections/MenuItems';
import MobileSearch from './sections/MobileSearch';

export function DashboardHeader() {

	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleMenuToggle = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
			<div className="flex items-center justify-between">
				{/* Left Section */}
				<LeftSection onMenuToggle={handleMenuToggle} />

				{/* Right Section */}
				<div className="flex items-center gap-3">
					<SearchBar />
					<QuickActions />
					<Notifications />
					{/* Profile Dropdown */}
					<div className="relative">
						<ProfileDropDownButton 
							onClick={() => setShowProfileMenu(!showProfileMenu)}
							showProfileMenu={showProfileMenu}
						/>
						{/* Dropdown Menu */}
						{showProfileMenu && (
							<div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50">
								<UserInfoHeader />
								<MenuItems />
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Mobile Search - aparece solo en móviles */}
			<MobileSearch />

			{/* Click outside handler */}
			{showProfileMenu && (
				<div
					className="fixed inset-0 z-40"
					onClick={() => setShowProfileMenu(false)}
				></div>
			)}
		</header>
	);
}
