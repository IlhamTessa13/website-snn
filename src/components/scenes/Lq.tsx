"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface LqSector {
  code: string;
  name: string;
  icon: string;
  pre: number;
  post: number;
  series: number[];
  delta?: number;
  isGaining?: boolean;
}

const lqDataRaw: LqSector[] = [
  {
    code: "A",
    name: "Pertanian, Kehutanan, & Perikanan",
    icon: "🌾",
    pre: 1.032,
    post: 1.011,
    series: [
      1.067, 1.044, 1.03, 1.004, 1.016, 1.009, 1.015, 1.007, 1.015, 1.008,
    ],
  },
  {
    code: "B",
    name: "Pertambangan & Penggalian",
    icon: "⛏️",
    pre: 0.291,
    post: 0.27,
    series: [0.278, 0.29, 0.29, 0.295, 0.301, 0.303, 0.272, 0.26, 0.255, 0.262],
  },
  {
    code: "C",
    name: "Industri Pengolahan",
    icon: "🏭",
    pre: 1.633,
    post: 1.602,
    series: [
      1.63, 1.628, 1.627, 1.642, 1.637, 1.626, 1.61, 1.607, 1.594, 1.571,
    ],
  },
  {
    code: "D",
    name: "Pengadaan Listrik & Gas",
    icon: "⚡",
    pre: 0.107,
    post: 0.114,
    series: [
      0.103, 0.107, 0.106, 0.108, 0.113, 0.114, 0.111, 0.113, 0.115, 0.116,
    ],
  },
  {
    code: "E",
    name: "Pengadaan Air & Pengelolaan Sampah",
    icon: "💧",
    pre: 0.853,
    post: 0.822,
    series: [
      0.858, 0.873, 0.866, 0.843, 0.827, 0.837, 0.819, 0.813, 0.82, 0.821,
    ],
  },
  {
    code: "F",
    name: "Konstruksi",
    icon: "🏗️",
    pre: 1.036,
    post: 1.095,
    series: [1.04, 1.041, 1.04, 1.029, 1.03, 1.079, 1.077, 1.09, 1.1, 1.127],
  },
  {
    code: "G",
    name: "Perdagangan Besar & Eceran",
    icon: "🛒",
    pre: 1.099,
    post: 1.118,
    series: [
      1.079, 1.092, 1.099, 1.11, 1.116, 1.133, 1.12, 1.122, 1.115, 1.103,
    ],
  },
  {
    code: "H",
    name: "Transportasi & Pergudangan",
    icon: "🚆",
    pre: 0.792,
    post: 0.862,
    series: [
      0.833, 0.815, 0.817, 0.831, 0.665, 0.668, 0.964, 0.915, 0.89, 0.871,
    ],
  },
  {
    code: "I",
    name: "Penyediaan Akomodasi & Makan Minum",
    icon: "🍽️",
    pre: 1.086,
    post: 1.235,
    series: [
      1.046, 1.055, 1.078, 1.108, 1.143, 1.17, 1.222, 1.237, 1.256, 1.29,
    ],
  },
  {
    code: "J",
    name: "Informasi & Komunikasi",
    icon: "💻",
    pre: 0.929,
    post: 0.983,
    series: [
      0.865, 0.892, 0.936, 0.951, 1.001, 0.997, 0.949, 0.977, 0.995, 0.997,
    ],
  },
  {
    code: "K",
    name: "Jasa Keuangan & Asuransi",
    icon: "🏦",
    pre: 0.676,
    post: 0.64,
    series: [
      0.691, 0.688, 0.683, 0.661, 0.658, 0.661, 0.652, 0.636, 0.621, 0.629,
    ],
  },
  {
    code: "L",
    name: "Real Estat",
    icon: "🏠",
    pre: 0.646,
    post: 0.691,
    series: [
      0.629, 0.646, 0.658, 0.654, 0.642, 0.64, 0.661, 0.697, 0.721, 0.734,
    ],
  },
  {
    code: "M,N",
    name: "Jasa Perusahaan",
    icon: "💼",
    pre: 0.212,
    post: 0.211,
    series: [
      0.211, 0.212, 0.213, 0.213, 0.21, 0.216, 0.211, 0.209, 0.211, 0.208,
    ],
  },
  {
    code: "O",
    name: "Administrasi Pemerintahan",
    icon: "🏛️",
    pre: 0.771,
    post: 0.758,
    series: [
      0.789, 0.792, 0.766, 0.756, 0.75, 0.751, 0.744, 0.764, 0.772, 0.758,
    ],
  },
  {
    code: "P",
    name: "Jasa Pendidikan",
    icon: "📚",
    pre: 1.233,
    post: 1.309,
    series: [
      1.19, 1.225, 1.252, 1.263, 1.235, 1.239, 1.252, 1.305, 1.366, 1.382,
    ],
  },
  {
    code: "Q",
    name: "Jasa Kesehatan & Kegiatan Sosial",
    icon: "🏥",
    pre: 0.756,
    post: 0.673,
    series: [
      0.751, 0.762, 0.773, 0.757, 0.738, 0.672, 0.671, 0.679, 0.674, 0.668,
    ],
  },
  {
    code: "R,S,T,U",
    name: "Jasa Lainnya",
    icon: "🎨",
    pre: 0.938,
    post: 0.88,
    series: [
      0.949, 0.949, 0.952, 0.936, 0.903, 0.892, 0.911, 0.886, 0.863, 0.847,
    ],
  },
];

