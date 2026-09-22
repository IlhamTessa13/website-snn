"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import * as d3 from "d3";
import { pdrbTotalImplisit, years } from "@/data/indeksImplisit";

/* ============================================================
   Scene 2 — Laju Indeks Implisit PDRB (2016–2025)

   Direvisi agar SAMA PERSIS pola dengan IndeksWilliamson.tsx:
   - Chart dibangun sekali via d3 (imperatif), bukan re-render React.
   - Animasi masuk: titik muncul bertahap dulu, baru garis "berjalan"
     dari 2016 sampai 2025 (stroke-dashoffset).
   - Header (judul + meta) dan chart berada dalam satu panel
     `position: sticky` yang TIDAK ikut ter-scroll ke atas — hanya
     kartu narasi di kanan yang bergulir.
   - Narasi dipersempit jadi 3 titik: 2020 (terendah pra-2022),
     2022 (puncak lonjakan), 2025 (kondisi terkini), ditulis dengan
     nada peneliti menjelaskan sebab di balik angka.
   - Kelas highlight (.hl-*) memakai palet & nama yang identik
     dengan IndeksWilliamson agar konsisten lintas section.
   ============================================================ */

interface Point {
  year: number;
  v: number;
}

const data: Point[] = years.map((y) => ({ year: y, v: pdrbTotalImplisit[y] }));

const WIDTH = 760;
const HEIGHT = 480;
const MARGIN = { top: 25, right: 35, bottom: 35, left: 50 };
const INNER_W = WIDTH - MARGIN.left - MARGIN.right;
const INNER_H = HEIGHT - MARGIN.top - MARGIN.bottom;

const Y_TICKS = [0, 1, 2, 3, 4, 5];
const PEAK_YEAR = 2022; // titik lonjakan tertinggi — setara peran 2020 di Indeks Williamson

const xScale = d3.scaleLinear().domain([2015, 2026]).range([0, INNER_W]);
const yScale = d3.scaleLinear().domain([0, 5]).range([INNER_H, 0]);

const lineGenerator = d3
  .line<Point>()
  .x((d) => xScale(d.year))
  .y((d) => yScale(d.v))
  .curve(d3.curveStep);

/* ---------------- Callout per step (posisi dalam koordinat chart) ---------------- */
interface Callout {
  year: number;
  val: number;
  title: string;
  desc: string;
}

const callouts: Record<number, Callout> = {
  1: {
    year: 2020,
    val: 1.74,
    title: "TITIK TERENDAH PRA-2022 (1,74%)",
    desc: "Tertinggi: Air & Limbah 5,81% · Terendah: Pertambangan -1,12%",
  },
  2: {
    year: 2022,
    val: 4.27,
    title: "PUNCAK LONJAKAN 2022 (4,27%)",
    desc: "Tertinggi: Pertambangan 9,86% · Stagnan: Info & Komunikasi 0,12%",
  },
  3: {
    year: 2025,
    val: 1.45,
    title: "TERENDAH 10 TAHUN (1,45%)",
    desc: "Tertinggi: Air & Limbah 3,46% · Terendah: Info & Komunikasi 0,25%",
  },
};

