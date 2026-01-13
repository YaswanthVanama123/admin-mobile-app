# PatLinks Admin Mobile App

Admin mobile application for the PatLinks platform built with React Native and Expo.

## Features

- Expo managed workflow with TypeScript
- Expo Router for file-based routing
- React Native Paper for Material Design components
- Socket.io for real-time updates
- Axios for API calls
- Context API for state management

## Prerequisites

- Node.js 20.19.4 or higher (Expo SDK 54 / React Native 0.81 relies on Metro 0.83 which only runs on Node >=20.19.4)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator

> **Node 18 warning:** Node 18 can no longer run this project now that Expo uses SDK 54; Metro and many native modules depend on Node 20 APIs, so switch with `nvm use 20.19.4` (or later) before `npm start`.

## Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser
- `npm run build:android` - Build for Android using EAS
- `npm run build:ios` - Build for iOS using EAS
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
admin-mobile-app/
├── app/                    # Expo Router routes
│   ├── (auth)/            # Authentication routes
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   ├── (tabs)/            # Tab navigation routes
│   │   ├── _layout.tsx
│   │   ├── dashboard.tsx
│   │   ├── orders.tsx
│   │   ├── products.tsx
│   │   └── settings.tsx
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry point
├── src/
│   ├── api/               # API services and config
│   ├── components/        # Reusable components
│   ├── context/           # React Context providers
│   ├── screens/           # Screen components (legacy)
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── assets/                # Images, fonts, etc.
├── app.json              # Expo configuration
├── tsconfig.json         # TypeScript configuration
├── babel.config.js       # Babel configuration
├── metro.config.js       # Metro bundler configuration
└── package.json          # Dependencies and scripts
```

## Environment Variables

Create a `.env` file in the root directory:

```
EXPO_PUBLIC_API_URL=http://your-api-url.com/api
```

## Building for Production

### Android

```bash
npm run build:android
```

### iOS

```bash
npm run build:ios
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Proprietary - PatLinks
