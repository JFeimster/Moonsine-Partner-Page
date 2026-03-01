export type TrackEvent =
  | "cta_primary_click"
  | "cta_secondary_click"
  | "calculator_cta_click"
  | "tier_click"
  | "faq_open"
  | "form_submit"
  | "schedule_call_click"
  | "exit_intent_shown";

export function track(event: TrackEvent, props?: Record<string, any>) {
  // Swap this for GA4 / Segment / PostHog / etc.
  // For now: safe no-op in production if window undefined.
  if (typeof window === "undefined") return;

  (window as any).__moonshineEvents = (window as any).__moonshineEvents || [];
  (window as any).__moonshineEvents.push({ event, props, ts: Date.now() });

  // Example: dataLayer
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event, ...props });
}