/* ---------------- Narasi: umum + 3 langkah tahun, gaya peneliti ---------------- */
const steps: { id: number; content: ReactNode }[] = [
  {
    id: 0,
    content: (
      <>
        <p>
          Laju Indeks Implisit PDRB Jawa Tengah bergerak dinamis sepanjang{" "}
          <strong>2016–2025</strong>, mencerminkan perubahan harga agregat yang
          tidak selalu sejalan dengan pertumbuhan ekonomi riil. Melalui
          indikator ini, kita dapat melihat seberapa besar tekanan harga
          memengaruhi nilai tambah tiap sektor dari tahun ke tahun.
        </p>
        <p>
          Tiga titik menandai lintasannya: titik terendah sebelum lonjakan
          pascapandemi (<strong>2020</strong>), puncak kenaikan harga komoditas
          global (<strong>2022</strong>), dan kondisi terkini yang kembali
          melandai (<strong>2025</strong>).
        </p>
      </>
    ),
  },
  {
    id: 1,
    content: (
      <>
        <p>
          Pada 2020, laju indeks implisit PDRB Jawa Tengah melambat ke{" "}
          <span className="hl hl-orange-end">1,74%</span>, titik terendah sejak
          2016 sebelum melonjak tajam dua tahun kemudian. Pandemi COVID-19
          menekan permintaan di hampir seluruh lapangan usaha, tercermin dari{" "}
          <span className="hl hl-red-krisis">
            sektor Pertambangan dan Penggalian yang mengalami deflasi implisit
            terdalam, -1,12%
          </span>
          , seiring anjloknya harga komoditas tambang di pasar global akibat
          pelemahan permintaan industri.
        </p>
        <p>
          Di sisi lain,{" "}
          <span className="hl hl-green-peak">
            Pengadaan Air, Sampah, Limbah &amp; Daur Ulang justru mencatat
            kenaikan harga tertinggi, 5,81%
          </span>{" "}
          — kemungkinan karena penyesuaian tarif layanan publik yang berjalan
          terlepas dari kondisi permintaan pasar, pola khas sektor yang harganya
          diatur administratif, bukan mekanisme pasar bebas.
        </p>
      </>
    ),
  },
  {
    id: 2,
    content: (
      <>
        <p>
          Pada 2022, laju indeks implisit melonjak ke titik tertinggi sepanjang
          periode pengamatan, <span className="hl hl-red-krisis">4,27%</span>,
          jauh di atas rata-rata dekade. Lonjakan ini didorong oleh{" "}
          <span className="hl hl-green-peak">
            sektor Pertambangan dan Penggalian yang melesat ke 9,86%
          </span>
          , sejalan dengan kenaikan harga komoditas energi dan mineral global
          pascapandemi serta gangguan rantai pasok akibat gejolak geopolitik
          internasional.
        </p>
        <p>
          Sementara itu,{" "}
          <span className="hl hl-magenta-base">
            sektor Informasi dan Komunikasi nyaris tidak bergerak, hanya 0,12%
          </span>
          , menegaskan bahwa lonjakan harga 2022 sangat tidak merata —
          terkonsentrasi pada sektor berbasis komoditas fisik, sementara sektor
          digital yang minim ketergantungan pada bahan baku impor relatif tak
          tersentuh.
        </p>
      </>
    ),
  },
  {
    id: 3,
    content: (
      <>
        <p>
          Memasuki 2025, laju indeks implisit kembali mendingin ke{" "}
          <span className="hl hl-orange-end">1,45%</span>, angka terendah
          sepanjang sepuluh tahun terakhir, menandakan tekanan harga agregat
          yang berangsur terkendali setelah gejolak 2022. Normalisasi ini
          konsisten dengan pola pascakrisis harga komoditas yang umumnya diikuti
          fase pendinginan bertahap.
        </p>
        <p>
          Namun demikian,{" "}
          <span className="hl hl-green-peak">
            Pengadaan Air, Sampah, Limbah &amp; Daur Ulang masih mencatat
            kenaikan harga relatif tinggi, 3,46%
          </span>
          , sementara{" "}
          <span className="hl hl-magenta-base">
            Informasi dan Komunikasi kembali landai di 0,25%
          </span>{" "}
          — menunjukkan bahwa meski laju agregat melandai, disparitas tekanan
          harga antarsektor tetap menjadi karakter struktural yang bertahan
          sepanjang dekade.
        </p>
      </>
    ),
  },
];

