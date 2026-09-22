"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export default function Saran() {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-right"
        >
          <h2 className="heading-lg mt-2">
            <span className="font-bungee color-green">Saran</span>
          </h2>
        </motion.div>

        <div className="flex justify-end">
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative bg-white border border-zinc-200 rounded-3xl rounded-br-md shadow-lg shadow-zinc-200/50 px-7 py-6 md:px-9 md:py-8 max-w-2xl"
          >
            {/* Ekor bubble di kanan bawah */}
            <span
              className="absolute -bottom-[1px] -right-3 w-6 h-6 bg-white border-b border-r border-zinc-200"
              style={{
                clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                borderBottomRightRadius: "6px",
              }}
              aria-hidden="true"
            />

            <p className="font-rubik font-text-sm md:text-base text-zinc-600 leading-relaxed relative z-10">
              Pemerintah daerah perlu memperkuat pemerataan pembangunan dengan
              mendorong hilirisasi sektor unggulan dan konektivitas
              infrastruktur di kabupaten tertinggal (Kuadran IV) agar
              ketimpangan antarwilayah terus menurun. Perlu juga penguatan basis
              penerimaan pajak daerah dan optimalisasi investasi agar ICOR lebih
              efisien serta mendukung pertumbuhan yang lebih berkualitas. Selain
              itu, penguatan sektor substitusi impor penting dilakukan mengingat
              rasio perdagangan internasional Jawa Tengah yang terus negatif.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
