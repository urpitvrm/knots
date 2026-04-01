import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { pageVariants, pageTransition } from '../utils/motion';
import ChatWidget from '../components/chat/ChatWidget';

export default function MainLayout({ children }) {
  const content = children ?? <Outlet />;
  return (
    <div className="min-h-screen flex flex-col bg-cream font-body">
      <Navbar />
      <motion.main
        className="flex-1"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        {content}
      </motion.main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
