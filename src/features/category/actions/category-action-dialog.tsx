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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { queryClient } from '@/lib/queryClient';
import { useEffect, useState, useCallback } from 'react';
import {
  Loader2,
  AlertCircle,
  Save,
  X,
  Upload,
  Trash2,
  Tag,
} from 'lucide-react';

import { ImageUpload } from '@/components/image-upload';
import { CategoryType } from '../data/schema';
import { createCategory, updateCategory } from '@/api/category-query';

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Category name is required' })
    .min(2, { message: 'Category name must be at least 2 characters' })
    .max(50, { message: 'Category name must be less than 50 characters' })
    .regex(/^[a-zA-Z0-9\s-_&]+$/, {
      message:
        'Category name can only contain letters, numbers, spaces, hyphens, underscores, and &',
    }),
  category_image: z.any().refine((val) => !!val, {
    message: 'Category image is required',
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
  const [hasChanges, setHasChanges] = useState(false);
  const [originalValues, setOriginalValues] =
    useState<Partial<CategoryForm> | null>(null);

  const form = useForm<CategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category_image: '',
      isEdit: false,
    },
    mode: 'onChange', // Enable real-time validation
  });

  // Watch form changes to detect modifications
  const watchedValues = form.watch();

  useEffect(() => {
    if (originalValues) {
      const changed =
        watchedValues.name !== originalValues.name ||
        watchedValues.category_image !== originalValues.category_image;
      setHasChanges(changed);
    }
  }, [watchedValues, originalValues]);

  // Enhanced create mutation with better error handling
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully! 🎉');
      handleClose();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to create category';
      toast.error(message);
      console.error('Create error:', error);
    },
  });

  // Enhanced update mutation with fixed query key
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // Fixed: was 'providers'
      toast.success('Category updated successfully! ✨');
      handleClose();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to update category';
      toast.error(message);
      console.error('Update error:', error);
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  const handleClose = useCallback(() => {
    if (hasChanges && !isLoading) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close?'
      );
      if (!confirmClose) return;
    }

    form.reset();
    setHasChanges(false);
    setOriginalValues(null);
    onOpenChange(false);
  }, [hasChanges, isLoading, form, onOpenChange]);

  const onSubmit = async (values: CategoryForm) => {
    if (isLoading) return;

    try {
      const categoryData = {
        name: values.name.trim(),
        category_image: values.category_image,
      };

      if (isEdit && currentRow) {
        await updateMutation.mutateAsync({
          id: currentRow.id,
          data: categoryData,
        });
      } else {
        await createMutation.mutateAsync(categoryData);
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  // Reset form when dialog opens/closes or data changes
  useEffect(() => {
    if (open) {
      const defaultValues =
        isEdit && currentRow
          ? {
              name: currentRow.name || '',
              category_image: currentRow.image_url || '',
              isEdit,
            }
          : {
              name: '',
              category_image: '',
              isEdit,
            };

      form.reset(defaultValues);
      setOriginalValues(defaultValues);
      setHasChanges(false);
    } else {
      // Clean up when dialog closes
      form.reset();
      setOriginalValues(null);
      setHasChanges(false);
    }
  }, [open, isEdit, currentRow, form]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'Escape' && !isLoading) {
        e.preventDefault();
        handleClose();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        e.key === 'Enter' &&
        !hasErrors &&
        !isLoading
      ) {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, isLoading, hasErrors, form, onSubmit, handleClose]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="text-left space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {isEdit ? (
                <>
                  <Tag className="h-4 w-4" />
                  <span>Edit Category</span>
                  <Badge variant="secondary" className="text-xs">
                    Editing
                  </Badge>
                </>
              ) : (
                <>
                  <Tag className="h-4 w-4" />
                  <span>Create New Category</span>
                  <Badge variant="default" className="text-xs">
                    New
                  </Badge>
                </>
              )}
            </DialogTitle>
            {hasChanges && (
              <Badge variant="outline" className="text-xs text-amber-600">
                Unsaved changes
              </Badge>
            )}
          </div>
          <DialogDescription className="text-sm">
            {isEdit
              ? 'Modify the category details below. Changes will be saved immediately.'
              : 'Fill in the category information to create a new entry.'}
            <span className="block text-xs text-muted-foreground mt-1">
              Press Ctrl+Enter to save quickly, or Escape to cancel.
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Error Alert */}
        {hasErrors && (
          <Alert variant="destructive" className="mx-1">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fix the errors below before saving.
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className="flex-1 -mr-4 w-full py-2 pr-4">
          <Form {...form}>
            <form
              id="category-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 p-1"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      Category Name
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter category name (e.g., Electronics, Food & Drinks)"
                          className="pr-10 [&:-webkit-autofill]:!bg-background [&:-webkit-autofill]:!text-foreground [&:-webkit-autofill]:shadow-[0_0_0_1000px_hsl(var(--background))_inset]"
                          autoComplete="new-password"
                          disabled={isLoading}
                          {...field}
                        />
                        {field.value && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-destructive/10"
                            onClick={() => field.onChange('')}
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                    {field.value && (
                      <p className="text-xs text-muted-foreground">
                        {field.value.length}/50 characters
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_image"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      Category Image
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                        />
                        {field.value && (
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Upload className="h-3 w-3" />
                              Image uploaded
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-1 text-destructive hover:text-destructive"
                              onClick={() => field.onChange('')}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
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
            form="category-form"
            disabled={isLoading || hasErrors || (!hasChanges && isEdit)}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEdit ? 'Update Category' : 'Create Category'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
