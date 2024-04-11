import { create } from "zustand";
import { UsedBookCartsDto } from "./API";
import { ProductsPagingDto, GetApiProductsParams } from "./API";

export interface paymentAmountstate {
    count: number;
    setCount: (by: number) => void;
}
export const usepaymentAmountStore = create<paymentAmountstate>()((set) => ({
    count: 0,
    setCount: (by) => set((state) => ({ count: by })),
}));

//二手書購物車資料
export interface usedBookCartState {
    orderFee: number;
    orderTotal: number;
    orderItem: UsedBookCartsDto[];
    setOrderFee: (by: number) => void;
    setOrderTotal: (by: number) => void;
    setOrderItem: (by: UsedBookCartsDto[]) => void;
}
export const usedUsedBookCartStore = create<usedBookCartState>()((set) => ({
    orderFee: 0,
    orderTotal: 0,
    orderItem: [],
    setOrderFee: (by) => set((state) => ({ orderFee: by })),
    setOrderTotal: (by) => set((state) => ({ orderTotal: by })),
    setOrderItem: (by) => set((state) => ({ orderItem: by })),
}));

//二手書收件人資料
export interface buyerInformationState {
  BuyerName: string;
  BuyerPhone: string;
  BuyerAddress: string;
  BuyerEmail: string;
  remark: string;
  setBuyerName: (by: string) => void;
  setBuyerPhone: (by: string) => void;
  setBuyerAddress: (by: string) => void;
  setBuyerEmail: (by: string) => void;
  setRemark: (by: string) => void;
}
export const usedBuyerInformationStore = create<buyerInformationState>()((set) => ({
  BuyerName: '',
  BuyerPhone: '',
  BuyerAddress: '',
  BuyerEmail: '',
  remark: '',
  setBuyerName: (by) => set((state) => ({ BuyerName: by })),
  setBuyerPhone: (by) => set((state) => ({ BuyerPhone: by })),
  setBuyerAddress: (by) => set((state) => ({ BuyerAddress: by })),
  setBuyerEmail: (by) => set((state) => ({ BuyerEmail: by })),
  setRemark: (by) => set((state) => ({ remark: by }))
}));

//

export interface searchDataState {
    searchData: ProductsPagingDto;
    setSearchData: (newData: ProductsPagingDto) => void;
}

export interface submitDataState {
    submitData: GetApiProductsParams;
    setSubmitData: (newData: GetApiProductsParams) => void;
}

//資料搜尋結果
export const useDataState = create<searchDataState>()((set) => ({
    searchData: 0,
    setSearchData: (newData) => set({ searchData: newData }),
}));

//資料篩選條件
const initialFormState: GetApiProductsParams = {
    Keyword: undefined,
    BookSearch: 10,
    PhysicalBook: "on",
    EBook: "on",
    PriceRangeStart: 0,
    PriceRangeEnd: 10000,
    ProductDetailsCategoryId: 0,
    Page: 1,
    pageSize: 9,
};

export const useSubmitDataState = create<submitDataState>()((set) => ({
    submitData: initialFormState,
    setSubmitData: (newData) => set({ submitData: newData }),
}));

export interface cartCountState {
    cartCount: number;
    setCartCount: (newCount: number) => void;
}

export const useCartState = create<cartCountState>()((set) => ({
    cartCount: 0,
    setCartCount: (newCount) =>
        set((state) => ({ cartCount: state.cartCount + newCount })),
}));
