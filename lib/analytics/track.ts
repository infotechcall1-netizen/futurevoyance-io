declare global {
  interface Window {
    gtag?: (command: string, name: string, params?: Record<string, unknown>) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params ?? {});
  }
}
