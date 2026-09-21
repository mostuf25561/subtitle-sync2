import { formatTimecode, type SubtitleViewProps } from "../contracts";

/**
 * Alternative subtitle view #2 — "Cue Stage".
 * Pure single-cue stage: shows the active cue large, with its parallel
 * translation underneath and the neighbouring cues dimmed.
 */
export function CueStageView({
  cues,
  activeCueId = null,
  translatedCues,
  showTranslation = true,
  showTimestamps = true,
  direction = "auto",
  translationDirection = "auto",
  onSelectCue,
}: SubtitleViewProps) {
  const index = cues.findIndex((c) => c.id === activeCueId);
  const active = index >= 0 ? cues[index] : cues[0];
  const previous = index > 0 ? cues[index - 1] : undefined;
  const next = index >= 0 && index < cues.length - 1 ? cues[index + 1] : undefined;

  if (!active) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No cues injected.
      </div>
    );
  }

  const translation = translatedCues?.[active.id];

  return (
    <div
      dir={direction}
      data-testid="cue-stage"
      className="flex h-full flex-col justify-center gap-4 p-6"
    >
      <p className="truncate text-sm text-muted-foreground/60">{previous?.text ?? "—"}</p>

      <button
        type="button"
        data-cue-id={active.id}
        data-active
        onClick={() => onSelectCue?.(active)}
        className="rounded-xl border border-accent/30 bg-card/60 p-5 text-start transition-colors hover:border-accent/60"
      >
        {showTimestamps && (
          <span dir="ltr" className="font-mono text-[11px] tabular-nums text-accent">
            {formatTimecode(active.start)} · {active.duration.toFixed(1)}s
          </span>
        )}
        <span className="mt-2 block text-2xl font-semibold leading-tight text-foreground">
          {active.text}
        </span>
        {showTranslation && translation && (
          <span
            dir={translationDirection}
            className="mt-3 block text-lg leading-snug text-primary"
          >
            {translation}
          </span>
        )}
      </button>

      <p className="truncate text-sm text-muted-foreground/60">{next?.text ?? "—"}</p>
    </div>
  );
}
