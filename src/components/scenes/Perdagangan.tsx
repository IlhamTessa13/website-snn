"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { perdaganganData } from "@/data/konsumsiPerdagangan";

const points = perdaganganData;

const perdaganganStory: Record<number, string> = {
  2016: "Mengawali periode observasi, Jawa Tengah mengekspor Rp92,6 T namun mengimpor Rp134,2 T — defisit Rp41,7 T menunjukkan daerah ini sejak awal lebih banyak bergantung pada barang dari luar dibanding menjualnya keluar.",
  2017: "Ekspor tumbuh ke Rp106,5 T, tapi impor tumbuh lebih cepat ke Rp160,9 T. Defisit melebar jadi Rp54,4 T — pertumbuhan ekonomi domestik justru menyedot lebih banyak barang impor, terutama untuk mendukung aktivitas industri.",
  2018: "Titik paling rentan: impor melonjak tajam ke Rp235,2 T sementara ekspor hanya Rp123,9 T. Defisit menembus Rp111,4 T, level terdalam sepanjang 2016-2025 — sinyal ketergantungan tinggi pada bahan baku dan barang modal dari luar.",
  2019: "Impor mulai terkoreksi ke Rp204,0 T sementara ekspor naik ke Rp127,7 T. Defisit menyempit ke Rp76,2 T — struktur perdagangan mulai sedikit lebih seimbang menjelang pandemi.",
  2020: "Pandemi menekan kedua sisi perdagangan, tapi impor turun lebih tajam (Rp149,4 T) dibanding ekspor (Rp122,9 T). Defisit menyusut drastis ke Rp26,6 T — bukan tanda kekuatan ekonomi, melainkan lesunya aktivitas industri yang butuh bahan baku impor.",
  2021: "Seiring pemulihan, ekspor melompat ke Rp158,8 T, tapi impor ikut naik ke Rp200,7 T mengikuti bangkitnya aktivitas produksi. Defisit kembali melebar ke Rp41,9 T — pola ketergantungan pada impor mulai terbentuk lagi.",
  2022: "Kedua sisi tumbuh bersamaan: ekspor ke Rp182,9 T, impor ke Rp240,4 T. Defisit Rp57,5 T mencerminkan ekonomi yang makin aktif berdagang dengan dunia luar, meski neraca tetap negatif.",
  2023: "Ekspor justru terkoreksi ke Rp160,4 T sementara impor tetap tinggi di Rp234,0 T. Defisit melebar ke Rp73,6 T — sinyal permintaan global terhadap produk Jawa Tengah melemah, sementara kebutuhan impor tetap kuat.",
  2024: "Ekspor pulih ke Rp182,5 T, tapi impor naik lebih tinggi ke Rp262,4 T — defisit terbesar kedua dalam periode ini, Rp79,9 T, menandakan tekanan ketergantungan impor yang belum juga mereda.",
  2025: "Titik balik: ekspor melonjak 16,6% ke Rp212,9 T, jauh melampaui pertumbuhan impor yang hanya 2,2% (Rp268,2 T). Defisit menyempit signifikan ke Rp55,3 T — RPI membaik ke -0,115, sinyal paling kuat bahwa kapasitas produksi daerah mulai mampu bersaing di pasar global.",
};

const WIDTH = 860;
const HEIGHT = 340;
const PAD_LEFT = 56;
const PAD_RIGHT = 78;
const PAD_TOP = 24;
const PAD_BOTTOM = 44;
const TRADE_MAX = 300000;
const RPI_MIN = -0.35;
const RPI_MAX = 0;

function getX(i: number) {
  return PAD_LEFT + (i / (points.length - 1)) * (WIDTH - PAD_LEFT - PAD_RIGHT);
}
function getBarY(value: number) {
  const usable = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const h = (value / TRADE_MAX) * usable;
  return { y: HEIGHT - PAD_BOTTOM - h, h };
}
function getRpiY(value: number) {
  const usable = HEIGHT - PAD_TOP - PAD_BOTTOM;
  return PAD_TOP + ((RPI_MAX - value) / (RPI_MAX - RPI_MIN)) * usable;
}

