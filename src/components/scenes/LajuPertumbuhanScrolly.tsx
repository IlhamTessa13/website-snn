"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  lajuPertumbuhanData,
  pdrbTotal,
  years,
} from "@/data/lajuPertumbuhan";

/* ==================================================================
 * SECTION 2 — Laju Pertumbuhan Ekonomi Jawa Tengah 2016–2025
 *
 * Line chart scrollytelling: kartu narasi tahunan di KIRI (44%),
 * chart sticky di KANAN (56%). Kebalikan dari Section 1 yang
 * menempatkan peta di kiri.
 *
 * Sumber angka: src/data/lajuPertumbuhan.ts — sudah identik dengan
 * section_2.xlsx (Laju Pertumbuhan PDRB ADHK 2010, tahunan, persen).
 * ================================================================== */

/* ---------------- Palet ---------------- */
const ACCENT = "#c51b7d"; // merah-marun, warna aksen tunggal chart
const POS_TEXT = "#2a2a2a";
const POS_TABLE = "#1c7a4a";
const BG = "#fdfcfa";

/* ---------------- Geometri SVG ---------------- */
const W = 560;
const H = 300;
const M = { top: 20, right: 16, bottom: 30, left: 44 };
const Y_PAD_RATIO = 0.15;
const TICKS = 5;

/* ---------------- Narasi per tahun ---------------- */
const stepTexts: Record<number, string> = {
  2016:
    "Pada 2016, ekonomi Jawa Tengah tumbuh 5,25%. Sektor Pertambangan dan Penggalian melonjak 18,98%, jauh di atas sektor lain, sementara Jasa Perusahaan tumbuh 10,62% dan menjadi penopang di luar sektor primer.",
  2017:
    "Tahun 2017 pertumbuhan relatif stabil di 5,26%. Sektor Informasi dan Komunikasi melompat ke 13,27%, laju tertinggi di antara seluruh lapangan usaha tahun itu.",
  2018:
    "Pertumbuhan naik tipis menjadi 5,30% pada 2018. Hampir seluruh sektor tumbuh positif, dengan Jasa Perusahaan (9,48%) dan Jasa Kesehatan (8,8%) tumbuh di atas rata-rata provinsi.",
  2019:
    "2019 menjadi titik tertinggi sebelum pandemi, 5,36%. Penyediaan Akomodasi-Makan Minum tumbuh 9,07% dan Transportasi-Pergudangan 8,49%, mencerminkan aktivitas mobilitas dan pariwisata yang masih normal.",
  2020:
    "Ekonomi terkontraksi menjadi -2,65% pada 2020. Transportasi dan Pergudangan anjlok hingga -32,38%, dan Jasa Lainnya turun -8,01%, sejalan dengan pembatasan mobilitas selama pandemi COVID-19.",
  2021:
    "Pemulihan mulai terlihat di 2021 dengan pertumbuhan 3,33%. Informasi dan Komunikasi justru melonjak ke 15,65%, laju tertinggi sektor ini sepanjang 2016-2025, didorong pergeseran aktivitas ke ranah digital.",
  2022:
    "Ekonomi melompat ke 5,31% pada 2022, melampaui level sebelum pandemi. Transportasi dan Pergudangan melonjak ekstrem 73,01% dan Akomodasi-Makan Minum 16,99%, akibat basis rendah 2020-2021 dan pemulihan mobilitas.",
  2023:
    "Pada 2023 pertumbuhan turun ke 4,97%, sebuah normalisasi setelah lonjakan rebound 2022. Transportasi-Pergudangan melandai ke 8,12% dan Akomodasi-Makan Minum ke 11,24%, kembali ke laju yang lebih wajar.",
  2024:
    "Pertumbuhan sedikit melambat menjadi 4,95% pada 2024. Sektor Pertanian hanya tumbuh 1,39% dan Jasa Keuangan-Asuransi stagnan di 2,16%, meski Administrasi Pemerintahan melonjak ke 7,53%.",
  2025:
    "Ekonomi Jawa Tengah kembali menguat ke 5,37% pada 2025, angka tertinggi dalam sepuluh tahun terakhir. Sektor Pertanian rebound ke 4,78% dan Jasa Keuangan-Asuransi naik ke 5,61%, menopang pertumbuhan yang lebih merata antarsektor.",
};

/* ---------------- Util ---------------- */

