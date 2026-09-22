// src/components/scenes/StrukturEkonomiSunburst.tsx
"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as d3 from "d3";
import {
  dataLapanganUsaha,
  getHierarchicalData,
  type HierarchyData,
} from "@/data/strukturEkonomi";

/* ============================================================
   1. AGREGASI DATA (untuk panel statistik samping)
   ============================================================ */
const PRIMER_CODES = ["A", "B"];
const SEKUNDER_CODES = ["C", "D", "E", "F"];
const TERSIER_CODES = dataLapanganUsaha
  .map((d) => d.code)
  .filter((c) => !PRIMER_CODES.includes(c) && !SEKUNDER_CODES.includes(c));

function sumSektor(codes: string[], year: number) {
  return dataLapanganUsaha
    .filter((d) => codes.includes(d.code))
    .reduce((acc, d) => acc + (d.values[year] ?? 0), 0);
}

const YEARS = [2016, 2025] as const;
type Year = (typeof YEARS)[number];
type Sektor = "Primer" | "Sekunder" | "Tersier";
const SEKTOR_ORDER: Sektor[] = ["Primer", "Sekunder", "Tersier"];

const SEKTOR_VALUE: Record<Year, Record<Sektor, number>> = {
  2016: {
    Primer: sumSektor(PRIMER_CODES, 2016),
    Sekunder: sumSektor(SEKUNDER_CODES, 2016),
    Tersier: sumSektor(TERSIER_CODES, 2016),
  },
  2025: {
    Primer: sumSektor(PRIMER_CODES, 2025),
    Sekunder: sumSektor(SEKUNDER_CODES, 2025),
    Tersier: sumSektor(TERSIER_CODES, 2025),
  },
};

/* ============================================================
   2. PALET WARNA — satu warna per sektor (sama untuk 2016 & 2025):
   Primer = hijau tengah, Sekunder = oranye tengah, Tersier = pink
   tengah. Ring luar (17 lapangan usaha) memakai GRADASI dari warna
   sektor induknya (childShades) supaya tiap lapangan usaha tetap
   bisa dibedakan satu sama lain.
   ============================================================ */
const PALETTE: Record<Sektor, { arc: string; text: string; bg: string }> = {
  Primer: { arc: "#a1d76a", text: "#4d7c0f", bg: "#F1F8E5" },
  Sekunder: { arc: "#fdae61", text: "#c2410c", bg: "#FFF3E6" },
  Tersier: { arc: "#e9a3c9", text: "#9d174d", bg: "#FCE7F3" },
};

function childShades(baseColor: string, n: number): string[] {
  const base = d3.hsl(baseColor);
  const light = d3.hsl(base.h, base.s, Math.min(0.9, base.l + 0.28));
  const dark = d3.hsl(
    base.h,
    Math.min(1, base.s + 0.08),
    Math.max(0.22, base.l - 0.3),
  );
  const interpolator = d3.interpolateHsl(dark.toString(), light.toString());
  return d3.quantize(interpolator, Math.max(n, 2));
}

const fmt = (n: number) =>
  n.toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function Hl({
  sektor,
  children,
}: {
  sektor: Sektor;
  year?: Year;
  children: ReactNode;
}) {
  const c = PALETTE[sektor];
  return (
    <span className="hl-num" style={{ backgroundColor: c.bg, color: c.text }}>
      {children}
    </span>
  );
}

/* ============================================================
   3. GEOMETRI SUNBURST — 2 lapis (d3.hierarchy + d3.partition):
     - Ring dalam : 3 sektor
     - gap radial
     - Ring luar  : 17 lapangan usaha, bersarang di sudut induknya
   Arc generator dipisah dari tipe node asli (cukup {x0,x1}) supaya
   bisa dipakai untuk animasi sapuan sudut (lihat SektorGroup).
   ============================================================ */
type RNode = d3.HierarchyRectangularNode<HierarchyData>;
type Angles = { x0: number; x1: number };

const INNER_R0 = 42;
const INNER_R1 = 94;
const RING_GAP = 14;
const OUTER_R0 = INNER_R1 + RING_GAP; // 108
const OUTER_R1 = OUTER_R0 + 56; // 164

