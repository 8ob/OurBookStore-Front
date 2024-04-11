import React from 'react';
import './Preloader.css';

const Preloader: React.FC = () => {
  return (
    // <div id='preloader' className='preloader'></div>

    <div
      className='preloader'
      style={{
        zIndex: '999999',
        position: 'relative',
        marginTop: '176px',
        height: '500px'
      }}
    >
      <div className='animation-preloader'>
        <div className='spinner'></div>
      </div>
      <div className='loader'>{/* Loader content */}</div>
    </div>
  );
};

export default Preloader;
