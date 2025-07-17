import { Header } from '@/components/Layout/Header';

import { ProfileDropdown } from '@/components/profile-dropdown';
import { Main } from '@/components/Layout/main';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { useSuspenseQuery } from '@tanstack/react-query';

import { DiscountProvider } from './context/discount-context';
import { fetchDiscountListQuery } from '@/api/discount-query';
import { AddDiscount } from './actions/add-discount-btn';
import { DiscountDialogs } from './actions/discount-dialog';

const DiscountPage = () => {
  const { data } = useSuspenseQuery(fetchDiscountListQuery());

  return (
    <DiscountProvider>
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
                Discount Code Lists
              </h1>
              <p className="text-muted-foreground">
                Here&apos;s a list of discount code
              </p>
            </div>
            <AddDiscount />
          </div>

          <div>
            <DataTable data={data.data} columns={columns} />
          </div>
        </div>
      </Main>

      <DiscountDialogs />
    </DiscountProvider>
  );
};

export default DiscountPage;
