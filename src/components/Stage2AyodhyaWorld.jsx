import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles as DreiSparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sun, Moon, Sparkles, Compass, Flame, Music, Landmark, Waves } from 'lucide-react';

import {
  IndianCitizen,
  RoyalElephant,
  RoyalChariot,
  RangoliMandala,
  GroundCrackerFX,
  AerialFireworksFX,
} from './ayodhya3d/AyodhyaActors';
import {
  ToranaGate,
  GrandPalaceBuilding,
  GrandTempleMandir,
  BazaarStall,
  SarayuRiverAndGhats,
  InstancedKingdomDiyas,
} from './ayodhya3d/AyodhyaArchitecture';

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  {
    id: 0,
    title: 'I. The Royal Torana Gate & Rajpath',
    subtitle:
      'Enter prosperous ancient Ayodhya adorned with golden silk banners, marigold torans, and carved sandstone palaces.',
    range: [0, 0.16],
  },
  {
    id: 1,
    title: 'II. Courtyards of Light — Diyas & Rangolis',
    subtitle:
      'Families gather on verandas lighting rows of earthen diyas while decorating courtyards with sacred mandala rangolis and flower garlands.',
    range: [0.16, 0.34],
  },
  {
    id: 2,
    title: 'III. Joyful Crackers & Sweet Exchanges',
    subtitle:
      'Neighbours warmly exchange brass thalis of Laddoos and Gujiyas while children joyfully burst flowerpots (Anar), spinning Chakris, and sparklers.',
    range: [0.34, 0.54],
  },
  {
    id: 3,
    title: 'IV. Royal Bazaar, Elephants, Chariots & Dancers',
    subtitle:
      'Bustling market stalls, caparisoned elephants with golden howdahs, royal chariots, dhol drummers, and classical dancers fill the avenue.',
    range: [0.54, 0.72],
  },
  {
    id: 4,
    title: 'V. Grand Temple & Auspicious Maha Aarti',
    subtitle:
      'Beneath the towering Nagara Shikhara and ringing brass bells, priests perform Maha Aarti amidst devotional prayers.',
    range: [0.72, 0.87],
  },
  {
    id: 5,
    title: 'VI. Sarayu Riverfront Ghats & Imperial Panorama',
    subtitle:
      'Thousands of floating Deepdaan diyas and aerial fireworks shimmer across the sacred waters of the Sarayu River.',
    range: [0.87, 1.0],
  },
];

/**
 * Scroll-Driven Cinematic Camera Controller along a 3D CatmullRom Spline
 */
