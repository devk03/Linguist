import React from "react";
import ReactPlayer from "react-player";
import { ConvexAiChat } from "@/aiChat";
import { Button } from "@/components/ui/button";

const VideoPage: React.FC = () => {
  return (
    <div className="video-page p-4">
      <h1 className="text-2xl font-bold mb-4">Video Page</h1>
      <div className="flex">
        <div className="w-3/4 pr-4">
          <div className="video-player">
            <ReactPlayer
              url="/cropped_video.mp4"
              width="100%"
              height="auto"
              controls={true}
            />
          </div>
          <div className="additional-components-placeholder mt-4">
            Additional Components Go Here
          </div>
        </div>
        <div className="w-1/6">
          <ConvexAiChat
            convexUrl={import.meta.env.VITE_CONVEX_URL as string}
            name="Linguist"
            infoMessage="AI can make mistakes. Verify answers."
            welcomeMessage="Hey there, what can I help you with?"
            renderTrigger={(onClick) => (
              <Button onClick={onClick} className="w-full">
                Ask Linguist
              </Button>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
