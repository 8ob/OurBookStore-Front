import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import usedBookLogo from '../../assets/images/logo_dark.png'
import backgroundImage from '../../assets/images/backgroundImage2.jpg'

const UsedBooksOrderConfirmation: React.FC = () => {
  const [paymentStatus, setPaymentStatus] = useState<boolean>(false);

  const location = useLocation();
  useEffect(() => {
    if (location.state) {
      setPaymentStatus(location.state.paymentStatus);
    }
  }, [location.state]);


  setTimeout(() => {
    window.location.href = 'http://localhost:5173/usedBook/UsedBookOrder';
  }, 3000);

  return (

    <div className="cart text-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div>
        <img style={{ width: '350px' }} className='my-5' src={usedBookLogo} />
        <h1 className='my-5' style={{ color: 'rgb(196, 141, 70)', fontSize: '48px' }}> {paymentStatus ? "付款成功" : "付款失敗"}</h1>
        <h5 className='mb-5' style={{ color: 'rgb(196, 141, 70)' }}>請等候跳轉...</h5>
      </div>
    </div >

  );
};
export default UsedBooksOrderConfirmation;
