# Frontend - Anomaly Detection System

A modern React-based web application for real-time video analysis and fight detection. This frontend provides an intuitive interface for uploading videos, viewing predictions, and analyzing historical data.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with intuitive navigation
- **Video Upload & Preview**: Drag-and-drop video upload with real-time preview
- **Format Conversion**: Automatic AVI to MP4 conversion using FFmpeg
- **Real-time Analysis**: Instant video processing and prediction display
- **Historical Data**: View and analyze past video predictions
- **Interactive Graphs**: Visual representation of prediction data
- **Cross-browser Compatibility**: Works seamlessly across modern browsers
- **Mobile Responsive**: Optimized for desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: React 19.x with Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios for API communication
- **Video Processing**: FFmpeg.wasm for client-side video conversion
- **Video Player**: Video.js for enhanced video playback
- **Styling**: CSS-in-JS with modern design patterns
- **Build Tool**: Vite for fast development and optimized builds
- **Linting**: ESLint with React-specific rules

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── ssn.png            # Logo
│   └── vite.svg           # Vite logo
├── src/
│   ├── components/        # React components
│   │   ├── Home.jsx      # Main upload interface
│   │   ├── History.jsx   # Historical data view
│   │   ├── Graphs.jsx    # Data visualization
│   │   └── VideoPlayer.jsx # Video player component
│   ├── api/              # API configuration
│   │   └── index.jsx     # Axios setup and endpoints
│   ├── assets/           # Images and static files
│   │   ├── ssn.png      # SSN logo
│   │   ├── background.jpg # Background image
│   │   └── header1.png  # Header background
│   ├── css/             # Stylesheets
│   │   └── index.css    # Global styles
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── eslint.config.js     # ESLint configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Modern web browser with ES6+ support

### Installation

1. **Clone the repository** (if not already done):

   ```bash
   git clone <repository-url>
   cd webserver/frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory.

## 📱 Application Pages

### 1. Home Page (`/`)

- **Video Upload Interface**: Drag-and-drop file upload
- **Video Preview**: Real-time video playback
- **Prediction Results**: Display analysis results
- **Feature Highlights**: Key system capabilities

### 2. History Page (`/history`)

- **Past Predictions**: List of previously analyzed videos
- **Result Details**: Confidence scores and predictions
- **Video Playback**: Replay uploaded videos
- **Filtering Options**: Search and filter historical data

### 3. Graphs Page (`/graphs`)

- **Data Visualization**: Charts and graphs of prediction data
- **Analytics Dashboard**: Statistical overview
- **Trend Analysis**: Historical performance metrics

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_TITLE=Anomaly Detection System
VITE_APP_VERSION=1.0.0
```

### API Configuration

The frontend communicates with the backend API through the `src/api/index.jsx` file:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

## 🎨 UI/UX Features

### Design System

- **Color Scheme**: Professional blue and white theme
- **Typography**: Modern, readable fonts
- **Spacing**: Consistent padding and margins
- **Animations**: Smooth transitions and hover effects

### Responsive Design

- **Desktop**: Full-featured interface with side-by-side layout
- **Tablet**: Optimized for touch interaction
- **Mobile**: Stacked layout with touch-friendly controls

### Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG compliant color ratios
- **Focus Management**: Clear focus indicators

## 📹 Video Processing

### Supported Formats

- **Input**: MP4, WebM, OGG, AVI
- **Output**: MP4 (converted from AVI)
- **Max Size**: 100MB (configurable)

### FFmpeg Integration

The application uses FFmpeg.wasm for client-side video conversion:

```javascript
import { FFmpeg } from "@ffmpeg/ffmpeg";

const convertAVIToMP4 = async (file) => {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  // Convert AVI to MP4
  await ffmpeg.writeFile("input.avi", await file.arrayBuffer());
  await ffmpeg.exec(["-i", "input.avi", "-c:v", "libx264", "output.mp4"]);

  return await ffmpeg.readFile("output.mp4");
};
```

## 🔌 API Integration

### Endpoints Used

1. **POST** `/predict` - Upload and analyze video
2. **GET** `/uploads` - List uploaded videos
3. **GET** `/uploads/<filename>` - Serve video file
4. **GET** `/predict/<filename>` - Get prediction for video

### Error Handling

- **Network Errors**: Graceful fallback with user-friendly messages
- **File Validation**: Client-side file type and size validation
- **Upload Progress**: Real-time upload status indicators
- **Retry Logic**: Automatic retry for failed requests

## 🚨 Error Handling

### Common Issues

1. **Video Upload Fails**:

   - Check file format and size
   - Ensure backend server is running
   - Verify network connectivity

2. **Video Preview Not Working**:

   - Check browser compatibility
   - Verify video file integrity
   - Clear browser cache

3. **API Connection Issues**:
   - Verify backend server URL
   - Check CORS configuration
   - Ensure proper network access

## 🧪 Testing

### Development Testing

```bash
# Run linting
npm run lint

# Start development server
npm run dev

# Build for production
npm run build
```

### Browser Testing

- **Chrome**: Primary development browser
- **Firefox**: Cross-browser compatibility
- **Safari**: macOS compatibility
- **Edge**: Windows compatibility

## 📊 Performance

### Optimization Features

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Compressed and optimized images
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Efficient browser caching strategies

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 2MB (gzipped)

## 🔒 Security

### Security Measures

- **Input Validation**: Client-side file validation
- **CORS Configuration**: Proper cross-origin settings
- **Content Security Policy**: XSS protection
- **HTTPS**: Secure communication (in production)

## 🚀 Deployment

### Build Process

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment Options

- **Netlify**: Drag-and-drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Static hosting
- **AWS S3**: Cloud hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- [Your Name] - Frontend Developer
- [Team Member] - UI/UX Designer
- [Team Member] - Full-stack Developer

## 🙏 Acknowledgments

- SSN College of Engineering
- React and Vite communities
- FFmpeg.wasm contributors
- All open-source contributors

---

For support, contact: [your.email@example.com]
