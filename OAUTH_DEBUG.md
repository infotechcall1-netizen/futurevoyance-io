# 🔍 Debug OAuth Google - Checklist

## ✅ Modifications effectuées

### 1. `lib/auth/options.ts`
- ✅ Ajout de `debug: true`
- ✅ Logger custom (error/warn/debug) pour capturer toutes les erreurs NextAuth
- ✅ Events (signIn, signOut, createUser, linkAccount) pour tracer le flow OAuth
- ✅ Callback signIn amélioré avec logging détaillé
- ✅ Logging des longueurs de variables d'env (pas les valeurs)

### 2. `app/api/auth/[...nextauth]/route.ts`
- ✅ Logging de toutes les requêtes GET/POST avec pathname et query params
- ✅ Logging détaillé des erreurs avec stack trace

## 🚀 Procédure de test

### Étape 1: Redémarrer le serveur

```powershell
# Arrêter le serveur actuel (Ctrl+C)
# Puis relancer:
npm run dev
```

### Étape 2: Vérifier les logs au démarrage

Tu devrais voir dans la console:
```
[auth] Configuration check: {
  hasGoogleOAuth: true,
  googleClientIdLength: 72,
  googleSecretLength: 35,
  nextAuthUrl: 'http://localhost:3000',
  nextAuthUrlLength: 21
}
```

✅ **Si `hasGoogleOAuth: false`** → Les variables ne sont pas chargées, vérifier `.env.local`

### Étape 3: Tester le flow OAuth Google

1. Ouvrir `http://localhost:3000/login`
2. Cliquer sur "Continuer avec Google"
3. Choisir un compte Google
4. **Regarder la console du serveur immédiatement après**

## 🔎 Logs à surveiller

### A. Logs de configuration (au démarrage)
```
[auth] Configuration check: { ... }
```

### B. Logs de la requête OAuth (quand tu cliques sur Google)
```
[NextAuth GET] { pathname: '/api/auth/signin/google', ... }
```

### C. Logs du callback Google (quand Google te renvoie)
```
[NextAuth GET] { 
  pathname: '/api/auth/callback/google',
  searchParams: { code: '...', state: '...', ... }
}
```

### D. Logs d'erreur possibles

**Si tu vois:**
```
[NextAuth Error] OAuthCallbackError ...
```
→ Problème avec le callback (redirect_uri, code invalide, etc.)

**Si tu vois:**
```
[NextAuth Callback] signIn: { ... }
Puis: [NextAuth Error] ... Prisma ...
```
→ Problème avec PrismaAdapter (création User/Account échoue)

**Si tu vois:**
```
[NextAuth Event] createUser: { ... }
[NextAuth Event] linkAccount: { ... }
[NextAuth Event] signIn: { ... }
```
→ ✅ OAuth fonctionne correctement!

## ❌ Causes probables selon les logs

### Erreur 1: `redirect_uri_mismatch`
```
[NextAuth Error] OAuthCallbackError { message: "redirect_uri_mismatch" }
```

**Cause:** Google Cloud Console n'a pas l'URL de callback autorisée

**Solution:** Va sur [Google Cloud Console](https://console.cloud.google.com/apis/credentials), trouve ton OAuth client ID `1024114520165-...`, et ajoute:
- Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### Erreur 2: Problème Prisma
```
[NextAuth Callback] signIn: { ... }
[NextAuth Error] ... PrismaClientKnownRequestError ...
ou
[NextAuth Error] ... Cannot read properties of null ...
```

**Cause:** PrismaAdapter ne peut pas créer User/Account (connexion DB, schema, permissions)

**Solutions possibles:**
1. Vérifier que la migration Prisma est à jour: `npx prisma migrate dev`
2. Vérifier la connexion DATABASE_URL_UNPOOLED dans `.env.local`
3. Problème avec l'adapter Neon (voir `lib/prisma.ts`)

### Erreur 3: `NEXTAUTH_URL` mismatch
```
[auth] Configuration check: {
  nextAuthUrl: 'https://www.futurevoyance.io'  // ❌ Devrait être localhost
}
```

**Cause:** `.env.local` a encore l'URL de production

**Solution:** Déjà corrigé normalement, mais vérifier que `.env.local` contient:
```
NEXTAUTH_URL="http://localhost:3000"
```

## 📋 Checklist finale

- [ ] Serveur redémarré
- [ ] `hasGoogleOAuth: true` dans les logs de config
- [ ] `nextAuthUrl: 'http://localhost:3000'` dans les logs
- [ ] Bouton Google redirige vers `accounts.google.com`
- [ ] Callback Google retourne sur `http://localhost:3000/api/auth/callback/google`
- [ ] **Copier/coller TOUS les logs de la console ici pour diagnostic**

## 🎯 Prochaine étape

**Lance le test et copie-colle les logs de la console.**

Je vais analyser les logs pour identifier la cause exacte et appliquer la correction minimale nécessaire.
