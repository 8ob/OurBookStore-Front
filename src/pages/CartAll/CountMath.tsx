import { create } from "zustand";
import { CartItemType } from "../App";
import { CartDetailsDto, BookProductDto } from "../../API";

export interface CartState {
  cart: CartDetailsDto[];
  realPrice: BookProductDto[];

  total: number;
  calculateTotal: () => void;
  setCart: (newCart: CartDetailsDto[]) => void;
  setRealPrice: (newRealPrice: BookProductDto[]) => void;
}

function calculateTotal(cart: CartDetailsDto[], products: BookProductDto[]) {
  let total = 0;
  if (cart && products) {
    for (let i = 0; i < cart.length; i++) {
      const product = products[i];
      // 如果有實際價格就使用實際價格，否則使用原價
      const price = Math.ceil(product?.realPrice) || product?.price;
      total += price * cart[i].quantity; // 商品數量乘以單價
    }
  }
  return total;
}
//calculateTotal(state.cart, state.realPrice)
export const useCartStore = create<CartState>((set) => ({
  cart: [],
  realPrice: [],
  total: 0,

  calculateTotal: () =>
    set((state) => ({
      total: calculateTotal(state.cart, state.realPrice),
    })),

  setCart: (newCart) =>
    set((state) => ({
      ...state,
      cart: newCart,
    })),

  setRealPrice: (newRealPrice) =>
    set((state) => ({
      ...state,
      realPrice: newRealPrice,
    })),
}));
