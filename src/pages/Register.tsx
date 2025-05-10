
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export function Register() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">QR Card Vault</h1>
          <p className="text-center text-gray-600 text-sm mb-4">
            Create an account to get your digital ID card with QR verification
          </p>
        </div>
        <div className="w-full">
          <AuthForm mode="register" />
        </div>
      </div>
    </div>
  );
}

export default Register;
