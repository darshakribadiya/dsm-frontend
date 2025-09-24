"use client"

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./pagination"
import { TableSkeleton } from "./table-skeleton"

export function DataTable({
    columns,
    data,
    pageIndex,
    onPaginationChange,
    pageCount,
    totalResult,
    handleClickRow,
    loading = false,
}) {
    const table = useReactTable({
        data,
        columns,
        pageCount,
        manualPagination: true,
        state: {
            pagination: {
                pageIndex: pageIndex - 1,
                pageSize: 10,
            },
        },
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                const newState = updater({
                    pageIndex: pageIndex - 1,
                    pageSize: 10,
                })
                onPaginationChange(newState)
            } else {
                onPaginationChange(updater)
            }
        },
        getCoreRowModel: getCoreRowModel(),
    })

    if (loading) {
        return <TableSkeleton columns={columns.length} />
    }

    return (
        <>
            <div className="px-4 py-2 relative h-full overflow-auto flex flex-col flex-grow border rounded-xl">
                <Table className="whitespace-nowrap">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() =>
                                        handleClickRow && handleClickRow(row.original)
                                    }
                                    className={cn({ "cursor-pointer": !!handleClickRow })}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                    className="text-center h-24"
                                >
                                    No data found!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {!!table.getRowModel().rows.length && (
                <DataTablePagination table={table} totalResult={totalResult} />
            )}
        </>
    )
}
