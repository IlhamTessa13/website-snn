"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { ilorCategories, type IlorCategory, type IlorPoint } from "@/data/ilor";

function ilorNarrative(category: IlorCategory, point: IlorPoint): string {
  const v = point.ilor;
  const absV = Math.abs(v);

  if (v < 0) {
    return `Pada ${point.tahun}, sektor ${category.label} mencatat ILOR negatif (${v.toFixed(2)}) — output tumbuh sementara jumlah tenaga kerja yang diserap justru berkurang. Ini sinyal efisiensi: pertumbuhan sektor ini tidak lagi bergantung pada penambahan pekerja baru.`;
  }

  let magnitude: string;
  if (absV < 5) {
    magnitude =
      "sangat kecil — pertumbuhan output di sektor ini nyaris tidak membutuhkan tambahan tenaga kerja baru, tanda efisiensi tenaga kerja yang tinggi";
  } else if (absV < 30) {
    magnitude =
      "moderat — sektor ini menyerap tenaga kerja tambahan dalam porsi yang wajar seiring output tumbuh";
  } else if (absV < 150) {
    magnitude =
      "besar — pertumbuhan output di sektor ini tergolong padat karya, membutuhkan tambahan tenaga kerja dalam jumlah signifikan";
  } else {
    magnitude =
      "ekstrem — angka ini menandakan pergeseran struktural besar dalam penyerapan tenaga kerja sektor ini pada tahun tersebut, kemungkinan dipicu perubahan output yang sangat tipis";
  }

  return `Pada ${point.tahun}, ILOR sektor ${category.label} tercatat ${v.toFixed(2)} — tergolong ${magnitude}.`;
}

export default function Ilor() {
  const [selectedKey, setSelectedKey] = useState(ilorCategories[0].key);
  const selectedCategory = useMemo(
    () =>
      ilorCategories.find((c) => c.key === selectedKey) ?? ilorCategories[0],
    [selectedKey],
  );

  const years = selectedCategory.data.map((d) => d.tahun);
  const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);

  const selectedPoint = useMemo(() => {
    const found = selectedCategory.data.find((d) => d.tahun === selectedYear);
    return found ?? selectedCategory.data[selectedCategory.data.length - 1];
  }, [selectedCategory, selectedYear]);

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-8">
        <h2 className="heading-lg mt-2 font-bungee color-pink">
          Selain Modal,
          <span className=" color-green font-bungee">
            {" "}
            Bagaimana dengan Tenaga Kerja?
          </span>
        </h2>
        <p className="body-lg mt-3 max-w-2xl text-zinc-500 font-delius">
          Seberapa besar tambahan output berkaitan dengan penyerapan tenaga
          kerja di masing-masing sektor?
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="chart-container"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-700 mb-1 font-rubik">
                Incremental Labor Output Ratio (ILOR)
              </h3>
              <p className="text-xs text-zinc-400 font-rubik">
                Klik batang untuk melihat detail
              </p>
            </div>
            <select
              value={selectedKey}
              onChange={(e) => {
                setSelectedKey(e.target.value);
                setSelectedYear(years[years.length - 1]);
              }}
              className="text-xs border border-zinc-200 rounded-md px-3 py-1.5 bg-white text-zinc-700 focus:outline-none focus:ring-1 focus:ring-purple-400 max-w-[280px]"
            >
              {ilorCategories.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-center">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={selectedCategory.data}
                margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="tahun"
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar
                  dataKey="ilor"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                  onClick={(data: any) => setSelectedYear(data.tahun)}
                  cursor="pointer"
                >
                  {selectedCategory.data.map((d) => (
                    <Cell
                      key={d.tahun}
                      fill={
                        d.tahun === selectedYear
                          ? d.ilor < 0
                            ? "#c51b7d"
                            : "#4d9221"
                          : d.ilor < 0
                            ? "#fde0ef"
                            : "#e6f5d0"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedKey}-${selectedYear}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div
                    className="text-4xl font-bold tabular-nums font-rubik"
                    style={{
                      color: selectedPoint.ilor < 0 ? "#c51b7d" : "#4d9221",
                    }}
                  >
                    {selectedPoint.ilor.toFixed(2)}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1 mb-4 ">
                    ILOR {selectedYear} — {selectedCategory.label}
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {ilorNarrative(selectedCategory, selectedPoint)}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .recharts-wrapper:focus,
        .recharts-wrapper *:focus,
        .recharts-surface:focus {
          outline: none !important;
        }
      `}</style>
    </section>
  );
}
