import React from 'react';
import './DiscountCardContainer.css';
import DiscountDetail from '../DiscountDetail/DiscountDetail';

const DiscountCardContainer = () => {
  return (
    <div className='discount-card-container'>
      <DiscountDetail />
    </div>
  );
};

export default DiscountCardContainer;
