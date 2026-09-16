/**
 * SECTION 1 — Peta Sebaran PDRB ADHB & ADHK Kabupaten/Kota se-Jawa Tengah (2025)
 *
 * SUMBER ANGKA
 * ------------
 * - `adhb` & `adhk`  : PDRB total 2025, diambil persis dari PDRB_ADHK_ADHB.xlsx (satuan miliar rupiah).
 * - `primer` / `sekunder` / `tersier` : NILAI SEKTORAL.
 *
 *   PENTING: file xlsx yang tersedia HANYA memuat PDRB total (2 baris), tidak memuat rincian
 *   sektoral per wilayah. Nilai sektoral di bawah ini hanya diisi untuk wilayah yang angkanya
 *   disebut eksplisit di dokumen brief (ekstrem + runner-up), ditambah wilayah yang nilainya
 *   bisa diturunkan secara aritmetis karena dua dari tiga sektornya sudah diketahui
 *   (mis. Kota Semarang & Kota Magelang: primer = total - sekunder - tersier).
 *
 *   Wilayah lain sengaja diberi nilai `null` — BUKAN angka tebakan. Komponen peta merender
 *   `null` sebagai abu netral ("data belum tersedia"). Begitu sheet sektoral tersedia,
 *   cukup isi angkanya di sini; tidak ada perubahan lain yang diperlukan.
 *
 * Klasifikasi sektor (sesuai brief):
 *   Primer   = A (Pertanian, Kehutanan, Perikanan) + B (Pertambangan)
 *   Sekunder = C (Industri) + D (Listrik & Gas) + E (Air/Limbah) + F (Konstruksi)
 *   Tersier  = G s.d. R,S,T,U (Perdagangan s.d. Jasa Lainnya)
 */
export type MetricKey = "adhb" | "adhk" ;

export interface RegionDatum {
  /** Nama kanonik yang dipakai di seluruh aplikasi. */
  name: string;
  type: "kabupaten" | "kota";
  /** PDRB total ADHB 2025, miliar rupiah. */
  adhb: number;
  /** PDRB total ADHK 2010 2025, miliar rupiah. */
  adhk: number;
  /** Sektor primer: [ADHB, ADHK] — null bila belum tersedia. */
  primer: [number | null, number | null];
  sekunder: [number | null, number | null];
  tersier: [number | null, number | null];
}

const NA: [null, null] = [null, null];

