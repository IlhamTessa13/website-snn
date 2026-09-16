export interface PdrbPerKapitaItem {
  name: string;
  adhb: number;
  adhk: number;
  pdrbAdhb: number;
  pdrbAdhk: number;
  type: 'kabupaten' | 'kota';
}

export const pdrbPerKapitaData: PdrbPerKapitaItem[] = [
  { name: "Kota Semarang", adhb: 288050.38, adhk: 182122.11, pdrbAdhb: 167236, pdrbAdhk: 105736.12, type: "kota" },
  { name: "Kab. Kudus", adhb: 132316.91, adhk: 75783.15, pdrbAdhb: 148384, pdrbAdhk: 84985.26, type: "kabupaten" },
  { name: "Kota Surakarta", adhb: 68789.17, adhk: 45304.55, pdrbAdhb: 130017, pdrbAdhk: 85629.08, type: "kota" },
  { name: "Kota Magelang", adhb: 12706.22, adhk: 8125.78, pdrbAdhb: 103577, pdrbAdhk: 66238.84, type: "kota" },
  { name: "Kota Salatiga", adhb: 19384.47, adhk: 12198.74, pdrbAdhb: 95230, pdrbAdhk: 59928.75, type: "kota" },
  { name: "Kota Tegal", adhb: 22247.69, adhk: 13897.41, pdrbAdhb: 77030, pdrbAdhk: 48118.38, type: "kota" },
  { name: "Kab. Cilacap", adhb: 142706.51, adhk: 108031.28, pdrbAdhb: 69736, pdrbAdhk: 52791.1, type: "kabupaten" },
  { name: "Kab. Semarang", adhb: 70391.63, adhk: 43880.58, pdrbAdhb: 64076, pdrbAdhk: 39943.29, type: "kabupaten" },
  { name: "Kab. Kendal", adhb: 64590.8, adhk: 40192.08, pdrbAdhb: 60002, pdrbAdhk: 37336.48, type: "kabupaten" },
  { name: "Kab. Karanganyar", adhb: 55089.0, adhk: 33709.11, pdrbAdhb: 56882, pdrbAdhk: 34806.05, type: "kabupaten" },
  { name: "Kab. Sukoharjo", adhb: 53489.29, adhk: 33951.06, pdrbAdhb: 56279, pdrbAdhk: 35722.01, type: "kabupaten" },
  { name: "Kab. Sragen", adhb: 56179.21, adhk: 33921.43, pdrbAdhb: 55523, pdrbAdhk: 33525.03, type: "kabupaten" },
  { name: "Kota Pekalongan", adhb: 15901.56, adhk: 9455.38, pdrbAdhb: 48994, pdrbAdhk: 29132.56, type: "kota" },
  { name: "Kab. Pati", adhb: 63627.13, adhk: 39038.28, pdrbAdhb: 46043, pdrbAdhk: 28249.47, type: "kabupaten" },
  { name: "Kab. Klaten", adhb: 58434.97, adhk: 35131.44, pdrbAdhb: 44917, pdrbAdhk: 27004.66, type: "kabupaten" },
  { name: "Kab. Boyolali", adhb: 48841.47, adhk: 28890.03, pdrbAdhb: 44028, pdrbAdhk: 26042.73, type: "kabupaten" },
  { name: "Kab. Banyumas", adhb: 79803.56, adhk: 50668.64, pdrbAdhb: 42784, pdrbAdhk: 27164.24, type: "kabupaten" },
  { name: "Kab. Rembang", adhb: 27709.76, adhk: 17185.84, pdrbAdhb: 41352, pdrbAdhk: 25646.87, type: "kabupaten" },
  { name: "Kab. Wonogiri", adhb: 42816.58, adhk: 26141.91, pdrbAdhb: 40506, pdrbAdhk: 24731.12, type: "kabupaten" },
  { name: "Kab. Batang", adhb: 33370.61, adhk: 20159.94, pdrbAdhb: 39390, pdrbAdhk: 23796.67, type: "kabupaten" },
  { name: "Kab. Blora", adhb: 35239.01, adhk: 20834.42, pdrbAdhb: 38547, pdrbAdhk: 22790.48, type: "kabupaten" },
  { name: "Kab. Temanggung", adhb: 31204.37, adhk: 18863.34, pdrbAdhb: 38002, pdrbAdhk: 22972.76, type: "kabupaten" },
  { name: "Kab. Jepara", adhb: 43448.83, adhk: 26869.08, pdrbAdhb: 34918, pdrbAdhk: 21593.48, type: "kabupaten" },
  { name: "Kab. Magelang", adhb: 46981.5, adhk: 29160.54, pdrbAdhb: 34751, pdrbAdhk: 21569.21, type: "kabupaten" },
  { name: "Kab. Purbalingga", adhb: 36070.88, adhk: 21626.94, pdrbAdhb: 34427, pdrbAdhk: 20641.22, type: "kabupaten" },
  { name: "Kab. Purworejo", adhb: 26483.56, adhk: 16583.69, pdrbAdhb: 33035, pdrbAdhk: 20686.43, type: "kabupaten" },
  { name: "Kab. Pekalongan", adhb: 32684.21, adhk: 20425.92, pdrbAdhb: 31722, pdrbAdhk: 19824.4, type: "kabupaten" },
  { name: "Kab. Brebes", adhb: 66309.53, adhk: 40655.22, pdrbAdhb: 31768, pdrbAdhk: 19477.13, type: "kabupaten" },
  { name: "Kab. Demak", adhb: 38778.51, adhk: 23439.71, pdrbAdhb: 30654, pdrbAdhk: 18528.64, type: "kabupaten" },
  { name: "Kab. Tegal", adhb: 51416.47, adhk: 31211.27, pdrbAdhb: 30348, pdrbAdhk: 18422.05, type: "kabupaten" },
  { name: "Kab. Banjarnegara", adhb: 31351.51, adhk: 19008.78, pdrbAdhb: 29366, pdrbAdhk: 17805.06, type: "kabupaten" },
  { name: "Kab. Kebumen", adhb: 41520.57, adhk: 25253.4, pdrbAdhb: 28999, pdrbAdhk: 17637.8, type: "kabupaten" },
  { name: "Kab. Wonosobo", adhb: 26743.57, adhk: 16924.73, pdrbAdhb: 28721, pdrbAdhk: 18176.32, type: "kabupaten" },
  { name: "Kab. Grobogan", adhb: 40143.91, adhk: 24896.25, pdrbAdhb: 26421, pdrbAdhk: 16385.77, type: "kabupaten" },
  { name: "Kab. Pemalang", adhb: 37496.54, adhk: 23052.08, pdrbAdhb: 24047, pdrbAdhk: 14783.55, type: "kabupaten" },
];

