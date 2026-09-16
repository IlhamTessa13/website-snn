"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { sortedByAdhb, narrativeGroups } from "@/data/pdrbPerKapita";

export default function DisparitasPDRB() {
  const [activeGroup, setActiveGroup] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const activeRegions = narrativeGroups[activeGroup]?.regions || [];

  const maxAdhb = Math.max(...sortedByAdhb.map((d) => d.pdrbAdhb));
  const maxAdhk = Math.max(...sortedByAdhb.map((d) => d.pdrbAdhk));

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    let best = -1;
    let bestRatio = 0;
    entries.forEach((entry) => {
      const idx = parseInt((entry.target as HTMLElement).dataset.step || "0");
      if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
        bestRatio = entry.intersectionRatio;
        best = idx;
      }
    });
    if (best >= 0) setActiveGroup(best);
  }, []);

  useEffect(() => {
    const container = sectionRef.current;
    if (!container) return;
    const steps = container.querySelectorAll("[data-step]");
    const obs = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
    });
    steps.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [handleIntersection]);

  return (
    <section ref={sectionRef} className="relative">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-8">
        <span className="heading-sm">Scene 1</span>
        <h2 className="heading-lg mt-2">
          Disparitas PDRB Per Kapita
          <span className="font-editorial gradient-text-amber"> 2025</span>
        </h2>
        <p className="body-lg mt-3 max-w-2xl">
          Perbandingan PDRB per kapita Atas Dasar Harga Berlaku (ADHB) dan Atas
          Dasar Harga Konstan 2010 (ADHK) untuk 35 kabupaten/kota di Jawa Tengah.
        </p>
      </div>

      {/* Dual pane layout */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-6">
        {/* Left: Sticky Chart */}
        <div className="lg:w-[58%] lg:sticky lg:top-4 lg:self-start lg:h-[calc(100vh-2rem)] overflow-y-auto">
          <div className="chart-container p-4">
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-amber-500" />
                <span className="text-xs font-medium text-zinc-500">ADHB (ribu Rp)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-purple-500" />
                <span className="text-xs font-medium text-zinc-500">ADHK 2010 (ribu Rp)</span>
              </div>
            </div>

            {/* Diverging Bar Chart */}
            <div className="space-y-[3px]">
              {sortedByAdhb.map((item) => {
                const isActive = activeRegions.includes(item.name);
                const adhbWidth = (item.pdrbAdhb / maxAdhb) * 100;
                const adhkWidth = (item.pdrbAdhk / maxAdhk) * 100;

                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-0 transition-opacity duration-500"
                    style={{ opacity: activeRegions.length === 0 ? 1 : isActive ? 1 : 0.15 }}
                  >
                    {/* ADHB bar (left, grows right-to-left) */}
                    <div className="flex-1 flex justify-end">
                      <motion.div
                        className="h-[16px] rounded-l-sm"
                        style={{
                          width: `${adhbWidth}%`,
                          background: isActive
                            ? "linear-gradient(90deg, #f59e0b, #d97706)"
                            : "#e4e4e7",
                        }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>

                    {/* Center label */}
                    <div
                      className="w-[130px] text-center text-[10px] font-medium px-1 shrink-0 truncate transition-colors duration-300"
                      style={{
                        color: isActive ? "#1a1a1a" : "#a1a1aa",
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      {item.name.replace("Kab. ", "").replace("Kota ", "Kt. ")}
                    </div>

                    {/* ADHK bar (right, grows left-to-right) */}
                    <div className="flex-1">
                      <motion.div
                        className="h-[16px] rounded-r-sm"
                        style={{
                          width: `${adhkWidth}%`,
                          background: isActive
                            ? "linear-gradient(90deg, #7c3aed, #a78bfa)"
                            : "#e4e4e7",
                          transformOrigin: "left",
                        }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Scrollable Narrative */}
        <div className="lg:w-[42%] pb-24">
          {narrativeGroups.map((group, idx) => (
            <div
              key={idx}
              data-step={idx}
              className="narrative-step"
            >
              <div
                className="p-6 rounded-xl border transition-all duration-500"
                style={{
                  borderColor: activeGroup === idx ? "#d97706" : "#e4e4e7",
                  background:
                    activeGroup === idx
                      ? "rgba(217,119,6,0.03)"
                      : "transparent",
                }}
              >
                <span className="heading-sm">
                  {idx === 0 && "Tertinggi"}
                  {idx === 1 && "Di Atas Rata-rata"}
                  {idx === 2 && "Menengah"}
                  {idx === 3 && "Terendah"}
                </span>
                <h3 className="heading-md mt-2">{group.title}</h3>
                <p className="body-lg mt-3">{group.text}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {group.regions.map((r) => (
                    <span key={r} className="pill pill-amber">
                      {r.replace("Kab. ", "").replace("Kota ", "Kt. ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
