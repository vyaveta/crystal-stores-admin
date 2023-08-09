"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColomn  = {
  id: string
  phone: string,
  address: string,
  isPaid: boolean,
  totalPrice: string,
  status: string,
  products: string,
  createdAt: string,
}

export const columns: ColumnDef<OrderColomn >[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Is Paid",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
