import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet
} from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useGetApiCartsDetails, useGetApiOrderMemberId } from './API.ts';
import PhysicalEBookNav from './components/PhysicalEBookNav/index.tsx';
import Footer from './components/PhysicalEBookFooter/Footer.tsx';
library.add(faCoffee, faShoppingCart);

export interface CartItemType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imgSrc?: string;
  description?: string;
}

// 初始化購物車數據
const initialCart: CartItemType[] = [
  {
    id: 1,
    name: '商品A',
    price: 100,
    quantity: 2,
    imgSrc: '/path/to/imageA.png'
  },
  {
    id: 2,
    name: '商品B',
    price: 200,
    quantity: 1,
    imgSrc: '/path/to/imageB.png'
  }
];

// App 組件，應用的主要入口點
const App: React.FC = () => {
  // const memberId = 2;
  // const TestData = useGetApiCartsDetails({ Id: memberId });

  // // console.log(TestData.data?.data)
  // if (TestData.isLoading) {
  //   return (
  //     <div className='page-wraper'>
  //       <div id='loading-area' className='preloader-wrapper-1'>
  //         <div className='preloader-inner'>
  //           <div className='preloader-shade'></div>
  //           <div className='preloader-wrap'></div>
  //           <div className='preloader-wrap wrap2'></div>
  //           <div className='preloader-wrap wrap3'></div>
  //           <div className='preloader-wrap wrap4'></div>
  //           <div className='preloader-wrap wrap5'></div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  return (
    <>
      <div className='page-wraper'>
        <header className='site-header mo-left header style-1'>
          <PhysicalEBookNav />
        </header>
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default App;
