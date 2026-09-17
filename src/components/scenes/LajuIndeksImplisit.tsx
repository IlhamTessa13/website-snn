"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { pdrbTotalImplisit, years } from "@/data/indeksImplisit";

/* ================================================================== */
/* Konstanta visual — sesuai brief Section 6 (scene terakhir)         */
/* ================================================================== */

const ORANGE = "#c51b7d";
const ORANGE_DARK = "#4d9221";
const ORANGE_SOFT = "#e6f5d0";
const RED = "#4d9221";
const RED_SOFT = "#e6f5d0";
const GRID = "#E5E7EB";
const AXIS_LABEL = "#9CA3AF";

const PEAK_YEAR = 2022;
const LOW_YEAR = 2025;
const AVERAGE = 2.45;

const VB_W = 640;
const VB_H = 340;
const PAD_L = 40;
const PAD_R = 20;
const PAD_T = 24;
const PAD_B = 30;
const Y_MIN = 0;
const Y_MAX = 5;

const DRAW_MS = 1800;

function xFor(year: number) {
  const idx = years.indexOf(year);
  return PAD_L + (idx / (years.length - 1)) * (VB_W - PAD_L - PAD_R);
}
function yFor(v: number) {
  return PAD_T + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * (VB_H - PAD_T - PAD_B);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Kurva monotone-ish (Catmull-Rom → Bezier) — mendekati d3.curveMonotoneX
 * tanpa overshoot berlebihan, tetap terbaca akurat sesuai brief.
 */
function buildSmoothPath(points: [number, number][]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

function fmtID(v: number): string {
  return v.toFixed(2).replace(".", ",");
}

/* ================================================================== */
/* Komponen                                                           */
/* ================================================================== */

export default function LajuIndeksImplisit() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [animated, setAnimated] = useState(false);
  const [pathLen, setPathLen] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const points = useMemo<[number, number][]>(
    () => years.map((y) => [xFor(y), yFor(pdrbTotalImplisit[y])]),
    [],
  );
  const linePath = useMemo(() => buildSmoothPath(points), [points]);
  const areaPath = `${linePath} L ${points[points.length - 1][0]} ${yFor(0)} L ${points[0][0]} ${yFor(0)} Z`;

  const peakIdx = years.indexOf(PEAK_YEAR);
  const lowIdx = years.indexOf(LOW_YEAR);

  /* ---------------- Ukur panjang path untuk stroke-dasharray ---------------- */
  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength());
  }, [linePath]);

  /* ---------------- Trigger animasi SEKALI saat masuk viewport ---------------- */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.3) {
            setAnimated(true);
            obs.disconnect();
          }
        });
      },
      { threshold: [0, 0.3, 0.4, 0.6] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ---------------- Hover crosshair (setelah animasi selesai) ---------------- */
  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!animated || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * VB_W;
    let nearest = 0;
    let best = Infinity;
    points.forEach(([x], i) => {
      const dist = Math.abs(x - relX);
      if (dist < best) {
        best = dist;
        nearest = i;
      }
    });
    setHoverIdx(nearest);
  };

  const peakW = 132;
  const peakCx = points[peakIdx][0];
  const peakCy = points[peakIdx][1];
  const peakBoxX = clamp(peakCx - peakW / 2, PAD_L, VB_W - PAD_R - peakW);

  const lowW = 122;
  const lowCx = points[lowIdx][0];
  const lowCy = points[lowIdx][1];
  const lowBoxX = clamp(lowCx - lowW / 2, PAD_L, VB_W - PAD_R - lowW);

  return (
    <section ref={sectionRef} className="relative bg-white">
      <style>{`
        @keyframes lii-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lii-fade-slide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .lii-path { transition: stroke-dashoffset ${DRAW_MS}ms cubic-bezier(0.65,0,0.35,1); }
        .lii-narrative { animation: lii-fade-in 900ms ease both; }
        .lii-dot { animation: lii-fade-slide 400ms ease both; }
        .lii-callout { animation: lii-fade-slide 500ms ease both; }
        .lii-crosshair-dot { transition: cx 120ms ease, cy 120ms ease; }
      `}</style>

      {/* ---------- Header ---------- */}
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-8">
        <h2 className="heading-lg mt-2 font-bungee color-pink">
          Laju Pertumbuhan Indeks Implisit
          <span className="font-bungee color-green"> PDRB</span>
        </h2>
        <p className="body-lg mt-3 max-w-2xl font-delius">
          Satu baris data, satu dekade — bagaimana harga agregat PDRB Jawa
          Tengah bergerak dari 2016 hingga 2025.
        </p>
      </div>

      {/* ---------- Dua kolom sejajar, TIDAK sticky ---------- */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* ====== KIRI: chart draw-in ====== */}
        <div className="chart-container" style={{ position: "relative" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-zinc-700 font-rubik">
              Laju Indeks Implisit PDRB Total (%)
            </h3>
            <span
              className="pill"
              style={{ background: "rgba(249,115,22,0.12)", color: ORANGE_DARK }}
            >
              2016–2025
            </span>
          </div>

          <svg
            ref={svgRef}
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="w-full h-auto"
            onMouseMove={handleMove}
            onMouseLeave={() => setHoverIdx(null)}
          >
            <defs>
              <linearGradient id="lii-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ORANGE} stopOpacity={0.22} />
                <stop offset="100%" stopColor={ORANGE} stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Gridline horizontal tipis putus-putus */}
            {[0, 1, 2, 3, 4, 5].map((v) => (
              <g key={v}>
                <line
                  x1={PAD_L}
                  x2={VB_W - PAD_R}
                  y1={yFor(v)}
                  y2={yFor(v)}
                  stroke={GRID}
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
                <text x={PAD_L - 8} y={yFor(v) + 3} textAnchor="end" fontSize={10} fill={AXIS_LABEL}>
                  {v}%
                </text>
              </g>
            ))}

            {/* Label sumbu-X */}
            {years.map((y) => (
              <text
                key={y}
                x={xFor(y)}
                y={VB_H - PAD_B + 16}
                textAnchor="middle"
                fontSize={10}
                fill={AXIS_LABEL}
              >
                {y}
              </text>
            ))}

            {/* Area gradient tipis di bawah garis */}
            <path
              d={areaPath}
              fill="url(#lii-area)"
              opacity={animated ? 1 : 0}
              style={{ transition: `opacity ${DRAW_MS}ms ease` }}
            />

            {/* Garis utama — animasi draw-in via stroke-dasharray/dashoffset */}
            <path
              ref={pathRef}
              d={linePath}
              fill="none"
              stroke={ORANGE}
              strokeWidth={3}
              strokeLinecap="round"
              className="lii-path"
              style={{
                strokeDasharray: pathLen,
                strokeDashoffset: animated ? 0 : pathLen,
              }}
            />

            {/* Titik data — muncul staggered menyusul ujung garis */}
            {points.map(([x, y], i) => {
              const isPeak = i === peakIdx;
              const r = isPeak ? 7.5 : 4;
              const delay = (i / (years.length - 1)) * DRAW_MS;
              return (
                <circle
                  key={years[i]}
                  cx={x}
                  cy={y}
                  r={r}
                  fill={ORANGE}
                  stroke={isPeak ? "#fff" : "none"}
                  strokeWidth={isPeak ? 2 : 0}
                  className={animated ? "lii-dot" : undefined}
                  style={{
                    opacity: animated ? undefined : 0,
                    animationDelay: animated ? `${delay}ms` : undefined,
                  }}
                />
              );
            })}

            {/* Callout titik puncak (2022) — permanen ter-highlight */}
            {animated && (
              <g className="lii-callout" style={{ animationDelay: `${DRAW_MS + 150}ms` }}>
                <line
                  x1={peakCx}
                  y1={peakCy - 8}
                  x2={peakCx}
                  y2={peakCy - 26}
                  stroke={ORANGE_DARK}
                  strokeWidth={1}
                />
                <rect
                  x={peakBoxX}
                  y={peakCy - 58}
                  width={peakW}
                  height={30}
                  rx={6}
                  fill={ORANGE_SOFT}
                  stroke={ORANGE_DARK}
                  strokeWidth={1}
                />
                <text
                  x={peakBoxX + peakW / 2}
                  y={peakCy - 46}
                  textAnchor="middle"
                  fontSize={10.5}
                  fontWeight={700}
                  fill={ORANGE_DARK}
                >
                  2022: 4,27%
                </text>
                <text
                  x={peakBoxX + peakW / 2}
                  y={peakCy - 35}
                  textAnchor="middle"
                  fontSize={9}
                  fill={ORANGE_DARK}
                >
                  tertinggi dalam satu dekade
                </text>
              </g>
            )}

            {/* Callout titik terendah (2025) — muncul terakhir */}
            {animated && (
              <g className="lii-callout" style={{ animationDelay: `${DRAW_MS + 350}ms` }}>
                <rect
                  x={lowBoxX}
                  y={lowCy + 12}
                  width={lowW}
                  height={26}
                  rx={6}
                  fill={RED_SOFT}
                  stroke={RED}
                  strokeWidth={1}
                />
                <text
                  x={lowBoxX + lowW / 2}
                  y={lowCy + 29}
                  textAnchor="middle"
                  fontSize={9.5}
                  fontWeight={700}
                  fill={RED}
                >
                  2025: 1,45% — titik terendah
                </text>
              </g>
            )}

            {/* Crosshair hover */}
            {animated && hoverIdx !== null && (
              <g pointerEvents="none">
                <line
                  x1={points[hoverIdx][0]}
                  x2={points[hoverIdx][0]}
                  y1={PAD_T}
                  y2={VB_H - PAD_B}
                  stroke="#9CA3AF"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <circle
                  className="lii-crosshair-dot"
                  cx={points[hoverIdx][0]}
                  cy={points[hoverIdx][1]}
                  r={5}
                  fill="#111827"
                />
              </g>
            )}
          </svg>

          {/* Tooltip hover */}
          {animated && hoverIdx !== null && (
            <div
              className="absolute rounded-lg px-3 py-1.5 shadow-sm"
              style={{
                background: "#111827",
                left: `${(points[hoverIdx][0] / VB_W) * 100}%`,
                top: 8,
                transform: "translateX(-50%)",
                pointerEvents: "none",
              }}
            >
              <p style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>
                {years[hoverIdx]} — {fmtID(pdrbTotalImplisit[years[hoverIdx]])}%
              </p>
            </div>
          )}
        </div>

        {/* ====== KANAN: narasi satu blok, TIDAK per-step ====== */}
        <div className={animated ? "lii-narrative" : undefined} style={!animated ? { opacity: 0 } : undefined}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1F2937 font-rubik" }}>
            Satu tahun yang mencolok di antara yang lain.
          </p>
          <p className="body-lg mt-3 font-rubik">
            Sepanjang 2016–2025, laju pertumbuhan Indeks Implisit PDRB Jawa
            Tengah bergerak relatif stabil di kisaran 1,5%–2,7% per tahun —
            kecuali satu tahun. Pada{" "}
            <span
              style={{
                background: ORANGE_SOFT,
                color: ORANGE_DARK,
                borderRadius: 4,
                padding: "1px 4px",
                fontWeight: 700,
              }}
            >
              2022, laju pertumbuhannya melonjak ke 4,27%
            </span>
            , sekitar 1,7 kali lipat dari rata-rata dekade ini ({fmtID(AVERAGE)}%), jauh di
            atas tahun sebelum maupun sesudahnya.
          </p>
          <p className="body-lg mt-3">
            Lonjakan ini sejalan dengan gelombang kenaikan harga global
            pasca-pandemi yang terasa di berbagai sektor — dari komoditas
            energi hingga bahan pangan. Setelahnya, laju pertumbuhan kembali
            mereda: 3,56% di 2023, 2,18% di 2024, hingga mencapai titik
            terendah dalam satu dekade di{" "}
            <span
              style={{
                background: RED_SOFT,
                color: RED,
                borderRadius: 4,
                padding: "1px 4px",
                fontWeight: 700,
              }}
            >
              2025, hanya 1,45%
            </span>{" "}
            — bahkan lebih rendah dari masa awal pandemi (2020: 1,74%).
          </p>
          <p className="body-lg mt-3">
            Pola ini menutup rangkaian cerita ekonomi Jawa Tengah: struktur
            yang terus bergeser, kesenjangan antarwilayah yang persisten, dan
            kini, tekanan harga yang naik-turun mengikuti guncangan global —
            mengingatkan bahwa pertumbuhan ekonomi daerah tidak pernah lepas
            dari dinamika yang lebih besar di luar batas wilayahnya.
          </p>
        </div>
      </div>

      {/* ---------- Penutup halaman (scene terakhir) ---------- */}
      <div
        className="font-rubik max-w-6xl mx-auto px-6 mt-16 mb-24 pt-10 border-t"
        style={{ borderColor: "#E4E4E7" }}
      >
        <p className="body-lg mt-3 max-w-3xl">
          Dari ketimpangan PDRB antarwilayah, struktur ekonomi yang terus
          bergeser, PDRB per kapita yang belum merata, sumber pertumbuhan yang
          bertumpu pada segelintir sektor, hingga tekanan harga yang
          naik-turun mengikuti guncangan global — cerita ekonomi Jawa Tengah
          2016–2025 adalah cerita tentang pertumbuhan yang nyata, namun belum
          sepenuhnya merata.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">


        </div>
      </div>
    </section>
  );
}
