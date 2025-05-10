
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { UserData, CardData } from "@/types";
import QRCode from "react-qr-code";

interface VirtualCardProps {
  userData: UserData;
  cardData: CardData;
}

export const VirtualCard: React.FC<VirtualCardProps> = ({ userData, cardData }) => {
  return (
    <Card className="overflow-hidden border-2 border-brand-purple shadow-lg">
      <CardContent className="p-0">
        <AspectRatio ratio={1.6} className="bg-gradient-to-br from-brand-purple to-brand-light-purple">
          <div className="flex flex-col md:flex-row h-full w-full">
            {/* User Info Section */}
            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {userData.name}
                </h2>
                <p className="text-white/80 text-sm mb-4">
                  {userData.email}
                </p>
                {userData.phoneNumber && (
                  <p className="text-white/80 text-sm">
                    {userData.phoneNumber}
                  </p>
                )}
              </div>
              
              <div>
                <p className="text-white/70 text-xs">
                  ID: {userData.id}
                </p>
                <p className="text-white/70 text-xs">
                  Created: {new Date(userData.createdAt).toLocaleDateString()}
                </p>
                {cardData.validatedAt && (
                  <p className="text-white/70 text-xs">
                    Last validated: {new Date(cardData.validatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            
            {/* QR Code Section - Adjusted for better sizing */}
            <div className="bg-white p-4 flex items-center justify-center" style={{ minWidth: '160px', width: '35%' }}>
              <div className="p-2 bg-white rounded w-full max-w-[140px]">
                <QRCode
                  value={cardData.qrCode}
                  size={128}
                  style={{ 
                    height: "auto", 
                    maxWidth: "100%", 
                    width: "100%" 
                  }}
                  viewBox={`0 0 256 256`}
                />
              </div>
            </div>
          </div>
        </AspectRatio>
      </CardContent>
    </Card>
  );
};

export default VirtualCard;
