import React, { useState } from "react";
import axios from "axios";
//import "../../assets/css/app.css";
import { useNavigate } from "react-router-dom";

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

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    gender: true,
    dateOfBirth: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
  });
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 注意：更改URL以匹配你的實際後端API端點
      const response = await axios.post(
        "https://localhost:7236/api/EmailSend/Register",
        formData
      );

      console.log(response.data);
      navigate("/CheckVerificationCode", { state: { email: formData.email } });
      alert("註冊成功！");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("註冊失敗1：", error.response?.data);
        alert("註冊失敗2：" + error.response?.data);
      } else {
        console.error("註冊失敗3：", error);
        alert("註冊失敗4：" + String(error));
      }
    }
  };

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">姓名:</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="姓名"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>性别：</label>
          <select
            name="gender"
            value={String(formData.gender)}
            onChange={handleChange}
          >
            <option value="true">男性</option>
            <option value="false">女性</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dateOfBirth">出生日期:</label>
          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">電子信箱:</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="電子信箱"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">密碼:</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="密碼"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">地址:</label>
          <input
            id="address"
            type="text"
            name="address"
            placeholder="地址"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">手機號碼:</label>
          <input
            id="phoneNumber"
            type="text"
            name="phoneNumber"
            placeholder="手機號碼"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-group action">
          <button type="submit" className="btn btn-primary">
            註冊
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
