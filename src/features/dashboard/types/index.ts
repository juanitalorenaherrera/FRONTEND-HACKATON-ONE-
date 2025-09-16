// Basado en los DTOs del backend: BookingInfo.java y PetSummaryResponse.java
export interface BookingInfo {
  id: string;
  sitterName: string;
  startDate: string; // Usamos string para las fechas de la API, se pueden convertir a Date
  status: string;
}

export interface PetInfo {
  id: string;
  name: string;
  breed: string;
  imageUrl?: string;
}

export interface DashboardStats {
  totalPets: number;
  totalBookings: number;
  totalSpent: number;
}

export interface MainDashboardData {
  userName: string;
  userImage?: string;
  dashboardStats: DashboardStats;
  upcomingBookings: BookingInfo[]; // <-- Tipo específico
  recentPets: PetInfo[]; // <-- Tipo específico
}