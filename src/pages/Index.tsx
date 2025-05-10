
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";

export function Index() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = getCurrentUser();
    
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );
}

export default Index;
