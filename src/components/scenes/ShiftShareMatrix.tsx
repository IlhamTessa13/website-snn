"use client";

import { useEffect, useRef, useState } from "react";

interface MetricValue {
  value: number;
  width: number;
  positive: boolean;
}

interface SectorRow {
  rowId: string;
  name: string;
  ni: MetricValue;
  pi: MetricValue;
  di: MetricValue;
  ntb: MetricValue;
}

interface TotalRow {
  ni: number;
  pi: number;
  di: number;
  ntb: number;
}

interface NarrativeStep {
  step: number;
  tag: string;
  title: string;
  text: string;
  highlight?: string;
}

const era2016: SectorRow[] = [
  {
    rowId: "a-16",
    name: "A. Pertanian, Kehutanan, dan Perikanan",
    ni: { value: 15886.12, width: 40, positive: true },
    pi: { value: 199.43, width: 2, positive: true },
    di: { value: -6304.9, width: 50, positive: false },
    ntb: { value: 9780.64, width: 25, positive: true },
  },
  {
    rowId: "b-16",
    name: "B. Pertambangan dan Penggalian",
    ni: { value: 2644.83, width: 8, positive: true },
    pi: { value: -2247.72, width: 15, positive: false },
    di: { value: 1620.56, width: 12, positive: true },
    ntb: { value: 2017.67, width: 6, positive: true },
  },
  {
    rowId: "c-16",
    name: "C. Industri Pengolahan",
    ni: { value: 40416.26, width: 100, positive: true },
    pi: { value: -12088.66, width: 80, positive: false },
    di: { value: 1329.23, width: 10, positive: true },
    ntb: { value: 29656.83, width: 75, positive: true },
  },
  {
    rowId: "d-16",
    name: "D. Pengadaan Listrik dan Gas",
    ni: { value: 126.74, width: 2, positive: true },
    pi: { value: -44.92, width: 2, positive: false },
    di: { value: 94.8, width: 2, positive: true },
    ntb: { value: 176.62, width: 2, positive: true },
  },
  {
    rowId: "e-16",
    name: "E. Pengadaan Air, Sampah, Limbah",
    ni: { value: 80.54, width: 2, positive: true },
    pi: { value: 59.65, width: 2, positive: true },
    di: { value: -26.78, width: 2, positive: false },
    ntb: { value: 113.41, width: 2, positive: true },
  },
  {
    rowId: "f-16",
    name: "F. Konstruksi",
    ni: { value: 11824.55, width: 30, positive: true },
    pi: { value: 1963.05, width: 15, positive: true },
    di: { value: -995.89, width: 8, positive: false },
    ntb: { value: 12791.71, width: 32, positive: true },
  },
  {
    rowId: "g-16",
    name: "G. Perdagangan Besar dan Eceran",
    ni: { value: 16656.27, width: 42, positive: true },
    pi: { value: -4040.14, width: 30, positive: false },
    di: { value: 4646.11, width: 35, positive: true },
    ntb: { value: 17262.24, width: 45, positive: true },
  },
  {
    rowId: "h-16",
    name: "H. Transportasi dan Pergudangan",
    ni: { value: 3836.92, width: 10, positive: true },
    pi: { value: -2444.56, width: 18, positive: false },
    di: { value: -5924.8, width: 45, positive: false },
    ntb: { value: -4532.44, width: 12, positive: false },
  },
  {
    rowId: "i-16",
    name: "I. Penyediaan Akomodasi & Makan Minum",
    ni: { value: 3637.05, width: 10, positive: true },
    pi: { value: -2102.18, width: 15, positive: false },
    di: { value: 2605.39, width: 20, positive: true },
    ntb: { value: 4140.27, width: 10, positive: true },
  },
  {
    rowId: "j-16",
    name: "J. Informasi dan Komunikasi",
    ni: { value: 4880.99, width: 12, positive: true },
    pi: { value: 10129.91, width: 65, positive: true },
    di: { value: 7985.76, width: 55, positive: true },
    ntb: { value: 22996.65, width: 58, positive: true },
  },
  {
    rowId: "k-16",
    name: "K. Jasa Keuangan dan Asuransi",
    ni: { value: 3213.71, width: 8, positive: true },
    pi: { value: 1713.9, width: 12, positive: true },
    di: { value: -1354.87, width: 10, positive: false },
    ntb: { value: 3572.74, width: 9, positive: true },
  },
  {
    rowId: "l-16",
    name: "L. Real Estat",
    ni: { value: 2161.94, width: 5, positive: true },
    pi: { value: 373.3, width: 3, positive: true },
    di: { value: 363.63, width: 3, positive: true },
    ntb: { value: 2898.87, width: 7, positive: true },
  },
  {
    rowId: "mn-16",
    name: "M,N. Jasa Perusahaan",
    ni: { value: 414.09, width: 2, positive: true },
    pi: { value: 277.74, width: 2, positive: true },
    di: { value: -21.24, width: 2, positive: false },
    ntb: { value: 670.59, width: 2, positive: true },
  },
  {
    rowId: "o-16",
    name: "O. Administrasi Pemerintahan",
    ni: { value: 3102.69, width: 8, positive: true },
    pi: { value: 126.88, width: 2, positive: true },
    di: { value: -1262.94, width: 10, positive: false },
    ntb: { value: 1966.63, width: 5, positive: true },
  },
  {
    rowId: "p-16",
    name: "P. Jasa Pendidikan",
    ni: { value: 4298.82, width: 10, positive: true },
    pi: { value: 1740.82, width: 12, positive: true },
    di: { value: 1428.96, width: 10, positive: true },
    ntb: { value: 7468.6, width: 18, positive: true },
  },
  {
    rowId: "q-16",
    name: "Q. Jasa Kesehatan dan Kegiatan Sosial",
    ni: { value: 946.29, width: 2, positive: true },
    pi: { value: 1740.39, width: 12, positive: true },
    di: { value: -161.72, width: 2, positive: false },
    ntb: { value: 2524.96, width: 6, positive: true },
  },
  {
    rowId: "r-16",
    name: "R,S,T,U. Jasa Lainnya",
    ni: { value: 1824.76, width: 5, positive: true },
    pi: { value: 1599.04, width: 10, positive: true },
    di: { value: -801.88, width: 6, positive: false },
    ntb: { value: 2621.91, width: 6, positive: true },
  },
];
const total2016: TotalRow = {
  ni: 115952.57,
  pi: 0.0,
  di: 175.35,
  ntb: 116127.92,
};

