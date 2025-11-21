# Setup Guide - Heyama Mobile

Guide étape par étape pour installer et lancer l'application Heyama Mobile.

## 📋 Prerequisitos

- **Node.js**: 18.0.0 ou supérieur
- **npm**: 8.0.0 ou supérieur (ou yarn 3+)
- **iOS**: Xcode 14+ (pour iOS uniquement sur macOS)
- **Android**: Android Studio 4.1+ ou Android SDK 21+

### Vérifier les versions

```bash
node --version
npm --version
```

## 🚀 Installation rapide (5 minutes)

### 1. Installer les dépendances

```bash
cd mobile
npm install
```

**Temps approximatif**: 2-3 minutes selon la vitesse d'internet

### 2. Configurer les variables d'environnement

```bash
# Copier le fichier example
cp .env.example .env.local

# Éditer .env.local avec vos paramètres
```

**Contenu minimun de .env.local:**
```env
EXPO_PUBLIC_API_URL=https://nestjs-heyama-api-test.onrender.com
EXPO_PUBLIC_SOCKET_URL=https://nestjs-heyama-api-test.onrender.com
```

### 3. Lancer l'application

#### Avec Expo Go (plus rapide - recommandé pour développement)

```bash
npm start
```

Puis:
- **iOS**: Appuyer sur `i`
- **Android**: Appuyer sur `a`
- **Web**: Appuyer sur `w`

OU scanner le code QR avec l'app Expo Go:

