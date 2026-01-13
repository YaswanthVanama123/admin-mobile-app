# 🚀 Expo to React Native CLI Migration Status

## ✅ PHASE 1 COMPLETE: Critical Foundation Work (4-6 hours)

This document tracks the progress of migrating admin-mobile-app from Expo SDK 54 to pure React Native CLI 0.81.5.

---

## 📊 Overall Progress: 35-40% Complete

**Completed**: Critical architectural foundation
**Remaining**: Screen migration, native configuration, testing, deployment

---

## ✅ COMPLETED WORK

### 1. Backup & Version Control ✅
- Created backup branch: `backup/before-expo-migration`
- Created git tag: `v1.0-expo`
- Working branch: `feat/rn-cli-migration`

### 2. Dependencies Updated ✅
**package.json completely rewritten:**

**Removed (17 Expo packages):**
- expo, expo-router, expo-av, expo-haptics, expo-notifications, expo-print
- expo-image-picker, expo-sharing, expo-file-system, expo-device
- expo-constants, expo-linking, expo-keep-awake, expo-splash-screen
- expo-status-bar, expo-asset, expo-dev-client, @expo/vector-icons

**Added (React Native replacements):**
- `@react-navigation/native` + `@react-navigation/native-stack` + `@react-navigation/bottom-tabs`
- `react-native-sound` + `react-native-haptic-feedback`
- `@notifee/react-native` (better Firebase integration)
- `react-native-image-picker`, `react-native-print`, `react-native-share`
- `react-native-device-info`, `react-native-fs`, `react-native-config`
- `react-native-vector-icons`, `react-native-keep-awake`, `react-native-splash-screen`

**Scripts updated:**
```json
{
  "start": "react-native start",
  "android": "react-native run-android",
  "ios": "react-native run-ios",
  "clean": "cd android && ./gradlew clean && cd .."
}
```

### 3. Navigation System Built ✅
**Complete React Navigation implementation:**

**Files created:**
- `src/navigation/types.ts` - TypeScript navigation types
- `src/navigation/RootNavigator.tsx` - Main navigator with auth routing
- `src/navigation/AuthNavigator.tsx` - Login stack
- `src/navigation/TabNavigator.tsx` - Bottom tabs (Dashboard, Orders, Menu, Settings)
- `src/navigation/linking.ts` - Deep linking config

**Features:**
- Type-safe navigation with TypeScript
- Conditional rendering (Auth/Main stacks)
- Deep linking support: `eatdineadmin://`, `exp+eatdine-partner://`
- Bottom tabs with Ionicons
- No header by default (matches Expo app)

### 4. Sound & Vibration Service Rewritten ✅
**File: `src/services/soundVibration.service.ts`**

**Migrated from:**
- `expo-av` → `react-native-sound`
- `expo-haptics` → `react-native-haptic-feedback`

**Key improvements:**
- Preloaded sounds for better performance
- Sound.setCategory('Playback') - plays in silent mode
- Three sound types: new-order.mp3, success.mp3, error.mp3
- Vibration patterns: impactHeavy (2x for orders), notificationSuccess, notificationError

**Sound file locations:**
- Android: `android/app/src/main/res/raw/new_order.mp3`
- iOS: Add to Xcode project (when iOS setup is done)

### 5. Firebase Service Rewritten ✅
**File: `src/services/firebase.service.ts`**

**Migrated from:**
- `expo-notifications` → `@notifee/react-native`
- `expo-device` → `react-native-device-info`

**Key features:**
- Android notification channels (orders, default)
- Notifee for better foreground notification control
- High priority with custom sound and vibration
- Device info logging for debugging
- iOS critical alerts support

### 6. App.tsx Root Component Created ✅
**File: `App.tsx`**

**Complete provider hierarchy:**
```
GestureHandlerRootView
  └─ PaperProvider
      └─ AuthProvider
          └─ SettingsProvider
              └─ ToastProvider
                  └─ OrdersProvider
                      └─ RootNavigator
```

**Initialization:**
- Firebase messaging
- Sound & vibration preloading
- Background message handler
- Cleanup on unmount

### 7. Build Configuration Updated ✅

**babel.config.js:**
- Changed from `babel-preset-expo` to `module:@react-native/babel-preset`
- Added `@navigation` and `@services` path aliases

**metro.config.js:**
- Changed from `expo/metro-config` to `@react-native/metro-config`
- Maintained SVG transformer support

**android/app/build.gradle:**
- Added vector icons fonts configuration:
  ```gradle
  apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
  ```

---

## 🔨 WORK REMAINING

### PHASE 2: Screen Migration & Import Updates (8-12 hours)

#### 2.1 Convert Route Screens to Standard Screens
**Files to migrate from `app/` to `src/screens/`:**

