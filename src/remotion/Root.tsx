import { Composition } from 'remotion';
import { ResumeHighlights } from './Composition';
import { RESUME_DATA } from '../data/resumeData';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ResumeHighlights"
        component={ResumeHighlights}
        durationInFrames={30 * 45} // 45 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          data: RESUME_DATA
        }}
      />
    </>
  );
};
