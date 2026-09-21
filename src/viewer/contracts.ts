/**
 * Pure view contracts — mirrors docs/designs/DESIGN_SUBTITLE_VIEWS.md,
 * DESIGN_VIEW_LANGS.md and DESIGN_CONTROLS_VIEW.md of the Youtubenet6 repo.
 *
 * Every view in src/viewer/views is a pure presentation component: it never
 * fetches, parses, translates, or talks to a player. All data arrives via props
 * (dependency injection) so the same views can be driven by web fixtures or by
 * the Android shell injecting intercepted timedtext data.
 */

export interface SubtitleCue {
  id: string;
  start: number;
  duration: number;
  text: string;
}

export interface SubtitleViewProps {
  cues: SubtitleCue[];
  activeCueId?: string | null;
  translatedCues?: Record<string, string>;
  showTranslation?: boolean;
  showTimestamps?: boolean;
  direction?: "ltr" | "rtl" | "auto";
  translationDirection?: "ltr" | "rtl" | "auto";
  onSelectCue?: (cue: SubtitleCue) => void;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName?: string;
  direction?: "ltr" | "rtl";
  enabled?: boolean;
  color?: string;
}

export interface LanguageViewProps {
  languages: LanguageOption[];
  selectedCode?: string | null;
  disabled?: boolean;
  onSelect: (code: string) => void;
  multiple?: boolean;
  selectedCodes?: string[];
  onChangeMultiple?: (codes: string[]) => void;
}

export interface PlaybackControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  availableRates?: number[];
  captionsEnabled: boolean;
  theaterMode?: boolean;
  isBuffering?: boolean;
  disabled?: boolean;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onRateChange: (rate: number) => void;
  onToggleCaptions: () => void;
  onToggleTheater?: () => void;
}

/** MM:SS / HH:MM:SS formatting used by the views. */
export function formatTimecode(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds || 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
