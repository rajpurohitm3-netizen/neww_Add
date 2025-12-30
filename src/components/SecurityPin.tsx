"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Shield, X, AlertTriangle } from "lucide-react";

interface SecurityPinProps {
  correctCode: string;
  title: string;
  description: string;
  onSuccess: () => void;
}

export function SecurityPin({ correctCode, title, description, onSuccess }: SecurityPinProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (code.length === correctCode.length) {
      if (code === correctCode) {
        onSuccess();
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => {
          setCode("");
          setError(false);
          setShake(false);
        }, 500);
      }
    }
  }, [code, correctCode, onSuccess]);

  const handleKeyPress = (key: string) => {
    if (code.length < correctCode.length) {
      setCode(prev => prev + key);
    }
  };

  const handleDelete = () => {
    setCode(prev => prev.slice(0, -1));
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

  return (
    <div className="fixed inset-0 bg-[#010101] z-[200] flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-600/10 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-600/5 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, x: shake ? [-10, 10, -10, 10, 0] : 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 max-w-sm w-full"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-[2rem] mb-6">
            <Shield className="w-10 h-10 text-indigo-500" />
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">{title}</h1>
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/30 text-center">{description}</p>
        </div>

        <div className="flex justify-center gap-3 mb-10">
          {Array.from({ length: correctCode.length }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 1 }}
              animate={{ 
                scale: code.length > i ? 1.1 : 1,
                backgroundColor: error ? "rgb(239, 68, 68)" : code.length > i ? "rgb(99, 102, 241)" : "rgba(255, 255, 255, 0.02)"
              }}
              className={`w-4 h-4 rounded-full border ${error ? "border-red-500" : code.length > i ? "border-indigo-400" : "border-white/10"}`}
            />
          ))}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-2 mb-6 text-red-400"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Incorrect Code</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-3 gap-3">
          {keys.map((key, i) => (
            key === "" ? (
              <div key={i} />
            ) : key === "del" ? (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className="h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                <X className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleKeyPress(key)}
                className="h-16 rounded-2xl bg-white/[0.02] border border-white/5 text-xl font-black text-white hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all"
              >
                {key}
              </motion.button>
            )
          ))}
        </div>
      </motion.div>
    </div>
  );
}
