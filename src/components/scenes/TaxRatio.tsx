"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { taxRatioData } from "@/data/icorTaxRatio";

const TOTAL_SQUARES = 100;
const PINK = "#ec4899";
const GREEN = "#22c55e";

type SquareType = "pink" | "green";

// Interpretasi & implikasi naratif per tahun — konteks spesifik di luar angka mentah
const yearNotes: Record<number, { interpretasi: string; implikasi: string }> = {
  2019: {
    interpretasi:
      "Tax ratio berada di level moderat, mencerminkan kondisi fiskal yang relatif stabil sebelum pandemi.",
    implikasi:
      "Ruang fiskal daerah masih memadai untuk mendukung belanja pembangunan tanpa tekanan besar.",
  },
  2020: {
    interpretasi:
      "Tax ratio turun ke titik terendah sejak 2019, akibat pandemi COVID-19 yang menekan aktivitas ekonomi dan penerimaan pajak.",
    implikasi:
      "Pemerintah daerah perlu insentif fiskal tambahan atau bantuan transfer pusat untuk menutup kesenjangan penerimaan.",
  },
  2021: {
    interpretasi:
      "Tax ratio mulai membaik seiring pemulihan ekonomi bertahap pasca-gelombang awal pandemi.",
    implikasi:
      "Pemulihan penerimaan pajak mengindikasikan aktivitas ekonomi mulai bangkit, meski belum kembali ke level pra-pandemi.",
  },
  2022: {
    interpretasi:
      "Tax ratio melampaui level 2019, menandakan pemulihan ekonomi yang solid dan basis pajak yang meluas.",
    implikasi:
      "Momentum ini bisa dimanfaatkan untuk memperkuat basis pajak jangka panjang, misalnya lewat digitalisasi pemungutan.",
  },
  2023: {
    interpretasi:
      "Tax ratio sedikit melandai dibanding 2022, meski masih berada di atas rata-rata periode 2019-2025.",
    implikasi:
      "Perlu diwaspadai apakah ini perlambatan sementara atau awal tren penurunan penerimaan pajak.",
  },
  2024: {
    interpretasi:
      "Tax ratio mencapai puncaknya sepanjang 2019-2025, menunjukkan kapasitas fiskal daerah yang paling kuat.",
    implikasi:
      "Kondisi ini ideal untuk memperluas program pembangunan yang didanai dari penerimaan pajak daerah sendiri.",
  },
  2025: {
    interpretasi:
      "Tax ratio anjlok tajam ke level terendah dalam periode ini, kontras dengan pencapaian tertinggi setahun sebelumnya.",
    implikasi:
      "Penurunan tajam ini perlu ditelusuri lebih lanjut — apakah karena perlambatan ekonomi, perubahan kebijakan pajak, atau faktor musiman/administratif.",
  },
};

