import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { createDiscount, updateDiscount } from '@/api/discount-query';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';

const schema = z
  .object({
    code: z.string().min(1, 'Code is required'),
    description: z.string().optional(),
    discount_type: z.enum(['percentage', 'fixed_amount']),
    value: z.coerce.number().min(0, 'Value must be positive'),
    start_date: z.date({ required_error: 'Start date required' }),
    end_date: z.date({ required_error: 'End date required' }),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: 'End date cannot be before start date',
    path: ['end_date'],
  });

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: {
    id: string;
    code: string;
    description?: string;
    discount_type: 'percentage' | 'fixed_amount';
    value: any;
    start_date: string;
    end_date: string;
  };
}

export function DiscountActionDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const isEdit = !!currentRow;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      description: '',
      discount_type: 'percentage',
      value: 0,
      start_date: new Date(),
      end_date: new Date(),
    },
  });

  const { reset, handleSubmit } = form;

  const createMutation = useMutation({
    mutationFn: createDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      toast.success('Discount created!');
      onOpenChange(false);
    },
    onError: () => toast.error('Failed to create discount'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateDiscount(id, data),
    onSuccess: () => {
      toast.success('Discount updated!');
      onOpenChange(false);
    },
    onError: () => toast.error('Failed to update discount'),
  });

  const onSubmit = (values: FormValues) => {
    const payload = {
      ...values,
      code: values.code.trim(),
      type: values.discount_type,
      value: values.value,
      start_date: format(values.start_date, 'yyyy-MM-dd'),
      end_date: format(values.end_date, 'yyyy-MM-dd'),
    };

    if (isEdit && currentRow) {
      updateMutation.mutate({ id: currentRow.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  useEffect(() => {
    if (open) {
      reset(
        currentRow
          ? {
              code: currentRow.code,
              description: currentRow.description || '',
              discount_type: currentRow.discount_type,
              value: currentRow.value,
              start_date: new Date(currentRow.start_date),
              end_date: new Date(currentRow.end_date),
            }
          : {
              code: '',
              description: '',
              discount_type: 'percentage',
              value: 0,
              start_date: new Date(),
              end_date: new Date(),
            }
      );
    }
  }, [open, currentRow, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Discount' : 'New Discount'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. SAVE30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="percentage" />
                        <label>Percentage</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="fixed_amount" />
                        <label>Fixed Amount</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          {field.value
                            ? format(field.value, 'PPP')
                            : 'Pick date'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          {field.value
                            ? format(field.value, 'PPP')
                            : 'Pick date'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{isEdit ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