const narrativeSteps = [
  {
    step: 1,
    tag: "Pergeseran Relatif",
    title: "Membandingkan Pergeseran Nilai LQ",
    texts: [
      "Struktur lapangan usaha di Jawa Tengah menunjukkan adanya dinamika pergeseran konsentrasi ekonomi antarsektor terhadap rata-rata nasional. Sebagian sektor mengalami peningkatan daya saing relatif, sementara beberapa sektor lainnya melemah.",
    ],
  },
  {
    step: 2,
    tag: "Sektor Kunci Tertekan",
    title: "Sektor Pertanian Mendekati Ambang Batas",
    texts: [
      { html: true, content: "sektorA" },
      "Laju pertumbuhan sektor pertanian di Jawa Tengah bergerak lebih lambat dibanding rata-rata nasional, membuat keunggulan komparatifnya kian menipis.",
    ],
  },
  {
    step: 3,
    tag: "Akselerasi Pascapandemi",
    title: "Peningkatan pada Sektor Jasa dan Konstruksi",
    texts: [{ html: true, content: "sektorIPF" }],
  },
  {
    step: 4,
    tag: "Dinamika Non-Basis",
    title: "Volatilitas Sektor Selama Periode Krisis",
    texts: [{ html: true, content: "sektorJH" }],
  },
  {
    step: 5,
    tag: "Catatan Kebijakan",
    title: "Kesimpulan Transformasi Sektoral",
    texts: [
      "Perencanaan pembangunan perlu difokuskan pada penguatan sektor pertanian agar tidak kehilangan status basisnya, sembari mengoptimalkan sektor jasa yang terus menunjukkan tren pertumbuhan relatif positif.",
      {
        small: true,
        content:
          "Arahkan kursor pada kode sektor di grafik untuk melihat tren tahunan 2016–2025 secara mendalam.",
      },
    ],
  },
];

type ChartHandles = {
  xScale: d3.ScaleLinear<number, number>;
  bars: d3.Selection<SVGLineElement, LqSector, SVGGElement, unknown>;
  preDots: d3.Selection<SVGCircleElement, LqSector, SVGGElement, unknown>;
  postDots: d3.Selection<SVGCircleElement, LqSector, SVGGElement, unknown>;
  labelGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
};

