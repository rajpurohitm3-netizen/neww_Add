"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Shield, X, Delete } from "lucide-react";

interface SecurityPinProps {
  correctCode: string;
  title: string;
  onSuccess: () => void;
  description?: string;
}

export function SecurityPin({ correctCode, title, onSuccess, description }: SecurityPinProps) {
  const [pin, setPin] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < correctCode.length) {
      const newPin = [...pin, num];
      setPin(newPin);
      setError(false);
      
      if (newPin.length === correctCode.length) {
        if (newPin.join("") === correctCode) {
          onSuccess();
        } else {
          setError(true);
          setIsShaking(true);
          setTimeout(() => {
            setIsShaking(false);
            setPin([]);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#010101] flex flex-col items-center justify-center p-6 select-none">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xs w-full space-y-8 relative z-10"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-3xl shadow-2xl">
              <Lock className={`w-8 h-8 ${error ? 'text-red-500' : 'text-indigo-500'}`} />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white">{title}</h2>
            {description && (
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{description}</p>
            )}
          </div>
        </div>

        <motion.div 
          animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
          className="flex justify-center gap-4"
        >
          {Array.from({ length: correctCode.length }).map((_, i) => (
            <div 
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                pin[i] 
                  ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                  : 'bg-transparent border-white/10'
              } ${error ? 'border-red-500/50 bg-red-500/20' : ''}`}
            />
          ))}
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="w-full aspect-square flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 active:scale-95 transition-all text-xl font-bold text-white"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleNumberClick("0")}
            className="w-full aspect-square flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 active:scale-95 transition-all text-xl font-bold text-white"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-full aspect-square flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 active:scale-95 transition-all text-xl font-bold text-zinc-400 hover:text-white"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>
      </motion.div>

      <div className="mt-12 flex items-center gap-2 opacity-20">
        <Shield className="w-3 h-3 text-indigo-500" />
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white">Encrypted Terminal Access</span>
      </div>
    </div>
  );
}
