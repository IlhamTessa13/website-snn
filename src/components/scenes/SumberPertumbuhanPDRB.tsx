"use client";

import { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import {
  sumberPertumbuhanData,
  columnMeta,
  formatValue,
  type ColKey,
} from "@/data/SumberPertumbuhanPDRB";

type HighlightColor = "green" | "red" | "amber" | "gray";

interface CellTarget {
  rowId: string;
  cols: ColKey[];
  color: HighlightColor;
}

interface Step {
  narrative: ReactNode;
}

// Palet konsisten dengan aturan highlight Section 1 & 2:
// hijau = mendorong/tertinggi, merah = menahan/selisih, amber = stabil/temuan menarik, abu = data kosong.
const COLORS: Record<HighlightColor, { bg: string; text: string }> = {
  green: { bg: "#DCFCE7", text: "#166534" },
  red: { bg: "#FEE2E2", text: "#B91C1C" },
  amber: { bg: "#FFEDD5", text: "#C2410C" },
  gray: { bg: "#F3F4F6", text: "#6B7280" },
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
      className="rounded px-1.5 py-0.5 font-semibold transition-colors duration-300"
      style={{ background: c.bg, color: c.text }}
    >
      {children}
    </span>
  );
}

// targets: baris & kolom tabel yang ikut disorot saat step ini aktif (tabel di kanan tidak diubah strukturnya).
const stepTargets: CellTarget[][] = [
  [],
  [
    { rowId: "konsumsi-rt", cols: ["yoy", "ctoc"], color: "green" },
    { rowId: "konsumsi-pemerintah", cols: ["qtoq"], color: "amber" },
  ],
  [
    { rowId: "ekspor", cols: ["qtoq", "yoy"], color: "green" },
    { rowId: "impor", cols: ["qtoq", "yoy"], color: "red" },
    { rowId: "pmtb", cols: ["qtoq", "yoy", "ctoc"], color: "amber" },
  ],
  [
    { rowId: "pdrb", cols: ["qtoq", "yoy", "ctoc"], color: "amber" },
    { rowId: "inventori", cols: ["qtoq", "yoy", "ctoc"], color: "gray" },
  ],
];

const steps: Step[] = [
  {
    narrative: (
      <>
        <p>
          Pertumbuhan PDRB jarang berasal dari satu sumber tunggal. Untuk
          memahami komposisinya, angka pertumbuhan Jawa Tengah pada Triwulan IV
          2025 perlu dibaca dari tiga sudut pandang sekaligus: dibanding kuartal
          sebelumnya (q-to-q), dibanding kuartal yang sama tahun lalu (y-on-y),
          dan dibanding akumulasi tahun lalu (c-to-c).
        </p>
        <p>
          Tabel di samping merinci kontribusi masing-masing komponen pengeluaran
          terhadap ketiga ukuran tersebut.
        </p>
      </>
    ),
  },
  {
    narrative: (
      <>
        <p>
          Konsumsi rumah tangga tetap menjadi penopang utama pertumbuhan
          tahunan, dengan kontribusi <Mark color="green">2,64 poin</Mark> secara
          y-on-y dan <Mark color="green">2,83 poin</Mark> secara c-to-c —
          konsisten dengan karakternya sebagai komponen yang bergerak perlahan
          namun stabil.
        </p>
        <p>
          Belanja pemerintah menunjukkan pola yang berbeda: kontribusinya
          melonjak tajam secara kuartalan menjadi{" "}
          <Mark color="amber">3,01 poin</Mark>, jauh melebihi kontribusi
          tahunannya yang hanya berkisar 0,19–0,69 poin. Pola ini konsisten
          dengan siklus realisasi anggaran daerah yang lazim terkonsentrasi di
          kuartal keempat, bukan indikasi percepatan belanja yang permanen.
        </p>
      </>
    ),
  },
  {
    narrative: (
      <>
        <p>
          Neraca perdagangan menampilkan arah yang berlawanan antar ukuran
          waktu. Secara kuartalan, impor tumbuh lebih cepat (
          <Mark color="red">2,68 poin</Mark>) dibanding ekspor (
          <Mark color="green">0,39 poin</Mark>), sehingga perdagangan luar
          negeri berkontribusi menahan laju pertumbuhan kuartal keempat.
        </p>
        <p>
          Secara tahunan gambarannya berimbang: ekspor tumbuh{" "}
          <Mark color="green">5,49 poin</Mark>, namun impor turut tumbuh hampir
          sama cepat di <Mark color="red">5,09 poin</Mark> — sehingga kontribusi
          bersih neraca perdagangan terhadap pertumbuhan tahunan sesungguhnya
          tipis, sekitar 0,4 poin saja.
        </p>
        <p>
          Di sisi investasi, Pembentukan Modal Tetap Bruto justru tampil sebagai
          komponen paling stabil: kontribusinya positif di ketiga ukuran (
          <Mark color="amber">0,95</Mark> q-to-q,{" "}
          <Mark color="amber">1,93</Mark> y-on-y,{" "}
          <Mark color="amber">1,97</Mark> c-to-c) tanpa lonjakan maupun
          penurunan tajam.
        </p>
      </>
    ),
  },
  {
    narrative: (
      <>
        <p>
          Secara keseluruhan, PDRB Jawa Tengah tumbuh{" "}
          <Mark color="amber">0,90%</Mark> dibanding kuartal sebelumnya,{" "}
          <Mark color="amber">5,84%</Mark> dibanding periode yang sama tahun
          lalu, dan <Mark color="amber">5,37%</Mark> sepanjang tahun 2025
          dibanding 2024 — hasil akumulasi dari konsumsi rumah tangga yang
          stabil, belanja pemerintah yang musiman, serta investasi yang
          konsisten, sementara neraca perdagangan relatif netral secara tahunan.
        </p>
        <p>
          Satu catatan metodologis: baris{" "}
          <Mark color="gray">Perubahan Inventori</Mark> tidak memiliki data pada
          rilis ini, sehingga jumlah kontribusi komponen di atas tidak persis
          menyamai angka pertumbuhan PDRB total — selisih kecil yang lazim
          disebut diskrepansi statistik dalam penghitungan PDRB.
        </p>
      </>
    ),
  },
];

