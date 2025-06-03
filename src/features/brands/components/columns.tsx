import { ColumnDef } from '@tanstack/react-table';

import LongText from '@/components/long-text';
import { DataTableColumnHeader } from '@/components/data-table-column-header';

import { DataTableRowActions } from './data-table-row-action';
import { Brandtype } from '../data/schema';

export const columns: ColumnDef<Brandtype>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand" />
    ),
    cell: ({ row }) => <div className="w-[5px] pl-4">{`${row.index + 1}`}</div>,
    enableSorting: false,
    enableHiding: false,
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
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <LongText className="max-w-36">{row.original.name}</LongText>
    ),
  },

  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
