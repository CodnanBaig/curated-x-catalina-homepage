"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface FlightPose {
  progress: number;
  stageIndex: 0 | 1 | 2;
  /** True when the aircraft is on a deep pass behind the 2D Earth disc or behind photo cards */
  behindGlobe: boolean;
  globeOrbitProgress: number;
}

interface FlightStageProps {
  enabled: boolean;
  onPoseChange?: (pose: FlightPose) => void;
}

/**
 * Stage 01: High-Detail Artisanal Origami Paper Glider
 */
function createPaperPlane(): THREE.Group {
  const group = new THREE.Group();

  const paperMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#fbf6ec"),
    roughness: 0.34,
    metalness: 0.06,
    side: THREE.DoubleSide,
  });

  const midFoldMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#efe5d4"),
    roughness: 0.42,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });

  const deepValleyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#d8c7ae"),
    roughness: 0.52,
    metalness: 0.04,
    side: THREE.DoubleSide,
  });

  const redTrimMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#bb3028"),
    roughness: 0.26,
    metalness: 0.16,
    side: THREE.DoubleSide,
  });

  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#c69963"),
    roughness: 0.28,
    metalness: 0.65,
    side: THREE.DoubleSide,
  });

  const makeTri = (
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    mat: THREE.Material
  ) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([...p1, ...p2, ...p3]), 3)
    );
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, mat);
  };

  // Main outer delta wings
  group.add(
    makeTri([0, 0.07, 1.68], [-1.42, 0.26, -1.08], [-0.36, 0.12, -1.04], paperMat),
    makeTri([0, 0.07, 1.68], [0.36, 0.12, -1.04], [1.42, 0.26, -1.08], paperMat)
  );

  // Secondary inner wing pleats
  group.add(
    makeTri([0, 0.07, 1.68], [-0.36, 0.12, -1.04], [-0.12, 0.08, -1.01], midFoldMat),
    makeTri([0, 0.07, 1.68], [0.12, 0.08, -1.01], [0.36, 0.12, -1.04], midFoldMat)
  );

  // Reinforced nose cuff folds
  group.add(
    makeTri([0, 0.075, 1.68], [-0.52, 0.15, 0.42], [-0.18, 0.095, 0.32], goldTrimMat),
    makeTri([0, 0.075, 1.68], [0.18, 0.095, 0.32], [0.52, 0.15, 0.42], goldTrimMat)
  );

  // Deep central valley keel
  group.add(
    makeTri([0, 0.07, 1.68], [-0.12, 0.08, -1.01], [0, -0.42, -1.16], deepValleyMat),
    makeTri([0, 0.07, 1.68], [0, -0.42, -1.16], [0.12, 0.08, -1.01], deepValleyMat)
  );

  // Lower keel fin reinforcement
  group.add(
    makeTri([0, -0.05, 0.95], [0, -0.42, -1.16], [-0.04, -0.22, -1.08], redTrimMat),
    makeTri([0, -0.05, 0.95], [0.04, -0.22, -1.08], [0, -0.42, -1.16], redTrimMat)
  );

  // Upturned aerodynamic winglets
  group.add(
    makeTri([-1.1, 0.2, -0.42], [-1.42, 0.26, -1.08], [-1.3, 0.48, -1.12], redTrimMat),
    makeTri([1.1, 0.2, -0.42], [1.3, 0.48, -1.12], [1.42, 0.26, -1.08], redTrimMat)
  );

  // Gold-leaf trailing edge trim strips
  group.add(
    makeTri([-0.36, 0.122, -1.04], [-1.42, 0.262, -1.08], [-1.36, 0.25, -0.96], goldTrimMat),
    makeTri([0.36, 0.122, -1.04], [1.36, 0.25, -0.96], [1.42, 0.262, -1.08], goldTrimMat)
  );

  const creaseMat = new THREE.LineBasicMaterial({
    color: 0xa67846,
    transparent: true,
    opacity: 0.75,
  });
  const creaseGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-1.42, 0.265, -1.08),
    new THREE.Vector3(0, 0.075, 1.68),
    new THREE.Vector3(1.42, 0.265, -1.08),
    new THREE.Vector3(0.36, 0.125, -1.04),
    new THREE.Vector3(0, 0.075, 1.68),
    new THREE.Vector3(-0.36, 0.125, -1.04),
    new THREE.Vector3(0, 0.075, 1.68),
    new THREE.Vector3(0, -0.42, -1.16),
  ]);
  group.add(new THREE.Line(creaseGeo, creaseMat));

  return group;
}

/**
 * Stage 02: High-Detail Bespoke Executive Private Jet (Gulfstream G700 / Global 7500)
 */
