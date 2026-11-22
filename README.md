# React Native Notes Application

A mobile notes application built with React Native, Expo, TypeScript, and NativeWind.

## Features

- Welcome screen with Sign In and Sign Up navigation.
- Local account registration and sign-in.
- Password hashing with `bcryptjs`.
- Persistent signed-in session and sign-out.
- Create, view, edit, and delete notes.
- Work, Study, and Personal note categories with category filters.
- Automatic note creation and edit timestamps.
- Search notes by title or content.
- Sort notes by creation date, newest or oldest first.
- Store accounts and notes locally with AsyncStorage.

## Current Limitations

- Accounts and notes are stored on the device and do not sync across devices.
- Profile and credential updates are not implemented yet.
- Categories are filtered on the Home screen; they do not have separate pages yet.
- Route protection still needs to be completed for every notes route.

## Run Locally

Install dependencies:

```bash
npm install