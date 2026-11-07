import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  getSandstoneTexture,
  getSunBannerTexture,
  getCanopyStripeTexture,
} from './AyodhyaTextures';

/**
 * 1. CITY GATE (TORAN) — Exact match to "City Gate (Toran)" in Asset Kit & S1 Grand Entry
 * Features twin stepped sandstone pillar towers, crimson Suryavanshi Sun-Emblem banners,
 * multifoil cusped arch, hanging lanterns, flower torans, and 3 golden Chhatri domes.
 */
export function ToranaGate({ position = [0, 0, 0], isNight = false }) {
  const sandstoneTex = useMemo(() => getSandstoneTexture(), []);
  const sunBannerTex = useMemo(() => getSunBannerTexture('#991b1b'), []);

  return (
    <group position={position}>
      {/* Left & Right Monumental Stepped Gate Towers */}
      {[-7.2, 7.2].map((px, i) => (
        <group key={i} position={[px, 0, 0]}>
          {/* Moulded Plinth Base */}
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.4, 1.8, 3.2]} />
            <meshStandardMaterial map={sandstoneTex} color="#b45309" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.9, 0]}>
            <boxGeometry args={[3.6, 0.28, 3.4]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Main Carved Sandstone Pillar Shaft */}
          <mesh position={[0, 5.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.6, 7.6, 2.4]} />
            <meshStandardMaterial map={sandstoneTex} color="#d97706" roughness={0.48} />
          </mesh>

          {/* Fluted Corner Engaged Columns */}
          {[
            [-1.25, 5.8, 1.15],
            [1.25, 5.8, 1.15],
            [-1.25, 5.8, -1.15],
            [1.25, 5.8, -1.15],
          ].map((cp, ci) => (
            <mesh key={ci} position={cp} castShadow>
              <cylinderGeometry args={[0.24, 0.28, 7.6, 10]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.78} roughness={0.22} />
            </mesh>
          ))}

          {/* Crimson Suryavanshi Sun-Emblem Banner (Flag / Dhwaj) on Front of Each Pillar */}
          <group position={[0, 5.9, 1.32]}>
            {/* Golden Crossbar Rod */}
            <mesh position={[0, 1.85, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 1.8, 8]} />
              <meshStandardMaterial color="#fef08a" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Banner Cloth */}
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[1.55, 3.5]} />
              <meshStandardMaterial
                map={sunBannerTex}
                roughness={0.45}
                emissive="#7f1d1d"
                emissiveIntensity={isNight ? 0.35 : 0.1}
              />
            </mesh>
          </group>

          {/* Ornate Capital & Bracket Ledge */}
          <mesh position={[0, 9.8, 0]} castShadow>
            <boxGeometry args={[3.5, 0.7, 3.1]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.82} roughness={0.2} />
          </mesh>

          {/* Flanking Lamp Posts & Diyas at Base */}
          <BrassDiyasStand position={[i === 0 ? 2.1 : -2.1, 0, 1.8]} isNight={isNight} scale={1.1} />
          <MangalKalash position={[i === 0 ? 1.6 : -1.6, 0, 2.2]} scale={1.2} />
        </group>
      ))}

      {/* Sculpted Cusped Torana Archway Spanning the Pillars */}
      <group position={[0, 8.8, 0]}>
        {/* Arch Haunches */}
        <mesh position={[-4.5, 0.2, 0]} rotation={[0, 0, -0.45]} castShadow>
          <boxGeometry args={[3.2, 1.1, 2.0]} />
          <meshStandardMaterial map={sandstoneTex} color="#d97706" roughness={0.45} />
        </mesh>
        <mesh position={[4.5, 0.2, 0]} rotation={[0, 0, 0.45]} castShadow>
          <boxGeometry args={[3.2, 1.1, 2.0]} />
          <meshStandardMaterial map={sandstoneTex} color="#d97706" roughness={0.45} />
        </mesh>
        {/* Cusped Golden Arch Ring */}
        <mesh position={[0, -0.4, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[5.2, 0.42, 10, 24, Math.PI]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* Grand Multi-Tiered Entablature Lintel */}
      <mesh position={[0, 10.6, 0]} castShadow>
        <boxGeometry args={[18.8, 1.35, 2.9]} />
        <meshStandardMaterial map={sandstoneTex} color="#c26d2d" roughness={0.45} />
      </mesh>
      <mesh position={[0, 11.55, 0]} castShadow>
        <boxGeometry args={[17.2, 0.75, 2.5]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.82} roughness={0.2} />
      </mesh>

      {/* 3 Ornate Chhatri Pavilions & Kalash Finials Atop Torana Gate */}
      {[-5.8, 0, 5.8].map((dx, i) => {
        const isCenter = i === 1;
        const r = isCenter ? 1.65 : 1.18;
        return (
          <group key={i} position={[dx, 11.9, 0]}>
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry args={[r * 0.85, r * 0.92, 1.1, 12]} />
              <meshStandardMaterial map={sandstoneTex} color="#b45309" />
            </mesh>
            <mesh position={[0, 1.1, 0]} castShadow>
              <sphereGeometry args={[r, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.16} />
            </mesh>
            <mesh position={[0, 1.1 + r + 0.4, 0]}>
              <coneGeometry args={[0.24, 0.85, 10]} />
              <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.08} />
            </mesh>
          </group>
        );
      })}

      {/* Flower Torans & Hanging Hexagonal Lanterns Across the Arch */}
      {[-4.2, -1.4, 1.4, 4.2].map((gx, i) => (
        <group key={i} position={[gx, 9.1, 1.1]}>
          <FlowerToranGarland width={2.7} />
          <HangingLantern position={[0, -0.85, 0]} isNight={isNight} />
        </group>
      ))}

      <pointLight
        position={[0, 9.5, 2.5]}
        color="#fbbf24"
        intensity={isNight ? 10 : 3}
        distance={26}
      />
    </group>
  );
}

/**
 * 2. AYODHYA ROYAL PALACE (KANAK BHAVAN / RAJ MAHAL) — Exact match to "Ayodhya Royal Palace" in Asset Kit
 * Monumental multi-tiered sandstone & gold palace with wide ceremonial staircase,
 * crimson & royal-purple Sun-emblem banners, arched colonnades, and 7 golden domes.
 */
