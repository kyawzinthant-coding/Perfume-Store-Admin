import { Header } from '@/components/Layout/Header';

import { ProfileDropdown } from '@/components/profile-dropdown';
import { Main } from '@/components/Layout/main';
import { DataTable } from './components/data-table';

import { useSuspenseQuery } from '@tanstack/react-query';

import columns from './components/columns';
import { fetchOrderListQuery } from '@/api/order-query';
import { OrderProvider } from './context/order-context';
import { OrderDialogs } from './actions/order-dialog';

const DiscountPage = () => {
  const { data } = useSuspenseQuery(fetchOrderListQuery());

  return (
    <OrderProvider>
      <Header>
        <div className="ml-auto flex items-center space-x-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2 space-y-4 ">
          <div className="flex justify-between items-center space-x-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Order List</h1>
              <p className="text-muted-foreground">
                Here&apos;s a list of orders
              </p>
            </div>
            {/* <AddDiscount /> */}
          </div>

          <div>
            <DataTable data={data.data} columns={columns} />
          </div>
        </div>
      </Main>

      <OrderDialogs />
    </OrderProvider>
  );
};

export default DiscountPage;
