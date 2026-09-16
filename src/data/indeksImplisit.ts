export interface IndeksImplisitRow {
  kode: string;
  lapanganUsaha: string;
  values: Record<number, number>;
}

export const indeksImplisitData: IndeksImplisitRow[] = [
  { kode: "A", lapanganUsaha: "Pertanian, Kehutanan, dan Perikanan", values: { 2016: 2.40, 2017: 0.77, 2018: 2.96, 2019: 1.92, 2020: 2.17, 2021: 0.46, 2022: 4.38, 2023: 5.31, 2024: 4.01, 2025: 1.97 } },
  { kode: "B", lapanganUsaha: "Pertambangan dan Penggalian", values: { 2016: -0.57, 2017: 3.65, 2018: 5.37, 2019: 0.96, 2020: -1.12, 2021: 5.81, 2022: 9.86, 2023: -0.45, 2024: 0.39, 2025: 0.86 } },
  { kode: "C", lapanganUsaha: "Industri Pengolahan", values: { 2016: 2.18, 2017: 3.06, 2018: 3.14, 2019: 2.15, 2020: 3.13, 2021: 2.35, 2022: 4.55, 2023: 4.44, 2024: 2.98, 2025: 1.65 } },
  { kode: "D", lapanganUsaha: "Pengadaan Listrik dan Gas", values: { 2016: 4.27, 2017: 8.45, 2018: 3.09, 2019: 0.15, 2020: -0.61, 2021: -0.44, 2022: 0.60, 2023: 1.85, 2024: 1.16, 2025: 0.40 } },
  { kode: "E", lapanganUsaha: "Pengadaan Air, Sampah, Limbah & Daur Ulang", values: { 2016: 2.00, 2017: 0.64, 2018: 0.35, 2019: 1.83, 2020: 5.81, 2021: 0.14, 2022: 1.24, 2023: 1.08, 2024: 5.35, 2025: 3.46 } },
  { kode: "F", lapanganUsaha: "Konstruksi", values: { 2016: 1.57, 2017: 2.57, 2018: 4.41, 2019: 3.01, 2020: 0.38, 2021: 4.56, 2022: 6.61, 2023: 3.82, 2024: 0.90, 2025: 0.96 } },
  { kode: "G", lapanganUsaha: "Perdagangan Besar dan Eceran", values: { 2016: 2.69, 2017: 2.67, 2018: 2.66, 2019: 2.08, 2020: 1.06, 2021: 1.68, 2022: 4.33, 2023: 3.51, 2024: 2.06, 2025: 1.99 } },
  { kode: "H", lapanganUsaha: "Transportasi dan Pergudangan", values: { 2016: 1.32, 2017: 1.49, 2018: 0.98, 2019: 2.07, 2020: 1.81, 2021: 2.19, 2022: 7.31, 2023: 8.71, 2024: 1.66, 2025: 1.24 } },
  { kode: "I", lapanganUsaha: "Penyediaan Akomodasi dan Makan Minum", values: { 2016: 2.28, 2017: 0.50, 2018: 1.43, 2019: 1.29, 2020: 0.51, 2021: 3.42, 2022: 2.17, 2023: 1.10, 2024: 1.94, 2025: 1.34 } },
  { kode: "J", lapanganUsaha: "Informasi dan Komunikasi", values: { 2016: 0.10, 2017: 4.75, 2018: -0.33, 2019: 1.05, 2020: 0.14, 2021: 1.98, 2022: 0.12, 2023: 0.30, 2024: 0.86, 2025: 0.25 } },
  { kode: "K", lapanganUsaha: "Jasa Keuangan dan Asuransi", values: { 2016: 2.72, 2017: 4.34, 2018: 3.52, 2019: 1.55, 2020: 0.03, 2021: 4.53, 2022: 8.21, 2023: 2.48, 2024: 1.00, 2025: 1.82 } },
  { kode: "L", lapanganUsaha: "Real Estat", values: { 2016: 1.58, 2017: 2.52, 2018: 2.41, 2019: 1.25, 2020: 0.67, 2021: 2.03, 2022: 1.85, 2023: 1.10, 2024: 0.53, 2025: 0.86 } },
  { kode: "M,N", lapanganUsaha: "Jasa Perusahaan", values: { 2016: 3.74, 2017: 3.79, 2018: 2.72, 2019: 2.90, 2020: 2.19, 2021: 2.11, 2022: 4.61, 2023: 3.74, 2024: 2.06, 2025: 1.92 } },
  { kode: "O", lapanganUsaha: "Administrasi Pemerintahan", values: { 2016: 5.48, 2017: 3.27, 2018: 1.12, 2019: 1.37, 2020: 1.40, 2021: -0.83, 2022: 2.62, 2023: 2.11, 2024: 2.17, 2025: 1.47 } },
  { kode: "P", lapanganUsaha: "Jasa Pendidikan", values: { 2016: 3.06, 2017: 4.12, 2018: 2.15, 2019: 1.83, 2020: 2.60, 2021: 1.38, 2022: 0.77, 2023: 1.02, 2024: 2.10, 2025: 2.08 } },
  { kode: "Q", lapanganUsaha: "Jasa Kesehatan dan Kegiatan Sosial", values: { 2016: 0.80, 2017: 1.49, 2018: 1.10, 2019: 1.94, 2020: 2.83, 2021: 1.68, 2022: 1.48, 2023: 2.23, 2024: 1.66, 2025: 1.81 } },
  { kode: "R,S,T,U", lapanganUsaha: "Jasa Lainnya", values: { 2016: 3.91, 2017: 1.54, 2018: 0.95, 2019: 0.69, 2020: 1.29, 2021: 2.07, 2022: 4.16, 2023: 3.09, 2024: 2.30, 2025: 3.19 } },
];

