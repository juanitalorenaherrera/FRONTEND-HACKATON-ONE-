import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color }) => {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-xl border border-white/30 p-6 rounded-2xl shadow-lg flex items-center gap-5"
      whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 300 } }}
    >
      <div className={cn("p-4 rounded-xl text-white", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-neutral-500 text-sm">{label}</p>
        <p className="text-neutral-800 text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
};