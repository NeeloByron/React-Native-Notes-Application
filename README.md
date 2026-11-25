# React Native Notes Application

A mobile notes application built with React Native, Expo, TypeScript, and NativeWind. The application allows users to create accounts, securely sign in, organize personal notes and manage their profiles.

## Features

### Authentication and Account Management

- Welcome screen with Sign In and Sign Up navigation.
- Local account registration and sign-in.
- Password hashing with `bcryptjs`.
- Confirm Password validation during registration.
- Persistent signed-in session.
- Sign-out functionality.
- Authentication-based route protection.
- Profile management (update username and email).
- Change password with current-password verification.
- Account deletion with password verification

### Notes Management 

- Create, view, edit and delete notes.
- Organize notes into Work, Study and Personal categories.
- Filter notes by category.
- Category counts on the Home screen.
- Search notes by title or content.
- Sort notes by most recently updated or oldest updated.
- Automatic note creation and edit timestamps.
- Display category counts on the Home screen.
- Helpful empty states when no notes are available or when search returns no results.

### Data Storage and Security 

- Store user accounts and notes locally using AsyncStorage.
- Hash passwords using bycryptjs instead of storing plain-text passwords.
- Keep user notes associated with their account.
- Delete a user's notes when their accout is deleted.

## Tech Stack 

- React-Native - Mobile application framework
- Expo - Development and build platform
- TypeScript - Type Safety
- Expo Router - Navigation and routing
- NativeWind - Tailwind CSS styling for React Native
- AsyncStorage - Local data persistence
- bcryptjs - Password hashing
- Expo - Secure random values and UUID generation

## Project Setup

Prerequisites
 - Node.js
 - npm
 - Expo-compatible development environment
 - Andriod Studio/Andriod device for testing

Installation

Clone the repository:

```bash
# Clone the repository:
git clone https://github.com/NeeloByron/React-Native-Notes-Application.git
```

```bash
# cd project folder:
cd React-Native-Notes-Application
```

```bash
# install dependencies:
npm install 
```

```bash
# start the development server:
npm expo start
```

You can then run the application using an Android emulator or a compatible device with Expo Go, depending on the project's native dependencies.

## Building the Andriod APK
 
The Andriod APK can be built using Expo Application Services (EAS)

```bash
# Install -g eas-cli:
npm install -g eas-cli
```

```bash
# Login in to Expo:
eas login
```

```bash
# Configure EAS Build if it has not already been configured
eas build:configure

# For an installable Android APK, configure an APK build profile in eas.json, for example:

{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}

```

```bash
# Start the APK build:
eas build --platform android --profile preview
```

## Download the Android APK

The Andriod APK will be avaiable through Google Drive.