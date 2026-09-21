import { Captions, Maximize2, Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import type { MouseEvent } from "react";

import { formatTimecode, type PlaybackControlsProps } from "../contracts";

const DEFAULT_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

/**
 * Alternative playback controls view — "Control Ribbon".
 * Pure: renders injected metrics only, emits intent callbacks.
 */
export function ControlRibbonView({
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  availableRates = DEFAULT_RATES,
  captionsEnabled,
  theaterMode = false,
  isBuffering = false,
  disabled = false,
  onTogglePlay,
  onSeek,
  onRateChange,
  onToggleCaptions,
  onToggleTheater,
}: PlaybackControlsProps) {
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const seekFromEvent = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled || duration <= 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    onSeek(ratio * duration);
  };

  return (
    <div data-testid="control-ribbon" className="space-y-3 border-t border-border p-4">
      <div
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        tabIndex={0}
        onClick={seekFromEvent}
        className="group h-2 w-full cursor-pointer rounded-full bg-muted"
      >
        <div
          className="relative h-2 rounded-full bg-accent transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        >
          <span className="absolute -end-1.5 top-1/2 size-4 -translate-y-1/2 rounded-full bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-label={isPlaying ? "Pause" : "Play"}
          disabled={disabled}
          onClick={onTogglePlay}
          className="inline-flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
        </button>

        <button
          type="button"
          aria-label="Back 10 seconds"
          disabled={disabled}
          onClick={() => onSeek(Math.max(0, currentTime - 10))}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground/80 hover:border-accent/60"
        >
          <RotateCcw className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Forward 10 seconds"
          disabled={disabled}
          onClick={() => onSeek(Math.min(duration, currentTime + 10))}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground/80 hover:border-accent/60"
        >
          <RotateCw className="size-4" />
        </button>

        <span dir="ltr" className="ms-1 font-mono text-sm tabular-nums text-muted-foreground">
          {formatTimecode(currentTime)} / {formatTimecode(duration)}
          {isBuffering && <span className="ms-2 text-accent">buffering…</span>}
        </span>

        <div className="ms-auto flex items-center gap-2">
          <select
            aria-label="Playback speed"
            disabled={disabled}
            value={playbackRate}
            onChange={(event) => onRateChange(Number(event.target.value))}
            className="rounded-md border border-border bg-card px-2 py-1.5 font-mono text-sm text-foreground"
          >
            {availableRates.map((rate) => (
              <option key={rate} value={rate}>
                {rate}×
              </option>
            ))}
          </select>

          <button
            type="button"
            aria-label="Toggle captions"
            aria-pressed={captionsEnabled}
            onClick={onToggleCaptions}
            className={`inline-flex size-10 items-center justify-center rounded-md border transition-colors ${
              captionsEnabled
                ? "border-accent bg-accent/20 text-accent"
                : "border-border text-muted-foreground"
            }`}
          >
            <Captions className="size-4" />
          </button>

          {onToggleTheater && (
            <button
              type="button"
              aria-label="Toggle theater mode"
              aria-pressed={theaterMode}
              onClick={onToggleTheater}
              className={`inline-flex size-10 items-center justify-center rounded-md border transition-colors ${
                theaterMode
                  ? "border-accent bg-accent/20 text-accent"
                  : "border-border text-muted-foreground"
              }`}
            >
              <Maximize2 className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
