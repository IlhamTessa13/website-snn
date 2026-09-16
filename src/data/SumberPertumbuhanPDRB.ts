export type ColKey = "qtoq" | "yoy" | "ctoc";

export interface SumberPertumbuhanRow {
  id: string;
  label: string;
  qtoq: number | null;
  yoy: number | null;
  ctoc: number | null;
  isTotal?: boolean;
}

// Sumber: SECTION_5.xlsx — Sumber Pertumbuhan PDRB Jawa Tengah, Triwulan IV 2025
export const sumberPertumbuhanData: SumberPertumbuhanRow[] = [
  {
    id: "konsumsi-rt",
    label: "Pengeluaran Konsumsi Rumah Tangga",
    qtoq: 0.36,
    yoy: 2.64,
    ctoc: 2.83,
  },
  {
    id: "konsumsi-lnprt",
    label: "Pengeluaran Konsumsi LNPRT",
    qtoq: 0.01,
    yoy: 0.05,
    ctoc: 0.05,
  },
  {
    id: "konsumsi-pemerintah",
    label: "Pengeluaran Konsumsi Pemerintah",
    qtoq: 3.01,
    yoy: 0.69,
    ctoc: 0.19,
  },
  {
    id: "pmtb",
    label: "Pembentukan Modal Tetap Bruto",
    qtoq: 0.95,
    yoy: 1.93,
    ctoc: 1.97,
  },
  {
    id: "inventori",
    label: "Perubahan Inventori",
    qtoq: null,
    yoy: null,
    ctoc: null,
  },
  {
    id: "ekspor",
    label: "Ekspor Barang dan Jasa",
    qtoq: 0.39,
    yoy: 5.49,
    ctoc: 4.21,
  },
  {
    id: "impor",
    label: "Dikurangi: Impor Barang dan Jasa",
    qtoq: 2.68,
    yoy: 5.09,
    ctoc: 3.78,
  },
  {
    id: "pdrb",
    label: "Produk Domestik Regional Bruto (PDRB)",
    qtoq: 0.9,
    yoy: 5.84,
    ctoc: 5.37,
    isTotal: true,
  },
];

export const columnMeta: { key: ColKey; label: string; subtitle: string }[] = [
  { key: "qtoq", label: "q-to-q", subtitle: "Triw IV-2025 thd Triw III-2025" },
  { key: "yoy", label: "y-on-y", subtitle: "Triw IV-2025 thd Triw IV-2024" },
  { key: "ctoc", label: "c-to-c", subtitle: "Tahun 2025 thd Tahun 2024" },
];

export function formatValue(value: number | null): string {
  if (value === null) return "–";
  return value.toFixed(2).replace(".", ",");
}
