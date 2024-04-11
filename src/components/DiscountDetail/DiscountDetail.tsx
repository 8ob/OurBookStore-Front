
import React from 'react';
import './DiscountDetail.css';

const DiscountDetail = () => {
  return (
    <div className="discount-detail">
      <div className="discount-banner">
        <h2>HAPPY BIRTHDAY!</h2>
        <p>4月 APRIL</p>
      </div>
      <div className="discount-info">
        <p>享受你的折扣</p>
        <h1>NT$ 100</h1>
        <p>限時優惠</p>
        <p>2024年限時優惠</p>
      </div>
      <div className="terms">
        <p>立即使用</p>
        <p>滿NT$1000使用</p>
        <p>使用期限 2024/04/31</p>
      </div>
    </div>
  );
};

export default DiscountDetail;
