import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/app.css';
import orangeCart from '../../assets/picture/orange-cart2.png';
import defaultImage2 from '../../assets/images/no image available.jpg';
import {
  useGetApiUsedBookCartsApi,
  UsedBookCartsDto,
  useGetApiUsedBooksIdId,
  useDeleteApiUsedBookCartsApiId
} from '../../API';
import Preloader from '../../components/Preloader/Preloader';
//import { usedBookCartState, usedUsedBookCartStore } from '../../state';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './UsedBooksOrderPage.css';

const UsedBookPicture: React.FC<{ UsedBookId: number }> = ({ UsedBookId }) => {
  const UsedBooksResponse = useGetApiUsedBooksIdId(UsedBookId);
  if (UsedBooksResponse.isLoading) return <div>Loading</div>;
  return (
    <div className='img-block2'>
      <img
        src={
          `data:image/png;base64,${UsedBooksResponse.data?.data.picture}` ||
          defaultImage2
        }
        alt='book'
      />
    </div>
  );
};

const UsedBooksCart: React.FC = () => {
  const [memberId, setMemberId] = useState<number>(28);
  const cartData = useGetApiUsedBookCartsApi({ memberId: memberId });
  const [cart, setCart] = useState<UsedBookCartsDto[]>([]);
  useEffect(() => {
    setCart(cartData.data?.data as UsedBookCartsDto[]);
  }, [cartData.data?.data]);

  // 移除購物車商品
  const { mutate: deleteCartItem } = useDeleteApiUsedBookCartsApiId();
  function deleteCartItems(Id: number) {
    deleteCartItem({ id: Id });
  }

  const removeFromCart = (itemId: number) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== itemId));
    setChosedItems(chosedItems.filter((item) => item.id !== itemId));
    deleteCartItems(itemId);
  };

  // 清空購物車
  const clearCart = () => {
    setCart([]);
    setChosedItems([]);
  };

  const [chosedItems, setChosedItems] = useState<UsedBookCartsDto[]>([]);

  // 商品勾選/取消勾選
  function handleChosedItemChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { checked, value } = e.target;
    const itemId = parseInt(value, 10);

    if (checked) {
      const findItem = cart.find(
        (item) => item.id === itemId && item.productStatus === true
      );
      if (findItem) {
        setChosedItems([...chosedItems, findItem]);
      }
    } else {
      setChosedItems(chosedItems.filter((item) => item.id !== itemId));
    }
  }

  // 全選/取消全選
  function handleChosedAllItems(e: React.ChangeEvent<HTMLInputElement>) {
    const isChecked = e.target.checked;

    // 找到所有cartItem, 並排除掉為disabled的選項
    const itemCheckboxes = document.querySelectorAll<HTMLInputElement>(
      'input[name="cartItem"]:not(:disabled)'
    );
    // 使狀態與全選框一致
    itemCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });

    itemCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });

    if (isChecked) {
      //將cart中所有狀態為true的商品加入購物車
      setChosedItems(cart.filter((item) => item.productStatus === true));
    } else {
      setChosedItems([]);
    }
  }

  const [fee, setFee] = useState<number>(NaN);
  function setShippingFee(e: React.ChangeEvent<HTMLInputElement>) {
    setFee(parseInt(e.target.value));
  }

  const total = chosedItems.reduce((acc, item) => acc + item.unitPrice!, 0);
  const totalItems = chosedItems.length;

  const navigate = useNavigate();
  const handleCheckout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (chosedItems.length === 0) {
      alert('請先勾選商品再進行結帳');
      return;
    }
    if (isNaN(fee)) {
      alert('請選擇商品運送方式');
      return;
    }
    navigate('/usedBook/checkOut', {
      state: { cartItems: chosedItems, total: total, fee: fee }
    });
  };

  return (
    <div className='cart'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <table className='cart-table mb-24'>
              <thead>
                <tr
                  style={{
                    backgroundColor: '#c19e7d',
                    borderRadius: '10px'
                  }}
                >
                  <th
                    className='col-1 '
                    style={{
                      paddingLeft: '25px',
                      color: '#ffff',
                      fontWeight: 'bold',
                      paddingTop: '20px'
                    }}
                  >
                    <input type='checkbox' onChange={handleChosedAllItems} />{' '}
                    全選
                  </th>
                  <th
                    className='col-5'
                    style={{
                      textAlign: 'center',
                      color: '#ffff',
                      fontWeight: 'bold',
                      paddingTop: '20px'
                    }}
                  >
                    商品
                  </th>
                  <th
                    className='col-2'
                    style={{
                      paddingLeft: '25px',
                      color: '#ffff',
                      fontWeight: 'bold',
                      paddingTop: '20px'
                    }}
                  >
                    單價
                  </th>
                  <th
                    className='col-2'
                    style={{
                      paddingLeft: '25px',
                      color: '#ffff',
                      fontWeight: 'bold',
                      paddingTop: '20px'
                    }}
                  >
                    書況
                  </th>
                  <th
                    className='col-2'
                    style={{
                      textAlign: 'center',
                      color: '#ffff',
                      fontWeight: 'bold',
                      paddingTop: '20px',
                      paddingLeft: '21px'
                    }}
                  >
                    賣家
                  </th>
                  <th
                    className='col-1'
                    style={{
                      paddingLeft: '21px',
                      color: '#ffff',
                      fontWeight: 'bold',
                      paddingTop: '20px'
                    }}
                  ></th>
                </tr>
              </thead>
              <tbody>
                {cart && cart.length > 0 ? (
                  cart.map((item) => {
                    return (
                      <tr className='col-md-8 mb-5' key={item.id}>
                        <td>
                          <input
                            type='checkbox'
                            value={item.id}
                            onChange={handleChosedItemChange}
                            name='cartItem'
                            disabled={item.productStatus ? false : true}
                          />
                          {/* productStatus 為false時商品不可被勾選 */}
                        </td>
                        <td>
                          <div className='product-detail-box'>
                            <div className='img-block'>
                              <UsedBookPicture
                                UsedBookId={item.bookID as number}
                              />
                            </div>
                            <div>
                              <h5
                                className='dark-gray'
                                style={{ textAlign: 'left' }}
                              >
                                {item.name}
                              </h5>
                            </div>
                          </div>
                        </td>
                        <td>
                          <h6 className='dark-gray'>
                            {item.productStatus
                              ? '$' + item.unitPrice
                              : '商品已下架或售出'}
                          </h6>
                        </td>
                        <td>
                          <h6
                            className='dark-gray'
                            style={{ textAlign: 'center' }}
                          >
                            {item.bookStatus}
                          </h6>
                        </td>
                        <td>
                          <h6
                            className='dark-gray'
                            style={{ textAlign: 'center' }}
                          >
                            {item.sellerName}
                          </h6>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <a
                            href='#'
                            className='deleteicon'
                            onClick={() => removeFromCart(item.id!)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </a>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className='col-md-8 mb-5'>
                    <td>
                      <h5>尚無商品</h5>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <section className='shipping mb-40'>
        <div className='container'>
          <div className='choose-shipping-mode'>
            <div className='row'>
              <div className='col-xl-4'>
                <div className='shipping-details'>
                  <div className='filter-block'>
                    <div className='title mb-32'>
                      <h4>Choose shipping mode</h4>
                    </div>
                    <ul className='unstyled list'>
                      <li className='cart-list'>
                        <div className='filter-checkbox'>
                          <input
                            type='radio'
                            id='Instock'
                            name='fee'
                            value={60}
                            onChange={setShippingFee}
                          />
                          <label
                            className='cart-font black-color'
                            htmlFor='Instock'
                          >
                            超商取貨(3~7天) $60.00
                          </label>
                        </div>
                      </li>

                      <li className='cart-list'>
                        <div className='filter-checkbox'>
                          <input
                            type='radio'
                            id='Instock1'
                            name='fee'
                            value={90}
                            onChange={setShippingFee}
                          />
                          <label
                            className='cart-font black-color'
                            htmlFor='Instock1'
                          >
                            宅配到家(3~4天) $90.00
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className='col-xl-4 '>
                <div className=''>
                  <h4>Total</h4>
                  <div className='sub-total ' style={{ paddingTop: '35px' }}>
                    <h5>商品數量：{totalItems}</h5>
                  </div>
                  <div className='grand-total' style={{ paddingTop: '5px' }}>
                    <h5>商品總金額：{total.toFixed(0)}</h5>
                  </div>
                </div>
              </div>
              <div className='col-xl-4 row'>
                <div className='col  justify-content-end'>
                  <button
                    className='button-fade'
                    style={{ marginTop: '35px' }}
                    onClick={clearCart}
                  >
                    清空購物車
                  </button>
                </div>
                <h6 className='col  justify-content-end'>
                  <button
                    onClick={handleCheckout}
                    className='cus-btn2'
                    style={{ marginTop: '35px' }}
                  >
                    <span className='icon'>
                      <img src={orangeCart} alt='' />
                    </span>
                    去結帳
                  </button>
                </h6>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UsedBooksCart;
