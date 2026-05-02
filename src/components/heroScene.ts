import * as THREE from 'three';

const SPHERE_R = 1.95;
const phaseDurations = [1.0, 1.6, 1.2, 1.0];
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const STATE = { speed: 0.6, nodes: 360, particles: 800, rotation: 0.25 };

function noise3(x: number, y: number, z: number) {
  return (
    Math.sin(x * 1.7 + y * 2.3) * 0.4 +
    Math.sin(y * 2.1 + z * 1.6) * 0.35 +
    Math.sin(z * 2.4 + x * 1.9) * 0.3 +
    Math.sin(x * 4.3 + y * 3.7 + z * 4.1) * 0.18
  );
}

export function initHeroScene(canvas: HTMLCanvasElement, onReveal: () => void) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.04);

  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.18));
  const key = new THREE.DirectionalLight(0xe6e6e6, 1.2);
  key.position.set(3, 4, 5);
  scene.add(key);

  // — Neurons —
  const N = STATE.nodes;
  const restPositions: THREE.Vector3[] = [];
  const neurons: { scatter: THREE.Vector3; rest: THREE.Vector3; current: THREE.Vector3; seed: number }[] = [];

  const attractors: { dir: THREE.Vector3; strength: number; radius: number }[] = [];
  for (let k = 0; k < 5; k++) {
    const phi = Math.acos(2 * Math.random() - 1), th = Math.random() * Math.PI * 2;
    attractors.push({
      dir: new THREE.Vector3(Math.sin(phi) * Math.cos(th), Math.sin(phi) * Math.sin(th), Math.cos(phi)),
      strength: 0.18 + Math.random() * 0.22,
      radius: 0.35 + Math.random() * 0.4,
    });
  }

  for (let i = 0; i < N; i++) {
    const onSurface = Math.random() < 0.78;
    const phi = Math.acos(1 - 2 * (i + 0.5 + Math.random() * 0.7) / N);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i + Math.random() * 0.6;
    let dir = new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi));
    const pull = new THREE.Vector3();
    for (const a of attractors) {
      const d = dir.dot(a.dir);
      if (d > 1 - a.radius) pull.addScaledVector(a.dir, ((d - (1 - a.radius)) / a.radius) * a.strength);
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
    const phi = Math.acos(2 * Math.random() - 1), th = Math.random() * Math.PI * 2, r = 6 + Math.random() * 6;
    const sx = r * Math.sin(phi) * Math.cos(th), sy = r * Math.sin(phi) * Math.sin(th), sz = r * Math.cos(phi) - 3;
    posBuf[i * 3] = sx; posBuf[i * 3 + 1] = sy; posBuf[i * 3 + 2] = sz;
    neurons.push({ scatter: new THREE.Vector3(sx, sy, sz), rest: restPositions[i], current: new THREE.Vector3(sx, sy, sz), seed: Math.random() * Math.PI * 2 });
  }

  // glow texture (blue)
  const gc = document.createElement('canvas'); gc.width = gc.height = 64;
  const gctx = gc.getContext('2d')!;
  const grd = gctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(0,204,255,1)'); grd.addColorStop(0.35, 'rgba(0,204,255,0.7)'); grd.addColorStop(1, 'rgba(0,204,255,0)');
  gctx.fillStyle = grd; gctx.fillRect(0, 0, 64, 64);
  const nodeTex = new THREE.CanvasTexture(gc);

  const neuronsGroup = new THREE.Group();
  scene.add(neuronsGroup);

  const nodesGeo = new THREE.BufferGeometry();
  nodesGeo.setAttribute('position', new THREE.BufferAttribute(posBuf, 3));
  const nodesMat = new THREE.PointsMaterial({ color: 0x00ccff, size: 0.10, map: nodeTex, transparent: true, depthWrite: false, blending: THREE.NormalBlending, opacity: 0.95 });
  const nodesPoints = new THREE.Points(nodesGeo, nodesMat);
  neuronsGroup.add(nodesPoints);

  // edges
  const edgePairs: [number, number][] = [];
  const maxDist = SPHERE_R * 0.42;
  for (let i = 0; i < N; i++) {
    let conn = 0;
    for (let j = i + 1; j < N && conn < 4; j++) {
      if (restPositions[i].distanceTo(restPositions[j]) < maxDist) { edgePairs.push([i, j]); conn++; }
    }
  }
  // Split edges: mostly blue (85%) and some gold (15%)
  const blueEdges = edgePairs.filter((_, i) => i % 7 !== 0);
  const goldEdges = edgePairs.filter((_, i) => i % 7 === 0);

  const ePosBlue = new Float32Array(blueEdges.length * 6);
  const eGeoBlue = new THREE.BufferGeometry();
  eGeoBlue.setAttribute('position', new THREE.BufferAttribute(ePosBlue, 3));
  const eMatBlue = new THREE.LineBasicMaterial({ color: 0x00ccff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.NormalBlending });
  const edgeLinesBlue = new THREE.LineSegments(eGeoBlue, eMatBlue);
  neuronsGroup.add(edgeLinesBlue);

  const ePosGold = new Float32Array(goldEdges.length * 6);
  const eGeoGold = new THREE.BufferGeometry();
  eGeoGold.setAttribute('position', new THREE.BufferAttribute(ePosGold, 3));
  const eMatGold = new THREE.LineBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0, depthWrite: false, blending: THREE.NormalBlending });
  const edgeLinesGold = new THREE.LineSegments(eGeoGold, eMatGold);
  neuronsGroup.add(edgeLinesGold);

  // signals
  const signalCount = Math.min(60, Math.max(20, Math.floor(edgePairs.length * 0.06)));
  const sigGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const sigMat = new THREE.MeshBasicMaterial({ color: 0x00ccff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const signalsMesh = new THREE.InstancedMesh(sigGeo, sigMat, signalCount);
  signalsMesh.frustumCulled = false;
  neuronsGroup.add(signalsMesh);
  const signals: { edgeIdx: number; t: number; speed: number }[] = [];
  for (let i = 0; i < signalCount; i++) signals.push({ edgeIdx: Math.floor(Math.random() * edgePairs.length), t: Math.random(), speed: 0.4 + Math.random() * 1.4 });

  // shell wireframe
  const wg = new THREE.SphereGeometry(SPHERE_R * 1.005, 24, 16);
  const coreShellWire = new THREE.LineSegments(new THREE.WireframeGeometry(wg), new THREE.LineBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(coreShellWire);

  // rings
  const ringsGroup = new THREE.Group();
  scene.add(ringsGroup);
  const orients = [new THREE.Euler(0, 0, 0), new THREE.Euler(Math.PI / 2.6, 0.2, 0.3), new THREE.Euler(0.4, Math.PI / 3, -0.2), new THREE.Euler(-0.6, -Math.PI / 4, 0.1)];
  const radii = [SPHERE_R * 1.25, SPHERE_R * 1.45, SPHERE_R * 1.7, SPHERE_R * 2.05];
  const arcs = [Math.PI * 0.4, Math.PI * 1.4, Math.PI * 0.8, Math.PI * 1.7];
  const segs = [48, 96, 60, 120];
  for (let i = 0; i < 4; i++) {
    const pts: THREE.Vector3[] = [], start = Math.random() * Math.PI * 2;
    for (let s = 0; s <= segs[i]; s++) { const a = start + (s / segs[i]) * arcs[i]; pts.push(new THREE.Vector3(Math.cos(a) * radii[i], Math.sin(a) * radii[i], 0)); }
    const rg = new THREE.BufferGeometry().setFromPoints(pts);
    const ringColor = i === 1 ? 0x00ccff : 0xffaa00;
    const rm = new THREE.LineBasicMaterial({ color: ringColor, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const rl = new THREE.Line(rg, rm);
    rl.rotation.copy(orients[i]);
    (rl as any).spinAxis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    (rl as any).spinSpeed = 0.04 + Math.random() * 0.12;
    ringsGroup.add(rl);
  }

  // particles
  const pN = STATE.particles, pPos = new Float32Array(pN * 3);
  for (let i = 0; i < pN; i++) {
    const r = 6 + Math.random() * 30, phi = Math.acos(2 * Math.random() - 1), th = Math.random() * Math.PI * 2;
    pPos[i * 3] = r * Math.sin(phi) * Math.cos(th); pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(th); pPos[i * 3 + 2] = r * Math.cos(phi);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particlesPoints = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x00ccff, size: 0.018, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(particlesPoints);

  // glow sprite (blue)
  const sc = document.createElement('canvas'); sc.width = sc.height = 256;
  const sctx = sc.getContext('2d')!;
  const sgrd = sctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  sgrd.addColorStop(0, 'rgba(0,204,255,1)'); sgrd.addColorStop(0.25, 'rgba(0,204,255,0.6)'); sgrd.addColorStop(0.6, 'rgba(0,204,255,0.2)'); sgrd.addColorStop(1, 'rgba(0,204,255,0)');
  sctx.fillStyle = sgrd; sctx.fillRect(0, 0, 256, 256);
  const glowMat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, blending: THREE.NormalBlending, depthWrite: false, opacity: 0 });
  const glowSprite = new THREE.Sprite(glowMat);
  glowSprite.scale.set(7, 7, 1);
  scene.add(glowSprite);

  // state
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, rotX: 0, rotY: 0, tRotX: 0, tRotY: 0 };
  let scrollY = 0;
  let introStart = performance.now();
  let revealed = false;
  const dummy = new THREE.Object3D();
  const tmp = new THREE.Vector3();

  const onMouseMove = (e: MouseEvent) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    if (e.clientX < window.innerWidth / 2) {
      mouse.tRotY = (e.clientX / (window.innerWidth / 2) - 0.5) * 1.5;
      mouse.tRotX = (e.clientY / window.innerHeight - 0.5) * 1.5;
    }
  };
  const onResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
  const onScroll = () => { scrollY = window.scrollY; };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onScroll, { passive: true });

  let rafId: number;
  function animate() {
    rafId = requestAnimationFrame(animate);
    const now = performance.now();
    const elapsed = (now - introStart) / 1000 * STATE.speed;

    let acc = 0, p = 0, local = 0;
    for (let i = 0; i < phaseDurations.length; i++) {
      if (elapsed < acc + phaseDurations[i]) { p = i; local = (elapsed - acc) / phaseDurations[i]; break; }
      acc += phaseDurations[i]; p = i + 1;
    }
    if (p >= phaseDurations.length) { p = 4; local = 1; if (!revealed) { revealed = true; onReveal(); } }

    // neuron positions
    const npAttr = nodesPoints.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < neurons.length; i++) {
      const nn = neurons[i];
      let target: THREE.Vector3;
      if (p === 0) { target = nn.scatter.clone(); target.x += Math.sin(elapsed * 0.6 + nn.seed) * 0.18; target.y += Math.cos(elapsed * 0.5 + nn.seed * 1.3) * 0.18; }
      else if (p === 1) { const tt = easeInOut(local); target = new THREE.Vector3().lerpVectors(nn.scatter, nn.rest, tt); const sw = (1 - tt) * 1.4; target.x += Math.sin(elapsed * 2 + nn.seed) * sw * 0.45; target.y += Math.cos(elapsed * 1.6 + nn.seed * 1.4) * sw * 0.45; }
      else if (p === 2) { target = nn.rest.clone(); target.multiplyScalar(1 + Math.sin(local * Math.PI) * 0.03); }
      else if (p === 3) { target = nn.rest.clone(); target.multiplyScalar(1 + Math.sin(elapsed * 2 + nn.seed) * 0.012 + Math.sin(local * Math.PI) * 0.04); }
      else { target = nn.rest.clone(); target.multiplyScalar(1 + Math.sin(elapsed * 0.6) * 0.012 + Math.sin(elapsed * 1.4 + nn.seed) * 0.008); }
      nn.current.lerp(target, 0.16);
      npAttr.array[i * 3] = nn.current.x; npAttr.array[i * 3 + 1] = nn.current.y; npAttr.array[i * 3 + 2] = nn.current.z;
    }
    npAttr.needsUpdate = true;
    nodesMat.size = 0.085 + (p >= 2 ? 0.04 : 0) * (1 + Math.sin(elapsed * 2) * 0.15);
    nodesMat.opacity = p === 0 ? 0.6 + local * 0.3 : 0.95;

    // edges (blue + gold)
    let edgeOp = 0;
    if (p === 0) edgeOp = 0; else if (p === 1) edgeOp = local * 0.15; else if (p === 2) edgeOp = 0.15 + easeOut(local) * 0.45; else if (p === 3) edgeOp = 0.6 - local * 0.15; else edgeOp = 0.45 + Math.sin(elapsed * 0.8) * 0.05;
    eMatBlue.opacity = edgeOp;
    eMatGold.opacity = edgeOp;
    if (edgeOp > 0.05) {
      for (let i = 0; i < blueEdges.length; i++) { const [a, b] = blueEdges[i]; const na = neurons[a].current, nb = neurons[b].current; ePosBlue[i * 6] = na.x; ePosBlue[i * 6 + 1] = na.y; ePosBlue[i * 6 + 2] = na.z; ePosBlue[i * 6 + 3] = nb.x; ePosBlue[i * 6 + 4] = nb.y; ePosBlue[i * 6 + 5] = nb.z; }
      edgeLinesBlue.geometry.attributes.position.needsUpdate = true;
      for (let i = 0; i < goldEdges.length; i++) { const [a, b] = goldEdges[i]; const na = neurons[a].current, nb = neurons[b].current; ePosGold[i * 6] = na.x; ePosGold[i * 6 + 1] = na.y; ePosGold[i * 6 + 2] = na.z; ePosGold[i * 6 + 3] = nb.x; ePosGold[i * 6 + 4] = nb.y; ePosGold[i * 6 + 5] = nb.z; }
      edgeLinesGold.geometry.attributes.position.needsUpdate = true;
    }

    // signals
    let sigOp = 0;
    if (p === 2) sigOp = local * 0.7; else if (p === 3) sigOp = 0.7 + Math.sin(elapsed * 4) * 0.2; else if (p >= 4) sigOp = 0.85;
    sigMat.opacity = sigOp;
    if (sigOp > 0.05) {
      for (let i = 0; i < signals.length; i++) {
        const s = signals[i]; s.t += s.speed * 0.012 * STATE.speed;
        if (s.t >= 1) { s.t = 0; s.edgeIdx = Math.floor(Math.random() * edgePairs.length); }
        const [a, b] = edgePairs[s.edgeIdx]; tmp.lerpVectors(neurons[a].current, neurons[b].current, s.t);
        dummy.position.copy(tmp); dummy.scale.setScalar(0.7 + Math.sin(s.t * Math.PI) * 0.6); dummy.updateMatrix();
        signalsMesh.setMatrixAt(i, dummy.matrix);
      }
      signalsMesh.instanceMatrix.needsUpdate = true;
    }

    // shell
    let shellOp = 0;
    if (p === 2) shellOp = local * 0.18; else if (p === 3) shellOp = 0.18 + Math.sin(local * Math.PI) * 0.15; else if (p >= 4) shellOp = 0.12;
    (coreShellWire.material as THREE.LineBasicMaterial).opacity = shellOp;
    mouse.rotX += (mouse.tRotX - mouse.rotX) * 0.06;
    mouse.rotY += (mouse.tRotY - mouse.rotY) * 0.06;

    const coreRot = elapsed * 0.18 * STATE.rotation;
    coreShellWire.rotation.set(coreRot * 0.5 + mouse.rotX, coreRot + mouse.rotY, coreRot * 0.3);
    neuronsGroup.rotation.y = coreRot * 0.6 + mouse.rotY;
    neuronsGroup.rotation.x = Math.sin(elapsed * 0.2) * 0.08 + mouse.rotX;

    // glow
    let glowOp = 0;
    if (p === 0) glowOp = 0.05 + local * 0.05; else if (p === 1) glowOp = 0.1 + local * 0.2; else if (p === 2) glowOp = 0.3 + local * 0.3; else if (p === 3) glowOp = 0.6 - local * 0.2; else glowOp = 0.4 + Math.sin(elapsed * 0.8) * 0.05;
    glowMat.opacity = glowOp;

    // rings
    ringsGroup.children.forEach((r, i) => {
      let op = 0;
      if (p === 3) op = Math.sin(local * Math.PI) * 0.7; else if (p >= 4) op = 0.35 + Math.sin(elapsed * 0.6 + i) * 0.06;
      (r as THREE.Line).material instanceof THREE.LineBasicMaterial && ((r as THREE.Line).material as THREE.LineBasicMaterial).opacity !== undefined && (((r as THREE.Line).material as THREE.LineBasicMaterial).opacity = op);
      if ((r as any).spinAxis) r.rotateOnAxis((r as any).spinAxis, 0.003);
    });

    // particles
    particlesPoints.rotation.y = elapsed * 0.018;
    particlesPoints.rotation.x = Math.sin(elapsed * 0.1) * 0.12;
    (particlesPoints.material as THREE.PointsMaterial).opacity = (p === 0) ? 0.3 + local * 0.3 : 0.55 - Math.max(0, (p - 3)) * 0.1;

    // camera offset to push sphere to the right
    const offsetX = window.innerWidth > 768 ? -2.2 : 0;

    let camZ = 9;
    if (p === 0) camZ = 9; else if (p === 1) camZ = 9 - local * 1.4; else if (p === 2) camZ = 7.6 - local * 0.6; else if (p === 3) camZ = 7.0 + local * 0.4; else camZ = 7.4;
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    const sk = Math.min(1, scrollY / 600);
    camera.position.x += ((mouse.x * 0.5 + offsetX) - camera.position.x) * 0.05;
    camera.position.y += ((-mouse.y * 0.35 + sk * 1.0) - camera.position.y) * 0.05;
    camera.position.z += ((camZ + sk * 1.5) - camera.position.z) * 0.06;
    camera.lookAt(offsetX, sk * 0.6, 0);

    renderer.render(scene, camera);
  }

  animate();

  // hide splash
  setTimeout(() => { const s = document.getElementById('splash'); if (s) s.style.opacity = '0'; }, 240);
  setTimeout(() => { const s = document.getElementById('splash'); if (s) s.remove(); }, 1200);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onScroll);
    renderer.dispose();
  };
}
