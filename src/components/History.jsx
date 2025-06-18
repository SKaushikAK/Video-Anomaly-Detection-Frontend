import { useState, useEffect, useRef } from 'react';
import axios from "../api/index";
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  title: {
    fontSize: '2rem',
    color: 'white',
    marginBottom: '2rem'
  },
  videoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem'
  },
  videoCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)'
    }
  },
  videoThumbnail: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    cursor: 'pointer',
    backgroundColor: '#f0f0f0'
  },
  anomalousFrame: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    border: '3px solid #ff0000',
    marginTop: '10px'
  },
  videoInfo: {
    padding: '1rem'
  },
  videoTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  videoDetails: {
    color: '#666',
    fontSize: '0.9rem'
  },
  predictionBadge: {
    display: 'inline-block',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    marginTop: '0.5rem'
  },
  fightBadge: {
    backgroundColor: '#ffebee',
    color: '#c62828'
  },
  nonFightBadge: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32'
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#666'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '90%',
    maxHeight: '90vh',
    width: '1200px',
    position: 'relative',
    overflowY: 'auto'
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    ':hover': {
      color: '#333'
    }
  },
  previewVideo: {
    width: '100%',
    maxHeight: '70vh',
    borderRadius: '8px',
    backgroundColor: '#000'
  },
  previewTitle: {
    marginTop: '10px',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  previewDetails: {
    marginTop: '5px',
    color: '#666'
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#ffebee',
    borderRadius: '4px'
  },
  convertingMessage: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#fff3cd',
    color: '#856404',
    borderRadius: '4px',
    margin: '1rem 0'
  },
  modalGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    alignItems: 'start'
  },
  videoSection: {
    flex: 1
  },
  frameSection: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #dee2e6'
  },
  frameTitle: {
    color: '#333',
    marginBottom: '15px',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  anomalousFrameLarge: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'contain',
    border: '3px solid #ff0000',
    borderRadius: '8px',
    marginBottom: '10px'
  },
  frameDescription: {
    color: '#666',
    fontSize: '0.9rem',
    lineHeight: '1.5'
  }
};

function History() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/uploads');
        const videoFiles = response.data.files;
        console.log('Fetched video files:', videoFiles);
        
        const videosWithPredictions = await Promise.all(
          videoFiles.map(async (filename) => {
            try {
              const predictionResponse = await axios.get(`http://localhost:5000/predict/${filename}`);
              return {
                filename,
                prediction: predictionResponse.data.label,
                confidence: predictionResponse.data.confidence,
                anomalous_frame_path: predictionResponse.data.anomalous_frame_path,
                uploadDate: new Date().toISOString()
              };
            } catch (error) {
              console.error(`Error getting prediction for ${filename}:`, error);
              return {
                filename,
                prediction: 'Unknown',
                confidence: 0,
                anomalous_frame_path: null,
                uploadDate: new Date().toISOString()
              };
            }
          })
        );
        
        setVideos(videosWithPredictions);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Error loading video history: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      const initializePlayer = async () => {
        try {
          const videoUrl = `http://localhost:5000/uploads/${encodeURIComponent(selectedVideo.filename)}`;
          let mimeType = 'video/mp4';
          
          if (selectedVideo.filename.toLowerCase().endsWith('.webm')) {
            mimeType = 'video/webm';
          } else if (selectedVideo.filename.toLowerCase().endsWith('.ogg')) {
            mimeType = 'video/ogg';
          }

          const options = {
            controls: true,
            responsive: true,
            fluid: true,
            sources: [{
              src: videoUrl,
              type: mimeType
            }],
            html5: {
              vhs: {
                overrideNative: true
              }
            }
          };

          // Dispose of any existing player
          if (playerRef.current) {
            playerRef.current.dispose();
          }

          playerRef.current = videojs(videoRef.current, options, function onPlayerReady() {
            console.log('Player is ready');
            this.on('error', () => {
              console.error('Video player error:', this.error());
              setError(`Error playing video: ${this.error().message}`);
            });
          });

          return () => {
            if (playerRef.current) {
              playerRef.current.dispose();
            }
          };
        } catch (err) {
          console.error('Error initializing video player:', err);
          setError('Error playing video: ' + err.message);
        }
      };

      initializePlayer();
    }
  }, [selectedVideo]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setError(null);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
    setError(null);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Loading videos...</h1>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Video History</h1>
      {error && <p style={styles.errorMessage}>{error}</p>}
      {videos.length === 0 ? (
        <p style={styles.loading}>No videos found in the uploads directory.</p>
      ) : (
        <div style={styles.videoGrid}>
          {videos.map((video) => (
            <div key={video.filename} style={styles.videoCard}>
              <video
                src={`http://localhost:5000/uploads/${encodeURIComponent(video.filename)}`}
                style={styles.videoThumbnail}
                onClick={() => handleVideoClick(video)}
                controls
                preload="metadata"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error('Video error:', e.target.error);
                  setError(`Error loading video: ${e.target.error.message}`);
                }}
              />
              {video.prediction.includes('Fight') && video.anomalous_frame_path && (
                <img
                  src={`http://localhost:5000/uploads/${encodeURIComponent(video.anomalous_frame_path)}`}
                  alt="Anomalous Frame"
                  style={styles.anomalousFrame}
                />
              )}
              <div style={styles.videoInfo}>
                <h3 style={styles.videoTitle}>{video.filename}</h3>
                <p style={styles.videoDetails}>
                  Uploaded: {new Date(video.uploadDate).toLocaleDateString()}
                </p>
                <div
                  style={{
                    ...styles.predictionBadge,
                    ...(video.prediction.includes('Fight')
                      ? styles.fightBadge
                      : styles.nonFightBadge)
                  }}
                >
                  {video.prediction} ({Math.round(video.confidence * 100)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedVideo && (
        <div style={styles.modal} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={handleCloseModal}>×</button>
            <div style={styles.modalGrid}>
              <div style={styles.videoSection}>
                <div data-vjs-player>
                  <video
                    ref={videoRef}
                    className="video-js vjs-big-play-centered"
                    style={styles.previewVideo}
                  >
                    <p className="vjs-no-js">
                      To view this video please enable JavaScript, and consider upgrading to a
                      web browser that supports HTML5 video
                    </p>
                  </video>
                </div>
                <h3 style={styles.previewTitle}>{selectedVideo.filename}</h3>
                <p style={styles.previewDetails}>
                  Uploaded: {new Date(selectedVideo.uploadDate).toLocaleDateString()}
                </p>
                <div
                  style={{
                    ...styles.predictionBadge,
                    ...(selectedVideo.prediction.includes('Fight')
                      ? styles.fightBadge
                      : styles.nonFightBadge)
                  }}
                >
                  {selectedVideo.prediction} ({Math.round(selectedVideo.confidence * 100)}%)
                </div>
              </div>

              {selectedVideo.prediction.includes('Fight') && selectedVideo.anomalous_frame_path && (
                <div style={styles.frameSection}>
                  <h4 style={styles.frameTitle}>Anomalous Frame</h4>
                  <img
                    src={`http://localhost:5000/uploads/${encodeURIComponent(selectedVideo.anomalous_frame_path)}`}
                    alt="Anomalous Frame"
                    style={styles.anomalousFrameLarge}
                  />
                  <p style={styles.frameDescription}>
                    This frame was detected as containing anomalous activity.
                    The red border indicates the area of interest.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History; 