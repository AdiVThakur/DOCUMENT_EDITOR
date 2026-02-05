import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DocumentList from './components/DocumentList';
import DocumentEditor from './components/DocumentEditor';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      {/* Changed bg-gradient to a deeper dark palette */}
      <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500/30">
        <Navbar />
        <main className="container mx-auto px-4 pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Routes>
                <Route path="/" element={<DocumentList />} />
                <Route path="/document/:id" element={<DocumentEditor />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
};

export default App;