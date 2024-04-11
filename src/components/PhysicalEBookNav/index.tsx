//React
import React, { useState, useRef, useEffect } from "react";
//React-Router
import { Link, Navigate, useNavigate } from "react-router-dom";
// Material-UI
import { FormControl, Select, MenuItem } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
//FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/thePrint/logo.png";
//css
import "./nav.css";
//state
import {
    useDataState,
    useSubmitDataState,
    searchDataState,
    submitDataState,
} from "../../state.tsx";
//API
import {
    useGetApiProducts,
    GetApiProductsParams,
    useGetApiCartsDetails,
} from "../../API";
//images
import memberAvatar from "../../assets/picture/profile1.jpg";
import MainHeader from "../MainHeader/MainHeader.tsx";

const theme = createTheme({
    zIndex: {
        modal: 10000, // 可以設定為你需要的 z-index 值
    },
});

const PhysicalEBookNav: React.FC = () => {
    const [bookSearch, setBookSearch] = useState<number>(10);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null); // 創建一個ref表單對象

    //表單提交資訊與搜索資訊
    const { submitData, setSubmitData } = useSubmitDataState<submitDataState>(
        (state) => state
    );
    const { setSearchData } = useDataState<searchDataState>((state) => state);
    // 使用生成的GET請求hook，並根據條件啟動請求
    const productData = useGetApiProducts(submitData);
    const cartDetailResponse = useGetApiCartsDetails({ Id: 2 }); //todo 會員ID

    useEffect(() => {
        if (productData.data?.data) setSearchData(productData.data?.data);
    }, [productData.data?.data]);

    // 定義切換 dropdown 顯示/隱藏的函數
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
        navigate("/cart");
    };

    function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault(); // 阻止表單的默認提交行為

        // 模擬表單數據的收集
        const formData = new FormData(formRef.current as HTMLFormElement);

        // 這裡可以替換為發送數據到後端的代碼

        const apiParams: GetApiProductsParams = {
            Keyword: formData.get("keyword")?.toString() || undefined,
            BookSearch: formData.get("bookSearch")
                ? Number(formData.get("bookSearch"))
                : 10,
        };
        const newSubmitData = { ...submitData, ...apiParams };
        setSubmitData(newSubmitData);
        navigate("/ProductSearch");
    }

    return (
        <>
            <div className="header-info-bar mt-2">
                <div
                    className="container clearfix"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    {/* <!-- Website Logo */}
                    <div className="logo-header logo-dark">
                        <Link to="/">
                            <img src={logo} alt="logo" />
                        </Link>
                    </div>
                    <form ref={formRef} onSubmit={handleSearchSubmit}>
                        <div className="search-container">
                            <FormControl
                                fullWidth
                                className="mb-4"
                                sx={{
                                    width: "100px",
                                    height: "100%",
                                    "& .MuiInputLabel-outlined.Mui-focused": {
                                        color: "#EAA451", // 聚焦時InputLabel的文字顏色
                                    },
                                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                            borderColor: "#EAA451", // 焦點時Select外框顏色
                                        },
                                }}
                            >
                                <ThemeProvider theme={theme}>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={bookSearch}
                                        name="bookSearch"
                                        sx={{
                                            height: "100%",
                                            borderRadius: "5px 0 0 5px",
                                        }}
                                        onChange={(event) => {
                                            setBookSearch(
                                                event.target.value as number
                                            );
                                        }}
                                    >
                                        <MenuItem value={10}>全部</MenuItem>
                                        <MenuItem value={20}>書名</MenuItem>
                                        <MenuItem value={30}>作者</MenuItem>
                                        <MenuItem value={40}>出版商</MenuItem>
                                    </Select>
                                </ThemeProvider>
                            </FormControl>
                            <div className="search-box">
                                <input
                                    type="text"
                                    name="keyword"
                                    className="search-input form-control "
                                    placeholder="書籍搜尋"
                                    autoComplete="off"
                                    style={{
                                        width: "360px",
                                        padding: "10px",
                                        paddingRight: "30px",
                                        border: "1px solid #ccc",
                                        borderLeft: "none",
                                        borderRadius: "0 5px 5px 0",
                                        height: "100%",
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="b-unstyle search-icon"
                                >
                                    <i>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </i>
                                </button>
                            </div>
                        </div>
                    </form>
                    {/* <!-- EXTRA NAV --> */}
                    <div className="extra-nav">
                        <div className="extra-cell" style={{ margin: "20px" }}>
                            <ul className="navbar-nav header-right">
                                {/* <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24px"
                                            viewBox="0 0 24 24"
                                            width="24px"
                                            fill="#000000"
                                        >
                                            <path
                                                d="M0 0h24v24H0V0z"
                                                fill="none"
                                            ></path>
                                            <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"></path>
                                        </svg>
                                        <span className="badge">21</span>
                                    </a>
                                </li> */}
                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className="nav-link box cart-btn"
                                        onClick={toggleDropdown}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24px"
                                            viewBox="0 0 24 24"
                                            width="24px"
                                            fill="#000000"
                                        >
                                            <path
                                                d="M0 0h24v24H0V0z"
                                                fill="none"
                                            ></path>
                                            <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
                                        </svg>
                                        <span className="badge">
                                            {
                                                cartDetailResponse.data?.data
                                                    .length
                                            }
                                        </span>
                                    </button>
                                    {/* {dropdownVisible && ( */}

                                    {/* <ul
                                        className={` dropdown-menu show cart-list ${
                                            dropdownVisible ? "open" : "close"
                                        }`}
                                    >
                                        <li className="cart-item">
                                            <div className="media">
                                                <div className="media-left">
                                                    <a href="books-detail.html">
                                                        <img
                                                            alt=""
                                                            className="media-object"
                                                            src="assets/picture/pic1.jpg"
                                                        />
                                                    </a>
                                                </div>
                                                <div className="media-body">
                                                    <h6 className="dz-title">
                                                        <a
                                                            href="#"
                                                            className="media-heading"
                                                        >
                                                            Real Life
                                                        </a>
                                                    </h6>
                                                    <span className="dz-price">
                                                        $28.00
                                                    </span>
                                                    <span className="item-close">
                                                        &times;
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="cart-item">
                                            <div className="media">
                                                <div className="media-left">
                                                    <a href="#">
                                                        <img
                                                            alt=""
                                                            className="media-object"
                                                            src="assets/picture/pic2.jpg"
                                                        />
                                                    </a>
                                                </div>
                                                <div className="media-body">
                                                    <h6 className="dz-title">
                                                        <a
                                                            href="#"
                                                            className="media-heading"
                                                        >
                                                            Home
                                                        </a>
                                                    </h6>
                                                    <span className="dz-price">
                                                        $28.00
                                                    </span>
                                                    <span className="item-close">
                                                        &times;
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="cart-item">
                                            <div className="media">
                                                <div className="media-left">
                                                    <a href="#">
                                                        <img
                                                            alt=""
                                                            className="media-object"
                                                            src="assets/picture/pic3.jpg"
                                                        />
                                                    </a>
                                                </div>
                                                <div className="media-body">
                                                    <h6 className="dz-title">
                                                        <a
                                                            href="#"
                                                            className="media-heading"
                                                        >
                                                            Such a fun age
                                                        </a>
                                                    </h6>
                                                    <span className="dz-price">
                                                        $28.00
                                                    </span>
                                                    <span className="item-close">
                                                        &times;
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="cart-item text-center">
                                            <h6 className="text-secondary">
                                                Totle = $500
                                            </h6>
                                        </li>
                                        <li className="text-center d-flex">
                                            <a
                                                href="#"
                                                className="btn btn-sm btn-primary me-2 btnhover w-100"
                                            >
                                                View Cart
                                            </a>
                                            <a
                                                href="#"
                                                className="btn btn-sm btn-outline-primary btnhover w-100"
                                            >
                                                Checkout
                                            </a>
                                        </li>
                                    </ul> */}

                                    {/* )} */}
                                </li>
                                <MainHeader />
                            </ul>
                        </div>
                    </div>
                    {/* header search nav */}
                </div>
            </div>
            {/* sticky-header */}
            {/* <div className=" main-bar-wraper navbar-expand-lg">
                <div className="main-bar clearfix">
                    <div className="container clearfix">
                        <div
                            className="header-nav navbar-collapse collapse justify-content-start"
                            id="navbarNavDropdown"
                        >
                            <ul className="nav navbar-nav">
                     
                                <li>
                                    <Link to="/">
                                        <span>實體書/電子書</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/usedBook">
                                        <span>二手書</span>
                                    </Link>
                                </li>
                                
                            </ul>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    );
};

export default PhysicalEBookNav;
