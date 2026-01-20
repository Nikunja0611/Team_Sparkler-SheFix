import cv2
import numpy as np
import mediapipe as mp
from scipy import signal
import matplotlib.pyplot as plt

class HeartRateMonitor:
    def __init__(self):
        self.green_signal = []
        self.fps = 0
        
        # Initialize MediaPipe Face Mesh (Much more stable than Haar Cascades)
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def get_roi_mean(self, frame, landmarks):
        """Extracts the mean green value from the forehead ROI."""
        h, w, _ = frame.shape
        
        # Define forehead indices (Indices from MediaPipe Face Mesh canonical model)
        # These indices roughly correspond to the center of the forehead
        forehead_indices = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109]
        # Simplified polygon for demo (Center Forehead):
        forehead_polygon_indices = [338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10]
        
        # A simpler stable triangle on the forehead
        roi_indices = [10, 338, 297, 67, 109] 
        
        mask = np.zeros((h, w), dtype=np.uint8)
        points = []
        
        for idx in roi_indices:
            pt = landmarks.landmark[idx]
            x, y = int(pt.x * w), int(pt.y * h)
            points.append([x, y])
            
        if len(points) > 0:
            points = np.array([points], dtype=np.int32)
            cv2.fillPoly(mask, points, 255)
            
            # Extract Mean Green from the masked area only
            mean_val = cv2.mean(frame, mask=mask)[1] # Index 1 is Green in BGR
            return mean_val
        return 0

    def process_signal(self, raw_signal, fps):
        """Filters the raw signal to isolate heart rate frequencies."""
        if len(raw_signal) < fps * 5: # Need at least 5 seconds of data
            return 0, np.array([])

        signal_array = np.array(raw_signal)
        
        # 1. Detrending (Remove non-stationary trends like lighting changes)
        detrended = signal.detrend(signal_array)
        
        # 2. Interpolation / Normalization
        # (Skipped for brevity, but often needed for variable FPS)
        
        # 3. Bandpass Filter (Butterworth)
        # Heart rate is typically between 45 BPM (0.75 Hz) and 180 BPM (3.0 Hz)
        low_cut = 0.75
        high_cut = 3.0
        nyquist = 0.5 * fps
        b, a = signal.butter(3, [low_cut / nyquist, high_cut / nyquist], btype='band')
        filtered_signal = signal.lfilter(b, a, detrended)
        
        # 4. FFT (Fast Fourier Transform) to find the dominant frequency
        n = len(filtered_signal)
        freqs = np.fft.rfftfreq(n, 1.0/fps)
        fft_mag = np.abs(np.fft.rfft(filtered_signal))
        
        # Find peak frequency within the heart rate range
        valid_idx = np.where((freqs >= low_cut) & (freqs <= high_cut))
        valid_freqs = freqs[valid_idx]
        valid_mags = fft_mag[valid_idx]
        
        if len(valid_mags) == 0:
            return 0, filtered_signal

        peak_idx = np.argmax(valid_mags)
        heart_rate_hz = valid_freqs[peak_idx]
        bpm = heart_rate_hz * 60.0
        
        return bpm, filtered_signal

    def run(self, video_path):
        cap = cv2.VideoCapture(video_path)
        self.fps = cap.get(cv2.CAP_PROP_FPS)
        if self.fps == 0: self.fps = 30 # Fallback
        
        print(f"Processing video at {self.fps} FPS...")

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.face_mesh.process(rgb_frame)

            if results.multi_face_landmarks:
                for face_landmarks in results.multi_face_landmarks:
                    # 1. Extract ROI Signal (Forehead)
                    val = self.get_roi_mean(frame, face_landmarks)
                    self.green_signal.append(val)
                    
                    # (Optional) Visualize ROI
                    # Drawing code omitted for brevity

        cap.release()
        
        # 2. Calculate BPM
        bpm, filtered = self.process_signal(self.green_signal, self.fps)
        return bpm, self.green_signal, filtered

# --- Usage ---
# monitor = HeartRateMonitor()
# bpm, raw, clean = monitor.run('face_video.mp4')
# print(f"Estimated Heart Rate: {bpm:.2f} BPM")

# # Optional Plotting
# plt.figure(figsize=(12, 6))
# plt.subplot(2,1,1)
# plt.plot(raw, label='Raw Green Signal')
# plt.legend()
# plt.subplot(2,1,2)
# plt.plot(clean, label='Filtered rPPG Signal', color='red')
# plt.title(f"Heart Rate: {bpm:.2f} BPM")
# plt.tight_layout()
# plt.show()