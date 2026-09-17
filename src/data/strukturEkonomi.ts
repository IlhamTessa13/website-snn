// src/data/strukturEkonomi.ts

export type SektorData = {
  code: string;
  name: string;
  values: { [year: number]: number };
};

export type HierarchyData = {
  name: string;
  color?: string;
  code?: string;
  value?: number;
  children?: HierarchyData[];
};

export const dataLapanganUsaha: SektorData[] = [
  {
    code: "A",
    name: "Pertanian, Kehutanan, Perikanan",
    values: { 2016: 15.13, 2020: 14.3, 2025: 13.07 },
  },
  {
    code: "B",
    name: "Pertambangan dan Penggalian",
    values: { 2016: 2.53, 2020: 2.45, 2025: 2.09 },
  },
  {
    code: "C",
    name: "Industri Pengolahan",
    values: { 2016: 34.69, 2020: 34.44, 2025: 33.39 },
  },
  {
    code: "D",
    name: "Pengadaan Listrik dan Gas",
    values: { 2016: 0.09, 2020: 0.1, 2025: 0.09 },
  },
  {
    code: "E",
    name: "Pengadaan Air, Sampah, Limbah & Daur Ulang",
    values: { 2016: 0.06, 2020: 0.06, 2025: 0.06 },
  },
  {
    code: "F",
    name: "Konstruksi",
    values: { 2016: 10.29, 2020: 10.56, 2025: 11.47 },
  },
  {
    code: "G",
    name: "Perdagangan Besar & Eceran; Reparasi Mobil/Motor",
    values: { 2016: 13.48, 2020: 13.5, 2025: 13.49 },
  },
  {
    code: "H",
    name: "Transportasi dan Pergudangan",
    values: { 2016: 3.11, 2020: 2.24, 2025: 4.13 },
  },
  {
    code: "I",
    name: "Penyediaan Akomodasi dan Makan Minum",
    values: { 2016: 3.1, 2020: 2.99, 2025: 3.74 },
  },
  {
    code: "J",
    name: "Informasi dan Komunikasi",
    values: { 2016: 3.04, 2020: 4.26, 2025: 4.29 },
  },
  {
    code: "K",
    name: "Jasa Keuangan dan Asuransi",
    values: { 2016: 2.93, 2020: 2.99, 2025: 2.81 },
  },
  {
    code: "L",
    name: "Real Estat",
    values: { 2016: 1.67, 2020: 1.71, 2025: 1.6 },
  },
  {
    code: "M,N",
    name: "Jasa Perusahaan",
    values: { 2016: 0.36, 2020: 0.4, 2025: 0.44 },
  },
  {
    code: "O",
    name: "Administrasi Pemerintahan & Jaminan Sosial",
    values: { 2016: 2.87, 2020: 2.71, 2025: 2.36 },
  },
  {
    code: "P",
    name: "Jasa Pendidikan",
    values: { 2016: 4.27, 2020: 4.74, 2025: 4.37 },
  },
  {
    code: "Q",
    name: "Jasa Kesehatan dan Kegiatan Sosial",
    values: { 2016: 0.86, 2020: 1.01, 2025: 0.93 },
  },
  {
    code: "R,S,T,U",
    name: "Jasa Lainnya",
    values: { 2016: 1.52, 2020: 1.53, 2025: 1.7 },
  },
];
export const getHierarchicalData = (year: number): HierarchyData =>  {
  return {
    name: "PDRB Jateng",
    children: [
      {
        name: "Primer",
        color: "#65A30D",
        children: dataLapanganUsaha
          .filter((d) => ["A", "B"].includes(d.code))
          .map((d) => ({ ...d, value: d.values[year] })),
      },
      {
        name: "Sekunder",
        color: "#F97316",
        children: dataLapanganUsaha
          .filter((d) => ["C", "D", "E", "F"].includes(d.code))
          .map((d) => ({ ...d, value: d.values[year] })),
      },
      {
        name: "Tersier",
        color: "#c51b7d",
        children: dataLapanganUsaha
          .filter((d) => !["A", "B", "C", "D", "E", "F"].includes(d.code))
          .map((d) => ({ ...d, value: d.values[year] })),
      },
    ],
  };
};

export const narrativeSteps = [
  {
    title: "Tiga Pilar Utama Ekonomi",
    text: "Setiap kegiatan ekonomi di Jawa Tengah dapat dikelompokkan ke dalam tiga kategori besar: sektor Primer (pertanian & tambang), Sekunder (industri & konstruksi), dan Tersier (jasa & perdagangan). Diagram di samping menunjukkan bagaimana ketiganya menyusun 100% PDRB provinsi pada tahun 2016.",
  },
  {
    title: "Tulang Punggung Industri",
    text: "Industri Pengolahan adalah tulang punggung ekonomi Jawa Tengah, menyumbang 34,69% dari seluruh PDRB pada 2016 — lebih dari sepertiga provinsi. Di bawahnya, sektor Pertanian (15,13%) dan Perdagangan (13,48%) melengkapi tiga besar lapangan usaha.",
  },
  {
    title: "Stabilitas Sekunder",
    text: "Sepuluh tahun kemudian, struktur besar ekonomi Jawa Tengah relatif tidak berubah. Sektor Sekunder tetap menjadi kontributor terbesar dengan 45,01% pada 2025 — nyaris sama dengan 45,13% di tahun 2016 — menegaskan posisinya sebagai fondasi ekonomi provinsi selama satu dekade terakhir.",
  },
  {
    title: "Penyusutan Sektor Primer",
    text: "Di sisi lain, sektor Primer terus menyusut — dari 17,66% pada 2016 menjadi hanya 15,16% pada 2025. Penyusutan ini terutama didorong oleh menurunnya porsi sektor Pertanian, dari 15,13% menjadi 13,07%, seiring alih fungsi lahan dan pergeseran tenaga kerja ke sektor non-pertanian.",
  },
  {
    title: "Akselerasi Digitalisasi",
    text: "Sebaliknya, sektor Tersier tumbuh signifikan dari 37,21% menjadi 39,86%. Pendorong utamanya adalah Informasi dan Komunikasi, yang porsinya melonjak dari 3,04% menjadi 4,29% — lebih dari 40% pertumbuhan relatif — seiring akselerasi digitalisasi sejak pandemi. Transportasi dan Pergudangan juga tumbuh dari 3,11% menjadi 4,13%.",
  },
  {
    title: "Dinamika Konstruksi",
    text: "Menariknya, di dalam sektor Sekunder sendiri terjadi pergeseran halus: porsi Industri Pengolahan sedikit melandai dari 34,69% ke 33,39%, sementara Konstruksi justru naik dari 10,29% menjadi 11,47% — didorong pembangunan infrastruktur jalan tol dan properti di berbagai wilayah.",
  },
  {
    title: "Transformasi Struktural",
    text: "Selama sepuluh tahun terakhir, ekonomi Jawa Tengah mengalami transformasi struktural yang halus namun konsisten: peran sektor Primer terus mengecil, sektor Tersier terus membesar, sementara Sekunder — ditopang Industri Pengolahan dan Konstruksi — tetap menjadi fondasi utama yang stabil. Gulir ke bawah untuk melanjutkan.",
  },
];
