// OrderConfirmation.tsx
import React, { ChangeEvent, useEffect, useState } from 'react';
import '../../assets/css/app.css';
import { Outlet, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import {
  UsedBookCartsDto,
  usePostApiUsedBookOrdersCreateApi,
  usePostApiUsedBookBuyerInfomationsApi,
  useDeleteApiUsedBookCartsApiId,
  useGetApiMembersId
} from '../../API';
import {
  usepaymentAmountStore,
  paymentAmountstate,
  usedUsedBookCartStore,
  usedBookCartState,
  buyerInformationState,
  usedBuyerInformationStore
} from '../../state';
import LinePay from '../../picture/LinePay.png';
import Ecpay from "../../picture/ECPay.png";

interface UsedBookOrderProps {
  cart: UsedBookCartsDto[];
  total: number;
  fee: number;
}

//寄送資訊
export const CheckOutStep1 = () => {
  const memberId: number = 28;
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [remark, setRemark] = useState<string>('');

  //帶入會員資料
  const memberData = useGetApiMembersId(memberId);
  console.log(memberData.data?.data);
  useEffect(() => {
    const data = memberData.data?.data;
    if (data) {
      setRecipientName(data.name)
      setRecipientPhone(data.phoneNumber)
      setRecipientAddress(data.address)
      setRecipientEmail(data.email)
    }
  }, [memberData.data?.data])

  const [nameValid, setNameValid] = useState<boolean>();
  const [addressValid, setAddressValid] = useState<boolean>();
  const [phoneValid, setphoneValid] = useState<boolean>();
  const phoneRegex = /^(09)\d{8}$/; //電話格式

  function handelRecipientNameChange(e: ChangeEvent<HTMLInputElement>) {
    setRecipientName(e.target.value);
    if (e.target.value == '') {
      setNameValid(false);
    }
  }
  function handelRecipientPhoneChange(e: ChangeEvent<HTMLInputElement>) {
    const phoneValue = e.target.value;
    setRecipientPhone(phoneValue);
  }
  function handelRecipientAddressChange(e: ChangeEvent<HTMLInputElement>) {
    setRecipientAddress(e.target.value);
    if (e.target.value == '') {
      setAddressValid(false);
    }
  }
  function handelRecipientEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setRecipientEmail(e.target.value);
  }
  function handelRemarkChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setRemark(e.target.value);
  }

  useEffect(() => {
    if (recipientPhone !== '') {
      if (phoneRegex.test(recipientPhone)) {
        setphoneValid(true);
      } else {
        setphoneValid(false);
      }
    }
  }, [recipientPhone]);
  useEffect(() => {
    if (recipientName != '') {
      setNameValid(true);
    }
  }, [recipientName]);
  useEffect(() => {
    if (recipientAddress != '') {
      setAddressValid(true);
    }
  }, [recipientAddress]);

  const { setBuyerName, setBuyerAddress, setBuyerEmail, setBuyerPhone } =
    usedBuyerInformationStore<buyerInformationState>((state) => state);

  const toNextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!nameValid || !addressValid || !phoneValid) {
      e.preventDefault();
      if (recipientName.trim() === '') {
        setNameValid(false);
      }
      if (recipientPhone.trim() === '') {
        setphoneValid(false);
      }
      if (recipientAddress.trim() === '') {
        setAddressValid(false);
      }
    } else {
      setBuyerName(recipientName);
      setBuyerPhone(recipientPhone);
      setBuyerAddress(recipientAddress);
      setBuyerEmail(recipientEmail);
      setRemark(remark);
    }
  };

  return (
    <div id='step-1' role='tabpanel' aria-labelledby='step-1'>
      <div className='contact-info'>
        <h4 className='mb-32'>寄送資訊</h4>
      </div>
      <div className='row'>
        <div className='col-sm-6'>
          <div className='mb-24'>
            <input
              type='text'
              className='form-control'
              id='name'
              name='name'
              placeholder='收件人姓名'
              value={recipientName}
              onChange={handelRecipientNameChange}
            />
            {nameValid == false && (
              <p style={{ color: '#F08080' }}>請輸入收件人姓名</p>
            )}
          </div>
        </div>
        <div className='col-sm-6'>
          <div className='mb-24'>
            <input
              type='tel'
              className='form-control'
              id='phone'
              name='phone'
              placeholder='收件人電話'
              value={recipientPhone}
              onChange={handelRecipientPhoneChange}
            />
            {phoneValid == false && (
              <p style={{ color: '#F08080' }}>請輸入有效的手機號碼</p>
            )}
          </div>
        </div>
        <div className='col-sm-12'>
          <div className='mb-24'>
            <input
              type='text'
              className='form-control'
              id='email'
              name='email'
              placeholder='Email'
              value={recipientEmail}
              onChange={handelRecipientEmailChange}
            />
          </div>
        </div>
        <div className='col-sm-12'>
          <div className='mb-24'>
            <input
              type='text'
              className='form-control'
              id='House'
              name='House'
              placeholder='請輸入完整地址'
              value={recipientAddress}
              onChange={handelRecipientAddressChange}
            />
            {addressValid == false && (
              <p style={{ color: '#F08080' }}>請輸入寄送地址</p>
            )}
          </div>
        </div>
        <div className='col-sm-12'>
          <textarea
            className='form-control notes mb-32'
            name='notes'
            id=''
            cols={68}
            rows={5}
            placeholder='備註事項'
            value={remark}
            onChange={handelRemarkChange}
          ></textarea>
        </div>
        <div className='sw-toolbar-elm toolbar toolbar-bottom' role='toolbar'>
          <Link to={'/usedBook/usedBookCart'} className='nav-link'>
            <button className='btn sw-btn-prev sw-btn' type='button'>
              Back
            </button>
          </Link>
          <Link to={'/usedBook/checkOut/Step2'} className='nav-link'>
            <button
              className='btn sw-btn-next sw-btn'
              type='button'
              onClick={toNextStep}
            >
              Next
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

//付款方式 //todo 加綠界
export const CheckOutStep2 = () => {
  const [memberId, setMemberId] = useState<number>(28);

  //取得收件人資料
  const { BuyerName, BuyerPhone, BuyerAddress, BuyerEmail, remark } =
    usedBuyerInformationStore<buyerInformationState>((state) => state);

  //取得付款金額
  const { count, setCount } = usepaymentAmountStore<paymentAmountstate>(
    (state) => state
  );

  //取得商品及運費
  const { orderItem, setOrderItem, orderFee, setOrderFee } =
    usedUsedBookCartStore<usedBookCartState>((state) => state);
  const sellers = new Set(orderItem.map((item) => item.sellerID));

  //移除購物車商品
  const { mutate: deleteCartItem } = useDeleteApiUsedBookCartsApiId();
  function deleteCartItems(Id: number) {
    deleteCartItem({ id: Id });
  }

  //新增訂單
  const { mutate: createOrder } = usePostApiUsedBookOrdersCreateApi();
  function createOrders(
    orderItem: UsedBookCartsDto[],
    buyerId: number,
    fee: number,
    method: string,
    paymentNumber: string,
    paymentAmount: number
  ) {
    createOrder({
      data: orderItem,
      params: {
        buyerId: buyerId,
        fee: fee,
        method: method,
        paymentNumber: paymentNumber,
        paymentAmount: paymentAmount
      }
    });
  }

  //新增收件人資料
  const { mutate: createBuyerInfomation } =
    usePostApiUsedBookBuyerInfomationsApi();
  function createInfomation(
    buyerName: string,
    buyerPhone: string,
    buyerEmail: string,
    buyerAddress: string,
    remark: string,
    orderId: string
  ) {
    createBuyerInfomation({
      data: {
        recipientName: buyerName,
        recipientPhone: buyerPhone,
        recipientEmail: buyerEmail,
        recipientAddress: buyerAddress,
        remark: remark,
        orderId: orderId
      }
    });
  }

  const requestPayment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const baseLoginPayUrl = 'https://localhost:7236/api/LinePay/';
    const paymentNumber = Date.now().toString();

    const payment = {
      amount: count,
      currency: 'TWD',
      orderId: paymentNumber,
      packages: [
        {
          id: '20191011I001',
          amount: count,
          name: '島讀日',
          products: [
            {
              name: '島讀日',
              quantity: 1,
              price: count
            }
          ]
        }
      ],
      redirectUrls: {
        confirmUrl: 'http://localhost:5173/usedBook/usedBookPayment/linepay',
        cancelUrl: 'https://localhost:7236/api/Cancel'
      }
    };

    try {
      const response = await fetch(baseLoginPayUrl + 'Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payment)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      //依照賣家生成訂單
      sellers.forEach((seller) => {
        //計算單筆訂單金額
        let amount: number = 0;
        orderItem.forEach((item) => {
          if (item.sellerID == seller) {
            amount += item.unitPrice!;
          }
        });
      });

      //生成訂單&明細&付款紀錄
      createOrders(
        orderItem,
        memberId,
        orderFee,
        'LinePay',
        paymentNumber,
        count
      );
      createInfomation(
        BuyerName,
        BuyerPhone,
        BuyerEmail,
        BuyerAddress,
        remark,
        paymentNumber
      );

      //移除結帳完的購物車商品
      orderItem.forEach((item) => {
        deleteCartItems(item.id!);
      });

      const res = await response.json();
      window.location = res.info.paymentUrl.web;
    } catch (error) {
      console.log('Request failed', error);
    }
  };

  return (
    <div id='step-2' role='tabpanel' aria-labelledby='step-2'>
      <div className='contact-info'>
        <h4 className='mb-32'>付款方式</h4>
      </div>
      <div className='row'>
        <div className=''>
          <div className='mb-24'>
            <div className='mb-24'>
              <div>
                <button type='button' onClick={requestPayment} className='col-5 mx-3' style={{ backgroundColor: 'white' }}>
                  <img style={{ height: '170px', border: '1px solid gray', borderRadius: '10px' }} src={LinePay} />
                </button>
                <button type="button" className='col-5 mx-3' style={{ backgroundColor: 'white' }}>
                  <img style={{ height: '170px', border: '1px solid gray', borderRadius: '10px', padding: '30px', backgroundColor: 'white' }} src={Ecpay} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='col-sm-12'>
          <div className='mb-24'></div>
        </div>
        <div className='sw-toolbar-elm toolbar toolbar-bottom' role='toolbar'>
          <Link to={'/usedBook/checkOut'} className='nav-link'>
            <button className='btn sw-btn-prev sw-btn' type='button'>
              Back
            </button>
          </Link>
        </div>
      </div>
    </div >
  );
};

//訂單資訊
const YourUsedBookOrder: React.FC<UsedBookOrderProps> = ({
  cart,
  total,
  fee
}) => {
  //運費計算
  const sellers = new Set(cart.map((item) => item.sellerName)); //找到商品來自哪些不同賣家
  const totalFee = sellers.size * fee;
  const paymentAmount = total + totalFee;

  const { count, setCount } = usepaymentAmountStore<paymentAmountstate>(
    (state) => state
  );
  useEffect(() => {
    setCount(paymentAmount);
  }, [paymentAmount]);

  return (
    <div className='order-detail'>
      {Array.from(sellers).map((seller, index) => {
        let orderTotal = 0;
        return (
          <Fragment key={index}>
            <div className='sub-total'>
              <h5>訂單{index + 1}</h5>
              <h5>賣家：{seller}</h5>
            </div>
            <div className='sub-total'>
              <h6>
                <span className='dark-gray'>訂單商品</span>
              </h6>
              <h6>單價</h6>
            </div>
            <hr />
            {cart.map((item) => {
              if (item.sellerName == seller) {
                orderTotal += item.unitPrice!;
                return (
                  <div className='sub-total' key={item.id}>
                    <h6>
                      <span className='dark-gray'>{item.name}</span>
                    </h6>
                    <h6>${item.unitPrice}</h6>
                  </div>
                );
              }
            })}
            <hr />
            <div className='sub-total'>
              <h6 className='dark-gray'>商品總價</h6>
              <h6>${orderTotal}</h6>
            </div>
            <div className='sub-total'>
              <h6 className='dark-gray'>運費</h6>
              <h6>${fee}</h6>
            </div>
            <hr />
          </Fragment>
        );
      })}
      <h6>選擇折價券</h6>
      <div className='find-books-input'>
        <input type='text' className='search-input' placeholder='Add Coupon' />
        <a href='#'>
          <img src='static/picture/click-btn-white.png' alt='' />
        </a>
      </div>
      <hr />
      <div className='sub-total'>
        <h5 className='dark-gray'>折價券</h5>
        <h5>-$00.00</h5>
      </div>
      <div className='sub-total'>
        <h4>總付款金額</h4>
        <h4>${paymentAmount}</h4>
      </div>
      <hr />
    </div>
  );
};

const OrderConfirmation: React.FC = () => {
  const [cart, setCart] = useState<UsedBookCartsDto[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [fee, setFee] = useState<number>(0);

  // 取得商品及總額, 只在由購物車載入付款頁面時獲取
  const location = useLocation();
  useEffect(() => {
    if (location.state) {
      setCart(location.state.cartItems);
      setTotal(location.state.total);
      setFee(location.state.fee);
    }
  }, [location.state]);

  const { orderItem, setOrderItem, orderFee, setOrderFee } =
    usedUsedBookCartStore<usedBookCartState>((state) => state);
  useEffect(() => {
    setOrderItem(cart);
  }, [cart]);
  useEffect(() => {
    setOrderFee(fee);
  }, [fee]);

  return (
    <div className="cart">
      <div className='page-content'>
        {/* Shipping Details Start */}
        <section className='checkout container'>
          <div className='row'>
            <div className='col-xl-8'>
              <div className='checkout-form'>
                <form action='signup.html' id='form-wizard'>
                  <ul className='nav'>
                    <li className='nav-item'>
                      {/* <Link to={'/checkOut/'} className="nav-link"> */}
                      <div className='nav-link'>
                        <div className='num'>1</div>
                        <span>寄送資訊</span>
                      </div>
                      {/* </Link> */}
                    </li>
                    <li className='nav-item'>
                      {/* <Link to={`/checkOut/Step2`} className="nav-link"> */}
                      <div className='nav-link'>
                        <div className='num'>2</div>
                        <span>付款方式</span>
                      </div>
                      {/* </Link> */}
                    </li>
                  </ul>

                  <div className='tab-content'>
                    <Outlet />
                  </div>
                </form>
              </div>
            </div>
            <div className='col-xl-4'>
              <YourUsedBookOrder cart={cart} total={total} fee={fee} />
            </div>
          </div>
        </section>

        {/* Shipping Details End */}
      </div>
    </div>
  );
};

export default OrderConfirmation;
