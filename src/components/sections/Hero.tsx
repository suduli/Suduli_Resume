import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { RESUME_DATA } from '../../data/resumeData';
import { FaDownload } from 'react-icons/fa';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const { hero } = RESUME_DATA;

  return (
    <section id="home" className="min-h-screen flex items-center justify-center py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 text-center md:text-left"
          >
            <h2 className="text-primary font-rajdhani text-xl md:text-2xl mb-2 font-semibold">
              {t('hero.greeting')}
            </h2>
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              {hero.name}
            </h1>
            <h3 className="text-2xl md:text-3xl font-rajdhani text-secondary font-bold mb-6">
              {hero.title}
            </h3>
            <p className="text-gray-300 font-rajdhani text-lg mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
              {hero.description}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {hero.actions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  download={action.download}
                  className={`px-8 py-3 rounded-full font-orbitron font-bold text-sm tracking-wider transition-all duration-300 transform hover:scale-105 flex items-center gap-2
                    ${action.primary
                      ? 'bg-primary text-dark-bg hover:bg-primary/80 shadow-[0_0_15px_rgba(0,245,255,0.5)]'
                      : 'border border-primary text-primary hover:bg-primary/10'}`}
                >
                  {action.icon === 'FaDownload' && <FaDownload />}
                  {/* Translate buttons using static keys for now if needed, or stick to data */}
                   {action.label === 'Get In Touch' ? t('hero.get_in_touch') :
                    action.label === 'Download Resume' ? t('hero.download_resume') :
                    action.label === 'Learn More' ? t('hero.learn_more') : action.label}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 mt-12 md:mt-0 flex justify-center"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-primary/20 rounded-full filter blur-xl animate-pulse-slow"></div>
              <div className="absolute inset-0 border-2 border-primary/50 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-4 border border-secondary/50 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '5s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-dark-card border border-gray-700 flex items-center justify-center overflow-hidden">
                      {/* Placeholder or Image */}
                      <span className="text-6xl text-gray-700 font-orbitron">SKB</span>
                  </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <a href="#about" className="text-primary hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
