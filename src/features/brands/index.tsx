import { Header } from '@/components/Layout/Header';

import { ProfileDropdown } from '@/components/profile-dropdown';
import { Main } from '@/components/Layout/main';
import { BrandProvider } from './context/brand-context';
import { useSuspenseQuery } from '@tanstack/react-query';

import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { BrandDialogs } from './actions/brand-dialog';
import { AddBrand } from './actions/add-brand-btn';
import { fetchBrandsListQuery } from '@/api/brand-query';

const Brand = () => {
  const { data } = useSuspenseQuery(fetchBrandsListQuery());

  return (
    <BrandProvider>
      <Header>
        <div className="ml-auto flex items-center space-x-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2  ">
          <div className="flex justify-between items-center space-x-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Brand Lists</h1>
              <p className="text-muted-foreground">
                Here&apos;s a list of Brand
              </p>
            </div>
            <AddBrand />
          </div>
        </div>

        <div>
          <DataTable data={data.data} columns={columns} />
        </div>
      </Main>
      <BrandDialogs />
    </BrandProvider>
  );
};

export default Brand;
