import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { RESUME_DATA } from '../../data/resumeData';
import { FaGithub, FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const { projects } = RESUME_DATA;

  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title text-center mb-16">
          <span className="text-3xl md:text-4xl font-orbitron font-bold text-white relative inline-block">
            {t('sections.projects')}
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></span>
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-dark-card border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(0,245,255,0.15)] hover:border-primary/50 transition-all duration-300 flex flex-col"
            >
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-dark-bg rounded-lg text-primary">
                    <FaGithub size={24} />
                    {/* Ideally dynamic icon based on type, using Github as generic or car */}
                  </div>
                  <div className="flex space-x-2">
                    {project.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                        title={link.label}
                      >
                        {link.icon === 'FaGithub' && <FaGithub />}
                        {link.icon === 'FaExternalLinkAlt' && <FaExternalLinkAlt />}
                        {link.icon === 'FaInfoCircle' && <FaInfoCircle />}
                        {!link.icon && <FaExternalLinkAlt />}
                      </a>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-orbitron font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                <p className="text-gray-400 font-rajdhani text-sm leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs font-rajdhani font-medium px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
