import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { SEO, PageLayout } from "../components/layout";
import { SERVICES, REVIEWS, COMPANY } from "../lib/data";

// ── Real Star Catalog (BSC5, J2000, deduplicated) ─────────────────────────────
// Format: [RA_hours, Dec_degrees, magnitude]
const STARS: [number, number, number][] = [
  // ── Ярчайшие (mag < 1.5) ──
  [6.7524,  -16.7161, -1.46], // Sirius       α CMa
  [6.3992,  -52.6957, -0.72], // Canopus      α Car
  [14.2603,  19.1822, -0.05], // Arcturus     α Boo
  [18.6156,  38.7837,  0.03], // Vega         α Lyr
  [5.2428,   45.9980,  0.08], // Capella      α Aur
  [5.6036,   -1.2019,  0.12], // Rigel        β Ori
  [7.6550,    5.2250,  0.38], // Procyon      α CMi
  [5.9195,    7.4071,  0.45], // Betelgeuse   α Ori
  [1.6257,  -57.2367,  0.50], // Achernar     α Eri
  [12.4430, -63.0990,  0.61], // Hadar        β Cen
  [19.8464,   8.8683,  0.76], // Altair       α Aql
  [4.5987,   16.5093,  0.87], // Aldebaran    α Tau
  [13.3992,  -11.1613, 1.04], // Spica        α Vir
  [16.4901,  -26.4320, 1.06], // Antares      α Sco
  [22.9608,  -29.6223, 1.16], // Fomalhaut    α PsA
  [7.7555,   28.0262,  1.21], // Pollux       β Gem
  [20.6905,  45.2803,  1.25], // Deneb        α Cyg
  [10.1395,  11.9672,  1.35], // Regulus      α Leo
  [17.5605,  -37.1039, 1.62], // Shaula       λ Sco
  [12.5437,  -57.1127, 1.25], // Mimosa       β Cru
  [12.7739,  -59.6887, 1.63], // Gacrux       γ Cru
  // ── Орион ──
  [5.4194,    6.3497,  1.64], // Bellatrix    γ Ori
  [5.7955,   -9.6699,  1.70], // Alnilam      ε Ori
  [5.6792,   -1.9426,  1.74], // Alnitak      ζ Ori
  [5.5333,   -0.2990,  2.23], // Mintaka      δ Ori
  [5.2433,   -8.2016,  2.78], // Saiph        κ Ori
  // ── Большая Медведица (ковш) ──
  [11.0622,  61.7508,  1.79], // Merak        β UMa
  [11.1625,  53.6944,  3.05], // Phecda       γ UMa (corrected)
  [12.2569,  57.0322,  2.44], // Megrez       δ UMa
  [12.9004,  55.9598,  1.79], // Alioth       ε UMa
  [13.3992,  54.9254,  1.77], // Mizar        ζ UMa
  [13.7983,  49.3133,  1.85], // Alkaid       η UMa
  [11.0621,  61.7508,  1.79], // Dubhe        α UMa
  // ── Кассиопея (W) ──
  [0.6752,   56.5374,  2.23], // Schedar      α Cas
  [0.1529,   59.1497,  2.27], // Caph         β Cas
  [0.9453,   60.7167,  2.15], // γ Cas        Navi
  [1.4304,   60.2353,  2.65], // Ruchbah      δ Cas
  [1.9069,   63.6703,  3.35], // Segin        ε Cas
  // ── Телец ──
  [3.7914,   24.1053,  2.87], // Alcyone      η Tau (Плеяды)
  [3.6261,   24.1053,  3.63], // Electra      17 Tau
  [4.3567,   15.6277,  3.54], // Ain          ε Tau
  [5.5955,   28.6083,  1.65], // Elnath       β Tau
  // ── Персей ──
  [3.0583,   40.9556,  2.10], // Algol        β Per (переменная)
  [3.4081,   49.8613,  1.65], // Mirfak       α Per
  [3.9794,   40.0133,  2.89], // δ Per
  [3.7152,   32.2889,  2.91], // Menkib       ξ Per
  // ── Возничий (пятиугольник) ──
  [5.9922,   44.9474,  1.90], // Menkalinan   β Aur
  [5.0933,   41.2347,  2.62], // θ Aur
  [5.3317,   34.2994,  2.65], // δ Aur
  [4.9498,   33.1661,  3.18], // ι Aur
  // ── Близнецы ──
  [7.5521,   31.8884,  1.58], // Castor       α Gem
  [6.6285,   16.3988,  1.93], // Alhena       γ Gem
  [7.0556,   20.5697,  2.87], // Wasat        δ Gem
  [6.2981,   22.5139,  3.18], // Propus       η Gem
  // ── Лев ──
  [11.8175,  14.5722,  2.14], // Denebola     β Leo
  [10.2817,  19.8417,  2.01], // Algieba      γ Leo
  [11.2399,  20.5236,  2.56], // Zosma        δ Leo
  [9.7645,   23.7742,  3.44], // Adhafera     ζ Leo
  // ── Лебедь ──
  [20.3705,  40.2567,  2.23], // Sadr         γ Cyg
  [20.9244,  45.1306,  2.49], // δ Cyg
  [21.2156,  30.2269,  2.46], // Aljanah      ε Cyg
  [19.4956,  27.9597,  3.20], // η Cyg
  // ── Скорпион ──
  [16.0050,  -22.6217, 2.62], // Graffias     β Sco
  [16.2144,  -19.4607, 2.32], // Dschubba     δ Sco
  [17.7950,  -37.1042, 2.69], // Lesath       υ Sco
  [17.5605,  -43.2389, 2.89], // G Sco        θ Sco
  [17.0297,  -34.2931, 3.21], // Sargas       θ Sco (recheck)
  // ── Стрелец (чайник) ──
  [18.9216,  -26.2967, 2.05], // Kaus Austr.  ε Sgr
  [18.3505,  -29.8281, 2.81], // Kaus Bor.    λ Sgr
  [18.4024,  -25.4217, 2.98], // Kaus Med.    δ Sgr
  [18.9217,  -21.1067, 2.59], // Ascella      ζ Sgr
  [18.7459,  -20.6589, 2.70], // Phi Sgr      φ Sgr
  [19.0785,  -27.6706, 2.81], // Nunki        σ Sgr
  [18.2299,  -21.0581, 3.11], // Polis        μ Sgr
  // ── Дева ──
  [13.5783,  -0.5958,  2.83], // Vindemiatrix ε Vir
  [13.0356,  10.9592,  2.74], // Porrima      γ Vir
  [12.6944,  -1.4494,  3.38], // Auva         δ Vir
  // ── Водолей ──
  [22.0965,  -0.3196,  2.96], // Sadalmelik   α Aqr
  [21.5264,  -5.5711,  2.87], // Sadalsuud    β Aqr
  [22.3606,  -1.3872,  3.27], // Sadachbia    ζ Aqr
  // ── Андромеда ──
  [23.0794,  15.2047,  2.06], // Alpheratz    α And
  [1.1022,   35.6203,  2.07], // Mirach       β And
  [1.9110,   29.5785,  2.26], // Almach       γ And
  // ── Пегас (квадрат) ──
  [22.7164,  10.8317,  2.42], // Scheat       β Peg
  [22.8339,  24.6014,  2.83], // Markab       α Peg
  [23.0794,  28.0828,  2.83], // Algenib      γ Peg
  [21.7364,   9.8750,  2.44], // Enif         ε Peg
  // ── Овен ──
  [2.2944,   29.0945,  2.00], // Hamal        α Ari
  [1.9107,   20.8083,  2.64], // Sheratan     β Ari
  // ── Геркулес ──
  [17.2437,  14.3903,  2.78], // Kornephoros  β Her
  [16.6790,  31.6022,  2.78], // Rasalgethi   α Her
  [17.2500,  36.8092,  2.81], // π Her
  [17.0050,  30.9264,  2.81], // ζ Her
  // ── Волопас ──
  [14.7339,  27.0742,  2.35], // Nekkar       β Boo
  [15.2580,  33.3147,  2.68], // Izar         ε Boo
  [15.0323,  40.3906,  2.69], // Seginus      γ Boo
  // ── Северная Корона ──
  [15.5780,  26.7147,  2.23], // Alphekka     α CrB
  // ── Орёл ──
  [19.7702,  10.6133,  2.72], // Tarazed      γ Aql
  [19.0246,   3.1147,  2.99], // Okab         ζ Aql
  // ── Лира ──
  [18.7459,  32.6897,  3.52], // Sheliak      β Lyr
  [18.8346,  33.3628,  3.24], // Sulafat      γ Lyr
  // ── Дракон ──
  [17.9437,  51.4889,  2.24], // Eltanin      γ Dra
  [17.1432,  65.7144,  2.74], // Rastaban     β Dra
  [14.0731,  64.3756,  3.65], // Thuban       α Dra
  // ── Малая Медведица ──
  [2.5304,   89.2642,  1.97], // Polaris      α UMi
  [14.8497,  74.1553,  2.08], // Kochab       β UMi
  [15.0734,  77.7944,  3.00], // Pherkad      γ UMi
  // ── Весы ──
  [14.8475,  -16.0416, 2.61], // Zuben El.    β Lib
  [14.5047,  -15.9972, 2.75], // Zuben El.    α Lib
  // ── Рыбы ──
  [1.5241,    9.2778,  3.62], // Eta Psc
  [1.2456,   15.3456,  3.69], // ο Psc
  // ── Гидра ──
  [9.4599,   -8.6586,  1.99], // Alphard      α Hya
  // ── Большой Пёс ──
  [7.4046,   -29.3017, 1.98], // Adhara       ε CMa
  [7.1397,   -26.3932, 2.46], // Wezen        δ CMa
  [7.5765,   -28.9722, 2.45], // Mirzam       β CMa
  [7.0295,   -23.8331, 3.02], // Aludra       η CMa
  // ── Малый Пёс ──
  [7.4550,    8.2894,  2.89], // Gomeisa      β CMi
  // ── Рак ──
  [8.7447,    9.1856,  3.52], // Acubens      α Cnc
  [8.9745,   11.8578,  3.52], // Asellus Bor. γ Cnc
];

