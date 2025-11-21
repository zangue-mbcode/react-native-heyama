# Deployment Guide - Heyama Mobile

Guide complet pour déployer Heyama Mobile sur les App Stores et en production.

## 📋 Pre-Deployment Checklist

### Code & Quality
- [ ] Tous les tests passent
- [ ] Pas de warnings TypeScript
- [ ] Code bien structuré et commenté
- [ ] Pas de console.logs en production
- [ ] Assets optimisés (images compressées)
- [ ] Version bump dans package.json
- [ ] CHANGELOG.md à jour

### Configuration
- [ ] Variables d'environnement correctes
- [ ] API URLs en production configurées
- [ ] Firebase/Services configurés (si applicable)
- [ ] Icon et splash screen finalisés
- [ ] app.json/app.config.js correct

### Testing
- [ ] Testé sur iOS simulator/device
- [ ] Testé sur Android emulator/device
- [ ] Testé sur connections lentes
- [ ] Testé offline (si applicable)
- [ ] Permissions testées
- [ ] Tous les écrans vérifiés

## 🔑 Préparation des clés et certificats

### iOS

1. **Apple Developer Account**
   - Créer un compte sur [developer.apple.com](https://developer.apple.com)
   - Enroll au Apple Developer Program ($99/an)

2. **Créer les certificats**
   ```bash
   eas credentials setup --platform ios
   ```
   Expo peut gérer automatiquement les certificats

3. **Ou manuellement**
   - Créer Certificate Signing Request (CSR)
   - Créer Development/Distribution Certificates
   - Créer Provisioning Profiles

### Android

1. **Google Play Account**
   - Créer compte sur [play.google.com/console](https://play.google.com/console)
   - Payer la inscription unique ($25)

2. **Créer la keystore**
   ```bash
   # EAS gère automatiquement
   eas credentials setup --platform android

   # Ou manuellement avec keytool
   keytool -genkey -v -keystore heyama.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias heyama
   ```

## 🚀 Deployment avec EAS Build

### Installation

```bash
npm install -g eas-cli
eas login
```

### Configuration du projet

```bash
cd mobile
eas build:configure
```

### Build pour iOS

```bash
# Development build (pour tester)
eas build --platform ios --profile preview

# Production build (pour App Store)
eas build --platform ios --auto-submit
```

**Temps estimé**: 10-15 minutes

### Build pour Android

```bash
# Development APK
eas build --platform android --profile preview

# Production build (pour Play Store)
eas build --platform android --auto-submit
```

**Temps estimé**: 5-10 minutes

### Monitoring

```bash
# Voir l'état des builds
eas build:list

# Voir les détails d'un build
eas build:view <build-id>
```

## 📤 Submission à App Stores

### App Store (iOS)

1. **Préparer dans Xcode**
   - Version et build number corrects
   - Icons et screenshots
   - Description et keywords
   - Privacy policy URL

2. **Soumettre via EAS**
   ```bash
   eas submit --platform ios
   ```

3. **Ou manuellement**
   - Ouvrir Xcode organizer
   - Soumettre via App Store Connect

**Délai d'approbation**: 24-48h généralement

### Google Play (Android)

1. **Préparer dans Play Console**
   - Version code et version name
   - Screenshots (5 minimum)
   - Description (80 caractères)
   - Categorie et contenu
   - Privacy policy

2. **Soumettre via EAS**
   ```bash
   eas submit --platform android
   ```

3. **Ou manuellement**
   - Uploader l'APK/AAB
   - Remplir les informations
   - Soumettre pour review

**Délai d'approbation**: Quelques heures généralement

## 📱 App Store Assets

### Screenshots

**iOS**
- 5-10 screenshots par language
- Sizes: 1242x2208 (pour iPhone 6+)
- Format: PNG ou JPEG

**Android**
- 2-8 screenshots
- Sizes: Varies (recommandé: 1080x1920)
- Format: PNG ou JPEG

### Icons

**iOS**
- 1024x1024 (App Store)
- 120x120 (Spotlight)
- 180x180 (App Icon)

**Android**
- 512x512 (Play Store)
- 192x192 (Launcher)

### Descriptions

**iOS App Store**
```
[Nom court]
[Tagline - 30 caractères max]
[Description - 170 caractères]
```

**Google Play**
```
[Título - 50 caractères max]
[Descripción corta - 80 caractères max]
[Descripción completa - 4000 caractères max]
```

## ⚙️ Configuration Production

### app.json

```json
{
  "expo": {
    "name": "Heyama",
    "slug": "heyama",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.company.heyama",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.company.heyama",
      "versionCode": 1
    }
  }
}
```

### .env.production

```env
EXPO_PUBLIC_API_URL=https://api.heyama.com
EXPO_PUBLIC_SOCKET_URL=https://api.heyama.com
EXPO_PUBLIC_ENV=production
```

## 🔄 Release Process

### Version Management

Utiliser [Semantic Versioning](https://semver.org):
- **MAJOR.MINOR.PATCH** (e.g., 1.2.3)
- MAJOR: Breaking changes
- MINOR: Features
- PATCH: Bugfixes

### Steps

1. **Bump version**
   ```bash
   # package.json
   "version": "1.1.0"

   # app.json (iOS)
   "version": "1.1.0"
   "buildNumber": "2"

   # app.json (Android)
   "versionCode": 2
   ```

2. **Update CHANGELOG**
   ```markdown
   ## [1.1.0] - 2024-01-15
   ### Added
   - Feature X
   ### Fixed
   - Bug Y
   ```

3. **Commit et tag**
   ```bash
   git add .
   git commit -m "chore: release v1.1.0"
   git tag -a v1.1.0 -m "Release 1.1.0"
   git push origin main --tags
   ```

4. **Build et submit**
   ```bash
   eas build --platform ios
   eas build --platform android
   ```

## 📊 Post-Deployment Monitoring

### Analytics

- Google Analytics (Firebase)
- App Store Connect (iOS)
- Google Play Console (Android)

### Metrics à tracker

- Installations/downloads
- Active users
- Crashes
- Session duration
- User retention

### Tools

```bash
# Firebase Console
firebase login
firebase open

# Sentry (error tracking)
npm install @sentry/react-native
```

## 🔐 Security Considerations

### API Security

```env
# Ne pas commiter les secrets
EXPO_PUBLIC_API_KEY=...  # Uniquement données publiques
# Secrets via backend uniquement
```

### HTTPS Enforcée

```typescript
// Vérifier toutes les URLs en production
const API_URL = process.env.EXPO_PUBLIC_API_URL
// Doit être https:// en production
```

### Certificat SSL

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.heyama.com',
  timeout: 10000,
  validateStatus: (status) => status < 500,
})
```

## 🔄 Updates et Maintenance

### Over-the-Air Updates

Utiliser Expo Updates:

```bash
eas update --message "Fixed bug X"
```

```typescript
// app/_layout.tsx
import * as Updates from 'expo-updates'

export default function RootLayout() {
  useEffect(() => {
    const subscription = Updates.addListener(async (event) => {
      if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
        // Nouvelle version disponible
        await Updates.reloadAsync()
      }
    })

    return () => subscription.remove()
  }, [])
}
```

### Hotfixes

Pour un hotfix urgent:
1. Fix sur une branche `hotfix/`
2. Test complet
3. Build et submit
4. Merge back to main

## 📞 Support & Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Build échoue | Vérifier `eas build:logs` |
| App rejectedé | Vérifier les guidelines de l'app store |
| Crash au lancement | Vérifier les logs, test localement |
| Performance lente | Profiler avec DevTools |

### Debugging

```bash
# Logs de build
eas build:logs <build-id>

# Logs de submission
eas submit:logs <submission-id>

# Logs locales
npm start
```

## ✅ Checklist Final

Avant de soumettre:

- [ ] Version bump correct
- [ ] Icons et screenshots finalisés
- [ ] Description et keywords OK
- [ ] Privacy policy linkée
- [ ] Pas de logs de debug
- [ ] App testée complètement
- [ ] Certificats/provisioning profiles OK
- [ ] Build réussis
- [ ] Screenshots en 5+ langues (si applicable)

## 📚 Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Google Play Console](https://play.google.com/console)
- [Expo Submission](https://docs.expo.dev/submit/submit-ios/)

---

Le déploiement est un processus crucial. Prendre le temps de tester correctement et de suivre cette checklist garantit une meilleure expérience utilisateur et moins d'approbations rejetées.
