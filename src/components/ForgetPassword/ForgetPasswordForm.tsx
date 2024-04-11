import { useState } from "react";
import { usePostApiEmailSendForgotPassword } from "../../API";

function ForgetPassword() {
  const [email, setEmail] = useState("123testtest01@gmail.com");
  const [message, setMessage] = useState("");
  const { mutate: addForgotPassword, error } =
    usePostApiEmailSendForgotPassword();

  const handleForgotPassword = () => {
    addForgotPassword(
      { data: { email: email } },
      {
        onSuccess: () => {
          setMessage("郵件已經發送至您的信箱，請檢查。");
        },
        onError: () => {
          setMessage("發送郵件失敗，請稍後再試。");
        },
      }
    );
  };

  return (
    <section className="content-inner">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-6 mb-4">
            <div className="reset-area">
              <h4 className="text-secondary">忘記密碼</h4>
              {error && (
                <div className="alert alert-danger" role="alert">
                  錯誤警報: {error.message}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">電子信箱:</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="請輸入信箱"
                  className="form-control"
                />
              </div>
              <button
                onClick={handleForgotPassword}
                className="btn btn-primary"
              >
                發送至信箱
              </button>
              {message && (
                <div className="alert alert-info mt-2">{message}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgetPassword;
