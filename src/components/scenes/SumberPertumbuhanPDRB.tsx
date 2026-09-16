"use client";

import { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import {
  sumberPertumbuhanData,
  columnMeta,
  formatValue,
  type ColKey,
} from "@/data/SumberPertumbuhanPDRB";

type HighlightColor = "amber" | "green" | "red" | "gray" | "orange";

interface CellTarget {
  rowId: string;
  cols: ColKey[];
  color: HighlightColor;
}

interface Step {
  eyebrow: string;
  title: string;
  narrative: ReactNode;
  targets: CellTarget[];
}

const COLORS: Record<HighlightColor, { bg: string; text: string }> = {
  amber: { bg: "#e6f5d0", text: "#4d9221" },
  green: { bg: "#e6f5d0", text: "#4d9221" },
  red: { bg: "#e6f5d0", text: "#4d9221" },
  gray: { bg: "#e6f5d0", text: "#c51b7d" },
  orange: { bg: "#e6f5d0", text: "#c51b7d" },
};

function Mark({
  color,
  children,
}: {
  color: HighlightColor;
  children: ReactNode;
}) {
  const c = COLORS[color];
  return (
    <span
      className="rounded px-1 py-0.5 transition-colors duration-300"
      style={{ background: c.bg, color: c.text, fontWeight: 500 }}
    >
      {children}
    </span>
  );
}

const steps: Step[] = [
  {
    eyebrow: "",
    title: "Pembuka",
    narrative: (
      <>
        Pertumbuhan ekonomi tidak berasal dari satu sumber. Data di samping
        merinci komponen mana yang mendorong — atau menahan — pertumbuhan PDRB
        Jawa Tengah pada Triwulan IV 2025, dilihat dari tiga sudut pandang:
        dibanding kuartal sebelumnya (q-to-q), dibanding kuartal yang sama tahun
        lalu (y-on-y), dan dibanding total tahun lalu (c-to-c).
      </>
    ),
    targets: [],
  },
  {
    eyebrow: "",
    title: "Konsumsi Rumah Tangga: Penggerak Utama Tahunan",
    narrative: (
      <>
        Pengeluaran konsumsi rumah tangga tetap menjadi penyumbang terbesar
        pertumbuhan tahunan, menyumbang <Mark color="amber">2,64 poin</Mark>{" "}
        terhadap pertumbuhan y-on-y dan <Mark color="amber">2,83 poin</Mark>{" "}
        terhadap pertumbuhan sepanjang tahun (c-to-c) — mencerminkan daya beli
        masyarakat sebagai fondasi utama ekonomi Jawa Tengah.
      </>
    ),
    targets: [{ rowId: "konsumsi-rt", cols: ["yoy", "ctoc"], color: "amber" }],
  },
  {
    eyebrow: "",
    title: "Belanja Pemerintah: Lonjakan Musiman Akhir Tahun",
    narrative: (
      <>
        Pola berbeda terlihat pada belanja pemerintah: kontribusinya melonjak
        tajam secara kuartalan, mencapai <Mark color="amber">3,01 poin</Mark>,
        jauh di atas kontribusi tahunannya yang hanya 0,69–0,19 poin. Lonjakan
        ini adalah pola musiman yang lazim terjadi di kuartal keempat, saat
        realisasi anggaran pemerintah daerah dikebut menjelang akhir tahun
        anggaran.
      </>
    ),
    targets: [{ rowId: "konsumsi-pemerintah", cols: ["qtoq"], color: "amber" }],
  },
  {
    eyebrow: "",
    title: "Ekspor vs Impor: Siapa yang Menahan, Siapa yang Mendorong",
    narrative: (
      <>
        Ekspor tumbuh solid, menyumbang <Mark color="green">5,49 poin</Mark>{" "}
        terhadap pertumbuhan tahunan (y-on-y) — sumber pertumbuhan tunggal
        terbesar setelah konsumsi rumah tangga. Tapi secara kuartalan ceritanya
        berbalik:{" "}
        <Mark color="red">
          impor tumbuh lebih cepat (2,68 poin) dibanding ekspor (hanya 0,39
          poin)
        </Mark>
        , menjadikan neraca perdagangan sebagai faktor yang justru menahan laju
        pertumbuhan kuartal keempat.
      </>
    ),
    targets: [
      { rowId: "ekspor", cols: ["qtoq", "yoy"], color: "green" },
      { rowId: "impor", cols: ["qtoq"], color: "red" },
    ],
  },
  {
    eyebrow: "",
    title: "Investasi: Kontributor yang Konsisten",
    narrative: (
      <>
        Investasi (Pembentukan Modal Tetap Bruto) tampil paling konsisten di
        antara semua komponen, menyumbang kontribusi positif baik secara
        kuartalan (<Mark color="amber">0,95</Mark>), tahunan (
        <Mark color="amber">1,93</Mark>), maupun sepanjang tahun (
        <Mark color="amber">1,97</Mark>) — sinyal bahwa aktivitas pembangunan
        dan penanaman modal terus berjalan stabil tanpa lonjakan atau penurunan
        tajam.
      </>
    ),
    targets: [{ rowId: "pmtb", cols: ["qtoq", "yoy", "ctoc"], color: "amber" }],
  },
  {
    eyebrow: "",
    title: "Data yang Hilang: Perubahan Inventori",
    narrative: (
      <>
        Satu baris tidak memiliki angka sama sekali:{" "}
        <Mark color="gray">Perubahan Inventori</Mark>. Ketiadaan data pada
        komponen ini turut menjelaskan mengapa total kontribusi seluruh komponen
        di atas tidak persis menyamai angka pertumbuhan PDRB total — selisih
        kecil yang lazim disebut sebagai diskrepansi statistik dalam
        penghitungan PDRB.
      </>
    ),
    targets: [
      { rowId: "inventori", cols: ["qtoq", "yoy", "ctoc"], color: "gray" },
    ],
  },
  {
    eyebrow: "",
    title: "Sintesis: PDRB Total",
    narrative: (
      <strong>
        Secara keseluruhan, ekonomi Jawa Tengah tumbuh{" "}
        <Mark color="orange">0,90%</Mark> dibanding kuartal sebelumnya,{" "}
        <Mark color="orange">5,84%</Mark> dibanding periode yang sama tahun
        lalu, dan <Mark color="orange">5,37%</Mark> sepanjang tahun 2025
        dibanding 2024 — hasil akumulasi dari konsumsi rumah tangga yang stabil,
        belanja pemerintah yang musiman, serta ekspor yang tumbuh lebih cepat
        dari impor secara tahunan.
      </strong>
    ),
    targets: [
      { rowId: "pdrb", cols: ["qtoq", "yoy", "ctoc"], color: "orange" },
    ],
  },
];

function getCellStyle(step: Step, rowId: string, col: ColKey) {
  const target = step.targets.find(
    (t) => t.rowId === rowId && t.cols.includes(col),
  );
  if (!target) return null;
  return COLORS[target.color];
}

function isRowActive(step: Step, rowId: string) {
  return step.targets.some((t) => t.rowId === rowId);
}

export default function SumberPertumbuhanPDRB() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    const stepEls = container.querySelectorAll("[data-step]");
    const obs = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
    });
    stepEls.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [handleIntersection]);

  const current = steps[activeStep] ?? steps[0];

  return (
    <section ref={sectionRef} className="relative">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-8">
        <h2 className=" font-bungee color-pink heading-lg mt-2">
          Sumber Pertumbuhan PDRB
          <span className="font-bungee color-green"> Jawa Tengah
            Triwulan IV 2025
          </span>
        </h2>
        <p className="body-lg mt-3 max-w-2xl font-delius">
          q-to-q, y-on-y, dan c-to-c — komponen pengeluaran mana yang mendorong,
          dan mana yang menahan pertumbuhan ekonomi Jawa Tengah.
        </p>
      </div>

      {/* Narrative (left) + Record Card (right, sticky) */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-6 font-rubik">
        {/* Left: Scrollable Narrative */}
        <div className="lg:w-[42%] pb-24 font-rubik">
          {steps.map((step, idx) => (
            <div key={idx} data-step={idx} className="narrative-step font-rubik">
              <div
                className="rounded-lg p-5 md:p-6 transition-colors duration-500 font-rubik"
                style={{
                  background: activeStep === idx ? "#FFFFFF" : "#F9FAFB",
                  borderLeft: `4px solid ${
                    activeStep === idx
                      ? step.targets[0]
                        ? COLORS[step.targets[0].color].text
                        : "#c51b7d"
                      : "#9CA3AF"
                  }`,
                  boxShadow:
                    activeStep === idx ? "0 2px 10px rgba(0,0,0,0.05)" : "none",
                }}
              >
                <span className="heading-sm">{step.eyebrow}</span>
                <h3 className="heading-md mt-2 text-lg font-rubik color-green font-bold">{step.title}</h3>
                <p
                  className="mt-3 text-[17px] leading-[1.6]"
                  style={{ color: "#374151" }}
                >
                  {step.narrative}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Sticky Record Card */}
        <div className="lg:w-[58%] lg:sticky lg:top-4 lg:self-start">
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "#FBF6E9",
              border: "1px solid #c51b7d",
              padding: "40px 32px",
            }}
          >
            <div className="text-xs font-bold uppercase tracking-widest text-center mb-6 font-rubik color-pink">
              Komponen Sumber Pertumbuhan PDRB — Triwulan IV 2025
            </div>

            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th className="text-left pb-1" />
                  {columnMeta.map((col) => (
                    <th key={col.key} className="text-right pb-1 pl-2">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-zinc-700">
                        {col.label}
                      </div>
                      <div className="text-[9px] font-normal normal-case text-zinc-400 mt-0.5 leading-tight">
                        {col.subtitle}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sumberPertumbuhanData.map((row) => {
                  const rowActive = isRowActive(current, row.id);
                  return (
                    <tr
                      key={row.id}
                      style={{
                        borderTop: row.isTotal ? "2px solid #1F2937" : "none",
                        boxShadow:
                          row.isTotal && rowActive
                            ? "0 0 0 1px rgba(194,65,12,0.25)"
                            : "none",
                      }}
                    >
                      <td
                        className="py-2 pr-2 text-[12px] uppercase font-bold tracking-tight align-middle"
                        style={{
                          color: row.isTotal ? "#1F2937" : "#3f3f46",
                          fontWeight: row.isTotal ? 800 : 700,
                        }}
                      >
                        {row.label}
                      </td>
                      {(["qtoq", "yoy", "ctoc"] as ColKey[]).map((col) => {
                        const cellColor = getCellStyle(current, row.id, col);
                        return (
                          <td
                            key={col}
                            className="py-2 pl-2 text-right align-middle"
                          >
                            <span
                              className="inline-block rounded px-2 py-1 text-[13px] font-medium tabular-nums transition-colors duration-[400ms] ease-out"
                              style={{
                                background: cellColor
                                  ? cellColor.bg
                                  : "transparent",
                                color: cellColor
                                  ? cellColor.text
                                  : row.isTotal
                                    ? "#1F2937"
                                    : "#52525b",
                                fontWeight:
                                  row.isTotal || cellColor ? 700 : 500,
                              }}
                            >
                              {formatValue(row[col])}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
