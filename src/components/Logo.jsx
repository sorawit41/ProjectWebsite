import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ imageUrl, altText }) => {
  return (
    <div>
      <Link to={'/'}>
        <img src={imageUrl} alt={altText} className="h-20 md:h-20" />
      </Link>
    </div>
  );
};

export default Logo;