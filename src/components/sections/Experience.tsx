import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { RESUME_DATA } from '../../data/resumeData';
import { FaBriefcase, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const Experience: React.FC = () => {
  const { t } = useTranslation();
  const { experience } = RESUME_DATA;

  return (
    <section id="experience" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title text-center mb-16">
          <span className="text-3xl md:text-4xl font-orbitron font-bold text-white relative inline-block">
            {t('sections.experience')}
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></span>
          </span>
        </h2>

        <div className="relative border-l-2 border-gray-800 ml-4 md:ml-1/2 space-y-12">
          {experience.map((item, index) => (
            <ExperienceItem key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ExperienceItem: React.FC<{ item: any; index: number }> = ({ item, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative pl-8 md:pl-0`}
    >
      {/* Dot on the line */}
      <div className="absolute top-0 left-[-9px] md:left-1/2 md:ml-[-9px] w-5 h-5 rounded-full bg-dark-bg border-4 border-primary z-10"></div>

      <div className={`md:flex ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-start justify-between w-full`}>
         {/* Spacer for the other side */}
        <div className="hidden md:block md:w-5/12" />

        <div className={`md:w-5/12 ${isEven ? 'md:pr-8' : 'md:pl-8'}`}>
          <div className="bg-dark-card p-6 rounded-lg border border-gray-800 hover:border-primary/50 transition-all duration-300 shadow-lg relative group">
             {/* Glowing Border Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>

            <div className="flex flex-col mb-4">
              <h3 className="text-xl font-orbitron font-bold text-white mb-1 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center text-secondary font-rajdhani font-bold text-lg mb-2">
                <FaBriefcase className="mr-2" />
                {item.companyUrl ? (
                  <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {item.company}
                  </a>
                ) : (
                  <span>{item.company}</span>
                )}
              </div>
              <div className="flex items-center text-gray-500 font-rajdhani text-sm">
                <FaCalendarAlt className="mr-2" />
                {item.period}
              </div>
            </div>

            <ul className="space-y-2">
              {item.responsibilities.map((resp: string, idx: number) => (
                <li key={idx} className="flex items-start text-gray-300 font-rajdhani text-base">
                  <span className="text-primary mt-1 mr-2 flex-shrink-0 text-xs">
                    <FaCheckCircle />
                  </span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>

            {item.sublist && (
              <ul className="mt-2 ml-6 space-y-1 border-l border-gray-700 pl-4">
                {item.sublist.map((sub: string, idx: number) => (
                  <li key={idx} className="text-gray-400 font-rajdhani text-sm italic">
                    - {sub}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Experience;
