"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Shield, Delete, CheckCircle2, AlertCircle } from "lucide-react";

interface SecurityPinProps {
  correctCode: string;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export function SecurityPin({ correctCode, onSuccess, title = "Security Verification", description = "Enter your security code to proceed" }: SecurityPinProps) {
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < correctCode.length) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === correctCode.length) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const verifyPin = (currentPin: string) => {
    if (currentPin === correctCode) {
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 800);
    } else {
      setError(true);
      setTimeout(() => {
        setPin("");
        setError(false);
      }, 1000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSuccess) return;
      if (/[0-9]/.test(e.key)) {
        handleNumberClick(e.key);
      } else if (e.key === "Backspace") {
        handleDelete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, isSuccess]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#010101] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md p-8 relative z-10"
      >
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center mb-6">
            <motion.div 
              animate={error ? { x: [-10, 10, -10, 10, 0] } : isSuccess ? { scale: [1, 1.2, 1] } : {}}
              className={`p-5 rounded-[2rem] border ${error ? 'bg-red-500/10 border-red-500/50' : isSuccess ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-indigo-500/10 border-indigo-500/30'} transition-colors duration-300`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              ) : error ? (
                <AlertCircle className="w-8 h-8 text-red-500" />
              ) : (
                <Lock className="w-8 h-8 text-indigo-500" />
              )}
            </motion.div>
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">{title}</h2>
          <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-[0.3em]">{description}</p>
        </div>

        <div className="flex justify-center gap-4 mb-16">
          {Array.from({ length: correctCode.length }).map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: pin.length > i ? 1.1 : 1,
                backgroundColor: pin.length > i ? (isSuccess ? "#10b981" : "#6366f1") : "rgba(255,255,255,0.05)",
                borderColor: pin.length > i ? (isSuccess ? "rgba(16,185,129,0.5)" : "rgba(99,102,241,0.5)") : "rgba(255,255,255,0.1)"
              }}
              className="w-4 h-4 rounded-full border shadow-lg"
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"].map((item, i) => (
            <div key={i} className="flex justify-center">
              {item === "delete" ? (
                <button
                  onClick={handleDelete}
                  className="w-16 h-16 flex items-center justify-center text-zinc-500 hover:text-white transition-colors active:scale-90"
                >
                  <Delete className="w-6 h-6" />
                </button>
              ) : item === "" ? (
                <div className="w-16 h-16" />
              ) : (
                <button
                  onClick={() => handleNumberClick(item)}
                  className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-2xl font-bold text-white hover:bg-white/[0.05] hover:border-white/20 transition-all active:scale-90 relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item}
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
