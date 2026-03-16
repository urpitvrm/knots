import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PageHeading from '../components/ui/PageHeading';
import Card from '../components/ui/Card';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <PageHeading title="Profile" subtitle="Your account details." />
      {!user ? (
        <p className="text-deep/70">Please log in to view your profile.</p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card className="p-6 border border-beige/40">
            <div className="font-semibold text-deep">{user.name}</div>
            <div className="text-deep/70 mt-1">{user.email}</div>
            <div className="mt-2 text-sm text-deep/60 capitalize">Role: {user.role}</div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