1. Installer [Expo Go](https://expo.dev/go) sur votre téléphone
2. Scanner le code QR dans le terminal

#### Directement avec Expo CLI

```bash
# iOS (macOS uniquement)
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🔌 Configuration API

### Connexion au backend

**Development (local)**
```env
EXPO_PUBLIC_API_URL=https://nestjs-heyama-api-test.onrender.com
EXPO_PUBLIC_SOCKET_URL=https://nestjs-heyama-api-test.onrender.com
```

**Production**
```env
EXPO_PUBLIC_API_URL=https://api.heyama.example.com
EXPO_PUBLIC_SOCKET_URL=https://api.heyama.example.com
```

### Endpoints attendus

L'API doit fournir les endpoints suivants:

```
GET    /objects           - Récupérer tous les objets
POST   /objects           - Créer un nouvel objet
GET    /objects/:id       - Récupérer un objet par ID
DELETE /objects/:id       - Supprimer un objet
PATCH  /objects/:id       - Mettre à jour un objet
```

### Format de réponse attendu

```typescript
// GET /objects
[
  {
    id: "string",
    title: "string",
    description: "string",
    imageUrl: "string",
    createdAt: "ISO8601",
    updatedAt: "ISO8601"
  }
]

// POST /objects (multipart/form-data)
{
  title: "string",
  description: "string",
  image: File (optional)
}
```

## 🔄 Socket.IO Configuration

L'application écoute les événements Socket.IO suivants:

```typescript
socket.on('objectCreated', (object: HeyamaObject) => {
  // Nouvel objet ajouté
})

socket.on('objectDeleted', (id: string) => {
  // Objet supprimé
})

socket.on('objectUpdated', (object: HeyamaObject) => {
  // Objet mis à jour
})
```

Le serveur doit émettre ces événements lorsque:
- Un objet est créé (par ce client ou d'autres)
- Un objet est supprimé
- Un objet est mis à jour

## 📱 Tester sur device réel

### iOS

1. **Avec Expo Go**
```bash
npm start
# Scanner avec Expo Go depuis iPhone
```

2. **Avec développement build**
```bash
eas build --platform ios
# Attendre le build, puis télécharger et installer
```

### Android

1. **Avec Expo Go**
```bash
npm start
# Scanner avec Expo Go depuis Android
```

2. **Avec APK**
```bash
eas build --platform android
# Télécharger l'APK et installer sur device
```

## 🧪 Testing

### Développement local

Pour tester avec un backend local:

```bash
# Terminal 1: Backend API
cd ../backend
npm start  # ou votre commande de démarrage

# Terminal 2: Mobile app
cd mobile
npm start
```

Puis scanner avec Expo Go depuis votre téléphone.

### Build standalone

```bash
# iOS (macOS required)
eas build --platform ios

# Android
eas build --platform android

# Avec --local flag pour compiler localement
eas build --platform android --local
```

## 🐛 Troubleshooting

### Error: Cannot find module

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Error: API connection refused

- Vérifier que `EXPO_PUBLIC_API_URL` est correctement configurée
- Vérifier que le backend API est en cours d'exécution
- Sur device réel, utiliser l'IP du serveur au lieu de localhost

```env
# ❌ Incorrect sur device réel
EXPO_PUBLIC_API_URL=https://nestjs-heyama-api-test.onrender.com

# ✅ Correct
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

### Error: Socket connection failed

- Vérifier que `EXPO_PUBLIC_SOCKET_URL` est configurée
- Vérifier les paramètres CORS sur le serveur
- Sur device, utiliser l'IP du serveur

### Error: Permission denied (camera/gallery)

- Sur iOS: Accorder les permissions dans Paramètres → Confidentialité
- Sur Android: Accorder dans Paramètres → Applications

### Error: Build fails

Nettoyage complet:
```bash
# Expo cache
expo prebuild --clean

# Node modules
rm -rf node_modules package-lock.json

# Réinstaller
npm install
npm start
```

## 💡 Tips de développement

### Hot Reload

- Appuyer sur `r` dans le terminal pour recharger l'app
- Appuyer sur `s` pour ouvrir le menu
- Appuyer sur `j` pour ouvrir DevTools

### Debug

```bash
# Avec Debugger intégré
npm start
# Appuyer sur `j` pour DevTools
```

### Logs

```typescript
// React Native
console.log('Message')
console.warn('Warning')
console.error('Error')

// Visibles dans le terminal Expo
```

## 📦 Commandes utiles

```bash
# Démarrer
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web

# Linter
npm run lint

# Vérifier TypeScript
npx tsc --noEmit

# Build EAS
eas build --platform ios
eas build --platform android

# Build local
eas build --platform android --local
```

## 🔐 Sécurité

### Données sensibles

- ❌ Ne pas commiter `.env.local`
- ✅ Utiliser `.env.example` comme template
- ✅ Stocker les secrets dans des fichiers `.env` locaux

### CORS

Si le backend retourne des erreurs CORS:

```javascript
// Backend - example Node.js/Express
app.use(cors({
  origin: 'http://localhost:*',
  credentials: true,
}))
```

### HTTPS en production

```env
# Production
EXPO_PUBLIC_API_URL=https://api.heyama.example.com
EXPO_PUBLIC_SOCKET_URL=https://api.heyama.example.com
```

## 📚 Ressources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Expo Router](https://expo.github.io/router)
- [Expo Go](https://expo.dev/go)
- [EAS Build](https://docs.expo.dev/eas-update/introduction/)

## ⚠️ Common Issues

| Problème | Solution |
|----------|----------|
| App freezes | Redémarrer avec `r` dans terminal |
| Images ne s'affichent pas | Vérifier les URLs d'images, vérifier CORS |
| Socket disconnect | Vérifier SOCKET_URL, vérifier firewall |
| Permisos denied | Accorder dans settings, accepter les dialogs |
| Build échoue | Nettoyer avec `expo prebuild --clean` |

## 🎯 Prochaines étapes

1. ✅ Installation complètement
2. ✅ Lancer l'app avec `npm start`
3. ✅ Scanner avec Expo Go sur votre téléphone
4. ✅ Tester les fonctionnalités principales
5. ✅ Configurer votre backend API
6. ✅ Commencer le développement

---

Support: Pour des problèmes spécifiques, consulter la documentation officielle ou ouvrir une issue sur le repo.
