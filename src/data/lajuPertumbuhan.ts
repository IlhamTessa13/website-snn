export interface LajuPertumbuhanRow {
  lapanganUsaha: string;
  shortName: string;
  values: Record<number, number>;
}

export const lajuPertumbuhanData: LajuPertumbuhanRow[] = [
  { lapanganUsaha: "A. Pertanian, Kehutanan, dan Perikanan", shortName: "Pertanian", values: { 2016: 2.2, 2017: 1.82, 2018: 2.62, 2019: 1.31, 2020: 2.4, 2021: 0.76, 2022: 2.91, 2023: 0.43, 2024: 1.39, 2025: 4.78 } },
  { lapanganUsaha: "B. Pertambangan dan Penggalian", shortName: "Pertambangan", values: { 2016: 18.98, 2017: 5.11, 2018: 2.45, 2019: 3.36, 2020: -0.8, 2021: 4.4, 2022: -6.2, 2023: 1.38, 2024: 2.83, 2025: 2.21 } },
  { lapanganUsaha: "C. Industri Pengolahan", shortName: "Industri", values: { 2016: 4.1, 2017: 4.33, 2018: 4.33, 2019: 5.07, 2020: -3.8, 2021: 2.34, 2022: 3.88, 2023: 4.32, 2024: 3.52, 2025: 4.06 } },
  { lapanganUsaha: "D. Pengadaan Listrik dan Gas", shortName: "Listrik & Gas", values: { 2016: 4.57, 2017: 5.22, 2018: 5.36, 2019: 5.48, 2020: 1.79, 2021: 5.95, 2022: 3.79, 2023: 6.8, 2024: 6.96, 2025: 4.42 } },
  { lapanganUsaha: "E. Pengadaan Air, Sampah, Limbah & Daur Ulang", shortName: "Air & Limbah", values: { 2016: 2.17, 2017: 6.51, 2018: 4.88, 2019: 4.34, 2020: 2.29, 2021: 5.92, 2022: 1.01, 2023: 4.07, 2024: 2.28, 2025: 1.37 } },
  { lapanganUsaha: "F. Konstruksi", shortName: "Konstruksi", values: { 2016: 6.52, 2017: 7.13, 2018: 6.07, 2019: 4.95, 2020: -3.76, 2021: 7.37, 2022: 1.83, 2023: 6.07, 2024: 7.97, 2025: 6.62 } },
  { lapanganUsaha: "G. Perdagangan Besar dan Eceran", shortName: "Perdagangan", values: { 2016: 5.67, 2017: 5.87, 2018: 5.77, 2019: 5.97, 2020: -3.8, 2021: 5.8, 2022: 4.32, 2023: 4.93, 2024: 4.15, 2025: 4.63 } },
  { lapanganUsaha: "H. Transportasi dan Pergudangan", shortName: "Transportasi", values: { 2016: 4.91, 2017: 6.3, 2018: 7.55, 2019: 8.49, 2020: -32.38, 2021: 3.27, 2022: 73.01, 2023: 8.12, 2024: 5.56, 2025: 6.73 } },
  { lapanganUsaha: "I. Penyediaan Akomodasi dan Makan Minum", shortName: "Akomodasi", values: { 2016: 6.26, 2017: 6.45, 2018: 8.15, 2019: 9.07, 2020: -7.98, 2021: 5.92, 2022: 16.99, 2023: 11.24, 2024: 10.03, 2025: 10.6 } },
  { lapanganUsaha: "J. Informasi dan Komunikasi", shortName: "Infokom", values: { 2016: 8.31, 2017: 13.27, 2018: 12.39, 2019: 11.62, 2020: 15.65, 2021: 6.04, 2022: 2.5, 2023: 10.67, 2024: 9.56, 2025: 8.74 } },
  { lapanganUsaha: "K. Jasa Keuangan dan Asuransi", shortName: "Keuangan", values: { 2016: 8.77, 2017: 5.17, 2018: 3.58, 2019: 3.5, 2020: 2.16, 2021: 1.62, 2022: 0.53, 2023: 2.16, 2024: 2.16, 2025: 5.61 } },
  { lapanganUsaha: "L. Real Estat", shortName: "Real Estat", values: { 2016: 6.81, 2017: 6.48, 2018: 5.58, 2019: 5.53, 2020: -0.28, 2021: 2.15, 2022: 5.09, 2023: 6.9, 2024: 5.91, 2025: 5.62 } },
  { lapanganUsaha: "M,N. Jasa Perusahaan", shortName: "Jasa Perusahaan", values: { 2016: 10.62, 2017: 8.72, 2018: 9.48, 2019: 10.54, 2020: -7.19, 2021: 3.07, 2022: 6.15, 2023: 7.24, 2024: 9.15, 2025: 7.86 } },
  { lapanganUsaha: "O. Administrasi Pemerintahan", shortName: "Adm. Pemerintahan", values: { 2016: 2.37, 2017: 2.57, 2018: 3.58, 2019: 3.71, 2020: -1.38, 2021: -0.64, 2022: 1.58, 2023: 4.13, 2024: 7.53, 2025: 2.25 } },
  { lapanganUsaha: "P. Jasa Pendidikan", shortName: "Pendidikan", values: { 2016: 7.35, 2017: 6.97, 2018: 7.76, 2019: 7.59, 2020: -0.24, 2021: 0.07, 2022: 1.58, 2023: 5.97, 2024: 8.53, 2025: 6.51 } },
  { lapanganUsaha: "Q. Jasa Kesehatan dan Kegiatan Sosial", shortName: "Kesehatan", values: { 2016: 9.86, 2017: 8.6, 2018: 8.8, 2019: 6.72, 2020: 8.19, 2021: 0.18, 2022: 2.51, 2023: 5.82, 2024: 7.28, 2025: 5.01 } },
  { lapanganUsaha: "R,S,T,U. Jasa lainnya", shortName: "Jasa Lainnya", values: { 2016: 8.64, 2017: 8.98, 2018: 9.45, 2019: 9.02, 2020: -8.01, 2021: 0.53, 2022: 11.79, 2023: 7.41, 2024: 6.82, 2025: 8.15 } },
];

export const pdrbTotal: Record<number, number> = {
  2016: 5.25, 2017: 5.26, 2018: 5.3, 2019: 5.36, 2020: -2.65, 2021: 3.33, 2022: 5.31, 2023: 4.97, 2024: 4.95, 2025: 5.37
};

export const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
