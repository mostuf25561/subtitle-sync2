import type { LanguageOption, SubtitleCue } from "./contracts";
import {
  FIXTURE_DURATION,
  FIXTURE_LANGUAGES,
  FIXTURE_TRACKS,
  FIXTURE_VIDEO_ID,
} from "./fixtures";

/**
 * Host data bridge.
 *
 * Web demo: data comes from fixtures only (no network, no parsing here).
 * Android shell: the native code intercepts timedtext responses and assigns
 * `window.__YTVIEW_HOST__` before the views mount, so the very same pure views
 * render injected live data without any change.
 */
export interface ViewerHostData {
  videoId: string;
  duration: number;
  languages: LanguageOption[];
  tracks: Record<string, SubtitleCue[]>;
  source: "fixtures" | "injected";
}

declare global {
  interface Window {
    __YTVIEW_HOST__?: Omit<ViewerHostData, "source">;
  }
}

export function readHostData(): ViewerHostData {
  const injected = typeof window !== "undefined" ? window.__YTVIEW_HOST__ : undefined;
  if (injected?.tracks && injected.languages?.length) {
    return { ...injected, source: "injected" };
  }
  return {
    videoId: FIXTURE_VIDEO_ID,
    duration: FIXTURE_DURATION,
    languages: FIXTURE_LANGUAGES,
    tracks: FIXTURE_TRACKS,
    source: "fixtures",
  };
}

/**
 * Builds the `translatedCues` map the subtitle views expect: primary cue id ->
 * text of the time-aligned cue in the target track. Alignment is a coordinator
 * concern, never a view concern.
 */
export function buildParallelMap(
  primary: SubtitleCue[],
  target: SubtitleCue[],
): Record<string, string> {
  const map: Record<string, string> = {};
  if (!target.length) return map;
  let cursor = 0;
  for (const cue of primary) {
    const center = cue.start + cue.duration / 2;
    let next = target[cursor + 1];
    let curr = target[cursor]!;
    while (next && Math.abs(next.start - center) <= Math.abs(curr.start - center)) {
      cursor += 1;
      curr = next;
      next = target[cursor + 1];
    }
    map[cue.id] = curr.text;
  }
  return map;
}

export function resolveActiveCueId(cues: SubtitleCue[], time: number): string | null {
  let active: string | null = null;
  for (const cue of cues) {
    if (cue.start <= time) active = cue.id;
    else break;
  }
  return active;
}
