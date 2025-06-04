import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import LongText from '@/components/long-text';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { ProductType } from '../data/schema';
import { DataTableRowActions } from './data-table-row-action';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';

const getStockStatus = (quantity: number) => {
  if (quantity === 0)
    return { status: 'out-of-stock', color: 'destructive' as const };
  if (quantity <= 10) return { status: 'low-stock', color: 'warning' as const };
  return { status: 'in-stock', color: 'success' as const };
};

const getStockIcon = (quantity: number) => {
  if (quantity === 0) return <AlertTriangle className="h-3 w-3" />;
  if (quantity <= 10) return <Package className="h-3 w-3" />;
  return <CheckCircle className="h-3 w-3" />;
};

export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No." className="w-16" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
        {row.index + 1}
      </div>
    ),
    size: 60,
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 rounded-lg">
          <AvatarImage
            src={row.original.image_url || '/public/vite.svg'}
            alt={row.original.name}
            className="object-cover"
          />
          <AvatarFallback className="rounded-lg bg-muted">
            <Package className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 min-w-0">
          <LongText className="font-medium text-sm leading-tight max-w-36">
            {row.original.name}
          </LongText>
          <div className="text-xs text-muted-foreground truncate max-w-36">
            ID: {row.original.id}
          </div>
        </div>
      </div>
    ),
    size: 250,
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-16 z-10'
      ),
    },
  },
  {
    accessorKey: 'category_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-normal">
        {row.original.category_name}
      </Badge>
    ),
    size: 120,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'brand_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
          {row.original.brand_name?.charAt(0).toUpperCase()}
        </div>
        <LongText className="max-w-32 font-medium">
          {row.original.brand_name}
        </LongText>
      </div>
    ),
    size: 140,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'stock_quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const quantity = row.original.stock_quantity;
      const stockInfo = getStockStatus(quantity);

      return (
        <div className="flex items-center gap-2">
          <Badge
            variant={
              stockInfo.color === 'destructive'
                ? 'destructive'
                : stockInfo.color === 'warning'
                  ? 'outline'
                  : 'default'
            }
            className={cn(
              'flex items-center gap-1 font-medium',
              stockInfo.color === 'warning' &&
                'border-yellow-500 text-yellow-700 dark:text-yellow-400',
              stockInfo.color === 'success' &&
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            )}
          >
            {getStockIcon(quantity)}
            {quantity}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {quantity === 0 ? 'Out' : quantity <= 10 ? 'Low' : 'Available'}
          </span>
        </div>
      );
    },
    size: 120,
    sortingFn: 'basic',
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">${row.original.price || '0.00'}</div>
    ),
    size: 100,
    sortingFn: 'basic',
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.original.is_active === 1;
      return (
        <Badge
          variant={isActive ? 'default' : 'secondary'}
          className={cn(
            'font-medium',
            isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          )}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
    size: 100,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    size: 80,
    enableSorting: false,
  },
];

export default columns;
