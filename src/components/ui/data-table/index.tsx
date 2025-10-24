'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useRouter } from 'next/navigation';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import type { ColumnDef } from '@tanstack/react-table';
import type { Route } from 'next';

export type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  loading?: React.ComponentType;
};

interface DataTableProps<TData, TValue, AppRoute extends string> {
  columns: ExtendedColumnDef<TData, TValue>[];
  data: TData[];
  href?: (data: TData) => Route<AppRoute>;
  isLoading?: boolean;
  loadingRowCount?: number;
  pageSize?: number;
}

export function DataTable<TData, TValue, AppRoute extends string>({
  columns,
  data,
  href,
  isLoading = false,
  loadingRowCount = 5,
  pageSize = 10,
}: DataTableProps<TData, TValue, AppRoute>) {
  const table = useReactTable({
    data: isLoading ? (Array(loadingRowCount).fill(null) as TData[]) : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <Card className="overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-bold"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Render loading skeleton rows
              Array.from({ length: loadingRowCount }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  {columns.map((column, columnIndex) => (
                    <TableCell
                      key={`loading-${index}-${columnIndex}`}
                      style={{ width: column.size }}
                    >
                      {column.loading ? (
                        <column.loading />
                      ) : (
                        <Skeleton className="h-4 w-full" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={
                    href
                      ? () => {
                          router.push(href(row.original));
                        }
                      : undefined
                  }
                  className={cn(href && 'cursor-pointer')}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="size-fit md:size-fit p-1"
        >
          <ChevronLeft className="size-4" />
        </Button>
        {isLoading ? (
          <Skeleton className="h-4 w-20" />
        ) : (
          <p className="text-xs text-muted-foreground">
            {`Page ${
              table.getState().pagination.pageIndex + 1
            } of ${table.getPageCount()}`}
          </p>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="size-fit md:size-fit p-1"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
