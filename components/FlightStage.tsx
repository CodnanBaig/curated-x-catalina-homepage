"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface FlightTelemetry {
  progress: number;
  stageIndex: 0 | 1 | 2;
  stageLabel: string;
  stageCode: string;
  altitudeFt: number;
  speedKts: number;
  coordinates: string;
  phaseNote: string;
}

interface FlightStageProps {
  onTelemetry?: (data: FlightTelemetry) => void;
}

/**
 * Stage 01: Sculpted Origami Paper Glider
 * Warm alabaster-cream folded paper with crisp architectural creases and vermilion wingtips.
 */
function createPaperPlane(): THREE.Group {
  const group = new THREE.Group();

  const paperMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#fbf6ec"),
    roughness: 0.36,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });

  const underFoldMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#dfd1ba"),
    roughness: 0.46,
    metalness: 0.04,
    side: THREE.DoubleSide,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#bb3028"),
    roughness: 0.28,
    metalness: 0.14,
    side: THREE.DoubleSide,
  });

  // Left main wing
  const leftWingGeo = new THREE.BufferGeometry();
  leftWingGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(
      new Float32Array([
        0, 0.06, 1.55,
        -1.38, 0.24, -1.08,
        -0.15, 0.08, -0.98,
      ]),
      3
    )
  );
  leftWingGeo.computeVertexNormals();

  // Right main wing
  const rightWingGeo = new THREE.BufferGeometry();
  rightWingGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(
      new Float32Array([
        0, 0.06, 1.55,
        0.15, 0.08, -0.98,
        1.38, 0.24, -1.08,
      ]),
      3
    )
  );
  rightWingGeo.computeVertexNormals();

  // Left inner valley keel
  const leftValleyGeo = new THREE.BufferGeometry();
  leftValleyGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(
      new Float32Array([
        0, 0.06, 1.55,
        -0.15, 0.08, -0.98,
        0, -0.38, -1.12,
      ]),
      3
    )
  );
  leftValleyGeo.computeVertexNormals();

  // Right inner valley keel
  const rightValleyGeo = new THREE.BufferGeometry();
  rightValleyGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(
      new Float32Array([
        0, 0.06, 1.55,
        0, -0.38, -1.12,
        0.15, 0.08, -0.98,
      ]),
      3
    )
  );
  rightValleyGeo.computeVertexNormals();

  // Left upturned vermilion wingtip
  const leftTipGeo = new THREE.BufferGeometry();
  leftTipGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(
      new Float32Array([
        -1.08, 0.19, -0.45,
        -1.38, 0.24, -1.08,
        -1.26, 0.44, -1.1,
      ]),
      3
    )
  );
  leftTipGeo.computeVertexNormals();

  // Right upturned vermilion wingtip
  const rightTipGeo = new THREE.BufferGeometry();
  rightTipGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(
      new Float32Array([
        1.08, 0.19, -0.45,
        1.26, 0.44, -1.1,
        1.38, 0.24, -1.08,
      ]),
      3
    )
  );
  rightTipGeo.computeVertexNormals();

  const creaseMat = new THREE.LineBasicMaterial({
    color: 0xb88b5a,
    transparent: true,
    opacity: 0.7,
  });
  const creaseGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-1.38, 0.245, -1.08),
    new THREE.Vector3(0, 0.065, 1.55),
    new THREE.Vector3(1.38, 0.245, -1.08),
    new THREE.Vector3(0.15, 0.085, -0.98),
    new THREE.Vector3(0, 0.065, 1.55),
    new THREE.Vector3(-0.15, 0.085, -0.98),
  ]);

  group.add(
    new THREE.Mesh(leftWingGeo, paperMat),
    new THREE.Mesh(rightWingGeo, paperMat),
    new THREE.Mesh(leftValleyGeo, underFoldMat),
    new THREE.Mesh(rightValleyGeo, underFoldMat),
    new THREE.Mesh(leftTipGeo, accentMat),
    new THREE.Mesh(rightTipGeo, accentMat),
    new THREE.Line(creaseGeo, creaseMat)
  );

  return group;
}

