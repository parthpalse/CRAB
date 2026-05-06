/**
 * CRAB.AI Neural Hero — Three.js scene
 * Pure scene module: pass a canvas, get back a controller with start/stop/setHue/replay/resize.
 *
 * Usage from React:
 *   const ctrl = createScene(canvasEl, { hue: 'white', nodes: 380, particles: 400, ... });
 *   // later:
 *   ctrl.dispose();
 */

import * as THREE from "three";

export type Hue = "amber" | "cyan" | "white";

export interface SceneOptions {
  hue: Hue;
  nodes: number;
  particles: number;
  rotation: number;
  speed: number;
  hud: boolean;
}

export interface SceneController {
  setOption: <K extends keyof SceneOptions>(k: K, v: SceneOptions[K]) => void;
  rebuildNeurons: () => void;
  rebuildParticles: () => void;
  rebuildAll: () => void;
  replay: () => void;
  dispose: () => void;
  onScroll: (scrollY: number, scrollHeight: number) => void;
}

const HUES: Record<Hue, { core: number; edge: number; signal: number; glow: string }> = {
  amber: { core: 0xff9a3c, edge: 0xff7a1f, signal: 0xffe7c2, glow: "#ff9a3c" },
  cyan: { core: 0x4cd0ff, edge: 0x1f9aff, signal: 0xc8f0ff, glow: "#4cd0ff" },
  white: { core: 0xe6e6e6, edge: 0x8a8a8a, signal: 0xffffff, glow: "#bbbbbb" },
};

const SPHERE_R = 1.95;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface Neuron {
  scatter: THREE.Vector3;
  rest: THREE.Vector3;
  current: THREE.Vector3;
  seed: number;
}

interface Signal {
  edgeIdx: number;
  t: number;
  speed: number;
}