function AyodhyaCameraRig({ scrollProgressRef }) {
  const { camera } = useThree();

  // Camera position & lookAt spline keyframes through Ayodhya
  const { posCurve, lookCurve } = useMemo(() => {
    const posPoints = [
      new THREE.Vector3(0, 5.2, 27),     // 0.00: Front of Royal Torana Gate
      new THREE.Vector3(-4.2, 3.4, 8),   // 0.18: Sweeping toward Left Courtyard (Diyas & Rangoli)
      new THREE.Vector3(4.5, 3.2, -9),   // 0.36: Sweeping toward Right Courtyard (Sweets & Children's Crackers)
      new THREE.Vector3(-2.5, 4.8, -28), // 0.56: Bustling Royal Bazaar, Elephants, Chariots & Dancers
      new THREE.Vector3(0, 5.5, -47),    // 0.76: Grand Temple Sanctum & Maha Aarti
      new THREE.Vector3(0, 7.5, -76),    // 0.90: Approaching Sarayu Riverfront Ghats
      new THREE.Vector3(0, 12.5, -83),   // 1.00: Grand Golden Panorama over Sarayu River & Imperial Ayodhya
    ];

    const lookPoints = [
      new THREE.Vector3(0, 4.5, 5),      // Looking through Torana Gate
      new THREE.Vector3(-8.5, 1.8, 1),   // Looking closely at families lighting diyas & rangoli
      new THREE.Vector3(7.5, 1.6, -15),  // Looking at sweet exchange & children bursting Anar/Chakri
      new THREE.Vector3(1.5, 2.8, -36),  // Looking at Royal Elephant, Chariot, Musicians & Bazaar
      new THREE.Vector3(0, 6.5, -62),    // Looking up at Grand Temple Shikhara & Priests' Aarti
      new THREE.Vector3(0, 2.0, -102),   // Looking across Sarayu Ghats & floating diyas
      new THREE.Vector3(0, 6.0, -118),   // Looking out at the illuminated river & fireworks horizon
    ];

    return {
      posCurve: new THREE.CatmullRomCurve3(posPoints),
      lookCurve: new THREE.CatmullRomCurve3(lookPoints),
    };
  }, []);

  const currentPos = useRef(new THREE.Vector3(0, 5.2, 27));
  const currentLook = useRef(new THREE.Vector3(0, 4.5, 5));

  useFrame((state, delta) => {
    const t = THREE.MathUtils.clamp(scrollProgressRef.current, 0, 1);
    const targetPos = posCurve.getPointAt(t);
    const targetLook = lookCurve.getPointAt(t);

    // Subtle breathing handheld cinematic float
    const breathX = Math.sin(state.clock.elapsedTime * 0.8) * 0.18;
    const breathY = Math.cos(state.clock.elapsedTime * 1.1) * 0.1;

    currentPos.current.lerp(
      new THREE.Vector3(targetPos.x + breathX, targetPos.y + breathY, targetPos.z),
      Math.min(1, delta * 4.5)
    );
    currentLook.current.lerp(targetLook, Math.min(1, delta * 5.0));

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLook.current);
  });

  return null;
}

/**
 * Full 3D Ancient Ayodhya World Scene
 */