// ── Уральск координаты ──────────────────────────────────────────────────────
const URALSK_LAT_RAD = 51.2333 * Math.PI / 180;
const URALSK_LON_DEG = 51.3667;

/** Julian Date */
function jd(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Greenwich Mean Sidereal Time (degrees) */
function gmst(jDate: number): number {
  const T = (jDate - 2451545.0) / 36525;
  return (280.46061837 + 360.98564736629 * (jDate - 2451545.0)
    + 0.000387933 * T * T) % 360;
}

/** Project a star (RA deg, Dec deg) to canvas [x, y] or null if below horizon.
 *  Uses equirectangular projection across the full canvas:
 *  azimuth 0-360 → x 0-W (N=left-quarter, E=center, S=right, W=right-quarter)
 *  altitude 0-90 → y H..0 (horizon=bottom, zenith=top)
 */
function starToCanvas(
  raDeg: number, decDeg: number,
  lstDeg: number,
  w: number, h: number
): [number, number, number] | null {
  const decRad = decDeg * Math.PI / 180;
  const haRad = ((lstDeg - raDeg + 360) % 360) * Math.PI / 180;

  // Altitude
  const sinAlt = Math.sin(decRad) * Math.sin(URALSK_LAT_RAD)
               + Math.cos(decRad) * Math.cos(URALSK_LAT_RAD) * Math.cos(haRad);
  const altRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  if (altRad < 0.02) return null; // below horizon

  // Azimuth (N=0, E=90, S=180, W=270)
  const cosAlt = Math.cos(altRad);
  const cosAz = (Math.sin(decRad) - Math.sin(altRad) * Math.sin(URALSK_LAT_RAD))
               / (cosAlt * Math.cos(URALSK_LAT_RAD));
  const sinAz = -Math.cos(decRad) * Math.sin(haRad) / cosAlt;
  let az = Math.atan2(sinAz, cosAz); // radians, N=0
  if (az < 0) az += 2 * Math.PI;

  // Equirectangular projection:
  // South (az=180°) → x=w/2, North → x=0 or w (wraps), East → x=3w/4, West → x=w/4
  // altitude 0° → y=h (horizon), 90° → y=0 (zenith, top)
  const azShifted = (az - Math.PI + 2 * Math.PI) % (2 * Math.PI); // remap so S=0
  const cx = (azShifted / (2 * Math.PI)) * w;
  const cy = h - (altRad / (Math.PI / 2)) * h;

  return [cx, cy, altRad];
}

// ── Particle Network Canvas ────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let mouseX = -9999, mouseY = -9999;
    let lastStarUpdate = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      lastStarUpdate = 0; // force star recompute on resize
    };
    resize();
    window.addEventListener("resize", resize);

    const CONNECT_DIST = 140;
    const MAX_CONNECTIONS = 4;
    const CURSOR_CONNECT_DIST = 180;
    const ATTRACT_RADIUS = 160;
    const MAX_SPEED = 0.3;
    const OVERLOAD_THRESHOLD = 35;
    const OVERLOAD_RADIUS = 80;
    const MIN_PARTICLES = 10;
    const MAX_PARTICLES = 200;

    let lastFrameTime = 0;
    let hidden = false;

    // Цвета по кругу: красный → жёлтый → белый → голубой
    const COLOR_CYCLE: [number,number,number][] = [
      [227, 30, 36],
      [255, 200, 0],
      [255, 255, 255],
      [0, 180, 255],
    ];
    let nextColorIdx = 1; // следующий цвет после взрыва

    // Состояние взрыва
    let exploding = false;
    let explodeFlash = 0;
    let explodeCooldown = 0;
    let explodeColor: [number,number,number] = COLOR_CYCLE[0];

    const onVisibility = () => { hidden = document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      r: number; alpha: number;
      angle: number;
      angleSpeed: number;
      color: [number,number,number];
    }

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const defaultColor: [number,number,number] = [227, 30, 36];

    const makeParticle = (): Particle => ({
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.15, 0.15),
      r: rand(1.2, 2.8),
      alpha: rand(0.35, 0.75),
      angle: rand(0, Math.PI * 2),
      angleSpeed: rand(-0.008, 0.008),
      color: defaultColor,
    });

    const particles: Particle[] = Array.from({ length: 60 }, makeParticle);

    // ── Real star positions (recomputed once per minute) ──────────────────────
    interface StarScreen { x: number; y: number; mag: number; }
    let starPositions: StarScreen[] = [];

    const updateStars = () => {
      const now = new Date();
      const jDate = jd(now);
      const lstDeg = (gmst(jDate) + URALSK_LON_DEG + 360) % 360;
      starPositions = [];
      const seen = new Set<string>();
      for (const [raH, decDeg, mag] of STARS) {
        const raDeg = raH * 15; // hours → degrees
        const key = `${raH.toFixed(3)},${decDeg.toFixed(3)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const pos = starToCanvas(raDeg, decDeg, lstDeg, canvas.width, canvas.height);
        if (pos) {
          starPositions.push({ x: pos[0], y: pos[1], mag });
        }
      }
    };

    updateStars();

    // Функция взрыва — меняет цвет только тем частицам, что были в радиусе сбора
    const triggerExplosion = () => {
      exploding = true;
      explodeFlash = 1.0;
      explodeCooldown = 180;
      const newColor = COLOR_CYCLE[nextColorIdx];
      explodeColor = newColor;
      nextColorIdx = (nextColorIdx + 1) % COLOR_CYCLE.length;

      for (const p of particles) {
        const dx = p.x - mouseX, dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        // Меняем цвет только тем кто был внутри радиуса притяжения
        if (dist < ATTRACT_RADIUS) {
          p.color = newColor;
        }
        const power = rand(4, 9);
        p.vx = (dx / dist) * power + rand(-1, 1);
        p.vy = (dy / dist) * power + rand(-1, 1);
        p.angle = rand(0, Math.PI * 2);
      }
    };

    // Клавиши + / - — добавить/убрать частицы (только десктоп)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "+" || e.key === "=") {
        if (particles.length < MAX_PARTICLES) {
          for (let i = 0; i < 5; i++) particles.push(makeParticle());
        }
      } else if (e.key === "-" || e.key === "_") {
        if (particles.length > MIN_PARTICLES) {
          particles.splice(particles.length - 5, 5);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const src = "touches" in e ? e.touches[0] : e;
      mouseX = src.clientX - rect.left;
      mouseY = src.clientY - rect.top;
    };
    const onLeave = () => { mouseX = -9999; mouseY = -9999; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);
    // Also track on the parent section so hero text doesn't block events
    const section = canvas.parentElement;
    if (section) {
      section.addEventListener("mousemove", onMove);
      section.addEventListener("mouseleave", onLeave);
    }

    const draw = (now: number) => {
      // Пауза когда вкладка скрыта
      if (hidden) { animId = requestAnimationFrame(draw); return; }

      // Throttle: не больше 60fps, пропускаем если кадр занял > 50ms
      const delta = now - lastFrameTime;
      if (delta < 16) { animId = requestAnimationFrame(draw); return; }
      lastFrameTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── Draw real stars (update every 60s) ───────────────────────────────────
      if (now - lastStarUpdate > 60000) {
        updateStars();
        lastStarUpdate = now;
      }
      for (const s of starPositions) {
        // mag range roughly -1.5 to 4.5 → radius 1.8..0.4, alpha 0.6..0.12
        const t = Math.max(0, Math.min(1, (s.mag + 1.5) / 6));
        const r = 1.8 - t * 1.4;
        const alpha = 0.6 - t * 0.48;
        // Bright stars slightly blue-white, dim ones warm
        const warm = Math.round(215 + t * 35);
        const cool = Math.round(240 - t * 20);
        ctx.fillStyle = `rgba(${warm},${warm},${cool},${alpha})`;
        // Draw with x-wrap so stars near N horizon appear on both edges
        const xs = [s.x];
        if (s.x < 40) xs.push(s.x + canvas.width);
        if (s.x > canvas.width - 40) xs.push(s.x - canvas.width);
        for (const sx of xs) {
          ctx.beginPath();
          ctx.arc(sx, s.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Кулдаун после взрыва
      if (explodeCooldown > 0) explodeCooldown--;

      // Детект перегрузки: считаем частицы близко к курсору
      if (!exploding && explodeCooldown === 0 && mouseX !== -9999) {
        let near = 0;
        for (const p of particles) {
          const dx = p.x - mouseX, dy = p.y - mouseY;
          if (dx * dx + dy * dy < OVERLOAD_RADIUS * OVERLOAD_RADIUS) near++;
        }
        if (near >= OVERLOAD_THRESHOLD) triggerExplosion();
      }

      // Затухание вспышки
      if (explodeFlash > 0) {
        explodeFlash = Math.max(0, explodeFlash - 0.04);
        const [cr, cg, cb] = explodeColor;
        const grd = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 300);
        grd.addColorStop(0, `rgba(${cr},${cg},${cb},${explodeFlash * 0.7})`);
        grd.addColorStop(0.4, `rgba(${cr},${cg},${cb},${explodeFlash * 0.15})`);
        grd.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (explodeFlash === 0) exploding = false;
      }

      const currentMaxSpeed = exploding ? 12 : MAX_SPEED;

      for (const p of particles) {
        // 1. Wander: slowly rotate desired direction
        p.angle += p.angleSpeed + rand(-0.003, 0.003);

        // 2. Gentle wander force (не во время взрыва)
        if (!exploding) {
          p.vx += Math.cos(p.angle) * 0.012;
          p.vy += Math.sin(p.angle) * 0.012;
        }

        // 3. Cursor attraction (только если нет взрыва и кулдаун прошёл)
        if (!exploding && explodeCooldown === 0) {
          const cdx = mouseX - p.x, cdy = mouseY - p.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < ATTRACT_RADIUS && cdist > 0) {
            const force = ((ATTRACT_RADIUS - cdist) / ATTRACT_RADIUS) * 0.18;
            p.vx += (cdx / cdist) * force;
            p.vy += (cdy / cdist) * force;
          }
        }

        // 4. Speed cap + damping
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > currentMaxSpeed) {
          p.vx = (p.vx / spd) * currentMaxSpeed;
          p.vy = (p.vy / spd) * currentMaxSpeed;
        }
        if (!exploding && spd < 0.08) {
          p.vx += Math.cos(p.angle) * 0.05;
          p.vy += Math.sin(p.angle) * 0.05;
        }
        // После взрыва — сильнее тормозим чтобы плавно успокоились
        p.vx *= exploding ? 0.97 : 0.992;
        p.vy *= exploding ? 0.97 : 0.992;

        p.x += p.vx;
        p.y += p.vy;

        // 5. Soft wrap (appear on other side)
        const margin = 20;
        if (p.x < -margin) p.x = canvas.width + margin;
        else if (p.x > canvas.width + margin) p.x = -margin;
        if (p.y < -margin) p.y = canvas.height + margin;
        else if (p.y > canvas.height + margin) p.y = -margin;

        // Draw particle — индивидуальный цвет
        const [pr, pg, pb] = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pr},${pg},${pb},${p.alpha})`;
        ctx.fill();
      }

      // Connections between particles — ограничиваем MAX_CONNECTIONS на частицу
      const connCount = new Int8Array(particles.length); // счётчик соединений
      for (let i = 0; i < particles.length; i++) {
        if (connCount[i] >= MAX_CONNECTIONS) continue;
        for (let j = i + 1; j < particles.length; j++) {
          if (connCount[i] >= MAX_CONNECTIONS) break;
          if (connCount[j] >= MAX_CONNECTIONS) continue;
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy; // избегаем sqrt до проверки порога
          if (dist2 < CONNECT_DIST * CONNECT_DIST) {
            const dist = Math.sqrt(dist2);
            const t = 1 - dist / CONNECT_DIST;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            const lr = (a.color[0] + b.color[0]) >> 1;
            const lg = (a.color[1] + b.color[1]) >> 1;
            const lb = (a.color[2] + b.color[2]) >> 1;
            ctx.strokeStyle = `rgba(${lr},${lg},${lb},${t * t * 0.35})`;
            ctx.lineWidth = t * 1.2;
            ctx.stroke();
            connCount[i]++;
            connCount[j]++;
          }
        }
      }

      // Cursor connections
      if (mouseX !== -9999) {
        for (const p of particles) {
          const dx = mouseX - p.x, dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_CONNECT_DIST) {
            const t = 1 - dist / CURSOR_CONNECT_DIST;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${t * 0.75})`;
            ctx.lineWidth = t * 1.8;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${explodeColor[0]},${explodeColor[1]},${explodeColor[2]},0.9)`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      if (section) {
        section.removeEventListener("mousemove", onMove);
        section.removeEventListener("mouseleave", onLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        display: "block", pointerEvents: "none", cursor: "default",
      }}
    />
  );
}

