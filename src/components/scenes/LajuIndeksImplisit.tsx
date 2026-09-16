"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  indeksImplisitData, pdrbTotalImplisit, years, narrativeSteps,
} from "@/data/indeksImplisit";

export default function LajuIndeksImplisit() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const currentRange = narrativeSteps[activeStep]?.yearRange || [2016, 2018];
  const activeYear = currentRange[1];

  // Build chart data up to active year
  const chartData = useMemo(() => {
    return years
      .filter((y) => y <= activeYear)
      .map((y) => ({ year: y, pdrb: pdrbTotalImplisit[y] }));
  }, [activeYear]);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    let best = -1;
    let bestRatio = 0;
    entries.forEach((entry) => {
      const idx = parseInt((entry.target as HTMLElement).dataset.step || "0");
      if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
        bestRatio = entry.intersectionRatio;
        best = idx;
      }
    });
    if (best >= 0) setActiveStep(best);
  }, []);

  useEffect(() => {
    const container = sectionRef.current;
    if (!container) return;
    const steps = container.querySelectorAll("[data-step]");
    const obs = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
    });
    steps.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [handleIntersection]);

  // Table: show sectors for active year
  const tableData = useMemo(() => {
    return indeksImplisitData.map((row) => ({
      kode: row.kode,
      sektor: row.lapanganUsaha,
      value: row.values[activeYear],
    }));
  }, [activeYear]);

  return (
    <section ref={sectionRef} className="relative">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-8">
        <span className="heading-sm">Scene 2</span>
        <h2 className="heading-lg mt-2">
          Dinamika Laju Indeks Implisit
          <span className="font-editorial gradient-text-purple"> PDRB</span>
        </h2>
        <p className="body-lg mt-3 max-w-2xl">
          Laju Indeks Implisit mencerminkan pergerakan harga agregat dalam
          PDRB Jawa Tengah. Scroll untuk melihat evolusi dari 2016 hingga 2025.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-6">
        {/* Left: Sticky Chart + Table */}
        <div className="lg:w-[55%] lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] overflow-y-auto space-y-4">
          {/* Line Chart */}
          <div className="chart-container">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-zinc-700">
                Laju Indeks Implisit PDRB (%)
              </h3>
              <span className="pill pill-red">{activeYear}</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  axisLine={{ stroke: "#e4e4e7" }}
                  domain={[2016, 2025]}
                  type="number"
                  ticks={years}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 5]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#fff",
                  }}
                  formatter={(value: any) => [`${Number(value).toFixed(2)}%`, "Laju Indeks Implisit"]}
                />
                <ReferenceLine x={activeYear} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={2} />
                <Line
                  type="monotone"
                  dataKey="pdrb"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: "#ef4444", r: 4, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, fill: "#ef4444" }}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="chart-container overflow-x-auto">
            <h3 className="text-sm font-semibold text-zinc-700 mb-3">
              Rincian Sektoral — {activeYear}
            </h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Lapangan Usaha</th>
                  <th className="text-right">Laju (%)</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.kode}>
                    <td className="font-mono text-xs">{row.kode}</td>
                    <td className="text-xs">{row.sektor}</td>
                    <td
                      className="text-right font-mono text-xs font-semibold"
                      style={{ color: row.value < 0 ? "#ef4444" : "#1a1a1a" }}
                    >
                      {row.value.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="highlight">
                  <td />
                  <td className="text-xs font-bold">PDRB TOTAL</td>
                  <td className="text-right font-mono text-xs font-bold">
                    {pdrbTotalImplisit[activeYear].toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Scrollable Narrative */}
        <div className="lg:w-[45%] pb-24">
          {narrativeSteps.map((step, idx) => (
            <div key={idx} data-step={idx} className="narrative-step">
              <div
                className="p-6 rounded-xl border transition-all duration-500"
                style={{
                  borderColor: activeStep === idx ? "#7c3aed" : "#e4e4e7",
                  background:
                    activeStep === idx ? "rgba(124,58,237,0.03)" : "transparent",
                }}
              >
                <span className="heading-sm">{step.subtitle}</span>
                <h3 className="heading-md mt-2">{step.title}</h3>
                <p className="body-lg mt-3">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