export function createScene(canvas: HTMLCanvasElement, opts: SceneOptions): SceneController {
  const STATE: SceneOptions = { ...opts };
  const phaseDurations = [1.0, 1.6, 1.2, 1.0];

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.04);

  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.18));
  const key = new THREE.DirectionalLight(HUES[STATE.hue].core, 1.2);
  key.position.set(3, 4, 5);
  scene.add(key);

  let neurons: Neuron[] = [];
  let signals: Signal[] = [];
  let signalsMesh: THREE.InstancedMesh | null = null;
  let coreShellWire: THREE.LineSegments | null = null;
  let coreShell: THREE.Mesh | null = null;
  let ringsGroup: THREE.Group | null = null;
  let particlesPoints: THREE.Points | null = null;
  let glowSprite: THREE.Sprite | null = null;
  let neuronsGroup: THREE.Group | null = null;
  let nodesPoints: THREE.Points | null = null;
  let edgeLines: THREE.LineSegments | null = null;
  let edgePairs: [number, number][] = [];
  let edgePosAttr: Float32Array | null = null;

  let introStart = performance.now();
  let scrollY = 0;
  let scrollProgress = 0;
  let sceneIdx = 0;
  let sceneLocal = 0;

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const dummy = new THREE.Object3D();
  const tmp = new THREE.Vector3();
  let raf = 0;

  function disposeGroup(g: THREE.Object3D | null) {
    if (!g) return;
    g.traverse((o: any) => {
      o.geometry?.dispose?.();
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach((m: any) => m.dispose());
        else o.material.dispose();
      }
    });
    scene.remove(g);
  }

  function buildNeurons() {
    if (neuronsGroup) disposeGroup(neuronsGroup);
    neurons = [];
    signals = [];
    edgePairs = [];

    neuronsGroup = new THREE.Group();
    scene.add(neuronsGroup);

    const N = STATE.nodes;
    const hue = HUES[STATE.hue];

    const restPositions: THREE.Vector3[] = [];
    const attractors: { dir: THREE.Vector3; strength: number; radius: number }[] = [];
    for (let k = 0; k < 5; k++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const th = Math.random() * Math.PI * 2;
      attractors.push({
        dir: new THREE.Vector3(
          Math.sin(phi) * Math.cos(th),
          Math.sin(phi) * Math.sin(th),
          Math.cos(phi)
        ),
        strength: 0.18 + Math.random() * 0.22,
        radius: 0.35 + Math.random() * 0.4,
      });
    }
    function noise3(x: number, y: number, z: number) {
      return (
        Math.sin(x * 1.7 + y * 2.3) * 0.4 +
        Math.sin(y * 2.1 + z * 1.6) * 0.35 +
        Math.sin(z * 2.4 + x * 1.9) * 0.3 +
        Math.sin(x * 4.3 + y * 3.7 + z * 4.1) * 0.18
      );
    }

    for (let i = 0; i < N; i++) {
      const onSurface = Math.random() < 0.78;
      const phi = Math.acos(1 - (2 * (i + 0.5 + Math.random() * 0.7)) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i + Math.random() * 0.6;
      let dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      );
      const pull = new THREE.Vector3();
      for (const a of attractors) {
        const d = dir.dot(a.dir);
        if (d > 1 - a.radius) {
          const w = (d - (1 - a.radius)) / a.radius;
          pull.addScaledVector(a.dir, w * a.strength);
        }
      }
      dir.add(pull).normalize();
      let r = SPHERE_R;
      const n = noise3(dir.x * 1.2, dir.y * 1.2, dir.z * 1.2);
      r *= 0.78 + n * 0.18;
      r *= 1 + (Math.random() - 0.5) * 0.06;
      if (!onSurface) r *= 0.25 + Math.random() * 0.55;
      if (Math.random() < 0.06) r *= 1.2 + Math.random() * 0.5;
      if (Math.random() < 0.05) r *= 0.45 + Math.random() * 0.25;
      const pos = dir.multiplyScalar(r);
      pos.x += (Math.random() - 0.5) * 0.08;
      pos.y += (Math.random() - 0.5) * 0.08;
      pos.z += (Math.random() - 0.5) * 0.08;
      restPositions.push(pos);
    }

    const posBuf = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const th = Math.random() * Math.PI * 2;
      const r = 6 + Math.random() * 6;
      const sx = r * Math.sin(phi) * Math.cos(th);
      const sy = r * Math.sin(phi) * Math.sin(th);
      const sz = r * Math.cos(phi) - 3;
      posBuf[i * 3] = sx;
      posBuf[i * 3 + 1] = sy;
      posBuf[i * 3 + 2] = sz;
      neurons.push({
        scatter: new THREE.Vector3(sx, sy, sz),
        rest: restPositions[i],
        current: new THREE.Vector3(sx, sy, sz),
        seed: Math.random() * Math.PI * 2,
      });
    }

    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute("position", new THREE.BufferAttribute(posBuf, 3));
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.4, "rgba(255,255,255,0.5)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);

    const nodesMat = new THREE.PointsMaterial({
      color: hue.core,
      size: 0.1,
      map: tex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.95,
    });
    nodesPoints = new THREE.Points(nodesGeo, nodesMat);
    neuronsGroup.add(nodesPoints);

    const maxConn = 4;
    const maxDist = SPHERE_R * 0.42;
    for (let i = 0; i < N; i++) {
      let conn = 0;
      for (let j = i + 1; j < N && conn < maxConn; j++) {
        if (restPositions[i].distanceTo(restPositions[j]) < maxDist) {
          edgePairs.push([i, j]);
          conn++;
        }
      }
    }

    const eCount = edgePairs.length;
    edgePosAttr = new Float32Array(eCount * 6);
    const eGeo = new THREE.BufferGeometry();
    eGeo.setAttribute("position", new THREE.BufferAttribute(edgePosAttr, 3));
    const eMat = new THREE.LineBasicMaterial({
      color: hue.edge,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    edgeLines = new THREE.LineSegments(eGeo, eMat);
    neuronsGroup.add(edgeLines);

    const signalCount = Math.min(60, Math.max(20, Math.floor(eCount * 0.06)));
    const sigGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const sigMat = new THREE.MeshBasicMaterial({
      color: hue.signal,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    signalsMesh = new THREE.InstancedMesh(sigGeo, sigMat, signalCount);
    signalsMesh.frustumCulled = false;
    for (let i = 0; i < signalCount; i++) {
      signals.push({
        edgeIdx: Math.floor(Math.random() * eCount),
        t: Math.random(),
        speed: 0.4 + Math.random() * 1.4,
      });
    }
    neuronsGroup.add(signalsMesh);
  }

  function buildShell() {
    if (coreShell) {
      scene.remove(coreShell);
      coreShell.geometry.dispose();
      (coreShell.material as THREE.Material).dispose();
    }
    if (coreShellWire) {
      scene.remove(coreShellWire);
      coreShellWire.geometry.dispose();
      (coreShellWire.material as THREE.Material).dispose();
    }
    const hue = HUES[STATE.hue];
    const wg = new THREE.SphereGeometry(SPHERE_R * 1.005, 24, 16);
    const wireGeo = new THREE.WireframeGeometry(wg);
    coreShellWire = new THREE.LineSegments(
      wireGeo,
      new THREE.LineBasicMaterial({
        color: hue.edge,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    scene.add(coreShellWire);
    const sm = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 });
    coreShell = new THREE.Mesh(new THREE.SphereGeometry(SPHERE_R * 0.7, 24, 16), sm);
    scene.add(coreShell);
  }

  function buildRings() {
    if (ringsGroup) disposeGroup(ringsGroup);
    ringsGroup = new THREE.Group();
    scene.add(ringsGroup);
    const hue = HUES[STATE.hue];
    const orients = [
      new THREE.Euler(0, 0, 0),
      new THREE.Euler(Math.PI / 2.6, 0.2, 0.3),
      new THREE.Euler(0.4, Math.PI / 3, -0.2),
      new THREE.Euler(-0.6, -Math.PI / 4, 0.1),
    ];
    const radii = [SPHERE_R * 1.25, SPHERE_R * 1.45, SPHERE_R * 1.7, SPHERE_R * 2.05];
    const segs = [48, 96, 60, 120];
    const arcs = [Math.PI * 0.4, Math.PI * 1.4, Math.PI * 0.8, Math.PI * 1.7];
    for (let i = 0; i < 4; i++) {
      const points: THREE.Vector3[] = [];
      const start = Math.random() * Math.PI * 2;
      const seg = segs[i];
      for (let s = 0; s <= seg; s++) {
        const t = s / seg;
        const a = start + t * arcs[i];
        points.push(new THREE.Vector3(Math.cos(a) * radii[i], Math.sin(a) * radii[i], 0));
      }
      const g = new THREE.BufferGeometry().setFromPoints(points);
      const m = new THREE.LineBasicMaterial({
        color: hue.edge,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(g, m) as any;
      line.rotation.copy(orients[i]);
      line.userData.spinAxis = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();
      line.userData.spinSpeed = 0.04 + Math.random() * 0.12;
      ringsGroup.add(line);
      for (let t = 0; t < 8; t++) {
        const a = start + (t / 8) * arcs[i];
        const inner = new THREE.Vector3(
          Math.cos(a) * radii[i] * 0.96,
          Math.sin(a) * radii[i] * 0.96,
          0
        );
        const outer = new THREE.Vector3(
          Math.cos(a) * radii[i] * 1.04,
          Math.sin(a) * radii[i] * 1.04,
          0
        );
        const tg = new THREE.BufferGeometry().setFromPoints([inner, outer]);
        const tm = new THREE.LineBasicMaterial({
          color: hue.core,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const tl = new THREE.Line(tg, tm);
        tl.rotation.copy(orients[i]);
        ringsGroup.add(tl);
      }
    }
  }

  function buildParticles() {
    if (particlesPoints) {
      scene.remove(particlesPoints);
      particlesPoints.geometry.dispose();
      (particlesPoints.material as THREE.Material).dispose();
    }
    const N = STATE.particles;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 6 + Math.random() * 30;
      const phi = Math.acos(2 * Math.random() - 1);
      const th = Math.random() * Math.PI * 2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const m = new THREE.PointsMaterial({
      color: HUES[STATE.hue].core,
      size: 0.018,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    particlesPoints = new THREE.Points(g, m);
    scene.add(particlesPoints);
  }

  function buildGlow() {
    if (glowSprite) {
      scene.remove(glowSprite);
      (glowSprite.material as any).map?.dispose();
      glowSprite.material.dispose();
    }
    const hex = HUES[STATE.hue].glow;
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, hex);
    grd.addColorStop(0.3, hex + "88");
    grd.addColorStop(1, hex + "00");
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0,
    });
    glowSprite = new THREE.Sprite(mat);
    glowSprite.scale.set(7, 7, 1);
    scene.add(glowSprite);
  }

  buildNeurons();
  buildShell();
  buildRings();
  buildParticles();
  buildGlow();

  function onMouseMove(e: MouseEvent) {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("resize", onResize);

  function animate() {
    raf = requestAnimationFrame(animate);
    const now = performance.now();
    const elapsed = ((now - introStart) / 1000) * STATE.speed;

    let acc = 0,
      p = 0,
      local = 0;
    for (let i = 0; i < phaseDurations.length; i++) {
      if (elapsed < acc + phaseDurations[i]) {
        p = i;
        local = (elapsed - acc) / phaseDurations[i];
        break;
      }
      acc += phaseDurations[i];
      p = i + 1;
    }
    if (p >= phaseDurations.length) {
      p = 4;
      local = 1;
    }

    const np = nodesPoints!;
    const npAttr = np.geometry.getAttribute("position") as THREE.BufferAttribute;
    const scrollK = Math.min(1, scrollY / window.innerHeight);

    for (let i = 0; i < neurons.length; i++) {
      const n = neurons[i];
      let target: THREE.Vector3;
      if (scrollK < 0.05 && p < 4) {
        if (p === 0) {
          target = n.scatter.clone();
          target.x += Math.sin(elapsed * 0.6 + n.seed) * 0.18;
          target.y += Math.cos(elapsed * 0.5 + n.seed * 1.3) * 0.18;
        } else if (p === 1) {
          const t = easeInOut(local);
          target = new THREE.Vector3().lerpVectors(n.scatter, n.rest, t);
          const swirl = (1 - t) * 1.4;
          target.x += Math.sin(elapsed * 2 + n.seed) * swirl * 0.45;
          target.y += Math.cos(elapsed * 1.6 + n.seed * 1.4) * swirl * 0.45;
        } else if (p === 2) {
          target = n.rest.clone();
          target.multiplyScalar(1 + Math.sin(local * Math.PI) * 0.03);
        } else {
          target = n.rest.clone();
          target.multiplyScalar(
            1 + Math.sin(elapsed * 2 + n.seed) * 0.012 + Math.sin(local * Math.PI) * 0.04
          );
        }
      } else {
        target = n.rest.clone();
        const lag = (Math.sin(n.seed * 3.7) + 1) * 0.5;
        const speedMul = 0.6 + (Math.sin(n.seed * 1.3) + 1) * 0.7;
        if (sceneIdx === 1) {
          const ripple =
            Math.sin(sceneLocal * Math.PI * 2 - n.rest.length() * 1.4) * (1 - sceneLocal) * 0.18;
          target.multiplyScalar(1 + ripple);
        }
        if (sceneIdx === 3) {
          const cluster = Math.floor(((n.seed + Math.PI) / (Math.PI * 2)) * 3) % 3;
          const stepT = sceneLocal * 3 - cluster;
          if (stepT > 0 && stepT < 1) {
            target.multiplyScalar(1 + Math.sin(stepT * Math.PI) * 0.15);
          }
        }
        if (sceneIdx === 4) {
          const expand = sceneLocal * (0.25 + Math.sin(n.seed * 2.1) * 0.18);
          target.multiplyScalar(1 + expand);
          target.x += Math.sin(elapsed * 0.6 * speedMul + n.seed) * 0.06;
          target.y += Math.cos(elapsed * 0.5 * speedMul + n.seed * 1.4) * 0.06;
        }
        if (sceneIdx === 5) {
          target.multiplyScalar(1 - sceneLocal * 0.06 + Math.sin(elapsed * 2 + n.seed) * 0.012);
        }
        const breathe = 1 + Math.sin(elapsed * 0.5 * speedMul + n.seed) * 0.014;
        const jitter = Math.sin(elapsed * 1.2 + n.seed * 2.1) * 0.008 * lag;
        target.multiplyScalar(breathe + jitter);
      }
      const rate = 0.1 + ((Math.sin(n.seed * 5.1) + 1) * 0.5) * 0.16;
      n.current.lerp(target, rate);
      npAttr.array[i * 3] = n.current.x;
      npAttr.array[i * 3 + 1] = n.current.y;
      npAttr.array[i * 3 + 2] = n.current.z;
    }
    npAttr.needsUpdate = true;

    (np.material as THREE.PointsMaterial).size =
      0.085 + (p >= 2 ? 0.04 : 0) * (1 + Math.sin(elapsed * 2) * 0.15);
    (np.material as THREE.PointsMaterial).opacity = p === 0 ? 0.6 + local * 0.3 : 0.95;

    let edgeOp = 0;
    if (p === 0) edgeOp = 0;
    else if (p === 1) edgeOp = local * 0.15;
    else if (p === 2) edgeOp = 0.15 + easeOut(local) * 0.45;
    else if (p === 3) edgeOp = 0.6 - local * 0.15;
    else edgeOp = 0.45 + Math.sin(elapsed * 0.8) * 0.05;
    (edgeLines!.material as THREE.LineBasicMaterial).opacity = edgeOp;

    if (edgeOp > 0.05 && edgePosAttr) {
      for (let i = 0; i < edgePairs.length; i++) {
        const [a, b] = edgePairs[i];
        const na = neurons[a].current,
          nb = neurons[b].current;
        edgePosAttr[i * 6] = na.x;
        edgePosAttr[i * 6 + 1] = na.y;
        edgePosAttr[i * 6 + 2] = na.z;
        edgePosAttr[i * 6 + 3] = nb.x;
        edgePosAttr[i * 6 + 4] = nb.y;
        edgePosAttr[i * 6 + 5] = nb.z;
      }
      (edgeLines!.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }

    let sigOp = 0;
    if (p === 2) sigOp = local * 0.7;
    else if (p === 3) sigOp = 0.7 + Math.sin(elapsed * 4) * 0.2;
    else if (p >= 4) sigOp = 0.85;
    (signalsMesh!.material as THREE.MeshBasicMaterial).opacity = sigOp;

    if (sigOp > 0.05) {
      for (let i = 0; i < signals.length; i++) {
        const s = signals[i];
        s.t += s.speed * 0.012 * STATE.speed;
        if (s.t >= 1) {
          s.t = 0;
          s.edgeIdx = Math.floor(Math.random() * edgePairs.length);
        }
        const [a, b] = edgePairs[s.edgeIdx];
        const na = neurons[a].current,
          nb = neurons[b].current;
        tmp.lerpVectors(na, nb, s.t);
        dummy.position.copy(tmp);
        const scale = 0.7 + Math.sin(s.t * Math.PI) * 0.6;
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        signalsMesh!.setMatrixAt(i, dummy.matrix);
      }
      signalsMesh!.instanceMatrix.needsUpdate = true;
    }

    let shellOp = 0;
    if (p === 2) shellOp = local * 0.18;
    else if (p === 3) shellOp = 0.18 + Math.sin(local * Math.PI) * 0.15;
    else if (p >= 4) shellOp = 0.12;
    (coreShellWire!.material as THREE.LineBasicMaterial).opacity = shellOp;
    const coreRot = elapsed * 0.18 * STATE.rotation;
    coreShellWire!.rotation.set(coreRot * 0.5, coreRot, coreRot * 0.3);
    neuronsGroup!.rotation.y = coreRot * 0.6;
    neuronsGroup!.rotation.x = Math.sin(elapsed * 0.2) * 0.08;

    let glowOp = 0;
    if (p === 0) glowOp = 0.05 + local * 0.05;
    else if (p === 1) glowOp = 0.1 + local * 0.2;
    else if (p === 2) glowOp = 0.3 + local * 0.3;
    else if (p === 3) glowOp = 0.6 - local * 0.2;
    else glowOp = 0.4 + Math.sin(elapsed * 0.8) * 0.05;
    (glowSprite!.material as THREE.SpriteMaterial).opacity = glowOp;

    ringsGroup!.children.forEach((r: any, i) => {
      let op = 0;
      if (p === 3) op = Math.sin(local * Math.PI) * 0.7;
      else if (p >= 4) op = 0.35 + Math.sin(elapsed * 0.6 + i) * 0.06;
      r.material.opacity = op;
      if (r.userData.spinAxis) {
        r.rotateOnAxis(r.userData.spinAxis, 0.003);
      }
    });

    if (particlesPoints) {
      particlesPoints.rotation.y = elapsed * 0.018;
      particlesPoints.rotation.x = Math.sin(elapsed * 0.1) * 0.12;
      (particlesPoints.material as THREE.PointsMaterial).opacity =
        p === 0 ? 0.3 + local * 0.3 : 0.55 - Math.max(0, p - 3) * 0.1;
    }

    let camTargetZ = 9;
    if (p === 0) camTargetZ = 9;
    else if (p === 1) camTargetZ = 9 - local * 1.4;
    else if (p === 2) camTargetZ = 7.6 - local * 0.6;
    else if (p === 3) camTargetZ = 7.0 + local * 0.4;
    else camTargetZ = 7.4;

    if (scrollK >= 0.05) {
      if (sceneIdx === 1) camTargetZ = 7.0 - sceneLocal * 0.4;
      else if (sceneIdx === 2) camTargetZ = 6.6;
      else if (sceneIdx === 3) camTargetZ = 6.4 - sceneLocal * 0.2;
      else if (sceneIdx === 4) camTargetZ = 6.4 + sceneLocal * 1.2;
      else if (sceneIdx === 5) camTargetZ = 7.6 - sceneLocal * 0.4;
    }

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    const sideShift =
      (sceneIdx === 2 ? 1.2 : sceneIdx === 3 ? -1.0 : sceneIdx === 4 ? 1.0 : 0) * 0.5;
    camera.position.x += (mouse.x * 0.4 + sideShift - camera.position.x) * 0.04;
    camera.position.y += (-mouse.y * 0.3 - camera.position.y) * 0.05;
    camera.position.z += (camTargetZ - camera.position.z) * 0.06;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  return {
    setOption(k, v) {
      (STATE as any)[k] = v;
    },
    rebuildNeurons() {
      buildNeurons();
    },
    rebuildParticles() {
      buildParticles();
    },
    rebuildAll() {
      buildNeurons();
      buildShell();
      buildRings();
      buildParticles();
      buildGlow();
    },
    replay() {
      introStart = performance.now();
    },
    onScroll(y, height) {
      scrollY = y;
      const total = Math.max(1, height - window.innerHeight);
      scrollProgress = Math.min(1, y / total);
      const vh = window.innerHeight;
      const raw = y / vh;
      sceneIdx = Math.min(5, Math.floor(raw));
      sceneLocal = Math.min(1, Math.max(0, raw - sceneIdx));
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      disposeGroup(neuronsGroup);
      disposeGroup(ringsGroup);
      if (coreShellWire) {
        scene.remove(coreShellWire);
        coreShellWire.geometry.dispose();
        (coreShellWire.material as THREE.Material).dispose();
      }
      if (coreShell) {
        scene.remove(coreShell);
        coreShell.geometry.dispose();
        (coreShell.material as THREE.Material).dispose();
      }
      if (particlesPoints) {
        scene.remove(particlesPoints);
        particlesPoints.geometry.dispose();
        (particlesPoints.material as THREE.Material).dispose();
      }
      if (glowSprite) {
        scene.remove(glowSprite);
        (glowSprite.material as any).map?.dispose();
        glowSprite.material.dispose();
      }
      renderer.dispose();
    },
  };
}
