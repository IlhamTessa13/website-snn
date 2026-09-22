"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import * as d3 from "d3";
import { pdrbPerKapitaData } from "@/data/pdrbPerKapita";

/* ================================================================== */
/* Geometri chart — viewBox tetap, SVG di-scale oleh browser.         */
/* ================================================================== */

const WIDTH = 760;
const HEIGHT = 480;
const MARGIN = { top: 25, right: 30, bottom: 50, left: 62 };
const INNER_W = WIDTH - MARGIN.left - MARGIN.right;
const INNER_H = HEIGHT - MARGIN.top - MARGIN.bottom;

// Domain sumbu dalam "ribu rupiah" (satuan asli data), label ditampilkan
// dalam "juta rupiah" (dibagi 1000) agar mudah dibaca.
const X_DOMAIN: [number, number] = [0, 180_000];
const Y_DOMAIN: [number, number] = [0, 115_000];
const X_TICKS = [0, 25_000, 50_000, 75_000, 100_000, 125_000, 150_000, 175_000];
const Y_TICKS = [0, 20_000, 40_000, 60_000, 80_000, 100_000];

const xScale = d3.scaleLinear().domain(X_DOMAIN).range([0, INNER_W]);
const yScale = d3.scaleLinear().domain(Y_DOMAIN).range([INNER_H, 0]);

function juta(v: number) {
  return d3.format(",.0f")(v / 1000);
}

function shortLabel(name: string) {
  return name.replace(/^Kab\.\s*/, "");
}

/* ================================================================== */
/* Titik data & garis regresi — dihitung dari data asli, bukan angka   */
/* tetap, supaya selalu akurat mengikuti pdrbPerKapita.ts.             */
/* ================================================================== */

interface ScatterPoint {
  name: string;
  x: number; // PDRB per kapita ADHB (ribu rupiah)
  y: number; // PDRB per kapita ADHK (ribu rupiah)
}

const points: ScatterPoint[] = pdrbPerKapitaData.map((d) => ({
  name: d.name,
  x: d.pdrbAdhb,
  y: d.pdrbAdhk,
}));

// Urutan kemunculan animasi: dari nilai terendah ke tertinggi.
const pointsAscending = [...points].sort((a, b) => a.x - b.x);

