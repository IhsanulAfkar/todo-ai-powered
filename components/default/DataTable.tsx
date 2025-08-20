'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dispatch, SetStateAction } from 'react';

import { DataPagination } from './DataPagination';
import LoadingIndicator from './LoadingIndicator';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page?: number;
  lastPage?: number;
  setPage?: Dispatch<SetStateAction<number>>;
  total?: number;
  limit?: number;
  setLimit?: Dispatch<SetStateAction<number>>;
  isLoading?: boolean;
  fixed?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  limit = 10,
  page = 1,
  lastPage = 1,
  setLimit,
  setPage,
  total,
  isLoading = false,
  fixed = false,
}: DataTableProps<TData, TValue>) {
  if (!total) total = data.length;
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const fromEntry = total === 0 ? 0 : (page - 1) * limit + 1;
  const toEntry = Math.min(page * limit, total);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table className={fixed ? 'table-fixed' : 'table-auto'}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="p-4 px-6">
                      <div>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!isLoading ? (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="p-4 px-6">
                          <div>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 p-4 px-6 text-center"
                    >
                      <p>No results.</p>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 p-4 px-6 text-center"
                >
                  <LoadingIndicator />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between max-md:flex-col max-md:space-y-4 md:flex-row md:space-y-0">
        {setLimit && limit && (
          <div className="flex items-center justify-center space-x-2">
            <Select
              value={limit.toString()}
              onValueChange={(val) => setLimit(Number(val))}
            >
              <SelectTrigger>
                <SelectValue className="!text-2xl" />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100, 200, 500].map((val) => (
                  <SelectItem key={val} value={val.toString()}>
                    {val}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <p>
              Showing {fromEntry} to {toEntry} of {total} entries
            </p>
          </div>
        )}

        {/* Pagination */}
        {setPage && (
          <DataPagination page={page} setPage={setPage} lastPage={lastPage} />
        )}
      </div>
    </div>
  );
}
interface RenderProps {
  label: string;
  columnId: string;
  sort: {
    sortBy: string;
    setSortBy: Dispatch<SetStateAction<string>>;
  };
  order: {
    sortOrder: 'asc' | 'desc';
    setSortOrder: Dispatch<SetStateAction<'asc' | 'desc'>>;
  };
}
export const SortableHeader = ({
  columnId,
  label,
  order: { setSortOrder, sortOrder },
  sort: { setSortBy, sortBy },
}: RenderProps) => {
  const isActive = sortBy === columnId;
  const isAsc = sortOrder === 'asc';
  const handleSort = (columnId: string) => {
    try {
      if (sortBy === columnId) {
        if (sortOrder == 'desc') {
          setSortBy('');
          setSortOrder('asc');
          return;
        }
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(columnId);
        setSortOrder('asc');
      }
    } catch (err) {
      console.error('Sort error:', err);
    }
  };
  return (
    <div
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded p-2 transition-colors select-none',
        isActive ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100',
      )}
      onClick={() => handleSort(columnId)}
    >
      <span>{label}</span>
      {isActive ? (
        isAsc ? (
          <ArrowUp size={16} className="" />
        ) : (
          <ArrowDown size={16} className="" />
        )
      ) : (
        <ArrowUpDown size={16} className="text-gray-400" />
      )}
    </div>
  );
};
