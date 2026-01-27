import Layout from './components/layout/Layout';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Education from './components/sections/Education';
import Contact from './components/sections/Contact';
import { Helmet } from 'react-helmet-async';
import { RESUME_DATA } from './data/resumeData';

function App() {
  return (
    <>
      <Helmet>
        <title>{RESUME_DATA.hero.name} | {RESUME_DATA.hero.title}</title>
        <meta name="description" content={RESUME_DATA.hero.description} />
        <meta name="keywords" content="Automotive, Resume, Test Lead, IV&V, ADAS, Embedded Systems" />
        <html lang="en" />
      </Helmet>

      <Layout>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </Layout>
    </>
  );
}

export default App;
