"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { pdrbTotal, years } from "@/data/lajuPertumbuhan";

/* ==================================================================
 * SECTION 2 — Laju Pertumbuhan Ekonomi Jawa Tengah 2016–2025
 *
 * Line chart scrollytelling: kartu narasi tahunan di KIRI (44%),
 * chart sticky di KANAN (56%). Kebalikan dari Section 1 yang
 * menempatkan peta di kiri.
 *
 * Revisi:
 * - Kartu narasi memakai font & gaya kartu yang sama dengan
 *   IndeksWilliamson.tsx ("Jost" + kartu putih rounded/shadow, satu
 *   kartu aktif pada satu waktu, kartu lain memudar naik/turun).
 * - Tabel sektor di bawah chart dihapus; ukuran chart mengikuti
 *   dimensi chart IndeksWilliamson (760x480).
 * - Blok teks nilai besar di atas chart (judul + persen + catatan)
 *   dihapus — digantikan garis kursor vertikal yang berjalan mengikuti
 *   tahun aktif, dengan label persen berwarna hijau/merah di sisinya.
 *
 * Sumber angka: src/data/lajuPertumbuhan.ts — sudah identik dengan
 * section_2.xlsx (Laju Pertumbuhan PDRB ADHK 2010, tahunan, persen).
 * ================================================================== */

/* ---------------- Palet ---------------- */
const ACCENT = "#c51b7d"; // merah-marun, warna aksen tunggal chart / negatif
const GREEN = "#1c7a4a"; // positif
const POS_TEXT = "#2a2a2a";
const BG = "#fdfcfa";

/* ---------------- Geometri SVG (disamakan dengan Indeks Williamson) --- */
const W = 760;
const H = 480;
const M = { top: 25, right: 35, bottom: 35, left: 50 };
const Y_PAD_RATIO = 0.15;
const TICKS = 5;

/* ---------------- Util ---------------- */

/** "5.30" → "5.3", "-2.65" → "-2.65" (mengikuti format label di brief). */
function fmt(v: number): string {
  return String(Number(v.toFixed(2)));
}

function fmtSigned(v: number): string {
  const s = fmt(v);
  return v > 0 ? `+${s}` : s;
}

/* ---------------- Narasi per tahun (gaya tulisan peneliti) ------------
 * Setiap step menjelaskan bukan hanya ANGKA pertumbuhan totalnya, tapi
 * juga sektor pendorong/penahan laju tersebut serta dugaan penyebabnya,
 * mengacu pada data lengkap 17 lapangan usaha di lajuPertumbuhan.ts.
 * ------------------------------------------------------------------- */