// Regresi linear sederhana (least squares) dari data yang sama persis
// dengan yang dipakai untuk menggambar titik — bukan garis dekoratif.
function linreg(pts: ScatterPoint[]) {
  const n = pts.length;
  const sumX = pts.reduce((s, p) => s + p.x, 0);
  const sumY = pts.reduce((s, p) => s + p.y, 0);
  const sumXY = pts.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = pts.reduce((s, p) => s + p.x * p.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

const { slope, intercept } = linreg(points);
const minX = d3.min(points, (p) => p.x)!;
const maxX = d3.max(points, (p) => p.x)!;
const trendLinePoints: ScatterPoint[] = [
  { name: "trend-start", x: minX, y: slope * minX + intercept },
  { name: "trend-end", x: maxX, y: slope * maxX + intercept },
];

const lineGenerator = d3
  .line<ScatterPoint>()
  .x((d) => xScale(d.x))
  .y((d) => yScale(d.y));

/* ================================================================== */
/* Narasi                                                              */
/* ================================================================== */

type Tone = "green" | "magenta";
interface FocusRegion {
  region: string;
  tone: Tone;
}
interface StepDef {
  id: number;
  title: string;
  content: ReactNode;
  focus: FocusRegion[];
}

const steps: StepDef[] = [
  {
    id: 0,
    title: "Dua Ukuran, Satu Peta Kesenjangan",
    content: (
      <>
        <p>
          Diagram pencar (scatter plot) berikut memetakan{" "}
          <strong>35 kabupaten/kota</strong> di Jawa Tengah berdasarkan dua
          indikator PDRB per kapita tahun 2025: Atas Dasar Harga Berlaku (ADHB)
          pada sumbu horizontal, dan Atas Dasar Harga Konstan (ADHK) pada sumbu
          vertikal.
        </p>
        <p>
          Setiap titik mewakili satu wilayah.{" "}
          <strong>
            Semakin jauh sebuah titik berada dari kerumunan utama, semakin
            ekstrem posisi wilayah tersebut
          </strong>{" "}
          dibandingkan dengan capaian rata-rata provinsi.
        </p>
      </>
    ),
    focus: [],
  },
  {
    id: 1,
    title: "Korelasi yang Hampir Sempurna",
    content: (
      <>
        <p>
          Uji korelasi Pearson terhadap 35 observasi menghasilkan koefisien{" "}
          <span className="hl hl-green-peak">r = 0,99</span>. Ini berarti
          sekitar <span className="hl hl-orange-gap">99% variasi</span> PDRB per
          kapita ADHK dapat dijelaskan oleh PDRB per kapita ADHB semata.
        </p>
        <p>
          Garis tren pada diagram menunjukkan bahwa secara rata-rata, PDRB per
          kapita ADHK setara dengan{" "}
          <span className="hl hl-magenta-base">±63% dari nilai ADHB</span>-nya —
          rasio deflator yang relatif konsisten di seluruh wilayah.{" "}
          <strong>
            Artinya, peringkat kemakmuran antarwilayah bersifat konsisten dan
            tidak sensitif terhadap basis harga yang digunakan.
          </strong>
        </p>
      </>
    ),
    focus: [],
  },
  {
    id: 2,
    title: "Tiga Pusat Ekonomi Terkuat",
    content: (
      <>
        <p>
          Tiga wilayah tampak sebagai pencilan (outlier) yang jauh di atas
          kerumunan utama:{" "}
          <span className="hl hl-green-peak">Kota Semarang</span>,{" "}
          <span className="hl hl-green-peak">Kabupaten Kudus</span>, dan{" "}
          <span className="hl hl-green-peak">Kota Surakarta</span>.
        </p>
        <p>
          <strong>Kota Semarang</strong> memimpin dengan PDRB per kapita ADHB
          sebesar Rp167,24 juta, ditopang sektor jasa dan pemerintahan provinsi.{" "}
          <strong>Kabupaten Kudus</strong> (Rp148,38 juta) unggul berkat
          industri rokok dan manufaktur padat modal, sementara{" "}
          <strong>Kota Surakarta</strong> (Rp130,02 juta) digerakkan oleh sektor
          perdagangan dan jasa perkotaan.
        </p>
      </>
    ),
    focus: [
      { region: "Kota Semarang", tone: "green" },
      { region: "Kab. Kudus", tone: "green" },
      { region: "Kota Surakarta", tone: "green" },
    ],
  },
  {
    id: 3,
    title: "Wilayah dengan Kesenjangan Terbesar",
    content: (
      <>
        <p>
          Di ujung yang berlawanan,{" "}
          <span className="hl hl-magenta-base">Kabupaten Pemalang</span> dan{" "}
          <span className="hl hl-magenta-base">Kabupaten Grobogan</span>{" "}
          menempati posisi terendah, dengan basis ekonomi agraris dan jumlah
          penduduk yang relatif besar.
        </p>
        <p>
          Selisih antara wilayah tertinggi (Kota Semarang: Rp167,24 juta) dan
          terendah (Kabupaten Pemalang: Rp24,05 juta) mencapai{" "}
          <span className="hl hl-red-bold">Rp143,19 juta</span> — atau{" "}
          <strong>hampir 7 kali lipat</strong>. Kesenjangan sebesar ini
          menggarisbawahi bahwa manfaat pertumbuhan ekonomi provinsi belum
          terdistribusi secara merata.
        </p>
      </>
    ),
    focus: [
      { region: "Kab. Pemalang", tone: "magenta" },
      { region: "Kab. Grobogan", tone: "magenta" },
    ],
  },
  {
    id: 4,
    title: "Konsentrasi di Balik Korelasi yang Kuat",
    content: (
      <>
        <p>
          Korelasi yang sangat kuat antara ADHB dan ADHK menunjukkan bahwa
          persoalan utamanya <strong>bukan pada basis harga</strong>, melainkan
          pada <strong>struktur spasial ekonomi itu sendiri</strong>.
        </p>
        <p>
          Rasio hampir 7× antara wilayah tertinggi dan terendah mengindikasikan
          bahwa nilai tambah ekonomi Jawa Tengah masih terkonsentrasi pada
          sejumlah kecil pusat urban dan industri, sementara mayoritas kabupaten
          berbasis agraris tertinggal jauh di bawah garis tren.
        </p>
      </>
    ),
    focus: [],
  },
];

/* ================================================================== */
/* Komponen                                                            */
/* ================================================================== */

export default function PdrbPerKapitaScatter() {
  const sectionRef = useRef<HTMLElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const [activeStep, setActiveStep] = useState(-1); // step mentah hasil scroll (native)

  const d3Ref = useRef<{
    dots: d3.Selection<SVGCircleElement, ScatterPoint, SVGGElement, unknown>;
    labels: d3.Selection<SVGTextElement, ScatterPoint, SVGGElement, unknown>;
    trendPath: d3.Selection<SVGPathElement, ScatterPoint[], null, undefined>;
    totalLength: number;
    introStarted: boolean;
    introDone: boolean;
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

    // Grid horizontal & vertikal
    const gridGroup = g.append("g").attr("class", "grid-group");
    Y_TICKS.forEach((v) => {
      gridGroup
        .append("line")
        .attr("class", "grid-line")
        .attr("x1", 0)
        .attr("x2", INNER_W)
        .attr("y1", yScale(v))
        .attr("y2", yScale(v));
    });
    X_TICKS.forEach((v) => {
      gridGroup
        .append("line")
        .attr("class", "grid-line grid-line-v")
        .attr("x1", xScale(v))
        .attr("x2", xScale(v))
        .attr("y1", 0)
        .attr("y2", INNER_H);
    });

    // Sumbu dasar
    g.append("line")
      .attr("class", "axis-baseline")
      .attr("x1", 0)
      .attr("x2", INNER_W)
      .attr("y1", INNER_H)
      .attr("y2", INNER_H);
    g.append("line")
      .attr("class", "axis-baseline")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", INNER_H);

    // Label sumbu Y
    const yAxisGroup = g.append("g").attr("class", "axis y-axis");
    Y_TICKS.forEach((v) => {
      yAxisGroup
        .append("text")
        .attr("x", -12)
        .attr("y", yScale(v) + 4)
        .attr("text-anchor", "end")
        .text(juta(v));
    });
    yAxisGroup
      .append("text")
      .attr("class", "axis-title")
      .attr("transform", `translate(${-46}, ${INNER_H / 2}) rotate(-90)`)
      .attr("text-anchor", "middle")
      .text("PDRB per Kapita ADHK (Rp juta)");

    // Label sumbu X
    const xAxisGroup = g.append("g").attr("class", "axis x-axis");
    X_TICKS.forEach((v) => {
      xAxisGroup
        .append("text")
        .attr("x", xScale(v))
        .attr("y", INNER_H + 20)
        .attr("text-anchor", "middle")
        .text(juta(v));
    });
    xAxisGroup
      .append("text")
      .attr("class", "axis-title")
      .attr("x", INNER_W / 2)
      .attr("y", INNER_H + 42)
      .attr("text-anchor", "middle")
      .text("PDRB per Kapita ADHB (Rp juta)");

    // Garis tren (tersembunyi via stroke-dashoffset)
    const trendPath = g
      .append("path")
      .datum(trendLinePoints)
      .attr("class", "trend-line")
      .attr("d", lineGenerator);

    const totalLength = trendPath.node()!.getTotalLength();
    trendPath
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength);

    // Titik data (r = 0 di awal)
    const dots = g
      .append("g")
      .attr("class", "g-dots")
      .selectAll<SVGCircleElement, ScatterPoint>(".scatter-dot")
      .data(points, (d) => d.name)
      .enter()
      .append("circle")
      .attr("class", "scatter-dot")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 0);

    // Label nama (muncul hanya saat wilayah di-highlight narasi)
    const labels = g
      .append("g")
      .attr("class", "g-labels")
      .selectAll<SVGTextElement, ScatterPoint>(".dot-label")
      .data(points, (d) => d.name)
      .enter()
      .append("text")
      .attr("class", "dot-label")
      .attr("x", (d) => xScale(d.x))
      .attr("y", (d) => yScale(d.y) - 12)
      .attr("text-anchor", "middle")
      .attr("opacity", 0);

    d3Ref.current = {
      dots,
      labels,
      trendPath,
      totalLength,
      introStarted: false,
      introDone: false,
    };

    return () => {
      svg.remove();
      d3Ref.current = null;
    };
  }, []);

  /* ---------- 2. Observer scroll (step mentah) ----------
     Melacak rasio kemunculan SETIAP step (bukan hanya event yang baru saja
     terjadi), lalu memilih step dengan rasio kemunculan terbesar. Ini
     mencegah bug "hanya narasi terakhir yang muncul" saat scroll cepat,
     yang terjadi karena beberapa step bisa terdeteksi intersecting dalam
     satu callback yang sama, dan step yang diproses paling akhir asal
     menang meski bukan yang paling terlihat. */
  useEffect(() => {
    const container = sectionRef.current;
    if (!container) return;

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("[data-step]"),
    );
    const ratios = new Map<number, number>();
    cards.forEach((c) => ratios.set(parseInt(c.dataset.step || "0", 10), 0));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const s = parseInt(
            (entry.target as HTMLElement).dataset.step || "0",
            10,
          );
          ratios.set(s, entry.isIntersecting ? entry.intersectionRatio : 0);

          // Reset intro HANYA saat scroll balik ke atas step pertama —
          // bukan saat scroll masuk ke padding-bottom kosong di akhir
          // narrative-track, supaya grafik tidak tiba-tiba "reset" saat
          // sedang menampilkan peta sendirian setelah narasi terakhir.
          if (
            s === 0 &&
            !entry.isIntersecting &&
            entry.boundingClientRect.top > 0
          ) {
            setActiveStep(-1);
          }
        });

        let best = -1;
        let bestRatio = 0;
        ratios.forEach((ratio, s) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = s;
          }
        });
        // Kalau tidak ada step yang intersecting (mis. sedang di padding
        // kosong akhir), JANGAN ubah activeStep — biarkan tetap di step
        // terakhir yang aktif (persis pola di Laju Indeks Implisit /
        // Sumber Pertumbuhan PDRB).
        if (best >= 0) setActiveStep(best);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  /* ---------- 3. (dihapus) ----------
     Sebelumnya di sini ada mekanisme "kartu sticky tunggal yang isinya
     diganti via JS transition". Itu diganti total: sekarang SEMUA kartu
     narasi dirender biasa, tersusun ke bawah (seperti section "Sumber
     Pertumbuhan PDRB") — geraknya jadi murni scroll asli browser, selalu
     pas mengikuti kecepatan scroll, dan narasi berikutnya otomatis "masuk
     dari bawah" begitu narasi sebelumnya discroll lewat ke atas. Highlight
     kartu aktif ditentukan langsung dari `activeStep` (lihat JSX & efek
     highlight titik di bawah). */

  /* ---------- 4. Intro & reset animasi chart (mengikuti scroll mentah) ---------- */
  useEffect(() => {
    const api = d3Ref.current;
    if (!api) return;
    const { dots, trendPath, totalLength } = api;

    if (activeStep < 0) {
      api.introStarted = false;
      api.introDone = false;
      dots.interrupt().attr("r", 0);
      trendPath.interrupt().attr("stroke-dashoffset", totalLength);
      return;
    }

    if (activeStep === 0 && !api.introStarted) {
      api.introStarted = true;

      // Urutan kemunculan: nilai terendah → tertinggi (pointsAscending).
      const orderIndex = new Map(pointsAscending.map((p, i) => [p.name, i]));

      dots
        .transition()
        .duration(220)
        .delay(
          (d) =>
            ((orderIndex.get(d.name) ?? 0) / pointsAscending.length) * 1400,
        )
        .ease(d3.easeCubicIn)
        .attr("r", 4);

      trendPath
        .transition()
        .duration(1600)
        .delay(1650)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .on("end", () => {
          if (d3Ref.current) d3Ref.current.introDone = true;
        });
    } else if (!api.introDone) {
      dots.interrupt().attr("r", 4);
      trendPath.interrupt().attr("stroke-dashoffset", 0);
      api.introStarted = true;
      api.introDone = true;
    }
  }, [activeStep]);

  /* ---------- 5. Highlight titik (mengikuti step yang sedang di-scroll) ---------- */
  useEffect(() => {
    const api = d3Ref.current;
    if (!api) return;
    const { dots, labels } = api;
    const step = steps[activeStep];

    dots
      .classed("dot-highlight", false)
      .classed("tone-green", false)
      .classed("tone-magenta", false);
    labels.attr("opacity", 0);

    if (!step || step.focus.length === 0) return;

    const focusNames = new Map(step.focus.map((f) => [f.region, f.tone]));

    dots
      .filter((d) => focusNames.has(d.name))
      .classed("dot-highlight", true)
      .each(function (d) {
        const tone = focusNames.get(d.name);
        d3.select(this).classed(`tone-${tone}`, true);
      });

    // Susun posisi label agar tidak bertumpuk saat titik yang di-highlight
    // saling berdekatan (mis. Kudus & Surakarta, Pemalang & Grobogan):
    // diurutkan berdasarkan posisi-x lalu diselang-seling atas/bawah.
    const focusedSorted = points
      .filter((p) => focusNames.has(p.name))
      .sort((a, b) => xScale(a.x) - xScale(b.x));
    const dyByName = new Map<string, number>();
    focusedSorted.forEach((p, i) => {
      dyByName.set(p.name, i % 2 === 0 ? -16 : 22);
    });

    labels
      .filter((d) => focusNames.has(d.name))
      .text((d) => `${shortLabel(d.name)}: Rp${juta(d.x)} jt`)
      .attr("y", (d) => yScale(d.y) + (dyByName.get(d.name) ?? -16))
      .transition()
      .duration(300)
      .attr("opacity", 1);
  }, [activeStep]);

  return (
    <section ref={sectionRef} className="kapita-scatter-section">
      {/* SISI KIRI: sticky visual (60%) */}
      <div className="visual-container">
        <div className="chart-header">
          <h2 className="font-bungee color-pink">
            PDRB Per Kapita:{" "}
            <span className="font-bungee color-green">
              Seberapa Jauh Kesenjangan Antarwilayah?
            </span>
          </h2>
          <p className="meta-info">
            Scatter plot ADHB × ADHK · 35 kabupaten/kota · 2025
          </p>
        </div>
        <div ref={chartRef} className="chart-box" />
      </div>

      {/* SISI KANAN: narrative track (40%) — SEMUA kartu dirender biasa,
          tersusun ke bawah, PERSIS pola "Laju Indeks Implisit": scroll asli
          browser yang menggerakkan kartu naik/turun (bukan JS-transition),
          ditambah efek meredup/menyala (opacity + translateY) saat sebuah
          kartu jadi yang paling terlihat di layar. */}
      <div className="narrative-track">
        {steps.map((s, idx) => {
          const on = activeStep === idx;
          return (
            <div
              key={s.id}
              data-step={idx}
              className={`step-card${on ? " is-active" : ""}`}
            >

              <h3 className="step-title">{s.title}</h3>
              {s.content}
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .kapita-scatter-section {
          display: flex;
          position: relative;
          background-color: #ffffff;
          min-height: 100vh;
          font-family: "Jost", var(--font-sans), sans-serif;
          color: #282828;
          line-height: 1.6;
        }

        .kapita-scatter-section .visual-container {
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

        .kapita-scatter-section .chart-header {
          width: 100%;
          max-width: 760px;
          margin-bottom: 0.5rem;
        }

        .kapita-scatter-section .chart-header h2 {
          font-size: 26px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.02em;
          line-height: 1.25;
        }

        .kapita-scatter-section .chart-header .meta-info {
          font-size: 13px;
          color: #9ca3af;
          font-weight: 500;
          margin-top: 4px;
        }

        .kapita-scatter-section .chart-box {
          width: 100%;
          max-width: 760px;
          height: 480px;
          position: relative;
        }

        .kapita-scatter-section .chart-box svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        /* ---------- Narrative track ----------
           Sama seperti pola "Sumber Pertumbuhan PDRB": semua kartu
           dirender biasa (tersusun ke bawah). Gerak naik/turunnya MURNI
           scroll asli browser (tidak ada JS-transition) — nilai padding,
           margin-bottom, opacity, dan transform di bawah ini SENGAJA
           disamakan persis dengan section "Laju Indeks Implisit". */
        .kapita-scatter-section .narrative-track {
          width: 40%;
          position: relative;
          z-index: 2;
          padding: 35vh 3.5rem 50vh 1.5rem;
        }

        .kapita-scatter-section .step-card {
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

        .kapita-scatter-section .step-card.is-active {
          opacity: 1;
          transform: translateY(0);
          border-color: #cbd5e1;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
        }

        .kapita-scatter-section .step-card .eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #33c6ce;
          margin-bottom: 6px;
        }

        .kapita-scatter-section .step-card .step-title {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .kapita-scatter-section .step-card p {
          font-size: 1.05rem;
          line-height: 1.75;
          color: #374151;
          margin-bottom: 1rem;
        }

        .kapita-scatter-section .step-card p:last-child {
          margin-bottom: 0;
        }

        /* Highlight badges — identik dengan Indeks Williamson */
        .kapita-scatter-section .hl {
          display: inline-block;
          padding: 0.15em 0.45em;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.95em;
        }
        .kapita-scatter-section .hl-green-peak {
          background-color: #dcfce7;
          color: #166534;
        }
        .kapita-scatter-section .hl-magenta-base {
          background-color: #fce7f3;
          color: #9d174d;
        }
        .kapita-scatter-section .hl-orange-gap {
          background-color: #ffedd5;
          color: #9a3412;
        }
        .kapita-scatter-section .hl-red-bold {
          background-color: #fee2e2;
          color: #b91c1c;
          font-weight: 700;
        }

        /* ---------- Sumbu & grid ---------- */
        .kapita-scatter-section .grid-line {
          stroke: #e2e8f0;
          stroke-dasharray: 4 4;
        }
        .kapita-scatter-section .grid-line-v {
          stroke: #eef2f6;
        }
        .kapita-scatter-section .axis text {
          font-family: "Jost", var(--font-sans), sans-serif;
          font-size: 11px;
          fill: #94a3b8;
          font-weight: 500;
        }
        .kapita-scatter-section .axis-title {
          font-size: 11.5px !important;
          fill: #6b7280 !important;
          font-weight: 600 !important;
          letter-spacing: 0.02em;
        }
        .kapita-scatter-section .axis-baseline {
          stroke: #cbd5e1;
          stroke-width: 2px;
        }

        /* ---------- Garis tren & titik ---------- */
        .kapita-scatter-section .trend-line {
          fill: none;
          stroke: #4d9221;
          stroke-width: 2.25px;
          stroke-linecap: round;
        }
        .kapita-scatter-section .scatter-dot {
          fill: #c51b7d;
          stroke: #ffffff;
          stroke-width: 1.5px;
          transition:
            fill 0.25s,
            stroke 0.25s;
        }

        @keyframes kapitaPulse {
          0% {
            r: 4px;
            opacity: 1;
          }
          50% {
            r: 9px;
            opacity: 0.75;
          }
          100% {
            r: 4px;
            opacity: 1;
          }
        }
        .kapita-scatter-section .scatter-dot.dot-highlight {
          animation: kapitaPulse 1.4s infinite ease-in-out;
          stroke: #111827;
          stroke-width: 2px;
        }
        .kapita-scatter-section .scatter-dot.dot-highlight.tone-green {
          fill: #166534;
        }
        .kapita-scatter-section .scatter-dot.dot-highlight.tone-magenta {
          fill: #9d174d;
        }

        .kapita-scatter-section .dot-label {
          pointer-events: none;
          font-size: 11px;
          font-weight: 700;
          fill: #111827;
          text-shadow:
            0 1px 2px #fff,
            0 -1px 2px #fff,
            1px 0 2px #fff,
            -1px 0 2px #fff;
        }

        @media (max-width: 880px) {
          .kapita-scatter-section {
            flex-direction: column;
          }
          .kapita-scatter-section .visual-container {
            width: 100%;
            height: 52vh;
            padding: 1.5rem 1rem 0.5rem 1rem;
          }
          .kapita-scatter-section .chart-box {
            height: 100%;
          }
          .kapita-scatter-section .narrative-track {
            width: 100%;
            padding: 5vh 1.5rem 50vh 1.5rem;
          }
          .kapita-scatter-section .step-card {
            margin-bottom: 55vh;
          }
        }
      `}</style>
    </section>
  );
}
