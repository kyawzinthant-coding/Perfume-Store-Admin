import { ColumnDef } from '@tanstack/react-table';

import { cn } from '@/lib/utils';

import LongText from '@/components/long-text';
import { DataTableColumnHeader } from '@/components/data-table-column-header';

import { DataTableRowActions } from './data-table-row-action';
import { Brandtype } from '../data/schema';

export const columns: ColumnDef<Brandtype>[] = [
  {
    accessorKey: 'id',
    header: 'NO',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'image',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => (
      <img
        src={
          row.original.image_url ? row.original.image_url : '/public/vite.svg'
        }
        loading="lazy"
        alt={row.original.name}
        className="rounded-lg border ring-1 object-cover w-15 h-15"
        width={50}
        height={50}
      />
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-6 md:table-cell'
      ),
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <LongText className="max-w-36">{row.original.name}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-6 md:table-cell'
      ),
    },
  },

  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
