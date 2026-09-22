"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  sektorPrimer,
  sektorSekunder,
  sektorTersier,
  years,
  kontribusiAdhkData,
} from "@/data/kontribusiPdrb";

export default function KontribusiPDRB() {
  const [view, setView] = useState<"grouped" | "detail">("grouped");

  const groupedData = years.map((y) => ({
    year: y,
    Primer: sektorPrimer[y as keyof typeof sektorPrimer],
    Sekunder: sektorSekunder[y as keyof typeof sektorSekunder],
    Tersier: sektorTersier[y as keyof typeof sektorTersier],
  }));

  const detailData = years.map((y) => {
    const row: Record<string, number> = { year: y };
    kontribusiAdhkData.forEach((d) => {
      row[d.sektor] = d.values[y as keyof typeof d.values];
    });
    return row;
  });

  const DETAIL_COLORS = [
    "#d97706",
    "#92400e",
    "#7c3aed",
    "#4338ca",
    "#10b981",
    "#047857",
    "#3b82f6",
    "#1d4ed8",
    "#ef4444",
    "#dc2626",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#6366f1",
  ];

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-8">
        <span className="heading-sm">Scene 4</span>
        <h2 className="heading-lg mt-2">
          Kontribusi Sektoral
          <span className="font-editorial gradient-text-purple"> PDRB</span>
        </h2>
        <p className="body-lg mt-3 max-w-2xl">
          Struktur ekonomi Jawa Tengah berdasarkan kontribusi setiap sektor
          terhadap PDRB ADHK 2010. Perhatikan transformasi dari sektor sekunder
          ke tersier.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView("grouped")}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
            style={{
              background: view === "grouped" ? "#1a1a1a" : "transparent",
              color: view === "grouped" ? "#fff" : "#71717a",
              border: `1px solid ${view === "grouped" ? "#1a1a1a" : "#e4e4e7"}`,
            }}
          >
            3 Kelompok Sektor
          </button>
          <button
            onClick={() => setView("detail")}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
            style={{
              background: view === "detail" ? "#1a1a1a" : "transparent",
              color: view === "detail" ? "#fff" : "#71717a",
              border: `1px solid ${view === "detail" ? "#1a1a1a" : "#e4e4e7"}`,
            }}
          >
            17 Sektor Detail
          </button>
        </div>

        {/* Grouped View */}
        {view === "grouped" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="chart-container"
          >
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                data={groupedData}
                margin={{ top: 10, right: 30, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#fff",
                  }}
                  formatter={(value: any, name: any) => [
                    `${Number(value).toFixed(2)}%`,
                    name,
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="Primer"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.7}
                />
                <Area
                  type="monotone"
                  dataKey="Sekunder"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.7}
                />
                <Area
                  type="monotone"
                  dataKey="Tersier"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.7}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Detail View */}
        {view === "detail" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="chart-container"
          >
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                data={detailData}
                margin={{ top: 10, right: 30, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#fff",
                  }}
                  formatter={(value: any, name: any) => [
                    `${Number(value).toFixed(2)}%`,
                    name,
                  ]}
                />
                {kontribusiAdhkData.map((d, i) => (
                  <Area
                    key={d.sektor}
                    type="monotone"
                    dataKey={d.sektor}
                    stackId="1"
                    stroke={DETAIL_COLORS[i % DETAIL_COLORS.length]}
                    fill={DETAIL_COLORS[i % DETAIL_COLORS.length]}
                    fillOpacity={0.75}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Insight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="stat-box">
            <div className="stat-value" style={{ color: "#3b82f6" }}>
              43.17%
            </div>
            <div className="stat-label">Sekunder (2025)</div>
            <p className="text-xs text-zinc-500 mt-2">
              Masih mendominasi, didorong industri pengolahan (31.91%).
            </p>
          </div>
          <div className="stat-box">
            <div className="stat-value" style={{ color: "#f59e0b" }}>
              41.91%
            </div>
            <div className="stat-label">Tersier (2025)</div>
            <p className="text-xs text-zinc-500 mt-2">
              Terus meningkat — mengindikasikan transisi menuju ekonomi jasa.
            </p>
          </div>
          <div className="stat-box">
            <div className="stat-value" style={{ color: "#10b981" }}>
              14.92%
            </div>
            <div className="stat-label">Primer (2025)</div>
            <p className="text-xs text-zinc-500 mt-2">
              Menurun dari 17.66% (2016), transformasi struktural berkelanjutan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
