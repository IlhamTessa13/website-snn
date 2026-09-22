"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export default function Kesimpulan() {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="heading-lg mt-2">
            <span className="font-bungee color-pink">Kesimpulan</span>
          </h2>
        </motion.div>

        <div className="flex justify-start">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative bg-white border border-zinc-200 rounded-3xl rounded-bl-md shadow-lg shadow-zinc-200/50 px-7 py-6 md:px-9 md:py-8 max-w-2xl"
          >
            {/* Ekor bubble di kiri bawah */}
            <span
              className="absolute -bottom-[1px] -left-3 w-6 h-6 bg-white border-b border-l border-zinc-200"
              style={{
                clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                borderBottomLeftRadius: "6px",
              }}
              aria-hidden="true"
            />

            <p className="font-rubik font-text-sm md:text-base text-zinc-600 leading-relaxed relative z-10">
              Perekonomian Jawa Tengah 2016–2025 tumbuh positif, dengan PDRB
              ADHB naik dari{" "}
              <span className="font-semibold text-zinc-800">
                Rp1.087 triliun
              </span>{" "}
              menjadi{" "}
              <span className="font-semibold text-zinc-800">
                Rp1.942 triliun
              </span>
              , ditopang dominasi sektor Industri Pengolahan, Perdagangan, dan
              Pertanian. Namun pertumbuhan ini belum merata, tercermin dari
              Indeks Williamson yang tetap tinggi{" "}
              <span className="font-semibold text-amber-600">(0,65–0,69)</span>{" "}
              dan hanya sebagian kecil kabupaten/kota (mayoritas kota besar dan
              wilayah industri) yang masuk Kuadran I &ldquo;Maju &amp;
              Cepat&rdquo;. Dari sisi eksternal dan fiskal, Jawa Tengah masih
              net importir, efisiensi investasi (ICOR) berfluktuasi tajam, dan
              tax ratio relatif rendah dan stagnan.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
