"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { Feature, Geometry } from "geojson";
import {
  bonetMap,
  idToNameMap,
  getBonetColor,
  bonetLegendSwatches,
  BONET_START_YEAR,
  BONET_END_YEAR,
  type BonetEntry,
} from "@/data/bonet";

const WIDTH = 800;
const HEIGHT = 480;

type Kab = Feature<Geometry>;

function regionOf(f: Kab): BonetEntry | undefined {
  const name = idToNameMap[String(f.id)];
  return name ? bonetMap.get(name.toLowerCase().trim()) : undefined;
}

/* ============================================================
   Konfigurasi per step — menggantikan rantai if/else imperatif
   ============================================================ */
type FillMode = "base" | "year";

interface StepConfig {
  badge: string;
  /** Tahun yang dipaksa saat step aktif; undefined = biarkan pilihan user */
  year?: number;
  /** Sumber warna; undefined = pertahankan mode sebelumnya */
  fill?: FillMode;
  /** Wilayah yang di-highlight; sisanya diredupkan */
  focusIds?: string[];
  focusClass?: "highlight-top" | "highlight-low";
}

const stepConfig: Record<number, StepConfig> = {
  1: { badge: "Basis 2016–2019", year: 2019, fill: "base" },
  2: {
    badge: "Kutub: IB Tertinggi",
    focusIds: ["33-19", "33-74", "33-72"],
    focusClass: "highlight-top",
  },
  3: {
    badge: "Stagnansi: Pemalang & Grobogan",
    focusIds: ["33-27", "33-15"],
    focusClass: "highlight-low",
  },
  4: {
    badge: "Pascapandemi (2025)",
    year: 2025,
    fill: "year",
    focusIds: ["33-01", "33-74"],
    focusClass: "highlight-top",
  },
  5: { badge: "Eksplorasi Bebas (2025)", year: 2025, fill: "year" },
};

