
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7c45f573d19b48c2bd337b109e7100e3',
  appName: 'qrcode-card',
  webDir: 'dist',
  server: {
    url: "https://7c45f573-d19b-48c2-bd33-7b109e7100e3.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#333333",
      showSpinner: true,
      spinnerColor: "#FFFFFF",
    }
  }
};

export default config;
