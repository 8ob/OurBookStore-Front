import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Navigation } from "swiper/modules";
//API
import {
  BookProductDto,
  useGetApiProductsGetByMostProductOrder,
} from "../../API";
//components
import ProductItem from "../ProductItem";
//fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
//css
import "./index.css";
import LoadingMessage from "../../main";

const ProductsCarousel: React.FC = () => {
  //GET API
  const mostBuyProductResponse = useGetApiProductsGetByMostProductOrder();
  const mostBuyProductData = mostBuyProductResponse.data?.data;
  if (mostBuyProductResponse.isLoading) return <LoadingMessage />;
  return (
    <section className="content-inner-1">
      <div className="container">
        <div className="section-head book-align">
          <h2 className="title mb-0">暢銷書籍</h2>
          <div className="pagination-align style-1">
            <div className="swiper-button-prev">
              <FontAwesomeIcon icon={faAngleLeft} className="button-prev-fa" />
            </div>
            <div className="swiper-pagination-two"></div>
            <div className="swiper-button-next">
              <FontAwesomeIcon icon={faAngleRight} className="button-next-fa" />
            </div>
          </div>
        </div>
        <div className="swiper-container books-wrapper-3 swiper-four">
          <Swiper
            modules={[EffectFade, Pagination, Navigation]}
            effect="flip" // 這裡可以選擇 'cube', 'fade', 'coverflow' 或 'flip'
            loop={true}
            spaceBetween={5}
            slidesPerView={3}
            navigation={{
              nextEl: ".swiper-button-next", // 指定下一個按鈕的選擇器
              prevEl: ".swiper-button-prev", // 指定上一個按鈕的選擇器
            }}
            pagination={{
              el: ".swiper-pagination-two", // 指定導覽列的選擇器
              clickable: true,
            }}
          >
            <div className="swiper-wrapper">
              {mostBuyProductData &&
                mostBuyProductData.map((product: BookProductDto) => (
                  <SwiperSlide key={product.productId}>
                    <ProductItem productId={product.productId as number} />
                  </SwiperSlide>
                ))}
            </div>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ProductsCarousel;

// 這裡是套版原版 的silde
{
  /* <div className="swiper-slide">
    <div className="books-card style-3 wow fadeInUp" data-wow-delay="0.1s">
        <div className="dz-media">
            <img src="assets/picture/book5.jpg" alt="book" />
        </div>
        <div className="dz-content">
            <h5 className="title">
                <a href="books-grid-view.html">Take Out Tango</a>
            </h5>
            <ul className="dz-tags">
                <li>
                    <a href="books-grid-view.html">SPORTS,</a>
                </li>
                <li>
                    <a href="books-grid-view.html">DRAMA</a>
                </li>
            </ul>
            <div className="book-footer">
                <div className="rate">
                    <i className="flaticon-star"></i>
                    6.8
                </div>
                <div className="price">
                    <span className="price-num">$9.5</span>
                    <del>$12.0</del>
                </div>
            </div>
        </div>
    </div>
</div>; */
}
