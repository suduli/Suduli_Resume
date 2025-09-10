import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LazyLoad from '../../components/common/LazyLoad';

// Lazy load components
const AboutComponent = lazy(() => import('../../components/About/About'));
const Skills = lazy(() => import('../../components/Skills/Skills'));
const Education = lazy(() => import('../../components/Education/Education'));

const AboutPage = () => {
  // Sample data - in a real app, this would come from an API or data service
  const aboutData = {
    name: 'John Doe',
    title: 'Full Stack Developer',
    summary: 'Passionate developer with 5+ years of experience in web development.',
    description: 'I specialize in creating modern, responsive web applications using React, Node.js, and other cutting-edge technologies. With a strong focus on user experience and performance optimization, I strive to deliver high-quality solutions that meet both user needs and business goals.\n\nMy approach combines technical expertise with creative problem-solving to tackle complex challenges effectively.',
    highlights: [
      'Developed 20+ commercial web applications',
      'Contributed to multiple open-source projects',
      'Reduced application load time by 40% through performance optimization',
      'Implemented CI/CD pipelines that reduced deployment time by 60%',
      'Mentored junior developers and led technical workshops'
    ]
  };

  const skillsData = {
    categories: [
      {
        name: 'Frontend',
        skills: [
          { name: 'React', level: 90 },
          { name: 'JavaScript', level: 85 },
          { name: 'HTML/CSS', level: 90 },
          { name: 'TypeScript', level: 80 },
          { name: 'Redux', level: 75 }
        ]
      },
      {
        name: 'Backend',
        skills: [
          { name: 'Node.js', level: 85 },
          { name: 'Express', level: 80 },
          { name: 'MongoDB', level: 75 },
          { name: 'PostgreSQL', level: 70 },
          { name: 'REST API Design', level: 85 }
        ]
      },
      {
        name: 'Tools & Others',
        skills: [
          { name: 'Git', level: 90 },
          { name: 'Docker', level: 70 },
          { name: 'CI/CD', level: 75 },
          { name: 'AWS', level: 65 },
          { name: 'Testing', level: 80 }
        ]
      }
    ]
  };

  const educationData = {
    degrees: [
      {
        degree: 'Master of Computer Science',
        institution: 'University of Technology',
        location: 'San Francisco, CA',
        period: '2015 - 2017',
        description: 'Specialized in Software Engineering with focus on distributed systems.'
      },
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'State University',
        location: 'Boston, MA',
        period: '2011 - 2015',
        description: 'Graduated with honors. Participated in the ACM programming competition.'
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2019'
      },
      {
        name: 'Professional Scrum Master I',
        issuer: 'Scrum.org',
        date: '2018'
      },
      {
        name: 'Google Cloud Certified - Professional Cloud Developer',
        issuer: 'Google',
        date: '2020'
      }
    ]
  };

  return (
    <div className="about-page">
      <Suspense fallback={<LoadingSpinner />}>
        <AboutComponent data={aboutData} />
      </Suspense>
      
      <LazyLoad>
        <Suspense fallback={<LoadingSpinner />}>
          <Skills data={skillsData} />
        </Suspense>
      </LazyLoad>
      
      <LazyLoad>
        <Suspense fallback={<LoadingSpinner />}>
          <Education data={educationData} />
        </Suspense>
      </LazyLoad>
    </div>
  );
};

export default AboutPage;
