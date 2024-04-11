//import React from 'react'
import '../../assets/css/app.css';
import './usedBookOrder.css'
import React, { useState, useEffect } from 'react';
import mailBox from '../../picture/mail-box.png';
import {
  useGetApiUsedBookOrdersApi,
  UsedBookOrderDto,
  useGetApiUsedBookOrderDetails,
  UsedBookOrderDetailDto,
  useGetApiUsedBookBuyerInfomationsApi,
  UsedBookBuyerInformation,
  useGetApiUsedBookOrderMessages,
  UsedBookOrderMessage,
  usePostApiUsedBookOrderMessages,
  usePostApiUsedBookOrderReturnApi
} from '../../API';

interface OrderDetailProps {
  id: number;
}
interface OrderMessageProps {
  orderId: number;
  memberId: number;
}

//訂單明細
const OrderDetail: React.FC<OrderDetailProps> = ({ id }) => {
  //取得訂單明細
  const orderDetailData = useGetApiUsedBookOrderDetails({ orderId: id });
  const [orderDetail, setOrderDetail] = useState<UsedBookOrderDetailDto[]>([]);
  useEffect(() => {
    setOrderDetail(orderDetailData.data?.data as UsedBookOrderDto[]);
  }, [orderDetailData.data?.data]);

  const buyerInfomationData = useGetApiUsedBookBuyerInfomationsApi({ orderId: id });
  const [buyerInfomation, setBuyerInfomation] = useState<UsedBookBuyerInformation>();
  useEffect(() => {
    setBuyerInfomation(buyerInfomationData.data?.data)
  }, [buyerInfomationData.data?.data])

  return (
    <div className='modal-body'>
      <table className='orderDetailTable'>
        <thead>
          <tr>
            <th>書籍名稱</th>
            <th>單價</th>
          </tr>
        </thead>
        <tbody className=''>
          {orderDetail &&
            orderDetail.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.bookName}</td>
                  <td>${item.unitPrice}</td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <hr className='my-4' />
      <div className="card">
        <ul className="list-group list-group-flush">
          <li className="list-group-item">收件人姓名：{buyerInfomation?.recipientName}</li>
          <li className="list-group-item">收件人電話：{buyerInfomation?.recipientPhone}</li>
          <li className="list-group-item">收件人地址：{buyerInfomation?.recipientAddress}</li>
          <li className="list-group-item">備註：{buyerInfomation?.remark}</li>
        </ul>
      </div>

    </div >
  );
};

//聊天室
const OrderMessage: React.FC<OrderMessageProps> = ({ orderId, memberId }) => {

  //聊天紀錄
  const orderMessageDatas = useGetApiUsedBookOrderMessages({ orderId: orderId });
  const [orderMessages, setOrderMessages] = useState<UsedBookOrderMessage[]>([]);
  useEffect(() => {
    setOrderMessages(orderMessageDatas.data?.data!);
  }, [orderMessageDatas.data?.data]);

  //傳送訊息
  const [messageInput, setMessageInput] = useState('');
  const { mutate: createMessage } = usePostApiUsedBookOrderMessages();
  let i = 500;
  const createMessages = async () => {
    createMessage({ data: { orderId: orderId, memberId: memberId, message: messageInput } })
    const newMessage: UsedBookOrderMessage = {
      id: i,
      message: messageInput,
      memberId: memberId
    };
    i++
    setOrderMessages([...orderMessages, newMessage]);
    setMessageInput('');
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && messageInput.trim() != '') {
      createMessages();
    }
  }

  return (
    <>
      <div className="messages">
        {orderMessages && (orderMessages.map((item) => {
          return (
            item.memberId == memberId ? (
              <div className="message" key={item.id}>
                <div className="content message-send">
                  {item.message}
                </div>
              </div>) : (
              <div className="message" key={item.id}>
                <div className="content">
                  {item.message}
                </div>
              </div>
            )
          )
        }))}
      </div>
      <div className="message-input">
        <textarea
          name='notes'
          cols={68}
          rows={3}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown}
        ></textarea>
      </div>
    </>
  )
}

