import GlobalStyles from '@mui/material/GlobalStyles';
import CouponsHeader from './CouponsHeader';
import CouponsTable from './CouponsTable';

/**
 * The coupons page.
 */
function Coupons() {
	return (
		<>
			<GlobalStyles
				styles={() => ({
					'#root': {
						maxHeight: '100vh'
					}
				})}
			/>
			<div className="w-full h-full container flex flex-col">
				<CouponsHeader />
				<CouponsTable />
			</div>
		</>
	);
}

export default Coupons;
