import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { RESUME_DATA } from '../../data/resumeData';
import { FaGraduationCap } from 'react-icons/fa';

const Education: React.FC = () => {
  const { t } = useTranslation();
  const { education } = RESUME_DATA;

  return (
    <section id="education" className="py-20 bg-dark-bg/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title text-center mb-16">
          <span className="text-3xl md:text-4xl font-orbitron font-bold text-white relative inline-block">
            {t('sections.education')}
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></span>
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {education.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-dark-card border border-gray-800 p-8 rounded-xl flex items-start space-x-6 hover:border-secondary/50 transition-colors"
            >
              <div className="text-secondary text-4xl mt-1">
                <FaGraduationCap />
              </div>
              <div>
                <h3 className="text-xl font-orbitron font-bold text-white mb-2">
                  {item.degree}
                </h3>
                <p className="text-primary font-rajdhani font-bold mb-1">
                  {item.institution}
                </p>
                <p className="text-gray-500 font-rajdhani text-sm mb-4">
                  {item.year}
                </p>
                <p className="text-gray-300 font-rajdhani">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
