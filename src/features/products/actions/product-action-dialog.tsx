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
import { ProductFormValues, productSchema } from '../data/schema';
import { createProduct, fetchCategoryAndBrandQuery } from '@/api/product-query';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useNavigate } from 'react-router';

const genderOptions = [
  { value: 'unisex', label: 'Unisex' },
  { value: 'masculine', label: 'Masculine' },
  { value: 'feminine', label: 'Feminine' },
];

export default function ProductCreateForm() {
  const { data } = useSuspenseQuery(fetchCategoryAndBrandQuery());
  const navigate = useNavigate();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      brand_id: '',
      category_id: '',
      size_ml: undefined,
      price: undefined,
      stock_quantity: undefined,
      top_notes: '',
      middle_notes: '',
      base_notes: '',
      gender_affinity: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      form.reset();
      toast('Product created successfully!', {
        description: `${data.name} has been added to your inventory.`,
      });
      navigate('/product');
    },

    onError: (error) => {
      toast.error('Failed to create Product');
      console.error('Create error:', error);
    },
  });

  function onSubmit(values: ProductFormValues) {
    console.log(values);
    createMutation.mutate(values);
  }

  return (
    <div className="max-w-8xl mx-auto p-6">
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>

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

                  <FormField
                    control={form.control}
                    name="brand_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a brand" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {data.brands.map(
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

                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {data.categories.map(
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
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number.parseInt(e.target.value)
                                  : undefined
                              )
                            }
                            value={field.value !== undefined ? field.value : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender_affinity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender Affinity</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Product'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