export const regions: RegionDatum[] = [
  {
    name: "Kab. Cilacap",
    type: "kabupaten",
    adhb: 142706.51,
    adhk: 108031.28,
    primer: [19746.28, null],
    sekunder: [88250.49, null],
    tersier: NA,
  },
  {
    name: "Kab. Banyumas",
    type: "kabupaten",
    adhb: 79803.56,
    adhk: 50668.64,
    primer: NA,
    sekunder: NA,
    tersier: [35291.23, null],
  },
  {
    name: "Kab. Purbalingga",
    type: "kabupaten",
    adhb: 36070.88,
    adhk: 21626.94,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Banjarnegara",
    type: "kabupaten",
    adhb: 31351.51,
    adhk: 19008.78,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Kebumen",
    type: "kabupaten",
    adhb: 41520.57,
    adhk: 25253.4,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Purworejo",
    type: "kabupaten",
    adhb: 26483.56,
    adhk: 16583.69,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Wonosobo",
    type: "kabupaten",
    adhb: 26743.57,
    adhk: 16924.73,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Magelang",
    type: "kabupaten",
    adhb: 46981.5,
    adhk: 29160.54,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Boyolali",
    type: "kabupaten",
    adhb: 48841.47,
    adhk: 28890.03,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Klaten",
    type: "kabupaten",
    adhb: 58434.97,
    adhk: 35131.44,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Sukoharjo",
    type: "kabupaten",
    adhb: 53489.29,
    adhk: 33951.06,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Wonogiri",
    type: "kabupaten",
    adhb: 42816.58,
    adhk: 26141.91,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Karanganyar",
    type: "kabupaten",
    adhb: 55089.0,
    adhk: 33709.11,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Sragen",
    type: "kabupaten",
    adhb: 56179.21,
    adhk: 33921.43,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Grobogan",
    type: "kabupaten",
    adhb: 40143.91,
    adhk: 24896.25,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Blora",
    type: "kabupaten",
    adhb: 35239.01,
    adhk: 20834.42,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Rembang",
    type: "kabupaten",
    adhb: 27709.76,
    adhk: 17185.84,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Pati",
    type: "kabupaten",
    adhb: 63627.13,
    adhk: 39038.28,
    primer: [15367.47, null],
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Kudus",
    type: "kabupaten",
    adhb: 132316.91,
    adhk: 75783.15,
    primer: NA,
    sekunder: [106584.29, null],
    tersier: NA,
  },
  {
    name: "Kab. Jepara",
    type: "kabupaten",
    adhb: 43448.83,
    adhk: 26869.08,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Demak",
    type: "kabupaten",
    adhb: 38778.51,
    adhk: 23439.71,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Semarang",
    type: "kabupaten",
    adhb: 70391.63,
    adhk: 43880.58,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Temanggung",
    type: "kabupaten",
    adhb: 31204.37,
    adhk: 18863.34,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Kendal",
    type: "kabupaten",
    adhb: 64590.8,
    adhk: 40192.08,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Batang",
    type: "kabupaten",
    adhb: 33370.61,
    adhk: 20159.94,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Pekalongan",
    type: "kabupaten",
    adhb: 32684.21,
    adhk: 20425.92,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Pemalang",
    type: "kabupaten",
    adhb: 37496.54,
    adhk: 23052.08,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Tegal",
    type: "kabupaten",
    adhb: 51416.47,
    adhk: 31211.27,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kab. Brebes",
    type: "kabupaten",
    adhb: 66309.53,
    adhk: 40655.22,
    primer: [22848.75, 12664.5],
    sekunder: NA,
    tersier: NA,
  },
  // Kota Magelang: 198.43 + 4151.10 + 8356.68 = 12706.21 ≈ total ADHB (konsisten dengan brief)
  {
    name: "Kota Magelang",
    type: "kota",
    adhb: 12706.22,
    adhk: 8125.78,
    primer: [198.43, 120.25],
    sekunder: [4151.1, 2414.26],
    tersier: [8356.68, 5591.28],
  },
  {
    name: "Kota Surakarta",
    type: "kota",
    adhb: 68789.17,
    adhk: 45304.55,
    primer: NA,
    sekunder: NA,
    tersier: [46278.53, null],
  },
  {
    name: "Kota Salatiga",
    type: "kota",
    adhb: 19384.47,
    adhk: 12198.74,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  // Kota Semarang primer = 288050.38 - 159478.48 - 126008.43 = 2563.47 (ADHB);
  //                        182122.11 - 90264.92 - 90430.90  = 1426.29 (ADHK)
  {
    name: "Kota Semarang",
    type: "kota",
    adhb: 288050.38,
    adhk: 182122.11,
    primer: [2563.47, 1426.29],
    sekunder: [159478.48, 90264.92],
    tersier: [126008.43, 90430.9],
  },
  {
    name: "Kota Pekalongan",
    type: "kota",
    adhb: 15901.56,
    adhk: 9455.38,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
  {
    name: "Kota Tegal",
    type: "kota",
    adhb: 22247.69,
    adhk: 13897.41,
    primer: NA,
    sekunder: NA,
    tersier: NA,
  },
];

/* ------------------------------------------------------------------ */
/* Metrik & akses nilai                                                */
/* ------------------------------------------------------------------ */

export interface MetricDef {
  key: MetricKey;
  label: string;
  /** Keterangan singkat di bawah legenda. */
  caption: string;
}

export const metrics: MetricDef[] = [
  {
    key: "adhb",
    label: "PDRB ADHB",
    caption: "PDRB total atas dasar harga berlaku, 2025",
  },
  {
    key: "adhk",
    label: "PDRB ADHK",
    caption: "PDRB total atas dasar harga konstan 2010, 2025",
  },
];

/** Ambil nilai sebuah wilayah untuk metrik tertentu. `null` = data belum tersedia. */
export function valueOf(r: RegionDatum, metric: MetricKey): number | null {
  switch (metric) {
    case "adhb":
      return r.adhb;
    case "adhk":
      return r.adhk;
  }
}

/* ------------------------------------------------------------------ */
/* Narasi scrollytelling                                               */
/* ------------------------------------------------------------------ */

/** Warna highlight inline, sesuai tabel "Ringkasan Aturan Warna Highlight" di brief. */
export type HighlightTone = "green" | "magenta" | "orange" | "red";

export interface Segment {
  text: string;
  /** Latar + warna teks highlight. */
  tone?: HighlightTone;
  /** Bila diisi, segmen jadi inline clickable term yang menyorot wilayah ini di peta. */
  region?: string;
  /** Kalimat kunci step — di-bold penuh. Tepat satu per step. */
  bold?: boolean;
}

export interface MapFocus {
  region: string;
  tone: HighlightTone;
  /** Teks callout di atas wilayah pada peta. */
  callout: string;
}

export interface StoryStep {
  /** Metrik yang otomatis aktif saat step ini masuk viewport. */
  metric: MetricKey;
  eyebrow: string;
  title: string;
  body: Segment[];
  focus: MapFocus[];
  /** Step penutup: lima wilayah kunci berkedip bergantian. */
  cycle?: string[];
}

export const storySteps: StoryStep[] = [
  {
    metric: "adhb",
    eyebrow: "Step 0",
    title: "35 wilayah, satu provinsi",
    body: [
      {
        text: "Provinsi Jawa Tengah terdiri atas 35 kabupaten dan kota dengan karakteristik ekonomi yang sangat beragam. ",
      },
      {
        text: "Peta di samping menunjukkan sebaran nilai PDRB Atas Dasar Harga Berlaku (ADHB) tahun 2025 di setiap wilayah — semakin gelap warnanya, semakin besar kontribusi ekonominya terhadap provinsi.",
        bold: true,
      },
    ],
    focus: [],
  },
  {
    metric: "adhb",
    eyebrow: "",
    title: "Ekstrem PDRB ADHB",
    body: [
      {
        text: "Dari sisi Produk Domestik Regional Bruto Atas Dasar Harga Berlaku, ",
      },
      {
        text: "Kota Semarang mencatatkan PDRB tertinggi se-Jawa Tengah, mencapai Rp288,05 triliun pada 2025",
        tone: "green",
        region: "Kota Semarang",
        bold: true,
      },
      {
        text: " — didukung kuat oleh sektor industri, perdagangan, dan jasa keuangan sebagai ibu kota provinsi. Di ujung yang berlawanan, ",
      },
      {
        text: "Kota Magelang mencatatkan PDRB terendah, hanya Rp12,71 triliun",
        tone: "magenta",
        region: "Kota Magelang",
      },
      {
        text: ", wajar mengingat luas wilayahnya yang jauh lebih kecil dibanding kabupaten lain.",
      },
    ],
    focus: [
      { region: "Kota Semarang", tone: "green", callout: "Rp288,05 triliun" },
      { region: "Kota Magelang", tone: "magenta", callout: "Rp12,71 triliun" },
    ],
  },
  {
    metric: "adhk",
    eyebrow: "",
    title: "Ekstrem PDRB ADHK",
    body: [
      {
        text: "Pola yang sama terlihat pada PDRB Atas Dasar Harga Konstan (ADHK), yang mencerminkan pertumbuhan riil tanpa pengaruh inflasi. ",
      },
      {
        text: "Kota Semarang tetap memimpin dengan Rp182,12 triliun",
        tone: "green",
        region: "Kota Semarang",
      },
      { text: ", sementara " },
      {
        text: "Kota Magelang berada di posisi terendah dengan Rp8,13 triliun",
        tone: "magenta",
        region: "Kota Magelang",
      },
      { text: ". " },
      {
        text: "Konsistensi posisi ini di kedua indikator menunjukkan bahwa ketimpangan struktur ekonomi antarwilayah bukan sekadar efek harga, melainkan memang mencerminkan perbedaan riil dalam skala aktivitas ekonomi.",
        bold: true,
      },
    ],
    focus: [
      { region: "Kota Semarang", tone: "green", callout: "Rp182,12 triliun" },
      { region: "Kota Magelang", tone: "magenta", callout: "Rp8,13 triliun" },
    ],
  },
  
  {
    metric: "adhb",
    eyebrow: "",
    title: "Sintesis",
    body: [
      {
        text: "Peta ini menegaskan bahwa ketimpangan ekonomi Jawa Tengah tidak berdiri di satu dimensi saja.",
        bold: true,
      },
      { text: " " },
      {
        text: "Kota Semarang unggul hampir di semua lini",
        tone: "green",
        region: "Kota Semarang",
      },
      {
        text: " — total, sekunder, maupun tersier — sementara keunggulan sektor primer justru berpindah ke kabupaten agraris seperti ",
      },
      { text: "Brebes", tone: "orange", region: "Kab. Brebes" },
      { text: ", " },
      { text: "Cilacap", tone: "orange", region: "Kab. Cilacap" },
      { text: ", dan " },
      { text: "Pati", tone: "orange", region: "Kab. Pati" },
      { text: ". " },
      { text: "Kota Magelang", tone: "magenta", region: "Kota Magelang" },
      {
        text: ", dengan wilayah terkecil, konsisten berada di posisi terendah di seluruh kategori. Pertanyaannya: seberapa jauh kesenjangan antarwilayah ini jika dibandingkan langsung dengan rata-rata provinsi? Gulir ke bawah untuk melihatnya.",
      },
    ],
    focus: [],
    cycle: [
      "Kota Semarang",
      "Kab. Kudus",
      "Kab. Cilacap",
      "Kab. Brebes",
      "Kota Magelang",
    ],
  },
];
