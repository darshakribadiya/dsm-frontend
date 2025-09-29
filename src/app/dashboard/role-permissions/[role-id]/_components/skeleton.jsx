"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export default function RolePermissionsSkeleton() {


    return (
        <>
            {Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-8 w-16" />
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}