
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Upload, CheckCircle, UserCheck } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { scanQRCode, validateQRCode, processUploadedQRCode } from "@/lib/qr-utils";
import { getCardByQRCode } from "@/lib/auth";
import { UserData } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [validating, setValidating] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [uploadedQRCode, setUploadedQRCode] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showValidationSuccess, setShowValidationSuccess] = useState(false);

  const handleScan = async () => {
    setScanning(true);
    setScannedData(null);
    setUserData(null);
    
    try {
      const qrCode = await scanQRCode();
      setScannedData(qrCode);
      
      if (qrCode) {
        const result = getCardByQRCode(qrCode);
        if (result) {
          setUserData(result.user);
        }
      }
    } catch (error) {
      console.error("Scan error:", error);
      toast.error("Failed to scan QR code");
    } finally {
      setScanning(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setProcessing(true);
    setScannedData(null);
    setUserData(null);
    
    try {
      const qrCodeValue = await processUploadedQRCode(file);
      
      if (qrCodeValue) {
        setUploadedQRCode(qrCodeValue);
        setScannedData(qrCodeValue);
        
        const result = getCardByQRCode(qrCodeValue);
        if (result) {
          setUserData(result.user);
          toast.success("QR Code successfully read from image");
        } else {
          toast.error("Invalid QR Code in image");
        }
      }
    } catch (error) {
      console.error("Error processing uploaded QR code:", error);
      toast.error("Failed to read QR code from image");
    } finally {
      setProcessing(false);
    }
  };

  const handleValidate = async () => {
    if (!scannedData) return;
    
    setValidating(true);
    
    try {
      const success = await validateQRCode(scannedData);
      
      if (success) {
        setShowValidationSuccess(true);
      } else {
        toast.error("Failed to validate card");
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Error during validation");
    } finally {
      setValidating(false);
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">QR Code Scanner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <Tabs defaultValue="scan" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="scan">Scan QR Code</TabsTrigger>
            <TabsTrigger value="upload">Upload QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-4">
            <div className="bg-muted rounded-lg p-8 flex items-center justify-center min-h-48">
              {scannedData ? (
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <QrCode className="h-12 w-12 text-brand-purple mb-4" />
                  </div>
                  <p className="font-medium">QR Code Scanned Successfully</p>
                  {userData && (
                    <div className="mt-4 p-4 bg-white rounded-md border text-left">
                      <p><span className="font-medium">Name:</span> {userData.name}</p>
                      <p><span className="font-medium">Card ID:</span> {userData.cardId}</p>
                      {userData.phoneNumber && <p><span className="font-medium">Phone:</span> {userData.phoneNumber}</p>}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <QrCode className="h-12 w-12 text-muted-foreground mb-2 mx-auto" />
                  <p className="text-muted-foreground">
                    {scanning ? "Scanning..." : "No QR code scanned"}
                  </p>
                </div>
              )}
            </div>
            <Button className="w-full" variant="outline" onClick={handleScan} disabled={scanning}>
              {scanning ? "Scanning..." : "Scan QR Code"}
            </Button>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="bg-muted rounded-lg p-8 flex items-center justify-center min-h-48">
              {uploadedQRCode ? (
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <QrCode className="h-12 w-12 text-brand-purple mb-4" />
                  </div>
                  <p className="font-medium">QR Code Uploaded Successfully</p>
                  {userData && (
                    <div className="mt-4 p-4 bg-white rounded-md border text-left">
                      <p><span className="font-medium">Name:</span> {userData.name}</p>
                      <p><span className="font-medium">Card ID:</span> {userData.cardId}</p>
                      {userData.phoneNumber && <p><span className="font-medium">Phone:</span> {userData.phoneNumber}</p>}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mb-2 mx-auto" />
                  <p className="text-muted-foreground">
                    {processing ? "Processing image..." : "Upload a QR code image"}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="qr-upload" className="w-full">
                <Button variant="outline" className="w-full" asChild disabled={processing}>
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="h-4 w-4" />
                    {processing ? "Processing..." : "Upload QR Code Image"}
                  </div>
                </Button>
              </label>
              <input 
                id="qr-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleUpload}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        {scannedData && (
          <Button onClick={handleValidate} disabled={validating || !scannedData} className="w-full">
            {validating ? "Validating..." : "Validate Card"}
          </Button>
        )}
      </CardFooter>

      {/* Validation Success Dialog */}
      <Dialog open={showValidationSuccess} onOpenChange={setShowValidationSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Validation Successful</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-6 animate-fade-in">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle className="h-12 w-12 text-green-600 animate-scale-in" />
            </div>
            
            {userData && (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-center space-x-4 mb-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={userData.photoUrl || ""} alt={userData.name} />
                    <AvatarFallback>
                      {userData.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{userData.name}</h3>
                    <p className="text-sm text-muted-foreground">{userData.email}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">ID:</span>
                    <span className="text-sm">{userData.cardId}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Status:</span>
                    <Badge className="bg-green-600">Valid</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Validated:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">{formatDate(new Date().toISOString())}</span>
                      <UserCheck className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  
                  {userData.phoneNumber && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">Phone:</span>
                      <span className="text-sm">{userData.phoneNumber}</span>
                    </div>
                  )}
                  
                  {userData.address && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">Address:</span>
                      <span className="text-sm text-right max-w-48 truncate">{userData.address}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              Card has been successfully validated
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default QRScanner;
