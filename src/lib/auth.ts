
import { User, UserData, CardData, ProfileUpdateRequest } from "@/types";
import { toast } from "@/components/ui/sonner";

// Mock user database (in a real app, this would be in a database)
let users: User[] = [];
let userData: UserData[] = [];
let cards: CardData[] = [];
let updateRequests: ProfileUpdateRequest[] = [];

// Check if we have stored data in localStorage
const loadInitialData = () => {
  try {
    const storedUsers = localStorage.getItem('users');
    const storedUserData = localStorage.getItem('userData');
    const storedCards = localStorage.getItem('cards');
    const storedUpdateRequests = localStorage.getItem('updateRequests');
    
    if (storedUsers) users = JSON.parse(storedUsers);
    if (storedUserData) userData = JSON.parse(storedUserData);
    if (storedCards) cards = JSON.parse(storedCards);
    if (storedUpdateRequests) updateRequests = JSON.parse(storedUpdateRequests);
    
    // Create an admin user if none exists
    if (!users.some(user => user.role === 'admin')) {
      const adminUser = {
        id: 'admin-1',
        email: 'admin@gmail.com',
        name: 'Admin User',
        role: 'admin' as const
      };
      users.push(adminUser);
      saveUsers();
      
      // Add admin user data
      const adminUserData: UserData = {
        id: `data-admin-1`,
        userId: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        cardId: `card-admin-1`,
        createdAt: new Date().toISOString()
      };
      userData.push(adminUserData);
      saveUserData();
      
      // Add admin card
      const adminCard: CardData = {
        id: `card-admin-1`,
        userId: adminUser.id,
        qrCode: `admin-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
        isValid: true,
        createdAt: new Date().toISOString()
      };
      cards.push(adminCard);
      saveCards();
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

loadInitialData();

// Helper functions to save data
const saveUsers = () => localStorage.setItem('users', JSON.stringify(users));
const saveUserData = () => localStorage.setItem('userData', JSON.stringify(userData));
const saveCards = () => localStorage.setItem('cards', JSON.stringify(cards));
const saveUpdateRequests = () => localStorage.setItem('updateRequests', JSON.stringify(updateRequests));

// Authentication functions
export const login = (email: string, password: string): User | null => {
  // For this demo, we'll use a simple authentication check
  // In a real app, you'd check against hashed passwords
  
  // Special case for admin login
  if (email === 'admin@gmail.com' && password === 'Admin1@') { // Updated admin password here
    const adminUser = users.find(u => u.email === email && u.role === 'admin');
    if (adminUser) {
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return adminUser;
    }
  }
  
  const user = users.find(u => u.email === email);
  
  // In a real app, you would check the hashed password here
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  
  return null;
};

export const register = (
  email: string, 
  name: string, 
  password: string, 
  additionalData: {
    phoneNumber?: string;
    country?: string;
    province?: string;
    city?: string;
    district?: string;
    subdistrict?: string;
    postalCode?: string;
    streetAddress?: string;
    extraInfo?: string;
    photoData?: string;
  }
): User | null => {
  // Check if user already exists
  if (users.some(u => u.email === email)) {
    return null;
  }
  
  const userId = `user-${Date.now()}`;
  const cardId = `card-${Date.now()}`;
  const qrCodeValue = `${cardId}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  
  // Create new user
  const newUser: User = {
    id: userId,
    email,
    name,
    role: 'user'
  };
  
  // Format full address string from components
  let fullAddress = "";
  if (additionalData.streetAddress) {
    fullAddress += additionalData.streetAddress;
  }
  if (additionalData.subdistrict) {
    fullAddress += (fullAddress ? ", " : "") + additionalData.subdistrict;
  }
  if (additionalData.district) {
    fullAddress += (fullAddress ? ", " : "") + additionalData.district;
  }
  if (additionalData.city) {
    fullAddress += (fullAddress ? ", " : "") + additionalData.city;
  }
  if (additionalData.province) {
    fullAddress += (fullAddress ? ", " : "") + additionalData.province;
  }
  if (additionalData.country) {
    fullAddress += (fullAddress ? ", " : "") + additionalData.country;
  }
  
  // Create user data
  const newUserData: UserData = {
    id: `data-${Date.now()}`,
    userId,
    name,
    email,
    cardId,
    createdAt: new Date().toISOString(),
    phoneNumber: additionalData.phoneNumber,
    address: fullAddress,
    country: additionalData.country,
    province: additionalData.province,
    city: additionalData.city,
    district: additionalData.district,
    subdistrict: additionalData.subdistrict,
    postalCode: additionalData.postalCode,
    streetAddress: additionalData.streetAddress,
    extraInfo: additionalData.extraInfo,
    photoUrl: additionalData.photoData || undefined
  };
  
  // Create card with QR code
  const newCard: CardData = {
    id: cardId,
    userId,
    qrCode: qrCodeValue,
    isValid: true,
    createdAt: new Date().toISOString()
  };
  
  // Save all data
  users.push(newUser);
  userData.push(newUserData);
  cards.push(newCard);
  
  saveUsers();
  saveUserData();
  saveCards();
  
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  
  return newUser;
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

export const getUserData = (userId: string): UserData | null => {
  return userData.find(data => data.userId === userId) || null;
};

export const getCardData = (userId: string): CardData | null => {
  return cards.find(card => card.userId === userId) || null;
};

export const getAllUsers = (): UserData[] => {
  return userData;
};

// Profile update request
export const updateUserProfileRequest = async (updateData: {
  userId: string;
  name: string;
  phoneNumber?: string;
  address?: string;
  extraInfo?: string;
  photoData?: string | null;
}): Promise<boolean> => {
  try {
    const requestId = `req-${Date.now()}`;
    
    const newRequest: ProfileUpdateRequest = {
      id: requestId,
      userId: updateData.userId,
      requestedAt: new Date().toISOString(),
      status: "pending",
      changes: {
        name: updateData.name,
        phoneNumber: updateData.phoneNumber,
        address: updateData.address,
        extraInfo: updateData.extraInfo,
        photoUrl: updateData.photoData || undefined
      }
    };
    
    updateRequests.push(newRequest);
    saveUpdateRequests();
    return true;
  } catch (error) {
    console.error("Error submitting update request:", error);
    return false;
  }
};

// Get all pending update requests
export const getPendingUpdateRequests = (): ProfileUpdateRequest[] => {
  return updateRequests.filter(req => req.status === "pending");
};

// Approve or reject profile update request
export const processUpdateRequest = (requestId: string, approve: boolean, adminId: string): boolean => {
  const requestIndex = updateRequests.findIndex(req => req.id === requestId);
  
  if (requestIndex === -1) return false;
  
  const request = updateRequests[requestIndex];
  
  updateRequests[requestIndex] = {
    ...request,
    status: approve ? "approved" : "rejected",
    processedAt: new Date().toISOString(),
    processedBy: adminId
  };
  
  if (approve) {
    // Find and update user data
    const userIndex = userData.findIndex(u => u.userId === request.userId);
    
    if (userIndex !== -1) {
      userData[userIndex] = {
        ...userData[userIndex],
        ...request.changes
      };
      saveUserData();
    }
  }
  
  saveUpdateRequests();
  return true;
};

export const validateCard = (qrCode: string, adminId: string): boolean => {
  const cardIndex = cards.findIndex(card => card.qrCode === qrCode);
  
  if (cardIndex === -1) return false;
  
  cards[cardIndex].isValid = true;
  cards[cardIndex].validatedAt = new Date().toISOString();
  cards[cardIndex].validatedBy = adminId;
  
  saveCards();
  toast.success("Card validated successfully!");
  
  return true;
};

export const getCardByQRCode = (qrCode: string): { card: CardData, user: UserData } | null => {
  const card = cards.find(c => c.qrCode === qrCode);
  if (!card) return null;
  
  const user = userData.find(u => u.userId === card.userId);
  if (!user) return null;
  
  return { card, user };
};
