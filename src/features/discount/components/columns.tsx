// src/features/discount/components/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge'; // Adjust path as per your project
import { cn } from '@/lib/utils'; // Adjust path as per your project
import LongText from '@/components/long-text'; // Adjust path as per your project
import { DataTableColumnHeader } from '@/components/data-table-column-header'; // Adjust path as per your project
import { DiscountType } from '../data/schema'; // Adjust path as per your project

import {
  Tag,
  Percent,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
} from 'lucide-react'; // Example icons
import { DataTableRowActions } from './data-table-row-action';

export const columns: ColumnDef<DiscountType>[] = [
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
    enableHiding: false,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-muted-foreground" />
        <span className="font-semibold">{row.original.code}</span>
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-xs text-sm text-muted-foreground">
        {row.original.description || 'No description provided.'}
      </LongText>
    ),
    size: 300,
  },
  {
    accessorKey: 'discount_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.original.discount_type;
      const icon =
        type === 'percentage' ? (
          <Percent className="h-4 w-4 mr-1" />
        ) : (
          <DollarSign className="h-4 w-4 mr-1" />
        );
      const label = type === 'percentage' ? 'Percentage' : 'Fixed Amount';
      return (
        <Badge
          variant="outline"
          className={cn(
            'capitalize flex items-center',
            type === 'percentage'
              ? 'border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950 dark:text-purple-300'
              : 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300'
          )}
        >
          {icon}
          {label}
        </Badge>
      );
    },
    size: 150,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'value',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Value" />
    ),
    cell: ({ row }) => {
      const type = row.original.discount_type;
      const value = parseFloat(row.original.value);
      return (
        <span className="font-medium">
          {type === 'percentage' ? `${value}%` : `$${value.toFixed(2)}`}
        </span>
      );
    },
    size: 100,
  },
  {
    accessorKey: 'start_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          {row.original.start_date
            ? new Date(row.original.start_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'N/A'}
        </span>
      </div>
    ),
    size: 130,
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'end_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          {row.original.end_date
            ? new Date(row.original.end_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'N/A'}
        </span>
      </div>
    ),
    size: 130,
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'is_active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.original.is_active === 1;
      return (
        <Badge
          variant={isActive ? 'default' : 'secondary'}
          className={cn(
            'font-medium flex items-center gap-1',
            isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          )}
        >
          {isActive ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
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
    cell: ({ row }) => <DataTableRowActions row={row} />, // You need to implement DataTableRowActions component
    size: 80,
    enableSorting: false,
    enableHiding: false,
  },
];

export default columns;