/** "5.30" → "5.3", "-2.65" → "-2.65" (mengikuti format label di brief). */
function fmt(v: number): string {
  return String(Number(v.toFixed(2)));
}

/** Buang kode lapangan usaha ("A. ", "M,N. ") agar tabel hanya memuat nama. */
function sectorLabel(raw: string): string {
  return raw.replace(/^[A-Z,]+\.\s*/, "");
}

export default function LajuPertumbuhanScrolly() {
  const [active, setActive] = useState(0);
  const [rowsShown, setRowsShown] = useState(false);
  const stepsRef = useRef<HTMLDivElement>(null);

  const activeYear = years[active];
  const activeValue = pdrbTotal[activeYear];

  /* ---------- Skala & geometri ---------- */
  const geom = useMemo(() => {
    const values = years.map((y) => pdrbTotal[y]);
    const rawMin = Math.min(...values, 0);
    const rawMax = Math.max(...values);
    const pad = (rawMax - rawMin) * Y_PAD_RATIO;
    const min = rawMin - pad;
    const max = rawMax + pad;

    const innerW = W - M.left - M.right;
    const innerH = H - M.top - M.bottom;

    const x = (i: number) => M.left + (i / (years.length - 1)) * innerW;
    const y = (v: number) => M.top + ((max - v) / (max - min)) * innerH;

    const points = years.map((yr, i) => ({
      year: yr,
      value: pdrbTotal[yr],
      cx: x(i),
      cy: y(pdrbTotal[yr]),
    }));

    const d = points
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.cx.toFixed(2)} ${p.cy.toFixed(2)}`)
      .join(" ");

    /**
     * Path hanya terdiri dari segmen lurus (M/L), sehingga panjang kumulatif
     * Euclidean persis sama dengan path.getTotalLength() — tidak perlu
     * mengukur lewat DOM, dan aman saat render pertama.
     */
    const cumulative: number[] = [0];
    for (let i = 1; i < points.length; i += 1) {
      const dx = points[i].cx - points[i - 1].cx;
      const dy = points[i].cy - points[i - 1].cy;
      cumulative.push(cumulative[i - 1] + Math.hypot(dx, dy));
    }
    const total = cumulative[cumulative.length - 1];

    const ticks = Array.from({ length: TICKS }, (_, i) => {
      const v = min + ((max - min) * i) / (TICKS - 1);
      return { v, y: y(v) };
    });

    return {
      points,
      d,
      cumulative,
      total,
      ticks,
      zeroY: min < 0 && max > 0 ? y(0) : null,
    };
  }, []);

  /* ---------- Observer kartu narasi (threshold 0.6) ---------- */
  const onIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((e) => {
      if (e.isIntersecting && e.intersectionRatio >= 0.6) {
        setActive(parseInt((e.target as HTMLElement).dataset.step || "0", 10));
      }
    });
  }, []);

  useEffect(() => {
    const el = stepsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(onIntersect, { threshold: 0.6 });
    el.querySelectorAll("[data-step]").forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [onIntersect]);

  /* ---------- Animasi masuk baris tabel setiap ganti tahun ---------- */
  useEffect(() => {
    setRowsShown(false);
    const id = requestAnimationFrame(() => setRowsShown(true));
    return () => cancelAnimationFrame(id);
  }, [activeYear]);

  const dashOffset = geom.total - geom.cumulative[active];
  const negative = activeValue < 0;

  return (
    <section className="lpe-root">
      <style>{`
        .lpe-root {
          background: ${BG};
          font-family: Georgia, "Times New Roman", serif;
          color: ${POS_TEXT};
        }
        .lpe-header { max-width: 900px; margin: 0; padding: 20px 40px 10px; }
        .lpe-eyebrow {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12px; letter-spacing: 0.5px; color: #8a8a8a;
          text-transform: none; margin: 0;
        }
        .lpe-h1 { font-size: 30px; line-height: 1.3; font-weight: 400; margin: 10px 0 0; }
        .lpe-h1 em { font-style: normal; color: ${ACCENT}; }
        .lpe-desc {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 14px; color: #666; max-width: 640px; margin: 14px 0 0; line-height: 1.6;
        }

        .lpe-wrap { max-width: 1200px; margin: 0 auto; display: flex; align-items: flex-start; }
        .lpe-steps { width: 44%; padding: 0 40px 30vh; }
        .lpe-chart-col {
          width: 56%; position: sticky; top: 0; height: 100vh;
          display: flex; flex-direction: column; justify-content: center;
          padding: 0 24px;
        }

        .lpe-step { margin-bottom: 42vh; }
        .lpe-step:first-child { padding-top: 12vh; }
        .lpe-step-inner {
          border-left: 3px solid #eee; padding-left: 18px;
          transition: border-color 0.4s ease, color 0.4s ease;
          color: #b9b3aa;
        }
        .lpe-step.is-active .lpe-step-inner { border-left-color: ${ACCENT}; color: ${POS_TEXT}; }
        .lpe-step-year {
          display: block; font-family: Arial, Helvetica, sans-serif;
          font-weight: 700; font-size: 15px; color: ${ACCENT}; margin-bottom: 6px;
        }
        .lpe-step-value {
          display: block; font-family: Arial, Helvetica, sans-serif;
          font-size: 13px; color: #999; margin-bottom: 10px;
        }
        .lpe-step-content {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 17px; line-height: 1.65; margin: 0;
        }

        .lpe-chart-title {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12px; color: #999; margin: 0;
        }
        .lpe-chart-title strong { color: ${ACCENT}; }
        .lpe-chart-sub { font-size: 26px; font-weight: 700; margin: 4px 0 2px; }
        .lpe-chart-sub.positive { color: ${POS_TEXT}; }
        .lpe-chart-sub.negative { color: ${ACCENT}; }
        .lpe-chart-note {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12px; color: #999; margin: 0 0 6px;
        }
        .lpe-svg { width: 100%; height: auto; display: block; }
        .lpe-line { transition: stroke-dashoffset 0.85s ease; }
        .lpe-dot, .lpe-dot-label { transition: opacity 0.35s ease, r 0.35s ease; }
        .lpe-axis-label, .lpe-year-label {
          font-family: Arial, Helvetica, sans-serif; font-size: 10px; fill: #aaa;
        }
        .lpe-dot-label {
          font-family: Arial, Helvetica, sans-serif; font-size: 11px;
          font-weight: 700; fill: ${ACCENT};
        }

        .lpe-table { margin-top: 10px; font-family: Arial, Helvetica, sans-serif; }
        .lpe-thead {
          display: flex; justify-content: space-between;
          background: #efece7; padding: 7px 12px;
          font-size: 11px; font-weight: 700; color: #777;
        }
        .lpe-tbody { max-height: 280px; overflow-y: auto; border-bottom: 1px solid #eee; }
        .lpe-tr {
          display: flex; justify-content: space-between; gap: 12px;
          padding: 6px 12px; font-size: 12.5px;
          border-bottom: 1px solid #f1efec;
          opacity: 0; transform: translateY(6px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .lpe-tbody.show .lpe-tr { opacity: 1; transform: translateY(0); }
        .lpe-tr .name { color: #444; }
        .lpe-tr .val { font-weight: 700; white-space: nowrap; }
        .lpe-tr .val.pos { color: ${POS_TABLE}; }
        .lpe-tr .val.neg { color: ${ACCENT}; }
        .lpe-tr.total {
          background: #fbeeeb; font-weight: 700; border-bottom: none;
          opacity: 0; transform: translateY(6px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .lpe-tr.total.show { opacity: 1; transform: translateY(0); }
        .lpe-tr.total .name { color: #2a2a2a; font-weight: 700; }

        @media (max-width: 820px) {
          .lpe-header { padding: 40px 24px 20px; }
          .lpe-wrap { flex-direction: column; }
          .lpe-steps, .lpe-chart-col { width: 100%; padding-left: 24px; padding-right: 24px; }
          .lpe-steps { padding-bottom: 10vh; }
          .lpe-chart-col { position: relative; height: auto; padding-top: 10px; padding-bottom: 40px; }
          .lpe-step { margin-bottom: 24vh; }
        }
      `}</style>

      {/* ---------------- Header ---------------- */}
      <div className="lpe-header">
    
        <h1 className="lpe-h1 font-bungee color-pink">
          Laju Pertumbuhan Ekonomi Provinsi Jawa Tengah, <em className="font-bungee color-green">2016-2025</em>
        </h1>
        <p className=" font-delius">
          Ditelusuri dari Laju Pertumbuhan PDRB Atas Dasar Harga Konstan 2010
          (Tahunan, dalam persen), berdasarkan data BPS Provinsi Jawa Tengah
          menurut 17 lapangan usaha.
        </p>
      </div>

      {/* ---------------- Scrolly ---------------- */}
      <div className="lpe-wrap">
        {/* ====== KIRI: kartu narasi ====== */}
        <div className="lpe-steps" ref={stepsRef}>
          {years.map((yr, i) => (
            <div
              key={yr}
              data-step={i}
              className={`lpe-step${active === i ? " is-active" : ""}`}
            >
              <div className="lpe-step-inner">
                <span className="font-rubik color-pink">{yr}</span>
                <span className="lpe-step-value font-rubik">
                  Pertumbuhan PDRB: {fmt(pdrbTotal[yr])}%
                </span>
                <p className="font-rubik">{stepTexts[yr]}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ====== KANAN: chart sticky ====== */}
        <div className="lpe-chart-col">
          <p className="lpe-chart-title">
            PDRB Jawa Tengah · Tahun <strong className="font-rubik color-green">{activeYear}</strong>
          </p>
          <p className={`lpe-chart-sub font-rubik font-blod color-pink ${negative ? "negative" : "positive"}`}>
            {fmt(activeValue)}%
          </p>
          <p className="lpe-chart-note">
            Laju pertumbuhan Produk Domestik Regional Bruto (y-on-y)
          </p>

          <svg className="lpe-svg" viewBox={`0 0 ${W} ${H}`}>
            {/* Gridline + label sumbu-Y */}
            {geom.ticks.map((t) => (
              <g key={t.v}>
                <line
                  x1={M.left}
                  x2={W - M.right}
                  y1={t.y}
                  y2={t.y}
                  stroke="#eee"
                  strokeWidth={1}
                />
                <text
                  className="lpe-axis-label"
                  x={M.left - 8}
                  y={t.y + 3}
                  textAnchor="end"
                >
                  {Math.round(t.v)}%
                </text>
              </g>
            ))}

            {/* Baseline nol (hanya bila rentang data melewati nol) */}
            {geom.zeroY !== null && (
              <line
                x1={M.left}
                x2={W - M.right}
                y1={geom.zeroY}
                y2={geom.zeroY}
                stroke="#ccc"
                strokeWidth={1}
                strokeDasharray="3,3"
              />
            )}

            {/* Garis tren — memanjang progresif mengikuti step aktif */}
            <path
              className="lpe-line color-pink"
              d={geom.d}
              fill="none"
              stroke={ACCENT}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={geom.total}
              strokeDashoffset={dashOffset}
            />

            {/* Titik data + label tahun */}
            {geom.points.map((p, i) => {
              const passed = i <= active;
              const isActive = i === active;
              return (
                <g key={p.year}>
                  <circle
                    className="lpe-dot"
                    cx={p.cx}
                    cy={p.cy}
                    r={isActive ? 5 : 3}
                    fill={ACCENT}
                    stroke={BG}
                    strokeWidth={2}
                    opacity={passed ? 1 : 0}
                  />
                  {isActive && (
                    <text
                      className="lpe-dot-label"
                      x={p.cx}
                      y={p.cy - 12}
                      textAnchor="middle"
                    >
                      {fmt(p.value)}%
                    </text>
                  )}
                  <text
                    className="lpe-year-label"
                    x={p.cx}
                    y={H - 10}
                    textAnchor="middle"
                  >
                    {p.year}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* ---------------- Panel tabel sektor ---------------- */}
          <div className="lpe-table">
            <div className="lpe-thead">
              <span>Lapangan Usaha</span>
              <span>Pertumbuhan</span>
            </div>
            <div className={`lpe-tbody${rowsShown ? " show" : ""}`}>
              {lajuPertumbuhanData.map((row) => {
                const v = row.values[activeYear];
                return (
                  <div className="lpe-tr" key={row.lapanganUsaha}>
                    <span className="name">{sectorLabel(row.lapanganUsaha)}</span>
                    <span className={`val ${v >= 0 ? "pos" : "neg"}`}>
                      {fmt(v)}%
                    </span>
                  </div>
                );
              })}
            </div>
            <div className={`lpe-tr total${rowsShown ? " show" : ""}`}>
              <span className="name">Produk Domestik Regional Bruto</span>
              <span className={`val ${activeValue >= 0 ? "pos" : "neg"}`}>
                {fmt(activeValue)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
