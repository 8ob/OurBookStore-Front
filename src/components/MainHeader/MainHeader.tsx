import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import userImage from "../../assets/images/profile1.jpg";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface MemberInfoType {
    id?: number;
    name?: string;
    email?: string;
}

const MainHeader: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [memberInfo, setMemberInfo] = useState<MemberInfoType | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            fetchMemberInfo();
        }
    }, []);

    const fetchMemberInfo = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                "https://localhost:7236/api/MemberLogin/member-info",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("無法獲取會員信息");
            }

            const data = await response.json();
            setMemberInfo(data);
        } catch (error) {
            console.error(error);
        }
    };

    // 注销操作
    const handleLogout = () => {
        localStorage.removeItem("token");
        setMemberInfo(null);
        setIsLoggedIn(false);
        navigate("/member-login");
    };

    // 导航操作
    const handleNavigation = (path: string) => {
        if (!isLoggedIn && path === "/MemberCenter") {
            alert("您還沒有登入，請先登入！");
            navigate("/member-login");
        } else {
            navigate(path);
        }
    };
    return (
        <>
            {!isLoggedIn && (
                <>
                    <Dropdown.Item
                        href="/Register"
                        style={{
                            marginRight: "10px",
                            marginLeft: "10px",
                            borderRadius: "5px",
                            textAlign: "center",
                            padding: "5px 5px",
                        }}
                    >
                        註冊
                    </Dropdown.Item>
                    <Dropdown.Item
                        href="/member-login"
                        style={{
                            marginRight: "15px",
                            borderRadius: "5px",
                            textAlign: "center",
                            padding: "5px 10px",
                        }}
                    >
                        <FontAwesomeIcon icon={faRightToBracket} />
                        &nbsp; 登入
                    </Dropdown.Item>
                </>
            )}
            <Dropdown
                as="li"
                className="nav-item dropdown profile-dropdown ms-4"
            >
                <Dropdown.Toggle
                    as="a"
                    className="nav-link"
                    id="dropdown-profile"
                >
                    <img src={userImage} alt="Profile" />
                    <div className="profile-info">
                        <h6 className="title">{memberInfo?.name || "訪客"}</h6>
                        <span>{memberInfo?.email || ""}</span>
                    </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-end">
                    <Dropdown.Header>
                        <h6 className="title">{memberInfo?.name || "訪客"}</h6>
                        <span>{memberInfo?.email || ""}</span>
                    </Dropdown.Header>
                    {isLoggedIn && (
                        <>
                            <Dropdown.Item
                                onClick={() =>
                                    handleNavigation("/MemberCenter")
                                }
                            >
                                會員中心
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => handleNavigation("/order")}
                            >
                                我的訂單
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout}>
                                登出
                            </Dropdown.Item>
                        </>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

export default MainHeader;
