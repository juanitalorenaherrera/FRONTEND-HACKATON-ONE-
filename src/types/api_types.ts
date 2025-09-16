// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

// HTTP Status Codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

// --- Mascotas (Pet) ---
// Este es el resumen que se muestra en el sidebar y en el dashboard.
export interface PetSummaryResponse {
  id: number;
  name: string;
  imageUrl?: string | null;
}

// Podríamos añadir más tipos de mascotas aquí en el futuro
// export interface Pet extends PetSummaryResponse { ... más detalles }


// --- Citas (Booking) ---
// Este tipo representa las citas próximas en el dashboard.
export interface BookingSummaryResponse {
  id: number;
  sitterName: string;
  sitterImageUrl?: string | null;
  serviceType: string; // Ej: "Paseo", "Alojamiento"
  bookingDate: string; // Usamos string para la fecha en formato ISO (ej: "2024-12-25T14:30:00")
}

// --- Estadísticas del Dashboard ---
export interface DashboardStatsDTO {
  totalPets: number;
  upcomingBookings: number;
  averageRating: number | null;
  monthlySpending: number;
}

// --- DTO Principal del Dashboard ---
// Este es el objeto completo que recibimos del endpoint /api/dashboard/{userId}
export interface MainDashboardDTO {
  userProfile: UserProfileDTO;
  stats: DashboardStatsDTO;
  pets: PetSummaryResponse[];
  upcomingBookings: BookingSummaryResponse[];
}