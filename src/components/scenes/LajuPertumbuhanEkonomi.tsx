"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import { lajuPertumbuhanData, pdrbTotal, years } from "@/data/lajuPertumbuhan";

const COLORS = [
  "#d97706", "#7c3aed", "#ef4444", "#3b82f6", "#10b981",
  "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
  "#f97316", "#6366f1", "#14b8a6", "#e11d48", "#0ea5e9",
  "#a855f7", "#22c55e",
];

export default function LajuPertumbuhanEkonomi() {
  const [selectedSectors, setSelectedSectors] = useState<string[]>(["PDRB Total"]);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const allSectors = [
    { key: "PDRB Total", label: "PDRB Total" },
    ...lajuPertumbuhanData.map((d) => ({ key: d.shortName, label: d.shortName })),
  ];

  const toggleSector = (key: string) => {
    setSelectedSectors((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const chartData = years.map((y) => {
    const row: Record<string, number> = { year: y, "PDRB Total": pdrbTotal[y] };
    lajuPertumbuhanData.forEach((d) => {
      row[d.shortName] = d.values[y];
    });
    return row;
  });

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-8">
        <span className="heading-sm">Scene 3</span>
        <h2 className="heading-lg mt-2">
          Laju Pertumbuhan
          <span className="font-editorial gradient-text-amber"> Ekonomi</span>
        </h2>
        <p className="body-lg mt-3 max-w-2xl">
          Pertumbuhan PDRB ADHK 2010 per lapangan usaha (y-on-y). Klik sektor
          untuk membandingkan tren pertumbuhan antar industri.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Sector selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {allSectors.map((s, i) => {
            const isSelected = selectedSectors.includes(s.key);
            const color = i === 0 ? "#1a1a1a" : COLORS[(i - 1) % COLORS.length];
            return (
              <button
                key={s.key}
                onClick={() => toggleSector(s.key)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer"
                style={{
                  background: isSelected ? color : "transparent",
                  color: isSelected ? "#fff" : color,
                  borderColor: isSelected ? color : "#e4e4e7",
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="chart-container"
        >
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#a1a1aa" }} />
              <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#1a1a1a",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#fff",
                }}
                formatter={(value: any, name: any) => [`${Number(value).toFixed(2)}%`, name]}
              />
              <ReferenceLine y={0} stroke="#e4e4e7" strokeWidth={2} />

              {selectedSectors.map((key) => {
                const idx = allSectors.findIndex((s) => s.key === key);
                const color = idx === 0 ? "#1a1a1a" : COLORS[(idx - 1) % COLORS.length];
                return (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={color}
                    strokeWidth={key === "PDRB Total" ? 3 : 2}
                    dot={{ fill: color, r: 3 }}
                    strokeDasharray={key === "PDRB Total" ? undefined : undefined}
                    isAnimationActive={true}
                    animationDuration={600}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Insight cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="stat-box">
            <div className="stat-value text-red-500">-32.38%</div>
            <div className="stat-label">Transportasi (2020)</div>
            <p className="text-xs text-zinc-500 mt-2">
              Kontraksi terdalam akibat pembatasan mobilitas pandemi COVID-19.
            </p>
          </div>
          <div className="stat-box">
            <div className="stat-value text-green-500">+73.01%</div>
            <div className="stat-label">Transportasi (2022)</div>
            <p className="text-xs text-zinc-500 mt-2">
              Rebound luar biasa setelah pembukaan kembali ekonomi pasca-pandemi.
            </p>
          </div>
          <div className="stat-box">
            <div className="stat-value text-blue-500">+15.65%</div>
            <div className="stat-label">Infokom (2020)</div>
            <p className="text-xs text-zinc-500 mt-2">
              Satu-satunya sektor dengan pertumbuhan pesat di tahun pandemi
              berkat digitalisasi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
