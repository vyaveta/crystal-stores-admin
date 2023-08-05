import prismadb from '@/lib/prismadb'
import React from 'react'
import CategoryForm from './components/billboard-form'

const CategoryPage = async ({
  params
}: { params: { categoryId: string, storeId: string }}) => {


  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryId
    }
  })

  console.log(category,'is the category from page.tsx')

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  )
}

export default CategoryPage