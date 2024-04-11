import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './Gallery.css'; // 請確保這是正確的路徑

//picture
import picture2 from '../../assets/images/Gallery/2.jpg';
import picture3 from '../../assets/images/Gallery/3.jpg';
import picture4 from '../../assets/images/Gallery/4.jpg';
import picture5 from '../../assets/images/Gallery/5.jpg';
import picture6 from '../../assets/images/Gallery/6.jpg';
import picture7 from '../../assets/images/Gallery/7.jpg';
import picture8 from '../../assets/images/Gallery/8.jpg';
import picture9 from '../../assets/images/Gallery/9.jpg';

gsap.registerPlugin(ScrollTrigger);

const ImageItem = ({ src, alt }) => (
  <div className='US-image'>
    <img src={src} alt={alt} />
  </div>
);

const ImageColumn = ({ images }) => (
  <div className='US-col'>
    {images.map((img, index) => (
      <ImageItem key={index} src={img.src} alt={img.alt} />
    ))}
  </div>
);

const Gallery = () => {
  const galleryRef = useRef(null);

  useEffect(() => {
    const additionalY = { val: 0 };
    let additionalYAnim;

    const cols = galleryRef.current
      ? gsap.utils.toArray('.US-col', galleryRef.current)
      : [];

    cols.forEach((col, i) => {
      const images = col.childNodes;
      images.forEach((image) => {
        const clone = image.cloneNode(true);
        col.appendChild(clone);
      });

      const direction = i % 2 === 0 ? '-=' : '+=';
      const movement = `${direction}${col.clientHeight * images.length}px`;
      // i % 2 === 1 ? '+=100%' : '-=100%'
      gsap.to(images, {
        y: movement,
        ease: 'none',
        repeat: -1,
        duration: 90,
        modifiers: {
          y: gsap.utils.unitize((y) => {
            let newY = parseFloat(y) % (col.clientHeight * images.length);

            if (i % 2 === 1 && newY > 0) {
              newY -= col.clientHeight * (images.length - 1);
            }
            return newY;
          })
        }
      });
    });

    ScrollTrigger.create({
      trigger: galleryRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        additionalYAnim && additionalYAnim.kill();
        additionalY.val = gsap.utils.clamp(-100, 100, velocity / 100);
        additionalYAnim = gsap.to(additionalY, {
          val: 0,
          duration: 0.8,
          ease: 'power3.out'
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      additionalYAnim && additionalYAnim.kill();
    };
  }, []);

  // 圖像數據
  const imagesData = [
    // 第一列圖像
    [
      {
        src: 'https://images.pexels.com/photos/10324713/pexels-photo-10324713.jpeg',
        alt: ''
      },
      {
        src: picture2,
        alt: ''
      },
      {
        src: picture3,
        alt: ''
      }
    ],
    // 第二列圖像
    [
      {
        src: picture4,
        alt: ''
      },
      {
        src: picture5,
        alt: ''
      },
      {
        src: picture6,
        alt: ''
      }
    ],
    // 第三列圖像
    [
      {
        src: picture7,
        alt: ''
      },
      {
        src: picture8,
        alt: ''
      },
      {
        src: picture9,
        alt: ''
      }
    ]
  ];

  return (
    <div ref={galleryRef} className='US-gallery'>
      <h1 className='US-h1' style={{ marginBottom: '60px' }}>
        Welcome to our
        <br /> second-hand bookstore!
      </h1>
      <h2 className='US-credit'>
        <a
          href='https://thisisadvantage.com'
          target='_blank'
          rel='noopener noreferrer'
        >
          Made by Advantage
        </a>
      </h2>
      <div className='US-gallery'>
        {imagesData.map((images, index) => (
          <ImageColumn key={index} images={images} />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
