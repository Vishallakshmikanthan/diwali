import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles as DreiSparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sun,
  Moon,
  Sparkles,
  Compass,
  Flame,
  Play,
  Pause,
  ArrowLeft,
  ScrollText,
  X,
  Check,
  RotateCcw,
} from 'lucide-react';

import {
  IndianCitizen,
  RoyalElephant,
  RoyalChariot,
  RoyalHorse,
  RoyalPalanquin,
  RangoliMandala,
  GroundCrackerFX,
  CrackersSetProp,
  FloatingSkyLanternsFX,
  AerialFireworksFX,
} from './ayodhya3d/AyodhyaActors';
import {
  ToranaGate,
  AyodhyaRoyalPalace,
  GrandPalaceBuilding,
  GrandTempleMandir,
  MandapSabha,
  BazaarStall,
  MarketPropsCluster,
  FestiveStreetFestoons,
  MangalKalash,
  BrassDiyasStand,
  FestiveUmbrella,
  InteractionMarker3D,
  AshokaTree,
  ParijataTree,
  BanyanTree,
  SarayuRiverAndGhats,
  InstancedKingdomDiyas,
} from './ayodhya3d/AyodhyaArchitecture';
import { getRajpathPavementTexture } from './ayodhya3d/AyodhyaTextures';

gsap.registerPlugin(ScrollTrigger);

/**
 * Exact 6-Section Experience from `3d world -ref/image.png`
 */
export const AYODHYA_SECTIONS = [
  {
    id: 0,
    code: 'S1',
    shortName: 'Grand Entry to Ayodhya',
    title: 'Grand Entry to Ayodhya',
    subtitle: 'The first view — a majestic, prosperous Ayodhya adorned for Diwali.',
    range: [0, 0.16],
    scrollLore: {
      heading: 'S1 • The Royal Torana & Suryavanshi Standard',
      body: 'Adorned with crimson Suryavanshi Sun-emblem banners (Dhwaj), fragrant marigold torans, and thousands of earthen diyas, the monumental Singh-Dwar welcoming gate marks the return of Lord Shri Ram after fourteen years. Caparisoned royal elephants (Gajaraj) and armored guards stand in ceremonial salute along the Rajpath.',
      highlights: ['City Gate (Toran) & Sun Flags', 'Caparisoned Royal Elephants', 'Armored Palace Guards & Kalash'],
    },
  },
  {
    id: 1,
    code: 'S2',
    shortName: 'Festive Streets & People',
    title: 'Festive Streets & People',
    subtitle: 'Lively streets filled with citizens, musicians, dancers, and the joy of Diwali celebrations.',
    range: [0.16, 0.33],
    scrollLore: {
      heading: 'S2 • Rajpath Procession, Musicians & Classical Dance',
      body: 'Beneath catenary canopies of glowing fairy lights, silk Akash Kandil lanterns, and mango-leaf garlands, the grand avenues of Ayodhya resound with Dhol drums and auspicious Shehnai melodies. Classical dancers spin in flared zari lehengas alongside golden horse-drawn Rathas and royal palanquins.',
      highlights: ['Dhol & Shehnai Musicians', 'Classical Kathak Dancers', 'Horse-Drawn Royal Chariot & Palanquin'],
    },
  },
  {
    id: 2,
    code: 'S3',
    shortName: 'Homes & Neighbourhood Celebrations',
    title: 'Homes & Neighbourhood Celebrations',
    subtitle: 'Families lighting diyas, creating rangolis, bursting crackers, and sharing sweets with neighbours.',
    range: [0.33, 0.50],
    scrollLore: {
      heading: 'S3 • Griha Deepavali — Rangolis, Sweets & Crackers',
      body: 'Every courtyard and pillared veranda shines with sixteen-petalled lotus Rangolis and brass Samai lamp stands. Children wave fizzing Phuljhari sparklers around golden Anar flowerpots and spinning Chakris, while elders and neighbours affectionately exchange brass platters heaped with saffron Laddoos.',
      highlights: ['Children Bursting Anar, Chakri & Sparklers', 'Neighbours Exchanging Golden Laddoos', 'Families Lighting Veranda Diyas & Rangoli'],
    },
  },
  {
    id: 3,
    code: 'S4',
    shortName: 'Temple Gatherings',
    title: 'Temple Gatherings',
    subtitle: 'Magnificent temples filled with prayers, aarti, and auspicious Diwali rituals.',
    range: [0.50, 0.68],
    scrollLore: {
      heading: 'S4 • Shri Ram Mandir & Auspicious Maha Aarti',
      body: 'Under the soaring Nagara Shikhara crowned by a golden Amalaka, Kalash, and fluttering saffron Dhwaja, priests in saffron silk wave multi-tiered brass Maha Aarti lamps in synchronized clockwise arcs. Inside the radiant golden Garbhagriha stand the sacred Murtis of Lord Shri Ram holding the Kodanda bow, Sita Mata, and Lakshmana.',
      highlights: ['Shri Ram, Sita & Lakshmana Golden Sanctum', 'Priests Performing Synchronized Maha Aarti', 'Ringing Brass Bells & Mandap Sabha'],
    },
  },
  {
    id: 4,
    code: 'S5',
    shortName: 'Royal Market & Cultural Fest',
    title: 'Royal Market & Cultural Fest',
    subtitle: 'A vibrant royal marketplace with festive shopping, traditional crafts, sweets, savouries, and cultural performances.',
    range: [0.68, 0.84],
    scrollLore: {
      heading: 'S5 • Swarna Bazaar — Crafts, Sweets & Cultural Fest',
      body: 'Ayodhya’s prosperous marketplace bustles under striped silk awnings and royal Raj Chhatra umbrellas. Stalls overflow with tiered pyramids of Laddoos, Jalebis, and Barfis alongside wooden fruit carts, woven bamboo baskets, sculpted terracotta urns, and fragrant grain sacks.',
      highlights: ['Striped Silk Market & Sweet Stalls', 'Wooden Carts, Baskets, Urns & Grain Sacks', 'Cultural Performers & Festive Shoppers'],
    },
  },
  {
    id: 5,
    code: 'S6',
    shortName: 'Riverside Ghats (Sarayu)',
    title: 'Riverside Ghats (Sarayu)',
    subtitle: 'A serene yet grand celebration at the Sarayu river, with floating diyas, reflections, and a view of illuminated Ayodhya.',
    range: [0.84, 1.0],
    scrollLore: {
      heading: 'S6 • Sacred Sarayu Deepdaan & Imperial Horizon',
      body: 'At the broad sandstone steps of the Sarayu Ghats, families kneel by the water’s edge to offer thousands of floating Deepdaan diyas among blooming pink water lotuses. Across the shimmering golden reflections of the river rises the illuminated skyline of the Ayodhya Royal Palace beneath a sky of floating lanterns and fireworks.',
      highlights: ['Thousands of Floating Deepdaan Diyas', 'Sacred Water Lotuses & Deepstambh Towers', 'Illuminated Royal Palace Reflection on Sarayu'],
    },
  },
];

