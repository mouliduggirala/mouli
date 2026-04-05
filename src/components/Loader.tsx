import React from "react";
import { motion } from "motion/react";

const Logo = () => (
  <div className="flex items-center gap-2 group cursor-pointer">
    <div className="w-12 h-12 bg-[#0f172a] rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-[#0f172a]/20">
      D
    </div>
    <div className="w-12 h-12 bg-[#10b981] rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-[#10b981]/20 -ml-4">
      M
    </div>
  </div>
);

const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <Logo />
      </motion.div>
      
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "120px" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="h-1 bg-[#10b981] rounded-full mt-8"
      />
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 font-mono text-xs font-bold tracking-widest text-[#64748b] uppercase"
      >
        Initializing Portfolio<span className="animate-pulse">...</span>
      </motion.p>
    </motion.div>
  );
};

export default Loader;
