import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useDiscount } from '../context/discount-context';

export function AddDiscount() {
  const { setOpen } = useDiscount();
  return (
    <div className="flex gap-2">
      <Button
        className="space-x-1 cursor-pointer"
        onClick={() => setOpen('add')}
      >
        <span>Add New</span> <IconPlus size={18} />
      </Button>
    </div>
  );
}