function buildPartition(year: Year): RNode {
  const root = d3
    .hierarchy<HierarchyData>(getHierarchicalData(year))
    .sum((d) => d.value ?? 0);
  return d3.partition<HierarchyData>().size([2 * Math.PI, 1])(root);
}

const arcInner = d3
  .arc<Angles>()
  .startAngle((d) => d.x0)
  .endAngle((d) => d.x1)
  .padAngle(0.012)
  .padRadius(INNER_R1)
  .innerRadius(INNER_R0)
  .outerRadius(INNER_R1);

const arcOuter = d3
  .arc<Angles>()
  .startAngle((d) => d.x0)
  .endAngle((d) => d.x1)
  .padAngle(0.008)
  .padRadius(OUTER_R1)
  .innerRadius(OUTER_R0)
  .outerRadius(OUTER_R1);

/* ============================================================
   4. NARASI — ditulis berbasis data aktual, bergaya deskripsi
   peneliti: klaim -> angka -> interpretasi singkat.
   ============================================================ */
type StepMeta = { year: Year; sektor: Sektor };

const STEPS: { meta: StepMeta; title: string; content: ReactNode }[] = [
  {
    meta: { year: 2016, sektor: "Primer" },
    title: "Sektor Primer, 2016",
    content: (
      <p>
        Pada 2016, sektor Primer — gabungan Pertanian, Kehutanan, Perikanan
        serta Pertambangan dan Penggalian — menyumbang{" "}
        <Hl sektor="Primer" year={2016}>
          17,66%
        </Hl>{" "}
        terhadap PDRB Jawa Tengah. Hampir seluruhnya berasal dari subsektor
        Pertanian yang sendirian mencatat{" "}
        <Hl sektor="Primer" year={2016}>
          15,13%
        </Hl>
        , jauh melampaui Pertambangan dan Penggalian yang hanya menyumbang
        2,53%.
      </p>
    ),
  },
  {
    meta: { year: 2016, sektor: "Sekunder" },
    title: "Sekunder, Kontributor Terbesar 2016",
    content: (
      <p>
        Sektor Sekunder — Industri Pengolahan, Konstruksi, serta Pengadaan
        Listrik/Air — menjadi kontributor terbesar pada 2016 dengan porsi{" "}
        <Hl sektor="Sekunder" year={2016}>
          45,13%
        </Hl>
        . Industri Pengolahan sendiri menyumbang 34,69%, atau lebih dari tiga
        perempat total sektor ini, menegaskan posisinya sebagai tulang punggung
        perekonomian provinsi.
      </p>
    ),
  },
  {
    meta: { year: 2016, sektor: "Tersier" },
    title: "Melengkapi Struktur 2016",
    content: (
      <p>
        Sektor Tersier menutup struktur ekonomi 2016 dengan kontribusi{" "}
        <Hl sektor="Tersier" year={2016}>
          37,21%
        </Hl>
        , terutama ditopang Perdagangan Besar dan Eceran (13,48%) serta Jasa
        Pendidikan (4,27%). Dengan demikian, PDRB Jawa Tengah pada 2016
        terbentuk dari{" "}
        <Hl sektor="Primer" year={2016}>
          17,66%
        </Hl>{" "}
        Primer,{" "}
        <Hl sektor="Sekunder" year={2016}>
          45,13%
        </Hl>{" "}
        Sekunder, dan{" "}
        <Hl sektor="Tersier" year={2016}>
          37,21%
        </Hl>{" "}
        Tersier.
      </p>
    ),
  },
  {
    meta: { year: 2025, sektor: "Primer" },
    title: "Sektor Primer Menyusut",
    content: (
      <p>
        Sembilan tahun kemudian, porsi sektor Primer menyusut menjadi{" "}
        <Hl sektor="Primer" year={2025}>
          15,16%
        </Hl>{" "}
        pada 2025 — turun 2,5 poin persentase dari 17,66% di 2016. Penyusutan
        ini terutama didorong subsektor Pertanian yang porsinya turun dari
        15,13% menjadi 13,07%, sejalan dengan alih fungsi lahan dan pergeseran
        tenaga kerja ke sektor nonpertanian.
      </p>
    ),
  },
  {
    meta: { year: 2025, sektor: "Sekunder" },
    title: "Sekunder Tetap Menjadi Fondasi",
    content: (
      <p>
        Sektor Sekunder relatif stabil di angka{" "}
        <Hl sektor="Sekunder" year={2025}>
          45,01%
        </Hl>{" "}
        pada 2025, nyaris sama dengan 45,13% pada 2016. Namun di baliknya
        terjadi pergeseran komposisi: porsi Industri Pengolahan melandai dari
        34,69% menjadi 33,39%, sementara Konstruksi naik dari 10,29% menjadi
        11,47% — didorong pembangunan infrastruktur jalan tol dan properti.
      </p>
    ),
  },
  {
    meta: { year: 2025, sektor: "Tersier" },
    title: "Tersier Tumbuh Paling Pesat",
    content: (
      <>
        <p>
          Sektor Tersier tumbuh paling signifikan, dari 37,21% pada 2016 menjadi{" "}
          <Hl sektor="Tersier" year={2025}>
            39,86%
          </Hl>{" "}
          pada 2025. Pendorong utamanya adalah Informasi dan Komunikasi,
          melonjak dari 3,04% menjadi 4,29%, serta Transportasi dan Pergudangan
          yang naik dari 3,11% menjadi 4,13% — mencerminkan akselerasi
          digitalisasi dan mobilitas logistik pascapandemi.
        </p>
        <p>
          Transformasi struktural Jawa Tengah 2016–2025 menunjukkan pola yang
          konsisten: sektor Primer mengecil, Tersier membesar, sementara
          Sekunder tetap menjadi fondasi utama yang stabil.
        </p>
      </>
    ),
  },
];

