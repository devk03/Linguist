import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import UploadModal from "./uploadModal";
import AOS from "aos";
import "aos/dist/aos.css";

const LandingPage: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleUpload = (file: File) => {
    // Create a URL for the uploaded file
    const videoUrl = URL.createObjectURL(file);
    navigate("/video", { state: { videoUrl } });
  };

  const handleModalClose = () => {
    setIsUploadModalOpen(false);
  };

  return (
    <section className="container grid lg:grid-cols-2 place-items-center min-h-screen">
      <div className="text-center lg:text-start space-y-6 flex flex-col justify-center">
        <main className="text-5xl md:text-6xl font-bold" data-aos="fade-up">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
              Linguist:
            </span>{" "}
            Break
          </h1>{" "}
          <h2 className="inline">
            the{" "}
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              Sound
            </span>{" "}
            Barrier
          </h2>
        </main>

        <p
          className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Use Linguist to understand any video, regardless of audio quality or
          language.
        </p>

        <div
          className="space-y-4 md:space-y-0 md:space-x-4"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <Button
            className="w-full md:w-1/3"
            onClick={() => setIsUploadModalOpen(true)}
          >
            Get Started
          </Button>
          <UploadModal
            isOpen={isUploadModalOpen}
            onClose={handleModalClose}
            onUpload={handleUpload}
          />
        </div>
      </div>

      {/* Shadow effect */}
      <div className="shadow" data-aos="fade-left" data-aos-delay="600"></div>
    </section>
  );
};

export default LandingPage;
