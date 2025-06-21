"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-gradient-to-b from-white to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl"
      >
        <h1 className="text-4xl font-bold md:text-5xl mb-4">Slide Sync Clean</h1>
        <p className="text-gray-700 text-lg md:text-xl mb-8">
          Turn your slides into perfectly synced videos – clean, fast, and easy.
        </p>

        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="/upload"
          className="inline-block px-6 py-3 bg-black text-white rounded-xl shadow hover:bg-gray-800 transition"
        >
          Upload a Slide
        </motion.a>

        <p className="text-sm text-gray-400 mt-10">© 2025 Slide Sync Clean</p>
      </motion.div>
    </main>
  );
}







