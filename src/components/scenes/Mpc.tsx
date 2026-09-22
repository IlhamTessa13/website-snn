"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { konsumsiRTData } from "@/data/konsumsiPerdagangan";

const points = konsumsiRTData.filter((d) => d.mpc !== null) as {
  tahun: number;
  mpc: number;
}[];

const mpcStory: Record<number, string> = {
  2017: "Mengawali data historis, setiap tambahan pendapatan Rp1 pada 2017 mendorong konsumsi naik sekitar Rp0,57 — masyarakat Jawa Tengah membelanjakan lebih dari separuh kenaikan pendapatannya.",
  2018: "Pola serupa berlanjut di 2018: dari setiap Rp1 tambahan pendapatan, sekitar Rp0,58 diterjemahkan menjadi konsumsi baru — respons masyarakat relatif stabil.",
  2019: "Tren ini terus konsisten hingga 2019, di mana Rp1 tambahan pendapatan mendorong Rp0,58 konsumsi tambahan — sinyal daya beli yang sehat menjelang pandemi.",
  2020: "Namun pandemi mengubah segalanya. Pada 2020, setiap Rp1 tambahan pendapatan hanya mendorong Rp0,43 konsumsi baru — masyarakat mulai menahan diri di tengah ketidakpastian.",
  2021: "Titik paling ekstrem terjadi di 2021: dari Rp1 tambahan pendapatan, hanya Rp0,34 yang dibelanjakan — respons konsumsi paling lemah sepanjang periode observasi.",
  2022: "Pemulihan mulai terasa di 2022. Setiap Rp1 tambahan pendapatan kini mendorong Rp0,62 konsumsi — hampir dua kali lipat respons tahun sebelumnya.",
  2023: "Puncaknya di 2023: Rp1 tambahan pendapatan mendorong Rp0,72 konsumsi baru — respons tertinggi sepanjang 2017-2025. Masyarakat benar-benar menjadi mesin penggerak ekonomi lewat belanja mereka.",
  2024: "Momentum ini sedikit mereda di 2024, dengan Rp1 tambahan pendapatan mendorong Rp0,68 konsumsi — masih kuat, namun mulai menunjukkan tanda normalisasi.",
  2025: "Di penghujung periode observasi, 2025 mencatat Rp1 tambahan pendapatan mendorong Rp0,57 konsumsi — kembali mendekati level awal periode, menutup siklus pemulihan pasca-pandemi.",
};

const WIDTH = 760;
const HEIGHT = 280;
const PAD_X = 40;
const PAD_TOP = 30;
const PAD_BOTTOM = 40;
const DOMAIN_MAX = 0.8;

function getX(i: number) {
  return PAD_X + (i / (points.length - 1)) * (WIDTH - PAD_X * 2);
}
function getY(mpc: number) {
  const usable = HEIGHT - PAD_TOP - PAD_BOTTOM;
  return PAD_TOP + (1 - mpc / DOMAIN_MAX) * usable;
}

const linePath = points
  .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p.mpc)}`)
  .join(" ");

export default function Mpc() {
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

  const activePoint = points[activeIndex];

  return (
    <section ref={wrapperRef} className="relative h-[420vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <h2 className="heading-lg mt-2 font-bungee color-pink">
            Ketika
            <span className=" font-bungee color-green"> Pendapatan</span>
          </h2>
          <h2 className="heading-lg mt-2 font-bungee color-pink">
            Menjadi
            <span className="font-bungee color-green"> Konsumsi</span>
          </h2>
          <p className="body-lg mt-3 max-w-2xl text-zinc-500 font-delius">
            Ketika pendapatan masyarakat Jawa Tengah meningkat, apakah mereka
            ikut meningkatkan konsumsinya?
          </p>

          <div className="chart-container mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-center">
            {/* Chart */}
            <div className="relative w-full">
              <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="w-full h-auto"
                preserveAspectRatio="xMidYMid meet"
              >
                {[0, 0.2, 0.4, 0.6, 0.8].map((v) => (
                  <line
                    key={v}
                    x1={PAD_X}
                    x2={WIDTH - PAD_X}
                    y1={getY(v)}
                    y2={getY(v)}
                    stroke="#f0f0f0"
                    strokeWidth={1}
                  />
                ))}

                <motion.path
                  d={linePath}
                  fill="none"
                  stroke="#a1d76a"
                  strokeWidth={3}
                  strokeLinecap="round"
                  style={{ pathLength }}
                />

                {points.map((p, i) => {
                  const isActive = i === activeIndex;
                  const isPassed = i <= activeIndex;
                  return (
                    <g key={p.tahun}>
                      <circle
                        cx={getX(i)}
                        cy={getY(p.mpc)}
                        r={isActive ? 7 : 4}
                        fill={isActive ? "#e9a3c9" : "#c51b7d"}
                        opacity={isPassed ? 1 : 0.15}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                      <text
                        x={getX(i)}
                        y={HEIGHT - 14}
                        textAnchor="middle"
                        fontSize={11}
                        fill={isActive ? "#a1d76a" : "#a1a1aa"}
                        fontWeight={isActive ? 700 : 400}
                        opacity={isPassed ? 1 : 0.4}
                      >
                        {p.tahun}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Interpretasi (tanpa implikasi) */}
            <div className="min-w-0 font-rubik">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="text-4xl font-bold tabular-nums color-pink">
                    {activePoint.mpc.toFixed(2)}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1 mb-4">
                    MPC {activePoint.tahun}
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {mpcStory[activePoint.tahun]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
