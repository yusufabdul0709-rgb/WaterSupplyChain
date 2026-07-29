/**
 * useFlowAnimation.js — Animation clock for the Digital Twin flow visualization.
 *
 * Runs a requestAnimationFrame loop to provide a smooth animation time counter.
 * Automatically pauses when the browser tab is hidden to conserve resources.
 *
 * The currentTime value drives deck.gl particle positions and dash offsets.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export default function useFlowAnimation() {
  const [currentTime, setCurrentTime] = useState(0);
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const pausedRef = useRef(false);

  const animate = useCallback((timestamp) => {
    if (pausedRef.current) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    if (lastTimestampRef.current === null) {
      lastTimestampRef.current = timestamp;
    }

    const delta = (timestamp - lastTimestampRef.current) / 1000; // seconds
    lastTimestampRef.current = timestamp;

    // Cap delta to avoid jumps after tab switch
    const clampedDelta = Math.min(delta, 0.1);

    setCurrentTime((prev) => prev + clampedDelta);

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);

    // Pause animation when tab is hidden
    const handleVisibility = () => {
      if (document.hidden) {
        pausedRef.current = true;
      } else {
        pausedRef.current = false;
        lastTimestampRef.current = null; // Reset to prevent time jump
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [animate]);

  return { currentTime };
}
