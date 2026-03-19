"use client";

import { useSyncExternalStore } from "react";
import type { PodcastChapter, PodcastManifest } from "@/lib/podcast-types";

const STORAGE_KEY = "podcast-progress-v1";
const AVAILABLE_RATES = [0.9, 0.95, 1, 1.25, 1.5, 2] as const;
const TIMEUPDATE_THROTTLE_MS = 250;
const SAVE_DEBOUNCE_MS = 5000;

interface StoredProgress {
  chapterIndex: number;
  currentTime: number;
  playbackRate: number;
}

interface PodcastState {
  manifest: PodcastManifest | null;
  isLoading: boolean;
  error: string | null;
  currentChapterIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  bufferedPercentage: number;
  playbackRate: number;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function loadProgress(): StoredProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredProgress;
  } catch {
    return null;
  }
}

function saveProgress(progress: StoredProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

function getAudioUrl(chapter: PodcastChapter): string {
  const base = process.env.NEXT_PUBLIC_R2_BASE_URL ?? "";
  return `${base}/podcast/${chapter.file}`;
}

function updateMediaSessionMetadata(chapter: PodcastChapter | null) {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator) || !chapter) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: chapter.title,
    artist: "Subhash Choudhary",
    album: "The Accidental CTO",
  });
}

let state: PodcastState = {
  manifest: null,
  isLoading: true,
  error: null,
  currentChapterIndex: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  bufferedPercentage: 0,
  playbackRate: 1,
};

let audio: HTMLAudioElement | null = null;
const storeListeners = new Set<() => void>();
let initialized = false;
let subscriberCount = 0;
let activeFetchId = 0;
let lastTimeupdate = 0;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let restoredTime: number | null = null;
let playAfterLoad = false;

function updateState(partial: Partial<PodcastState>) {
  state = { ...state, ...partial };
  storeListeners.forEach((l) => l());
}

function goToChapter(index: number) {
  const m = state.manifest;
  if (!m || index < 0 || index >= m.chapters.length) return;

  const chapter = m.chapters[index];
  updateState({
    currentChapterIndex: index,
    currentTime: 0,
    duration: 0,
    bufferedPercentage: 0,
  });
  restoredTime = null;
  playAfterLoad = true;

  if (audio) {
    audio.src = getAudioUrl(chapter);
    audio.load();
  }

  updateMediaSessionMetadata(chapter);
  saveProgress({ chapterIndex: index, currentTime: 0, playbackRate: audio?.playbackRate ?? 1 });
}