// Sorted by pdrbAdhb descending (already sorted above)
export const sortedByAdhb = [...pdrbPerKapitaData].sort((a, b) => b.pdrbAdhb - a.pdrbAdhb);

// Narrative groups for scroll-driven highlighting
export const narrativeGroups = [
  {
    title: "Pusat Ekonomi: Kota-Kota Besar",
    regions: ["Kota Semarang", "Kota Surakarta", "Kota Magelang", "Kota Salatiga", "Kota Tegal", "Kota Pekalongan"],
    text: "Kota-kota besar di Jawa Tengah mendominasi PDRB per kapita tertinggi. Kota Semarang memimpin dengan Rp167,2 juta (ADHB), mencerminkan konsentrasi aktivitas ekonomi urban — sektor jasa, perdagangan, dan industri. Disparitas tajam terlihat ketika dibandingkan dengan kabupaten-kabupaten pedesaan.",
  },
  {
    title: "Kabupaten Industri & Sumber Daya",
    regions: ["Kab. Kudus", "Kab. Cilacap", "Kab. Kendal", "Kab. Semarang", "Kab. Karanganyar", "Kab. Sukoharjo"],
    text: "Kabupaten dengan basis industri kuat menunjukkan PDRB per kapita di atas rata-rata. Kudus (Rp148,4 juta) didorong oleh industri rokok dan manufaktur. Cilacap (Rp69,7 juta) ditopang oleh kilang minyak Pertamina dan industri berat. Kendal dan Semarang menikmati spillover ekonomi dari Kota Semarang.",
  },
  {
    title: "Wilayah Menengah: Potensi Berkembang",
    regions: ["Kab. Sragen", "Kab. Pati", "Kab. Klaten", "Kab. Boyolali", "Kab. Banyumas", "Kab. Wonogiri"],
    text: "Kelompok kabupaten ini memiliki PDRB per kapita pada rentang Rp40–56 juta. Banyumas sebagai pusat pertumbuhan baru (koridor selatan) dan Boyolali dengan sektor peternakan susu menunjukkan potensi peningkatan yang signifikan dalam beberapa tahun ke depan.",
  },
  {
    title: "Wilayah Tertinggal: Tantangan Pembangunan",
    regions: ["Kab. Pemalang", "Kab. Grobogan", "Kab. Wonosobo", "Kab. Kebumen", "Kab. Banjarnegara", "Kab. Brebes", "Kab. Tegal", "Kab. Demak"],
    text: "Kabupaten-kabupaten dengan PDRB per kapita terendah (di bawah Rp32 juta) umumnya bergantung pada sektor pertanian tradisional dan memiliki jumlah penduduk besar. Pemalang (Rp24 juta) menjadi yang terendah — hampir 7x lipat lebih rendah dari Kota Semarang, menggarisbawahi ketimpangan struktural yang mendalam.",
  },
];
