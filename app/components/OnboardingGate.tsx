"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import OnboardingWizard from "./OnboardingWizard";

/**
 * Renders the OnboardingWizard overlay when user is logged in
 * but has not yet set their firstName (first-time onboarding).
 */
export default function OnboardingGate() {
  const { data: session, status } = useSession();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    fetch("/api/user/birth-data")
      .then((r) => r.json())
      .then((data) => {
        // The GET endpoint returns { birthData: { ... } }
        // We check firstName separately — it's not in birthData response
        // So we add a lightweight check
        if (data.needsOnboarding === true) {
          setNeedsOnboarding(true);
        }
      })
      .catch(() => {});
  }, [status, session?.user?.email]);

  if (!needsOnboarding) return null;

  return <OnboardingWizard />;
}
