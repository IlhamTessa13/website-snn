// src/components/scenes/StrukturEkonomiSunburst.tsx
"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as d3 from "d3";
import {
  getHierarchicalData,
  narrativeSteps,
  type HierarchyData,
} from "@/data/strukturEkonomi";

export default function StrukturEkonomiSunburst() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Data State for 2016 and 2025
  const data2016 = useMemo(() => getHierarchicalData(2016), []);
  const data2025 = useMemo(() => getHierarchicalData(2025), []);

  // Determine which year to show based on step
  const activeYear = activeStep < 2 ? 2016 : 2025;
  const activeData = activeStep < 2 ? data2016 : data2025;

  // Scroll detection
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      let best = -1;
      let bestRatio = 0;
      entries.forEach((entry) => {
        const idx = parseInt((entry.target as HTMLElement).dataset.step || "0");
        if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
          bestRatio = entry.intersectionRatio;
          best = idx;
        }
      });
      if (best >= 0) setActiveStep(best);
    },
    [],
  );

  useEffect(() => {
    const container = sectionRef.current;
    if (!container) return;
    const steps = container.querySelectorAll("[data-step]");
    const obs = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: "-20% 0px -40% 0px",
    });
    steps.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [handleIntersection]);

  // Compute D3 Partition Layout
const root = useMemo(() => {
  const hierarchy = d3
    .hierarchy<HierarchyData>(activeData)
    .sum((d) => d.value || 0);

  return d3.partition<HierarchyData>().size([2 * Math.PI, 100])(hierarchy);
}, [activeData]);

  // Styling rules based on Step
