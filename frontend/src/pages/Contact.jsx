import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Contact() {
  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-semibold mb-2 text-deep font-display">Contact</h1>
        <p className="text-deep/70">Email us at hello@cozyloops.example</p>
        <Card className="mt-6 p-6 border border-beige/40">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4">
            <Input type="text" placeholder="Your Name" />
            <Input type="email" placeholder="Email" />
            <textarea
              placeholder="Message"
              rows="4"
              className="w-full rounded-xl border border-beige/80 bg-cream px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <Button type="submit">Send message</Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
