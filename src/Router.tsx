import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// 舊元件
import EmployeeLoginForm from "./components/EmployeeLoginForm/EmployeeLoginForm";
import MemberLoginForm from "./components/MemberLoginForm/MemberLoginForm";
import Register from "./components/Register/Register";
import CheckVerificationCode from "./components/Register/CheckVerificationCode";
import ForgetPassword from "./components/ForgetPassword/ForgetPasswordForm";
import ResetPassword from "./components/ResetEmailForm/ResetEmailForm";
import HomePage from "./pages/UsedBooks/HomePage/HomePage";
import PublicLayout from "./layouts/PublicLayout";
// import CouponOverview from './components/CouponOverview/CouponOverview.tsx';
import ECPay from "./pages/CartAll/Ecpay.tsx";
import LinePayPage from "./pages/CartAll/confirm.tsx";
import CartPage from "./pages/CartAll/CartItem.tsx";
import OrderConfirmation from "./pages/CartAll/CheckoutForm.tsx";
import { Step1, Step2, Step3 } from "./pages/CartAll/CheckoutForm.tsx";
import MemberCenter from "./components/MemberCenter/MemberCenter.tsx";
import Datatables from "./components/Datatables/Datatables.tsx";

//componets
import App from "./App.tsx";
import Error404Page from "./pages/ErrorPage/Error404Page.tsx";
import OtherErrorPage from "./pages/ErrorPage/OtherErrorPage.tsx";

import { lazy } from "react";

import OrderPage from "./pages/OrderAll/Orderpage.tsx";
import UsedBookEdit from "./pages/UsedBooks/UsedBookEdit/UsedBookEdit.tsx";
import Test from "./Test.tsx";
import ECpayConfirm from "./pages/CartAll/EcpayConfirm.tsx";

// #region 懶加載元件匯入

const UsedBookInside = lazy(
  () => import("./pages/UsedBookInside/UsedBookInside.tsx")
);
const UsedBooksOrderConfirmation = lazy(
  () => import("./pages/UsedBooksOrderPage/UsedBooksOrderConfirmation.tsx")
);
const UsedBooksOrder = lazy(
  () => import("./pages/UsedBooksOrderPage/UsedBooksOrder.tsx")
);
const UsedBooksCart = lazy(
  () => import("./pages/UsedBooksOrderPage/UsedBooksCart")
);
const UsedBooksCheckOutForm = lazy(
  () => import("./pages/UsedBooksOrderPage/UsedBooksCheckOutForm.tsx")
);
const UsedBookAllBook = lazy(
  () => import("./pages/UsedBooks/UsedBookAllBook/UsedBookAllBook")
);
const CheckOutStep1 = lazy(() => import("./pages/lazy/CheckOutStep1Lazy.tsx"));

const CheckOutStep2 = lazy(() => import("./pages/lazy/CheckOutStep2Lazy.tsx"));

const UserBooksList = lazy(() => import("./pages/UsedBooks/UseBookList/index"));

const LinePay = lazy(() => import("./pages/UsedBooksOrderPage/confirm.tsx"));

const AddUsedBook = lazy(() => import("./pages/UsedBooks/UseBookCreate/index"));

const ProductSearchPage = lazy(
  () => import("./pages/ProductSearchPage/ProductSearchPage.tsx")
);

const PhysicalEBookHomePage = lazy(
  () => import("./pages/PhysicalEBookHomePage/PhysicalEBookHomePage.tsx")
);

const ProductDetailPage = lazy(
  () => import("./pages/ProductDetailPage/ProductDetailPage.tsx")
);
// #endregion
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} errorElement={<OtherErrorPage />}>
        <Route index element={<PhysicalEBookHomePage />} />
        <Route
          path="ProductDetail/:productId"
          element={<ProductDetailPage />}
        />
        <Route path="ProductSearch" element={<ProductSearchPage />} />
        <Route path="/MemberCenter" element={<MemberCenter />} />
        <Route path="/Coupons" element={<Datatables />} />
        <Route path="/productSearch" element={<ProductSearchPage />} />
        <Route path="/order" element={<OrderPage memberId={2} />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/list" element={<OrderConfirmation />}>
          <Route index element={<Step1 />} />
          <Route path="/list/Step2" element={<Step2 />} />
        </Route>
        <Route path="/linepay" element={<LinePayPage />} />
        <Route path="/ecpay" element={<ECpayConfirm />} />
      </Route>
      <Route path="/member-login" element={<MemberLoginForm />} />
      <Route path="/employee-login" element={<EmployeeLoginForm />} />
      <Route path="/Register" element={<Register />} />
      <Route
        path="/CheckVerificationCode"
        element={<CheckVerificationCode />}
      />
      <Route path="/ForgetPassword" element={<ForgetPassword />} />
      <Route path="/ResetPassword/:token" element={<ResetPassword />} />
      <Route path="/usedBook" element={<PublicLayout />}>
        <Route index element={<HomePage />} />

        <Route path="/usedBook/add-used-book" element={<AddUsedBook />} />
        <Route
          path="/usedBook/used-book-list"
          element={<UserBooksList userId={2} />}
        />
        <Route
          path="/usedBook/UsedBookEdit/:UsedBookId"
          element={<UsedBookEdit />}
        />
        <Route path="/usedBook/usedBookAllBook" element={<UsedBookAllBook />} />
        <Route path="/usedBook/:UsedBookId" element={<UsedBookInside />} />
        <Route
          path="/usedBook/usedBookCart"
          element={<UsedBooksCart />}
        ></Route>
        <Route path="/usedBook/checkOut" element={<UsedBooksCheckOutForm />}>
          <Route index element={<CheckOutStep1 />} />
          <Route path="/usedBook/checkOut/Step2" element={<CheckOutStep2 />} />
        </Route>
        <Route path="/usedBook/usedBookPayment/linepay" element={<LinePay />} />
        <Route
          path="/usedBook/UsedBooksOrderConfirmation"
          element={<UsedBooksOrderConfirmation />}
        ></Route>
        <Route
          path="/usedBook/usedBookOrder"
          element={<UsedBooksOrder />}
        ></Route>
      </Route>
      <Route path="/test" element={<Test />} />
      <Route path="*" element={<Error404Page />} />
    </>
  )
);

export default router;
