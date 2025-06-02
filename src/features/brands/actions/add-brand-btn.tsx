import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useBrand } from '../context/brand-context';

export function AddBrand() {
  const { setOpen } = useBrand();
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
