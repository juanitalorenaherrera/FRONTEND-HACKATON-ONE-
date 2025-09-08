import { MyPetsCard } from '../components/clientDashboard/MyPetsCard'
import { UpcomingBookingCard } from '../components/clientDashboard/UpcomingBookingCard'

interface PetsViewProps {
    onPetSelect?: (petId: string) => void
}

export function PetsView({ onPetSelect }: PetsViewProps) {
    return (
        <div className="space-y-8">
            {/* Main Layout - Side by Side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* My Pets Section - Left Side */}
                <div className="space-y-6">
                    <MyPetsCard onPetSelect={onPetSelect} />
                </div>

                {/* Upcoming Appointments Section - Right Side */}
                <div className="space-y-6">
                    <UpcomingBookingCard />
                </div>
            </div>
        </div>
    )
}