/**
 * Scroll-Driven + Interactive Look-Drag Cinematic Camera Rig along S1 -> S6
 */
function AyodhyaCameraRig({ scrollProgressRef, dragOffsetRef }) {
  const { camera } = useThree();

  const { posCurve, lookCurve } = useMemo(() => {
    const posPoints = [
      new THREE.Vector3(0, 4.6, 29),      // S1 (0.00): Grand Entry in front of City Gate (Toran) & Elephants
      new THREE.Vector3(0, 3.8, 12),      // S1->S2 (0.16): Passing through Toran into Festive Streets
      new THREE.Vector3(-1.8, 3.4, -2),   // S2 (0.26): Festive Streets — Musicians, Dancers & Horse Chariot
      new THREE.Vector3(3.6, 3.0, -16),   // S3 (0.42): Homes & Neighbourhood — Children Crackers & Neighbours Sweets
      new THREE.Vector3(0, 4.6, -34),     // S4 (0.58): Temple Gatherings — Shri Ram Mandir & Maha Aarti
      new THREE.Vector3(-2.2, 3.8, -56),  // S5 (0.76): Royal Market & Cultural Fest — Stalls, Carts & Sweets
      new THREE.Vector3(-3.5, 2.2, -88),  // S6a (0.90): Close to Sarayu Ghats steps — Devotees floating diyas
      new THREE.Vector3(0, 6.2, -92),     // S6b (1.00): Serene grand panorama across Sarayu River & Illuminated Ayodhya
    ];

    const lookPoints = [
      new THREE.Vector3(0, 4.4, 2),       // S1: Looking through Toran Gate toward distant Palace
      new THREE.Vector3(0, 3.2, -8),      // S1->S2: Looking down the lantern-lit street
      new THREE.Vector3(0.8, 2.2, -12),   // S2: Looking at Musicians, Dancers & Chariot
      new THREE.Vector3(8.5, 1.8, -20),   // S3: Looking closely at Veranda Families, Sweets & Crackers
      new THREE.Vector3(0, 6.2, -48),     // S4: Looking at Shri Ram Temple Golden Sanctum & Priests' Aarti
      new THREE.Vector3(2.5, 2.4, -68),   // S5: Looking across Royal Bazaar Stalls & Dancers
      new THREE.Vector3(2.0, -0.8, -104), // S6a: Looking across kneeling devotees & floating diyas on Sarayu
      new THREE.Vector3(0, 5.5, -138),    // S6b: Looking at Illuminated Ayodhya Royal Palace & Fireworks over water
    ];

    return {
      posCurve: new THREE.CatmullRomCurve3(posPoints),
      lookCurve: new THREE.CatmullRomCurve3(lookPoints),
    };
  }, []);

  const currentPos = useRef(new THREE.Vector3(0, 4.6, 29));
  const currentLook = useRef(new THREE.Vector3(0, 4.4, 2));

  useFrame((state, delta) => {
    const t = THREE.MathUtils.clamp(scrollProgressRef.current, 0, 1);
    const targetPos = posCurve.getPointAt(t);
    const baseLook = lookCurve.getPointAt(t);

    // Subtle handheld cinematic float
    const breathX = Math.sin(state.clock.elapsedTime * 0.75) * 0.14;
    const breathY = Math.cos(state.clock.elapsedTime * 1.05) * 0.08;

    // Apply user interactive mouse/touch look offset
    const yawOffset = dragOffsetRef.current.x * 12;
    const pitchOffset = dragOffsetRef.current.y * 7;

    const targetLook = new THREE.Vector3(
      baseLook.x + yawOffset,
      baseLook.y + pitchOffset,
      baseLook.z
    );

    currentPos.current.lerp(
      new THREE.Vector3(targetPos.x + breathX, targetPos.y + breathY, targetPos.z),
      Math.min(1, delta * 4.5)
    );
    currentLook.current.lerp(targetLook, Math.min(1, delta * 5.2));

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLook.current);
  });

  return null;
}

/**
 * Full 3D Ancient Ayodhya World Scene (S1 to S6)
 */
