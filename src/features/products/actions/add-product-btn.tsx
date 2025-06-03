import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useProduct } from '../context/product-context';
import { Link } from 'react-router';

export function AddProduct() {
  const { setOpen } = useProduct();
  return (
    <div className="flex gap-2">
      <Link to={`/product/create`}>
        <Button
          className="space-x-1 cursor-pointer"
          onClick={() => setOpen('add')}
        >
          <span>Add New</span> <IconPlus size={18} />
        </Button>
      </Link>
    </div>
  );
}
