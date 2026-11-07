import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Articulated Stylised 3D Indian Citizen in Traditional Festive Attire
 * Matches the unified "Sacred Indian Epic Ink & Gold" palette.
 */
export function IndianCitizen({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  attireColor = '#c93b2b',
  secondaryColor = '#fbbf24',
  skinColor = '#c68652',
  isFemale = true,
  isChild = false,
  hasTurban = false,
  isPriest = false,
  action = 'namaste', // 'walk' | 'namaste' | 'light_diya' | 'offer_sweets' | 'sparkler' | 'aarti' | 'dance' | 'drum' | 'rangoli'
  walkRadius = 0,
  walkSpeed = 0.8,
  phaseOffset = 0,
  isNight = false,
}) {
  const groupRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const headRef = useRef();
  const bodyRef = useRef();
  const sparklerTipRef = useRef();

  const finalScale = isChild ? scale * 0.64 : scale;
  const basePos = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((state) => {
    const t = state.clock.elapsedTime + phaseOffset;
    if (!groupRef.current) return;

    // Walking path if walkRadius > 0
    if (action === 'walk' && walkRadius > 0) {
      const angle = t * walkSpeed * 0.4;
      groupRef.current.position.x = basePos.x + Math.cos(angle) * walkRadius;
      groupRef.current.position.z = basePos.z + Math.sin(angle) * (walkRadius * 0.45);
      groupRef.current.rotation.y = -angle + Math.PI / 2;
      groupRef.current.position.y = basePos.y + Math.abs(Math.sin(t * 5)) * 0.06;
    }

    // Head subtle lifelike nod/turn
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.5) * 0.14;
      headRef.current.rotation.x =
        action === 'light_diya' || action === 'rangoli'
          ? 0.35 + Math.sin(t * 2) * 0.08
          : Math.sin(t * 2) * 0.05;
    }

    // Body posture & animations by action
    if (bodyRef.current && leftArmRef.current && rightArmRef.current) {
      if (action === 'namaste') {
        bodyRef.current.rotation.x = Math.sin(t * 1.4) * 0.06 + 0.05;
        leftArmRef.current.rotation.x = -0.85;
        leftArmRef.current.rotation.z = -0.35;
        rightArmRef.current.rotation.x = -0.85;
        rightArmRef.current.rotation.z = 0.35;
      } else if (action === 'light_diya' || action === 'rangoli') {
        bodyRef.current.rotation.x = 0.42 + Math.sin(t * 2.2) * 0.08;
        groupRef.current.position.y = basePos.y - 0.18;
        rightArmRef.current.rotation.x = -1.1 + Math.sin(t * 3.5) * 0.25;
        rightArmRef.current.rotation.z = 0.15;
        leftArmRef.current.rotation.x = -0.7;
      } else if (action === 'offer_sweets') {
        bodyRef.current.rotation.x = Math.sin(t * 1.6) * 0.05;
        leftArmRef.current.rotation.x = -1.05 + Math.sin(t * 2) * 0.08;
        rightArmRef.current.rotation.x = -1.05 + Math.sin(t * 2) * 0.08;
      } else if (action === 'sparkler') {
        // Joyful child jumping and waving sparkler
        groupRef.current.position.y = basePos.y + Math.abs(Math.sin(t * 4.5)) * 0.14;
        bodyRef.current.rotation.y = Math.sin(t * 2.5) * 0.25;
        rightArmRef.current.rotation.x = -1.35 + Math.sin(t * 6) * 0.45;
        rightArmRef.current.rotation.z = Math.cos(t * 6) * 0.45;
        leftArmRef.current.rotation.x = -0.6 + Math.sin(t * 4) * 0.3;
      } else if (action === 'aarti') {
        // Priest performing circular Maha Aarti
        bodyRef.current.rotation.x = Math.sin(t * 1.8) * 0.06;
        const aartiCircleY = Math.sin(t * 2.8) * 0.45;
        const aartiCircleZ = Math.cos(t * 2.8) * 0.35;
        rightArmRef.current.rotation.x = -1.25 + aartiCircleY;
        rightArmRef.current.rotation.z = aartiCircleZ;
        leftArmRef.current.rotation.x = -1.1 + aartiCircleY * 0.8;
      } else if (action === 'dance') {
        groupRef.current.rotation.y = rotation[1] + Math.sin(t * 2.2) * 0.8;
        groupRef.current.position.y = basePos.y + Math.abs(Math.sin(t * 4.4)) * 0.12;
        leftArmRef.current.rotation.z = 0.85 + Math.sin(t * 4.4) * 0.35;
        leftArmRef.current.rotation.x = -0.6;
        rightArmRef.current.rotation.z = -0.85 - Math.cos(t * 4.4) * 0.35;
        rightArmRef.current.rotation.x = -0.6;
      } else if (action === 'drum') {
        bodyRef.current.rotation.z = Math.sin(t * 3.5) * 0.08;
        leftArmRef.current.rotation.x = -0.9 + Math.sin(t * 9) * 0.35;
        rightArmRef.current.rotation.x = -0.9 - Math.sin(t * 9) * 0.35;
      } else {
        // Default walk arm swing
        leftArmRef.current.rotation.x = Math.sin(t * 4.5) * 0.45;
        rightArmRef.current.rotation.x = -Math.sin(t * 4.5) * 0.45;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={finalScale}>
      <group ref={bodyRef}>
        {/* Lower Garment: Silk Sari Skirt or Festive Dhoti */}
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.34, 0.98, 12]} />
          <meshStandardMaterial
            color={isPriest ? '#f97316' : attireColor}
            roughness={0.45}
            metalness={0.15}
          />
        </mesh>

        {/* Gold Zari Border at Bottom of Sari / Dhoti */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.33, 0.35, 0.1, 12]} />
          <meshStandardMaterial color={secondaryColor} metalness={0.7} roughness={0.25} />
        </mesh>

        {/* Upper Torso / Kurta / Choli */}
        <mesh position={[0, 1.22, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.21, 0.56, 12]} />
          <meshStandardMaterial
            color={isPriest ? '#fde68a' : attireColor}
            roughness={0.4}
            metalness={0.15}
          />
        </mesh>

        {/* Diagonal Sari Pallu or Angavastram Drape */}
        <mesh position={[0.02, 1.22, 0.03]} rotation={[0, 0, -0.38]}>
          <boxGeometry args={[0.18, 0.66, 0.44]} />
          <meshStandardMaterial color={secondaryColor} metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Gold Necklace (Har) */}
        <mesh position={[0, 1.46, 0.04]} rotation={[Math.PI / 2 + 0.2, 0, 0]}>
          <torusGeometry args={[0.16, 0.028, 8, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.18} />
        </mesh>

        {/* Head Group */}
        <group ref={headRef} position={[0, 1.72, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.21, 16, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.55} />
          </mesh>

          {/* Sacred Red/Gold Tilak or Bindi on Forehead */}
          <mesh position={[0, 0.06, 0.2]}>
            <sphereGeometry args={[0.026, 8, 8]} />
            <meshBasicMaterial color="#dc2626" />
          </mesh>

          {/* Eyes */}
          <mesh position={[-0.065, 0.03, 0.19]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color="#181009" />
          </mesh>
          <mesh position={[0.065, 0.03, 0.19]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color="#181009" />
          </mesh>

          {/* Hair / Juda Bun with Gajra Flowers or Royal Pagri Turban */}
          {hasTurban ? (
            <group position={[0, 0.12, -0.02]}>
              <mesh>
                <torusGeometry args={[0.16, 0.09, 10, 18]} />
                <meshStandardMaterial color={secondaryColor} roughness={0.35} />
              </mesh>
              <mesh position={[0, 0.06, 0]}>
                <sphereGeometry args={[0.16, 12, 12]} />
                <meshStandardMaterial color={attireColor} roughness={0.35} />
              </mesh>
            </group>
          ) : (
            <group>
              <mesh position={[0, 0.05, -0.04]}>
                <sphereGeometry args={[0.215, 14, 14]} />
                <meshStandardMaterial color="#181009" roughness={0.7} />
              </mesh>
              {isFemale && (
                <group position={[0, 0.02, -0.24]}>
                  <mesh>
                    <sphereGeometry args={[0.11, 10, 10]} />
                    <meshStandardMaterial color="#181009" />
                  </mesh>
                  {/* Jasmine Gajra Flower Ring around Hair Bun */}
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.11, 0.025, 8, 14]} />
                    <meshStandardMaterial color="#fffbeb" emissive="#fef3c7" emissiveIntensity={0.2} />
                  </mesh>
                </group>
              )}
            </group>
          )}
        </group>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.29, 1.42, 0]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <capsuleGeometry args={[0.065, 0.38, 6, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          {/* Gold Bangle */}
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.072, 0.072, 0.05, 10]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Right Arm + Action Props */}
        <group ref={rightArmRef} position={[0.29, 1.42, 0]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <capsuleGeometry args={[0.065, 0.38, 6, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.072, 0.072, 0.05, 10]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Prop: Brass Sweet Thali (for 'offer_sweets') */}
          {action === 'offer_sweets' && (
            <group position={[-0.22, -0.48, 0.22]}>
              <mesh>
                <cylinderGeometry args={[0.26, 0.2, 0.04, 16]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.15} />
              </mesh>
              {/* Golden Laddoos on Thali */}
              {[
                [-0.08, 0.05, 0],
                [0.08, 0.05, 0],
                [0, 0.05, 0.08],
                [0, 0.05, -0.08],
                [0, 0.09, 0],
              ].map((lp, idx) => (
                <mesh key={idx} position={lp}>
                  <sphereGeometry args={[0.048, 8, 8]} />
                  <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.25} />
                </mesh>
              ))}
            </group>
          )}

          {/* Prop: Multi-tiered Flaming Maha Aarti Lamp (for 'aarti') */}
          {action === 'aarti' && (
            <group position={[-0.12, -0.48, 0.28]}>
              <mesh>
                <cylinderGeometry args={[0.22, 0.08, 0.16, 12]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
              </mesh>
              <mesh position={[0, 0.16, 0]}>
                <coneGeometry args={[0.14, 0.28, 10]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
              <pointLight color="#fbbf24" intensity={isNight ? 4 : 1.5} distance={6} />
            </group>
          )}

          {/* Prop: Glowing Phuljhari Hand Sparkler (for 'sparkler') */}
          {action === 'sparkler' && (
            <group ref={sparklerTipRef} position={[0, -0.52, 0.18]} rotation={[Math.PI / 3, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.012, 0.012, 0.45, 6]} />
                <meshStandardMaterial color="#d4d4d8" metalness={0.8} />
              </mesh>
              <mesh position={[0, -0.24, 0]}>
                <dodecahedronGeometry args={[0.12, 1]} />
                <meshBasicMaterial color="#fef9c3" />
              </mesh>
              <pointLight position={[0, -0.24, 0]} color="#fde047" intensity={2.2} distance={4} />
            </group>
          )}
        </group>

        {/* Prop: Dhol Drum strapped to chest (for 'drum') */}
        {action === 'drum' && (
          <group position={[0, 1.02, 0.28]} rotation={[0, 0, Math.PI / 2]}>
            <mesh>
              <cylinderGeometry args={[0.18, 0.18, 0.46, 14]} />
              <meshStandardMaterial color="#92400e" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.235, 0]}>
              <cylinderGeometry args={[0.185, 0.185, 0.02, 14]} />
              <meshStandardMaterial color="#fef3c7" />
            </mesh>
            <mesh position={[0, -0.235, 0]}>
              <cylinderGeometry args={[0.185, 0.185, 0.02, 14]} />
              <meshStandardMaterial color="#fef3c7" />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}

/**
 * Caparisoned Royal Ayodhya Elephant with Golden Howdah & Swinging Trunk
 */
export function RoyalElephant({ position = [0, 0, 0], rotation = [0, 0, 0], walkPath = 0 }) {
  const groupRef = useRef();
  const trunkRef = useRef();
  const earsRef = useRef();
  const baseZ = position[2];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (trunkRef.current) {
      trunkRef.current.rotation.x = Math.sin(t * 2) * 0.25 + 0.2;
      trunkRef.current.rotation.z = Math.cos(t * 1.5) * 0.15;
    }
    if (earsRef.current) {
      earsRef.current.scale.x = 1 + Math.sin(t * 3) * 0.08;
    }
    if (groupRef.current && walkPath > 0) {
      groupRef.current.position.z = baseZ + Math.sin(t * 0.35) * walkPath;
      groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 2.4)) * 0.06;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Sculpted Elephant Body */}
      <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.65, 1.55, 2.55]} />
        <meshStandardMaterial color="#4b5563" roughness={0.7} />
      </mesh>

      {/* Ornate Crimson & Gold Caparison Jhul (Royal Blanket) */}
      <mesh position={[0, 2.02, 0]} castShadow>
        <boxGeometry args={[1.74, 1.15, 2.1]} />
        <meshStandardMaterial color="#991b1b" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.48, 0]}>
        <boxGeometry args={[1.78, 0.16, 2.14]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 4 Pillar Legs with Golden Anklets */}
      {[
        [-0.55, 0.65, 0.85],
        [0.55, 0.65, 0.85],
        [-0.55, 0.65, -0.85],
        [0.55, 0.65, -0.85],
      ].map((lp, i) => (
        <group key={i} position={lp}>
          <mesh castShadow>
            <cylinderGeometry args={[0.28, 0.32, 1.3, 12]} />
            <meshStandardMaterial color="#4b5563" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.33, 0.33, 0.12, 12]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Head, Painted Forehead Mandala, Ears, Tusks & Trunk */}
      <group position={[0, 2.35, 1.45]}>
        <mesh castShadow>
          <sphereGeometry args={[0.78, 16, 16]} />
          <meshStandardMaterial color="#4b5563" roughness={0.65} />
        </mesh>
        {/* Festive Golden Forehead Cap (Nettipattam) */}
        <mesh position={[0, 0.18, 0.68]} rotation={[0.2, 0, 0]}>
          <coneGeometry args={[0.45, 0.7, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Flapping Ears */}
        <group ref={earsRef}>
          <mesh position={[-0.82, 0.05, -0.1]} rotation={[0, -0.3, 0]}>
            <boxGeometry args={[0.55, 0.85, 0.12]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
          <mesh position={[0.82, 0.05, -0.1]} rotation={[0, 0.3, 0]}>
            <boxGeometry args={[0.55, 0.85, 0.12]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        </group>
        {/* Ivory Tusks */}
        <mesh position={[-0.38, -0.35, 0.68]} rotation={[0.65, 0, 0]}>
          <coneGeometry args={[0.09, 0.85, 10]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.2} />
        </mesh>
        <mesh position={[0.38, -0.35, 0.68]} rotation={[0.65, 0, 0]}>
          <coneGeometry args={[0.09, 0.85, 10]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.2} />
        </mesh>
        {/* Swinging Trunk */}
        <group ref={trunkRef} position={[0, -0.25, 0.68]}>
          <mesh position={[0, -0.65, 0.12]}>
            <cylinderGeometry args={[0.22, 0.12, 1.35, 12]} />
            <meshStandardMaterial color="#4b5563" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* Royal Golden Howdah Pavilion on Back */}
      <group position={[0, 2.75, -0.1]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[1.35, 0.35, 1.55]} />
          <meshStandardMaterial color="#d97706" metalness={0.75} roughness={0.25} />
        </mesh>
        {/* 4 Corner Pillars */}
        {[
          [-0.55, 0.75, 0.65],
          [0.55, 0.75, 0.65],
          [-0.55, 0.75, -0.65],
          [0.55, 0.75, -0.65],
        ].map((pp, idx) => (
          <mesh key={idx} position={pp}>
            <cylinderGeometry args={[0.06, 0.06, 1.1, 8]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
          </mesh>
        ))}
        {/* Golden Chhatri Dome Roof */}
        <mesh position={[0, 1.35, 0]}>
          <sphereGeometry args={[0.88, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.18} />
        </mesh>
        <mesh position={[0, 2.35, 0]}>
          <coneGeometry args={[0.14, 0.4, 8]} />
          <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Ornate Royal Wooden & Gold Ratha Chariot
 */
export function RoyalChariot({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const wheel1Ref = useRef();
  const wheel2Ref = useRef();
  const wheel3Ref = useRef();
  const wheel4Ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * 1.5;
    [wheel1Ref, wheel2Ref, wheel3Ref, wheel4Ref].forEach((w) => {
      if (w.current) w.current.rotation.x = t;
    });
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Chariot Base Platform */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[2.1, 0.45, 2.8]} />
        <meshStandardMaterial color="#92400e" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.12, 0]}>
        <boxGeometry args={[2.18, 0.14, 2.88]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* 4 Spoked Golden Chariot Wheels */}
      {[
        { ref: wheel1Ref, pos: [-1.12, 0.65, 0.85] },
        { ref: wheel2Ref, pos: [1.12, 0.65, 0.85] },
        { ref: wheel3Ref, pos: [-1.12, 0.65, -0.85] },
        { ref: wheel4Ref, pos: [1.12, 0.65, -0.85] },
      ].map((w, i) => (
        <group key={i} ref={w.ref} position={w.pos} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.65, 0.65, 0.14, 18]} />
            <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 0.2, 12]} />
            <meshStandardMaterial color="#fef08a" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Ornate Shikhar Canopy of Chariot */}
      {[
        [-0.85, 1.95, 1.05],
        [0.85, 1.95, 1.05],
        [-0.85, 1.95, -1.05],
        [0.85, 1.95, -1.05],
      ].map((cp, i) => (
        <mesh key={i} position={cp}>
          <cylinderGeometry args={[0.08, 0.1, 1.65, 10]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 3.05, 0]} castShadow>
        <coneGeometry args={[1.55, 1.4, 8]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.35} />
      </mesh>
      <mesh position={[0, 3.9, 0]}>
        <coneGeometry args={[0.65, 0.9, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

/**
 * Intricate 3D Mandala Rangoli with Perimeter Diyas
 */
export function RangoliMandala({ position = [0, 0.02, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Outer Crimson Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.45, 24]} />
        <meshStandardMaterial color="#dc2626" emissive="#991b1b" emissiveIntensity={0.35} />
      </mesh>
      {/* Marigold Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[0.75, 1.1, 16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.45} />
      </mesh>
      {/* Emerald Star Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.42, 0.75, 8]} />
        <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.35} />
      </mesh>
      {/* Center Lotus Core */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[0.42, 16]} />
        <meshStandardMaterial color="#fef08a" emissive="#fde047" emissiveIntensity={0.6} />
      </mesh>
      {/* 8 Glowing Diyas around Rangoli */}
      {Array.from({ length: 8 }).map((_, i) => {
        const ang = (i / 8) * Math.PI * 2;
        return (
          <group key={i} position={[Math.cos(ang) * 1.32, 0.06, Math.sin(ang) * 1.32]}>
            <mesh>
              <cylinderGeometry args={[0.11, 0.06, 0.08, 10]} />
              <meshStandardMaterial color="#9a3412" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <coneGeometry args={[0.055, 0.15, 8]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * Ground Crackers FX: Anar (Flowerpot Fountain) & Chakri (Spinning Ground Wheel)
 */
export function GroundCrackerFX({ position = [0, 0, 0], type = 'anar', isNight = false }) {
  const pointsRef = useRef();
  const chakriDiscRef = useRef();
  const count = type === 'anar' ? 90 : 60;

  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = [];
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color('#fef08a');
    const c2 = new THREE.Color(type === 'anar' ? '#f97316' : '#34d399');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = Math.random() * 1.8;
      pos[i * 3 + 2] = 0;
      vel.push({
        vx: (Math.random() - 0.5) * 1.6,
        vy: 1.8 + Math.random() * 2.8,
        vz: (Math.random() - 0.5) * 1.6,
        life: Math.random(),
      });
      const mixed = c1.clone().lerp(c2, Math.random());
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return { positions: pos, velocities: vel, colors: col };
  }, [count, type]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array;

    for (let i = 0; i < count; i++) {
      const v = velocities[i];
      v.life += delta * (type === 'anar' ? 1.4 : 2.2);
      if (v.life > 1) v.life = 0;

      if (type === 'anar') {
        // Fountain arc
        const t = v.life;
        arr[i * 3] = v.vx * t;
        arr[i * 3 + 1] = 0.2 + v.vy * t - 2.6 * t * t;
        arr[i * 3 + 2] = v.vz * t;
      } else {
        // Chakri spiral on ground
        const angle = v.life * Math.PI * 6 + i;
        const rad = 0.15 + v.life * 1.35;
        arr[i * 3] = Math.cos(angle) * rad;
        arr[i * 3 + 1] = 0.08 + (1 - v.life) * 0.22;
        arr[i * 3 + 2] = Math.sin(angle) * rad;
      }
    }
    posAttr.needsUpdate = true;

    if (chakriDiscRef.current) {
      chakriDiscRef.current.rotation.y += delta * 18;
    }
  });

  return (
    <group position={position}>
      {type === 'anar' ? (
        <mesh position={[0, 0.16, 0]}>
          <coneGeometry args={[0.16, 0.32, 12]} />
          <meshStandardMaterial color="#d97706" metalness={0.5} />
        </mesh>
      ) : (
        <mesh ref={chakriDiscRef} position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.06, 12]} />
          <meshBasicMaterial color="#34d399" />
        </mesh>
      )}

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isNight ? 0.22 : 0.18}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <pointLight
        position={[0, 0.8, 0]}
        color={type === 'anar' ? '#fbbf24' : '#34d399'}
        intensity={isNight ? 4.5 : 2}
        distance={7}
      />
    </group>
  );
}

/**
 * Aerial Fireworks Burst System for Night Mode Sky
 */
export function AerialFireworksFX({ isNight = true }) {
  const bursts = useMemo(
    () => [
      { pos: [-26, 26, -65], color: '#fbbf24', speed: 0.7, offset: 0 },
      { pos: [24, 30, -75], color: '#f43f5e', speed: 0.85, offset: 1.4 },
      { pos: [0, 34, -95], color: '#fde047', speed: 0.65, offset: 2.8 },
      { pos: [-34, 28, -110], color: '#38bdf8', speed: 0.75, offset: 4.1 },
      { pos: [32, 32, -120], color: '#f97316', speed: 0.8, offset: 5.2 },
    ],
    []
  );

  return (
    <group visible={isNight}>
      {bursts.map((b, idx) => (
        <SingleFireworkBurst key={idx} {...b} />
      ))}
    </group>
  );
}

function SingleFireworkBurst({ pos, color, speed, offset }) {
  const pointsRef = useRef();
  const lightRef = useRef();
  const count = 96;

  const { baseDirs, positions } = useMemo(() => {
    const dirs = [];
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 6 + Math.random() * 6;
      dirs.push({
        dx: Math.sin(phi) * Math.cos(theta) * r,
        dy: Math.sin(phi) * Math.sin(theta) * r,
        dz: Math.cos(phi) * r,
      });
    }
    return { baseDirs: dirs, positions: p };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const cycle = ((state.clock.elapsedTime * speed + offset) % 3.2) / 3.2;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array;

    const ease = 1 - Math.pow(1 - cycle, 3);
    for (let i = 0; i < count; i++) {
      const d = baseDirs[i];
      arr[i * 3] = d.dx * ease;
      arr[i * 3 + 1] = d.dy * ease - cycle * cycle * 3.5;
      arr[i * 3 + 2] = d.dz * ease;
    }
    posAttr.needsUpdate = true;
    pointsRef.current.material.opacity = Math.max(0, 1 - Math.pow(cycle, 1.8));
    if (lightRef.current) {
      lightRef.current.intensity = (1 - cycle) * 14;
    }
  });

  return (
    <group position={pos}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.55}
          color={color}
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <pointLight ref={lightRef} color={color} intensity={8} distance={45} />
    </group>
  );
}

