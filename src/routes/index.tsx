import { createFileRoute } from "@tanstack/react-router";
import { Languages, LayoutList, Rows3, Volume2, Youtube } from "lucide-react";
import { useState } from "react";

import { ControlRibbonView } from "@/viewer/views/ControlRibbonView";
import { CueStageView } from "@/viewer/views/CueStageView";
import { LanguageRailView } from "@/viewer/views/LanguageRailView";
import { TranscriptDeckView } from "@/viewer/views/TranscriptDeckView";
import { useViewerCoordinator } from "@/viewer/useViewerCoordinator";

export const Route = createFileRoute("/")({
  component: ViewerPage,
  head: () => ({
    meta: [
      { title: "Subtitle Flow Studio — Pure Views Demo" },
      {
        name: "description",
        content:
          "Alternative pure subtitle views for the YouTube Subtitle & Speech Flow Viewer: transcript deck, cue stage, language rail and control ribbon, driven by injected fixture data.",
      },
      { property: "og:title", content: "Subtitle Flow Studio — Pure Views Demo" },
      {
        property: "og:description",
        content:
          "Dual-language subtitle views with injected data: transcript deck, cue stage, language rail and playback control ribbon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ViewerPage() {
  const v = useViewerCoordinator();
  const [layout, setLayout] = useState<"deck" | "stage">("deck");

  const subtitleProps = {
    cues: v.captionsEnabled ? v.cues : [],
    activeCueId: v.activeCueId,
    translatedCues: v.translatedCues,
    showTranslation: v.showTranslation,
    showTimestamps: true,
    direction: v.direction,
    translationDirection: v.translationDirection,
    onSelectCue: v.onSelectCue,
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-4">
          <Youtube className="size-6 text-accent" />
          <div className="me-auto">
            <h1 className="text-lg font-semibold tracking-tight">Subtitle Flow Studio</h1>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              video {v.host.videoId} · data: {v.host.source}
            </p>
          </div>
          <div className="flex rounded-lg border border-border p-1">
            <button
              type="button"
              aria-pressed={layout === "deck"}
              onClick={() => setLayout("deck")}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
                layout === "deck" ? "bg-accent/20 text-accent" : "text-muted-foreground"
              }`}
            >
              <LayoutList className="size-4" /> Deck
            </button>
            <button
              type="button"
              aria-pressed={layout === "stage"}
              onClick={() => setLayout("stage")}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
                layout === "stage" ? "bg-accent/20 text-accent" : "text-muted-foreground"
              }`}
            >
              <Rows3 className="size-4" /> Stage
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        <section className="space-y-3 rounded-xl border border-border bg-card/40 p-4">
          <LanguageRailView
            label="Subtitles"
            languages={v.host.languages}
            selectedCode={v.primaryCode}
            onSelect={v.setPrimaryCode}
          />
          <LanguageRailView
            label="Translation"
            languages={v.host.languages}
            selectedCode={v.targetCode}
            onSelect={v.setTargetCode}
          />
          <button
            type="button"
            aria-pressed={v.showTranslation}
            onClick={v.onToggleTranslation}
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-foreground/80 hover:border-accent/60"
          >
            <Languages className="size-4" />
            {v.showTranslation ? "Parallel translation on" : "Parallel translation off"}
          </button>
          <button
            type="button"
            aria-pressed={v.speechEnabled}
            onClick={v.onToggleSpeech}
            className="ms-2 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-foreground/80 hover:border-accent/60"
          >
            <Volume2 className="size-4" />
            {v.speechEnabled ? "Read aloud on" : "Read aloud off"}
          </button>
        </section>

        <section
          className={`overflow-hidden rounded-xl border border-border bg-card/40 ${
            v.theaterMode ? "h-[70vh]" : "h-[52vh]"
          }`}
        >
          <div className="h-[calc(100%-7.5rem)]">
            {layout === "deck" ? (
              <TranscriptDeckView {...subtitleProps} />
            ) : (
              <CueStageView {...subtitleProps} />
            )}
          </div>
          <ControlRibbonView
            isPlaying={v.isPlaying}
            currentTime={v.currentTime}
            duration={v.duration}
            playbackRate={v.playbackRate}
            captionsEnabled={v.captionsEnabled}
            theaterMode={v.theaterMode}
            onTogglePlay={v.onTogglePlay}
            onSeek={v.onSeek}
            onRateChange={v.onRateChange}
            onToggleCaptions={v.onToggleCaptions}
            onToggleTheater={v.onToggleTheater}
          />
        </section>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Every view above is pure: cues, languages and playback metrics are injected as props.
          The web demo injects fixture tracks; the Android shell can assign
          <code className="mx-1 font-mono text-accent">window.__YTVIEW_HOST__</code>
          with intercepted timedtext data and the same views render it unchanged.
        </p>
      </div>
    </main>
  );
}