function AyodhyaScene({ isNight, scrollProgressRef, dragOffsetRef, onSelectHotspot }) {
  const rajpathTex = useMemo(() => getRajpathPavementTexture(), []);

  return (
    <>
      {/* Dynamic Atmosphere, Fog & Sky */}
      <color attach="background" args={[isNight ? '#070f22' : '#e8ac65']} />
      <fogExp2 attach="fog" args={[isNight ? '#081226' : '#e5b272', isNight ? 0.0072 : 0.0062]} />

      {/* Dynamic Day / Night Lighting */}
      <ambientLight
        color={isNight ? '#435b8f' : '#fff4db'}
        intensity={isNight ? 0.72 : 1.65}
      />
      <directionalLight
        position={isNight ? [-28, 48, -35] : [35, 58, 25]}
        color={isNight ? '#93c5fd' : '#fffbeb'}
        intensity={isNight ? 0.95 : 2.9}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <hemisphereLight
        skyColor={isNight ? '#1e3a8a' : '#fef08a'}
        groundColor={isNight ? '#78350f' : '#b45309'}
        intensity={isNight ? 0.85 : 1.15}
      />

      {/* Celestial Sun (Light Mode) or Luminous Moon & 4,000 Stars (Dark Mode) */}
      {isNight ? (
        <>
          <Stars radius={135} depth={65} count={4000} factor={4.2} saturation={0.6} fade speed={1.2} />
          <group position={[-22, 46, -138]}>
            <mesh>
              <sphereGeometry args={[6.2, 24, 24]} />
              <meshBasicMaterial color="#fef9c3" />
            </mesh>
            <mesh>
              <sphereGeometry args={[9.5, 24, 24]} />
              <meshBasicMaterial color="#fde68a" transparent opacity={0.22} />
            </mesh>
            <pointLight color="#fde68a" intensity={18} distance={220} />
          </group>
        </>
      ) : (
        <group position={[18, 44, -132]}>
          <mesh>
            <sphereGeometry args={[9.5, 24, 24]} />
            <meshBasicMaterial color="#fffbeb" />
          </mesh>
          <mesh>
            <sphereGeometry args={[15, 24, 24]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.35} />
          </mesh>
        </group>
      )}

      {/* Floating Golden Festive Sparkles & Rising Sky Lanterns */}
      <DreiSparkles
        count={380}
        scale={[75, 24, 140]}
        position={[0, 8, -45]}
        size={isNight ? 4.8 : 3.2}
        speed={0.45}
        color="#fde047"
      />
      <FloatingSkyLanternsFX isNight={isNight} />

      {/* Camera Controller */}
      <AyodhyaCameraRig scrollProgressRef={scrollProgressRef} dragOffsetRef={dragOffsetRef} />

      {/* =====================================================================
          GROUND PAVEMENT: CARVED SANDSTONE RAJPATH AVENUE & GARDENS
      ===================================================================== */}
      <group>
        <mesh position={[0, -0.05, -35]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[160, 130]} />
          <meshStandardMaterial color={isNight ? '#381b09' : '#7c4722'} roughness={0.82} />
        </mesh>

        {/* Main Carved Sandstone Royal Avenue (Rajpath) */}
        <mesh position={[0, 0.01, -35]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 124]} />
          <meshStandardMaterial
            map={rajpathTex}
            color={isNight ? '#85522c' : '#d69e66'}
            roughness={0.5}
            metalness={0.12}
          />
        </mesh>

        {/* Gold Inlaid Royal Procession Strip */}
        <mesh position={[0, 0.02, -35]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[1.1, 122]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.22} />
        </mesh>
      </group>

      {/* Overhead Street Festoons (Fairy Lights, Flower Torans & Hanging Lanterns) */}
      <FestiveStreetFestoons
        zPositions={[10, 2, -6, -14, -22, -52, -60, -68, -76]}
        isNight={isNight}
      />

      {/* =====================================================================
          ROYAL PALACES & HAVELIS FLANKING RAJPATH (LEFT & RIGHT AVENUES)
      ===================================================================== */}
      {[
        { pos: [-17.5, 0, 8], rot: [0, Math.PI / 2, 0], floors: 3, wall: '#d97706' },
        { pos: [17.5, 0, 8], rot: [0, -Math.PI / 2, 0], floors: 3, wall: '#c26d2d' },
        { pos: [-17.5, 0, -6], rot: [0, Math.PI / 2, 0], floors: 2, wall: '#b45309' },
        { pos: [17.5, 0, -6], rot: [0, -Math.PI / 2, 0], floors: 2, wall: '#d97706' },
        { pos: [-17.5, 0, -20], rot: [0, Math.PI / 2, 0], floors: 3, wall: '#c26d2d' },
        { pos: [17.5, 0, -20], rot: [0, -Math.PI / 2, 0], floors: 3, wall: '#b45309' },
        { pos: [-18.5, 0, -58], rot: [0, Math.PI / 2, 0], floors: 3, wall: '#d97706' },
        { pos: [18.5, 0, -58], rot: [0, -Math.PI / 2, 0], floors: 3, wall: '#c26d2d' },
        { pos: [-18.5, 0, -72], rot: [0, Math.PI / 2, 0], floors: 2, wall: '#b45309' },
        { pos: [18.5, 0, -72], rot: [0, -Math.PI / 2, 0], floors: 2, wall: '#d97706' },
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

      {/* Nature Trees Lining the Royal Gardens & Courtyards */}
      <AshokaTree position={[-13.5, 0, 21]} scale={1.2} />
      <AshokaTree position={[13.5, 0, 21]} scale={1.2} />
      <ParijataTree position={[-14.2, 0, 0]} scale={1.1} />
      <ParijataTree position={[14.2, 0, -13]} scale={1.1} />
      <BanyanTree position={[-22, 0, -38]} scale={1.2} />
      <BanyanTree position={[22, 0, -38]} scale={1.2} />

      {/* =====================================================================
          S1 (Z = +24 to +10): GRAND ENTRY TO AYODHYA
          City Gate (Toran), 2 Caparisoned Royal Elephants, Armored Palace Guards & Citizens
      ===================================================================== */}
      <ToranaGate position={[0, 0, 17]} isNight={isNight} />

      {/* Left & Right Caparisoned Royal Elephants Flanking the Gate (Exact match to S1 in `image.png`!) */}
      <RoyalElephant position={[-5.2, 0, 21.5]} rotation={[0, 0.25, 0]} walkPath={0.8} />
      <RoyalElephant position={[5.2, 0, 21.5]} rotation={[0, -0.25, 0]} walkPath={0.8} />

      {/* Armored Royal Guards with Golden Spears at the Gate Pillars */}
      <IndianCitizen
        position={[-4.2, 0, 18.8]}
        rotation={[0, 0.15, 0]}
        isFemale={false}
        isGuard
        action="guard"
        isNight={isNight}
      />
      <IndianCitizen
        position={[4.2, 0, 18.8]}
        rotation={[0, -0.15, 0]}
        isFemale={false}
        isGuard
        action="guard"
        isNight={isNight}
      />

      {/* Welcoming Citizens & Grand Entrance Rangoli */}
      <RangoliMandala position={[0, 0.03, 19.5]} scale={1.35} variant={0} />
      <IndianCitizen
        position={[-2.6, 0, 16.2]}
        rotation={[0, 0.4, 0]}
        attireColor="#dc2626"
        secondaryColor="#fbbf24"
        action="namaste"
        isNight={isNight}
      />
      <IndianCitizen
        position={[2.6, 0, 16.2]}
        rotation={[0, -0.4, 0]}
        attireColor="#059669"
        secondaryColor="#fbbf24"
        isFemale={false}
        hasTurban
        action="namaste"
        isNight={isNight}
      />
      <InteractionMarker3D
        position={[2.4, 0.05, 20.5]}
        label="S1 • Royal Toran Gate"
        onSelect={() => onSelectHotspot(0)}
      />

      {/* =====================================================================
          S2 (Z = +8 to -10): FESTIVE STREETS & PEOPLE
          Musicians (Dhol & Shehnai), Classical Dancers, Horse-Drawn Chariot, Palanquin & Citizens
      ===================================================================== */}
      <group position={[0, 0, -4]}>
        <RangoliMandala position={[0, 0.03, -2]} scale={1.45} variant={1} />

        {/* Left Side: Turbaned Musicians Playing Dhol Drums & Golden Shehnai (Matching S2 in `image.png`) */}
        <IndianCitizen
          position={[-4.2, 0, -1.2]}
          rotation={[0, 1.2, 0]}
          attireColor="#d97706"
          secondaryColor="#dc2626"
          isFemale={false}
          hasTurban
          action="drum"
          isNight={isNight}
        />
        <IndianCitizen
          position={[-3.5, 0, -2.8]}
          rotation={[0, 1.1, 0]}
          attireColor="#991b1b"
          secondaryColor="#fbbf24"
          isFemale={false}
          hasTurban
          action="drum"
          phaseOffset={1.2}
          isNight={isNight}
        />
        <IndianCitizen
          position={[-4.8, 0, -2.2]}
          rotation={[0, 1.2, 0]}
          attireColor="#047857"
          secondaryColor="#fde047"
          isFemale={false}
          hasTurban
          action="shehnai"
          isNight={isNight}
        />

        {/* Center: Classical Kathak Dancers Spinning in Flared Lehengas */}
        <IndianCitizen
          position={[-0.9, 0, -1.8]}
          rotation={[0, 0, 0]}
          attireColor="#e11d48"
          secondaryColor="#fde047"
          action="dance"
          isNight={isNight}
        />
        <IndianCitizen
          position={[1.1, 0, -2.2]}
          rotation={[0, Math.PI, 0]}
          attireColor="#d97706"
          secondaryColor="#dc2626"
          action="dance"
          phaseOffset={1.4}
          isNight={isNight}
        />
        <IndianCitizen
          position={[0.1, 0, -3.6]}
          rotation={[0, 0.5, 0]}
          attireColor="#7c3aed"
          secondaryColor="#fbbf24"
          action="dance"
          phaseOffset={2.6}
          isNight={isNight}
        />

        {/* Right Side: Ornate Horse-Drawn Royal Chariot & Royal Palanquin */}
        <RoyalChariot position={[5.2, 0, -2.5]} rotation={[0, -0.15, 0]} />
        <RoyalPalanquin position={[-5.8, 0, 3.2]} rotation={[0, 0.25, 0]} />

        {/* Strolling Citizens Celebrating */}
        <IndianCitizen
          position={[3.2, 0, 2.5]}
          rotation={[0, -0.6, 0]}
          attireColor="#2563eb"
          secondaryColor="#fbbf24"
          action="walk"
          walkRadius={1.8}
          isNight={isNight}
        />
        <InteractionMarker3D
          position={[-2.4, 0.05, 0.5]}
          label="S2 • Musicians & Dancers"
          onSelect={() => onSelectHotspot(1)}
        />
      </group>

      {/* =====================================================================
          S3 (Z = -12 to -26): HOMES & NEIGHBOURHOOD CELEBRATIONS
          Children Bursting Sparklers & Crackers, Families Lighting Diyas, Neighbours Sharing Sweets
      ===================================================================== */}
      {/* Right Courtyard & Home Veranda (Camera sweeps right here at S3!) */}
      <group position={[7.2, 0, -19]}>
        <RangoliMandala position={[0, 0.03, 0]} scale={1.4} variant={2} />
        <MangalKalash position={[3.2, 0, -1.5]} scale={1.25} />
        <BrassDiyasStand position={[3.2, 0, 1.5]} scale={1.15} isNight={isNight} />

        {/* 1. Neighbours Exchanging Platter of Golden Laddoo Sweets (Elder Woman + Young Couple, matching S3 in `image.png`!) */}
        <IndianCitizen
          position={[0.6, 0, -1.6]}
          rotation={[0, 1.4, 0]}
          attireColor="#c2410c"
          secondaryColor="#fbbf24"
          isElder
          action="offer_sweets"
          isNight={isNight}
        />
        <IndianCitizen
          position={[2.2, 0, -1.4]}
          rotation={[0, -1.5, 0]}
          attireColor="#fef3c7"
          secondaryColor="#d97706"
          isFemale={false}
          action="offer_sweets"
          phaseOffset={0.8}
          isNight={isNight}
        />
        <IndianCitizen
          position={[2.6, 0, -0.5]}
          rotation={[0, -1.7, 0]}
          attireColor="#7e22ce"
          secondaryColor="#fbbf24"
          action="namaste"
          isNight={isNight}
        />

        {/* 2. Joyful Children Bursting Sparklers (Phuljhari), Anar, Chakri & Crackers Set */}
        <GroundCrackerFX position={[-1.8, 0, 1.2]} type="anar" isNight={isNight} />
        <GroundCrackerFX position={[1.4, 0, 2.2]} type="anar" isNight={isNight} />
        <GroundCrackerFX position={[-0.2, 0, 2.6]} type="chakri" isNight={isNight} />
        <CrackersSetProp position={[-0.8, 0, 1.6]} scale={1.25} />

        <IndianCitizen
          position={[-2.6, 0, 1.4]}
          rotation={[0, 1.3, 0]}
          attireColor="#ea580c"
          secondaryColor="#fde047"
          isFemale={false}
          isChild
          action="sparkler"
          phaseOffset={0.4}
          isNight={isNight}
        />
        <IndianCitizen
          position={[-1.1, 0, 2.8]}
          rotation={[0, 2.4, 0]}
          attireColor="#eab308"
          secondaryColor="#dc2626"
          isChild
          action="sparkler"
          phaseOffset={1.5}
          isNight={isNight}
        />

        {/* 3. Family Lighting Veranda Diyas & Decorating Rangoli */}
        <IndianCitizen
          position={[-1.4, 0, -0.6]}
          rotation={[0, 0.9, 0]}
          attireColor="#e11d48"
          secondaryColor="#fde047"
          action="light_diya"
          isNight={isNight}
        />
        <InteractionMarker3D
          position={[-2.8, 0.05, -1.2]}
          label="S3 • Homes, Sweets & Crackers"
          onSelect={() => onSelectHotspot(2)}
        />
      </group>

      {/* Left Courtyard Family Lighting Diyas & Rangoli for Full Street Balance */}
      <group position={[-7.5, 0, -18]}>
        <RangoliMandala position={[0, 0.03, 0]} scale={1.35} variant={0} />
        <GroundCrackerFX position={[1.8, 0, 1.5]} type="anar" isNight={isNight} />
        <IndianCitizen
          position={[-1.2, 0, 0.6]}
          rotation={[0, 1.2, 0]}
          attireColor="#db2777"
          secondaryColor="#fde047"
          action="light_diya"
          isNight={isNight}
        />
        <IndianCitizen
          position={[0.8, 0, -0.8]}
          rotation={[0, -1.8, 0]}
          attireColor="#059669"
          secondaryColor="#fbbf24"
          isFemale={false}
          hasTurban
          action="offer_sweets"
          isNight={isNight}
        />
      </group>

      {/* =====================================================================
          S4 (Z = -28 to -50): TEMPLE GATHERINGS
          Magnificent Shri Ram Temple, Golden Sanctum, Priests Performing Maha Aarti & Devotees
      ===================================================================== */}
      <GrandTempleMandir position={[0, 0, -44]} isNight={isNight} />
      <MandapSabha position={[-15.5, 0, -39]} scale={0.85} isNight={isNight} />
      <MandapSabha position={[15.5, 0, -39]} scale={0.85} isNight={isNight} />

      {/* Priests Performing Synchronized Maha Aarti on the Temple Steps */}
      {[
        [-2.4, 2.1, -32.2],
        [0, 2.1, -32.2],
        [2.4, 2.1, -32.2],
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

      {/* Joyful Crowd of Devotees Gathered Before the Temple */}
      {[
        { pos: [-4.6, 0, -29.5], col: '#dc2626', fem: true },
        { pos: [-2.2, 0, -28.8], col: '#f59e0b', fem: false, turb: true },
        { pos: [2.2, 0, -28.8], col: '#10b981', fem: true },
        { pos: [4.6, 0, -29.5], col: '#3b82f6', fem: false, turb: true },
        { pos: [-3.4, 0, -27.2], col: '#9333ea', fem: true },
        { pos: [0, 0, -27.5], col: '#fde68a', fem: false, turb: true },
        { pos: [3.4, 0, -27.2], col: '#e11d48', fem: true },
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
          phaseOffset={i * 0.45}
          isNight={isNight}
        />
      ))}
      <InteractionMarker3D
        position={[4.2, 0.05, -31.2]}
        label="S4 • Temple Maha Aarti"
        onSelect={() => onSelectHotspot(3)}
      />

      {/* =====================================================================
          S5 (Z = -52 to -74): ROYAL MARKET & CULTURAL FEST
          Market Stalls, Sweets & Savouries, Wooden Carts, Baskets, Pots, Grain Sacks & Dancers
      ===================================================================== */}
      <group position={[0, 0, -64]}>
        {/* Left & Right Striped-Canopy Royal Market Stalls */}
        <BazaarStall
          position={[-9.8, 0, 5]}
          rotation={[0, Math.PI / 2, 0]}
          canopyColor="#b91c1c"
          secondaryStripe="#fef3c7"
          isNight={isNight}
        />
        <BazaarStall
          position={[-9.8, 0, -2.5]}
          rotation={[0, Math.PI / 2, 0]}
          canopyColor="#1d4ed8"
          secondaryStripe="#fde68a"
          isNight={isNight}
        />
        <BazaarStall
          position={[9.8, 0, 5]}
          rotation={[0, -Math.PI / 2, 0]}
          canopyColor="#d97706"
          secondaryStripe="#fffbeb"
          isNight={isNight}
        />
        <BazaarStall
          position={[9.8, 0, -2.5]}
          rotation={[0, -Math.PI / 2, 0]}
          canopyColor="#047857"
          secondaryStripe="#fef08a"
          isNight={isNight}
        />

        {/* Market Props Clusters: Wooden Handcarts, Baskets, Terracotta Urns & Grain Sacks */}
        <MarketPropsCluster position={[-6.8, 0, 1.5]} rotation={[0, 0.4, 0]} />
        <MarketPropsCluster position={[6.8, 0, 1.5]} rotation={[0, -0.4, 0]} />

        {/* Festive Royal Umbrellas (Raj Chhatra) */}
        <FestiveUmbrella position={[-7.5, 0, -5.8]} color="#dc2626" scale={1.15} />
        <FestiveUmbrella position={[7.5, 0, -5.8]} color="#7c3aed" scale={1.15} />

        {/* Shopkeeper Offering Sweets to Shoppers (Matching S5 foreground in `image.png`!) */}
        <IndianCitizen
          position={[-7.6, 0, 5.2]}
          rotation={[0, 1.4, 0]}
          attireColor="#d97706"
          secondaryColor="#fef08a"
          isFemale={false}
          hasTurban
          action="offer_sweets"
          isNight={isNight}
        />
        <IndianCitizen
          position={[-5.8, 0, 5.0]}
          rotation={[0, -1.6, 0]}
          attireColor="#fef3c7"
          secondaryColor="#d97706"
          isFemale={false}
          action="namaste"
          isNight={isNight}
        />
        <IndianCitizen
          position={[-5.5, 0, 6.1]}
          rotation={[0, -1.8, 0]}
          attireColor="#db2777"
          secondaryColor="#fbbf24"
          action="namaste"
          isNight={isNight}
        />

        {/* Cultural Fest Dancers & Musicians in the Marketplace Center */}
        <RangoliMandala position={[0, 0.03, 0.5]} scale={1.45} variant={1} />
        <IndianCitizen
          position={[-1.1, 0, 0.5]}
          rotation={[0, 0.4, 0]}
          attireColor="#e11d48"
          secondaryColor="#fde047"
          action="dance"
          isNight={isNight}
        />
        <IndianCitizen
          position={[1.1, 0, 0.5]}
          rotation={[0, -0.4, 0]}
          attireColor="#f59e0b"
          secondaryColor="#dc2626"
          action="dance"
          phaseOffset={1.3}
          isNight={isNight}
        />
        <IndianCitizen
          position={[2.8, 0, -1.2]}
          rotation={[0, -1.2, 0]}
          attireColor="#7c3aed"
          secondaryColor="#fbbf24"
          isFemale={false}
          hasTurban
          action="drum"
          isNight={isNight}
        />

        {/* Royal Elephant & Horse in the Bazaar */}
        <RoyalElephant position={[4.5, 0, -5.5]} rotation={[0, Math.PI, 0]} walkPath={1.2} />
        <RoyalHorse position={[-4.5, 0, -5.5]} rotation={[0, 0.3, 0]} />

        <InteractionMarker3D
          position={[2.5, 0.05, 3.2]}
          label="S5 • Royal Market & Crafts"
          onSelect={() => onSelectHotspot(4)}
        />
      </group>

      {/* =====================================================================
          S6 (Z = -84 to -145): RIVERSIDE GHATS (SARAYU)
          Stepped Stone Ghats, Kneeling Families Floating Deepdaan Diyas, Water Lotuses,
          Reflections & Illuminated Ayodhya Royal Palace Across the River!
      ===================================================================== */}
      <SarayuRiverAndGhats position={[0, 0, -90]} isNight={isNight} />

      {/* Families & Women Kneeling on the Sarayu Ghat Steps Floating Diyas (Exact match to S6 in `image.png`!) */}
      {[
        { pos: [-5.8, -0.95, -94.2], col: '#d97706', sec: '#dc2626', fem: true, act: 'float_diya' },
        { pos: [-4.2, -1.28, -95.6], col: '#dc2626', sec: '#fbbf24', fem: true, act: 'float_diya' },
        { pos: [-6.6, -0.64, -92.8], col: '#1e3a8a', sec: '#fbbf24', fem: false, act: 'namaste' },
        { pos: [-1.2, -1.28, -95.6], col: '#e11d48', sec: '#fde047', fem: true, act: 'float_diya' },
        { pos: [2.4, -1.28, -95.6], col: '#7c3aed', sec: '#fbbf24', fem: true, act: 'float_diya' },
        { pos: [5.5, -0.95, -94.2], col: '#059669', sec: '#fde047', fem: true, act: 'aarti' },
        { pos: [7.2, -0.64, -92.8], col: '#ea580c', sec: '#fef08a', fem: false, act: 'namaste' },
      ].map((g, i) => (
        <IndianCitizen
          key={i}
          position={g.pos}
          rotation={[0, Math.PI - 0.25, 0]}
          attireColor={g.col}
          secondaryColor={g.sec}
          isFemale={g.fem}
          action={g.act}
          phaseOffset={i * 0.65}
          isNight={isNight}
        />
      ))}

      <InteractionMarker3D
        position={[-2.2, -0.5, -91.8]}
        label="S6 • Sarayu Ghats Deepdaan"
        onSelect={() => onSelectHotspot(5)}
      />

      {/* 2,400+ Instanced Glowing Diyas Across the Entire Kingdom & River */}
      <InstancedKingdomDiyas isNight={isNight} />

      {/* Night Sky Aerial Fireworks Explosions */}
      <AerialFireworksFX isNight={isNight} />
    </>
  );
}

export default function Stage2AyodhyaWorld({
  initialMode = 'auto',
  onBackToHero,
  onEnterEnding,
}) {
  const sectionRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const autoTourRef = useRef(false);

  const [activeSection, setActiveSection] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [lightingMode, setLightingMode] = useState(initialMode); // 'day' | 'night' | 'auto'
  const [autoNight, setAutoNight] = useState(false);
  const [isAutoTouring, setIsAutoTouring] = useState(false);
  const [selectedLoreIdx, setSelectedLoreIdx] = useState(null);

  const isNight =
    lightingMode === 'night' ? true : lightingMode === 'day' ? false : autoNight;

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.45,
        onUpdate: (self) => {
          const p = self.progress;
          scrollProgressRef.current = p;
          setScrollPct(Math.round(p * 100));

          // Auto transition from Golden Daylight (S1-S3) to Illuminated Nighttime (S4-S6)
          setAutoNight(p >= 0.48);

          const foundIdx = AYODHYA_SECTIONS.findIndex(
            (sec) => p >= sec.range[0] && p <= sec.range[1]
          );
          if (foundIdx !== -1) setActiveSection(foundIdx);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Jump smoothly to any of S1..S6 on timeline click
  const jumpToSection = (sectionIndex) => {
    if (!sectionRef.current) return;
    autoTourRef.current = false;
    setIsAutoTouring(false);

    const rect = sectionRef.current.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const scrollableDistance = sectionRef.current.offsetHeight - window.innerHeight;
    const sec = AYODHYA_SECTIONS[sectionIndex];
    const targetProgress =
      sectionIndex === 0
        ? 0.02
        : sectionIndex === AYODHYA_SECTIONS.length - 1
        ? 0.96
        : (sec.range[0] + sec.range[1]) * 0.5;

    window.scrollTo({
      top: sectionTop + scrollableDistance * targetProgress,
      behavior: 'smooth',
    });
  };

  // Automated Cinematic Tour through S1 -> S6
  const toggleAutoTour = () => {
    if (autoTourRef.current) {
      autoTourRef.current = false;
      setIsAutoTouring(false);
      return;
    }

    autoTourRef.current = true;
    setIsAutoTouring(true);

    if (scrollPct >= 97) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    const step = () => {
      if (!autoTourRef.current || !sectionRef.current) return;
      const maxScroll = sectionRef.current.offsetHeight - window.innerHeight;
      const currentY = window.scrollY;
      if (currentY < maxScroll - 2) {
        window.scrollTo(0, currentY + Math.max(2.6, maxScroll * 0.0011));
        requestAnimationFrame(step);
      } else {
        autoTourRef.current = false;
        setIsAutoTouring(false);
      }
    };
    requestAnimationFrame(step);
  };

  // Interactive 360° Look-Around Pointer Handlers
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = (e.clientX - lastPointerRef.current.x) / window.innerWidth;
    const dy = (e.clientY - lastPointerRef.current.y) / window.innerHeight;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };

    dragOffsetRef.current = {
      x: THREE.MathUtils.clamp(dragOffsetRef.current.x + dx * 2.2, -1.2, 1.2),
      y: THREE.MathUtils.clamp(dragOffsetRef.current.y - dy * 2.2, -0.8, 0.8),
    };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const resetCameraLook = () => {
    dragOffsetRef.current = { x: 0, y: 0 };
  };

  const currentSec = AYODHYA_SECTIONS[activeSection] || AYODHYA_SECTIONS[0];
  const activeLore =
    selectedLoreIdx !== null ? AYODHYA_SECTIONS[selectedLoreIdx] : null;

  return (
    <section
      ref={sectionRef}
      id="stage-2-ayodhya"
      className="relative w-full h-[760vh] bg-[#090d18] select-none"
    >
      {/* Sticky Pinned Fullscreen 3D Viewport */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onDoubleClick={resetCameraLook}
        className="sticky top-0 left-0 w-full h-screen overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [0, 4.6, 29], fov: 48, near: 0.5, far: 250 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <AyodhyaScene
            isNight={isNight}
            scrollProgressRef={scrollProgressRef}
            dragOffsetRef={dragOffsetRef}
            onSelectHotspot={(idx) => setSelectedLoreIdx(idx)}
          />
        </Canvas>

        {/* Subtle Vignette Frame */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 85px rgba(15, 10, 5, 0.72)',
          }}
        />

        {/* =====================================================================
            TOP BAR: BACK TO HERO, REALM TITLE & CINEMATIC AUTO-TOUR CONTROLS
        ===================================================================== */}
        <header className="absolute top-0 inset-x-0 z-30 px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            {onBackToHero && (
              <button
                onClick={onBackToHero}
                className="px-3.5 py-2 rounded-full bg-[#181009]/85 hover:bg-[#fbbf24] text-[#fde68a] hover:text-[#181009] border border-[#fbbf24]/50 backdrop-blur-md text-xs font-sans font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Hero Battle</span>
              </button>
            )}

            <div className="px-4 py-2 rounded-full bg-[#181009]/85 border border-[#fbbf24]/45 backdrop-blur-md flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-[#fbbf24]" />
              <span
                style={{ fontFamily: "'Cinzel', serif" }}
                className="text-xs md:text-sm font-bold tracking-[0.18em] uppercase text-[#fffbeb]"
              >
                3D Ayodhya World
              </span>
              <span className="hidden sm:inline text-[11px] font-sans text-[#fde68a]/80">
                • Section-by-Section Experience
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pointer-events-auto">
            <button
              onClick={toggleAutoTour}
              className="px-4 py-2 rounded-full bg-[#181009]/85 hover:bg-[#fbbf24] text-[#fffbeb] hover:text-[#181009] border border-[#fbbf24]/50 backdrop-blur-md text-xs font-sans font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              {isAutoTouring ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Tour</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Auto-Journey</span>
                </>
              )}
            </button>

            <button
              onClick={() => setSelectedLoreIdx(activeSection)}
              className="px-3.5 py-2 rounded-full bg-[#181009]/85 hover:bg-[#fbbf24]/20 text-[#fde68a] border border-[#fbbf24]/45 backdrop-blur-md text-xs font-sans font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ScrollText className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span className="hidden sm:inline">Info Scroll</span>
            </button>
          </div>
        </header>

        {/* =====================================================================
            LEFT SIDEBAR: VERTICAL SECTION-BY-SECTION TIMELINE (S1 -> S6)
            Exact match to the left sidebar of `3d world -ref/image.png`!
        ===================================================================== */}
        <aside className="hidden lg:flex flex-col justify-center absolute left-6 top-20 bottom-28 z-30 w-56 pointer-events-none">
          <div className="pointer-events-auto bg-[#160f09]/88 border border-[#fbbf24]/40 rounded-2xl p-4 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.65)]">
            <div className="text-center pb-3 mb-3 border-b border-[#fbbf24]/25">
              <div
                style={{ fontFamily: "'Cinzel', serif" }}
                className="text-sm font-bold text-[#fde68a] tracking-wider"
              >
                3D Ayodhya World
              </div>
              <div className="text-[11px] font-sans text-[#e6d5b8]/80 mt-0.5">
                Section-by-Section Experience
              </div>
            </div>

            <div className="relative pl-4 space-y-3.5 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-gradient-to-b before:from-[#fbbf24] before:via-[#d97706] before:to-[#fbbf24]">
              {AYODHYA_SECTIONS.map((sec, idx) => {
                const isActive = activeSection === idx;
                return (
                  <button
                    key={sec.code}
                    onClick={() => jumpToSection(idx)}
                    className={`group relative w-full text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      isActive ? ' opacity-100' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* Timeline Glowing Node Dot */}
                    <span
                      className={` -ml-[15px] mt-1 w-3 h-3 rounded-full shrink-0 transition-all ${
                        isActive
                          ? 'bg-[#fef08a] ring-4 ring-[#fbbf24]/45 shadow-[0_0_12px_#fbbf24]'
                          : 'bg-[#b45309] border border-[#fde68a]/60 group-hover:bg-[#fbbf24]'
                      }`}
                    />
                    <div>
                      <div className="text-[11px] font-sans font-extrabold tracking-wider text-[#fbbf24]">
                        {sec.code}
                      </div>
                      <div
                        className={`text-xs font-serif leading-snug ${
                          isActive ? 'text-[#fffbeb] font-bold' : 'text-[#e6d5b8]'
                        }`}
                      >
                        {sec.shortName}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {onEnterEnding && (
              <button
                onClick={onEnterEnding}
                className="mt-4 pt-3 border-t border-[#fbbf24]/25 w-full text-left text-[11px] font-serif italic text-[#fde68a]/90 hover:text-[#fffbeb] transition-colors cursor-pointer"
              >
                (Leads to Final 2D Section: The Return to Ayodhya →)
              </button>
            )}
          </div>
        </aside>

        {/* =====================================================================
            RIGHT SIDEBAR: LIGHT MODE (DAYTIME) & DARK MODE (NIGHTTIME) CARDS
            Exact match to the right sidebar of `3d world -ref/image.png`!
        ===================================================================== */}
        <aside className="hidden xl:flex flex-col justify-center gap-3 absolute right-6 top-20 bottom-28 z-30 w-60 pointer-events-none">
          {/* Light Mode (Daytime) Card */}
          <div
            onClick={() => setLightingMode('day')}
            className={`pointer-events-auto rounded-2xl p-3.5 backdrop-blur-md transition-all cursor-pointer border ${
              !isNight
                ? 'bg-[#1f140a]/92 border-[#fbbf24] shadow-[0_0_24px_rgba(251,191,36,0.35)]'
                : 'bg-[#140e09]/80 border-[#fbbf24]/25 opacity-80 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-[#fbbf24]" />
                <div>
                  <div className="text-xs font-sans font-bold text-[#fffbeb]">
                    Light Mode
                  </div>
                  <div className="text-[10px] font-sans text-[#fde68a]/80">
                    (Daytime)
                  </div>
                </div>
              </div>
              {!isNight && (
                <span className="px-2 py-0.5 rounded-full bg-[#fbbf24] text-[#181009] text-[10px] font-sans font-extrabold uppercase">
                  Active
                </span>
              )}
            </div>
            <ul className="space-y-1 text-[11px] font-sans text-[#e6d5b8]">
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-[#fbbf24] shrink-0" />
                <span>Golden daylight</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-[#fbbf24] shrink-0" />
                <span>Ground crackers</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-[#fbbf24] shrink-0" />
                <span>Vibrant celebrations</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-[#fbbf24] shrink-0" />
                <span>Clear, rich details</span>
              </li>
            </ul>
          </div>

          {/* Dark Mode (Nighttime) Card */}
          <div
            onClick={() => setLightingMode('night')}
            className={`pointer-events-auto rounded-2xl p-3.5 backdrop-blur-md transition-all cursor-pointer border ${
              isNight
                ? 'bg-[#0f172a]/92 border-[#fbbf24] shadow-[0_0_24px_rgba(251,191,36,0.35)]'
                : 'bg-[#140e09]/80 border-[#fbbf24]/25 opacity-80 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-[#fde047]" />
                <div>
                  <div className="text-xs font-sans font-bold text-[#fffbeb]">
                    Dark Mode
                  </div>
                  <div className="text-[10px] font-sans text-[#fde68a]/80">
                    (Nighttime)
                  </div>
                </div>
              </div>
              {isNight && (
                <span className="px-2 py-0.5 rounded-full bg-[#fbbf24] text-[#181009] text-[10px] font-sans font-extrabold uppercase">
                  Active
                </span>
              )}
            </div>
            <ul className="space-y-1 text-[11px] font-sans text-[#e6d5b8]">
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-[#fbbf24] shrink-0" />
                <span>Illuminated Ayodhya</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-[#fbbf24] shrink-0" />
                <span>Sky fireworks</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-[#fbbf24] shrink-0" />
                <span>Thousands of diyas</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-[#fbbf24] shrink-0" />
                <span>Magical night ambience</span>
              </li>
            </ul>
          </div>

          {/* Auto Scroll-Cycle Mode Pill */}
          <button
            onClick={() => setLightingMode('auto')}
            className={`pointer-events-auto w-full py-2 px-3 rounded-xl text-xs font-sans font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              lightingMode === 'auto'
                ? 'bg-[#d97706]/90 text-[#fffbeb] border-[#fef08a]'
                : 'bg-[#160f09]/85 text-[#fde68a] border-[#fbbf24]/30 hover:border-[#fbbf24]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto Day → Night Scroll</span>
          </button>
        </aside>

        {/* =====================================================================
            BOTTOM BAR: SECTION STORY OVERLAY (Matching S1..S6 Badges in `image.png`)
            & QUICK MOBILE/TABLET CONTROLS
        ===================================================================== */}
        <div className="absolute bottom-4 inset-x-4 md:inset-x-8 z-30 flex flex-col md:flex-row items-stretch md:items-end justify-between gap-3 pointer-events-none">
          {/* Active Section Card (Exact S1..S6 Badge Style from `3d world -ref/image.png`) */}
          <div className="pointer-events-auto bg-[#160f09]/90 border border-[#fbbf24]/45 rounded-2xl p-4 max-w-xl backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.7)]">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#181009] font-sans font-extrabold text-xs tracking-wider shadow">
                {currentSec.code}
              </span>
              <h3
                style={{ fontFamily: "'Cinzel', serif" }}
                className="text-base md:text-xl font-bold text-[#fffbeb]"
              >
                {currentSec.title}
              </h3>
            </div>
            <p className="text-xs md:text-sm text-[#e6d5b8] leading-relaxed">
              {currentSec.subtitle}
            </p>
            <div className="mt-2.5 pt-2 border-t border-[#fbbf24]/20 flex flex-wrap items-center justify-between gap-2 text-[11px] font-sans text-[#fde68a]/85">
              <span>Drag to look 360° • Scroll to travel through Ayodhya</span>
              <button
                onClick={() => setSelectedLoreIdx(activeSection)}
                className="text-[#fbbf24] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ScrollText className="w-3 h-3" />
                <span>Read {currentSec.code} Lore Scroll</span>
              </button>
            </div>
          </div>

          {/* Compact Section Selector Pills & Day/Night Toggle */}
          <div className="pointer-events-auto bg-[#160f09]/90 border border-[#fbbf24]/45 rounded-2xl p-3 flex flex-col gap-2 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.7)]">
            <div className="flex items-center justify-between gap-3 text-[11px] font-sans text-[#fde68a]">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setLightingMode('day')}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer ${
                    !isNight ? 'bg-[#fbbf24] text-[#181009]' : 'bg-white/10 text-[#fde68a]'
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  <span>Day</span>
                </button>
                <button
                  onClick={() => setLightingMode('night')}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer ${
                    isNight ? 'bg-[#fbbf24] text-[#181009]' : 'bg-white/10 text-[#fde68a]'
                  }`}
                >
                  <Moon className="w-3 h-3" />
                  <span>Night</span>
                </button>
              </div>
              <span className="font-mono text-[#fbbf24] font-bold">
                {currentSec.code} • {scrollPct}%
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {AYODHYA_SECTIONS.map((sec, idx) => (
                <button
                  key={sec.code}
                  onClick={() => jumpToSection(idx)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer ${
                    activeSection === idx
                      ? 'bg-[#fbbf24] text-[#181009] shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                      : 'bg-white/5 text-[#f3e3c3] hover:bg-white/15'
                  }`}
                >
                  {sec.code}
                </button>
              ))}
              {scrollPct >= 90 && (
                <button
                  onClick={() => jumpToSection(0)}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-sans font-bold bg-[#dc2626] text-[#fffbeb] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Top</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =====================================================================
            ANCIENT AYODHYA INFO SCROLL MODAL ("Info Scroll" from Asset Kit!)
        ===================================================================== */}
        {activeLore && (
          <div
            onClick={() => setSelectedLoreIdx(null)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#2b180a] via-[#1c1008] to-[#140b05] border-2 border-[#fbbf24] p-6 shadow-[0_0_50px_rgba(251,191,36,0.4)] text-[#fffbeb]"
            >
              {/* Top & Bottom Scroll Roll Bars */}
              <div className=" -mt-8 mb-4 mx-auto w-[92%] h-4 rounded-full bg-gradient-to-r from-[#92400e] via-[#fbbf24] to-[#92400e] border border-[#181009] shadow-md" />

              <button
                onClick={() => setSelectedLoreIdx(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-[#fbbf24] text-[#fde68a] hover:text-[#181009] flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#fbbf24] mb-1">
                <Flame className="w-4 h-4 fill-[#fbbf24]" />
                <span>Royal Ayodhya Chronicle • {activeLore.code}</span>
              </div>

              <h4
                style={{ fontFamily: "'Cinzel', serif" }}
                className="text-xl font-bold text-[#fef08a] mb-3"
              >
                {activeLore.scrollLore.heading}
              </h4>

              <p className="text-sm text-[#f3e3c3] leading-relaxed mb-4">
                {activeLore.scrollLore.body}
              </p>

              <div className="bg-black/35 border border-[#fbbf24]/30 rounded-xl p-3.5 space-y-1.5">
                <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#fbbf24]">
                  Featured 3D Landmarks & Activities
                </div>
                {activeLore.scrollLore.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-sans text-[#fffbeb]">
                    <Check className="w-3.5 h-3.5 text-[#fbbf24] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setSelectedLoreIdx(null)}
                  className="px-5 py-2 rounded-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#181009] text-xs font-sans font-extrabold uppercase tracking-wider cursor-pointer"
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
