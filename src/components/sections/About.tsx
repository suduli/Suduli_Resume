import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { RESUME_DATA } from '../../data/resumeData';

const About: React.FC = () => {
  const { t } = useTranslation();
  const { about } = RESUME_DATA;
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="about" className="py-20 bg-dark-bg/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title text-center mb-16">
            <span className="text-3xl md:text-4xl font-orbitron font-bold text-white relative inline-block">
              {t('sections.about')}
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></span>
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-xl font-rajdhani font-semibold text-primary">
                {about.intro}
              </p>
              <p className="text-gray-300 font-rajdhani text-lg leading-relaxed">
                {about.details}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {about.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-dark-card border border-gray-800 p-6 rounded-lg text-center shadow-lg hover:border-primary/50 transition-colors duration-300"
                >
                  <div className="text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-rajdhani font-bold text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
