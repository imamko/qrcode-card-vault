import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User, Mail, Phone, MapPin, Check, AlertCircle, MapPinPlus, Upload } from "lucide-react";
import { toast } from "@/components/ui/sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthFormMode } from "@/types";
import { login, register } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Country codes for phone selection
const countryCodes = [
  { value: "+1", label: "US (+1)" },
  { value: "+44", label: "UK (+44)" },
  { value: "+61", label: "AU (+61)" },
  { value: "+91", label: "IN (+91)" },
  { value: "+62", label: "ID (+62)" },
  { value: "+60", label: "MY (+60)" },
  { value: "+65", label: "SG (+65)" },
  { value: "+81", label: "JP (+81)" },
  { value: "+86", label: "CN (+86)" },
];

// List of countries for address selection
const countries = [
  "Australia", 
  "Canada", 
  "China", 
  "France", 
  "Germany", 
  "India", 
  "Indonesia", 
  "Japan", 
  "Malaysia", 
  "Singapore", 
  "South Korea", 
  "United Kingdom", 
  "United States"
];

// Provinces/States by country (simplified)
const provincesByCountry: Record<string, string[]> = {
  "Australia": ["New South Wales", "Victoria", "Queensland", "Western Australia"],
  "Canada": ["Ontario", "Quebec", "British Columbia", "Alberta"],
  "China": ["Beijing", "Shanghai", "Guangdong", "Sichuan"],
  "France": ["Île-de-France", "Provence-Alpes-Côte d'Azur", "Nouvelle-Aquitaine"],
  "Germany": ["Bavaria", "North Rhine-Westphalia", "Baden-Württemberg", "Berlin"],
  "India": ["Maharashtra", "Tamil Nadu", "Karnataka", "Delhi"],
  "Indonesia": ["West Java", "East Java", "Central Java", "Jakarta"],
  "Japan": ["Tokyo", "Osaka", "Kyoto", "Hokkaido"],
  "Malaysia": ["Selangor", "Kuala Lumpur", "Penang", "Johor"],
  "Singapore": ["Central Region", "East Region", "North Region", "West Region"],
  "South Korea": ["Seoul", "Busan", "Incheon", "Daegu"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  "United States": ["California", "New York", "Texas", "Florida"]
};

// Define separate types for login and register forms
type LoginFormValues = {
  email: string;
  password: string;
};

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  countryCode: string;
  phoneNumber: string;
  country: string;
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  street: string;
  postalCode: string;
  photo?: string;
};

