import { apiService as api } from './store/apiService.ts';
import { PartialDeep } from 'type-fest';
import CouponModel from './coupon/models/CouponModel';

export const addTagTypes = ['discount_coupons', 'discount_coupon'] as const;

const DiscountApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getDiscountCoupons: build.query<GetDiscountCouponsApiResponse, GetDiscountCouponsApiArg>({
				query: () => ({ url: `/mock-api/discount/coupons` }),
				providesTags: ['discount_coupons']
			}),
			deleteDiscountCoupons: build.mutation<DeleteDiscountCouponsApiResponse, DeleteDiscountCouponsApiArg>({
				query: (couponIds) => ({
					url: `/mock-api/discount/coupons`,
					method: 'DELETE',
					data: couponIds
				}),
				invalidatesTags: ['discount_coupons']
			}),
			getDiscountCoupon: build.query<GetDiscountCouponApiResponse, GetDiscountCouponApiArg>({
				query: (couponId) => ({
					url: `/mock-api/discount/coupons/${couponId}`
				}),
				providesTags: ['discount_coupon', 'discount_coupons']
			}),
			createDiscountCoupon: build.mutation<CreateDiscountCouponApiResponse, CreateDiscountCouponApiArg>({
				query: (newCoupon) => ({
					url: `/mock-api/discount/coupons`,
					method: 'POST',
					data: CouponModel(newCoupon)
				}),
				invalidatesTags: ['discount_coupons', 'discount_coupon']
			}),
			updateDiscountCoupon: build.mutation<UpdateDiscountCouponApiResponse, UpdateDiscountCouponApiArg>({
				query: (coupon) => ({
					url: `/mock-api/discount/coupons/${coupon.id}`,
					method: 'PUT',
					data: coupon
				}),
				invalidatesTags: ['discount_coupon', 'discount_coupons']
			}),
			deleteDiscountCoupon: build.mutation<DeleteDiscountCouponApiResponse, DeleteDiscountCouponApiArg>({
				query: (couponId) => ({
					url: `/mock-api/discount/coupons/${couponId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['discount_coupon', 'discount_coupons']
			})
		}),
		overrideExisting: false
	});

export default DiscountApi;

export type GetDiscountCouponsApiResponse = /** status 200 OK */ DiscountCoupon[];
export type GetDiscountCouponsApiArg = void;

export type DeleteDiscountCouponsApiResponse = unknown;
export type DeleteDiscountCouponsApiArg = string[]; /** Coupon ids */

export type GetDiscountCouponApiResponse = /** status 200 OK */ DiscountCoupon;
export type GetDiscountCouponApiArg = string;

export type CreateDiscountCouponApiResponse = /** status 200 OK */ DiscountCoupon;
export type CreateDiscountCouponApiArg = PartialDeep<DiscountCoupon>;

export type UpdateDiscountCouponApiResponse = unknown;
export type UpdateDiscountCouponApiArg = DiscountCoupon; // Coupon

export type DeleteDiscountCouponApiResponse = unknown;
export type DeleteDiscountCouponApiArg = string; // Coupon id

export type DiscountCouponImageType = {
	id: string;
	url: string;
	type: string;
};

export type DiscountCoupon = {
	id: string;
	name: string;
	handle: string;
	description: string;
	categories: string[];
	tags: string[];
	featuredImageId: string;
	images: DiscountCouponImageType[];
	priceTaxExcl: number;
	priceTaxIncl: number;
	taxRate: number;
	comparedPrice: number;
	quantity: number;
	sku: string;
	width: string;
	height: string;
	depth: string;
	weight: string;
	extraShippingFee: number;
	active: boolean;
};

export type DiscountOrder = {
	id: string;
	reference: string;
	subtotal: string;
	tax: string;
	discount: string;
	total: string;
	date: string;
	customer: {
		id: string;
		firstName: string;
		lastName: string;
		avatar: string;
		company: string;
		jobTitle: string;
		email: string;
		phone: string;
		invoiceAddress: {
			address: string;
			lat: number;
			lng: number;
		};
		shippingAddress: {
			address: string;
			lat: number;
			lng: number;
		};
	};
	coupons: Partial<DiscountCoupon & { image: string; price: string }>[];
	status: {
		id: string;
		name: string;
		color: string;
		date?: string;
	}[];
	payment: {
		transactionId: string;
		amount: string;
		method: string;
		date: string;
	};
	shippingDetails: {
		tracking: string;
		carrier: string;
		weight: string;
		fee: string;
		date: string;
	}[];
};

export const {
	useGetDiscountCouponsQuery,
	useDeleteDiscountCouponsMutation,
	useGetDiscountCouponQuery,
	useUpdateDiscountCouponMutation,
	useDeleteDiscountCouponMutation,
	useCreateDiscountCouponMutation
} = DiscountApi;

export type DiscountApiType = {
	[DiscountApi.reducerPath]: ReturnType<typeof DiscountApi.reducer>;
};
