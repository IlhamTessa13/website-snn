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
export type MetricKey = "adhb" | "adhk";

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

/**
 * Model narasi (revisi 2):
 * - Satu rangkaian scroll LINEAR berisi 6 step: step 0–2 memaparkan ADHB,
 *   step 3–5 memaparkan ADHK. Tidak ada lagi cabang manual lewat tombol —
 *   metrik peta & badge ADHB/ADHK di atas peta otomatis "bertukar" begitu
 *   scroll memasuki step 3 (`step.metric` menentukan metrik aktif).
 * - `focus` tidak menyimpan teks callout siap-pakai (nilainya beda antara
 *   ADHB & ADHK); callout dihitung di komponen dari `valueOf()` sesuai
 *   `step.metric`.
 */

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
}

export interface NarrativeStep {
  /** Metrik yang aktif di peta & badge saat step ini masuk viewport. */
  metric: MetricKey;
  title: string;
  body: Segment[];
  focus: MapFocus[];
}

export const steps: NarrativeStep[] = [
  {
    metric: "adhb",
    title: "Sebaran Nilai Ekonomi Menurut Harga Berlaku",
    body: [
      {
        text: "Produk Domestik Regional Bruto Atas Dasar Harga Berlaku (ADHB) mengukur nilai tambah seluruh aktivitas ekonomi suatu wilayah pada tingkat harga yang berlaku di tahun observasi. ",
      },
      {
        text: "Peta di samping menyajikan sebaran nilai tersebut pada 35 kabupaten/kota se-Jawa Tengah tahun 2025, diklasifikasikan ke dalam enam kelas quantile.",
        bold: true,
      },
      {
        text: " Wilayah bergradasi hijau berada di atas rata-rata provinsi; wilayah bergradasi magenta berada jauh di bawahnya.",
      },
    ],
    focus: [],
  },
  {
    metric: "adhb",
    title: "Dua Kutub yang Berjauhan",
    body: [
      { text: "Pada indikator ADHB, " },
      {
        text: "Kota Semarang tercatat sebagai wilayah dengan nilai tertinggi, mencapai Rp288,05 triliun",
        tone: "green",
        region: "Kota Semarang",
        bold: true,
      },
      {
        text: " — ditopang struktur ekonominya sebagai pusat industri, perdagangan, dan jasa keuangan provinsi. Sebaliknya, ",
      },
      {
        text: "Kota Magelang mencatatkan nilai terendah, hanya Rp12,71 triliun",
        tone: "magenta",
        region: "Kota Magelang",
      },
      {
        text: " — konsekuensi logis dari luas wilayah administratifnya yang jauh lebih kecil dibanding 34 daerah lain.",
      },
    ],
    focus: [
      { region: "Kota Semarang", tone: "green" },
      { region: "Kota Magelang", tone: "magenta" },
    ],
  },
  {
    metric: "adhb",
    title: "Satu Sisi dari Cerita yang Utuh",
    body: [
      {
        text: "Nilai ADHB memotret skala ekonomi pada harga pasar tahun berjalan, sehingga turut memuat pengaruh inflasi antarwaktu dan antarwilayah. ",
      },
      {
        text: "Untuk menilai apakah pola ketimpangan ini murni cerminan aktivitas riil atau sekadar efek harga, perbandingan perlu dilakukan terhadap PDRB dengan basis harga konstan.",
        bold: true,
      },
      {
        text: " Gulir terus untuk melihat sebarannya menurut ADHK.",
      },
    ],
    focus: [],
  },
  {
    metric: "adhk",
    title: "Menyaring Pengaruh Inflasi",
    body: [
      {
        text: "Berbeda dengan ADHB, PDRB Atas Dasar Harga Konstan (ADHK) dihitung menggunakan harga tahun dasar 2010, sehingga pergerakan nilainya mencerminkan volume produksi riil — bukan kenaikan harga. ",
      },
      {
        text: "Peta di samping kini menampilkan sebaran ADHK 2025 untuk 35 kabupaten/kota, dengan skema klasifikasi enam kelas yang sama seperti sebelumnya.",
        bold: true,
      },
    ],
    focus: [],
  },
  {
    metric: "adhk",
    title: "Pola yang Bertahan",
    body: [
      { text: "Pada indikator ini, " },
      {
        text: "Kota Semarang tetap memimpin dengan Rp182,12 triliun",
        tone: "green",
        region: "Kota Semarang",
        bold: true,
      },
      { text: ", sementara " },
      {
        text: "Kota Magelang kembali berada di titik terendah, Rp8,13 triliun",
        tone: "magenta",
        region: "Kota Magelang",
      },
      {
        text: ". Posisi kedua wilayah tidak berubah dibandingkan ADHB — indikasi awal bahwa kesenjangan yang teramati bukan sekadar artefak harga.",
      },
    ],
    focus: [
      { region: "Kota Semarang", tone: "green" },
      { region: "Kota Magelang", tone: "magenta" },
    ],
  },
  {
    metric: "adhk",
    title: "Ketimpangan yang Konsisten",
    body: [
      {
        text: "Konsistensi peringkat wilayah pada kedua indikator — ADHB maupun ADHK — menegaskan bahwa ketimpangan ekonomi antarwilayah di Jawa Tengah bersifat struktural, bukan sekadar bias inflasi.",
        bold: true,
      },
      {
        text: " Kota Semarang unggul hampir di seluruh dimensi ekonomi, sementara wilayah dengan luas administratif terbatas seperti Kota Magelang secara konsisten tertinggal. Bagian selanjutnya menelusuri bagaimana laju pertumbuhan tahunan membentuk dinamika ini dari waktu ke waktu.",
      },
    ],
    focus: [],
  },
];
