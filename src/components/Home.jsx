import { useState, useRef, useEffect } from 'react';
import axios from '../api/index';
import { FFmpeg } from '@ffmpeg/ffmpeg';


function Home() {
  const [video, setVideo] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [converting, setConverting] = useState(false);
  const videoRef = useRef(null);
  const ffmpegRef = useRef(new FFmpeg());

  useEffect(() => {
    const loadFFmpeg = async () => {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.load();
    };
    loadFFmpeg();
  }, []);

  const convertAVIToMP4 = async (file) => {
    try {
      setConverting(true);
      const ffmpeg = ffmpegRef.current;
      
      // Write the AVI file to FFmpeg's virtual filesystem
      await ffmpeg.writeFile('input.avi', new Uint8Array(await file.arrayBuffer()));
      
      // Convert AVI to MP4
      await ffmpeg.exec([
        '-i', 'input.avi',
        '-c:v', 'libx264',
        '-c:a', 'aac',
        'output.mp4'
      ]);
      
      // Read the converted MP4 file
      const data = await ffmpeg.readFile('output.mp4');
      
      // Create a new File object from the converted data
      return new File([data], file.name.replace('.avi', '.mp4'), { type: 'video/mp4' });
    } catch (err) {
      console.error('Error converting video:', err);
      throw err;
    } finally {
      setConverting(false);
    }
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file');
      return;
    }

    let videoFile = file;
    
    // If file is AVI, convert it to MP4
    if (file.name.toLowerCase().endsWith('.avi')) {
      try {
        videoFile = await convertAVIToMP4(file);
      } catch (err) {
        alert('Error converting video: ' + err.message);
        return;
      }
    }

    setVideo(videoFile);
    setPrediction(null);
    
    // Create preview URL
    const url = URL.createObjectURL(videoFile);
    setPreviewUrl(url);

    // Log video details for debugging
    console.log('Selected video:', {
      name: videoFile.name,
      type: videoFile.type,
      size: videoFile.size,
      url: url
    });
  };

  const handleUpload = async () => {
    if (!video) return alert('Please upload a video');

    const formData = new FormData();
    formData.append('video', video);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setPrediction(res.data);
      console.log(res.data);
      
    } catch (err) { 
      console.error(err);
      alert('Error while predicting');
    } finally {
      setLoading(false);
    }
  };

  // Clean up preview URL when component unmounts or video changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div style={styles.mainContainer}>
      <div style={styles.heroSection}>
        <h1 style={styles.heroTitle}>Anomaly Detection System</h1>
        <p style={styles.heroDescription}>
          Our advanced AI-powered system helps detect and analyze anomalous activities in video footage, 
          specifically focusing on identifying potential fight scenarios. Upload your video to get started.
        </p>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.leftContent}>
          <h3 style={styles.leftContentH3}>
            <span role="img" aria-label="features">✨</span> Key Features
          </h3>
          <ul style={styles.featuresList}>
            <li style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              Real-time video analysis
            </li>
            <li style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              Advanced AI detection algorithms
            </li>
            <li style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              Instant anomaly identification
            </li>
            <li style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              Detailed prediction results
            </li>
          </ul>
        </div>

        <div style={styles.rightContent}>
          <h3 style={styles.leftContentH3}>
            <span role="img" aria-label="upload">📤</span> Upload Video
          </h3>
          <input
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/avi"
            onChange={handleVideoChange}
            style={styles.fileInput}
          />
          
          {converting && (
            <p style={styles.convertingMessage}>Converting video format...</p>
          )}
          
          {previewUrl && (
            <div style={styles.previewContainer}>
              <video
                ref={videoRef}
                src={previewUrl}
                style={styles.previewVideo}
                controls
                playsInline
                preload="auto"
                onError={(e) => {
                  console.error('Video error:', e);
                  console.error('Video element:', e.target);
                  console.error('Video source:', e.target.src);
                  alert('Error playing video. Please try another file.');
                }}
                onLoadedMetadata={(e) => {
                  console.log('Video metadata loaded:', {
                    duration: e.target.duration,
                    videoWidth: e.target.videoWidth,
                    videoHeight: e.target.videoHeight
                  });
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <button
            onClick={handleUpload}
            style={styles.button}
            disabled={loading || !video}
          >
            {loading ? 'Processing...' : 'Upload and Analyze'}
          </button>

          {prediction && (
            <div style={styles.prediction}>
              <p style={styles.predictionText}>
                <strong>Prediction:</strong> {prediction.label}
              </p>

              {prediction.anomalous_frame_path !== "" && (
                <div>
                  <p style={styles.predictionText}>
                    <strong>Anomalous Frame:</strong>
                  </p>
                  <img
                    src={`http://localhost:5000${prediction.route}${prediction.anomalous_frame_path}`}
                    alt="Anomalous Frame"
                    style={styles.predictionImage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home; 

const styles = {
  mainContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2.5rem 3rem'
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '3rem',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.05)'
  },
  heroTitle: {
    fontSize: '2.5rem',
    color: '#1d3557',
    marginBottom: '1rem'
  },
  heroDescription: {
    fontSize: '1.1rem',
    color: '#666',
    maxWidth: '800px',
    margin: '0 auto',
    lineHeight: '1.6'
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem'
  },
  leftContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.05)'
  },
  leftContentH3: {
    fontSize: '1.4rem',
    color: '#1d3557',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  rightContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.05)'
  },
  fileInput: {
    width: '80%',
    padding: '1rem',
    border: '2px dashed #dee2e6',
    borderRadius: '8px',
    marginBottom: '1rem',
    cursor: 'pointer',
    transition: 'border-color 0.3s ease',
    ':hover': {
      borderColor: '#00b4d8'
    }
  },
  button: {
    width: '100%',
    fontSize: '1rem',
    padding: '1rem',
    backgroundColor: '#00b4d8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: 'bold',
    ':hover': {
      backgroundColor: '#0096c7',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }
  },
  prediction: {
    marginTop: '1.5rem',
    backgroundColor: '#e3f2fd',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #90caf9',
    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)'
  },
  predictionText: {
    margin: '0.5rem 0',
    fontWeight: 500,
    fontSize: '1.1rem'
  },
  predictionImage: {
    marginTop: '1rem',
    maxWidth: '100%',
    borderRadius: '8px',
    border: '2px solid #90caf9',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: '1.5rem 0'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
    padding: '0.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px'
  },
  featureIcon: {
    color: '#00b4d8',
    fontSize: '1.2rem'
  },
  previewContainer: {
    marginBottom: '1rem',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#000',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto'
  },
  previewVideo: {
    width: '100%',
    maxHeight: '300px',
    backgroundColor: '#000',
    borderRadius: '8px',
    display: 'block',
    margin: '0 auto'
  },
  convertingMessage: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#fff3cd',
    color: '#856404',
    borderRadius: '4px',
    margin: '1rem 0'
  }
};