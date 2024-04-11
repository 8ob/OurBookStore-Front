import _ from '../../../../../src/@lodash';
import { PartialDeep } from 'type-fest';
import { DiscountCoupon } from '../../DiscountApi';

/**
 * The Discount model.
 */
const CouponModel = (data: PartialDeep<DiscountCoupon>) =>
	_.defaults(data || {}, {
		id: _.uniqueId('coupon-'),
		name: '',
		handle: '',
		description: '',
		categories: [],
		tags: [],
		featuredImageId: '',
		images: [],
		priceTaxExcl: 0,
		priceTaxIncl: 0,
		taxRate: 0,
		comparedPrice: 0,
		quantity: 0,
		sku: '',
		width: '',
		height: '',
		depth: '',
		weight: '',
		extraShippingFee: 0,
		price: '',
		active: true,
		image: '',
		total: ''
	});

export default CouponModel;
