export function safeJson(text: string): unknown {
  let cleaned = text.trim();

  // Remove markdown code fences (```json ... ``` or ``` ... ```)
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "");
  cleaned = cleaned.replace(/\n?```\s*$/i, "");

  // Try parsing the entire string
  try {
    return JSON.parse(cleaned);
  } catch (firstError) {
    // Extract first JSON block between first { and last }
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
      throw firstError;
    }

    const jsonBlock = cleaned.slice(firstBrace, lastBrace + 1);

    try {
      return JSON.parse(jsonBlock);
    } catch (secondError) {
      throw firstError;
    }
  }
}