const steps: { id: number; content: ReactNode }[] = [
  {
    id: 1,
    content: (
      <>
        <h3 className="bonet-card-title">
          Ketimpangan Antarwilayah di Jawa Tengah
        </h3>
        <p className="bonet-card-text">
          <strong>Indeks Bonet</strong> mengukur deviasi absolut PDRB per kapita
          kabupaten/kota terhadap rata-rata provinsi. Nilai mendekati nol
          mencerminkan tingkat PDRB per kapita yang relatif merata dengan rata-rata Jawa Tengah.
        </p>
        <p className="bonet-card-text">
          Pada periode sebelum pandemi (2016–2019), mayoritas kabupaten
          mencatatkan deviasi moderat di bawah 0,50, sementara segelintir pusat
          industri dan perkotaan berada jauh melampaui rata-rata provinsi. Hal
          ini menunjukkan bahwa konsentrasi nilai tambah regional masih terpusat
          pada kawasan aglomerasi tertentu.
        </p>
      </>
    ),
  },
  {
    id: 2,
    content: (
      <>
        <p className="bonet-card-text">
          <span className="bonet-hl hl-magenta">Kabupaten Kudus</span> (indeks
          di atas 2,00),{" "}
          <span className="bonet-hl hl-magenta">Kota Semarang</span>, dan{" "}
          <span className="bonet-hl hl-magenta">Kota Surakarta</span>
          tercatat memiliki deviasi PDRB per kapita positif tertinggi terhadap rata-rata Provinsi Jawa Tengah.
          .
        </p>
        <p className="bonet-card-text">
          Secara deskriptif, tingginya deviasi PDRB per kapita di Kudus erat kaitannya dengan konsentrasi industri pengolahan, 
          sementara di Kota Semarang dan Surakarta didorong oleh dominasi sektor perdagangan dan jasa.
        </p>
      </>
    ),
  },
  {
    id: 3,
    content: (
      <>
        <p className="bonet-card-text">
          Fenomena menarik tampak pada konsistensi wilayah seperti{" "}
          <span className="bonet-hl hl-magenta">Kabupaten Pemalang</span> dan{" "}
          <span className="bonet-hl hl-magenta">Grobogan</span>. Selama hampir
          satu dekade, angka deviasi absolut kedua daerah ini tidak beranjak
          jauh, secara konstan tertahan pada kisaran{" "}
          <strong>0,48 hingga 0,52</strong>.
        </p>
        <p className="bonet-card-text">
          Nilai yang relatif tetap menunjukkan bahwa pertumbuhan ekonomi
          daerah-daerah tersebut cenderung mengikuti rata-rata provinsi.
          Akibatnya, posisi mereka dalam perekonomian provinsi tidak banyak
          berubah.
        </p>
      </>
    ),
  },
  {
    id: 4,
    content: (
      <>
        <h3 className="bonet-card-title">Pergeseran Pascapandemi</h3>
        <p className="bonet-card-text">
          Perubahan ekonomi pada 2020 diikuti oleh perubahan tingkat ketimpangan
          antarwilayah. Indeks{" "}
          <span className="bonet-hl hl-orange">Kabupaten Cilacap</span> menurun
          dari 0,819 pada 2016 menjadi 0,372 pada 2025.
        </p>
        <p className="bonet-card-text">
          Penurunan ini menunjukkan bahwa tingkat PDRB per kapita Cilacap bergerak semakin mendekati rata-rata provinsi, 
          yang mengindikasikan adanya konvergensi ekonomi wilayah dalam kurun waktu tersebut.
        </p>
        <p className="bonet-card-text">
          Sebaliknya, indeks{" "}
          <span className="bonet-hl hl-magenta">Kota Semarang</span> meningkat
          hingga 2,290 pada 2025. Hal ini menunjukkan bahwa kondisi ekonomi Kota
          Semarang semakin berbeda dari rata-rata wilayah lain di Jawa Tengah.
        </p>
      </>
    ),
  },
  {
    id: 5,
    content: (
      <>
        <p className="bonet-card-text">
          Indeks Bonet memperlihatkan posisi ketimpangan output per kapita
          antarwilayah, tetapi belum menjawab bagaimana kapasitas tersebut
          bergerak: apakah daerah berpendapatan rendah sedang mengejar
          ketertinggalannya, atau justru kian tertinggal?
        </p>
        <p className="bonet-card-text">
          Untuk melihat lintasan pertumbuhan dan pergeseran struktur ekonomi
          daerah, evaluasi dilanjutkan melalui analisis Tipologi
          Klassen.
        </p>
      </>
    ),
  },
];

