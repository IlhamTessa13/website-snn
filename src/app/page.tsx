"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/scenes/HeroSection";

// Dynamic imports to avoid SSR issues with recharts
const PetaSebaranPDRB = dynamic(
  () => import("@/components/scenes/PetaSebaranPDRB"),
  { ssr: false },
);

const LajuPertumbuhanScrolly = dynamic(
  () => import("@/components/scenes/LajuPertumbuhanScrolly"),
  { ssr: false },
);

const StrukturEkonomiSunburst = dynamic(
  () => import("@/components/scenes/StrukturEkonomiSunburst"),
  { ssr: false },
);
const PdrbPerKapitaTombstone = dynamic(
  () => import("@/components/scenes/PdrbPerKapitaTombstone"),
  { ssr: false },
);

const SumberPertumbuhanPDRB = dynamic(
  () => import("@/components/scenes/SumberPertumbuhanPDRB"),
  { ssr: false },
);


const IndeksWilliamson = dynamic(() => import("@/components/scenes/IndeksWilliamson"), { ssr: false });

const IndeksBonet = dynamic(() => import("@/components/scenes/IndeksBonet"), { ssr: false });

const TipologiKlassen = dynamic(() => import("@/components/scenes/TipologiKlassen"), { ssr: false });

const SsSederhana = dynamic(() => import("@/components/scenes/SsSederhana"), { ssr: false });

const Lq= dynamic(
  () => import("@/components/scenes/Lq"),
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

      {/* Section 1: Peta Sebaran PDRB ADHB & ADHK */}
      <PetaSebaranPDRB />

      {/* Section 2: Laju Pertumbuhan Ekonomi (scrollytelling) */}
      <LajuPertumbuhanScrolly />

      {/* Section 3: Struktur Ekonomi Jawa Tengah */}
      <StrukturEkonomiSunburst />

      {/* Section 3: PDRB Per Kapita */}
      <PdrbPerKapitaTombstone />

      {/* Section 4: Sumber Pertumbuhan PDRB */}
      <SumberPertumbuhanPDRB />

      {/* Scene 6: Indeks Williamson */}

      <IndeksWilliamson />

      {/* Scene 6b: Indeks Bonet */}
      <IndeksBonet />

      {/* Scene 6c: Tipologi Klassen */}
      <TipologiKlassen />

      {/* Scene 6d: SS Sederhana */}
      <SsSederhana />

      {/* Scene 6e: LQ */}
      <Lq />

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
      <footer className="mt-16 w-full">
        <img src="/footer.webp" alt="Footer" className="w-full h-auto block" />
      </footer>
    </main>
  );
}
