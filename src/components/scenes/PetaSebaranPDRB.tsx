"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import {
  regions,
  metrics,
  valueOf,
  steps,
  type MetricKey,
  type HighlightTone,
  type RegionDatum,
} from "@/data/pdrbSpasial";

/* ================================================================== */
/* Konstanta visual                                                   */
/* ================================================================== */

/**
 * Skala diverging 6 kelas (PiYG) — enam warna persis seperti pada legenda
 * acuan, disusun magenta (nilai rendah) → ... → hijau tua (nilai tinggi)
 * supaya arah label "← Rendah / Tinggi →" tetap konsisten dengan sebelumnya.
 */
const SCALE = [
  "#c51b7d",
  "#e9a3c9",
  "#fde0ef",
  "#e6f5d0",
  "#a1d76a",
  "#4d9221",
];
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

/** Batas kuantil N-1 dari nilai yang tersedia (N = jumlah kelas warna), bukan skala linear. */
function quantileBreaks(values: number[], classCount: number): number[] {
  const sorted = [...values].sort((a, b) => a - b);
  const qs = Array.from(
    { length: classCount - 1 },
    (_, i) => (i + 1) / classCount,
  );
  return qs.map((q) => {
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
  const [hovered, setHovered] = useState<string | null>(null);

  const narrativeRef = useRef<HTMLDivElement>(null);
  const spacerRefs = useRef<(HTMLDivElement | null)[]>([]);

  /**
   * Satu rangkaian linear 6 step: step 0–2 = ADHB, step 3–5 = ADHK.
   * Metrik peta & badge murni mengikuti step yang sedang aktif di scroll —
   * tidak ada lagi cabang toggle manual.
   */
  const step = steps[activeStep] ?? steps[0];
  const metric: MetricKey = step.metric;

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
      rootMargin: "-45% 0px -45% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    el.querySelectorAll("[data-step]").forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [onIntersect]);

  /* ---------------- Skala warna ---------------- */

  const { breaks, hasData } = useMemo(() => {
    const vals = regions
      .map((r) => valueOf(r, metric))
      .filter((v): v is number => v !== null);
    return {
      breaks:
        vals.length >= SCALE.length ? quantileBreaks(vals, SCALE.length) : [],
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
    step.focus.forEach((f) => {
      const r = byName.get(f.region);
      const v = r ? valueOf(r, metric) : null;
      m.set(f.region, {
        tone: f.tone,
        callout: v !== null ? formatValue(v) : "",
      });
    });
    return m;
  }, [step, byName, metric]);

  const activeMetricDef = metrics.find((m) => m.key === metric)!;
  void hasData; // seluruh 35 wilayah selalu punya nilai ADHB & ADHK — tidak ada kelas "belum tersedia"

  /** Klik badge ADHB/ADHK di atas peta = lompat ke step pertama metrik itu. */
  const jumpToMetric = useCallback((m: MetricKey) => {
    const targetIdx = steps.findIndex((s) => s.metric === m);
    spacerRefs.current[targetIdx]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  /* ================================================================ */

  return (
    <section className="pdrb-section">
      <style>{`
        @keyframes pdrb-pop { from { opacity: 0 } to { opacity: 1 } }
        .pdrb-region { transition: fill 600ms ease, stroke 300ms ease, stroke-width 300ms ease; }
      `}</style>
      <style jsx global>{`
        .pdrb-section {
          display: flex;
          position: relative;
          background: #ffffff;
          font-family: "Jost", var(--font-sans), sans-serif;
          color: #282828;
        }

        /* ====== KIRI: kolom statis ====== */
        .pdrb-section .pdrb-visual-col {
          width: 60%;
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: stretch;
          gap: 0.65rem;
          padding: 3.5vh 2rem 2.5vh 3.5rem;
          background: #ffffff;
          z-index: 1;
          overflow: hidden;
        }
        .pdrb-section .pdrb-title {
          font-size: clamp(19px, 2vw, 26px);
          line-height: 1.15;
          flex: 0 0 auto;
        }
        .pdrb-section .pdrb-legend-bar {
          display: flex;
          height: 10px;
          width: 100%;
          border-radius: 1px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.1);
          flex: 0 0 auto;
        }
        .pdrb-section .pdrb-legend-bar span {
          flex: 1;
          height: 100%;
        }
        .pdrb-section .pdrb-legend-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #666666;
          margin-top: 6px;
          font-weight: 500;
          flex: 0 0 auto;
        }
        .pdrb-section .pdrb-map-box {
          position: relative;
          flex: 1 1 auto;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .pdrb-section .pdrb-map-box svg {
          width: 100%;
          height: 100%;
        }

        /* Badge ADHB/ADHK mengambang di atas-tengah peta */
        .pdrb-section .pdrb-metric-badge {
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          gap: 6px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid #e5e7eb;
          border-radius: 999px;
          padding: 4px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
        }
        .pdrb-section .pdrb-metric-pill {
          padding: 5px 13px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
          transition:
            background 250ms ease,
            color 250ms ease;
          border: none;
          cursor: pointer;
        }

        /* ====== KANAN: narasi — sama persis dengan pola Indeks Williamson ====== */
        .pdrb-section .pdrb-narrative-col {
          width: 40%;
          position: relative;
          z-index: 2;
          /*
           * Padding bawah sengaja dibuat 100vh (satu layar penuh) — bukan
           * sekadar jeda kecil. Kartu step terakhir (min-height 85vh) perlu
           * ruang scroll yang cukup untuk benar-benar keluar dari viewport
           * (menghilang ke atas) SEBELUM section ini berakhir dan section
           * berikutnya mulai tampil. Dengan ini, ada fase penuh di mana
           * hanya peta yang terlihat sendirian, baru setelah itu pindah ke
           * section selanjutnya.
           */
          padding: 35vh 3.5rem 100vh 1.5rem;
        }
        .pdrb-section .pdrb-step {
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.25;
          transform: translateY(15px);
          transition:
            opacity 0.35s ease,
            transform 0.35s ease;
        }
        .pdrb-section .pdrb-step.is-active {
          opacity: 1;
          transform: translateY(0);
        }
        .pdrb-section .pdrb-card {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 2rem 2.25rem;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          width: 100%;
          transition:
            box-shadow 0.35s ease,
            border-color 0.35s ease;
        }
        .pdrb-section .pdrb-step.is-active .pdrb-card {
          border-color: #cbd5e1;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
        }
        .pdrb-section .pdrb-card p {
          font-size: 1.05rem;
          line-height: 1.75;
          color: #374151;
        }

        @media (max-width: 1023px) {
          .pdrb-section {
            flex-direction: column;
          }
          .pdrb-section .pdrb-visual-col {
            width: 100%;
            height: auto;
            min-height: 100vh;
            padding: 2rem 1.25rem;
          }
          .pdrb-section .pdrb-narrative-col {
            width: 100%;
            padding: 2rem 1.25rem 60vh 1.25rem;
          }
          .pdrb-section .pdrb-step {
            min-height: 65vh;
          }
        }
      `}</style>

      {/* ====== KIRI: judul + legenda + peta (badge ADHB/ADHK di atas peta) — statis, sticky penuh ====== */}
      <div className="pdrb-visual-col">
        <h2 className="pdrb-title font-bold font-bungee color-pink">
          Sebaran PDRB
          <br />
          Kabupaten/Kota di Jawa Tengah
        </h2>

        {/* Legenda */}
        <div>
          <div className="pdrb-legend-bar">
            {SCALE.map((c) => (
              <span key={c} style={{ background: c }} />
            ))}
          </div>
          <div className="pdrb-legend-labels">
            <span>← Nilai PDRB Rendah</span>
            <span>Nilai PDRB Tinggi →</span>
          </div>
          <p className="mt-1.5" style={{ fontSize: 11.5, color: "#9CA3AF" }}>
            {activeMetricDef.caption} · klasifikasi quantile break dari 35
            kab/kota
          </p>
        </div>

        {/* Peta */}
        <div
          className="pdrb-map-box rounded-xl border"
          style={{ borderColor: "#E5E7EB", background: "#FFFFFF" }}
        >
          {/* Badge ADHB / ADHK — otomatis bertukar sesuai step, bisa diklik untuk lompat */}
          <div className="pdrb-metric-badge">
            {metrics.map((m) => {
              const on = m.key === metric;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => jumpToMetric(m.key)}
                  className="pdrb-metric-pill"
                  style={{
                    background: on ? ACCENT : "transparent",
                    color: on ? "#fff" : "#6B7280",
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {geoError && (
            <div
              className="p-10 text-center"
              style={{ color: "#B91C1C", fontSize: 14 }}
            >
              Gagal memuat <code>/jawatengah.json</code> ({geoError}). Pastikan
              file TopoJSON ada di folder <code>public/</code>.
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
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              preserveAspectRatio="xMidYMid meet"
            >
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
                    style={{
                      cursor: "default",
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
              style={{ background: "#111827", zIndex: 4 }}
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
          <p style={{ fontSize: 10.5, color: "#B91C1C", flex: "0 0 auto" }}>
            {unmatched.length} wilayah di GeoJSON tidak cocok dengan data (
            {unmatched.slice(0, 4).join(", ")}
            {unmatched.length > 4 ? ", …" : ""}).
          </p>
        )}
      </div>

      {/*
        ====== KANAN: narasi ======
        Kolom ini TIDAK sticky — dia sengaja lebih tinggi dari layar (setiap
        step ≥85vh) sehingga scroll dokumen biasa menggeser seluruh kolom
        dari bawah ke atas, persis pola di section Indeks Williamson: kartu
        yang sedang di tengah viewport menyala penuh (`.is-active`), kartu
        lain meredup lalu hilang begitu keluar dari area tengah layar.
      */}
      <div ref={narrativeRef} className="pdrb-narrative-col">
        {steps.map((s, idx) => {
          const on = activeStep === idx;
          return (
            <div
              key={idx}
              data-step={idx}
              ref={(el) => {
                spacerRefs.current[idx] = el;
              }}
              className={`pdrb-step${on ? " is-active" : ""}`}
            >
              <div className="pdrb-card">
                <h3
                  className="mt-1.5"
                  style={{ fontSize: 22, fontWeight: 700, color: "#1F2937" }}
                >
                  {s.title}
                </h3>
                <p className="mt-3">
                  {s.body.map((seg, i) => {
                    const tone = seg.tone ? TONE[seg.tone] : null;
                    return (
                      <span
                        key={i}
                        style={{
                          fontWeight: seg.bold ? 700 : 400,
                          background: tone ? tone.bg : undefined,
                          color: tone ? tone.fg : undefined,
                          borderRadius: tone ? 4 : undefined,
                          padding: tone ? "1px 4px" : undefined,
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
    </section>
  );
}
