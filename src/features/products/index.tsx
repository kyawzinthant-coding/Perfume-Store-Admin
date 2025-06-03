import { Header } from '@/components/Layout/Header';

import { ProfileDropdown } from '@/components/profile-dropdown';
import { Main } from '@/components/Layout/main';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { useSuspenseQuery } from '@tanstack/react-query';

import { ProductProvider } from './context/product-context';
import { fetchProductsListQuery } from '@/api/product-query';
import { AddProduct } from './actions/add-product-btn';
import { ProductDialogs } from './actions/product-dialog';

const Products = () => {
  const { data } = useSuspenseQuery(fetchProductsListQuery());

  return (
    <ProductProvider>
      <Header>
        <div className="ml-auto flex items-center space-x-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2 space-y-4 ">
          <div className="flex justify-between items-center space-x-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Product Lists
              </h1>
              <p className="text-muted-foreground">
                Here&apos;s a list of Products
              </p>
            </div>
            <AddProduct />
          </div>

          <div>
            <DataTable data={data.data} columns={columns} />
          </div>
        </div>
      </Main>

      {/* <CategoryDialogs /> */}
      <ProductDialogs />
    </ProductProvider>
  );
};

export default Products;
