import React, {useState, useRef, useEffect} from "react";
import {Outlet, Link, useNavigate, useLocation} from "react-router-dom";
import "../../assets/css/app.css";
import {CartItemType} from "../../App";
import {useCartStore, CartState} from "./CountMath";
import {
    useGetApiCartsMemberId,
    usePutTotalAmountId,
    usePostApiOrder,
    OrdersDto,
    useGetApiOrderMemberId,
    useGetApiOrder,
    useGetAllCoupon,
    useDeleteApiCartsId,
    getGetApiCartsDetailsQueryKey,
    useGetApiEcpayPaymentsECPay,
    useUpdateCoupon,
    useUpdateCouponByCode,
    useGetApiMembersId,
} from "../../API";
import LinePay from "../../picture/LinePay.png";
import Ecpay from "../../picture/ECPay.png";
import {useQueryClient} from "@tanstack/react-query";

interface CartProps {
    initialCart: CartItemType[];
}

export const Step1: React.FC<CartProps> = ({ initialCart }) => {
    const navigate = useNavigate();
    const { mutate: updateCart } = usePutTotalAmountId();
    const { mutate: createOrder, data } = usePostApiOrder();
    const { cart } = useCartStore<CartState>((state) => state);
    const formRef = useRef<HTMLFormElement>(null);
    const [memberName, setMemberName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");
    const memberId = 2;
    const { data: member } = useGetApiMembersId(memberId);

    useEffect(() => {
        if (data?.data) {
            navigate("/list/Step2", { state: { orderId: data?.data } });
        }
    }, [data?.data]);

    const [isValid, setIsValid] = useState(true);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const input = e.target.value;
        const phoneRegex = /^(09)\d{8}$/;

        if (phoneRegex.test(input)) {
            setPhone(input);
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    };
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAddress(e.target.value);
    };
    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let total = 0;
        cart.forEach((item) => {
            total += item.unitPrice! * item.quantity!;
        });

        updateCart({ id: 3, params: { totalAmount: total } });

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const formattedDateTime = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        const formData = new FormData(formRef.current as HTMLFormElement);
        const orderBody: OrdersDto = {
            phone: formData.get("phone") as string,
            message: formData.get("message") as string,
            address: formData.get("address") as string,
            memberId: memberId,
            paymentMethod: "信用卡",
            orderDate: formattedDateTime,
            totalAmount: total,
            status: "未付款",
            discountAmount: 0,
        };

        if (!isValid || !phone || !address) {
            alert("請填寫完整的客戶資料");
            return;
        }

        await createOrder({
            data: { ordersDto: orderBody, orderDetailsDto: cart },
        });
    };

    const handleFillMemberInfo = () => {
        if (member?.data) {
            setMemberName(member.data.name);
            setPhone(member.data.phoneNumber);
            setAddress(member.data.address);
        }
    };

    return (
        <div id="step-1" role="tabpanel" aria-labelledby="step-1">
            <form ref={formRef} onSubmit={handleSubmit}>
                <div className="contact-info">
                    <h4 className="mb-32">確認資料</h4>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="mb-24">
                            <input
                                type="text"
                                className="form-control"
                                id="memberName"
                                name="memberName"
                                placeholder="王大明"
                                value={memberName}
                                onChange={(e) => setMemberName(e.target.value)}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="mb-24">
                            <input
                                type="tel"
                                className="form-control"
                                id="phone"
                                name="phone"
                                placeholder="手機號碼"
                                value={phone}
                                onChange={handlePhoneChange}
                            />
                            {!isValid && <p style={{ color: "#F08080" }}>請輸入有效的手機號碼</p>}
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="mb-24">
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                name="address"
                                value={address}
                                onChange={handleAddressChange}
                                placeholder="請輸入完整地址"
                            />
                        </div>
                    </div>
                    <div className="col-sm-12">
            <textarea
                className="form-control notes mb-32"
                name="message"
                id="message"
                cols={68}
                rows={5}
                placeholder="備註事項"
                value={message}
                onChange={handleMessageChange}
            ></textarea>
                    </div>
                    <div className="sw-toolbar-elm toolbar toolbar-bottom" role="toolbar">
                        <button
                            type="button"
                            className="btn sw-btn-prev sw-btn me-2"
                            onClick={handleFillMemberInfo}
                        >
                            一鍵帶入會員資料
                        </button>
                        <button className="btn sw-btn-prev sw-btn" type="submit">
                            去結帳
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export const Step2 = () => {
    const {cart} = useCartStore<CartState>((state) => state);
    const queryClient = useQueryClient();
    const location = useLocation();
    const orderId = location.state.orderId;
    const dictionary = useGetApiEcpayPaymentsECPay({orderId: orderId});
    const orderTotalResponse = useGetApiOrder({orderId: orderId});
    const [isGatData, setIsGetData] = useState(false);

    let orderTotalAmount = 0;
    if (orderId != 0) {
        orderTotalAmount = orderTotalResponse.data?.data?.totalAmount as number;
    }

    useEffect(() => {
        if (dictionary.data?.data) {
            setIsGetData(true);
        }
    }, [dictionary.data?.data]);

    const {mutate: deleteCartItem} = useDeleteApiCartsId();

    function deleteCartItems(Id: number) {
        deleteCartItem(
            {id: Id},
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: getGetApiCartsDetailsQueryKey({Id: 2}),
                    });
                },
            }
        );
    }

    const requestPayment = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const baseLoginPayUrl = "https://localhost:7236/api/LinePay/";
        const payment = {
            amount: orderTotalAmount,
            currency: "TWD",
            orderId: orderId.toString(),
            packages: [
                {
                    id: "20191011I001",
                    amount: orderTotalAmount,
                    name: "印跡書閣",
                    products: [
                        {
                            name: "印跡書閣",
                            quantity: 1,
                            price: orderTotalAmount,
                        },
                    ],
                },
            ],
            redirectUrls: {
                confirmUrl: "http://127.0.0.1:5173/linepay",
                cancelUrl: "https://localhost:7236/api/Cancel",
            },
        };

        try {
            if (orderTotalAmount) {
                const response = await fetch(baseLoginPayUrl + "Create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payment),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                deleteCartItems(cart[0].cartId as number);
                const res = await response.json();
                window.location = res.info.paymentUrl.web;
            }
        } catch (error) {
            console.log("Request failed", error);
        }
    };

    const submitEcPay = () => {
        if (isGatData) {
            const dic = dictionary.data?.data;
            const form = document.createElement("form");
            form.method = "POST";
            form.action = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";

            for (const key in dic) {
                const input = document.createElement("input");
                input.name = key;
                input.value = dic[key];
                form.appendChild(input);
            }
            document.body.appendChild(form);

            form.submit();
            deleteCartItems(cart[0].cartId as number);
        }
    };

    return (
        <div id="step-2" role="tabpanel" aria-labelledby="step-2">
            <div className="contact-info">
                <h4 className="mb-32">付款方式</h4>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="mb-24">
                        <div className="mb-24">
                            <div>
                                <button type="button" onClick={requestPayment} className="col-5">
                                    <img src={LinePay}/>
                                </button>
                                <button type="button" onClick={submitEcPay} className="col-5">
                                    <img src={Ecpay} alt=""/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="mb-24">
                        <div className="mb-32"></div>
                    </div>
                </div>
                <div className="col-sm-12">
                    <div className="mb-24"></div>
                </div>
                <div className="sw-toolbar-elm toolbar toolbar-bottom" role="toolbar">
                    <Link to={"/list"} className="nav-link">
                        <button className="btn sw-btn-prev sw-btn" type="button">
                            上一步
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export const YourOrder: React.FC = () => {
    const { cart, total } = useCartStore<CartState>((state) => state);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [bestCoupon, setBestCoupon] = useState<any>(null);
    const [selectedCoupon, setSelectedCoupon] = useState("");

    const { data: couponsData } = useGetAllCoupon();
    const coupons = couponsData?.data;

    useEffect(() => {
        if (Array.isArray(coupons)) {
            const calculateBestCoupon = () => {
                let maxDiscount = 0;
                let bestCoupon = null;

                coupons.forEach((coupon: any) => {
                    if (coupon.valid && coupon.usingStatus === "未使用") {
                        let discount = 0;

                        if (coupon.couponTypeId === 1) {
                            discount = coupon.discountValue;
                        } else if (coupon.couponTypeId === 2) {
                            discount = total * (coupon.discountValue / 100);
                        } else if (coupon.couponTypeId === 3) {
                            discount = 0;
                        } else if (coupon.couponTypeId === 4) {
                            discount = total * 0.5;
                        }

                        if (discount > maxDiscount) {
                            maxDiscount = discount;
                            bestCoupon = coupon;
                        }
                    }
                });

                setBestCoupon(bestCoupon);
                setDiscountAmount(maxDiscount);
                setSelectedCoupon(bestCoupon?.code || "");
            };

            calculateBestCoupon();
        }
    }, [coupons, total]);

    const applyBestCoupon = () => {
        if (bestCoupon) {
            updateCouponById(
                { id: bestCoupon.couponID },
                { data: { ...bestCoupon, usingStatus: "已使用" } }
            );
        }
    };

    const handleCouponChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCode = e.target.value;
        setSelectedCoupon(selectedCode);
        const coupon = coupons.find((coupon: any) => coupon.code === selectedCode);
        if (coupon) {
            let discount = 0;
            if (coupon.couponTypeId === 1) {
                discount = coupon.discountValue;
            } else if (coupon.couponTypeId === 2) {
                discount = total * (coupon.discountValue / 100);
            } else if (coupon.couponTypeId === 3) {
                discount = 0;
            } else if (coupon.couponTypeId === 4) {
                discount = total * 0.5;
            }
            setDiscountAmount(discount);
        } else {
            setDiscountAmount(0);
        }
    };

    const getCouponTypeText = (couponTypeId: number) => {
        switch (couponTypeId) {
            case 1:
                return "定額折扣";
            case 2:
                return "百分比折扣";
            case 3:
                return "免運費";
            case 4:
                return "買一送一";
            default:
                return "";
        }
    };

    return (
        <div>
            {cart.length > 0 && (
                <div className="order-detail">
                    <div className="sub-total">
                        <h6 className="col-3">
                            <span className="dark-gray">訂單商品</span>
                        </h6>
                        <h6 className="col-3">單價</h6>
                        <h6 className="col-3">數量</h6>
                        <h6 className="col-3">總價</h6>
                    </div>
                    <hr/>
                    {cart.map((item) => (
                        <div className="sub-total" key={item.id}>
                            <h6 className="col-3">
                                <span className="dark-gray">{item.productName}</span>
                            </h6>
                            <h6 className="col-3">${item.unitPrice}</h6>
                            <h6 className="col-3">{item.quantity}</h6>
                            <h6 className="col-3">${(item.unitPrice * item.quantity).toFixed(0)}</h6>
                        </div>
                    ))}
                    <hr/>
                    <div className="sub-total">
                        <h5 className="dark-gray">商品總價</h5>
                        <h5>$ {total}</h5>
                    </div>
                    <hr/>
                    <div className="sub-total">
                        <h5 className="dark-gray">運費</h5>
                        <h5>免運費</h5>
                    </div>
                    <hr/>
                    <h6>選擇折價券</h6>
                    <div className="find-books-input">
                        <select
                            name="coupon"
                            id="coupon"
                            className="search-input dark-gray"
                            value={selectedCoupon}
                            onChange={handleCouponChange}
                        >
                            <option value="">選擇折價券</option>
                            {Array.isArray(coupons) &&
                                coupons.map((coupon: any) => (
                                    <option
                                        key={coupon.code}
                                        value={coupon.code}
                                        style={{
                                            backgroundColor: coupon.code === bestCoupon?.code ? "#e0e0e0" : "",
                                            padding: "8px",
                                            borderBottom: "1px solid #ccc",
                                        }}
                                    >
                                        {coupon.code === bestCoupon?.code && "🌟 "}
                                        {coupon.code} - {getCouponTypeText(coupon.couponTypeId)} -
                                        折扣金額: {coupon.discountValue}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <hr/>
                    <div className="sub-total">
                        <h5 className="dark-gray">折價金額</h5>
                        <h5>-${discountAmount.toFixed(0)}</h5>
                    </div>
                    <div className="sub-total">
                        <h4>總付款金額</h4>
                        <h4>${(total - discountAmount).toFixed(0)}</h4>
                    </div>
                    <hr/>
                </div>
            )}
        </div>
    );
};

const OrderConfirmation: React.FC = () => {
    const TestData = useGetApiCartsMemberId(2);

    return (
        <div className="page-content ">
            <section className="checkout container">
                <div className="row">
                    <div className="col-8">
                        <div className="checkout-form">
                            <ul className="nav">
                                <li className="nav-item">
                                    <div className="nav-link">
                                        <div className="num">1</div>
                                        <span>確認資料</span>
                                    </div>
                                </li>
                                <li className="nav-item">
                                    <div className="nav-link">
                                        <div className="num">2</div>
                                        <span>付款方式</span>
                                    </div>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <Outlet/>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <YourOrder/>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OrderConfirmation;