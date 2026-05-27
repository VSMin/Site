import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { SEO, PageLayout } from "../components/layout";
import { SERVICES, REVIEWS, COMPANY } from "../lib/data";

// ── Real Star Catalog (BSC5, J2000, verified coordinates) ────────────────────
// Format: [RA_hours, Dec_degrees, magnitude]
const STARS: [number, number, number][] = [
  // ════ САМЫЕ ЯРКИЕ ════
  [6.7524,  -16.7161, -1.46], // Sirius       α CMa
  [6.3992,  -52.6957, -0.72], // Canopus      α Car
  [14.2603,  19.1822, -0.05], // Arcturus     α Boo
  [18.6156,  38.7837,  0.03], // Vega         α Lyr
  [5.2428,   45.9980,  0.08], // Capella      α Aur
  [5.6036,   -1.2019,  0.12], // Rigel        β Ori
  [7.6550,    5.2250,  0.38], // Procyon      α CMi
  [5.9195,    7.4071,  0.45], // Betelgeuse   α Ori
  [1.6257,  -57.2367,  0.50], // Achernar     α Eri
  [19.8464,   8.8683,  0.76], // Altair       α Aql
  [4.5987,   16.5093,  0.87], // Aldebaran    α Tau
  [12.4430, -63.0990,  0.61], // Hadar        β Cen
  [13.3992,  -11.1613, 1.04], // Spica        α Vir
  [16.4901,  -26.4320, 1.06], // Antares      α Sco
  [22.9608,  -29.6223, 1.16], // Fomalhaut    α PsA
  [7.7555,   28.0262,  1.21], // Pollux       β Gem
  [20.6905,  45.2803,  1.25], // Deneb        α Cyg
  [10.1395,  11.9672,  1.35], // Regulus      α Leo
  [13.7983,  49.3133,  1.86], // Alkaid       η UMa
  [12.9004,  55.9598,  1.77], // Alioth       ε UMa
  [5.5955,   28.6083,  1.65], // Elnath       β Tau
  [17.5605,  -37.1039, 1.62], // Shaula       λ Sco
  [3.4081,   49.8613,  1.65], // Mirfak       α Per
  [5.4194,    6.3497,  1.64], // Bellatrix    γ Ori
  [5.7955,   -9.6699,  1.70], // Alnilam      ε Ori
  [5.6792,   -1.9426,  1.74], // Alnitak      ζ Ori
  [12.5437,  -57.1127, 1.25], // Mimosa       β Cru
  [12.7739,  -59.6887, 1.63], // Gacrux       γ Cru
  [7.4046,   -29.3017, 1.98], // Adhara       ε CMa
  [9.4599,   -8.6586,  1.99], // Alphard      α Hya
  [7.5521,   31.8884,  1.58], // Castor       α Gem
  [5.9922,   44.9474,  1.90], // Menkalinan   β Aur
  [6.6285,   16.3988,  1.93], // Alhena       γ Gem
  // ════ БОЛЬШАЯ МЕДВЕДИЦА — КОВШ (все 7 звёзд) ════
  [11.0621,  61.7508,  1.79], // Dubhe        α UMa
  [11.0307,  56.3833,  2.37], // Merak        β UMa  ← исправлено Dec
  [11.8972,  53.6944,  2.44], // Phecda       γ UMa
  [12.2569,  57.0322,  3.31], // Megrez       δ UMa
  [12.9004,  55.9598,  1.77], // Alioth       ε UMa
  [13.3992,  54.9254,  2.27], // Mizar        ζ UMa
  [13.7983,  49.3133,  1.86], // Alkaid       η UMa
  // ════ МАЛАЯ МЕДВЕДИЦА — КОВШ ════
  [2.5304,   89.2642,  1.97], // Polaris      α UMi  ← Полярная звезда
  [14.8497,  74.1553,  2.08], // Kochab       β UMi
  [15.0734,  77.7944,  3.05], // Pherkad      γ UMi
  [17.5363,  86.5861,  4.36], // δ UMi
  [16.7664,  82.0372,  4.23], // ε UMi
  [15.7346,  77.7589,  4.32], // ζ UMi
  [16.2913,  75.7553,  4.95], // η UMi
  // ════ КАССИОПЕЯ — W ════
  [0.6752,   56.5374,  2.23], // Schedar      α Cas
  [0.1529,   59.1497,  2.27], // Caph         β Cas
  [0.9453,   60.7167,  2.15], // Navi         γ Cas
  [1.4304,   60.2353,  2.65], // Ruchbah      δ Cas
  [1.9069,   63.6703,  3.35], // Segin        ε Cas
  // ════ ОРИОН ════
  [5.9195,    7.4071,  0.45], // Betelgeuse   α Ori
  [5.6036,   -1.2019,  0.12], // Rigel        β Ori
  [5.4194,    6.3497,  1.64], // Bellatrix    γ Ori
  [5.7955,   -9.6699,  1.70], // Alnilam      ε Ori
  [5.6792,   -1.9426,  1.74], // Alnitak      ζ Ori
  [5.5333,   -0.2990,  2.23], // Mintaka      δ Ori
  [5.2433,   -8.2016,  2.78], // Saiph        κ Ori
  [5.4197,   -2.3972,  3.69], // δ Ori (head)
  [5.5856,    9.9342,  3.54], // λ Ori
  [5.9085,    4.1131,  4.09], // φ1 Ori
  // ════ ПЕРСЕЙ ════
  [3.0583,   40.9556,  2.10], // Algol        β Per
  [3.4081,   49.8613,  1.65], // Mirfak       α Per
  [3.9794,   40.0133,  2.89], // δ Per
  [3.7152,   32.2889,  2.91], // Menkib       ξ Per
  [3.0797,   38.8406,  2.89], // Algol δ
  [2.8444,   55.8956,  2.85], // Miram        η Per
  [3.1360,   44.8575,  2.93], // ε Per
  // ════ ТЕЛЕЦ ════
  [4.5987,   16.5093,  0.87], // Aldebaran    α Tau
  [5.5955,   28.6083,  1.65], // Elnath       β Tau
  [3.7914,   24.1053,  2.87], // Alcyone      η Tau (Плеяды)
  [3.6261,   24.1053,  3.63], // Electra      17 Tau
  [3.7455,   23.9486,  3.87], // Merope       23 Tau
  [3.6897,   24.3672,  3.70], // Atlas        27 Tau
  [4.3567,   15.6277,  3.54], // Ain          ε Tau (Гиады)
  [4.2769,   15.9522,  3.65], // θ1 Tau
  [5.4381,   28.6083,  2.97], // ζ Tau
  // ════ БЛИЗНЕЦЫ ════
  [7.7555,   28.0262,  1.21], // Pollux       β Gem
  [7.5521,   31.8884,  1.58], // Castor       α Gem
  [6.6285,   16.3988,  1.93], // Alhena       γ Gem
  [7.3355,   21.9825,  3.53], // Wasat        δ Gem
  [6.7317,   25.1311,  3.06], // Mebsuda      ε Gem
  [6.6278,   20.2122,  3.15], // Propus       η Gem
  [7.0681,   20.5697,  2.87], // Tejat        μ Gem
  [6.3828,   22.5089,  3.60], // ν Gem
  // ════ ЛЕВ ════
  [10.1395,  11.9672,  1.35], // Regulus      α Leo
  [11.8175,  14.5722,  2.14], // Denebola     β Leo
  [10.2817,  19.8417,  2.01], // Algieba      γ Leo
  [11.2399,  20.5236,  2.56], // Zosma        δ Leo
  [9.7645,   23.7742,  3.44], // Adhafera     ζ Leo
  [10.1220,  16.7628,  3.34], // Chertan      θ Leo
  [9.8792,   26.0069,  3.52], // μ Leo
  [9.5281,   22.9681,  3.85], // λ Leo
  // ════ ЛЕБЕДЬ ════
  [20.6905,  45.2803,  1.25], // Deneb        α Cyg
  [20.3705,  40.2567,  2.23], // Sadr         γ Cyg
  [20.9244,  45.1306,  2.49], // δ Cyg
  [21.2156,  30.2269,  2.46], // Aljanah      ε Cyg
  [19.7508,  45.1306,  3.21], // ζ Cyg
  [19.4956,  27.9597,  3.20], // η Cyg
  [19.9385,  35.0836,  2.87], // θ Cyg
  [21.7856,  28.7442,  3.73], // ι Cyg
  // ════ СКОРПИОН ════
  [16.4901,  -26.4320, 1.06], // Antares      α Sco
  [17.5605,  -37.1039, 1.62], // Shaula       λ Sco
  [16.0050,  -22.6217, 2.62], // Graffias     β Sco
  [16.2144,  -19.4607, 2.32], // Dschubba     δ Sco
  [17.7950,  -37.1042, 2.69], // Lesath       υ Sco
  [17.6219,  -42.9978, 1.87], // θ Sco        Sargas
  [16.3556,  -25.5925, 2.89], // π Sco
  [17.1609,  -43.2389, 3.21], // ε Sco
  [16.8361,  -34.2931, 3.21], // ζ Sco
  [17.2022,  -36.9922, 3.32], // η Sco
  [17.4683,  -39.0297, 3.57], // μ Sco
  // ════ СТРЕЛЕЦ — ЧАЙНИК ════
  [18.9216,  -26.2967, 2.05], // Kaus Austr.  ε Sgr
  [18.3505,  -29.8281, 2.81], // Kaus Bor.    λ Sgr
  [18.4024,  -25.4217, 2.98], // Kaus Med.    δ Sgr
  [18.9217,  -21.1067, 2.59], // Ascella      ζ Sgr
  [18.7459,  -20.6589, 2.70], // φ Sgr
  [19.0785,  -27.6706, 2.02], // Nunki        σ Sgr
  [18.2299,  -21.0581, 3.11], // Polis        μ Sgr
  [18.0967,  -30.4244, 3.17], // η Sgr
  [18.3497,  -36.7617, 3.32], // ε Sgr
  [18.4611,  -26.2967, 3.51], // τ Sgr
  // ════ ГЕРКУЛЕС ════
  [17.2437,  14.3903,  2.78], // Kornephoros  β Her
  [16.6790,  31.6022,  2.81], // Rasalgethi   α Her
  [17.2500,  36.8092,  2.81], // π Her
  [17.0050,  30.9264,  2.81], // ζ Her
  [17.9437,  37.2506,  3.16], // θ Her
  [17.5089,  26.1100,  3.12], // η Her
  [16.3641,  19.1531,  3.16], // δ Her
  [17.6628,  46.0058,  3.80], // μ Her
  // ════ ВОЛОПАС ════
  [14.2603,  19.1822, -0.05], // Arcturus     α Boo
  [14.7339,  27.0742,  2.35], // Nekkar       β Boo
  [15.2580,  33.3147,  2.68], // Izar         ε Boo
  [15.0323,  40.3906,  2.69], // Seginus      γ Boo
  [15.4081,  29.7447,  3.49], // Merga        38 Boo
  [14.5347,  30.3706,  3.58], // μ Boo
  // ════ СЕВЕРНАЯ КОРОНА ════
  [15.5780,  26.7147,  2.23], // Alphekka     α CrB
  [15.4633,  29.1056,  3.68], // Nusakan      β CrB
  [15.7025,  26.2956,  3.84], // γ CrB
  // ════ ПЕГАС — КВАДРАТ ════
  [23.0794,  15.2047,  2.06], // Alpheratz    α And (=δ Peg)
  [22.7164,  10.8317,  2.42], // Scheat       β Peg
  [22.8339,  24.6014,  2.83], // Markab       α Peg
  [23.0794,  28.0828,  2.84], // Algenib      γ Peg
  [21.7364,   9.8750,  2.44], // Enif         ε Peg
  [22.1697,  6.1978,   3.40], // Matar        η Peg
  // ════ АНДРОМЕДА ════
  [1.1022,   35.6203,  2.07], // Mirach       β And
  [1.9110,   29.5785,  2.26], // Almach       γ And
  [0.8552,   29.0903,  3.27], // δ And
  // ════ ВОЗНИЧИЙ ════
  [5.2428,   45.9980,  0.08], // Capella      α Aur
  [5.9922,   44.9474,  1.90], // Menkalinan   β Aur
  [5.0933,   41.2347,  2.62], // θ Aur
  [5.3317,   34.2994,  2.65], // δ Aur
  [4.9498,   33.1661,  3.18], // ι Aur
  // ════ ОВЕН ════
  [2.2944,   29.0945,  2.00], // Hamal        α Ari
  [1.9107,   20.8083,  2.64], // Sheratan     β Ari
  [1.8907,   23.4624,  3.63], // Mesarthim    γ Ari
  // ════ РЫБЫ ════
  [1.5241,   15.3456,  3.62], // η Psc
  [1.7569,   9.1578,   3.69], // ο Psc
  [23.9894,  6.8636,   3.62], // α Psc
  // ════ ВОДОЛЕЙ ════
  [22.0965,  -0.3196,  2.96], // Sadalmelik   α Aqr
  [21.5264,  -5.5711,  2.91], // Sadalsuud    β Aqr
  [22.3606,  -1.3872,  3.65], // Sadachbia    ζ Aqr
  [22.2714,  -7.7833,  3.27], // δ Aqr
  [22.8764,  -15.8206, 3.84], // γ Aqr
  // ════ КОЗЕРОГ ════
  [20.2944,  -12.5081, 2.85], // Dabih        β Cap
  [21.7844,  -16.1272, 3.68], // Nashira      γ Cap
  [21.6619,  -16.6628, 3.77], // Deneb Alg.   δ Cap
  // ════ ДРАКОН ════
  [17.9437,  51.4889,  2.24], // Eltanin      γ Dra
  [17.1432,  65.7144,  2.79], // Rastaban     β Dra
  [14.0731,  64.3756,  3.65], // Thuban       α Dra
  [15.4153,  58.9664,  3.73], // Aldibain     η Dra
  [19.8028,  70.2678,  3.07], // Altais       δ Dra
  [17.5064,  52.3014,  3.17], // ζ Dra
  [18.3506,  72.7331,  3.29], // χ Dra
  [16.3994,  61.5142,  3.84], // ξ Dra
  // ════ ЛИРА ════
  [18.6156,  38.7837,  0.03], // Vega         α Lyr
  [18.8346,  33.3628,  3.24], // Sulafat      γ Lyr
  [18.7459,  32.6897,  3.52], // Sheliak      β Lyr
  [18.9083,  36.8983,  4.22], // δ2 Lyr
  // ════ ОРЁЛ ════
  [19.8464,   8.8683,  0.76], // Altair       α Aql
  [19.7702,  10.6133,  2.72], // Tarazed      γ Aql
  [19.0246,   3.1147,  2.99], // Okab         ζ Aql
  [19.4208,   3.1147,  3.36], // θ Aql
  [19.8742,   1.0058,  3.44], // λ Aql
  // ════ СТРЕЛА ════
  [19.6792,  18.0139,  3.51], // Sham         α Sge
  [19.7914,  17.4761,  3.68], // β Sge
  // ════ ЛИСИЧКА ════
  [19.4783,  24.6644,  4.44], // Anser        α Vul
  // ════ ДЕЛЬФИН ════
  [20.6606,  15.9117,  3.64], // Rotanev      β Del
  [20.6239,  15.9117,  3.77], // Sualocin     α Del
  // ════ ВЕГА и ЛЕТНИЙ ТРЕУГОЛЬНИК ════
  // (Vega, Deneb, Altair уже есть выше)
  // ════ ДЕВА ════
  [13.3992,  -11.1613, 1.04], // Spica        α Vir
  [13.5783,  -0.5958,  2.83], // Vindemiatrix ε Vir
  [13.0356,  10.9592,  2.74], // Porrima      γ Vir
  [12.6944,  -1.4494,  3.38], // Auva         δ Vir
  [12.3317,  -0.6667,  3.87], // η Vir
  [13.1656,  -5.5389,  3.61], // θ Vir
  // ════ ВЕСЫ ════
  [14.8475,  -16.0416, 2.61], // Zubenelg.    β Lib
  [14.5047,  -15.9972, 2.75], // Zubenel.     α Lib
  [15.0674,  -25.2819, 3.91], // γ Lib
  // ════ БОЛЬШОЙ ПЁС ════
  [7.4046,   -29.3017, 1.98], // Adhara       ε CMa
  [7.1397,   -26.3932, 1.83], // Wezen        δ CMa
  [7.5765,   -28.9722, 1.98], // Mirzam       β CMa
  [7.0295,   -23.8331, 3.02], // Aludra       η CMa
  // ════ МАЛЫЙ ПЁС ════
  [7.4550,    8.2894,  2.89], // Gomeisa      β CMi
  // ════ ГИДРА ════
  [9.4599,   -8.6586,  1.99], // Alphard      α Hya
  [8.9228,    5.9456,  3.11], // Minchir      σ Hya
  // ════ РАК ════
  [8.7447,    9.1856,  3.52], // Acubens      α Cnc
  [8.9745,   11.8578,  3.52], // Asellus Bor  γ Cnc
  [8.7214,   21.4681,  3.52], // β Cnc
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

/**
 * Возвращает дату со временем ~22:00 по местному (UTC+5) — ночное небо.
 * Обновляется раз в сутки: берём текущую дату, но фиксируем час = 17:00 UTC (22:00 Уральск).
 */
function nightDate(): Date {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 17, 0, 0));
  return d;
}

