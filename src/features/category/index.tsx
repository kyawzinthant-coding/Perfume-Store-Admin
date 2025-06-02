import { Header } from '@/components/Layout/Header';
import { CategoryProvider } from './context/category-context';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Main } from '@/components/Layout/main';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { useSuspenseQuery } from '@tanstack/react-query';

import { CategoryDialogs } from './actions/category-dialog';
import { AddCategory } from './actions/add-category-btn';
import { fetchCategoriesListQuery } from '@/api/category-query';

const Categories = () => {
  const { data } = useSuspenseQuery(fetchCategoriesListQuery());
  console.log(data.data);
  return (
    <CategoryProvider>
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
                Category Lists
              </h1>
              <p className="text-muted-foreground">
                Here&apos;s a list of Categories
              </p>
            </div>
            <AddCategory />
          </div>

          <div>
            <DataTable data={data.data} columns={columns} />
          </div>
        </div>
      </Main>

      <CategoryDialogs />
    </CategoryProvider>
  );
};

export default Categories;
