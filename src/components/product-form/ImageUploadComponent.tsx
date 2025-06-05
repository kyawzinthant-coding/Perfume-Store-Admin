import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import { Control } from 'react-hook-form';
import { ProductFormValues } from '@/features/products/data/schema';
import { ImageUpload } from '../image-upload';

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
