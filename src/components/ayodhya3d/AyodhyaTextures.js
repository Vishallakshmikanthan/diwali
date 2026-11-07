import * as THREE from 'three';

const textureCache = new Map();

/**
 * Generates a carved golden sandstone block texture with lotus border details
 */
export function getSandstoneTexture() {
  if (textureCache.has('sandstone')) return textureCache.get('sandstone');

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Warm sandstone base gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#e3a869');
  grad.addColorStop(0.5, '#d48c46');
  grad.addColorStop(1, '#b86f2c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle stone grain noise
  for (let i = 0; i < 4500; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const alpha = Math.random() * 0.08;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,245,220,${alpha})` : `rgba(80,35,5,${alpha})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Ashlar masonry courses
  ctx.strokeStyle = 'rgba(92, 42, 10, 0.38)';
  ctx.lineWidth = 3;
  const rows = 8;
  const rowH = 512 / rows;
  for (let r = 0; r < rows; r++) {
    const y = r * rowH;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    const cols = 4;
    const colW = 512 / cols;
    const offset = (r % 2) * (colW / 2);
    for (let c = 0; c <= cols; c++) {
      const x = (c * colW + offset) % 512;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + rowH);
      ctx.stroke();
    }
  }

  // Carved ornamental lotus frieze band across the middle & top
  [64, 320].forEach((bandY) => {
    ctx.fillStyle = 'rgba(251, 191, 36, 0.28)';
    ctx.fillRect(0, bandY, 512, 28);
    ctx.strokeStyle = 'rgba(120, 53, 15, 0.55)';
    ctx.lineWidth = 2;
    for (let x = 16; x < 512; x += 32) {
      ctx.beginPath();
      ctx.arc(x, bandY + 14, 10, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  textureCache.set('sandstone', tex);
  return tex;
}

/**
 * Generates the Crimson & Gold Suryavanshi Sun-Emblem Banner (Dhwaj) texture
 */
export function getSunBannerTexture(bgColor = '#991b1b') {
  const key = `banner_${bgColor}`;
  if (textureCache.has(key)) return textureCache.get(key);

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Rich silk background
  const grad = ctx.createLinearGradient(0, 0, 256, 512);
  grad.addColorStop(0, bgColor);
  grad.addColorStop(0.5, '#7f1d1d');
  grad.addColorStop(1, bgColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);

  // Double ornate golden zari borders
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 10;
  ctx.strokeRect(14, 14, 228, 484);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 3;
  ctx.strokeRect(26, 26, 204, 460);

  // Radiant Suryavanshi Sun Emblem in the center
  const cx = 128;
  const cy = 220;

  // Sun rays
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < 24; i++) {
    ctx.rotate((Math.PI * 2) / 24);
    ctx.beginPath();
    ctx.moveTo(0, -34);
    ctx.lineTo(7, -76);
    ctx.lineTo(0, -88);
    ctx.lineTo(-7, -76);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? '#fde047' : '#f59e0b';
    ctx.fill();
  }

  // Sun disc
  const sunGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 42);
  sunGrad.addColorStop(0, '#fffbeb');
  sunGrad.addColorStop(0.6, '#fbbf24');
  sunGrad.addColorStop(1, '#d97706');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, Math.PI * 2);
  ctx.fill();

  // Inner sacred ring
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Bottom golden tassel fringe motif
  ctx.fillStyle = '#fbbf24';
  for (let x = 24; x <= 232; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 460);
    ctx.lineTo(x + 6, 485);
    ctx.lineTo(x - 6, 485);
    ctx.closePath();
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  textureCache.set(key, tex);
  return tex;
}

/**
 * Generates an intricate multi-color Lotus Mandala Rangoli texture
 */
export function getRangoliTexture(variant = 0) {
  const key = `rangoli_${variant}`;
  if (textureCache.has(key)) return textureCache.get(key);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const cx = 256;
  const cy = 256;

  const palettes = [
    ['#e11d48', '#f59e0b', '#06b6d4', '#8b5cf6', '#10b981', '#fef08a'],
    ['#db2777', '#fbbf24', '#3b82f6', '#f97316', '#14b8a6', '#fffbeb'],
    ['#dc2626', '#eab308', '#9333ea', '#059669', '#ec4899', '#fef9c3'],
  ];
  const pal = palettes[variant % palettes.length];

  ctx.clearRect(0, 0, 512, 512);

  ctx.save();
  ctx.translate(cx, cy);

  // Outer scalloped 16-petal lotus ring
  for (let i = 0; i < 16; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / 16);
    ctx.beginPath();
    ctx.moveTo(0, -160);
    ctx.quadraticCurveTo(38, -210, 0, -246);
    ctx.quadraticCurveTo(-38, -210, 0, -160);
    ctx.fillStyle = i % 2 === 0 ? pal[0] : pal[3];
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fffbeb';
    ctx.stroke();
    ctx.restore();
  }

  // Concentric geometric rings
  const rings = [
    { r: 190, col: pal[1] },
    { r: 162, col: pal[2] },
    { r: 132, col: pal[0] },
    { r: 98, col: pal[4] },
  ];
  rings.forEach((rg) => {
    ctx.beginPath();
    ctx.arc(0, 0, rg.r, 0, Math.PI * 2);
    ctx.fillStyle = rg.col;
    ctx.fill();
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#fffbeb';
    ctx.stroke();
  });

  // Inner 12-petal lotus
  for (let i = 0; i < 12; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / 12);
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.quadraticCurveTo(28, -95, 0, -126);
    ctx.quadraticCurveTo(-28, -95, 0, -40);
    ctx.fillStyle = i % 2 === 0 ? pal[1] : pal[5];
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#78350f';
    ctx.stroke();
    ctx.restore();
  }

  // White rice-flour dot bindu ring
  for (let i = 0; i < 24; i++) {
    const ang = (i * Math.PI * 2) / 24;
    ctx.beginPath();
    ctx.arc(Math.cos(ang) * 146, Math.sin(ang) * 146, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fffbeb';
    ctx.fill();
  }

  // Central golden lotus core
  ctx.beginPath();
  ctx.arc(0, 0, 42, 0, Math.PI * 2);
  ctx.fillStyle = pal[5];
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = pal[0];
  ctx.stroke();

  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  textureCache.set(key, tex);
  return tex;
}

