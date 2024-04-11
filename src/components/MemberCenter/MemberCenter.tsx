import React, { useState, useEffect } from "react";
// import { Dropdown } from "react-bootstrap";
// import "bootstrap-icons/font/bootstrap-icons.min.css";
// import Button from "@mui/material/Button";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import "./Center.css";

interface MemberInfoType {
  id?: number;
  name?: string;
  dateOfBirth?: Date;
  email?: string;
  phoneNumber?: number;
  address?: string;
}

const menuItems = [
  {
    title: "會員中心",
    link: "MemberCenter",
    icon: "far fa-user",
    subItems: [
      { title: "個人資料", link: "/MemberCenter", icon: "fas fa-id-card" },
      { title: "我的訂單", link: "/order", icon: "fas fa-shopping-cart" },
      { title: "優惠券總覽", link: "/Coupons", icon: "fas fa-tag" },
      // { title: "訂單記錄", link: "/orders" },
      // 添加其他次選項...
    ],
  },
  {
    title: "島讀日二手書平台",
    link: "問妍如",
    icon: "fas fa-book",
    subItems: [
      {
        title: "我的二手書",
        link: "/usedBook/used-book-list",
        icon: "fas fa-book-open",
      },
      {
        title: "訂單管理",
        link: "/usedBook/usedBookOrder",
        icon: "fas fa-edit",
      },
    ],
  },
  // 添加其他主選項...
];

