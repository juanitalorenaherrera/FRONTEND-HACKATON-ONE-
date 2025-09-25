// src/features/profile/types/index.ts

// Import the original, correct types from your central store.

import type { Profile, Role } from '@/features/auth/types/authStore';

// UserProfile is now JUST an alias for the master Profile type. No more conflicts.
export type UserProfile = Profile;
export type UserRole = Role;

// This new type represents the raw data from the API, where 'role' is a simple string.
export interface UserProfileFromAPI {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber?: string | null;
	address?: string | null;
	role: string; // The API sends a string, not an enum member.
	initials?: string;
	accountId?: number;
}

// The payload for updates remains the same.
export interface UpdateUserPayload {
	firstName: string;
	lastName: string;
	phoneNumber?: string | null;
	address?: string | null;
}
