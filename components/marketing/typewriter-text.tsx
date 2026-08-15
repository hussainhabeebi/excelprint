"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

interface TypewriterTextProps {
  words: string[];
  className?: string;
  typingSpeedMs?: number;
  deletingSpeedMs?: number;
  pauseMs?: number;
}

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
}

/**
 * Cycles through `words`, typing and deleting each in turn. Respects
 * prefers-reduced-motion by freezing on the first word instead of
 * animating. Screen readers get the full static list via sr-only text —
 * the animated span is aria-hidden so it isn't read as a stream of
 * partial words.
 */
export function TypewriterText({
  words,
  className,
  typingSpeedMs = 70,
  deletingSpeedMs = 40,
  pauseMs = 1600,
}: TypewriterTextProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || words.length === 0) return;
    const currentWord = words[wordIndex];

    if (phase === "typing") {
      if (charCount < currentWord.length) {
        const timer = setTimeout(() => setCharCount((c) => c + 1), typingSpeedMs);
        return () => clearTimeout(timer);
      }
      const timer = setTimeout(() => setPhase("pausing"), pauseMs);
      return () => clearTimeout(timer);
    }

    if (phase === "pausing") {
      const timer = setTimeout(() => setPhase("deleting"), 0);
      return () => clearTimeout(timer);
    }

    // deleting
    if (charCount > 0) {
      const timer = setTimeout(() => setCharCount((c) => c - 1), deletingSpeedMs);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setWordIndex((i) => (i + 1) % words.length);
      setPhase("typing");
    }, 0);
    return () => clearTimeout(timer);
  }, [charCount, phase, wordIndex, words, reducedMotion, typingSpeedMs, deletingSpeedMs, pauseMs]);

  const displayed = reducedMotion ? words[0] : words[wordIndex].slice(0, charCount);

  return (
    <span className={className}>
      <span aria-hidden="true">
        {displayed}
        {!reducedMotion && <span className="animate-pulse">|</span>}
      </span>
      <span className="sr-only">{words.join(", ")}</span>
    </span>
  );
}
