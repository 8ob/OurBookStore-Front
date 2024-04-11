import { create } from "zustand";
import { CartDetail } from "../API";

export interface CartState {
    cart: CartDetail[];
    total: number;
    calculateTotal: () => void;
    setCart: (newCart: CartDetail[]) => void
}

export const useCartStore = create<CartState>((set) => ({
    cart: [],
    total: 0,


    calculateTotal: () =>
        set((state) => ({
            total: state.cart.reduce((acc, item) => acc + (item.unitPrice || 0)  * (item.quantity || 0), 0),
        })),
    setCart: (newCart) => set((state) => ({
        ...state,
        cart: newCart
    }))

}));
