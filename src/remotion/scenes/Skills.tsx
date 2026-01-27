import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import type { SkillItem } from '../../data/resumeData';

export const Skills: React.FC<{ skills: SkillItem[] }> = ({ skills }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Filter top skills (e.g. level > 80 or specific categories) to avoid overcrowding
  const topSkills = skills.filter(s => s.level >= 80).slice(0, 12);

  const titleOpacity = interpolate(frame, [0, 20], [0, 1]);

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-dark-bg p-20">
      <h2
        style={{ opacity: titleOpacity }}
        className="text-6xl font-orbitron font-bold text-white mb-16"
      >
        Core Competencies
      </h2>

      <div className="grid grid-cols-3 gap-8 w-full max-w-6xl">
        {topSkills.map((skill, index) => {
          const delay = index * 5;
          const scale = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15 }
          });

          return (
            <div
              key={skill.name}
              style={{ transform: `scale(${scale})` }}
              className="bg-dark-card border border-primary/30 p-6 rounded-xl flex flex-col items-center justify-center shadow-lg"
            >
              <h3 className="text-2xl font-rajdhani font-bold text-white mb-2">{skill.name}</h3>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${skill.level}%` }}
                  />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
