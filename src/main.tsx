//react
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

import "./index.css"; // 導入樣式表

//css
import "./assets/css/bootstrap.min.css";
import "./assets/css/css2.css";
import "./assets/css/font-awesome.css";
import "./assets/css/slick.css";
import "./assets/css/slick-theme.css";
import "./assets/css/ionrangeslider.css";
import "./assets/css/app.css";
import "./assets/css/smart_wizard_all.min.css";
import "./assets/css/menu/style.css";
import "./assets/css/menu/flaticon.css";

//react-query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//type

//react-router-dom
import { RouterProvider } from "react-router-dom";

//router
import router from "./Router";
import { SnackbarProvider } from "./Context/SnackbarContext";

const queryClient = new QueryClient();

const LoadingMessage = () => {
  return (
    <div className="page-wraper">
      <div id="loading-area" className="preloader-wrapper-1">
        <div className="preloader-inner">
          <div className="preloader-shade"></div>
          <div className="preloader-wrap"></div>
          <div className="preloader-wrap wrap2"></div>
          <div className="preloader-wrap wrap3"></div>
          <div className="preloader-wrap wrap4"></div>
          <div className="preloader-wrap wrap5"></div>
        </div>
      </div>
    </div>
  );
};
export default LoadingMessage;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <Suspense fallback={<LoadingMessage />}>
          <RouterProvider router={router} />
        </Suspense>
      </SnackbarProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
