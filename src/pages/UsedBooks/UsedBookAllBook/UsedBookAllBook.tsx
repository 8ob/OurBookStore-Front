import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams, Link } from 'react-router-dom';
// import '../../../assets/css/bootstrap.css';
import '../../../assets/css/style.css';
import '../../../assets/css/responsive.css';
import '../../../assets/css/color.css';
import '../UsedBookAllBook/AllBookStyle.css'; // Make sure your CSS file has all the necessary styles
import Preloader from '../../../components/Preloader/Preloader';
import {
  useGetApiUsedBooks,
  useGetApiUsedBooksIdId,
  usePostApiUsedBookCartsApi,
  getGetApiUsedBookCartsApiQueryKey
} from '../../../API';
import defaultImage from '../../../assets/images/NoImageSmall.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../../components/Menu/nav.css';
import {
  faChevronUp,
  faTag,
  faHeart,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
import { useSnackbar } from '../../../Context/SnackbarContext';
import backgroundImage from '../../../assets/images/main-slider/about3.jpg';
//Token
import { jwtDecode } from 'jwt-decode';
import { useQueryClient } from '@tanstack/react-query';

const UsedBookAllBook = () => {
  const { UsedBookId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetApiUsedBooks();
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const memberId = 28;

  //加入購物車
  const addBookToCartMutation = usePostApiUsedBookCartsApi();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookClick = (event: React.MouseEvent, bookId: number) => {
    event.stopPropagation();
    navigate(`/usedBook/${bookId}`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  //加入購物車
  const handleAddToCart = (event: React.MouseEvent, bookId: number) => {
    event.stopPropagation();
    console.log('memberId:', memberId);
    console.log('bookID:', bookId);
    if (!memberId || !bookId) {
      showSnackbar('無法加入購物車。', 'error');
      console.error('無效的 memberId 或 bookID');

      return;
    }

    addBookToCartMutation.mutate(
      {
        data: {
          memberID: memberId,
          bookID: bookId
        }
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: getGetApiUsedBookCartsApiQueryKey({
              memberId: memberId
            }) //TODO: 會員ID
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

  if (isLoading) return <Preloader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* 背景圖片和標題 */}
      <section
        className='page-title'
        style={{
          backgroundImage: `url(${backgroundImage})`,
          marginTop: '180px'
        }}
      ></section>
      <div style={{ margin: '100px' }}>
        <div
          className='books-panel'
          id='shortcode-db6f6943175305c452fe58565c524e3a'
        >
          <div className='books-panel-container mt-2 row '>
            {data?.data.map((book) => (
              <div key={book.id} className='books-panel-item col-sm-3 col-xs-4'>
                <div
                  className={`books-panel-item-wrap ${
                    selectedBook === book.id ? 'is-flipped' : ''
                  }`}
                  onClick={(e) => handleBookClick(e, book.id)} // 添加點擊處理器
                  onMouseEnter={() => setSelectedBook(book.id as number)}
                  onMouseLeave={() => setSelectedBook(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <button
                    type='button'
                    onClick={(e) => handleAddToCart(e, book.id as number)}
                    className='btn btnhover btn-custom '
                    style={{
                      backgroundColor: '#ae9e88',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      position: 'absolute',
                      top: '440px',
                      left: '260px',
                      marginTop: 'auto'
                    }}
                  >
                    <i className='flaticon-shopping-cart-1'></i>{' '}
                  </button>
                  <div className='book-thumb-img-wrap has-edge'>
                    <img
                      width='200'
                      height='300'
                      src={
                        (book.imageLinks?.thumbnail as string) || defaultImage
                      }
                      className='attachment-odrin_small_soft size-odrin_small_soft wp-post-image'
                      alt={book.title as string}
                    />
                    <div className='book-spine'></div>
                  </div>
                  <div>
                    <div
                      style={{
                        marginTop: '30px',
                        marginBottom: '10px'
                      }}
                    >
                      <p className='book-thumb-title'>{book.title}</p>
                      <br />
                    </div>

                    {/* <div className='cart'>
                    <div className='extra-nav'>
                      <div className=' extra-cell'></div>
                    </div>
                  </div> */}

                    {/* <div className='heart'>
                    <div className='extra-nav'>
                      <div className=' extra-cell'>
                        <ul className='navbar-nav header-right'>
                          <li className='nav-item'>
                            <a className='nav-link' href='#'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                height='24px'
                                viewBox='0 0 24 24'
                                width='24px'
                                fill='#000000'
                              >
                                <path d='M0 0h24v24H0V0z' fill='none'></path>
                                <path d='M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z'></path>
                              </svg>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div> */}
                    <p className='bookPrice'>
                      <FontAwesomeIcon icon={faTag} />
                      &ensp; 價格 NT{book.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {showScrollToTop && (
            <div className='scroll-to-top' onClick={scrollToTop}>
              <FontAwesomeIcon icon={faChevronUp} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsedBookAllBook;
