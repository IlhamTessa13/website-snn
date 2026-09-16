"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden bg-[#f4f1ea]"
      style={{
        backgroundImage: "url('/background.webp')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Top label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-10 left-1/2 -translate-x-1/2"
      ></motion.div>

      {/* Subtitle — diposisikan tepat di bawah teks judul pada gambar */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="body-lg absolute text-zinc-600 max-w-md font-delius "
        style={{
          left: "5%",
          top: "80%",
        }}
      >
        Mari melihat bagaimana ekonomi Jawa Tengah bergerak, bagaimana
        kondisinya berbeda antarwilayah, dan apa yang ditunjukkan oleh indikator
        makroekonominya.
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-4 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-medium tracking-widest uppercase text-zinc-400">
          Scroll untuk menjelajahi
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-zinc-300 flex items-start justify-center pt-1"
        >
          <div className="w-1 h-2 rounded-full bg-zinc-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