export function AyodhyaRoyalPalace({
  position = [0, 0, -135],
  rotation = [0, 0, 0],
  scale = 1,
  isNight = false,
}) {
  const sandstoneTex = useMemo(() => getSandstoneTexture(), []);
  const crimsonBanner = useMemo(() => getSunBannerTexture('#991b1b'), []);
  const royalPurpleBanner = useMemo(() => getSunBannerTexture('#581c87'), []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Colossal Raised Royal Plinth */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[48, 3.6, 22]} />
        <meshStandardMaterial map={sandstoneTex} color="#9a3412" roughness={0.55} />
      </mesh>
      <mesh position={[0, 3.7, 0]}>
        <boxGeometry args={[49, 0.35, 22.8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Sweeping Grand Ceremonial Staircase in Front */}
      {Array.from({ length: 8 }).map((_, s) => (
        <mesh
          key={s}
          position={[0, 0.22 + s * 0.44, 11.4 + (7 - s) * 0.85]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[14 - s * 0.35, 0.45, 0.95]} />
          <meshStandardMaterial map={sandstoneTex} color="#c26d2d" roughness={0.5} />
        </mesh>
      ))}
      {/* Staircase Balustrades with Golden Diyas */}
      {[-7.2, 7.2].map((bx, i) => (
        <mesh key={i} position={[bx, 2.0, 14.2]} rotation={[0.42, 0, 0]} castShadow>
          <boxGeometry args={[0.85, 1.1, 7.8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.22} />
        </mesh>
      ))}

      {/* Tier 1: Grand Arched Ground Colonnade */}
      <mesh position={[0, 7.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[42, 6.8, 17]} />
        <meshStandardMaterial map={sandstoneTex} color="#d97706" roughness={0.45} />
      </mesh>
      {/* Glowing Arched Portals Across Tier 1 */}
      {[-16, -11, -6, 0, 6, 11, 16].map((wx, i) => (
        <group key={i} position={[wx, 6.8, 8.6]}>
          <mesh>
            <boxGeometry args={[2.4, 4.2, 0.2]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#f59e0b"
              emissiveIntensity={isNight ? 2.8 : 0.65}
            />
          </mesh>
          <mesh position={[0, 2.2, 0.08]}>
            <coneGeometry args={[1.4, 1.1, 4]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Suryavanshi Crimson & Purple Banners Flanking the Grand Staircase */}
      {[-9.5, -3.5, 3.5, 9.5].map((bx, i) => (
        <mesh key={i} position={[bx, 6.8, 8.75]}>
          <planeGeometry args={[1.8, 4.2]} />
          <meshStandardMaterial
            map={i % 2 === 0 ? crimsonBanner : royalPurpleBanner}
            emissive={i % 2 === 0 ? '#7f1d1d' : '#3b0764'}
            emissiveIntensity={isNight ? 0.45 : 0.15}
          />
        </mesh>
      ))}

      {/* Tier 2: Imperial Upper Gallery */}
      <mesh position={[0, 13.4, -1]} castShadow receiveShadow>
        <boxGeometry args={[30, 5.6, 13]} />
        <meshStandardMaterial map={sandstoneTex} color="#e08e3c" roughness={0.42} />
      </mesh>
      {[-10, -5, 0, 5, 10].map((wx, i) => (
        <mesh key={i} position={[wx, 13.2, 5.6]}>
          <boxGeometry args={[2.0, 3.4, 0.2]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#f59e0b"
            emissiveIntensity={isNight ? 2.6 : 0.55}
          />
        </mesh>
      ))}

      {/* Tier 3: Central Throne Hall Drum & Monumental Swarna Dome */}
      <mesh position={[0, 18.2, -1.5]} castShadow>
        <cylinderGeometry args={[6.2, 6.8, 4.2, 16]} />
        <meshStandardMaterial map={sandstoneTex} color="#d97706" />
      </mesh>
      <mesh position={[0, 20.3, -1.5]} castShadow>
        <sphereGeometry args={[6.0, 24, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.14} />
      </mesh>
      <mesh position={[0, 27.4, -1.5]}>
        <coneGeometry args={[0.7, 2.6, 12]} />
        <meshStandardMaterial color="#fef08a" metalness={0.96} roughness={0.08} />
      </mesh>

      {/* 6 Subsidiary Chhatri Domes Across Palace Wings */}
      {[
        { x: -16, y: 10.8, z: 0, r: 2.2 },
        { x: 16, y: 10.8, z: 0, r: 2.2 },
        { x: -10.5, y: 16.4, z: -1, r: 2.5 },
        { x: 10.5, y: 16.4, z: -1, r: 2.5 },
        { x: -5.5, y: 18.8, z: -1.5, r: 1.9 },
        { x: 5.5, y: 18.8, z: -1.5, r: 1.9 },
      ].map((d, i) => (
        <group key={i} position={[d.x, d.y, d.z]}>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[d.r * 0.82, d.r * 0.88, 2.2, 12]} />
            <meshStandardMaterial map={sandstoneTex} color="#b45309" />
          </mesh>
          <mesh position={[0, 2.2, 0]}>
            <sphereGeometry args={[d.r, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.16} />
          </mesh>
          <mesh position={[0, 2.2 + d.r + 0.55, 0]}>
            <coneGeometry args={[0.28, 1.1, 8]} />
            <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      ))}

      <pointLight
        position={[0, 14, 12]}
        color="#fbbf24"
        intensity={isNight ? 18 : 5}
        distance={55}
      />
    </group>
  );
}

/**
 * 3. RESIDENTIAL HAVELI & PALACE COURTYARDS — With Pillared Verandas, Jharokhas & Flower Torans
 */
export function GrandPalaceBuilding({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  floors = 2,
  width = 11,
  depth = 7.5,
  wallColor = '#d98a3c',
  isNight = false,
}) {
  const sandstoneTex = useMemo(() => getSandstoneTexture(), []);
  const sunBannerTex = useMemo(() => getSunBannerTexture('#991b1b'), []);
  const heightPerFloor = 4.2;
  const totalHeight = floors * heightPerFloor;

  return (
    <group position={position} rotation={rotation}>
      {/* Raised Veranda Plinth */}
      <mesh position={[0, 0.55, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[width + 1.8, 1.1, depth + 2.4]} />
        <meshStandardMaterial map={sandstoneTex} color="#9a3412" roughness={0.6} />
      </mesh>

      {/* Pillared Front Veranda Porch (Where families light diyas & share sweets in S3) */}
      {[-width * 0.38, -width * 0.14, width * 0.14, width * 0.38].map((px, pi) => (
        <mesh key={pi} position={[px, 2.8, depth / 2 + 1.25]} castShadow>
          <cylinderGeometry args={[0.22, 0.28, 3.6, 10]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.72} roughness={0.26} />
        </mesh>
      ))}
      {/* Veranda Flower Torans Between Pillars */}
      {[-width * 0.26, 0, width * 0.26].map((gx, gi) => (
        <group key={gi} position={[gx, 4.35, depth / 2 + 1.25]}>
          <FlowerToranGarland width={width * 0.24} />
        </group>
      ))}

      {/* Main Palace Floors */}
      {Array.from({ length: floors }).map((_, f) => {
        const fy = 1.1 + f * heightPerFloor;
        const floorW = width - f * 0.7;
        const floorD = depth - f * 0.5;
        return (
          <group key={f} position={[0, fy, 0]}>
            <mesh position={[0, heightPerFloor / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[floorW, heightPerFloor, floorD]} />
              <meshStandardMaterial
                map={sandstoneTex}
                color={wallColor}
                roughness={0.48}
                metalness={0.12}
              />
            </mesh>

            {/* Golden Chhajja Eave Cornice */}
            <mesh position={[0, heightPerFloor - 0.12, 0]}>
              <boxGeometry args={[floorW + 1.0, 0.28, floorD + 1.0]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.75} roughness={0.22} />
            </mesh>

            {/* Glowing Arched Windows & Jharokha Balconies */}
            {[-floorW * 0.3, 0, floorW * 0.3].map((wx, wi) => (
              <group key={wi} position={[wx, heightPerFloor * 0.48, floorD / 2 + 0.08]}>
                <mesh>
                  <boxGeometry args={[1.35, 2.2, 0.16]} />
                  <meshStandardMaterial
                    color={isNight ? '#fef08a' : '#78350f'}
                    emissive={isNight ? '#f59e0b' : '#b45309'}
                    emissiveIntensity={isNight ? 2.5 : 0.45}
                  />
                </mesh>
                <mesh position={[0, 1.15, 0.06]}>
                  <coneGeometry args={[0.92, 0.72, 4]} />
                  <meshStandardMaterial color="#fbbf24" metalness={0.82} roughness={0.2} />
                </mesh>
                {f > 0 && (
                  <group position={[0, -0.95, 0.4]}>
                    <mesh>
                      <boxGeometry args={[1.75, 0.35, 0.85]} />
                      <meshStandardMaterial color="#b45309" />
                    </mesh>
                    <HangingLantern position={[0, -0.55, 0.3]} isNight={isNight} scale={0.75} />
                  </group>
                )}
              </group>
            ))}

            {/* Royal Sun Banner on Upper Facade */}
            {f === 1 && (
              <>
                <mesh position={[-floorW * 0.44, heightPerFloor * 0.45, floorD / 2 + 0.12]}>
                  <planeGeometry args={[0.9, 2.1]} />
                  <meshStandardMaterial map={sunBannerTex} />
                </mesh>
                <mesh position={[floorW * 0.44, heightPerFloor * 0.45, floorD / 2 + 0.12]}>
                  <planeGeometry args={[0.9, 2.1]} />
                  <meshStandardMaterial map={sunBannerTex} />
                </mesh>
              </>
            )}
          </group>
        );
      })}

      {/* Rooftop Chhatri Domes & Golden Kalash Finials */}
      {[-width * 0.28, 0, width * 0.28].map((dx, i) => {
        const domeRadius = i === 1 ? 1.85 : 1.25;
        return (
          <group key={i} position={[dx, 1.1 + totalHeight, 0]}>
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[domeRadius * 0.85, domeRadius * 0.9, 1.2, 12]} />
              <meshStandardMaterial map={sandstoneTex} color="#b45309" roughness={0.5} />
            </mesh>
            <mesh position={[0, 1.2, 0]} castShadow>
              <sphereGeometry args={[domeRadius, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.16} />
            </mesh>
            <mesh position={[0, 1.2 + domeRadius + 0.35, 0]}>
              <coneGeometry args={[0.22, 0.85, 8]} />
              <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * 4. SHRI RAM TEMPLE (GRAND NAGARA MANDIR) — Exact match to "Shri Ram Temple" in Asset Kit & S4
 * Features stepped Jagati plinth, pillared Mandapa, swinging brass bells, soaring Nagara Shikhara
 * with subsidiary Urushringas, fluttering Dharma Flag, and an illuminated golden Garbhagriha
 * sanctum housing the golden Murtis of Lord Shri Ram (with Kodanda bow), Sita Mata & Lakshmana!
 */
export function GrandTempleMandir({ position = [0, 0, 0], isNight = false }) {
  const sandstoneTex = useMemo(() => getSandstoneTexture(), []);
  const [deityTex, setDeityTex] = useState(null);
  const flagRef = useRef();
  const bellRef1 = useRef();
  const bellRef2 = useRef();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      '/art/temple_deity.png',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        setDeityTex(tex);
      },
      undefined,
      () => {}
    );
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(t * 4.2) * 0.24;
      flagRef.current.rotation.z = Math.cos(t * 3.1) * 0.09;
    }
    if (bellRef1.current && bellRef2.current) {
      bellRef1.current.rotation.z = Math.sin(t * 3.5) * 0.25;
      bellRef2.current.rotation.z = -Math.sin(t * 3.5) * 0.25;
    }
  });

  return (
    <group position={position}>
      {/* Stepped Jagati Temple Plinth */}
      <mesh position={[0, 0.8, 0]} receiveShadow castShadow>
        <boxGeometry args={[24, 1.6, 25]} />
        <meshStandardMaterial map={sandstoneTex} color="#9a3412" roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.9, 0]} receiveShadow castShadow>
        <boxGeometry args={[20.5, 0.85, 21.5]} />
        <meshStandardMaterial map={sandstoneTex} color="#d97706" roughness={0.42} metalness={0.25} />
      </mesh>

      {/* Grand Front Staircase with Flanking Brass Lamp Stands & Kalash */}
      {[0, 1, 2, 3, 4].map((step) => (
        <mesh
          key={step}
          position={[0, 0.22 + step * 0.42, 10.8 + (4 - step) * 0.72]}
          receiveShadow
        >
          <boxGeometry args={[8.8, 0.44, 0.85]} />
          <meshStandardMaterial map={sandstoneTex} color="#b45309" roughness={0.5} />
        </mesh>
      ))}
      <BrassDiyasStand position={[-5.2, 2.3, 9.8]} isNight={isNight} scale={1.35} />
      <BrassDiyasStand position={[5.2, 2.3, 9.8]} isNight={isNight} scale={1.35} />
      <MangalKalash position={[-3.8, 2.3, 10.2]} scale={1.3} />
      <MangalKalash position={[3.8, 2.3, 10.2]} scale={1.3} />

      {/* Pillared Sabha-Mandapa Hall (Front Pavilion) */}
      <group position={[0, 2.3, 4.2]}>
        {[
          [-6.0, 3.0, 3.8],
          [-2.8, 3.0, 3.8],
          [2.8, 3.0, 3.8],
          [6.0, 3.0, 3.8],
          [-6.0, 3.0, -2.5],
          [6.0, 3.0, -2.5],
        ].map((pp, i) => (
          <group key={i} position={pp}>
            <mesh castShadow>
              <cylinderGeometry args={[0.48, 0.58, 6.0, 12]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.78} roughness={0.22} />
            </mesh>
            <mesh position={[0, 2.8, 0]}>
              <boxGeometry args={[1.35, 0.45, 1.35]} />
              <meshStandardMaterial color="#fef08a" metalness={0.85} roughness={0.18} />
            </mesh>
          </group>
        ))}

        {/* Flower Torans Across Mandapa Entrance */}
        <group position={[0, 5.6, 3.8]}>
          <FlowerToranGarland width={5.4} />
        </group>

        {/* Stepped Phamsana Pyramid Roof over Mandapa */}
        {[0, 1, 2, 3, 4].map((tier) => (
          <mesh key={tier} position={[0, 6.4 + tier * 0.92, 0.5]} castShadow>
            <boxGeometry args={[14.2 - tier * 2.3, 0.88, 9.5 - tier * 1.5]} />
            <meshStandardMaterial
              map={sandstoneTex}
              color={tier % 2 === 0 ? '#d97706' : '#fbbf24'}
              metalness={0.72}
              roughness={0.24}
            />
          </mesh>
        ))}
        <mesh position={[0, 11.4, 0.5]}>
          <coneGeometry args={[0.5, 1.5, 10]} />
          <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Swinging Brass Temple Bells */}
        <group ref={bellRef1} position={[-1.6, 5.8, 3.8]}>
          <mesh position={[0, -0.65, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 1.3, 6]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} />
          </mesh>
          <mesh position={[0, -1.35, 0]}>
            <coneGeometry args={[0.38, 0.52, 14]} />
            <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.08} />
          </mesh>
        </group>
        <group ref={bellRef2} position={[1.6, 5.8, 3.8]}>
          <mesh position={[0, -0.65, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 1.3, 6]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} />
          </mesh>
          <mesh position={[0, -1.35, 0]}>
            <coneGeometry args={[0.38, 0.52, 14]} />
            <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.08} />
          </mesh>
        </group>
      </group>

      {/* Towering Garbhagriha & Nagara Shikhara Spire (Back Sanctum) */}
      <group position={[0, 2.3, -3.6]}>
        {/* Sanctum Body */}
        <mesh position={[0, 3.6, 0]} castShadow>
          <boxGeometry args={[12.8, 7.2, 11.5]} />
          <meshStandardMaterial map={sandstoneTex} color="#b45309" roughness={0.45} />
        </mesh>

        {/* RADIANT GOLDEN GARBHAGRIHA SANCTUM WITH TEMPLE DEITY IMAGE (`temple-deity-ref`) */}
        <group position={[0, 3.0, 5.8]}>
          {/* Outer Ornate Golden Sanctum Doorway Frame (Dwarashakha) */}
          <mesh position={[0, 0, -0.05]}>
            <boxGeometry args={[5.0, 5.5, 0.22]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.16} />
          </mesh>
          {/* Left & Right Carved Golden Jamb Pillars */}
          <mesh position={[-2.35, 0, 0.1]}>
            <cylinderGeometry args={[0.18, 0.22, 5.4, 12]} />
            <meshStandardMaterial color="#fef08a" metalness={0.92} roughness={0.12} />
          </mesh>
          <mesh position={[2.35, 0, 0.1]}>
            <cylinderGeometry args={[0.18, 0.22, 5.4, 12]} />
            <meshStandardMaterial color="#fef08a" metalness={0.92} roughness={0.12} />
          </mesh>
          {/* Top Golden Arch Torana Header */}
          <mesh position={[0, 2.72, 0.12]}>
            <boxGeometry args={[5.3, 0.38, 0.35]} />
            <meshStandardMaterial color="#fef08a" metalness={0.92} roughness={0.12} />
          </mesh>

          {/* Sacred Ram Darbar Deity Portrait from `temple-deity-ref/image.png` */}
          <mesh position={[0, 0, 0.1]}>
            <planeGeometry args={[4.4, 4.9]} />
            {deityTex ? (
              <meshBasicMaterial map={deityTex} toneMapped={false} />
            ) : (
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#f59e0b"
                emissiveIntensity={1.2}
              />
            )}
          </mesh>

          {/* Soft Golden Sanctum Illumination */}
          <pointLight
            position={[0, 0.5, 1.5]}
            color="#fef08a"
            intensity={isNight ? 5 : 2.5}
            distance={10}
          />
        </group>

        {/* Multi-Tiered Curvilinear Nagara Shikhara Tower */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((t) => {
          const w = 10.8 - t * 1.15;
          return (
            <mesh key={t} position={[0, 7.4 + t * 1.65, 0]} castShadow>
              <boxGeometry args={[w, 1.62, w]} />
              <meshStandardMaterial
                map={sandstoneTex}
                color={t % 2 === 0 ? '#fbbf24' : '#d97706'}
                metalness={0.82}
                roughness={0.2}
              />
            </mesh>
          );
        })}

        {/* 8 Subsidiary Urushringa Spires Flanking the Main Shikhara */}
        {[
          [-4.5, 9.2, 4.5],
          [4.5, 9.2, 4.5],
          [-4.5, 9.2, -4.5],
          [4.5, 9.2, -4.5],
          [0, 11.2, 4.6],
          [0, 11.2, -4.6],
          [-4.6, 11.2, 0],
          [4.6, 11.2, 0],
        ].map((up, i) => (
          <mesh key={i} position={up} castShadow>
            <coneGeometry args={[1.55, 6.2, 8]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.86} roughness={0.18} />
          </mesh>
        ))}

        {/* Sacred Amalaka Disc & Golden Kalash Finial */}
        <mesh position={[0, 20.6, 0]}>
          <torusGeometry args={[1.65, 0.5, 12, 24]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.92} roughness={0.12} />
        </mesh>
        <mesh position={[0, 22.4, 0]}>
          <coneGeometry args={[0.75, 2.5, 14]} />
          <meshStandardMaterial color="#fef08a" metalness={0.96} roughness={0.08} />
        </mesh>

        {/* Fluttering Saffron Dharma Flag (Dhwaja) */}
        <group position={[0, 24.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.07, 0.07, 3.0, 8]} />
            <meshStandardMaterial color="#fef08a" metalness={0.95} />
          </mesh>
          <mesh ref={flagRef} position={[1.4, 0.7, 0]}>
            <coneGeometry args={[0.85, 2.8, 3]} rotation={[0, 0, -Math.PI / 2]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#ea580c"
              emissiveIntensity={0.55}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      <pointLight
        position={[0, 7.0, 5.2]}
        color="#fbbf24"
        intensity={isNight ? 16 : 6}
        distance={35}
      />
    </group>
  );
}

/**
 * 5. MANDAP / SABHA PAVILION — Exact match to "Mandap / Sabha" in Asset Kit
 * Octagonal pillared stone & gold pavilion with crimson-and-gold draped valance and lotus dome.
 */
export function MandapSabha({
  position = [0, 0, 0],
  scale = 1,
  isNight = false,
}) {
  const sandstoneTex = useMemo(() => getSandstoneTexture(), []);

  return (
    <group position={position} scale={scale}>
      {/* Stepped Octagonal Plinth */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4.4, 4.8, 0.9, 8]} />
        <meshStandardMaterial map={sandstoneTex} color="#9a3412" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[4.1, 4.3, 0.2, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 8 Carved Sandstone & Gold Pillars */}
      {Array.from({ length: 8 }).map((_, i) => {
        const ang = (i * Math.PI * 2) / 8 + Math.PI / 8;
        const px = Math.cos(ang) * 3.4;
        const pz = Math.sin(ang) * 3.4;
        return (
          <group key={i} position={[px, 2.85, pz]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.24, 0.3, 3.6, 10]} />
              <meshStandardMaterial map={sandstoneTex} color="#d97706" roughness={0.4} />
            </mesh>
            <mesh position={[0, 1.7, 0]}>
              <cylinderGeometry args={[0.36, 0.26, 0.3, 10]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.18} />
            </mesh>
          </group>
        );
      })}

      {/* Crimson & Gold Draped Valance Eaves + Marigold Garlands */}
      <mesh position={[0, 4.5, 0]}>
        <cylinderGeometry args={[3.8, 3.9, 0.55, 8, 1, true]} />
        <meshStandardMaterial color="#991b1b" side={THREE.DoubleSide} roughness={0.4} />
      </mesh>
      <mesh position={[0, 4.22, 0]}>
        <torusGeometry args={[3.75, 0.14, 8, 24]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.45} />
      </mesh>

      {/* Stepped Octagonal Dome Roof & Finial */}
      <mesh position={[0, 5.1, 0]} castShadow>
        <coneGeometry args={[4.5, 1.4, 8]} />
        <meshStandardMaterial map={sandstoneTex} color="#d97706" roughness={0.45} />
      </mesh>
      <mesh position={[0, 5.8, 0]} castShadow>
        <sphereGeometry args={[2.6, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.16} />
      </mesh>
      <mesh position={[0, 8.7, 0]}>
        <coneGeometry args={[0.25, 0.9, 8]} />
        <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Center Hanging Lantern inside Mandap */}
      <HangingLantern position={[0, 4.1, 0]} isNight={isNight} scale={1.2} />
    </group>
  );
}

/**
 * 6. STREET & MARKET ASSETS — Exact match to "Market Stall", "Sweets & Savouries",
 * "Cart", "Baskets", "Pots & Urns", "Grain Sacks" in Asset Kit & S5 Royal Market!
 */
export function BazaarStall({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  canopyColor = '#dc2626',
  secondaryStripe = '#fef3c7',
  isNight = false,
}) {
  const canopyTex = useMemo(
    () => getCanopyStripeTexture(canopyColor, secondaryStripe),
    [canopyColor, secondaryStripe]
  );

  return (
    <group position={position} rotation={rotation}>
      {/* Carved Wooden Counter Table */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 1.15, 2.0]} />
        <meshStandardMaterial color="#78350f" roughness={0.55} />
      </mesh>
      {/* Decorative Golden Front Panel */}
      <mesh position={[0, 0.65, 1.02]}>
        <planeGeometry args={[3.4, 0.85]} />
        <meshStandardMaterial color="#b45309" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Embroidered Counter Cloth */}
      <mesh position={[0, 1.24, 0]}>
        <boxGeometry args={[3.95, 0.12, 2.12]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.65} roughness={0.28} />
      </mesh>

      {/* 4 Carved Corner Poles */}
      {[
        [-1.75, 2.0, 0.88],
        [1.75, 2.0, 0.88],
        [-1.75, 2.0, -0.88],
        [1.75, 2.0, -0.88],
      ].map((pp, i) => (
        <mesh key={i} position={pp}>
          <cylinderGeometry args={[0.07, 0.08, 2.8, 8]} />
          <meshStandardMaterial color="#d97706" metalness={0.75} />
        </mesh>
      ))}

      {/* Striped Silk Canopy Roof */}
      <mesh position={[0, 3.65, 0]} castShadow>
        <coneGeometry args={[2.85, 1.35, 4]} rotation={[0, Math.PI / 4, 0]} />
        <meshStandardMaterial map={canopyTex} roughness={0.4} />
      </mesh>

      {/* Flower Garland & Hanging Lanterns under Stall Eave */}
      <group position={[0, 3.05, 0.92]}>
        <FlowerToranGarland width={3.4} />
      </group>
      <HangingLantern position={[-1.6, 2.75, 0.92]} isNight={isNight} scale={0.7} />
      <HangingLantern position={[1.6, 2.75, 0.92]} isNight={isNight} scale={0.7} />

      {/* Tiered Pyramids of Golden Sweets (Laddoos, Jalebis, Kaju Barfi) & Savouries */}
      {[-1.15, 0, 1.15].map((sx, i) => (
        <group key={i} position={[sx, 1.35, 0.15]}>
          {/* Brass Thali Platter */}
          <mesh>
            <cylinderGeometry args={[0.46, 0.34, 0.08, 14]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.18} />
          </mesh>
          {/* Tiered Sweet Pyramid */}
          {[0, 1, 2].map((tier) => (
            <mesh key={tier} position={[0, 0.12 + tier * 0.14, 0]}>
              <cylinderGeometry
                args={[0.34 - tier * 0.09, 0.38 - tier * 0.09, 0.14, 12]}
              />
              <meshStandardMaterial
                color={i === 0 ? '#f59e0b' : i === 1 ? '#fbbf24' : '#ea580c'}
                emissive="#d97706"
                emissiveIntensity={0.35}
                roughness={0.35}
              />
            </mesh>
          ))}
        </group>
      ))}

      {isNight && (
        <pointLight position={[0, 2.6, 0.8]} color="#fbbf24" intensity={4.5} distance={10} />
      )}
    </group>
  );
}

/**
 * Market Props Cluster: Wooden Fruit/Flower Cart, Woven Baskets, Terracotta Pots & Urns, Grain Sacks
 */
export function MarketPropsCluster({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 1. Wooden Two-Wheeled Handcart ("Cart" from Asset Kit) */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.78, 0]} castShadow>
          <boxGeometry args={[1.9, 0.28, 1.35]} />
          <meshStandardMaterial color="#78350f" roughness={0.65} />
        </mesh>
        {/* Spoked Wooden Wheels */}
        {[-0.65, 0.65].map((wz, i) => (
          <group key={i} position={[0, 0.48, wz]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.48, 0.48, 0.1, 14]} />
              <meshStandardMaterial color="#92400e" roughness={0.6} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.14, 0.14, 0.14, 10]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.8} />
            </mesh>
          </group>
        ))}
        {/* Heaped Fruits & Flowers on Cart */}
        {[
          [-0.45, 1.02, -0.25, '#f59e0b'],
          [0, 1.06, 0.2, '#ef4444'],
          [0.45, 1.02, -0.15, '#10b981'],
          [-0.2, 1.15, 0, '#fde047'],
          [0.25, 1.12, 0.25, '#f97316'],
        ].map((f, idx) => (
          <mesh key={idx} position={[f[0], f[1], f[2]]}>
            <sphereGeometry args={[0.24, 10, 10]} />
            <meshStandardMaterial color={f[3]} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* 2. Woven Bamboo Baskets ("Baskets" from Asset Kit) */}
      <group position={[1.65, 0, 0.4]}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.26, 0.55, 12]} />
          <meshStandardMaterial color="#d97706" roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.56, 0]}>
          <sphereGeometry args={[0.33, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[0.55, 0.22, -0.2]} castShadow>
          <cylinderGeometry args={[0.28, 0.2, 0.44, 12]} />
          <meshStandardMaterial color="#b45309" roughness={0.75} />
        </mesh>
      </group>

      {/* 3. Sculpted Terracotta Pots & Urns ("Pots & Urns" from Asset Kit) */}
      <group position={[-1.6, 0, 0.35]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.34, 0.9, 14]} />
          <meshStandardMaterial color="#b45309" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.26, 0.18, 0.2, 14]} />
          <meshStandardMaterial color="#9a3412" roughness={0.5} />
        </mesh>
        <mesh position={[-0.52, 0.3, 0.25]} castShadow>
          <sphereGeometry args={[0.32, 12, 12]} />
          <meshStandardMaterial color="#c2410c" roughness={0.55} />
        </mesh>
      </group>

      {/* 4. Burlap Grain & Spice Sacks ("Grain Sacks" from Asset Kit) */}
      <group position={[2.5, 0, -0.3]}>
        {[
          [0, 0.32, 0, '#fde047'],
          [0.52, 0.28, 0.15, '#ef4444'],
          [0.25, 0.3, -0.45, '#f59e0b'],
        ].map((s, i) => (
          <group key={i} position={[s[0], s[1], s[2]]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.26, 0.3, 0.62, 10]} />
              <meshStandardMaterial color="#a16207" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.31, 0]}>
              <coneGeometry args={[0.24, 0.18, 10]} />
              <meshStandardMaterial color={s[3]} roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/**
 * 7. PROPS & FESTIVE DECOR FROM ASSET KIT:
 * FlowerToranGarland, HangingLantern, FestiveStreetFestoons, MangalKalash,
 * BrassDiyasStand, FestiveUmbrella, DirectionalSign, InteractionMarker3D
 */
