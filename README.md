# 🚨 AcordaÍ

<p align="center">
  <img src="./assets/images/icon.png" width="150" alt="Acordai App Icon">
</p>

**Acordaí** is an open-source mobile app built with **Expo (React Native)** that helps users stay alert while traveling.  
It allows users to **select a destination on the map** and automatically **triggers a loud alarm notification** when they are close to that point — perfect for those who might doze off on a bus, train, or metro ride.

## 📸 Screenshots

<p align="center">
  <img src="./assets/images/screenshot.png" width="50%" alt="Acordai App Icon">
</p>

## ✨ Features

- 🗺️ **Interactive Map:** Select any point on the map as your destination.
- 📍 **Geofencing Alerts:** App monitors when you are near the selected destination — even in background.
- 🔔 **Loud Wake-Up Alarm:** When entering the destination area, an **alarm sound + high-priority notification** plays to wake you up.
- 📱 **Works in Background:** Continues monitoring even when the app is minimized or closed.
- 💤 **Perfect for Commuters:** Designed for people who might nap during travel and don’t want to miss their stop.
- 🌗 **Light/Dark Theme:** Automatically adapts to your device’s appearance.
- 🧭 **Accurate GPS Tracking:** Uses device location services for precision.

---

## 🧩 Technologies Used

- [React Native](https://reactnative.dev/)
- [Expo SDK](https://docs.expo.dev/)
- [expo-location](https://docs.expo.dev/versions/latest/sdk/location/)
- [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [expo-task-manager](https://docs.expo.dev/versions/latest/sdk/task-manager/)
- [react-native-maps](https://github.com/react-native-maps/react-native-maps)

---

## 🏗️ Project Structure

```

acordai/
├── app/
│   ├── index.tsx            # Main screen (Map + Alarm logic)
│   ├── _layout.tsx          # Root layout
│   └── ...
├── assets/
│   ├── alarm.mp3            # Alarm sound
│   ├── images/
│   │   ├── icon.png         # App icon
│   │   ├── splash-icon.png  # Splash screen logo
│   │   └── ...
├── app.json                 # Expo configuration (permissions, plugins, etc.)
├── package.json
└── README.md

````

---

## ⚙️ Setup & Installation

### Prerequisites
Make sure you have the following installed:
- **Node.js** ≥ 18
- **Expo CLI** (`npm install -g expo-cli`)
- **Android Studio** (for emulators and builds)
- **Google Maps API Key** (required for Android map view)

---

### 1. Clone the Repository

```bash
git clone https://github.com/apozinn/acordai.git
cd acordai
````

---

### 2. Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

---

### 3. Configure Google Maps API Key

For Android, open `android/app/src/main/AndroidManifest.xml` and insert:

```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="YOUR_API_KEY_HERE" />
```

You can get a free key from [Google Cloud Console](https://console.cloud.google.com/).

---

### 4. Run the App

```bash
npx expo start
```

* Press **`a`** to open in Android Emulator
* Press **`w`** to open in web browser
* Press **`s`** to scan the QR code on a physical device (via Expo Go)

---

### 5. Building for Production

#### Android

```bash
npx expo prebuild
npx expo build:android
```

This will generate an `.apk` or `.aab` ready to upload to the **Google Play Store**.

#### iOS

```bash
npx expo build:ios
```

You’ll need a valid Apple Developer account to deploy to the App Store.

---

## 🧪 Development & Testing

To simulate proximity alerts without moving:

```ts
import * as Notifications from 'expo-notifications';

export async function simulateArrival() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🚨 Simulated Arrival!',
      body: 'You have reached your selected point (simulation).',
      sound: 'alarm.wav',
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: null,
  });
}
```

Call `simulateArrival()` anywhere to test your notification behavior instantly.

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repository and open pull requests with improvements.

### Suggested areas:

* UI/UX improvements
* Additional alarm customization (volume, vibration, etc.)
* Better offline handling or fallback
* Localization (multilingual support)

---

## 📄 License

This project is licensed under the **GNU LESSER GENERAL PUBLIC LICENSE** — see the [LICENSE](./LICENSE) file for details.

---

## 🌍 Support & Feedback

If you enjoy this project, please give it a ⭐ on GitHub!
Found a bug or have suggestions? Open an [issue](https://github.com/apozinn/acordai/issues).

---

**Acordai** — *Never miss your stop again.*