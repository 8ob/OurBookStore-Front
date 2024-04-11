import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const CouponApp = lazy(() => import('./DiscountApp'));
const Coupon = lazy(() => import('./coupon/Coupon'));
const Coupons = lazy(() => import('./coupons/Coupons'));

/**
 * The Discountapp configuration.
 */
const couponAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/discount',
			element: <CouponApp />,
			children: [
				{
					path: '',
					element: <Navigate to="coupons" />
				},
				{
					path: 'coupons',
					element: <Coupons />
				},
				{
					path: 'coupons/:couponId/*',
					element: <Coupon />
				}
			]
		}
	]
};

export default couponAppConfig;
