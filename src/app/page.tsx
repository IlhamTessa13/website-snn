"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/scenes/HeroSection";

// Dynamic imports to avoid SSR issues with recharts
const DisparitasPDRB = dynamic(
  () => import("@/components/scenes/DisparitasPDRB"),
  { ssr: false },
);
const LajuIndeksImplisit = dynamic(
  () => import("@/components/scenes/LajuIndeksImplisit"),
  { ssr: false },
);
const LajuPertumbuhanEkonomi = dynamic(
  () => import("@/components/scenes/LajuPertumbuhanEkonomi"),
  { ssr: false },
);
const KontribusiPDRB = dynamic(
  () => import("@/components/scenes/KontribusiPDRB"),
  { ssr: false },
);
const ShiftShareAnalysis = dynamic(
  () => import("@/components/scenes/ShiftShareAnalysis"),
  { ssr: false },
);
const IndeksWilliamson = dynamic(
  () => import("@/components/scenes/IndeksWilliamson"),
  { ssr: false },
);
const IndeksBonet = dynamic(
  () => import("@/components/scenes/IndeksBonet"),
  { ssr: false },
);
const TipologiKlassen = dynamic(
  () => import("@/components/scenes/TipologiKlassen"),
  { ssr: false },
);
const Mpc = dynamic(() => import("@/components/scenes/Mpc"), { ssr: false });

const Apc = dynamic(() => import("@/components/scenes/Apc"), { ssr: false });

const Elastisitas = dynamic(() => import("@/components/scenes/Elastisitas"), {
  ssr: false,
});

const Perdagangan = dynamic(() => import("@/components/scenes/Perdagangan"), {
  ssr: false,
});
const Icor = dynamic(() => import("@/components/scenes/Icor"), { ssr: false });
const Ilor = dynamic(() => import("@/components/scenes/Ilor"), { ssr: false });
const ElastisitasTenagaKerja = dynamic(
  () => import("@/components/scenes/ElastisitasTenagaKerja"),
  { ssr: false },
);
const TaxRatio = dynamic(() => import("@/components/scenes/TaxRatio"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <HeroSection />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Scene 1: Disparitas PDRB Per Kapita */}
      <DisparitasPDRB />

      <div className="section-divider" />

      {/* Scene 2: Laju Indeks Implisit */}
      <LajuIndeksImplisit />

      <div className="section-divider" />

      {/* Scene 3: Laju Pertumbuhan Ekonomi */}
      <LajuPertumbuhanEkonomi />

      <div className="section-divider" />

      {/* Scene 4: Kontribusi PDRB */}
      <KontribusiPDRB />

      <div className="section-divider" />

      {/* Scene 5: Shift-Share Analysis */}
      <ShiftShareAnalysis />

      <div className="section-divider" />

      {/* Scene 6: Indeks Williamson */}
      <IndeksWilliamson />

      <IndeksBonet />

      <TipologiKlassen />


      {/* Scene 7: MPC */}
      <Mpc />

      {/* Scene 7b: APC */}
      <Apc />

      {/* Scene 7c: Elastisitas */}
      <Elastisitas />

      {/* Scene 8: Perdagangan Internasional */}
      <Perdagangan />

      {/* Scene 9: ICOR */}
      <Icor />

      {/* Scene 9b: ILOR */}
      <Ilor />

      {/* Scene 9c: Elastisitas Tenaga Kerja */}
      <ElastisitasTenagaKerja />

      {/* Scene 6b: Tax Ratio */}
      <TaxRatio />

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-20 mt-16 border-t border-zinc-200">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h3 className="heading-md">
              Analisis Ekonomi
              <span className="font-editorial gradient-text-amber">
                {" "}
                Jawa Tengah
              </span>
            </h3>
            <p className="body-sm mt-2 max-w-md">
              Sistem Neraca Nasional — Kelompok 2. Data bersumber dari BPS
              Provinsi Jawa Tengah, diolah untuk keperluan akademik.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-400">Data Periode 2016–2025</p>
            <p className="text-xs text-zinc-400 mt-1">
              Atas Dasar Harga Berlaku (ADHB) & Harga Konstan 2010 (ADHK)
            </p>
            <p className="text-xs text-zinc-300 mt-3">© 2025 SNN Kelompok 2</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
