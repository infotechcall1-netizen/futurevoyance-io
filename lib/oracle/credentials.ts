type ServiceAccountLike = {
  client_email: string;
  private_key: string;
  [key: string]: unknown;
};

type CredentialsSourceEnv =
  | "GOOGLE_APPLICATION_CREDENTIALS_B64"
  | "GOOGLE_APPLICATION_CREDENTIALS_JSON"
  | "GOOGLE_APPLICATION_CREDENTIALIALS_JSON";

export type GoogleCredentialsResult = {
  credentials: ServiceAccountLike;
  sourceEnv: CredentialsSourceEnv;
};

type LoadOptions = {
  /**
   * Some downstream libs require escaped newlines in env-style strings.
   * Keep disabled for normal object/file usage.
   */
  escapePrivateKeyNewlines?: boolean;
};

const GOOGLE_CREDENTIALS_ENV_ORDER: CredentialsSourceEnv[] = [
  "GOOGLE_APPLICATION_CREDENTIALS_B64",
  "GOOGLE_APPLICATION_CREDENTIALS_JSON",
  "GOOGLE_APPLICATION_CREDENTIALIALS_JSON",
];

function normalizePrivateKeyInRawJson(raw: string): string {
  const privateKeyFieldPattern = /"private_key"\s*:\s*"([\s\S]*?)"/m;
  const match = raw.match(privateKeyFieldPattern);
  if (!match) return raw;

  const originalValue = match[1];
  const normalizedValue = originalValue
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n/g, "\\n");

  return raw.replace(originalValue, normalizedValue);
}

function parseServiceAccountJson(rawInput: string, envName: CredentialsSourceEnv): ServiceAccountLike {
  const raw = rawInput.trim();
  if (!raw) {
    throw new Error(
      `[oracle] ${envName} is empty. Provide valid service-account JSON or set GOOGLE_APPLICATION_CREDENTIALS_B64.`
    );
  }

  try {
    return JSON.parse(raw) as ServiceAccountLike;
  } catch (initialError) {
    // Fallback for misformatted env values where private_key contains literal newlines.
    try {
      const normalizedRaw = normalizePrivateKeyInRawJson(raw);
      return JSON.parse(normalizedRaw) as ServiceAccountLike;
    } catch {
      const message = initialError instanceof Error ? initialError.message : String(initialError);
      throw new Error(
        `[oracle] Failed to parse ${envName}: ${message}. Hint: remove leading/trailing whitespace and carriage returns, or prefer GOOGLE_APPLICATION_CREDENTIALS_B64.`
      );
    }
  }
}

function assertServiceAccountShape(credentials: ServiceAccountLike, sourceEnv: CredentialsSourceEnv): void {
  if (!credentials || typeof credentials !== "object") {
    throw new Error(`[oracle] ${sourceEnv} parsed value is not an object.`);
  }
  if (typeof credentials.client_email !== "string" || credentials.client_email.trim() === "") {
    throw new Error(`[oracle] ${sourceEnv} is missing required field "client_email".`);
  }
  if (typeof credentials.private_key !== "string" || credentials.private_key.trim() === "") {
    throw new Error(`[oracle] ${sourceEnv} is missing required field "private_key".`);
  }
}

export function getGoogleCredentialsEnvPresence() {
  const sourceEnv = GOOGLE_CREDENTIALS_ENV_ORDER.find((envName) => {
    const value = process.env[envName];
    return typeof value === "string" && value.trim().length > 0;
  });

  return {
    hasCredentialsEnv: !!sourceEnv,
    sourceEnv: sourceEnv ?? null,
  };
}

export function loadGoogleServiceAccountCredentials(options: LoadOptions = {}): GoogleCredentialsResult {
  const b64 = (process.env.GOOGLE_APPLICATION_CREDENTIALS_B64 || "").trim();
  if (b64) {
    let decoded = "";
    try {
      decoded = Buffer.from(b64, "base64").toString("utf8").trim();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `[oracle] Failed to decode GOOGLE_APPLICATION_CREDENTIALS_B64: ${message}. Ensure the value is valid base64-encoded JSON.`
      );
    }

    const credentials = parseServiceAccountJson(decoded, "GOOGLE_APPLICATION_CREDENTIALS_B64");
    assertServiceAccountShape(credentials, "GOOGLE_APPLICATION_CREDENTIALS_B64");
    if (options.escapePrivateKeyNewlines && credentials.private_key.includes("\n")) {
      credentials.private_key = credentials.private_key.replace(/\r?\n/g, "\\n");
    }
    return { credentials, sourceEnv: "GOOGLE_APPLICATION_CREDENTIALS_B64" };
  }

  const json = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (typeof json === "string" && json.trim()) {
    const credentials = parseServiceAccountJson(json, "GOOGLE_APPLICATION_CREDENTIALS_JSON");
    assertServiceAccountShape(credentials, "GOOGLE_APPLICATION_CREDENTIALS_JSON");
    if (options.escapePrivateKeyNewlines && credentials.private_key.includes("\n")) {
      credentials.private_key = credentials.private_key.replace(/\r?\n/g, "\\n");
    }
    return { credentials, sourceEnv: "GOOGLE_APPLICATION_CREDENTIALS_JSON" };
  }

  const typoJson = process.env.GOOGLE_APPLICATION_CREDENTIALIALS_JSON;
  if (typeof typoJson === "string" && typoJson.trim()) {
    const credentials = parseServiceAccountJson(typoJson, "GOOGLE_APPLICATION_CREDENTIALIALS_JSON");
    assertServiceAccountShape(credentials, "GOOGLE_APPLICATION_CREDENTIALIALS_JSON");
    if (options.escapePrivateKeyNewlines && credentials.private_key.includes("\n")) {
      credentials.private_key = credentials.private_key.replace(/\r?\n/g, "\\n");
    }
    return { credentials, sourceEnv: "GOOGLE_APPLICATION_CREDENTIALIALS_JSON" };
  }

  throw new Error(
    "[oracle] Missing Google service-account credentials env var. Set GOOGLE_APPLICATION_CREDENTIALS_B64 (recommended), or fallback to GOOGLE_APPLICATION_CREDENTIALS_JSON / GOOGLE_APPLICATION_CREDENTIALIALS_JSON."
  );
}
