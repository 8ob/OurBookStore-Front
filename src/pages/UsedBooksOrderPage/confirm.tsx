import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import { usePutApiUsedBookPaymentRecordsApi, useGetApiUsedBookPaymentRecordsApi, usePutApiUsedBookOrdersApi, usePostApiUsedBookBuyerInfomationsApiOrderRecipient } from '../../API';
import logo from '../../picture/logo-5.jpg'

const LinePay: React.FC = () => {
  const navigate = useNavigate(); // useNavigate在函式組件的主體使用
  const [transactionId, setTransactionId] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

  const { mutate: putUsedBookOrder } = usePutApiUsedBookOrdersApi();
  function updateUsedBookOrder(id: number, status: string) {
    putUsedBookOrder({ params: { Id: id, status: status } });
  }

  const { mutate: putUsedBookPaymentRecord } = usePutApiUsedBookPaymentRecordsApi();
  function updatePaymentStatus(orderId: string, paymentStatus: boolean) {
    putUsedBookPaymentRecord({ params: { paymentNumber: orderId, status: paymentStatus } });
  }

  const { mutate: postOrderRecipient } = usePostApiUsedBookBuyerInfomationsApiOrderRecipient();
  function createOrderRecipient(paymentId: string) {
    postOrderRecipient({ params: { paymentId: paymentId } })
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const transactionIdParam = params.get('transactionId');
    const orderIdParam = params.get('orderId');

    if (transactionIdParam && orderIdParam) {
      setTransactionId(transactionIdParam);
      setOrderId(orderIdParam);
    }
  }, []);

  const [amount, setAmount] = useState<number>(0)
  const [orderIdString, setOrderIdString] = useState<string>('');
  const getPaymentRecord = useGetApiUsedBookPaymentRecordsApi({ paymentNumber: orderId });
  const paymentRecord = getPaymentRecord.data?.data;
  useEffect(() => {
    if (paymentRecord && paymentRecord.length > 0) {
      const firstPaymentRecord = paymentRecord[0];
      setAmount(firstPaymentRecord.paymentAmount!);
      setOrderIdString(firstPaymentRecord.orderId);
    }
  }, [paymentRecord]);
  const orderIdArray = orderIdString.split(',').map(Number);

  const baseLoginPayUrl = 'https://localhost:7236/api/LinePay/';
  const confirmPayment = async () => {

    try {
      const payment = {
        amount: amount,
        currency: 'TWD'
      };

      const response = await axios.post(
        `${baseLoginPayUrl}Confirm?transactionId=${transactionId}&orderId=${orderId}`,
        payment,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      let paymentStatus: boolean = false;

      if (
        (response.data.returnMessage = 'Success.' && response.data.info != null)
      ) {
        console.log('完成付款');
        paymentStatus = true;

        //更新付款紀錄
        updatePaymentStatus(orderId, true);
        //更新訂單狀態
        orderIdArray.forEach((orderId) => {
          updateUsedBookOrder(orderId, '已付款');
        });
        //提交收件人資訊
        createOrderRecipient(orderId);
      } else {
        console.log('付款失敗');
      }
      navigate('/usedBook/UsedBooksOrderConfirmation', {
        state: { paymentStatus: paymentStatus }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (

    <div className='cart'>

      <center>
        <table className='mt-5'>
          <tbody>
            <tr>
              <td colSpan={2}>
                <img
                  //src='https://static.accupass.com/org/2011051025162614811630.jpg'
                  src={logo}
                  alt='商品圖片'
                  style={{ borderRadius: '5px' }}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2} align='center'>
                <h5>總金額 : {amount}</h5>
              </td>
            </tr>
            <tr>
              <td align='center' colSpan={2}>
                <button onClick={confirmPayment} className='btn btn-primary btnhover btnhover2 mt-3'> 確認付款</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div className='Container mt-4'>
          <p id='paymentStatus'>交易狀態 : 交易已授權，等待確認</p>
        </div>
      </center>
    </div>
  );
};

export default LinePay;
