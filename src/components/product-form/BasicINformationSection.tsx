import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
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
import { Control } from 'react-hook-form';
import { ProductFormValues } from '@/features/products/data/schema';
import { ImageUpload } from '../image-upload';

interface BasicInformationSectionProps {
  control: Control<ProductFormValues>;
  categoryAndBrandData: {
    brands: Array<{ id: string; name: string }>;
    categories: Array<{ id: string; name: string }>;
  };
}

export function BasicInformationSection({
  control,
  categoryAndBrandData,
}: BasicInformationSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>

      <FormField
        control={control}
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
        control={control}
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
        control={control}
        name="brand_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brand</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categoryAndBrandData.brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="category_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categoryAndBrandData.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// components/product-form/ProductDetailsSection.tsx
interface ProductDetailsSectionProps {
  control: Control<ProductFormValues>;
}

const genderOptions = [
  { value: 'unisex', label: 'Unisex' },
  { value: 'masculine', label: 'Masculine' },
  { value: 'feminine', label: 'Feminine' },
];

export function ProductDetailsSection({ control }: ProductDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Product Details</h3>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
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
                  value={field.value !== undefined ? field.value : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
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
                  value={field.value !== undefined ? field.value : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
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
                  field.onChange(val === '' ? undefined : parseInt(val, 10));
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

      <FormField
        control={control}
        name="gender_affinity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender Affinity</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender affinity" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {genderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
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
  );
}

// components/product-form/FragranceNotesSection.tsx
interface FragranceNotesSectionProps {
  control: Control<ProductFormValues>;
}

export function FragranceNotesSection({ control }: FragranceNotesSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Fragrance Notes</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="top_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Top Notes</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Bergamot, Lemon" {...field} />
              </FormControl>
              <FormDescription>
                Optional: First impression scents
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
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
          control={control}
          name="base_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Notes</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Sandalwood, Musk" {...field} />
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
  );
}

export const ImageUploadComponent = ({
  control,
}: {
  control: Control<ProductFormValues>;
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Product Image</h3>
      <FormField
        control={control}
        name="product_image"
        render={({ field }) => (
          <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
            <FormLabel className="col-span-2 text-right">Image</FormLabel>
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
  );
};