export default function TaxRatio() {
  const years = taxRatioData.map((d) => d.tahun);
  const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);
  const [hoveredType, setHoveredType] = useState<SquareType | null>(null);

  const selectedIndex = taxRatioData.findIndex((d) => d.tahun === selectedYear);
  const selected = taxRatioData[selectedIndex];
  const previous = selectedIndex > 0 ? taxRatioData[selectedIndex - 1] : null;

  const avgRatio = useMemo(
    () =>
      taxRatioData.reduce((sum, d) => sum + d.ratio, 0) / taxRatioData.length,
    [],
  );

  const delta = previous ? selected.ratio - previous.ratio : null;
  const vsAvg = selected.ratio - avgRatio;
  const notes = yearNotes[selectedYear];

  const fullSquares = Math.floor(selected.ratio);
  const partialFraction = selected.ratio - fullSquares;
  const hasPartial = partialFraction > 0.001;

  const squares = Array.from({ length: TOTAL_SQUARES }, (_, i) => {
    if (i < fullSquares) return { type: "full" as const };
    if (i === fullSquares && hasPartial)
      return { type: "partial" as const, fraction: partialFraction };
    return { type: "empty" as const };
  });

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-6 pt-30 pb-8 py-17">
        <h2 className="heading-lg mt-2 font-bungee color-pink">
          Di Tengah Aktivitas Ekonomi,
          <span className="font-bungee color-green">
            {" "}
            Seberapa Besar Kapasitas Fiskal Daerah?
          </span>
        </h2>
        <p className="body-lg mt-3 max-w-2xl font-delius">
          Seberapa besar penerimaan pajak dibandingkan ukuran perekonomian Jawa
          Tengah?
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="chart-container"
        >
          {/* Header: title + year selector */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-700 mb-1 font-rubik">
                Tax Ratio Provinsi Jawa Tengah
              </h3>
              <p className="text-xs text-zinc-400 font-rubik">
                Rasio penerimaan pajak terhadap PDRB (ADHB) — 1 kotak = 1%
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                    y === selectedYear
                      ? "bg-green-500 border-green-500 text-white font-semibold"
                      : "bg-white border-zinc-200 text-zinc-500 hover:border-green-300 hover:text-green-500"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Waffle grid + big number */}
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start shrink-0">
              <div className="grid grid-cols-10 gap-1.5">
                {squares.map((sq, idx) => {
                  const isPinkish = sq.type === "full" || sq.type === "partial";
                  const squareType: SquareType = isPinkish ? "pink" : "green";
                  const isDimmed =
                    hoveredType !== null && hoveredType !== squareType;
                  const isActive = hoveredType === squareType;

                  return (
                    <motion.div
                      key={`${selectedYear}-${idx}`}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{
                        opacity: isDimmed ? 0.35 : 1,
                        scale: isActive ? 1.15 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                      onMouseEnter={() => setHoveredType(squareType)}
                      onMouseLeave={() => setHoveredType(null)}
                      className="relative w-5 h-5 md:w-6 md:h-6 rounded-[3px] overflow-hidden cursor-default"
                      style={{
                        background: GREEN,
                        boxShadow: isActive
                          ? squareType === "pink"
                            ? "0 4px 10px rgba(236,72,153,0.45)"
                            : "0 4px 10px rgba(34,197,94,0.45)"
                          : "none",
                      }}
                      title={
                        isPinkish
                          ? `Tax Ratio ${selectedYear}: ${selected.ratio.toFixed(3)}%`
                          : `Non-Pajak PDRB ${selectedYear}: ${(100 - selected.ratio).toFixed(3)}%`
                      }
                    >
                      {sq.type === "full" && (
                        <div
                          className="absolute inset-0"
                          style={{ background: PINK }}
                        />
                      )}
                      {sq.type === "partial" && (
                        <div
                          className="absolute inset-y-0 left-0"
                          style={{
                            width: `${sq.fraction * 100}%`,
                            background: PINK,
                          }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-6 min-w-[160px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedYear}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="text-4xl md:text-5xl font-bold text-pink-500 tabular-nums font-rubik">
                      {selected.ratio.toFixed(3)}%
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">
                      Tax Ratio {selectedYear}
                    </div>

                    {delta !== null && (
                      <div
                        className={`flex items-center gap-1 mt-2 text-xs font-medium ${
                          delta > 0
                            ? "text-emerald-600"
                            : delta < 0
                              ? "text-red-500"
                              : "text-zinc-400"
                        }`}
                      >
 
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="space-y-2">
                  <div
                    className={`flex items-center gap-2 text-xs cursor-default transition-opacity ${
                      hoveredType === "green" ? "opacity-40" : "text-zinc-600"
                    }`}
                    onMouseEnter={() => setHoveredType("pink")}
                    onMouseLeave={() => setHoveredType(null)}
                  >
                    <span
                      className="w-3 h-3 rounded-[3px]"
                      style={{ background: PINK }}
                    />
                    Penerimaan Pajak
                  </div>
                  <div
                    className={`flex items-center gap-2 text-xs cursor-default transition-opacity ${
                      hoveredType === "pink" ? "opacity-40" : "text-zinc-600"
                    }`}
                    onMouseEnter={() => setHoveredType("green")}
                    onMouseLeave={() => setHoveredType(null)}
                  >
                    <span
                      className="w-3 h-3 rounded-[3px]"
                      style={{ background: GREEN }}
                    />
                    Non-Pajak PDRB
                  </div>
                </div>
              </div>
            </div>

            {/* Interpretasi & Implikasi */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedYear}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="flex-1 space-y-4 w-full"
              >
                <div className="rounded-xl border border-pink-100 bg-pink-50/60 p-4">
                  <div className="flex items-center justify-between mb-2">

                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {notes.interpretasi}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">

                  <p className="text-sm text-zinc-600 leading-relaxed mt-2">
                    {notes.implikasi}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>


        </motion.div>
      </div>
    </section>
  );
}
