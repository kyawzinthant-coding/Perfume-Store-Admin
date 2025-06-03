import { Header } from '@/components/Layout/Header';
import { ProfileDropdown } from '@/components/profile-dropdown';

import { Main } from '@/components/Layout/main';
import ProductCreateForm from '../actions/product-action-dialog';

const NewProductCreate = () => {
  return (
    <>
      <Header>
        <div className="ml-auto flex items-center space-x-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2 ">
          <ProductCreateForm />
        </div>
      </Main>
    </>
  );
};

export default NewProductCreate;
