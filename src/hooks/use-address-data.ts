
import { useState, useCallback, useMemo } from 'react';
import { 
  countries, 
  getCitiesByProvince, 
  getDistrictsByCity, 
  getSubdistrictsByDistrict, 
  getPostalCode 
} from '@/lib/addressData';

export function useAddressData() {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSubdistrict, setSelectedSubdistrict] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");

  // Available options based on current selections
  const provinces = useMemo(() => {
    const country = countries.find(c => c.name === selectedCountry);
    return country ? country.provinces : [];
  }, [selectedCountry]);

  const cities = useMemo(() => {
    if (selectedCountry && selectedProvince) {
      return getCitiesByProvince(selectedCountry, selectedProvince);
    }
    return [];
  }, [selectedCountry, selectedProvince]);

  const districts = useMemo(() => {
    if (selectedCity) {
      return getDistrictsByCity(selectedCity);
    }
    return [];
  }, [selectedCity]);

  const subdistricts = useMemo(() => {
    if (selectedDistrict) {
      return getSubdistrictsByDistrict(selectedDistrict);
    }
    return [];
  }, [selectedDistrict]);

  // Handlers for selecting values
  const handleCountryChange = useCallback((country: string) => {
    setSelectedCountry(country);
    setSelectedProvince("");
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedSubdistrict("");
    setPostalCode("");
  }, []);

  const handleProvinceChange = useCallback((province: string) => {
    setSelectedProvince(province);
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedSubdistrict("");
    setPostalCode("");
  }, []);

  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city);
    setSelectedDistrict("");
    setSelectedSubdistrict("");
    setPostalCode("");
  }, []);

  const handleDistrictChange = useCallback((district: string) => {
    setSelectedDistrict(district);
    setSelectedSubdistrict("");
    setPostalCode("");
  }, []);

  const handleSubdistrictChange = useCallback((subdistrict: string) => {
    setSelectedSubdistrict(subdistrict);
    
    // Generate postal code when subdistrict is selected
    if (selectedCity && selectedDistrict) {
      const generatedPostalCode = getPostalCode(selectedCity, selectedDistrict, subdistrict);
      setPostalCode(generatedPostalCode);
    }
  }, [selectedCity, selectedDistrict]);

  // Format full address
  const getFormattedAddress = useCallback(() => {
    const parts = [
      selectedSubdistrict,
      selectedDistrict,
      selectedCity,
      selectedProvince,
      selectedCountry
    ].filter(Boolean);
    
    return parts.join(", ");
  }, [
    selectedCountry,
    selectedProvince,
    selectedCity,
    selectedDistrict,
    selectedSubdistrict
  ]);

  return {
    // Selected values
    selectedCountry,
    selectedProvince,
    selectedCity,
    selectedDistrict,
    selectedSubdistrict,
    postalCode,
    
    // Available options
    countries: countries.map(c => c.name),
    provinces,
    cities,
    districts,
    subdistricts,
    
    // Handlers
    handleCountryChange,
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
    handleSubdistrictChange,
    
    // Helper
    getFormattedAddress
  };
}
