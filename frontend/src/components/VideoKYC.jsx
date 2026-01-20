import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { verifyKYC } from '../services/api';

const VideoKYC = ({ userId, onVerified }) => {
  const videoRef = useRef();
  const [status, setStatus] = useState('Initializing Camera...');

  // Load Face API Models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'; // Ensure models are in public/models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      startVideo();
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setStatus('Please look at the camera and blink...');
      })
      .catch((err) => console.error(err));
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (videoRef.current) {
        const detections = await faceapi.detectAllFaces(
          videoRef.current, 
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks();

        if (detections.length > 0) {
          // Mocking a successful "Liveness" check after detection
          setStatus('Face Detected! Verifying...');
          
          // Simulate sending data to backend
          setTimeout(async () => {
            const res = await verifyKYC({ userId, livenessScore: 0.95 });
            if (res.data.user.isVerified) {
              setStatus('Verified Successfully! ✅');
              onVerified();
            }
          }, 2000);
        }
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold text-shePurple mb-2">Identity Verification</h2>
      <div className="relative w-full max-w-sm overflow-hidden rounded-lg shadow-lg border-4 border-shePurple">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          onPlay={handleVideoOnPlay} 
          className="w-full h-64 object-cover"
        />
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-700">{status}</p>
    </div>
  );
};

export default VideoKYC;