// ── FAQ Data ───────────────────────────────────────────────────────────────────
const FAQ = [
  { q: "Работаете ли вы для малого бизнеса?", a: "Да, мы работаем с бизнесом любого масштаба — от ИП до крупных корпораций. Решения адаптируем под бюджет и задачи." },
  { q: "Как быстро выезжает специалист?", a: "В большинстве случаев — в течение 2–4 часов по Уральску. Для экстренных ситуаций доступен выезд в день обращения." },
  { q: "Даёте ли гарантию на работы?", a: "Да. На все выполненные работы предоставляем гарантию от 6 до 24 месяцев в зависимости от вида услуги." },
  { q: "Можно ли заключить договор на обслуживание?", a: "Конечно. Мы предлагаем ежемесячное и годовое IT-сопровождение с фиксированной стоимостью и приоритетным реагированием." },
  { q: "Работаете с оборудованием любых производителей?", a: "Да — Cisco, MikroTik, HP, Dell, Lenovo, Hikvision, Dahua, Axis и другие. Наши специалисты сертифицированы по основным вендорам." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={ref} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "20px 0" }}>
      <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "1.05rem", color: "#fff", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {q}
        <span style={{ color: "var(--accent)", fontSize: "1.4rem", lineHeight: 1 }}>+</span>
      </summary>
      <p style={{ marginTop: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{a}</p>
    </details>
  );
}

