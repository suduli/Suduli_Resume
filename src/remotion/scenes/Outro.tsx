import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import type { ContactData } from '../../data/resumeData';

export const Outro: React.FC<{ contact: ContactData }> = ({ contact }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 10 }
  });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-dark-bg">
      <div style={{ transform: `scale(${scale})` }} className="bg-dark-card border border-primary/50 p-16 rounded-3xl text-center shadow-2xl">
        <h2 className="text-5xl font-orbitron font-bold text-white mb-12">Let's Collaborate</h2>

        <div className="space-y-8">
            <div className="text-3xl text-gray-300 font-rajdhani">
                <span className="text-primary font-bold">Email:</span> {contact.email}
            </div>
            <div className="text-3xl text-gray-300 font-rajdhani">
                <span className="text-primary font-bold">LinkedIn:</span> suduli
            </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