const steps2016: NarrativeStep[] = [
  {
    step: 1,
    tag: "Pengantar",
    title: "",
    text: "Analisis Shift Share membantu kita melihat sejauh mana kinerja perekonomian lapangan usaha dipengaruhi oleh pertumbuhan makro dan struktur sektoral.",
  },
  {
    step: 2,
    tag: "Pengantar",
    title: "",
    text: "Melalui analisis Shift-Share, kita dapat mengkaji kinerja perekonomian daerah secara komprehensif dari berbagai dimensi pertumbuhan. Kita bisa membedah mulai dari Pangsa Wilayah (NI) untuk melihat sejauh mana skala ekonomi awal dan pengaruh tren makro nasional, Pergeseran Proporsional (PI) guna mengetahui keunggulan bauran struktur industri, hingga Pergeseran Pangsa Wilayah (DI) untuk mengukur tingkat daya saing murni suatu sektor di tingkat lokal, beserta total perubahannya.",
  },
  {
    step: 3,
    tag: "Sektor Unggulan J",
    title: "Kemajuan Pesat Sektor Infokom",
    text: "Secara sektoral, Kategori J (Informasi & Komunikasi) mencatat nilai Pi yang positif besar. Ini diartikan bahwa kemajuan ekonomi Sektor Infokom di Jawa Tengah tumbuh relatif jauh lebih cepat daripada kategori yang sama di level Indonesia.",
    highlight: "j-16",
  },
  {
    step: 4,
    tag: "Daya Saing (Di > 0)",
    title: "Keunggulan Kompetitif Infokom",
    text: "Apabila nilai Di (Differential Shift) bertanda positif (> 0), maka kategori ekonomi tersebut memiliki daya saing yang baik terhadap wilayah referensinya. Pada periode ini, Kategori J terbukti memiliki daya saing yang sangat kuat di Jawa Tengah.",
    highlight: "j-16",
  },
  {
    step: 5,
    tag: "Daya Saing (Di < 0)",
    title: "Tekanan Sektor Pertanian (A)",
    text: "Sebaliknya, bila nilai Di bertanda negatif (< 0), berarti kategori tersebut tidak memiliki daya saing yang baik terhadap level nasional. Contohnya terlihat pada Kategori A (Pertanian) yang mencatat Di negatif yang cukup dalam (-6304.90).",
    highlight: "a-16",
  },
];