function createPrivateJet(rotorsOut: THREE.Object3D[]): THREE.Group {
  const group = new THREE.Group();

  const fuselageMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#fbf6ed"),
    roughness: 0.16,
    metalness: 0.24,
  });

  const bellyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#e5dac7"),
    roughness: 0.26,
    metalness: 0.28,
  });

  const bronzeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#c69963"),
    roughness: 0.22,
    metalness: 0.76,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#e8e2d8"),
    roughness: 0.12,
    metalness: 0.88,
  });

  const redMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#bb3028"),
    roughness: 0.22,
    metalness: 0.28,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#141c22"),
    roughness: 0.06,
    metalness: 0.92,
  });

  const cabinGlowMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#ffe5b8"),
  });

  const exhaustGlowMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#ff6b3d"),
  });

  const lathePoints: THREE.Vector2[] = [
    new THREE.Vector2(0.001, -1.95),
    new THREE.Vector2(0.06, -1.78),
    new THREE.Vector2(0.13, -1.48),
    new THREE.Vector2(0.185, -1.08),
    new THREE.Vector2(0.215, -0.55),
    new THREE.Vector2(0.22, 0.25),
    new THREE.Vector2(0.215, 0.85),
    new THREE.Vector2(0.185, 1.22),
    new THREE.Vector2(0.135, 1.54),
    new THREE.Vector2(0.075, 1.82),
    new THREE.Vector2(0.025, 1.98),
    new THREE.Vector2(0.001, 2.04),
  ];
  const fuselageGeo = new THREE.LatheGeometry(lathePoints, 36);
  fuselageGeo.rotateX(Math.PI / 2);
  const fuselage = new THREE.Mesh(fuselageGeo, fuselageMat);
  fuselage.scale.set(0.96, 1.04, 1.0);
  group.add(fuselage);

  const radomeGeo = new THREE.SphereGeometry(0.048, 16, 12);
  radomeGeo.scale(0.85, 0.85, 1.8);
  radomeGeo.translate(0, -0.005, 1.98);
  group.add(new THREE.Mesh(radomeGeo, bronzeMat));

  const fairingGeo = new THREE.SphereGeometry(0.22, 24, 18);
  fairingGeo.scale(1.06, 0.52, 3.8);
  fairingGeo.translate(0, -0.11, -0.05);
  group.add(new THREE.Mesh(fairingGeo, bellyMat));

  const redStripeGeo = new THREE.BoxGeometry(0.435, 0.024, 2.75);
  redStripeGeo.translate(0, 0.03, -0.02);
  group.add(new THREE.Mesh(redStripeGeo, redMat));

  const goldStripeGeo = new THREE.BoxGeometry(0.44, 0.014, 2.65);
  goldStripeGeo.translate(0, 0.004, -0.02);
  group.add(new THREE.Mesh(goldStripeGeo, bronzeMat));

  const satcomGeo = new THREE.SphereGeometry(0.045, 16, 12);
  satcomGeo.scale(0.55, 0.65, 3.4);
  satcomGeo.translate(0, 0.23, -0.25);
  group.add(new THREE.Mesh(satcomGeo, fuselageMat));

  const cockpitGeo = new THREE.SphereGeometry(0.172, 24, 16);
  cockpitGeo.scale(0.96, 0.56, 1.72);
  cockpitGeo.translate(0, 0.105, 1.18);
  group.add(new THREE.Mesh(cockpitGeo, glassMat));

  const mullionGeo = new THREE.BoxGeometry(0.012, 0.09, 0.34);
  mullionGeo.rotateX(0.28);
  mullionGeo.translate(0, 0.155, 1.24);
  group.add(new THREE.Mesh(mullionGeo, bronzeMat));

  // 7 Recessed Gulfstream Oval Cabin Windows per side
  for (const side of [-1, 1]) {
    for (let i = 0; i < 7; i++) {
      const zPos = 0.72 - i * 0.23;
      const bezelGeo = new THREE.TorusGeometry(0.034, 0.005, 10, 20);
      bezelGeo.scale(1.35, 0.85, 1);
      bezelGeo.rotateY(Math.PI / 2);
      bezelGeo.translate(side * 0.214, 0.075, zPos);
      group.add(new THREE.Mesh(bezelGeo, bronzeMat));

      const paneGeo = new THREE.SphereGeometry(0.028, 12, 10);
      paneGeo.scale(0.25, 0.75, 1.25);
      paneGeo.translate(side * 0.21, 0.075, zPos);
      group.add(new THREE.Mesh(paneGeo, i % 2 === 0 ? cabinGlowMat : glassMat));
    }
  }

  // Swept Supercritical Main Wings
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0.44);
  wingShape.lineTo(1.82, -0.45);
  wingShape.lineTo(1.86, -0.68);
  wingShape.lineTo(0.45, -0.38);
  wingShape.lineTo(0, -0.34);
  wingShape.lineTo(-0.45, -0.38);
  wingShape.lineTo(-1.86, -0.68);
  wingShape.lineTo(-1.82, -0.45);
  wingShape.closePath();

  const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
    depth: 0.036,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.012,
    bevelThickness: 0.012,
  });
  wingGeo.rotateX(Math.PI / 2);
  wingGeo.translate(0, -0.05, 0.06);
  group.add(new THREE.Mesh(wingGeo, fuselageMat));

  // Sculpted Canted Winglets
  for (const dir of [-1, 1]) {
    const wingletShape = new THREE.Shape();
    wingletShape.moveTo(0, 0);
    wingletShape.lineTo(-0.18, 0.34);
    wingletShape.lineTo(-0.32, 0.34);
    wingletShape.lineTo(-0.24, 0);
    wingletShape.closePath();
    const wlGeo = new THREE.ExtrudeGeometry(wingletShape, {
      depth: 0.018,
      bevelEnabled: true,
      bevelSize: 0.005,
      bevelThickness: 0.005,
    });
    wlGeo.rotateY(Math.PI / 2);
    wlGeo.rotateZ(dir * -0.22);
    wlGeo.translate(dir * 1.83, -0.04, -0.45);
    group.add(new THREE.Mesh(wlGeo, redMat));
  }

  // Swept T-Tail Vertical Stabilizer
  const vTailShape = new THREE.Shape();
  vTailShape.moveTo(0, 0);
  vTailShape.lineTo(-0.56, 0.76);
  vTailShape.lineTo(-0.88, 0.76);
  vTailShape.lineTo(-0.52, 0);
  vTailShape.closePath();
  const vTailGeo = new THREE.ExtrudeGeometry(vTailShape, {
    depth: 0.03,
    bevelEnabled: true,
    bevelSize: 0.008,
    bevelThickness: 0.008,
  });
  vTailGeo.rotateY(Math.PI / 2);
  vTailGeo.translate(-0.015, 0.14, -1.04);
  group.add(new THREE.Mesh(vTailGeo, redMat));

  const bulletGeo = new THREE.CylinderGeometry(0.028, 0.022, 0.42, 14);
  bulletGeo.rotateX(Math.PI / 2);
  bulletGeo.translate(0, 0.89, -1.68);
  group.add(new THREE.Mesh(bulletGeo, bronzeMat));

  const hTailShape = new THREE.Shape();
  hTailShape.moveTo(0, 0.17);
  hTailShape.lineTo(0.66, -0.16);
  hTailShape.lineTo(0.66, -0.3);
  hTailShape.lineTo(0, -0.09);
  hTailShape.lineTo(-0.66, -0.3);
  hTailShape.lineTo(-0.66, -0.16);
  hTailShape.closePath();
  const hTailGeo = new THREE.ExtrudeGeometry(hTailShape, { depth: 0.022, bevelEnabled: false });
  hTailGeo.rotateX(Math.PI / 2);
  hTailGeo.translate(0, 0.88, -1.62);
  group.add(new THREE.Mesh(hTailGeo, fuselageMat));

  // Rear Fuselage Pylons + Twin Pearl 700 Turbofan Nacelles
  for (const dir of [-1, 1]) {
    const pylonGeo = new THREE.BoxGeometry(0.14, 0.025, 0.36);
    pylonGeo.rotateZ(dir * 0.18);
    pylonGeo.translate(dir * 0.22, 0.1, -0.88);
    group.add(new THREE.Mesh(pylonGeo, bellyMat));

    const nacGroup = new THREE.Group();
    const nacGeo = new THREE.CylinderGeometry(0.112, 0.095, 0.64, 24);
    nacGeo.rotateX(Math.PI / 2);
    const nac = new THREE.Mesh(nacGeo, fuselageMat);

    const intakeGeo = new THREE.TorusGeometry(0.105, 0.015, 14, 28);
    const intake = new THREE.Mesh(intakeGeo, chromeMat);
    intake.position.z = 0.32;

    const rotorGroup = new THREE.Group();
    const spinnerGeo = new THREE.ConeGeometry(0.032, 0.07, 14);
    spinnerGeo.rotateX(Math.PI / 2);
    rotorGroup.add(new THREE.Mesh(spinnerGeo, bronzeMat));
    for (let b = 0; b < 14; b++) {
      const bladeGeo = new THREE.BoxGeometry(0.016, 0.092, 0.006);
      bladeGeo.translate(0, 0.048, 0);
      const blade = new THREE.Mesh(bladeGeo, chromeMat);
      blade.rotation.z = (b / 14) * Math.PI * 2;
      blade.rotation.y = 0.35;
      rotorGroup.add(blade);
    }
    rotorGroup.position.z = 0.29;
    rotorsOut.push(rotorGroup);

    const exhaustNozzleGeo = new THREE.CylinderGeometry(0.092, 0.076, 0.14, 20);
    exhaustNozzleGeo.rotateX(Math.PI / 2);
    exhaustNozzleGeo.translate(0, 0, -0.35);
    const exhaustNozzle = new THREE.Mesh(exhaustNozzleGeo, bronzeMat);

    const exhaustCore = new THREE.Mesh(new THREE.SphereGeometry(0.068, 12, 12), exhaustGlowMat);
    exhaustCore.position.z = -0.36;

    nacGroup.add(nac, intake, rotorGroup, exhaustNozzle, exhaustCore);
    nacGroup.position.set(dir * 0.33, 0.12, -0.86);
    group.add(nacGroup);
  }

  group.scale.setScalar(0.84);
  return group;
}