function handleKeyDown(e: KeyboardEvent) {
  const target = e.target as HTMLElement;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return;
  if (target.isContentEditable) return;
  if (!audio) return;

  switch (e.key) {
    case " ":
    case "k":
      e.preventDefault();
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
      break;
    case "ArrowLeft":
      e.preventDefault();
      audio.currentTime = Math.max(0, audio.currentTime - 15);
      updateState({ currentTime: audio.currentTime });
      break;
    case "ArrowRight":
      e.preventDefault();
      audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 30);
      updateState({ currentTime: audio.currentTime });
      break;
    case "[":
      e.preventDefault();
      if (state.currentChapterIndex > 0) goToChapter(state.currentChapterIndex - 1);
      break;
    case "]":
      e.preventDefault();
      if (state.manifest && state.currentChapterIndex < state.manifest.chapters.length - 1) {
        goToChapter(state.currentChapterIndex + 1);
      }
      break;
    case "P":
      if (e.shiftKey) {
        e.preventDefault();
        if (state.currentChapterIndex > 0) goToChapter(state.currentChapterIndex - 1);
      }
      break;
    case "N":
      if (e.shiftKey) {
        e.preventDefault();
        if (state.manifest && state.currentChapterIndex < state.manifest.chapters.length - 1) {
          goToChapter(state.currentChapterIndex + 1);
        }
      }
      break;
  }
}

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  audio = new Audio();
  audio.preload = "metadata";

  audio.addEventListener("loadedmetadata", () => {
    if (!audio) return;
    const updates: Partial<PodcastState> = { duration: audio.duration };
    if (restoredTime !== null && restoredTime < audio.duration) {
      audio.currentTime = restoredTime;
      updates.currentTime = restoredTime;
      restoredTime = null;
    }
    updateState(updates);
    if (playAfterLoad) {
      playAfterLoad = false;
      audio.play().catch(() => {});
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio) return;
    const now = Date.now();
    if (now - lastTimeupdate < TIMEUPDATE_THROTTLE_MS) return;
    lastTimeupdate = now;
    updateState({ currentTime: audio.currentTime });
    if (!saveTimer) {
      saveTimer = setTimeout(() => {
        saveTimer = null;
        if (!audio) return;
        saveProgress({
          chapterIndex: state.currentChapterIndex,
          currentTime: audio.currentTime,
          playbackRate: audio.playbackRate,
        });
      }, SAVE_DEBOUNCE_MS);
    }
  });

  audio.addEventListener("progress", () => {
    if (!audio || audio.buffered.length === 0 || audio.duration === 0) return;
    const end = audio.buffered.end(audio.buffered.length - 1);
    updateState({ bufferedPercentage: (end / audio.duration) * 100 });
  });

  audio.addEventListener("play", () => updateState({ isPlaying: true }));

  audio.addEventListener("pause", () => {
    if (!audio) return;
    updateState({ isPlaying: false });
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    saveProgress({
      chapterIndex: state.currentChapterIndex,
      currentTime: audio.currentTime,
      playbackRate: audio.playbackRate,
    });
  });

  audio.addEventListener("ended", () => {
    if (!audio) return;
    updateState({ isPlaying: false });
    const m = state.manifest;
    const idx = state.currentChapterIndex;
    if (m && idx < m.chapters.length - 1) {
      const nextIdx = idx + 1;
      updateState({
        currentChapterIndex: nextIdx,
        currentTime: 0,
        duration: 0,
        bufferedPercentage: 0,
      });
      playAfterLoad = true;
      audio.src = getAudioUrl(m.chapters[nextIdx]);
      audio.load();
      saveProgress({ chapterIndex: nextIdx, currentTime: 0, playbackRate: audio.playbackRate });
      updateMediaSessionMetadata(m.chapters[nextIdx]);
    }
  });

  audio.addEventListener("error", () => {
    updateState({
      error: audio?.error?.message ?? "Audio playback error",
      isPlaying: false,
    });
  });

  const fetchId = ++activeFetchId;
  (async () => {
    try {
      const res = await fetch("/data/podcast.json");
      if (fetchId !== activeFetchId) return;
      if (!res.ok) throw new Error(`Failed to fetch podcast manifest: ${res.status}`);
      const data = (await res.json()) as PodcastManifest;
      if (fetchId !== activeFetchId) return;

      const saved = loadProgress();
      let startIndex = 0;
      let startTime = 0;
      let rate = 1;

      if (saved && saved.chapterIndex < data.chapters.length) {
        startIndex = saved.chapterIndex;
        startTime = saved.currentTime;
        rate = AVAILABLE_RATES.includes(saved.playbackRate as (typeof AVAILABLE_RATES)[number])
          ? saved.playbackRate
          : 1;
      }

      if (audio) {
        audio.playbackRate = rate;
        const chapter = data.chapters[startIndex];
        if (chapter) {
          if (startTime > 0) restoredTime = startTime;
          audio.src = getAudioUrl(chapter);
          audio.load();
          updateMediaSessionMetadata(chapter);
        }
      }

      updateState({
        manifest: data,
        currentChapterIndex: startIndex,
        playbackRate: rate,
        isLoading: false,
      });
    } catch (e) {
      if (fetchId !== activeFetchId) return;
      updateState({
        error: e instanceof Error ? e.message : "Failed to load podcast data",
        isLoading: false,
      });
    }
  })();

  if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => audio?.play()],
      ["pause", () => audio?.pause()],
      [
        "previoustrack",
        () => {
          if (state.currentChapterIndex > 0) goToChapter(state.currentChapterIndex - 1);
        },
      ],
      [
        "nexttrack",
        () => {
          const m = state.manifest;
          if (m && state.currentChapterIndex < m.chapters.length - 1) {
            goToChapter(state.currentChapterIndex + 1);
          }
        },
      ],
      [
        "seekbackward",
        () => {
          if (audio) {
            audio.currentTime = Math.max(0, audio.currentTime - 15);
            updateState({ currentTime: audio.currentTime });
          }
        },
      ],
      [
        "seekforward",
        () => {
          if (audio) {
            audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 30);
            updateState({ currentTime: audio.currentTime });
          }
        },
      ],
    ];
    for (const [action, handler] of handlers) {
      navigator.mediaSession.setActionHandler(action, handler);
    }
  }

  document.addEventListener("keydown", handleKeyDown);
}

