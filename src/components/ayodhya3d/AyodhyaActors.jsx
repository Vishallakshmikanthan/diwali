import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getRangoliTexture } from './AyodhyaTextures';

/**
 * 1. ARTICULATED 3D INDIAN CITIZEN / GUARD / DANCER / MUSICIAN / PRIEST / CHILD
 * Matches all 8 Character Archetypes in "Diwali Ayodhya 3D World — Asset Kit"
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
  isElder = false,
  hasTurban = false,
  isPriest = false,
  isGuard = false,
  action = 'namaste', // 'walk' | 'namaste' | 'light_diya' | 'float_diya' | 'offer_sweets' | 'sparkler' | 'aarti' | 'dance' | 'drum' | 'shehnai' | 'rangoli' | 'guard'
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
  const skirtRef = useRef();

  const finalScale = isChild ? scale * 0.65 : scale;
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
      headRef.current.rotation.y =
        action === 'guard' ? Math.sin(t * 0.8) * 0.08 : Math.sin(t * 1.5) * 0.15;
      headRef.current.rotation.x =
        action === 'light_diya' || action === 'rangoli' || action === 'float_diya'
          ? 0.35 + Math.sin(t * 2) * 0.08
          : Math.sin(t * 2) * 0.05;
    }

    // Body posture & animations by action
    if (bodyRef.current && leftArmRef.current && rightArmRef.current) {
      if (action === 'guard' || isGuard) {
        // Noble upright guard stance holding spear
        bodyRef.current.rotation.x = Math.sin(t * 1.2) * 0.02;
        rightArmRef.current.rotation.x = -0.35;
        rightArmRef.current.rotation.z = -0.1;
        leftArmRef.current.rotation.x = -0.55;
        leftArmRef.current.rotation.z = 0.2;
      } else if (action === 'namaste') {
        bodyRef.current.rotation.x = Math.sin(t * 1.4) * 0.06 + 0.05;
        leftArmRef.current.rotation.x = -0.88;
        leftArmRef.current.rotation.z = -0.38;
        rightArmRef.current.rotation.x = -0.88;
        rightArmRef.current.rotation.z = 0.38;
      } else if (action === 'light_diya' || action === 'rangoli' || action === 'float_diya') {
        bodyRef.current.rotation.x = 0.46 + Math.sin(t * 2.2) * 0.08;
        groupRef.current.position.y = basePos.y - 0.22;
        rightArmRef.current.rotation.x = -1.15 + Math.sin(t * 3.2) * 0.22;
        rightArmRef.current.rotation.z = 0.15;
        leftArmRef.current.rotation.x = -0.85;
      } else if (action === 'offer_sweets') {
        bodyRef.current.rotation.x = Math.sin(t * 1.6) * 0.05;
        leftArmRef.current.rotation.x = -1.05 + Math.sin(t * 2) * 0.08;
        rightArmRef.current.rotation.x = -1.05 + Math.sin(t * 2) * 0.08;
      } else if (action === 'sparkler') {
        // Joyful child jumping and waving Phuljhari sparkler
        groupRef.current.position.y = basePos.y + Math.abs(Math.sin(t * 4.6)) * 0.15;
        bodyRef.current.rotation.y = Math.sin(t * 2.5) * 0.28;
        rightArmRef.current.rotation.x = -1.35 + Math.sin(t * 6.5) * 0.45;
        rightArmRef.current.rotation.z = Math.cos(t * 6.5) * 0.45;
        leftArmRef.current.rotation.x = -0.6 + Math.sin(t * 4) * 0.3;
      } else if (action === 'aarti') {
        // Priest performing circular Maha Aarti
        bodyRef.current.rotation.x = Math.sin(t * 1.8) * 0.06;
        const aartiCircleY = Math.sin(t * 2.8) * 0.48;
        const aartiCircleZ = Math.cos(t * 2.8) * 0.38;
        rightArmRef.current.rotation.x = -1.25 + aartiCircleY;
        rightArmRef.current.rotation.z = aartiCircleZ;
        leftArmRef.current.rotation.x = -1.1 + aartiCircleY * 0.8;
      } else if (action === 'dance') {
        // Classical Kathak/Bharatanatyam spin & mudra arms
        groupRef.current.rotation.y = rotation[1] + Math.sin(t * 2.2) * 1.15;
        groupRef.current.position.y = basePos.y + Math.abs(Math.sin(t * 4.4)) * 0.12;
        leftArmRef.current.rotation.z = 0.95 + Math.sin(t * 4.4) * 0.38;
        leftArmRef.current.rotation.x = -0.65;
        rightArmRef.current.rotation.z = -0.95 - Math.cos(t * 4.4) * 0.38;
        rightArmRef.current.rotation.x = -0.65;
        if (skirtRef.current) {
          skirtRef.current.rotation.y = t * 3.5;
        }
      } else if (action === 'drum') {
        bodyRef.current.rotation.z = Math.sin(t * 3.8) * 0.09;
        leftArmRef.current.rotation.x = -0.95 + Math.sin(t * 9.5) * 0.38;
        rightArmRef.current.rotation.x = -0.95 - Math.sin(t * 9.5) * 0.38;
      } else if (action === 'shehnai') {
        bodyRef.current.rotation.x = -0.08 + Math.sin(t * 2.4) * 0.06;
        leftArmRef.current.rotation.x = -1.35;
        leftArmRef.current.rotation.z = -0.25;
        rightArmRef.current.rotation.x = -1.35;
        rightArmRef.current.rotation.z = 0.25;
      } else {
        // Default walk arm swing
        leftArmRef.current.rotation.x = Math.sin(t * 4.5) * 0.45;
        rightArmRef.current.rotation.x = -Math.sin(t * 4.5) * 0.45;
      }
    }
  });

  const isDancer = action === 'dance';

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={finalScale}>
      <group ref={bodyRef}>
        {/* Lower Garment: Flared Dancer Lehenga, Silk Sari, or Dhoti */}
        <group ref={skirtRef}>
          <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
            <cylinderGeometry
              args={[0.22, isDancer ? 0.56 : 0.35, 0.98, isDancer ? 16 : 12]}
            />
            <meshStandardMaterial
              color={isPriest ? '#f97316' : isGuard ? '#991b1b' : attireColor}
              roughness={0.42}
              metalness={0.16}
            />
          </mesh>

          {/* Gold Zari Border at Bottom of Garment */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry
              args={[isDancer ? 0.54 : 0.34, isDancer ? 0.58 : 0.36, 0.12, 16]}
            />
            <meshStandardMaterial color={secondaryColor} metalness={0.78} roughness={0.22} />
          </mesh>
        </group>

        {/* Upper Torso / Kurta / Choli / Royal Armor */}
        <mesh position={[0, 1.22, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.21, 0.56, 12]} />
          <meshStandardMaterial
            color={
              isGuard
                ? '#fbbf24'
                : isPriest
                ? '#fde68a'
                : attireColor
            }
            roughness={isGuard ? 0.22 : 0.4}
            metalness={isGuard ? 0.85 : 0.15}
          />
        </mesh>

        {/* Royal Guard Shoulder Pauldrons & Chest Crest */}
        {isGuard ? (
          <group>
            <mesh position={[-0.31, 1.44, 0]}>
              <sphereGeometry args={[0.13, 10, 10]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0.31, 1.44, 0]}>
              <sphereGeometry args={[0.13, 10, 10]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
            </mesh>
          </group>
        ) : (
          /* Diagonal Sari Pallu, Dupatta or Angavastram Drape */
          <mesh position={[0.02, 1.22, 0.03]} rotation={[0, 0, -0.38]}>
            <boxGeometry args={[0.18, 0.66, 0.44]} />
            <meshStandardMaterial
              color={isPriest ? '#fffbeb' : secondaryColor}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        )}

        {/* Gold Necklace (Har) */}
        <mesh position={[0, 1.46, 0.04]} rotation={[Math.PI / 2 + 0.2, 0, 0]}>
          <torusGeometry args={[0.16, 0.03, 8, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.16} />
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

          {/* Priest Sage Beard */}
          {isPriest && (
            <mesh position={[0, -0.14, 0.14]}>
              <coneGeometry args={[0.12, 0.26, 8]} rotation={[Math.PI, 0, 0]} />
              <meshStandardMaterial color="#e5e7eb" roughness={0.7} />
            </mesh>
          )}

          {/* Headgear: Guard Golden Helmet, Royal Pagri Turban, or Hair Bun with Jasmine Gajra */}
          {isGuard ? (
            <group position={[0, 0.12, 0]}>
              <mesh>
                <coneGeometry args={[0.22, 0.45, 10]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.92} roughness={0.12} />
              </mesh>
              <mesh position={[0, 0.26, 0]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshBasicMaterial color="#dc2626" />
              </mesh>
            </group>
          ) : hasTurban ? (
            <group position={[0, 0.12, -0.02]}>
              <mesh>
                <torusGeometry args={[0.16, 0.09, 10, 18]} />
                <meshStandardMaterial color={secondaryColor} roughness={0.35} />
              </mesh>
              <mesh position={[0, 0.06, 0]}>
                <sphereGeometry args={[0.16, 12, 12]} />
                <meshStandardMaterial color={attireColor} roughness={0.35} />
              </mesh>
              {/* Turban Kalgi Plume */}
              <mesh position={[0, 0.16, 0.14]} rotation={[-0.3, 0, 0]}>
                <coneGeometry args={[0.05, 0.18, 6]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} />
              </mesh>
            </group>
          ) : (
            <group>
              <mesh position={[0, 0.05, -0.04]}>
                <sphereGeometry args={[0.215, 14, 14]} />
                <meshStandardMaterial
                  color={isElder || isPriest ? '#d1d5db' : '#181009'}
                  roughness={0.7}
                />
              </mesh>
              {(isFemale || isPriest) && (
                <group position={[0, 0.02, -0.24]}>
                  <mesh>
                    <sphereGeometry args={[0.11, 10, 10]} />
                    <meshStandardMaterial
                      color={isElder || isPriest ? '#d1d5db' : '#181009'}
                    />
                  </mesh>
                  {isFemale && (
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                      <torusGeometry args={[0.11, 0.026, 8, 14]} />
                      <meshStandardMaterial
                        color="#fffbeb"
                        emissive="#fef3c7"
                        emissiveIntensity={0.25}
                      />
                    </mesh>
                  )}
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
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.072, 0.072, 0.05, 10]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Guard Golden Shield on Left Arm */}
          {isGuard && (
            <mesh position={[-0.12, -0.32, 0.12]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 0.04, 14]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
            </mesh>
          )}
        </group>

        {/* Right Arm + Specialized Action Props */}
        <group ref={rightArmRef} position={[0.29, 1.42, 0]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <capsuleGeometry args={[0.065, 0.38, 6, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.072, 0.072, 0.05, 10]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Prop 1: Royal Guard Spear (Bhala) */}
          {isGuard && (
            <group position={[0.08, -0.1, 0.15]} rotation={[0.35, 0, 0]}>
              <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 2.7, 8]} />
                <meshStandardMaterial color="#b45309" metalness={0.6} />
              </mesh>
              <mesh position={[0, 1.85, 0]}>
                <coneGeometry args={[0.08, 0.38, 6]} />
                <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.08} />
              </mesh>
            </group>
          )}

          {/* Prop 2: Brass Sweet Thali (for 'offer_sweets') */}
          {action === 'offer_sweets' && (
            <group position={[-0.22, -0.48, 0.22]}>
              <mesh>
                <cylinderGeometry args={[0.28, 0.22, 0.045, 16]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.15} />
              </mesh>
              {[
                [-0.09, 0.05, 0],
                [0.09, 0.05, 0],
                [0, 0.05, 0.09],
                [0, 0.05, -0.09],
                [0, 0.1, 0],
              ].map((lp, idx) => (
                <mesh key={idx} position={lp}>
                  <sphereGeometry args={[0.052, 8, 8]} />
                  <meshStandardMaterial
                    color="#f59e0b"
                    emissive="#d97706"
                    emissiveIntensity={0.3}
                  />
                </mesh>
              ))}
            </group>
          )}

          {/* Prop 3: Glowing Diya Platter (for 'light_diya' or 'float_diya') */}
          {(action === 'light_diya' || action === 'float_diya') && (
            <group position={[-0.18, -0.46, 0.22]}>
              <mesh>
                <cylinderGeometry args={[0.22, 0.16, 0.04, 12]} />
                <meshStandardMaterial color="#9a3412" roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.08, 0]}>
                <coneGeometry args={[0.065, 0.18, 8]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
              <pointLight color="#fbbf24" intensity={isNight ? 3 : 1} distance={4} />
            </group>
          )}

          {/* Prop 4: Multi-tiered Flaming Maha Aarti Lamp (for 'aarti') */}
          {action === 'aarti' && (
            <group position={[-0.12, -0.48, 0.28]}>
              <mesh>
                <cylinderGeometry args={[0.24, 0.09, 0.18, 12]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.92} roughness={0.12} />
              </mesh>
              {[-0.1, 0, 0.1].map((fx, fi) => (
                <mesh key={fi} position={[fx, 0.16, 0]}>
                  <coneGeometry args={[0.06, 0.22, 8]} />
                  <meshBasicMaterial color="#fef08a" />
                </mesh>
              ))}
              <pointLight color="#fbbf24" intensity={isNight ? 5 : 2} distance={7} />
            </group>
          )}

          {/* Prop 5: Glowing Phuljhari Hand Sparkler (for 'sparkler') */}
          {action === 'sparkler' && (
            <group position={[0, -0.52, 0.18]} rotation={[Math.PI / 3, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.012, 0.012, 0.48, 6]} />
                <meshStandardMaterial color="#d4d4d8" metalness={0.8} />
              </mesh>
              <mesh position={[0, -0.25, 0]}>
                <dodecahedronGeometry args={[0.14, 1]} />
                <meshBasicMaterial color="#fef9c3" />
              </mesh>
              <pointLight position={[0, -0.25, 0]} color="#fde047" intensity={2.8} distance={5} />
            </group>
          )}

          {/* Prop 6: Golden Shehnai Wind Horn (for 'shehnai') */}
          {action === 'shehnai' && (
            <group position={[-0.25, -0.28, 0.25]} rotation={[Math.PI / 2.4, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.02, 0.11, 0.55, 10]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
              </mesh>
            </group>
          )}
        </group>

        {/* Prop 7: Dhol Drum strapped to chest (for 'drum') */}
        {action === 'drum' && (
          <group position={[0, 1.02, 0.29]} rotation={[0, 0, Math.PI / 2]}>
            <mesh>
              <cylinderGeometry args={[0.19, 0.19, 0.48, 14]} />
              <meshStandardMaterial color="#92400e" roughness={0.45} />
            </mesh>
            <mesh position={[0, 0.245, 0]}>
              <cylinderGeometry args={[0.195, 0.195, 0.02, 14]} />
              <meshStandardMaterial color="#fef3c7" />
            </mesh>
            <mesh position={[0, -0.245, 0]}>
              <cylinderGeometry args={[0.195, 0.195, 0.02, 14]} />
              <meshStandardMaterial color="#fef3c7" />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}

/**
 * 2. ROYAL ELEPHANT (GAJARAJ) — Exact match to "Elephant" in Asset Kit
 * Sculpted body, crimson & gold embroidered Jhul blanket, Nettipattam forehead ornament,
 * ivory tusks, swinging trunk, flapping ears, and golden Howdah dome.
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
        <boxGeometry args={[1.7, 1.58, 2.6]} />
        <meshStandardMaterial color="#4b5563" roughness={0.68} />
      </mesh>

      {/* Ornate Crimson & Gold Caparison Jhul (Royal Blanket) */}
      <mesh position={[0, 2.04, 0]} castShadow>
        <boxGeometry args={[1.78, 1.18, 2.15]} />
        <meshStandardMaterial color="#991b1b" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.48, 0]}>
        <boxGeometry args={[1.82, 0.18, 2.2]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* 4 Pillar Legs with Golden Anklets */}
      {[
        [-0.56, 0.65, 0.88],
        [0.56, 0.65, 0.88],
        [-0.56, 0.65, -0.88],
        [0.56, 0.65, -0.88],
      ].map((lp, i) => (
        <group key={i} position={lp}>
          <mesh castShadow>
            <cylinderGeometry args={[0.29, 0.33, 1.3, 12]} />
            <meshStandardMaterial color="#4b5563" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.12, 12]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Head, Golden Nettipattam Forehead Cap, Ears, Ivory Tusks & Trunk */}
      <group position={[0, 2.35, 1.48]}>
        <mesh castShadow>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial color="#4b5563" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.18, 0.7]} rotation={[0.2, 0, 0]}>
          <coneGeometry args={[0.46, 0.72, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.18} />
        </mesh>
        <group ref={earsRef}>
          <mesh position={[-0.84, 0.05, -0.1]} rotation={[0, -0.3, 0]}>
            <boxGeometry args={[0.56, 0.88, 0.12]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
          <mesh position={[0.84, 0.05, -0.1]} rotation={[0, 0.3, 0]}>
            <boxGeometry args={[0.56, 0.88, 0.12]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        </group>
        <mesh position={[-0.38, -0.35, 0.7]} rotation={[0.65, 0, 0]}>
          <coneGeometry args={[0.09, 0.88, 10]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.2} />
        </mesh>
        <mesh position={[0.38, -0.35, 0.7]} rotation={[0.65, 0, 0]}>
          <coneGeometry args={[0.09, 0.88, 10]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.2} />
        </mesh>
        <group ref={trunkRef} position={[0, -0.25, 0.7]}>
          <mesh position={[0, -0.65, 0.12]}>
            <cylinderGeometry args={[0.22, 0.12, 1.38, 12]} />
            <meshStandardMaterial color="#4b5563" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* Royal Golden Howdah Pavilion on Back */}
      <group position={[0, 2.75, -0.1]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[1.38, 0.35, 1.58]} />
          <meshStandardMaterial color="#d97706" metalness={0.78} roughness={0.22} />
        </mesh>
        {[
          [-0.56, 0.75, 0.66],
          [0.56, 0.75, 0.66],
          [-0.56, 0.75, -0.66],
          [0.56, 0.75, -0.66],
        ].map((pp, idx) => (
          <mesh key={idx} position={pp}>
            <cylinderGeometry args={[0.06, 0.06, 1.1, 8]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
          </mesh>
        ))}
        <mesh position={[0, 1.35, 0]}>
          <sphereGeometry args={[0.9, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.16} />
        </mesh>
        <mesh position={[0, 2.38, 0]}>
          <coneGeometry args={[0.14, 0.42, 8]} />
          <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 3. DECORATED ROYAL HORSE (ASHWA) — Exact match to "Horse" in Asset Kit
 * Majestic white royal stallion with crimson-and-gold saddle blanket, bridle, and plume.
 */
export function RoyalHorse({ position = [0, 0, 0], rotation = [0, 0, 0], phaseOffset = 0 }) {
  const headGroupRef = useRef();
  const legFL = useRef();
  const legFR = useRef();
  const legBL = useRef();
  const legBR = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * 3.2 + phaseOffset;
    if (headGroupRef.current) {
      headGroupRef.current.rotation.x = Math.sin(t * 0.8) * 0.1;
    }
    if (legFL.current && legFR.current && legBL.current && legBR.current) {
      legFL.current.rotation.x = Math.sin(t) * 0.25;
      legBR.current.rotation.x = Math.sin(t) * 0.25;
      legFR.current.rotation.x = -Math.sin(t) * 0.25;
      legBL.current.rotation.x = -Math.sin(t) * 0.25;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Sculpted White Stallion Body */}
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.68, 0.65, 1.48]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.45} />
      </mesh>
      {/* Crimson & Gold Saddle Blanket */}
      <mesh position={[0, 1.26, -0.05]}>
        <boxGeometry args={[0.74, 0.52, 0.82]} />
        <meshStandardMaterial color="#991b1b" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.02, -0.05]}>
        <boxGeometry args={[0.76, 0.08, 0.85]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Arched Neck, Head, Golden Bridle & Royal Plume */}
      <group ref={headGroupRef} position={[0, 1.48, 0.65]}>
        <mesh position={[0, 0.26, 0.12]} rotation={[0.45, 0, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.26, 0.72, 10]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.56, 0.36]} rotation={[0.95, 0, 0]} castShadow>
          <coneGeometry args={[0.2, 0.56, 10]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.45} />
        </mesh>
        {/* Golden Bridle Collar & Plume */}
        <mesh position={[0, 0.35, 0.16]} rotation={[0.45, 0, 0]}>
          <torusGeometry args={[0.21, 0.035, 8, 14]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.88} />
        </mesh>
        <mesh position={[0, 0.78, 0.22]}>
          <coneGeometry args={[0.08, 0.26, 8]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* Flowing White Tail */}
      <mesh position={[0, 1.05, -0.82]} rotation={[-0.35, 0, 0]}>
        <coneGeometry args={[0.12, 0.75, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
      </mesh>

      {/* 4 Articulated Legs with Golden Hooves */}
      {[
        { ref: legFL, pos: [-0.24, 0.85, 0.52] },
        { ref: legFR, pos: [0.24, 0.85, 0.52] },
        { ref: legBL, pos: [-0.24, 0.85, -0.52] },
        { ref: legBR, pos: [0.24, 0.85, -0.52] },
      ].map((lg, i) => (
        <group key={i} ref={lg.ref} position={lg.pos}>
          <mesh position={[0, -0.42, 0]} castShadow>
            <cylinderGeometry args={[0.085, 0.065, 0.85, 8]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.8, 0]}>
            <cylinderGeometry args={[0.075, 0.085, 0.1, 8]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * 4. ROYAL CHARIOT (RATHA) WITH TWO WHITE ROYAL HORSES — Exact match to "Royal Chariot" in Asset Kit
 */
export function RoyalChariot({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const wheel1Ref = useRef();
  const wheel2Ref = useRef();
  const wheel3Ref = useRef();
  const wheel4Ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * 1.6;
    [wheel1Ref, wheel2Ref, wheel3Ref, wheel4Ref].forEach((w) => {
      if (w.current) w.current.rotation.x = t;
    });
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Chariot Base Platform */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <boxGeometry args={[2.2, 0.48, 2.9]} />
        <meshStandardMaterial color="#92400e" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.16, 0]}>
        <boxGeometry args={[2.3, 0.16, 3.0]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.18} />
      </mesh>

      {/* 4 Spoked Golden Chariot Wheels */}
      {[
        { ref: wheel1Ref, pos: [-1.18, 0.68, 0.9] },
        { ref: wheel2Ref, pos: [1.18, 0.68, 0.9] },
        { ref: wheel3Ref, pos: [-1.18, 0.68, -0.9] },
        { ref: wheel4Ref, pos: [1.18, 0.68, -0.9] },
      ].map((w, i) => (
        <group key={i} ref={w.ref} position={w.pos} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.68, 0.68, 0.15, 18]} />
            <meshStandardMaterial color="#d97706" metalness={0.82} roughness={0.22} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.22, 0.22, 0.22, 12]} />
            <meshStandardMaterial color="#fef08a" metalness={0.92} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Ornate Shikhar Canopy of Chariot */}
      {[
        [-0.88, 2.0, 1.08],
        [0.88, 2.0, 1.08],
        [-0.88, 2.0, -1.08],
        [0.88, 2.0, -1.08],
      ].map((cp, i) => (
        <mesh key={i} position={cp}>
          <cylinderGeometry args={[0.08, 0.1, 1.7, 10]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.18} />
        </mesh>
      ))}
      <mesh position={[0, 3.1, 0]} castShadow>
        <coneGeometry args={[1.65, 1.45, 8]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.35} />
      </mesh>
      <mesh position={[0, 3.95, 0]}>
        <coneGeometry args={[0.7, 0.95, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.92} roughness={0.14} />
      </mesh>

      {/* Golden Yoke Shaft & Pair of White Royal Horses Drawing the Chariot */}
      <mesh position={[0, 0.95, 2.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 2.2, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.88} />
      </mesh>
      <RoyalHorse position={[-0.65, 0, 2.85]} phaseOffset={0} />
      <RoyalHorse position={[0.65, 0, 2.85]} phaseOffset={1.2} />
    </group>
  );
}

/**
 * 5. ROYAL PALANQUIN (PALKI) — Exact match to "Palanquin" in Asset Kit
 */
export function RoyalPalanquin({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Long Brass Carrying Poles */}
      {[-0.65, 0.65].map((px, i) => (
        <mesh key={i} position={[px, 0.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 3.8, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.18} />
        </mesh>
      ))}
      {/* Carved Golden Palanquin Base */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.45, 0.42, 1.85]} />
        <meshStandardMaterial color="#d97706" metalness={0.78} roughness={0.22} />
      </mesh>
      {/* 4 Corner Pillars & Crimson Silk Curtains */}
      {[
        [-0.6, 1.25, 0.78],
        [0.6, 1.25, 0.78],
        [-0.6, 1.25, -0.78],
        [0.6, 1.25, -0.78],
      ].map((pp, i) => (
        <mesh key={i} position={pp}>
          <cylinderGeometry args={[0.055, 0.065, 1.1, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.88} />
        </mesh>
      ))}
      <mesh position={[0, 1.35, 0]}>
        <boxGeometry args={[1.22, 0.9, 1.48]} />
        <meshStandardMaterial color="#991b1b" roughness={0.45} />
      </mesh>
      {/* Domed Golden Roof & Kalash Finial */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.92, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.16} />
      </mesh>
      <mesh position={[0, 2.85, 0]}>
        <coneGeometry args={[0.12, 0.35, 8]} />
        <meshStandardMaterial color="#fef08a" metalness={0.95} />
      </mesh>
    </group>
  );
}

/**
 * 6. INTRICATE 3D MANDALA RANGOLI WITH PERIMETER DIYAS — Exact match to "Rangoli" in Asset Kit
 */
export function RangoliMandala({ position = [0, 0.02, 0], scale = 1, variant = 0 }) {
  const rangoliTex = useMemo(() => getRangoliTexture(variant), [variant]);

  return (
    <group position={position} scale={scale}>
      {/* High-DPI Lotus Mandala Floor Decal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[1.55, 32]} />
        <meshStandardMaterial
          map={rangoliTex}
          transparent
          roughness={0.6}
          emissive="#f59e0b"
          emissiveIntensity={0.22}
        />
      </mesh>

      {/* Center Raised Diya */}
      <group position={[0, 0.05, 0]}>
        <mesh>
          <cylinderGeometry args={[0.14, 0.08, 0.09, 10]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.85} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <coneGeometry args={[0.065, 0.18, 8]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      </group>

      {/* 12 Glowing Diyas around Rangoli Perimeter */}
      {Array.from({ length: 12 }).map((_, i) => {
        const ang = (i / 12) * Math.PI * 2;
        return (
          <group key={i} position={[Math.cos(ang) * 1.46, 0.05, Math.sin(ang) * 1.46]}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.06, 0.07, 8]} />
              <meshStandardMaterial color="#9a3412" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.09, 0]}>
              <coneGeometry args={[0.05, 0.14, 6]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * 7. CELEBRATION ELEMENTS: GROUND CRACKERS (ANAR & CHAKRI) + CRACKERS SET PROP
 */
export function CrackersSetProp({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Red Ladi Firecracker Cylinders */}
      {[-0.22, -0.1, 0.02, 0.14].map((x, i) => (
        <mesh key={i} position={[x, 0.16, 0.1]}>
          <cylinderGeometry args={[0.045, 0.045, 0.32, 8]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      ))}
      {/* Conical Anar Flowerpots */}
      <mesh position={[-0.18, 0.18, -0.18]}>
        <coneGeometry args={[0.14, 0.36, 10]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.5} />
      </mesh>
      <mesh position={[0.18, 0.15, -0.18]}>
        <coneGeometry args={[0.12, 0.3, 10]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.5} />
      </mesh>
      {/* Skyrocket Cylinder */}
      <mesh position={[0.28, 0.32, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.05, 0.05, 0.55, 8]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
    </group>
  );
}

export function GroundCrackerFX({ position = [0, 0, 0], type = 'anar', isNight = false }) {
  const pointsRef = useRef();
  const chakriDiscRef = useRef();
  const count = type === 'anar' ? 110 : 70;

  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = [];
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color('#fef08a');
    const c2 = new THREE.Color(type === 'anar' ? '#f97316' : '#34d399');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = Math.random() * 2.2;
      pos[i * 3 + 2] = 0;
      vel.push({
        vx: (Math.random() - 0.5) * 1.8,
        vy: 2.2 + Math.random() * 3.2,
        vz: (Math.random() - 0.5) * 1.8,
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
      v.life += delta * (type === 'anar' ? 1.45 : 2.2);
      if (v.life > 1) v.life = 0;

      if (type === 'anar') {
        const t = v.life;
        arr[i * 3] = v.vx * t;
        arr[i * 3 + 1] = 0.22 + v.vy * t - 2.8 * t * t;
        arr[i * 3 + 2] = v.vz * t;
      } else {
        const angle = v.life * Math.PI * 6 + i;
        const rad = 0.15 + v.life * 1.45;
        arr[i * 3] = Math.cos(angle) * rad;
        arr[i * 3 + 1] = 0.08 + (1 - v.life) * 0.24;
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
        <mesh position={[0, 0.18, 0]}>
          <coneGeometry args={[0.17, 0.36, 12]} />
          <meshStandardMaterial color="#d97706" metalness={0.55} />
        </mesh>
      ) : (
        <mesh ref={chakriDiscRef} position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.06, 12]} />
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
          size={isNight ? 0.24 : 0.2}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <pointLight
        position={[0, 0.9, 0]}
        color={type === 'anar' ? '#fbbf24' : '#34d399'}
        intensity={isNight ? 5 : 2.5}
        distance={8}
      />
    </group>
  );
}

/**
 * 8. FLOATING SKY LANTERNS (AKASH KANDIL — Exact match to "Sky Lantern" in Asset Kit)
 */
export function FloatingSkyLanternsFX({ isNight = false }) {
  const groupRef = useRef();

  const lanterns = useMemo(() => {
    return Array.from({ length: 38 }, (_, i) => ({
      x: (Math.sin(i * 17.3) - 0.5) * 75,
      baseY: 10 + (i % 10) * 2.8,
      z: 10 - i * 3.4,
      speed: 0.4 + (i % 5) * 0.12,
      phase: i * 0.9,
      scale: 0.65 + (i % 3) * 0.2,
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, idx) => {
      const l = lanterns[idx];
      if (!l) return;
      child.position.y = l.baseY + ((t * l.speed + l.phase) % 18);
      child.position.x = l.x + Math.sin(t * 0.6 + l.phase) * 1.2;
    });
  });

  return (
    <group ref={groupRef}>
      {lanterns.map((l, i) => (
        <group key={i} position={[l.x, l.baseY, l.z]} scale={l.scale}>
          <mesh>
            <cylinderGeometry args={[0.38, 0.26, 0.72, 10]} />
            <meshStandardMaterial
              color="#fed7aa"
              emissive="#f97316"
              emissiveIntensity={isNight ? 2.4 : 0.9}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, -0.38, 0]}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * 9. AERIAL FIREWORKS BURST SYSTEM (FIREWORKS SKY — Exact match to "Fireworks (Sky)" in Asset Kit)
 */
export function AerialFireworksFX({ isNight = true }) {
  const bursts = useMemo(
    () => [
      { pos: [-26, 26, -58], color: '#fbbf24', secondary: '#f43f5e', speed: 0.72, offset: 0 },
      { pos: [25, 30, -68], color: '#ec4899', secondary: '#fde047', speed: 0.85, offset: 1.1 },
      { pos: [0, 34, -88], color: '#fde047', secondary: '#38bdf8', speed: 0.68, offset: 2.2 },
      { pos: [-32, 28, -108], color: '#38bdf8', secondary: '#a855f7', speed: 0.78, offset: 3.3 },
      { pos: [30, 32, -116], color: '#f97316', secondary: '#fef08a', speed: 0.82, offset: 4.4 },
      { pos: [0, 38, -128], color: '#a855f7', secondary: '#fbbf24', speed: 0.75, offset: 5.5 },
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

function SingleFireworkBurst({ pos, color, secondary, speed, offset }) {
  const pointsRef = useRef();
  const lightRef = useRef();
  const count = 120;

  const { baseDirs, positions, colors } = useMemo(() => {
    const dirs = [];
    const p = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color(color);
    const c2 = new THREE.Color(secondary || '#fef08a');

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 6.5 + Math.random() * 7.5;
      dirs.push({
        dx: Math.sin(phi) * Math.cos(theta) * r,
        dy: Math.sin(phi) * Math.sin(theta) * r,
        dz: Math.cos(phi) * r,
      });
      const mixed = i % 2 === 0 ? c1 : c2;
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return { baseDirs: dirs, positions: p, colors: col };
  }, [count, color, secondary]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const cycle = ((state.clock.elapsedTime * speed + offset) % 3.0) / 3.0;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array;

    const ease = 1 - Math.pow(1 - cycle, 3);
    for (let i = 0; i < count; i++) {
      const d = baseDirs[i];
      arr[i * 3] = d.dx * ease;
      arr[i * 3 + 1] = d.dy * ease - cycle * cycle * 3.8;
      arr[i * 3 + 2] = d.dz * ease;
    }
    posAttr.needsUpdate = true;
    pointsRef.current.material.opacity = Math.max(0, 1 - Math.pow(cycle, 1.8));
    if (lightRef.current) {
      lightRef.current.intensity = (1 - cycle) * 16;
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
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.62}
          vertexColors
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <pointLight ref={lightRef} color={color} intensity={10} distance={50} />
    </group>
  );
}
