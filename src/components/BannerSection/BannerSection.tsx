import React from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper/core';
import shapeImage from '../../assets/images/shape/shape-3.png';
import bannerIcon from '../../assets/images/icons/image-2.png';
import bannerImage1 from '../../assets/images/resource/image-1.png';
import '../BannerSection/Style.css';

// 安装 Swiper 模块
SwiperCore.use([Navigation]);

const BannerSection = () => {
  return (
    <section className='banner-section'>
      <div className='shape'>
        <img src={shapeImage} alt='' />
      </div>
      <div className='big-title'>UsedBook</div>
      <Swiper
        navigation={{
          nextEl: '.banner-slider-button-next',
          prevEl: '.banner-slider-button-prev'
        }}
        className='banner-slider'
        spaceBetween={50}
        slidesPerView={1}
      >
        <div>
          <div className='banner-slider-nav'>
            <div
              className='banner-slider-control banner-slider-button-prev '
              style={{ position: 'absolute', top: '40%' }}
            >
              <span>
                <i className='fas fa-arrow-right'></i>
              </span>
            </div>
            <div
              className='banner-slider-control banner-slider-button-next'
              style={{ position: 'absolute', top: '40%' }}
            >
              <span>
                <i className='fas fa-arrow-right'></i>
              </span>
            </div>
          </div>
        </div>
        <SwiperSlide>
          <div className='content-outer'>
            <div className='content-box'>
              <div className='inner'>
                <div className='logo'>
                  <img src={bannerIcon} alt='' />
                </div>
                <h1 className='banner-title'>
                  EXCLUSIVE <br /> SECOND-HAND <br /> BOOK ISLAND
                </h1>
                <div className='link-box'>
                  <a href='room-grid.html' className='theme-btn btn-style-one'>
                    <span>Your Usedbooks</span>
                  </a>
                </div>
              </div>

              <div className='image-box'>
                <div className='image'>
                  <img src={bannerImage1} alt='' />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className='content-outer'>
            <div className='content-box'>
              <div className='inner'>
                <div className='logo'>
                  <img src={bannerIcon} alt='' />
                </div>
                <h1 className='banner-title'>
                  Amazing Suite <br /> With River View <br /> & Lot Of Services
                </h1>
                <div className='link-box'>
                  <a href='room-grid.html' className='theme-btn btn-style-one'>
                    <span>Sell your books</span>
                  </a>
                </div>
              </div>
              <div className='image-box'>
                <div className='image'>
                  <img src={bannerImage1} alt='' />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default BannerSection;
