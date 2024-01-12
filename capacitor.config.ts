import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'angular.join.app',
  appName: 'angular-join',
  webDir: 'dist/angular-join',
  server: {
    androidScheme: 'https'
  }
};

export default config;
