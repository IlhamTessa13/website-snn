export interface WilliamsonPoint {
  year: number;
  iw: number;
}

export const williamsonData: WilliamsonPoint[] = [
  { year: 2016, iw: 0.654 },
  { year: 2017, iw: 0.652 },
  { year: 2018, iw: 0.647 },
  { year: 2019, iw: 0.645 },
  { year: 2020, iw: 0.692 },
  { year: 2021, iw: 0.689 },
  { year: 2022, iw: 0.686 },
  { year: 2023, iw: 0.684 },
  { year: 2024, iw: 0.682 },
  { year: 2025, iw: 0.677 },
];

export interface WilliamsonCallout {
  year: number;
  val: number;
  title: string;
  desc: string;
  w: number;
  h: number;
  dx: number;
  dy: number;
}

// Konfigurasi anotasi per step (index = data-step pada kartu narasi)
export const williamsonCallouts: Record<number, WilliamsonCallout> = {
  1: {
    year: 2017.5,
    val: 0.625,
    title: "PRA-PANDEMI (2016–2019)",
    desc: "Melandai lambat dari 0,654 → 0,645",
    w: 225,
    h: 44,
    dx: -112,
    dy: -45,
  },
  2: {
    year: 2020,
    val: 0.692,
    title: "PUNCAK KRISIS 2020 (0,692)",
    desc: "Kudus: Rp123,89 Jt • Grobogan: Rp19,70 Jt (Selisih: Rp104,19 Jt)",
    w: 365,
    h: 42,
    dx: -132,
    dy: -55,
  },
  3: {
    year: 2025,
    val: 0.662,
    title: "TITIK AKHIR 2025 (0,677)",
    desc: "Semarang: Rp167,24 Jt • Pemalang: Rp24,05 Jt (Selisih: Rp143,19 Jt)",
    w: 360,
    h: 42,
    dx: -230,
    dy: -50,
  },
};
