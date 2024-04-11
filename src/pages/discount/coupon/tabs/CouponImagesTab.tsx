import { orange } from '@mui/material/colors';
import { lighten, styled } from '@mui/material/styles';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import { Controller, useFormContext } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { DiscountCoupon } from '../../DiscountApi';

const Root = styled('div')(({ theme }) => ({
	'& .couponImageFeaturedStar': {
		position: 'absolute',
		top: 0,
		right: 0,
		color: orange[400],
		opacity: 0
	},

	'& .couponImageUpload': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},

	'& .couponImageItem': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& .couponImageFeaturedStar': {
				opacity: 0.8
			}
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& .couponImageFeaturedStar': {
				opacity: 1
			},
			'&:hover .couponImageFeaturedStar': {
				opacity: 1
			}
		}
	}
}));

/**
 * The coupon images tab.
 */
function CouponImagesTab() {
	const methods = useFormContext();
	const { control, watch } = methods;

	const images = watch('images') as DiscountCoupon['images'];

	return (
		<Root>
			<div className="flex justify-center sm:justify-start flex-wrap -mx-16">
				<Controller
					name="images"
					control={control}
					render={({ field: { onChange, value } }) => (
						<Box
							sx={{
								backgroundColor: (theme) =>
									theme.palette.mode === 'light'
										? lighten(theme.palette.background.default, 0.4)
										: lighten(theme.palette.background.default, 0.02)
							}}
							component="label"
							htmlFor="button-file"
							className="couponImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
						>
							<input
								accept="image/*"
								className="hidden"
								id="button-file"
								type="file"
								onChange={async (e) => {
									function readFileAsync() {
										return new Promise((resolve, reject) => {
											const file = e?.target?.files?.[0];

											if (!file) {
												return;
											}

											const reader = new FileReader();

											reader.onload = () => {
												resolve({
													id: FuseUtils.generateGUID(),
													url: `data:${file.type};base64,${btoa(reader.result as string)}`,
													type: 'image'
												});
											};

											reader.onerror = reject;

											reader.readAsBinaryString(file);
										});
									}

									const newImage = await readFileAsync();

									onChange([newImage, ...(value as DiscountCoupon['images'])]);
								}}
							/>
							<FuseSvgIcon
								size={32}
								color="action"
							>
								heroicons-outline:upload
							</FuseSvgIcon>
						</Box>
					)}
				/>
				<Controller
					name="featuredImageId"
					control={control}
					defaultValue=""
					render={({ field: { onChange, value } }) => {
						return (
							<>
								{images.map((media) => (
									<div
										onClick={() => onChange(media.id)}
										onKeyDown={() => onChange(media.id)}
										role="button"
										tabIndex={0}
										className={clsx(
											'couponImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg',
											media.id === value && 'featured'
										)}
										key={media.id}
									>
										<FuseSvgIcon className="couponImageFeaturedStar">
											heroicons-solid:star
										</FuseSvgIcon>
										<img
											className="max-w-none w-auto h-full"
											src={media.url}
											alt="coupon"
										/>
									</div>
								))}
							</>
						);
					}}
				/>
			</div>
		</Root>
	);
}

export default CouponImagesTab;