const era2021: SectorRow[] = [
  {
    rowId: "a-21",
    name: "A. Pertanian, Kehutanan, dan Perikanan",
    ni: { value: 28115.05, width: 40, positive: true },
    pi: { value: -15604.16, width: 25, positive: false },
    di: { value: -46.33, width: 2, positive: false },
    ntb: { value: 12464.56, width: 20, positive: true },
  },
  {
    rowId: "b-21",
    name: "B. Pertambangan dan Penggalian",
    ni: { value: 4939.97, width: 10, positive: true },
    pi: { value: -1495.09, width: 5, positive: false },
    di: { value: -3455.83, width: 10, positive: false },
    ntb: { value: -10.95, width: 2, positive: false },
  },
  {
    rowId: "c-21",
    name: "C. Industri Pengolahan",
    ni: { value: 73733.82, width: 100, positive: true },
    pi: { value: -4781.43, width: 10, positive: false },
    di: { value: -13165.5, width: 40, positive: false },
    ntb: { value: 55786.88, width: 80, positive: true },
  },
  {
    rowId: "d-21",
    name: "D. Pengadaan Listrik dan Gas",
    ni: { value: 258.99, width: 2, positive: true },
    pi: { value: -15.37, width: 2, positive: false },
    di: { value: 34.82, width: 2, positive: true },
    ntb: { value: 278.44, width: 2, positive: true },
  },
  {
    rowId: "e-21",
    name: "E. Pengadaan Air, Sampah, Limbah",
    ni: { value: 164.81, width: 2, positive: true },
    pi: { value: -82.7, width: 2, positive: false },
    di: { value: -15.12, width: 2, positive: false },
    ntb: { value: 66.99, width: 2, positive: true },
  },
  {
    rowId: "f-21",
    name: "F. Konstruksi",
    ni: { value: 23609.09, width: 35, positive: true },
    pi: { value: -3435.55, width: 8, positive: false },
    di: { value: 5799.24, width: 15, positive: true },
    ntb: { value: 25972.78, width: 38, positive: true },
  },
  {
    rowId: "g-21",
    name: "G. Perdagangan Besar dan Eceran",
    ni: { value: 32595.1, width: 45, positive: true },
    pi: { value: 446.92, width: 2, positive: true },
    di: { value: -4655.01, width: 15, positive: false },
    ntb: { value: 28387.01, width: 40, positive: true },
  },
  {
    rowId: "h-21",
    name: "H. Transportasi dan Pergudangan",
    ni: { value: 5384.63, width: 10, positive: true },
    pi: { value: 9583.89, width: 15, positive: true },
    di: { value: 11980.72, width: 35, positive: true },
    ntb: { value: 26949.24, width: 38, positive: true },
  },
  {
    rowId: "i-21",
    name: "I. Penyediaan Akomodasi & Makan Minum",
    ni: { value: 7212.12, width: 12, positive: true },
    pi: { value: 6952.24, width: 12, positive: true },
    di: { value: 4857.83, width: 14, positive: true },
    ntb: { value: 19022.18, width: 28, positive: true },
  },
  {
    rowId: "j-21",
    name: "J. Informasi dan Komunikasi",
    ni: { value: 13782.28, width: 20, positive: true },
    pi: { value: 8078.2, width: 14, positive: true },
    di: { value: 32.81, width: 2, positive: true },
    ntb: { value: 21893.29, width: 32, positive: true },
  },
  {
    rowId: "k-21",
    name: "K. Jasa Keuangan dan Asuransi",
    ni: { value: 6094.86, width: 10, positive: true },
    pi: { value: -1609.17, width: 5, positive: false },
    di: { value: -1511.91, width: 5, positive: false },
    ntb: { value: 2973.78, width: 5, positive: true },
  },
  {
    rowId: "l-21",
    name: "L. Real Estat",
    ni: { value: 4233.55, width: 8, positive: true },
    pi: { value: -2408.55, width: 6, positive: false },
    di: { value: 3084.22, width: 10, positive: true },
    ntb: { value: 4909.21, width: 8, positive: true },
  },
  {
    rowId: "mn-21",
    name: "M,N. Jasa Perusahaan",
    ni: { value: 844.48, width: 2, positive: true },
    pi: { value: 652.31, width: 2, positive: true },
    di: { value: -198.74, width: 2, positive: false },
    ntb: { value: 1298.05, width: 2, positive: true },
  },
  {
    rowId: "o-21",
    name: "O. Administrasi Pemerintahan",
    ni: { value: 5427.31, width: 8, positive: true },
    pi: { value: -1738.99, width: 5, positive: false },
    di: { value: 308.57, width: 2, positive: true },
    ntb: { value: 3996.88, width: 6, positive: true },
  },
  {
    rowId: "p-21",
    name: "P. Jasa Pendidikan",
    ni: { value: 8623.75, width: 12, positive: true },
    pi: { value: -4150.67, width: 12, positive: false },
    di: { value: 5043.89, width: 15, positive: true },
    ntb: { value: 9516.97, width: 14, positive: true },
  },
  {
    rowId: "q-21",
    name: "Q. Jasa Kesehatan dan Kegiatan Sosial",
    ni: { value: 2095.74, width: 4, positive: true },
    pi: { value: 62.75, width: 2, positive: true },
    di: { value: -56.29, width: 2, positive: false },
    ntb: { value: 2102.2, width: 4, positive: true },
  },
  {
    rowId: "r-21",
    name: "R,S,T,U. Jasa Lainnya",
    ni: { value: 3555.39, width: 6, positive: true },
    pi: { value: 3838.68, width: 6, positive: true },
    di: { value: -1174.11, width: 5, positive: false },
    ntb: { value: 6219.96, width: 10, positive: true },
  },
];
const total2021: TotalRow = {
  ni: 220670.91,
  pi: 0.0,
  di: 1156.56,
  ntb: 221827.47,
};

