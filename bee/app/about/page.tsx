"use client";

import TopNav from "@/components/navigation/TopNav";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    },
  };

  return (
    <main className="min-h-screen bg-boutique-light dark:bg-boutique-dark transition-colors duration-500 selection:bg-amber-600 selection:text-white">
      <TopNav />
      
      <section className="w-full max-w-7xl mx-auto px-5 md:px-12 py-16 md:py-24 overflow-hidden">
        <motion.div 
          className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* LEFT: The Brand Story */}
          <div className="w-full lg:w-1/2 flex flex-col items-start z-10 relative">
            {/* Background Watermark */}
            <motion.span 
              variants={itemVariants}
              className="absolute -top-10 -left-10 text-[150px] md:text-[250px] font-script text-neutral-200/50 dark:text-neutral-800/30 select-none -z-10 tracking-tighter leading-none"
            >
              Vision
            </motion.span>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-neutral-900 dark:text-neutral-50 leading-[0.9]"
            >
              Not for <br />
              <span className="font-script lowercase text-amber-600 dark:text-amber-500 text-6xl md:text-8xl tracking-normal italic ml-[-5px]">
                everyone.
              </span>
            </motion.h1>

            <motion.div variants={itemVariants} className="mt-10 space-y-6 text-base md:text-lg text-neutral-600 dark:text-neutral-400 font-medium max-w-lg">
              <p>
                BEE Empire's was built on a singular premise: fashion should be unapologetic. We don't design for the crowd. We curate highly limited, premium drops for the modern woman who commands the room the moment she steps inside.
              </p>
              <p>
                Every piece in our collection is carefully vetted for quality, texture, and silhouette. Our drops are exclusive—meaning once a collection sells out, it rarely returns. 
              </p>
              <p className="text-neutral-900 dark:text-neutral-50 font-bold border-l-2 border-amber-600 pl-4 py-1 italic">
                "Your aesthetic is your introduction. Make it impossible to ignore."
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12">
              <Link 
                href="/collection" 
                className="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-50 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              >
                <span className="border-b-2 border-neutral-900 dark:border-neutral-50 group-hover:border-amber-600 dark:group-hover:border-amber-500 pb-1 transition-colors">
                  View the Current Drop
                </span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: Editorial Image */}
          <motion.div 
            variants={itemVariants}
            className="w-full lg:w-1/2 relative h-[60vh] min-h-[500px] lg:h-[80vh] w-full"
          >
            <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 drop-shadow-2xl overflow-hidden rounded-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
              <Image 
                src="/about-hero.jpg" 
                alt="Behind the scenes at BEE Empire's" 
                fill
                className="object-cover object-center scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
                priority
              />
              
              {/* Overlay Text */}
              <div className="absolute bottom-8 left-8 z-20">
                <p className="text-white text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Established</p>
                <p className="text-white font-script text-4xl">MMXXIV</p>
              </div>
            </div>
            
            {/* Decorative offset border frame */}
            <div className="absolute -inset-4 border border-neutral-300 dark:border-neutral-700 -z-10 hidden md:block" />
          </motion.div>

        </motion.div>
      </section>
    </main>
  );
}