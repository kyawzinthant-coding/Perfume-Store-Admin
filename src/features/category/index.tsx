import { Header } from '@/components/Layout/Header';
import { CategoryProvider } from './context/category-context';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Main } from '@/components/Layout/main';

const Categories = () => {
  return (
    <CategoryProvider>
      <Header>
        <div className="ml-auto flex items-center space-x-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2 ">
          <div className="flex justify-between items-center space-x-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Category Lists
              </h1>
              <p className="text-muted-foreground">
                Here&apos;s a list of Categories
              </p>
            </div>
          </div>
        </div>
      </Main>
    </CategoryProvider>
  );
};

export default Categories;
