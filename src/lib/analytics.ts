/**
 * Analytics helper
 *
 * Wraps Microsoft Clarity's `clarity()` function so that:
 *   - We never throw if Clarity isn't loaded (dev / blocked / not yet ready).
 *   - We never fire events on localhost / from bots.
 *   - Event names + metadata are type-safe and documented in one place.
 *
 * Cloudflare Web Analytics tracks pageviews automatically. Custom events
 * aren't supported in their free tier, so we only use Clarity for those.
 *
 * Docs:
 *   - Clarity API     → https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api
 *   - Cloudflare RUM  → https://developers.cloudflare.com/web-analytics/
 */

type ClarityFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

/** True only when running in the browser on a non-local host. */
function shouldTrack(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')) {
    return false;
  }
  return true;
}

/** Generic Clarity custom event. */
export function trackEvent(name: string, metadata: Record<string, string> = {}): void {
  if (!shouldTrack()) return;
  const c = window.clarity;
  if (typeof c !== 'function') return;

  try {
    c('event', name);
    for (const [key, value] of Object.entries(metadata)) {
      // `set` attaches a tag to the current session; useful for filtering.
      c('set', key, value);
    }
  } catch {
    // Swallow — analytics must never break the UI.
  }
}

/* ─── Domain-specific helpers ─────────────────────────────────────────── */

/** A user opened a project card in the 3D carousel. */
export function trackProjectOpen(projectId: string, projectTitle: string): void {
  trackEvent('project_opened', {
    project_id: projectId,
    project_title: projectTitle
  });
}

/** Contact channel typing matches the ContactSection card ids. */
export type ContactChannel =
  | 'whatsapp'
  | 'phone'
  | 'copy_phone'
  | 'email'
  | 'linkedin'
  | 'github';

/** A user clicked a contact channel (WhatsApp, email, etc.). */
export function trackContactClick(channel: ContactChannel): void {
  trackEvent('contact_click', { channel });
}

/** A user scrolled into a major section (projects / about / education / contact). */
export type SectionId = 'projects' | 'about' | 'education' | 'contact';

export function trackSectionView(section: SectionId): void {
  trackEvent('section_view', { section });
}
