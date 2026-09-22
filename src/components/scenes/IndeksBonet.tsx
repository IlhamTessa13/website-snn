"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import * as d3 from "d3";
import {
  williamsonData,
  williamsonCallouts,
  type WilliamsonPoint,
} from "@/data/williamson";

/* ============================================================
   Geometri chart — viewBox tetap, SVG di-scale oleh browser.
   Nilai dx/dy callout di data/williamson.ts mengacu ke koordinat ini.
   ============================================================ */
const WIDTH = 760;
const HEIGHT = 480;
const MARGIN = { top: 25, right: 35, bottom: 35, left: 50 };
const INNER_W = WIDTH - MARGIN.left - MARGIN.right;
const INNER_H = HEIGHT - MARGIN.top - MARGIN.bottom;

const Y_TICKS = [0.6, 0.62, 0.64, 0.66, 0.68, 0.7];

const xScale = d3.scaleLinear().domain([2015, 2026]).range([0, INNER_W]);
const yScale = d3.scaleLinear().domain([0.6, 0.7]).range([INNER_H, 0]);

const lineGenerator = d3
  .line<WilliamsonPoint>()
  .x((d) => xScale(d.year))
  .y((d) => yScale(d.iw))
  .curve(d3.curveStep);

/* ============================================================
   Narasi
   ============================================================ */
const steps: { id: number; content: ReactNode }[] = [
  {
    id: 0,
    content: (
      <p>
        PDRB Jawa Tengah mencatatkan tren pertumbuhan, namun distribusi nilai
        tambah antardaerah menunjukkan dinamika yang berbeda. Melalui{" "}
        <strong>Indeks Williamson</strong>, kita dapat melihat seberapa merata
        tingkat pembangunan di antara 35 kabupaten dan kota. Nilai di atas{" "}
        <strong>0,50</strong> menandakan ketimpangan yang tergolong tinggi.
      </p>
    ),
  },
  {
    id: 1,
    content: (
      <>
        <p>
          Sebelum pandemi, angka Indeks Williamson bergerak melandai secara
          bertahap dari <strong>0,654</strong> pada 2016 menjadi{" "}
          <strong>0,645</strong> pada 2019. Penurunan tipis menunjukkan adanya
          perbaikan pemerataan yang relatif lambat.
        </p>
        <p>
          Meskipun kurva menunjukkan tren penurunan, seluruh lintasan tetap
          berada di atas ambang batas 0,50. Artinya, di Provinsi Jawa Tengah
          ketidakmerataan pembangunan masih tergolong tinggi.
        </p>
      </>
    ),
  },
  {
    id: 2,
    content: (
      <>
        <p>
          Pada 2020, Indeks Williamson naik menjadi{" "}
          <span className="hl hl-red-krisis">0,692</span>.
        </p>
        <p>
          PDRB per kapita{" "}
          <span className="hl hl-green-peak">
            Kabupaten Kudus: Rp123,89 juta
          </span>
          , sedangkan{" "}
          <span className="hl hl-magenta-base">
            Kabupaten Grobogan: Rp19,70 juta
          </span>
          . Selisih keduanya mencapai{" "}
          <span className="hl hl-orange-gap">Rp104,19 juta</span>.
        </p>
      </>
    ),
  },
  {
    id: 3,
    content: (
      <>
        <p>
          Setelah pandemi, Indeks Williamson menurun hingga{" "}
          <span className="hl hl-orange-end">0,677 pada 2025</span>.
        </p>
        <p>
          <span className="hl hl-green-peak">Kota Semarang: Rp167,24 juta</span>
          , sementara{" "}
          <span className="hl hl-magenta-base">
            Kabupaten Pemalang: Rp24,05 juta
          </span>
          —selisih <span className="hl hl-red-bold">Rp143,19 juta</span>.
        </p>
      </>
    ),
  },
  {
    id: 4,
    content: (
      <>
        <p>
          Lintasan Indeks Williamson membuktikan bahwa perbaikan pemerataan Jawa
          Tengah masih berlangsung perlahan di atas batas rawan kesenjangan
          tinggi.
        </p>
        <p>
          Akan tetapi, satu nilai agregat tingkat provinsi tidak mampu
          menjelaskan anatomi internalnya:{" "}
          <em>
            daerah mana saja yang berada di atas tolok ukur provinsi, dan
            wilayah mana yang tertinggal di bawah garis rata-rata?
          </em>
        </p>
      </>
    ),
  },
];

