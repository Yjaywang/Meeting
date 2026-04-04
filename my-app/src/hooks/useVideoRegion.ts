import { useState, useEffect, RefObject } from "react";

interface VideoRegionSize {
  width: number;
  height: number;
}

export function useVideoRegion(ref: RefObject<HTMLDivElement | null>): VideoRegionSize {
  const [size, setSize] = useState<VideoRegionSize>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [ref]);

  return size;
}
