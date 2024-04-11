import { useEffect } from 'react';
import { useGetApiProductsId } from '../../API';
import noImage from '../../assets/images/noImage.jpg';
import './Picture.css';
const ProductPictrue: React.FC<{ productId: number }> = ({ productId }) => {
  const productResponse = useGetApiProductsId(productId);

  return (
    <div className='product-detail-box'>
      <div className='img-block2'>
        <img
          src={
            productResponse.data?.data?.imageUrl &&
            productResponse.data?.data?.imageUrl[0]
              ? productResponse.data?.data?.imageUrl[0]
              : noImage
          }
          alt='book'
          // style={{
          //   // height: '120px',
          //   objectFit: 'cover',
          //   backgroundColor: '#FFFFFf'
          //   // backgroundSize: 'contain'
          // }}
        />
      </div>
    </div>
  );
};

export default ProductPictrue;
