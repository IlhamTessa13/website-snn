"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { konsumsiRTData } from "@/data/konsumsiPerdagangan";

const points = konsumsiRTData.filter((d) => d.elastisitas !== null) as {
  tahun: number;
  elastisitas: number;
}[];

const elastisitasStory: Record<number, string> = {
  2017: "Elastisitas 0,85 pada 2017 menunjukkan konsumsi bergerak lebih lambat dibanding pendapatan — kenaikan pendapatan belum sepenuhnya diterjemahkan menjadi belanja baru.",
  2018: "Pola ini berlanjut di 2018 dengan elastisitas 0,86 — konsumsi masih sedikit tertinggal dari laju pertumbuhan pendapatan.",
  2019: "Menjelang pandemi, elastisitas naik tipis ke 0,88 di 2019 — konsumsi mulai mendekati laju pendapatan, meski belum sepenuhnya sebanding.",
  2020: "Elastisitas anjlok ke 0,64 saat pandemi melanda — konsumsi jauh kurang responsif dibanding perubahan pendapatan, mencerminkan masyarakat yang menahan diri.",
  2021: "Di titik paling rendah, elastisitas hanya 0,52 pada 2021 — perubahan pendapatan nyaris tak berpengaruh terhadap keputusan belanja, tanda kehati-hatian ekstrem pasca-gelombang pandemi.",
  2022: "Elastisitas melonjak ke 0,94 di 2022, mendekati titik keseimbangan — konsumsi mulai bergerak nyaris sebanding dengan pendapatan seiring pemulihan ekonomi.",
  2023: "Untuk pertama—dan satu-satunya—kalinya, elastisitas menembus angka 1 di 2023 (1,09): konsumsi justru tumbuh lebih cepat dibanding pendapatan, sinyal optimisme belanja masyarakat mencapai puncaknya.",
  2024: "Momentum ini masih terjaga di 2024 dengan elastisitas 1,04 — konsumsi tetap tumbuh sedikit lebih cepat dari pendapatan, meski mulai melandai dari puncak tahun sebelumnya.",
  2025: "Elastisitas kembali turun ke 0,87 di 2025 — konsumsi kembali bergerak lebih lambat dibanding pendapatan, menutup periode observasi dengan pola yang mirip kondisi awal 2017.",
};

const DOMAIN_MAX = 2; // angka 1 selalu tepat di tengah (50%)

export default function Elastisitas() {
  const years = points.map((d) => d.tahun);
  const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);

  const selected = points.find((d) => d.tahun === selectedYear)!;
  const value = selected.elastisitas;
  const pct = Math.min(100, Math.max(0, (value / DOMAIN_MAX) * 100));
  const isResponsive = value >= 1;

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-8">
        <h2 className="heading-lg mt-2 font-bungee color-pink">
          Seberapa
          <span className=" font-bungee color-green"> Responsif</span> Konsumsi?
        </h2>
        <p className="body-lg mt-3 max-w-2xl text-zinc-500 font-delius">
          Apakah konsumsi berubah sebanding dengan perubahan pendapatan?
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="chart-container"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-zinc-700 mb-1 font-rubik">
                Elastisitas Konsumsi terhadap Pendapatan
              </h3>
              <p className="text-xs text-zinc-400 font-rubik">
                Hijau: konsumsi lebih responsif · Pink: pendapatan lebih dominan
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 max-w-md">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                    y === selectedYear
                      ? "bg-green-600 border-green-600 text-white font-semibold"
                      : "bg-white border-zinc-200 text-zinc-500 hover:border-green-300 hover:text-green-600"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Gauge */}
          <div className="relative pt-4 pb-2">
            <div className="relative h-10 rounded-full overflow-hidden flex border border-zinc-200">
              <div
                className="w-1/2 h-full"
                style={{
                  background: "linear-gradient(to left, #f9a8d4, #fbcfe8)",
                }}
              />
              <div
                className="w-1/2 h-full"
                style={{
                  background: "linear-gradient(to right, #6ee7b7, #a7f3d0)",
                }}
              />
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 flex flex-col items-center pointer-events-none">
              <div className="w-[2px] h-10 bg-white/80" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-5 text-[11px] font-semibold text-zinc-500">
              1
            </div>

            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              animate={{ left: `${pct}%` }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{ marginLeft: -14 }}
            >
              <div
                className="w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background: isResponsive ? "#10b981" : "#ec4899" }}
              >
                {selectedYear}
              </div>
            </motion.div>

            <div className="flex justify-between mt-8 text-[11px] text-zinc-400 px-1">
              <span>0</span>
              <span>2</span>
            </div>
          </div>

          {/* Value + narasi */}
          <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-8 items-start mt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedYear}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className="text-4xl md:text-5xl font-bold tabular-nums font-rubik"
                  style={{ color: isResponsive ? "#10b981" : "#ec4899" }}
                >
                  {value.toFixed(2)}
                </div>
                <div className="text-xs text-zinc-400 mt-1 font-rubik">
                  Elastisitas {selectedYear}
                </div>
                <div
                  className={`font-rubik inline-block mt-3 text-xs font-medium px-2.5 py-1 rounded-full ${
                    isResponsive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-pink-50 text-pink-600"
                  }`}
                >
                  {isResponsive
                    ? "Konsumsi lebih responsif"
                    : "Konsumsi kurang responsif"}
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedYear + "-story"}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="min-w-0 rounded-xl border border-zinc-100 bg-zinc-50/60 p-4"
              >
                <p className="text-sm text-zinc-600 leading-relaxed font-rubik">
                  {elastisitasStory[selectedYear]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Penutup — jembatan ke Perdagangan Internasional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-12 mb-8 text-center"
        >
          <p className="text-base font-medium text-zinc-700 leading-relaxed font-delius">
            Dengan demikian, konsumsi rumah tangga di Jawa Tengah menunjukkan
            bagaimana perubahan pendapatan diterjemahkan menjadi aktivitas
            ekonomi masyarakat.
          </p>
          <p className="text-base font-medium text-zinc-700 leading-relaxed mt-3 font-delius">
            Namun, Jawa Tengah bukan ekonomi yang berdiri sendiri. Seberapa
            besar aktivitas ekonominya bergantung pada hubungan dengan wilayah
            dan negara lain?
          </p>
        </motion.div>
      </div>
    </section>
  );
}
