
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.qrcode.card',
  appName: 'QR Card Vault',
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
    },
    Keyboard: {
      resize: "body",
      style: "dark",
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#333333",
    },
    CapacitorUpdater: {
      autoUpdate: true
    }
  },
  android: {
    buildOptions: {
      keystorePath: "android.keystore",
      keystoreAlias: "qrcodecardvault"
    }
  }
};

export default config;
