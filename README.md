# Heyama Mobile - React Native + Expo

Application mobile native modern para la gestión de objetos con actualizaciones en tiempo real.

## 📱 Características

- **Interfaz Moderna e Intuitiva** - Diseño iOS-inspired minimalista y limpio
- **Listado de Objetos** - Visualización fluida con pull-to-refresh
- **CRUD Completo** - Crear, leer, actualizar y eliminar objetos
- **Tiempo Real** - Actualizaciones en vivo mediante Socket.IO
- **Upload de Imágenes** - Seleccionar de cámara o galería
- **Validación de Formularios** - React Hook Form + Zod
- **Design System** - Componentes reutilizables y tokens de diseño
- **Feedback Haptic** - Retroalimentación táctil en interacciones
- **Skeleton Loaders** - Animaciones de carga elegantes
- **Responsive Design** - Adaptativo para diferentes tamaños de pantalla

## 🛠️ Stack Técnico

- **Framework**: React Native 0.81.5
- **Framework Expo**: Expo 54.0
- **Routing**: Expo Router 6.0
- **TypeScript**: 5.9.2
- **HTTP**: Axios
- **Real-time**: Socket.IO Client
- **Formularios**: React Hook Form + Zod
- **Imágenes**: expo-image-picker
- **Haptics**: expo-haptics
- **Icons**: @expo/vector-icons

## 🚀 Instalación Rápida

### Prerequisitos

- Node.js 18+ y npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS 12.0+ o Android 8.0+

### Setup

1. **Instalar dependencias**
```bash
npm install
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env.local
# Editar .env.local con tus valores
# EXPO_PUBLIC_API_URL=https://nestjs-heyama-api-test.onrender.com
# EXPO_PUBLIC_SOCKET_URL=https://nestjs-heyama-api-test.onrender.com
```

3. **Iniciar la aplicación**
```bash
npm start

# O directamente:
npm run ios       # iOS
npm run android   # Android
npm run web       # Web
```

## 📁 Estructura del Proyecto

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

## 🔌 Configuración de API

Variables de entorno requeridas:

```env
EXPO_PUBLIC_API_URL=https://nestjs-heyama-api-test.onrender.com
EXPO_PUBLIC_SOCKET_URL=https://nestjs-heyama-api-test.onrender.com
```

La API espera endpoints en:
- `GET/POST /objects` - Listado y creación
- `GET/DELETE/PATCH /objects/{id}` - Detalle, eliminación, actualización

## 🌐 Socket.IO Events

```typescript
socket.on('objectCreated', (object) => { /* ... */ })
socket.on('objectDeleted', (id) => { /* ... */ })
socket.on('objectUpdated', (object) => { /* ... */ })
```

## 🎨 Design System

### Colores
```
primary: #007AFF (Azul iOS)
secondary: #8B5CF6 (Púrpura)
danger: #FF3B30 (Rojo)
background: #FAFAFA
surface: #FFFFFF
```

### Espaciado
```
xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 20px, xxl: 24px
```

## 💬 Permisos Requeridos

- **iOS**: Camera, Photo Library
- **Android**: CAMERA, READ/WRITE_EXTERNAL_STORAGE, INTERNET

Expo maneja automáticamente la mayoría de permisos en tiempo de ejecución.

## 📚 Documentación

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
- Verificar que API_URL está configurada correctamente
- Asegurar que backend está corriendo

**Error: Socket connection**
- Verificar SOCKET_URL
- Verificar CORS en servidor

## 📝 Licencia

MIT License
