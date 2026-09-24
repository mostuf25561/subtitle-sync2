import { useEffect, useMemo, useRef, useState } from "react";

import type { SubtitleCue } from "./contracts";
import { buildParallelMap, readHostData, resolveActiveCueId } from "./dataSource";

/**
 * State coordinator (impure side of the boundary): owns the clock, the selected
 * languages and the resolved active cue. Views receive its output as props.
 */
export function useViewerCoordinator() {
  const host = useMemo(() => readHostData(), []);
  const [primaryCode, setPrimaryCode] = useState(
    () => host.languages.find((l) => l.enabled !== false)?.code ?? "en",
  );
  const [targetCode, setTargetCode] = useState(
    () => host.languages.find((l) => l.code !== primaryCode)?.code ?? primaryCode,
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [theaterMode, setTheaterMode] = useState(false);

  const cues: SubtitleCue[] = host.tracks[primaryCode] ?? [];
  const targetCues: SubtitleCue[] = host.tracks[targetCode] ?? [];
  const duration = host.duration;

  const rateRef = useRef(playbackRate);
  rateRef.current = playbackRate;

  useEffect(() => {
    if (!isPlaying) return;
    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const delta = ((now - last) / 1000) * rateRef.current;
      last = now;
      setCurrentTime((t) => {
        const next = t + delta;
        if (next >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, duration]);

  const translatedCues = useMemo(
    () => (primaryCode === targetCode ? {} : buildParallelMap(cues, targetCues)),
    [cues, targetCues, primaryCode, targetCode],
  );

  const activeCueId = useMemo(() => resolveActiveCueId(cues, currentTime), [cues, currentTime]);

  const primaryLang = host.languages.find((l) => l.code === primaryCode);
  const targetLang = host.languages.find((l) => l.code === targetCode);

  const [speechEnabled, setSpeechEnabled] = useState(false);
  useEffect(() => {
    if (!speechEnabled || !isPlaying || !activeCueId) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const cue = cues.find((c) => c.id === activeCueId);
    if (!cue) return;
    const u = new SpeechSynthesisUtterance(cue.text);
    u.lang = primaryCode;
    u.rate = playbackRate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }, [activeCueId, speechEnabled, isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if ((!speechEnabled || !isPlaying) && typeof window !== "undefined" && "speechSynthesis" in window)
      window.speechSynthesis.cancel();
  }, [speechEnabled, isPlaying]);

  return {
    host,
    cues,
    activeCueId,
    translatedCues,
    showTranslation: showTranslation && primaryCode !== targetCode,
    direction: primaryLang?.direction ?? "auto",
    translationDirection: targetLang?.direction ?? "auto",
    primaryCode,
    targetCode,
    setPrimaryCode,
    setTargetCode,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    captionsEnabled,
    theaterMode,
    onTogglePlay: () => setIsPlaying((p) => !p),
    onSeek: (seconds: number) => setCurrentTime(Math.min(duration, Math.max(0, seconds))),
    onRateChange: setPlaybackRate,
    onToggleCaptions: () => setCaptionsEnabled((c) => !c),
    onToggleTheater: () => setTheaterMode((t) => !t),
    onToggleTranslation: () => setShowTranslation((s) => !s),
    speechEnabled,
    onToggleSpeech: () => setSpeechEnabled((s) => !s),
    onSelectCue: (cue: SubtitleCue) => setCurrentTime(cue.start),
  } as const;
}