const loginSchema = z.object({
  email: z.string()
    .email({ message: "Please enter a valid email" })
    .refine(val => val.endsWith('@gmail.com'), {
      message: "Only Gmail addresses are accepted"
    }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string()
    .email({ message: "Please enter a valid email" })
    .refine(val => val.endsWith('@gmail.com'), {
      message: "Only Gmail addresses are accepted"
    }),
  countryCode: z.string({ required_error: "Please select a country code" }),
  phoneNumber: z.string().min(5, { message: "Please enter a valid phone number" }),
  country: z.string({ required_error: "Please select a country" }),
  province: z.string({ required_error: "Please select a province/state" }),
  city: z.string().min(2, { message: "Please enter a city" }),
  district: z.string().min(2, { message: "Please enter a district" }),
  subdistrict: z.string().min(2, { message: "Please enter a subdistrict" }),
  street: z.string().min(5, { message: "Please enter a street address" }),
  postalCode: z.string().min(3, { message: "Please enter a postal code" }),
  photo: z.string().optional(),
}).and(passwordSchema);

export function AuthForm({ mode = "login" }: { mode: AuthFormMode }) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const isLogin = mode === "login";
  
  // Use appropriate schema and form type based on mode
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      countryCode: "+62", // Default to Indonesia
      phoneNumber: "",
      country: "",
      province: "",
      city: "",
      district: "",
      subdistrict: "",
      street: "",
      postalCode: "",
      photo: "",
    }
  });

  // Get the selected country to show the right provinces
  const selectedCountry = registerForm.watch("country");
  const provinces = selectedCountry ? provincesByCountry[selectedCountry] || [] : [];
  
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      registerForm.setValue("photo", result);
    };
    reader.readAsDataURL(file);
  };
  
  // Use the appropriate form based on mode
  const form = isLogin ? loginForm : registerForm;

  const onSubmit = async (data: LoginFormValues | RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (isLogin) {
        // We know data is LoginFormValues if isLogin is true
        const loginData = data as LoginFormValues;
        const user = login(loginData.email, loginData.password);
        if (user) {
          toast.success(`Welcome back, ${user.name}!`);
          navigate(user.role === "admin" ? "/admin" : "/dashboard");
        } else {
          toast.error("Invalid email or password");
        }
      } else {
        // We know data is RegisterFormValues if isLogin is false
        const registerData = data as RegisterFormValues;
        
        // Combine countryCode and phoneNumber
        const fullPhoneNumber = `${registerData.countryCode} ${registerData.phoneNumber}`;
        
        const user = register(
          registerData.email, 
          registerData.name, 
          registerData.password, 
          {
            phoneNumber: fullPhoneNumber,
            country: registerData.country,
            province: registerData.province,
            city: registerData.city,
            district: registerData.district,
            subdistrict: registerData.subdistrict,
            postalCode: registerData.postalCode,
            streetAddress: registerData.street,
            photoData: registerData.photo
          }
        );
        
        if (user) {
          toast.success("Registration successful! Your virtual card has been created.");
          navigate("/dashboard");
        } else {
          toast.error("Email already in use");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    navigate(isLogin ? "/register" : "/login");
  };

  // Render the login form
  const renderLoginForm = () => (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="you@gmail.com" 
                    className="pl-10" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-gray-800 hover:bg-gray-700 text-white" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );

  // Render the register form
  const renderRegisterForm = () => (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-4">
        {/* Photo Upload */}
        <div className="flex flex-col items-center mb-4">
          <FormLabel className="mb-2">Profile Photo</FormLabel>
          <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
            <Avatar className="w-24 h-24 mb-2">
              {photoPreview ? (
                <AvatarImage src={photoPreview} />
              ) : (
                <AvatarFallback className="bg-gray-200 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-500" />
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handlePhotoUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs mt-1"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Photo
          </Button>
        </div>

        <FormField
          control={registerForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="John Doe" 
                    className="pl-10" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="you@gmail.com" 
                    className="pl-10" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-1">
                  <Check className="h-3 w-3" /> At least 8 characters
                </li>
                <li className="flex items-center gap-1">
                  <Check className="h-3 w-3" /> At least one uppercase letter
                </li>
                <li className="flex items-center gap-1">
                  <Check className="h-3 w-3" /> At least one lowercase letter
                </li>
                <li className="flex items-center gap-1">
                  <Check className="h-3 w-3" /> At least one number
                </li>
                <li className="flex items-center gap-1">
                  <Check className="h-3 w-3" /> At least one special character
                </li>
              </ul>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-2">
          <FormField
            control={registerForm.control}
            name="countryCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countryCodes.map((code) => (
                      <SelectItem key={code.value} value={code.value}>
                        {code.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={registerForm.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="81234567890" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={registerForm.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedCountry && (
          <FormField
            control={registerForm.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state/province" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={registerForm.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your city" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>District</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your district" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="subdistrict"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subdistrict</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your subdistrict" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="123 Main St" 
                    className="pl-10" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input 
                  placeholder="12345" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-gray-800 hover:bg-gray-700 text-white" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );

  return (
    <Card className="w-[350px] sm:w-[450px] card-shadow">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {isLogin ? "Sign In" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin ? "Welcome back!" : "Register to get your digital ID card"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLogin ? renderLoginForm() : renderRegisterForm()}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" onClick={toggleMode}>
          {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AuthForm;
