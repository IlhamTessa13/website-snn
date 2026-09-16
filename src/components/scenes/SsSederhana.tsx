"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

const sectors = [
  {
    code: "A",
    name: "Pertanian, Kehutanan, & Perikanan",
    ranks: [16, 16, 16, 16, 5, 15, 11, 17, 17, 10],
  },
  {
    code: "B",
    name: "Pertambangan & Penggalian",
    ranks: [1, 15, 17, 17, 10, 8, 17, 14, 14, 17],
  },
  {
    code: "C",
    name: "Industri Pengolahan",
    ranks: [14, 13, 14, 14, 11, 10, 8, 11, 13, 12],
  },
  {
    code: "D",
    name: "Pengadaan Listrik & Gas",
    ranks: [12, 14, 9, 13, 8, 2, 5, 6, 10, 14],
  },
  {
    code: "E",
    name: "Pengadaan Air & Sampah",
    ranks: [15, 8, 12, 9, 3, 3, 12, 10, 16, 16],
  },
  { code: "F", name: "Konstruksi", ranks: [8, 6, 8, 10, 12, 6, 14, 7, 6, 8] },
  {
    code: "G",
    name: "Perdagangan Besar & Eceran",
    ranks: [13, 11, 10, 11, 13, 5, 7, 9, 11, 9],
  },
  {
    code: "H",
    name: "Transportasi & Pergudangan",
    ranks: [7, 5, 5, 5, 17, 9, 1, 1, 7, 5],
  },
  {
    code: "I",
    name: "Akomodasi & Makan Minum",
    ranks: [10, 7, 6, 6, 16, 7, 2, 2, 1, 2],
  },
  {
    code: "J",
    name: "Informasi & Komunikasi",
    ranks: [4, 1, 1, 1, 1, 1, 6, 3, 3, 3],
  },
  {
    code: "K",
    name: "Jasa Keuangan & Asuransi",
    ranks: [3, 10, 15, 12, 4, 13, 15, 15, 15, 11],
  },
  {
    code: "L",
    name: "Real Estat",
    ranks: [9, 12, 13, 8, 7, 11, 9, 12, 12, 13],
  },
  {
    code: "M,N",
    name: "Jasa Perusahaan",
    ranks: [2, 3, 3, 2, 15, 12, 4, 5, 2, 4],
  },
  {
    code: "O",
    name: "Administrasi Pemerintahan",
    ranks: [17, 17, 11, 15, 9, 17, 13, 16, 8, 15],
  },
  {
    code: "P",
    name: "Jasa Pendidikan",
    ranks: [11, 9, 7, 7, 6, 16, 16, 13, 9, 6],
  },
  { code: "Q", name: "Jasa Kesehatan", ranks: [6, 4, 4, 4, 2, 4, 10, 8, 5, 7] },
  {
    code: "R,S,T,U",
    name: "Jasa Lainnya",
    ranks: [5, 2, 2, 3, 14, 14, 3, 4, 4, 1],
  },
];

const colorPalette = [
  "#e11d48",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#f43f5e",
  "#8b5cf6",
  "#f59e0b",
  "#1098ad",
  "#475569",
  "#2563eb",
];

const narrativeSteps = [
  {
    step: 1,
    tag: "",
    title: "Peta Peringkat Sektor Jawa Tengah",
    text: "Grafik menampilkan keseluruhan pergerakan peringkat kecepatan wilayah seluruh lapangan usaha dari tahun 2016 hingga 2025 sebelum menelusuri dinamika per segmen.",
  },
  {
    step: 2,
    tag: "Pra-Pandemi (2016–2019)",
    title: "Dominasi Sektor Digital & Jasa",
    text: "Pada periode pra-pandemi, Sektor Informasi dan Komunikasi (J) serta Jasa Lainnya konsisten memimpin di jajaran papan atas peringkat kecepatan wilayah Jawa Tengah.",
  },
  {
    step: 3,
    tag: "",
    title: "Patahan Jalur di Tahun 2020",
    text: "Tahun 2020 terjadi pandemi COVID 19 yang mengguncang struktur ekonomi, menekan Sektor Transportasi (H) dan Akomodasi-Mamin (I) ke posisi bawah, sementara Sektor Kesehatan (Q) melesat ke puncak.",
  },
  {
    step: 4,
    tag: "Pemulihan Pasca COVID 19 (2021–2022)",
    title: "Lonjakan Transportasi & Pariwisata",
    text: "Memasuki pascapandemi, pemulihan mobilitas memicu lonjakan tajam pada Sektor Transportasi (H) dan Akomodasi-Mamin (I) yang langsung merangsek ke peringkat teratas pada tahun 2022.",
  },
  {
    step: 5,
    tag: "",
    title: "",
    text: "Menjelang tahun 2025, Sektor Jasa Lainnya (R,S,T,U) kembali mengambil alih posisi puncak efisiensi, mencerminkan pemulihan aktivitas ekonomi berbasis masyarakat yang kuat.",
  },
  {
    step: 6,
    tag: "",
    title: "",
    text: "Sektor Pertanian, Kehutanan, dan Perikanan (A) sebagian besar berada di paruh bawah klasifikasi peringkat kecepatan wilayah sepanjang dekade penuh.",
  },
  {
    step: 7,
    tag: "",
    title: "",
    text: "Selanjutnya, analisis dilanjutkan menggunakan metode Shift Share untuk menguraikan perubahan nilai tambah ekonomi Jawa Tengah berdasarkan pertumbuhan ekonomi nasional, struktur sektoral, dan daya saing masing-masing sektor.",
  },
];