function AyodhyaScene({ isNight, scrollProgressRef }) {
  return (
    <>
      {/* Dynamic Atmosphere, Fog & Sky */}
      <color attach="background" args={[isNight ? '#081021' : '#eab676']} />
      <fogExp2 attach="fog" args={[isNight ? '#091326' : '#e6b87d', isNight ? 0.0085 : 0.007]} />

      {/* Dynamic Day / Night Lighting */}
      <ambientLight
        color={isNight ? '#3b4f7a' : '#fff3d6'}
        intensity={isNight ? 0.65 : 1.55}
      />
      <directionalLight
        position={isNight ? [-25, 45, -30] : [35, 55, 25]}
        color={isNight ? '#93c5fd' : '#fffbeb'}
        intensity={isNight ? 0.85 : 2.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Warm Golden Fill Light along the Rajpath Avenue */}
      <hemisphereLight
        skyColor={isNight ? '#1e3a8a' : '#fef08a'}
        groundColor={isNight ? '#78350f' : '#b45309'}
        intensity={isNight ? 0.75 : 1.1}
      />

      {/* Celestial Sun (Day Mode) or Glowing Crescent Moon & Stars (Night Mode) */}
      {isNight ? (
        <>
          <Stars radius={120} depth={60} count={3500} factor={4} saturation={0.5} fade speed={1.2} />
          <group position={[0, 44, -135]}>
            <mesh>
              <sphereGeometry args={[6.5, 24, 24]} />
              <meshBasicMaterial color="#fef9c3" />
            </mesh>
            <pointLight color="#fde68a" intensity={15} distance={200} />
          </group>
        </>
      ) : (
        <group position={[18, 46, -125]}>
          <mesh>
            <sphereGeometry args={[9, 24, 24]} />
            <meshBasicMaterial color="#fffbeb" />
          </mesh>
          <mesh>
            <sphereGeometry args={[13, 24, 24]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.35} />
          </mesh>
        </group>
      )}

      {/* Floating Golden Festive Sparkles Throughout Ayodhya */}
      <DreiSparkles
        count={320}
        scale={[65, 22, 130]}
        position={[0, 8, -45]}
        size={isNight ? 4.5 : 3}
        speed={0.5}
        color="#fde047"
      />

      {/* Camera Spline Controller */}
      <AyodhyaCameraRig scrollProgressRef={scrollProgressRef} />

      {/* =====================================================================
          GROUND PAVEMENT: GRAND SANDSTONE RAJPATH AVENUE & COURTYARDS
      ===================================================================== */}
      <group>
        {/* Outer Terracotta & Garden Ground */}
        <mesh position={[0, -0.05, -35]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[140, 125]} />
          <meshStandardMaterial color={isNight ? '#3b1d0a' : '#854d27'} roughness={0.8} />
        </mesh>

        {/* Main Carved Sandstone Royal Avenue (Rajpath) */}
        <mesh position={[0, 0.01, -35]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[18, 120]} />
          <meshStandardMaterial
            color={isNight ? '#6b3e1e' : '#c68b59'}
            roughness={0.55}
            metalness={0.1}
          />
        </mesh>

        {/* Gold Inlaid Center Procession Strip */}
        <mesh position={[0, 0.02, -35]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[1.2, 118]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.75} roughness={0.25} />
        </mesh>
      </group>

      {/* =====================================================================
          CHAPTER 1 (Z = +18 to +4): ROYAL TORANA GATEWAY & WELCOME PROCESSION
      ===================================================================== */}
      <ToranaGate position={[0, 0, 16]} isNight={isNight} />

      {/* Welcome Citizens Performing Namaste at the Gate */}
      <IndianCitizen
        position={[-4.5, 0, 14]}
        rotation={[0, 0.5, 0]}
        attireColor="#dc2626"
        secondaryColor="#fbbf24"
        action="namaste"
        isNight={isNight}
      />
      <IndianCitizen
        position={[4.5, 0, 14]}
        rotation={[0, -0.5, 0]}
        attireColor="#059669"
        secondaryColor="#fbbf24"
        isFemale={false}
        hasTurban
        action="namaste"
        isNight={isNight}
      />
      <RangoliMandala position={[0, 0.03, 15]} scale={1.25} />

      {/* =====================================================================
          ROYAL PALACES & HAVELIS FLANKING RAJPATH (LEFT & RIGHT AVENUES)
      ===================================================================== */}
      {[
        { pos: [-16.5, 0, 4], rot: [0, Math.PI / 2, 0], floors: 3, wall: '#d97706' },
        { pos: [16.5, 0, 4], rot: [0, -Math.PI / 2, 0], floors: 3, wall: '#c26d2d' },
        { pos: [-17.5, 0, -14], rot: [0, Math.PI / 2, 0], floors: 2, wall: '#b45309' },
        { pos: [17.5, 0, -14], rot: [0, -Math.PI / 2, 0], floors: 2, wall: '#d97706' },
        { pos: [-18.5, 0, -34], rot: [0, Math.PI / 2, 0], floors: 3, wall: '#c26d2d' },
        { pos: [18.5, 0, -34], rot: [0, -Math.PI / 2, 0], floors: 3, wall: '#b45309' },
        // Grand Imperial Palaces flanking the Temple & Riverfront
        { pos: [-24, 0, -64], rot: [0, Math.PI / 3, 0], floors: 4, wall: '#d97706' },
        { pos: [24, 0, -64], rot: [0, -Math.PI / 3, 0], floors: 4, wall: '#d97706' },
      ].map((p, idx) => (
        <GrandPalaceBuilding
          key={idx}
          position={p.pos}
          rotation={p.rot}
          floors={p.floors}
          wallColor={p.wall}
          isNight={isNight}
        />
      ))}

      {/* =====================================================================
          CHAPTER 2 (Z = +4 to -8): FAMILIES LIGHTING DIYAS, RANGOLIS & GARLANDS
      ===================================================================== */}
      <group position={[-7.5, 0, 1]}>
        <RangoliMandala position={[0, 0.03, 0]} scale={1.45} />
        {/* Mother & Daughter decorating Rangoli & Lighting Diyas */}
        <IndianCitizen
          position={[-1.4, 0, 0.8]}
          rotation={[0, 1.1, 0]}
          attireColor="#e11d48"
          secondaryColor="#fde047"
          action="light_diya"
          phaseOffset={0.4}
          isNight={isNight}
        />
        <IndianCitizen
          position={[1.3, 0, -0.7]}
          rotation={[0, -2.1, 0]}
          attireColor="#7c3aed"
          secondaryColor="#fbbf24"
          action="rangoli"
          phaseOffset={1.2}
          isNight={isNight}
        />
        {/* Father & Elder watching and holding Diya tray */}
        <IndianCitizen
          position={[-2.1, 0, -1.2]}
          rotation={[0, 0.8, 0]}
          attireColor="#d97706"
          secondaryColor="#fef08a"
          isFemale={false}
          hasTurban
          action="offer_sweets"
          isNight={isNight}
        />
        <IndianCitizen
          position={[0.2, 0, 1.6]}
          rotation={[0, Math.PI, 0]}
          attireColor="#10b981"
          secondaryColor="#fbbf24"
          isChild
          action="sparkler"
          isNight={isNight}
        />
      </group>

      {/* =====================================================================
          CHAPTER 3 (Z = -10 to -22): NEIGHBOURS EXCHANGING SWEETS & CHILDREN BURSTING CRACKERS
      ===================================================================== */}
      <group position={[6.8, 0, -14]}>
        <RangoliMandala position={[0, 0.03, 0]} scale={1.3} />

        {/* Two Neighbour Couples Exchanging Traditional Indian Sweets & Savouries */}
        <IndianCitizen
          position={[-1.1, 0, -1.8]}
          rotation={[0, 1.5, 0]}
          attireColor="#b91c1c"
          secondaryColor="#fbbf24"
          action="offer_sweets"
          isNight={isNight}
        />
        <IndianCitizen
          position={[0.9, 0, -1.8]}
          rotation={[0, -1.5, 0]}
          attireColor="#2563eb"
          secondaryColor="#fde047"
          action="offer_sweets"
          phaseOffset={1.0}
          isNight={isNight}
        />
        <IndianCitizen
          position={[-1.4, 0, -2.9]}
          rotation={[0, 1.3, 0]}
          attireColor="#ea580c"
          secondaryColor="#fef08a"
          isFemale={false}
          hasTurban
          action="namaste"
          isNight={isNight}
        />
        <IndianCitizen
          position={[1.3, 0, -2.9]}
          rotation={[0, -1.3, 0]}
          attireColor="#047857"
          secondaryColor="#fbbf24"
          isFemale={false}
          hasTurban
          action="namaste"
          isNight={isNight}
        />

        {/* Children Joyfully Bursting Ground Crackers: Anar (Flowerpots), Chakri & Sparklers */}
        <GroundCrackerFX position={[-2.2, 0, 1.2]} type="anar" isNight={isNight} />
        <GroundCrackerFX position={[1.8, 0, 1.8]} type="anar" isNight={isNight} />
        <GroundCrackerFX position={[-0.2, 0, 2.5]} type="chakri" isNight={isNight} />

        <IndianCitizen
          position={[-3.4, 0, 1.5]}
          rotation={[0, 1.2, 0]}
          attireColor="#f43f5e"
          secondaryColor="#fde047"
          isChild
          action="sparkler"
          phaseOffset={0.5}
          isNight={isNight}
        />
        <IndianCitizen
          position={[3.1, 0, 1.4]}
          rotation={[0, -1.2, 0]}
          attireColor="#3b82f6"
          secondaryColor="#fbbf24"
          isFemale={false}
          isChild
          action="sparkler"
          phaseOffset={1.8}
          isNight={isNight}
        />
        <IndianCitizen
          position={[0.4, 0, 3.8]}
          rotation={[0, Math.PI, 0]}
          attireColor="#f59e0b"
          secondaryColor="#dc2626"
          isChild
          action="sparkler"
          phaseOffset={2.6}
          isNight={isNight}
        />
      </group>

      {/* Additional Ground Crackers on Left Courtyard for Balance */}
      <GroundCrackerFX position={[-5.2, 0, -16]} type="anar" isNight={isNight} />
      <GroundCrackerFX position={[-6.8, 0, -12]} type="chakri" isNight={isNight} />

      {/* =====================================================================
          CHAPTER 4 (Z = -24 to -44): BUSTLING ROYAL MARKETS, ELEPHANTS, CHARIOTS & MUSICIANS
      ===================================================================== */}
      <group position={[0, 0, -34]}>
        {/* Festive Royal Bazaar Stalls on Left & Right */}
        <BazaarStall
          position={[-10.2, 0, 4]}
          rotation={[0, Math.PI / 2, 0]}
          canopyColor="#dc2626"
          isNight={isNight}
        />
        <BazaarStall
          position={[-10.2, 0, -3]}
          rotation={[0, Math.PI / 2, 0]}
          canopyColor="#d97706"
          isNight={isNight}
        />
        <BazaarStall
          position={[10.2, 0, 4]}
          rotation={[0, -Math.PI / 2, 0]}
          canopyColor="#059669"
          isNight={isNight}
        />
        <BazaarStall
          position={[10.2, 0, -3]}
          rotation={[0, -Math.PI / 2, 0]}
          canopyColor="#7c3aed"
          isNight={isNight}
        />

        {/* Caparisoned Royal Elephants with Golden Howdahs */}
        <RoyalElephant position={[-3.8, 0, 1]} rotation={[0, 0, 0]} walkPath={2.2} />
        <RoyalElephant position={[4.5, 0, -5]} rotation={[0, Math.PI, 0]} walkPath={2.0} />

        {/* Ornate Royal Chariot */}
        <RoyalChariot position={[3.2, 0, 4.5]} rotation={[0, -0.15, 0]} />

        {/* Traditional Dhol Drummers & Classical Dancers in Festive Circle */}
        <RangoliMandala position={[0, 0.03, -2]} scale={1.5} />
        <IndianCitizen
          position={[-1.4, 0, -2]}
          rotation={[0, 1.5, 0]}
          attireColor="#d97706"
          secondaryColor="#dc2626"
          isFemale={false}
          hasTurban
          action="drum"
          isNight={isNight}
        />
        <IndianCitizen
          position={[1.4, 0, -2]}
          rotation={[0, -1.5, 0]}
          attireColor="#b91c1c"
          secondaryColor="#fbbf24"
          isFemale={false}
          hasTurban
          action="drum"
          phaseOffset={1.1}
          isNight={isNight}
        />
        <IndianCitizen
          position={[0, 0, -0.6]}
          rotation={[0, 0, 0]}
          attireColor="#e11d48"
          secondaryColor="#fde047"
          action="dance"
          isNight={isNight}
        />
        <IndianCitizen
          position={[0, 0, -3.4]}
          rotation={[0, Math.PI, 0]}
          attireColor="#8b5cf6"
          secondaryColor="#fbbf24"
          action="dance"
          phaseOffset={1.5}
          isNight={isNight}
        />
      </group>

      {/* =====================================================================
          CHAPTER 5 (Z = -48 to -74): MAGNIFICENT TEMPLE, PRIESTS PERFORMING MAHA AARTI & DEVOTEES
      ===================================================================== */}
      <GrandTempleMandir position={[0, 0, -64]} isNight={isNight} />

      {/* Priests Performing Synchronized Maha Aarti on the Temple Steps */}
      {[
        [-2.2, 1.8, -53.2],
        [0, 1.8, -53.2],
        [2.2, 1.8, -53.2],
      ].map((pp, idx) => (
        <IndianCitizen
          key={idx}
          position={pp}
          rotation={[0, 0, 0]}
          isFemale={false}
          isPriest
          action="aarti"
          phaseOffset={idx * 0.7}
          isNight={isNight}
        />
      ))}

      {/* Auspicious Gathering of Devotees Praying in front of Temple */}
      {[
        { pos: [-4.5, 0, -49], col: '#dc2626', fem: true },
        { pos: [-2.4, 0, -48], col: '#f59e0b', fem: false, turb: true },
        { pos: [2.4, 0, -48], col: '#10b981', fem: true },
        { pos: [4.5, 0, -49], col: '#3b82f6', fem: false, turb: true },
        { pos: [-3.5, 0, -46], col: '#9333ea', fem: true },
        { pos: [3.5, 0, -46], col: '#e11d48', fem: true },
      ].map((dev, i) => (
        <IndianCitizen
          key={i}
          position={dev.pos}
          rotation={[0, Math.PI, 0]}
          attireColor={dev.col}
          secondaryColor="#fbbf24"
          isFemale={dev.fem}
          hasTurban={dev.turb}
          action="namaste"
          phaseOffset={i * 0.5}
          isNight={isNight}
        />
      ))}

      {/* =====================================================================
          CHAPTER 6 (Z = -85 to -130): SARAYU RIVERFRONT GHATS, DEEPDAAN & AERIAL FIREWORKS
      ===================================================================== */}
      <SarayuRiverAndGhats position={[0, 0, -90]} isNight={isNight} />

      {/* Citizens on the Sarayu Ghats Offering Deepdaan Diyas & Aarti to the River */}
      {[
        [-8, -0.7, -92.5],
        [-4, -1.05, -93.8],
        [4, -1.05, -93.8],
        [8, -0.7, -92.5],
      ].map((gp, i) => (
        <IndianCitizen
          key={i}
          position={gp}
          rotation={[0, Math.PI, 0]}
          attireColor={i % 2 === 0 ? '#e11d48' : '#d97706'}
          secondaryColor="#fef08a"
          action={i % 2 === 0 ? 'light_diya' : 'aarti'}
          phaseOffset={i * 0.8}
          isNight={isNight}
        />
      ))}

      {/* 1,800+ Instanced Glowing Diyas Across the Entire Kingdom & River */}
      <InstancedKingdomDiyas isNight={isNight} />

      {/* Night Sky Aerial Fireworks Explosions */}
      <AerialFireworksFX isNight={isNight} />
    </>
  );
}

