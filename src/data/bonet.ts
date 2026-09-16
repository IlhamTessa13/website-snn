export interface BonetRow {
  name: string;
  /** 10 nilai, indeks 0 = 2016 … indeks 9 = 2025 */
  values: number[];
}

export const BONET_START_YEAR = 2016;
export const BONET_END_YEAR = 2025;

export const bonetData: BonetRow[] = [
  {
    name: "Cilacap",
    values: [
      0.819, 0.774, 0.735, 0.686, 0.459, 0.444, 0.451, 0.46, 0.402, 0.372,
    ],
  },
  {
    name: "Banyumas",
    values: [
      0.204, 0.2, 0.192, 0.187, 0.181, 0.177, 0.173, 0.168, 0.161, 0.158,
    ],
  },
  {
    name: "Purbalingga",
    values: [
      0.311, 0.317, 0.318, 0.319, 0.318, 0.321, 0.325, 0.328, 0.328, 0.323,
    ],
  },
  {
    name: "Banjarnegara",
    values: [
      0.406, 0.407, 0.406, 0.403, 0.422, 0.424, 0.425, 0.425, 0.423, 0.422,
    ],
  },
  {
    name: "Kebumen",
    values: [
      0.409, 0.41, 0.407, 0.405, 0.437, 0.438, 0.437, 0.433, 0.431, 0.429,
    ],
  },
  {
    name: "Purworejo",
    values: [
      0.341, 0.34, 0.339, 0.337, 0.344, 0.344, 0.349, 0.349, 0.349, 0.35,
    ],
  },
  {
    name: "Wonosobo",
    values: [
      0.384, 0.395, 0.396, 0.393, 0.419, 0.42, 0.428, 0.432, 0.433, 0.435,
    ],
  },
  {
    name: "Magelang",
    values: [
      0.347, 0.351, 0.355, 0.358, 0.324, 0.323, 0.324, 0.324, 0.32, 0.316,
    ],
  },
  {
    name: "Boyolali",
    values: [
      0.169, 0.163, 0.16, 0.154, 0.166, 0.155, 0.144, 0.133, 0.13, 0.134,
    ],
  },
  {
    name: "Klaten",
    values: [
      0.15, 0.145, 0.141, 0.137, 0.141, 0.136, 0.13, 0.117, 0.109, 0.116,
    ],
  },
  {
    name: "Sukoharjo",
    values: [
      0.046, 0.052, 0.051, 0.057, 0.101, 0.105, 0.104, 0.103, 0.106, 0.107,
    ],
  },
  {
    name: "Wonogiri",
    values: [
      0.233, 0.232, 0.229, 0.228, 0.242, 0.242, 0.234, 0.222, 0.211, 0.203,
    ],
  },
  {
    name: "Karanganyar",
    values: [
      0.056, 0.057, 0.062, 0.065, 0.077, 0.078, 0.083, 0.092, 0.108, 0.119,
    ],
  },
  {
    name: "Sragen",
    values: [
      0.058, 0.07, 0.075, 0.084, 0.05, 0.057, 0.065, 0.077, 0.088, 0.092,
    ],
  },
  {
    name: "Grobogan",
    values: [
      0.499, 0.498, 0.496, 0.495, 0.492, 0.49, 0.488, 0.485, 0.481, 0.48,
    ],
  },
  {
    name: "Blora",
    values: [
      0.268, 0.256, 0.223, 0.234, 0.265, 0.215, 0.176, 0.221, 0.237, 0.242,
    ],
  },
  {
    name: "Rembang",
    values: [
      0.254, 0.242, 0.241, 0.243, 0.205, 0.199, 0.196, 0.191, 0.191, 0.186,
    ],
  },
  {
    name: "Pati",
    values: [
      0.143, 0.138, 0.134, 0.128, 0.114, 0.116, 0.113, 0.109, 0.101, 0.094,
    ],
  },
  {
    name: "Kudus",
    values: [2.35, 2.333, 2.285, 2.238, 2.493, 2.288, 2.153, 2.07, 2.037, 1.92],
  },
  {
    name: "Jepara",
    values: [
      0.379, 0.384, 0.386, 0.387, 0.311, 0.306, 0.309, 0.311, 0.314, 0.313,
    ],
  },
  {
    name: "Demak",
    values: [0.42, 0.421, 0.423, 0.426, 0.402, 0.41, 0.413, 0.411, 0.41, 0.397],
  },
  {
    name: "Semarang",
    values: [
      0.219, 0.212, 0.207, 0.201, 0.262, 0.264, 0.259, 0.255, 0.257, 0.261,
    ],
  },
  {
    name: "Temanggung",
    values: [
      0.27, 0.276, 0.281, 0.285, 0.261, 0.263, 0.265, 0.264, 0.26, 0.252,
    ],
  },
  {
    name: "Kendal",
    values: [
      0.113, 0.115, 0.116, 0.118, 0.133, 0.138, 0.137, 0.142, 0.153, 0.181,
    ],
  },
  {
    name: "Batang",
    values: [0.279, 0.279, 0.28, 0.284, 0.269, 0.26, 0.26, 0.256, 0.243, 0.225],
  },
  {
    name: "Pekalongan",
    values: [0.351, 0.35, 0.35, 0.35, 0.362, 0.367, 0.379, 0.381, 0.379, 0.376],
  },
  {
    name: "Pemalang",
    values: [
      0.511, 0.507, 0.505, 0.501, 0.524, 0.522, 0.526, 0.53, 0.528, 0.527,
    ],
  },
  {
    name: "Tegal",
    values: [
      0.387, 0.383, 0.38, 0.376, 0.401, 0.401, 0.406, 0.406, 0.404, 0.403,
    ],
  },
  {
    name: "Brebes",
    values: [
      0.345, 0.35, 0.352, 0.349, 0.355, 0.365, 0.367, 0.377, 0.374, 0.375,
    ],
  },
  {
    name: "Kota Magelang",
    values: [0.814, 0.829, 0.83, 0.839, 0.94, 0.955, 0.97, 0.991, 1.014, 1.038],
  },
  {
    name: "Kota Surakarta",
    values: [
      1.298, 1.323, 1.333, 1.357, 1.466, 1.489, 1.532, 1.542, 1.555, 1.558,
    ],
  },
  {
    name: "Kota Salatiga",
    values: [
      0.768, 0.76, 0.752, 0.749, 0.87, 0.869, 0.865, 0.866, 0.873, 0.874,
    ],
  },
  {
    name: "Kota Semarang",
    values: [
      1.661, 1.664, 1.668, 1.69, 2.089, 2.187, 2.224, 2.249, 2.266, 2.29,
    ],
  },
  {
    name: "Kota Pekalongan",
    values: [
      0.11, 0.103, 0.099, 0.096, 0.043, 0.043, 0.044, 0.043, 0.041, 0.036,
    ],
  },
  {
    name: "Kota Tegal",
    values: [0.514, 0.53, 0.54, 0.561, 0.507, 0.501, 0.506, 0.5, 0.508, 0.516],
  },
];

