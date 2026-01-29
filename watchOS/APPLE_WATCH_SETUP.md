# Apple Watch App Setup & Submission Guide

This guide explains how to add the Chill Timer Apple Watch app to your Expo/React Native project and submit it to the App Store.

## Overview

The watchOS app is a native SwiftUI application that mirrors the iPhone app's functionality:
- **Timer Screen**: Circular timer display with progress indicator, start/stop/pause controls
- **Settings Screen**: Duration picker and volume slider
- **Navigation**: Swipe left/right to switch between screens

## Prerequisites

- macOS with Xcode 15.0 or later
- Apple Developer account
- CocoaPods installed (`sudo gem install cocoapods`)
- Node.js and Yarn installed

---

## Step 1: Generate Native iOS Project

Since this is an Expo managed project, you first need to generate the native iOS project:

```bash
# From the project root directory
npx expo prebuild --platform ios
```

This creates the `ios/` directory with the native Xcode project.

---

## Step 2: Add Watch App Target to Xcode Project

### 2.1 Open the iOS Project in Xcode

```bash
open ios/ChillTimer.xcworkspace
```

> **Note**: Always open the `.xcworkspace` file, not the `.xcodeproj`, as the project uses CocoaPods.

### 2.2 Create Watch App Target

1. In Xcode, go to **File → New → Target**
2. Select **watchOS** tab
3. Choose **App** (not "App with Companion")
4. Click **Next**
5. Configure the target:
   - **Product Name**: `ChillTimer Watch App`
   - **Bundle Identifier**: `com.chill.timer.watchkitapp`
   - **Language**: Swift
   - **User Interface**: SwiftUI
   - **Watch App**: Check "Include Notification Scene" (optional)
6. Click **Finish**
7. When prompted to activate the scheme, click **Activate**

### 2.3 Delete Auto-Generated Files

Xcode creates template files that we'll replace with our custom implementation:

1. In the Project Navigator, find the `ChillTimer Watch App` group
2. Delete these auto-generated files (Move to Trash):
   - `ContentView.swift`
   - `ChillTimer_Watch_AppApp.swift` (or similar)
