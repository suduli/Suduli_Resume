import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { RESUME_DATA } from '../../data/resumeData';
import { FaEnvelope, FaLinkedin, FaPhone, FaMapMarkerAlt, FaEye } from 'react-icons/fa';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { contact } = RESUME_DATA;
  const [showPhone, setShowPhone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here (e.g. EmailJS or backend)
    alert("Message sent! (Simulation)");
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full filter blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title text-center mb-16">
          <span className="text-3xl md:text-4xl font-orbitron font-bold text-white relative inline-block">
            {t('sections.contact')}
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></span>
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-orbitron font-bold text-white mb-6">Let's Connect</h3>
            <p className="text-gray-300 font-rajdhani text-lg mb-8">
              I'm ready to discuss automotive testing opportunities, IV&V collaboration, or share insights about embedded systems validation.
            </p>

            <div className="space-y-6">
              <ContactItem icon={FaEnvelope} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
              <ContactItem icon={FaLinkedin} label="LinkedIn" value="linkedin.com/in/suduli" href={`https://${contact.linkedin}`} />
              <div className="flex items-center space-x-4 bg-dark-card p-4 rounded-lg border border-gray-800">
                <div className="w-12 h-12 rounded-full bg-dark-bg flex items-center justify-center text-primary">
                  <FaPhone size={20} />
                </div>
                <div>
                  <p className="text-gray-500 font-rajdhani text-sm">Phone</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-rajdhani font-semibold text-lg">
                      {showPhone ? contact.phone : "+91 **********"}
                    </p>
                    <button
                      onClick={() => setShowPhone(!showPhone)}
                      className="text-gray-400 hover:text-primary transition-colors ml-2"
                      title="Reveal Phone"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
              </div>
              <ContactItem icon={FaMapMarkerAlt} label="Location" value={contact.location} />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-dark-card border border-gray-800 p-8 rounded-xl shadow-2xl relative"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-400 font-rajdhani mb-2">{t('contact.form.name')}</label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-400 font-rajdhani mb-2">{t('contact.form.email')}</label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-400 font-rajdhani mb-2">{t('contact.form.message')}</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="I'd like to discuss a project..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary text-dark-bg font-orbitron font-bold py-4 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-[1.02] duration-200"
              >
                {t('contact.form.send')}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ContactItem: React.FC<{ icon: any, label: string, value: string, href?: string }> = ({ icon: Icon, label, value, href }) => (
  <div className="flex items-center space-x-4 bg-dark-card p-4 rounded-lg border border-gray-800 hover:border-primary/30 transition-colors">
    <div className="w-12 h-12 rounded-full bg-dark-bg flex items-center justify-center text-primary">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-gray-500 font-rajdhani text-sm">{label}</p>
      {href ? (
        <a href={href} className="text-white font-rajdhani font-semibold text-lg hover:text-primary transition-colors">
          {value}
        </a>
      ) : (
        <p className="text-white font-rajdhani font-semibold text-lg">{value}</p>
      )}
    </div>
  </div>
);

export default Contact;
