// src/components/Background.jsx
import React from 'react';

function Background({ backgroundClasses, children }) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${backgroundClasses}`}>
      {children}
    </div>
  );
}

export default Background;