// ── Home Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <PageLayout>
      <SEO
        title="IT-услуги и телекоммуникации в Уральске"
        description="KONNEKTEAM — интернет для бизнеса, видеонаблюдение, информационная безопасность в Уральске. Выезд специалиста за 2–4 часа. 15 лет опыта, 500+ проектов."
        keywords="IT услуги Уральск, интернет для бизнеса Уральск, видеонаблюдение Уральск, информационная безопасность Уральск, телекоммуникации Уральск, KONNEKTEAM"
        canonical="https://konnekteam.kz/"
      />

      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: "#0A0A0A", userSelect: "none" }}>
        <ParticleCanvas />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%" }}>
          <div style={{ maxWidth: 700 }}>
            <div style={{ display: "inline-block", background: "rgba(227,30,36,0.15)", border: "1px solid rgba(227,30,36,0.4)", borderRadius: 4, padding: "6px 14px", marginBottom: 24, fontSize: "0.85rem", color: "var(--accent)", letterSpacing: 2, textTransform: "uppercase" }}>
              IT-компания в Уральске
            </div>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
              Надёжные IT-решения<br />
              <span style={{ color: "var(--accent)" }}>для вашего бизнеса</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 36, maxWidth: 560 }}>
              Сети, видеонаблюдение, информационная безопасность, СКУД, автоматизация — полный спектр IT-услуг с гарантией качества.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/contacts">
                <a className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>
                  Получить консультацию
                </a>
              </Link>
              <Link href="/services">
                <a style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, color: "#fff", fontWeight: 600, transition: "border-color 0.2s" }}>
                  Все услуги →
                </a>
              </Link>
            </div>
          </div>
        </div>
        {/* scroll hint */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.4 }}>
          <span style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase" }}>Прокрутить</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }} />
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section style={{ background: "#111", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, textAlign: "center" }}>
          {[
            { num: "10+", label: "лет на рынке" },
            { num: "500+", label: "завершённых проектов" },
            { num: "2–4ч", label: "время выезда" },
            { num: "24/7", label: "техподдержка" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: "2.8rem", fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>{s.num}</div>
              <div style={{ marginTop: 8, color: "rgba(255,255,255,0.55)", fontSize: "0.95rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: "100px 24px", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Что мы делаем</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800 }}>Наши услуги</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {SERVICES.slice(0, 6).map(s => (
              <Link href={`/services/${s.slug}`} key={s.slug}>
                <a style={{ textDecoration: "none" }}>
                  <div className="card" style={{ height: "100%", transition: "transform 0.2s, border-color 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(227,30,36,0.4)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
                  >
                    <div style={{ fontSize: "2.2rem", marginBottom: 16 }}>{s.icon}</div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 10, color: "#fff" }}>{s.title}</h3>
                    <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{s.shortDesc}</p>
                    <div style={{ marginTop: 16, color: "var(--accent)", fontSize: "0.9rem", fontWeight: 600 }}>Подробнее →</div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/services">
              <a className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>Все 12 услуг</a>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section style={{ padding: "100px 24px", background: "#111" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Наши преимущества</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800 }}>Почему выбирают нас</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 28 }}>
            {[
              { icon: "⚡", title: "Быстрый выезд", desc: "Специалист приедет в течение 2–4 часов по Уральску" },
              { icon: "🛡️", title: "Гарантия качества", desc: "На все работы — гарантия от 6 до 24 месяцев" },
              { icon: "🔧", title: "Полный цикл", desc: "Проектирование, монтаж, настройка и дальнейшее сопровождение" },
              { icon: "💼", title: "Опыт 10+ лет", desc: "Реализовали более 500 проектов разного масштаба" },
              { icon: "📞", title: "Техподдержка 24/7", desc: "Всегда на связи — звонок, WhatsApp или удалённое подключение" },
              { icon: "📋", title: "Договор и отчёты", desc: "Официальный договор, акты выполненных работ, гарантийные талоны" },
            ].map(w => (
              <div key={w.title} className="card">
                <div style={{ fontSize: "2rem", marginBottom: 14 }}>{w.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8, color: "#fff" }}>{w.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: "100px 24px", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Отзывы</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800 }}>Что говорят клиенты</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {REVIEWS.map(r => (
              <div key={r.name} className="card">
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <span key={i} style={{ color: "#F59E0B", fontSize: "1.1rem" }}>★</span>
                  ))}
                </div>
                <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{r.text}"</p>
                <div>
                  <div style={{ fontWeight: 700, color: "#fff" }}>{r.name}</div>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{r.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 24px", background: "#111" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>FAQ</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800 }}>Частые вопросы</h2>
          </div>
          {FAQ.map(f => <FAQItem key={f.q} {...f} />)}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", background: "linear-gradient(135deg, #1a0000 0%, #0A0A0A 50%, #1a0000 100%)", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, marginBottom: 20 }}>
            Готовы решить ваш IT-вопрос?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 36, lineHeight: 1.7 }}>
            Оставьте заявку или позвоните — специалист ответит в течение 15 минут.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contacts">
              <a className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>Оставить заявку</a>
            </Link>
            <a href={`tel:${COMPANY.phone}`} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, color: "#fff", fontWeight: 600 }}>
              📞 {COMPANY.phone}
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
