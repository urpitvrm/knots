import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-semibold mb-4 text-deep font-display">About CozyLoops</h1>
        <p className="text-deep/70 text-lg leading-relaxed">
          We craft handmade crochet pieces with soft pastels and cozy textures. Each item is made
          with love to bring warmth to your everyday life.
        </p>
        <Card className="mt-8 p-6 border border-beige/40">
          <h2 className="text-xl font-semibold text-deep mb-3">Our story</h2>
          <p className="text-deep/70">
            From small beginnings to a cozy collection of bags, flowers, plushies, and keychains—
            every stitch is made with care for you.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