const steps2021: NarrativeStep[] = [
  {
    step: 1,
    tag: "Periode 2021 - 2025",
    title: "Era Pemulihan Pascapandemi",
    text: "Memasuki era pascapandemi 2021-2025, peta persaingan dan daya saing sektoral berbalik arah seiring pulihnya aktivitas ekonomi.",
  },
  {
    step: 2,
    tag: "Pergeseran Bersih (PB < 0)",
    title: "Tantangan Laju Industri Pengolahan (C)",
    text: "Analisis menurut komponen Pergeseran Bersih (PB diperoleh dari Pi + Di) mengidentifikasi kemajuan riil. Terdapat kategori seperti Industri Pengolahan (C) yang memiliki tanda negatif (PB < 0), artinya pertumbuhannya tergolong lambat dan belum melampaui kecepatan pertumbuhan sektoral nasional.",
    highlight: "c-21",
  },
  {
    step: 3,
    tag: "Berdaya Saing & Tumbuh Cepat",
    title: "Kebangkitan Sektor Transportasi (H)",
    text: "Masuk dalam kategori berdaya saing dan tumbuh cepat, Sektor Transportasi & Pergudangan pada periode ini mencatat nilai Di positif yang tinggi, menandakan kebangkitan logistik dan transportasi yang sangat masif di Jawa Tengah.",
    highlight: "h-21",
  },
  {
    step: 4,
    tag: "Pangsa Wilayah (Ni)",
    title: "Sektor Pendorong Pertumbuhan Utama",
    text: "Sektor Industri Pengolahan mencatatkan nilai Regional Share (NI) tertinggi sebesar 73.733,82. Besarnya nilai NI ini menunjukkan bahwa sebagian besar pertumbuhan absolut sektor tersebut digerakkan oleh dinamika pertumbuhan ekonomi nasional secara umum, di mana skala ekonomi awal yang sudah besar di Jawa Tengah membuat sektor ini otomatis ikut bertumbuh sejalan dengan tren acuan wilayah yang lebih luas.",
    highlight: "c-21",
  },
  {
    step: 5,
    tag: "Pergeseran Bersih (PB > 0)",
    title: "Pertumbuhan Progresif Infokom Berkelanjutan",
    text: "Kategori J (Infokom) terus mencatatkan Pergeseran Bersih positif (PB > 0), mengonfirmasi bahwa sektor ini secara konsisten memiliki pertumbuhan yang progresif dan melampaui rata-rata nasional.",
    highlight: "j-21",
  },
];

