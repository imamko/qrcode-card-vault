
import { CountryData, CityData, DistrictData } from "@/types";

// This is mock data, in a real app you'd fetch this from an API
export const countries: CountryData[] = [
  {
    name: "Indonesia",
    code: "ID",
    provinces: ["Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Bali"],
    postalCodePattern: "^\\d{5}$"
  },
  {
    name: "Malaysia",
    code: "MY",
    provinces: ["Kuala Lumpur", "Selangor", "Johor", "Penang", "Sabah"],
    postalCodePattern: "^\\d{5}$"
  },
  {
    name: "Singapore",
    code: "SG",
    provinces: ["Central Region", "East Region", "North Region", "West Region", "North-East Region"],
    postalCodePattern: "^\\d{6}$"
  }
];

// Mock cities based on country and province
export const getCitiesByProvince = (country: string, province: string): string[] => {
  if (country === "Indonesia") {
    switch(province) {
      case "Jakarta":
        return ["Jakarta Pusat", "Jakarta Utara", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur"];
      case "Jawa Barat":
        return ["Bandung", "Bekasi", "Bogor", "Depok", "Cirebon"];
      case "Jawa Tengah":
        return ["Semarang", "Solo", "Yogyakarta", "Magelang", "Pekalongan"];
      default:
        return [];
    }
  }
  return [];
};

// Mock districts based on city
export const getDistrictsByCity = (city: string): string[] => {
  switch(city) {
    case "Jakarta Pusat":
      return ["Menteng", "Tanah Abang", "Senen", "Kemayoran"];
    case "Jakarta Selatan":
      return ["Kebayoran Baru", "Pancoran", "Mampang", "Tebet"];
    case "Bandung":
      return ["Cicendo", "Coblong", "Sukajadi", "Cidadap"];
    default:
      return [];
  }
};

// Mock subdistricts based on district
export const getSubdistrictsByDistrict = (district: string): string[] => {
  switch(district) {
    case "Menteng":
      return ["Menteng", "Pegangsaan", "Cikini", "Kebon Sirih"];
    case "Kebayoran Baru":
      return ["Senayan", "Gandaria Utara", "Cipete Utara", "Pulo"];
    case "Cicendo":
      return ["Pasirkaliki", "Sukaraja", "Husein Sastranegara", "Pajajaran"];
    default:
      return [];
  }
};

// Mock postal codes based on subdistrict
export const getPostalCode = (city: string, district: string, subdistrict: string): string => {
  // Jakarta postal codes: 10xxx - 14xxx
  if (city.includes("Jakarta")) {
    if (city === "Jakarta Pusat") return "10" + Math.floor(Math.random() * 900 + 100).toString();
    if (city === "Jakarta Utara") return "14" + Math.floor(Math.random() * 900 + 100).toString();
    if (city === "Jakarta Barat") return "11" + Math.floor(Math.random() * 900 + 100).toString();
    if (city === "Jakarta Selatan") return "12" + Math.floor(Math.random() * 900 + 100).toString();
    if (city === "Jakarta Timur") return "13" + Math.floor(Math.random() * 900 + 100).toString();
  }
  
  // Bandung postal codes: 40xxx
  if (city === "Bandung") {
    return "40" + Math.floor(Math.random() * 900 + 100).toString();
  }
  
  // Default postal code
  return Math.floor(Math.random() * 90000 + 10000).toString();
};
