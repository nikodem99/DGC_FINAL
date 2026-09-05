import { useEffect } from "react";
import "./VideoModal.scss";

const VideoModal = ({ isOpen, videoId, videoSrc, poster, onClose }) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || (!videoId && !videoSrc)) return null;

  return (
    <div className="videoModal">
      <div className="videoOverlay" onClick={onClose} />

      <div className="videoContent">
        <button className="closeBtn" onClick={onClose}>
          ×
        </button>

        {videoSrc ? (
          // Plik hostowany u nas: nic sie nie pobiera, dopoki modal nie zostanie otwarty
          <video
            src={videoSrc}
            poster={poster}
            controls
            autoPlay
            playsInline
            preload="none"
          />
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="Video Player"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};

export default VideoModal;
