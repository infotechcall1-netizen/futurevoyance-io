# Migration vers le Nouveau Système d'Authentification

## 📋 Changements Implémentés

### 1. ✅ Nouvelle Page de Login
- **Fichier**: `app/login/page.tsx`
- **Changement**: Remplacé le système magic link par un système complet signup/signin
- **Nouveau fichier**: `app/login/AuthForm.tsx` (remplace `LoginForm.tsx`)

### 2. ✅ Endpoint Register
- **Fichier**: `app/api/auth/register/route.ts` (nouveau)
- **Fonctionnalités**:
  - Validation username (3-30 chars alphanumériques)
  - Validation email
  - Validation password (min 8 chars)
  - Hash bcrypt (12 rounds)
  - Stockage dans Redis: `user:{email}`
  - Ne retourne jamais le passwordHash

### 3. ✅ Configuration NextAuth
- **Fichier**: `lib/auth/options.ts`
- **Providers ajoutés**:
  - ✅ GoogleProvider (optionnel)
  - ✅ CredentialsProvider (email + password)
- **Supprimé**: EmailProvider (magic link)

### 4. ✅ Sécurité
- Passwords hashed avec bcrypt (12 rounds)
- Aucun passwordHash retourné dans les responses
- Validation stricte des inputs
- JWT sessions
- Callbacks personnalisés pour inclure user.id

### 5. ✅ Types TypeScript
- **Fichier**: `types/next-auth.d.ts` (nouveau)
- Extension des types NextAuth pour inclure `user.id` dans la session

### 6. ✅ Documentation
- **Fichier**: `.env.example` (nouveau)
- **Fichier**: `README.md` (mis à jour)

## 🔧 Configuration Requise

### Variables d'Environnement Obligatoires

```bash
# NextAuth
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=http://localhost:3000

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

### Variables d'Environnement Optionnelles (OAuth)

```bash
# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🚀 Déploiement

### Étape 1: Installer les Dépendances

```bash
npm install
# bcryptjs et @types/bcryptjs sont déjà installés
```

### Étape 2: Configurer les Variables d'Environnement

1. Copier `.env.example` vers `.env.local`
2. Remplir les valeurs obligatoires
3. (Optionnel) Configurer Google OAuth

### Étape 3: Tester en Local

```bash
npm run dev
```

Visiter `http://localhost:3000/login` et tester:
- ✅ Création de compte (signup)
- ✅ Connexion avec credentials
- ✅ (Si configuré) Connexion Google
- ✅ Redirection avec callbackUrl

### Étape 4: Vérifier la Build

```bash
npm run build
```

Aucune erreur TypeScript ne doit apparaître.

## 🔐 Configuration OAuth (Optionnel)

### Google OAuth

1. **Google Cloud Console**: https://console.cloud.google.com/
2. Créer/sélectionner un projet
3. Activer Google+ API
4. Credentials → Create OAuth 2.0 Client ID
5. Type: Web application
6. Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
7. Copier Client ID et Secret dans `.env.local`

## 📊 Structure Redis

### Users
```
Key: user:{email}
Value: {
  id: string,
  name: string,
  email: string,
  phone: string | null,
  passwordHash: string,
  createdAt: string,
  emailVerified: string | null,
  image: string | null
}
```

### Sessions (géré par NextAuth + Upstash Adapter)
```
Key: user:id:{userId}
Key: session:{sessionToken}
Key: account:{provider}:{providerAccountId}
```

## ✅ Tests à Effectuer

### Tests Manuels

1. **Signup**:
   - [ ] Form validation (username, email, password min 8 chars)
   - [ ] Checkbox CGU obligatoire
   - [ ] Création user dans Redis
   - [ ] Auto-login après signup
   - [ ] Redirection vers callbackUrl

2. **Signin Credentials**:
   - [ ] Login avec email + password
   - [ ] Message d'erreur si mauvais credentials
   - [ ] Session créée correctement
   - [ ] Redirection vers callbackUrl

3. **Google OAuth** (si configuré):
   - [ ] Bouton "Continuer avec Google" fonctionne
   - [ ] Redirect vers Google
   - [ ] Retour et création session
   - [ ] Redirection vers callbackUrl

4. **Session Persistence**:
   - [ ] Session persistante après refresh
   - [ ] Logout fonctionne
   - [ ] Protected pages redirigent vers login

### Tests de Sécurité

- [ ] passwordHash jamais retourné dans responses
- [ ] Password haché correctement (bcrypt)
- [ ] Validation inputs strict
- [ ] Pas de console.log sensible en production

## 🐛 Troubleshooting

### Erreur: "Missing GOOGLE_CLIENT_ID"
➜ Google OAuth non configuré. C'est optionnel, le système fonctionne sans.

### Erreur: "User not found" lors du login
➜ L'utilisateur doit d'abord créer un compte via "Créer un compte".

### Erreur: "NEXTAUTH_SECRET is required"
➜ Générer un secret: `openssl rand -base64 32` et l'ajouter dans `.env.local`

### Build error: "Cannot find module bcryptjs"
➜ Réinstaller: `npm install bcryptjs @types/bcryptjs`

## 📝 Notes Importantes

1. **Compatibilité**: Tous les utilisateurs existants (OAuth login automatique via Upstash Adapter) continuent de fonctionner.

2. **Redirection callbackUrl**: Totalement préservée, fonctionne avec `?callbackUrl=/mon-oracle`.

3. **Pas de Breaking Changes**: Les autres parties du projet (Oracle, Stripe, etc.) ne sont pas affectées.

4. **EmailProvider supprimé**: Le système magic link n'est plus disponible. Si vous voulez le réactiver, décommentez le code dans `lib/auth/options.ts` et ajoutez les variables Resend.

## 🎯 Résultat Attendu

- ✅ Login moderne avec toggle signup/signin
- ✅ OAuth Google (si configuré)
- ✅ Credentials (email + password)
- ✅ Signup sécurisé avec validation
- ✅ No TypeScript errors
- ✅ Build sans warnings
- ✅ Compatible avec callbackUrl
- ✅ Design cohérent (#6e4efb violet)

---

**Date de migration**: 2026-02-16  
**Version NextAuth**: 4.24.13  
**Version Next.js**: 16.1.6
