
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserData, CardData } from "@/types";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Fullscreen, Download, QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "@/components/ui/sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

interface VirtualCardProps {
  userData: UserData;
  cardData: CardData;
}

export function VirtualCard({ userData, cardData }: VirtualCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleFullscreen = () => {
    setShowQRModal(true);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDownload = async () => {
    if (!frontCardRef.current || !backCardRef.current) return;

    try {
      toast.loading("Preparing PDF download...");
      
      // Temporarily flip to back if not flipped to capture it
      const wasFlipped = isFlipped;
      if (!wasFlipped) {
        setIsFlipped(true);
      }
      
      // Wait for the DOM to update after flipping
      setTimeout(async () => {
        // Capture front card
        const frontCanvas = await html2canvas(frontCardRef.current!, {
          scale: 3, // Higher quality
          backgroundColor: null,
          logging: false,
        });
        
        // Capture back card
        const backCanvas = await html2canvas(backCardRef.current!, {
          scale: 3, // Higher quality
          backgroundColor: null,
          logging: false,
        });
        
        // Reset to original state if needed
        if (!wasFlipped) {
          setIsFlipped(false);
        }
        
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a6",
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        
        // Add front image
        const frontImgData = frontCanvas.toDataURL("image/png");
        const frontHeight = (frontCanvas.height * pdfWidth) / frontCanvas.width;
        pdf.addImage(frontImgData, "PNG", 0, 0, pdfWidth, frontHeight);
        
        // Add new page for back image
        pdf.addPage();
        
        // Add back image
        const backImgData = backCanvas.toDataURL("image/png");
        const backHeight = (backCanvas.height * pdfWidth) / backCanvas.width;
        pdf.addImage(backImgData, "PNG", 0, 0, pdfWidth, backHeight);
        
        pdf.save(`${userData.name.replace(/\s+/g, "_")}_card.pdf`);
        
        toast.dismiss();
        toast.success("Card downloaded successfully!");
      }, 300);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to download card");
      console.error("PDF generation error:", error);
    }
  };

  return (
    <div className={`transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative w-full max-w-md mx-auto">
        {/* Card with 3D effect */}
        <div 
          className="perspective-1000 cursor-pointer" 
          onClick={handleFlip}
        >
          <div className={`flip-card-inner relative w-full transition-transform duration-700 ease-in-out ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Front Card */}
            <div className="flip-card-front" ref={frontCardRef}>
              <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden transform hover:rotate-0 transition-all duration-300">
                <div className="bg-purple-600 py-2 text-center text-white font-medium text-sm uppercase tracking-wider">
                  Digital ID Card
                </div>
                <div className="p-6 text-white">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-16 w-16 rounded-full border-2 border-gray-700">
                      <AvatarImage src={userData.photoUrl || ""} alt={userData.name} />
                      <AvatarFallback className="bg-gray-700 text-lg">
                        {userData.name ? userData.name.substring(0, 2).toUpperCase() : "ID"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <h3 className="font-bold">{userData.name}</h3>
                      <p className="text-sm text-gray-300">{userData.email}</p>
                    </div>
                  </div>
                    
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-gray-700 py-1">
                      <span className="text-gray-400">ID</span>
                      <span className="font-mono">{userData.cardId.substring(0, 8)}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 py-1">
                      <span className="text-gray-400">Status</span>
                      <span className={`${cardData.isValid ? 'text-green-400' : 'text-red-400'}`}>
                        {cardData.isValid ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 py-1">
                      <span className="text-gray-400">Issued</span>
                      <span>{formatDate(cardData.createdAt)}</span>
                    </div>
                    {userData.phoneNumber && (
                      <div className="flex justify-between border-b border-gray-700 py-1">
                        <span className="text-gray-400">Phone</span>
                        <span>{userData.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-center mt-4 text-gray-400">
                    Tap card to view QR code
                  </div>
                </div>
              </div>
              
              {/* Card Shadow */}
              <div className="absolute inset-0 bg-gray-900 rounded-xl -z-10 transform rotate-6 scale-95 translate-x-4 translate-y-4 opacity-30 blur-sm"></div>
            </div>

            {/* Back Card */}
            <div className="flip-card-back absolute top-0 left-0 w-full h-full rotate-y-180 backface-hidden" ref={backCardRef}>
              <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden h-full flex flex-col">
                <div className="bg-purple-600 py-2 text-center text-white font-medium text-sm uppercase tracking-wider">
                  Verification
                </div>
                
                <div className="p-6 text-white flex-1 flex flex-col items-center justify-center">
                  <div className="mt-2 bg-white p-4 rounded-lg mb-6">
                    <QRCode
                      value={cardData.qrCode}
                      size={isMobile ? 160 : 200}
                      level="M"
                    />
                  </div>
                  
                  <h4 className="font-medium mb-1">{userData.name}</h4>
                  <p className="text-xs text-gray-400 mb-3">ID: {userData.cardId}</p>
                  
                  <div className="text-xs text-gray-400 mt-2">
                    Scan to verify identity
                  </div>
                </div>
              </div>
              
              {/* Back Card Shadow */}
              <div className="absolute inset-0 bg-gray-900 rounded-xl -z-10 transform rotate-6 scale-95 translate-x-4 translate-y-4 opacity-30 blur-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2" 
          onClick={handleFullscreen}
        >
          <Fullscreen className="h-4 w-4" /> View QR
        </Button>
        <Button 
          variant="outline"
          size="sm"
          className="flex items-center gap-2" 
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" /> Download Card
        </Button>
      </div>

      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="sm:max-w-md flex flex-col items-center p-6">
          <DialogTitle className="text-xl font-bold mb-4">QR Code</DialogTitle>
          <div className="bg-white p-4 rounded-lg">
            <QRCode
              value={cardData.qrCode}
              size={230}
              level="H"
            />
          </div>
          <p className="mt-4 text-center text-muted-foreground">
            Show this QR code to an admin for verification
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default VirtualCard;
