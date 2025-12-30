"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Shield, ArrowRight, Delete, X } from "lucide-react";

interface SecurityPinProps {
  correctCode: string;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export function SecurityPin({ correctCode, onSuccess, title = "Security Verification", description = "Enter your secondary access code to continue" }: SecurityPinProps) {
  const [pin, setPin] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleKeyPress = (val: string) => {
    if (pin.length < correctCode.length) {
      setPin([...pin, val]);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  useEffect(() => {
    if (pin.length === correctCode.length) {
      verifyPin();
    }
  }, [pin]);

  const verifyPin = async () => {
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 400));
    
    if (pin.join("") === correctCode) {
      onSuccess();
    } else {
      setError(true);
      setPin([]);
      setTimeout(() => setError(false), 1000);
    }
    setIsVerifying(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#010101] flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-600/5 blur-[250px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-purple-600/5 blur-[250px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm space-y-8 relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-2xl bg-white/[0.02] border transition-colors duration-500 ${error ? 'border-red-500/50 bg-red-500/10' : 'border-white/10'}`}>
              <Lock className={`w-8 h-8 ${error ? 'text-red-500 animate-bounce' : 'text-indigo-400'}`} />
            </div>
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white">{title}</h2>
          <p className="text-xs text-zinc-500 font-medium tracking-widest uppercase">{description}</p>
        </div>

        <div className="flex justify-center gap-3">
          {Array.from({ length: correctCode.length }).map((_, i) => (
            <motion.div
              key={i}
              animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`w-12 h-16 rounded-2xl border flex items-center justify-center text-2xl font-black transition-all duration-300 ${
                pin[i] 
                  ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' 
                  : 'bg-white/[0.02] border-white/10 text-zinc-700'
              }`}
            >
              {pin[i] ? "•" : ""}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "backspace"].map((key, i) => (
            <button
              key={i}
              onClick={() => key === "backspace" ? handleBackspace() : key && handleKeyPress(key)}
              disabled={!key || isVerifying}
              className={`h-16 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                !key ? 'opacity-0 cursor-default' : 
                key === "backspace" ? 'text-zinc-500 hover:text-white hover:bg-white/5' :
                'bg-white/[0.02] border border-white/5 text-xl font-bold text-zinc-400 hover:bg-white/[0.05] hover:border-white/10 hover:text-white'
              }`}
            >
              {key === "backspace" ? <Delete className="w-6 h-6" /> : key}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
