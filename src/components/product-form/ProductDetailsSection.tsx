import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { ProductFormValues } from '@/features/products/data/schema';

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