/**
 * Stage 02: Bespoke Executive Private Jet (Gulfstream / Global Express)
 */
function createPrivateJet(): THREE.Group {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#fbf6ed"),
    roughness: 0.2,
    metalness: 0.22,
  });

  const bronzeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#c69963"),
    roughness: 0.26,
    metalness: 0.68,
  });

  const redMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#bb3028"),
    roughness: 0.24,
    metalness: 0.25,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#182026"),
    roughness: 0.08,
    metalness: 0.88,
  });

  const glowMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#ff6e42"),
  });

  const fuselageGeo = new THREE.CylinderGeometry(0.21, 0.18, 2.25, 24);
  fuselageGeo.rotateX(Math.PI / 2);
  group.add(new THREE.Mesh(fuselageGeo, bodyMat));

  const noseGeo = new THREE.ConeGeometry(0.21, 0.92, 24);
  noseGeo.rotateX(Math.PI / 2);
  noseGeo.translate(0, -0.01, 1.58);
  group.add(new THREE.Mesh(noseGeo, bodyMat));

  const tailConeGeo = new THREE.ConeGeometry(0.18, 0.78, 24);
  tailConeGeo.rotateX(-Math.PI / 2);
  tailConeGeo.translate(0, 0.02, -1.51);
  group.add(new THREE.Mesh(tailConeGeo, bodyMat));

  const stripeGeo = new THREE.BoxGeometry(0.43, 0.03, 2.45);
  stripeGeo.translate(0, 0.04, 0.05);
  group.add(new THREE.Mesh(stripeGeo, redMat));

  const goldStripeGeo = new THREE.BoxGeometry(0.435, 0.016, 2.3);
  goldStripeGeo.translate(0, 0.01, 0.05);
  group.add(new THREE.Mesh(goldStripeGeo, bronzeMat));

  for (const side of [-1, 1]) {
    for (let i = 0; i < 6; i++) {
      const wGeo = new THREE.SphereGeometry(0.028, 10, 10);
      wGeo.scale(0.35, 0.75, 1.25);
      wGeo.translate(side * 0.208, 0.08, 0.65 - i * 0.24);
      group.add(new THREE.Mesh(wGeo, glassMat));
    }
  }

  const cockpitGeo = new THREE.SphereGeometry(0.18, 20, 14);
  cockpitGeo.scale(0.94, 0.56, 1.65);
  cockpitGeo.translate(0, 0.11, 0.98);
  group.add(new THREE.Mesh(cockpitGeo, glassMat));

  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0.38);
  wingShape.lineTo(1.75, -0.44);
  wingShape.lineTo(1.75, -0.68);
  wingShape.lineTo(0, -0.34);
  wingShape.lineTo(-1.75, -0.68);
  wingShape.lineTo(-1.75, -0.44);
  wingShape.closePath();

  const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
    depth: 0.035,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.012,
    bevelThickness: 0.012,
  });
  wingGeo.rotateX(Math.PI / 2);
  wingGeo.translate(0, -0.04, 0.06);
  group.add(new THREE.Mesh(wingGeo, bodyMat));

  for (const dir of [-1, 1]) {
    const wingletGeo = new THREE.BoxGeometry(0.028, 0.32, 0.25);
    wingletGeo.rotateZ(dir * -0.24);
    wingletGeo.translate(dir * 1.73, 0.09, -0.52);
    group.add(new THREE.Mesh(wingletGeo, redMat));
  }

  const vTailShape = new THREE.Shape();
  vTailShape.moveTo(0, 0);
  vTailShape.lineTo(-0.52, 0.72);
  vTailShape.lineTo(-0.82, 0.72);
  vTailShape.lineTo(-0.48, 0);
  vTailShape.closePath();
  const vTailGeo = new THREE.ExtrudeGeometry(vTailShape, {
    depth: 0.03,
    bevelEnabled: true,
    bevelSize: 0.008,
    bevelThickness: 0.008,
  });
  vTailGeo.rotateY(Math.PI / 2);
  vTailGeo.translate(-0.015, 0.13, -1.0);
  group.add(new THREE.Mesh(vTailGeo, redMat));

  const hTailShape = new THREE.Shape();
  hTailShape.moveTo(0, 0.16);
  hTailShape.lineTo(0.62, -0.15);
  hTailShape.lineTo(0.62, -0.28);
  hTailShape.lineTo(0, -0.09);
  hTailShape.lineTo(-0.62, -0.28);
  hTailShape.lineTo(-0.62, -0.15);
  hTailShape.closePath();
  const hTailGeo = new THREE.ExtrudeGeometry(hTailShape, { depth: 0.022, bevelEnabled: false });
  hTailGeo.rotateX(Math.PI / 2);
  hTailGeo.translate(0, 0.82, -1.62);
  group.add(new THREE.Mesh(hTailGeo, bodyMat));

  for (const dir of [-1, 1]) {
    const nacGroup = new THREE.Group();
    const nacGeo = new THREE.CylinderGeometry(0.105, 0.09, 0.6, 20);
    nacGeo.rotateX(Math.PI / 2);
    const intakeGeo = new THREE.TorusGeometry(0.098, 0.014, 12, 24);
    const intake = new THREE.Mesh(intakeGeo, bronzeMat);
    intake.position.z = 0.3;

    const exhaust = new THREE.Mesh(new THREE.SphereGeometry(0.074, 12, 12), glowMat);
    exhaust.position.z = -0.29;

    nacGroup.add(new THREE.Mesh(nacGeo, bodyMat), intake, exhaust);
    nacGroup.position.set(dir * 0.31, 0.11, -0.82);
    group.add(nacGroup);
  }

  group.scale.setScalar(0.86);
  return group;
}

