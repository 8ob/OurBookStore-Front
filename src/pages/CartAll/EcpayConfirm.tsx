//react
import React, { useEffect, useState } from "react";

//image
import logo from "../../assets/images/thePrint/logo.png";
import uc from "../../picture/uc.png";
import { useNavigate } from "react-router-dom";

//todo ECpay結帳完後跳轉畫面
const ECpayConfirm: React.FC = () => {
  // 跳轉秒數
  const [naviSeconds, setNaviSeconds] = useState<number>(5);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setNaviSeconds((prevSeconds) => prevSeconds - 1); // 每秒減少一秒
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (naviSeconds <= 0) {
      navigate("/order");
    }
  }, [naviSeconds]);

  return (
    <div className="page-wraper">
      <div className="under-construct">
        <div className="inner-box">
          <div className="logo-header logo-dark">
            <a href="index.html">
              <img src={logo} alt="" />
            </a>
          </div>
          <div className="dz-content">
            <h2 className="dz-title text-primary">付款完成</h2>
            <p>
              交易狀態 : 交易已授權
              <br />
              畫面將在 {naviSeconds} 秒跳轉...
            </p>
          </div>
        </div>
        <img src={uc} className="uc-bg" alt="" />
      </div>
    </div>
  );
};

export default ECpayConfirm;
