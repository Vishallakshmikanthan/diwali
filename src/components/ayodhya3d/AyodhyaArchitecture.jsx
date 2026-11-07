import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Ceremonial Carved Sandstone & Gold Torana Welcome Gate
 */
export function ToranaGate({ position = [0, 0, 0], isNight = false }) {
  return (
    <group position={position}>
      {/* Left & Right Carved Pillars */}
      {[-6.5, 6.5].map((px, i) => (
        <group key={i} position={[px, 0, 0]}>
          {/* Plinth Base */}
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 1.6, 2.2]} />
            <meshStandardMaterial color="#b45309" roughness={0.6} />
          </mesh>
          {/* Main Fluted Sandstone Column */}
          <mesh position={[0, 4.8, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.75, 0.9, 6.8, 12]} />
            <meshStandardMaterial color="#d97706" roughness={0.45} metalness={0.2} />
          </mesh>
          {/* Gold Rings on Column */}
          {[2.5, 4.8, 7.0].map((ry, idx) => (
            <mesh key={idx} position={[0, ry, 0]}>
              <cylinderGeometry args={[0.92, 0.92, 0.25, 12]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Ornate Multi-Tiered Archway Lintel */}
      <mesh position={[0, 8.6, 0]} castShadow>
        <boxGeometry args={[16.2, 1.2, 2.0]} />
        <meshStandardMaterial color="#b45309" roughness={0.5} />
      </mesh>
      <mesh position={[0, 9.6, 0]} castShadow>
        <boxGeometry args={[13.6, 0.9, 1.7]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 3 Chhatri Domes Atop Torana Gate */}
      {[-4.8, 0, 4.8].map((dx, i) => (
        <group key={i} position={[dx, 10.1, 0]}>
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[i === 1 ? 1.45 : 1.05, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.18} />
          </mesh>
          <mesh position={[0, i === 1 ? 2.2 : 1.8, 0]}>
            <coneGeometry args={[0.2, 0.65, 8]} />
            <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Hanging Marigold Toran Garlands Across Arch */}
      {[-4.2, -1.4, 1.4, 4.2].map((gx, i) => (
        <mesh key={i} position={[gx, 7.6, 0]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[1.4, 0.12, 8, 16, Math.PI]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#f59e0b' : '#dc2626'}
            emissive="#d97706"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {isNight && (
        <pointLight position={[0, 7.5, 2]} color="#fbbf24" intensity={6} distance={18} />
      )}
    </group>
  );
}

/**
 * Royal Haveli / Palace Building with Jharokha Balconies, Arches & Domes
 */
export function GrandPalaceBuilding({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  floors = 2,
  width = 10,
  depth = 7,
  wallColor = '#d98a3c',
  isNight = false,
}) {
  const heightPerFloor = 4.2;
  const totalHeight = floors * heightPerFloor;

  return (
    <group position={position} rotation={rotation}>
      {/* Raised Carved Sandstone Plinth */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 1.2, 1.2, depth + 1.2]} />
        <meshStandardMaterial color="#9a3412" roughness={0.65} />
      </mesh>

      {/* Main Palace Floors */}
      {Array.from({ length: floors }).map((_, f) => {
        const fy = 1.2 + f * heightPerFloor;
        const floorW = width - f * 0.8;
        const floorD = depth - f * 0.6;
        return (
          <group key={f} position={[0, fy, 0]}>
            {/* Main Masonry Block */}
            <mesh position={[0, heightPerFloor / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[floorW, heightPerFloor, floorD]} />
              <meshStandardMaterial color={wallColor} roughness={0.5} metalness={0.12} />
            </mesh>

            {/* Cornice Chhajja Eave Ledge */}
            <mesh position={[0, heightPerFloor - 0.15, 0]}>
              <boxGeometry args={[floorW + 0.9, 0.3, floorD + 0.9]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.25} />
            </mesh>

            {/* Glowing Arched Windows & Jharokha Balconies on Front Facade */}
            {[-floorW * 0.3, 0, floorW * 0.3].map((wx, wi) => (
              <group key={wi} position={[wx, heightPerFloor * 0.48, floorD / 2 + 0.08]}>
                {/* Window Arch Glow */}
                <mesh>
                  <boxGeometry args={[1.25, 2.1, 0.15]} />
                  <meshStandardMaterial
                    color={isNight ? '#fef08a' : '#78350f'}
                    emissive={isNight ? '#f59e0b' : '#451a03'}
                    emissiveIntensity={isNight ? 2.4 : 0.2}
                  />
                </mesh>
                {/* Ornate Gold Window Frame */}
                <mesh position={[0, 1.1, 0.05]}>
                  <coneGeometry args={[0.85, 0.7, 4]} />
                  <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Projecting Jharokha Balcony on Upper Floors */}
                {f > 0 && (
                  <mesh position={[0, -0.95, 0.35]}>
                    <boxGeometry args={[1.6, 0.35, 0.8]} />
                    <meshStandardMaterial color="#b45309" />
                  </mesh>
                )}
              </group>
            ))}

            {/* Hanging Marigold Garland String along Eaves */}
            <mesh position={[0, heightPerFloor - 0.35, floorD / 2 + 0.42]}>
              <boxGeometry args={[floorW, 0.14, 0.14]} />
              <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.4} />
            </mesh>
          </group>
        );
      })}

      {/* Rooftop Chhatri Domes & Golden Kalash Spires */}
      {[-width * 0.28, 0, width * 0.28].map((dx, i) => {
        const domeRadius = i === 1 ? 1.85 : 1.25;
        return (
          <group key={i} position={[dx, 1.2 + totalHeight, 0]}>
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[domeRadius * 0.85, domeRadius * 0.9, 1.2, 12]} />
              <meshStandardMaterial color="#b45309" roughness={0.5} />
            </mesh>
            <mesh position={[0, 1.2, 0]} castShadow>
              <sphereGeometry
                args={[domeRadius, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]}
              />
              <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.18} />
            </mesh>
            <mesh position={[0, 1.2 + domeRadius + 0.35, 0]}>
              <coneGeometry args={[0.22, 0.8, 8]} />
              <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * Towering Nagara-Style Shri Ram Mandir / Kanak Bhavan Temple with Maha Aarti Sanctum
 */
export function GrandTempleMandir({ position = [0, 0, 0], isNight = false }) {
  const flagRef = useRef();
  const bellRef1 = useRef();
  const bellRef2 = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(t * 4) * 0.22;
      flagRef.current.rotation.z = Math.cos(t * 3) * 0.08;
    }
    if (bellRef1.current && bellRef2.current) {
      bellRef1.current.rotation.z = Math.sin(t * 3.5) * 0.22;
      bellRef2.current.rotation.z = -Math.sin(t * 3.5) * 0.22;
    }
  });

  return (
    <group position={position}>
      {/* Monumental Stepped Jagati (Temple Plinth) */}
      <mesh position={[0, 0.75, 0]} receiveShadow castShadow>
        <boxGeometry args={[20, 1.5, 22]} />
        <meshStandardMaterial color="#9a3412" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.8, 0]} receiveShadow castShadow>
        <boxGeometry args={[17, 0.8, 19]} />
        <meshStandardMaterial color="#d97706" roughness={0.45} metalness={0.25} />
      </mesh>

      {/* Grand Front Steps leading up to Mandapa */}
      {[0, 1, 2, 3].map((step) => (
        <mesh key={step} position={[0, 0.25 + step * 0.45, 9.6 + (3 - step) * 0.65]} receiveShadow>
          <boxGeometry args={[7.5, 0.45, 0.8]} />
          <meshStandardMaterial color="#b45309" roughness={0.5} />
        </mesh>
      ))}

      {/* Pillared Maha-Mandapa Hall (Front Pavilion) */}
      <group position={[0, 2.2, 3.8]}>
        {[
          [-5.2, 2.8, 3.5],
          [-2.4, 2.8, 3.5],
          [2.4, 2.8, 3.5],
          [5.2, 2.8, 3.5],
          [-5.2, 2.8, -2.5],
          [5.2, 2.8, -2.5],
        ].map((pp, i) => (
          <mesh key={i} position={pp} castShadow>
            <cylinderGeometry args={[0.45, 0.55, 5.6, 12]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.75} roughness={0.25} />
          </mesh>
        ))}

        {/* Stepped Pyramid Mandapa Roof (Phamsana) */}
        {[0, 1, 2, 3].map((tier) => (
          <mesh key={tier} position={[0, 6.0 + tier * 0.9, 0.5]} castShadow>
            <boxGeometry args={[12.5 - tier * 2.2, 0.85, 8.5 - tier * 1.5]} />
            <meshStandardMaterial
              color={tier % 2 === 0 ? '#d97706' : '#fbbf24'}
              metalness={0.7}
              roughness={0.25}
            />
          </mesh>
        ))}

        {/* Swinging Brass Temple Bells in the Mandapa Entrance */}
        <group ref={bellRef1} position={[-1.4, 5.4, 3.5]}>
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} />
          </mesh>
          <mesh position={[0, -1.25, 0]}>
            <coneGeometry args={[0.32, 0.45, 12]} />
            <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
        <group ref={bellRef2} position={[1.4, 5.4, 3.5]}>
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} />
          </mesh>
          <mesh position={[0, -1.25, 0]}>
            <coneGeometry args={[0.32, 0.45, 12]} />
            <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* Towering Garbhagriha & Nagara Shikhara Spire (Back Sanctum) */}
      <group position={[0, 2.2, -3.5]}>
        {/* Sanctum Base */}
        <mesh position={[0, 3.2, 0]} castShadow>
          <boxGeometry args={[11, 6.4, 10]} />
          <meshStandardMaterial color="#b45309" roughness={0.45} />
        </mesh>

        {/* Illuminated Golden Sanctum Portal */}
        <mesh position={[0, 2.8, 5.05]}>
          <boxGeometry args={[3.4, 4.6, 0.2]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#f59e0b"
            emissiveIntensity={2.5}
          />
        </mesh>

        {/* Multi-Tiered Nagara Shikhara Tower with Urushringas (Subsidiary Spires) */}
        {[0, 1, 2, 3, 4, 5, 6].map((t) => {
          const w = 9.5 - t * 1.15;
          return (
            <mesh key={t} position={[0, 6.8 + t * 1.65, 0]} castShadow>
              <boxGeometry args={[w, 1.6, w]} />
              <meshStandardMaterial
                color={t % 2 === 0 ? '#fbbf24' : '#d97706'}
                metalness={0.8}
                roughness={0.22}
              />
            </mesh>
          );
        })}

        {/* 4 Subsidiary Corner Shikharas (Urushringas) */}
        {[
          [-3.8, 8.5, 3.8],
          [3.8, 8.5, 3.8],
          [-3.8, 8.5, -3.8],
          [3.8, 8.5, -3.8],
        ].map((up, i) => (
          <mesh key={i} position={up} castShadow>
            <coneGeometry args={[1.45, 5.5, 8]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
          </mesh>
        ))}

        {/* Sacred Amalaka Disc & Golden Kalash Finial */}
        <mesh position={[0, 18.6, 0]}>
          <torusGeometry args={[1.45, 0.45, 10, 20]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 20.2, 0]}>
          <coneGeometry args={[0.65, 2.2, 12]} />
          <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Fluttering Saffron Dharma Flag (Dhwaja) at Temple Peak */}
        <group position={[0, 21.8, 0]}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 2.6, 8]} />
            <meshStandardMaterial color="#fef08a" metalness={0.9} />
          </mesh>
          <mesh ref={flagRef} position={[1.2, 0.6, 0]}>
            <coneGeometry args={[0.75, 2.4, 3]} rotation={[0, 0, -Math.PI / 2]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#ea580c"
              emissiveIntensity={0.45}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      {/* Warm Sanctum & Aarti Point Light */}
      <pointLight
        position={[0, 6.5, 4.5]}
        color="#fbbf24"
        intensity={isNight ? 12 : 4}
        distance={28}
      />
    </group>
  );
}

/**
 * Festive Silk-Canopied Royal Bazaar Stall
 */
export function BazaarStall({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  canopyColor = '#dc2626',
  isNight = false,
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Counter Table */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 1.1, 1.8]} />
        <meshStandardMaterial color="#92400e" roughness={0.6} />
      </mesh>
      {/* Silk Tablecloth */}
      <mesh position={[0, 1.18, 0]}>
        <boxGeometry args={[3.5, 0.12, 1.9]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* 4 Bamboo/Gold Poles */}
      {[
        [-1.55, 1.85, 0.75],
        [1.55, 1.85, 0.75],
        [-1.55, 1.85, -0.75],
        [1.55, 1.85, -0.75],
      ].map((pp, i) => (
        <mesh key={i} position={pp}>
          <cylinderGeometry args={[0.06, 0.06, 2.5, 8]} />
          <meshStandardMaterial color="#d97706" metalness={0.7} />
        </mesh>
      ))}

      {/* Festive Silk Canopy Roof */}
      <mesh position={[0, 3.35, 0]} castShadow>
        <coneGeometry args={[2.5, 1.2, 4]} rotation={[0, Math.PI / 4, 0]} />
        <meshStandardMaterial color={canopyColor} roughness={0.4} />
      </mesh>

      {/* Stacked Brass Sweet Platters, Flowers & Earthen Pots on Counter */}
      {[-0.95, 0, 0.95].map((sx, i) => (
        <group key={i} position={[sx, 1.35, 0.1]}>
          <mesh>
            <cylinderGeometry args={[0.38, 0.28, 0.08, 12]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <coneGeometry args={[0.3, 0.32, 10]} />
            <meshStandardMaterial
              color={i === 0 ? '#f59e0b' : i === 1 ? '#fef08a' : '#ef4444'}
              emissive={i === 1 ? '#fde047' : '#d97706'}
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      ))}

      {isNight && (
        <pointLight position={[0, 2.5, 0.5]} color="#fbbf24" intensity={3.5} distance={9} />
      )}
    </group>
  );
}

/**
 * Sacred Sarayu Riverfront Ghats, Deepstambh Lamp Pillars & Reflective Water
 */
export function SarayuRiverAndGhats({ position = [0, 0, -90], isNight = false }) {
  const waterRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (waterRef.current) {
      waterRef.current.material.emissiveIntensity = isNight
        ? 0.55 + Math.sin(t * 2.5) * 0.12
        : 0.18 + Math.sin(t * 2.5) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Stepped Sandstone Riverfront Ghats Descending to the Water */}
      {[0, 1, 2, 3, 4, 5].map((step) => (
        <mesh
          key={step}
          position={[0, -step * 0.35, step * -1.4]}
          receiveShadow
        >
          <boxGeometry args={[95, 0.4, 1.6]} />
          <meshStandardMaterial
            color={step % 2 === 0 ? '#c27838' : '#a15c27'}
            roughness={0.55}
          />
        </mesh>
      ))}

      {/* Sacred Deepstambh (Multi-Tiered Lamp Towers) Flanking the Ghats */}
      {[-28, -14, 14, 28].map((lx, i) => (
        <group key={i} position={[lx, 0, -2]}>
          <mesh position={[0, 3.5, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.75, 7, 10]} />
            <meshStandardMaterial color="#9a3412" roughness={0.5} />
          </mesh>
          {[1.5, 3.0, 4.5, 6.0].map((ty, ti) => (
            <mesh key={ti} position={[0, ty, 0]}>
              <cylinderGeometry args={[1.1 - ti * 0.15, 0.9 - ti * 0.15, 0.2, 12]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#f59e0b"
                emissiveIntensity={isNight ? 1.8 : 0.4}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Shimmering Sarayu River Water Surface */}
      <mesh
        ref={waterRef}
        position={[0, -2.05, -32]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[160, 60, 32, 32]} />
        <meshStandardMaterial
          color={isNight ? '#0f2942' : '#2563eb'}
          emissive={isNight ? '#d97706' : '#1d4ed8'}
          emissiveIntensity={isNight ? 0.55 : 0.15}
          metalness={0.92}
          roughness={0.14}
        />
      </mesh>

      {/* Ceremonial Illuminated Royal Boats on the Sarayu River */}
      {[-16, 4, 22].map((bx, i) => (
        <group key={i} position={[bx, -1.9, -16 - i * 4]} rotation={[0, 0.2 * (i - 1), 0]}>
          <mesh castShadow>
            <boxGeometry args={[4.5, 0.6, 1.4]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <coneGeometry args={[1.1, 1.4, 4]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * High-Performance InstancedMesh of 1,800+ Flickering Earthen Diyas & Flames
 * Lining Rajpath, Courtyards, Palaces, Temples & Floating on the Sarayu River!
 */
export function InstancedKingdomDiyas({ isNight = false }) {
  const baseMeshRef = useRef();
  const flameMeshRef = useRef();

  const diyaPositions = useMemo(() => {
    const pts = [];
    // 1. Along both sides of Grand Rajpath (z from 20 to -85)
    for (let z = 20; z >= -86; z -= 1.2) {
      pts.push([-8.2, 0.08, z]);
      pts.push([8.2, 0.08, z]);
      pts.push([-12.5, 0.08, z]);
      pts.push([12.5, 0.08, z]);
    }

    // 2. Along Palace Balconies & Parapets (Left & Right avenues)
    for (let z = 15; z >= -80; z -= 1.8) {
      pts.push([-15.5, 5.2, z]);
      pts.push([15.5, 5.2, z]);
      pts.push([-15.5, 9.4, z]);
      pts.push([15.5, 9.4, z]);
    }

    // 3. Around Temple Plinth & Steps (around z = -62)
    for (let x = -10; x <= 10; x += 1.0) {
      pts.push([x, 1.55, -51]);
      pts.push([x, 1.55, -73]);
    }

    // 4. Hundreds of Diyas along Sarayu Riverfront Ghats & Floating Deepdaan on Water (z = -90 to -125)
    for (let x = -42; x <= 42; x += 1.4) {
      pts.push([x, -0.3, -91.4]);
      pts.push([x, -1.0, -94.2]);
      pts.push([x, -1.7, -97.0]);
      // Floating on the Sarayu River
      pts.push([x + Math.sin(x) * 2, -1.98, -101 - (Math.abs(x * 7) % 18)]);
      pts.push([x + Math.cos(x) * 2, -1.98, -106 - (Math.abs(x * 11) % 22)]);
    }

    return pts;
  }, []);

  const count = diyaPositions.length;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!baseMeshRef.current || !flameMeshRef.current) return;
    diyaPositions.forEach((p, i) => {
      dummy.position.set(p[0], p[1], p[2]);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      baseMeshRef.current.setMatrixAt(i, dummy.matrix);

      dummy.position.set(p[0], p[1] + 0.14, p[2]);
      dummy.updateMatrix();
      flameMeshRef.current.setMatrixAt(i, dummy.matrix);
    });
    baseMeshRef.current.instanceMatrix.needsUpdate = true;
    flameMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [diyaPositions, dummy]);

  useFrame((state) => {
    if (!flameMeshRef.current) return;
    const t = state.clock.elapsedTime;
    const flamePulse = 1 + Math.sin(t * 9) * 0.14;
    flameMeshRef.current.scale.set(1, flamePulse, 1);
  });

  return (
    <group>
      {/* Terracotta Diya Bowls */}
      <instancedMesh ref={baseMeshRef} args={[null, null, count]}>
        <cylinderGeometry args={[0.14, 0.08, 0.09, 8]} />
        <meshStandardMaterial color="#9a3412" roughness={0.65} />
      </instancedMesh>

      {/* Glowing Golden Flames */}
      <instancedMesh ref={flameMeshRef} args={[null, null, count]}>
        <coneGeometry args={[0.075, 0.22, 6]} />
        <meshBasicMaterial color={isNight ? '#fef08a' : '#fbbf24'} />
      </instancedMesh>
    </group>
  );
}

