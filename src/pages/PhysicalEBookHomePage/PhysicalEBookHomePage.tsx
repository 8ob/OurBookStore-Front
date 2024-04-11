import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

//componets
import ProductsCarousel from "../../components/ProductsCarousel/index.tsx";
import {
    getGetApiCartsDetailsQueryKey,
    useGetApiCartsDetails,
    useGetApiProductsGetByPublishDate,
    usePostApiCartsDetails,
} from "../../API.ts";

//css
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "./PhysicalEBookHomePage.css";
import { Link } from "react-router-dom";
import LoadingMessage from "../../main.tsx";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useQueryClient } from "@tanstack/react-query";
import { useCartState } from "../../state.tsx";

const PhysicalEBookHomePage: React.FC = () => {
    //GET API
    const newProductResponse = useGetApiProductsGetByPublishDate();
    const newProducts = newProductResponse.data?.data;
    //state
    const [activeIndex, setActiveIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [addStatus, setAddStatus] = useState<string>("success");
    const [barMesaage, setBarMessage] = useState("");
    const { cartCount, setCartCount } = useCartState((state) => state);

    //API
    const cartDetailResponse = useGetApiCartsDetails({ Id: 2 }); //TODO: 會員ID
    const cartDetailData = cartDetailResponse.data?.data;
    const { mutate: addCart } = usePostApiCartsDetails();

    const queryClient = useQueryClient();
    const handleClickAddCart = (
        e: React.MouseEvent<HTMLAnchorElement>,
        addProductId: number
    ) => {
        e.preventDefault();
        console.log("cartDetailData", cartDetailData);
        if (addProductId === undefined) {
            setOpen(true);
            setBarMessage("找不到商品。");
            setAddStatus("error");
            return;
        } else if (cartDetailData && cartDetailData === undefined) {
            setCartCount(1);
        } else if (
            cartDetailData?.find((item) => item.productId === addProductId) ===
            undefined
        )
            setCartCount(1);
        else if (
            cartDetailData?.find((item) => item.productId === addProductId)
                ?.quantity >= 10
        ) {
            setOpen(true);
            setBarMessage("此商品超過購買數量限制。");
            setAddStatus("error");
            return;
        }

        addCart(
            { params: { memberId: 2, productId: addProductId } }, //TODO: 會員ID
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: getGetApiCartsDetailsQueryKey({ Id: 2 }), //TODO: 會員ID
                    });
                    setOpen(true);
                    setBarMessage("成功加入購物車。");
                    setAddStatus("success");
                },
                onError: () => {
                    setOpen(true);
                    setBarMessage("加入購物車失敗。");
                    setAddStatus("error");
                },
            }
        );
    };
    const handleClose = () => {
        setOpen(false);
    };
    if (newProductResponse.isLoading) return <LoadingMessage />;
    return (
        <div className="bg-white">
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={open}
                onClose={handleClose}
                message={barMesaage}
                autoHideDuration={3000}
                sx={{ zIndex: 9999, mt: 9 }}
            >
                <Alert
                    onClose={handleClose}
                    severity={addStatus}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {barMesaage}
                </Alert>
            </Snackbar>
            <div className="main-slider style-1">
                <div className="main-swiper">
                    <Swiper
                        modules={[Pagination, Autoplay, Navigation, EffectFade]}
                        effect="fade" // 這裡可以選擇 'cube', 'fade', 'coverflow' 或 'flip'
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        pagination={{
                            clickable: true,
                        }}
                        // navigation={{
                        //     nextEl: ".banner-slider-button-next",
                        //     prevEl: ".banner-slider-button-prev",
                        // }}
                        spaceBetween={50}
                        slidesPerView={1}
                        preventClicks={false}
                        preventClicksPropagation={false}
                        onSlideChange={(swiper) =>
                            setActiveIndex(swiper.realIndex)
                        }
                    >
                        <div className="swiper-wrapper">
                            {newProducts && newProducts.length > 0 ? (
                                newProducts?.map((product, index) => {
                                    return (
                                        <SwiperSlide
                                            key={index}
                                            className="slideHight"
                                        >
                                            <div className="swiper-slide bg-blue ">
                                                <div className="container">
                                                    <div className="banner-content">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="swiper-content">
                                                                    <div className="content-info">
                                                                        <h6
                                                                            className="sub-title"
                                                                            data-swiper-parallax="-10"
                                                                        >
                                                                            注目新品
                                                                        </h6>
                                                                        <h1
                                                                            className="title mb-0 clamp-title"
                                                                            data-swiper-parallax="-20"
                                                                        >
                                                                            {
                                                                                product.productName
                                                                            }
                                                                        </h1>
                                                                        <ul
                                                                            className="dz-tags"
                                                                            data-swiper-parallax="-30"
                                                                        >
                                                                            <li>
                                                                                <a href="#">
                                                                                    {
                                                                                        product.author
                                                                                    }
                                                                                </a>
                                                                            </li>
                                                                            <li>
                                                                                <a href="#">
                                                                                    {
                                                                                        product.detailsCategoryName
                                                                                    }
                                                                                </a>
                                                                            </li>
                                                                        </ul>
                                                                        <p
                                                                            className="text mb-0 clamp-text"
                                                                            data-swiper-parallax="-40"
                                                                            style={{
                                                                                textAlign:
                                                                                    "justify",
                                                                            }}
                                                                        >
                                                                            {
                                                                                product.description
                                                                            }
                                                                        </p>
                                                                        <div
                                                                            className="price"
                                                                            data-swiper-parallax="-50"
                                                                        >
                                                                            <span className="price-num">
                                                                                {product?.realPrice
                                                                                    ? `${Math.round(
                                                                                          product?.realPrice as number
                                                                                      )} 元`
                                                                                    : ` ${Math.round(
                                                                                          product?.price as number
                                                                                      )} 元`}
                                                                            </span>
                                                                            <del>
                                                                                {product?.realPrice
                                                                                    ? `${Math.round(
                                                                                          product?.price as number
                                                                                      )} 元`
                                                                                    : ""}
                                                                            </del>
                                                                            {product?.realPrice && (
                                                                                <span className="badge badge-danger">
                                                                                    {`${product.discountDegree}%`}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div
                                                                            className="content-btn"
                                                                            data-swiper-parallax="-60"
                                                                        >
                                                                            {activeIndex ===
                                                                                index && (
                                                                                <>
                                                                                    <a
                                                                                        className="btn btn-primary btnhover"
                                                                                        style={{
                                                                                            pointerEvents:
                                                                                                "auto",
                                                                                        }}
                                                                                        onClick={(
                                                                                            e
                                                                                        ) =>
                                                                                            handleClickAddCart(
                                                                                                e,
                                                                                                product.productId as number
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        {" "}
                                                                                        加入購物車
                                                                                    </a>
                                                                                    <Link
                                                                                        to={`/ProductDetail/${product.productId}`}
                                                                                        className="btn border btnhover ms-4 text-white"
                                                                                        style={{
                                                                                            pointerEvents:
                                                                                                "auto",
                                                                                        }}
                                                                                    >
                                                                                        查看商品
                                                                                    </Link>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div
                                                                    className="banner-media"
                                                                    data-swiper-parallax="-100"
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        justifyContent:
                                                                            "center",
                                                                        alignItems:
                                                                            "center",
                                                                        height: "200px",
                                                                    }}
                                                                >
                                                                    {product.imageUrl![0] ? (
                                                                        <img
                                                                            src={
                                                                                product.imageUrl![0]
                                                                            }
                                                                            alt="banner-media"
                                                                            style={{
                                                                                marginTop:
                                                                                    "400px",
                                                                                marginRight:
                                                                                    "100px",
                                                                                height: "500px",
                                                                                width: "350px",
                                                                                borderRadius:
                                                                                    "10px",
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div></div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })
                            ) : (
                                <div className="swiper-slide bg-blue">
                                    <div className="container">
                                        <div className="banner-content">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="swiper-content">
                                                        <div className="content-info">
                                                            <h6
                                                                className="sub-title"
                                                                data-swiper-parallax="-10"
                                                            >
                                                                loading...
                                                            </h6>
                                                            <h1
                                                                className="title mb-0"
                                                                data-swiper-parallax="-20"
                                                            >
                                                                loading...
                                                            </h1>
                                                            <ul
                                                                className="dz-tags"
                                                                data-swiper-parallax="-30"
                                                            >
                                                                <li>
                                                                    <a href="#">
                                                                        loading...
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">
                                                                        loading...
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                            <p
                                                                className="text mb-0"
                                                                data-swiper-parallax="-40"
                                                            >
                                                                Loading...
                                                            </p>
                                                            <div
                                                                className="price"
                                                                data-swiper-parallax="-50"
                                                            >
                                                                <span className="price-num">
                                                                    Loading...
                                                                </span>
                                                                <del>
                                                                    Loading...
                                                                </del>
                                                                <span className="badge badge-danger">
                                                                    Loading...
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="content-btn"
                                                                data-swiper-parallax="-60"
                                                            >
                                                                <a
                                                                    className="btn btn-primary btnhover"
                                                                    href="#"
                                                                >
                                                                    購買
                                                                </a>
                                                                <a
                                                                    className="btn border btnhover ms-4 text-white"
                                                                    href="#"
                                                                >
                                                                    Loading...
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="partner">
                                                            <p>Loading...</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Swiper>
                </div>
            </div>

            <ProductsCarousel />
        </div>
    );
};

export default PhysicalEBookHomePage;
