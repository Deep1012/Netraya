import './ServicesPage.css';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, AlertCircle, Eye, Download, Info, ArrowLeft, 
  ArrowRight, Upload, Trash2, Play, ImageIcon, CheckCircle, 
  ChevronRight, FileDown, Maximize, X
} from 'lucide-react';

// Import sample images
import exImage1 from '../../assets/0.jpg';
import exImage2 from '../../assets/1.jpg';
import exImage3 from '../../assets/2.jpg';
import exImage4 from '../../assets/3.jpg';
import exImage5 from '../../assets/4.jpg';
// Import our custom component
import { Dropzone } from '../ui/dropzone';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';

// Component for the results section with diagnosis, features, etc.
const ResultsSection = ({ result, handleToggleFullImage, handleDownloadImage }) => {
  // Get severity class
  const getSeverityClass = (severity) => {
    if (!severity) return '';
    return severity.toLowerCase();
  };

  return (
    <div className="results-grid">
      {/* Left Column - Annotated Image */}
      <div className="result-section-item">
        <div className="section-header">
          <h3>Annotated Image</h3>
          <div className="action-buttons">
            <button 
              className="icon-button" 
              title="View Full Size"
              onClick={handleToggleFullImage}
            >
              <span className="text-icon">👁️</span>
            </button>
            <button 
              className="icon-button" 
              title="Download Image"
              onClick={handleDownloadImage}
            >
              <span className="text-icon">⬇️</span>
            </button>
          </div>
        </div>
        <div className="annotated-image-container" onClick={handleToggleFullImage}>
          <img 
            src={result.yolo.annotated_image || "/placeholder.svg"} 
            alt="Annotated retina" 
            className="annotated-image"
          />
          <div className="image-click-hint">
            <span className="text-icon">👁️</span>
            <span>Click to view full size</span>
          </div>
        </div>
      </div>

      {/* Right Column - Diagnosis & Detections */}
      <div className="result-details">
        <div className="result-section-item">
          <h3>Diagnosis</h3>
          <div className={`diagnosis-card ${getSeverityClass(result.classification.class)}`}>
            <div className="diagnosis-header">
              <h4>{result.classification.class} Diabetic Retinopathy</h4>
              <button className="info-button" title="More Information">
                <span className="text-icon">ℹ️</span>
              </button>
            </div>
            <div className="confidence-bar">
              <div className="confidence-label">Confidence:</div>
              <div className="confidence-track">
                <div 
                  className="confidence-fill" 
                  style={{ width: `${result.classification.confidence * 100}%` }}
                ></div>
              </div>
              <div className="confidence-value">{(result.classification.confidence * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {result.yolo.detections.length > 0 && (
          <div className="result-section-item">
            <h3>Detected Features</h3>
            <ul className="detections-list">
              {result.yolo.detections.map((detection, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (index * 0.1), duration: 0.3 }}
                  className="detection-item"
                >
                  <div className="detection-header">
                    <div className="detection-name">{detection.class}</div>
                    <div className="detection-badge">
                      {(detection.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="detection-bar">
                    <div 
                      className="detection-fill" 
                      style={{ width: `${detection.confidence * 100}%` }}
                    ></div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const ServicesPage = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const fileInputRef = useRef(null);
  
  // Handle file upload from Dropzone
  const handleFileDrop = (file) => {
    if (!file) return;
    
    setError(null);
    setImageFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
      setShowPreview(true);
      setResult(null); // Clear previous results
    };
    reader.readAsDataURL(file);
  };

  // Handle manual file input
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileDrop(file);
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle predefined example image selection
  const handleExampleClick = (imageSrc, index) => {
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `example${index}.png`, { type: 'image/png' });
        setImageFile(file);
        setUploadedImage(imageSrc);
        setShowPreview(true);
        setResult(null);
      });
  };
  
  // Clear uploaded image
  const handleClearImage = () => {
    setUploadedImage(null);
    setImageFile(null);
    setShowPreview(false);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Run the AI model
  const handleRunModel = async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }

    setLoading(true);
    setProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);
    
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch('http://localhost:5000/api/model/give-result', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      setProgress(100);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Error processing image. Please try again.');
      setProgress(0);
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  };

  // Download annotated image
  const handleDownloadImage = () => {
    if (!result || !result.yolo || !result.yolo.annotated_image) return;
    
    const link = document.createElement('a');
    link.href = result.yolo.annotated_image;
    link.download = 'annotated-retina.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle full image view
  const handleToggleFullImage = () => {
    setShowFullImage(!showFullImage);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="app-container">
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="image/*" 
        style={{ display: 'none' }}
      />

      {/* Full image modal */}
      {showFullImage && result && (
        <div className="full-image-modal" onClick={handleToggleFullImage}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={handleToggleFullImage}>
              <span className="text-icon">✖️</span>
            </button>
            <img 
              src={result.yolo.annotated_image} 
              alt="Full size annotated retina" 
              className="full-size-image"
            />
            <div className="modal-actions">
              <button className="action-button" onClick={handleDownloadImage}>
                <span className="text-icon">⬇️</span>
                <span>Download Image</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="services-container">
        {/* Header Section */}
        <motion.div 
          className="services-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="badge">AI-Powered Medical Analysis</div>
          <h1 className="gradient-heading">Diabetic Retinopathy Detection System</h1>
          <p>Upload your retinal images to instantly detect diabetic retinopathy with our advanced AI-powered system. Get accurate results in seconds.</p>
        </motion.div>

        {/* Main Content - Vertical Layout */}
        <motion.div 
          className="vertical-layout"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Upload Section */}
          <motion.div className="section" variants={itemVariants}>
            <div className="card upload-card">
              <div className="card-header">
                <h2><span className="text-icon">📤</span> Image Upload</h2>
              </div>
              <div className="card-content">
                {!showPreview ? (
                  <div>
                    <div 
                      className="dropzone"
                      onClick={handleUploadClick}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const file = e.dataTransfer.files[0];
                        if (file) {
                          handleFileDrop(file);
                        }
                      }}
                    >
                      <div className="dropzone-content">
                        <span className="text-icon dropzone-icon">📤</span>
                        <h3>Drag & drop your retina image here</h3>
                        <p>Or click to browse files (JPG, PNG up to 5MB)</p>
                        <button className="upload-button">
                          <span className="text-icon">📂</span>
                          <span>Select Image</span>
                        </button>
                      </div>
                    </div>
                    <div className="upload-options">
                      <span>or choose from our examples below</span>
                    </div>
                  </div>
                ) : (
                  <div className="preview-container">
                    <div className="image-preview-wrapper">
                      <img 
                        src={uploadedImage || "/placeholder.svg"} 
                        alt="Uploaded Preview"
                        className="preview-image"
                      />
                      <button 
                        className="remove-image-btn"
                        onClick={handleClearImage}
                        title="Remove image"
                      >
                        <span className="text-icon">🗑️</span>
                      </button>
                      <div className="image-controls">
                        <button 
                          className="control-button remove-button"
                          onClick={handleClearImage}
                        >
                          <span className="text-icon">🗑️</span>
                          <span>Remove</span>
                        </button>
                        <button 
                          className="control-button change-button"
                          onClick={handleUploadClick}
                        >
                          <span className="text-icon">📤</span>
                          <span>Change</span>
                        </button>
                      </div>
                    </div>
                    
                    {loading && (
                      <div className="progress-container">
                        <div className="progress-info">
                          <span>Processing image...</span>
                          <span className="progress-percentage">{progress}%</span>
                        </div>
                        <div className="progress">
                          <div 
                            className="progress-bar" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {error && (
                      <div className="error-message">
                        <span className="text-icon">⚠️</span>
                        <span>{error}</span>
                      </div>
                    )}
                    
                    <button 
                      className="process-button"
                      onClick={handleRunModel}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="text-icon spin">⏳</span>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-icon">▶️</span>
                          <span>Analyze Image</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Examples Section */}
          <motion.div className="section" variants={itemVariants}>
            <div className="card examples-card">
              <div className="card-header">
                <h2><span className="text-icon">🖼️</span> Example Images</h2>
              </div>
              <div className="card-content">
                <div className="examples-container">
                  {[exImage1, exImage2, exImage3, exImage4, exImage5].map((image, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="example-image-container"
                      onClick={() => handleExampleClick(image, index + 1)}
                    >
                      <img 
                        src={image} 
                        alt={`Example ${index + 1}`} 
                        className="example-image" 
                      />
                      <div className="example-overlay">
                        <span>Use</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div className="section" variants={itemVariants}>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  className="card results-card"
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="card-header results-header">
                    <h2><span className="text-icon">📋</span> Analysis Results</h2>
                    <div className={`severity-badge ${result.classification.class.toLowerCase()}`}>
                      {result.classification.class}
                    </div>
                  </div>
                  <div className="card-content">
                    <ResultsSection 
                      result={result} 
                      handleToggleFullImage={handleToggleFullImage}
                      handleDownloadImage={handleDownloadImage}
                    />
                  </div>
                  <div className="card-footer">
                    <button className="secondary-button" onClick={handleClearImage}>
                      <span className="text-icon">◀️</span>
                      <span>Try Another Image</span>
                    </button>
                    <button className="primary-button" onClick={handleClearImage}>
                      <span>Next Steps</span>
                      <span className="text-icon">▶️</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  className="card empty-results-card"
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="empty-state">
                    <div className="icon-container">
                      <span className="text-icon large-icon">ℹ️</span>
                    </div>
                    <h2>Ready to Analyze</h2>
                    <p>Upload a retinal image or select one of our examples to begin the analysis process. Our AI will detect signs of diabetic retinopathy and provide a detailed report.</p>
                    <div className="features">
                      <div className="feature">
                        <span className="text-icon">✅</span>
                        <span>Fast Analysis</span>
                      </div>
                      <div className="feature">
                        <span className="text-icon">✅</span>
                        <span>Accurate Results</span>
                      </div>
                      <div className="feature">
                        <span className="text-icon">✅</span>
                        <span>Secure Processing</span>
                      </div>
                    </div>
                    <div className="start-prompt">
                      <span>Get started by uploading an image</span>
                      <span className="text-icon prompt-icon">▶️</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesPage;