export default function Stage2AyodhyaWorld() {
  const sectionRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  // Allow user to toggle Day/Night manually, or auto-switch to Night in second half of journey
  const [lightingMode, setLightingMode] = useState('auto'); // 'day' | 'night' | 'auto'
  const [autoNight, setAutoNight] = useState(false);

  const isNight =
    lightingMode === 'night' ? true : lightingMode === 'day' ? false : autoNight;

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          scrollProgressRef.current = p;
          setScrollPct(Math.round(p * 100));

          // Auto transition from radiant Day Mode (0% - 52%) to Illuminated Night Mode (52% - 100%)
          setAutoNight(p >= 0.52);

          // Determine active chapter
          const foundIdx = CHAPTERS.findIndex(
            (ch) => p >= ch.range[0] && p <= ch.range[1]
          );
          if (foundIdx !== -1) setActiveChapter(foundIdx);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Jump smoothly to a specific chapter on pill click
  const jumpToChapter = (chapterIndex) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const scrollableDistance = sectionRef.current.offsetHeight - window.innerHeight;
    const targetProgress =
      (CHAPTERS[chapterIndex].range[0] + CHAPTERS[chapterIndex].range[1]) * 0.5;
    window.scrollTo({
      top: sectionTop + scrollableDistance * targetProgress,
      behavior: 'smooth',
    });
  };

  const currentChapter = CHAPTERS[activeChapter] || CHAPTERS[0];

  return (
    <section
      ref={sectionRef}
      id="stage-2-ayodhya"
      className="relative w-full h-[650vh] bg-[#0b101d] select-none"
    >
      {/* Sticky Pinned Fullscreen 3D Canvas & Unified Epic Frame */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [0, 5.2, 27], fov: 50, near: 0.5, far: 240 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <AyodhyaScene isNight={isNight} scrollProgressRef={scrollProgressRef} />
        </Canvas>

        {/* Subtle Unified Woodblock Vignette Overlay so 3D matches the 2D Epic Genre */}
        <div
          className="absolute inset-0 pointer-events-none epic-woodblock-grain"
          style={{
            boxShadow: 'inset 0 0 90px rgba(24, 16, 9, 0.78)',
          }}
        />

        {/* TOP BAR: STAGE 2 HEADER & DYNAMIC DAY / NIGHT MODE SWITCHER */}
        <div className="absolute top-16 inset-x-4 md:inset-x-8 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Kingdom Location Badge */}
          <div className="sacred-stroke-box px-4 py-2.5 rounded-2xl flex items-center gap-3 backdrop-blur-md">
            <Compass className="w-5 h-5 text-[#fbbf24] shrink-0" />
            <div>
              <div className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#fbbf24]">
                Stage II • Interactive 3D Kingdom
              </div>
              <div
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-sm md:text-base font-bold text-[#fffbeb]"
              >
                Ancient Ayodhya — {isNight ? 'Night of a Million Diyas' : 'Radiant Festive Day'}
              </div>
            </div>
          </div>

          {/* Interactive Day Mode / Night Mode / Auto Toggle */}
          <div className="pointer-events-auto sacred-stroke-box p-1.5 rounded-full flex items-center gap-1 backdrop-blur-md">
            <button
              onClick={() => setLightingMode('day')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-bold transition-all cursor-pointer ${
                !isNight && lightingMode === 'day'
                  ? 'bg-[#fbbf24] text-[#181009] shadow-[0_0_15px_rgba(251,191,36,0.6)]'
                  : 'text-[#fde68a] hover:bg-white/10'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Day Mode</span>
            </button>
            <button
              onClick={() => setLightingMode('night')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-bold transition-all cursor-pointer ${
                isNight && lightingMode === 'night'
                  ? 'bg-[#fbbf24] text-[#181009] shadow-[0_0_15px_rgba(251,191,36,0.6)]'
                  : 'text-[#fde68a] hover:bg-white/10'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Night Mode</span>
            </button>
            <button
              onClick={() => setLightingMode('auto')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer ${
                lightingMode === 'auto'
                  ? 'bg-[#d97706]/80 text-[#fffbeb] border border-[#fde047]'
                  : 'text-[#e5d5b5]/80 hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scroll Cycle ({isNight ? 'Night' : 'Day'})</span>
            </button>
          </div>
        </div>

        {/* BOTTOM NARRATIVE STORY CARD & CHAPTER WAYPOINT SELECTOR */}
        <div className="absolute bottom-5 inset-x-4 md:inset-x-8 z-30 flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-4 pointer-events-none">
          {/* Active Activity Story Card */}
          <div className="sacred-stroke-box rounded-2xl p-4 md:p-5 max-w-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#fbbf24] mb-1">
              <Flame className="w-4 h-4 fill-[#fbbf24]" />
              <span>
                {isNight
                  ? 'Illuminated Night • Fireworks & Deepdaan'
                  : 'Golden Daylight • Sparklers, Flowerpots & Rangoli'}
              </span>
            </div>
            <h3
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-lg md:text-2xl font-bold text-[#fffbeb] mb-1"
            >
              {currentChapter.title}
            </h3>
            <p className="text-xs md:text-sm text-[#e6d5b8] leading-relaxed">
              {currentChapter.subtitle}
            </p>
          </div>

          {/* Interactive Chapter Waypoint Pills */}
          <div className="pointer-events-auto sacred-stroke-box rounded-2xl p-2.5 flex flex-col gap-2 backdrop-blur-md">
            <div className="flex items-center justify-between px-2 text-[11px] font-sans text-[#fde68a]">
              <span>Click a landmark or scroll through Ayodhya</span>
              <span className="font-mono text-[#fbbf24]">{scrollPct}%</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { idx: 0, label: '1. Royal Gate' },
                { idx: 1, label: '2. Diyas & Rangoli' },
                { idx: 2, label: '3. Sweets & Crackers' },
                { idx: 3, label: '4. Bazaar & Elephants' },
                { idx: 4, label: '5. Temple Aarti' },
                { idx: 5, label: '6. Sarayu Ghats' },
              ].map((item) => (
                <button
                  key={item.idx}
                  onClick={() => jumpToChapter(item.idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer ${
                    activeChapter === item.idx
                      ? 'bg-[#fbbf24] text-[#181009] shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                      : 'bg-white/5 text-[#f3e3c3] hover:bg-white/15'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

