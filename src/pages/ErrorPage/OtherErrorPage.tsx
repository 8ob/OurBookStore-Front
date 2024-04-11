import { Link, useRouteError, useNavigate } from "react-router-dom";
const OtherErrorPage: React.FC = () => {
    const error = useRouteError();
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
                        data-text="錯誤"
                        style={{ userSelect: "none" }}
                    >
                        錯誤
                    </div>
                    <h2 className="error-head" style={{ userSelect: "none" }}>
                        很抱歉，發生意料之外的錯誤。
                    </h2>
                    <p>{error.statusText || error.message}</p>
                    <Link
                        to="/"
                        className="btn btn-primary btn-border btnhover white-border me-4"
                    >
                        回到
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

export default OtherErrorPage;
