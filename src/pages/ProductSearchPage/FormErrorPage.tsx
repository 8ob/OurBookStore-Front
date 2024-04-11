import { useRouteError } from "react-router-dom";

interface ErrorType {
    statusText?: string;
    message?: string;
}

const FormErrorPage: React.FC = () => {
    // 使用 useRouteError 取得路由錯誤資訊
    const error = useRouteError() as ErrorType;
    console.error(error);

    return (
        <div id="error-page" >
            {/* 把 error 資料顯示在你的 jsx 上 */}
            <h1> 糟糕! </h1>
            <p> 搜尋時候發生錯誤</p>
            <p>
                <i>{error.statusText || error.message} </i>
            </p>
        </div>
    )

};

export default FormErrorPage;