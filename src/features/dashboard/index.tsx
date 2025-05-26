import { Header } from '@/components/Layout/Header';
import { ProfileDropdown } from '@/components/profile-dropdown';

const index = () => {
  return (
    <>
      <Header>
        <div className="ml-auto flex items-center space-x-4">
          <ProfileDropdown />
        </div>
      </Header>
    </>
  );
};

export default index;
