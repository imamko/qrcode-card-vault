
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  getCurrentUser, 
  getAllUsers, 
  getCardData, 
  getPendingUpdateRequests,
  processUpdateRequest
} from "@/lib/auth";
import { UserHeader } from "@/components/UserHeader";
import { QRScanner } from "@/components/QRScanner";
import { UsersTable } from "@/components/UsersTable";
import { CardData, ProfileUpdateRequest } from "@/types";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Shield, ShieldCheck } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getCurrentUser());
  const [users, setUsers] = useState(getAllUsers());
  const [cards, setCards] = useState<CardData[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ProfileUpdateRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ProfileUpdateRequest | null>(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("requests");
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }
    
    // Get all cards for all users
    const allCards = users.map(u => getCardData(u.userId)).filter(Boolean) as CardData[];
    setCards(allCards);
    
    // Get pending update requests
    setPendingRequests(getPendingUpdateRequests());
    
    // Check URL parameters for tab and user ID
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['requests', 'scanner', 'users'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    
  }, [user, navigate, location.search]);
  
  // Refresh data when tab changes
  const refreshData = () => {
    setUsers(getAllUsers());
    const allCards = users.map(u => getCardData(u.userId)).filter(Boolean) as CardData[];
    setCards(allCards);
    setPendingRequests(getPendingUpdateRequests());
  };
  
  const handleViewRequest = (request: ProfileUpdateRequest) => {
    setSelectedRequest(request);
    setShowRequestDialog(true);
  };
  
  const handleProcessRequest = (approve: boolean) => {
    if (!user || !selectedRequest) return;
    
    const success = processUpdateRequest(selectedRequest.id, approve, user.id);
    
    if (success) {
      toast.success(
        approve 
          ? "Profile update approved and applied" 
          : "Profile update rejected"
      );
      setShowRequestDialog(false);
      refreshData();
    } else {
      toast.error("Failed to process request");
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  if (!user) {
    return null;
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    refreshData();
  };
  
  return (
    <ProtectedRoute allowedRole="admin">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <UserHeader user={user} />
        
        <main className="flex-1 container py-6">
          <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
          
          {pendingRequests.length > 0 && (
            <Alert className="mb-6 bg-gray-100 border-gray-300">
              <ShieldCheck className="h-5 w-5" />
              <AlertTitle>Pending Approvals</AlertTitle>
              <AlertDescription>
                You have {pendingRequests.length} pending profile update {pendingRequests.length === 1 ? 'request' : 'requests'} that require your attention.
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="requests">
                Update Requests
                {pendingRequests.length > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {pendingRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
              <TabsTrigger value="users">View All Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Update Requests</CardTitle>
                  <CardDescription>Review and process user profile update requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingRequests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No pending requests to review</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingRequests.map(request => {
                        const requestUser = users.find(u => u.userId === request.userId);
                        return (
                          <div key={request.id} className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={requestUser?.photoUrl || ""} />
                                <AvatarFallback>
                                  {requestUser?.name.substring(0, 2).toUpperCase() || ""}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{requestUser?.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Requested on {formatDate(request.requestedAt)}
                                </p>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewRequest(request)}
                            >
                              Review
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="scanner">
              <div className="max-w-3xl mx-auto">
                <p className="text-muted-foreground mb-6 text-center">
                  Scan QR codes from user cards to validate their identity.
                </p>
                <QRScanner />
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <UsersTable users={users} cards={cards} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {selectedRequest && (
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Profile Update Request</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 my-4">
              {selectedRequest.changes.photoUrl && (
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-muted-foreground mb-1">Current Photo</p>
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={users.find(u => u.userId === selectedRequest.userId)?.photoUrl || ""} />
                        <AvatarFallback>
                          {users.find(u => u.userId === selectedRequest.userId)?.name.substring(0, 2).toUpperCase() || ""}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-muted-foreground mb-1">New Photo</p>
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={selectedRequest.changes.photoUrl} />
                        <AvatarFallback>
                          {selectedRequest.changes.name?.substring(0, 2).toUpperCase() || 
                          users.find(u => u.userId === selectedRequest.userId)?.name.substring(0, 2).toUpperCase() || ""}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedRequest.changes.name && (
                <div>
                  <h4 className="text-sm font-medium">Name</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      {users.find(u => u.userId === selectedRequest.userId)?.name}
                    </div>
                    <div className="p-2 bg-blue-50 border-l-2 border-blue-300 rounded text-sm">
                      {selectedRequest.changes.name}
                    </div>
                  </div>
                </div>
              )}
              
              {selectedRequest.changes.phoneNumber !== undefined && (
                <div>
                  <h4 className="text-sm font-medium">Phone Number</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      {users.find(u => u.userId === selectedRequest.userId)?.phoneNumber || "Not set"}
                    </div>
                    <div className="p-2 bg-blue-50 border-l-2 border-blue-300 rounded text-sm">
                      {selectedRequest.changes.phoneNumber || "Not set"}
                    </div>
                  </div>
                </div>
              )}
              
              {selectedRequest.changes.address !== undefined && (
                <div>
                  <h4 className="text-sm font-medium">Address</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      {users.find(u => u.userId === selectedRequest.userId)?.address || "Not set"}
                    </div>
                    <div className="p-2 bg-blue-50 border-l-2 border-blue-300 rounded text-sm">
                      {selectedRequest.changes.address || "Not set"}
                    </div>
                  </div>
                </div>
              )}
              
              {selectedRequest.changes.extraInfo !== undefined && (
                <div>
                  <h4 className="text-sm font-medium">Additional Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      {users.find(u => u.userId === selectedRequest.userId)?.extraInfo || "Not set"}
                    </div>
                    <div className="p-2 bg-blue-50 border-l-2 border-blue-300 rounded text-sm">
                      {selectedRequest.changes.extraInfo || "Not set"}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleProcessRequest(false)}>
                Reject
              </Button>
              <Button type="button" onClick={() => handleProcessRequest(true)}>
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ProtectedRoute>
  );
}

export default Admin;
