"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import {
  regions,
  metrics,
  valueOf,
  storySteps,
  type MetricKey,
  type HighlightTone,
  type RegionDatum,
} from "@/data/pdrbSpasial";

/* ================================================================== */
/* Konstanta visual                                                   */
/* ================================================================== */

/** Skala diverging 5 kelas (magenta → krem → hijau), sesuai brief. */
const SCALE = ["#C2185B", "#F48FB1", "#F5F0E8", "#A5D6A7", "#2E7D32"];
const NO_DATA = "#E5E7EB";
const ACCENT = "#F97316";

const TONE: Record<HighlightTone, { bg: string; fg: string; stroke: string }> =
  {
    green: { bg: "#DCFCE7", fg: "#166534", stroke: "#166534" },
    magenta: { bg: "#FCE7F3", fg: "#9D174D", stroke: "#9D174D" },
    orange: { bg: "#FFEDD5", fg: "#C2410C", stroke: "#C2410C" },
    red: { bg: "#FEE2E2", fg: "#B91C1C", stroke: "#B91C1C" },
  };

const VB_W = 820;
const VB_H = 520;
const VB_PAD = 24;

/* ================================================================== */
/* Util: pencocokan nama wilayah GeoJSON ↔ data                        */
/* ================================================================== */

/**
 * Normalisasi nama jadi bentuk "KAB X" / "KOTA X".
 * Prefiks kab/kota dipertahankan karena ada pasangan nama kembar
 * (Semarang, Magelang, Tegal, Pekalongan) yang akan bertabrakan bila dibuang.
 */
