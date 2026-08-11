/* eslint-disable */
// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { REGION_FACES } from '../../data/regions';

/** Approximate lat/lon for region facing (visual only) */
const REGION_LATLON = {
  'east-asia': [35, 110],
  'se-asia': [8, 115],
  'south-asia': [22, 78],
  'west-asia': [28, 45],
  'central-asia': [42, 68],
  'far-east': [45, 145],
  'w-europe': [48, 5],
  'e-europe': [50, 30],
  'n-europe': [62, 15],
  'eurasia-n': [65, 90],
  'africa-n': [28, 15],
  'africa-e': [0, 35],
  'africa-s': [-25, 25],
  'africa-w': [8, 0],
  'na-e': [40, -75],
  'na-w': [40, -120],
  caribbean: [18, -75],
  's-america': [-15, -60],
  australia: [-25, 135],
  pacific: [-10, 170],
};

function latLonToDir(lat, lon) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta)
  ).normalize();
}

function faceQuatForRegion(face) {
  const pair = REGION_LATLON[face?.id] || [20, 100];
  const dir = latLonToDir(pair[0], pair[1]);
  return new THREE.Quaternion().setFromUnitVectors(dir, new THREE.Vector3(0, 0, 1));
}

const EarthDie = ({ spinning, targetFace, onSpinComplete, highlighted }) => {
  const mountRef = useRef(null);
  const apiRef = useRef(null);
  const completeRef = useRef(onSpinComplete);
  completeRef.current = onSpinComplete;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 640;
    const height = mount.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020617');
    // no fog — keep pure uniform space

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor(0x020617, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const sun = new THREE.DirectionalLight(0xfff0d0, 1.2);
    sun.position.set(5, 3, 4);
    scene.add(sun);
    const blue = new THREE.PointLight(0x6aa8ff, 0.4);
    blue.position.set(-4, -1, 2);
    scene.add(blue);

    // --- Stars ---
    const starCount = 700;
    const starPos = new Float32Array(starCount * 3);
    const starPhase = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 40;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 24 - 6;
      starPhase[i] = Math.random() * Math.PI * 2;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xf5f0e0,
      size: 0.035,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // --- Earth group ---
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const earthGeo = new THREE.SphereGeometry(1.28, 64, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x7ec8ff,
      roughness: 0.72,
      metalness: 0.05,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earth);

    const loader = new THREE.TextureLoader();
    loader.load(`/brand/cartoon-earth.png?v=2`, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy?.() || 1);
      earthMat.map = tex;
      earthMat.color.set(0xffffff);
      earthMat.needsUpdate = true;
    });

    // Very subtle atmosphere rim (not a green/muddy slab)
    const atmos = new THREE.Mesh(
      new THREE.SphereGeometry(1.35, 48, 32),
      new THREE.MeshBasicMaterial({
        color: 0xb8e0ff,
        transparent: true,
        opacity: 0.06,
        side: THREE.BackSide,
      })
    );
    earthGroup.add(atmos);

    // Light cloud veil — keep map readable
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 512;
    cloudCanvas.height = 256;
    const ctx = cloudCanvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 256);
    for (let i = 0; i < 35; i++) {
      const x = Math.random() * 512;
      const y = 40 + Math.random() * 176;
      const r = 16 + Math.random() * 40;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,0.22)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    const cloudTex = new THREE.CanvasTexture(cloudCanvas);
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.305, 48, 32),
      new THREE.MeshStandardMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        roughness: 1,
      })
    );
    earthGroup.add(clouds);

    // Highlight ring only (no huge tinted glow slab)
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.48, 0.022, 12, 72),
      new THREE.MeshBasicMaterial({ color: 0xffe6a8, transparent: true, opacity: 0 })
    );
    scene.add(ring);

    // --- Meteors ---
    const meteors = [];
    const makeMeteor = () => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array([0, 0, 0, -1.2, -0.35, 0]);
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({
          color: 0xffe6a8,
          transparent: true,
          opacity: 0.9,
        })
      );
      line.position.set((Math.random() - 0.5) * 8, 3 + Math.random() * 2, -2 - Math.random() * 3);
      line.userData = {
        vel: new THREE.Vector3(-0.08 - Math.random() * 0.06, -0.05 - Math.random() * 0.04, 0.01),
        life: 0,
        max: 1.8 + Math.random(),
      };
      scene.add(line);
      meteors.push(line);
    };

    // --- UFO ---
    const ufo = new THREE.Group();
    const saucer = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 10),
      new THREE.MeshStandardMaterial({ color: 0xc0d4e8, metalness: 0.6, roughness: 0.35 })
    );
    saucer.scale.set(1.6, 0.35, 1.6);
    ufo.add(saucer);
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 12, 10),
      new THREE.MeshStandardMaterial({
        color: 0x7ef0c0,
        emissive: 0x2a8866,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.9,
      })
    );
    dome.position.y = 0.06;
    ufo.add(dome);
    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.45, 16, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x7ef0c0,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      })
    );
    beam.position.y = -0.28;
    beam.rotation.x = Math.PI;
    ufo.add(beam);
    ufo.visible = false;
    scene.add(ufo);

    let ufoTimer = 6 + Math.random() * 8;
    let ufoActive = false;
    let ufoT = 0;
    let meteorTimer = 2 + Math.random() * 3;

    apiRef.current = {
      earthGroup,
      clouds,
      spinning: false,
      targetFace: null,
      highlighted: false,
      ring,
      ringMat: ring.material,
      spin: {
        active: false,
        t: 0,
        duration: 1.55,
        startQuat: new THREE.Quaternion(),
        endQuat: new THREE.Quaternion(),
        completed: false,
      },
    };

    let frameId = 0;
    let last = performance.now();

    const tick = (now) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      const api = apiRef.current;
      if (!api) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      // Twinkle + clouds
      starMat.opacity = 0.65 + Math.sin(now * 0.002) * 0.25;
      stars.rotation.y += delta * 0.015;
      api.clouds.rotation.y += delta * 0.06;

      // Highlight: thin warm ring only (never fill canvas with region color)
      const want = api.highlighted ? 1 : 0;
      api.ringMat.opacity += (want * 0.85 - api.ringMat.opacity) * Math.min(1, delta * 5);
      if (api.highlighted) {
        const pulse = 0.92 + Math.sin(now * 0.008) * 0.08;
        api.ring.scale.setScalar(pulse);
        api.ringMat.color.set(0xffe6a8);
      }

      const s = api.spin;
      if (s.active) {
        s.t += delta;
        const p = Math.min(1, s.t / s.duration);
        const e = 1 - Math.pow(1 - p, 3);
        api.earthGroup.quaternion.slerpQuaternions(s.startQuat, s.endQuat, e);
        if (p >= 1 && !s.completed) {
          s.active = false;
          s.completed = true;
          api.earthGroup.quaternion.copy(s.endQuat);
          completeRef.current();
        }
      } else if (!api.spinning) {
        api.earthGroup.rotation.y += delta * 0.42;
        api.earthGroup.rotation.x = Math.sin(now * 0.00055) * 0.08;
      }

      // Meteors
      meteorTimer -= delta;
      if (meteorTimer <= 0) {
        makeMeteor();
        meteorTimer = 2.5 + Math.random() * 4;
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.userData.life += delta;
        m.position.addScaledVector(m.userData.vel, delta * 60);
        m.material.opacity = Math.max(0, 1 - m.userData.life / m.userData.max);
        if (m.userData.life >= m.userData.max) {
          scene.remove(m);
          m.geometry.dispose();
          m.material.dispose();
          meteors.splice(i, 1);
        }
      }

      // UFO fly-by
      ufoTimer -= delta;
      if (!ufoActive && ufoTimer <= 0) {
        ufoActive = true;
        ufoT = 0;
        ufo.visible = true;
        ufo.position.set(-5, 1.2 + Math.random() * 1.2, -1);
      }
      if (ufoActive) {
        ufoT += delta;
        const t = ufoT / 5.5;
        ufo.position.x = -5 + t * 11;
        ufo.position.y = 1.4 + Math.sin(t * Math.PI * 2) * 0.35;
        ufo.rotation.y = now * 0.002;
        ufo.rotation.z = Math.sin(now * 0.003) * 0.15;
        if (t >= 1) {
          ufoActive = false;
          ufo.visible = false;
          ufoTimer = 8 + Math.random() * 12;
        }
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 640;
      const h = mount.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      if (earthMat.map) earthMat.map.dispose();
      cloudTex.dispose();
      starGeo.dispose();
      starMat.dispose();
      meteors.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
      });
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
      apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    const api = apiRef.current;
    if (!api) return;
    api.spinning = spinning;
    api.targetFace = targetFace;
    api.highlighted = Boolean(highlighted);

    if (!spinning || !targetFace) return;

    const facing = faceQuatForRegion(targetFace);
    const extra = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        Math.PI * 2 * (5 + Math.random() * 3),
        Math.PI * 2 * (6 + Math.random() * 3),
        Math.PI * 2 * (2 + Math.random() * 2)
      )
    );

    api.earthGroup.rotation.set(0, 0, 0);
    api.spin = {
      active: true,
      t: 0,
      duration: 1.55,
      startQuat: api.earthGroup.quaternion.clone(),
      endQuat: extra.clone().multiply(facing),
      completed: false,
    };
  }, [spinning, targetFace, highlighted]);

  return <div className="earth-die-canvas" ref={mountRef} />;
};

export default EarthDie;