const steps: { year: number; content: ReactNode }[] = [
  {
    year: 2016,
    content: (
      <>
        <p>
          Ekonomi Jawa Tengah membuka periode 2016–2025 dengan pertumbuhan{" "}
          <strong>5,25%</strong>, menjadi titik tolak sebelum satu dekade penuh
          gejolak. Laju ini ditopang lonjakan tajam sektor{" "}
          <span className="hl hl-green">
            Pertambangan dan Penggalian sebesar 18,98%
          </span>
          , jauh di atas seluruh lapangan usaha lain tahun itu.
        </p>
        <p>
          Lonjakan pertambangan diduga mencerminkan pemulihan produksi galian
          tambang dan bahan konstruksi setelah tertekan pada tahun-tahun
          sebelumnya, sejalan dengan aktivitas pembangunan infrastruktur. Jasa
          Perusahaan turut tumbuh <strong>10,62%</strong>, menandai penguatan
          permintaan jasa bisnis di luar sektor primer, sementara Pertanian dan
          Air-Limbah hanya tumbuh sekitar <strong>2,2%</strong>—wajar mengingat
          keduanya lebih dipengaruhi siklus musim ketimbang siklus bisnis.
        </p>
      </>
    ),
  },
  {
    year: 2017,
    content: (
      <>
        <p>
          Pertumbuhan 2017 nyaris tak bergeser dari tahun sebelumnya, di{" "}
          <strong>5,26%</strong>. Namun di balik angka agregat yang stabil ini,
          komposisi pendorongnya berubah total: kali ini{" "}
          <span className="hl hl-green">
            Informasi dan Komunikasi melompat 13,27%
          </span>
          , laju tertinggi di antara seluruh sektor.
        </p>
        <p>
          Percepatan sektor Infokom sejalan dengan meluasnya penetrasi internet
          seluler dan adopsi layanan data di Indonesia pada periode ini.
          Sebaliknya, Administrasi Pemerintahan (2,57%) dan Pertanian (1,82%)
          tumbuh jauh lebih lambat, mencerminkan sifat belanja publik yang
          relatif tetap serta variasi hasil panen antarmusim.
        </p>
      </>
    ),
  },
  {
    year: 2018,
    content: (
      <>
        <p>
          Laju pertumbuhan naik tipis menjadi <strong>5,30%</strong> pada
          2018—level tertinggi sejak awal periode saat itu. Yang menonjol,
          kenaikan kali ini tergolong merata: hampir seluruh 17 lapangan usaha
          tumbuh positif.
        </p>
        <p>
          Informasi dan Komunikasi kembali memimpin dengan{" "}
          <span className="hl hl-green">12,39%</span>, disusul Jasa Perusahaan{" "}
          <strong>9,48%</strong>, mengindikasikan ekonomi jasa dan digital
          tumbuh semakin dominan menjelang tahun politik 2019. Sektor primer
          seperti Pertanian (2,62%) dan Pertambangan (2,45%) tetap menjadi
          penahan laju, konsisten dengan pola tahun-tahun sebelumnya.
        </p>
      </>
    ),
  },
  {
    year: 2019,
    content: (
      <>
        <p>
          2019 mencatatkan <span className="hl hl-green">5,36%</span>, puncak
          pertumbuhan tertinggi sepanjang dekade sebelum pandemi melanda—dan,
          seperti akan terlihat pada langkah berikutnya, juga menjadi tahun
          normal terakhir sebelum kontraksi besar 2020.
        </p>
        <p>
          Informasi dan Komunikasi (11,62%) dan Jasa Perusahaan (10,54%) tetap
          menjadi motor utama. Mobilitas masyarakat yang masih sepenuhnya normal
          turut mendorong Penyediaan Akomodasi-Makan Minum tumbuh 9,07% dan
          Transportasi-Pergudangan 8,49%, mencerminkan aktivitas pariwisata dan
          perjalanan domestik yang berjalan tanpa hambatan.
        </p>
      </>
    ),
  },
  {
    year: 2020,
    content: (
      <>
        <p>
          Pandemi COVID-19 menghantam keras: ekonomi Jawa Tengah terkontraksi{" "}
          <span className="hl hl-red">-2,65%</span>, kontraksi pertama dan
          satu-satunya sepanjang 2016–2025.
        </p>
        <p>
          Transportasi dan Pergudangan ambles hingga{" "}
          <span className="hl hl-red">-32,38%</span> dan Jasa Lainnya -8,01%,
          sejalan dengan pembatasan mobilitas (PSBB) yang melumpuhkan sektor
          yang bergantung pada pergerakan fisik orang. Menariknya, dua sektor
          justru tumbuh tinggi di tengah krisis: Informasi dan Komunikasi
          melonjak <span className="hl hl-green">15,65%</span>—laju tertinggi
          sektor ini sepanjang dekade—didorong pergeseran mendadak ke kerja,
          sekolah, dan belanja dari rumah, sementara Jasa Kesehatan tumbuh 8,19%
          akibat lonjakan kebutuhan layanan medis.
        </p>
      </>
    ),
  },
  {
    year: 2021,
    content: (
      <>
        <p>
          Pemulihan mulai terlihat pada 2021 dengan pertumbuhan{" "}
          <strong>3,33%</strong>, meski masih jauh di bawah level pra-pandemi.
          Konstruksi menjadi sektor dengan laju tertinggi tahun ini di{" "}
          <span className="hl hl-green">7,37%</span>, diikuti Informasi dan
          Komunikasi 6,04%.
        </p>
        <p>
          Pertumbuhan konstruksi diduga terkait percepatan realisasi proyek
          infrastruktur dan stimulus Pemulihan Ekonomi Nasional. Sebaliknya,
          Jasa Pendidikan nyaris stagnan (0,07%) dan Administrasi Pemerintahan
          bahkan sedikit terkontraksi <span className="hl hl-red">-0,64%</span>,
          mencerminkan pembelajaran jarak jauh yang masih berlangsung dan
          kehati-hatian belanja publik di tengah gelombang varian Delta
          pertengahan tahun.
        </p>
      </>
    ),
  },
  {
    year: 2022,
    content: (
      <>
        <p>
          Ekonomi melompat ke <span className="hl hl-green">5,31%</span> pada
          2022, melampaui level sebelum pandemi. Yang paling mencolok,
          Transportasi dan Pergudangan melonjak ekstrem hingga{" "}
          <span className="hl hl-green">73,01%</span>.
        </p>
        <p>
          Lonjakan sebesar itu perlu dibaca hati-hati: angka ini sebagian besar
          merupakan <span className="hl hl-orange">efek basis rendah</span>{" "}
          setelah kontraksi tajam 2020–2021, dipicu pencabutan PPKM dan
          pembukaan kembali jalur transportasi secara penuh, bukan semata
          pertumbuhan riil kapasitas sektor. Akomodasi-Makan Minum turut
          melonjak 16,99% seiring pariwisata yang kembali bergairah, sementara
          Pertambangan justru terkontraksi -6,2%.
        </p>
      </>
    ),
  },
  {
    year: 2023,
    content: (
      <>
        <p>
          Pertumbuhan turun ke <strong>4,97%</strong> pada 2023, sebuah
          normalisasi wajar setelah lonjakan rebound 2022. Akomodasi-Makan Minum
          (11,24%) dan Informasi-Komunikasi (10,67%) tetap menjadi penopang
          utama, namun melandai dari puncaknya.
        </p>
        <p>
          Yang patut dicermati, Pertanian nyaris tidak tumbuh, hanya{" "}
          <span className="hl hl-red">0,43%</span>—diduga terkait dampak
          kekeringan fenomena El Niño terhadap musim tanam dan panen di Jawa
          Tengah sepanjang 2023, yang turut menekan hasil produksi pertanian
          pada tahun tersebut.
        </p>
      </>
    ),
  },
  {
    year: 2024,
    content: (
      <>
        <p>
          Pertumbuhan sedikit melambat menjadi <strong>4,95%</strong> pada 2024.
          Akomodasi-Makan Minum (10,03%) dan Informasi-Komunikasi (9,56%) masih
          memimpin, tetapi Pertanian kembali tertekan di{" "}
          <span className="hl hl-red">1,39%</span>—kemungkinan dampak lanjutan
          kekeringan El Niño yang terbawa ke musim tanam 2023/2024.
        </p>
        <p>
          Di sisi lain, Administrasi Pemerintahan melonjak ke 7,53%, selaras
          dengan siklus belanja publik menjelang dan selama penyelenggaraan
          Pemilu 2024, sementara Jasa Keuangan-Asuransi stagnan di 2,16% untuk
          tahun ketiga berturut-turut.
        </p>
      </>
    ),
  },
  {
    year: 2025,
    content: (
      <>
        <p>
          Ekonomi Jawa Tengah kembali menguat ke{" "}
          <span className="hl hl-green">5,37%</span> pada 2025, angka tertinggi
          dalam sepuluh tahun terakhir, melampaui bahkan puncak pra-pandemi
          2019.
        </p>
        <p>
          Pemulihan ditopang rebound Pertanian ke 4,78%—level tertinggi
          sepanjang dekade—sejalan dengan membaiknya kondisi musim tanam pasca
          berakhirnya fase kering El Niño, serta Jasa Keuangan-Asuransi yang
          melompat ke 5,61% setelah tiga tahun stagnan. Akomodasi-Makan Minum
          (10,6%) dan Informasi-Komunikasi (8,74%) tetap menjadi penopang
          pertumbuhan yang kini lebih merata antarsektor.
        </p>
      </>
    ),
  },
];

