"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function HeroCta() {
  return (
    <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <Button variant="primary" className="w-full sm:w-auto overflow-hidden group cursor-pointer">
        Start Building Now 
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </Button>
      <Button variant="secondary" className="w-full sm:w-auto cursor-pointer">
        <Code size={18} />
        Import Your GitHub
      </Button>
    </motion.div>
  );
} 
