import { useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/image-upload';
import {
  ProductCreateType,
  ProductFormValues,
  productSchema,
} from '../data/schema'; // Adjust path as needed
import { fetchCategoryAndBrandQuery, updateProduct } from '@/api/product-query'; // Adjust path as needed
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient'; // Adjust path as needed
import { useNavigate } from 'react-router';

const genderOptions = [
  { value: 'unisex', label: 'Unisex' },
  { value: 'masculine', label: 'Masculine' },
  { value: 'feminine', label: 'Feminine' },
];

interface ProductEditFormProps {
  product: ProductCreateType & { id: string; image_url?: string };
}

export default function ProductEditForm({ product }: ProductEditFormProps) {
  const { data: categoryAndBrandData } = useSuspenseQuery(
    fetchCategoryAndBrandQuery()
  );
  const navigate = useNavigate();

  // Helper to get gender affinity value from name (label)
  const getGenderAffinityValue = useCallback((name?: string) => {
    if (!name) return '';
    const option = genderOptions.find(
      (opt) => opt.label.toLowerCase() === name.toLowerCase()
    );
    return option ? option.value : '';
  }, []);

  // Function to calculate form values based on product data
  const calculateFormValues = useCallback(
    (p: typeof product): ProductFormValues => {
      return {
        name: p.name || '',
        description: p.description || '',
        brand_id: p.brand_id || '',
        category_id: p.category_id || '',
        size_ml: p.size_ml,
        price: p.price ?? undefined,
        stock_quantity: p.stock_quantity ?? undefined,
        top_notes: p.top_notes || '',
        middle_notes: p.middle_notes || '',
        base_notes: p.base_notes || '',
        gender_affinity: getGenderAffinityValue(p.gender_affinity),
        product_image: p.image_url || '', // Initial value for product_image field is the URL
      };
    },
    [getGenderAffinityValue]
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: calculateFormValues(product),
  });

  // Store the initial form values (derived from product prop) for comparison.
  const [initialComparableFormValues, setInitialComparableFormValues] =
    useState(() => calculateFormValues(product));

  // Effect to update form's defaultValues and our comparison state if 'product' prop changes
  useEffect(() => {
    const newInitialValues = calculateFormValues(product);
    form.reset(newInitialValues); // Reset react-hook-form state
    setInitialComparableFormValues(newInitialValues); // Update our stored initial state
  }, [product, calculateFormValues, form]);

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (updatedProductData) => {
      toast('Product updated successfully!', {
        description: `${updatedProductData.name} has been edited in your inventory.`,
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', product.id] });
      // Optionally navigate or further reset form
      navigate('/product');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update Product');
      console.error('Update error:', error);
    },
  });

  function onSubmit(currentFormValues: ProductFormValues) {
    const changedValues: { id: string; [key: string]: any } = {
      id: product.id,
    };
    let hasChanges = false;

    (Object.keys(currentFormValues) as Array<keyof ProductFormValues>).forEach(
      (key) => {
        const currentValue = currentFormValues[key];
        const initialValue = initialComparableFormValues[key];
        let fieldIsDifferent = false;

        if (key === 'product_image') {
          if (currentValue instanceof File) {
            fieldIsDifferent = true;
          } else if (currentValue !== initialValue) {
            fieldIsDifferent = true;
          }
        } else if (
          key === 'price' ||
          key === 'size_ml' ||
          key === 'stock_quantity'
        ) {
          const currentNumeric =
            currentValue === '' ||
            currentValue === null ||
            isNaN(Number(currentValue))
              ? undefined
              : Number(currentValue);
          const initialNumeric =
            initialValue === '' ||
            initialValue === null ||
            isNaN(Number(initialValue))
              ? undefined
              : Number(initialValue);
          if (currentNumeric !== initialNumeric) {
            fieldIsDifferent = true;
          }
        } else {
          const currentNormalizedString =
            currentValue === undefined || currentValue === null
              ? ''
              : currentValue;
          const initialNormalizedString =
            initialValue === undefined || initialValue === null
              ? ''
              : initialValue;
          if (currentNormalizedString !== initialNormalizedString) {
            fieldIsDifferent = true;
          }
        }

        if (fieldIsDifferent) {
          if (
            key === 'price' ||
            key === 'size_ml' ||
            key === 'stock_quantity'
          ) {
            changedValues[key] =
              currentValue === '' ||
              currentValue === null ||
              isNaN(Number(currentValue))
                ? undefined // Will be omitted from FormData if strictly !== undefined
                : Number(currentValue);
          } else {
            changedValues[key] = currentValue;
          }
          hasChanges = true;
        }
      }
    );

    if (!hasChanges) {
      toast.info('No changes detected.', {
        description: "You haven't made any changes to the product details.",
      });
      return;
    }

    console.log('Submitting *only changed* product data:', changedValues);

    let submissionPayload: any = changedValues;

    // If an image file is part of the changed data, construct FormData
    if (changedValues.product_image instanceof File) {
      const formData = new FormData();
      console.log('Image is a File, using FormData for submission.');

      Object.keys(changedValues).forEach((key) => {
        const value = changedValues[key];

        // FormData doesn't handle 'undefined' well, so skip appending if value is undefined.
        // Backend should interpret missing optional fields accordingly.
        if (value !== undefined) {
          formData.append(key, value as string | Blob); // value can be string, number, boolean, File, Blob. Non-string/Blobs are converted to string.
        }
      });
      submissionPayload = formData;
    } else {
      console.log(
        'No new image file, submitting as JSON object (if product_image was string or not changed).'
      );
      Object.keys(submissionPayload).forEach((key) => {
        if (submissionPayload[key] === undefined) {
          delete submissionPayload[key]; // Or handle as per backend expectation for JSON
        }
      });
    }
    console.log(product.id, submissionPayload);
    updateMutation.mutate({ id: product.id, product: submissionPayload });
  }

  return (
    <div className="max-w-8xl mx-auto p-6">
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter product description"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Brand */}
                  <FormField
                    control={form.control}
                    name="brand_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a brand" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryAndBrandData.brands.map(
                              (brand: { id: string; name: string }) => (
                                <SelectItem key={brand.id} value={brand.id}>
                                  {brand.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryAndBrandData.categories.map(
                              (category: { id: string; name: string }) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Size (ml) */}
                    <FormField
                      control={form.control}
                      name="size_ml"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Size (ml)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="50"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number.parseInt(e.target.value)
                                    : undefined
                                )
                              }
                              value={
                                field.value !== undefined ? field.value : ''
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Price ($) */}
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              step="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number.parseInt(e.target.value)
                                    : undefined
                                )
                              }
                              value={
                                field.value !== undefined ? field.value : ''
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Stock Quantity */}
                  <FormField
                    control={form.control}
                    name="stock_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            step="1"
                            {...field}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(
                                val === '' ? undefined : parseInt(val, 10)
                              );
                            }}
                            value={
                              field.value !== undefined && !isNaN(field.value)
                                ? field.value
                                : ''
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Gender Affinity */}
                  <FormField
                    control={form.control}
                    name="gender_affinity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender Affinity</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender affinity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {genderOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Fragrance Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fragrance Notes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Top Notes */}
                  <FormField
                    control={form.control}
                    name="top_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Top Notes</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Bergamot, Lemon"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: First impression scents
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Middle Notes */}
                  <FormField
                    control={form.control}
                    name="middle_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Notes</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Rose, Jasmine" {...field} />
                        </FormControl>
                        <FormDescription>
                          Optional: Heart of the fragrance
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Base Notes */}
                  <FormField
                    control={form.control}
                    name="base_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Notes</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Sandalwood, Musk"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: Long-lasting foundation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Product Image</h3>
                <FormField
                  control={form.control}
                  name="product_image"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                      <FormLabel className="col-span-2 text-right">
                        Image
                      </FormLabel>
                      <FormControl>
                        <ImageUpload
                          className="col-span-4"
                          value={field.value as string | undefined} // ImageUpload expects string URL or undefined for display
                          onChange={field.onChange} // onChange will provide File or new URL string
                        />
                      </FormControl>
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/product')} // Adjust navigation as needed
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
