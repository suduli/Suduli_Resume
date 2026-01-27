import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import type { ExperienceItem } from '../../data/resumeData';

export const Experience: React.FC<{ experience: ExperienceItem[] }> = ({ experience }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  // Scroll animation
  const scrollY = interpolate(
    frame,
    [0, 500], // Scroll over 500 frames
    [height / 2, -height * 1.5], // Start centered, scroll up
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill className="bg-dark-bg text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-transparent to-dark-bg z-10 pointer-events-none"></div>

        <div style={{ transform: `translateY(${scrollY}px)` }} className="w-full flex flex-col items-center pt-20 pb-20">
            <h2 className="text-6xl font-orbitron font-bold text-primary mb-20">Professional Experience</h2>

            <div className="flex flex-col gap-16 max-w-4xl w-full px-8 border-l-4 border-gray-800 ml-20">
                {experience.map((item, index) => (
                    <div key={index} className="relative pl-12">
                        <div className="absolute left-[-22px] top-2 w-10 h-10 bg-dark-bg border-4 border-secondary rounded-full"></div>
                        <h3 className="text-4xl font-bold font-orbitron text-white">{item.title}</h3>
                        <p className="text-2xl text-secondary font-rajdhani font-semibold mb-2">{item.company}</p>
                        <p className="text-xl text-gray-400 font-rajdhani italic mb-4">{item.period}</p>
                        <ul className="list-disc ml-6 space-y-2">
                            {item.responsibilities.slice(0, 3).map((resp, i) => (
                                <li key={i} className="text-xl text-gray-300 font-rajdhani">{resp}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </AbsoluteFill>
  );
};