//訂單管理頁面
const UsedBooksOrder: React.FC = () => {
  const [memberId, setMemberId] = useState<number>(28);

  //購買訂單
  const buyerOrderData = useGetApiUsedBookOrdersApi({
    memberId: memberId,
    type: 'buyer'
  });
  const [buyerOrder, setBuyerOrder] = useState<UsedBookOrderDto[]>([]);
  useEffect(() => {
    setBuyerOrder(buyerOrderData.data?.data as UsedBookOrderDto[]);
  }, [buyerOrderData.data?.data]);

  //販售訂單
  const sellerOrderData = useGetApiUsedBookOrdersApi({
    memberId: memberId,
    type: 'seller'
  });
  const [sellerOrder, setSellerOrder] = useState<UsedBookOrderDto[]>([]);
  useEffect(() => {
    setSellerOrder(sellerOrderData.data?.data as UsedBookOrderDto[]);
  }, [sellerOrderData.data?.data]);

  //修改日期顯示格式
  function formatDate(dateString: string): string {
    const originalDate: Date = new Date(dateString);
    const year: number = originalDate.getFullYear();
    const month: string = String(originalDate.getMonth() + 1).padStart(2, '0');
    const day: string = String(originalDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  //取消訂單視窗
  const [showOrderReturnModal, setShowOrderReturnModal] =
    useState<boolean>(false);
  const [modalIndex, setModalIndex] = useState<number>();
  const handleLinkClick = (id: number) => {
    setShowOrderReturnModal(true);
    setModalIndex(id);
  };
  const handleCloseModal = () => {
    setShowOrderReturnModal(false);
  };

  //取消申請
  const [reasonInput, setReasonInput] = useState('');
  const { mutate: orderReturn } = usePostApiUsedBookOrderReturnApi();
  function orderReturnApplication(orderId: number, memberId: number, reason: string) {
    orderReturn({ params: { orderId: orderId, memberId: memberId, reason: reason } })
  }
  function orderReturnSubmit() {
    orderReturnApplication(modalIndex!, memberId, reasonInput);
    setShowOrderReturnModal(false);
  }

  //訂單明細
  const [detailIndex, setDetailIndex] = useState<number>(0);
  const [orderDetailModal, setOrderDetailModal] = useState<boolean>(false);
  const showOrderDetail = (id: number) => {
    setDetailIndex(id);
    setOrderDetailModal(true);
  };
  const closeOrderDetail = () => {
    setOrderDetailModal(false);
  };

  //聊天室
  const [orderMessage, setOrderMessage] = useState<boolean>(false);
  const [memberName, setMemberName] = useState<string>('');
  const [orderId, setOrderId] = useState<number>(0);
  const showMessage = (memberName: string, orderId: number) => {
    setMemberName(memberName)
    setOrderId(orderId);
    setOrderMessage(true);
  };
  const closeMessage = () => {
    setOrderMessage(false);
  }

  return (
    <div className="container">
      <div className='cart'>
        <h2 className='text-secondary'>二手書訂單查詢</h2>
        <hr />

        <h4 className='pb-3'>購買訂單</h4>
        <table className='cart-table mb-24'>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>訂單編號</th>
              <th className='ps-4' style={{ textAlign: 'left' }}>訂購日期</th>
              <th style={{ textAlign: 'left' }}>訂單金額</th>
              <th className='ps-3' style={{ textAlign: 'left' }}>訂單狀態</th>
              <th className='ps-4' style={{ textAlign: 'left' }}>賣家</th>
              <th>　　　　</th>
            </tr>
          </thead>
          {buyerOrder && buyerOrder.length > 0 ? (
            buyerOrder.map((item) => {
              return (
                <tbody key={item.id}>
                  <tr>
                    <td style={{ textAlign: 'left' }}>
                      <a href='#' onClick={() => showOrderDetail(item.id!)}>
                        #{item.id}
                      </a>
                    </td>
                    <td style={{ textAlign: 'left' }}>{formatDate(item.orderDate!)}</td>
                    <td style={{ textAlign: 'left' }}>{item.totalAmount! + item.shippingFee!}</td>
                    <td style={{ textAlign: 'left' }}>{item.status}</td>
                    <td style={{ fontSize: '16px', color: '#212529', textAlign: 'left' }}>
                      {item.sellerName}
                      <a href='#' onClick={() => showMessage(item.sellerName!, item.id!)}>
                        <img src={mailBox} />
                      </a>
                    </td>
                    <td style={{ textAlign: 'left' }}>
                      <button
                        className='btn btn-outline-secondary'
                        style={{ display: 'inline' }}
                        onClick={() => handleLinkClick(item.id!)}
                      >
                        取消訂單
                      </button>
                    </td>
                  </tr>
                </tbody>
              );
            })
          ) : (
            <tbody>
              <tr>
                <td>尚無訂單</td>
              </tr>
            </tbody>
          )}
        </table>

        <hr className='my-5' />
        <h4 className='pb-3'>銷售訂單</h4>
        <table className='cart-table mb-24'>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>訂單編號</th>
              <th className='ps-4' style={{ textAlign: 'left' }}>訂購日期</th>
              <th style={{ textAlign: 'left' }}>訂單金額</th>
              <th className='ps-3' style={{ textAlign: 'left' }}>訂單狀態</th>
              <th className='ps-4' style={{ textAlign: 'left' }}>買家</th>
              <th>　　　　</th>
            </tr>
          </thead>
          {sellerOrder && sellerOrder.length > 0 ? (
            sellerOrder.map((item) => {
              return (
                <tbody key={item.id}>
                  <tr>
                    <td style={{ textAlign: 'left' }}>
                      <a href='#' onClick={() => showOrderDetail(item.id!)}>
                        #{item.id}
                      </a>
                    </td>
                    <td style={{ textAlign: 'left' }}>{formatDate(item.orderDate!)}</td>
                    <td style={{ textAlign: 'left' }}>{item.totalAmount}</td>
                    <td style={{ textAlign: 'left' }}>{item.status}</td>
                    <td style={{ fontSize: '16px', color: '#212529', textAlign: 'left' }}>
                      {item.buyerName}
                      <a href='#' onClick={() => showMessage(item.buyerName!, item.id!)}>
                        <img src={mailBox} />
                      </a>
                    </td>
                    <td style={{ textAlign: 'left' }}>
                      <button
                        className='btn btn-outline-secondary'
                        style={{ display: 'inline' }}
                        onClick={() => handleLinkClick(item.id!)}
                      >
                        取消訂單
                      </button>
                    </td>
                  </tr>
                </tbody>
              );
            })
          ) : (
            <tbody>
              <tr>
                <td>尚無訂單</td>
              </tr>
            </tbody>
          )}
        </table>

        {/* 聊天室 */}
        <div className={`orderMessage card ${!orderMessage ? ('close') : ('')}`}>
          <div className="card-header">
            {memberName}
            <button className='btn' onClick={closeMessage}>X</button>
          </div>
          <OrderMessage orderId={orderId} memberId={memberId} />
        </div>

        {/* 取消訂單申請 */}
        {showOrderReturnModal && (
          <div className='cart'>
            <div
              className='modal'
              tabIndex={-1}
              role='dialog'
              style={{
                display: 'block',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
              }}
            >
              <div
                className='modal-dialog'
                role='document'
                style={{ position: 'relative', top: '230px' }}
              >
                <div className='modal-content '>
                  <div className='modal-header'>
                    <h5 className='modal-title'>訂單取消申請</h5>
                    <button
                      className='btn'
                      onClick={handleCloseModal}
                    >
                      X
                    </button>
                  </div>
                  <div className='modal-body'>
                    <h6 style={{ textAlign: 'left', paddingBottom: '5px' }}>訂單編號: {modalIndex}</h6>
                    <h6 style={{ textAlign: 'left', paddingBottom: '5px' }}>取消原因:</h6>
                    <textarea
                      className='form-control notes mb-32'
                      name='notes'
                      id=''
                      cols={68}
                      rows={5}
                      placeholder='請填寫...'
                      value={reasonInput}
                      onChange={(e) => setReasonInput(e.target.value)}
                    ></textarea>
                  </div>
                  <div className='modal-footer'>
                    <button
                      type='button'
                      className='btn btn-primary'
                      onClick={orderReturnSubmit}
                    >
                      確認送出
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 訂單明細 */}
        {orderDetailModal && (
          <div
            className='modal'
            tabIndex={-1}
            role='dialog'
            style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div className='modal-dialog modal-dialog-centered' role='document'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title'>訂單明細</h5>
                  <button
                    className='btn'
                    onClick={closeOrderDetail}
                  >
                    X
                  </button>
                </div>
                <div className='modal-body'>
                  <OrderDetail id={detailIndex} />
                </div>
              </div>
            </div>
          </div>
        )
        }
      </div >
    </div>
  );
};

export default UsedBooksOrder;
