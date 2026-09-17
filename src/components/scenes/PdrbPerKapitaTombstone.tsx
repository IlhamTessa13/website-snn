"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sortedByAdhb } from "@/data/pdrbPerKapita";

/* ------------------------------------------------------------------ */
/* Konstanta skala & warna                                             */
/* ------------------------------------------------------------------ */

const DOMAIN_MAX = 170_000; // dipakai sama untuk kedua sisi agar panjangnya sebanding
const TICKS = [0, 50_000, 100_000, 150_000];
const CENTER_W = 148; // lebar kolom label nama di sumbu 0 (px)
const MARQUEE_SPEED = 50; // px / detik
const ROW_H = 44; // tinggi baris tetap & nyaman (px) — bukan lagi hasil bagi tinggi kontainer/35 baris
const PLOT_HEIGHT = 480; // tinggi kotak chart yang terlihat; sisanya di-scroll internal

/**
 * Palet diverging PiYG — SATU-SATUNYA sumber warna aksen di scene ini.
 * ADHB = keluarga hijau, ADHK = keluarga pink/magenta.
 */
const GREEN_DARK = "#4d9221";
const GREEN_MID = "#a1d76a";
const GREEN_LIGHT = "#e6f5d0";
const PINK_LIGHT = "#fde0ef";
const PINK_MID = "#e9a3c9";
const PINK_DARK = "#c51b7d";

const ADHB = {
  solid: GREEN_MID,
  dark: GREEN_DARK,
  gradient: `linear-gradient(to left, ${GREEN_DARK}, ${GREEN_LIGHT})`,
};
const ADHK = {
  solid: PINK_MID,
  dark: PINK_DARK,
  gradient: `linear-gradient(to right, ${PINK_DARK}, ${PINK_LIGHT})`,
};

type Side = "adhb" | "adhk";

/* ------------------------------------------------------------------ */
/* Data turunan                                                        */
/* ------------------------------------------------------------------ */

/** "Kab. Tegal" → "Tegal (Kab.)" bila ada "Kota Tegal", selain itu "Tegal". */
function buildDisplayName(name: string, all: string[]) {
  if (!name.startsWith("Kab. ")) return name;
  const bare = name.slice(5);
  return all.includes(`Kota ${bare}`) ? `${bare} (Kab.)` : bare;
}

const rows = (() => {
  const names = sortedByAdhb.map((d) => d.name);
  return sortedByAdhb.map((d, i) => ({
    key: d.name,
    label: buildDisplayName(d.name, names),
    rank: i + 1,
    adhb: d.pdrbAdhb,
    adhk: d.pdrbAdhk,
  }));
})();

const meanAdhb = rows.reduce((s, r) => s + r.adhb, 0) / rows.length;
const meanAdhk = rows.reduce((s, r) => s + r.adhk, 0) / rows.length;

const rupiah = (v: number) => "Rp" + Math.round(v).toLocaleString("id-ID");

const ratioText = (v: number, mean: number) => {
  const r = v / mean;
  return `${r.toFixed(2).replace(".", ",")}× rata-rata`;
};

const TOP5 = rows.slice(0, 5).map((r) => r.key);

/* ------------------------------------------------------------------ */
/* Highlight inline                                                    */
/* ------------------------------------------------------------------ */

type Tone = "orange" | "purple" | "magenta" | "red";

// Semua tone dipetakan ke palet PiYG: "orange" (isu ADHB) → hijau,
// "purple/magenta/red" (isu ADHK & kesenjangan) → pink/magenta.
const TONE: Record<Tone, { bg: string; fg: string }> = {
  orange: { bg: GREEN_LIGHT, fg: GREEN_DARK },
  purple: { bg: PINK_LIGHT, fg: PINK_DARK },
  magenta: { bg: PINK_LIGHT, fg: PINK_DARK },
  red: { bg: PINK_LIGHT, fg: PINK_DARK },
};