/** Pemetaan id TopoJSON → nama kabupaten/kota. Dipakai juga untuk memfilter
 *  fitur non-wilayah (waduk/hutan) yang ikut terbawa di jawatengah.json. */
export const idToNameMap: Record<string, string> = {
  "33-01": "Cilacap",
  "33-02": "Banyumas",
  "33-03": "Purbalingga",
  "33-04": "Banjarnegara",
  "33-05": "Kebumen",
  "33-06": "Purworejo",
  "33-07": "Wonosobo",
  "33-08": "Magelang",
  "33-09": "Boyolali",
  "33-10": "Klaten",
  "33-11": "Sukoharjo",
  "33-12": "Wonogiri",
  "33-13": "Karanganyar",
  "33-14": "Sragen",
  "33-15": "Grobogan",
  "33-16": "Blora",
  "33-17": "Rembang",
  "33-18": "Pati",
  "33-19": "Kudus",
  "33-20": "Jepara",
  "33-21": "Demak",
  "33-22": "Semarang",
  "33-23": "Temanggung",
  "33-24": "Kendal",
  "33-25": "Batang",
  "33-26": "Pekalongan",
  "33-27": "Pemalang",
  "33-28": "Tegal",
  "33-29": "Brebes",
  "33-71": "Kota Magelang",
  "33-72": "Kota Surakarta",
  "33-73": "Kota Salatiga",
  "33-74": "Kota Semarang",
  "33-75": "Kota Pekalongan",
  "33-76": "Kota Tegal",
};

export interface BonetEntry {
  rawName: string;
  values: number[];
  baseAvg: number;
  postAvg: number;
}

/** Lookup by nama ter-normalisasi (lowercase, trim). */
export const bonetMap: Map<string, BonetEntry> = new Map(
  bonetData.map((d) => {
    const baseAvg = (d.values[0] + d.values[1] + d.values[2] + d.values[3]) / 4;
    const postAvg =
      (d.values[5] + d.values[6] + d.values[7] + d.values[8] + d.values[9]) / 5;
    return [
      d.name.toLowerCase().trim(),
      {
        rawName: d.name,
        values: d.values,
        baseAvg: parseFloat(baseAvg.toFixed(3)),
        postAvg: parseFloat(postAvg.toFixed(3)),
      },
    ];
  }),
);

/** Skala warna sequential: hijau = mendekati rata-rata, magenta = ketimpangan ekstrem. */
export function getBonetColor(val: number | null | undefined): string {
  if (val === null || val === undefined) return "#e0e0e0";
  if (val <= 0.2) return "#4d9221";
  if (val <= 0.45) return "#a1d76a";
  if (val <= 0.7) return "#e6f5d0";
  if (val <= 1.0) return "#fde0ef";
  if (val <= 1.6) return "#e9a3c9";
  return "#c51b7d";
}

export const bonetLegendSwatches = [
  { color: "#4d9221", title: "≤ 0,20" },
  { color: "#a1d76a", title: "0,20 – 0,45" },
  { color: "#e6f5d0", title: "0,45 – 0,70" },
  { color: "#fde0ef", title: "0,70 – 1,00" },
  { color: "#e9a3c9", title: "1,00 – 1,60" },
  { color: "#c51b7d", title: "> 1,60" },
];
