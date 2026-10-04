import {
  AmbientLight,
  Clock,
  DirectionalLight,
  EdgesGeometry,
  ExtrudeGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  Shape,
  WebGLRenderer,
} from 'three';
import { buildIconLayers } from './icon-shapes';

export interface MonolithSceneOptions {
  /** Accent hex for rim light + fallback edges (≈ --primary). */
  accentHex: string;
  /** Hold a fixed angle. No spin, bob, or pointer tilt. */
  still?: boolean;
}

/**
 * Vanilla Three.js render of the brand icon: the traced owl sigil (white
 * braces layer + blue goggles layer) floats, yaws, and tilts toward the
 * pointer. The loop pauses when the page is hidden or the hero is offscreen;
 * reduced motion renders exactly one static frame. A triangular prism stands
 * in if the icon trace ever fails.
 */
export class MonolithScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private content: Object3D | null = null;
  private clock = new Clock();
  private rafId = 0;
  private disposed = false;
  private hidden = false;
  private visible = false;
  private reducedMotion = false;
  private pointerTarget = { x: 0, y: 0 };
  private pointer = { x: 0, y: 0 };
  private still: boolean;

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
    this.camera.position.set(0, 0.2, 6.2);
    this.camera.lookAt(0, 0, 0);

    this.scene.add(new AmbientLight(0xffffff, 0.3));

    const key = new DirectionalLight(0xffffff, 1.6);
    key.position.set(2.4, 3.2, 2.8);
    this.scene.add(key);

    const rim = new DirectionalLight(options.accentHex, 2.2);
    rim.position.set(-2.6, 1.4, -2.4);
    this.scene.add(rim);

    const fill = new DirectionalLight(0xffffff, 0.45);
    fill.position.set(-1.8, -0.8, 3);
    this.scene.add(fill);

    this.still = options.still ?? false;
    this.setContent(this.buildPrism(options.accentHex)); // instant first paint
    this.resize();
    if (!this.still) this.rafId = requestAnimationFrame(this.tick);
  }

  /** Swaps the fallback prism for the traced brand-icon layers. */
  async mountIcon(iconUrl: string): Promise<void> {
    try {
      const layers = await buildIconLayers(iconUrl);
      if (this.disposed) return;
      if (!layers.white.length && !layers.blue.length) return;

      const group = new Group();
      if (layers.white.length) {
        group.add(
          new Mesh(
            new ExtrudeGeometry(layers.white, {
              depth: 0.42,
              bevelEnabled: true,
              bevelThickness: 0.05,
              bevelSize: 0.04,
              bevelSegments: 1,
              curveSegments: 1,
            }),
            new MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.38, metalness: 0.1 })
          )
        );
      }
      if (layers.blue.length) {
        const goggles = new Mesh(
          new ExtrudeGeometry(layers.blue, {
            depth: 0.42,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.04,
            bevelSegments: 1,
            curveSegments: 1,
          }),
          new MeshStandardMaterial({ color: 0x0d4cb4, roughness: 0.3, metalness: 0.35 })
        );
        goggles.position.z = 0.34; // goggles sit proud, like a visor
        group.add(goggles);
      }
      this.setContent(group);
    } catch {
      // tracing failed — the prism fallback stays up
    }
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
    if (this.content) this.disposeObject(this.content);
    this.renderer.dispose();
  }

  private buildPrism(accentHex: string): Object3D {
    const group = new Group();
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

    const prism = new Mesh(
      geometry,
      new MeshStandardMaterial({
        color: 0x0d0d0d,
        roughness: 0.35,
        metalness: 0.55,
        flatShading: true,
      })
    );
    prism.rotation.x = 0.1;
    group.add(prism);

    prism.add(
      new LineSegments(
        new EdgesGeometry(geometry, 12),
        new LineBasicMaterial({ color: accentHex, transparent: true, opacity: 0.35 })
      )
    );
    return group;
  }

  private setContent(next: Object3D) {
    if (this.content) {
      this.scene.remove(this.content);
      this.disposeObject(this.content);
    }
    this.content = next;
    this.scene.add(next);
    this.pose();
    this.renderer.render(this.scene, this.camera);
  }

  private pose() {
    if (!this.content || !this.still) return;
    this.content.rotation.set(0.22, 0.62, 0);
    this.content.position.y = 0;
  }

  private disposeObject(root: Object3D) {
    root.traverse((object) => {
      if (object instanceof Mesh || object instanceof LineSegments) {
        object.geometry.dispose();
        const material = object.material;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material.dispose();
      }
    });
  }

  private tick = () => {
    if (this.disposed || !this.content) return;
    this.rafId = requestAnimationFrame(this.tick);
    if (this.hidden || !this.visible) {
      this.clock.getDelta(); // drain so the first resumed frame has a sane delta
      return;
    }

    if (this.still) {
      this.pose();
      this.renderer.render(this.scene, this.camera);
      return;
    }

    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.pointer.x = MathUtils.lerp(this.pointer.x, this.pointerTarget.x, 0.05);
    this.pointer.y = MathUtils.lerp(this.pointer.y, this.pointerTarget.y, 0.05);

    this.content.rotation.y += 0.22 * dt;
    this.content.position.y = Math.sin(this.clock.elapsedTime * 0.9) * 0.06;
    this.content.rotation.x = 0.08 + this.pointer.y * 0.16;
    this.content.rotation.z = this.pointer.x * 0.08;

    this.renderer.render(this.scene, this.camera);
  };
}
