import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/lib/queryClient';
import { ConfirmDialog } from '@/components/comfirm-dialog';

import { deleteCategory } from '@/api/category-query';
import { DiscountType } from '../data/schema';
import { disableDiscount } from '@/api/discount-query';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: DiscountType;
}

export function DiscountDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: disableDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      toast.success('Discount deleted successfully');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error('Failed to delete discount');
      console.error('Delete error:', error);
    },
  });

  const handleDelete = async (discountId: string) => {
    try {
      setIsSubmitting(true);

      if (value.trim() !== currentRow.code) return;

      await deleteMutation.mutateAsync(discountId);
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
      disabled={value.trim() !== currentRow.code}
      title={
        <span className="text-destructive">
          <IconAlertTriangle
            className="mr-1 inline-block stroke-destructive"
            size={18}
          />{' '}
          Delete Discount
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{' '}
            <span className="font-bold">{currentRow.code}</span>?
            <br />
            This action will permanently remove the series from the system. This
            cannot be undone.
          </p>

          <Label className="my-2">
            Discount Code:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter the discount code to confirm deletion."
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
