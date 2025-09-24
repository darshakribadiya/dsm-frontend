"use client"

import api from "@/lib/api"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DataTable } from "../_components/data-table"


export default function Page() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [usersList, setUsersList] = useState([])
    const [total, setTotal] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(
        Number(searchParams.get("page")) || 1
    )
    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "")
    const [loading, setLoading] = useState(true)



    async function fetchUsers(page = 1, searchQuery = "", status = "") {

        setLoading(true)
        try {
            const res = await api.get(
                `/all-users?user_type=hostel_staff&page=${page}&search=${encodeURIComponent(searchQuery)}&status=${encodeURIComponent(status)}`
            )
            setUsersList(res.data.data)
            setTotal(res.data.total)
            setPerPage(res.data.per_page)
            setCurrentPage(res.data.current_page)
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const urlPage = Number(searchParams.get("page")) || 1
        const urlSearch = searchParams.get("search") || ""

        if (urlPage !== currentPage) {
            setCurrentPage(urlPage)
        }
        if (urlSearch !== search) {
            setSearch(urlSearch)
        }
    }, [searchParams])

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchUsers(currentPage, search, statusFilter)
        }, 400)
        return () => clearTimeout(delay)
    }, [currentPage, search, statusFilter])

    const COLUMNS = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "email",
            header: () => <div>Email ID</div>,
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    {row.original?.email}
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: () => <div>Name</div>,
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    {row.original?.name}
                </div>
            ),
        },
        {
            accessorKey: "contact",
            header: () => <div>Contact</div>,
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    {row.original?.contact || <div className="italic text-gray-600">Not Available</div>}
                </div>
            ),
        },
    ]

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center">
                <div className="text-xl">Hostel Staff</div>
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    <Select
                        value={statusFilter}
                        onValueChange={(value) => {
                            setStatusFilter(value)
                            router.push(`?page=1&search=${encodeURIComponent(search)}&status=${encodeURIComponent(value)}`)
                            setCurrentPage(1)
                        }}
                    >
                        <SelectTrigger className="w-full lg:w-40">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value=" ">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => {
                            const value = e.target.value
                            setSearch(value)
                            router.push(`?page=1&search=${encodeURIComponent(value)}&status=${encodeURIComponent(statusFilter)}`)
                            setCurrentPage(1)
                        }}
                        className="w-full lg:w-md"
                    />

                    <Button
                        onClick={() => {
                            setStatusFilter(" ")
                            setSearch("")
                            router.push(`?page=1`)
                            setCurrentPage(1)
                        }}
                        variant={"outline"}
                    >
                        Clear Filter
                    </Button>
                </div>

            </div>

            <DataTable
                columns={COLUMNS}
                data={usersList}
                pageCount={Math.ceil(total / perPage)}
                totalResult={total}
                pageIndex={currentPage}
                onPaginationChange={({ pageIndex }) => {
                    const newPage = pageIndex + 1
                    setCurrentPage(newPage)
                    router.push(`?page=${newPage}&search=${encodeURIComponent(search)}`)
                }}
                loading={loading}
            />
        </div>
    )
}
