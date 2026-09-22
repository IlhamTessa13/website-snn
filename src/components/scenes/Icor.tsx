"use client";

import { useState } from "react";
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
import { icorData } from "@/data/icorTaxRatio";

const icorStory: Record<number, string> = {
  2017: "Pada 2017, ICOR Jawa Tengah berada di angka 5,93. Artinya, diperlukan tambahan modal sekitar 5,93 satuan untuk menghasilkan tambahan output sebesar 1 satuan.",

  2018: "Pada 2018, ICOR meningkat tipis menjadi 6,02. Ini menunjukkan kebutuhan modal untuk menghasilkan tambahan output sedikit lebih besar dibandingkan tahun sebelumnya.",

  2019: "Pada 2019, ICOR turun menjadi 5,93. Penurunan ini menunjukkan adanya sedikit perbaikan efisiensi investasi dibandingkan 2018, meskipun nilainya masih hampir sama dengan 2017.",

  2020: "Tahun 2020 menunjukkan kondisi yang berbeda: ICOR bernilai -10,58. Nilai negatif terjadi karena output (PDRB) mengalami penurunan, sementara PMTB masih tercatat positif. Kondisi pandemi membuat hubungan antara tambahan modal dan pertumbuhan output menjadi tidak normal.",

  2021: "Pada 2021, ICOR melonjak menjadi 9,25, tertinggi selama periode 2017–2025. Kenaikan ini menunjukkan bahwa pemulihan output membutuhkan tambahan modal yang relatif besar dibandingkan pertumbuhan output yang dihasilkan.",

  2022: "Pada 2022, ICOR turun cukup tajam menjadi 5,72. Penurunan ini menunjukkan perbaikan efisiensi investasi dibandingkan 2021, seiring dengan semakin kuatnya pemulihan ekonomi setelah pandemi.",

  2023: "Pada 2023, ICOR kembali meningkat menjadi 6,05. Artinya, tambahan modal yang dibutuhkan untuk menghasilkan tambahan output sedikit lebih besar dibandingkan tahun sebelumnya.",

  2024: "Pada 2024, ICOR meningkat lagi menjadi 6,17. Ini menjadi salah satu nilai ICOR tertinggi dalam periode setelah pandemi, yang menunjukkan kebutuhan modal yang relatif lebih besar untuk menghasilkan tambahan output.",

  2025: "Pada 2025, ICOR turun menjadi 5,78. Penurunan ini menunjukkan adanya perbaikan efisiensi investasi dibandingkan 2024, sekaligus menjadi penutup periode dengan ICOR yang lebih rendah dibandingkan dua tahun sebelumnya.",
};

export default function Icor() {
  const years = icorData.map((d) => d.tahun);
  const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);
  const selected = icorData.find((d) => d.tahun === selectedYear)!;

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-3 pt-24 pb-8">
        <h2 className="heading-lg mt-2 font-bungee color-pink">
          Pertumbuhan
          <span className="font-bungee color-green"> Tidak Gratis</span>{" "}
        </h2>
        <p className="body-lg mt-3 max-w-2xl text-zinc-500 font-delius">
          Untuk menghasilkan tambahan output, perekonomian membutuhkan tambahan
          modal. Seberapa besar modal yang dibutuhkan untuk setiap tambahan
          output tersebut?
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="chart-container"
        >
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-zinc-700 mb-1 font-rubik">
              Incremental Capital Output Ratio (ICOR)
            </h3>
            <p className="text-xs text-zinc-400 font-rubik">
              Klik batang untuk melihat detail. Semakin rendah ICOR, semakin
              efisien investasi menghasilkan output
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-center">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={icorData}
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
                  dataKey="icor"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                  onClick={(data: any) => setSelectedYear(data.tahun)}
                  cursor="pointer"
                >
                  {icorData.map((d) => (
                    <Cell
                      key={d.tahun}
                      fill={
                        d.tahun === selectedYear
                          ? d.icor < 0
                            ? "#c51b7d"
                            : "#4d9221"
                          : d.icor < 0
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
                  key={selectedYear}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div
                    className="text-4xl font-bold tabular-nums font-rubik"
                    style={{
                      color: selected.icor < 0 ? "#c51b7d" : "#4d9221",
                    }}
                  >
                    {selected.icor.toFixed(2)}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1 mb-4 font-rubik">
                    ICOR {selectedYear}
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed font-rubik">
                    {icorStory[selectedYear]}
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