type ChartHandles = {
  paths: d3.Selection<SVGPathElement, any, SVGGElement, unknown>;
  sectorColorMap: Record<string, string>;
};

export default function SsSederhana() {
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chartHandles = useRef<ChartHandles | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  // Build chart once on mount
  useEffect(() => {
    if (!svgRef.current) return;

    const sectorColorMap: Record<string, string> = {};
    sectors.forEach((sec, idx) => {
      sectorColorMap[sec.code] = colorPalette[idx % colorPalette.length];
    });

    const width = 1250;
    const height = 460;
    const margin = { top: 35, right: 110, bottom: 35, left: 110 };

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`);
    svg.selectAll("*").remove();
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const xScale = d3
      .scalePoint<number>()
      .domain(years)
      .range([0, innerW])
      .padding(0.1);
    const yScale = d3.scaleLinear().domain([1, 17]).range([0, innerH]);

    for (let r = 1; r <= 17; r++) {
      g.append("line")
        .attr("class", "grid-line")
        .attr("x1", 0)
        .attr("x2", innerW)
        .attr("y1", yScale(r))
        .attr("y2", yScale(r));
    }

    const x2020 = xScale(2020)!;
    g.append("rect")
      .attr("class", "event-shading")
      .attr("x", x2020 - 35)
      .attr("y", 0)
      .attr("width", 70)
      .attr("height", innerH);

    g.append("text")
      .attr("class", "event-label")
      .attr("x", x2020)
      .attr("y", -12)
      .text("Disrupsi COVID-19 (2020)");

    const lineGen = d3
      .line<{ year: number; rank: number }>()
      .x((d) => xScale(d.year)!)
      .y((d) => yScale(d.rank))
      .curve(d3.curveMonotoneX);

    const sectorPaths = sectors.map((sec) => {
      const points = years.map((yr, idx) => ({
        year: yr,
        rank: sec.ranks[idx],
      }));
      return { code: sec.code, name: sec.name, points };
    });

    const paths = g
      .append("g")
      .attr("class", "paths-group")
      .selectAll<SVGPathElement, any>("path")
      .data(sectorPaths)
      .enter()
      .append("path")
      .attr("class", "bump-path")
      .attr("d", (d) => lineGen(d.points))
      .attr("stroke", (d) => sectorColorMap[d.code])
      .attr("opacity", 0.85)
      .attr("stroke-width", 3.5);

    const nodesGroup = g.append("g").attr("class", "nodes-group");
    sectorPaths.forEach((sec) => {
      const safeCode = sec.code.replace(/,/g, "-");
      nodesGroup
        .selectAll(`circle.node-${safeCode}`)
        .data(sec.points)
        .enter()
        .append("circle")
        .attr("class", `bump-node node-${safeCode}`)
        .attr("cx", (d) => xScale(d.year)!)
        .attr("cy", (d) => yScale(d.rank))
        .attr("r", 4.5)
        .attr("fill", sectorColorMap[sec.code])
        .attr("opacity", 0.9);
    });

    function resolveLabelPositions(isLeft: boolean) {
      let nodes = sectorPaths.map((sec) => {
        const r = isLeft
          ? sec.points[0].rank
          : sec.points[sec.points.length - 1].rank;
        return { code: sec.code, rank: r, y: yScale(r), targetY: yScale(r) };
      });

      const rankMap: Record<string, typeof nodes> = {};
      nodes.forEach((n) => {
        const key = String(n.targetY);
        if (!rankMap[key]) rankMap[key] = [];
        rankMap[key].push(n);
      });

      Object.keys(rankMap).forEach((yKey) => {
        const group = rankMap[yKey];
        const baseY = parseFloat(yKey);
        const count = group.length;
        if (count > 1) {
          const spacing = 14;
          const startOffset = -((count - 1) * spacing) / 2;
          group.forEach((node, idx) => {
            node.y = baseY + startOffset + idx * spacing;
          });
        }
      });

      nodes.sort((a, b) => a.y - b.y);

      const minSpacing = 14;
      for (let iter = 0; iter < 10; iter++) {
        for (let i = 1; i < nodes.length; i++) {
          const diff = nodes[i].y - nodes[i - 1].y;
          if (diff < minSpacing) {
            const overlap = minSpacing - diff;
            nodes[i - 1].y -= overlap / 2;
            nodes[i].y += overlap / 2;
          }
        }
      }

      nodes.forEach((d) => {
        if (d.y < 0) d.y = 0;
        if (d.y > innerH) d.y = innerH;
      });

      return nodes;
    }

    const leftData = resolveLabelPositions(true);
    const rightData = resolveLabelPositions(false);

    const leftLabels = g.append("g").attr("class", "left-labels");
    leftData.forEach((d) => {
      const safeCode = d.code.replace(/,/g, "-");
      leftLabels
        .append("text")
        .attr("class", "sector-label-side label-l-" + safeCode)
        .attr("x", -15)
        .attr("y", d.y + 4)
        .attr("text-anchor", "end")
        .attr("fill", sectorColorMap[d.code])
        .attr("opacity", 0.85)
        .text(`(${d.code})`);
    });

    const rightLabels = g.append("g").attr("class", "right-labels");
    rightData.forEach((d) => {
      const safeCode = d.code.replace(/,/g, "-");
      rightLabels
        .append("text")
        .attr("class", "sector-label-side label-r-" + safeCode)
        .attr("x", innerW + 15)
        .attr("y", d.y + 4)
        .attr("text-anchor", "start")
        .attr("fill", sectorColorMap[d.code])
        .attr("opacity", 0.85)
        .text(`(${d.code})`);
    });

    chartHandles.current = { paths, sectorColorMap };
  }, []);

  // Apply step whenever activeStep changes
  useEffect(() => {
    const handles = chartHandles.current;
    if (!handles) return;
    const { paths, sectorColorMap } = handles;

    if (activeStep === 1 || activeStep === 7) {
      paths
        .attr("stroke", (d: any) => sectorColorMap[d.code])
        .attr("opacity", 0.85)
        .attr("stroke-width", 3.5);
      sectors.forEach((sec) => {
        const safeCode = sec.code.replace(/,/g, "-");
        d3.selectAll(`.node-${safeCode}`)
          .attr("fill", sectorColorMap[sec.code])
          .attr("opacity", 0.9);
        d3.select(`.label-l-${safeCode}`)
          .attr("fill", sectorColorMap[sec.code])
          .attr("opacity", 0.85);
        d3.select(`.label-r-${safeCode}`)
          .attr("fill", sectorColorMap[sec.code])
          .attr("opacity", 0.85);
      });
      return;
    }

    let targetCodes: string[] = [];
    if (activeStep === 2) targetCodes = ["J", "R,S,T,U", "M,N"];
    else if (activeStep === 3) targetCodes = ["H", "I", "Q"];
    else if (activeStep === 4) targetCodes = ["H", "I"];
    else if (activeStep === 5) targetCodes = ["R,S,T,U"];
    else if (activeStep === 6) targetCodes = ["A"];

    paths
      .attr("stroke", (d: any) => sectorColorMap[d.code])
      .attr("opacity", (d: any) => (targetCodes.includes(d.code) ? 1 : 0.15))
      .attr("stroke-width", (d: any) =>
        targetCodes.includes(d.code) ? 5.5 : 2,
      );

    sectors.forEach((sec) => {
      const isTarget = targetCodes.includes(sec.code);
      const safeCode = sec.code.replace(/,/g, "-");
      d3.selectAll(`.node-${safeCode}`)
        .attr("fill", sectorColorMap[sec.code])
        .attr("opacity", isTarget ? 1 : 0.12);
      d3.select(`.label-l-${safeCode}`)
        .attr("fill", sectorColorMap[sec.code])
        .attr("opacity", isTarget ? 1 : 0.2);
      d3.select(`.label-r-${safeCode}`)
        .attr("fill", sectorColorMap[sec.code])
        .attr("opacity", isTarget ? 1 : 0.2);
    });
  }, [activeStep]);

  // IntersectionObserver over narrative steps
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
    <section id="bump-section">
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

      <div className="bump-sticky-visual">
        <div className="bump-visual-wrapper">
          <div className="bump-header">
            <div className="font-bungee color-pink">
              Dinamika Peringkat Keunggulan Sektor{" "}
              <p className="font-bungee color-green">(Shift Share 2016–2025)</p>
            </div>
            <div className="font-delius bump-subtitle">
              Peringkat Relatif Kinerja Lapangan Usaha Berdasarkan Metode Shift
              Share Provinsi Jawa Tengah
            </div>
          </div>

          <div className="bump-chart-canvas" ref={canvasRef}>
            <svg
              id="bump-svg"
              ref={svgRef}
              preserveAspectRatio="xMidYMid meet"
            />
          </div>
        </div>
      </div>

      <div className="bump-narrative-track">
        {narrativeSteps.map((s, i) => (
          <div
            key={s.step}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            data-step={s.step}
            className={`bump-step ${activeStep === s.step ? "active" : ""}`}
          >
            <div className="bump-card">
              <div className="bump-card-tag">{s.tag}</div>
              {s.title && <h3 className="bump-card-title">{s.title}</h3>}
              <p className="bump-card-text">{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        #bump-section {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;

          color: #333333;
          font-family: "Jost", sans-serif;
        }
        .bump-sticky-visual {
          position: sticky;
          top: 0;
          width: 100%;
          height: 92vh;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem 1.5rem;
          z-index: 10;
          border-bottom: 1px solid #e5e5e5;
        }
        .bump-visual-wrapper {
          width: 100%;
          max-width: 1350px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .bump-header {
          text-align: center;
          margin-bottom: 0.2rem;
        }
        .bump-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #111111;
          letter-spacing: 0.02em;
        }
        .bump-subtitle {
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 0.2rem;
        }
        .bump-chart-canvas {
          width: 100%;
          flex-grow: 1;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        #bump-svg {
          width: 100%;
          height: 100%;
          max-width: 1300px;
        }
        .bump-narrative-track {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 20;
          padding: 4vh 1rem 30vh 1rem;
          margin-top: -12vh;
          pointer-events: none;
        }
        .bump-step {
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
        .bump-step.active {
          opacity: 1;
          transform: translateY(0);
        }
        .bump-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(6px);
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 1.4rem 1.4rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          width: 100%;
        }
        .bump-card-tag {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          color: #4d9221;
          margin-bottom: 0.35rem;
          min-height: 1px;
        }
        .bump-card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #111111;
          margin: 0 0 0.6rem 0;
          line-height: 1.25;
        }
        .bump-card-text {
          font-size: 0.88rem;
          line-height: 1.6;
          color: #333333;
          margin-bottom: 0.75rem;
        }
        .bump-card-text:last-child {
          margin-bottom: 0;
        }
        @media (max-width: 860px) {
          .bump-sticky-visual {
            height: 50vh;
            padding: 0.75rem;
          }
          .bump-narrative-track {
            max-width: 90%;
            padding-top: 1vh;
          }
          .bump-step {
            min-height: 65vh;
          }
        }
      `}</style>

      {/* Global (non-scoped) CSS untuk elemen SVG hasil D3 — styled-jsx tidak menjangkau elemen yang dibuat lewat DOM API */}
      <style jsx global>{`
        #bump-section .grid-line {
          stroke: #e5e7eb;
          stroke-width: 1px;
        }
        #bump-section .event-shading {
          fill: #f3f4f6;
          opacity: 0.7;
        }
        #bump-section .event-label {
          font-size: 10px;
          font-weight: 700;
          fill: #9ca3af;
          text-anchor: middle;
        }
        #bump-section .bump-path {
          fill: none;
          stroke-width: 3.5px;
          stroke-linecap: round;
          transition:
            opacity 0.4s ease,
            stroke-width 0.3s ease,
            stroke 0.3s ease;
        }
        #bump-section .bump-node {
          stroke: #ffffff;
          stroke-width: 1.5px;
          cursor: pointer;
          transition:
            r 0.3s ease,
            opacity 0.4s ease;
        }
        #bump-section .sector-label-side {
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.4s ease;
        }
      `}</style>
    </section>
  );
}
