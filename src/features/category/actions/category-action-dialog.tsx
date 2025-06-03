import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { queryClient } from '@/lib/queryClient';
import { useEffect } from 'react';
import { CategoryType } from '../data/schema';

import { ImageUpload } from '@/components/image-upload';
import { createCategory, updateCategory } from '@/api/category-query';

const formSchema = z.object({
  name: z.string().min(1, { message: 'name is required.' }),
  category_image: z.any().refine((val) => !!val, {
    message: 'Image is required',
  }),
  isEdit: z.boolean(),
});

type CategoryForm = z.infer<typeof formSchema>;
interface Props {
  currentRow?: CategoryType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryActionDialog({
  currentRow,
  open,
  onOpenChange,
}: Props) {
  const isEdit = !!currentRow;
  const form = useForm<CategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          category_image: currentRow.image_url,
          isEdit,
        }
      : {
          name: '',
          category_image: '',
          isEdit,
        },
  });

  // Create provider mutation
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error('Failed to create category');
      console.error('Create error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      toast.success('Category updated successfully');
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast('Failed to update provider');
      console.error('Update error:', error);
    },
  });

  const onSubmit = async (values: CategoryForm) => {
    try {
      const categoryData = {
        name: values.name,
        category_image: values.category_image,
      };

      if (isEdit) {
        await updateMutation.mutateAsync({
          id: currentRow.id,
          data: categoryData,
        });
        toast('Provider updated successfully');
      } else {
        await createMutation.mutateAsync(categoryData);
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
    }
  };

  useEffect(() => {
    if (open) {
      form.reset(
        isEdit
          ? {
              ...currentRow,
              category_image: currentRow.image_url,
              isEdit,
            }
          : {
              name: '',
              category_image: '',
              isEdit,
            }
      );
    }
  }, [open, isEdit, currentRow, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>
            {isEdit ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the Category here. '
              : 'Create new Category here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="-mr-4 h-[15.25rem] w-full py-1 pr-4">
          <Form {...form}>
            <form
              id="category-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 p-0.5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                    <FormLabel className="col-span-2 text-right">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Category Name"
                        className="col-span-4"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_image"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                    <FormLabel className="col-span-2 text-right">
                      Image
                    </FormLabel>
                    <FormControl>
                      <ImageUpload
                        className="col-span-4"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="submit"
            form="category-form"
            className="cursor-pointer"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? 'Saving...'
              : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
