"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { Feature, Geometry } from "geojson";
import {
  klassenData,
  refThresholds,
  quadColors,
  quadLabels,
  type KlassenItem,
  type Quadrant,
} from "@/data/klassen";

/* ---------- Geometri ---------- */
const S_WIDTH = 560;
const S_HEIGHT = 310;
const S_MARGIN = { top: 20, right: 30, bottom: 40, left: 45 };
const INNER_W = S_WIDTH - S_MARGIN.left - S_MARGIN.right;
const INNER_H = S_HEIGHT - S_MARGIN.top - S_MARGIN.bottom;

const MINI_W = 240;
const MINI_H = 120;

const xScale = d3.scaleLinear().domain([15, 150]).range([0, INNER_W]);
const yScale = d3.scaleLinear().domain([0.5, 7.2]).range([INNER_H, 0]);

type Kab = Feature<Geometry>;

/* ---------- Konfigurasi step ---------- */
const FOCUS_IDS_STEP8 = ["33-25", "33-24", "33-19", "33-01"];

const steps: { id: number; content: ReactNode }[] = [
  {
    id: 6,
    content: (
      <>
        <div className="klassen-card-tag">Struktur Awal (2016–2020)</div>
        <p className="klassen-card-text">
          Sebelum pandemi, sebagian besar kabupaten di Jawa Tengah, seperti{" "}
          <span className="badge-q2">Blora</span> (mencatatkan pertumbuhan
          tinggi hingga 6,68%),{" "}
          <span className="badge-q2">Purbalingga, dan Sragen</span>berada di{" "}
          <span className="badge-q2">Kuadran II: Berkembang Cepat</span>. Mereka
          mencatatkan laju pertumbuhan di atas rata-rata provinsi (3,70%)
          meskipun tingkat pendapatan per kapitanya masih di bawah rata-rata
          provinsi.
        </p>
      </>
    ),
  },
  {
    id: 7,
    content: (
      <>
        <div className="klassen-card-tag">
          Dinamika Pascapandemi (2021–2025)
        </div>
        <h3 className="klassen-card-title">
          Pergeseran &amp; Kerentanan Wilayah
        </h3>
        <p className="klassen-card-text">
          Periode pascapandemi memicu pergeseran konstelasi yang tajam seiring
          naiknya rata-rata PDRB provinsi menjadi Rp44,91 juta. Sejumlah daerah
          sukses naik kelas ke <span className="badge-q2">Kuadran II</span>,
          namun sebaliknya, <span className="badge-q1">Blora</span> justru
          bergeser turun dari <span className="badge-q2">Kuadran II</span> ke{" "}
          <span className="badge-q1">Kuadran IV: Relatif Tertinggal</span>{" "}
          akibat pelambatan laju pertumbuhan di bawah rata-rata.
        </p>
      </>
    ),
  },
  {
    id: 8,
    content: (
      <>
        <div className="klassen-card-tag">
          Koridor Industri &amp; Manufaktur
        </div>
        <p className="klassen-card-text">
          <strong>Kendal</strong> beradadi atas rata-rata provinsi berkat
          ekspansi kawasan industri. Sementara itu, <strong>Kudus</strong> dan{" "}
          <strong>Cilacap</strong> tetap kokoh berada di{" "}
          <span className="badge-q3">Kuadran III: Maju Tertekan</span> karena
          tingginya PDRB per kapita tidak diiringi oleh laju pertumbuhan
          ekonomi.
        </p>
      </>
    ),
  },
  {
    id: 9,
    content: (
      <>
        <p className="klassen-card-text">
          Struktur ekonomi antar-kabupaten/kota di Jawa Tengah menunjukkan
          variasi yang cukup beragam. Angka agregat di tingkat provinsi belum
          sepenuhnya mencerminkan sektor spesifik yang menjadi penggerak di
          setiap wilayah. Oleh karena itu, analisis Location Quotient (LQ)
          digunakan untuk menentukan kapasitas ekspor perekonomian daerah dan
          derajat self-sufficiency suatu lapangan usaha di masing-masing
          kabupaten/kota.
        </p>
      </>
    ),
  },
];