/**
 * Generates striped silk canopy texture for Royal Market Stalls
 */
export function getCanopyStripeTexture(primary = '#b91c1c', secondary = '#fef3c7') {
  const key = `canopy_${primary}_${secondary}`;
  if (textureCache.has(key)) return textureCache.get(key);

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const stripes = 8;
  const w = 256 / stripes;
  for (let i = 0; i < stripes; i++) {
    ctx.fillStyle = i % 2 === 0 ? primary : secondary;
    ctx.fillRect(i * w, 0, w, 256);
    // Gold pinstripe
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(i * w, 0, 3, 256);
  }

  // Bottom gold zari border
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(0, 232, 256, 24);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  textureCache.set(key, tex);
  return tex;
}

/**
 * Generates carved sandstone Rajpath avenue paving stone texture
 */
export function getRajpathPavementTexture() {
  if (textureCache.has('rajpath')) return textureCache.get('rajpath');

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#b97a45';
  ctx.fillRect(0, 0, 512, 512);

  // Stone tiles
  const size = 64;
  for (let y = 0; y < 512; y += size) {
    for (let x = 0; x < 512; x += size) {
      const shade = 175 + Math.floor(Math.random() * 22);
      ctx.fillStyle = `rgb(${shade}, ${Math.floor(shade * 0.66)}, ${Math.floor(shade * 0.36)})`;
      ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
    }
  }

  // Gold-inlaid side border lines
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(18, 0, 10, 512);
  ctx.fillRect(484, 0, 10, 512);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 12);
  tex.needsUpdate = true;
  textureCache.set('rajpath', tex);
  return tex;
}