export default function IndeksWilliamson() {
  const sectionRef = useRef<HTMLElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  // Handle imperatif ke elemen D3, dipakai lintas effect
  const d3Ref = useRef<{
    dots: d3.Selection<SVGCircleElement, WilliamsonPoint, SVGGElement, unknown>;
    linePath: d3.Selection<SVGPathElement, WilliamsonPoint[], null, undefined>;
    annotations: d3.Selection<SVGGElement, unknown, null, undefined>;
    totalLength: number;
    introDone: boolean;
    introStarted: boolean;
  } | null>(null);

  /* ---------- 1. Build chart sekali saat mount ---------- */
  useEffect(() => {
    const box = chartRef.current;
    if (!box) return;

    const svg = d3
      .select(box)
      .append("svg")
      .attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

    // Gridlines horizontal
    const gridGroup = g.append("g").attr("class", "grid-group");
    Y_TICKS.forEach((val) => {
      gridGroup
        .append("line")
        .attr("class", "grid-line")
        .attr("x1", 0)
        .attr("x2", INNER_W)
        .attr("y1", yScale(val))
        .attr("y2", yScale(val));
    });

    // Garis dasar tebal
    g.append("line")
      .attr("class", "axis-baseline")
      .attr("x1", 0)
      .attr("x2", INNER_W)
      .attr("y1", INNER_H)
      .attr("y2", INNER_H);

    // Label sumbu Y
    const yAxisGroup = g.append("g").attr("class", "axis y-axis");
    Y_TICKS.forEach((val) => {
      yAxisGroup
        .append("text")
        .attr("x", -12)
        .attr("y", yScale(val) + 4)
        .attr("text-anchor", "end")
        .text(d3.format(".2f")(val));
    });

    // Label sumbu X
    const xAxisGroup = g.append("g").attr("class", "axis x-axis");
    williamsonData.forEach((d) => {
      xAxisGroup
        .append("text")
        .attr("x", xScale(d.year))
        .attr("y", INNER_H + 22)
        .attr("text-anchor", "middle")
        .text(d.year);
    });

    // Step line (tersembunyi via stroke-dashoffset)
    const linePath = g
      .append("path")
      .datum(williamsonData)
      .attr("class", "rank-line")
      .attr("d", lineGenerator);

    const totalLength = linePath.node()!.getTotalLength();
    linePath
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength);

    // Titik data (r = 0 di awal)
    const dots = g
      .append("g")
      .attr("class", "g-dots")
      .selectAll<SVGCircleElement, WilliamsonPoint>(".season-circle")
      .data(williamsonData)
      .enter()
      .append("circle")
      .attr("class", (d) =>
        d.year === 2020 ? "season-circle is-peak" : "season-circle",
      )
      .attr("cx", (d) => xScale(d.year))
      .attr("cy", (d) => yScale(d.iw))
      .attr("r", 0);

    const annotations = g.append("g").attr("class", "g-annotations");

    d3Ref.current = {
      dots,
      linePath,
      annotations,
      totalLength,
      introDone: false,
      introStarted: false,
    };

    return () => {
      svg.remove();
      d3Ref.current = null;
    };
  }, []);

  /* ---------- 2. Observer untuk kartu narasi ---------- */
  useEffect(() => {
    const container = sectionRef.current;
    if (!container) return;

    const cards = container.querySelectorAll("[data-step]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const step = parseInt(
            (entry.target as HTMLElement).dataset.step || "0",
          );
          if (entry.isIntersecting) {
            setActiveStep(step);
          } else if (step === 0 && entry.boundingClientRect.top > 0) {
            // Di-scroll balik ke atas sebelum step 0 → reset animasi
            setActiveStep(-1);
          }
        });
      },
      { threshold: 0.5 },
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  /* ---------- 3. Reaksi visual terhadap step ---------- */
  useEffect(() => {
    const api = d3Ref.current;
    if (!api) return;

    const { dots, linePath, annotations, totalLength } = api;

    // Reset penuh (scroll balik ke atas sebelum step 0)
    if (activeStep < 0) {
      api.introStarted = false;
      api.introDone = false;
      dots.interrupt().attr("r", 0);
      linePath.interrupt().attr("stroke-dashoffset", totalLength);
      annotations.selectAll("*").remove();
      annotations.classed("is-visible", false);
      return;
    }

    // Intro: titik muncul bertahap, lalu garis berjalan
    if (activeStep === 0) {
      if (!api.introStarted) {
        api.introStarted = true;
        dots
          .transition()
          .duration(250)
          .delay((_, i, nodes) => (i / nodes.length) * 1000)
          .ease(d3.easeCubicIn)
          .attr("r", (d) => (d.year === 2020 ? 7.5 : 4));

        linePath
          .transition()
          .duration(2800)
          .delay(1000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0)
          .on("end", () => {
            if (d3Ref.current) d3Ref.current.introDone = true;
          });
      }
      annotations.selectAll("*").remove();
      annotations.classed("is-visible", false);
      return;
    }

    // Jika user melompat ke step berikutnya, selesaikan intro seketika
    if (!api.introDone) {
      dots.interrupt().attr("r", (d) => (d.year === 2020 ? 7.5 : 4));
      linePath.interrupt().attr("stroke-dashoffset", 0);
      api.introStarted = true;
      api.introDone = true;
    }

    annotations.selectAll("*").remove();
    annotations.classed("is-visible", false);
    dots
      .classed("active-step", false)
      .transition()
      .duration(200)
      .attr("r", (d) => (d.year === 2020 ? 7.5 : 4));

    if (activeStep === 1) {
      dots
        .filter((d) => d.year <= 2019)
        .classed("active-step", true)
        .transition()
        .duration(250)
        .attr("r", 5.5);
    } else if (activeStep === 2) {
      dots
        .filter((d) => d.year === 2020)
        .classed("active-step", true)
        .transition()
        .duration(250)
        .attr("r", 9);
    } else if (activeStep === 3) {
      dots
        .filter((d) => d.year === 2025)
        .classed("active-step", true)
        .transition()
        .duration(250)
        .attr("r", 8);
    } else if (activeStep === 4) {
      dots.classed("active-step", true);
    }

    // Callout
    const cfg = williamsonCallouts[activeStep];
    if (cfg) {
      const callout = annotations
        .append("g")
        .attr(
          "transform",
          `translate(${xScale(cfg.year) + cfg.dx}, ${yScale(cfg.val) + cfg.dy})`,
        );

      callout
        .append("rect")
        .attr("class", "annotation-box")
        .attr("width", cfg.w)
        .attr("height", cfg.h);

      callout
        .append("text")
        .attr("class", "annotation-year")
        .attr("x", 8)
        .attr("y", 16)
        .text(cfg.title);

      callout
        .append("text")
        .attr("class", "annotation-text")
        .attr("x", 10)
        .attr("y", 32)
        .text(cfg.desc);

      annotations.classed("is-visible", true);
    }
  }, [activeStep]);

  return (
    <section ref={sectionRef} className="williamson-section">
      {/* SISI KIRI: sticky visual (60%) */}
      <div className="visual-container">
        <div className="chart-header">
          <h2 className="font-bungee color-pink">Indeks Williamson</h2>
          <p className="meta-info">Periode 2016–2025 · 35 kabupaten/kota</p>
        </div>
        <div ref={chartRef} className="chart-box" />
      </div>

      {/* SISI KANAN: narrative track (40%) */}
      <div className="narrative-track">
        {steps.map((s) => (
          <div
            key={s.id}
            data-step={s.id}
            className={`step-card${activeStep === s.id ? " is-active" : ""}`}
          >
            {s.content}
          </div>
        ))}
      </div>

      <style jsx global>{`
        .williamson-section {
          display: flex;
          position: relative;
          background-color: #ffffff;
          min-height: 100vh;
          font-family: "Jost", var(--font-sans), sans-serif;
          color: #282828;
          line-height: 1.6;
        }

        .williamson-section .visual-container {
          width: 60%;
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 2rem 2rem 3.5rem;
          background: #ffffff;
          z-index: 1;
        }

        .williamson-section .chart-header {
          width: 100%;
          max-width: 760px;
          margin-bottom: 0.5rem;
        }

        .williamson-section .chart-header .category-tag {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #33c6ce;
          margin-bottom: 2px;
        }

        .williamson-section .chart-header h2 {
          font-size: 26px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .williamson-section .chart-header .meta-info {
          font-size: 13px;
          color: #9ca3af;
          font-weight: 500;
          margin-top: 4px;
        }

        .williamson-section .chart-box {
          width: 100%;
          max-width: 760px;
          height: 480px;
          position: relative;
        }

        .williamson-section .chart-box svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .williamson-section .narrative-track {
          width: 40%;
          position: relative;
          z-index: 2;
          padding: 35vh 3.5rem 50vh 1.5rem;
        }

        .williamson-section .step-card {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 2rem 2.25rem;
          margin-bottom: 80vh;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          transition: all 0.35s ease;
          opacity: 0.25;
          transform: translateY(15px);
        }

        .williamson-section .step-card.is-active {
          opacity: 1;
          transform: translateY(0);
          border-color: #cbd5e1;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
        }

        .williamson-section .step-card p {
          font-size: 1.05rem;
          line-height: 1.75;
          color: #374151;
          margin-bottom: 1rem;
        }

        .williamson-section .step-card p:last-child {
          margin-bottom: 0;
        }

        /* Highlight badges */
        .williamson-section .hl {
          display: inline-block;
          padding: 0.15em 0.45em;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.95em;
        }
        .williamson-section .hl-red-krisis {
          background-color: #fee2e2;
          color: #991b1b;
        }
        .williamson-section .hl-green-peak {
          background-color: #dcfce7;
          color: #166534;
        }
        .williamson-section .hl-magenta-base {
          background-color: #fce7f3;
          color: #9d174d;
        }
        .williamson-section .hl-orange-gap {
          background-color: #ffedd5;
          color: #9a3412;
        }
        .williamson-section .hl-orange-end {
          background-color: #ffedd5;
          color: #c2410c;
        }
        .williamson-section .hl-red-bold {
          background-color: #fee2e2;
          color: #b91c1c;
          font-weight: 700;
        }

        /* Sumbu & grid */
        .williamson-section .grid-line {
          stroke: #e2e8f0;
          stroke-dasharray: 4 4;
        }
        .williamson-section .axis text {
          font-family: "Jost", var(--font-sans), sans-serif;
          font-size: 11px;
          fill: #94a3b8;
          font-weight: 500;
        }
        .williamson-section .axis path,
        .williamson-section .axis line {
          display: none;
        }
        .williamson-section .axis-baseline {
          stroke: #cbd5e1;
          stroke-width: 2px;
        }

        /* Garis & titik */
        .williamson-section .rank-line {
          fill: none;
          stroke: #4d9221;
          stroke-width: 2.25px;
          stroke-linecap: square;
        }
        .williamson-section .season-circle {
          fill: #c51b7d;
          stroke: #ffffff;
          stroke-width: 2px;
          transition:
            fill 0.25s,
            stroke 0.25s;
        }
        .williamson-section .season-circle.is-peak {
          fill: #c51b7d;
        }
        .williamson-section .season-circle.active-step {
          fill: #c51b7d !important;
          stroke: #cffafe !important;
          stroke-width: 3.5px !important;
        }

        /* Anotasi */
        .williamson-section .g-annotations {
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.45s ease;
        }
        .williamson-section .g-annotations.is-visible {
          opacity: 1;
        }
        .williamson-section .annotation-box {
          fill: #ffffff;
          stroke: rgba(0, 0, 0, 0.12);
          stroke-width: 1px;
          filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.05));
          rx: 3px;
        }
        .williamson-section .annotation-year {
          font-size: 11px;
          font-weight: 700;
          fill: #9d174d;
        }
        .williamson-section .annotation-text {
          font-size: 11px;
          font-weight: 400;
          fill: #475569;
        }

        @media (max-width: 880px) {
          .williamson-section {
            flex-direction: column;
          }
          .williamson-section .visual-container {
            width: 100%;
            height: 52vh;
            padding: 1.5rem 1rem 0.5rem 1rem;
          }
          .williamson-section .chart-box {
            height: 100%;
          }
          .williamson-section .narrative-track {
            width: 100%;
            padding: 5vh 1.5rem 50vh 1.5rem;
          }
          .williamson-section .step-card {
            margin-bottom: 55vh;
          }
        }
      `}</style>
    </section>
  );
}
