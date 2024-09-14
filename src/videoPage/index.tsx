import React from 'react';
import ReactPlayer from 'react-player';

const VideoPage: React.FC = () => {
  return (
    <div className="video-page">
      <h1>Video Page</h1>
      <div className="video-player">
        <ReactPlayer
          url="/cropped_video.mp4" 
          width="70%"
          height="90%"
          controls={true}
        />
      </div>
      {/* Placeholder for chat or other components */}
      <div className="additional-components-placeholder">
        Additional Components Go Here
      </div>
    </div>
  );
};

export default VideoPage;