// PDRB total line for the main chart
export const pdrbTotalImplisit: Record<number, number> = {
  2016: 2.19, 2017: 2.47, 2018: 2.70, 2019: 1.86, 2020: 1.74, 2021: 2.12, 2022: 4.27, 2023: 3.56, 2024: 2.18, 2025: 1.45
};

export const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

export const narrativeSteps = [
  {
    yearRange: [2016, 2018] as [number, number],
    title: "Inflasi & Harga Relatif Stabil",
    subtitle: "2016–2018",
    text: "Pada periode 2016 hingga 2018, laju indeks implisit (yang mencerminkan pergerakan harga agregat dalam PDRB) bergerak stabil dengan tren perlahan naik, mencapai 2.70% pada 2018.",
  },
  {
    yearRange: [2019, 2020] as [number, number],
    title: "Tekanan Pandemi & Deflasi Sektoral",
    subtitle: "2019–2020",
    text: "Memasuki 2019 dan puncaknya pada 2020 akibat pandemi, pergerakan harga tertahan. Laju indeks implisit turun menjadi 1.74%, dengan sektor Pertambangan bahkan mencatatkan deflasi implisit (-1.12%).",
  },
  {
    yearRange: [2021, 2022] as [number, number],
    title: "Kejutan Pasca-Pandemi (Rebound)",
    subtitle: "2021–2022",
    text: "Pemulihan ekonomi memicu lonjakan harga. Pada 2022, laju indeks implisit melompat tajam ke 4.27%, didorong oleh sektor Pertambangan (9.86%) dan Transportasi (7.31%) seiring krisis rantai pasok global.",
  },
  {
    yearRange: [2023, 2025] as [number, number],
    title: "Normalisasi & Pendinginan Harga",
    subtitle: "2023–2025",
    text: "Setelah lonjakan, pergerakan harga kembali mengalami normalisasi. Menuju 2025, laju indeks implisit mendingin secara bertahap hingga menyentuh 1.45%, mengindikasikan stabilisasi harga di tingkat regional.",
  },
];
