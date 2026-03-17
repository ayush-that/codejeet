"use client";

import { useCallback } from "react";
import { Headphones, Pause, Play, RotateCcw, RotateCw, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { usePodcastPlayer } from "@/hooks/use-podcast-player";

const PLAYBACK_RATES = [0.9, 0.95, 1, 1.25, 1.5, 2] as const;

function formatChapterDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function PlayerSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-3 text-center">
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="mx-auto h-4 w-40" />
      </div>
      <div className="space-y-2">
        <Skeleton className="mx-auto h-6 w-72" />
        <Skeleton className="mx-auto h-4 w-32" />
      </div>
      <Skeleton className="h-1.5 w-full" />
      <div className="flex items-center justify-center gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-9 rounded-full" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function PodcastPlayer() {
  const {
    manifest,
    isLoading,
    error,
    currentChapter,
    currentChapterIndex,
    isPlaying,
    progressPercentage,
    formattedCurrentTime,
    formattedDuration,
    playbackRate,
    hasNextChapter,
    hasPrevChapter,
    togglePlay,
    seekByPercentage,
    skipForward,
    skipBackward,
    nextChapter,
    prevChapter,
    goToChapter,
    setPlaybackRate,
  } = usePodcastPlayer();

  const scrollActiveRef = useCallback((el: HTMLButtonElement | null) => {
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  if (isLoading) {
    return <PlayerSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <p className="text-destructive">Failed to load podcast: {error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!manifest || !currentChapter) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <Headphones className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-lg text-muted-foreground">Podcast coming soon</p>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-1 text-center">
          <a
            href="https://github.com/subhashchy/The-Accidental-CTO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-bold tracking-tight hover:underline"
          >
            {manifest.title}
          </a>
          <p className="text-sm text-muted-foreground">
            <a
              href="https://x.com/subhashchy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {manifest.author}
            </a>
          </p>
        </div>

        <div className="space-y-1 text-center">
          <h2 className="text-lg font-semibold">{currentChapter.title}</h2>
          <p className="text-xs text-muted-foreground">
            Chapter {currentChapter.index} of {manifest.total_chapters}
          </p>
        </div>

        <div className="space-y-2">
          <Slider
            value={[progressPercentage]}
            max={100}
            step={0.1}
            onValueChange={(v) => seekByPercentage(v[0])}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formattedCurrentTime}</span>
            <span>{formattedDuration}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={prevChapter}
                disabled={!hasPrevChapter}
                aria-label="Previous chapter"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous chapter ([)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={skipBackward}
                aria-label="Skip back 15 seconds"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Back 15s (←)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="icon"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="h-12 w-12 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" fill="currentColor" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isPlaying ? "Pause" : "Play"} (Space)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={skipForward}
                aria-label="Skip forward 30 seconds"
              >
                <RotateCw className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Forward 30s (→)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextChapter}
                disabled={!hasNextChapter}
                aria-label="Next chapter"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next chapter (])</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center justify-center gap-1">
          {PLAYBACK_RATES.map((rate) => (
            <Tooltip key={rate}>
              <TooltipTrigger asChild>
                <Button
                  variant={playbackRate === rate ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPlaybackRate(rate)}
                  className="text-xs"
                >
                  {rate}x
                </Button>
              </TooltipTrigger>
              <TooltipContent>{rate}x speed</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="rounded-lg border">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Chapters</h3>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="divide-y">
              {manifest.chapters.map((chapter, idx) => {
                const isActive = idx === currentChapterIndex;
                return (
                  <button
                    key={chapter.index}
                    ref={isActive ? scrollActiveRef : undefined}
                    onClick={() => goToChapter(idx)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50",
                      isActive && "bg-accent font-medium"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {chapter.index}
                    </span>
                    <span className="min-w-0 flex-1 text-sm">{chapter.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatChapterDuration(chapter.duration_seconds)}
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Space to play/pause &middot; Arrow keys to skip &middot; [ ] to change chapter
        </p>
      </div>
    </TooltipProvider>
  );
}
