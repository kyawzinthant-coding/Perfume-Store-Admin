import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import LongText from '@/components/long-text';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { CategoryType } from '../data/schema';
import { DataTableRowActions } from './data-table-row-action';
import { Boxes, Hash, Calendar } from 'lucide-react';

export const columns: ColumnDef<CategoryType>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 rounded-lg border-2 border-muted">
          <AvatarImage
            src={row.original.image_url || '/public/vite.svg'}
            alt={row.original.name}
            className="object-cover"
          />
          <AvatarFallback className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-lg">
            <Boxes className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 min-w-0">
          <LongText className="font-semibold text-base leading-tight max-w-48">
            {row.original.name}
          </LongText>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Hash className="h-3 w-3" />
            <span>ID: {row.original.id}</span>
          </div>
        </div>
      </div>
    ),
    size: 300,
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-16 z-10'
      ),
    },
  },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isActive = true;
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
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          {row.original.created_at
            ? new Date(row.original.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'Unknown'}
        </span>
      </div>
    ),
    size: 130,
    sortingFn: 'datetime',
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
