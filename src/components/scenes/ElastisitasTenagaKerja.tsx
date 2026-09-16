"use client";

import { useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { ilorCategories, type IlorCategory, type IlorPoint } from "@/data/ilor";

function elastisitasNarrative(
  category: IlorCategory,
  point: IlorPoint,
): string {
  const v = point.elastisitas;

  if (v >= 1) {
    return `Elastisitas tenaga kerja sektor ${category.label} pada ${point.tahun} tercatat ${v.toFixed(2)} — lebih dari 1, artinya penyerapan tenaga kerja tumbuh lebih cepat dibanding pertumbuhan outputnya sendiri. Sektor ini relatif padat karya pada tahun tersebut.`;
  }
  if (v >= 0) {
    return `Elastisitas tenaga kerja sektor ${category.label} pada ${point.tahun} tercatat ${v.toFixed(2)} — di bawah 1, artinya penyerapan tenaga kerja tumbuh lebih lambat dibanding output. Pertumbuhan sektor ini cenderung hemat tenaga kerja.`;
  }
  return `Elastisitas tenaga kerja sektor ${category.label} pada ${point.tahun} tercatat negatif (${v.toFixed(2)}) — ketika output tumbuh, jumlah tenaga kerja di sektor ini justru menyusut, pola yang berlawanan arah.`;
}

const WIDTH = 760;
const HEIGHT = 280;
const PAD_X = 40;
const PAD_TOP = 30;
const PAD_BOTTOM = 40;

export default function ElastisitasTenagaKerja() {
  const [selectedKey, setSelectedKey] = useState(ilorCategories[0].key);
  const selectedCategory = useMemo(
    () =>
      ilorCategories.find((c) => c.key === selectedKey) ?? ilorCategories[0],
    [selectedKey],
  );

  const points = selectedCategory.data;

  const yDomain = useMemo(() => {
    const vals = points.map((d) => d.elastisitas);
    const min = Math.min(0, ...vals) - 0.2;
    const max = Math.max(2, ...vals) + 0.2;
    return [min, max];
  }, [points]);

  function getX(i: number) {
    return PAD_X + (i / (points.length - 1)) * (WIDTH - PAD_X * 2);
  }
  function getY(value: number) {
    const usable = HEIGHT - PAD_TOP - PAD_BOTTOM;
    const [min, max] = yDomain;
    return PAD_TOP + (1 - (value - min) / (max - min)) * usable;
  }

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p.elastisitas)}`)
    .join(" ");

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

  const activePoint = points[Math.min(activeIndex, points.length - 1)];
  const value = activePoint.elastisitas;
  const isResponsive = value >= 1;
  const refLineY = getY(1);

  return (
    <section
      ref={wrapperRef}
      className="relative"
      style={{ height: `${points.length * 50}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <h2 className="heading-lg mt-2 font-bungee color-pink">
            Seberapa Responsif
            <span className="font-bungee color-green">
              {" "}
              Penyerapan Tenaga Kerja?
            </span>{" "}
          </h2>
          <p className="body-lg mt-3 max-w-2xl text-zinc-500 font-delius">
            Seberapa besar penyerapan tenaga kerja merespons perubahan output di
            tiap sektor?
          </p>

          <div className="chart-container mt-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-700 mb-1 font-rubik">
                  Elastisitas Tenaga Kerja terhadap Output
                </h3>
              </div>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="text-xs border border-zinc-200 rounded-md px-3 py-1.5 bg-white text-zinc-700 focus:outline-none focus:ring-1 focus:ring-violet-400 max-w-[280px]"
              >
                {ilorCategories.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-center">
              {/* Chart */}
              <div className="relative w-full">
                <svg
                  viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                  className="w-full h-auto"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const [min, max] = yDomain;
                    return min + ((max - min) / 4) * i;
                  }).map((v) => (
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

                  <line
                    x1={PAD_X}
                    x2={WIDTH - PAD_X}
                    y1={refLineY}
                    y2={refLineY}
                    stroke="#a1a1aa"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                  <text
                    x={WIDTH - PAD_X + 6}
                    y={refLineY + 4}
                    fontSize={11}
                    fill="#a1a1aa"
                  >
                    1
                  </text>

                  <motion.path
                    key={selectedKey}
                    d={linePath}
                    fill="none"
                    stroke="#c51b7d"
                    strokeWidth={3}
                    strokeLinecap="round"
                    style={{ pathLength }}
                  />

                  {points.map((p, i) => {
                    const isActive = i === activeIndex;
                    const isPassed = i <= activeIndex;
                    const color = p.elastisitas >= 1 ? "#10b981" : "#ec4899";
                    return (
                      <g key={p.tahun}>
                        <circle
                          cx={getX(i)}
                          cy={getY(p.elastisitas)}
                          r={isActive ? 7 : 4}
                          fill={isActive ? color : "#ddd6fe"}
                          opacity={isPassed ? 1 : 0.15}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                        <text
                          x={getX(i)}
                          y={HEIGHT - 14}
                          textAnchor="middle"
                          fontSize={11}
                          fill={isActive ? color : "#a1a1aa"}
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

              {/* Interpretasi */}
              <div className="min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedKey}-${activeIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div
                      className="text-4xl font-bold tabular-nums font-rubik"
                      style={{ color: isResponsive ? "#4d9221" : "#ec4899" }}
                    >
                      {value.toFixed(2)}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 mb-4 font-rubik">
                      Elastisitas {activePoint.tahun} — {selectedCategory.label}
                    </div>
                    <div
                      className={`inline-block mb-4 text-xs font-medium px-2.5 py-1 rounded-full ${
                        isResponsive
                          ? "bg-green-50 text-green-600"
                          : "bg-pink-50 text-pink-600"
                      }`}
                    >
                      {isResponsive
                        ? "Penyerapan lebih responsif"
                        : "Penyerapan kurang responsif"}
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed font-rubik">
                      {elastisitasNarrative(selectedCategory, activePoint)}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Penutup */}
      <div className="max-w-6xl mx-auto px-6 absolute bottom-0 left-0 right-0 translate-y-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-12 mb-8 text-center"
        >
          <p className="text-3xl text-zinc-500 leading-relaxed font-delius ">
            Lalu, Bagaimana Pemerintah Membiayai Perannya?
          </p>
        </motion.div>
      </div>
    </section>
  );
}
