export interface IlorPoint {
  tahun: number;
  ilor: number;
  elastisitas: number;
}

export interface IlorCategory {
  key: string;
  label: string;
  data: IlorPoint[];
}

export const ilorCategories: IlorCategory[] = [
  {
    key: "a",
    label: "A. Pertanian, Kehutanan, dan Perikanan",
    data: [
      { tahun: 2018, ilor: -39.4358, elastisitas: -1.1409 },
      { tahun: 2019, ilor: -69.2581, elastisitas: -2.0848 },
      { tahun: 2020, ilor: 174.6247, elastisitas: 4.7789 },
      { tahun: 2021, ilor: -392.858, elastisitas: -11.7915 },
      { tahun: 2022, ilor: 87.653, elastisitas: 2.5149 },
      { tahun: 2023, ilor: 573.2052, elastisitas: 15.4164 },
    ],
  },
  {
    key: "b",
    label: "B. Pertambangan dan Penggalian",
    data: [
      { tahun: 2018, ilor: -20.993, elastisitas: -3.9803 },
      { tahun: 2019, ilor: -3.7981, elastisitas: -0.7628 },
      { tahun: 2020, ilor: -11.7137, elastisitas: -2.2909 },
      { tahun: 2021, ilor: -6.0432, elastisitas: -1.3016 },
      { tahun: 2022, ilor: 13.494, elastisitas: 3.325 },
      { tahun: 2023, ilor: 109.4358, elastisitas: 19.9161 },
    ],
  },
  {
    key: "c",
    label: "C. Industri Pengolahan",
    data: [
      { tahun: 2018, ilor: 9.1925, elastisitas: 0.7779 },
      { tahun: 2019, ilor: 8.3657, elastisitas: 0.7181 },
      { tahun: 2020, ilor: 25.1303, elastisitas: 2.2604 },
      { tahun: 2021, ilor: 43.8427, elastisitas: 3.6947 },
      { tahun: 2022, ilor: 5.5295, elastisitas: 0.4755 },
      { tahun: 2023, ilor: 10.6358, elastisitas: 0.9178 },
    ],
  },
  {
    key: "d",
    label: "D. Pengadaan Listrik dan Gas",
    data: [
      { tahun: 2018, ilor: 157.4757, elastisitas: 3.3204 },
      { tahun: 2019, ilor: -140.7808, elastisitas: -3.7388 },
      { tahun: 2020, ilor: -100.5139, elastisitas: -2.8539 },
      { tahun: 2021, ilor: -90.605, elastisitas: -3.2187 },
      { tahun: 2022, ilor: -121.8489, elastisitas: -5.3741 },
      { tahun: 2023, ilor: 117.2965, elastisitas: 4.0877 },
    ],
  },
  {
    key: "e",
    label: "E. Pengadaan Air, Pengelolaan Sampah, Limbah dan Daur Ulang",
    data: [
      { tahun: 2018, ilor: -724.7799, elastisitas: -12.1478 },
      { tahun: 2019, ilor: 396.9263, elastisitas: 5.3851 },
      { tahun: 2020, ilor: 25.3978, elastisitas: 0.3497 },
      { tahun: 2021, ilor: 560.6868, elastisitas: 5.6118 },
      { tahun: 2022, ilor: -2295.0993, elastisitas: -30.2464 },
      { tahun: 2023, ilor: -238.0921, elastisitas: -3.7432 },
    ],
  },
  {
    key: "f",
    label: "F. Konstruksi",
    data: [
      { tahun: 2018, ilor: 7.3113, elastisitas: 0.4688 },
      { tahun: 2019, ilor: 2.1485, elastisitas: 0.1436 },
      { tahun: 2020, ilor: 36.1999, elastisitas: 2.5616 },
      { tahun: 2021, ilor: 10.0398, elastisitas: 0.7248 },
      { tahun: 2022, ilor: 2.1524, elastisitas: 0.1578 },
      { tahun: 2023, ilor: 39.2539, elastisitas: 2.5986 },
    ],
  },
  {
    key: "g",
    label: "G. Perdagangan Besar dan Eceran; Reparasi Mobil dan Sepeda Motor",
    data: [
      { tahun: 2018, ilor: 11.4062, elastisitas: 0.4777 },
      { tahun: 2019, ilor: 10.1291, elastisitas: 0.4384 },
      { tahun: 2020, ilor: 1.1991, elastisitas: 0.05 },
      { tahun: 2021, ilor: 16.6372, elastisitas: 0.7059 },
      { tahun: 2022, ilor: 14.7227, elastisitas: 0.6345 },
      { tahun: 2023, ilor: 12.8442, elastisitas: 0.5654 },
    ],
  },
  {
    key: "h",
    label: "H. Transportasi dan Pergudangan",
    data: [
      { tahun: 2018, ilor: 8.3481, elastisitas: 0.4644 },
      { tahun: 2019, ilor: -0.8887, elastisitas: -0.0539 },
      { tahun: 2020, ilor: 5.0752, elastisitas: 0.231 },
      { tahun: 2021, ilor: -14.357, elastisitas: -0.6896 },
      { tahun: 2022, ilor: 0.311, elastisitas: 0.0256 },
      { tahun: 2023, ilor: 25.797, elastisitas: 1.9559 },
    ],
  },
  {
    key: "i",
    label: "I. Penyediaan Akomodasi dan Makan Minum",
    data: [
      { tahun: 2018, ilor: 43.8987, elastisitas: 1.0995 },
      { tahun: 2019, ilor: -10.1705, elastisitas: -0.2844 },
      { tahun: 2020, ilor: -44.5888, elastisitas: -1.0435 },
      { tahun: 2021, ilor: 41.2105, elastisitas: 0.9664 },
      { tahun: 2022, ilor: 2.7766, elastisitas: 0.0753 },
      { tahun: 2023, ilor: 70.7383, elastisitas: 1.7563 },
    ],
  },
  {
    key: "j",
    label: "J. Informasi dan Komunikasi",
    data: [
      { tahun: 2018, ilor: 1.4545, elastisitas: 0.7756 },
      { tahun: 2019, ilor: -1.2978, elastisitas: -0.84 },
      { tahun: 2020, ilor: 0.2014, elastisitas: 0.1477 },
      { tahun: 2021, ilor: 4.1009, elastisitas: 2.6996 },
      { tahun: 2022, ilor: 5.8489, elastisitas: 3.6 },
      { tahun: 2023, ilor: -0.3855, elastisitas: -0.2694 },
    ],
  },
  {
    key: "k",
    label: "K. Jasa Keuangan dan Asuransi",
    data: [
      { tahun: 2018, ilor: 19.8514, elastisitas: 2.0442 },
      { tahun: 2019, ilor: -16.582, elastisitas: -1.8796 },
      { tahun: 2020, ilor: -56.346, elastisitas: -7.5693 },
      { tahun: 2021, ilor: 0.0865, elastisitas: 0.0118 },
      { tahun: 2022, ilor: -2.1852, elastisitas: -0.3003 },
      { tahun: 2023, ilor: 35.7188, elastisitas: 4.5338 },
    ],
  },
  {
    key: "l",
    label: "L. Real Estat",
    data: [
      { tahun: 2018, ilor: 4.4581, elastisitas: 5.5457 },
      { tahun: 2019, ilor: -0.3361, elastisitas: -0.4517 },
      { tahun: 2020, ilor: -3.0355, elastisitas: -4.0227 },
      { tahun: 2021, ilor: 6.3427, elastisitas: 7.2709 },
      { tahun: 2022, ilor: 0.532, elastisitas: 0.6216 },
      { tahun: 2023, ilor: -0.364, elastisitas: -0.4684 },
    ],
  },
  {
    key: "mn",
    label: "M,N. Jasa Perusahaan",
    data: [
      { tahun: 2018, ilor: 54.3501, elastisitas: 1.171 },
      { tahun: 2019, ilor: 80.7763, elastisitas: 1.6256 },
      { tahun: 2020, ilor: 8.9125, elastisitas: 0.1686 },
      { tahun: 2021, ilor: 15.0308, elastisitas: 0.2906 },
      { tahun: 2022, ilor: -86.2514, elastisitas: -1.9722 },
      { tahun: 2023, ilor: 270.916, elastisitas: 4.5866 },
    ],
  },
  {
    key: "o",
    label: "O. Administrasi Pemerintahan, Pertahanan dan Jaminan Sosial Wajib",
    data: [
      { tahun: 2018, ilor: -31.9961, elastisitas: -2.0385 },
      { tahun: 2019, ilor: 32.8424, elastisitas: 2.0137 },
      { tahun: 2020, ilor: 258.3899, elastisitas: 20.0114 },
      { tahun: 2021, ilor: -124.667, elastisitas: -9.0335 },
      { tahun: 2022, ilor: 48.1131, elastisitas: 3.3569 },
      { tahun: 2023, ilor: -5.1445, elastisitas: -0.3794 },
    ],
  },
  {
    key: "p",
    label: "P. Jasa Pendidikan",
    data: [
      { tahun: 2018, ilor: -6.2698, elastisitas: -0.3181 },
      { tahun: 2019, ilor: 11.1203, elastisitas: 0.582 },
      { tahun: 2020, ilor: 469.4217, elastisitas: 26.029 },
      { tahun: 2021, ilor: 1804.049, elastisitas: 93.6285 },
      { tahun: 2022, ilor: -1.622, elastisitas: -0.0856 },
      { tahun: 2023, ilor: 30.0027, elastisitas: 1.5333 },
    ],
  },
  {
    key: "q",
    label: "Q. Jasa Kesehatan dan Kegiatan Sosial",
    data: [
      { tahun: 2018, ilor: 31.8314, elastisitas: 1.1515 },
      { tahun: 2019, ilor: 11.692, elastisitas: 0.4389 },
      { tahun: 2020, ilor: -1.8783, elastisitas: -0.0767 },
      { tahun: 2021, ilor: 824.971, elastisitas: 31.8097 },
      { tahun: 2022, ilor: 17.7872, elastisitas: 0.6912 },
      { tahun: 2023, ilor: 31.9195, elastisitas: 1.2241 },
    ],
  },
  {
    key: "rstu",
    label: "R,S,T,U. Jasa lainnya",
    data: [
      { tahun: 2018, ilor: -14.0481, elastisitas: -0.2895 },
      { tahun: 2019, ilor: 17.221, elastisitas: 0.3749 },
      { tahun: 2020, ilor: 5.5915, elastisitas: 0.1131 },
      { tahun: 2021, ilor: -539.8055, elastisitas: -11.6445 },
      { tahun: 2022, ilor: 37.454, elastisitas: 0.8246 },
      { tahun: 2023, ilor: 113.5481, elastisitas: 2.2656 },
    ],
  },
];
