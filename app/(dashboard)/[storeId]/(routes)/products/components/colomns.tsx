"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColomn  = {
  id: string
  name: string
  price: string
  size: string
  category: string
  description: string
  color: string
  isFeatured: boolean
  isArchived: boolean
  stokes: string
  createdAt: string
}

export const columns: ColumnDef<ProductColomn >[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "stokes",
    header: "Stokes",
  },
  {
    accessorKey: "createdAt",
    header: "date",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2" >
        {row?.original.color}
        <div className="h-6 w-6 rounded-full border"
        style={{backgroundColor: row?.original.color}}
        >

        </div>
      </div>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