const rpiPath = points
  .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getRpiY(p.rpi)}`)
  .join(" ");

const BAR_W = 13;
const tradeTicks = [0, 100000, 200000, 300000];
const rpiTicks = [0, -0.1, -0.2, -0.3];

export default function Perdagangan() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const pathLength = useTransform(scrollYProgress, [0.02, 0.92], [0, 1]);
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(
      points.length - 1,
      Math.max(0, Math.floor(latest * points.length)),
    );
    setActiveIndex(idx);
  });

  const active = points[activeIndex];
  const isLastYear = activeIndex === points.length - 1;

  return (
    <>
      <section ref={wrapperRef} className="relative h-[420vh]">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <h2 className="heading-lg mt-2 font-bungee color-pink">
              Ekonomi
              <span className="font-bungee color-green"> yang Terbuka</span>
            </h2>
            <p className="body-lg mt-3 max-w-2xl text-zinc-500 font-delius">
              Setelah melihat konsumsi domestik, seberapa besar aktivitas
              ekonomi Jawa Tengah terhubung dengan perdagangan internasional?
            </p>

            <div className="chart-container mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-center">
              <div className="relative w-full">
                <svg
                  viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                  className="w-full h-auto"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {tradeTicks.map((v) => {
                    const y = getBarY(v).y;
                    return (
                      <line
                        key={`grid-${v}`}
                        x1={PAD_LEFT}
                        x2={WIDTH - PAD_RIGHT}
                        y1={y}
                        y2={y}
                        stroke="#f0f0f0"
                        strokeWidth={1}
                      />
                    );
                  })}

                  {tradeTicks.map((v) => (
                    <text
                      key={`left-${v}`}
                      x={PAD_LEFT - 10}
                      y={getBarY(v).y + 4}
                      textAnchor="end"
                      fontSize={10}
                      fill="#a1a1aa"
                    >
                      {v === 0 ? "0" : `${v / 1000}T`}
                    </text>
                  ))}

                  {rpiTicks.map((v) => (
                    <text
                      key={`right-${v}`}
                      x={WIDTH - PAD_RIGHT + 14}
                      y={getRpiY(v) + 4}
                      textAnchor="start"
                      fontSize={10}
                      fill="#c51b7d"
                    >
                      {v.toFixed(2)}
                    </text>
                  ))}

                  {points.map((p, i) => {
                    const isPassed = i <= activeIndex;
                    const isActive = i === activeIndex;
                    const cx = getX(i);
                    const eks = getBarY(p.ekspor);
                    const imp = getBarY(p.impor);

                    return (
                      <g key={p.tahun}>
                        <motion.rect
                          x={cx - BAR_W - 2}
                          width={BAR_W}
                          fill="#4d9221"
                          rx={2}
                          initial={{ height: 0, y: HEIGHT - PAD_BOTTOM }}
                          animate={
                            isPassed
                              ? { height: eks.h, y: eks.y, opacity: 1 }
                              : {
                                  height: 0,
                                  y: HEIGHT - PAD_BOTTOM,
                                  opacity: 0.15,
                                }
                          }
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                        <motion.rect
                          x={cx + 2}
                          width={BAR_W}
                          fill="#e9a3c9"
                          rx={2}
                          fillOpacity={0.75}
                          initial={{ height: 0, y: HEIGHT - PAD_BOTTOM }}
                          animate={
                            isPassed
                              ? { height: imp.h, y: imp.y, opacity: 1 }
                              : {
                                  height: 0,
                                  y: HEIGHT - PAD_BOTTOM,
                                  opacity: 0.15,
                                }
                          }
                          transition={{
                            duration: 0.5,
                            ease: "easeOut",
                            delay: 0.08,
                          }}
                        />
                        <text
                          x={cx}
                          y={HEIGHT - 16}
                          textAnchor="middle"
                          fontSize={11}
                          fill={isActive ? "#c51b7d" : "#a1a1aa"}
                          fontWeight={isActive ? 700 : 400}
                          opacity={isPassed ? 1 : 0.4}
                        >
                          {p.tahun}
                        </text>
                      </g>
                    );
                  })}

                  <motion.path
                    d={rpiPath}
                    fill="none"
                    stroke="#c51b7d"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    style={{ pathLength }}
                  />
                  {points.map((p, i) => {
                    const isActive = i === activeIndex;
                    const isPassed = i <= activeIndex;
                    return (
                      <circle
                        key={`rpi-${p.tahun}`}
                        cx={getX(i)}
                        cy={getRpiY(p.rpi)}
                        r={isActive ? 6 : 3.5}
                        fill="#7c3aed"
                        opacity={isPassed ? 1 : 0.15}
                        stroke="#fff"
                        strokeWidth={1.5}
                      />
                    );
                  })}
                </svg>

                <div className="flex items-center gap-4 mt-2 text-[11px] text-zinc-500 justify-center">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-green-500" />{" "}
                    Ekspor
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-pink-500/75" />{" "}
                    Impor
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />{" "}
                    RPI (skala kanan)
                  </span>
                </div>
              </div>

              <div className="min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-pink-600 tabular-nums font-rubik">
                        {active.rpi.toFixed(3)}
                      </span>
                      <span className="text-xs text-zinc-400 font-rubik">
                        RPI {active.tahun}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-600 leading-relaxed mt-4 font-rubik">
                      {perdaganganStory[active.tahun]}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto px-6 py-10 text-center"
      >
        <p className="text-lg text-zinc-500 leading-relaxed font-delius">
          Jika konsumsi dan perdagangan menjadi bagian dari aktivitas ekonomi
          Jawa Tengah,
        </p>

        <p className="text-2xl font-medium text-zinc-700 leading-relaxed mt-2 font-delius">
          bagaimana investasi digunakan untuk menghasilkan pertumbuhan?
        </p>
      </motion.div>
    </>
  );
}
