import React, { useState, useEffect } from "react";
import {
    GoogleLogin,
    GoogleLoginResponse,
    GoogleLoginResponseOffline,
} from "react-google-login";
import { Link } from "react-router-dom";
import bg3 from "../../assets/picture/banner2-1.png";
import "./loginStyle.css";
import logo from "../../assets/images/thePrint/logo.png";
import usedbookLogo from "../../assets/images/logo_dark.png";

// import { Link } from "react-router-dom";
// import FormBookImage from '../../component/Image/sign-up.png';

export async function action({ request }: { request: Request }) {
    const formData = await request.formData();
    const note = Object.fromEntries(formData);
    return fetch("/api/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer SOMEJWTTOKEN",
        },
        body: JSON.stringify(note),
    });
}
function logout() {
    localStorage.removeItem("token");
    window.location.href = "/member-login";
}

function MemberLoginForm() {
    const [email, setEmail] = useState("123testtest01@gmail.com");
    const [password, setPassword] = useState("a123123!");
    const [captchaUrl, setCaptchaUrl] = useState("");
    const [captcha, setUserCaptcha] = useState("");
    const [cacheKey, setCacheKey] = useState("");

    const GoogleLoginSuccess = (
        response: GoogleLoginResponse | GoogleLoginResponseOffline
    ) => {
        console.log("Google登錄成功：", response);
    };
    const GoogleLoginFail = (response: GoogleLoginResponse) => {
        console.log("Google登錄失敗：", response);
        // 在這裡處理登錄失敗的邏輯
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "https://localhost:7236/api/MemberLogin",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        captcha,
                        cacheKey,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "登入過程中發生錯誤");
            }

            const { token } = await response.json(); // 假設後端回應包含 token
            localStorage.setItem("token", token); // 儲存 JWT 到 localStorage

            alert("登入成功");
            // 這裡可以重定向到會員中心或執行其他操作
            window.location.href = "/"; // 重定向到會員中心頁面
        } catch (error) {
            if (error instanceof Error) alert(error.message);
        }
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    // 生成圖形驗證碼
    const generateCaptcha = async () => {
        // 備用網址
        // `https://localhost:7236/api/Captcha/GetCaptcha?dummy=${new Date().getTime()}`
        // https://localhost:7236/api/Captcha/GetCaptcha"
        const response = await fetch(
            `https://localhost:7236/api/Captcha/GetCaptcha?dummy=${new Date().getTime()}`
        );
        const data = await response.json();
        //console.log(data);
        // 保存cacheKey，例如在隐藏字段或JavaScript变量中
        const cacheKey = data.cacheKey;
        const file = data.file;

        // 更新為您的後端生成圖形驗證碼的URL
        setCaptchaUrl(
            `data:image/png;base64,${file.fileContents}`
            //`https://localhost:7236/api/Captcha/GetCaptcha?dummy=${new Date().getTime()}`
        );
        setCacheKey(cacheKey);
    };

    return (
        // <section classNameName="signup p-40 mb-64">
        //   <div classNameName="container">
        //     <div classNameName="row">
        //       <div classNameName="col-lg-6">
        //         <div classNameName="form-block bg-lightest-gray">
        //           <h3 classNameName="mb-48">會員登入</h3>

        //           <div classNameName="row mb-24">
        //             <div style={{ display: "flex", justifyContent: "flex-end" }}>
        //               <h6 style={{ marginLeft: "500px", textAlign: "right" }}>
        //                 <Link to="/employee-login" classNameName="color-black">
        //                   員工登入
        //                 </Link>
        //               </h6>
        //             </div>

        //             <div classNameName="col-sm-6">
        //               <GoogleLogin
        //                 clientId="your-client-id.apps.googleusercontent.com"
        //                 buttonText="使用Google登錄"
        //                 onSuccess={GoogleLoginSuccess}
        //                 onFailure={GoogleLoginFail}
        //                 cookiePolicy={"single_host_origin"}
        //               />
        //             </div>
        //           </div>

        //           <h5 classNameName="or mb-24">or</h5>

        //           <form onSubmit={handleSubmit}>
        //             <div classNameName="mb-24">
        //               <input
        //                 type="email"
        //                 classNameName="form-control"
        //                 id="login-email"
        //                 name="login-email"
        //                 required
        //                 placeholder="請輸入電子信箱"
        //                 value={email}
        //                 onChange={(e) => setEmail(e.target.value)}
        //               />
        //             </div>
        //             <div classNameName="mb-24">
        //               <input
        //                 type="password"
        //                 classNameName="form-control"
        //                 id="login-password"
        //                 name="login-password"
        //                 required
        //                 placeholder="請輸入密碼"
        //                 value={password}
        //                 onChange={(e) => setPassword(e.target.value)}
        //               />
        //             </div>

        //             <div
        //               classNameName="mb-24"
        //               style={{
        //                 display: "flex",
        //                 justifyContent: "center",
        //                 alignItems: "center",
        //               }}
        //             >
        //               <div style={{ display: "flex", alignItems: "center" }}>
        //                 <img
        //                   src={captchaUrl}
        //                   alt="captcha"
        //                   onClick={generateCaptcha}
        //                   style={{ cursor: "pointer" }}
        //                 />
        //                 <button
        //                   type="button"
        //                   onClick={generateCaptcha}
        //                   classNameName="refresh-button"
        //                   style={{ marginLeft: "10px" }}
        //                 >
        //                   刷新驗證碼
        //                 </button>
        //               </div>
        //             </div>

        //             <div
        //               classNameName="mb-24"
        //               style={{ display: "flex", justifyContent: "center" }}
        //             >
        //               <input
        //                 type="text"
        //                 classNameName="form-control"
        //                 required
        //                 placeholder="請輸入驗證碼"
        //                 value={userCaptcha}
        //                 onChange={(e) => setUserCaptcha(e.target.value)}
        //                 style={{ maxWidth: "200px" }}
        //               />
        //             </div>
        //             <div style={{ display: "flex", justifyContent: "center" }}>
        //               <button type="submit" classNameName="b-unstyle cus-btn">
        //                 <span classNameName="icon">
        //                   {/* Assuming you have this image in your public folder or assets */}
        //                   <img src="/static/picture/click-button.png" alt="Login" />
        //                 </span>
        //                 按此登入
        //               </button>
        //             </div>
        //           </form>

        //           <div
        //             classNameName="register-bottom"
        //             style={{
        //               display: "flex",
        //               justifyContent: "space-between",
        //               alignItems: "center",
        //             }}
        //           >
        //             <h6 style={{ marginRight: "100px", textAlign: "left" }}>
        //               <Link to="/register" classNameName="color-primary">
        //                 註冊會員
        //               </Link>
        //             </h6>
        //             <h6 style={{ marginLeft: "100px", textAlign: "right" }}>
        //               <Link to="/ForgetPassword" classNameName="color-primary">
        //                 忘記密碼
        //               </Link>
        //             </h6>
        //           </div>
        //         </div>
        //       </div>

        //       {/* 如果您有其他內容想放在右側，可以在這裡添加 */}
        //       <div classNameName="col-lg-6">{/* 右側內容 */}</div>
        //     </div>
        //   </div>
        // </section>
        <div className="loginBG" style={{}}>
            <div className="fullscreen-background"></div>

            <section className="content-inner shop-account">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 mb-4">
                            <div
                                className="login-area"
                                style={{ backgroundColor: "#ffff" }}
                            >
                                <div
                                    style={{
                                        marginTop: "60px",
                                        marginLeft: "60px",
                                    }}
                                >
                                    <div
                                        className=""
                                        style={{ width: "350px" }}
                                    >
                                        <Link to="/">
                                            <img src={logo} alt="logo" />
                                        </Link>
                                    </div>
                                    <div
                                        className=""
                                        style={{
                                            width: "100%",
                                            marginLeft: "60px",
                                            marginTop: "90px",
                                        }}
                                    >
                                        <Link to="/usedBook">
                                            <img
                                                src={usedbookLogo}
                                                alt="usedbookLogo"
                                            />
                                        </Link>
                                    </div>
                                </div>

                                <div className="tab-content">
                                    <div
                                        className="row"
                                        style={{ marginTop: "170px" }}
                                    >
                                        <div
                                            className="col-8"
                                            style={{ paddingLeft: "60px" }}
                                        >
                                            <h4>新用戶 Welcome to join us</h4>
                                            <p>還沒有帳號嗎?歡迎加入我們！</p>
                                        </div>
                                        <div className="col-4">
                                            <a
                                                className="btn btn-primary btnhover m-r5 button-lg radius-no"
                                                href="/Register"
                                            >
                                                點此註冊
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 mb-4">
                            <div
                                className="login-area"
                                style={{ backgroundColor: "#ffff" }}
                            >
                                <div className="tab-content nav">
                                    <form
                                        method="post"
                                        id="login"
                                        className="tab-pane active col-12"
                                        onSubmit={handleSubmit}
                                    >
                                        <div
                                            className="row"
                                            style={{ marginTop: "50px" }}
                                        >
                                            <div className="col-7">
                                                <h4 className="text-secondary">
                                                    LOGIN
                                                </h4>
                                                <p className="font-weight-600">
                                                    如果你已經註冊的話，那就登入吧！
                                                </p>
                                            </div>
                                            <div className="col-5">
                                                <GoogleLogin
                                                    clientId="266231759117-rneh56rnftdqop46b2pvbted0pv9h79l.apps.googleusercontent.com"
                                                    buttonText="使用Google登錄"
                                                    onSuccess={
                                                        GoogleLoginSuccess
                                                    }
                                                    onFailure={GoogleLoginFail}
                                                    cookiePolicy={
                                                        "single_host_origin"
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 mb-4">
                                            <label className="label-title">
                                                電子信箱 *
                                            </label>
                                            <input
                                                name="dzName"
                                                required
                                                className="form-control"
                                                placeholder="輸入您的電子信箱"
                                                type="email"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">
                                                密碼 *
                                            </label>
                                            <input
                                                name="dzName"
                                                required
                                                className="form-control "
                                                placeholder="輸入您的密碼"
                                                type="password"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                            />
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <img
                                                src={captchaUrl}
                                                alt="captcha"
                                                className="mt-2 ms-2"
                                                onClick={generateCaptcha}
                                                style={{
                                                    cursor: "pointer",
                                                    marginRight: "25px",
                                                }}
                                            />
                                            <div className="mb-4">
                                                <label className="label-title">
                                                    驗證碼輸入框 *
                                                </label>
                                                <input
                                                    name="captcha"
                                                    required
                                                    className="form-control "
                                                    placeholder="輸入驗證碼"
                                                    type="captcha"
                                                    value={captcha}
                                                    onChange={(e) =>
                                                        setUserCaptcha(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={generateCaptcha}
                                                className="refresh-button btn btn-primary btnhover mt-2 me-4"
                                                style={{
                                                    marginLeft: "10px",
                                                    padding: "5px",
                                                    borderRadius: "5px",
                                                }}
                                            >
                                                刷新驗證碼
                                            </button>
                                        </div>

                                        <div className="text-left">
                                            <button className="btn btn-primary btnhover me-4">
                                                點此登入
                                            </button>

                                            <a
                                                data-bs-toggle="tab"
                                                href="/ForgetPassword"
                                                className="m-l5"
                                            >
                                                <i className="fas fa-unlock-alt"></i>
                                                忘記密碼了嗎？
                                            </a>
                                            <br></br>

                                            {/* <a
                        data-bs-toggle='tab'
                        href='/employee-login'
                        className='m-l5'
                      >
                        <i className='text-secondary'>員工登入</i>
                      </a> */}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default MemberLoginForm;
