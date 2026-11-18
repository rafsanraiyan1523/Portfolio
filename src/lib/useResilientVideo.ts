"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

const GESTURES = ["pointerdown", "keydown", "touchstart", "wheel"] as const;

/**
 * Keeps a muted, looping background video actually playing.
 *
 * Browsers stop background video for many reasons and rarely restart it on
 * their own: autoplay policies (Safari Low Power Mode, data saver, strict
 * settings), a hidden tab, a page restored from the back/forward cache, a
 * network stall on a large remote file. This hook:
 *
 * - forces `muted` from script before every play(). React does not always
 *   write the `muted` attribute, and an unmuted video is never allowed to
 *   autoplay, which is the classic "works in one browser, not another" bug;
 * - retries on canplay, on the tab becoming visible, on pageshow (bfcache),
 *   and whenever the video scrolls back into view (and pauses it off-screen);
 * - if autoplay is refused outright, waits for the visitor's first gesture;
 * - runs a watchdog that restarts a paused video and reloads a frozen one;
 * - retries a failed load twice, then reports `failed` so the caller can rest
 *   on its poster instead of a black box.
 *
 * Reduced motion holds the video still; the visitor can still press play.
 */
export function useResilientVideo(ref: RefObject<HTMLVideoElement | null>, reduced: boolean) {
  // Starts true: the element carries autoplay, so the control should offer
  // "pause" from the first paint. Events correct it straight away if not.
  const [playing, setPlaying] = useState(true);
  const [failed, setFailed] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    let visible = true;
    let armed = false;
    let lastTime = -1;
    let frozenTicks = 0;
    let retries = 0;
    let retryTimer = 0;

    const shouldPlay = () => !reduced && !userPaused.current && visible && !document.hidden;

    const forceMuted = () => {
      v.muted = true;
      v.defaultMuted = true;
      v.setAttribute("muted", "");
    };

    const disarm = () => {
      if (!armed) return;
      armed = false;
      GESTURES.forEach((g) => window.removeEventListener(g, onGesture));
    };
    const arm = () => {
      if (armed) return;
      armed = true;
      GESTURES.forEach((g) => window.addEventListener(g, onGesture, { passive: true }));
    };
    function onGesture() {
      disarm();
      tryPlay();
    }

    function tryPlay() {
      if (!shouldPlay()) return;
      forceMuted();
      const attempt = v!.play();
      if (attempt) {
        attempt.then(disarm).catch((err: unknown) => {
          // Autoplay refused: the first tap, click, key or scroll starts it.
          setPlaying(false);
          if ((err as { name?: string })?.name === "NotAllowedError") arm();
        });
      }
    }

    const onPlaying = () => {
      setPlaying(true);
      setFailed(false);
      retries = 0;
    };
    const onPause = () => setPlaying(false);
    // Native autoplay can start before hydration, so the one-off "playing"
    // event is often already gone. Progress events keep arriving: use those.
    const onProgress = () => {
      if (!v.paused && v.readyState >= 2) onPlaying();
    };
    const onVisibility = () => {
      if (!document.hidden) tryPlay();
    };
    const onError = () => {
      if (retries < 2) {
        retries += 1;
        window.clearTimeout(retryTimer);
        retryTimer = window.setTimeout(() => {
          v.load();
          tryPlay();
        }, 3000 * retries);
      } else {
        setFailed(true);
        setPlaying(false);
      }
    };

    v.addEventListener("playing", onPlaying);
    v.addEventListener("timeupdate", onProgress);
    v.addEventListener("pause", onPause);
    v.addEventListener("canplay", tryPlay);
    v.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", tryPlay);
    window.addEventListener("focus", tryPlay);

    // Off-screen it pauses (no point decoding video nobody sees); back in view, it resumes.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) tryPlay();
      else if (!v.paused) v.pause();
    });
    io.observe(v);

    // Watchdog: restart a video that should be playing but isn't, and reload
    // one whose clock has stopped (a stalled stream that never recovers).
    const watchdog = window.setInterval(() => {
      if (!shouldPlay()) return;
      if (v.paused || v.ended) {
        tryPlay();
        return;
      }
      if (v.readyState >= 2) {
        if (v.currentTime === lastTime) {
          frozenTicks += 1;
          if (frozenTicks >= 2) {
            frozenTicks = 0;
            v.load();
            tryPlay();
          }
        } else {
          frozenTicks = 0;
        }
        lastTime = v.currentTime;
      }
    }, 3000);

    forceMuted();
    // A load that already failed before hydration fired its error unheard.
    if (v.error) onError();
    if (reduced) v.pause();
    else tryPlay();

    return () => {
      disarm();
      io.disconnect();
      window.clearInterval(watchdog);
      window.clearTimeout(retryTimer);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("timeupdate", onProgress);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("canplay", tryPlay);
      v.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", tryPlay);
      window.removeEventListener("focus", tryPlay);
    };
  }, [ref, reduced]);

  /** The visible pause/play control. */
  const toggle = useCallback(() => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.muted = true;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  }, [ref]);

  return { playing, failed, toggle };
}