function HL({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const c = TONE[tone];
  return (
    <span
      style={{
        background: c.bg,
        color: c.fg,
        fontWeight: 600,
        padding: "1px 6px",
        borderRadius: 5,
      }}
    >
      {children}
    </span>
  );
}

const B = ({ children }: { children: React.ReactNode }) => (
  <strong style={{ fontWeight: 700, color: "#1F2937" }}>{children}</strong>
);

/* ------------------------------------------------------------------ */
/* Step scrollytelling                                                 */
/* ------------------------------------------------------------------ */

interface StepCfg {
  /** kunci baris yang "dikunci" ke status highlight; null = semua menyala */
  lock: string | null;
  side: Side;
  sequence?: boolean;
  body: React.ReactNode;
}

const STEPS: StepCfg[] = [
  {
    lock: null,
    side: "adhb",
    body: (
      <>
        Total PDRB menunjukkan skala ekonomi tiap daerah, tapi tidak menunjukkan
        kesejahteraan penduduknya. Untuk itu, PDRB per kapita — total PDRB
        dibagi jumlah penduduk — memberi gambaran yang berbeda. Susunan di
        samping mengurutkan 35 kabupaten/kota dari PDRB per kapita ADHB
        tertinggi hingga terendah.
      </>
    ),
  },
  {
    lock: "Kota Semarang",
    side: "adhb",
    body: (
      <B>
        Kota Semarang mencatatkan PDRB per kapita ADHB tertinggi di Jawa Tengah,{" "}
        <HL tone="orange">Rp167.236</HL> — lebih dari{" "}
        <HL tone="orange">tiga kali lipat rata-rata</HL> 35 kabupaten/kota.
      </B>
    ),
  },
  {
    lock: "Kota Magelang",
    side: "adhb",
    body: (
      <>
        <B>
          Padahal secara total, Kota Magelang justru mencatatkan PDRB terendah
          se-Jawa Tengah — tapi karena penduduknya sangat sedikit, PDRB per
          kapitanya melompat ke{" "}
          <HL tone="orange">peringkat ke-4 tertinggi, Rp103.577</HL>.
        </B>
        <span
          style={{
            display: "block",
            marginTop: 12,
            fontSize: 15,
            color: "#6B7280",
          }}
        >
          Wilayah kecil, penduduk sedikit, PDRB per kapita tinggi.
        </span>
      </>
    ),
  },
  {
    lock: "Kab. Kudus",
    side: "adhb",
    body: (
      <>
        Kudus menempati posisi kedua dengan <HL tone="orange">Rp148.384</HL> per
        kapita — didorong basis industri rokok dan manufaktur yang sangat padat,
        terkonsentrasi di wilayah yang relatif kecil, sehingga nilai tambah
        ekonominya terbagi ke penduduk yang tidak terlalu banyak.
      </>
    ),
  },
  {
    lock: "Kab. Pemalang",
    side: "adhb",
    body: (
      <B>
        Di ujung lain, Pemalang mencatatkan PDRB per kapita terendah, hanya{" "}
        <HL tone="red">Rp24.047</HL> — sekitar{" "}
        <HL tone="red">7 kali lebih kecil</HL> dibanding Kota Semarang.
      </B>
    ),
  },
  {
    lock: null,
    side: "adhk",
    sequence: true,
    body: (
      <>
        Pola ini konsisten baik dilihat dari harga berlaku (ADHB) maupun harga
        konstan (ADHK): wilayah dengan PDRB per kapita ADHB tinggi juga hampir
        selalu unggul di ADHK.{" "}
        <B>
          Kesenjangan ini bukan sekadar efek inflasi, melainkan mencerminkan
          perbedaan riil dalam produktivitas ekonomi per penduduk.
        </B>
      </>
    ),
  },
  {
    lock: null,
    side: "adhb",
    body: (
      <>
        <B>
          PDRB per kapita menunjukkan sisi lain dari ketimpangan: bukan soal
          ukuran ekonomi, tapi soal berapa banyak penduduk yang berbagi nilai
          ekonomi tersebut.
        </B>{" "}
        Kota-kota kecil dengan basis industri padat bisa melompat jauh di atas
        kabupaten yang luas wilayahnya. Pertanyaannya, seberapa besar
        kesenjangan ini jika diukur dengan indikator yang dirancang khusus untuk
        itu? Gulir ke bawah untuk melihat Indeks Williamson.
      </>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Komponen                                                            */
/* ------------------------------------------------------------------ */

export default function PdrbPerKapitaTombstone() {
  const [activeStep, setActiveStep] = useState(-1);
  const [hovered, setHovered] = useState<{ key: string; side: Side } | null>(
    null,
  );
  const [seqTick, setSeqTick] = useState(0);
  const [sideWidth, setSideWidth] = useState(300);

  const stepsRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);

  /* ---------- scroll trigger ---------- */
  useEffect(() => {
    const root = stepsRef.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActiveStep(Number(entry.target.getAttribute("data-step")));
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    root
      .querySelectorAll<HTMLElement>("[data-step]")
      .forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  /* ---------- ukur lebar satu sisi (tinggi baris sudah tetap/ROW_H) ---------- */
  useEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      setSideWidth(Math.max(80, (w - CENTER_W) / 2));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ---------- auto-scroll internal: bawa baris terkunci ke tengah kotak ---------- */
  useEffect(() => {
    const lockKey = STEPS[Math.max(0, activeStep)]?.lock;
    const container = plotRef.current;
    if (!lockKey || !container) return;
    const target = container.querySelector<HTMLElement>(
      `[data-row="${lockKey}"]`,
    );
    if (!target) return;
    const targetTop = target.offsetTop - container.clientHeight / 2 + ROW_H / 2;
    container.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  }, [activeStep]);

  /* ---------- sequence step 5 ---------- */
  const step = STEPS[Math.max(0, activeStep)];
  const isSequence = !!step.sequence;

  useEffect(() => {
    if (!isSequence) return;
    setSeqTick(0);
    const id = setInterval(() => setSeqTick((t) => (t + 1) % 10), 900);
    return () => clearInterval(id);
  }, [isSequence]);

  /* ---------- baris aktif ---------- */
  const started = activeStep >= 0;

  const active: { key: string; side: Side } | null = useMemo(() => {
    if (hovered) return hovered;
    if (isSequence) {
      const pass = seqTick < 5 ? 0 : 1;
      return {
        key: TOP5[seqTick % 5],
        side: pass === 0 ? "adhb" : "adhk",
      };
    }
    if (step.lock) return { key: step.lock, side: step.side };
    return null;
  }, [hovered, isSequence, seqTick, step]);

  const pct = useCallback((v: number) => (v / DOMAIN_MAX) * 100, []);

  /* ---------- render satu bar ---------- */
  const renderBar = (
    row: (typeof rows)[number],
    side: Side,
    isActive: boolean,
    isPaused: boolean,
  ) => {
    const value = side === "adhb" ? row.adhb : row.adhk;
    const theme = side === "adhb" ? ADHB : ADHK;
    const widthPct = pct(value);
    const barPx = (widthPct / 100) * sideWidth;

    const fontSize = Math.max(8, Math.min(ROW_H * 0.78, 15));
    const unit = row.label.length * fontSize * 0.5 + fontSize * 1.6;
    const repeats = Math.max(3, Math.ceil((barPx * 1.2) / unit));
    const duration = Math.max(3, (repeats * unit) / MARQUEE_SPEED);
    const chunk = Array.from({ length: repeats })
      .map(() => row.label)
      .join("  ·  ");

    return (
      <div
        onMouseEnter={() => setHovered({ key: row.key, side })}
        onMouseLeave={() => setHovered(null)}
        style={{
          width: `${widthPct}%`,
          height: "100%",
          overflow: "hidden",
          background: isActive ? theme.solid : theme.gradient,
          outline: isActive ? `2px solid ${theme.dark}` : "none",
          borderRadius: side === "adhb" ? "3px 0 0 3px" : "0 3px 3px 0",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          transition: "background 250ms ease",
        }}
      >
        <div
          className={side === "adhb" ? "tsb-marquee-l" : "tsb-marquee-r"}
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animationDuration: `${duration}s`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {[0, 1].map((i) => (
            <span
              key={i}
              style={{
                fontFamily: "Georgia, 'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize,
                lineHeight: 1,
                color: "rgba(255,255,255,0.92)",
                paddingRight: fontSize * 1.6,
              }}
            >
              {chunk}
            </span>
          ))}
        </div>
      </div>
    );
  };

  /* ---------- anotasi hover/highlight ---------- */
  const renderAnnotation = (row: (typeof rows)[number], side: Side) => {
    const value = side === "adhb" ? row.adhb : row.adhk;
    const mean = side === "adhb" ? meanAdhb : meanAdhk;
    const theme = side === "adhb" ? ADHB : ADHK;
    const barPx = (pct(value) / 100) * sideWidth;
    const outside = sideWidth - barPx > 165;
    const offset = outside ? barPx + 14 : Math.max(8, barPx - 158);
    const isLeft = side === "adhb";

    // Kotak anotasi selalu berada di sisi luar bar; leader line menunjuk balik
    // ke ujung bar, jadi urutan flex-nya dibalik tergantung sisi & posisi.
    const direction: React.CSSProperties["flexDirection"] =
      isLeft === outside ? "row" : "row-reverse";

    const style: React.CSSProperties = {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      right: isLeft ? offset : undefined,
      left: isLeft ? undefined : offset,
      zIndex: 5,
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      gap: 6,
      flexDirection: direction,
    };

    return (
      <div style={style}>
        <div
          style={{
            background: "#FFFFFF",
            border: `1px solid ${theme.dark}22`,
            boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
            borderRadius: 8,
            padding: "5px 9px",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 12.5, fontWeight: 700, color: theme.dark }}>
            {rupiah(value)}
          </span>
          <span style={{ fontSize: 11.5, color: "#6B7280" }}>
            {" · "}
            {ratioText(value, mean)}
          </span>
        </div>
        <span
          style={{
            width: 14,
            height: 1,
            background: theme.dark,
            opacity: 0.6,
            display: "block",
          }}
        />
      </div>
    );
  };

  /* ---------- render ---------- */
  return (
    <section style={{ position: "relative", background: "#FFFFFF" }}>
      <style>{`
        @keyframes tsbScrollLeft  { from { transform: translateX(0);     } to { transform: translateX(-50%); } }
        @keyframes tsbScrollRight { from { transform: translateX(-50%); } to { transform: translateX(0);     } }
        .tsb-marquee-l { animation-name: tsbScrollLeft;  animation-timing-function: linear; animation-iteration-count: infinite; }
        .tsb-marquee-r { animation-name: tsbScrollRight; animation-timing-function: linear; animation-iteration-count: infinite; }
        @media (prefers-reduced-motion: reduce) {
          .tsb-marquee-l, .tsb-marquee-r { animation: none !important; }
        }
        .tsb-plot::-webkit-scrollbar { width: 8px; }
        .tsb-plot::-webkit-scrollbar-track { background: transparent; }
        .tsb-plot::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px; }
        .tsb-plot::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}</style>

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "flex-start",
          gap: 32,
        }}
        className="flex-col lg:flex-row"
      >
        {/* ============ KIRI — CHART (STICKY) ============ */}
        <div
          style={{ position: "sticky", top: 24 }}
          className="w-full lg:w-[60%] py-8"
        >
          <h2 className="font-bungee color-pink">
            PDRB Per Kapita: <p className="font-bungee color-green">Seberapa Jauh Kesenjangan Antarwilayah?</p>
          </h2>

          {/* Header sumbu */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 14,
              fontSize: 11.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#6B7280",
              fontWeight: 600,
            }}
          >
            <div style={{ flex: 1, textAlign: "right" }}>
              ← PDRB Per Kapita ADHB
            </div>
            <div style={{ width: CENTER_W }} />
            <div style={{ flex: 1 }}>PDRB Per Kapita ADHK →</div>
          </div>

          {/* Tick sumbu-X */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 6,
              fontSize: 10.5,
              color: "#9CA3AF",
            }}
          >
            <div style={{ flex: 1, position: "relative", height: 14 }}>
              {TICKS.map((t) => (
                <span
                  key={t}
                  style={{
                    position: "absolute",
                    right: `${pct(t)}%`,
                    transform: "translateX(50%)",
                  }}
                >
                  {t === 0 ? "Rp0" : `Rp${t / 1000}rb`}
                </span>
              ))}
            </div>
            <div style={{ width: CENTER_W }} />
            <div style={{ flex: 1, position: "relative", height: 14 }}>
              {TICKS.map((t) => (
                <span
                  key={t}
                  style={{
                    position: "absolute",
                    left: `${pct(t)}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  {t === 0 ? "Rp0" : `Rp${t / 1000}rb`}
                </span>
              ))}
            </div>
          </div>

          {/* Plot — kotak tinggi tetap, scroll internal (bukan lagi dipaksa muat 35 baris) */}
          <div
            ref={plotRef}
            style={{
              position: "relative",
              marginTop: 4,
              height: PLOT_HEIGHT,
              overflowY: "auto",
              border: "1px solid #E5E7EB",
              borderRadius: 14,
              background: "#FFFFFF",
            }}
            className="tsb-plot"
          >
            {/* Wrapper konten — tingginya = 35 baris × ROW_H, ini yang men-scroll */}
            <div style={{ position: "relative", height: rows.length * ROW_H }}>
              {/* Garis panduan vertikal (ikut scroll bersama baris) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  pointerEvents: "none",
                }}
              >
                <div style={{ flex: 1, position: "relative" }}>
                  {TICKS.map((t) => (
                    <span
                      key={t}
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        right: `${pct(t)}%`,
                        borderLeft: "1px dashed #E5E7EB",
                      }}
                    />
                  ))}
                </div>
                <div style={{ width: CENTER_W }} />
                <div style={{ flex: 1, position: "relative" }}>
                  {TICKS.map((t) => (
                    <span
                      key={t}
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: `${pct(t)}%`,
                        borderLeft: "1px dashed #E5E7EB",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Baris — tinggi tetap & nyaman (ROW_H), bukan hasil bagi tinggi kontainer */}
              {rows.map((row, idx) => {
                const isActive = active?.key === row.key;
                const dimmed = active !== null && !isActive;
                const isPaused = hovered?.key === row.key;

                return (
                  <div
                    key={row.key}
                    data-row={row.key}
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      height: ROW_H,
                      opacity: !started ? 0 : dimmed ? 0.17 : 1,
                      transform: started ? "none" : "translateY(6px)",
                      transition: `opacity 300ms ease ${
                        started && activeStep === 0 ? idx * 22 : 0
                      }ms, transform 300ms ease ${
                        started && activeStep === 0 ? idx * 22 : 0
                      }ms`,
                      zIndex: isActive ? 4 : 1,
                    }}
                  >
                    {/* sisi ADHB */}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        position: "relative",
                        height: "84%",
                      }}
                    >
                      {isActive &&
                        active!.side === "adhb" &&
                        renderAnnotation(row, "adhb")}
                      {renderBar(row, "adhb", isActive, isPaused)}
                    </div>

                    {/* label tengah */}
                    <div
                      style={{
                        width: CENTER_W,
                        textAlign: "center",
                        fontSize: Math.max(8, Math.min(ROW_H * 0.62, 11.5)),
                        letterSpacing: "0.04em",
                        color: isActive ? "#1F2937" : "#6B7280",
                        fontWeight: isActive ? 700 : 500,
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        padding: "0 6px",
                      }}
                    >
                      {row.label}
                    </div>

                    {/* sisi ADHK */}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        position: "relative",
                        height: "84%",
                      }}
                    >
                      {renderBar(row, "adhk", isActive, isPaused)}
                      {isActive &&
                        active!.side === "adhk" &&
                        renderAnnotation(row, "adhk")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>
            Arahkan kursor ke salah satu bar untuk melihat nilai persisnya ·
            rata-rata 35 kab/kota: {rupiah(meanAdhb)} (ADHB) ·{" "}
            {rupiah(meanAdhk)} (ADHK)
          </p>
        </div>

        {/* ============ KANAN — NARASI ============ */}
        <div ref={stepsRef} className="w-full lg:w-[40%]">
          {STEPS.map((s, idx) => (
            <div
              key={idx}
              data-step={idx}
              style={{
                minHeight: "88vh",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  background: "#F7F7F5",
                  border: "1px solid #ECECE8",
                  borderRadius: 16,
                  padding: 36,
                  fontSize: 17.5,
                  lineHeight: 1.6,
                  color: "#374151",
                  opacity: activeStep === idx ? 1 : 0.4,
                  transform:
                    activeStep === idx ? "translateY(0)" : "translateY(8px)",
                  transition: "opacity .45s ease, transform .45s ease",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#9CA3AF",
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  {String(idx).padStart(2, "0")}
                </div>
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
