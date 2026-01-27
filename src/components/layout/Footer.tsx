import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { RESUME_DATA } from '../../data/resumeData';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-card py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 font-rajdhani">
              &copy; {new Date().getFullYear()} {RESUME_DATA.hero.name}. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            {RESUME_DATA.social.map((link) => {
              let Icon = FaGithub;
              if (link.platform === 'LinkedIn') Icon = FaLinkedin;
              if (link.platform === 'Twitter') Icon = FaTwitter;

              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                  aria-label={link.platform}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
