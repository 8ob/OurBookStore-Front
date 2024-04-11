import React, { useState, useEffect } from "react";
//import "../../assets/css/app.css";

// import { Form } from 'react-router-dom';

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

function EmployeeLoginForm() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [captchaUrl, setCaptchaUrl] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:7236/api/EmployeeLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ account, password }),
      });

      if (!response.ok) {
        throw new Error("無此帳號密碼或帳號密碼錯誤");
      }

      const data = await response.text();
      alert(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // 生成圖形驗證碼
  const generateCaptcha = () => {
    // 更新為您的後端生成圖形驗證碼的URL
    setCaptchaUrl(
      `https://localhost:7236/api/Captcha/GetCaptcha?dummy=${new Date().getTime()}`
    );
  };

  return (
    <section className="signup p-40 mb-64">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="form-block bg-lightest-gray">
              <h3 className="mb-48">員工登入</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-24">
                  <input
                    type="text"
                    className="form-control"
                    id="login-account"
                    name="login-account"
                    required
                    placeholder="帳號"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                  />
                </div>
                <div className="mb-24">
                  <input
                    type="password"
                    className="form-control"
                    id="login-password"
                    name="login-password"
                    required
                    placeholder="密碼"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div
                  className="mb-24"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={captchaUrl}
                      alt="captcha"
                      onClick={generateCaptcha}
                      style={{ cursor: "pointer" }}
                    />
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="refresh-button"
                      style={{ marginLeft: "10px" }}
                    >
                      刷新驗證碼
                    </button>
                  </div>
                </div>
                {/* 驗證碼輸入框 */}
                <div
                  className="mb-24"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="請輸入驗證碼"
                    value={userCaptcha}
                    onChange={(e) => setUserCaptcha(e.target.value)}
                    style={{ maxWidth: "200px" }} // 可根據需要調整寬度
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button type="submit" className="b-unstyle cus-btn">
                    <span className="icon">
                      <img src="static/picture/click-button.png" alt="" />
                    </span>
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            {/* 如果需要添加右側圖像，請將圖像放置在這裡 */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmployeeLoginForm;