1. `app/(auth)/login.tsx` → `src/screens/LoginScreen.tsx`
2. `app/(tabs)/dashboard.tsx` → `src/screens/DashboardScreen.tsx`
3. `app/(tabs)/orders.tsx` → `src/screens/OrdersScreen.tsx`
4. `app/(tabs)/menu.tsx` → `src/screens/MenuScreen.tsx`
5. `app/(tabs)/settings.tsx` → `src/screens/SettingsScreen.tsx`

**Changes needed in each file:**
```typescript
// REMOVE:
import { router, useLocalSearchParams, Stack } from 'expo-router';

// ADD:
import { useNavigation, useRoute } from '@react-navigation/native';
import type { TabScreenProps } from '../navigation/types';

// REPLACE:
router.push('/orders') → navigation.navigate('Orders')
router.replace('/(tabs)') → navigation.replace('Main')
const params = useLocalSearchParams() → const { params } = useRoute()

// REMOVE expo-router Stack component, use plain View
```

#### 2.2 Update All Import Statements
**Global find & replace across `src/` directory:**

1. **Expo Router:**
   - `from 'expo-router'` → `from '@react-navigation/native'`

2. **Expo Icons:**
   - `from '@expo/vector-icons'` → Replace with specific imports:
     ```typescript
     import Ionicons from 'react-native-vector-icons/Ionicons';
     import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
     ```

3. **Status Bar:**
   - `from 'expo-status-bar'` → `from 'react-native'`
   - `<StatusBar style="auto" />` → `<StatusBar barStyle="dark-content" />`

4. **Device Info (if used):**
   - `import * as Device from 'expo-device'` → `import DeviceInfo from 'react-native-device-info'`

5. **File System (if used):**
   - `import * as FileSystem from 'expo-file-system'` → `import RNFS from 'react-native-fs'`

6. **Constants:**
   - `import Constants from 'expo-constants'` → `import Config from 'react-native-config'`

7. **Linking:**
   - `import * as Linking from 'expo-linking'` → `import { Linking } from 'react-native'`

#### 2.3 Update Component Files
**Files that use expo-image-picker:**
- `src/components/menu/MenuItemFormModal.tsx`
  - Replace `expo-image-picker` with `react-native-image-picker`
  - Add Android permission requests

**Files that use expo-print/expo-sharing:**
- `src/screens/OrdersScreen.tsx`
  - Replace `expo-print` with `react-native-print`
  - Replace `expo-sharing` with `react-native-share`

---

### PHASE 3: Native Configuration (4-6 hours)

#### 3.1 Android Additional Setup