const STEP_ORDER: StepMeta[] = STEPS.map((s) => s.meta);

/* ============================================================
   5. Panel statistik (pola "Gardena / Fremont")
   ============================================================ */
function SidePanel({
  year,
  activeMeta,
  align,
}: {
  year: Year;
  activeMeta: StepMeta | null;
  align: "left" | "right";
}) {
  return (
    <div className={`side-panel side-panel-${align}`}>
      <div className="side-panel-year">{year}</div>
      {SEKTOR_ORDER.map((sektor) => {
        const orderIdx = STEP_ORDER.findIndex(
          (m) => m.year === year && m.sektor === sektor,
        );
        const activeIdx = activeMeta
          ? STEP_ORDER.findIndex(
              (m) =>
                m.year === activeMeta.year && m.sektor === activeMeta.sektor,
            )
          : -1;
        const isActive =
          activeMeta?.year === year && activeMeta?.sektor === sektor;
        const isRevealed = activeIdx >= orderIdx;
        const c = PALETTE[sektor];
        return (
          <div
            key={sektor}
            className="side-panel-row"
            style={{ opacity: isActive ? 1 : isRevealed ? 0.7 : 0.3 }}
          >
            <span
              className="side-panel-value"
              style={{ color: isActive ? c.text : undefined }}
            >
              {fmt(SEKTOR_VALUE[year][sektor])}%
              <span className="dot" style={{ backgroundColor: c.arc }} />
            </span>
            <span className="side-panel-label">
              Sektor {sektor}
              <br />
              PDRB {year}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   6. Hover payload — dipakai untuk caption di bawah donat
   ============================================================ */
type HoverInfo = {
  kind: "sektor" | "lapangan";
  key: string;
  name: string;
  value: number;
};

/* ============================================================
   7. SektorGroup — satu sektor (ring dalam) + anak-anaknya (ring
   luar), dianimasikan sebagai "sapuan sudut" DUA ARAH: begitu
   `revealed` menjadi true, progress dianimasikan menuju 1 (tumbuh
   dari 0 sampai penuh); begitu `revealed` menjadi false lagi
   (scroll balik ke atas), progress dianimasikan menuju 0 (mengempis
   balik sampai hilang) — bukan langsung di-unmount seperti
   sebelumnya, supaya scroll bolak-balik selalu mulus dan konsisten,
   termasuk setelah sempat pindah ke section lain lalu kembali lagi.
   ============================================================ */
function SektorGroup({
  year,
  sektor,
  sektorNode,
  revealed,
  hovered,
  onHover,
}: {
  year: Year;
  sektor: Sektor;
  sektorNode: RNode;
  revealed: boolean;
  hovered: HoverInfo | null;
  onHover: (info: HoverInfo | null) => void;
}) {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const target = revealed ? 1 : 0;
    const startVal = progressRef.current;
    if (startVal === target) return;
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = startVal + (target - startVal) * eased;
      progressRef.current = val;
      setProgress(val);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [revealed]);

  const children = (sektorNode.children ?? []) as RNode[];
  const shades = childShades(PALETTE[sektor].arc, children.length);
  const sweepFront = sektorNode.x0 + (sektorNode.x1 - sektorNode.x0) * progress;
  const showSektorArc = sweepFront > sektorNode.x0 + 0.0008;

  const sektorD = showSektorArc
    ? (arcInner({ x0: sektorNode.x0, x1: sweepFront }) ?? undefined)
    : undefined;
  const [scx, scy] = arcInner.centroid({
    x0: sektorNode.x0,
    x1: sektorNode.x1,
  });
  const showSektorLabel = progress > 0.45;
  const sektorIsHovered = hovered?.kind === "sektor" && hovered.key === sektor;

  return (
    <g>
      {showSektorArc && (
        <path
          d={sektorD}
          fill={PALETTE[sektor].arc}
          stroke="#1f2937"
          strokeWidth={1}
          className="wedge"
          style={{
            transform: sektorIsHovered ? "scale(1.045)" : "scale(1)",
            transformOrigin: "0px 0px",
          }}
          onMouseEnter={() =>
            onHover({
              kind: "sektor",
              key: sektor,
              name: sektor,
              value: SEKTOR_VALUE[year][sektor],
            })
          }
          onMouseLeave={() => onHover(null)}
        />
      )}
      <text
        x={scx}
        y={scy}
        textAnchor="middle"
        dominantBaseline="middle"
        className="sektor-label"
        style={{ opacity: showSektorLabel ? 1 : 0 }}
      >
        {sektor}
      </text>

      {children.map((child, i) => {
        const childEnd = Math.min(child.x1, sweepFront);
        if (childEnd <= child.x0 + 0.0008) return null;
        const d = arcOuter({ x0: child.x0, x1: childEnd }) ?? undefined;
        const code = child.data.code ?? child.data.name;
        const childIsHovered =
          hovered?.kind === "lapangan" && hovered.key === code;
        return (
          <path
            key={code}
            d={d}
            fill={shades[i]}
            stroke="#1f2937"
            strokeWidth={0.6}
            className="wedge"
            style={{
              transform: childIsHovered ? "scale(1.045)" : "scale(1)",
              transformOrigin: "0px 0px",
            }}
            onMouseEnter={() =>
              onHover({
                kind: "lapangan",
                key: code,
                name: child.data.name,
                value: child.value ?? 0,
              })
            }
            onMouseLeave={() => onHover(null)}
          />
        );
      })}
    </g>
  );
}

/* ============================================================
   8. SunburstDonut — satu donat 2-lapis penuh untuk satu tahun.
   ============================================================ */
function SunburstDonut({
  year,
  activeStep,
}: {
  year: Year;
  activeStep: number;
}) {
  const root = useMemo(() => buildPartition(year), [year]);
  const sektorNodes = (root.children ?? []) as RNode[];
  const [hovered, setHovered] = useState<HoverInfo | null>(null);

  const isRevealed = (sektor: Sektor) => {
    const orderIdx = STEP_ORDER.findIndex(
      (m) => m.year === year && m.sektor === sektor,
    );
    return activeStep >= orderIdx;
  };

  return (
    <div className="sunburst-donut">
      <svg viewBox="-210 -210 420 420">
        {sektorNodes.map((node) => {
          const sektor = node.data.name as Sektor;
          return (
            <SektorGroup
              key={sektor}
              year={year}
              sektor={sektor}
              sektorNode={node}
              revealed={isRevealed(sektor)}
              hovered={hovered}
              onHover={setHovered}
            />
          );
        })}
      </svg>
      <div className="hover-caption">
        {hovered ? (
          <>
            <strong>{hovered.name}</strong> · {fmt(hovered.value)}%
          </>
        ) : (
          <span className="hover-caption-placeholder">
            Arahkan kursor ke bagian diagram
          </span>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   9. Komponen utama — deteksi langkah aktif memakai
   IntersectionObserver (pola sama seperti Indeks Williamson).
   ============================================================ */
export default function StrukturEkonomiSunburst() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const container = sectionRef.current;
    if (!container) return;
    const cards = container.querySelectorAll("[data-step]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const step = parseInt(
            (entry.target as HTMLElement).dataset.step || "0",
            10,
          );
          if (entry.isIntersecting) {
            setActiveStep(step);
          } else if (step === 0 && entry.boundingClientRect.top > 0) {
            setActiveStep(-1);
          }
        });
      },
      { threshold: 0.5 },
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  const activeMeta = activeStep >= 0 ? STEP_ORDER[activeStep] : null;

  return (
    <section ref={sectionRef} className="struktur-gauge-section">
      {/* SISI ATAS: visual sticky — dua donat berdampingan (2016 & 2025) */}
      <div className="visual-container">
        <div className="stage-header">
          <h2 className="font-bungee color-pink">
            Struktur Ekonomi{" "}
            <span className="font-bungee color-green">Jawa Tengah</span>
          </h2>
          <p className="meta-info">
            Komposisi PDRB menurut sektor &amp; lapangan usaha · ring dalam = 3
            sektor, ring luar = 17 lapangan usaha
          </p>
        </div>

        <div className="legend-row">
          {SEKTOR_ORDER.map((sektor) => (
            <div key={sektor} className="legend-group">
              <span
                className="legend-swatch"
                style={{ backgroundColor: PALETTE[sektor].arc }}
              />
              <span className="legend-label">{sektor}</span>
            </div>
          ))}
        </div>

        <div className="dual-donut-row">
          <SidePanel year={2016} activeMeta={activeMeta} align="left" />

          <div className="gauge-chart">
            <div className="donut-year-label">2016</div>
            <SunburstDonut year={2016} activeStep={activeStep} />
          </div>

          <div className="gauge-chart">
            <div className="donut-year-label">2025</div>
            <SunburstDonut year={2025} activeStep={activeStep} />
          </div>

          <SidePanel year={2025} activeMeta={activeMeta} align="right" />
        </div>
      </div>

      {/* SISI BAWAH: narrative track — overlap di atas visual sticky,
          scroll alami (bukan absolute-pinned), persis pola Williamson */}
      <div className="narrative-track">
        {STEPS.map((step, idx) => (
          <div
            key={idx}
            data-step={idx}
            className={`step-card${activeStep === idx ? " is-active" : ""}${
              idx === STEPS.length - 1 ? " step-card-last" : ""
            }`}
          >
            <h3>{step.title}</h3>
            <div className="narrative-body">{step.content}</div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .struktur-gauge-section {
          position: relative;
          background-color: #ffffff;
        }

        .struktur-gauge-section .visual-container {
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 2rem 1.5rem;
          background: #ffffff;
        }

        .struktur-gauge-section .stage-header {
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .struktur-gauge-section .stage-header h2 {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
        }
        .struktur-gauge-section .meta-info {
          font-size: 13px;
          color: #9ca3af;
          font-weight: 500;
          margin-top: 4px;
          font-family: "Jost", var(--font-sans), sans-serif;
          max-width: 560px;
        }

        .struktur-gauge-section .legend-row {
          display: flex;
          gap: 1.75rem;
          margin: 0.75rem 0 1rem;
          font-family: "Jost", var(--font-sans), sans-serif;
        }
        .struktur-gauge-section .legend-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .struktur-gauge-section .legend-label {
          font-size: 12px;
          font-weight: 700;
          color: #374151;
          margin-right: 2px;
        }
        .struktur-gauge-section .legend-swatch {
          width: 12px;
          height: 12px;
          border-radius: 3px;
          display: inline-block;
        }

        .struktur-gauge-section .dual-donut-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2.5rem;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          flex-wrap: nowrap;
        }

        .struktur-gauge-section .gauge-chart {
          width: 100%;
          max-width: 380px;
          flex-shrink: 0;
          text-align: center;
        }
        .struktur-gauge-section .sunburst-donut svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }
        .struktur-gauge-section .donut-year-label {
          font-family: "Jost", var(--font-sans), sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #9ca3af;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .struktur-gauge-section .wedge {
          cursor: pointer;
          transition: transform 200ms ease;
        }
        .struktur-gauge-section .sektor-label {
          font-family: "Jost", var(--font-sans), sans-serif;
          font-size: 12px;
          font-weight: 700;
          fill: #1f2937;
          pointer-events: none;
          transition: opacity 300ms ease;
        }
        .struktur-gauge-section .hover-caption {
          margin-top: 8px;
          min-height: 18px;
          font-family: "Jost", var(--font-sans), sans-serif;
          font-size: 12.5px;
          color: #374151;
        }
        .struktur-gauge-section .hover-caption-placeholder {
          color: #d1d5db;
          font-style: italic;
        }

        .struktur-gauge-section .side-panel {
          width: 148px;
          flex-shrink: 0;
          font-family: "Jost", var(--font-sans), sans-serif;
        }
        .struktur-gauge-section .side-panel-right {
          text-align: right;
        }
        .struktur-gauge-section .side-panel-year {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: #111827;
          margin-bottom: 10px;
        }
        .struktur-gauge-section .side-panel-row {
          margin-bottom: 14px;
          transition: opacity 0.4s ease;
        }
        .struktur-gauge-section .side-panel-value {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 15px;
          font-weight: 700;
          color: #111827;
        }
        .struktur-gauge-section .side-panel-right .side-panel-value {
          flex-direction: row-reverse;
        }
        .struktur-gauge-section .side-panel-value .dot {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          display: inline-block;
        }
        .struktur-gauge-section .side-panel-label {
          display: block;
          font-size: 11px;
          line-height: 1.4;
          color: #9ca3af;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        /* ============================================================
           NARRATIVE TRACK — pola sama seperti Indeks Williamson: konten
           mengalir normal (bukan absolute), ditarik ke atas dengan
           margin-top:-100vh supaya menimpa visual sticky, lalu discroll
           natural sesuai tinggi layar.
           padding-top >= 100vh: supaya saat baru masuk section ini,
           kartu narasi BELUM terlihat sama sekali.
           padding-bottom (bukan margin) dipakai untuk jeda setelah
           narasi terakhir supaya tidak collapse.
           ============================================================ */
        .struktur-gauge-section .narrative-track {
          position: relative;
          z-index: 2;
          margin-top: -100vh;
          padding: 108vh 1.5rem 130vh;
          pointer-events: none;
        }

        .struktur-gauge-section .step-card {
          pointer-events: auto;
          max-width: 480px;
          margin: 0 auto 70vh;
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.75rem 2rem;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          transition: all 0.35s ease;
          opacity: 0.25;
          transform: translateY(15px);
          font-family: "Jost", var(--font-sans), sans-serif;
        }
        .struktur-gauge-section .step-card-last {
          margin-bottom: 0;
        }
        .struktur-gauge-section .step-card.is-active {
          opacity: 1;
          transform: translateY(0);
          border-color: #cbd5e1;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
        }
        .struktur-gauge-section .step-card h3 {
          font-size: 15px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .struktur-gauge-section .narrative-body p {
          font-size: 1.05rem;
          line-height: 1.75;
          color: #374151;
          margin-bottom: 0.85rem;
        }
        .struktur-gauge-section .narrative-body p:last-child {
          margin-bottom: 0;
        }
        .struktur-gauge-section .hl-num {
          display: inline-block;
          padding: 0.1em 0.4em;
          border-radius: 4px;
          font-weight: 700;
        }

        @media (max-width: 1000px) {
          .struktur-gauge-section .dual-donut-row {
            flex-direction: column;
            gap: 2rem;
          }
          .struktur-gauge-section .side-panel {
            display: none;
          }
          .struktur-gauge-section .gauge-chart {
            max-width: 300px;
          }
          .struktur-gauge-section .legend-row {
            flex-wrap: wrap;
            justify-content: center;
            row-gap: 6px;
          }
          .struktur-gauge-section .narrative-track {
            padding: 108vh 1rem 100vh;
          }
          .struktur-gauge-section .step-card {
            padding: 1.25rem 1.4rem;
            margin-bottom: 55vh;
          }
          .struktur-gauge-section .step-card-last {
            margin-bottom: 0;
          }
        }
      `}</style>
    </section>
  );
}
