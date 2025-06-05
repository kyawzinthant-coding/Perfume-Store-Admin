import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Control } from 'react-hook-form';
import { ProductFormValues } from '@/features/products/data/schema';

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