function normalizeName(raw: string): string {
  let s = raw.toUpperCase().replace(/\([^)]*\)/g, " ");
  const isKota = /\bKOTA\b|\bKOTAMADYA\b/.test(s);
  s = s
    .replace(
      /\bKABUPATEN\b|\bKAB\b|\bKOTAMADYA\b|\bKOTA\b|\bADM\b|\bDAERAH\b/g,
      " ",
    )
    .replace(/[^A-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return `${isKota ? "KOTA" : "KAB"} ${s}`;
}

/**
 * ID wilayah dari TopoJSON Jawa Tengah
 * → nama kanonik yang digunakan oleh data PDRB.
 *
 * ID 33-01 s.d. 33-29 = Kabupaten
 * ID 33-71 s.d. 33-76 = Kota
 *
 * 33-88 dan 33-99 bukan kabupaten/kota,
 * sehingga tidak dimasukkan.
 */
const TOPO_ID_TO_REGION: Record<string, string> = {
  "33-01": "Kab. Cilacap",
  "33-02": "Kab. Banyumas",
  "33-03": "Kab. Purbalingga",
  "33-04": "Kab. Banjarnegara",
  "33-05": "Kab. Kebumen",
  "33-06": "Kab. Purworejo",
  "33-07": "Kab. Wonosobo",
  "33-08": "Kab. Magelang",
  "33-09": "Kab. Boyolali",
  "33-10": "Kab. Klaten",
  "33-11": "Kab. Sukoharjo",
  "33-12": "Kab. Wonogiri",
  "33-13": "Kab. Karanganyar",
  "33-14": "Kab. Sragen",
  "33-15": "Kab. Grobogan",
  "33-16": "Kab. Blora",
  "33-17": "Kab. Rembang",
  "33-18": "Kab. Pati",
  "33-19": "Kab. Kudus",
  "33-20": "Kab. Jepara",
  "33-21": "Kab. Demak",
  "33-22": "Kab. Semarang",
  "33-23": "Kab. Temanggung",
  "33-24": "Kab. Kendal",
  "33-25": "Kab. Batang",
  "33-26": "Kab. Pekalongan",
  "33-27": "Kab. Pemalang",
  "33-28": "Kab. Tegal",
  "33-29": "Kab. Brebes",

  "33-71": "Kota Magelang",
  "33-72": "Kota Surakarta",
  "33-73": "Kota Salatiga",
  "33-74": "Kota Semarang",
  "33-75": "Kota Pekalongan",
  "33-76": "Kota Tegal",
};

/* ================================================================== */
/* Util: proyeksi & path SVG (tanpa d3 — cukup equirectangular)        */
/* ================================================================== */

type Ring = number[][];
type Poly = Ring[];

function polygonsOf(geom: { type: string; coordinates: unknown }): Poly[] {
  if (geom.type === "Polygon") return [geom.coordinates as Poly];
  if (geom.type === "MultiPolygon") return geom.coordinates as Poly[];
  return [];
}

interface Projection {
  k: number;
  cosLat: number;
  lon0: number;
  lat0: number;
  dx: number;
  dy: number;
}

function buildProjection(allPolys: Poly[][]): Projection {
  let minLon = Infinity,
    maxLon = -Infinity,
    minLat = Infinity,
    maxLat = -Infinity;
  allPolys.forEach((polys) =>
    polys.forEach((poly) =>
      poly.forEach((ring) =>
        ring.forEach(([lon, lat]) => {
          if (lon < minLon) minLon = lon;
          if (lon > maxLon) maxLon = lon;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        }),
      ),
    ),
  );

  const lat0 = (minLat + maxLat) / 2;
  const lon0 = (minLon + maxLon) / 2;
  const cosLat = Math.cos((lat0 * Math.PI) / 180);

  const spanX = (maxLon - minLon) * cosLat;
  const spanY = maxLat - minLat;
  const k = Math.min((VB_W - VB_PAD * 2) / spanX, (VB_H - VB_PAD * 2) / spanY);

  return { k, cosLat, lon0, lat0, dx: VB_W / 2, dy: VB_H / 2 };
}

function project(lon: number, lat: number, p: Projection): [number, number] {
  return [(lon - p.lon0) * p.cosLat * p.k + p.dx, -(lat - p.lat0) * p.k + p.dy];
}

function pathOf(polys: Poly[], p: Projection): string {
  const parts: string[] = [];
  polys.forEach((poly) =>
    poly.forEach((ring) => {
      if (ring.length < 2) return;
      ring.forEach(([lon, lat], i) => {
        const [x, y] = project(lon, lat, p);
        parts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
      });
      parts.push("Z");
    }),
  );
  return parts.join("");
}

/** Titik tengah ring terbesar — dipakai untuk dot penanda & callout. */
function centroidOf(polys: Poly[], p: Projection): [number, number] {
  let best: Ring = [];
  polys.forEach((poly) => {
    if (poly[0] && poly[0].length > best.length) best = poly[0];
  });
  if (best.length === 0) return [0, 0];
  let sx = 0,
    sy = 0;
  best.forEach(([lon, lat]) => {
    const [x, y] = project(lon, lat, p);
    sx += x;
    sy += y;
  });
  return [sx / best.length, sy / best.length];
}

/* ================================================================== */
/* Util: klasifikasi kuantil & format angka                           */
/* ================================================================== */

/** Batas kuantil 5 kelas dari nilai yang tersedia (bukan skala linear). */
function quantileBreaks(values: number[]): number[] {
  const sorted = [...values].sort((a, b) => a - b);
  return [0.2, 0.4, 0.6, 0.8].map((q) => {
    const pos = (sorted.length - 1) * q;
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
  });
}

function classOf(value: number, breaks: number[]): number {
  let c = 0;
  while (c < breaks.length && value > breaks[c]) c += 1;
  return c;
}

function formatValue(v: number): string {
  if (v >= 1000) {
    return `Rp${(v / 1000).toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} triliun`;
  }
  return `Rp${v.toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} miliar`;
}

/* ================================================================== */
/* Tipe internal                                                      */
/* ================================================================== */

interface Shape {
  name: string;
  path: string;
  cx: number;
  cy: number;
}

type GeoFeature = {
  type: "Feature";
  id?: string | number;
  properties: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: unknown;
  } | null;
};

/* ================================================================== */
/* Komponen                                                           */
/* ================================================================== */

