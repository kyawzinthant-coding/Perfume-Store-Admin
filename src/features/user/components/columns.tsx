import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import LongText from '@/components/long-text';
import { DataTableColumnHeader } from '@/components/data-table-column-header';

import { Hash, Calendar, User, Crown } from 'lucide-react';
import { UserType } from '../data/schma';

export const columns: ColumnDef<UserType | UserType>[] = [
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
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const item = row.original as UserType & UserType;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 rounded-lg border-2 border-muted">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.name}`}
              alt={item.name}
              className="object-cover"
            />
            <AvatarFallback className="rounded-lg bg-blue-500 text-white font-bold text-lg">
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1 min-w-0">
            <LongText className="font-semibold text-base leading-tight max-w-48">
              {item.name}
            </LongText>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span>ID: {item.id}</span>
            </div>
          </div>
        </div>
      );
    },
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
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const user = row.original as UserType;
      const role = user.role;
      const isCustomer = role === 'customer';
      const isAdmin = role === 'admin';

      return (
        <Badge
          className={cn(
            'font-medium text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit',
            isCustomer &&
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            isAdmin &&
              'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            !isCustomer &&
              !isAdmin &&
              'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          )}
        >
          {isAdmin && <Crown className="h-3 w-3" />}
          {isCustomer && <User className="h-3 w-3" />}
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Badge>
      );
    },
    size: 100,
    filterFn: (row, id, value) => {
      return value.includes((row.original as UserType).role);
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
  //   {
  //     id: 'actions',
  //     header: 'Actions',
  //     cell: ({ row }) => <DataTableRowActions row={row} />,
  //     size: 80,
  //     enableSorting: false,
  //   },
];

export default columns;
