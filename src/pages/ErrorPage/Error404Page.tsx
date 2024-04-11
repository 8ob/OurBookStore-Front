import { Link, useNavigate } from "react-router-dom";
const Error404Page = () => {
    const navigate = useNavigate();
    return (
        <div className="page-wraper">
            <div
                className="error-page overlay-secondary-dark"
                style={{
                    backgroundImage: "url('../../assets/picture/bg3.jpg')",
                }}
            >
                <div className="error-inner text-center">
                    <div
                        className="dz_error"
                        data-text="404"
                        style={{ userSelect: "none" }}
                    >
                        404
                    </div>
                    <h2 className="error-head" style={{ userSelect: "none" }}>
                        很抱歉，無法找到此頁面。
                    </h2>

                    <Link
                        to="/"
                        className="btn btn-primary btn-border btnhover white-border me-4"
                    >
                        回到首頁
                    </Link>
                    <button
                        className="btn btn-primary btn-border btnhover white-border"
                        onClick={() => {
                            navigate(-1);
                        }}
                    >
                        回到上一頁
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Error404Page;
