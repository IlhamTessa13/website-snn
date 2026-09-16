"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell, ReferenceLine,
} from "recharts";
import { shiftShare2021_2025, shiftShare2016_2020 } from "@/data/shiftShare";

export default function ShiftShareAnalysis() {
  const [period, setPeriod] = useState<"2021-2025" | "2016-2020">("2021-2025");
  const [component, setComponent] = useState<"all" | "ni" | "pi" | "di">("all");

  const data = period === "2021-2025" ? shiftShare2021_2025 : shiftShare2016_2020;

  const chartData = data.map((d) => ({
    sektor: d.kode,
    fullName: d.lapanganUsaha,
    "Regional Share (Ni)": d.ni,
    "Proportionality Shift (Pi)": d.pi,
    "Differential Shift (Di)": d.di,
    "Nilai Tambah (Δyi)": d.deltaYi,
  }));

  const visibleBars = component === "all"
    ? ["Regional Share (Ni)", "Proportionality Shift (Pi)", "Differential Shift (Di)"]
    : component === "ni"
    ? ["Regional Share (Ni)"]
    : component === "pi"
    ? ["Proportionality Shift (Pi)"]
    : ["Differential Shift (Di)"];

  const barColors: Record<string, string> = {
    "Regional Share (Ni)": "#3b82f6",
    "Proportionality Shift (Pi)": "#f59e0b",
    "Differential Shift (Di)": "#10b981",
  };

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-8">
        <span className="heading-sm">Scene 5</span>
        <h2 className="heading-lg mt-2">
          Analisis
          <span className="font-editorial gradient-text-amber"> Shift-Share</span>
        </h2>
        <p className="body-lg mt-3 max-w-2xl">
          Dekomposisi perubahan output regional menjadi tiga komponen:
          Regional Share (pertumbuhan nasional), Proportionality Shift
          (bauran industri), dan Differential Shift (keunggulan kompetitif).
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setPeriod("2021-2025")}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
              style={{
                background: period === "2021-2025" ? "#1a1a1a" : "transparent",
                color: period === "2021-2025" ? "#fff" : "#71717a",
                border: `1px solid ${period === "2021-2025" ? "#1a1a1a" : "#e4e4e7"}`,
              }}
            >
              2021–2025
            </button>
            <button
              onClick={() => setPeriod("2016-2020")}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
              style={{
                background: period === "2016-2020" ? "#1a1a1a" : "transparent",
                color: period === "2016-2020" ? "#fff" : "#71717a",
                border: `1px solid ${period === "2016-2020" ? "#1a1a1a" : "#e4e4e7"}`,
              }}
            >
              2016–2020
            </button>
          </div>
          <div className="flex gap-2">
            {[
              { key: "all", label: "Semua" },
              { key: "ni", label: "Regional (Ni)" },
              { key: "pi", label: "Proportionality (Pi)" },
              { key: "di", label: "Differential (Di)" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setComponent(btn.key as typeof component)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer"
                style={{
                  background: component === btn.key ? "#7c3aed" : "transparent",
                  color: component === btn.key ? "#fff" : "#71717a",
                  borderColor: component === btn.key ? "#7c3aed" : "#e4e4e7",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="chart-container"
        >
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, bottom: 20, left: 0 }} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="sektor"
                tick={{ fontSize: 10, fill: "#a1a1aa" }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#1a1a1a", border: "none", borderRadius: 8, fontSize: 12, color: "#fff" }}
                formatter={(value: any, name: any) => [`${Number(value).toFixed(2)} miliar`, name]}
                labelFormatter={(label) => {
                  const item = chartData.find((d) => d.sektor === label);
                  return item?.fullName || label;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke="#a1a1aa" />
              {visibleBars.map((key) => (
                <Bar key={key} dataKey={key} fill={barColors[key]} radius={[3, 3, 0, 0]} barSize={component === "all" ? 12 : 24} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="stat-box border-l-4" style={{ borderLeftColor: "#3b82f6" }}>
            <div className="text-sm font-bold text-zinc-700">Regional Share (Ni)</div>
            <p className="text-xs text-zinc-500 mt-2">
              Pertumbuhan yang terjadi karena pengaruh pertumbuhan ekonomi
              nasional. Jika ekonomi nasional tumbuh, semua daerah ikut tumbuh.
            </p>
          </div>
          <div className="stat-box border-l-4" style={{ borderLeftColor: "#f59e0b" }}>
            <div className="text-sm font-bold text-zinc-700">Proportionality Shift (Pi)</div>
            <p className="text-xs text-zinc-500 mt-2">
              Pengaruh bauran industri. Bernilai positif jika daerah memiliki
              sektor-sektor yang tumbuh lebih cepat dari rata-rata nasional.
            </p>
          </div>
          <div className="stat-box border-l-4" style={{ borderLeftColor: "#10b981" }}>
            <div className="text-sm font-bold text-zinc-700">Differential Shift (Di)</div>
            <p className="text-xs text-zinc-500 mt-2">
              Keunggulan kompetitif daerah. Bernilai positif jika sektor di
              daerah tumbuh lebih cepat dari sektor yang sama di tingkat nasional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
