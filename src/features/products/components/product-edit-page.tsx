import { Header } from '@/components/Layout/Header';
import { ProfileDropdown } from '@/components/profile-dropdown';

import { Main } from '@/components/Layout/main';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useLoaderData } from 'react-router';
import { OneProductQuery } from '@/api/product-query';
import ProductEditForm from '../actions/ProductEditForm';

const ProductEditPage = () => {
  const { productId } = useLoaderData();

  const { data } = useSuspenseQuery(OneProductQuery(productId));

  return (
    <>
      <Header>
        <div className="ml-auto flex items-center space-x-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2 ">
          <ProductEditForm product={data.data} />
        </div>
      </Main>
    </>
  );
};

export default ProductEditPage;
