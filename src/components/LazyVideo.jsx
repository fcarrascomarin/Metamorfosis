import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';

const activeVideos = new Set();

function pauseOthers(current) {
  activeVideos.forEach((video) => {
    if (video !== current && !video.paused) video.pause();
  });
}

export default function LazyVideo({ src, poster, title, className = '' }) {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => () => {
    if (videoRef.current) activeVideos.delete(videoRef.current);
  }, []);

  const play = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (!loaded) {
      video.src = video.dataset.src;
      video.load();
      setLoaded(true);
    }
    pauseOthers(video);
    activeVideos.add(video);
    try {
      await video.play();
    } catch {
      // El navegador puede exigir una segunda interacción; los controles quedan visibles.
    }
  };

  return (
    <div className={`lazy-video ${className}`}>
      <video
        ref={videoRef}
        data-src={src}
        poster={poster}
        preload="none"
        controls={loaded}
        playsInline
        aria-label={title}
        onPlay={(event) => pauseOthers(event.currentTarget)}
        onEnded={(event) => activeVideos.delete(event.currentTarget)}
      />
      {!loaded && (
        <button type="button" className="video-trigger" onClick={play} aria-label={`Reproducir ${title}`}>
          <Icon name="play_arrow" />
          <span>Reproducir</span>
        </button>
      )}
    </div>
  );
}
