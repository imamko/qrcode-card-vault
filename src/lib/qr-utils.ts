
import { toast } from "@/components/ui/sonner";
import { getCurrentUser, validateCard, getCardByQRCode } from "@/lib/auth";
import jsQR from "jsqr";

export const scanQRCode = async (): Promise<string | null> => {
  try {
    // In a real app, this would integrate with a device camera
    // For this demo, we'll mock scanning by prompting for QR code
    const qrCodeValue = prompt('Enter QR Code Value (Simulated Scan):');
    
    if (!qrCodeValue) {
      toast.error("Scan cancelled or failed");
      return null;
    }
    
    return qrCodeValue;
  } catch (error) {
    console.error("Error scanning QR code:", error);
    toast.error("Failed to scan QR code");
    return null;
  }
};

export const validateQRCode = async (qrCode: string): Promise<boolean> => {
  const admin = getCurrentUser();
  
  if (!admin || admin.role !== 'admin') {
    toast.error("Only admins can validate cards");
    return false;
  }
  
  const cardData = getCardByQRCode(qrCode);
  
  if (!cardData) {
    toast.error("Invalid QR code");
    return false;
  }
  
  return validateCard(qrCode, admin.id);
};

export const processUploadedQRCode = async (file: File): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        // Create an image element from the file
        const img = new Image();
        img.onload = () => {
          // Create a canvas to draw the image
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            reject(new Error("Cannot create canvas context"));
            return;
          }
          
          // Set canvas dimensions to image size
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image to canvas
          context.drawImage(img, 0, 0);
          
          // Get image data for QR code processing
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          
          // Use jsQR to detect QR code
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            // Successfully detected QR code
            resolve(code.data);
            toast.success("QR code detected automatically");
          } else {
            toast.error("No QR code found in image");
            reject(new Error("No QR code detected"));
          }
        };
        
        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };
        
        // Set image source from FileReader result
        if (e.target && e.target.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error("Failed to read file"));
        }
      } catch (error) {
        console.error("Error processing QR code:", error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    
    reader.readAsDataURL(file);
  });
};