/** Project a star/moon (RA deg, Dec deg) to canvas [x, y, altRad] or null if below horizon.
 *  Equirectangular: az maps to x, alt maps to y.
 *  Canvas fills sky from horizon (y=H) to zenith (y=0).
 */
function skyToCanvas(
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
  if (altRad < 0.01) return null; // below horizon

  // Azimuth (N=0°, E=90°, S=180°, W=270°)
  const cosAlt = Math.cos(altRad);
  const cosAz = (Math.sin(decRad) - Math.sin(altRad) * Math.sin(URALSK_LAT_RAD))
               / (cosAlt * Math.cos(URALSK_LAT_RAD));
  const sinAz = -Math.cos(decRad) * Math.sin(haRad) / cosAlt;
  let az = Math.atan2(sinAz, cosAz);
  if (az < 0) az += 2 * Math.PI;

  // Equirectangular: N=left, S=right, zenith=top, horizon=bottom
  // az: 0(N)→left-quarter, π/2(E)→center, π(S)→right-quarter, 3π/2(W)→right-edge/wrap
  // Rotate so South is center (most stars visible from lat 51N are in S sky)
  // S(π) → x = w/2, N(0/2π) → x = 0 or w
  const azNorm = az / (2 * Math.PI); // 0..1, N=0, E=0.25, S=0.5, W=0.75
  // Shift so S=0.5 is center
  const x = ((azNorm + 0.5) % 1) * w;
  // altitude: 0° → y=h, 90° → y=0
  const y = h - (altRad / (Math.PI / 2)) * h;

  return [x, y, altRad];
}

