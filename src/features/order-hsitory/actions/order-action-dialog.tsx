// src/features/order/components/order-status-action-dialog.tsx
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/lib/queryClient';
import {
  Loader2,
  AlertCircle,
  Save,
  RefreshCcw,
  Clock,
  Loader,
  Truck,
  CheckCircle,
  XCircle,
} from 'lucide-react';

import { OrderType, OrderStatus, OrderSchema } from '../data/schema';
import { updateOrder } from '@/api/order-query';

import { z } from 'zod';

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'Pending':
      return <Clock className="h-4 w-4" />;
    case 'Processing':
      return <Loader className="h-4 w-4 animate-spin" />;
    case 'Shipped':
      return <Truck className="h-4 w-4" />;
    case 'Delivered':
      return <CheckCircle className="h-4 w-4" />;
    case 'Cancelled':
      return <XCircle className="h-4 w-4" />;
    case 'Refunded':
      return <RefreshCcw className="h-4 w-4" />;
    default:
      return null;
  }
};

const formSchema = z.object({
  status: OrderSchema.shape.status,
});

type OrderStatusForm = z.infer<typeof formSchema>;

interface Props {
  currentRow: OrderType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderStatusActionDialog({
  currentRow,
  open,
  onOpenChange,
}: Props) {
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<OrderStatusForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: currentRow.status,
    },
    mode: 'onChange',
  });

  const {
    formState: { errors, isDirty },
    reset,
    handleSubmit,
    trigger,
  } = form;

  const formHasClientErrors = Object.keys(errors).length > 0;

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: OrderStatus } }) =>
      updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success(
        `Order #${currentRow.order_number} status updated successfully! ✨`
      );
      setApiError(null);
      onOpenChange(false);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to update order status.';
      setApiError(message);
      toast.error(message);
      console.error('Update order status error:', error);
    },
  });

  const isLoading = updateMutation.isPending;

  const handleClose = useCallback(() => {
    if (isDirty && !isLoading) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close?'
      );
      if (!confirmClose) return;
    }
    reset({ status: currentRow.status });
    setApiError(null);
    onOpenChange(false);
  }, [isDirty, isLoading, reset, onOpenChange, currentRow.status]);

  const onSubmit = async (values: OrderStatusForm) => {
    setApiError(null);
    if (isLoading) return;

    const isValid = await trigger();
    if (!isValid) {
      toast.error('Please select a valid status.');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: currentRow.id,
        data: { status: values.status },
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (open) {
      reset({ status: currentRow.status });
      setApiError(null);
    } else {
      reset();
      setApiError(null);
    }
  }, [open, currentRow, reset]);

  const allOrderStatuses: OrderStatus[] = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Refunded',
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="text-left space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <RefreshCcw className="h-5 w-5" />
              Update Order Status
            </DialogTitle>
            {isDirty && (
              <Badge variant="outline" className="text-xs text-amber-600">
                Unsaved changes
              </Badge>
            )}
          </div>
          <DialogDescription className="text-sm">
            Change the status for Order{' '}
            <span className="font-semibold">#{currentRow.order_number}</span> by{' '}
            <span className="font-semibold">
              {currentRow.shipping_customer_name}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {(formHasClientErrors || !!apiError) && (
          <Alert variant="destructive" className="mx-1">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {apiError || 'Please select a valid status to update.'}
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className="flex-1 -mr-4 w-full py-2 pr-4">
          <Form {...form}>
            <form
              id="order-status-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 p-1"
            >
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select New Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value: OrderStatus) => {
                          field.onChange(value);
                          trigger('status');
                        }}
                        value={field.value}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          {allOrderStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(status)}
                                {status}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="order-status-form"
            disabled={isLoading || formHasClientErrors || !isDirty}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Status
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
