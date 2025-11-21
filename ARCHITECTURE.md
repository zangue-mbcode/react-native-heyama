# Heyama Mobile - Architecture Documentation

## Overview

Heyama Mobile est une application React Native + Expo suivant une architecture moderne et scalable avec séparation claire des responsabilités.

## Architecture générale

```
┌─────────────────────────────────────────────────────────────┐
│                     UI Layer (Screens)                       │
│              index.tsx, objects/[id].tsx, etc                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Components Layer                           │
│  Composants reutilizables: Button, Card, Input, etc          │
│  Composants composites: ObjectCard, CreateObjectModal, etc   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Hooks Layer                               │
│   useObjects, useImagePicker, useState, useEffect            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Services Layer                             │
│    API Client (axios), Socket.IO, Utils, Constants           │
└─────────────────────────────────────────────────────────────┘
```

## Principales responsabilités

### 1. UI/Screens (`app/`)

**Fichiers:**
- `index.tsx` - Pantalla principal (listado de objetos)
- `objects/[id].tsx` - Pantalla de detalles del objeto
- `_layout.tsx` - Configuración de navegación
- `+not-found.tsx` - Página 404

**Responsabilidades:**
- Manejo de navegación
- Composición de componentes
- Integración con hooks
- Manejo de états de UI (loading, error, etc.)

### 2. Components (`components/`)

#### UI Base Components (`ui/`)

**Button.tsx**
- Componente de botón reutilizable
- Variantes: primary, secondary, danger, ghost
- Tamaños: small, medium, large
- Soporte para loading, disabled states
- Feedback haptic

**Card.tsx**
- Contenedor para contenido
- Variantes de shadow/border
- Soporta onPress para interactividad

**Input.tsx**
- Input de texto simple
- Validación y error display
- Label y helper text
- Focus states elegantes

**TextArea.tsx**
- Input multilinea
- Auto-expand opcional
- Similar a Input con soporte multilinea

**Badge.tsx**
- Etiqueta pequeña para información
- Variantes de color
- Tamaños: small, medium

**EmptyState.tsx**
- Componente para estados vacíos
- Icono, título, descripción
- Botón de acción opcional

**LoadingSkeleton.tsx**
- Skeleton loaders con animación
- Variantes: text, card, circle
- SkeletonCard para listados

#### Feature Components

**ObjectCard.tsx**
- Item de lista de objetos
- Muestra: imagen, título, descripción, fecha
- Interactivo (onPress)

**ImagePickerField.tsx**
- Field para seleccionar imágenes
- Integra expo-image-picker
- Preview de imagen seleccionada
- Opciones: cámara/galería

**CreateObjectModal.tsx**
- Modal para crear nuevos objetos
- Formulario con validación Zod
- Gestión de imágenes
- Feedback de carga y error

### 3. Hooks (`hooks/`)

**useObjects.ts**
```typescript
- Gestión de estado de objetos
- Métodos: createObject, deleteObject, getObjectById
- Integración con Socket.IO para actualizaciones reales
- Manejo de loading, error states
```

**useImagePicker.ts**
```typescript
- Selección de imágenes
- Manejo de permisos
- Captura de cámara o galería
- Estados: loading, error
```

### 4. Services/Libraries (`lib/`)

**api.ts**
```typescript
- Cliente Axios configurado
- Métodos CRUD: getObjects, getObject, createObject, deleteObject, updateObject
- Manejo de multipart/form-data para imágenes
- Error handling uniforme
```

**socket.ts**
```typescript
- Inicialización de Socket.IO
- Reconnexión automática
- Gestión del ciclo de vida
- Métodos: initSocket, getSocket, closeSocket, isSocketConnected
```

**constants.ts**
```typescript
- Design tokens: Colors, Spacing, Typography, BorderRadius, Shadows
- AnimationDuration
- Valores centralizados para consistencia
```

**utils.ts**
```typescript
- Funciones utilitarias: formatRelativeDate, formatFullDate
- String utilities: truncateText, getFileExtension
- Validación: isValidEmail, isImageFile
```

### 5. Types (`types/`)

**index.ts**
```typescript
- HeyamaObject: Interfaz del modelo de datos
- CreateObjectPayload: Payload para creación
- ApiResponse, ApiError: Tipos de respuesta
- SocketEvents: Tipos de eventos Socket.IO
```

## Flujos principales

### 1. Listar Objetos

```
HomeScreen (index.tsx)
    ↓
useObjects() hook
    ↓
API: getObjects()
    ↓
Mostrar con FlatList
    ↓
Socket: objectCreated/objectDeleted → Update estado
```

### 2. Crear Objeto

```
CreateObjectModal
    ↓
useForm + Zod (validación)
    ↓
useImagePicker() para imagen
    ↓
useObjects().createObject()
    ↓
API: POST /objects (multipart/form-data)
    ↓
Socket: objectCreated → Update lista
    ↓
Toast de éxito + Cerrar modal
```

