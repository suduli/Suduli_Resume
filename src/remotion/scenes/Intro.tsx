import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export const Intro: React.FC<{ name: string; title: string }> = ({ name, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 200 }
  });

  const opacity = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200 }
  });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-gradient-to-br from-dark-bg to-dark-card">
      <div style={{ transform: `scale(${scale})` }} className="text-center">
        <h1 className="text-8xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-8">
          {name}
        </h1>
        <h2
            style={{ opacity }}
            className="text-4xl font-rajdhani font-bold text-white tracking-widest uppercase"
        >
          {title}
        </h2>
      </div>

      {/* Decorative Particles */}
      <div className="absolute inset-0 pointer-events-none">
          {/* We could add particles here if we want, but keeping it simple for now */}
      </div>
    </AbsoluteFill>
  );
};
