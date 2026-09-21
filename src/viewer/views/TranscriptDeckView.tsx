import { useEffect, useRef } from "react";

import { formatTimecode, type SubtitleViewProps } from "../contracts";

/**
 * Alternative subtitle view #1 — "Transcript Deck".
 * Pure: renders injected cues, highlights activeCueId, emits onSelectCue.
 */
export function TranscriptDeckView({
  cues,
  activeCueId = null,
  translatedCues,
  showTranslation = false,
  showTimestamps = true,
  direction = "auto",
  translationDirection = "auto",
  onSelectCue,
}: SubtitleViewProps) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!activeCueId || !listRef.current) return;
    const node = listRef.current.querySelector<HTMLElement>(
      `[data-cue-id="${activeCueId}"]`,
    );
    node?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeCueId]);

  if (cues.length === 0) {
    return (
      <p className="p-6 text-sm text-muted-foreground" data-testid="transcript-empty">
        No cues injected.
      </p>
    );
  }

  return (
    <ul
      ref={listRef}
      dir={direction}
      data-testid="transcript-deck"
      className="h-full space-y-1 overflow-y-auto p-3"
    >
      {cues.map((cue) => {
        const isActive = cue.id === activeCueId;
        const translation = translatedCues?.[cue.id];
        return (
          <li key={cue.id} data-cue-id={cue.id}>
            <button
              type="button"
              aria-current={isActive || undefined}
              data-active={isActive || undefined}
              onClick={() => onSelectCue?.(cue)}
              className={`group flex w-full gap-3 rounded-lg px-3 py-2 text-start transition-colors ${
                isActive
                  ? "bg-accent/15 shadow-[inset_2px_0_0_0_var(--accent)]"
                  : "hover:bg-muted/60"
              }`}
            >
              {showTimestamps && (
                <span
                  dir="ltr"
                  className={`mt-0.5 shrink-0 font-mono text-[11px] tabular-nums ${
                    isActive ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {formatTimecode(cue.start)}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span
                  className={`block text-[15px] leading-snug ${
                    isActive ? "font-semibold text-foreground" : "text-foreground/80"
                  }`}
                >
                  {cue.text}
                </span>
                {showTranslation && translation && (
                  <span
                    dir={translationDirection}
                    className="mt-1 block text-[13px] leading-snug text-primary"
                  >
                    {translation}
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
