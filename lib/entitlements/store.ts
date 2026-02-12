import { redis } from "@/lib/redis";

const isProd = process.env.NODE_ENV === "production";
const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

const memoryStore = new Map<string, string>();
const memoryIndex = new Map<string, Set<string>>();
let warnedDevFallback = false;

function normalizeUserKey(userKey: string): string {
  return userKey.trim().toLowerCase();
}

function normalizeModuleId(moduleId: string): string {
  return moduleId.trim();
}

function entitlementKey(userKey: string, moduleId: string): string {
  const u = encodeURIComponent(normalizeUserKey(userKey));
  const m = encodeURIComponent(normalizeModuleId(moduleId));
  return `fv:entitlement:${u}:${m}`;
}

function entitlementPrefix(userKey: string): string {
  const u = encodeURIComponent(normalizeUserKey(userKey));
  return `fv:entitlement:${u}:`;
}

function entitlementIndexKey(userKey: string): string {
  const u = encodeURIComponent(normalizeUserKey(userKey));
  return `fv:entitlement:index:${u}`;
}

function parseModuleIdFromEntitlementKey(key: string, userKey: string): string | null {
  const prefix = entitlementPrefix(userKey);
  if (!key.startsWith(prefix)) return null;
  const encodedModule = key.slice(prefix.length);
  if (!encodedModule) return null;
  try {
    const moduleId = decodeURIComponent(encodedModule).trim();
    return moduleId || null;
  } catch {
    return null;
  }
}

function readMemoryModules(userKey: string): string[] {
  const indexKey = entitlementIndexKey(userKey);
  const indexed = memoryIndex.get(indexKey);
  if (indexed && indexed.size > 0) {
    return Array.from(indexed.values());
  }

  const modules: string[] = [];
  const prefix = entitlementPrefix(userKey);
  for (const key of memoryStore.keys()) {
    if (!key.startsWith(prefix)) continue;
    const moduleId = parseModuleIdFromEntitlementKey(key, userKey);
    if (moduleId) modules.push(moduleId);
  }
  if (modules.length > 0) {
    memoryIndex.set(indexKey, new Set(modules));
  }
  return modules;
}



function warnDevFallbackOnce(): void {
  if (!warnedDevFallback) {
    warnedDevFallback = true;
    console.warn(
      "[entitlements] UPSTASH_* non configure, fallback memoire active (dev only)."
    );
  }
}

export async function setEntitled(userKey: string, moduleId: string): Promise<void> {
  const normalizedUserKey = normalizeUserKey(userKey);
  const normalizedModuleId = normalizeModuleId(moduleId);
  if (!normalizedUserKey) throw new Error("userKey is required");
  if (!normalizedModuleId) throw new Error("moduleId is required");

  const unlockedAt = new Date().toISOString();
  const key = entitlementKey(normalizedUserKey, normalizedModuleId);

  if (hasUpstash) {
    const existing = await redis.get<string>(key);
    if (typeof existing === "string" && existing.length > 0) return;
    await redis.set(key, unlockedAt);
    await redis.sadd(entitlementIndexKey(normalizedUserKey), normalizedModuleId);
    return;
  }

  if (!isProd) {
    warnDevFallbackOnce();
    if (memoryStore.has(key)) return;
    memoryStore.set(key, unlockedAt);
    const indexKey = entitlementIndexKey(normalizedUserKey);
    const modules = memoryIndex.get(indexKey) ?? new Set<string>();
    modules.add(normalizedModuleId);
    memoryIndex.set(indexKey, modules);
    return;
  }

  throw new Error("Entitlement store is not configured in production");
}

export async function isEntitled(userKey: string, moduleId: string): Promise<boolean> {
  const normalizedUserKey = normalizeUserKey(userKey);
  const normalizedModuleId = normalizeModuleId(moduleId);
  if (!normalizedUserKey || !normalizedModuleId) return false;

  if (hasUpstash) {
    const v = await redis.get<string>(entitlementKey(normalizedUserKey, normalizedModuleId));
    return typeof v === "string" && v.length > 0;
  }

  if (!isProd) {
    warnDevFallbackOnce();
    return memoryStore.has(entitlementKey(normalizedUserKey, normalizedModuleId));
  }

  return false;
}

export async function listEntitledModules(userKey: string): Promise<string[]> {
  const normalizedUserKey = normalizeUserKey(userKey);
  if (!normalizedUserKey) return [];

  if (hasUpstash) {
    const indexKey = entitlementIndexKey(normalizedUserKey);
    const indexedModules = await redis.smembers<string[]>(indexKey);
    const modules = new Set(
      Array.isArray(indexedModules)
        ? indexedModules.map((m) => String(m).trim()).filter(Boolean)
        : []
    );

    if (modules.size === 0) {
      // Fallback for legacy entries created before indexation.
      const keys = await redis.keys(`${entitlementPrefix(normalizedUserKey)}*`);
      for (const key of Array.isArray(keys) ? keys : []) {
        const moduleId = parseModuleIdFromEntitlementKey(String(key), normalizedUserKey);
        if (!moduleId) continue;
        modules.add(moduleId);
      }
      if (modules.size > 0) {
        for (const moduleId of modules.values()) {
          await redis.sadd(indexKey, moduleId);
        }
      }
    }

    return Array.from(modules.values());
  }

  if (!isProd) {
    warnDevFallbackOnce();
    return readMemoryModules(normalizedUserKey);
  }

  return [];
}

export async function copyEntitlements(fromUserKey: string, toUserKey: string): Promise<number> {
  const from = normalizeUserKey(fromUserKey);
  const to = normalizeUserKey(toUserKey);
  if (!from || !to || from === to) return 0;

  const moduleIds = await listEntitledModules(from);
  let migratedCount = 0;

  for (const moduleId of moduleIds) {
    const alreadyEntitled = await isEntitled(to, moduleId);
    if (alreadyEntitled) continue;
    await setEntitled(to, moduleId);
    migratedCount += 1;
  }

  return migratedCount;
}
