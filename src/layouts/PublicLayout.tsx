// PublicLayout.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom'; // 引入 Outlet
import Menu from '../components/Menu/MenuNew';
import Footer from '../components/Footer/Footer';
import Preloader from '../components/Preloader/Preloader';
import '../App.css';

const PublicLayout: React.FC = () => {
  return (
    <>
      <Suspense fallback={<Preloader />}>
        <header>
          <Menu />
        </header>
        <section>
          <Outlet /> {/* 子組件會在這裡被渲染 */}
        </section>
        <footer>
          <Footer />
        </footer>
      </Suspense>
    </>
  );
};

export default PublicLayout;