const MemberCenter: React.FC = () => {
  const [memberInfo, setMemberInfo] = useState<MemberInfoType | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const handleMenuClick = (index: number) => {
    setActiveMenu(activeMenu === index ? null : index); // 如果點擊的是當前已展開的選項，則收縮；否則，展開新的選項。
  };

  useEffect(() => {
    const fetchMemberInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const response = await fetch(
          "https://localhost:7236/api/MemberLogin/member-info",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("無法獲取會員資訊");
        }

        const data = await response.json();
        console.log(data);
        setMemberInfo(data);
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    fetchMemberInfo();
  }, []);
  const handleMemberUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberInfo) return;
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://localhost:7236/api/Members/${memberInfo.id}/MemberEdit`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memberInfo),
      }
    );

    if (!response.ok) {
      console.error("無法獲取會員信息");
      return;
    }

    console.log("已更新");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMemberInfo({ ...memberInfo, [name]: value });
  };

  // const renderContent = () => {
  //   switch (activeTab) {
  //     case "profile":
  //       return <Profile memberInfo={memberInfo} />;
  //     case "shop":
  //       return <Shop />;
  //     case "orders":
  //       return <Orders />;
  //     default:
  //       return <Profile memberInfo={memberInfo} />;
  //   }
  // };

  return (
    <div className="page-content bg-white">
      <div className="content-block">
        <section className="content-inner bg-white">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-lg-4 m-b30">
                <div className="sticky-top">
                  <div className="shop-account">
                    <ul className="account-list">
                      {menuItems.map((item, index) => (
                        <li key={index}>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleMenuClick(index);
                            }}
                          >
                            <i className={item.icon} aria-hidden="true"></i>
                            <span>{item.title}</span>
                          </a>
                          {activeMenu === index && (
                            <ul>
                              {item.subItems.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <a href={subItem.link}>{subItem.title}</a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-9 col-lg-8 m-b30">
                <div className="shop-bx shop-profile">
                  <div className="shop-bx-title clearfix">
                    <h5 className="text-uppercase">Basic Information</h5>
                  </div>
                  <form onSubmit={handleMemberUpdate}>
                    <div className="row m-b30">
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-3">
                          <label htmlFor="姓名：" className="form-label">
                            姓名：
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={memberInfo?.name || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-3">
                          <label htmlFor="信箱" className="form-label">
                            信箱
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={memberInfo?.email || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-3">
                          <label htmlFor="生日" className="form-label">
                            生日
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={
                              memberInfo?.dateOfBirth
                                ? new Date(
                                    memberInfo.dateOfBirth
                                  ).toLocaleDateString("en-CA")
                                : ""
                            }
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-3">
                          <label htmlFor="電話號碼" className="form-label">
                            電話號碼
                          </label>
                          <input
                            type="tel"
                            className="form-control"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={memberInfo?.phoneNumber || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="mb-3">
                          <label htmlFor="地址" className="form-label">
                            地址
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="address"
                            name="address"
                            value={memberInfo?.address || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="mb-3">
                          {/* <label
                            htmlFor="exampleFormControlTextarea"
                            className="form-label"
                          >
                            Description:
                          </label> */}
                          {/* <textarea
                            className="form-control"
                            id="exampleFormControlTextarea"
                            rows={5}
                          >
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the
                            1500s,when an unknown printer took a galley of type
                            and scrambled it to make a type specimen book. It
                            has survived not only five centuries,but also the
                            leap into electronic typesetting,remaining
                            essentially unchanged. It was popularised in the
                            1960s.
                          </textarea> */}
                        </div>
                      </div>
                    </div>
                    {/* <div className="shop-bx-title clearfix">
                      <h5 className="text-uppercase">Contact Information</h5>
                    </div> */}
                    {/* <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="formcontrolinput5"
                            className="form-label"
                          >
                            Contact Number:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="formcontrolinput5"
                            placeholder="+1 123 456 7890"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="formcontrolinput6"
                            className="form-label"
                          >
                            Email Address:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="formcontrolinput6"
                            placeholder="info@example.com"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="formcontrolinput7"
                            className="form-label"
                          >
                            Country:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="formcontrolinput7"
                            placeholder="Country Name"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="formcontrolinput8"
                            className="form-label"
                          >
                            Postcode:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="formcontrolinput8"
                            placeholder="112233"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="formcontrolinput9"
                            className="form-label"
                          >
                            City:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="formcontrolinput9"
                            placeholder="City Name"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-4">
                          <label
                            htmlFor="formcontrolinput10"
                            className="form-label"
                          >
                            Full Address:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="formcontrolinput10"
                            placeholder="New york City"
                          />
                        </div>
                      </div>
                    </div> */}
                    <button type="submit" className="btn btn-primary btnhover">
                      Save Setting
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// interface ProfileProps {
//   memberInfo: MemberInfoType | null;
// }

// const Profile: React.FC<ProfileProps> = ({ memberInfo }) => {
//   return (
//     <div>
//       <h2>Profile Information</h2>
//       <p>Name: {memberInfo?.name}</p>
//       <p>Email: {memberInfo?.email}</p>
//     </div>
//   );
// };
// const Shop = () => {
//   return <div>Shop Section</div>;
// };

// const Orders = () => {
//   return <div>Orders Section</div>;
// };

export default MemberCenter;

//     <div className="page-content bg-white">
//       <div className="content-block">
//         <section className="content-inner bg-white">
//           <div className="container">
//             <div className="row">
//               <div className="col-xl-3 col-lg-4 m-b30">
//                 <div className="sticky-top">
//                   <div className="shop-account">
//                     <ul className="account-list">
//                       {menuItems.map((item, index) => (
//                         <li key={index}>
//                           <Dropdown>
//                             <Dropdown.Toggle
//                               variant="success"
//                               id={`dropdown-${index}`}
//                             >
//                               <i className={item.icon} aria-hidden="true"></i>
//                               {item.title}
//                             </Dropdown.Toggle>
//                             <Dropdown.Menu>
//                               {item.subItems.map((subItem, subIndex) => (
//                                 <Dropdown.Item
//                                   key={subIndex}
//                                   href={subItem.link}
//                                 >
//                                   {subItem.title}
//                                 </Dropdown.Item>
//                               ))}
//                             </Dropdown.Menu>
//                           </Dropdown>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-xl-9 col-lg-8 m-b30">
//                 <div className="shop-bx shop-profile">
//                   <div className="shop-bx-title clearfix">
//                     <h5 className="text-uppercase">Basic Information</h5>
//                   </div>
//                   <form onSubmit={handleMemberUpdate}>
//                     <div className="row m-b30">
//                       <div className="col-lg-6 col-md-6">
//                         <div className="mb-3">
//                           <label htmlFor="name" className="form-label">
//                             姓名：
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             id="name"
//                             name="name"
//                             value={memberInfo?.name || ""}
//                             onChange={handleChange}
//                           />
//                         </div>
//                       </div>
//                       <div className="col-lg-6 col-md-6">
//                         <div className="mb-3">
//                           <label htmlFor="email" className="form-label">
//                             信箱：
//                           </label>
//                           <input
//                             type="email"
//                             className="form-control"
//                             id="email"
//                             name="email"
//                             value={memberInfo?.email || ""}
//                             onChange={handleChange}
//                           />
//                         </div>
//                       </div>
//                       <div className="col-lg-6 col-md-6">
//                         <div className="mb-3">
//                           <label htmlFor="dateOfBirth" className="form-label">
//                             生日：
//                           </label>
//                           <input
//                             type="date"
//                             className="form-control"
//                             id="dateOfBirth"
//                             name="dateOfBirth"
//                             value={
//                               memberInfo?.dateOfBirth
//                                 ? new Date(
//                                     memberInfo.dateOfBirth
//                                   ).toLocaleDateString("en-CA")
//                                 : ""
//                             }
//                             onChange={handleChange}
//                           />
//                         </div>
//                       </div>
//                       <div className="col-lg-6 col-md-6">
//                         <div className="mb-3">
//                           <label htmlFor="phoneNumber" className="form-label">
//                             電話號碼：
//                           </label>
//                           <input
//                             type="tel"
//                             className="form-control"
//                             id="phoneNumber"
//                             name="phoneNumber"
//                             value={memberInfo?.phoneNumber || ""}
//                             onChange={handleChange}
//                           />
//                         </div>
//                       </div>
//                       <div className="col-lg-12 col-md-12">
//                         <div className="mb-3">
//                           <label htmlFor="address" className="form-label">
//                             地址：
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             id="address"
//                             name="address"
//                             value={memberInfo?.address || ""}
//                             onChange={handleChange}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <button type="submit" className="btn btn-primary btnhover">
//                       Save Setting
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };
{
  /* <div className="col-lg-12 col-md-12">
                        <div className="mb-3">
                          <label
                            htmlFor="exampleFormControlTextarea"
                            className="form-label"
                          >
                            Description:
                          </label>
                          <textarea
                            className="form-control"
                            id="exampleFormControlTextarea"
                            rows={5}
                          >
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the
                            1500s,when an unknown printer took a galley of type
                            and scrambled it to make a type specimen book. It
                            has survived not only five centuries,but also the
                            leap into electronic typesetting,remaining
                            essentially unchanged. It was popularised in the
                            1960s.
                          </textarea>
                        </div>
                      </div> */
}
// </div>
{
  /* <div className="shop-bx-title clearfix">
                      <h5 className="text-uppercase">Contact Information</h5>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="formcontrolinput5"
                            className="form-label"
                          >
                            Contact Number:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="formcontrolinput5"
                            placeholder="+1 123 456 7890"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="formcontrolinput6"
                            className="form-label"
                          >
                            Email Address:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="formcontrolinput6"
                            placeholder="info@example.com"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="formcontrolinput7"
                            className="form-label"
                          >
                            Country:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="formcontrolinput7"
                            placeholder="Country Name"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="formcontrolinput8"
                            className="form-label"
                          >
                            Postcode:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="formcontrolinput8"
                            placeholder="112233"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="formcontrolinput9"
                            className="form-label"
                          >
                            City:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="formcontrolinput9"
                            placeholder="City Name"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="mb-4">
                          <label
                            htmlFor="formcontrolinput10"
                            className="form-label"
                          >
                            Full Address:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="formcontrolinput10"
                            placeholder="New york City"
                          />
                        </div>
                      </div>
                    </div> */
}
//                     <button type="submit" className="btn btn-primary btnhover">
//                       Save Setting
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// interface ProfileProps {
//   memberInfo: MemberInfoType | null;
// }

// const Profile: React.FC<ProfileProps> = ({ memberInfo }) => {
//   return (
//     <div>
//       <h2>Profile Information</h2>
//       <p>Name: {memberInfo?.name}</p>
//       <p>Email: {memberInfo?.email}</p>
//     </div>
//   );
// };
// const Shop = () => {
//   return <div>Shop Section</div>;
// };

// const Orders = () => {
//   return <div>Orders Section</div>;
// };

// export default MemberCenter;
