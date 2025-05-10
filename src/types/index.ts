
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface UserData {
  id: string;
  userId: string;
  name: string;
  email: string;
  cardId: string;
  phoneNumber?: string;
  address?: string;
  country?: string;
  province?: string;
  city?: string;
  district?: string;
  subdistrict?: string;
  postalCode?: string;
  streetAddress?: string;
  extraInfo?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface CardData {
  id: string;
  userId: string;
  qrCode: string;
  isValid: boolean;
  createdAt: string;
  validatedAt?: string;
  validatedBy?: string;
}

export interface ProfileUpdateRequest {
  id: string;
  userId: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  changes: {
    name?: string;
    phoneNumber?: string;
    address?: string;
    country?: string;
    province?: string;
    city?: string;
    district?: string;
    subdistrict?: string;
    postalCode?: string;
    streetAddress?: string;
    extraInfo?: string;
    photoUrl?: string;
  };
  processedAt?: string;
  processedBy?: string;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  userData?: UserData;
  cardData?: CardData;
}

export type AuthFormMode = 'login' | 'register';

export interface FileUploadResult {
  url: string;
  success: boolean;
  error?: string;
}

export interface AddressData {
  country: string;
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  postalCode: string;
  streetAddress: string;
}

export interface CountryData {
  name: string;
  code: string;
  provinces: string[];
  postalCodePattern?: string;
}

export interface CityData {
  name: string;
  districts: string[];
}

export interface DistrictData {
  name: string;
  subdistricts: string[];
  postalCodes: { [key: string]: string };
}