export function FlowerToranGarland({ width = 3.0 }) {
  return (
    <group>
      {/* Top Mango Leaf & Marigold Header Bar */}
      <mesh>
        <boxGeometry args={[width, 0.16, 0.14]} />
        <meshStandardMaterial color="#15803d" roughness={0.6} />
      </mesh>
      {/* 3 Scalloped Marigold Swags */}
      {[-width * 0.32, 0, width * 0.32].map((sx, i) => (
        <mesh key={i} position={[sx, -0.05, 0]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[width * 0.16, 0.085, 8, 14, Math.PI]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#f59e0b' : '#ef4444'}
            emissive="#d97706"
            emissiveIntensity={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}

export function HangingLantern({ position = [0, 0, 0], isNight = false, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Gold Chain */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 6]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} />
      </mesh>
      {/* Top & Bottom Gold Caps */}
      <mesh position={[0, 0.25, 0]}>
        <coneGeometry args={[0.32, 0.22, 6]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Glowing Hexagonal Silk Core */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.22, 0.45, 6]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#f59e0b"
          emissiveIntensity={isNight ? 2.8 : 0.9}
        />
      </mesh>
      {/* Bottom Tassel */}
      <mesh position={[0, -0.35, 0]}>
        <coneGeometry args={[0.1, 0.28, 6]} rotation={[Math.PI, 0, 0]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
    </group>
  );
}

/**
 * Overhead Street Festoons: Catenary Fairy Lights, Flower Torans & Hanging Lanterns
 * Spanning across the avenue in S2, S3 & S5!
 */
export function FestiveStreetFestoons({ zPositions = [], isNight = false }) {
  return (
    <group>
      {zPositions.map((z, idx) => (
        <group key={idx} position={[0, 8.2, z]}>
          {/* Draped Catenary Fairy Light String */}
          <mesh rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[14.5, 0.04, 6, 28, Math.PI * 0.42]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
          {/* Glowing Fairy Light Bulbs & Hanging Lanterns along the span */}
          {[-9, -6, -3, 0, 3, 6, 9].map((x, bi) => {
            const dropY = -Math.cos((x / 12) * (Math.PI / 2)) * 1.4;
            return (
              <group key={bi} position={[x, dropY, 0]}>
                <mesh>
                  <sphereGeometry args={[0.14, 8, 8]} />
                  <meshBasicMaterial color="#fef9c3" />
                </mesh>
                {bi % 2 === 1 && (
                  <HangingLantern position={[0, -0.65, 0]} isNight={isNight} scale={0.95} />
                )}
              </group>
            );
          })}
        </group>
      ))}
    </group>
  );
}

/**
 * Auspicious Mangal Kalash (Brass Pot with Mango Leaves & Coconut)
 */
export function MangalKalash({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Brass Pot Belly */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <sphereGeometry args={[0.26, 14, 12]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Sacred Red Moli Thread Ring */}
      <mesh position={[0, 0.46, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.14, 0.03, 8, 14]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* Green Mango Leaves Crown */}
      {Array.from({ length: 7 }).map((_, i) => {
        const ang = (i * Math.PI * 2) / 7;
        return (
          <mesh
            key={i}
            position={[Math.cos(ang) * 0.16, 0.56, Math.sin(ang) * 0.16]}
            rotation={[0.5, -ang, 0]}
          >
            <coneGeometry args={[0.07, 0.24, 5]} />
            <meshStandardMaterial color="#16a34a" roughness={0.5} />
          </mesh>
        );
      })}
      {/* Auspicious Coconut on Top */}
      <mesh position={[0, 0.66, 0]}>
        <sphereGeometry args={[0.13, 10, 10]} />
        <meshStandardMaterial color="#78350f" roughness={0.75} />
      </mesh>
    </group>
  );
}

/**
 * Multi-Tiered Brass Diyas Stand (Samai / Deepstambh from Asset Kit)
 */
export function BrassDiyasStand({ position = [0, 0, 0], scale = 1, isNight = false }) {
  return (
    <group position={position} scale={scale}>
      {/* Base & Central Brass Shaft */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.38, 0.45, 0.16, 12]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.18} />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.11, 1.9, 10]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.18} />
      </mesh>
      {/* 3 Circular Flame Tiers */}
      {[0.55, 1.1, 1.65].map((ty, ti) => {
        const r = 0.36 - ti * 0.07;
        return (
          <group key={ti} position={[0, ty, 0]}>
            <mesh>
              <cylinderGeometry args={[r, r * 0.8, 0.08, 12]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
            </mesh>
            {Array.from({ length: 6 }).map((_, fi) => {
              const ang = (fi * Math.PI * 2) / 6;
              return (
                <mesh
                  key={fi}
                  position={[Math.cos(ang) * (r - 0.03), 0.1, Math.sin(ang) * (r - 0.03)]}
                >
                  <coneGeometry args={[0.04, 0.12, 6]} />
                  <meshBasicMaterial color="#fef08a" />
                </mesh>
              );
            })}
          </group>
        );
      })}
      {/* Top Peacock/Kalash Finial */}
      <mesh position={[0, 2.05, 0]}>
        <coneGeometry args={[0.1, 0.25, 8]} />
        <meshStandardMaterial color="#fef08a" metalness={0.95} />
      </mesh>
      {isNight && (
        <pointLight position={[0, 1.4, 0]} color="#fbbf24" intensity={2.5} distance={6} />
      )}
    </group>
  );
}

/**
 * Festive Royal Umbrella (Raj Chhatra from Asset Kit)
 */
export function FestiveUmbrella({
  position = [0, 0, 0],
  scale = 1,
  color = '#dc2626',
}) {
  return (
    <group position={position} scale={scale}>
      {/* Golden Pole */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 3.2, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.18} />
      </mesh>
      {/* Domed Embroidered Parasol Canopy */}
      <mesh position={[0, 3.0, 0]} castShadow>
        <sphereGeometry args={[1.45, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshStandardMaterial color={color} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Gold Zari Fringe Ring */}
      <mesh position={[0, 2.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.42, 0.06, 8, 24]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Top Kalash Finial */}
      <mesh position={[0, 3.6, 0]}>
        <coneGeometry args={[0.12, 0.38, 8]} />
        <meshStandardMaterial color="#fef08a" metalness={0.95} />
      </mesh>
    </group>
  );
}

/**
 * Interactive 3D Hotspot Marker ("Interaction Marker" from Asset Kit)
 * Glowing concentric golden rings on ground + floating '!' badge that opens an Info Scroll!
 */
export function InteractionMarker3D({
  position = [0, 0.1, 0],
  label = 'Inspect Tradition',
  onSelect,
}) {
  const ringRef = useRef();
  const badgeRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.2;
      const pulse = 1 + Math.sin(t * 3) * 0.08;
      ringRef.current.scale.set(pulse, pulse, 1);
    }
    if (badgeRef.current) {
      badgeRef.current.position.y = 1.65 + Math.sin(t * 3) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Glowing Golden Ground Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[0.7, 0.92, 24]} />
        <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} transparent opacity={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[0.42, 0.52, 16]} />
        <meshBasicMaterial color="#fef08a" side={THREE.DoubleSide} transparent opacity={0.65} />
      </mesh>

      {/* Floating Interactive Badge */}
      <group ref={badgeRef} position={[0, 1.65, 0]}>
        <Html center distanceFactor={22} zIndexRange={[20, 0]}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onSelect) onSelect();
            }}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181009]/90 hover:bg-[#fbbf24] text-[#fef08a] hover:text-[#181009] border border-[#fbbf24] shadow-[0_0_18px_rgba(251,191,36,0.75)] transition-all cursor-pointer whitespace-nowrap"
          >
            <span className="w-4 h-4 rounded-full bg-[#fbbf24] group-hover:bg-[#181009] text-[#181009] group-hover:text-[#fbbf24] font-bold text-[11px] flex items-center justify-center">
              !
            </span>
            <span className="text-[11px] font-sans font-bold tracking-wider uppercase">
              {label}
            </span>
          </button>
        </Html>
      </group>
    </group>
  );
}

