# Configuration OAuth locale

## ✅ Corrections effectuées

1. **NEXTAUTH_URL** changé de `https://www.futurevoyance.io` → `http://localhost:3000`
2. **NEXT_PUBLIC_APP_URL** changé vers `http://localhost:3000`
3. **Logging amélioré** dans `lib/auth/options.ts` pour debug

## 🚀 Étapes pour tester Google OAuth

### 1. Redémarrer le serveur Next.js

```powershell
# Arrêter le serveur actuel (Ctrl+C si il tourne)
# Puis relancer:
npm run dev
```

### 2. Vérifier les logs au démarrage

Dans la console, tu devrais voir:
```
[auth] Configuration check: {
  hasGoogleOAuth: true,
  googleClientIdPrefix: '1024114520...',
  nextAuthUrl: 'http://localhost:3000'
}
```

Si `hasGoogleOAuth: false`, les variables ne sont pas chargées.

### 3. Configurer Google Cloud Console

Va sur [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)

Pour ton OAuth Client ID `1024114520165-gqsjhuqlhuvnko6kkhpi6clnhscps20l`, ajoute:

**Authorized JavaScript origins:**
- `http://localhost:3000`

**Authorized redirect URIs:**
- `http://localhost:3000/api/auth/callback/google`

### 4. Tester le flow OAuth

1. Ouvre `http://localhost:3000/login`
2. Clique sur "Continuer avec Google"
3. Tu devrais être redirigé vers `accounts.google.com`
4. Après connexion, retour sur `http://localhost:3000`

## 🔍 Debug si ça ne fonctionne pas

### Vérifier que les variables sont chargées:

```powershell
# Dans le terminal où tourne le serveur, regarde les logs [auth]
# Tu devrais voir googleClientIdPrefix: '1024114520...'
```

### Vérifier l'endpoint NextAuth:

```powershell
# Dans un autre terminal:
curl http://localhost:3000/api/auth/providers
```

Tu devrais voir `"google"` dans la liste.

### Erreur "redirect_uri_mismatch"

Si tu vois cette erreur, c'est que Google Cloud Console n'a pas l'URL de callback autorisée. Ajoute:
- `http://localhost:3000/api/auth/callback/google`

## 📝 Pour la production

Avant de déployer sur Vercel, remets dans les variables d'environnement:
- `NEXTAUTH_URL=https://www.futurevoyance.io`
- `NEXT_PUBLIC_APP_URL=https://www.futurevoyance.io`

Et dans Google Cloud Console, ajoute aussi:
- `https://www.futurevoyance.io/api/auth/callback/google`
