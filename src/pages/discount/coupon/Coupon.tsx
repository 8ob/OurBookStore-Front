import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CouponHeader from './CouponHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import InventoryTab from './tabs/InventoryTab';
import PricingTab from './tabs/PricingTab';
import CouponImagesTab from './tabs/CouponImagesTab';
import ShippingTab from './tabs/ShippingTab';
import { useGetDiscountCouponQuery } from '../DiscountApi';
import CouponModel from './models/CouponModel';

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('優惠券不可為空').min(5, '最少必須有五個字元')
});

/**
 * The coupon page.
 */
function Coupon() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();

	const { couponId } = routeParams;

	const {
		data: coupon,
		isLoading,
		isError
	} = useGetDiscountCouponQuery(couponId, {
		skip: !couponId || couponId === 'new'
	});

	const [tabValue, setTabValue] = useState(0);

	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: zodResolver(schema)
	});

	const { reset, watch } = methods;

	const form = watch();

	useEffect(() => {
		if (couponId === 'new') {
			reset(CouponModel({}));
		}
	}, [couponId, reset]);

	useEffect(() => {
		if (coupon) {
			reset({ ...coupon });
		}
	}, [coupon, reset]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event: SyntheticEvent, value: number) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	/**
	 * Show Message if the requested coupons is not exists
	 */
	if (isError && couponId !== 'new') {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					找不到此優惠券！
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/apps/discount/coupons"
					color="inherit"
				>
					前往優惠券頁面
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while coupon data is loading and form is setted
	 */
	if (_.isEmpty(form) || (coupon && routeParams.couponId !== coupon.id && routeParams.couponId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<CouponHeader />}
				content={
					<>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							indicatorColor="secondary"
							textColor="secondary"
							variant="scrollable"
							scrollButtons="auto"
							classes={{ root: 'w-full h-64 border-b-1' }}
						>
							<Tab
								className="h-64"
								label="Basic Info"
							/>
							<Tab
								className="h-64"
								label="Coupon Images"
							/>
							<Tab
								className="h-64"
								label="Pricing"
							/>
							<Tab
								className="h-64"
								label="Inventory"
							/>
							<Tab
								className="h-64"
								label="Shipping"
							/>
						</Tabs>
						<div className="p-16 sm:p-24 max-w-3xl">
							<div className={tabValue !== 0 ? 'hidden' : ''}>
								<BasicInfoTab />
							</div>

							<div className={tabValue !== 1 ? 'hidden' : ''}>
								<CouponImagesTab />
							</div>

							<div className={tabValue !== 2 ? 'hidden' : ''}>
								<PricingTab />
							</div>

							<div className={tabValue !== 3 ? 'hidden' : ''}>
								<InventoryTab />
							</div>

							<div className={tabValue !== 4 ? 'hidden' : ''}>
								<ShippingTab />
							</div>
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default Coupon;
