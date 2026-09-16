export type Quadrant = "I" | "II" | "III" | "IV";

export interface KlassenRaw {
  id: string;
  name: string;
  /** Periode 1 (2016–2020): PDRB per kapita (juta Rp) & pertumbuhan (%) */
  x1: number;
  y1: number;
  /** Periode 2 (2021–2025) */
  x2: number;
  y2: number;
}

export interface KlassenItem extends KlassenRaw {
  q1: Quadrant;
  q2: Quadrant;
}

/** Rata-rata provinsi sebagai garis pembatas kuadran. */
export const refThresholds = {
  p1: { x: 35.86, y: 3.7 },
  p2: { x: 44.91, y: 4.79 },
};

export const quadColors: Record<Quadrant, string> = {
  I: "#4d9221", // Kanan atas — Maju & Cepat
  II: "#c51b7d", // Kiri atas — Berkembang Cepat
  III: "#e9a3c9", // Kanan bawah — Maju Tertekan
  IV: "#a1d76a", // Kiri bawah — Relatif Tertinggal
};

export const quadLabels: Record<Quadrant, string> = {
  I: "Kuadran I: Maju & Cepat",
  II: "Kuadran II: Berkembang Cepat",
  III: "Kuadran III: Maju Tertekan",
  IV: "Kuadran IV: Relatif Tertinggal",
};

export function calculateQuadrant(
  x: number,
  y: number,
  refX: number,
  refY: number,
): Quadrant {
  if (x >= refX && y >= refY) return "I";
  if (x < refX && y >= refY) return "II";
  if (x >= refX && y < refY) return "III";
  return "IV";
}

const rawKlassenData: KlassenRaw[] = [
  { id: "33-01", name: "Cilacap", x1: 60.593, y1: 0.53, x2: 63.908, y2: 3.73 },
  { id: "33-02", name: "Banyumas", x1: 28.969, y1: 4.7, x2: 37.426, y2: 5.31 },
  {
    id: "33-03",
    name: "Purbalingga",
    x1: 24.499,
    y1: 4.02,
    x2: 30.324,
    y2: 4.71,
  },
  {
    id: "33-04",
    name: "Banjarnegara",
    x1: 21.207,
    y1: 4.21,
    x2: 25.879,
    y2: 4.79,
  },
  { id: "33-05", name: "Kebumen", x1: 21.018, y1: 3.96, x2: 25.446, y2: 5.28 },
  {
    id: "33-06",
    name: "Purworejo",
    x1: 23.665,
    y1: 3.92,
    x2: 29.262,
    y2: 4.77,
  },
  { id: "33-07", name: "Wonosobo", x1: 21.604, y1: 3.7, x2: 25.595, y2: 4.53 },
  { id: "33-08", name: "Magelang", x1: 23.42, y1: 3.96, x2: 30.479, y2: 4.99 },
  { id: "33-09", name: "Boyolali", x1: 30.051, y1: 4.32, x2: 38.687, y2: 5.21 },
  { id: "33-10", name: "Klaten", x1: 30.757, y1: 4.06, x2: 39.489, y2: 5.04 },
  { id: "33-11", name: "Sukoharjo", x1: 38.081, y1: 4.3, x2: 49.621, y2: 4.99 },
  { id: "33-12", name: "Wonogiri", x1: 27.518, y1: 3.94, x2: 34.983, y2: 4.92 },
  {
    id: "33-13",
    name: "Karanganyar",
    x1: 38.155,
    y1: 4.21,
    x2: 49.292,
    y2: 5.25,
  },
  { id: "33-14", name: "Sragen", x1: 38.297, y1: 4.32, x2: 48.375, y2: 5.17 },
  { id: "33-15", name: "Grobogan", x1: 18.083, y1: 4.0, x2: 23.159, y2: 5.14 },
  { id: "33-16", name: "Blora", x1: 26.947, y1: 6.68, x2: 35.043, y2: 3.57 },
  { id: "33-17", name: "Rembang", x1: 27.383, y1: 4.37, x2: 36.271, y2: 5.09 },
  { id: "33-18", name: "Pati", x1: 31.162, y1: 4.3, x2: 40.157, y2: 5.05 },
  { id: "33-19", name: "Kudus", x1: 119.725, y1: 1.79, x2: 138.406, y2: 1.33 },
  { id: "33-20", name: "Jepara", x1: 22.628, y1: 4.08, x2: 30.946, y2: 5.08 },
  { id: "33-21", name: "Demak", x1: 20.86, y1: 4.29, x2: 26.599, y2: 5.0 },
  { id: "33-22", name: "Semarang", x1: 43.762, y1: 3.87, x2: 56.539, y2: 4.81 },
  {
    id: "33-23",
    name: "Temanggung",
    x1: 26.004,
    y1: 3.62,
    x2: 33.214,
    y2: 4.85,
  },
  { id: "33-24", name: "Kendal", x1: 40.14, y1: 4.26, x2: 51.714, y2: 5.72 },
  { id: "33-25", name: "Batang", x1: 25.889, y1: 4.08, x2: 33.789, y2: 6.05 },
  {
    id: "33-26",
    name: "Pekalongan",
    x1: 23.213,
    y1: 3.97,
    x2: 27.997,
    y2: 4.95,
  },
  { id: "33-27", name: "Pemalang", x1: 17.593, y1: 4.38, x2: 21.254, y2: 4.89 },
  { id: "33-28", name: "Tegal", x1: 22.05, y1: 4.18, x2: 26.769, y2: 4.97 },
  { id: "33-29", name: "Brebes", x1: 23.302, y1: 4.26, x2: 28.207, y2: 4.46 },
  {
    id: "33-71",
    name: "Kota Magelang",
    x1: 86.411,
    y1: 3.81,
    x2: 89.656,
    y2: 5.19,
  },
  {
    id: "33-72",
    name: "Kota Surakarta",
    x1: 84.556,
    y1: 4.16,
    x2: 113.957,
    y2: 5.41,
  },
  {
    id: "33-73",
    name: "Kota Salatiga",
    x1: 63.839,
    y1: 4.18,
    x2: 83.959,
    y2: 5.12,
  },
  {
    id: "33-74",
    name: "Kota Semarang",
    x1: 98.893,
    y1: 4.81,
    x2: 145.809,
    y2: 5.77,
  },
  {
    id: "33-75",
    name: "Kota Pekalongan",
    x1: 32.649,
    y1: 4.0,
    x2: 43.063,
    y2: 5.2,
  },
  {
    id: "33-76",
    name: "Kota Tegal",
    x1: 54.924,
    y1: 4.16,
    x2: 67.651,
    y2: 4.89,
  },
];

export const klassenData: KlassenItem[] = rawKlassenData.map((d) => ({
  ...d,
  q1: calculateQuadrant(d.x1, d.y1, refThresholds.p1.x, refThresholds.p1.y),
  q2: calculateQuadrant(d.x2, d.y2, refThresholds.p2.x, refThresholds.p2.y),
}));
