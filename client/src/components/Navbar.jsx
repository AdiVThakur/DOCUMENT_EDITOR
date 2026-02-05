import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="sticky top-4 z-50 mx-auto max-w-6xl px-4"
    >
      <div className="glass-panel flex items-center justify-between px-6 py-4 rounded-2xl border border-white/10">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            CollabDoc
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors">
            My Documents
          </Link>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
            + New Doc
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;