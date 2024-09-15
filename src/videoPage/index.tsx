import React, { useState } from "react";
import ReactPlayer from "react-player";
import { ConvexAiChat } from "@/aiChat";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

interface SubtitleProps {
  text: string[];
  chunkDuration: number;
  currentTime: number;
}

const SubtitleComponent: React.FC<SubtitleProps> = ({
  text,
  chunkDuration,
  currentTime,
}) => {
  const currentIndex = Math.floor(currentTime / chunkDuration);
  const currentSubtitle = text[currentIndex] || "";

  return <div className="mt-4 p-4 rounded">{currentSubtitle}</div>;
};

const VideoPage: React.FC = () => {
  const [duration, setDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const location = useLocation();
  const { videoUrl } = location.state as { videoUrl: string };

  const handleDuration = (duration: number) => {
    setDuration(duration);
    console.log("Duration:", duration);
  };

  const handleProgress = (state: { playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const subtitles = [
    "This is the first subtitle.",
    "This is the second subtitle.",
    "This is the third subtitle.",
    "This is the fourth subtitle.",
    "This is the fifth subtitle.",
  ];

  const chunkDuration = 10; // 10 seconds per subtitle

  return (
    <div className="video-page p-4">
      <h1 className="text-2xl font-bold mb-4">
        <a href="/" className="hover:underline">
          Linguist
        </a>
      </h1>
      <div className="flex">
        <div className="w-3/4 pr-4">
          <div className="video-player">
            <ReactPlayer
              url={videoUrl}
              width="100%"
              height="auto"
              controls={true}
              onDuration={handleDuration}
              onProgress={handleProgress}
            />
            {duration && (
              <p className="mt-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            )}
          </div>
          <SubtitleComponent
            text={subtitles}
            chunkDuration={chunkDuration}
            currentTime={currentTime}
          />
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
