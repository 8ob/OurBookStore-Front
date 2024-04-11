import React, { useState, useEffect } from "react";

//css
import "../../assets/css/app.css";

//image
import returnIcon from "../../picture/return.png";
import deliveryIcon from "../../picture/delivery.png";
import pricingIcon from "../../picture/pricing.png";
import dealsIcon from "../../picture/deals.png";
import ProductPictrue from "../OrderAll/ProductPictrue";
import orangeCart from "../../picture/orange-cart.png";
import backmenu from "../../picture/btn-book.png";
import b21 from "../../picture/b2-1.png";
import b22 from "../../picture/b2-2.png";
import b23 from "../../picture/b2-3.png";
import b24 from "../../picture/b2-4.png";
import b25 from "../../picture/b2-5.png";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./CartAll.css";

//component
import { useCartStore, CartState } from "./CountMath";
import { CartItemType } from "../../App";

//API

import {
    CartDetailsDto,
    useDeleteApiCartsDetailsId,
    usePutApiCartsDetailsId,
    useGetApiCartsDetails,
    useGetApiProductsId,
    BookProductDto,
    getGetApiCartsDetailsQueryKey,
} from "../../API";
import { useNavigate } from "react-router-dom";
import LoadingMessage from "../../main";
import {
    UseQueryResult,
    useQueries,
    useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CartProps {
    initialCart: CartDetailsDto[];
    produtDetail: BookProductDto[];
}

export interface CountQuantity {
    count: number;
    increase: (by: number) => void;
    resetCount: () => void;
}

// 假設這是你從某個地方獲得的 API 調用函數
async function fetchProductDetails(productId: number): Promise<BookProductDto> {
    try {
        const response = await axios.get(
            `https://localhost:7236/api/Products/${productId}`
        );
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch product details");
    }
}

function useProductDetails(cartDetails: CartDetailsDto[] = []) {
    const results = useQueries({
        queries: cartDetails.map((item) => ({
            queryKey: ["productDetails", item.productId],
            queryFn: () => fetchProductDetails(item.productId!),
            enabled: !!item.productId,
        })),
    }) as UseQueryResult<BookProductDto, AxiosError>[];

    const books: BookProductDto[] = results.map((result) => result.data!);
    const isLoading = results.some((result) => result.isLoading);
    return { isLoading, books };
}

const CartPage: React.FC = () => {
    //todo會員Id
    const memberId = 2;
    const TestData = useGetApiCartsDetails({ Id: memberId });

    const ProductsDataArray = useProductDetails(
        (TestData.data?.data as CartDetailsDto[]) || []
    );

    if (TestData.isLoading) return <LoadingMessage />;
    if (
        TestData.data?.data &&
        ProductsDataArray.books.length === 0 &&
        ProductsDataArray.isLoading
    )
        return <LoadingMessage />;
    return (
        <div className="container">
            <CartItem
                initialCart={TestData.data?.data as CartDetailsDto[]}
                produtDetail={ProductsDataArray.books}
            />
        </div>
    );
};

const CartItem: React.FC<CartProps> = ({ initialCart, produtDetail }) => {
    //const [cart, setCart] = useState<CartItemType[]>(initialCart);
    const navigate = useNavigate();
    const { cart, setCart, total, calculateTotal, realPrice, setRealPrice } =
        useCartStore<CartState>((state) => state);
    const queryClient = useQueryClient();
    const { mutate: updateDetail } = usePutApiCartsDetailsId();
    const { mutate: deleteDetail } = useDeleteApiCartsDetailsId();
    const handleCheckout = () => {
        navigate("/list", { state: { cartItems: cart } });
    };

    useEffect(() => {
        if (initialCart && produtDetail && produtDetail.every((item) => item)) {
            setRealPrice(produtDetail);
            setCart(initialCart || []);
            calculateTotal();
        }
    }, [produtDetail]);

    const removeFromCart = (itemId: number) => {
        if (cart.length > 0) {
            const shouldDelete = window.confirm("是否要刪除此商品？");
            if (shouldDelete) {
                deleteDetail(
                    { id: itemId },
                    {
                        onSuccess: () => {
                            queryClient.invalidateQueries({
                                queryKey: getGetApiCartsDetailsQueryKey({
                                    Id: 2,
                                }), //TODO: 會員ID
                            });
                        },
                    }
                );
                setCart(cart.filter((item) => item.id !== itemId));
            }
        }
        calculateTotal();
    };

    const updateQuantity = (itemId: number, quantity: number) => {
        if (cart.length > 0) {
            setCart(
                cart.map((item) =>
                    item.id === itemId ? { ...item, quantity } : item
                )
            );
        }
        calculateTotal();
    };

    const plusQuantity = (itemId: number) => {
        setCart(
            cart.map((item) => {
                if (item.id === itemId && item.quantity !== undefined) {
                    updateDetail(
                        {
                            id: itemId ?? 0,
                            params: {
                                quantity: Math.min(10, item.quantity + 1),
                            },
                        },
                        {
                            onSuccess: () => {
                                queryClient.invalidateQueries({
                                    queryKey: getGetApiCartsDetailsQueryKey({
                                        Id: 2,
                                    }), //TODO: 會員ID
                                });
                            },
                        }
                    );
                    return {
                        ...item,
                        quantity: Math.min(10, item.quantity + 1),
                    };
                }
                return item;
            })
        );

        calculateTotal();
    };

    const decreaseQuantity = (itemId: number) => {
        if (cart.length > 0) {
            const targetItem = cart.find((item) => item.id === itemId);
            if (!targetItem) {
                return;
            }

            if (targetItem.quantity === 1) {
                const shouldDelete = window.confirm("是否要刪除此商品？");
                if (shouldDelete) {
                    deleteDetail(
                        { id: itemId },
                        {
                            onSuccess: () => {
                                queryClient.invalidateQueries({
                                    queryKey: getGetApiCartsDetailsQueryKey({
                                        Id: 2,
                                    }), //TODO: 會員ID
                                });
                            },
                        }
                    );
                    setCart(cart.filter((item) => item.id !== itemId));
                    setRealPrice(
                        realPrice.filter(
                            (item) => item.productId !== targetItem.productId
                        )
                    );
                }
            } else {
                setCart(
                    cart.map((item) => {
                        if (item.id === itemId && item.quantity !== undefined) {
                            updateDetail(
                                {
                                    id: itemId ?? 0,

                                    params: {
                                        quantity: Math.max(
                                            0,
                                            item.quantity! - 1
                                        ),
                                    },
                                },
                                {
                                    onSuccess: () => {
                                        queryClient.invalidateQueries({
                                            queryKey:
                                                getGetApiCartsDetailsQueryKey({
                                                    Id: 2,
                                                }), //TODO: 會員ID
                                        });
                                    },
                                }
                            );
                            return {
                                ...item,
                                quantity: Math.max(0, item.quantity! - 1),
                            };
                        }
                        return item;
                    })
                );
            }
            calculateTotal();
        }
    };

    const clearCart = () => {
        setCart([]);
    };

    const backtoMenu = () => {
        window.location.href = "/";
    };
    let totalItems = 0;

    if (cart.length > 0) {
        totalItems = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
    }

    return (
        <div className="cart" style={{ marginTop: "0px" }}>
            <h4 className="widget-title">購物車</h4>

            {cart.length > 0 ? (
                cart.map((item, index) => {
                    return index === 0 ? (
                        <div key={item.id} className="row">
                            <div className="col-lg-12">
                                <table className="cart-table mb-24">
                                    <thead>
                                        <tr>
                                            <th className="col-4">商品</th>
                                            <th className="col-2">單價</th>
                                            <th className="col-2">數量</th>
                                            <th className="col-2">總計</th>

                                            <th className="col-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="col-md-8 mb-5">
                                            <td className="pd">
                                                <div className="product-detail-box col-12">
                                                    <div className="img-block product-item-img col-6">
                                                        <ProductPictrue
                                                            productId={
                                                                item.productId as number
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <h5 className="dark-gray">
                                                            {item.productName}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="col-2">
                                                <h5 className="dark-gray">
                                                    $
                                                    {Math.ceil(
                                                        produtDetail.find(
                                                            (pditem) =>
                                                                (pditem?.productId as number) ===
                                                                (item?.productId as number)
                                                        ).realPrice as number
                                                    ) ||
                                                        produtDetail.find(
                                                            (pditem) =>
                                                                (pditem?.productId as number) ===
                                                                (item?.productId as number)
                                                        ).price}
                                                </h5>
                                            </td>
                                            <td className="col-3">
                                                <div className="quantity quantity-wrap">
                                                    <input
                                                        className="decrement dark-gray"
                                                        type="button"
                                                        value="-"
                                                        onClick={() =>
                                                            decreaseQuantity(
                                                                item.id
                                                            )
                                                        }
                                                    />
                                                    <input
                                                        type="text"
                                                        name="quantity"
                                                        value={
                                                            cart[index].quantity
                                                        }
                                                        maxLength={2}
                                                        size={1}
                                                        className="number"
                                                        onChange={(e) => {
                                                            const newQuantity =
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                    10
                                                                );
                                                            if (
                                                                !isNaN(
                                                                    newQuantity
                                                                ) &&
                                                                newQuantity <=
                                                                    10
                                                            ) {
                                                                updateQuantity(
                                                                    item.id,
                                                                    newQuantity
                                                                );
                                                                updateDetail(
                                                                    {
                                                                        id:
                                                                            item.id ??
                                                                            0,
                                                                        params: {
                                                                            quantity:
                                                                                newQuantity,
                                                                        },
                                                                    },
                                                                    {
                                                                        onSuccess:
                                                                            () => {
                                                                                queryClient.invalidateQueries(
                                                                                    {
                                                                                        queryKey:
                                                                                            getGetApiCartsDetailsQueryKey(
                                                                                                {
                                                                                                    Id: 2,
                                                                                                }
                                                                                            ), //TODO: 會員ID
                                                                                    }
                                                                                );
                                                                            },
                                                                    }
                                                                );
                                                            } else {
                                                                const shouldReset =
                                                                    window.confirm(
                                                                        "購買10本以上的書籍，詳情請洽客服"
                                                                    );
                                                                if (
                                                                    shouldReset
                                                                ) {
                                                                    e.target.value =
                                                                        item.quantity.toString();
                                                                    updateDetail(
                                                                        {
                                                                            id:
                                                                                item.id ??
                                                                                0,
                                                                            params: {
                                                                                quantity:
                                                                                    item.quantity,
                                                                            },
                                                                        },
                                                                        {
                                                                            onSuccess:
                                                                                () => {
                                                                                    queryClient.invalidateQueries(
                                                                                        {
                                                                                            queryKey:
                                                                                                getGetApiCartsDetailsQueryKey(
                                                                                                    {
                                                                                                        Id: 2,
                                                                                                    }
                                                                                                ), //TODO: 會員ID
                                                                                        }
                                                                                    );
                                                                                },
                                                                        }
                                                                    );
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <input
                                                        className="increment dark-gray"
                                                        type="button"
                                                        value="+"
                                                        onClick={() =>
                                                            plusQuantity(
                                                                item.id
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </td>

                                            <td
                                                className="col-2"
                                                style={{ textAlign: "center" }}
                                            >
                                                <h5>
                                                    $
                                                    {(
                                                        Math.ceil(
                                                            produtDetail.find(
                                                                (pditem) =>
                                                                    (pditem?.productId as number) ===
                                                                    (item?.productId as number)
                                                            ).realPrice
                                                        ) * item.quantity ||
                                                        produtDetail.find(
                                                            (pditem) =>
                                                                (pditem?.productId as number) ===
                                                                (item?.productId as number)
                                                        ).price * item.quantity
                                                    ).toFixed(0)}
                                                </h5>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <a
                                                    href="#"
                                                    className="deleteicon"
                                                    onClick={() =>
                                                        removeFromCart(item.id)
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div key={item.id} className="row">
                            <div className="col-lg-12">
                                <table className="cart-table mb-24">
                                    <tbody>
                                        <tr className="col-md-12 mb-5">
                                            <td className="pd col-4">
                                                <div className="product-detail-box col-12">
                                                    <div className="img-block product-item-img col-6">
                                                        <ProductPictrue
                                                            productId={
                                                                item.productId as number
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <h5
                                                            className="dark-gray
                            "
                                                        >
                                                            {item.productName}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="col-2">
                                                <h5 className="dark-gray">
                                                    $
                                                    {Math.ceil(
                                                        produtDetail.find(
                                                            (pditem) =>
                                                                (pditem?.productId as number) ===
                                                                (item?.productId as number)
                                                        ).realPrice as number
                                                    ) ||
                                                        produtDetail.find(
                                                            (pditem) =>
                                                                (pditem?.productId as number) ===
                                                                (item?.productId as number)
                                                        ).price}
                                                </h5>
                                            </td>
                                            <td className="col-3">
                                                <div className="quantity quantity-wrap">
                                                    <input
                                                        className="decrement dark-gray"
                                                        type="button"
                                                        value="-"
                                                        onClick={() =>
                                                            decreaseQuantity(
                                                                item.id
                                                            )
                                                        }
                                                    />
                                                    <input
                                                        type="text"
                                                        name="quantity"
                                                        value={item.quantity}
                                                        maxLength={2}
                                                        size={1}
                                                        className="number"
                                                        onChange={(e) => {
                                                            const newQuantity =
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                    10
                                                                );
                                                            if (
                                                                !isNaN(
                                                                    newQuantity
                                                                ) &&
                                                                newQuantity <=
                                                                    10
                                                            ) {
                                                                updateQuantity(
                                                                    item.id,
                                                                    newQuantity
                                                                );
                                                                updateDetail(
                                                                    {
                                                                        id:
                                                                            item.id ??
                                                                            0,
                                                                        params: {
                                                                            quantity:
                                                                                newQuantity,
                                                                        },
                                                                    },
                                                                    {
                                                                        onSuccess:
                                                                            () => {
                                                                                queryClient.invalidateQueries(
                                                                                    {
                                                                                        queryKey:
                                                                                            getGetApiCartsDetailsQueryKey(
                                                                                                {
                                                                                                    Id: 2,
                                                                                                }
                                                                                            ), //TODO: 會員ID
                                                                                    }
                                                                                );
                                                                            },
                                                                    }
                                                                );
                                                            } else {
                                                                const shouldReset =
                                                                    window.confirm(
                                                                        "購買10本以上的書籍，請訊問客服"
                                                                    );
                                                                if (
                                                                    shouldReset
                                                                ) {
                                                                    e.target.value =
                                                                        item.quantity.toString();
                                                                    updateDetail(
                                                                        {
                                                                            id:
                                                                                item.id ??
                                                                                0,
                                                                            params: {
                                                                                quantity:
                                                                                    item.quantity,
                                                                            },
                                                                        },
                                                                        {
                                                                            onSuccess:
                                                                                () => {
                                                                                    queryClient.invalidateQueries(
                                                                                        {
                                                                                            queryKey:
                                                                                                getGetApiCartsDetailsQueryKey(
                                                                                                    {
                                                                                                        Id: 2,
                                                                                                    }
                                                                                                ), //TODO: 會員ID
                                                                                        }
                                                                                    );
                                                                                },
                                                                        }
                                                                    );
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <input
                                                        className="increment dark-gray"
                                                        type="button"
                                                        value="+"
                                                        onClick={() =>
                                                            plusQuantity(
                                                                item.id
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </td>

                                            <td
                                                className="col-2"
                                                style={{ textAlign: "center" }}
                                            >
                                                <h5>
                                                    $
                                                    {(
                                                        Math.ceil(
                                                            produtDetail.find(
                                                                (pditem) =>
                                                                    (pditem?.productId as number) ===
                                                                    (item?.productId as number)
                                                            ).realPrice
                                                        ) * item.quantity ||
                                                        produtDetail.find(
                                                            (pditem) =>
                                                                (pditem?.productId as number) ===
                                                                (item?.productId as number)
                                                        ).price * item.quantity
                                                    ).toFixed(0)}
                                                </h5>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <a
                                                    href="#"
                                                    className="deleteicon"
                                                    onClick={() =>
                                                        removeFromCart(item.id)
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })
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
                                    <h1>購物車內尚未有書籍</h1>
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
                                            <img src={returnIcon} alt="" />
                                            <h5>Easy Return</h5>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-sm-6">
                                        <div className="benifits-block mb-32 mb-xl-0">
                                            <img src={deliveryIcon} alt="" />
                                            <h5>Free Delivery</h5>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-sm-6">
                                        <div className="benifits-block mb-32 mb-sm-0">
                                            <img src={pricingIcon} alt="" />
                                            <h5>Best Price and Offer</h5>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-sm-6">
                                        <div className="benifits-block">
                                            <img src={dealsIcon} alt="" />
                                            <h5>Great Daily Deal</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {/* <h6 > <button onClick={clearCart} className="clearcart-btn"><i class="fa-regular fa-trash-can">清空購物車</i></button></h6> */}
            {cart.length > 0 ? (
                <section className="shipping mb-40">
                    {/* <div className='container'> */}
                    <div className="choose-shipping-mode">
                        <div className="row">
                            <div className="col-xl-6">
                                <div className="shipping-details">
                                    <div className="filter-block"></div>
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="amounts between">
                                    <div className="shipping-charges mb-24">
                                        <h6></h6>
                                    </div>

                                    <div className="sub-total mb-24">
                                        <h6>購物車商品總數</h6>
                                        <h6>{totalItems}</h6>
                                    </div>

                                    <div className="grand-total mb-24">
                                        <h5>總金額：</h5>
                                        <h5>{total.toFixed(0)}</h5>
                                    </div>
                                    <h6>
                                        {" "}
                                        <button
                                            onClick={handleCheckout}
                                            className="cus-btn"
                                            style={{ border: 0 }}
                                        >
                                            <span className="icon">
                                                <img src={orangeCart} alt="" />
                                            </span>
                                            去結帳
                                        </button>
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* </div> */}
                </section>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default CartPage;
