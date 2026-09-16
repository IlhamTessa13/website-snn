"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { konsumsiRTData } from "@/data/konsumsiPerdagangan";

const yearNotes: Record<number, { interpretasi: string; implikasi: string }> = {
  2016: {
    interpretasi:
      "Sebagai titik awal periode observasi, APC tercatat 67.65% — dari setiap Rp1 pendapatan, sekitar Rp0,68 dibelanjakan untuk konsumsi. Ini adalah level konsumsi tertinggi terhadap pendapatan sepanjang 2016-2025.",
    implikasi:
      "Tingginya porsi konsumsi pada tahun ini menopang permintaan domestik, sekaligus menjadi baseline untuk melihat pergeseran pola konsumsi rumah tangga pada tahun-tahun berikutnya.",
  },
  2017: {
    interpretasi:
      "APC turun tipis ke 67.13%, mengindikasikan rumah tangga sedikit lebih moderat dalam membelanjakan tambahan pendapatannya dibanding tahun sebelumnya.",
    implikasi:
      "Perlambatan kecil pada porsi konsumsi ini masih dalam batas wajar dan belum menunjukkan pelemahan daya beli yang signifikan.",
  },
  2018: {
    interpretasi:
      "APC kembali menurun menjadi 66.65%, melanjutkan tren perlambatan porsi konsumsi terhadap pendapatan selama tiga tahun berturut-turut.",
    implikasi:
      "Meski porsinya menurun, konsumsi secara nominal tetap tumbuh — tren ini mengindikasikan pendapatan rumah tangga tumbuh lebih cepat dibanding konsumsinya.",
  },
  2019: {
    interpretasi:
      "APC mencapai titik terendah pra-pandemi di 66.21%, menandakan porsi konsumsi terhadap pendapatan berada di level paling moderat sebelum krisis COVID-19.",
    implikasi:
      "Struktur pengeluaran yang lebih moderat ini turut membantu rumah tangga memiliki fleksibilitas lebih saat menghadapi guncangan ekonomi pada tahun berikutnya.",
  },
  2020: {
    interpretasi:
      "Di tengah pandemi, APC justru naik tipis ke 66.84% — bukan karena konsumsi meningkat, melainkan pendapatan disposabel yang turun lebih tajam dibanding konsumsi.",
    implikasi:
      "Kenaikan APC pada masa krisis ini mencerminkan tekanan ekonomi terhadap rumah tangga, di mana porsi pendapatan yang harus dialokasikan untuk konsumsi dasar justru membesar.",
  },
  2021: {
    interpretasi:
      "APC turun ke 65.78%, seiring rumah tangga menahan konsumsi di tengah ketidakpastian pemulihan ekonomi pasca-gelombang pandemi.",
    implikasi:
      "Penurunan porsi konsumsi ini bisa menahan laju pertumbuhan ekonomi jangka pendek, karena permintaan domestik yang belum sepenuhnya pulih.",
  },
  2022: {
    interpretasi:
      "APC melanjutkan penurunan ke 65.59%, salah satu level terendah dalam periode observasi, menandakan konsumsi belum sepenuhnya kembali ke pola normal.",
    implikasi:
      "Rendahnya porsi konsumsi pada tahap pemulihan awal ini berpotensi menjadi 'pent-up demand' yang mendorong lonjakan konsumsi pada periode berikutnya.",
  },
  2023: {
    interpretasi:
      "APC naik tipis ke 65.88%, mengindikasikan porsi konsumsi terhadap pendapatan mulai meningkat seiring pemulihan ekonomi berlanjut.",
    implikasi:
      "Pergeseran ini konsisten dengan pola pemulihan konsumsi bertahap, meski belum mengembalikan APC ke level pra-pandemi.",
  },
  2024: {
    interpretasi:
      "APC kembali naik menjadi 66.01%, menunjukkan proporsi konsumsi terhadap pendapatan terus meningkat seiring pemulihan ekonomi yang lebih matang.",
    implikasi:
      "Peningkatan porsi konsumsi yang konsisten ini menjadi indikator positif bagi pertumbuhan ekonomi berbasis permintaan domestik.",
  },
  2025: {
    interpretasi:
      "APC turun ke 65.55%, level terendah sepanjang periode observasi 2016-2025, mengindikasikan porsi pendapatan yang dibelanjakan untuk konsumsi berada di titik paling moderat.",
    implikasi:
      "Pola ini perlu dicermati — bisa mengindikasikan pelemahan daya beli atau sekadar penyesuaian sementara, mengingat level serupa (2021-2022) sebelumnya diikuti pemulihan konsumsi pada tahun berikutnya.",
  },
};

