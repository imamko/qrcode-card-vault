
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser, getUserData, getCardData } from "@/lib/auth";
import { UserHeader } from "@/components/UserHeader";
import { VirtualCard } from "@/components/VirtualCard";
import { UserProfile } from "@/components/UserProfile";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [userData, setUserData] = useState(user ? getUserData(user.id) : null);
  const [cardData, setCardData] = useState(user ? getCardData(user.id) : null);
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (user.role === "admin") {
      navigate("/admin");
      return;
    }
    
    // Refresh data
    setUserData(getUserData(user.id));
    setCardData(getCardData(user.id));
  }, [user, navigate]);
  
  if (!user || !userData || !cardData) {
    return null;
  }
  
  return (
    <ProtectedRoute allowedRole="user">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <UserHeader user={user} />
        
        <main className="flex-1 container py-6">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h2>
          <Alert className="mb-6 bg-brand-light-purple border-brand-purple">
            <AlertTitle className="text-brand-purple">Your Virtual ID Card</AlertTitle>
            <AlertDescription>
              Show your QR code to an admin for validation. Keep your card ID private and secure.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col gap-6">
            <div className="max-w-lg mx-auto w-full">
              <VirtualCard userData={userData} cardData={cardData} />
            </div>
            
            <Tabs defaultValue="profile" className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="card">Card Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <UserProfile userData={userData} />
              </TabsContent>
              
              <TabsContent value="card">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Details</CardTitle>
                    <CardDescription>Your virtual card information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Card ID</h3>
                        <p className="text-base">{cardData.id}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                        <p className="text-base">{cardData.isValid ? "Valid" : "Invalid"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Created On</h3>
                        <p className="text-base">
                          {new Date(cardData.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", 
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {cardData.validatedAt && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Last Validated</h3>
                        <p className="text-base">
                          {new Date(cardData.validatedAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-4 mt-4 border-t">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">QR Code Value (Keep Private)</h3>
                      <div className="p-3 bg-gray-100 rounded font-mono text-xs overflow-x-auto">
                        {cardData.qrCode}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default Dashboard;
