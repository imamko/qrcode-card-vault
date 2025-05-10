
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="animate-fade-in w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-brand-purple mb-2">QR Card Vault</h1>
          <p className="text-center text-gray-600 max-w-md">
            Secure digital ID cards with QR code verification
          </p>
        </div>
        
        <Card className="mb-6 border-brand-light-purple">
          <CardContent className="pt-6">
            <Alert className="bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-sm text-blue-700">
                <strong>Admin Login:</strong><br />
                Email: admin@gmail.com<br />
                Password: Admin1 (auto-created)
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        
        <AuthForm mode="login" />
      </div>
    </div>
  );
}

export default Login;
