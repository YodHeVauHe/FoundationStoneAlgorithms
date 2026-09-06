import {
  AmbientLight,
  Clock,
  DirectionalLight,
  EdgesGeometry,
  ExtrudeGeometry,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Shape,
  WebGLRenderer,
} from 'three';

export interface MonolithSceneOptions {
  /** Accent hex for rim light + edges (≈ --primary). */
  accentHex: string;
}

/**
 * Vanilla Three.js render of the Foundation Stone monolith: a beveled
 * triangular prism with cyan rim light and hairline edges. The RAF loop
 * pauses whenever the page is hidden or the hero is offscreen; reduced
 * motion renders exactly one static frame.
 */
export class MonolithScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private monolith: Mesh;
  private clock = new Clock();
  private rafId = 0;
  private disposed = false;
  private hidden = false;
  private visible = false;
  private reducedMotion = false;
  private pointerTarget = { x: 0, y: 0 };
  private pointer = { x: 0, y: 0 };

  constructor(
    private canvas: HTMLCanvasElement,
    options: MonolithSceneOptions
  ) {
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    this.camera = new PerspectiveCamera(38, 1, 0.1, 40);
    this.camera.position.set(0, 0.35, 6.4);
    this.camera.lookAt(0, 0, 0);

    const shape = new Shape();
    const r = 1.5;
    shape.moveTo(0, r);
    shape.lineTo(r * 0.87, -r * 0.5);
    shape.lineTo(-r * 0.87, -r * 0.5);
    shape.closePath();

    const geometry = new ExtrudeGeometry(shape, {
      depth: 0.6,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.06,
      bevelSegments: 1,
      curveSegments: 1,
    });
    geometry.center();

    this.monolith = new Mesh(
      geometry,
      new MeshStandardMaterial({
        color: 0x0d0d0d,
        roughness: 0.35,
        metalness: 0.55,
        flatShading: true,
      })
    );
    this.monolith.rotation.x = 0.1;
    this.scene.add(this.monolith);

    this.monolith.add(
      new LineSegments(
        new EdgesGeometry(geometry, 12),
        new LineBasicMaterial({ color: options.accentHex, transparent: true, opacity: 0.35 })
      )
    );

    this.scene.add(new AmbientLight(0xffffff, 0.3));

    const key = new DirectionalLight(0xffffff, 1.6);
    key.position.set(2.4, 3.2, 2.8);
    this.scene.add(key);

    const rim = new DirectionalLight(options.accentHex, 2.2);
    rim.position.set(-2.6, 1.4, -2.4);
    this.scene.add(rim);

    this.resize();
    this.renderer.render(this.scene, this.camera); // first paint before the loop starts
    this.rafId = requestAnimationFrame(this.tick);
  }

  setVisible(visible: boolean) {
    this.visible = visible;
  }

  setHidden(hidden: boolean) {
    this.hidden = hidden;
  }

  setReducedMotion(reducedMotion: boolean) {
    const was = this.reducedMotion;
    this.reducedMotion = reducedMotion;
    if (reducedMotion && !was) {
      cancelAnimationFrame(this.rafId);
      this.renderer.render(this.scene, this.camera); // exactly one static frame
    }
  }

  setPointer(x: number, y: number) {
    this.pointerTarget.x = x;
    this.pointerTarget.y = y;
  }

  resize() {
    const width = this.canvas.clientWidth || 1;
    const height = this.canvas.clientHeight || 1;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    this.scene.traverse((object) => {
      if (object instanceof Mesh || object instanceof LineSegments) {
        object.geometry.dispose();
        const material = object.material;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material.dispose();
      }
    });
    this.renderer.dispose();
  }

  private tick = () => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.tick);
    if (this.hidden || !this.visible) {
      this.clock.getDelta(); // drain so the first resumed frame has a sane delta
      return;
    }

    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.pointer.x = MathUtils.lerp(this.pointer.x, this.pointerTarget.x, 0.05);
    this.pointer.y = MathUtils.lerp(this.pointer.y, this.pointerTarget.y, 0.05);

    this.monolith.rotation.y += 0.25 * dt;
    this.monolith.position.y = Math.sin(this.clock.elapsedTime * 0.9) * 0.06;
    this.monolith.rotation.x = 0.1 + this.pointer.y * 0.16;
    this.monolith.rotation.z = this.pointer.x * 0.08;

    this.renderer.render(this.scene, this.camera);
  };
}