export default function Apc() {
  const years = konsumsiRTData.map((d) => d.tahun);
  const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);

  const selectedIndex = konsumsiRTData.findIndex(
    (d) => d.tahun === selectedYear,
  );
  const selected = konsumsiRTData[selectedIndex];
  const previous = selectedIndex > 0 ? konsumsiRTData[selectedIndex - 1] : null;

  const consumePct = selected.apc * 100;

  const avgApc = useMemo(
    () =>
      (konsumsiRTData.reduce((sum, d) => sum + d.apc, 0) /
        konsumsiRTData.length) *
      100,
    [],
  );

  const delta = previous ? consumePct - previous.apc * 100 : null;
  const vsAvg = consumePct - avgApc;
  const notes = yearNotes[selectedYear];

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-8">
        <p className="body-lg mt-3 max-w-2xl font-delius">
          Average Propensity to Consume (APC) — berapa persen pendapatan rumah
          tangga yang dibelanjakan untuk konsumsi.
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
              <h3 className="text-sm font-rubik-bold text-zinc-700 mb-1">
                APC Rumah Tangga Jawa Tengah
              </h3>
              <p className="text-xs text-zinc-400 font-rubik">
                Porsi pendapatan yang dibelanjakan untuk konsumsi, 2016–2025
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 max-w-md">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                    y === selectedYear
                      ? "bg-green-500 border-green-500 text-white font-semibold"
                      : "bg-white border-zinc-200 text-zinc-500 hover:border-green-300 hover:text-green-600"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Grid: kolom kiri menyesuaikan konten (auto), kolom kanan ambil sisa ruang tanpa overlap */}
          <div className="grid grid-cols-1 lg:grid-cols-[auto_minmax(0,1fr)] gap-10 items-start">
            {/* Kolom kiri: visual + angka */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="relative w-64 h-64 shrink-0 rounded-2xl overflow-hidden border border-zinc-100 bg-white">
                {/* Base: pink (belum "terisi" konsumsi) */}
                <img
                  src="/makanan2.webp"
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain p-3"
                />

                {/* Overlay: gambar warna, di-clip dari bawah sesuai persentase APC */}
                <motion.div
                  className="absolute inset-0"
                  style={{ willChange: "clip-path" }}
                  animate={{ clipPath: `inset(${100 - consumePct}% 0% 0% 0%)` }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                >
                  <img
                    src="/makanan.webp"
                    alt="Porsi konsumsi"
                    className="absolute inset-0 w-full h-full object-contain p-3"
                  />
                </motion.div>
              </div>

              <div className="flex flex-col gap-6 w-[170px] shrink-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedYear}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="text-4xl md:text-5xl font-rubik font-bold text-pink-500 tabular-nums">
                      {consumePct.toFixed(2)}%
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 font-rubik">
                      APC {selectedYear}
                    </div>

                    {delta !== null && (
                      <div
                        className={`flex items-center gap-1 mt-2 text-xs font-medium ${
                          delta > 0
                            ? "text-pink-600"
                            : delta < 0
                              ? "text-zinc-500"
                              : "text-zinc-400"
                        }`}
                      >
                        {delta > 0 ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : delta < 0 ? (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        ) : (
                          <Minus className="w-3.5 h-3.5" />
                        )}
                        {delta > 0 ? "+" : ""}
                        {delta.toFixed(2)} pp vs {previous!.tahun}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <p className=" font-rubik text-xs text-zinc-500 leading-relaxed">
                  Semakin tinggi APC, semakin besar bagian gambar yang "terisi"
                  yang merepresentasikan porsi pendapatan yang dibelanjakan untuk
                  konsumsi.
                </p>
              </div>
            </div>

            {/* Kolom kanan: Interpretasi & Implikasi */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedYear}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="min-w-0 space-y-4"
              >
                <div className="rounded-xl border border-pink-100 bg-pink-50/60 p-4 font-rubik">
                  <div className="flex items-center justify-between mb-2 gap-3"></div>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {notes.interpretasi}
                  </p>
                </div>

                <div className="rounded-xl border border-green-100 bg-green-50/60 p-4 font-rubik">

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
