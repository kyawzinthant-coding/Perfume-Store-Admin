import { Header } from '@/components/Layout/Header';

import { ProfileDropdown } from '@/components/profile-dropdown';
import { Main } from '@/components/Layout/main';
import { BrandProvider } from './context/brand-context';

const Brand = () => {
  return (
    <BrandProvider>
      <Header>
        <div className="ml-auto flex items-center space-x-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2 ">
          <div className="flex justify-between items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Brand Lists</h1>
              <p className="text-muted-foreground">
                Here&apos;s a list of Brand
              </p>
            </div>
          </div>
        </div>
      </Main>
    </BrandProvider>
  );
};

export default Brand;