/**
 * Stage 03: High-Detail Wide-Body Flagship Passenger Airliner (Airbus A350-1000 / 787)
 */
function createPassengerJet(rotorsOut: THREE.Object3D[]): THREE.Group {
  const group = new THREE.Group();

  const fuselageMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#fcf8f0"),
    roughness: 0.15,
    metalness: 0.25,
  });

  const wingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#efe6d5"),
    roughness: 0.24,
    metalness: 0.24,
  });

  const redLiveryMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#bb3028"),
    roughness: 0.18,
    metalness: 0.32,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#d4a56a"),
    roughness: 0.22,
    metalness: 0.76,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#ece7df"),
    roughness: 0.12,
    metalness: 0.9,
  });

  const windowGlowMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#ffe2a6"),
  });

  const cockpitMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#141c24"),
    roughness: 0.06,
    metalness: 0.92,
  });

  const lathePoints: THREE.Vector2[] = [
    new THREE.Vector2(0.001, -2.45),
    new THREE.Vector2(0.055, -2.32),
    new THREE.Vector2(0.14, -1.98),
    new THREE.Vector2(0.23, -1.52),
    new THREE.Vector2(0.295, -0.95),
    new THREE.Vector2(0.305, 0.0),
    new THREE.Vector2(0.305, 1.05),
    new THREE.Vector2(0.28, 1.48),
    new THREE.Vector2(0.22, 1.84),
    new THREE.Vector2(0.135, 2.12),
    new THREE.Vector2(0.055, 2.29),
    new THREE.Vector2(0.001, 2.36),
  ];
  const bodyGeo = new THREE.LatheGeometry(lathePoints, 40);
  bodyGeo.rotateX(Math.PI / 2);
  const body = new THREE.Mesh(bodyGeo, fuselageMat);
  body.scale.set(0.98, 1.04, 1.0);
  group.add(body);

  const apuGeo = new THREE.CylinderGeometry(0.018, 0.042, 0.16, 16);
  apuGeo.rotateX(Math.PI / 2);
  apuGeo.translate(0, 0.01, -2.42);
  group.add(new THREE.Mesh(apuGeo, chromeMat));

  const bellyFairingGeo = new THREE.SphereGeometry(0.31, 28, 20);
  bellyFairingGeo.scale(1.06, 0.48, 3.6);
  bellyFairingGeo.translate(0, -0.14, 0.08);
  group.add(new THREE.Mesh(bellyFairingGeo, wingMat));

  const wifiDomeGeo = new THREE.SphereGeometry(0.058, 16, 12);
  wifiDomeGeo.scale(0.65, 0.45, 2.8);
  wifiDomeGeo.translate(0, 0.315, 0.45);
  group.add(new THREE.Mesh(wifiDomeGeo, fuselageMat));

  const cheatlineGeo = new THREE.BoxGeometry(0.615, 0.028, 3.35);
  cheatlineGeo.translate(0, 0.015, -0.05);
  group.add(new THREE.Mesh(cheatlineGeo, redLiveryMat));

  const goldCheatGeo = new THREE.BoxGeometry(0.62, 0.015, 3.25);
  goldCheatGeo.translate(0, -0.012, -0.05);
  group.add(new THREE.Mesh(goldCheatGeo, goldMat));

  // 22 Illuminated Cabin Windows per side
  for (const side of [-1, 1]) {
    for (let i = 0; i < 22; i++) {
      if (i === 7 || i === 15) continue;
      const winGeo = new THREE.BoxGeometry(0.022, 0.036, 0.046);
      winGeo.translate(side * 0.298, 0.078, 1.28 - i * 0.125);
      group.add(new THREE.Mesh(winGeo, windowGlowMat));
    }
  }

  // Wrap-around A350 Cockpit Mask Window
  const maskGeo = new THREE.SphereGeometry(0.24, 24, 16);
  maskGeo.scale(1.02, 0.5, 1.55);
  maskGeo.translate(0, 0.105, 1.68);
  group.add(new THREE.Mesh(maskGeo, cockpitMat));

  // Swept High-Aspect-Ratio Main Wings
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0.62);
  wingShape.lineTo(2.58, -0.58);
  wingShape.lineTo(2.72, -0.84);
  wingShape.lineTo(2.44, -0.88);
  wingShape.lineTo(0.55, -0.36);
  wingShape.lineTo(0, -0.32);
  wingShape.lineTo(-0.55, -0.36);
  wingShape.lineTo(-2.44, -0.88);
  wingShape.lineTo(-2.72, -0.84);
  wingShape.lineTo(-2.58, -0.58);
  wingShape.closePath();

  const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
    depth: 0.046,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  });
  wingGeo.rotateX(Math.PI / 2);
  wingGeo.translate(0, -0.05, 0.2);
  group.add(new THREE.Mesh(wingGeo, wingMat));

  // Curved A350 Sharklet Wingtips
  for (const dir of [-1, 1]) {
    const tipGeo = new THREE.BoxGeometry(0.032, 0.42, 0.36);
    tipGeo.rotateZ(dir * -0.34);
    tipGeo.rotateX(0.26);
    tipGeo.translate(dir * 2.6, 0.12, -0.68);
    group.add(new THREE.Mesh(tipGeo, redLiveryMat));
  }

  // Flagship Vertical Tail Fin
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(-0.64, 1.02);
  finShape.lineTo(-1.08, 1.02);
  finShape.lineTo(-0.68, 0);
  finShape.closePath();
  const finGeo = new THREE.ExtrudeGeometry(finShape, {
    depth: 0.042,
    bevelEnabled: true,
    bevelSize: 0.01,
    bevelThickness: 0.01,
  });
  finGeo.rotateY(Math.PI / 2);
  finGeo.translate(-0.021, 0.2, -1.24);
  group.add(new THREE.Mesh(finGeo, redLiveryMat));

  // Horizontal Stabilizers
  const hStabShape = new THREE.Shape();
  hStabShape.moveTo(0, 0.22);
  hStabShape.lineTo(0.96, -0.26);
  hStabShape.lineTo(0.96, -0.48);
  hStabShape.lineTo(0, -0.15);
  hStabShape.lineTo(-0.96, -0.48);
  hStabShape.lineTo(-0.96, -0.26);
  hStabShape.closePath();
  const hStabGeo = new THREE.ExtrudeGeometry(hStabShape, { depth: 0.028, bevelEnabled: false });
  hStabGeo.rotateX(Math.PI / 2);
  hStabGeo.translate(0, 0.1, -1.78);
  group.add(new THREE.Mesh(hStabGeo, fuselageMat));

  // 4 Underwing High-Bypass Turbofan Engines on Forward Pylons
  const enginePositions = [
    { x: -0.84, y: -0.15, z: 0.24, scale: 1.06 },
    { x: 0.84, y: -0.15, z: 0.24, scale: 1.06 },
    { x: -1.56, y: -0.13, z: -0.1, scale: 0.9 },
    { x: 1.56, y: -0.13, z: -0.1, scale: 0.9 },
  ];

  for (const pos of enginePositions) {
    const engGroup = new THREE.Group();

    const pylonGeo = new THREE.BoxGeometry(0.032, 0.14, 0.42);
    pylonGeo.rotateX(-0.18);
    pylonGeo.translate(0, 0.1, -0.06);
    engGroup.add(new THREE.Mesh(pylonGeo, wingMat));

    const cowlGeo = new THREE.CylinderGeometry(0.148, 0.125, 0.66, 28);
    cowlGeo.rotateX(Math.PI / 2);
    const cowl = new THREE.Mesh(cowlGeo, fuselageMat);

    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.017, 14, 28), chromeMat);
    lip.position.z = 0.33;

    const goldRing = new THREE.Mesh(new THREE.TorusGeometry(0.149, 0.008, 10, 28), goldMat);
    goldRing.position.z = 0.12;

    const rotorGroup = new THREE.Group();
    const spinnerGeo = new THREE.ConeGeometry(0.038, 0.085, 16);
    spinnerGeo.rotateX(Math.PI / 2);
    rotorGroup.add(new THREE.Mesh(spinnerGeo, goldMat));
    for (let b = 0; b < 18; b++) {
      const bladeGeo = new THREE.BoxGeometry(0.018, 0.125, 0.007);
      bladeGeo.translate(0, 0.064, 0);
      const blade = new THREE.Mesh(bladeGeo, chromeMat);
      blade.rotation.z = (b / 18) * Math.PI * 2;
      blade.rotation.y = 0.38;
      rotorGroup.add(blade);
    }
    rotorGroup.position.z = 0.29;
    rotorsOut.push(rotorGroup);

    const coreExhaustGeo = new THREE.ConeGeometry(0.075, 0.24, 18);
    coreExhaustGeo.rotateX(-Math.PI / 2);
    coreExhaustGeo.translate(0, 0, -0.38);
    const coreExhaust = new THREE.Mesh(coreExhaustGeo, chromeMat);

    const afterglow = new THREE.Mesh(new THREE.SphereGeometry(0.082, 12, 12), windowGlowMat);
    afterglow.position.z = -0.31;

    engGroup.add(cowl, lip, goldRing, rotorGroup, coreExhaust, afterglow);
    engGroup.position.set(pos.x, pos.y, pos.z);
    engGroup.scale.setScalar(pos.scale);
    group.add(engGroup);
  }

  group.scale.setScalar(0.68);
  return group;
}