export default function Lq() {
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chartHandles = useRef<ChartHandles | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (!svgRef.current || !canvasRef.current || !tooltipRef.current) return;

    const lqData: LqSector[] = lqDataRaw.map((d) => ({ ...d }));
    lqData.forEach((d) => {
      d.delta = +(d.post - d.pre).toFixed(3);
      d.isGaining = (d.delta as number) >= 0;
    });
    lqData.sort((a, b) => (b.delta as number) - (a.delta as number));

    const width = 1050;
    const height = 440;
    const margin = { top: 30, right: 40, bottom: 30, left: 80 };

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`);
    svg.selectAll("*").remove();
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().domain([0, 1.8]).range([0, innerW]);
    const yScale = d3
      .scaleBand()
      .domain(lqData.map((d) => d.code))
      .range([0, innerH])
      .padding(0.4);

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(9)
      .tickFormat((d) => (d as number).toFixed(1));
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(xAxis)
      .attr("color", "#9ca3af")
      .selectAll("text")
      .attr("font-family", "Jost")
      .attr("font-size", "11px");

    g.append("g")
      .selectAll("line.grid-y")
      .data(lqData)
      .enter()
      .append("line")
      .attr("class", "grid-y")
      .attr("x1", 0)
      .attr("x2", innerW)
      .attr("y1", (d) => (yScale(d.code) as number) + yScale.bandwidth() / 2)
      .attr("y2", (d) => (yScale(d.code) as number) + yScale.bandwidth() / 2);

    g.append("line")
      .attr("class", "baseline-threshold")
      .attr("x1", xScale(1.0))
      .attr("x2", xScale(1.0))
      .attr("y1", -10)
      .attr("y2", innerH);

    g.append("text")
      .attr("class", "baseline-label")
      .attr("x", xScale(1.0))
      .attr("y", -16)
      .text("LQ = 1.00 (Basis)");

    const labelGroup = g.append("g").attr("class", "labels-group");
    labelGroup
      .selectAll("text.sector-label")
      .data(lqData)
      .enter()
      .append("text")
      .attr("class", "sector-label")
      .attr("x", -10)
      .attr("y", (d) => (yScale(d.code) as number) + yScale.bandwidth() / 2 + 4)
      .attr("text-anchor", "end")
      .text((d) => `${d.icon} (${d.code})`)
      .on("mouseenter", (e, d) => showSparklineTooltip(e, d))
      .on("mouseleave", hideTooltip);

    const barGroup = g.append("g").attr("class", "bars-group");
    const bars = barGroup
      .selectAll<SVGLineElement, LqSector>("line.connecting-bar")
      .data(lqData)
      .enter()
      .append("line")
      .attr("class", "connecting-bar")
      .attr("x1", (d) => xScale(d.pre))
      .attr("x2", (d) => xScale(d.pre))
      .attr("y1", (d) => (yScale(d.code) as number) + yScale.bandwidth() / 2)
      .attr("y2", (d) => (yScale(d.code) as number) + yScale.bandwidth() / 2)
      .attr("stroke", (d) => (d.isGaining ? "#4d9221" : "#c51b7d"))
      .attr("opacity", 0.6);

    const preDots = g
      .append("g")
      .selectAll<SVGCircleElement, LqSector>("circle.dot-pre")
      .data(lqData)
      .enter()
      .append("circle")
      .attr("class", "dot-pre")
      .attr("cx", (d) => xScale(d.pre))
      .attr("cy", (d) => (yScale(d.code) as number) + yScale.bandwidth() / 2)
      .attr("r", 5)
      .on("mouseenter", (e, d) => showSparklineTooltip(e, d))
      .on("mouseleave", hideTooltip);

    const postDots = g
      .append("g")
      .selectAll<SVGCircleElement, LqSector>("circle.dot-post")
      .data(lqData)
      .enter()
      .append("circle")
      .attr("class", "dot-post")
      .attr("cx", (d) => xScale(d.pre))
      .attr("cy", (d) => (yScale(d.code) as number) + yScale.bandwidth() / 2)
      .attr("r", 5)
      .attr("fill", (d) => (d.isGaining ? "#4d9221" : "#c51b7d"))
      .on("mouseenter", (e, d) => showSparklineTooltip(e, d))
      .on("mouseleave", hideTooltip);

    function showSparklineTooltip(e: MouseEvent, d: LqSector) {
      const tooltip = tooltipRef.current!;
      const [mX, mY] = d3.pointer(e, canvasRef.current);
      tooltip.style.display = "block";
      tooltip.style.left = `${Math.min(mX + 15, width - 220)}px`;
      tooltip.style.top = `${Math.max(mY - 50, 10)}px`;

      const spW = 180,
        spH = 35;
      const spX = d3
        .scaleLinear()
        .domain([0, 9])
        .range([5, spW - 5]);
      const spY = d3
        .scaleLinear()
        .domain([d3.min(d.series)! * 0.95, d3.max(d.series)! * 1.05])
        .range([spH - 5, 5]);

      const sparkLineGen = d3
        .line<number>()
        .x((_val, idx) => spX(idx))
        .y((val) => spY(val));

      tooltip.innerHTML = `
        <div style="font-weight:700; color:#111; margin-bottom:2px;">${d.icon} (${d.code}) ${d.name}</div>
        <div style="color:#6b7280; margin-bottom:4px;">
          Pra: <strong>${d.pre.toFixed(3)}</strong> → Pasca: <strong>${d.post.toFixed(3)}</strong> (${(d.delta as number) > 0 ? "+" : ""}${d.delta})
        </div>
        <div style="font-size:10px; color:#4d9221; font-weight:600; margin-top:4px;">Tren Deret Waktu 10 Tahun (2016–2025):</div>
        <svg width="${spW}" height="${spH}" style="margin-top:2px;">
          <path d="${sparkLineGen(d.series)}" class="sparkline-path"></path>
        </svg>
        <div style="display:flex; justify-content:space-between; font-size:9px; color:#9ca3af;">
          <span>2016</span>
          <span style="color:#c51b7d; font-weight:700;">2020 (Krisis)</span>
          <span>2025</span>
        </div>
      `;
    }

    function hideTooltip() {
      tooltipRef.current!.style.display = "none";
    }

    chartHandles.current = { xScale, bars, preDots, postDots, labelGroup };
  }, []);

  useEffect(() => {
    const handles = chartHandles.current;
    if (!handles) return;
    const { xScale, bars, preDots, postDots, labelGroup } = handles;

    postDots.classed("dot-highlight", false);

    function focusSectors(codes: string[]) {
      bars
        .transition()
        .duration(400)
        .attr("x2", (d) => xScale(d.post))
        .attr("opacity", (d) => (codes.includes(d.code) ? 1 : 0.12))
        .attr("stroke-width", (d) => (codes.includes(d.code) ? 4.5 : 2));

      postDots
        .transition()
        .duration(400)
        .attr("cx", (d) => xScale(d.post))
        .attr("opacity", (d) => (codes.includes(d.code) ? 1 : 0.15))
        .attr("r", (d) => (codes.includes(d.code) ? 7 : 4));

      preDots
        .transition()
        .duration(400)
        .attr("opacity", (d) => (codes.includes(d.code) ? 1 : 0.15))
        .attr("r", (d) => (codes.includes(d.code) ? 6 : 4));

      postDots
        .filter((d) => codes.includes(d.code))
        .classed("dot-highlight", true);

      labelGroup
        .selectAll("text.sector-label")
        .attr("fill", (d: any) =>
          codes.includes(d.code) ? "#4d9221" : "#9ca3af",
        )
        .attr("font-weight", (d: any) =>
          codes.includes(d.code) ? "700" : "400",
        );
    }

    if (activeStep === 1) {
      bars
        .transition()
        .duration(800)
        .attr("x2", (d) => xScale(d.post))
        .attr("opacity", 0.7);
      postDots
        .transition()
        .duration(800)
        .attr("cx", (d) => xScale(d.post))
        .attr("opacity", 1)
        .attr("r", 5.5);
      preDots.transition().duration(800).attr("opacity", 1);
      labelGroup
        .selectAll("text.sector-label")
        .attr("fill", "#374151")
        .attr("font-weight", "600");
    } else if (activeStep === 2) {
      focusSectors(["A"]);
    } else if (activeStep === 3) {
      focusSectors(["I", "P", "F"]);
    } else if (activeStep === 4) {
      focusSectors(["J", "H"]);
    } else if (activeStep === 5) {
      bars
        .transition()
        .duration(400)
        .attr("x2", (d) => xScale(d.post))
        .attr("opacity", 0.75);
      postDots
        .transition()
        .duration(400)
        .attr("cx", (d) => xScale(d.post))
        .attr("opacity", 1);
      preDots.transition().duration(400).attr("opacity", 1);
      labelGroup
        .selectAll("text.sector-label")
        .attr("fill", "#374151")
        .attr("font-weight", "600");
    }
  }, [activeStep]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepNum = Number(entry.target.getAttribute("data-step"));
            setActiveStep(stepNum);
          }
        });
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0.1 },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="lq-section">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,400;0,600;0,700;1,400&display=swap"
        rel="stylesheet"
      />

      <div className="lq-sticky-visual">
        <div className="lq-visual-wrapper">
          <div className="lq-header">
            <div className="font-bungee color-pink lq-title">
              Location Quotient (LQ) <p className="font-bungee color-green">Jawa Tengah terhadap Nasional</p>
            </div>
            <div className="lq-legend">
              <div className="legend-tag">
                <span
                  className="legend-node"
                  style={{ background: "#9ca3af" }}
                />
                <span>Pra-Pandemi (2016–2020)</span>
              </div>
              <div className="legend-tag">
                <span
                  className="legend-node"
                  style={{ background: "#4d9221" }}
                />
                <span>Pascapandemi Menguat</span>
              </div>
              <div className="legend-tag">
                <span
                  className="legend-node"
                  style={{ background: "#c51b7d" }}
                />
                <span>Pascapandemi Melemah</span>
              </div>
              <div className="legend-tag">
                <span style={{ fontWeight: 700, color: "#111" }}>
                  | LQ = 1.00 : Basis
                </span>
              </div>
            </div>
          </div>

          <div className="lq-chart-canvas" ref={canvasRef}>
            <svg id="lq-svg" ref={svgRef} preserveAspectRatio="xMidYMid meet" />
            <div className="lq-tooltip" ref={tooltipRef} />
          </div>
        </div>
      </div>

      <div className="lq-narrative-track">
        {narrativeSteps.map((s, i) => (
          <div
            key={s.step}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            data-step={s.step}
            className={`lq-step ${activeStep === s.step ? "active" : ""}`}
          >
            <div className="lq-card">
              <div className="lq-card-tag">{s.tag}</div>
              <h3 className="lq-card-title">{s.title}</h3>

              {s.step === 2 && (
                <>
                  <p className="lq-card-text">
                    <span className="hl-magenta">Sektor Pertanian (A)</span>{" "}
                    tetap berstatus basis, tetapi nilai LQ-nya terus menyusut
                    mendekati ambang batas 1,00 (dari rata-rata 1,032 ke 1,011).
                  </p>
                  <p className="lq-card-text">
                    Laju pertumbuhan sektor pertanian di Jawa Tengah bergerak
                    lebih lambat dibanding rata-rata nasional, membuat
                    keunggulan komparatifnya kian menipis.
                  </p>
                </>
              )}

              {s.step === 3 && (
                <p className="lq-card-text">
                  Penguatan peran relatif justru terjadi pada sektor jasa dan
                  mobilitas. Sektor{" "}
                  <span className="hl-green">Akomodasi & Makan Minum (I)</span>{" "}
                  mencatat lonjakan nilai LQ (naik dari 1,086 ke 1,235), disusul{" "}
                  <span className="hl-green">Jasa Pendidikan (P)</span> (naik ke
                  1,309), dan <span className="hl-green">Konstruksi (F)</span>{" "}
                  (naik ke 1,095).
                </p>
              )}

              {s.step === 4 && (
                <p className="lq-card-text">
                  Pada kelompok non-basis, dinamika terlihat jelas saat krisis
                  2020. Sektor{" "}
                  <span className="hl-green">Informasi dan Komunikasi (J)</span>{" "}
                  sempat masuk kategori basis (LQ 1,001) akibat peningkatan
                  aktivitas daring, sementara sektor{" "}
                  <span className="hl-magenta">Transportasi (H)</span> anjlok
                  cukup dalam sebelum pulih kembali.
                </p>
              )}

              {s.step === 1 && (
                <p className="lq-card-text">
                  Struktur lapangan usaha di Jawa Tengah menunjukkan adanya
                  dinamika pergeseran konsentrasi ekonomi antarsektor terhadap
                  rata-rata nasional. Sebagian sektor mengalami peningkatan daya
                  saing relatif, sementara beberapa sektor lainnya melemah.
                </p>
              )}

              {s.step === 5 && (
                <>
                  <p className="lq-card-text">
                    Perencanaan pembangunan perlu difokuskan pada penguatan
                    sektor pertanian agar tidak kehilangan status basisnya,
                    sembari mengoptimalkan sektor jasa yang terus menunjukkan
                    tren pertumbuhan relatif positif.
                  </p>
                  <p
                    className="lq-card-text"
                    style={{
                      fontSize: "0.78rem",
                      color: "#6b7280",
                      marginTop: "0.4rem",
                    }}
                  >
                    <em>
                      Arahkan kursor pada kode sektor di grafik untuk melihat
                      tren tahunan 2016–2025 secara mendalam.
                    </em>
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        #lq-section {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-top: 1px solid #e0e0e0;

          color: #333333;
          font-family: "Jost", sans-serif;
        }
        .lq-sticky-visual {
          position: sticky;
          top: 0;
          width: 100%;
          height: 95vh;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem 1.5rem;
          z-index: 10;
          border-bottom: 1px solid #e5e5e5;
        }
        .lq-visual-wrapper {
          width: 100%;
          max-width: 1500px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .lq-header {
          text-align: center;
          margin-bottom: 0.2rem;
        }
        .lq-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #111111;
          letter-spacing: 0.02em;
        }
        .lq-legend {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          align-items: center;
          gap: 1.25rem;
          margin-top: 0.3rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #4b5563;
        }
        .legend-tag {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .legend-node {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }
        .lq-chart-canvas {
          width: 100%;
          flex-grow: 1;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        #lq-svg {
          width: 100%;
          height: 100%;
          max-width: 1200px;
        }
        .lq-tooltip {
          position: absolute;
          pointer-events: none;
          background: #ffffff;
          border: 1px solid #d1d5db;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
          display: none;
          z-index: 50;
          min-width: 200px;
        }
        .lq-narrative-track {
          width: 100%;
          max-width: 480px;
          position: relative;
          z-index: 20;
          padding: 4vh 1rem 30vh 1rem;
          margin-top: -12vh;
          pointer-events: none;
        }
        .lq-step {
          min-height: 75vh;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.2;
          transition:
            opacity 0.4s ease,
            transform 0.4s ease;
          transform: translateY(20px);
          pointer-events: auto;
        }
        .lq-step.active {
          opacity: 1;
          transform: translateY(0);
        }
        .lq-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(6px);
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 1.5rem 1.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          width: 100%;
        }
        .lq-card-tag {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          color: #4d9221;
          margin-bottom: 0.35rem;
          min-height: 1px;
        }
        .lq-card-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #111111;
          margin: 0 0 0.75rem 0;
          line-height: 1.25;
        }
        .lq-card-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #333333;
          margin-bottom: 0.75rem;
        }
        .lq-card-text:last-child {
          margin-bottom: 0;
        }
        :global(.hl-green) {
          background: #e6f5d0;
          color: #4d9221;
          font-weight: 700;
          padding: 0.1rem 0.35rem;
          border-radius: 2px;
        }
        :global(.hl-magenta) {
          background: #fde0ef;
          color: #c51b7d;
          font-weight: 700;
          padding: 0.1rem 0.35rem;
          border-radius: 2px;
        }
        @media (max-width: 860px) {
          .lq-sticky-visual {
            height: 50vh;
            padding: 0.75rem;
          }
          .lq-narrative-track {
            max-width: 90%;
            padding-top: 1vh;
          }
          .lq-step {
            min-height: 65vh;
          }
        }
      `}</style>

      <style jsx global>{`
        #lq-section .baseline-threshold {
          stroke: #111827;
          stroke-width: 2px;
          stroke-dasharray: 4, 4;
        }
        #lq-section .baseline-label {
          font-size: 10px;
          font-weight: 700;
          fill: #111827;
          text-anchor: middle;
        }
        #lq-section .grid-y {
          stroke: #e5e7eb;
          stroke-width: 1px;
        }
        #lq-section .sector-label {
          font-size: 11px;
          font-weight: 600;
          fill: #374151;
          cursor: pointer;
          transition: fill 0.2s;
        }
        #lq-section .sector-label:hover {
          fill: #4d9221;
          font-weight: 700;
        }
        #lq-section .connecting-bar {
          stroke-width: 3.5px;
          stroke-linecap: round;
          transition:
            opacity 0.4s ease,
            stroke-width 0.3s;
        }
        #lq-section .dot-pre {
          fill: #9ca3af;
          stroke: #ffffff;
          stroke-width: 1.5px;
          cursor: pointer;
          transition:
            r 0.3s,
            opacity 0.4s;
        }
        #lq-section .dot-post {
          stroke: #ffffff;
          stroke-width: 1.5px;
          cursor: pointer;
          transition:
            r 0.3s,
            opacity 0.4s,
            fill 0.4s;
        }
        @keyframes lqPulse {
          0% {
            r: 6.5px;
            opacity: 1;
          }
          50% {
            r: 12px;
            opacity: 0.7;
          }
          100% {
            r: 6.5px;
            opacity: 1;
          }
        }
        #lq-section .dot-highlight {
          animation: lqPulse 1.4s infinite ease-in-out;
          stroke: #111827 !important;
          stroke-width: 2.5px !important;
        }
        #lq-section .sparkline-path {
          fill: none;
          stroke: #4d9221;
          stroke-width: 2px;
          stroke-linecap: round;
        }
      `}</style>
    </section>
  );
}