### 3. Ver Detalles

```
HomeScreen → ObjectCard.onPress(id)
    ↓
objects/[id].tsx
    ↓
useObjects().getObjectById(id)
    ↓
API: GET /objects/{id}
    ↓
Mostrar detalles
    ↓
Opción: eliminar
```

### 4. Eliminar Objeto

```
ObjectDetailsScreen → Button "Supprimer"
    ↓
Alert.alert() de confirmación
    ↓
useObjects().deleteObject(id)
    ↓
API: DELETE /objects/{id}
    ↓
Socket: objectDeleted → Update lista
    ↓
Navegar atrás
```

## State Management

### Hooks internas

Se usa `useState` y `useEffect` para state local de componentes:
- Modal visibility
- Loading states
- Form values

### Datos globales

Se usa `useObjects` hook que internamente:
- Mantiene array de objetos en state
- Sincroniza con Socket.IO
- Proporciona métodos CRUD

```typescript
const { objects, loading, error, createObject, deleteObject } = useObjects()
```

### Ventajas

- ✅ Simple y sin dependencias de Redux/Zustand
- ✅ Integración nativa con React
- ✅ Fácil de entender y mantener
- ✅ Performance optimization con React.memo

## Navegación

**Expo Router** - File-based routing

```
app/
├── index.tsx → /
├── objects/
│   └── [id].tsx → /objects/:id
└── +not-found.tsx → /404
```

**Stack Navigator**
- Presentation: "card"
- Transiciones nativas
- Botón back automático

## Styling

**Design System basado en tokens**

```typescript
// Colores
Colors.primary, Colors.danger, Colors.background, etc.

// Espaciado
Spacing.sm, Spacing.md, Spacing.lg, etc. (múltiplos de 4px)

// Tipografía
Typography.title1, Typography.body, Typography.caption

// Bordes
BorderRadius.sm, BorderRadius.md, BorderRadius.lg

// Sombras
Shadows.small, Shadows.medium, Shadows.large
```

**React Native StyleSheet**
- Optimización de performance
- No hay re-rendering de estilos
- Tipado con TypeScript

## Validación de formularios

**React Hook Form + Zod**

```typescript
const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
})

const { control, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
})
```

**Ventajas**
- ✅ Validación robusta
- ✅ Mensajes de error personalizados
- ✅ TypeScript inferido
- ✅ Validación en tiempo real

## Permisos

**expo-image-picker**
- Permisos solicitados en tiempo de ejecución
- iOS: Camera, Photo Library
- Android: CAMERA, READ/WRITE_EXTERNAL_STORAGE

```typescript
const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
```

## Real-time Updates

**Socket.IO Client**

```typescript
socket.on('objectCreated', (object) => {
  setObjects(prev => [object, ...prev])
})

socket.on('objectDeleted', (id) => {
  setObjects(prev => prev.filter(obj => obj.id !== id))
})
```

**Ventajas**
- ✅ Actualizaciones instantáneas
- ✅ Reconexión automática
- ✅ WebSocket + Polling fallback
- ✅ Sincronización de datos multi-usuario

## Performance Optimizations

### React.memo
```typescript
export const Button = React.memo(function Button(props) {
  // Previene re-renders innecesarios
})
```

### useMemo
```typescript
const buttonStyle = useMemo(
  () => [styles.button, ...],
  [variant, size, isDisabled]
)
```

### FlatList Optimization
```typescript
<FlatList
  data={objects}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
/>
```

### Image Optimization
- Compresión before upload
- Lazy loading
- Cache management

## Error Handling

**API Errors**
```typescript
try {
  const data = await getObjects()
} catch (err: any) {
  const message = err?.response?.data?.message || err?.message
  setError(message)
}
```

**User Feedback**
- Toast messages
- Alert dialogs
- Loading states
- Empty states
- Error messages inline

## Testing Strategy

**Recomendado:**
- Jest para unit tests
- React Native Testing Library
- Detox para e2e tests

## Deployment

### EAS Build
```bash
eas build --platform ios
eas build --platform android
```

### Local Build
```bash
eas build --platform android --local
```

## Future Improvements

1. **State Management Scale-up**
   - Zustand o Redux si aplicación crece

2. **Offline Support**
   - AsyncStorage para cache
   - Queue de acciones offline

3. **Advanced Features**
   - Búsqueda y filtrado
   - Compartir objetos
   - Modo oscuro

4. **Performance**
   - Code splitting
   - Lazy loading de rutas
   - Image optimization avanzada

5. **Testing**
   - Unit tests completos
   - Integration tests
   - E2E tests

---

Esta arquitectura es escalable, mantenible y sigue best practices modernas de React Native.
