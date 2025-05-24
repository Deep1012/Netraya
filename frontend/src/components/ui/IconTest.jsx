import React from 'react';
import Ionicon from './Ionicon';

const IconTest = () => {
  const icons = [
    'close',
    'arrow-back',
    'arrow-forward',
    'chevron-forward',
    'information-circle',
    'alert-circle',
    'checkmark-circle',
    'download',
    'cloud-upload',
    'trash',
    'eye',
    'play',
    'reload',
    'image'
  ];

  return (
    <div style={{ padding: '2rem', backgroundColor: '#1e293b', color: 'white' }}>
      <h2 style={{ marginBottom: '1rem' }}>Ionicon Test</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {icons.map(name => (
          <div 
            key={name} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              padding: '1rem',
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '0.5rem',
              border: '1px solid #334155'
            }}
          >
            <Ionicon 
              name={name} 
              size={32}
              style={{ marginBottom: '0.5rem' }}
            />
            <span style={{ fontSize: '0.875rem' }}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconTest; 