export default function FlightStage({ enabled, onPoseChange }: FlightStageProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const poseCallbackRef = useRef(onPoseChange);
  poseCallbackRef.current = onPoseChange;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const cameraFov = 36;
    const cameraZ = 11.5;
    const camera = new THREE.PerspectiveCamera(
      cameraFov,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, cameraZ);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xfff5e4, 1.55);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff0d6, 2.9);
    sunLight.position.set(8, 12, 11);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xbb3028, 1.4);
    rimLight.position.set(-8, 4, 8);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xd9c3a5, 1.05);
    fillLight.position.set(0, -7, 6);
    scene.add(fillLight);

    const craftRig = new THREE.Group();
    craftRig.rotation.order = "YXZ";
    scene.add(craftRig);

    const spinningRotors: THREE.Object3D[] = [];
    const paperPlane = createPaperPlane();
    const privateJet = createPrivateJet(spinningRotors);
    const passengerJet = createPassengerJet(spinningRotors);

    craftRig.add(paperPlane, privateJet, passengerJet);

    // Invisible WebGL depth occluder disc positioned precisely over the 2D Earth DOM element.
    // Writes depth at z = 0 without writing any color.
    // When the aircraft is on the back arc (z < 0), fragments behind the disc fail depth test,
    // naturally hiding the plane behind the 2D Earth with sub-pixel GPU precision and ZERO CSS flicker!
    const occluderGeo = new THREE.CircleGeometry(1, 48);
    const occluderMat = new THREE.MeshBasicMaterial({
      colorWrite: false,
      depthWrite: true,
    });
    const occluder = new THREE.Mesh(occluderGeo, occluderMat);
    occluder.renderOrder = -1;
    occluder.visible = false;
    scene.add(occluder);

    const buildFlightCurve = (isMobile: boolean) => {
      const xMul = isMobile ? 0.45 : 1.0;
      return new THREE.CatmullRomCurve3(
        [
          // 0: Enters from the left of the Hero on loading
          new THREE.Vector3(-3.4 * xMul, 0.95, 1.2),
          // 1: Swoops across hero title
          new THREE.Vector3(0.25 * xMul, 0.65, 1.6),
          // 2: Across coastal window
          new THREE.Vector3(2.55 * xMul, 0.15, 2.0),
          // 3: Services Card 1 (dives behind)
          new THREE.Vector3(-2.65 * xMul, -0.05, -1.4),
          // 4: Services Card 2 (swoops in front)
          new THREE.Vector3(2.45 * xMul, -0.08, 2.0),
          // 5: Services Card 3 (dives behind)
          new THREE.Vector3(-2.45 * xMul, 0.05, -1.2),
          // 6: Approach to Globe (tangent to left limb of Earth)
          new THREE.Vector3(-1.85 * xMul, 0.05, 0.8),
          new THREE.Vector3(1.15 * xMul, 0.0, 1.4),
          // 7: Story section exit (behind Catalina photo on left)
          new THREE.Vector3(-2.45 * xMul, 0.06, -1.3),
          // 8: Feelings section
          new THREE.Vector3(2.35 * xMul, -0.08, 1.8),
          // 9: Journal dispatch
          new THREE.Vector3(-2.25 * xMul, 0.02, -1.1),
          // 10: Closing section
          new THREE.Vector3(1.15 * xMul, -0.15, 1.6),
          // 11 & 12: Fly completely OFF the screen at the bottom footer
          new THREE.Vector3(3.85 * xMul, 0.85, 0.5),
          new THREE.Vector3(9.2 * xMul, 3.2, -3.5),
        ],
        false,
        "catmullrom",
        0.5
      );
    };

    let flightCurve = buildFlightCurve(window.innerWidth < 820);

    const sampleScale = (isMobile: boolean, zPos: number): number => {
      // Elegant, refined scale without excessive ballooning
      const base = isMobile ? 0.35 : 0.46;
      const zFactor = 1.0 + THREE.MathUtils.clamp(zPos * 0.022, -0.07, 0.07);
      return base * zFactor;
    };

    let targetScrollT = 0;
    let smoothScrollT = 0;
    let scrollVelocity = 0;
    let pointerX = 0;
    let pointerY = 0;
    let lastPoseEmit = 0;
    let lastBehindGlobe = false;

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

    const smoothstep = (edge0: number, edge1: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    };

    let rafId = 0;
    const clock = new THREE.Clock();
    const targetQuat = new THREE.Quaternion();
    const rotMatrix = new THREE.Matrix4();
    const worldUp = new THREE.Vector3(0, 1, 0);
    const rightVec = new THREE.Vector3();
    const upVec = new THREE.Vector3();
    const forwardHeading = new THREE.Vector3();
    let smoothScrollDir = 1.0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      if (!enabledRef.current) {
        return;
      }

      const elapsed = clock.getElapsedTime();
      const introFactor = reducedMotion ? 1 : smoothstep(0, 1.4, elapsed);

      for (const rotor of spinningRotors) {
        rotor.rotation.z = elapsed * 18;
      }

      const deltaT = targetScrollT - smoothScrollT;
      smoothScrollT += deltaT * (reducedMotion ? 0.25 : 0.085);
      scrollVelocity = deltaT * 100;

      // Smoothly detect scroll direction with hysteresis:
      if (deltaT > 0.0002) {
        smoothScrollDir += (1.0 - smoothScrollDir) * 0.12;
      } else if (deltaT < -0.0002) {
        smoothScrollDir += (-1.0 - smoothScrollDir) * 0.12;
      }

      const t = Math.min(0.999, Math.max(0.001, smoothScrollT));
      const isMobile = window.innerWidth < 820;

      const dtStep = 0.016;
      const pos = flightCurve.getPointAt(t);
      const nextPos = flightCurve.getPointAt(Math.min(1, t + dtStep));
      const prevPos = flightCurve.getPointAt(Math.max(0, t - dtStep));

      // Pinned 2D Earth Globe Orbit Tracking:
      // When the user reaches the #globe section, the section is pinned/sticky.
      // As the user scrolls through the pin distance, the aircraft completes
      // EXACTLY TWO FULL REVOLUTIONS (4 * Math.PI) around the 2D Earth DOM element,
      // seamlessly diving behind the Earth horizon (masked by WebGL depth occluder)
      // and re-emerging on the front sweep!
      let globeBlend = 0;
      let orbitAngle = 0;
      let inPin = false;

      const globeTrack = document.getElementById("globe");
      const earthEl = document.getElementById("earth-disc-target");

      if (globeTrack && earthEl) {
        const trackRect = globeTrack.getBoundingClientRect();
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const pinDistance = globeTrack.offsetHeight - vh;

        if (trackRect.top > 0 && trackRect.top < vh * 0.75) {
          // Approaching the globe from Services
          const approach = 1 - trackRect.top / (vh * 0.75);
          globeBlend = smoothstep(0, 1, approach);
          orbitAngle = 0;
        } else if (trackRect.top <= 0 && trackRect.top >= -pinDistance) {
          // PINNED! Pinned on that section while executing EXACTLY two revolutions!
          globeBlend = 1.0;
          inPin = true;
          const globeProgress = pinDistance > 0 ? -trackRect.top / pinDistance : 0;
          // Two complete revolutions: progress 0..1 maps to 0..4*PI (720 degrees)
          orbitAngle = globeProgress * Math.PI * 4;
        } else if (trackRect.top < -pinDistance && -trackRect.top - pinDistance < vh * 0.75) {
          // Departing the pinned section towards Story
          const depart = (-trackRect.top - pinDistance) / (vh * 0.75);
          globeBlend = 1 - smoothstep(0, 1, depart);
          orbitAngle = Math.PI * 4;
        }

        if (globeBlend > 0.001) {
          const earthRect = earthEl.getBoundingClientRect();
          const earthCenterX = earthRect.left + earthRect.width * 0.5;
          const earthCenterY = earthRect.top + earthRect.height * 0.5;

          const worldH = 2 * cameraZ * Math.tan((cameraFov * Math.PI) / 360);
          const worldW = worldH * (vw / vh);

          const earthWorldX = (earthCenterX / vw - 0.5) * worldW;
          const earthWorldY = (0.5 - earthCenterY / vh) * worldH;
          const earthRadiusWorld = ((earthRect.width * 0.5) / vh) * worldH;

          // Position the invisible WebGL Depth Occluder disc exactly over the 2D Earth:
          // Any plane pixels at z < 0 behind this disc are natively discarded by GPU depth testing!
          occluder.visible = true;
          occluder.position.set(earthWorldX, earthWorldY, 0);
          occluder.scale.setScalar(earthRadiusWorld * 0.985);

          // 3D Orbital path around the 2D Earth:
          const rx = earthRadiusWorld * (isMobile ? 1.25 : 1.32);
          const ry = earthRadiusWorld * (isMobile ? 0.44 : 0.46);
          const tiltAngle = -0.28; // -16 deg tilt to match decorative compass ring
          const orbitZAmplitude = 2.4;

          const cosA = Math.cos(orbitAngle);
          const sinA = Math.sin(orbitAngle);

          // Local elliptical coordinates (orbit starts on left limb at angle = 0):
          const lx = -cosA * rx;
          const ly = sinA * ry;

          const cosT = Math.cos(tiltAngle);
          const sinT = Math.sin(tiltAngle);

          const orbitX = earthWorldX + (lx * cosT - ly * sinT);
          const orbitY = earthWorldY + (lx * sinT + ly * cosT);
          // Z depth: sinA > 0 is front arc (in front of 2D Earth), sinA < 0 is back arc (behind 2D Earth)
          const orbitZ = sinA * orbitZAmplitude;

          const orbitPos = new THREE.Vector3(orbitX, orbitY, orbitZ);

          // Compute forward lookahead for smooth heading:
          const dAngle = 0.06;
          const nextA = orbitAngle + dAngle;
          const nextCosA = Math.cos(nextA);
          const nextSinA = Math.sin(nextA);
          const nextLX = -nextCosA * rx;
          const nextLY = nextSinA * ry;
          const nextOrbitX = earthWorldX + (nextLX * cosT - nextLY * sinT);
          const nextOrbitY = earthWorldY + (nextLX * sinT + nextLY * cosT);
          const nextOrbitZ = nextSinA * orbitZAmplitude;
          const nextOrbitPos = new THREE.Vector3(nextOrbitX, nextOrbitY, nextOrbitZ);

          const prevA = orbitAngle - dAngle;
          const prevCosA = Math.cos(prevA);
          const prevSinA = Math.sin(prevA);
          const prevLX = -prevCosA * rx;
          const prevLY = prevSinA * ry;
          const prevOrbitX = earthWorldX + (prevLX * cosT - prevLY * sinT);
          const prevOrbitY = earthWorldY + (prevLX * sinT + prevLY * cosT);
          const prevOrbitZ = prevSinA * orbitZAmplitude;
          const prevOrbitPos = new THREE.Vector3(prevOrbitX, prevOrbitY, prevOrbitZ);

          pos.lerp(orbitPos, globeBlend);
          nextPos.lerp(nextOrbitPos, globeBlend);
          prevPos.lerp(prevOrbitPos, globeBlend);
        } else {
          occluder.visible = false;
        }
      } else {
        occluder.visible = false;
      }

      // Smooth entrance on page load from the left side of the hero
      const introOffsetX = (1 - introFactor) * -5.5;
      const introOffsetY = (1 - introFactor) * 0.4;

      const floatY = reducedMotion ? 0 : Math.sin(elapsed * 2.1) * 0.04;
      const floatX = reducedMotion ? 0 : Math.cos(elapsed * 1.5) * 0.03;

      craftRig.position.set(
        pos.x + introOffsetX + floatX + pointerX * 0.12,
        pos.y + introOffsetY + floatY + pointerY * 0.1,
        pos.z
      );

      // Determine heading based on scroll direction:
      // If scrolling down, face forward along trajectory.
      // If scrolling up, face backward along trajectory towards the direction of scroll.
      const headingFwd = new THREE.Vector3().copy(nextPos).sub(pos);
      const headingBack = new THREE.Vector3().copy(prevPos).sub(pos);

      if (smoothScrollDir >= 0) {
        forwardHeading.copy(headingFwd);
      } else {
        forwardHeading.copy(headingBack);
      }

      forwardHeading.x += pointerX * 0.12;
      forwardHeading.y += pointerY * 0.08;
      forwardHeading.normalize();

      // Realistic aerodynamic banking roll into turns:
      const curvature = (nextPos.x - pos.x) - (pos.x - prevPos.x);
      let bankRoll = THREE.MathUtils.clamp(-curvature * 7.5 - pointerX * 0.15, -0.65, 0.65);

      if (globeBlend > 0.1) {
        const orbitBank = Math.cos(orbitAngle) * -0.36;
        bankRoll = THREE.MathUtils.lerp(bankRoll, orbitBank, globeBlend);
      }

      if (forwardHeading.lengthSq() > 0.001) {
        rightVec.crossVectors(forwardHeading, worldUp).normalize();
        if (rightVec.lengthSq() < 0.001) {
          rightVec.set(1, 0, 0);
        }
        upVec.crossVectors(rightVec, forwardHeading).normalize();

        if (Math.abs(bankRoll) > 0.001) {
          rightVec.applyAxisAngle(forwardHeading, bankRoll);
          upVec.applyAxisAngle(forwardHeading, bankRoll);
        }

        rotMatrix.makeBasis(rightVec, upVec, forwardHeading);
        targetQuat.setFromRotationMatrix(rotMatrix);
        craftRig.quaternion.slerp(targetQuat, reducedMotion ? 0.25 : 0.09);
      }

      const targetScale = sampleScale(isMobile, pos.z);
      craftRig.scale.setScalar(targetScale);

      // 3-Stage Morph Weights
      const m1 = smoothstep(0.2, 0.3, t);
      const m2 = smoothstep(0.64, 0.76, t);

      const wPaper = 1 - m1;
      const wPrivate = m1 * (1 - m2);
      const wPassenger = m2;

      paperPlane.visible = wPaper > 0.01;
      privateJet.visible = wPrivate > 0.01;
      passengerJet.visible = wPassenger > 0.01;

      paperPlane.scale.setScalar(Math.max(0.001, wPaper));
      privateJet.scale.setScalar(Math.max(0.001, wPrivate * 0.84));
      passengerJet.scale.setScalar(Math.max(0.001, wPassenger * 0.68));

      renderer.render(scene, camera);

      const behindGlobe = pos.z < 0;
      const stageIndex: 0 | 1 | 2 = t < 0.28 ? 0 : t < 0.65 ? 1 : 2;

      const now = performance.now();
      if (
        poseCallbackRef.current &&
        now - lastPoseEmit > 250
      ) {
        lastBehindGlobe = behindGlobe;
        lastPoseEmit = now;
        poseCallbackRef.current({
          progress: t,
          stageIndex,
          behindGlobe,
          globeOrbitProgress: inPin ? orbitAngle / (Math.PI * 4) : 0,
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

  return (
    <div
      ref={mountRef}
      className={`flight-stage ${enabled ? "flight-stage--active" : "flight-stage--hidden"}`}
      aria-hidden="true"
    />
  );
}