3. Keep:
   - `Assets.xcassets`
   - `Info.plist` (we'll modify this)

---

## Step 3: Add Source Files

### 3.1 Copy Source Files to Xcode

1. In Finder, navigate to the `watchOS/ChillTimer Watch App/` directory
2. In Xcode, right-click on the `ChillTimer Watch App` group
3. Select **Add Files to "ChillTimer"...**
4. Navigate to and select:
   - `ChillTimerWatchApp.swift`
   - `ContentView.swift`
   - `Views/` folder (entire folder)
   - `ViewModels/` folder (entire folder)
   - `Theme/` folder (entire folder)
   - **Do not add** `Info.plist` from this folder — the Watch target uses `ios/ChillTimerWatchApp-Info.plist` instead to avoid "Multiple commands produce Info.plist" when using a synchronized root group.
5. Ensure these options are checked:
   - ☑️ Copy items if needed
   - ☑️ Create groups
   - ☑️ Add to targets: `ChillTimer Watch App`
6. Click **Add**

### 3.2 Verify File Structure

Your project navigator should look like this:
```
ChillTimer Watch App/
├── ChillTimerWatchApp.swift
├── ContentView.swift
├── Views/
│   ├── TimerView.swift
│   └── SettingsView.swift
├── ViewModels/
│   └── TimerViewModel.swift
├── Theme/
│   └── Theme.swift
├── Assets.xcassets/
└── Info.plist
```

---

## Step 4: Configure Info.plist

The Watch target uses **`ios/ChillTimerWatchApp-Info.plist`** (at the `ios/` level), not a plist inside the Watch App folder. This avoids Xcode's "Multiple commands produce Info.plist" error when the Watch app group is a synchronized root group. Replace or ensure the contents of `ios/ChillTimerWatchApp-Info.plist` contain:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>$(DEVELOPMENT_LANGUAGE)</string>
    <key>CFBundleDisplayName</key>
    <string>Chill Timer</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
    </array>
    <key>WKApplication</key>
    <true/>
    <key>WKCompanionAppBundleIdentifier</key>
    <string>com.chill.timer</string>
    <key>WKRunsIndependentlyOfCompanionApp</key>
    <true/>
</dict>
</plist>
```

---

## Step 5: Configure App Icons

### 5.1 Generate Watch App Icons

You need to generate icons at multiple sizes for the Watch app. Use your existing `1024x1024.png` icon.

**Option A: Use an online tool**
1. Go to [App Icon Generator](https://appicon.co/) or similar
2. Upload your 1024x1024 icon
3. Select watchOS and download the icons
4. Copy the generated icons to `ChillTimer Watch App/Assets.xcassets/AppIcon.appiconset/`

**Option B: Use a script**

Create icons using ImageMagick (if installed):

```bash
cd assets/images

# Create watch icon sizes
convert 1024x1024.png -resize 48x48 AppIcon-24@2x.png
convert 1024x1024.png -resize 55x55 AppIcon-27.5@2x.png
convert 1024x1024.png -resize 58x58 AppIcon-29@2x.png
convert 1024x1024.png -resize 87x87 AppIcon-29@3x.png
convert 1024x1024.png -resize 66x66 AppIcon-33@2x.png
convert 1024x1024.png -resize 80x80 AppIcon-40@2x.png
convert 1024x1024.png -resize 88x88 AppIcon-44@2x.png
convert 1024x1024.png -resize 92x92 AppIcon-46@2x.png
convert 1024x1024.png -resize 100x100 AppIcon-50@2x.png
convert 1024x1024.png -resize 102x102 AppIcon-51@2x.png
convert 1024x1024.png -resize 108x108 AppIcon-54@2x.png
convert 1024x1024.png -resize 172x172 AppIcon-86@2x.png
convert 1024x1024.png -resize 196x196 AppIcon-98@2x.png
convert 1024x1024.png -resize 216x216 AppIcon-108@2x.png
convert 1024x1024.png -resize 234x234 AppIcon-117@2x.png
convert 1024x1024.png -resize 258x258 AppIcon-129@2x.png
cp 1024x1024.png AppIcon-1024.png
```

### 5.2 Add Icons to Asset Catalog

1. In Xcode, select `Assets.xcassets` under `ChillTimer Watch App`
2. Select `AppIcon`
3. Drag and drop each icon to its corresponding slot, or use the Contents.json from `watchOS/ChillTimer Watch App/Assets.xcassets/AppIcon.appiconset/`

---

## Step 6: Configure Build Settings

### 6.1 Set Bundle Identifier

1. Select the `ChillTimer Watch App` target
2. Go to **Signing & Capabilities** tab
3. Set Bundle Identifier to: `com.chill.timer.watchkitapp`
4. Select your Team
5. Enable "Automatically manage signing"

### 6.2 Set Deployment Target

1. Select the `ChillTimer Watch App` target
2. Go to **General** tab
3. Set **Minimum Deployment** to watchOS 9.0 or later

### 6.3 Embed Watch App in iOS App

1. Select the main `ChillTimer` target (iOS app)
2. Go to **General** tab
3. Scroll to **Frameworks, Libraries, and Embedded Content**
4. Click **+** and add `ChillTimer Watch App.app`
5. Set **Embed** to "Embed & Sign"

Alternatively, in **Build Phases**:
1. Add a new **Embed Watch Content** phase
2. Add `ChillTimer Watch App.app`

---

## Step 7: Test on Simulator/Device

### 7.1 Run on Simulator

1. Select the `ChillTimer Watch App` scheme from the scheme selector
2. Choose an Apple Watch simulator (paired with an iPhone simulator)
3. Click **Run** (⌘R)

### 7.2 Test on Physical Device

1. Pair your Apple Watch with your iPhone
2. Connect your iPhone to your Mac
3. In Xcode, select your physical devices
4. Run the app (⌘R)

---

## Step 8: Archive & Submit to App Store

### 8.1 Update Version Numbers

Ensure both iOS and watchOS apps have matching version numbers:

1. Select each target and update:
   - **Version**: 1.0.1 (or your current version)
   - **Build**: 1 (increment for each submission)

### 8.2 Create Archive

1. Select **Any iOS Device (arm64)** as the build destination
2. Go to **Product → Archive**
3. Wait for the archive to complete

### 8.3 Upload to App Store Connect

1. When the archive completes, the Organizer window opens
2. Select your archive
3. Click **Distribute App**
4. Choose **App Store Connect**
5. Click **Next** through the options (use defaults)
6. Click **Upload**

### 8.4 Submit for Review

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Create a new version or update existing
4. In the **Build** section, select the uploaded build
5. Fill in release notes mentioning the new Watch app
6. Submit for review

---

## Troubleshooting

### "No matching provisioning profile"
- Ensure your Apple Developer account is added in Xcode → Preferences → Accounts
- Enable "Automatically manage signing" for both targets
- Check that the bundle identifiers are registered in App Store Connect

### "WKCompanionAppBundleIdentifier mismatch"
- The `WKCompanionAppBundleIdentifier` in Watch app's Info.plist must exactly match the iOS app's bundle identifier (`com.chill.timer`)

### Watch app doesn't appear on device
- Ensure the Watch app is embedded in the iOS app (Step 6.3)
- On your iPhone, open the Watch app and check if Chill Timer is listed under "Available Apps"

### Build errors with Swift files
- Ensure all Swift files are added to the correct target
- Check that file references aren't broken (red filenames in project navigator)

### "Multiple commands produce ... Info.plist"
- This happens when the Watch app's **synchronized root group** copies `Info.plist` into the app bundle and the target also processes an Info.plist (copy + process = two outputs). Fix: use a **single** Info.plist **outside** the Watch App folder:
  1. Keep the Watch plist at **`ios/ChillTimerWatchApp-Info.plist`** (not inside `Chill Timer Watch App/`).
  2. In the **Chill Timer Watch App** target → **Build Settings**, set **Info.plist File** to `ChillTimerWatchApp-Info.plist`.
  3. **Do not add** `Info.plist` from the Watch App folder when adding source files; leave that folder without an Info.plist so the sync group does not copy it.

---

## File Structure Reference

```
meditation-timer/
├── watchOS/
│   ├── APPLE_WATCH_SETUP.md (this file)
│   └── ChillTimer Watch App/
│       ├── ChillTimerWatchApp.swift    # App entry point
│       ├── ContentView.swift           # Main view with TabView navigation
│       ├── Info.plist                  # Reference only; do not add to Xcode (see Step 4)
│       ├── Views/
│       │   ├── TimerView.swift         # Timer screen
│       │   └── SettingsView.swift     # Settings screen
│       ├── ViewModels/
│       │   └── TimerViewModel.swift   # Timer state management
│       ├── Theme/
│       │   └── Theme.swift             # Colors and gradients
│       └── Assets.xcassets/
│           ├── AccentColor.colorset/
│           └── AppIcon.appiconset/
└── ios/  (generated by expo prebuild)
    ├── ChillTimerWatchApp-Info.plist   # Watch app Info.plist (used by target; avoids duplicate-output error)
    └── Chill Timer Watch App/         # Source files; no Info.plist in this folder
```

---

## App Features

### Timer Screen
- Circular timer display with gradient background
- 60 tick marks showing progress
- Status text (Ready/Running/Overtime/Paused)
- Large countdown display
- Control buttons: Start, Stop, Pause/Resume, Reset
- Haptic feedback on all interactions
- Tap timer circle to start/stop

### Settings Screen
- Duration picker with +/- buttons
- Preset duration buttons (5, 10, 15, 30, 60 min)
- Volume slider (0-100%)
- Settings persist between app launches

### Navigation
- Swipe left to go from Timer to Settings
- Swipe right to return to Timer
- Page indicator dots at bottom

---

## Design Specifications

Colors match the iPhone app:
- Background: `#151515` (deep dark gray)
- Surface: `#2A2A2A` (dark gray)
- Primary: `#FF6B4A` (coral/orange)
- Accent: `#FFB347` (golden yellow)
- Water: `#4A90D9` → `#2E5A88` (blue gradient)
- Overtime: `#FF5F45` (coral red)

---

## Support

If you encounter issues:
1. Check the Xcode console for error messages
2. Verify all files are properly added to the target
3. Ensure signing is correctly configured
4. Clean build folder: **Product → Clean Build Folder** (⇧⌘K)
