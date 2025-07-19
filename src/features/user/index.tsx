import { Header } from '@/components/Layout/Header';

import { ProfileDropdown } from '@/components/profile-dropdown';
import { Main } from '@/components/Layout/main';

import { columns } from './components/columns';
import { useSuspenseQuery } from '@tanstack/react-query';

import { DataTable } from './components/data-table';
import { UserProvider } from './context/user-context';
import { fetchUserQuery } from '@/api/query';

const UserList = () => {
  const { data } = useSuspenseQuery(fetchUserQuery());

  return (
    <UserProvider>
      <Header>
        <div className="ml-auto flex items-center space-x-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2 space-y-4 ">
          <div className="flex justify-between items-center space-x-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">User Lists</h1>
              <p className="text-muted-foreground">
                Here&apos;s a list of users
              </p>
            </div>
            {/* <AddCategory /> */}
          </div>

          <div>
            <DataTable data={data.data} columns={columns} />
          </div>
        </div>
      </Main>
    </UserProvider>
  );
};

export default UserList;
