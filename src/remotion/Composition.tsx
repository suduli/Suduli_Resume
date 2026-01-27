import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Intro } from './scenes/Intro';
import { Skills } from './scenes/Skills';
import { Experience } from './scenes/Experience';
import { Outro } from './scenes/Outro';
import type { ResumeData } from '../data/resumeData';

export const ResumeHighlights: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <AbsoluteFill className="bg-dark-bg text-white">
      <Sequence from={0} durationInFrames={150}>
        <Intro name={data.hero.name} title={data.hero.title} />
      </Sequence>
      <Sequence from={150} durationInFrames={300}>
        <Skills skills={data.skills} />
      </Sequence>
      <Sequence from={450} durationInFrames={600}>
        <Experience experience={data.experience} />
      </Sequence>
      <Sequence from={1050} durationInFrames={300}>
        <Outro contact={data.contact} />
      </Sequence>
    </AbsoluteFill>
  );
};