function getCellStyle(stepIdx: number, rowId: string, col: ColKey) {
  const targets = stepTargets[stepIdx] ?? [];
  const target = targets.find((t) => t.rowId === rowId && t.cols.includes(col));
  if (!target) return null;
  return COLORS[target.color];
}

function isRowActive(stepIdx: number, rowId: string) {
  const targets = stepTargets[stepIdx] ?? [];
  return targets.some((t) => t.rowId === rowId);
}

export default function SumberPertumbuhanPDRB() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Sama seperti Indeks Williamson: observer sederhana di atas kartu narasi
  // yang berada dalam alur dokumen biasa (bukan marker buatan).
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const idx = parseInt((entry.target as HTMLElement).dataset.step || "0");
        if (entry.isIntersecting) {
          setActiveStep(idx);
        }
      });
    },
    [],
  );

  useEffect(() => {
    const container = sectionRef.current;
    if (!container) return;
    const cards = container.querySelectorAll("[data-step]");
    const obs = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, [handleIntersection]);

  const currentIdx = activeStep;

  return (
    <section ref={sectionRef} className="sumber-pertumbuhan-section relative">
      {/* SISI KANAN: visual sticky (58%) — judul, subjudul, dan tabel diam
          di tempat selama section ini di-scroll, lepas setelah step terakhir. */}
      <div className="sp-visual">
        <div className="sp-visual-inner">
          <div className="sp-header">
            <h2 className="heading-lg font-bungee color-pink">
              Sumber Pertumbuhan PDRB
              <span className="font-bungee color-green">
                {" "}
                Jawa Tengah Triwulan IV 2025
              </span>
            </h2>
            <p className="sp-subheading mt-1.5">
              q-to-q, y-on-y, dan c-to-c — komponen pengeluaran mana yang
              mendorong, dan mana yang menahan pertumbuhan ekonomi Jawa Tengah.
            </p>
          </div>

          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "#FBF6E9",
              border: "1px solid #c51b7d",
              padding: "10px 24px 8px",
            }}
          >
            <div className="text-xs font-bold uppercase tracking-widest text-center mb-2 font-rubik color-pink">
              Komponen Sumber Pertumbuhan PDRB — Triwulan IV 2025
            </div>

            <table
              className="w-full sp-table"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  <th className="text-left pb-1" />
                  {columnMeta.map((col) => (
                    <th key={col.key} className="text-right pb-1 pl-2">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-zinc-700">
                        {col.label}
                      </div>
                      <div className="text-[8px] font-normal normal-case text-zinc-400 mt-0.5 leading-tight">
                        {col.subtitle}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sumberPertumbuhanData.map((row) => {
                  const rowActive = isRowActive(currentIdx, row.id);
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
                        className="py-1 pr-2 text-[11px] uppercase font-bold tracking-tight align-middle"
                        style={{
                          color: row.isTotal ? "#1F2937" : "#3f3f46",
                          fontWeight: row.isTotal ? 800 : 700,
                        }}
                      >
                        {row.label}
                      </td>
                      {(["qtoq", "yoy", "ctoc"] as ColKey[]).map((col) => {
                        const cellColor = getCellStyle(currentIdx, row.id, col);
                        return (
                          <td
                            key={col}
                            className="py-1 pl-2 text-right align-middle"
                          >
                            <span
                              className="inline-block rounded px-1.5 py-0.5 text-[12px] font-medium tabular-nums transition-colors duration-[400ms] ease-out"
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

      {/* SISI KIRI: narrative track (42%) — kartu berurutan dalam alur
          dokumen biasa, dim saat tidak aktif lalu terang saat discroll ke
          tengah layar. Persis pola step-card di Indeks Williamson. */}
      <div className="sp-narrative-track">
        {steps.map((step, idx) => (
          <div
            key={idx}
            data-step={idx}
            className={`sp-step-card${activeStep === idx ? " is-active" : ""}`}
          >
            {step.narrative}
          </div>
        ))}
      </div>

      <style jsx global>{`
        .sumber-pertumbuhan-section {
          display: flex;
          flex-direction: row-reverse;
          position: relative;
          background-color: #ffffff;
          min-height: 100vh;
          font-family: "Jost", var(--font-sans), sans-serif;
          color: #282828;
          line-height: 1.6;
        }

        .sumber-pertumbuhan-section .sp-visual {
          width: 58%;
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.25rem 3.5rem 1.25rem 2rem;
          background: #ffffff;
          z-index: 1;
          overflow-y: auto;
        }

        .sumber-pertumbuhan-section .sp-visual-inner {
          width: 100%;
          max-width: 720px;
          margin: auto 0;
        }

        .sumber-pertumbuhan-section .sp-header {
          margin-bottom: 0.4rem;
        }

        .sumber-pertumbuhan-section .sp-header h2.heading-lg {
          font-size: 24px;
          line-height: 1.25;
        }

        .sumber-pertumbuhan-section .sp-subheading {
          font-size: 13px;
          color: #9ca3af;
          font-weight: 500;
        }

        .sumber-pertumbuhan-section .sp-narrative-track {
          width: 42%;
          position: relative;
          z-index: 2;
          padding: 35vh 1.5rem 50vh 3.5rem;
        }

        .sumber-pertumbuhan-section .sp-step-card {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 2rem 2.25rem;
          margin-bottom: 80vh;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          transition: all 0.35s ease;
          opacity: 0.25;
          transform: translateY(15px);
        }

        .sumber-pertumbuhan-section .sp-step-card:last-of-type {
          margin-bottom: 70vh;
        }

        .sumber-pertumbuhan-section .sp-step-card.is-active {
          opacity: 1;
          transform: translateY(0);
          border-color: #cbd5e1;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
        }

        .sumber-pertumbuhan-section .sp-step-card p {
          font-size: 1.05rem;
          line-height: 1.75;
          color: #374151;
          margin-bottom: 1rem;
        }

        .sumber-pertumbuhan-section .sp-step-card p:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 880px) {
          .sumber-pertumbuhan-section {
            flex-direction: column;
          }
          .sumber-pertumbuhan-section .sp-visual {
            width: 100%;
            height: auto;
            position: relative;
            top: auto;
            padding: 1.5rem 1rem 1.5rem 1rem;
          }
          .sumber-pertumbuhan-section .sp-narrative-track {
            width: 100%;
            padding: 5vh 1.5rem 50vh 1.5rem;
          }
          .sumber-pertumbuhan-section .sp-step-card {
            margin-bottom: 55vh;
          }
          .sumber-pertumbuhan-section .sp-step-card:last-of-type {
            margin-bottom: 45vh;
          }
        }
      `}</style>
    </section>
  );
}
