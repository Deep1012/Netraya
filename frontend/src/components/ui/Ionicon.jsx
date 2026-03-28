import React from 'react';

// Map of Ionicon names to their equivalent HTML entities or SVG paths
// This is a simplified version - in a real app you'd want to import actual icons
const iconMap = {
  // Basic UI icons
  'close': '✕',
  'arrow-back': '←',
  'arrow-forward': '→',
  'chevron-forward': '›',
  'information-circle': 'ℹ',
  'alert-circle': '⚠',
  'checkmark-circle': '✓',

  // Action icons
  'download': '↓',
  'cloud-upload': '↑',
  'trash': '🗑',
  'eye': '👁',
  'play': '▶',
  'reload': '↻',
  
  // Media icons
  'image': '🖼',
};

const Ionicon = ({ name, size = 24, className, style, ...props }) => {
  const iconContent = iconMap[name] || '?';
  
  const iconStyle = {
    fontSize: `${size}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style
  };
  
  return (
    <span 
      className={className} 
      style={iconStyle} 
      role="img" 
      aria-label={name} 
      {...props}
    >
      {iconContent}
    </span>
  );
};

export default Ionicon; 