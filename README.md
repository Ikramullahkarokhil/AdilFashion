# AdilFashion

AdilFashion is a mobile application for managing customer and waskat (traditional clothing) details, built with React Native and Expo Router. The app features user authentication, customer management, and waskat tracking, with persistent data storage using SQLite and AsyncStorage.

## Features

- User authentication (login/logout)
- Customer management (add, update, view details)
- Waskat management (add, update, view details)
- Data persistence with SQLite
- Modern UI using React Native Paper
- Safe area support for all devices

## Project Structure

```
app/
  _layout.jsx           # Main app layout and navigation
  (tabs)/               # Tab navigation screens
    addCustomer.jsx
    index.jsx
    settings.jsx
  screens/              # Stack navigation screens
    CustomerDetails.jsx
    Login.jsx
    WaskatDetails.jsx
components/
  ui/                   # Reusable UI components
    AddCustomer.jsx
    Backup.jsx
    ConfirmationDialog.jsx
    ResetPassword.jsx
    Restore.jsx
    UpdateCustomerModel.jsx
    UpdateWaskatModel.jsx
    Waskat.jsx
assets/                  # App icons and images
android/                 # Android native project files
```

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd AdilFashion
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```sh
   expo start
   ```

### Running on Android

- Use an Android emulator or connect a physical device with USB debugging enabled.
- Run the app from the Expo Go app or use `expo run:android`.

## Database

- The app uses SQLite for persistent storage, initialized on first launch.
- AsyncStorage is used for simple key-value storage (e.g., login state).

## Customization

- Update UI components in `components/ui/` as needed.
- Modify navigation in `app/_layout.jsx`.

## License

This project is licensed under the MIT License.