function cleanup() {
  if (!audio) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveProgress({
    chapterIndex: state.currentChapterIndex,
    currentTime: audio.currentTime,
    playbackRate: audio.playbackRate,
  });
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
  audio = null;

  if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
    const actions: MediaSessionAction[] = [
      "play",
      "pause",
      "previoustrack",
      "nexttrack",
      "seekbackward",
      "seekforward",
    ];
    for (const action of actions) {
      navigator.mediaSession.setActionHandler(action, null);
    }
  }

  document.removeEventListener("keydown", handleKeyDown);
  initialized = false;
}

function playAction() {
  audio?.play().catch(() => {});
}

function pauseAction() {
  audio?.pause();
}

function togglePlayAction() {
  if (!audio?.src) return;
  if (audio.paused) audio.play().catch(() => {});
  else audio.pause();
}

function seekAction(time: number) {
  if (!audio) return;
  audio.currentTime = Math.max(0, Math.min(audio.duration || 0, time));
  updateState({ currentTime: audio.currentTime });
}

function seekByPercentageAction(pct: number) {
  if (!audio || !audio.duration) return;
  audio.currentTime = (pct / 100) * audio.duration;
  updateState({ currentTime: audio.currentTime });
}

function skipForwardAction() {
  if (!audio) return;
  audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 30);
  updateState({ currentTime: audio.currentTime });
}

function skipBackwardAction() {
  if (!audio) return;
  audio.currentTime = Math.max(0, audio.currentTime - 15);
  updateState({ currentTime: audio.currentTime });
}

function nextChapterAction() {
  const m = state.manifest;
  if (m && state.currentChapterIndex < m.chapters.length - 1) {
    goToChapter(state.currentChapterIndex + 1);
  }
}

function prevChapterAction() {
  if (state.currentChapterIndex > 0) {
    goToChapter(state.currentChapterIndex - 1);
  }
}

function setPlaybackRateAction(rate: number) {
  if (!audio) return;
  audio.playbackRate = rate;
  saveProgress({
    chapterIndex: state.currentChapterIndex,
    currentTime: audio.currentTime,
    playbackRate: rate,
  });
  updateState({ playbackRate: rate });
}

function subscribe(callback: () => void): () => void {
  storeListeners.add(callback);
  subscriberCount++;
  init();
  return () => {
    storeListeners.delete(callback);
    subscriberCount--;
    if (subscriberCount === 0) cleanup();
  };
}

function getSnapshot(): PodcastState {
  return state;
}

const serverSnapshot: PodcastState = {
  manifest: null,
  isLoading: true,
  error: null,
  currentChapterIndex: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  bufferedPercentage: 0,
  playbackRate: 1,
};

function getServerSnapshot(): PodcastState {
  return serverSnapshot;
}

export function usePodcastPlayer() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const chapters = s.manifest?.chapters ?? [];
  const currentChapter: PodcastChapter | null = chapters[s.currentChapterIndex] ?? null;
  const hasNextChapter = s.currentChapterIndex < chapters.length - 1;
  const hasPrevChapter = s.currentChapterIndex > 0;
  const progressPercentage = s.duration > 0 ? (s.currentTime / s.duration) * 100 : 0;
  const formattedCurrentTime = formatTime(s.currentTime);
  const formattedDuration = formatTime(s.duration);

  return {
    manifest: s.manifest,
    isLoading: s.isLoading,
    error: s.error,
    currentChapter,
    currentChapterIndex: s.currentChapterIndex,
    isPlaying: s.isPlaying,
    currentTime: s.currentTime,
    duration: s.duration,
    bufferedPercentage: s.bufferedPercentage,
    playbackRate: s.playbackRate,
    formattedCurrentTime,
    formattedDuration,
    progressPercentage,
    play: playAction,
    pause: pauseAction,
    togglePlay: togglePlayAction,
    seek: seekAction,
    seekByPercentage: seekByPercentageAction,
    skipForward: skipForwardAction,
    skipBackward: skipBackwardAction,
    nextChapter: nextChapterAction,
    prevChapter: prevChapterAction,
    goToChapter,
    setPlaybackRate: setPlaybackRateAction,
    hasNextChapter,
    hasPrevChapter,
  };
}