export default function LajuPertumbuhanScrolly() {
  const [active, setActive] = useState(0);
  const stepsRef = useRef<HTMLDivElement>(null);

  const activeYear = years[active];
  const activeValue = pdrbTotal[activeYear];
  /* Warna pill mengikuti TREN dibanding tahun sebelumnya (naik/turun),
   * bukan sekadar tanda positif/negatif nilainya — supaya 2023 & 2024
   * yang melambat dari tahun sebelumnya tetap tampil merah walau
   * nilainya sendiri masih positif. Tahun pertama (2016, tanpa
   * pembanding) memakai tanda nilainya sendiri sebagai fallback. */
  const prevValue = active > 0 ? pdrbTotal[years[active - 1]] : null;
  const delta = prevValue === null ? null : activeValue - prevValue;
  const isUp = delta === null ? activeValue >= 0 : delta >= 0;
  const deltaLabel =
    delta === null
      ? null
      : `${delta >= 0 ? "▲" : "▼"} ${fmt(Math.abs(delta))} pp dari tahun lalu`;

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
      .map(
        (p, i) => `${i === 0 ? "M" : "L"}${p.cx.toFixed(2)} ${p.cy.toFixed(2)}`,
      )
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
      innerW,
    };
  }, []);

  /* ---------- Observer kartu narasi (threshold 0.5, sama seperti Williamson) --- */
  const onIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        setActive(parseInt((e.target as HTMLElement).dataset.step || "0", 10));
      }
    });
  }, []);

  useEffect(() => {
    const el = stepsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(onIntersect, { threshold: 0.5 });
    el.querySelectorAll("[data-step]").forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [onIntersect]);

  const dashOffset = geom.total - geom.cumulative[active];

  /* Label persen dinamis: lebar pill menyesuaikan panjang teks supaya
   * angka besar (mis. "+73.01%") tetap muat di dalamnya. */
  const pillLabel = `${fmtSigned(activeValue)}%`;
  const pillHeight = deltaLabel ? 58 : 38;
  const mainWidth = pillLabel.length * 13 + 26;
  const deltaWidth = deltaLabel ? deltaLabel.length * 6.4 + 18 : 0;
  const pillWidth = Math.max(96, mainWidth, deltaWidth);

  /* Kursor vertikal: dekatkan label ke kiri garis saat mendekati tepi kanan
   * chart, supaya pill persen tidak terpotong viewBox. */
  const cursorX = geom.points[active].cx;
  const labelOnLeft = cursorX > W - M.right - (pillWidth + 24);
  const pillColor = isUp ? GREEN : ACCENT;

  return (
    <section className="lpe-root">
      <style>{`
        .lpe-root {
          background: ${BG};
          font-family: Georgia, "Times New Roman", serif;
          color: ${POS_TEXT};
        }
        .lpe-chart-header { max-width: 660px; margin: 0 0 14px; }
        .lpe-chart-eyebrow {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12px; letter-spacing: 0.5px; color: #8a8a8a;
          text-transform: none; margin: 0;
        }
        .lpe-h1 { font-size: 26px; line-height: 1.28; font-weight: 400; margin: 0; }
        .lpe-h1 em { font-style: normal; color: ${ACCENT}; }
        .lpe-desc {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 13px; color: #666; max-width: 640px; margin: 10px 0 0; line-height: 1.55;
        }

        .lpe-wrap { max-width: 1200px; margin: 0 auto; display: flex; align-items: flex-start; }
        .lpe-steps { width: 44%; padding: 0 40px 30vh; }
        .lpe-chart-col {
          width: 56%; position: sticky; top: 0; height: 100vh;
          display: flex; flex-direction: column; justify-content: center;
          padding: 0 24px;
        }

        /* ---------------- Kartu narasi: font & gaya sama dengan
           IndeksWilliamson.tsx (.step-card) ---------------- */
        .lpe-step {
          margin-bottom: 80vh;
          font-family: "Jost", var(--font-sans), sans-serif;
        }
        .lpe-step:first-child { padding-top: 30vh; }
        .lpe-step:last-child { margin-bottom: 140vh; }
        .lpe-step-card {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 2rem 2.25rem;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          transition: all 0.35s ease;
          opacity: 0.25;
          transform: translateY(15px);
        }
        .lpe-step.is-active .lpe-step-card {
          opacity: 1;
          transform: translateY(0);
          border-color: #cbd5e1;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
        }
        .lpe-step-year {
          display: block; font-weight: 800; font-size: 30px; line-height: 1.15;
          color: ${ACCENT}; margin-bottom: 14px;
        }
        .lpe-step-card p {
          font-size: 1.05rem; line-height: 1.75; color: #374151;
          margin: 0 0 1rem;
        }
        .lpe-step-card p:last-child { margin-bottom: 0; }

        /* Highlight badges — palet sama dengan IndeksWilliamson */
        .lpe-step-card .hl {
          display: inline-block; padding: 0.15em 0.45em; border-radius: 4px;
          font-weight: 600; font-size: 0.95em;
        }
        .lpe-step-card .hl-green { background-color: #dcfce7; color: #166534; }
        .lpe-step-card .hl-red { background-color: #fee2e2; color: #991b1b; }
        .lpe-step-card .hl-orange { background-color: #ffedd5; color: #9a3412; }

        /* ---------------- Chart kanan ---------------- */
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

        /* Kursor vertikal + pill persen (mengikuti tahun aktif) */
        .lpe-cursor { transition: transform 0.6s ease; }
        .lpe-cursor-line { stroke: #9ca3af; stroke-width: 1.5; stroke-dasharray: 4 3; }
        .lpe-cursor-year {
          font-family: Arial, Helvetica, sans-serif; font-size: 26px;
          font-weight: 800; fill: #374151;
        }
        .lpe-cursor-pill-text {
          font-family: Arial, Helvetica, sans-serif; font-size: 19px;
          font-weight: 800; fill: #ffffff;
        }
        .lpe-cursor-pill-sub {
          font-family: Arial, Helvetica, sans-serif; font-size: 11px;
          font-weight: 600; fill: rgba(255, 255, 255, 0.9);
        }

        @media (max-width: 820px) {
          .lpe-chart-header { max-width: 100%; }
          .lpe-wrap { flex-direction: column; }
          .lpe-steps, .lpe-chart-col { width: 100%; padding-left: 24px; padding-right: 24px; }
          .lpe-steps { padding-bottom: 10vh; }
          .lpe-chart-col { position: relative; height: auto; padding-top: 10px; padding-bottom: 40px; }
          .lpe-step { margin-bottom: 55vh; }
          .lpe-step:first-child { padding-top: 10vh; }
        }
      `}</style>

      {/* ---------------- Scrolly ---------------- */}
      <div className="lpe-wrap">
        {/* ====== KIRI: kartu narasi (satu aktif pada satu waktu) ====== */}
        <div className="lpe-steps" ref={stepsRef}>
          {steps.map((s, i) => (
            <div
              key={s.year}
              data-step={i}
              className={`lpe-step${active === i ? " is-active" : ""}`}
            >
              <div className="lpe-step-card">
                <span className="lpe-step-year">{s.year}</span>
                {s.content}
              </div>
            </div>
          ))}
        </div>

        {/* ====== KANAN: judul + narasi pembuka + chart, semuanya
               menempel (sticky) di tempat — tidak ikut bergeser saat
               scroll, hanya kartu narasi di kiri yang bergerak. ====== */}
        <div className="lpe-chart-col">
          <div className="lpe-chart-header">
            <h1 className="lpe-h1 font-bungee color-pink">
              Laju Pertumbuhan Ekonomi Provinsi Jawa Tengah,{" "}
              <em className="font-bungee color-green">2016-2025</em>
            </h1>
            <p className="lpe-desc font-delius">
              Ditelusuri dari Laju Pertumbuhan PDRB Atas Dasar Harga Konstan
              2010 (Tahunan, dalam persen), berdasarkan data BPS Provinsi Jawa
              Tengah menurut 17 lapangan usaha.
            </p>
          </div>
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
                  <text
                    className="lpe-year-label"
                    x={p.cx}
                    y={H - 12}
                    textAnchor="middle"
                  >
                    {p.year}
                  </text>
                </g>
              );
            })}

            {/* Kursor vertikal berjalan mengikuti tahun aktif, dengan
               label persen berwarna hijau (naik) / merah (turun) */}
            <g
              className="lpe-cursor"
              style={{ transform: `translateX(${cursorX}px)` }}
            >
              <line
                className="lpe-cursor-line"
                x1={0}
                x2={0}
                y1={M.top}
                y2={H - M.bottom}
              />
              <g
                transform={
                  labelOnLeft ? "translate(-12, 0)" : "translate(12, 0)"
                }
              >
                <text
                  className="lpe-cursor-year"
                  x={0}
                  y={M.top + 20}
                  textAnchor={labelOnLeft ? "end" : "start"}
                >
                  {activeYear}
                </text>
                <rect
                  x={labelOnLeft ? -pillWidth : 0}
                  y={M.top + 32}
                  width={pillWidth}
                  height={pillHeight}
                  rx={5}
                  fill={pillColor}
                />
                <text
                  className="lpe-cursor-pill-text"
                  x={labelOnLeft ? -pillWidth / 2 : pillWidth / 2}
                  y={
                    deltaLabel
                      ? M.top + 32 + 22
                      : M.top + 32 + pillHeight / 2 + 6
                  }
                  textAnchor="middle"
                >
                  {pillLabel}
                </text>
                {deltaLabel && (
                  <text
                    className="lpe-cursor-pill-sub"
                    x={labelOnLeft ? -pillWidth / 2 : pillWidth / 2}
                    y={M.top + 32 + 42}
                    textAnchor="middle"
                  >
                    {deltaLabel}
                  </text>
                )}
              </g>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
