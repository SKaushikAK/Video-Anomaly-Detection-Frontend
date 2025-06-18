import React, { useEffect, useRef } from 'react'
import "cloudinary-video-player/cld-video-player.min.css";

const VideoPlayer = () => {

    const cloudinary = useRef();
    const videoRef = useRef();


    useEffect(() => {
        if (cloudinary.current) return;
        cloudinary.current = window.cloudinary;
        cloudinary.current.videoPlayer(videoRef.current, {
            cloud_name: 'dxxwzqzqy',
        });
    }, []);
  return (
    <div>
      <video 
      ref={videoRef}

      />
    </div>
  )
}

export default VideoPlayer

