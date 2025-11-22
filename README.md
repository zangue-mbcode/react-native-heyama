# Heyama Mobile - React Native + Expo

Modern native mobile application for object management with real-time updates.

## 📱 Features

- **Modern & Intuitive Interface** - iOS-inspired minimalist and clean design
- **Object Listing** - Smooth visualization with pull-to-refresh
- **Full CRUD** - Create, read, update and delete objects
- **Real-Time** - Live updates via Socket.IO
- **Image Upload** - Select from camera or gallery
- **Form Validation** - React Hook Form + Zod
- **Design System** - Reusable components and design tokens
- **Haptic Feedback** - Tactile feedback on interactions
- **Skeleton Loaders** - Elegant loading animations
- **Responsive Design** - Adaptive for different screen sizes

## 🛠️ Tech Stack

- **Framework**: React Native 0.81.5
- **Expo Framework**: Expo 54.0
- **Routing**: Expo Router 6.0
- **TypeScript**: 5.9.2
- **HTTP**: Axios
- **Real-time**: Socket.IO Client
- **Forms**: React Hook Form + Zod
- **Images**: expo-image-picker
- **Haptics**: expo-haptics
- **Icons**: @expo/vector-icons

## 🚀 Quick Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS 12.0+ or Android 8.0+

### Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your values
# EXPO_PUBLIC_API_URL=https://nestjs-heyama-api-test.onrender.com
# EXPO_PUBLIC_SOCKET_URL=https://nestjs-heyama-api-test.onrender.com
```

3. **Start the application**
```bash
npm start

# Or directly:
npm run ios       # iOS
npm run android   # Android
npm run web       # Web
```

## 📁 Project Structure

```
app/
├── _layout.tsx              # Root layout
├── index.tsx                # Home screen
├── objects/[id].tsx         # Details screen
└── +not-found.tsx           # 404 page

components/
├── ui/                      # Base components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── TextArea.tsx
│   ├── Badge.tsx
│   ├── EmptyState.tsx
│   └── LoadingSkeleton.tsx
├── ObjectCard.tsx
├── ImagePickerField.tsx
└── CreateObjectModal.tsx

lib/
├── constants.ts             # Design tokens
├── api.ts                   # Axios client
├── socket.ts                # Socket.IO setup
└── utils.ts                 # Utility functions

hooks/
├── useObjects.ts            # Object management
└── useImagePicker.ts        # Image selection

types/
└── index.ts                 # TypeScript types
```

## 🔌 API Configuration

Required environment variables:

```env
EXPO_PUBLIC_API_URL=https://nestjs-heyama-api-test.onrender.com
EXPO_PUBLIC_SOCKET_URL=https://nestjs-heyama-api-test.onrender.com
```

The API expects endpoints at:
- `GET/POST /objects` - List and creation
- `GET/DELETE/PATCH /objects/{id}` - Detail, deletion, update

## 🌐 Socket.IO Events

```typescript
socket.on('objectCreated', (object) => { /* ... */ })
socket.on('objectDeleted', (id) => { /* ... */ })
socket.on('objectUpdated', (object) => { /* ... */ })
```

## 🎨 Design System

### Colors
```
primary: #007AFF (iOS Blue)
secondary: #8B5CF6 (Purple)
danger: #FF3B30 (Red)
background: #FAFAFA
surface: #FFFFFF
```

### Spacing
```
xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 20px, xxl: 24px
```

## 💬 Required Permissions

- **iOS**: Camera, Photo Library
- **Android**: CAMERA, READ/WRITE_EXTERNAL_STORAGE, INTERNET

Expo automatically handles most permissions at runtime.

## 📚 Documentation

- [React Native](https://reactnative.dev)
- [Expo](https://docs.expo.dev)
- [Expo Router](https://expo.github.io/router)
- [React Hook Form](https://react-hook-form.com)
- [Socket.IO Client](https://socket.io/docs/v4/client-api)

## 🐛 Troubleshooting

**Error: Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: API connection**
- Verify that API_URL is configured correctly
- Ensure backend is running

**Error: Socket connection**
- Verify SOCKET_URL
- Check CORS on server

## 📝 License

MIT License