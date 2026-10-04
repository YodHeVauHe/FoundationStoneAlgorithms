import { useEffect, useRef } from 'react';
import { MonolithScene } from './monolith-scene';

interface MonolithCanvasProps {
  accentHex: string;
  iconUrl: string;
  reducedMotion: boolean;
  visible: boolean;
  still: boolean;
  onFailed: () => void;
}

export default function MonolithCanvas({ accentHex, iconUrl, reducedMotion, visible, still, onFailed }: MonolithCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<MonolithScene | null>(null);
  const onFailedRef = useRef(onFailed);
  onFailedRef.current = onFailed;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene: MonolithScene;
    try {
      scene = new MonolithScene(canvas, { accentHex, still });
    } catch {
      onFailedRef.current();
      return;
    }
    sceneRef.current = scene;
    void scene.mountIcon(iconUrl); // swap the prism for the brand icon when traced

    const onVisibility = () => scene.setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    const onPointer = (event: PointerEvent) => {
      scene.setPointer(
        (event.clientX / window.innerWidth) * 2 - 1,
        -((event.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener('pointermove', onPointer);

    const observer = new ResizeObserver(() => scene.resize());
    observer.observe(canvas);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      observer.disconnect();
      scene.dispose();
      sceneRef.current = null;
    };
    // The scene is created once; accentHex is a module constant forwarded by the parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => void sceneRef.current?.setReducedMotion(reducedMotion), [reducedMotion]);
  useEffect(() => void sceneRef.current?.setVisible(visible), [visible]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