export default function LajuIndeksImplisit() {
  const sectionRef = useRef<HTMLElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  const d3Ref = useRef<{
    dots: d3.Selection<SVGCircleElement, Point, SVGGElement, unknown>;
    linePath: d3.Selection<SVGPathElement, Point[], null, undefined>;
    annotations: d3.Selection<SVGGElement, unknown, null, undefined>;
    totalLength: number;
    introDone: boolean;
    introStarted: boolean;
  } | null>(null);

  /* ---------- 1. Bangun chart sekali saat mount ---------- */
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

    g.append("line")
      .attr("class", "axis-baseline")
      .attr("x1", 0)
      .attr("x2", INNER_W)
      .attr("y1", INNER_H)
      .attr("y2", INNER_H);

    const yAxisGroup = g.append("g").attr("class", "axis y-axis");
    Y_TICKS.forEach((val) => {
      yAxisGroup
        .append("text")
        .attr("x", -12)
        .attr("y", yScale(val) + 4)
        .attr("text-anchor", "end")
        .text(`${val}%`);
    });

    const xAxisGroup = g.append("g").attr("class", "axis x-axis");
    data.forEach((d) => {
      xAxisGroup
        .append("text")
        .attr("x", xScale(d.year))
        .attr("y", INNER_H + 22)
        .attr("text-anchor", "middle")
        .text(d.year);
    });

    const linePath = g
      .append("path")
      .datum(data)
      .attr("class", "rank-line")
      .attr("d", lineGenerator);

    const totalLength = linePath.node()!.getTotalLength();
    linePath
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength);

    const dots = g
      .append("g")
      .attr("class", "g-dots")
      .selectAll<SVGCircleElement, Point>(".season-circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", (d) =>
        d.year === PEAK_YEAR ? "season-circle is-peak" : "season-circle",
      )
      .attr("cx", (d) => xScale(d.year))
      .attr("cy", (d) => yScale(d.v))
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

  /* ---------- 2. Observer kartu narasi ---------- */
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

    if (activeStep < 0) {
      api.introStarted = false;
      api.introDone = false;
      dots.interrupt().attr("r", 0);
      linePath.interrupt().attr("stroke-dashoffset", totalLength);
      annotations.selectAll("*").remove();
      annotations.classed("is-visible", false);
      return;
    }

    const cfg = callouts[activeStep];
    const startingIntro = activeStep === 0 && !api.introStarted;

    if (startingIntro) {
      api.introStarted = true;

      // Tandai titik fokus step ini (2020) sejak awal — className di-set
      // langsung (bukan lewat transisi) sehingga tidak menabrak/memutus
      // animasi kemunculan titik yang baru saja dimulai di bawah ini.
      dots.classed(
        "active-step",
        (d) => cfg !== undefined && d.year === cfg.year,
      );

      dots
        .transition()
        .duration(220)
        .delay((_, i) => i * 160)
        .ease(d3.easeCubicIn)
        .attr("r", (d) => {
          if (cfg && d.year === cfg.year)
            return cfg.year === PEAK_YEAR ? 9.5 : 9;
          return d.year === PEAK_YEAR ? 7.5 : 4;
        });

      linePath
        .transition()
        .duration(2800)
        .delay(data.length * 160 + 250)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .on("end", () => {
          if (d3Ref.current) d3Ref.current.introDone = true;
        });
    } else if (!api.introDone) {
      // Lompat langsung ke step lanjutan tanpa sempat melihat intro (mis.
      // scroll cepat) → selesaikan animasi masuk seketika, tanpa animasi.
      dots.interrupt().attr("r", (d) => (d.year === PEAK_YEAR ? 7.5 : 4));
      linePath.interrupt().attr("stroke-dashoffset", 0);
      api.introStarted = true;
      api.introDone = true;
    }

    // Highlight titik aktif — dilewati saat baru memulai intro (di atas)
    // karena radius fokusnya sudah dipatok langsung di transisi kemunculan.
    if (!startingIntro) {
      dots
        .classed("active-step", false)
        .transition()
        .duration(200)
        .attr("r", (d) => (d.year === PEAK_YEAR ? 7.5 : 4));

      if (cfg) {
        dots
          .filter((d) => d.year === cfg.year)
          .classed("active-step", true)
          .transition()
          .duration(250)
          .attr("r", cfg.year === PEAK_YEAR ? 9.5 : 9);
      }
    }

    // Kotak callout — grup SVG terpisah dari titik/garis, jadi selalu aman
    // dirender terlepas dari status animasi intro (termasuk untuk step 0).
    annotations.selectAll("*").remove();
    annotations.classed("is-visible", false);

    if (cfg) {
      // Ukuran box mengikuti panjang teks aktualnya (bukan angka tetap),
      // supaya latar tidak pernah lebih pendek dari kalimatnya.
      const titleW = cfg.title.length * 6.6 + 24;
      const descW = cfg.desc.length * 5.75 + 22;
      const boxW = Math.min(Math.max(titleW, descW), INNER_W - 16);
      const boxH = 42;

      const px = xScale(cfg.year);
      const py = yScale(cfg.val);

      let boxX = px - boxW / 2;
      boxX = Math.min(Math.max(boxX, 4), INNER_W - boxW - 4);

      const preferAbove = py > 70;
      const boxY = preferAbove ? py - boxH - 14 : py + 14;

      const callout = annotations
        .append("g")
        .attr("transform", `translate(${boxX}, ${boxY})`);

      callout
        .append("rect")
        .attr("class", "annotation-box")
        .attr("width", boxW)
        .attr("height", boxH);

      callout
        .append("text")
        .attr("class", "annotation-year")
        .attr("x", 10)
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
    <section ref={sectionRef} className="lii-section">
      {/* SISI KIRI: sticky — judul, meta, dan chart tidak ikut ter-scroll */}
      <div className="visual-container">
        <div className="chart-header">
          <h2 className="font-bungee color-pink">Laju Indeks Implisit PDRB</h2>
          <p className="meta-info">
            Periode 2016–2025 · 17 lapangan usaha, Provinsi Jawa Tengah
          </p>
        </div>
        <div ref={chartRef} className="chart-box" />
      </div>

      {/* SISI KANAN: narrative track */}
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
        .lii-section {
          display: flex;
          position: relative;
          background-color: #ffffff;
          min-height: 100vh;
          font-family: "Jost", var(--font-sans), sans-serif;
          color: #282828;
          line-height: 1.6;
        }

        .lii-section .visual-container {
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

        .lii-section .chart-header {
          width: 100%;
          max-width: 760px;
          margin-bottom: 0.75rem;
        }

        .lii-section .chart-header h2 {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .lii-section .chart-header .meta-info {
          font-size: 13px;
          color: #9ca3af;
          font-weight: 500;
          margin-top: 4px;
        }

        .lii-section .chart-box {
          width: 100%;
          max-width: 760px;
          height: 480px;
          position: relative;
        }

        .lii-section .chart-box svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .lii-section .narrative-track {
          width: 40%;
          position: relative;
          z-index: 2;
          padding: 35vh 3.5rem 50vh 1.5rem;
        }

        .lii-section .step-card {
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

        .lii-section .step-card.is-active {
          opacity: 1;
          transform: translateY(0);
          border-color: #cbd5e1;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
        }

        .lii-section .step-card p {
          font-size: 1.05rem;
          line-height: 1.75;
          color: #374151;
          margin-bottom: 1rem;
        }

        .lii-section .step-card p:last-child {
          margin-bottom: 0;
        }

        .lii-section .hl {
          display: inline-block;
          padding: 0.15em 0.45em;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.95em;
        }
        .lii-section .hl-red-krisis {
          background-color: #fee2e2;
          color: #991b1b;
        }
        .lii-section .hl-green-peak {
          background-color: #dcfce7;
          color: #166534;
        }
        .lii-section .hl-magenta-base {
          background-color: #fce7f3;
          color: #9d174d;
        }
        .lii-section .hl-orange-gap {
          background-color: #ffedd5;
          color: #9a3412;
        }
        .lii-section .hl-orange-end {
          background-color: #ffedd5;
          color: #c2410c;
        }
        .lii-section .hl-red-bold {
          background-color: #fee2e2;
          color: #b91c1c;
          font-weight: 700;
        }

        .lii-section .grid-line {
          stroke: #e2e8f0;
          stroke-dasharray: 4 4;
        }
        .lii-section .axis text {
          font-family: "Jost", var(--font-sans), sans-serif;
          font-size: 11px;
          fill: #94a3b8;
          font-weight: 500;
        }
        .lii-section .axis path,
        .lii-section .axis line {
          display: none;
        }
        .lii-section .axis-baseline {
          stroke: #cbd5e1;
          stroke-width: 2px;
        }

        .lii-section .rank-line {
          fill: none;
          stroke: #4d9221;
          stroke-width: 2.25px;
          stroke-linecap: square;
        }
        .lii-section .season-circle {
          fill: #c51b7d;
          stroke: #ffffff;
          stroke-width: 2px;
          transition:
            fill 0.25s,
            stroke 0.25s;
        }
        .lii-section .season-circle.is-peak {
          fill: #c51b7d;
        }
        .lii-section .season-circle.active-step {
          fill: #c51b7d !important;
          stroke: #cffafe !important;
          stroke-width: 3.5px !important;
        }

        .lii-section .g-annotations {
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.45s ease;
        }
        .lii-section .g-annotations.is-visible {
          opacity: 1;
        }
        .lii-section .annotation-box {
          fill: #ffffff;
          stroke: rgba(0, 0, 0, 0.12);
          stroke-width: 1px;
          filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.05));
          rx: 3px;
        }
        .lii-section .annotation-year {
          font-size: 11px;
          font-weight: 700;
          fill: #9d174d;
        }
        .lii-section .annotation-text {
          font-size: 11px;
          font-weight: 400;
          fill: #475569;
        }

        @media (max-width: 880px) {
          .lii-section {
            flex-direction: column;
          }
          .lii-section .visual-container {
            width: 100%;
            height: auto;
            position: relative;
            padding: 1.5rem 1rem 0.5rem 1rem;
          }
          .lii-section .chart-box {
            height: 340px;
          }
          .lii-section .narrative-track {
            width: 100%;
            padding: 5vh 1.5rem 50vh 1.5rem;
          }
          .lii-section .step-card {
            margin-bottom: 55vh;
          }
        }
      `}</style>
    </section>
  );
}
