import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/lib/queryClient';
import { ConfirmDialog } from '@/components/comfirm-dialog';
import { CategoryType } from '../data/schema';
import { deleteCategory } from '@/api/category-query';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: CategoryType;
}

export function CategoryDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error('Failed to delete Category');
      console.error('Delete error:', error);
    },
  });

  const handleDelete = async (categoryId: string) => {
    try {
      setIsSubmitting(true);

      if (value.trim() !== currentRow.name) return;

      await deleteMutation.mutateAsync(categoryId);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      className="cursor-pointer"
      onOpenChange={onOpenChange}
      handleConfirm={() => handleDelete(currentRow.id)}
      disabled={value.trim() !== currentRow.name}
      title={
        <span className="text-destructive">
          <IconAlertTriangle
            className="mr-1 inline-block stroke-destructive"
            size={18}
          />{' '}
          Delete Category
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{' '}
            <span className="font-bold">{currentRow.name}</span>?
            <br />
            This action will permanently remove the series from the system. This
            cannot be undone.
          </p>

          <Label className="my-2">
            Series Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter Series name to confirm deletion."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be carefull, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isSubmitting ? 'Deleting...' : 'Delete'}
      isLoading={isSubmitting}
      destructive
    />
  );
}
