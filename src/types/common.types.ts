// Common Types Used Across Features
export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  age: number;
  weight: number;
  gender: PetGender;
  color: string;
  description?: string;
  medicalNotes?: string;
  isVaccinated: boolean;
  isNeutered: boolean;
  imageUrl?: string;
  ownerId: string;
  status: PetStatus;
  createdAt: string;
  updatedAt: string;
}

export enum PetSpecies {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  RABBIT = 'RABBIT',
  FISH = 'FISH',
  OTHER = 'OTHER'
}

export enum PetGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum PetStatus {
  HEALTHY = 'HEALTHY',
  SICK = 'SICK',
  RECOVERING = 'RECOVERING',
  NEEDS_ATTENTION = 'NEEDS_ATTENTION'
}

export interface CreatePetDTO {
  name: string;
  species: PetSpecies;
  breed: string;
  age: number;
  weight: number;
  gender: PetGender;
  color: string;
  description?: string;
  medicalNotes?: string;
  isVaccinated: boolean;
  isNeutered: boolean;
  imageUrl?: string;
}

export interface UpdatePetDTO extends Partial<CreatePetDTO> {
  status?: PetStatus;
}

export interface Sitter {
  id: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  bio: string;
  experience: number;
  services: SitterService[];
  location: {
    city: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  pricing: {
    walkingPrice: number;
    hostingPrice: number;
    visitingPrice: number;
  };
  availability: SitterAvailability[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum SitterService {
  DOG_WALKING = 'DOG_WALKING',
  PET_HOSTING = 'PET_HOSTING',
  HOME_VISITS = 'HOME_VISITS',
  OVERNIGHT_CARE = 'OVERNIGHT_CARE',
  GROOMING = 'GROOMING',
  TRAINING = 'TRAINING'
}

export interface SitterAvailability {
  dayOfWeek: number; // 0-6, where 0 is Sunday
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface SitterFilters {
  city?: string;
  services?: SitterService[];
  minRating?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface Booking {
  id: string;
  ownerId: string;
  sitterId: string;
  petId: string;
  service: SitterService;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  status: BookingStatus;
  totalAmount: number;
  notes?: string;
  pet: Pet;
  sitter: Sitter;
  createdAt: string;
  updatedAt: string;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED'
}

export interface CreateBookingDTO {
  sitterId: string;
  petId: string;
  service: SitterService;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  bookingId: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  paymentMethodId?: string;
  booking: Booking;
  createdAt: string;
  updatedAt: string;
}

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  holderName: string;
  isDefault: boolean;
  createdAt: string;
}

export enum PaymentMethodType {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL'
}

export interface PaymentMethodDTO {
  type: PaymentMethodType;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  holderName: string;
  isDefault?: boolean;
}