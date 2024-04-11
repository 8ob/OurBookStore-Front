//components
import ProductItem from '../../components/ProductItem';
import SearchTable from '../../components/SearchTable';

//mui
import { Pagination } from '@mui/material';
//state
import {
  useDataState,
  searchDataState,
  useSubmitDataState,
  submitDataState
} from '../../state.tsx';

const ProductSearchPage = () => {
  const { searchData } = useDataState<searchDataState>((state) => state);
  const { submitData, setSubmitData } = useSubmitDataState<submitDataState>(
    (state) => state
  );

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setSubmitData({ ...submitData, Page: value });
  };

  return (
    <div className='page-content'>
      <section>
        <div className='container'>
          <div className='row'>
            <div className='col-xl-3'>
              <SearchTable />
            </div>
            <div className='col-xl-9'>
              <div className='row'>
                {searchData ? (
                  searchData.productsReslut!.map((product) => {
                    return (
                      <div
                        key={product.id}
                        className='col-lg-4 col-md-6 col-sm-6'
                      >
                        <ProductItem
                          productId={product.productId as number}
                          cardWidth='250px'
                          cardHheight='380px'
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className='d-flex justify-content-center mt-5 mb-5'>
                    No Data
                  </div>
                )}
              </div>
              <div className='d-flex justify-content-center'>
                <Pagination
                  count={searchData?.totalPages}
                  onChange={handlePaginationChange}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ProductSearchPage;
