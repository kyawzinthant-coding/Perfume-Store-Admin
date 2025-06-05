// hooks/useProductForm.ts
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateProduct } from '@/api/product-query';
import { queryClient } from '@/lib/queryClient';

const genderOptions = [
  { value: 'unisex', label: 'Unisex' },
  { value: 'masculine', label: 'Masculine' },
  { value: 'feminine', label: 'Feminine' },
];

interface UseProductFormProps {
  product: ProductCreateType & { id: string; image_url?: string };
  onSuccess?: () => void;
}

export function useProductForm({ product, onSuccess }: UseProductFormProps) {
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
        product_image: p.image_url || '',
      };
    },
    [getGenderAffinityValue]
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: calculateFormValues(product),
  });

  // Store the initial form values for comparison
  const [initialComparableFormValues, setInitialComparableFormValues] =
    useState(() => calculateFormValues(product));

  // Effect to update form's defaultValues and comparison state if 'product' prop changes
  useEffect(() => {
    const newInitialValues = calculateFormValues(product);
    form.reset(newInitialValues);
    setInitialComparableFormValues(newInitialValues);
  }, [product, calculateFormValues, form]);

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (updatedProductData) => {
      toast.success('Product updated successfully!', {
        description: `${updatedProductData.data.name} has been edited in your inventory.`,
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', product.id] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update Product');
      console.error('Update error:', error);
    },
  });

  return {
    form,
    initialComparableFormValues,
    updateMutation,
  };
}

// hooks/useFormSubmission.ts
import {
  ProductCreateType,
  ProductFormValues,
  productSchema,
} from '@/features/products/data/schema';

interface UseFormSubmissionProps {
  productId: string;
  initialFormValues: ProductFormValues;
  updateMutation: any;
}

export function useFormSubmission({
  productId,
  initialFormValues,
  updateMutation,
}: UseFormSubmissionProps) {
  const detectChanges = (currentFormValues: ProductFormValues) => {
    const changedValues: { id: string; [key: string]: any } = { id: productId };
    let hasChanges = false;

    (Object.keys(currentFormValues) as Array<keyof ProductFormValues>).forEach(
      (key) => {
        const currentValue = currentFormValues[key];
        const initialValue = initialFormValues[key];
        let fieldIsDifferent = false;

        if (key === 'product_image') {
          fieldIsDifferent =
            currentValue instanceof File || currentValue !== initialValue;
        } else if (['price', 'size_ml', 'stock_quantity'].includes(key)) {
          const currentNumeric = normalizeNumeric(currentValue);
          const initialNumeric = normalizeNumeric(initialValue);
          fieldIsDifferent = currentNumeric !== initialNumeric;
        } else {
          const currentNormalized = normalizeString(currentValue);
          const initialNormalized = normalizeString(initialValue);
          fieldIsDifferent = currentNormalized !== initialNormalized;
        }

        if (fieldIsDifferent) {
          if (['price', 'size_ml', 'stock_quantity'].includes(key)) {
            changedValues[key] = normalizeNumeric(currentValue);
          } else {
            changedValues[key] = currentValue;
          }
          hasChanges = true;
        }
      }
    );

    return { changedValues, hasChanges };
  };

  const prepareSubmissionPayload = (changedValues: Record<string, any>) => {
    if (changedValues.product_image instanceof File) {
      const formData = new FormData();
      Object.keys(changedValues).forEach((key) => {
        const value = changedValues[key];
        if (value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });
      return formData;
    } else {
      // Remove undefined values for JSON submission
      const cleanedPayload = { ...changedValues };
      Object.keys(cleanedPayload).forEach((key) => {
        if (cleanedPayload[key] === undefined) {
          delete cleanedPayload[key];
        }
      });
      return cleanedPayload;
    }
  };

  const handleSubmit = (currentFormValues: ProductFormValues) => {
    const { changedValues, hasChanges } = detectChanges(currentFormValues);

    if (!hasChanges) {
      toast.info('No changes detected.', {
        description: "You haven't made any changes to the product details.",
      });
      return;
    }

    const submissionPayload = prepareSubmissionPayload(changedValues);
    console.log('Submitting changed product data:', changedValues);

    updateMutation.mutate({ id: productId, product: submissionPayload });
  };

  return { handleSubmit };
}

// Helper functions
function normalizeNumeric(value: any): number | undefined {
  return value === '' || value === null || isNaN(Number(value))
    ? undefined
    : Number(value);
}

function normalizeString(value: any): string {
  return value === undefined || value === null ? '' : value;
}
