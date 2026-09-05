import { useState } from "react";
import VideoModal from "../VideoModal/VideoModal";

const VideoSection = ({ videoSrc = '/video/dgc-hero.mp4', poster = '/video/hero-plakat.jpg', videoId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
        <button
          type="button"
          className="video-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Obejrzyj film o DGC"
        >
          <i className="flaticon-play"></i>
        </button>
        <span className="video-label">Obejrzyj film</span>

      <VideoModal
        isOpen={isOpen}
        videoSrc={videoSrc}
        poster={poster}
        videoId={videoId}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default VideoSection;