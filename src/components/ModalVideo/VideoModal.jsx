import { useState } from "react";
import VideoModal from "../VideoModal/VideoModal";

const VideoSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
        <div
          className="video-btn"
          onClick={() => setIsOpen(true)}
        >
          <i className="flaticon-play"></i>
        </div>

      <VideoModal
        isOpen={isOpen}
        videoId="74DWwSxsVSs?si=qaPBPdX-wN9e8VH0"
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default VideoSection;