import { useParams, useHistory } from 'react-router-dom';
import {
  useGetApiUsedBooksIdId,
  useGetApiUsedBooksCategoryBookId,
  usePostApiUsedBookCartsApi,
  getGetApiUsedBookCartsApiQueryKey
} from '../../API';
// import LoadingMessage from '../../main';
//images
import noImage from '../../assets/images/defaultImage0.jpg';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import '../../assets/css/bootstrap.css';
import '../../assets/css/style.css';
import '../../assets/css/responsive.css';
import '../../assets/css/color.css';
import '../UsedBookInside/inside.css';
import Preloader from '../../components/Preloader/Preloader';
import { useGetApiUsedBooks } from '../../API';
import defaultImage from '../../../assets/images/NoImageSmall.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faBook } from '@fortawesome/free-solid-svg-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../../Context/SnackbarContext';

const UsedBookInside: React.FC = () => {
  const { UsedBookId } = useParams();
  const memberId = 28; //TODO:
  const [publishDate, setPublishDate] = useState<Date | null>(null);
  const { showSnackbar } = useSnackbar();
  //query客戶端鉤子
  const queryClient = useQueryClient();

  //加入購物車
  const addBookToCartMutation = usePostApiUsedBookCartsApi();

  const UsedBooksResponse = useGetApiUsedBooksIdId(Number(UsedBookId));
  const UsedBooks = UsedBooksResponse.data?.data;
  const sameCategoryBookResponse = useGetApiUsedBooksCategoryBookId(
    UsedBooks?.id as number
  );
  const sameCategoryBook = sameCategoryBookResponse.data?.data;

  useEffect(() => {
    setPublishDate(new Date(UsedBooks?.publishedDate as string));
  }, [UsedBooks]);
  //const { data, isLoading, error } = useGetApiUsedBooks();
  //const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  //   if (UsedBooksResponse.isLoading) return <Preloader />;
  if (UsedBooksResponse.error)
    return <div>Error: {UsedBooksResponse.error.message}</div>;
  //   if (productResponse.isLoading || sameCategoryBookResponse.isLoading) {
  //     return <LoadingMessage />;
  //   }

  //加入購物車
  const handleAddToCart = () => {
    const bookID = Number(UsedBookId);
    if (!memberId || !bookID) {
      console.error('無效的 memberId 或 bookID');
      return;
    }
    console.log('memberId:', memberId);
    console.log('bookID:', bookID);
    addBookToCartMutation.mutate(
      {
        data: {
          memberID: memberId,
          bookID: bookID
        }
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: getGetApiUsedBookCartsApiQueryKey({ memberId: 28 }) //TODO: 會員ID
          });
          console.log('回應數據:', data);
          showSnackbar('書籍已加入購物車！', 'success');
        },
        onError: (error) => {
          console.error('請求錯誤:', error);
          if (error.response.data == '商品已在購物車中')
            showSnackbar('商品已在購物車中。', 'error');
          else showSnackbar('加入購物車時出現錯誤。', 'error');
        }
      }
    );
  };

  // const handleAddToCart = async () => {
  //   try {
  //     // 調用API來添加書籍到購物車
  //     addBookToCartMutation.mutate({
  //       data: {
  //         memberID: memberId,
  //         bookID: Number(UsedBookId)
  //       }
  //     });

  //     alert('書籍已加入購物車！');
  //   } catch (error) {
  //     console.error('加入購物車失敗', error);
  //     alert('加入購物車時出現錯誤。');
  //   }
  // };

  return (
    <div className='bg-grey'>
      <section className='content-inner-1'>
        <div className='container'>
          <div className='row book-grid-row style-4 m-b60'>
            <div className='col'>
              <div className='dz-box'>
                <div
                  className='dz-media'
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '400px'
                  }}
                >
                  <img
                    src={UsedBooks?.imageLinks?.thumbnail ?? noImage}
                    alt='book'
                    style={{
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
                <div className='dz-content'>
                  <div className='dz-header'>
                    <h3 className='title'>{UsedBooks?.title}</h3>
                    {/* <div className="shop-item-rating">
                                            <div className="d-lg-flex d-sm-inline-flex d-flex align-items-center">
                                                <ul className="dz-rating">
                                                    <li>
                                                        <i className="flaticon-star text-yellow"></i>
                                                    </li>
                                                    <li>
                                                        <i className="flaticon-star text-yellow"></i>
                                                    </li>
                                                    <li>
                                                        <i className="flaticon-star text-yellow"></i>
                                                    </li>
                                                    <li>
                                                        <i className="flaticon-star text-yellow"></i>
                                                    </li>
                                                    <li>
                                                        <i className="flaticon-star text-muted"></i>
                                                    </li>
                                                </ul>
                                                <h6 className="m-b0">4.0</h6>
                                            </div>
                                            <div className="social-area">
                                                <ul className="dz-social-icon style-3">
                                                    <li>
                                                        <a
                                                            href="javascript:;"
                                                            target="_self"
                                                        >
                                                            <i className="fa-brands fa-facebook-f"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="javascript:;"
                                                            target="_self"
                                                        >
                                                            <i className="fa-brands fa-twitter"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="javascript:;"
                                                            target="_self"
                                                        >
                                                            <i className="fa-brands fa-whatsapp"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="javascript:;"
                                                            target="_self"
                                                        >
                                                            <i className="fa-solid fa-envelope"></i>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div> */}
                  </div>
                  <div className='dz-body'>
                    <div className='book-detail'>
                      <ul className='book-info'>
                        <li>
                          <div>
                            <span>作者</span>
                            {UsedBooks?.authors?.join(', ') || '缺少作者資訊'}
                          </div>
                        </li>
                        <li>
                          <span>出版商</span>
                          {UsedBooks?.publisher || '缺少出版商資訊'}
                        </li>
                        <li>
                          <span>出版日期</span>
                          {publishDate?.toLocaleDateString('zh-TW', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </li>
                      </ul>
                    </div>
                    <p className='text-1 description-text'>
                      {UsedBooks?.description || '沒有書籍介紹'}
                    </p>

                    <div className='book-footer'>
                      <div className='price'>
                        <h5>$54.78 元</h5>
                        <p className='p-lr10'>{UsedBooks?.price} 元</p>
                      </div>
                      <div className='product-num'>
                        <button
                          type='button'
                          onClick={handleAddToCart}
                          className='btn btnhover btn-custom '
                        >
                          <i className='flaticon-shopping-cart-1'></i>{' '}
                          <span>加入購物車</span>
                        </button>
                        <div className='bookmark-btn style-1 d-none d-sm-block'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            id='flexCheckDefault1'
                          />

                          <Link
                            to={UsedBooks?.webReaderLink as string}
                            className=' btn-custom2'
                          >
                            <div
                              style={{
                                padding: '7px 10px',
                                backgroundColor: '#efefef',
                                borderRadius: '8px',
                                marginLeft: '10px'
                              }}
                            >
                              <FontAwesomeIcon icon={faBook} />
                              <span>試閱</span>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row' style={{ marginTop: '60px' }}>
            <div className='col-xl-8'>
              <div className='tabs-site-button'>
                <ul className='nav nav-tabs'>
                  <li>
                    <a data-bs-toggle='tab' href='' className='active'>
                      書籍資訊
                    </a>
                  </li>
                  {/* <li>
                                        <a data-bs-toggle="tab" href="">
                                            用戶評論
                                        </a>
                                    </li> */}
                </ul>
                <div className='tab-content'>
                  <div id='graphic-design-1' className='tab-pane show active'>
                    <table className='table border book-overview'>
                      <tr>
                        <th>品名</th>
                        <td>{UsedBooks?.title}</td>
                      </tr>
                      <tr>
                        <th>作者</th>
                        <td>
                          {UsedBooks?.authors?.join(', ') || '缺少作者資訊'}
                        </td>
                      </tr>
                      <tr>
                        <th>ISBN</th>
                        <td>{UsedBooks?.identifier}</td>
                      </tr>

                      <tr>
                        <th>出版日期</th>
                        <td>
                          {publishDate?.toLocaleDateString('zh-TW', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </td>
                      </tr>
                      <tr>
                        <th>出版商</th>
                        <td>{UsedBooks?.publisher}</td>
                      </tr>
                      {/* <tr className='tags'>
                        <th>標籤</th>
                        <td>
                          {product?.productKeywords &&
                          product?.productKeywords.length > 0 ? (
                            product?.productKeywords.map((tags) => {
                              return (
                                <a href='#' className='badge'>
                                  {tags.keywordName}
                                </a>
                              );
                            })
                          ) : (
                            <a href='#' className='badge'>
                              無標籤
                            </a>
                          )}
                        </td>
                      </tr> */}
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-xl-4 mt-5 mt-xl-0'>
              <div className='widget'>
                <h4 className='widget-title'>同分類書籍</h4>
                <div className='row'>
                  {sameCategoryBook && sameCategoryBook.length > 0 ? (
                    sameCategoryBook?.map((book) => {
                      return (
                        <div className='col-xl-12 col-lg-6'>
                          <div className='dz-shop-card style-5'>
                            <div className='dz-media'>
                              <img
                                src={book?.imageLinks?.thumbnail ?? noImage}
                                alt='book'
                              />
                            </div>
                            <div className='dz-content'>
                              <h5 className='subtitle'>{book.title}</h5>

                              <div className='price'>
                                <span className='price-num'>
                                  優惠價: 45.4元
                                </span>
                                <del>{book.price}</del>
                              </div>
                              <button
                                name='addToCart'
                                type='button'
                                className='btn btn-outline-primary btn-sm btnhover btnhover2'
                                onClick={handleAddToCart} // 現在直接調用函數，無需額外的箭頭函數
                              >
                                <i className='flaticon-shopping-cart-1 me-2'></i>
                                加入購物車
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className='col-xl-12 col-lg-6'>
                      <div className='dz-shop-card style-5'>
                        <div className='dz-content'>
                          <h5 className='subtitle'>無相關書籍</h5>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showScrollToTop && (
        <div className='scroll-to-top' onClick={scrollToTop}>
          <FontAwesomeIcon icon={faChevronUp} />
        </div>
      )}
    </div>
  );
};
export default UsedBookInside;
