import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

//API
import {
  getGetApiCartsDetailsQueryKey,
  useGetApiCartsDetails,
  useGetApiProductsId,
  usePostApiCartsDetails,
} from "../../API";

//css
import "./index.css";
import { Link } from "react-router-dom";
//images
import noImage from "../../assets/images/noImage.jpg";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import { useCartState } from "../../state";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "../../Context/SnackbarContext";

export interface ProductItemProps {
  productId: number;
  cardWidth?: string;
  cardHheight?: string;
}

const ProductItem: React.FC<ProductItemProps> = ({
  productId,
  cardWidth = "350px",
  cardHheight = "400px",
}) => {
  //GET API
  const productResponse = useGetApiProductsId(productId);
  const product = productResponse.data?.data;
  //Context
  const { showSnackbar } = useSnackbar();
  const { cartCount, setCartCount } = useCartState((state) => state);
  //API
  const cartDetailResponse = useGetApiCartsDetails({ Id: 2 }); //TODO: 會員ID
  const cartDetailData = cartDetailResponse.data?.data;
  const { mutate: addCart } = usePostApiCartsDetails();
  const queryClient = useQueryClient();
  const handleClickAddCart = (
    e: React.MouseEvent<HTMLAnchorElement>,
    addProductId: number
  ) => {
    e.preventDefault();
    if (addProductId === undefined) {
      showSnackbar("找不到商品。", "error");

      return;
    } else if (cartDetailData === undefined) setCartCount(1);
    else if (
      cartDetailData.find((item) => item.productId === addProductId) ===
      undefined
    )
      setCartCount(1);
    else if (
      cartDetailData.find((item) => item.productId === addProductId)
        ?.quantity >= 10
    ) {
      showSnackbar("此商品超過購買數量限制。", "error");
      return;
    }

    addCart(
      { params: { memberId: 2, productId: addProductId } }, //TODO: 會員ID
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetApiCartsDetailsQueryKey({ Id: 2 }), //TODO: 會員ID
          });
          showSnackbar("成功加入購物車。", "success");
        },
        onError: () => {
          showSnackbar("加入購物車失敗。", "error");
        },
      }
    );
  };

  return (
    <div
      className="book-card mb-24"
      style={{ width: cardWidth, height: cardHheight }}
    >
      <Link
        to={`/ProductDetail/${productId}`}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <img
          src={product?.imageUrl![0] ?? noImage}
          alt=""
          style={{
            height: "200px",
            objectFit: "contain",
            backgroundColor: "#FFFFFF",
          }}
        />
      </Link>
      <div className="">
        <ul className="unstyled hover-buttons">
          <li>
            <a onClick={(e) => handleClickAddCart(e, productId as number)}>
              <FontAwesomeIcon icon={faShoppingCart} />
            </a>
          </li>
        </ul>
      </div>
      <div className="book-content">
        <h5 className="mt-24 bookName">
          <Link to={`/ProductDetail/${productId}`}>{product?.productName}</Link>
        </h5>

        <h6 className="dark-gray">作者: {product?.author}</h6>
        <div className="books-price">
          <h5>
            {product?.realPrice
              ? `${Math.round(product?.realPrice as number)} 元`
              : `${Math.round(product?.price as number)} 元`}
          </h5>
          <h6 className="old-price">
            {product?.realPrice
              ? `${Math.round(product?.price as number)} 元`
              : ""}
          </h6>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