export default function IndeksBonet() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [activeStep, setActiveStep] = useState(1);
  const [year, setYear] = useState(2019);
  const [fillMode, setFillMode] = useState<FillMode>("base");
  const [badge, setBadge] = useState("Basis 2016–2019");
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    item: BonetEntry;
  } | null>(null);

  // Dibaca di dalam callback D3 yang tidak ikut re-render
  const yearRef = useRef(year);
  yearRef.current = year;

  const selRef = useRef<{
    districts: d3.Selection<SVGPathElement, Kab, SVGGElement, unknown>;
    labels: d3.Selection<SVGTextElement, Kab, SVGGElement, unknown>;
  } | null>(null);

  /* ---------- 1. Muat TopoJSON & render peta ---------- */
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    let cancelled = false;
    const svg = d3
      .select(svgEl)
      .attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const gMap = svg.append("g").attr("class", "bonet-map-group");
    const gLabels = svg.append("g").attr("class", "bonet-labels-group");

    const projection = d3.geoMercator();
    const pathGenerator = d3.geoPath().projection(projection);

    d3.json("/jawatengah.json")
      .then((topology) => {
        if (cancelled || !topology) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const topo = topology as any;
        const objKey = Object.keys(topo.objects)[0];
        const all = (
          topojson.feature(topo, topo.objects[objKey]) as unknown as {
            features: Kab[];
          }
        ).features;

        // Buang fitur non-wilayah (waduk/hutan) yang tidak punya id resmi
        const features = all.filter((f) => idToNameMap[String(f.id)]);

        projection.fitSize([WIDTH, HEIGHT], {
          type: "FeatureCollection",
          features,
        });

        const districts = gMap
          .selectAll<SVGPathElement, Kab>("path")
          .data(features)
          .enter()
          .append("path")
          .attr("class", "bonet-district")
          .attr("d", (d) => pathGenerator(d))
          .attr("fill", (d) => {
            const item = regionOf(d);
            return item ? getBonetColor(item.baseAvg) : "#d6d6d6";
          })
          .on("mousemove", function (event: MouseEvent, d) {
            const item = regionOf(d);
            if (!item) return;
            const [mX, mY] = d3.pointer(event, canvasRef.current);
            setTooltip({ x: mX + 16, y: mY - 20, item });
          })
          .on("mouseleave", () => setTooltip(null));

        const labels = gLabels
          .selectAll<SVGTextElement, Kab>("text")
          .data(features)
          .enter()
          .append("text")
          .attr("class", "bonet-map-label")
          .attr("x", (d) => {
            const c = pathGenerator.centroid(d);
            return isNaN(c[0]) ? 0 : c[0];
          })
          .attr("y", (d) => {
            const c = pathGenerator.centroid(d);
            return isNaN(c[1]) ? 0 : c[1];
          })
          .attr("text-anchor", "middle")
          .attr("opacity", 0);

        selRef.current = { districts, labels };
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
      svg.selectAll("*").remove();
      selRef.current = null;
    };
  }, []);

  /* ---------- 2. Step → tahun, mode warna, badge ---------- */
  useEffect(() => {
    const cfg = stepConfig[activeStep];
    if (!cfg) return;
    setBadge(cfg.badge);
    if (cfg.year !== undefined) setYear(cfg.year);
    if (cfg.fill !== undefined) setFillMode(cfg.fill);
  }, [activeStep]);

  /* ---------- 3. Warna peta mengikuti tahun / mode ---------- */
  useEffect(() => {
    const sel = selRef.current;
    if (!ready || !sel) return;

    const idx = year - BONET_START_YEAR;
    sel.districts
      .transition()
      .duration(300)
      .attr("fill", (d) => {
        const item = regionOf(d);
        if (!item) return "#d6d6d6";
        return getBonetColor(
          fillMode === "base" ? item.baseAvg : item.values[idx],
        );
      });
  }, [ready, year, fillMode]);

  /* ---------- 4. Highlight & label per step ---------- */
  useEffect(() => {
    const sel = selRef.current;
    if (!ready || !sel) return;

    const { districts, labels } = sel;
    districts
      .classed("highlight-top", false)
      .classed("highlight-low", false)
      .classed("dimmed", false);
    labels.attr("opacity", 0);

    const cfg = stepConfig[activeStep];
    if (!cfg?.focusIds) return;

    const focus = cfg.focusIds;
    const idx = year - BONET_START_YEAR;

    districts.each(function (d) {
      const el = d3.select(this);
      if (focus.includes(String(d.id))) {
        el.classed(cfg.focusClass!, true);
      } else {
        el.classed("dimmed", true);
      }
    });

    labels
      .filter((d) => focus.includes(String(d.id)))
      .text((d) => {
        const item = regionOf(d);
        return item ? `${item.rawName}: ${item.values[idx].toFixed(3)}` : "";
      })
      .transition()
      .duration(300)
      .attr("opacity", 1);
  }, [ready, activeStep, year]);

  /* ---------- 5. Observer kartu narasi ---------- */
  useEffect(() => {
    const container = sectionRef.current;
    if (!container) return;

    const cards = container.querySelectorAll("[data-step]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(
              parseInt((entry.target as HTMLElement).dataset.step || "1", 10),
            );
          }
        });
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0.1 },
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const yr = parseInt(e.target.value, 10);
    setYear(yr);
    setFillMode("year");
    setBadge(`Observasi: ${yr}`);
  };

  return (
    <section ref={sectionRef} className="bonet-section">
      {/* KIRI: sticky visual */}
      <div className="bonet-sticky-col">
        <div className="bonet-visual-wrapper">
          <div className="bonet-legend-container">
            <div className="font-bungee color-pink bonet-legend-title">
              Indeks Bonet <p className="font-bungee color-green">(Nilai Absolut)</p>
            </div>
            <div className="bonet-legend-bar-wrap">
              <div className="bonet-legend-bar">
                {bonetLegendSwatches.map((s) => (
                  <span
                    key={s.color}
                    className="legend-swatch"
                    style={{ background: s.color }}
                    title={s.title}
                  />
                ))}
              </div>
              <div className="bonet-legend-labels">
                <span>← KETIMPANGAN RENDAH (MENDEKATI RATA-RATA)</span>
                <span>KETIMPANGAN SEMAKIN TINGGI (EKSTREM) →</span>
              </div>
            </div>
          </div>

          <div ref={canvasRef} className="bonet-map-canvas">
            <svg ref={svgRef} className="bonet-svg" />
            {loadError && (
              <p className="bonet-error">
                Gagal memuat <code>/jawatengah.json</code>. Pastikan berkas ada
                di folder <code>public/</code>.
              </p>
            )}
            {tooltip && (
              <div
                className="bonet-tooltip"
                style={{ left: tooltip.x, top: tooltip.y }}
              >
                <div className="bonet-tooltip-title">
                  {tooltip.item.rawName}
                </div>
                <div>
                  <strong>Tahun {year}:</strong>{" "}
                  {tooltip.item.values[year - BONET_START_YEAR].toFixed(3)}
                </div>
                <div>
                  <strong>Rata-rata 16–19:</strong>{" "}
                  {tooltip.item.baseAvg.toFixed(3)}
                </div>
                <div>
                  <strong>Rata-rata 21–25:</strong>{" "}
                  {tooltip.item.postAvg.toFixed(3)}
                </div>
              </div>
            )}
          </div>

          <div className="bonet-controls">
            <span className="bonet-year-badge">{badge}</span>
            <div className="bonet-slider-container">
              <label htmlFor="bonet-year-slider">Tahun Observasi:</label>
              <input
                id="bonet-year-slider"
                type="range"
                min={BONET_START_YEAR}
                max={BONET_END_YEAR}
                step={1}
                value={year}
                onChange={handleSlider}
              />
              <span className="bonet-slider-val">{year}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KANAN: narrative track */}
      <div className="bonet-narrative-track">
        {steps.map((s) => (
          <div
            key={s.id}
            data-step={s.id}
            className={`bonet-step${activeStep === s.id ? " active" : ""}`}
          >
            <div className="bonet-card">{s.content}</div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .bonet-section {
          position: relative;
          width: 100%;
          box-sizing: border-box;
  
          color: #333333;
          display: flex;
          flex-direction: row;
          font-family: "Jost", var(--font-sans), sans-serif;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }
        .bonet-section * {
          box-sizing: border-box;
        }

        .bonet-section .bonet-sticky-col {
          width: 60%;
          height: 100vh;
          position: sticky;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          padding: 1.5rem;
          overflow: hidden;
        }

        .bonet-section .bonet-visual-wrapper {
          width: 100%;
          height: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* Legenda */
        .bonet-section .bonet-legend-container {
          width: 100%;
          padding: 0.5rem 0;
          margin-bottom: 0.5rem;
        }
        .bonet-section .bonet-legend-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #111111;
          letter-spacing: 0.02em;
          margin-bottom: 0.75rem;
        }
        .bonet-section .bonet-legend-bar-wrap {
          width: 100%;
        }
        .bonet-section .bonet-legend-bar {
          display: flex;
          height: 10px;
          width: 100%;
          border-radius: 1px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        .bonet-section .legend-swatch {
          flex: 1;
          height: 100%;
        }
        .bonet-section .bonet-legend-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #666666;
          margin-top: 6px;
          font-weight: 400;
        }

        /* Kanvas peta */
        .bonet-section .bonet-map-canvas {
          width: 100%;
          flex-grow: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 0;
        }
        .bonet-section .bonet-svg {
          width: 100%;
          height: 100%;
        }
        .bonet-section .bonet-error {
          position: absolute;
          font-size: 0.85rem;
          color: #b91c1c;
          text-align: center;
          max-width: 320px;
        }

        .bonet-section .bonet-district {
          cursor: pointer;
          stroke: rgba(255, 255, 255, 0.85);
          stroke-width: 0.8px;
          stroke-linejoin: round;
          transition:
            fill 0.35s ease,
            opacity 0.35s ease,
            stroke 0.2s ease;
        }
        .bonet-section .bonet-district:hover {
          stroke: #111111;
          stroke-width: 2px;
        }
        .bonet-section .bonet-district.highlight-top {
          stroke: #1b6934 !important;
          stroke-width: 2.2px !important;
        }
        .bonet-section .bonet-district.highlight-low {
          stroke: #ad2b7d !important;
          stroke-width: 2.2px !important;
        }
        .bonet-section .bonet-district.dimmed {
          opacity: 0.2 !important;
        }

        .bonet-section .bonet-map-label {
          pointer-events: none;
          font-size: 11px;
          font-weight: 700;
          fill: #111111;
          text-shadow:
            0 1px 2px #fff,
            0 -1px 2px #fff,
            1px 0 2px #fff,
            -1px 0 2px #fff;
        }

        /* Tooltip */
        .bonet-section .bonet-tooltip {
          position: absolute;
          pointer-events: none;
          background: #ffffff;
          border: 1px solid #cccccc;
          padding: 0.5rem 0.75rem;
          border-radius: 2px;
          font-size: 0.78rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          z-index: 50;
          color: #333333;
          line-height: 1.45;
        }
        .bonet-section .bonet-tooltip-title {
          font-weight: 700;
          color: #111111;
          margin-bottom: 0.25rem;
          border-bottom: 1px solid #eeeeee;
          padding-bottom: 0.2rem;
        }

        /* Kontrol slider */
        .bonet-section .bonet-controls {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .bonet-section .bonet-year-badge {
          background: #333333;
          color: #ffffff;
          padding: 0.2rem 0.5rem;
          border-radius: 2px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .bonet-section .bonet-slider-container {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.78rem;
          color: #555555;
        }
        .bonet-section .bonet-slider-container input[type="range"] {
          cursor: pointer;
        }
        .bonet-section .bonet-slider-val {
          font-weight: 700;
          color: #111111;
          min-width: 32px;
        }

        /* KANAN: narasi */
        .bonet-section .bonet-narrative-track {
          width: 40%;
          position: relative;
          z-index: 2;
          padding: 15vh 2.5rem 25vh 2rem;
        }
        .bonet-section .bonet-step {
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.25;
          transition: opacity 0.35s ease;
        }
        .bonet-section .bonet-step.active {
          opacity: 1;
        }
        .bonet-section .bonet-card {
          background: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 2px;
          padding: 2rem 1.75rem;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
        }
        .bonet-section .bonet-card-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #111111;
          margin: 0 0 1rem 0;
          line-height: 1.25;
        }
        .bonet-section .bonet-card-text {
          font-size: 0.95rem;
          line-height: 1.65;
          color: #333333;
          margin-bottom: 0.9rem;
        }
        .bonet-section .bonet-card-text:last-child {
          margin-bottom: 0;
        }

        .bonet-section .bonet-hl {
          padding: 0.1rem 0.35rem;
          border-radius: 2px;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .bonet-section .hl-green {
          background-color: #e2f0d9;
          color: #1b6934;
        }
        .bonet-section .hl-magenta {
          background-color: #f7e1ed;
          color: #ad2b7d;
        }
        .bonet-section .hl-orange {
          background-color: #fef0db;
          color: #b25e00;
        }

        @media (max-width: 860px) {
          .bonet-section {
            flex-direction: column;
          }
          .bonet-section .bonet-sticky-col {
            width: 100%;
            height: 48vh;
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #e0e0e0;
            z-index: 20;
          }
          .bonet-section .bonet-narrative-track {
            width: 100%;
            padding: 2rem 1.25rem 15vh 1.25rem;
          }
          .bonet-section .bonet-step {
            min-height: 65vh;
          }
          .bonet-section .bonet-card {
            padding: 1.35rem 1.25rem;
          }
        }
      `}</style>
    </section>
  );
}