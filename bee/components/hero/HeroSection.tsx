"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";

export default function HeroSection() {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-boutique-light dark:bg-boutique-dark transition-colors duration-500 pt-10 pb-16 md:pt-0 md:pb-0">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-amber-600/5 dark:bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        className="relative z-10 w-full h-full max-w-7xl mx-auto px-5 md:px-12 flex flex-col md:flex-row items-center justify-center md:justify-between py-6 md:py-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* LEFT COLUMN: The Typography */}
        <div className="w-full md:w-1/2 flex flex-col items-center text-center md:items-start md:text-left z-20 relative">
          <motion.span 
            variants={itemVariants}
            className="absolute -top-16 md:-top-32 left-1/2 -translate-x-1/2 md:translate-x-0 md:-left-20 text-[180px] md:text-[350px] font-script text-neutral-200/30 dark:text-neutral-800/30 select-none -z-10 tracking-tighter leading-none"
          >
            B
          </motion.span>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 uppercase leading-[0.95]"
          >
            Command <br className="hidden md:block" />
            <span className="text-amber-600 dark:text-amber-500 italic font-script lowercase tracking-normal text-6xl md:text-7xl lg:text-8xl xl:text-9xl ml-0 md:-ml-1.25">
              the
            </span> <br className="hidden md:block" />
            Room.
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="mt-4 md:mt-6 text-sm md:text-base lg:text-lg text-neutral-600 dark:text-neutral-400 max-w-md font-medium"
          >
            Premium fits for the unapologetic. Secure your look before it sells out.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-6 md:mt-10">
            <Link 
              href="/collection" 
              className="group relative inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-neutral-900 dark:bg-amber-600 text-neutral-50 dark:text-neutral-900 font-bold text-sm md:text-base uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-neutral-900/20 dark:shadow-amber-600/20"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-linear-to-b from-transparent via-transparent to-black" />
              <span className="relative">Shop the Drop</span>
            </Link>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: The Editorial Model */}
        <motion.div 
          variants={itemVariants}
          className="w-full md:w-1/2 h-100 md:h-[65vh] max-h-150 mt-12 md:mt-0 relative flex justify-center md:justify-end z-10"
        >
          <div className="relative w-[90%] max-w-95 md:max-w-120 h-full">
            
            <div 
              className={`w-full h-full overflow-hidden drop-shadow-2xl relative ${imageError ? 'bg-neutral-200 dark:bg-neutral-800 animate-pulse' : ''}`}
              style={{ position: 'relative' }}
            >
              <Image 
                src="/hero-model.jpg" 
                alt="Hero Model" 
                fill 
                priority 
                sizes="(max-width: 768px) 100vw, 50vw" 
                className="object-cover" 
                onError={() => setImageError(true)} 
              />
            </div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-8 bg-boutique-light dark:bg-[#1A1715] p-3 md:p-4 drop-shadow-2xl z-30 flex items-center gap-3 border border-neutral-200 dark:border-neutral-800 rounded-sm scale-90 md:scale-100 origin-bottom-left"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 relative bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="w-full h-full bg-amber-600/20" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-widest">Trending</p>
                <p className="text-xs md:text-sm font-bold text-neutral-900 dark:text-neutral-50">Velvet Trench</p>
              </div>
            </motion.div>

          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}