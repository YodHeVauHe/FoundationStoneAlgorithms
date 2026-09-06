import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';

const MonolithCanvas = lazy(() => import('./MonolithCanvas'));

/** Accent hex ≈ --primary (197 82% 63%); kept literal so the lazy chunk needs no CSS parsing. */
const ACCENT_HEX = '#38bdf8';

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** CSS stand-in shown while the chunk loads, and permanently without WebGL. */
function Silhouette() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div className="h-[68%] w-[58%] bg-gradient-to-br from-neutral-700 via-neutral-900 to-black [clip-path:polygon(50%_0,100%_100%,0_100%)] drop-shadow-[0_0_60px_hsl(197_82%_63%/0.18)]" />
    </div>
  );
}

export default function Monolith({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion() ?? false;
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '120px',
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`} aria-hidden="true">
      {failed ? (
        <Silhouette />
      ) : (
        <SceneBoundary fallback={<Silhouette />}>
          <Suspense fallback={<Silhouette />}>
            <MonolithCanvas
              accentHex={ACCENT_HEX}
              reducedMotion={reduceMotion}
              visible={visible}
              onFailed={() => setFailed(true)}
            />
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}
