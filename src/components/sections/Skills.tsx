import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { RESUME_DATA } from '../../data/resumeData';

const Skills: React.FC = () => {
  const { t } = useTranslation();
  const { skills } = RESUME_DATA;

  // Extract categories
  const categories = Array.from(new Set(skills.map(s => s.category)));
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);

  const filteredSkills = skills.filter(s => s.category === activeCategory);

  return (
    <section id="skills" className="py-20 bg-dark-bg/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title text-center mb-8">
          <span className="text-3xl md:text-4xl font-orbitron font-bold text-white relative inline-block">
            {t('sections.skills')}
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></span>
          </span>
        </h2>
        <p className="text-center text-gray-400 font-rajdhani mb-12 max-w-2xl mx-auto">
          {t('skills.subtitle')}
        </p>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-rajdhani font-bold text-sm transition-all duration-300 border border-gray-700
                ${activeCategory === cat
                  ? 'bg-primary text-dark-bg scale-105 shadow-[0_0_10px_rgba(0,245,255,0.4)]'
                  : 'bg-dark-card text-gray-400 hover:text-white hover:border-primary/50'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode='popLayout'>
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-dark-card border border-gray-800 p-6 rounded-lg hover:border-primary/50 transition-colors group relative overflow-hidden"
              >
                {/* Progress Bar Background */}
                <div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-50"
                  style={{ width: `${skill.level}%` }}
                />

                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-orbitron font-bold text-white group-hover:text-primary transition-colors">
                    {skill.name}
                  </h3>
                  <span className="font-rajdhani font-bold text-secondary text-sm">
                    {skill.level}%
                  </span>
                </div>

                <p className="text-gray-400 font-rajdhani text-sm mb-4 h-10 overflow-hidden">
                  {skill.desc}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {skill.tags.map(tag => (
                    <span key={tag} className="text-xs font-rajdhani px-2 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-500 font-rajdhani italic border-t border-gray-800 pt-3">
                  {skill.experience}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