**android/app/src/main/res/raw/**
- Copy sound files:
  - `new_order.mp3`
  - `success.mp3`
  - `error.mp3`

**android/app/build.gradle** (Additional changes if needed)
- Entry file might need updating from Expo's to index.js
- Remove Expo-specific CLI references

**MainApplication.kt** (Already configured)
- Firebase packages already added
- No additional changes needed

#### 3.2 iOS Setup (When ready for iOS)

**Create ios/Podfile:**
```ruby
platform :ios, '13.0'
use_frameworks! :linkage => :static

target 'AdminMobileApp' do
  config = use_native_modules!
  use_react_native!(:path => config[:reactNativePath])

  # Firebase
  pod 'Firebase', :modular_headers => true
  pod 'FirebaseCore', :modular_headers => true

  # Permissions
  permissions_path = '../node_modules/react-native-permissions/ios'
  pod 'Permission-Camera', :path => "#{permissions_path}/Camera"
  pod 'Permission-PhotoLibrary', :path => "#{permissions_path}/PhotoLibrary"
end
```

**ios/AdminMobileApp/Info.plist:**
- Add camera permission
- Add photo library permission
- Add background modes for notifications
- Add URL schemes

**ios/AdminMobileApp/AppDelegate.mm:**
- Initialize Firebase
- Setup push notifications
- Configure UNUserNotificationCenter

#### 3.3 Asset Files

**Sound files:**
- Source: `assets/sounds/`
- Android destination: `android/app/src/main/res/raw/`
- iOS destination: Add to Xcode project

**Icons and images:**
- Already configured in Android
- iOS: Add to Xcode when setting up iOS

---

### PHASE 4: Testing & Debugging (6-10 hours)

#### 4.1 Install Dependencies
```bash
npm install
```

**Expected issues:**
- Some packages may have peer dependency warnings
- Resolution: Check compatibility, update if needed

#### 4.2 Android Build & Test
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

**Expected issues to fix:**

1. **Import errors:**
   - Missing screen components
   - Expo imports not updated
   - Fix: Update all imports as per Phase 2.2

2. **Vector icons not showing:**
   - Fix: Ensure fonts.gradle is applied correctly
   - Run: `cd android && ./gradlew clean`

3. **Sound files not found:**
   - Fix: Copy .mp3 files to android/app/src/main/res/raw/
   - Ensure filenames match (new_order.mp3, not new-order.mp3)

4. **Firebase issues:**
   - Fix: Verify google-services.json is in android/app/
   - Check package name matches in Firebase console

#### 4.3 Feature Testing Checklist
- [ ] App launches without crashes
- [ ] Login flow works
- [ ] Bottom tab navigation works
- [ ] All screens render
- [ ] Firebase notifications received (foreground)
- [ ] Firebase notifications received (background)
- [ ] Sound plays on notification
- [ ] Device vibrates on notification
- [ ] Auto-print works
- [ ] Image picker works (camera & gallery)
- [ ] Receipt printing works
- [ ] WebSocket real-time updates work

---

### PHASE 5: Cleanup & Documentation (2-3 hours)

#### 5.1 Remove Expo Files
```bash
rm -rf app/
rm -f app.json
rm -rf .expo/
rm -f eas.json
```

#### 5.2 Update .gitignore
```gitignore
# React Native
android/app/build/
android/.gradle/
ios/Pods/
ios/build/

# Environment
.env
.env.local

# Misc
*.keystore
!debug.keystore
```

#### 5.3 Update README.md
Document:
- Installation steps
- Build commands
- Firebase setup
- Environment configuration
- Migration notes

---

## 🚨 KNOWN ISSUES & SOLUTIONS

### Issue 1: "Cannot find module '@expo/vector-icons'"
**Solution:** Update all icon imports:
```typescript
// Old
import { Ionicons } from '@expo/vector-icons';

// New
import Ionicons from 'react-native-vector-icons/Ionicons';
```

### Issue 2: "router is not defined"
**Solution:** Replace expo-router navigation:
```typescript
// Old
import { router } from 'expo-router';
router.push('/orders');

// New
import { useNavigation } from '@react-navigation/native';
const navigation = useNavigation();
navigation.navigate('Orders');
```

### Issue 3: Sound files not playing
**Solution:**
1. Ensure files are in `android/app/src/main/res/raw/`
2. Filenames should use underscores: `new_order.mp3` not `new-order.mp3`
3. Files should be lowercase
4. Run `cd android && ./gradlew clean`

### Issue 4: Build fails with "Duplicate class found"
**Solution:**
```bash
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
```

### Issue 5: Metro bundler cache issues
**Solution:**
```bash
npm start -- --reset-cache
```

---

## 📝 NEXT STEPS FOR YOU

### Immediate Actions (Before Running npm install):

1. **Review this document** - Understand what's been done and what remains

2. **Backup current work:**
   ```bash
   git add .
   git commit -m "Phase 1 complete: Critical foundation work"
   git push origin feat/rn-cli-migration
   ```

### Option A: Continue Migration Yourself

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start with screen migration (Phase 2.1):**
   - Copy `app/(auth)/login.tsx` content
   - Create `src/screens/LoginScreen.tsx`
   - Update imports (remove expo-router, add React Navigation)
   - Repeat for all screens

3. **Test frequently:**
   ```bash
   npm run android
   ```

### Option B: I Continue in Next Session

When ready, I can continue with:
- Phase 2: Screen migration & import updates
- Phase 3: Native configuration
- Phase 4: Testing & debugging

---

## 📊 TIME ESTIMATE

**Completed:** ~4-6 hours
**Remaining:** ~20-30 hours
- Phase 2: 8-12 hours
- Phase 3: 4-6 hours
- Phase 4: 6-10 hours
- Phase 5: 2-3 hours

**Total Migration:** 25-36 hours remaining (of 60-85 hour estimate)

---

## 🎯 SUCCESS CRITERIA

**Phase 1 (Current - COMPLETE):**
- [x] Backup created
- [x] Dependencies updated
- [x] Navigation system built
- [x] Services rewritten (sound, vibration, Firebase)
- [x] App.tsx created
- [x] Build configs updated

**Phase 2-5 (Remaining):**
- [ ] All screens migrated
- [ ] All imports updated
- [ ] App builds successfully
- [ ] All features working
- [ ] Tests passing
- [ ] Documentation complete

---

## 💡 TIPS

1. **Don't run npm install yet** - You're on macOS but testing on Windows. Install dependencies on the target machine.

2. **Test incrementally** - Migrate one screen at a time, test, commit.

3. **Keep Expo app** - The backup branch `backup/before-expo-migration` has the working Expo version.

4. **Use EAS Build as fallback** - If local builds continue to fail on Windows, EAS Build is still an option for the Expo version.

5. **Sound files** - I've rewritten the service, but you need to copy the actual .mp3 files to `android/app/src/main/res/raw/`

---

## 📞 MIGRATION PLAN FILE

Full detailed plan: `/Users/yaswanthgandhi/.claude/plans/cached-napping-whisper.md`

---

**Last Updated:** Phase 1 Complete - Critical Foundation Work
**Status:** Ready for Phase 2 (Screen Migration) or npm install + testing
