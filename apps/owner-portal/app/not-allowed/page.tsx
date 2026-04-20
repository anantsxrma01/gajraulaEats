"use client";

import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function NotAllowed() {
  const { logout } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-black">
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-10 rounded-3xl max-w-lg w-full text-center border-red-500/20"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Access Denied</h1>
        <p className="text-zinc-400 mb-8 max-w-sm mx-auto">
          You do not have the necessary permissions to access the Owner Portal. Please log in with an authorized account.
        </p>

        <Button variant="danger" onClick={logout} className="w-full h-12 text-base">
          Return to Login
        </Button>
      </motion.div>
    </div>
  );
}
