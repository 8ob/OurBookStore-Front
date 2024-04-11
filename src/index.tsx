import React from 'react';

interface EcpayOrder {
    [key: string]: string;
}

interface Props {
    orderData: EcpayOrder;
}

const CheckoutForm: React.FC<Props> = ({ orderData }) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        // 在此處添加處理表單提交的邏輯，例如發送 AJAX 請求到後端或金流 API
    };

    return (
        <form id="form" name="form" method="POST" action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5" onSubmit={handleSubmit}>
            {Object.keys(orderData).map((key) => (
                <div key={key}>
                    <label htmlFor={key}>{key}</label>
                    <input type="text" id={key} name={key} value={orderData[key]} readOnly />
                </div>
            ))}
            <button type="submit" id="checkoutBtn">送出</button>
        </form>
    );
};

export default CheckoutForm;