export default function PetaSebaranPDRB() {
  const [shapes, setShapes] = useState<Shape[] | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [unmatched, setUnmatched] = useState<string[]>([]);

  const [activeStep, setActiveStep] = useState(0);
  const [manualMetric, setManualMetric] = useState<MetricKey | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [blink, setBlink] = useState(0);

  const narrativeRef = useRef<HTMLDivElement>(null);

  const step = storySteps[activeStep] ?? storySteps[0];
  const metric: MetricKey = manualMetric ?? step.metric;

  const byName = useMemo(() => {
    const m = new Map<string, RegionDatum>();
    regions.forEach((r) => m.set(r.name, r));
    return m;
  }, []);

  /* ---------------- Muat GeoJSON ---------------- */

  /* ---------------- Muat TopoJSON ---------------- */

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/jawatengah.json");

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const topo = await res.json();

        if (topo?.type !== "Topology" || !topo?.objects?.["jawa-tengah"]) {
          throw new Error(
            'File bukan TopoJSON yang valid atau object "jawa-tengah" tidak ditemukan',
          );
        }

        /**
         * Konversi TopoJSON → GeoJSON FeatureCollection.
         *
         * TopoJSON tetap menjadi sumber utama.
         * Konversi hanya dilakukan di browser agar fungsi
         * polygonsOf(), pathOf(), dan centroidOf() tetap bisa digunakan.
         */
        const geo = feature(topo, topo.objects["jawa-tengah"]) as unknown as {
          type: "FeatureCollection";
          features: GeoFeature[];
        };

        const features = geo.features ?? [];

        if (features.length === 0) {
          throw new Error("TopoJSON tidak memiliki geometry");
        }

        const allPolys = features.map((f) =>
          f.geometry ? polygonsOf(f.geometry) : [],
        );

        const proj = buildProjection(allPolys);

        const out: Shape[] = [];
        const misses: string[] = [];

        features.forEach((f, i) => {
          const polys = allPolys[i];

          if (polys.length === 0) return;

          /**
           * Pencocokan utama berdasarkan ID wilayah.
           *
           * JANGAN menggunakan properties.kabkot sebagai
           * kunci utama karena:
           *
           * Magelang  → ada Kabupaten + Kota
           * Semarang  → ada Kabupaten + Kota
           * Pekalongan → ada Kabupaten + Kota
           * Tegal     → ada Kabupaten + Kota
           */
          const topoId = String(f.id ?? "");

          const canonical = TOPO_ID_TO_REGION[topoId];

          /**
           * 33-88 = Waduk Kedu
           * 33-99 = Hutan
           *
           * Keduanya sengaja tidak dimasukkan ke data PDRB.
           */
          if (!canonical) {
            const rawName =
              typeof f.properties?.kabkot === "string"
                ? f.properties.kabkot
                : topoId;

            // Jangan anggap Waduk/Hutan sebagai wilayah yang hilang.
            if (topoId !== "33-88" && topoId !== "33-99") {
              misses.push(rawName);
            }

            return;
          }

          const [cx, cy] = centroidOf(polys, proj);

          out.push({
            name: canonical,
            path: pathOf(polys, proj),
            cx,
            cy,
          });
        });

        /**
         * Validasi tambahan:
         * semua nama dari data PDRB harus memiliki shape.
         */
        const shapeNames = new Set(out.map((s) => s.name));

        regions.forEach((region) => {
          if (!shapeNames.has(region.name)) {
            misses.push(region.name);
          }
        });

        if (!cancelled) {
          setShapes(out);
          setUnmatched([...new Set(misses)]);
        }
      } catch (err) {
        if (!cancelled) {
          setGeoError(err instanceof Error ? err.message : "Gagal memuat peta");
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------------- Observer langkah narasi ---------------- */

  const onIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    let best = -1;
    let bestRatio = 0;
    entries.forEach((e) => {
      const idx = parseInt((e.target as HTMLElement).dataset.step || "0", 10);
      if (e.isIntersecting && e.intersectionRatio > bestRatio) {
        bestRatio = e.intersectionRatio;
        best = idx;
      }
    });
    if (best >= 0) setActiveStep(best);
  }, []);

  useEffect(() => {
    const el = narrativeRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(onIntersect, {
      rootMargin: "-40% 0px -40% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    el.querySelectorAll("[data-step]").forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [onIntersect]);

  /** Scroll mengembalikan kendali toggle & melepas pin. */
  useEffect(() => {
    setManualMetric(null);
    setPinned(null);
  }, [activeStep]);

  /* ---------------- Kedip bergantian di step penutup ---------------- */

  useEffect(() => {
    if (!step.cycle) return;
    const id = setInterval(() => setBlink((b) => b + 1), 900);
    return () => clearInterval(id);
  }, [step.cycle]);

  /* ---------------- Skala warna ---------------- */

  const { breaks, hasData } = useMemo(() => {
    const vals = regions
      .map((r) => valueOf(r, metric))
      .filter((v): v is number => v !== null);
    return {
      breaks: vals.length >= 5 ? quantileBreaks(vals) : [],
      hasData: vals.length,
    };
  }, [metric]);

  const colorFor = useCallback(
    (name: string) => {
      const r = byName.get(name);
      if (!r) return NO_DATA;
      const v = valueOf(r, metric);
      if (v === null || breaks.length === 0) return NO_DATA;
      return SCALE[classOf(v, breaks)];
    },
    [byName, metric, breaks],
  );

  /* ---------------- Sorotan aktif ---------------- */

  const focusMap = useMemo(() => {
    const m = new Map<string, { tone: HighlightTone; callout: string }>();
    step.focus.forEach((f) =>
      m.set(f.region, { tone: f.tone, callout: f.callout }),
    );

    if (step.cycle && step.cycle.length > 0) {
      const name = step.cycle[blink % step.cycle.length];
      const r = byName.get(name);
      const v = r ? valueOf(r, metric) : null;
      m.set(name, { tone: "green", callout: v !== null ? formatValue(v) : "" });
    }

    if (pinned) {
      const r = byName.get(pinned);
      const v = r ? valueOf(r, metric) : null;
      m.set(pinned, {
        tone: m.get(pinned)?.tone ?? "orange",
        callout: v !== null ? formatValue(v) : "data belum tersedia",
      });
    }
    return m;
  }, [step, blink, pinned, byName, metric]);

  const activeMetricDef = metrics.find((m) => m.key === metric)!;
  const missingCount = regions.length - hasData;

  /* ================================================================ */

  return (
    <section className="relative bg-white">
      <style>{`
        @keyframes pdrb-pop { from { opacity: 0 } to { opacity: 1 } }
        .pdrb-region { transition: fill 600ms ease, stroke 300ms ease, stroke-width 300ms ease; }
        .pdrb-card { transition: opacity 500ms ease, transform 500ms ease; }
        .pdrb-term { cursor: pointer; border-radius: 4px; padding: 1px 4px; text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
      `}</style>

      {/* ---------- Header section ---------- */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-6">

        <h2 className="mt-2 text-3xl md:text-4xl font-bold font-bungee color-pink">
          Sebaran PDRB <p className="color-pink font-bungee">Kabupaten/Kota di Jawa Tengah</p>
        </h2>
        <p
          className="mt-3 max-w-2xl font-delius"
         
        >
          Peta di kiri diam di tempat; gulir kolom kanan untuk melihat bagaimana
          nilai ekonomi 35 kabupaten/kota berpindah dominasi dari satu indikator
          ke indikator berikutnya.
        </p>
      </div>

      {/* ---------- Split screen ---------- */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-10">
        {/* ====== KIRI: peta sticky ====== */}
        <div className="lg:w-[58%] lg:sticky lg:top-6 lg:self-start">
          {/* Toggle indikator */}
          <div className="flex flex-wrap gap-2 mb-4">
            {metrics.map((m) => {
              const on = m.key === metric;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setManualMetric(m.key)}
                  className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-colors"
                  style={{
                    background: on ? ACCENT : "#F3F4F6",
                    color: on ? "#fff" : "#6B7280",
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="mb-3">
            <div className="flex h-2.5 rounded-full overflow-hidden">
              {SCALE.map((c) => (
                <div key={c} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <div
              className="flex justify-between mt-1.5"
              style={{ fontSize: 12, color: "#9CA3AF" }}
            >
              <span>Nilai PDRB Rendah</span>
              <span>Rata-rata Provinsi</span>
              <span>Nilai PDRB Tinggi</span>
            </div>
            <p className="mt-2" style={{ fontSize: 12, color: "#9CA3AF" }}>
              {activeMetricDef.caption} · klasifikasi quantile break dari 35
              kab/kota
              {missingCount > 0 && (
                <>
                  {" · "}
                  <span style={{ color: "#B91C1C" }}>
                    {missingCount} wilayah abu-abu: data sektoral belum tersedia
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Peta */}
          <div
            className="relative rounded-xl border"
            style={{ borderColor: "#E5E7EB", background: "#FFFFFF" }}
          >
            {geoError && (
              <div
                className="p-10 text-center"
                style={{ color: "#B91C1C", fontSize: 14 }}
              >
                Gagal memuat <code>/jawatengah.json</code> ({geoError}).
                Pastikan file TopoJSON ada di folder <code>public/</code>.
              </div>
            )}

            {!geoError && !shapes && (
              <div
                className="p-10 text-center"
                style={{ color: "#9CA3AF", fontSize: 14 }}
              >
                Memuat peta…
              </div>
            )}

            {shapes && (
              <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto">
                {shapes.map((s, i) => {
                  const f = focusMap.get(s.name);
                  const isHover = hovered === s.name;
                  const lifted = Boolean(f) || isHover;
                  return (
                    <path
                      key={s.name}
                      className="pdrb-region"
                      d={s.path}
                      fill={colorFor(s.name)}
                      stroke={f ? TONE[f.tone].stroke : "#FFFFFF"}
                      strokeWidth={f ? 2.5 : isHover ? 1.8 : 1}
                      strokeLinejoin="round"
                      onMouseEnter={() => setHovered(s.name)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() =>
                        setPinned((p) => (p === s.name ? null : s.name))
                      }
                      style={{
                        cursor: "pointer",
                        transformOrigin: `${s.cx}px ${s.cy}px`,
                        transform: lifted ? "scale(1.05)" : "scale(1)",
                        transition: "transform 400ms ease, fill 600ms ease",
                        animation: `pdrb-pop 400ms ease both`,
                        animationDelay: `${Math.min(i * 20, 700)}ms`,
                      }}
                    />
                  );
                })}

                {/* Dot penanda + callout untuk wilayah yang sedang disorot */}
                {shapes.map((s) => {
                  const f = focusMap.get(s.name);
                  if (!f) return null;
                  const label = f.callout;
                  const w = Math.max(74, label.length * 6.4 + 16);
                  const flip = s.cy < 70;
                  const boxY = flip ? s.cy + 14 : s.cy - 40;
                  return (
                    <g key={`cal-${s.name}`} pointerEvents="none">
                      <circle cx={s.cx} cy={s.cy} r={4} fill="#111827" />
                      <circle
                        cx={s.cx}
                        cy={s.cy}
                        r={8}
                        fill="#111827"
                        opacity={0.15}
                      />
                      {label && (
                        <>
                          <rect
                            x={s.cx - w / 2}
                            y={boxY}
                            width={w}
                            height={26}
                            rx={6}
                            fill={TONE[f.tone].bg}
                            stroke={TONE[f.tone].stroke}
                            strokeWidth={1}
                          />
                          <text
                            x={s.cx}
                            y={boxY + 17}
                            textAnchor="middle"
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              fill: TONE[f.tone].fg,
                            }}
                          >
                            {label}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Tooltip hover */}
            {hovered && (
              <div
                className="absolute left-4 bottom-4 rounded-lg px-3 py-2 shadow-sm"
                style={{ background: "#111827" }}
              >
                <p style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>
                  {hovered}
                </p>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
                  {(() => {
                    const r = byName.get(hovered);
                    const v = r ? valueOf(r, metric) : null;
                    return v === null
                      ? "Data belum tersedia"
                      : `${activeMetricDef.label} · ${formatValue(v)}`;
                  })()}
                </p>
              </div>
            )}
          </div>

          {unmatched.length > 0 && (
            <p className="mt-2" style={{ fontSize: 11, color: "#B91C1C" }}>
              {unmatched.length} wilayah di GeoJSON tidak cocok dengan data (
              {unmatched.slice(0, 4).join(", ")}
              {unmatched.length > 4 ? ", …" : ""}).
            </p>
          )}
        </div>

        {/* ====== KANAN: kartu narasi ====== */}
        <div ref={narrativeRef} className="lg:w-[42%] pb-28">
          {storySteps.map((s, idx) => {
            const on = activeStep === idx;
            return (
              <div
                key={idx}
                data-step={idx}
                className="min-h-[70vh] flex items-center"
              >
                <div
                  className="pdrb-card rounded-2xl w-full"
                  style={{
                    background: "#F7F7F5",
                    padding: 36,
                    opacity: on ? 1 : 0.45,
                    transform: on ? "translateY(0)" : "translateY(8px)",
                    boxShadow: on ? "0 2px 18px rgba(17,24,39,0.06)" : "none",
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: on ? ACCENT : "#9CA3AF",
                    }}
                  >
                    {s.eyebrow}
                  </p>
                  <h3
                    className="mt-1.5"
                    style={{ fontSize: 22, fontWeight: 700, color: "#1F2937" }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="mt-3"
                    style={{ fontSize: 17, lineHeight: 1.6, color: "#374151" }}
                  >
                    {s.body.map((seg, i) => {
                      const tone = seg.tone ? TONE[seg.tone] : null;
                      const isTerm = Boolean(seg.region);
                      return (
                        <span
                          key={i}
                          className={isTerm ? "pdrb-term" : undefined}
                          onClick={
                            isTerm
                              ? () =>
                                  setPinned((p) =>
                                    p === seg.region ? null : seg.region!,
                                  )
                              : undefined
                          }
                          style={{
                            fontWeight: seg.bold ? 700 : 400,
                            background: tone ? tone.bg : undefined,
                            color: tone ? tone.fg : undefined,
                            boxShadow:
                              pinned && seg.region === pinned
                                ? `inset 0 -2px 0 ${tone ? tone.fg : "#111827"}`
                                : undefined,
                          }}
                        >
                          {seg.text}
                        </span>
                      );
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
