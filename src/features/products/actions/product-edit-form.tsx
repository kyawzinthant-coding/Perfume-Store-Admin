// ProductEditForm.tsx - Now much cleaner!
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchCategoryAndBrandQuery } from '@/api/product-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { ProductCreateType } from '../data/schema';
import { BasicInformationSection } from '@/components/product-form/BasicINformationSection';
import { useFormSubmission, useProductForm } from '@/hooks/use-product-form';
import { ProductDetailsSection } from '@/components/product-form/ProductDetailsSection';
import { FragranceNotesSection } from '@/components/product-form/FragranceNoteSection';
import { ImageUploadComponent } from '@/components/product-form/ImageUploadComponent';

interface ProductEditFormProps {
  product: ProductCreateType & { id: string; image_url?: string };
}
export default function ProductEditForm({ product }: ProductEditFormProps) {
  const { data: categoryAndBrandData } = useSuspenseQuery(
    fetchCategoryAndBrandQuery()
  );
  const navigate = useNavigate();

  const { form, initialComparableFormValues, updateMutation } = useProductForm({
    product,
    onSuccess: () => navigate('/product'),
  });

  const { handleSubmit } = useFormSubmission({
    productId: product.id,
    initialFormValues: initialComparableFormValues,
    updateMutation,
  });

  return (
    <div className="max-w-8xl mx-auto p-6">
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BasicInformationSection
                  control={form.control}
                  categoryAndBrandData={categoryAndBrandData}
                />
                <ProductDetailsSection control={form.control} />
              </div>

              <FragranceNotesSection control={form.control} />
              <ImageUploadComponent control={form.control} />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/product')}
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