export default function TipologiKlassen() {
  const sectionRef = useRef<HTMLElement>(null);
  const scatterRef = useRef<SVGSVGElement>(null);
  const scatterWrapRef = useRef<HTMLDivElement>(null);
  const miniPreRef = useRef<SVGSVGElement>(null);
  const miniPostRef = useRef<SVGSVGElement>(null);

  const [activeStep, setActiveStep] = useState(6);
  const [ready, setReady] = useState(false);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    item: KlassenItem;
  } | null>(null);

  const selRef = useRef<{
    bubbles: d3.Selection<SVGCircleElement, KlassenItem, SVGGElement, unknown>;
    trailGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
    lineX: d3.Selection<SVGLineElement, unknown, null, undefined>;
    lineY: d3.Selection<SVGLineElement, unknown, null, undefined>;
    labelX: d3.Selection<SVGTextElement, unknown, null, undefined>;
    labelY: d3.Selection<SVGTextElement, unknown, null, undefined>;
  } | null>(null);

  /* ---------- 1. Bangun scatter plot ---------- */
  useEffect(() => {
    const el = scatterRef.current;
    if (!el) return;

    const svg = d3
      .select(el)
      .attr("viewBox", `0 0 ${S_WIDTH} ${S_HEIGHT}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg
      .append("g")
      .attr("transform", `translate(${S_MARGIN.left},${S_MARGIN.top})`);

    g.append("g")
      .attr("transform", `translate(0,${INNER_H})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(6)
          .tickFormat((d) => `Rp${d}jt`),
      );
    g.append("g").call(
      d3
        .axisLeft(yScale)
        .ticks(6)
        .tickFormat((d) => `${d}%`),
    );

    g.append("text")
      .attr("x", INNER_W / 2)
      .attr("y", INNER_H + 35)
      .attr("text-anchor", "middle")
      .attr("fill", "#4b5563")
      .attr("font-size", "9px")
      .attr("font-weight", "600")
      .text("PDRB per Kapita →");

    g.append("text")
      .attr("x", -15)
      .attr("y", -10)
      .attr("text-anchor", "start")
      .attr("fill", "#4b5563")
      .attr("font-size", "9px")
      .attr("font-weight", "600")
      .text("Pertumbuhan (%) ↑");

    const lineX = g.append("line").attr("class", "threshold-line");
    const lineY = g.append("line").attr("class", "threshold-line");
    const labelX = g.append("text").attr("class", "threshold-label");
    const labelY = g.append("text").attr("class", "threshold-label");
    const trailGroup = g.append("g").attr("class", "trail-group");

    const bubbles = g
      .append("g")
      .selectAll<SVGCircleElement, KlassenItem>(".scatter-bubble")
      .data(klassenData)
      .enter()
      .append("circle")
      .attr("class", "scatter-bubble")
      .attr("r", 4.5)
      .attr("cx", (d) => xScale(d.x1))
      .attr("cy", (d) => yScale(d.y1))
      .attr("fill", (d) => quadColors[d.q1])
      .on("mousemove", function (event: MouseEvent, d) {
        const [mX, mY] = d3.pointer(event, scatterWrapRef.current);
        setTooltip({ x: mX + 12, y: mY - 20, item: d });
      })
      .on("mouseleave", () => setTooltip(null));

    selRef.current = { bubbles, trailGroup, lineX, lineY, labelX, labelY };
    setReady(true);

    return () => {
      svg.selectAll("*").remove();
      selRef.current = null;
      setReady(false);
    };
  }, []);

  /* ---------- 2. Muat TopoJSON untuk dua mini-map ---------- */
  useEffect(() => {
    const preEl = miniPreRef.current;
    const postEl = miniPostRef.current;
    if (!preEl || !postEl) return;

    let cancelled = false;

    const svgPre = d3
      .select(preEl)
      .attr("viewBox", `0 0 ${MINI_W} ${MINI_H}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
    const svgPost = d3
      .select(postEl)
      .attr("viewBox", `0 0 ${MINI_W} ${MINI_H}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const projection = d3.geoMercator();
    const path = d3.geoPath().projection(projection);

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

        const features = all.filter((f) =>
          klassenData.some((k) => k.id === String(f.id)),
        );

        projection.fitSize([MINI_W, MINI_H], {
          type: "FeatureCollection",
          features,
        });

        const paint = (
          sel: d3.Selection<SVGSVGElement, unknown, null, undefined>,
          quad: (item: KlassenItem) => Quadrant,
        ) => {
          sel
            .selectAll<SVGPathElement, Kab>(".mini-district")
            .data(features)
            .enter()
            .append("path")
            .attr("class", "mini-district")
            .attr("d", (d) => path(d))
            .attr("fill", (d) => {
              const item = klassenData.find((k) => k.id === String(d.id));
              return item ? quadColors[quad(item)] : "#e5e7eb";
            });
        };

        paint(svgPre, (i) => i.q1);
        paint(svgPost, (i) => i.q2);
      })
      .catch(() => {
        /* peta mini opsional — scatter tetap berfungsi tanpa peta */
      });

    return () => {
      cancelled = true;
      svgPre.selectAll("*").remove();
      svgPost.selectAll("*").remove();
    };
  }, []);

  /* ---------- 3. Reaksi visual terhadap step ---------- */
  useEffect(() => {
    const sel = selRef.current;
    if (!ready || !sel) return;

    const { bubbles, trailGroup, lineX, lineY, labelX, labelY } = sel;

    const updateThreshold = (ref: { x: number; y: number }, duration = 600) => {
      lineX
        .transition()
        .duration(duration)
        .attr("x1", xScale(ref.x))
        .attr("x2", xScale(ref.x))
        .attr("y1", 0)
        .attr("y2", INNER_H);
      lineY
        .transition()
        .duration(duration)
        .attr("x1", 0)
        .attr("x2", INNER_W)
        .attr("y1", yScale(ref.y))
        .attr("y2", yScale(ref.y));
      labelX
        .transition()
        .duration(duration)
        .attr("x", xScale(ref.x) + 4)
        .attr("y", INNER_H - 24)
        .text(`Rata-rata Prov: Rp${ref.x}jt`);
      labelY
        .transition()
        .duration(duration)
        .attr("x", INNER_W - 120)
        .attr("y", yScale(ref.y) - 6)
        .text(`Pertumbuhan Prov: ${ref.y}%`);
    };

    bubbles.classed("bubble-pulse", false);

    if (activeStep === 6) {
      trailGroup.selectAll("line").remove();
      updateThreshold(refThresholds.p1);
      bubbles
        .transition()
        .duration(600)
        .attr("cx", (d) => xScale(d.x1))
        .attr("cy", (d) => yScale(d.y1))
        .attr("fill", (d) => quadColors[d.q1])
        .attr("opacity", 1);
      return;
    }

    updateThreshold(refThresholds.p2, activeStep === 7 ? 600 : 300);

    if (activeStep === 7) {
      trailGroup
        .selectAll<SVGLineElement, KlassenItem>("line")
        .data(klassenData)
        .join("line")
        .attr("class", "motion-trail")
        .attr("x1", (d) => xScale(d.x1))
        .attr("y1", (d) => yScale(d.y1))
        .attr("x2", (d) => xScale(d.x1))
        .attr("y2", (d) => yScale(d.y1))
        .attr("stroke", (d) => quadColors[d.q2])
        .transition()
        .duration(800)
        .attr("x2", (d) => xScale(d.x2))
        .attr("y2", (d) => yScale(d.y2));
    }

    const duration = activeStep === 7 ? 800 : 300;
    bubbles
      .transition()
      .duration(duration)
      .attr("cx", (d) => xScale(d.x2))
      .attr("cy", (d) => yScale(d.y2))
      .attr("fill", (d) => quadColors[d.q2])
      .attr("opacity", (d) =>
        activeStep === 8 && !FOCUS_IDS_STEP8.includes(d.id) ? 0.15 : 1,
      );

    if (activeStep === 8) {
      bubbles
        .filter((d) => FOCUS_IDS_STEP8.includes(d.id))
        .classed("bubble-pulse", true);
    }
  }, [ready, activeStep]);

  /* ---------- 4. Observer kartu narasi ---------- */
  useEffect(() => {
    const container = sectionRef.current;
    if (!container) return;

    const cards = container.querySelectorAll("[data-step]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(
              parseInt((entry.target as HTMLElement).dataset.step || "6", 10),
            );
          }
        });
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0.1 },
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  const isP2 = activeStep >= 7;

  return (
    <section ref={sectionRef} className="klassen-section">
      {/* KIRI: sticky visual */}
      <div className="klassen-sticky-col">
        <div className="klassen-visual-wrapper">
          <div className="klassen-header">
            <div className="klassen-title font-bungee color-green">
              Tipologi Klassen
            </div>
            <div className="klassen-legend">
              {(Object.keys(quadLabels) as Quadrant[]).map((q) => (
                <div key={q} className="legend-item">
                  <span
                    className="legend-dot"
                    style={{ background: quadColors[q] }}
                  />
                  <span>{quadLabels[q]}</span>
                </div>
              ))}
            </div>
          </div>

          <div ref={scatterWrapRef} className="klassen-scatter-wrap">
            <svg ref={scatterRef} className="klassen-scatter-svg" />
            {tooltip && (
              <div
                className="klassen-tooltip"
                style={{ left: tooltip.x, top: tooltip.y }}
              >
                <div className="klassen-tooltip-title">{tooltip.item.name}</div>
                <div>
                  Periode: <strong>{isP2 ? "2021–2025" : "2016–2020"}</strong>
                </div>
                <div>
                  PDRB/kapita:{" "}
                  <strong>
                    Rp{(isP2 ? tooltip.item.x2 : tooltip.item.x1).toFixed(2)}{" "}
                    juta
                  </strong>
                </div>
                <div>
                  Pertumbuhan:{" "}
                  <strong>
                    {(isP2 ? tooltip.item.y2 : tooltip.item.y1).toFixed(2)}%
                  </strong>
                </div>
                <div>
                  Klasifikasi:{" "}
                  <strong style={{ color: "#c51b7d" }}>
                    Kuadran {isP2 ? tooltip.item.q2 : tooltip.item.q1}
                  </strong>
                </div>
              </div>
            )}
          </div>

          <div
            className={`klassen-maps-wrap${activeStep >= 7 ? " visible" : ""}`}
          >
            <div className="mini-map-box">
              <div className="mini-map-title">Pra-Pandemi (2016–2020)</div>
              <svg ref={miniPreRef} className="mini-map-svg" />
            </div>
            <div className="mini-map-box">
              <div className="mini-map-title">Pascapandemi (2021–2025)</div>
              <svg ref={miniPostRef} className="mini-map-svg" />
            </div>
          </div>
        </div>
      </div>

      {/* KANAN: narrative track */}
      <div className="klassen-narrative-track">
        {steps.map((s) => (
          <div
            key={s.id}
            data-step={s.id}
            className={`klassen-step${activeStep === s.id ? " active" : ""}`}
          >
            <div className="klassen-card">{s.content}</div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .klassen-section {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: row;
          border-top: 1px solid #e0e0e0;

          color: #333333;
          font-family: "Jost", var(--font-sans), sans-serif;
        }
        .klassen-section * {
          box-sizing: border-box;
        }

        .klassen-section .klassen-sticky-col {
          width: 60%;
          height: 100vh;
          position: sticky;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;

          padding: 1.25rem 1.5rem;
          overflow: hidden;
        }
        .klassen-section .klassen-visual-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .klassen-section .klassen-header {
          margin-bottom: 0.5rem;
          flex: 0 0 auto;
        }

        .klassen-section .klassen-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #111111;
        }
        .klassen-section .klassen-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 0.4rem;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .klassen-section .legend-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.15rem 0.4rem;
          border-radius: 3px;
        }
        .klassen-section .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }

        .klassen-section .klassen-scatter-wrap {
          width: 100%;
          flex: 62 1 0%;
          min-height: 0;
          position: relative;
        }
        .klassen-section .klassen-scatter-svg {
          width: 100%;
          height: 100%;
        }

        .klassen-section .threshold-line {
          stroke: #111827;
          stroke-width: 1.5px;
          stroke-dasharray: 4, 4;
        }
        .klassen-section .threshold-label {
          font-size: 8px;
          font-weight: 700;
          fill: #111827;
        }
        .klassen-section .motion-trail {
          stroke-width: 1.2px;
          stroke-dasharray: 2, 2;
          opacity: 0.5;
          fill: none;
        }
        .klassen-section .scatter-bubble {
          stroke: #ffffff;
          stroke-width: 1.5px;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }
        .klassen-section .scatter-bubble:hover {
          stroke: #111111;
          stroke-width: 2.5px;
        }

        @keyframes klassen-pulse {
          0% {
            r: 7px;
            opacity: 1;
          }
          50% {
            r: 13px;
            opacity: 0.7;
          }
          100% {
            r: 7px;
            opacity: 1;
          }
        }
        .klassen-section .bubble-pulse {
          animation: klassen-pulse 1.5s infinite ease-in-out;
          stroke: #111111 !important;
          stroke-width: 2.5px !important;
        }

        .klassen-section .klassen-maps-wrap {
          width: 100%;
          flex: 38 1 0%;
          min-height: 0;
          display: flex;
          gap: 1rem;
          border-top: 1px dashed #d1d5db;
          padding-top: 0.5rem;
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .klassen-section .klassen-maps-wrap.visible {
          opacity: 1;
        }
        .klassen-section .mini-map-box {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .klassen-section .mini-map-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-align: center;
          color: #4b5563;
          text-transform: uppercase;
          margin-bottom: 0.2rem;
        }
        .klassen-section .mini-map-svg {
          width: 100%;
          flex-grow: 1;
          min-height: 0;
        }
        .klassen-section .mini-district {
          stroke: #ffffff;
          stroke-width: 0.6px;
          transition:
            fill 0.3s,
            opacity 0.3s;
        }

        .klassen-section .klassen-tooltip {
          position: absolute;
          pointer-events: none;
          background: #ffffff;
          border: 1px solid #cccccc;
          padding: 0.5rem 0.75rem;
          border-radius: 2px;
          font-size: 0.75rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          z-index: 50;
          line-height: 1.4;
        }
        .klassen-section .klassen-tooltip-title {
          font-weight: 700;
          border-bottom: 1.5px solid #eee;
          padding-bottom: 3px;
          margin-bottom: 4px;
          font-size: 0.85rem;
        }

        .klassen-section .klassen-narrative-track {
          width: 40%;
          position: relative;
          z-index: 2;
          padding: 12vh 2.5rem 25vh 2rem;
        }
        .klassen-section .klassen-step {
          min-height: 85vh;
          display: flex;
          align-items: center;
          opacity: 0.25;
          transition: opacity 0.35s ease;
        }
        .klassen-section .klassen-step.active {
          opacity: 1;
        }
        .klassen-section .klassen-card {
          background: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 2px;
          padding: 2rem 1.75rem;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
        }
        .klassen-section .klassen-card-tag {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          color: #888888;
          margin-bottom: 0.5rem;
        }
        .klassen-section .klassen-card-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #111111;
          margin: 0 0 1rem 0;
        }
        .klassen-section .klassen-card-text {
          font-size: 0.95rem;
          line-height: 1.65;
          color: #333333;
          margin-bottom: 0.9rem;
        }
        .klassen-section .klassen-card-text:last-child {
          margin-bottom: 0;
        }

        .klassen-section .badge-q1,
        .klassen-section .badge-q2,
        .klassen-section .badge-q3,
        .klassen-section .badge-q4 {
          font-weight: 700;
          padding: 0.1rem 0.35rem;
          border-radius: 2px;
        }
        .klassen-section .badge-q1 {
          background: #e6f5d0;
          color: #4d9221;
        }
        .klassen-section .badge-q2 {
          background: #fde0ef;
          color: #c51b7d;
        }
        .klassen-section .badge-q3 {
          background: #e9a3c9;
          color: #ffffff;
        }
        .klassen-section .badge-q4 {
          background: #f4f4f4;
          color: #666666;
        }

        @media (max-width: 860px) {
          .klassen-section {
            flex-direction: column;
          }
          .klassen-section .klassen-sticky-col {
            width: 100%;
            height: 52vh;
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #e0e0e0;
            z-index: 20;
          }
          .klassen-section .klassen-narrative-track {
            width: 100%;
            padding: 2rem 1.25rem 15vh 1.25rem;
          }
          .klassen-section .klassen-step {
            min-height: 65vh;
          }
          .klassen-section .klassen-card {
            padding: 1.35rem 1.25rem;
          }
        }
      `}</style>
    </section>
  );
}
