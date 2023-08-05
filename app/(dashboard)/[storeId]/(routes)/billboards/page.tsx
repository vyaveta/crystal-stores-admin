import React from 'react'
import { format } from "date-fns"
import BillboardClient from './components/billboard-client'
import prismadb from '@/lib/prismadb'
import { BillboardColomn } from './components/colomns'

const BillboardsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedBillboards: BillboardColomn[] = billboards.map(item => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt,"MMMM do, yyyy")
  }))

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <BillboardClient data={formattedBillboards} />
        </div>
    </div>
  )
}

export default BillboardsPage