/** Фаза Луны: 0=новолуние, 0.5=полнолуние, 1=новолуние */
function moonPhase(date: Date): number {
  const jDate = jd(date);
  // Известное новолуние: JD 2451550.1 (6 января 2000)
  const synodicPeriod = 29.530588853;
  return ((jDate - 2451550.1) % synodicPeriod + synodicPeriod) % synodicPeriod / synodicPeriod;
}

/** Приблизительные экваториальные координаты Луны (RA°, Dec°) */
function moonRaDec(date: Date): [number, number] {
  const jDate = jd(date);
  const T = (jDate - 2451545.0) / 36525;
  // Упрощённая теория Луны (точность ~1°)
  const L = (218.3164477 + 481267.88123421 * T) % 360;
  const M = (357.5291092 + 35999.0502909 * T) * Math.PI / 180;
  const Mm = (134.9633964 + 477198.8675055 * T) * Math.PI / 180;
  const D = (297.8501921 + 445267.1114034 * T) * Math.PI / 180;
  const F = (93.2720950 + 483202.0175233 * T) * Math.PI / 180;

  const lon = L
    + 6.289 * Math.sin(Mm)
    - 1.274 * Math.sin(2 * D - Mm)
    + 0.658 * Math.sin(2 * D)
    - 0.214 * Math.sin(2 * Mm)
    - 0.186 * Math.sin(M)
    - 0.114 * Math.sin(2 * F);
  const lat = 5.128 * Math.sin(F)
    + 0.280 * Math.sin(Mm + F)
    + 0.277 * Math.sin(Mm - F)
    + 0.173 * Math.sin(2 * D - F)
    + 0.055 * Math.sin(2 * D - Mm + F);

  // Ecliptic → Equatorial
  const eps = (23.439291111 - 0.013004167 * T) * Math.PI / 180;
  const lonRad = lon * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  const ra = Math.atan2(
    Math.sin(lonRad) * Math.cos(eps) - Math.tan(latRad) * Math.sin(eps),
    Math.cos(lonRad)
  ) * 180 / Math.PI;
  const dec = Math.asin(
    Math.sin(latRad) * Math.cos(eps) + Math.cos(latRad) * Math.sin(eps) * Math.sin(lonRad)
  ) * 180 / Math.PI;

  return [(ra + 360) % 360, dec];
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
    let lastStarDay = -1; // UTC day number of last star compute

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      lastStarDay = -1; // force star recompute on resize
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

    // ── Real star + moon positions (recomputed once per day, fixed at 22:00 local) ──
    interface StarScreen { x: number; y: number; mag: number; }
    interface MoonScreen { x: number; y: number; phase: number; } // phase 0..1
    let starPositions: StarScreen[] = [];
    let moonPos: MoonScreen | null = null;

    const updateStars = () => {
      const night = nightDate(); // сегодня 22:00 Уральск = 17:00 UTC
      const jDate = jd(night);
      const lstDeg = (gmst(jDate) + URALSK_LON_DEG + 360) % 360;
      starPositions = [];
      const seen = new Set<string>();
      for (const [raH, decDeg, mag] of STARS) {
        const raDeg = raH * 15;
        const key = `${raH.toFixed(3)},${decDeg.toFixed(3)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const pos = skyToCanvas(raDeg, decDeg, lstDeg, canvas.width, canvas.height);
        if (pos) starPositions.push({ x: pos[0], y: pos[1], mag });
      }
      // Луна
      const [mRa, mDec] = moonRaDec(night);
      const mPos = skyToCanvas(mRa, mDec, lstDeg, canvas.width, canvas.height);
      moonPos = mPos ? { x: mPos[0], y: mPos[1], phase: moonPhase(night) } : null;
      lastStarDay = night.getUTCDate();
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

      // ── Draw real stars + moon (update once per day) ─────────────────────────
      const tonight = nightDate();
      if (tonight.getUTCDate() !== lastStarDay) {
        updateStars();
      }
      for (const s of starPositions) {
        // mag range roughly -1.5 to 4.5 → radius 2.2..0.5, alpha 0.75..0.18
        const t = Math.max(0, Math.min(1, (s.mag + 1.5) / 6));
        const r = 2.2 - t * 1.7;
        const alpha = 0.75 - t * 0.57;
        // Bright stars blue-white, dim ones warm yellow
        const warm = Math.round(210 + t * 40);
        const cool = Math.round(245 - t * 25);
        ctx.fillStyle = `rgba(${warm},${warm},${cool},${alpha})`;
        // x-wrap: stars near edges (equirectangular seam) duplicate
        const xs = [s.x];
        if (s.x < 50) xs.push(s.x + canvas.width);
        if (s.x > canvas.width - 50) xs.push(s.x - canvas.width);
        for (const sx of xs) {
          ctx.beginPath();
          ctx.arc(sx, s.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // ── Draw Moon ────────────────────────────────────────────────────────────
      if (moonPos) {
        const { x: mx, y: my, phase } = moonPos;
        const moonR = 14;
        // Glow
        const glow = ctx.createRadialGradient(mx, my, moonR * 0.5, mx, my, moonR * 3);
        glow.addColorStop(0, "rgba(220,220,180,0.25)");
        glow.addColorStop(1, "rgba(220,220,180,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(mx, my, moonR * 3, 0, Math.PI * 2);
        ctx.fill();
        // Moon disc — lit side based on phase
        // phase 0=new(dark), 0.5=full(bright), 1=new
        ctx.save();
        ctx.beginPath();
        ctx.arc(mx, my, moonR, 0, Math.PI * 2);
        ctx.clip();
        // Full disc (lit)
        ctx.fillStyle = "rgba(230,225,195,0.92)";
        ctx.fillRect(mx - moonR, my - moonR, moonR * 2, moonR * 2);
        // Shadow ellipse to simulate phase
        // phase<0.5: waxing (lit right), phase>0.5: waning (lit left)
        const illum = phase < 0.5 ? phase * 2 : (1 - phase) * 2; // 0..1
        // Shadow covers (1-illum) fraction
        const shadowW = moonR * (1 - illum * 2 + (phase < 0.5 ? 0 : 0));
        ctx.fillStyle = "rgba(8,8,18,0.9)";
        if (phase < 0.25 || phase > 0.75) {
          // Mostly dark — draw large shadow
          const ew = moonR * Math.abs(Math.cos(phase * 2 * Math.PI));
          ctx.beginPath();
          ctx.ellipse(mx + (phase < 0.5 ? -1 : 1) * 0, my, ew || 0.5, moonR, 0, 0, Math.PI * 2);
          ctx.fill();
          // Cover half
          ctx.fillRect(phase < 0.5 ? mx - moonR : mx, my - moonR, moonR, moonR * 2);
        } else {
          // Mostly lit — small shadow sliver
          const ew = moonR * Math.abs(Math.cos(phase * 2 * Math.PI));
          ctx.fillRect(phase < 0.5 ? mx - moonR : mx, my - moonR, moonR, moonR * 2);
          ctx.fillStyle = "rgba(230,225,195,0.92)";
          ctx.beginPath();
          ctx.ellipse(mx, my, ew || 0.5, moonR, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        // Thin border
        ctx.beginPath();
        ctx.arc(mx, my, moonR, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(200,200,160,0.4)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
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
        description="KONNEKTEAM — интернет для бизнеса, видеонаблюдение, информационная безопасность в Уральске. Выезд специалиста за 2–4 часа. Работаем с 2010 года, 350+ проектов."
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
            { num: "15+", label: "лет на рынке" },
            { num: "350+", label: "завершённых проектов" },
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
              { icon: "💼", title: "Опыт с 2010 года", desc: "Реализовали более 350 проектов разного масштаба" },
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
