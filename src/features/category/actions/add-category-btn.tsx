import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useCategory } from '../context/category-context';

export function AddCategory() {
  const { setOpen } = useCategory();
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
