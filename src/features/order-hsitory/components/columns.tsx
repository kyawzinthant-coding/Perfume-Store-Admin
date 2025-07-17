// src/features/order/components/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { OrderType, OrderStatus } from '../data/schema';

import {
  ReceiptText,
  User,
  Mail,
  DollarSign,
  Calendar,
  Clock,
  Loader,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Boxes,
} from 'lucide-react';
import { DataTableRowActions } from './data-table-row-action';

export const columns: ColumnDef<OrderType>[] = [
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
    accessorKey: 'order_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 font-semibold text-base">
          <ReceiptText className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.order_number}</span>
        </div>
      </div>
    ),
    size: 200,
  },
  {
    accessorKey: 'shipping_customer_name',
    id: 'customer_info', // Custom ID for combined column
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 font-semibold">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.shipping_customer_name}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Mail className="h-3 w-3" />
          <span>{row.original.shipping_customer_email}</span>
        </div>
      </div>
    ),
    size: 250,
  },

  {
    accessorKey: 'total_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.original.total_amount);
      const formattedAmount = isNaN(amount)
        ? 'N/A'
        : new Intl.NumberFormat('en-AU', {
            // Localized for Australia
            style: 'currency',
            currency: 'AUD', // Assuming AUD, change if different
          }).format(amount);

      return (
        <div className="flex items-center gap-2 font-semibold text-lg text-green-600 dark:text-green-400">
          <DollarSign className="h-5 w-5" />
          <span>{formattedAmount}</span>
        </div>
      );
    },
    size: 150,
    sortingFn: 'alphanumeric',
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Delivery" />
    ),
    cell: ({ row }) => {
      const status: OrderStatus = row.original.status;
      let badgeColorClass = '';
      let statusIcon = null;

      switch (status) {
        case 'Pending':
          badgeColorClass =
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
          statusIcon = <Clock className="h-3 w-3" />;
          break;
        case 'Processing':
          badgeColorClass =
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
          statusIcon = <Loader className="h-3 w-3 animate-spin" />;
          break;
        case 'Shipped':
          badgeColorClass =
            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
          statusIcon = <Truck className="h-3 w-3" />;
          break;
        case 'Delivered':
          badgeColorClass =
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
          statusIcon = <CheckCircle className="h-3 w-3" />;
          break;
        case 'Cancelled':
          badgeColorClass =
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
          statusIcon = <XCircle className="h-3 w-3" />;
          break;
        case 'Refunded':
          badgeColorClass =
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
          statusIcon = <RefreshCcw className="h-3 w-3" />;
          break;
        default:
          badgeColorClass =
            'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
          statusIcon = null;
      }

      return (
        <Badge
          variant="outline"
          className={cn(
            'font-medium flex items-center gap-1 capitalize',
            badgeColorClass
          )}
        >
          {statusIcon}
          {status}
        </Badge>
      );
    },
    size: 130,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Date" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          {row.original.created_at
            ? new Date(row.original.created_at).toLocaleDateString('en-AU', {
                // Localized date format
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'N/A'}
        </span>
      </div>
    ),
    size: 180,
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'total_items',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Items" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <Boxes className="h-4 w-4 text-muted-foreground" />
        <span className="font-semibold text-base">
          {row.original.total_items}{' '}
          <span className="text-sm text-muted-foreground">items</span>
        </span>
      </div>
    ),
    size: 120,
    enableSorting: true,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    size: 80,
    enableSorting: false,
    enableHiding: false,
  },
];

export default columns;