/**
 * 8. NATURE & ENVIRONMENT ASSETS FROM ASSET KIT:
 * AshokaTree, ParijataTree, BanyanTree, OrnamentalBushes
 */
export function AshokaTree({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.38, 2.8, 10]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.8} />
      </mesh>
      {/* Layered Lush Green Ashoka Foliage */}
      {[
        [0, 2.8, 0, 1.45],
        [-0.6, 3.2, 0.4, 1.1],
        [0.6, 3.2, -0.4, 1.1],
        [0, 3.9, 0, 1.2],
        [0, 4.7, 0, 0.85],
      ].map((c, i) => (
        <mesh key={i} position={[c[0], c[1], c[2]]} castShadow>
          <dodecahedronGeometry args={[c[3], 1]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#15803d' : '#16a34a'}
            roughness={0.65}
          />
        </mesh>
      ))}
    </group>
  );
}

export function ParijataTree({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Sculpted Trunk */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.36, 2.6, 10]} />
        <meshStandardMaterial color="#6b4226" roughness={0.8} />
      </mesh>
      {/* Pink & Lavender Celestial Blossom Canopy */}
      {[
        [0, 2.9, 0, 1.5, '#db2777'],
        [-0.85, 2.7, 0.5, 1.1, '#ec4899'],
        [0.85, 2.7, -0.4, 1.15, '#c026d3'],
        [0.3, 3.5, 0.5, 1.1, '#f472b6'],
        [-0.3, 3.6, -0.4, 1.05, '#e879f9'],
      ].map((c, i) => (
        <mesh key={i} position={[c[0], c[1], c[2]]} castShadow>
          <dodecahedronGeometry args={[c[3], 1]} />
          <meshStandardMaterial
            color={c[4]}
            emissive="#9d174d"
            emissiveIntensity={0.22}
            roughness={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}

export function BanyanTree({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Massive Fluted Banyan Trunk */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.95, 3.6, 12]} />
        <meshStandardMaterial color="#4a2e19" roughness={0.85} />
      </mesh>
      {/* Hanging Aerial Prop Roots */}
      {[
        [-1.2, 1.6, 0.8],
        [1.3, 1.6, -0.7],
        [-0.9, 1.6, -1.1],
        [1.1, 1.6, 1.0],
      ].map((rp, i) => (
        <mesh key={i} position={rp}>
          <cylinderGeometry args={[0.06, 0.09, 3.2, 6]} />
          <meshStandardMaterial color="#5c3a21" roughness={0.85} />
        </mesh>
      ))}
      {/* Broad Spreading Canopy */}
      {[
        [0, 4.1, 0, 2.3],
        [-1.6, 3.6, 0.9, 1.65],
        [1.6, 3.6, -0.8, 1.65],
        [-1.2, 3.7, -1.2, 1.5],
        [1.3, 3.7, 1.2, 1.5],
      ].map((c, i) => (
        <mesh key={i} position={[c[0], c[1], c[2]]} castShadow>
          <dodecahedronGeometry args={[c[3], 1]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#166534' : '#15803d'}
            roughness={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 9. SACRED SARAYU RIVERFRONT GHATS, FLOATING LOTUSES & DISTANT ILLUMINATED SKYLINE (S6)
 */
export function SarayuRiverAndGhats({ position = [0, 0, -90], isNight = false }) {
  const sandstoneTex = useMemo(() => getSandstoneTexture(), []);
  const waterRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (waterRef.current) {
      waterRef.current.material.emissiveIntensity = isNight
        ? 0.65 + Math.sin(t * 2.5) * 0.14
        : 0.22 + Math.sin(t * 2.5) * 0.06;
    }
  });

  // Sacred Pink Water Lotuses floating on the Sarayu River ("Lotus (Water)" from Asset Kit)
  const lotusPositions = useMemo(
    () => [
      [-14, -1.98, -11],
      [-9, -1.98, -13],
      [-5.5, -1.98, -10.5],
      [-2.2, -1.98, -12.2],
      [1.8, -1.98, -11.0],
      [5.4, -1.98, -13.4],
      [9.2, -1.98, -10.8],
      [13.5, -1.98, -12.5],
      [-7.5, -1.98, -16.5],
      [0.5, -1.98, -15.8],
      [7.8, -1.98, -16.2],
    ],
    []
  );

  return (
    <group position={position}>
      {/* Wide Stepped Sandstone Ghats Descending to the Sacred Sarayu Water */}
      {[0, 1, 2, 3, 4, 5, 6].map((step) => (
        <mesh
          key={step}
          position={[0, -step * 0.32, step * -1.45]}
          receiveShadow
        >
          <boxGeometry args={[110, 0.38, 1.65]} />
          <meshStandardMaterial
            map={sandstoneTex}
            color={step % 2 === 0 ? '#c27838' : '#a15c27'}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* Waterfront Mandap Chhatri Pavilions on Both Sides of the Ghats */}
      <MandapSabha position={[-19, 0, -2]} scale={0.85} isNight={isNight} />
      <MandapSabha position={[19, 0, -2]} scale={0.85} isNight={isNight} />

      {/* Sacred Deepstambh (Multi-Tiered Flaming Lamp Pillars) Along the Ghats */}
      {[-30, -12, 12, 30].map((lx, i) => (
        <group key={i} position={[lx, 0, -2.5]}>
          <mesh position={[0, 3.8, 0]} castShadow>
            <cylinderGeometry args={[0.38, 0.8, 7.6, 12]} />
            <meshStandardMaterial map={sandstoneTex} color="#9a3412" roughness={0.5} />
          </mesh>
          {[1.6, 3.1, 4.6, 6.1].map((ty, ti) => (
            <mesh key={ti} position={[0, ty, 0]}>
              <cylinderGeometry args={[1.2 - ti * 0.16, 0.95 - ti * 0.15, 0.22, 12]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#f59e0b"
                emissiveIntensity={isNight ? 2.2 : 0.5}
              />
            </mesh>
          ))}
          {isNight && (
            <pointLight position={[0, 5.5, 1]} color="#fbbf24" intensity={6} distance={18} />
          )}
        </group>
      ))}

      {/* Lush Banyan & Parijata Trees Framing the Ghats */}
      <BanyanTree position={[-26, 0, 2]} scale={1.25} />
      <BanyanTree position={[26, 0, 2]} scale={1.25} />
      <ParijataTree position={[-15, 0, 3]} scale={1.15} />
      <ParijataTree position={[15, 0, 3]} scale={1.15} />

      {/* Reflective Shimmering Sarayu River Surface */}
      <mesh
        ref={waterRef}
        position={[0, -2.05, -36]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[180, 68, 32, 32]} />
        <meshStandardMaterial
          color={isNight ? '#0c223d' : '#1d4ed8'}
          emissive={isNight ? '#d97706' : '#2563eb'}
          emissiveIntensity={isNight ? 0.65 : 0.2}
          metalness={0.94}
          roughness={0.12}
        />
      </mesh>

      {/* Golden Shimmering Light Reflection Columns on the Water (Matching S6 Reference Image!) */}
      {[-28, -18, -8, 0, 8, 18, 28].map((rx, i) => (
        <mesh
          key={i}
          position={[rx, -2.02, -26]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[2.6, 32]} />
          <meshBasicMaterial
            color="#fbbf24"
            transparent
            opacity={isNight ? 0.32 : 0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Blooming Sacred Pink Water Lotuses on Green Lily Pads */}
      {lotusPositions.map((lp, idx) => (
        <group key={idx} position={lp}>
          {/* Green Lily Pad */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.42, 12]} />
            <meshStandardMaterial color="#15803d" roughness={0.6} />
          </mesh>
          {/* Pink Lotus Petals */}
          <mesh position={[0, 0.08, 0]}>
            <coneGeometry args={[0.24, 0.18, 8]} rotation={[Math.PI, 0, 0]} />
            <meshStandardMaterial
              color="#ec4899"
              emissive="#be185d"
              emissiveIntensity={0.35}
            />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
      ))}

      {/* Ceremonial Illuminated Royal Boats on the Sarayu River */}
      {[-18, 5, 22].map((bx, i) => (
        <group key={i} position={[bx, -1.9, -18 - i * 4]} rotation={[0, 0.18 * (i - 1), 0]}>
          <mesh castShadow>
            <boxGeometry args={[4.8, 0.6, 1.5]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 0.95, 0]}>
            <coneGeometry args={[1.2, 1.45, 4]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.85} />
          </mesh>
          <HangingLantern position={[1.8, 0.6, 0]} isNight={isNight} scale={0.65} />
        </group>
      ))}

      {/* Distant Illuminated Ayodhya Royal Palace Skyline Across the River (Matching S1 & S6 Reference!) */}
      <AyodhyaRoyalPalace
        position={[0, -1.8, -56]}
        scale={0.95}
        isNight={isNight}
      />
      <GrandPalaceBuilding
        position={[-34, -1.8, -50]}
        rotation={[0, 0.25, 0]}
        floors={3}
        isNight={isNight}
      />
      <GrandPalaceBuilding
        position={[34, -1.8, -50]}
        rotation={[0, -0.25, 0]}
        floors={3}
        isNight={isNight}
      />
    </group>
  );
}

/**
 * 10. HIGH-PERFORMANCE INSTANCED MESH OF 2,400+ FLICKERING EARTHEN DIYAS & FLAMES
 * Lining Rajpath, Courtyards, Palaces, Temples, Ghats & Floating on the Sarayu River!
 */
export function InstancedKingdomDiyas({ isNight = false }) {
  const baseMeshRef = useRef();
  const flameMeshRef = useRef();

  const diyaPositions = useMemo(() => {
    const pts = [];
    // 1. Along both sides of Grand Rajpath (z from 22 to -86)
    for (let z = 22; z >= -86; z -= 1.0) {
      pts.push([-8.4, 0.08, z]);
      pts.push([8.4, 0.08, z]);
      pts.push([-12.2, 0.08, z]);
      pts.push([12.2, 0.08, z]);
    }

    // 2. Along Palace Verandas, Balconies & Parapets
    for (let z = 16; z >= -82; z -= 1.5) {
      pts.push([-14.8, 1.15, z]);
      pts.push([14.8, 1.15, z]);
      pts.push([-15.8, 5.2, z]);
      pts.push([15.8, 5.2, z]);
      pts.push([-15.8, 9.4, z]);
      pts.push([15.8, 9.4, z]);
    }

    // 3. Around Temple Plinth & Steps (z = -50 to -74)
    for (let x = -11; x <= 11; x += 0.85) {
      pts.push([x, 1.65, -51.5]);
      pts.push([x, 1.65, -75.5]);
    }

    // 4. Hundreds of Diyas along Sarayu Riverfront Ghats & Floating Deepdaan on Water
    for (let x = -46; x <= 46; x += 1.1) {
      pts.push([x, -0.28, -91.4]);
      pts.push([x, -0.6, -92.8]);
      pts.push([x, -0.92, -94.3]);
      pts.push([x, -1.25, -95.8]);
      pts.push([x, -1.58, -97.2]);
      // Floating on the Sarayu River
      pts.push([x + Math.sin(x) * 2.2, -1.98, -100 - (Math.abs(x * 7) % 16)]);
      pts.push([x + Math.cos(x) * 2.2, -1.98, -104 - (Math.abs(x * 11) % 20)]);
      pts.push([x + Math.sin(x * 2) * 2.5, -1.98, -109 - (Math.abs(x * 13) % 24)]);
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
    const flamePulse = 1 + Math.sin(t * 9.5) * 0.16;
    flameMeshRef.current.scale.set(1, flamePulse, 1);
  });

  return (
    <group>
      {/* Sculpted Terracotta Diya Bowls */}
      <instancedMesh ref={baseMeshRef} args={[null, null, count]}>
        <cylinderGeometry args={[0.15, 0.08, 0.09, 8]} />
        <meshStandardMaterial color="#9a3412" roughness={0.6} />
      </instancedMesh>

      {/* Glowing Golden Teardrop Flames */}
      <instancedMesh ref={flameMeshRef} args={[null, null, count]}>
        <coneGeometry args={[0.08, 0.24, 6]} />
        <meshBasicMaterial color={isNight ? '#fef08a' : '#fbbf24'} />
      </instancedMesh>
    </group>
  );
}
