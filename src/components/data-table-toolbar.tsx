import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { DataTableViewOptions } from '@/components/data-table-view-options';
import { Search, Filter } from 'lucide-react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  title?: string;
  onAdd?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onRefresh?: () => void;
  onBulkDelete?: (selectedRows: TData[]) => void;
  searchColumn?: string;
  filterOptions?: {
    column: string;
    title: string;
    options: { label: string; value: string }[];
  }[];
}

export function DataTableToolbar<TData>({
  table,
  title = '',

  searchColumn = 'name',
  filterOptions = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleClearFilters = () => {
    table.resetColumnFilters();
    table.resetGlobalFilter();
  };

  return (
    <div>
      {/* Main toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${title.toLowerCase()}...`}
              value={
                (table.getColumn(searchColumn)?.getFilterValue() as string) ??
                ''
              }
              onChange={(event) =>
                table
                  .getColumn(searchColumn)
                  ?.setFilterValue(event.target.value)
              }
              className="h-9 w-[200px] pl-8 lg:w-[300px]"
            />
          </div>

          {/* Filter Dropdowns */}
          {filterOptions.map((filter) => (
            <Select
              key={filter.column}
              value={
                (table.getColumn(filter.column)?.getFilterValue() as string) ??
                ''
              }
              onValueChange={(value) =>
                table
                  .getColumn(filter.column)
                  ?.setFilterValue(value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="h-9 w-[130px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder={filter.title} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.title}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {/* Clear Filters */}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="h-9 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* View Options */}
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
