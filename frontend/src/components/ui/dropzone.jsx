import { useState, useRef } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

export const Dropzone = ({ onDrop, accept, maxSize, instructions }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    setError(null);
    if (files.length === 0) return;

    const file = files[0];
    
    // Check file type
    if (accept && !accept.includes(file.type)) {
      setError(`File type not accepted. Please upload ${accept.replace('image/*', 'an image file')}.`);
      return;
    }
    
    // Check file size
    if (maxSize && file.size > maxSize) {
      setError(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
      return;
    }
    
    onDrop(file);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div 
      className={`dropzone ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
        accept={accept}
      />
      
      <div className="dropzone-content">
        <Upload className="dropzone-icon" />
        <h3>Upload Retina Image</h3>
        <p>{instructions || 'Drag & drop your image here, or click to browse'}</p>
        <div className="file-info">
          <span>Supported formats: JPG, PNG, TIFF</span>
          <span>Maximum file size: 5MB</span>
        </div>
        
        {error && (
          <div className="dropzone-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}; 