/**
 * Stage 03: Wide-Body Long-Haul Passenger Jet (A350 / 787 Flagship)
 */
function createPassengerJet(): THREE.Group {
  const group = new THREE.Group();

  const fuselageMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#fcf8f0"),
    roughness: 0.17,
    metalness: 0.24,
  });

  const wingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#efe6d5"),
    roughness: 0.25,
    metalness: 0.22,
  });

  const redLiveryMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#bb3028"),
    roughness: 0.2,
    metalness: 0.3,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#d4a56a"),
    roughness: 0.24,
    metalness: 0.72,
  });

  const windowGlowMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#ffdf9e"),
  });

  const cockpitMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#141c24"),
    roughness: 0.08,
    metalness: 0.9,
  });

  const bodyGeo = new THREE.CylinderGeometry(0.3, 0.28, 2.9, 28);
  bodyGeo.rotateX(Math.PI / 2);
  group.add(new THREE.Mesh(bodyGeo, fuselageMat));

  const noseGeo = new THREE.SphereGeometry(0.3, 28, 20);
  noseGeo.scale(1, 0.92, 2.7);
  noseGeo.translate(0, -0.02, 1.44);
  group.add(new THREE.Mesh(noseGeo, fuselageMat));

  const tailGeo = new THREE.ConeGeometry(0.28, 1.02, 28);
  tailGeo.rotateX(-Math.PI / 2);
  tailGeo.translate(0, 0.03, -1.94);
  group.add(new THREE.Mesh(tailGeo, fuselageMat));

  const cheatlineGeo = new THREE.BoxGeometry(0.61, 0.03, 2.95);
  cheatlineGeo.translate(0, 0.02, 0.05);
  group.add(new THREE.Mesh(cheatlineGeo, redLiveryMat));

  for (const side of [-1, 1]) {
    for (let i = 0; i < 15; i++) {
      const winGeo = new THREE.BoxGeometry(0.024, 0.038, 0.06);
      winGeo.translate(side * 0.298, 0.08, 1.12 - i * 0.17);
      group.add(new THREE.Mesh(winGeo, windowGlowMat));
    }
  }

  const maskGeo = new THREE.SphereGeometry(0.26, 20, 14);
  maskGeo.scale(1.02, 0.5, 1.48);
  maskGeo.translate(0, 0.11, 1.72);
  group.add(new THREE.Mesh(maskGeo, cockpitMat));

  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0.58);
  wingShape.lineTo(2.55, -0.58);
  wingShape.lineTo(2.68, -0.84);
  wingShape.lineTo(2.42, -0.88);
  wingShape.lineTo(0, -0.32);
  wingShape.lineTo(-2.42, -0.88);
  wingShape.lineTo(-2.68, -0.84);
  wingShape.lineTo(-2.55, -0.58);
  wingShape.closePath();

  const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
    depth: 0.045,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  });
  wingGeo.rotateX(Math.PI / 2);
  wingGeo.translate(0, -0.05, 0.2);
  group.add(new THREE.Mesh(wingGeo, wingMat));

  for (const dir of [-1, 1]) {
    const tipGeo = new THREE.BoxGeometry(0.032, 0.38, 0.34);
    tipGeo.rotateZ(dir * -0.34);
    tipGeo.rotateX(0.25);
    tipGeo.translate(dir * 2.58, 0.11, -0.68);
    group.add(new THREE.Mesh(tipGeo, redLiveryMat));
  }

  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(-0.62, 0.96);
  finShape.lineTo(-1.05, 0.96);
  finShape.lineTo(-0.66, 0);
  finShape.closePath();
  const finGeo = new THREE.ExtrudeGeometry(finShape, {
    depth: 0.04,
    bevelEnabled: true,
    bevelSize: 0.01,
    bevelThickness: 0.01,
  });
  finGeo.rotateY(Math.PI / 2);
  finGeo.translate(-0.02, 0.2, -1.18);
  group.add(new THREE.Mesh(finGeo, redLiveryMat));

  const hStabShape = new THREE.Shape();
  hStabShape.moveTo(0, 0.2);
  hStabShape.lineTo(0.92, -0.26);
  hStabShape.lineTo(0.92, -0.46);
  hStabShape.lineTo(0, -0.15);
  hStabShape.lineTo(-0.92, -0.46);
  hStabShape.lineTo(-0.92, -0.26);
  hStabShape.closePath();
  const hStabGeo = new THREE.ExtrudeGeometry(hStabShape, { depth: 0.028, bevelEnabled: false });
  hStabGeo.rotateX(Math.PI / 2);
  hStabGeo.translate(0, 0.1, -1.72);
  group.add(new THREE.Mesh(hStabGeo, fuselageMat));

  const enginePositions = [
    { x: -0.82, y: -0.14, z: 0.22, scale: 1.05 },
    { x: 0.82, y: -0.14, z: 0.22, scale: 1.05 },
    { x: -1.52, y: -0.12, z: -0.12, scale: 0.88 },
    { x: 1.52, y: -0.12, z: -0.12, scale: 0.88 },
  ];

  for (const pos of enginePositions) {
    const engGroup = new THREE.Group();
    const cowlGeo = new THREE.CylinderGeometry(0.145, 0.12, 0.65, 24);
    cowlGeo.rotateX(Math.PI / 2);
    const cowl = new THREE.Mesh(cowlGeo, fuselageMat);

    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.136, 0.016, 12, 24), goldMat);
    lip.position.z = 0.325;

    const core = new THREE.Mesh(new THREE.CircleGeometry(0.125, 20), cockpitMat);
    core.position.z = 0.32;

    const afterglow = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), windowGlowMat);
    afterglow.position.z = -0.3;

    engGroup.add(cowl, lip, core, afterglow);
    engGroup.position.set(pos.x, pos.y, pos.z);
    engGroup.scale.setScalar(pos.scale);
    group.add(engGroup);
  }

  group.scale.setScalar(0.68);
  return group;
}

