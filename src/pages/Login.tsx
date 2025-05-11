
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Login() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className={`animate-fade-in w-full ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-purple mb-2">QR Card Vault</h1>
          <p className="text-center text-gray-600 max-w-md">
            Secure digital ID cards with QR code verification
          </p>
        </div>
        
        <AuthForm mode="login" />
      </div>
    </div>
  );
}

export default Login;
