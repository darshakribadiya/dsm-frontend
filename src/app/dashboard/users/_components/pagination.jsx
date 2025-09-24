"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function DataTablePagination({ table, totalResult }) {
    return (
        <div className="flex items-center justify-between px-4">
            <div className="text-sm text-muted-foreground">
                {totalResult} results
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <span>
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