export default function FlightStage({ onTelemetry }: FlightStageProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const telemetryCallbackRef = useRef(onTelemetry);
  telemetryCallbackRef.current = onTelemetry;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      36,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 11.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    // Warm Golden-Hour Atelier Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5e4, 1.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff0d6, 2.8);
    sunLight.position.set(7, 12, 11);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xbb3028, 1.35);
    rimLight.position.set(-8, 4, 8);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xd9c3a5, 1.0);
    fillLight.position.set(0, -7, 6);
    scene.add(fillLight);

    // Aircraft Rig & Three Morphing Craft
    const craftRig = new THREE.Group();
    craftRig.rotation.order = "YXZ";
    scene.add(craftRig);

    const paperPlane = createPaperPlane();
    const privateJet = createPrivateJet();
    const passengerJet = createPassengerJet();

    craftRig.add(paperPlane, privateJet, passengerJet);

    // Sleek 3D Aerodynamic Slipstream Rings during morph transitions (no square point sprites!)
    const slipstreamGroup = new THREE.Group();
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xbb3028,
      transparent: true,
      opacity: 0,
    });
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xc69963,
      transparent: true,
      opacity: 0,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.016, 16, 64), ringMat1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.012, 16, 64), ringMat2);
    ring1.rotation.x = 0.35;
    ring2.rotation.y = 0.45;
    slipstreamGroup.add(ring1, ring2);
    craftRig.add(slipstreamGroup);

    // Twin Wingtip Contrail Ribbons
    const trailLength = 58;
    const leftTrailPoints = Array.from({ length: trailLength }, () => new THREE.Vector3(0, 0, 0));
    const rightTrailPoints = Array.from({ length: trailLength }, () => new THREE.Vector3(0, 0, 0));

    const leftTrailGeo = new THREE.BufferGeometry().setFromPoints(leftTrailPoints);
    const rightTrailGeo = new THREE.BufferGeometry().setFromPoints(rightTrailPoints);

    const trailMat = new THREE.LineBasicMaterial({
      color: 0xbb3028,
      transparent: true,
      opacity: 0.36,
    });
    const secondTrailMat = new THREE.LineBasicMaterial({
      color: 0xc69963,
      transparent: true,
      opacity: 0.3,
    });

    const leftTrailLine = new THREE.Line(leftTrailGeo, trailMat);
    const rightTrailLine = new THREE.Line(rightTrailGeo, secondTrailMat);
    scene.add(leftTrailLine, rightTrailLine);

    // Choreographed 3D Zig-Zag Flight Spline across the page scroll (t = 0..1)
    // Carefully placed in the open aerial corridors around cards & headlines!
    const buildFlightCurve = (isMobile: boolean) => {
      const xMul = isMobile ? 0.42 : 1.0;
      return new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(isMobile ? 0.65 : 0.18, isMobile ? 0.98 : 0.65, 1.4), // 0.00: Hero sky channel between headline & coastal window
          new THREE.Vector3(2.85 * xMul, -0.15, 2.8),   // 0.11: Banks right across Hero coastal photo (foreground scale-up)
          new THREE.Vector3(-2.85 * xMul, -0.35, -1.2), // 0.22: Sweeps left into deep space around Waypoint 01
          new THREE.Vector3(2.75 * xMul, 0.25, 2.7),    // 0.34: MORPH 1 -> Private Jet! Right corridor close-up
          new THREE.Vector3(-2.75 * xMul, -0.18, 1.8),  // 0.46: Banks left into open corridor opposite Waypoint 02
          new THREE.Vector3(2.65 * xMul, 0.32, -1.4),   // 0.58: Sweeps right past Waypoint 03 & Catalina Story
          new THREE.Vector3(-2.55 * xMul, 0.05, 2.6),   // 0.68: MORPH 2 -> Wide-Body Passenger Jet! Left corridor close-up
          new THREE.Vector3(2.65 * xMul, 0.15, 1.6),    // 0.78: Weaves right alongside "Travel Should Feel Like" ladder
          new THREE.Vector3(-2.45 * xMul, -0.25, 2.2),  // 0.88: Banks left beside Thailand Field Dispatches
          new THREE.Vector3(2.05 * xMul, 0.35, 2.9),    // 0.95: Sweeping Final Approach on right of Closing Terminal
          new THREE.Vector3(0.0, -0.45, 1.8),           // 1.00: Touchdown center above Footer
        ],
        false,
        "catmullrom",
        0.5
      );
    };

    let flightCurve = buildFlightCurve(window.innerWidth < 820);

    // Balanced 3D perspective scale oscillation (never overwhelms text)
    const sampleScale = (t: number, isMobile: boolean): number => {
      const base = isMobile ? 0.44 : 0.64;
      const depthWave = Math.sin(t * Math.PI * 5.5) * 0.16 + Math.cos(t * Math.PI * 3.0) * 0.08;
      return Math.max(0.4, base + depthWave);
    };

    let targetScrollT = 0;
    let smoothScrollT = 0;
    let scrollVelocity = 0;
    let pointerX = 0;
    let pointerY = 0;
    let lastReportedStage = -1;
    let lastTelemetryTime = 0;

    const updateScrollTarget = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScrollT = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    updateScrollTarget();
    window.addEventListener("scroll", updateScrollTarget, { passive: true });

    const onPointerMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      flightCurve = buildFlightCurve(window.innerWidth < 820);
    };
    window.addEventListener("resize", onResize);

    const startPt = flightCurve.getPointAt(0);
    for (let i = 0; i < trailLength; i++) {
      leftTrailPoints[i].copy(startPt);
      rightTrailPoints[i].copy(startPt);
    }

    const smoothstep = (edge0: number, edge1: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    };

    let rafId = 0;
    const clock = new THREE.Clock();
    const targetQuat = new THREE.Quaternion();
    const targetEuler = new THREE.Euler(0, 0, 0, "YXZ");

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      const introFactor = reducedMotion ? 1 : smoothstep(0, 1.6, elapsed);

      const deltaT = targetScrollT - smoothScrollT;
      smoothScrollT += deltaT * (reducedMotion ? 0.25 : 0.08);
      scrollVelocity = deltaT * 100;

      const t = Math.min(0.998, Math.max(0.002, smoothScrollT));
      const isMobile = window.innerWidth < 820;

      const pos = flightCurve.getPointAt(t);
      const nextPos = flightCurve.getPointAt(Math.min(1, t + 0.02));
      const prevPos = flightCurve.getPointAt(Math.max(0, t - 0.02));

      const introOffsetX = (1 - introFactor) * -2.2;
      const introOffsetY = (1 - introFactor) * 0.9;

      const floatY = reducedMotion ? 0 : Math.sin(elapsed * 2.1) * 0.08;
      const floatX = reducedMotion ? 0 : Math.cos(elapsed * 1.5) * 0.05;

      craftRig.position.set(
        pos.x + introOffsetX + floatX + pointerX * 0.18,
        pos.y + introOffsetY + floatY + pointerY * 0.14,
        pos.z
      );

      // Deterministic 3/4 Top-Side Heroic Flight Orientation (never flips upside-down!)
      const dx = nextPos.x - pos.x;
      const dz = nextPos.z - pos.z;
      const dxPrev = pos.x - prevPos.x;
      const turnAccel = (dx - dxPrev) * 10;

      // Yaw (left/right heading along the zig-zag):
      const yaw = THREE.MathUtils.clamp(dx * 1.45 + pointerX * 0.18, -0.95, 0.95);
      // Pitch (tilted forward toward camera & slightly downward so the dorsal fuselage, wings & tail fin are always visible):
      const pitch = THREE.MathUtils.clamp(
        0.58 - dz * 0.25 + scrollVelocity * 0.025 - pointerY * 0.12,
        0.32,
        0.88
      );
      // Roll / Bank into the turn:
      const roll = THREE.MathUtils.clamp(
        -dx * 0.95 - turnAccel * 0.6 - pointerX * 0.18,
        -0.72,
        0.72
      );

      targetEuler.set(pitch, yaw, roll, "YXZ");
      targetQuat.setFromEuler(targetEuler);
      craftRig.quaternion.slerp(targetQuat, 0.12);

      const targetScale = sampleScale(t, isMobile) * (0.55 + 0.45 * introFactor);
      craftRig.scale.setScalar(targetScale);

      // Smooth 3-stage aircraft transformation:
      // Stage 0 (Paper Glider): 0.00 -> 0.34
      // Stage 1 (Private Jet): 0.34 -> 0.67
      // Stage 2 (Passenger Airliner): 0.67 -> 1.00
      const m1 = smoothstep(0.27, 0.39, t);
      const m2 = smoothstep(0.61, 0.73, t);

      const wPaper = 1 - m1;
      const wPrivate = m1 * (1 - m2);
      const wPassenger = m2;

      paperPlane.visible = wPaper > 0.01;
      privateJet.visible = wPrivate > 0.01;
      passengerJet.visible = wPassenger > 0.01;

      paperPlane.scale.setScalar(Math.max(0.001, wPaper));
      privateJet.scale.setScalar(Math.max(0.001, wPrivate * 0.86));
      passengerJet.scale.setScalar(Math.max(0.001, wPassenger * 0.68));

      // Sleek slipstream rings during transitions
      const morphIntensity = Math.max(
        Math.sin(smoothstep(0.26, 0.4, t) * Math.PI),
        Math.sin(smoothstep(0.6, 0.74, t) * Math.PI)
      );
      ringMat1.opacity = morphIntensity * 0.55;
      ringMat2.opacity = morphIntensity * 0.4;
      slipstreamGroup.rotation.z = elapsed * 2.4;
      slipstreamGroup.scale.setScalar(0.75 + morphIntensity * 0.55);

      // Update twin wingtip contrails
      const wingSpan = wPaper * 1.32 + wPrivate * 1.48 + wPassenger * 1.75;
      const leftTipWorld = new THREE.Vector3(-wingSpan, 0.1, -0.85).applyMatrix4(
        craftRig.matrixWorld
      );
      const rightTipWorld = new THREE.Vector3(wingSpan, 0.1, -0.85).applyMatrix4(
        craftRig.matrixWorld
      );

      for (let i = trailLength - 1; i > 0; i--) {
        leftTrailPoints[i].lerp(leftTrailPoints[i - 1], 0.54);
        rightTrailPoints[i].lerp(rightTrailPoints[i - 1], 0.54);
      }
      leftTrailPoints[0].copy(leftTipWorld);
      rightTrailPoints[0].copy(rightTipWorld);

      leftTrailGeo.setFromPoints(leftTrailPoints);
      rightTrailGeo.setFromPoints(rightTrailPoints);

      renderer.render(scene, camera);

      // Emit telemetry updates
      const now = performance.now();
      const stageIndex: 0 | 1 | 2 = t < 0.33 ? 0 : t < 0.67 ? 1 : 2;
      if (telemetryCallbackRef.current && (now - lastTelemetryTime > 90 || stageIndex !== lastReportedStage)) {
        lastTelemetryTime = now;
        lastReportedStage = stageIndex;

        const stageMeta = [
          {
            label: "Origami Paper Glider",
            code: "STAGE 01 · PAPER GLIDER",
            phase: "First spark: sketching your bespoke route",
            coords: "34°03′N 118°14′W → 24°08′N 110°18′W",
          },
          {
            label: "Bespoke Private Jet",
            code: "STAGE 02 · PRIVATE JET",
            phase: "White-glove concierge & insider access",
            coords: "24°08′N 110°18′W → 13°45′N 100°30′E",
          },
          {
            label: "Flagship Passenger Jet",
            code: "STAGE 03 · PASSENGER JET",
            phase: "Transpacific arrival into Chiang Mai",
            coords: "18°47′N 98°59′E · CHIANG MAI, THAILAND",
          },
        ][stageIndex];

        const altitudeFt = Math.round(1400 + Math.sin(t * Math.PI) * 39600);
        const speedKts =
          stageIndex === 0 ? 45 + Math.round(t * 190) : stageIndex === 1 ? 465 + Math.round(t * 55) : 524;

        telemetryCallbackRef.current({
          progress: t,
          stageIndex,
          stageLabel: stageMeta.label,
          stageCode: stageMeta.code,
          altitudeFt,
          speedKts,
          coordinates: stageMeta.coords,
          phaseNote: stageMeta.phase,
        });
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updateScrollTarget);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="flight-stage" aria-hidden="true" />;
}
