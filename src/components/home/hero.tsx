import { motion } from 'motion/react';
import { AuroraBackground } from '@/components/ui/aurora-background';
export default function HeroMain() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold text-white text-center">
          Insights & Innovation
        </div>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Discover the latest trends, best practices, and cutting-edge solutions in technology and digital
          transformation.
        </p>
        <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
          Discover now
        </button>
      </motion.div>
    </AuroraBackground>
  );
}