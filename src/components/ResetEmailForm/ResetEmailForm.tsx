import { useState } from "react";
import { usePostApiEmailSendResetPassword } from "../../API";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); // 如果你的路由是 /reset-password/:token
  const [newPassword, setNewPassword] = useState("");
  const {
    mutate: resetPassword,
    error,
    isSuccess,
  } = usePostApiEmailSendResetPassword();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetPassword(
      { data: { token: token, newPassword: newPassword } },
      {
        onSuccess: () => {
          alert("修改成功，將導入到會員登入");
          navigate("/member-login", { replace: true });
        },
      }
    );
  };

  if (isSuccess) {
    // 如果使用 onSuccess 回調，這裡就不再需要處理成功的情況
    return null;
  }

  return (
    <section className="content-inner">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-6 mb-4">
            <div className="reset-area">
              <form onSubmit={handleSubmit}>
                <h4 className="text-secondary">重置密碼</h4>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {String(error.response?.data)}
                  </div>
                )}

                <div className="mb-4 form-group">
                  <label htmlFor="newPassword">新密碼:</label>
                  <input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    placeholder="輸入新密碼"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-control"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  重置密碼
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
