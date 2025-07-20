# Notifly

A React Native application that demonstrates Firebase Cloud Messaging (FCM) with themed notification handling and badge management. The app showcases dynamic theme switching between Mountain, River, and Beach themes based on push notifications.

## Features

- **Firebase Cloud Messaging Integration**: Receives and handles push notifications
- **Dynamic Theme Switching**: Changes app theme based on notification content
- **Notification Count Management**: Tracks notification counts on system notifications
- **Push Notification Storage**: Stores received notifications locally
- **Backend Integration**: FastAPI backend for sending themed notifications
- **Cross-Platform**: Supports Android (iOS support available)

## Architecture

### Frontend (React Native)

- **App.jsx**: Main navigation and FCM token registration
- **Screens**: Theme-specific screens (Beach, Mountain, River, Home)
- **Android Native Modules**: Kotlin-based notification handling

### Backend (FastAPI)

- **Token Management**: Stores and manages FCM device tokens
- **Notification Sending**: Sends themed notifications via Firebase Admin SDK
- **Theme Validation**: Validates notification themes before sending

### Android Native Components

- **MyFirebaseMessagingService**: Handles incoming FCM messages
- **NotificationHandler**: Manages notification storage and badge counts
- **NotificationModule**: React Native bridge for notification functionality

## Prerequisites

- Node.js (v18 or higher)
- React Native CLI
- Android Studio and Android SDK
- Python 3.8+ (for backend)
- Firebase project with Cloud Messaging enabled

## Setup Instructions

### 1. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Cloud Messaging
3. Add your Android app to the project
4. Download `google-services.json` and place it in `android/app/`
5. Generate a service account key and save as `backend/serviceAccountKey.json`

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start the backend server (accessible from other devices on same network)
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Important**: The backend will start on `http://0.0.0.0:8000` to allow access from your mobile device.

**Network Configuration:**

1. Ensure your laptop and mobile device are on the same WiFi network
2. Find your laptop's IP address:
   - **Windows**: Open Command Prompt → `ipconfig` → Look for "IPv4 Address"
   - **macOS/Linux**: Open Terminal → `ifconfig` or `ip addr show` → Look for your network interface IP
   - **Alternative**: Run `hostname -I` (Linux) or check your WiFi settings

Example IP addresses: `192.168.1.100`, `192.168.0.150`, `10.0.0.25`, etc.

### 3. Android App Setup

```bash
# Install dependencies
npm install

# IMPORTANT: Update backend IP address in App.jsx
# 1. Find your laptop's IP address (see Backend Setup section above)
# 2. Open App.jsx and locate line ~33:
#    const response = await fetch('http://192.168.101.142:8000/register', {
# 3. Replace 192.168.101.142 with your actual laptop IP address
# 4. Keep the port as 8000
# Example: 'http://192.168.1.100:8000/register'

# Run on Android device/emulator
npx react-native run-android
```

**Network Requirements:**

- Your mobile device and laptop must be on the same WiFi network
- The IP address in App.jsx must match your laptop's actual IP address
- Port 8000 should remain unchanged

## Usage

### Sending Notifications

Use the backend API to send themed notifications:

```bash
# Register FCM token (automatic when app starts)
POST http://YOUR_LAPTOP_IP:8000/register
{
  "token": "FCM_DEVICE_TOKEN"
}

# Send themed notification
POST http://YOUR_LAPTOP_IP:8000/notify
{
  "title": "Notification Title",
  "message": "Notification message",
  "theme": "mountain"  // Options: mountain, river, beach
}

# Example with actual IP:
# POST http://192.168.1.100:8000/notify
```

### App Behavior

1. **Token Registration**: App automatically registers FCM token on startup
2. **Theme Switching**: Notifications change app theme based on `theme` data
3. **Badge Updates**: Notification badge count updates in real-time
4. **Notification Storage**: All notifications are stored locally and can be retrieved

## API Endpoints

- `POST /register` - Register FCM device token
- `POST /notify` - Send themed notification
- `GET /ping` - Health check endpoint

## File Structure

```
Notifly/
├── android/
│   ├── app/
│   │   ├── src/main/java/com/ashwith/notifly/
│   │   │   ├── MyFirebaseMessagingService.kt
│   │   │   ├── NotificationHandler.kt
│   │   │   ├── NotificationModule.kt
│   │   │   └── NotificationPackage.kt
│   │   └── src/main/AndroidManifest.xml
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── serviceAccountKey.json
├── screens/
│   ├── BeachScreen.jsx
│   ├── MountainScreen.jsx
│   ├── RiverScreen.jsx
│   └── HomeScreen.jsx
├── App.jsx
└── package.json
```

## Development

### Running in Development Mode

```bash
# Start Metro bundler
npx react-native start

# Run on Android
npx react-native run-android

# View logs
npx react-native log-android
```

### Building for Production

```bash
cd android
./gradlew assembleRelease
```

## Dependencies

### React Native

- @react-native-firebase/app: Firebase core functionality
- @react-native-firebase/messaging: FCM integration
- @react-navigation: Navigation framework
- react-native-gesture-handler: Gesture handling

### Backend

- fastapi: Web framework
- firebase-admin: Firebase Admin SDK
- pydantic: Data validation