function MetricCell({ metric }: { metric: MetricValue }) {
  return (
    <div className="col-metric">
      <div className="bar-container">
        <div
          className={`inner-bar ${metric.positive ? "pos" : "neg"}`}
          style={{ width: `${metric.width}%` }}
        />
      </div>
      <span className="value-text">{metric.value.toFixed(2)}</span>
    </div>
  );
}

function MatrixEra({
  sectionId,
  periodTitle,
  sectors,
  total,
  steps,
}: {
  sectionId: string;
  periodTitle: string;
  sectors: SectorRow[];
  total: TotalRow;
  steps: NarrativeStep[];
}) {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(steps[0]?.step ?? 1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepNum = Number(entry.target.getAttribute("data-step"));
            setActiveStep(stepNum);
          }
        });
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0.1 },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const activeHighlight = steps.find((s) => s.step === activeStep)?.highlight;

  return (
    <section id={sectionId} style={{ position: "relative", width: "100%" }}>
      <div className="sticky-visual">
        <div className="matrix-visual-wrapper">
          <div className="matrix-container">
            <h2 className=" font-bungee color-green ">{periodTitle}</h2>

            <div className="matrix-header">
              <div className="col-name">Lapangan Usaha</div>
              <div className="col-metric">
                <span>Regional Share (Ni)</span>
                <img
                  src="/CHA_association.png"
                  className="header-jersey"
                  alt=""
                />
              </div>
              <div className="col-metric">
                <span>Proportionality (Pi)</span>
                <img src="/BOS_icon.png" className="header-jersey" alt="" />
              </div>
              <div className="col-metric">
                <span>Differential (Di)</span>
                <img
                  src="/PHI_statement.png"
                  className="header-jersey"
                  alt=""
                />
              </div>
              <div className="col-metric">
                <span>Nilai Tambah Riil</span>
                <img src="/UTA_classic.png" className="header-jersey" alt="" />
              </div>
            </div>

            {sectors.map((sec) => (
              <div
                key={sec.rowId}
                id={`row-${sec.rowId}`}
                className={`matrix-row ${activeHighlight && activeHighlight !== sec.rowId ? "dimmed" : ""}`}
              >
                <div className="col-name">{sec.name}</div>
                <MetricCell metric={sec.ni} />
                <MetricCell metric={sec.pi} />
                <MetricCell metric={sec.di} />
                <MetricCell metric={sec.ntb} />
              </div>
            ))}

            <div className="matrix-total">
              <div className="col-name">PDRB Jawa Tengah</div>
              <div className="total-text">{total.ni.toFixed(2)}</div>
              <div className="total-text">{total.pi.toFixed(2)}</div>
              <div className="total-text">{total.di.toFixed(2)}</div>
              <div className="total-text">{total.ntb.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="narrative-track">
        {steps.map((s, i) => (
          <div
            key={s.step}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            data-step={s.step}
            className={`matrix-step ${activeStep === s.step ? "active" : ""}`}
          >
            <div className="matrix-card">
              <div className="matrix-card-tag">{s.tag}</div>
              <h3 className="matrix-card-title">{s.title}</h3>
              <p className="matrix-card-text">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ShiftShareMatrix() {
  return (
    <div id="matrix-section">
      <MatrixEra
        sectionId="section-2016"
        periodTitle="Shift Share 2016 - 2020"
        sectors={era2016}
        total={total2016}
        steps={steps2016}
      />
      <MatrixEra
        sectionId="section-2021"
        periodTitle="Shift Share 2021 - 2025"
        sectors={era2021}
        total={total2021}
        steps={steps2021}
      />

      <style jsx>{`
        #matrix-section {
          background-color: #ffffff;
          color: #262626;
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        :global(.sticky-visual) {
          position: sticky;
          top: 0;
          width: 100%;
          height: 95vh;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 10;
        }
        :global(#section-2021) {
          border-top: 5px solid #ffffff;
        }
        :global(.matrix-visual-wrapper) {
          width: 100%;
          max-width: 1200px;
        }
        :global(.matrix-container) {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          background: #fde0ef;
          padding: 1.2rem;
          border: 4px solid #ffffff;
          box-sizing: border-box;
        }
        :global(h2.section-title) {
          text-align: center;
          text-transform: uppercase;
          font-size: 18px;
          margin-top: 0;
          margin-bottom: 1rem;
          background: #ffffff;
          color: black;
          padding: 0.5rem;
        }
        :global(.matrix-header),
        :global(.matrix-row),
        :global(.matrix-total) {
          display: grid;
          grid-template-columns: minmax(220px, 1.8fr) repeat(4, 1.2fr);
          gap: 0.75rem;
          align-items: center;
          padding: 0.25rem 0;
          border-bottom: 1px solid #ffffff;
          transition: opacity 0.3s ease;
        }
        :global(.matrix-header) {
          border-bottom: 3px solid #ffffff;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 11px;
          text-align: center;
        }
        :global(.header-jersey) {
          width: 32px;
          height: auto;
          margin: 0.2rem auto 0 auto;
          display: block;
        }
        :global(.col-name) {
          text-align: left;
          font-size: 11px;
          font-weight: 700;
        }
        :global(.col-metric) {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          min-width: 0;
        }
        :global(.bar-container) {
          flex-grow: 1;
          height: 14px;
          background: white;
          border: 1px solid black;
          position: relative;
          min-width: 30px;
        }
        :global(.inner-bar) {
          height: 100%;
        }
        :global(.inner-bar.pos) {
          background: #4d9221;
        }
        :global(.inner-bar.neg) {
          background: #c51b7d;
        }
        :global(.value-text) {
          font-size: 10px;
          width: 65px;
          flex-shrink: 0;
          text-align: right;
          font-family: monospace;
          font-weight: 600;
        }
        :global(.matrix-total) {
          border-top: 3px solid #ffffff;
          border-bottom: none;
          font-weight: bold;
          font-size: 11px;
        }
        :global(.total-text) {
          width: 100%;
          text-align: right;
          font-family: monospace;
          font-weight: bold;
          padding-right: 0.25rem;
        }
        :global(.matrix-row.dimmed) {
          opacity: 0.2;
        }
        :global(.narrative-track) {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          position: relative;
          z-index: 20;
          padding: 2vh 1rem 30vh 1rem;
          margin-top: -15vh;
          pointer-events: none;
        }
        :global(.matrix-step) {
          min-height: 75vh;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.15;
          transition:
            opacity 0.4s ease,
            transform 0.4s ease;
          transform: translateY(20px);
          pointer-events: auto;
        }
        :global(.matrix-step.active) {
          opacity: 1;
          transform: translateY(0);
        }
        :global(.matrix-card) {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(6px);
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 1.4rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
          width: 100%;
          text-align: left;
        }
        :global(.matrix-card-tag) {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          color: #4d9221;
          margin-bottom: 0.35rem;
          min-height: 1px;
        }
        :global(.matrix-card-title) {
          font-size: 1.1rem;
          font-weight: 700;
          color: #111111;
          margin: 0 0 0.5rem 0;
        }
        :global(.matrix-card-text) {
          font-size: 0.88rem;
          line-height: 1.6;
          color: #333333;
        }
      `}</style>
    </div>
  );
}
