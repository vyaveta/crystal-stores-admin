"use client"

import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { OrderColomn, columns } from "./colomns"
import { DataTable } from "@/components/ui/data-table"

interface OrderClientProps {
  data: OrderColomn[]
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {

  return (
    <>
      <Heading title={`Orders (${data.length})`} description="Manage billboards for your store" />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" searchLabel="Filter by products..." />
      <Separator />
    </>
  )
}

export default OrderClient