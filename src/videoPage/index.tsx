import React, { useMemo, useState } from "react";
import ReactPlayer from "react-player";
import { ConvexAiChat } from "@/aiChat";
import { useLocation } from "react-router-dom";
import { ConvexProvider, ConvexReactClient, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

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

  return (
    <div className="mt-8 p-4 text-center w-full border-2 border-white rounded-lg bg-gray-900 h-48 flex justify-center items-center text-3xl">
      {currentSubtitle}
    </div>
  );
};

const VideoProcessor: React.FC = () => {
  const videoCall = useAction(api.functions.serve.processVideo);

  React.useEffect(() => {
    const processVideo = async () => {
      const videoElement = document.querySelector("video");
      if (videoElement) {
        const videoSource = videoElement.src;
        try {
          const response = await fetch(videoSource);
          const videoBlob = await response.blob();
          console.log("Video blob created:", videoBlob);
          const serveResponse = await videoCall({ formData: videoBlob });
          console.log(serveResponse);
        } catch (error) {
          console.error("Error processing video:", error);
        }
      }
    };

    const checkForVideo = setInterval(() => {
      if (document.querySelector("video")) {
        clearInterval(checkForVideo);
        processVideo().catch(console.error);
      }
    }, 100);

    return () => clearInterval(checkForVideo);
  }, [videoCall]);

  return null; // This component doesn't render anything
};

const VideoPage: React.FC = () => {
  const convexURL = import.meta.env.VITE_CONVEX_URL as string;
  const client = useMemo(() => new ConvexReactClient(convexURL), [convexURL]);
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
    <ConvexProvider client={client}>
      <div className="video-page p-4 bg-black h-screen w-screen">
        <h1 className="text-2xl font-bold mb-4">
          <a href="/" className="hover:underline">
            Linguist
          </a>
        </h1>
        <div className="flex">
          <div className="w-3/4 pr-4 mt-4 ">
            <div className="video-player border-2 border-white rounded-lg bg-gray-800 p-1">
              <ReactPlayer
                url={videoUrl}
                width="100%"
                height="auto"
                controls={true}
                onDuration={handleDuration}
                onProgress={handleProgress}
                className="rounded-lg"
              />
            </div>
            <SubtitleComponent
              text={subtitles}
              chunkDuration={chunkDuration}
              currentTime={currentTime}
            />
          </div>
          <div className="w-1/3 h-[calc(100vh-4rem)]">
            <ConvexAiChat
              convexUrl={convexURL}
              name="Linguist"
              infoMessage="AI can make mistakes. Verify answers."
              welcomeMessage="Hey there, what can I help you with?"
            />
          </div>
        </div>
        <VideoProcessor />
      </div>
    </ConvexProvider>
  );
};

export default VideoPage;