const getStyle = (node: d3.HierarchyNode<HierarchyData>) => {
  const isRing1 = node.depth === 1;
  const isRing2 = node.depth === 2;
  const isPrimer =
    node.data.name === "Primer" ||
    (node.parent && node.parent.data.name === "Primer");
  const isSekunder =
    node.data.name === "Sekunder" ||
    (node.parent && node.parent.data.name === "Sekunder");
  const isTersier =
    node.data.name === "Tersier" ||
    (node.parent && node.parent.data.name === "Tersier");

  // Visibility logic (Sweep & Fade-in)
  let opacity = 1;
  if (activeStep === 0 && isRing2) opacity = 0; // Hide ring 2 on step 0

  // Highlight logic
  let strokeWidth = 1.5;
  let strokeColor = "#FFFFFF";
  let isDimmed = false;

  if (activeStep === 1 && node.data.code === "C") {
    strokeWidth = 3;
    strokeColor = "#C2410C";
  }
  if (activeStep === 2 && isSekunder && isRing1) {
    strokeWidth = 3;
    strokeColor = "#9A3412";
  }
  if (activeStep === 3) {
    if (isPrimer) {
      strokeWidth = 3;
      strokeColor = "#3F6212";
    } else {
      isDimmed = true;
    }
  }
  if (activeStep === 4) {
    if (node.data.code === "J" || node.data.code === "H") {
      strokeWidth = 3;
      strokeColor = "#0E7490";
    } else if (!isTersier) {
      isDimmed = true;
    }
  }
  if (activeStep === 5 && isSekunder) {
    if (node.data.code === "F") {
      strokeWidth = 3;
      strokeColor = "#065F46";
    } // highlight konstruksi
  } else if (activeStep === 5 && !isSekunder) {
    isDimmed = true;
  }

  return { opacity: isDimmed ? 0.3 : opacity, strokeWidth, strokeColor };
};

  // Color generator
  const colorScale = useMemo(() => {
    return {
      Primer: d3
        .scaleLinear<string>()
        .domain([0, 1])
        .range(["#65A30D", "#bef264"]),
      Sekunder: d3
        .scaleLinear<string>()
        .domain([0, 3])
        .range(["#F97316", "#fdba74"]),
      Tersier: d3
        .scaleLinear<string>()
        .domain([0, 10])
        .range(["#0891B2", "#67e8f9"]),
    };
  }, []);

  const arcGenerator = d3
    .arc<any>()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius((d) => d.y0 * 1.5)
    .outerRadius(
      (d) =>
        d.y1 * 1.5 +
        (activeStep === 5 &&
        (d.data.name === "Sekunder" ||
          (d.parent && d.parent.data.name === "Sekunder"))
          ? 20
          : 0),
    )
    .padAngle(0.01)
    .padRadius(150);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white border-t border-zinc-200"
    >
      {/* Title */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-8 text-center lg:text-left">
        <h2 className="heading-lg text-zinc-900 font-bungee color-pink">
          Struktur Ekonomi <p  className="font-bungee color-green">Jawa Tengah</p>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12">
        {/* LEFT: Sticky Sunburst Chart */}
        <div className="lg:w-[60%] lg:sticky lg:top-12 lg:self-start lg:h-[80vh] flex flex-col items-center justify-center">
          {/* Legend */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#65A30D]"></div>
              <span className="text-sm font-semibold text-zinc-600">
                Primer
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#F97316]"></div>
              <span className="text-sm font-semibold text-zinc-600">
                Sekunder
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#0891B2]"></div>
              <span className="text-sm font-semibold text-zinc-600">
                Tersier
              </span>
            </div>
          </div>

          <div className="relative w-full aspect-square max-w-[500px]">
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-5xl font-bold text-zinc-900 transition-all duration-700 font-rubik">
                {activeYear}
              </span>
              <span className="text-sm text-zinc-400 font-medium font-rubik ">
                100% PDRB
              </span>
            </div>

            <svg
              viewBox="-160 -160 320 320"
              className="w-full h-full transform -rotate-90"
            >
              {/* Outer guide ring */}
              <circle
                r="150"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              <g className="transition-transform duration-1000 ease-in-out">
                {root
                  .descendants()
                  .filter((d) => d.depth > 0)
                  .map((node, i) => {
                    const style = getStyle(node);

                    // Generate Colors
                    let fill = "#ccc";
                    if (node.depth === 1) fill = node.data.color ?? "#ccc";
                    else if (node.depth === 2 && node.parent) {
                      const parentName = node.parent.data.name;

                      if (
                        parentName === "Primer" ||
                        parentName === "Sekunder" ||
                        parentName === "Tersier"
                      ) {
                        const index = node.parent.children?.indexOf(node) ?? 0;
                        fill = colorScale[parentName](index);
                      }
                    }

                    return (
                      <path
                        key={node.data.name}
                        d={arcGenerator(node) || undefined}
                        fill={fill}
                        stroke={style.strokeColor}
                        strokeWidth={style.strokeWidth}
                        style={{
                          opacity: style.opacity,
                          transition: "all 800ms cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                        className="cursor-pointer hover:opacity-80"
                      >
                        <title>
                          {node.data.name}: {node.value?.toFixed(2)}%
                        </title>
                      </path>
                    );
                  })}
              </g>
            </svg>
          </div>
        </div>

        {/* RIGHT: Scrollable Narrative */}
        <div className="lg:w-[40%] pb-32 pt-20 font-rubik">
          {narrativeSteps.map((step, idx) => (
            <div
              key={idx}
              data-step={idx}
              className="narrative-step min-h-[60vh] flex items-center"
            >
              <div
                className="p-8 rounded-2xl bg-[#F7F7F5] transition-all duration-500 shadow-sm border border-zinc-100"
                style={{
                  opacity: activeStep === idx ? 1 : 0.3,
                  transform:
                    activeStep === idx ? "translateY(0)" : "translateY(12px)",
                }}
              >
                <h3 className="heading-md mb-4 text-zinc-900 color-green font-rubik">{step.title}</h3>
                <p
                  className="body-lg text-zinc-700 leading-relaxed font-rubik "
                  dangerouslySetInnerHTML={{
                    // Simple logic to bold or highlight specific keywords from the text based on the step
                    __html: step.text
                      .replace(
                        /Industri Pengolahan adalah tulang punggung ekonomi Jawa Tengah/g,
                        "<strong>Industri Pengolahan adalah tulang punggung ekonomi Jawa Tengah</strong>",
                      )
                      .replace(
                        /Sektor Sekunder tetap menjadi kontributor terbesar/g,
                        "<strong>Sektor Sekunder tetap menjadi kontributor terbesar</strong>",
                      )
                      .replace(
                        /sektor Primer terus menyusut/g,
                        "<strong>sektor Primer terus menyusut</strong>",
                      )
                      .replace(
                        /sektor Tersier tumbuh signifikan/g,
                        "<strong>sektor Tersier tumbuh signifikan</strong>",
                      )
                      .replace(
                        /34,69%/g,
                        "<span class='px-1 rounded bg-[#FFEDD5] text-[#C2410C] font-semibold'>34,69%</span>",
                      )
                      .replace(
                        /45,01%/g,
                        "<span class='px-1 rounded bg-[#FFEDD5] text-[#C2410C] font-semibold'>45,01%</span>",
                      )
                      .replace(
                        /15,16%/g,
                        "<span class='px-1 rounded bg-[#FCE7F3] text-[#9D174D] font-semibold'>15,16%</span>",
                      )
                      .replace(
                        /39,86%/g,
                        "<span class='px-1 rounded bg-[#DCFCE7] text-[#166534] font-semibold'>39,86%</span>",
                      )
                      .replace(
                        /4,29%/g,
                        "<span class='px-1 rounded bg-[#FFEDD5] text-[#C2410C] font-semibold'>4,29%</span>",
                      )
                      .replace(
                        /11,47%/g,
                        "<span class='px-1 rounded bg-[#DCFCE7] text-[#166534] font-semibold'>11,47%</span>",
                      ),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
