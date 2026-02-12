"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/track";

type ViewEventProps = {
  name: string;
  params?: Record<string, unknown>;
};

export default function ViewEvent({ name, params }: ViewEventProps) {
  const paramsString = params ? JSON.stringify(params) : "";

  useEffect(() => {
    trackEvent(name, params);
  }, [name, paramsString]);

  return null;
}
