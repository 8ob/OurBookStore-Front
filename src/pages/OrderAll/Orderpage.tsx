import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import {
    OrdersDto,
    useGetApiOrder,
    useGetApiOrderMemberId,
    useGetApiOrdersDetailsId,
    useGetApiProductsId,
} from "../../API";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../../assets/css/app.css";
import returnIcon from "../../picture/return.png";
import deliveryIcon from "../../picture/delivery.png";
import pricingIcon from "../../picture/pricing.png";
import dealsIcon from "../../picture/deals.png";
import backmenu from "../../picture/btn-book.png";

import b21 from "../../picture/b2-1.png";
import b22 from "../../picture/b2-2.png";
import b23 from "../../picture/b2-3.png";
import b24 from "../../picture/b2-4.png";
import b25 from "../../picture/b2-5.png";
import ProductPictrue from "./ProductPictrue";
import LoadingMessage from "../../main";

interface OrderProp {
    memberId: number;
}
// 定義 SideOrder 組件，接受 orderData 屬性
//todo照著下訂日期去做排序
const SideOrder: React.FC<{ orderData: OrdersDto }> = ({ orderData }) => {
    return (
        <div className="col-lg-5 mt-5">
            <form className="shop-form widget">
                <h4 className="widget-title">訂單資訊</h4>

                <table className="table-bordered check-tbl mb-4">
                    <tbody>
                        <tr>
                            <td>付款方式</td>
                            <td className="product-price">
                                {orderData?.paymentMethod}
                            </td>
                        </tr>
                        <tr>
                            <td>下單時間</td>
                            <td>{orderData?.orderDate}</td>
                        </tr>
                        <tr>
                            <td>運送狀態</td>
                            <td className="product-price-total">
                                {orderData?.status}
                            </td>
                        </tr>
                        <tr>
                            <td>使用優惠券</td>
                            <td className="product-price">
                                {orderData?.discountAmount ? "$0.00" : "未使用"}
                            </td>
                        </tr>
                        <tr>
                            <td>總價格</td>
                            <td className="product-price-total">
                                ${orderData?.totalAmount}
                            </td>
                        </tr>
                        <tr>
                            <td>備註</td>
                            <td className="product-price-total">
                                {orderData?.message}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
};

// 定義 OneOrder 組件，接受 orderId 屬性
const OneOrder: React.FC<{ orderId: number }> = ({ orderId }) => {
    // 使用 useGetApiOrdersDetailsId hook 取得訂單詳細資料
    const orderDetailResponse = useGetApiOrdersDetailsId(orderId);
    // 從回應中取得訂單詳細資料
    const orderDetailData = orderDetailResponse.data?.data;
    // console.log(orderId, " ", orderDetailData);
    const orderResponse = useGetApiOrder({ orderId: orderId });
    const orderData = orderResponse.data?.data;

    const dateTimeString = orderData?.orderDate || "";
    const dateObject = new Date(dateTimeString);

    const year = dateObject.getFullYear().toString(); // 取得年份後兩位
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // 取得月份並補零
    const day = dateObject.getDate().toString().padStart(2, "0"); // 取得日期並補零

    const formattedDate = `${year}年${month}月${day}日`;

    //抓商品圖片
    // orderDetailData?.map((item) => {
    //   console.log(item.productId);
    // }
    if (orderDetailResponse.isLoading && orderResponse.isLoading)
        return <LoadingMessage />;
    return (
        <div className="mb-2">
            {/* 手風琴的開始 */}
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <div>
                        <table className="table-bordered check-tbl mb-4">
                            <tbody>
                                <tr>
                                    <td>訂單編號</td>
                                    <td className="product-price">{orderId}</td>
                                    <td>下單時間</td>
                                    <td>{formattedDate}</td>

                                    <td>總金額</td>
                                    <td className="product-price-total">
                                        {orderData?.totalAmount}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </AccordionSummary>

                {/* 手風琴的詳細內容 */}
                <AccordionDetails>
                    <div className="mb-2">
                        {/* 如果有訂單詳細資料，則顯示訂單內容 */}
                        {orderDetailData && orderDetailData.length > 0 ? (
                            orderDetailData.map((item, index) => {
                                return index === 0 ? (
                                    // 如果是第一個商品，顯示完整的表格標題
                                    <div key={index} className="col-lg-12">
                                        <div className="widget">
                                            <table className="table-bordered check-tbl">
                                                <thead className="text-center">
                                                    <tr>
                                                        <th></th>
                                                        <th>商品名稱</th>
                                                        <th>數量</th>
                                                        <th>單價</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* 顯示商品詳細資訊 */}
                                                    <tr>
                                                        <td className="product-item-img col-2">
                                                            {/* 顯示商品圖片 */}

                                                            <ProductPictrue
                                                                productId={
                                                                    item.productId as number
                                                                }
                                                            />
                                                        </td>
                                                        {/* 顯示商品名稱 */}
                                                        <td className="product-item-name col-6">
                                                            {item.productName}
                                                        </td>
                                                        {/* 顯示商品數量 */}
                                                        <td className="product-item-name col-2">
                                                            {item.quantity}
                                                        </td>
                                                        {/* 顯示商品單價 */}
                                                        <td className="product-price col-2">
                                                            ${item.unitPrice}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    // 如果不是第一個商品，僅顯示商品詳細資訊
                                    <div key={index} className="col-lg-12">
                                        <div className="widget">
                                            <table className="table-bordered check-tbl">
                                                <tbody>
                                                    <tr>
                                                        <td className="product-item-img col-2">
                                                            <ProductPictrue
                                                                productId={
                                                                    item.productId as number
                                                                }
                                                            />
                                                        </td>
                                                        <td className="product-item-name  col-6">
                                                            {item.productName}
                                                        </td>
                                                        <td className="product-item-name col-2">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="product-price col-2">
                                                            ${item.unitPrice}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            // 如果沒有訂單詳細資料，顯示提示訊息
                            <div>這個訂單什麼都沒有，資料庫忘了載吼。</div>
                        )}
                    </div>
                    <div>
                        <SideOrder orderData={orderData as OrdersDto} />
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

// 定義 OrderPage 組件，接受 memberId 屬性
const OrderPage: React.FC<OrderProp> = ({ memberId }) => {
    // 使用 useGetApiOrderMemberId hook 取得會員訂單資料
    const orderResponse = useGetApiOrderMemberId(memberId);

    // 從回應中取得會員訂單資料
    const orderData = orderResponse.data?.data;

    //訂單排序
    orderData?.sort((a, b) => {
        const dataA = new Date(a.orderDate);
        const dataB = new Date(b.orderDate);
        return dataB - dataA;
    });

    const backtoMenu = () => {
        window.location.href = "/";
    };
    if (orderResponse.isLoading) return <LoadingMessage />;
    return (
        <div className="container">
            <div className="row">
                {/* 左側區域顯示會員的訂單列表 */}
                <div className="col-lg-12 widget mt-5">
                    <h4 className="widget-title">您的訂單</h4>
                    {orderData && orderData.length > 0 ? (
                        orderData.map((order, index) => (
                            <OneOrder
                                orderId={order.id as number}
                                key={index}
                            />
                        ))
                    ) : (
                        <>
                            <div className="hero-banner-2 pb-40">
                                <div className="container">
                                    <div className="banner-2">
                                        <div className="banner-images">
                                            <img
                                                src={b21}
                                                alt=""
                                                className="stair-image-1"
                                            />
                                            <img
                                                src={b22}
                                                alt=""
                                                className="stair-image-2"
                                            />
                                            <img
                                                src={b23}
                                                alt=""
                                                className="stair-image-3"
                                            />
                                            <img
                                                src={b24}
                                                alt=""
                                                className="stair-image-4"
                                            />
                                            <img
                                                src={b25}
                                                alt=""
                                                className="stair-image-5"
                                            />
                                        </div>
                                        <div className="banner-text text-center">
                                            <h1>訂單內尚未有書籍</h1>
                                            <h5 className="dark-gray">
                                                快點來購入心儀書籍吧~{" "}
                                            </h5>
                                            <h6>
                                                {" "}
                                                <div className="d-flex justify-content-center">
                                                    <button
                                                        onClick={backtoMenu}
                                                        className="cus-btn "
                                                        style={{ border: 0 }}
                                                    >
                                                        <span className="icon">
                                                            <img
                                                                src={backmenu}
                                                                alt=""
                                                            />
                                                        </span>
                                                        返回商城
                                                    </button>
                                                </div>
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="m-40">
                                <div className="container">
                                    <div className="benifits bg-lightest-gray">
                                        <div className="row">
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="benifits-block mb-32 mb-xl-0">
                                                    <img
                                                        src={returnIcon}
                                                        alt=""
                                                    />
                                                    <h5>Easy Return</h5>
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="benifits-block mb-32 mb-xl-0">
                                                    <img
                                                        src={deliveryIcon}
                                                        alt=""
                                                    />
                                                    <h5>Free Delivery</h5>
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="benifits-block mb-32 mb-sm-0">
                                                    <img
                                                        src={pricingIcon}
                                                        alt=""
                                                    />
                                                    <h5>
                                                        Best Price and Offer
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="benifits-block">
                                                    <img
                                                        src={dealsIcon}
                                                        alt=""
                                                    />
                                                    <h5>Great Daily Deal</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
